/* eslint-disable no-nested-ternary */

/* Requires */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ffmpegloc = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const WebP = require('node-webpmux');

/* Importa módulos */
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
ffmpeg.setFfmpegPath(ffmpegloc.path);

/* Realiza funções de pós finalização */
function postResults(response) {
    /* Verifica se pode resetar a envInfo */
    if (
        envInfo.settings.finish.value === true
        || (envInfo.settings.ender.value === true && envInfo.results.success === false)
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
        /* Define se vai printar inteiro */
        const showError = config?.fullError?.value || true;

        /* Se pode printar o erro inteiro */
        if (showError) {
            /* Só joga o erro na tela */
            console.error(error);

            /* Se não, formata e printa */
        } else console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envInfo.results;
}

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
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
    const outputFile = path.normalize(`${__dirname}/Cache/${Indexer('string').generate(10).value}.mp4`);

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
            resolve(path.normalize(`${__dirname}/Cache/error.mp4`));
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
                    const outputPlace = path.normalize(`${__dirname}/Cache/${Indexer('string').generate(10).value}`);

                    /* Define o arquivo de MP4 */
                    let sendVideo = path.normalize(`${__dirname}/Cache/error.mp4`);

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
                        const folderConvert = path.normalize(`${__dirname}/Cache/${Indexer('string').generate(10).value}`);
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
        echoError(error);

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

        /* Insere a stickerConverter na envInfo */
        envInfo.functions.exec.value = stickerConverter;

        /* Insere a makeMP4 na envInfo */
        envInfo.functions.tomp4.value = makeMP4;

        /* Insere a extractFrames na envInfo */
        envInfo.functions.extract.value = extractFrames;

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
                [envInfo.exports.tomp4]: envInfo.functions.tomp4.value,
                [envInfo.exports.extract]: envInfo.functions.extract.value,
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
