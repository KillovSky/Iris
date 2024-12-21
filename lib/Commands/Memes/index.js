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

/* Cria a função de comando, se o comando for images converte em gay */
async function imagesCreator(
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
            /* Constrói os parâmetros */
            const {
                chatId,
                arks,
                stickerConfig,
                body,
                isOwner,
                command,
                pushname,
                argl,
                reply,
                mentionedJidList,
            } = env.value;

            /* Define os comandos que não baixarão as profiles por serem só de texto */
            const ignoreCommands = [
                '1917',
                '3db',
                '3dg',
                '80s',
                'bpink',
                'clyde',
                'cmm',
                'light',
                'ohno',
                'pornhub',
                'thunder',
                'water',
                'wolfb',
                'wolfg',
            ];

            /* Constrói os dados a enviar para o memes */
            const sendingObject = {
                body,
                pushname,
                chatId,
                mentionedJidList,
                ignoreCommands,
            };

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Menu de ajuda DEV */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                /* Não inclui informações secretas */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Sistema de Images */
            } else {
                /* Avisa para esperar, pois vai usar request e a velocidade depende da internet */
                if (config.waitMessage.value) await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Wait', true, true, envInfo).value }, reply);

                /* Define as imagens de perfil */
                let profilePictures = {
                    value: ['https://thispersondoesnotexist.com'],
                };

                /* Se não for um meme de texto */
                if (!ignoreCommands.includes(command.toLowerCase())) {
                    /* Baixa as imagens corretamente */
                    profilePictures = await Indexer('profile').perfil(kill, env);
                }

                /* Define a imagem */
                const theCanvedImage = await Indexer('memes').memes(command, profilePictures.value, sendingObject);

                /* Define se vai mandar como sticker */
                if (argl.includes('-sticker') || command === 'petpet') {
                    /* Constrói o sticker */
                    const sticker = new Sticker(theCanvedImage.value, {
                        ...stickerConfig,
                        type: 'default',
                        quality: config.stickerQuality.value,
                    });

                    /* Define como formato Baileys */
                    const sendSticker = await sticker.toMessage();

                    /* Faz o envio */
                    await kill.sendMessage(chatId, sendSticker, reply);

                    /* Envia normal */
                } else {
                    /* Define o modo de envio padrão */
                    let sendMes = {
                        video: theCanvedImage.value,
                        gifPlayback: true,
                    };

                    /* Se não for o trigger */
                    if (command !== 'trigger') {
                        /* Define como imagem */
                        sendMes = {
                            image: theCanvedImage.value,
                            caption: theCanvedImage.details,
                        };
                    }

                    /* Envia ela e insere o resultado na envInfo para retornar tudo */
                    envInfo.results.value = await kill.sendMessage(chatId, sendMes, reply);
                }
            }
        }

        /*
            Define o sucesso, se seu comando der erro isso jamais será chamado
            Então o success automaticamente será false em falhas
        */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        /* Insira o name que você definiu na envInfo (name) onde pede abaixo */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'MEMES',
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

        /* Insere a imagesCreator na envInfo */
        envInfo.functions.exec.value = imagesCreator;

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
