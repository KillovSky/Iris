/* Requires */
const fs = require('fs');
const path = require('path');
const { Sticker } = require('wa-sticker-formatter');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegloc = require('@ffmpeg-installer/ffmpeg');
const webp = require('node-webpmux');
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
                stickerConfig,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define se pode fazer o sticker (Tem Mídia) */
            if ((canSticker === true && decryptedMedia) || Indexer('regexp').urls(args[0]).value.isURL) {
                /* Avisa para esperar, pois vai usar request e a velocidade depende da internet */
                if (config.waitMessage.value) await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Wait', true, true, envInfo).value }, reply);

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
        echoError(error);

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'Stickers',
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
