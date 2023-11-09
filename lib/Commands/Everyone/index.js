/* eslint-disable indent */
/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const { Sticker } = require('wa-sticker-formatter');
const language = require('../../Dialogues/index');
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Realiza funções de pós finalização */
function postResults(response) {
    /* Verifica se pode resetar a envInfo */
    if ((envInfo.settings.finish.value === true)
        || (envInfo.settings.ender.value === true
            && envInfo.results.success === false
        )
    ) {
        /* setTimeout para poder retornar */
        setTimeout(() => {
            /* Reseta a envInfo */
            envInfo.functions.revert.value();

            /* Reseta conforme o tempo */
        }, envInfo.settings.wait.value);
    }

    /* Retorna o resultado de uma função */
    return response;
}

/* Insere o erro na envInfo */
function echoError(error) {
    /* Determina o erro */
    const myError = !(error instanceof Error) ? new Error(`Received a instance of "${typeof error}" in function 'messedup', expected an instance of "Error".`) : error;

    /* Determina o sucesso */
    envInfo.results.success = false;

    /* Determina a falha */
    envInfo.parameters.code.value = myError.code ?? '0';

    /* Determina a mensagem de erro */
    envInfo.parameters.message.value = myError.message ?? 'The operation cannot be completed because an unexpected error occurred.';

    /* Define se pode printar erros */
    if (envInfo.settings.error.value === true) {
        /* Printa o erro */
        console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envInfo.results;
}

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Cria a função de comando */
async function tagEveryone(
    kill = envInfo.functions.exec.arguments.kill.value,
    env = envInfo.functions.exec.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Define os dados necessarios */
            const {
                quoteThis,
                chatId,
                quotedMsgObj,
                isOwner,
                isGroupMsg,
                body,
                prefix,
                isAllowed,
                isQuotedMsg,
                decryptedMedia,
                mimetype,
                groupMembersId,
                userFormated,
                stickerConfig,
                quotedTypeFormated,
                command,
                arks,
            } = env.value;

            /* Define o placeholder do body, caso não tenha */
            const insertContext = `By: @${userFormated}`;

            /* Define o RegExp de remover o comando da Object */
            const replaceCmd = new RegExp(`\\${prefix}${command}`, 'gi');

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define o menu de ajuda */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'Developer', true, true, envInfo) }, { quoted: quoteThis });

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });

                /* Se dono, admin, mod ou pode rodar */
            } else if (isAllowed && isGroupMsg) {
                /* Define a Object inicial */
                let baileysMessage = { forward: quoteThis, mentions: groupMembersId };

                /* Se não for quoted, faz o jeito mais simples, encaminhando */
                if (!isQuotedMsg) {
                    /* Convertendo em string, usando replace e então parse! */
                    baileysMessage.forward = Indexer('others').farpc(quoteThis, replaceCmd, '').value;

                    /* Se for menção, faz o jeito dificil */
                } else if (isQuotedMsg) {
                    /* Delete a forward por não ser usada aqui */
                    delete baileysMessage.forward;

                    /* Define os dados da mensagem por meio do seu tipo */
                    switch (quotedTypeFormated) {
                        /* Imagem */
                        case 'image':
                            baileysMessage.image = decryptedMedia;
                            baileysMessage.caption = (quotedMsgObj.caption || body || insertContext).replace(replaceCmd, '');
                            baileysMessage.mimetype = mimetype;
                        break;

                        /* audio */
                        case 'audio':
                            baileysMessage.audio = decryptedMedia;
                            baileysMessage.mimetype = mimetype;
                            baileysMessage.ptt = quotedMsgObj.ptt || true;
                        break;

                            /* contact */
                        case 'contact':
                        case 'contactsArray':
                            baileysMessage.contacts = { displayName: quotedMsgObj.displayName, contacts: quotedMsgObj.contacts };
                        break;

                            /* Documento */
                        case 'document':
                        case 'documentWithCaption':
                            baileysMessage.document = decryptedMedia;
                            baileysMessage.mimetype = mimetype;
                            baileysMessage.fileName = quotedMsgObj.fileName;
                            baileysMessage.caption = (quotedMsgObj.caption || body || insertContext).replace(replaceCmd, '');
                        break;

                            /* Stickers */
                        case 'sticker':
                            /* Constrói o sticker, se deixar em 100% nos videos pode travar o sticker */
                            baileysMessage = await new Sticker(decryptedMedia, {
                                ...stickerConfig,
                                type: 'default',
                            }).toMessage();
                            baileysMessage.mentions = groupMembersId;
                        break;

                            /* Localização */
                        case 'location':
                        case 'liveLocation':
                            baileysMessage.location = { degreesLatitude: quotedMsgObj.degreesLatitude, degreesLongitude: quotedMsgObj.degreesLongitude };
                        break;

                            /* Video */
                        case 'video':
                            baileysMessage.video = decryptedMedia;
                            baileysMessage.caption = (quotedMsgObj.caption || body || insertContext).replace(replaceCmd, '');
                            baileysMessage.mimetype = mimetype;
                        break;

                            /* Conversation, URL e outros */
                        default:
                            baileysMessage.text = quotedMsgObj.matchedText || quotedMsgObj.text || quotedMsgObj.caption || quotedMsgObj.conversation || body || insertContext;
                            baileysMessage.text = typeof quotedMsgObj === 'string' ? quotedMsgObj : baileysMessage.text;
                            baileysMessage.text = baileysMessage.text.replace(replaceCmd, '');
                        break;
                    }
                }

                /* Reencaminha a mensagem da pessoa */
                envInfo.results.value = await kill.sendMessage(chatId, baileysMessage, { quoted: quoteThis });
            }
        }

        /* Define o sucesso, se seu comando der erro isso jamais será chamado, então o success automaticamente será false em falhas */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Avisa que deu erro enviando o comando e data atual pro sistema S.E.R (Send Error Report) */
        await kill.sendMessage(env.value.chatId, {
            text: language(region, 'S.E.R', error, true, true, {
                command: 'EVERYONE',
                time: (new Date()).toLocaleString(),
            }),
        }, { quoted: env.value.quoteThis });
    }

    /* Retorna os resultados */
    return postResults(envInfo.results);
}

/* Função que reseta tudo */
function resetAmbient(
    changeKey = {},
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define o valor padrão */
    let exporting = {
        reset: resetAmbient,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Define a envInfo padrão */
        envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

        /* Define se algum valor deve ser salvo */
        if (Object.keys(changeKey).length !== 0) {
            /* Faz a listagem de keys */
            Object.keys(changeKey).forEach((key) => {
                /* Edita se a key existir */
                if (Object.keys(envInfo).includes(key) && key !== 'developer') {
                    /* Edita a key customizada */
                    envInfo[key] = changeKey[key];
                }
            });
        }

        /* Insere a postResults na envInfo */
        envInfo.functions.poswork.value = postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = echoError;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a tagEveryone na envInfo */
        envInfo.functions.exec.value = tagEveryone;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.exec]: envInfo.functions.exec.value,
            },
            Developer: 'KillovSky',
            Projects: 'https://github.com/KillovSky',
        };

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Define o valor retornado */
        exporting = module.exports;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
