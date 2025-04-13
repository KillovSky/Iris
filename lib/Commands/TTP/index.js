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
        [envInfo.exports.exec]: { value: textStickers },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
