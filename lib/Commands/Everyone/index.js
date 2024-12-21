/* eslint-disable indent */
/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const { Sticker } = require('wa-sticker-formatter');
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
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
                reply,
                chatId,
                quotedMsgObj,
                isOwner,
                isGroupMsg,
                isQuotedMsg,
                body,
                prefix,
                typeFormatted,
                functions,
                isAllowed,
                decryptedMedia,
                mimetype,
                groupMembersIdFormated,
                groupMembersId,
                userFormated,
                stickerConfig,
                quotedTypeFormated,
                command,
                user,
                arks,
            } = env.value;

            /* Tira quem está no Anti-Everyone */
            const noEveryFormatted = groupMembersIdFormated?.filter((usr) => !functions?.dnd?.values?.some((ir) => ir?.replace(/@s.whatsapp.net/gi, '') === usr)) || [userFormated];
            const noEveryone = groupMembersId?.filter((usr) => !functions?.dnd?.values?.includes(usr)) || [user];

            /* Define o placeholder do body, caso não tenha */
            const insertContext = `By: @${userFormated}`;

            /* Define o RegExp de remover o comando da Object */
            const replaceCmd = new RegExp(`\\${prefix}${command}\\s`, 'gi');

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Se não for grupo */
            if (!isGroupMsg) {
                /* Manda a mensagem só de grupos */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'OnlyGroups', true, true, envInfo).value }, reply);

                /* Define o menu de ajuda */
            } else if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                /* Não inclui informações secretas */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Se dono, admin, mod ou pode rodar */
            } else if (isAllowed && isGroupMsg) {
                /* Define a Object inicial */
                let baileysMessage = { mentions: noEveryone };

                /* Define como buscar */
                const switchTypeFt = isQuotedMsg ? quotedTypeFormated : typeFormatted;

                /* Define os dados da mensagem por meio do seu tipo */
                switch (switchTypeFt) {
                    /* Imagem */
                    case 'image':
                        baileysMessage.image = decryptedMedia;
                        baileysMessage.caption = (body || quotedMsgObj.caption || insertContext).replace(/--show/gi, `\n\n@${noEveryFormatted.join(' @')}`).replace(replaceCmd, '');
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
                        baileysMessage.caption = (body || quotedMsgObj.caption || insertContext).replace(/--show/gi, `\n\n@${noEveryFormatted.join(' @')}`).replace(replaceCmd, '');
                    break;

                        /* Stickers */
                    case 'sticker':
                        /* Constrói o sticker, se deixar em 100% nos videos pode travar o sticker */
                        baileysMessage = await new Sticker(decryptedMedia, {
                            ...stickerConfig,
                            type: 'default',
                        }).toMessage();
                    break;

                        /* Localização */
                    case 'location':
                    case 'liveLocation':
                        baileysMessage.location = { degreesLatitude: quotedMsgObj.degreesLatitude, degreesLongitude: quotedMsgObj.degreesLongitude };
                    break;

                        /* Video */
                    case 'video':
                        baileysMessage.video = decryptedMedia;
                        baileysMessage.caption = (body || quotedMsgObj.caption || insertContext).replace(/--show/gi, `\n\n@${noEveryFormatted.join(' @')}`).replace(replaceCmd, '');
                        baileysMessage.mimetype = mimetype;
                    break;

                        /* Conversation, URL e outros */
                    default:
                        baileysMessage.text = body || quotedMsgObj.matchedText || quotedMsgObj.text || quotedMsgObj.caption || quotedMsgObj.conversation || quotedMsgObj;
                        baileysMessage.text = typeof baileysMessage.text === 'object' ? insertContext : baileysMessage.text;
                        baileysMessage.text = baileysMessage.text.replace(/--show/gi, `\n\n@${noEveryFormatted.join(' @')}`).replace(replaceCmd, '');
                    break;
                }

                /* Reencaminha a mensagem da pessoa */
                envInfo.results.value = await kill.sendMessage(chatId, baileysMessage, reply);

                /* Se caso não for permitido */
            } else {
                /* Avisa que 'só adm' pode usar */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Restrict', true, true, env.value).value }, reply);
            }
        }

        /* Define o sucesso, se seu comando der erro isso jamais será chamado, então o success automaticamente será false em falhas */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);

        /* Avisa que deu erro enviando o comando e data atual pro sistema S.E.R (Send Error Report) */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'EVERYONE',
                time: (new Date()).toLocaleString(),
            }).value,
        }, env.value.reply);
    }

    /* Retorna os resultados */
    return logging.postResults(envInfo);
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
        envInfo.functions.poswork.value = logging.postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
