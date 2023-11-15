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
async function stickerMaker(
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
                args,
                canSticker,
                isOwner,
                isVideo,
                quoteThis,
                stickerConfig,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define se pode fazer o sticker (Tem Mídia) */
            if (canSticker === true || Indexer('regexp').urls(args[0]).value.isURL) {
                /* Avisa para esperar, pois vai usar request e a velocidade depende da internet */
                await kill.sendMessage(chatId, { text: language(region, 'Extras', 'Wait', true, true, {}) }, { quoted: quoteThis });

                /* Define se deve usar circle ou cortar nos stickers */
                stickerConfig.type = isVideo ? 'full' : 'default';

                /* Verifica pelos tipos */
                if (arks.includes('-circle')) {
                    stickerConfig.type = 'circle';
                } else if (arks.includes('-full')) {
                    stickerConfig.type = 'full';
                } else if (arks.includes('-crop')) {
                    stickerConfig.type = 'crop';
                } else if (arks.includes('-rounded')) {
                    stickerConfig.type = 'rounded';
                } else if (arks.includes('-default')) {
                    stickerConfig.type = 'default';
                }

                /* Importa os dados de buffer */
                const mediaData = canSticker === true ? env.value.decryptedMedia : args[0];

                /* Constrói o sticker, se deixar em 100% nos videos pode travar o sticker, diminua o 50 se ainda estiver travando o sticker */
                const sticker = new Sticker(mediaData, {
                    ...stickerConfig,
                    type: stickerConfig.type,
                    quality: config.stickerQuality.value,
                });

                /* Define como formato Baileys */
                const sendSticker = await sticker.toMessage();

                /* Faz o envio */
                await kill.sendMessage(chatId, sendSticker, { quoted: quoteThis });

                /* Se não for utilizável, e tiver usando '--help-dev' */
            } else if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'Developer', true, true, envInfo) }, { quoted: quoteThis });

                /* Se não tiver nada */
            } else {
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.sendMessage(env.value.chatId, {
            text: language(region, 'S.E.R', error, true, true, {
                command: 'Stickers',
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

        /* Insere a stickerMaker na envInfo */
        envInfo.functions.exec.value = stickerMaker;

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
