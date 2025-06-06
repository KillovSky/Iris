/* Requires */
const fs = require('fs');
const path = require('path');
const { Sticker } = require('wa-sticker-formatter');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegloc = require('@ffmpeg-installer/ffmpeg');
const webp = require('node-webpmux');
const Indexer = require('../../index');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
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

/* Função para redimensionar o sticker na tentativa de evitar travamentos */
async function resizeVideo(mediaData, stickerSettings) {
    /* Ffmpeg não possui suporte nativo a Promises, então... */
    /* Criamos uma para encapsular a operação assíncrona */
    return new Promise((resolve) => {
        /* Define o local do Sticker */
        const cacheSticker = path.normalize(`${__dirname}/Cache/${Indexer('strings').generate(10).value}.webp`);
        const stickerLocation = path.normalize(`${__dirname}/Cache/${Indexer('strings').generate(10).value}.webp`);

        /* Define se fará crop, full ou padrão */
        const setStyle = stickerSettings.type !== 'default' ? ',setdar=1:1' : ':flags=lanczos:force_original_aspect_ratio=decrease';

        /* Baixa o sticker */
        fs.writeFileSync(cacheSticker, mediaData);

        /* Configura o ffmpeg para redimensionar o vídeo para 512x512 pixels */
        (ffmpeg().input(cacheSticker).noAudio()

            /* Opções de recode para ter peso certo */
            .outputOptions([
                '-fs 1M',
                '-y',
                '-vcodec libwebp',
                '-lossless 1',
                '-qscale 1',
                '-preset default',
                '-loop 0',
                '-an',
                '-vsync 0',
                '-s 512x512',
            ])

            /* Filtro de video */
            .videoFilters(
                `scale=512:512${setStyle},format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1`,
            )

            /* Formato webp */
            .toFormat('webp')

            /* Quando terminar */
            .on('end', async () => {
                /* Limpa o cache */
                Indexer('clear').destroy(cacheSticker);

                /* Cria um novo objeto para imagem WebP animada */
                let animatedWebP = new webp.Image();

                /* Cria um buffer para a exif metadata */
                const exifBytes = Buffer.from([
                    0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00,
                    0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
                ]);

                /* Define um buffer dos detalhes a inserir */
                const jsonData = {
                    'sticker-pack-id': stickerSettings.id,
                    'sticker-pack-name': stickerSettings.pack,
                    'sticker-pack-publisher': stickerSettings.author,
                    emojis: stickerSettings.categories,
                };

                /* Adquire o buffer do metadata do sticker */
                const jsonBuff = Buffer.from(JSON.stringify(jsonData), 'utf-8');

                /* Mescla os buffers de exif e json */
                const exifData = Buffer.concat([exifBytes, jsonBuff]);

                /* Usa little endian para escrever bytes em um buffer */
                exifData.writeUIntLE(jsonBuff.length, 14, 4);

                /* Carrega a imagem de sticker */
                await animatedWebP.load(stickerLocation);

                /* Define a exif data e retorna diretamente em buffer */
                animatedWebP.exif = exifData;
                animatedWebP = await animatedWebP.save(null);

                /* Limpa o webp */
                Indexer('clear').destroy(stickerLocation);

                /* Resolve a Promise com o objeto da imagem WebP animada */
                resolve(animatedWebP);
            })

            /* Em caso de erro durante o redimensionamento */
            .on('error', (err) => {
                console.error(`Error resizing video: ${err}`);

                /* Limpa o cache */
                Indexer('clear').destroy(cacheSticker);

                /* Limpa o sticker */
                Indexer('clear').destroy(stickerLocation);

                /* resolve a Promise com um arquivo backup */
                resolve(path.normalize(fs.readFileSync(`${__dirname}/Cache/420.jpg`)));
            })

            /* Salva o vídeo redimensionado em um arquivo random */
            .saveToFile(stickerLocation)
        );
    });
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
                command,
                canSticker,
                body,
                argl,
                isOwner,
                isVideo,
                decryptedMedia,
                reply,
                autoSticker,
                stickerConfig,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define se pode fazer o sticker (Tem Mídia) */
            if ((canSticker === true && decryptedMedia) || Indexer('regexp').urls(args[0]).value.isURL) {
                /* Avisa para esperar, pois vai usar request e a velocidade depende da internet */
                if (config.waitMessage.value && !autoSticker) await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Wait', true, true, envInfo).value }, reply);

                /* Se for um rename da figurinha */
                let customMetadata = (argl.includes('-custom')
                    ? body.slice(body.toLowerCase().indexOf('-custom'))
                        .replace('-custom', '')
                        .replace(/^ | $/gi, '')
                        .split('|')
                    : [stickerConfig.pack, stickerConfig.author, stickerConfig.id]
                );
                customMetadata = ['rename', 'renomear'].includes(command) ? body.replace(/^ | $/gi, '').split('|') : customMetadata;
                customMetadata[0] = argl.includes('-custom') || ['rename', 'renomear'].includes(command) ? customMetadata[0] || null : stickerConfig.pack;
                customMetadata[1] = argl.includes('-custom') || ['rename', 'renomear'].includes(command) ? customMetadata[1] || null : stickerConfig.author;
                customMetadata[2] = argl.includes('-custom') || ['rename', 'renomear'].includes(command) ? customMetadata[2] || null : stickerConfig.id;

                /* Configura o author e pack */
                [stickerConfig.pack] = [customMetadata[0]];
                [stickerConfig.author] = [customMetadata[1]];
                [stickerConfig.id] = [customMetadata[2]];

                /* Define se deve usar circle ou cortar nos stickers */
                stickerConfig.type = 'default';

                /* Verifica pelos tipos */
                if (arks.includes('-circle')) {
                    stickerConfig.type = 'circle';
                } else if (arks.includes('-full')) {
                    stickerConfig.type = 'full';
                } else if (arks.includes('-crop')) {
                    stickerConfig.type = 'crop';
                } else if (arks.includes('-rounded')) {
                    stickerConfig.type = 'rounded';
                }

                /* Importa os dados de buffer */
                let mediaData = canSticker === true && decryptedMedia ? decryptedMedia : args[0];
                let sendSticker = false;

                /* Se for um video */
                if (isVideo) {
                    /* Redimensiona para ficar com peso menor */
                    mediaData = await resizeVideo(mediaData, stickerConfig);

                    /* Faz o envio */
                    await kill.sendMessage(chatId, { sticker: mediaData }, reply);

                    /* Se for imagem */
                } else {
                    /* Constrói o sticker, se deixar em 100% nos videos pode travar o sticker */
                    const sticker = new Sticker(mediaData, {
                        ...stickerConfig,
                        type: stickerConfig.type,
                        quality: config.stickerQuality.value,
                    });

                    /* Define como formato Baileys */
                    sendSticker = await sticker.toMessage();

                    /* Faz o envio */
                    await kill.sendMessage(chatId, sendSticker, reply);
                }

                /* Se não for utilizável, e tiver usando '--help-dev' */
            } else if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Se não tiver nada */
            } else {
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'Stickers',
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
        [envInfo.exports.exec]: { value: stickerMaker },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
