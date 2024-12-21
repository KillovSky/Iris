/* eslint-disable no-await-in-loop */

/* Requires */
const fs = require('fs');
const GIFEncoder = require('gifencoder');
const text2png = require('text2png');
const wordwrap = require('word-wrapper');
const canvas = require('@napi-rs/canvas');
const { Sticker } = require('wa-sticker-formatter');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
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

/* Cria a função de comando, EDITE O NOME DELA AQUI */
async function textStickers(
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
                reply,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define o sticker para enviar */
            let stickerData = false;

            /* Menu de ajuda DEV */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                /* Não inclui informações secretas */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Sistema de ATTP */
            } else if (['attp', 'ttg', 'tta', 'text2gif'].includes(command)) {
                /* Avisa para esperar, pois a velocidade depende do PC */
                if (config.waitMessage.value) await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Wait', true, true, envInfo).value }, reply);

                /* Define o uso de 10 cores (padrão, não aumente muito) */
                const colorATTP = Indexer('colors').genhex(config.stickerColors.value).value;

                /* Inicia um encoding de GIF */
                const attp = new GIFEncoder(512, 512);
                attp.start();
                attp.setRepeat(0);
                attp.setFrameRate(config.stickerFPS.value);
                attp.setQuality(1);
                attp.setTransparent();

                /* Cria um objeto canvas */
                const canvaImage = canvas.createCanvas(512, 512);
                const ctx = canvaImage.getContext('2d');

                /* Desenha as cores frame a frame */
                for (let i = 0; i < colorATTP.length; i += 1) {
                    /* Cria uma imagem de texto com cor e wrap de 20 letras (melhor valor já) */
                    const stockImage = await text2png(wordwrap(body, {
                        width: 20,
                    }), {
                        font: '50px sans-serif',
                        color: colorATTP[i],
                        textAlign: 'center',
                        lineSpacing: 10,
                        padding: 20,
                        backgroundColor: 'transparent',
                        output: 'dataURL',
                    });

                    /* Importa a imagem no objeto canvas */
                    const canvaObject = await canvas.loadImage(stockImage);

                    /* Desenha ela no context */
                    ctx.drawImage(canvaObject, 0, 0, canvaImage.width, canvaImage.height);

                    /* Importa o context no ATTP */
                    attp.addFrame(ctx);
                }

                /* Finaliza a criação */
                attp.finish();

                /* Define o Buffer do Sticker */
                stickerData = attp.out.getData();

                /* TTP */
            } else {
                /* Define o Buffer do Sticker */
                stickerData = await text2png(wordwrap(body.split('|')[0], {
                    width: 20,
                }), {
                    font: '80px sans-serif',
                    color: (body.split('|')[2] || 'white').replace(/ /gi, ''),
                    strokeWidth: 2,
                    strokeColor: (
                        body.split('|')[1] || Indexer('colors').genhex(config.stickerColors.value).value[0]
                    ).replace(/ /gi, ''),
                    textAlign: 'center',
                    lineSpacing: 10,
                    padding: 20,
                    backgroundColor: (body.split('|')[3] || 'transparent').replace(/ /gi, ''),
                });
            }

            /* Se o buffer do sticker não for false */
            if (stickerData !== false) {
                /* Constrói o sticker */
                const sticker = new Sticker(stickerData, {
                    ...stickerConfig,
                    type: 'default',
                    quality: 100,
                });

                /* Define como formato Baileys */
                stickerData = await sticker.toMessage();

                /* Faz o envio */
                envInfo.results.value = await kill.sendMessage(chatId, stickerData, reply);

                /* Se for (Impossivel chegar aqui, eu acho) */
            } else if (!arks.includes('--help-dev') && !arks.includes('--help')) {
                /* Define uma mensagem de erro */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Loggers', 'Error', true, true, envInfo).value }, reply);
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
                command: 'TTP',
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

        /* Insere a textStickers na envInfo */
        envInfo.functions.exec.value = textStickers;

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
