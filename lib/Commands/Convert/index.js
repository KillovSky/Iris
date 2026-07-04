/* eslint-disable no-nested-ternary */

/* Imports */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import ffmpegloc from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import WebP from 'node-webpmux';
import { fileURLToPath } from 'url';
import Indexer from '../../index.js';

/* Define as funções __dirname e __filename com equivalentes em ESM */
const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${thisDir}/utils.json`));
ffmpeg.setFfmpegPath(ffmpegloc.path);

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Extrai os frames todos do sticker */
async function extractFrames(inputFile, outputPath, fileName) {
    /* Try - Catch para caso de erro */
    try {
        /* Se a pasta não existir */
        if (!fs.existsSync(outputPath)) {
            /* Cria ela */
            fs.mkdirSync(outputPath);
        }

        /* Cria uma nova webp */
        const img = new WebP.Image();

        /* Carrega a imagem */
        await img.load(inputFile);

        /* Extrai */
        await img.demux({ path: outputPath, prefix: fileName });

        /* Retorna a img */
        return img;

        /* Se der erro */
    } catch (error) {
        /* Retorna o erro */
        return error;
    }
}

/* Converte um bocado de frames em MP4 */
async function makeMP4(inputFolder, fileName, frameps = 10, timeSeg = null) {
    /* Define o nome do arquivo output */
    const outputFile = path.normalize(`${thisDir}/Cache/${Indexer('string').generate(10).value}.mp4`);

    /* Retorna uma Promise, é o meio mais simples de esperar essa conversão terminar */
    return new Promise((resolve) => {
        /* Executa o ffmpeg com os argumentos */
        /* 1FPS = 1000ms */
        const videoGen = (ffmpeg()
            .input(path.normalize(`${inputFolder}/${fileName}_%d.webp`))
            .inputOptions('-framerate', frameps)
            .videoCodec('libx264')
            .outputOptions('-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2')
            .outputOptions('-movflags', '+faststart')
            .output(outputFile)
        );

        /* Se tiver tempo customizado */
        if (timeSeg !== null) {
            /* Define um looping */
            videoGen.inputOptions('-loop', '1');

            /* Define o tempo customizado */
            videoGen.duration(timeSeg);
        }

        /* Quando terminar */
        videoGen.on('end', () => {
            /* Deleta a pasta de inputs */
            Indexer('clear').destroy(inputFolder);

            /* Define o retorno como o arquivo novo */
            resolve(outputFile);
        });

        /* Se houver erro */
        videoGen.on('error', () => {
            /* Deleta a pasta de inputs */
            Indexer('clear').destroy(inputFolder);

            /* Retorna para parar */
            resolve(path.normalize(`${thisDir}/Cache/error.mp4`));
        });

        /* Executa */
        videoGen.run();
    });
}

/* Cria a função de comando */
async function stickerConverter(
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
                isOwner,
                arks,
                argl,
                decryptedMedia,
                command,
                isQuotedSticker,
                isQuotedAnimated,
                typeFormatted,
                stickerMetadata,
            } = env.value;

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

                /* Sistema de conversão, pode não funcionar em webp's transparentes */
            } else if (isQuotedSticker) {
                /* Avisa para esperar, pois depende da velocidade do PC */
                if (config.waitMessage.value) await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Wait', true, true, envInfo).value }, reply);

                /* Define a mensagem padrão */
                let defaultText = `✏️ By ${config.botName.value} 🖼️`;

                /* Se tiver sido um pedido de extração de metadados */
                if (arks.includes('--metadata')) {
                    /* Insere o metadata */
                    defaultText = `*1.* _Emojis:_ *${stickerMetadata?.emojis?.join(' ') || '❌'}*\n\n*2.* _Pack (ID):_ *${stickerMetadata['sticker-pack-id'] || '❌'}*\n\n*3.* _Pack (Name):_ *${stickerMetadata['sticker-pack-name'] || '❌'}*\n\n*4.* _Author:_ *${stickerMetadata['sticker-author-name'] || '❌'}*\n\n*5.* _Publisher:_ *${stickerMetadata['sticker-pack-publisher'] || '❌'}*\n\n*6.* _Sticker Maker (Android):_ *${stickerMetadata['android-app-store-link'] || '❌'}*\n\n*7.* _Sticker Maker (iOS):_ *${stickerMetadata['ios-app-store-link'] || '❌'}*`;
                }

                /* Define como vai tratar a conversão, esse se for imagem comum */
                if (!isQuotedAnimated && ['convert', 'topng', 'toimage', 'toimg'].includes(command)) {
                    /* Converte a decrypt para png com sharp */
                    const convertedFile = await sharp(decryptedMedia).toFormat('png').toBuffer();

                    /* Envia como imagem */
                    envInfo.results.value = await kill.sendMessage(
                        chatId,
                        { image: convertedFile, caption: defaultText },
                        reply,
                    );

                    /* Se não for animado, mas quiser ser ou se for animado */
                } else {
                    /* Define a output place */
                    const outputPlace = path.normalize(`${thisDir}/Cache/${Indexer('string').generate(10).value}`);

                    /* Define o arquivo de MP4 */
                    let sendVideo = path.normalize(`${thisDir}/Cache/error.mp4`);

                    /* Define uma let para hospedar futuros dados */
                    let frameExtractor = false;

                    /* Define o FPS base */
                    let fpsAmount = argl.includes('--fps') ? argl[argl.indexOf('--fps') + 1] : 'NONE';
                    fpsAmount = argl.includes('--fps') && /[0-9]+/.test(fpsAmount) ? fpsAmount : 'NONE';

                    /* Define o tempo */
                    let timeSecs = argl.includes('--time') ? argl[argl.indexOf('--time') + 1] : 'NONE';
                    timeSecs = argl.includes('--time') && /[0-9]+/.test(timeSecs) ? timeSecs : 'NONE';

                    /* Converte em animado */
                    if (!['topng', 'toimage', 'toimg'].includes(command) && !isQuotedAnimated) {
                        /* Declara o nome do arquivo */
                        const fileConvert = Indexer('string').generate(10).value;
                        const folderConvert = path.normalize(`${thisDir}/Cache/${Indexer('string').generate(10).value}`);
                        const fullPath = path.normalize(`${folderConvert}/${fileConvert}_1.webp`);

                        /* Se a pasta não existir */
                        if (!fs.existsSync(folderConvert)) {
                            /* Cria ela */
                            fs.mkdirSync(folderConvert);
                        }

                        /* Escreve em disco */
                        fs.writeFileSync(fullPath, decryptedMedia);

                        /* Define o FPS */
                        fpsAmount = /[0-9]+/.test(fpsAmount) ? fpsAmount : 10;
                        fpsAmount = (
                            (fpsAmount > envInfo.parameters.maxFPS.value
                                ? envInfo.parameters.maxFPS.value
                                : fpsAmount
                            )
                        );

                        /* Define o tempo */
                        timeSecs = /[0-9]+/.test(timeSecs) ? timeSecs : 0;
                        timeSecs = timeSecs === 0 ? null : (
                            (timeSecs > envInfo.parameters.maxTime.value
                                ? envInfo.parameters.maxTime.value
                                : timeSecs
                            )
                        );

                        /* Define o arquivo de MP4 */
                        sendVideo = await makeMP4(folderConvert, fileConvert, fpsAmount, timeSecs);

                        /* Se for animado */
                    } else {
                        /* Extrai os frames */
                        frameExtractor = await extractFrames(decryptedMedia, outputPlace, 'frame');

                        /* Define o FPS */
                        fpsAmount = /[0-9]+/.test(fpsAmount) ? fpsAmount : 1000 / frameExtractor.data.anim.frames[0].delay;
                        fpsAmount = (
                            (fpsAmount > envInfo.parameters.maxFPS.value
                            && fpsAmount !== (1000 / frameExtractor.data.anim.frames[0].delay)
                                ? envInfo.parameters.maxFPS.value
                                : fpsAmount
                            )
                        );

                        /* Define o tempo */
                        timeSecs = /[0-9]+/.test(timeSecs) ? timeSecs : 0;
                        timeSecs = timeSecs === 0 ? null : (
                            (timeSecs > envInfo.parameters.maxTime.value
                                ? envInfo.parameters.maxTime.value
                                : timeSecs
                            )
                        );

                        /* Se não der erro */
                        if (!(frameExtractor instanceof Error)) {
                            /* Define a criação do MP4 */
                            sendVideo = await makeMP4(outputPlace, 'frame', fpsAmount, timeSecs);
                        }
                    }

                    /* Define as opções de envio */
                    const sendMessage = {
                        video: { url: sendVideo },
                        mimetype: 'video/mp4',
                        caption: (frameExtractor instanceof Error) ? Indexer('sql').languages(region, 'S.E.R', frameExtractor, true, true, {
                            command: 'CONVERT',
                            time: (new Date()).toLocaleString(),
                        }).value : defaultText,
                    };

                    /* Se for toGif */
                    if (command === 'togif') {
                        /* Envia como GIF */
                        sendMessage.gifPlayback = true;
                    }

                    /* Define o envio do MP4 de erro */
                    envInfo.results.value = await kill.sendMessage(chatId, sendMessage, reply);

                    /* Deleta a output se não deu erro */
                    if (!(frameExtractor instanceof Error) && !sendVideo.endsWith('error.mp4')) {
                        /* Usando o sistema de cleaning */
                        Indexer('clear').destroy(outputPlace);
                        Indexer('clear').destroy(sendVideo);
                    }
                }

                /* Se não for sticker */
            } else {
                /* Pede para usar em um sticker */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Typings', 'Type', true, true, { reqtype: 'sticker', type: typeFormatted }).value }, reply);
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
        logging.echoError(error, envInfo, thisDir);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        /* Insira o name que você definiu na envInfo (name) onde pede abaixo */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'CONVERT',
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
 * @param {string} [dirname=thisDir] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    changeKey = {},
    envFile = envInfo,
    dirname = thisDir,
) => logging.resetAmbient({
    functions: {
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.exec]: { value: stickerConverter },
        [envInfo.exports.tomp4]: { value: makeMP4 },
        [envInfo.exports.extract]: { value: extractFrames },
    },
    parameters: {
        location: { value: thisFile },
    },
}, envFile, changeKey, dirname);

/* Exporta todas as funções */
export default resetLocal();
