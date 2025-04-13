/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const { Sticker } = require('wa-sticker-formatter');
const Indexer = require('../../index');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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

/**
 * Restaura o ambiente e atualiza as exportações do módulo com a funcionalidade principal
 * @param {Object} [changeKey={}] - Chaves personalizadas para atualizar o envInfo
 * @param {Object} [envFile=envInfo] - Objeto com informações do ambiente
 * @param {string} [dirname=__dirname] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    changeKey = {},
    envFile = envInfo,
    dirname = __dirname,
) => module.exports = logging.resetAmbient({
    functions: {
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.exec]: { value: imagesCreator },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
