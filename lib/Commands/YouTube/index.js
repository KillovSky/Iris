/* eslint-disable max-len */

/* Requires */
const ffmpegloc = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const Search = require('yt-search');
const YouTube = require('youtube-dl-exec');
const Indexer = require('../../index');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const canAdvise = global.config?.waitMessage?.value;
const params = envInfo.parameters.systemSets.value;
params.audio.ffmpegLocation = ffmpegloc.path;
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

/* Função que converte o arquivo em AAC para funcionar com IOS */
async function fixForIOS(inputPath, outputPath) {
    /* Retorna uma Promise, é o meio mais simples de esperar essa conversão terminar */
    return new Promise((resolve) => {
        /* Executa o ffmpeg com os argumentos */
        (ffmpeg()
            .input(inputPath)
            .audioChannels(1)
            .audioCodec('opus')
            .toFormat('ogg')
            .addOutputOptions('-avoid_negative_ts make_zero')
            .save(outputPath)

            /* Quando terminar */
            .on('end', () => {
                /* Deleta o arquivo antigo */
                Indexer('clear').destroy(inputPath);

                /* Define o retorno como o arquivo novo */
                resolve(outputPath);
            })

            /* Se houver erro */
            .on('error', () => {
                /* Retorna para parar */
                resolve('dontDownload');
            })
        );
    });
}

/* Função que faz a busca dos vídeos */
async function searchYouTube(
    seaTerms = envInfo.functions.search.arguments.seaTerms.value,
    kill = envInfo.functions.search.arguments.kill.value,
    chatId = envInfo.functions.search.arguments.chatId.value,
    reply = envInfo.functions.search.arguments.quoteThis.value,
) {
    /* Define os resultados padrões */
    const envResults = {
        success: false,
        type: 'Boolean / Array',
        value: false,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Caso o texto seja invalido */
        if (typeof seaTerms === 'string') {
            /* Executa a busca */
            const responseBase = await Search(seaTerms);

            /* Define um valor alterável */
            const searchResults = responseBase;

            /* Mescla valores */
            searchResults.all = searchResults.all.concat(searchResults.video).flat(5);

            /* Corrige valores nulos */
            searchResults.all = searchResults.all.filter((res) => res != null).flat(5);

            /* Só roda se tiver 1 ou + resultados */
            if (searchResults.all.length > 0) {
                /* Filtra somente os vídeos */
                searchResults.all = searchResults.all.filter((res) => !res.url.includes('playlist') && res.type === 'video');

                /* Organiza pelo resultado mais provável */
                searchResults.all = searchResults.all.filter((res) => {
                    /* Informações dos vídeos */
                    let videoData = [
                        (res.videoId || ''),
                        (res.url || ''),
                        (res.title || ''),
                        (res.description || ''),
                        (res.author?.name || ''),
                        (res.author?.url || ''),
                    ];

                    /* Transforma as informações em minusculas */
                    videoData = videoData.map((ponse) => ponse.toLowerCase());

                    /* Retorna o valor do filter */
                    return videoData.includes(seaTerms);
                }).flat(5);

                /* Adiciona os outros resultados de antes, caso o filter acima falhe */
                envResults.value = searchResults.all.concat(responseBase.videos).concat(responseBase.all).flat(5);
            }
        }

        /* Define o sucesso */
        envResults.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Printa usando a Indexer */
        Indexer('color').report(error, 'YouTube');

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.sendMessage(chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'YOUTUBE',
                time: (new Date()).toLocaleString(),
            }).value,
        }, reply);
    }

    /* Retorna o que encontrou */
    return envResults;
}

/* Cria uma função de obter o video/áudio/info */
async function createDownload(
    linkURL = envInfo.functions.down.arguments.linkURL.value,
    searchType = envInfo.functions.down.arguments.searchType.value,
    kill = envInfo.functions.down.arguments.kill.value,
    chatId = envInfo.functions.down.arguments.chatId.value,
    reply = envInfo.functions.down.arguments.quoteThis.value,
    haveURL = envInfo.functions.down.arguments.haveURL.value,
) {
    /* Define os resultados padrões */
    const envFinish = {
        success: false,
        type: 'Boolean / Array',
        value: false,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Só executa se for uma URL */
        if (Indexer('regexp').urls(linkURL).value.isURL) {
            /* Define os parametros de download */
            const downOptions = params[searchType];

            /* Se áudio */
            if (searchType === 'audio') {
                /* Define a pasta de download */
                downOptions.o = path.normalize(`${__dirname}/Cache/${Indexer('strings').generate(10).value}.mp3`);
            }

            /* Se for URL externa */
            if (haveURL.isURL) {
                /* Remove o filtro que dará erros */
                delete downOptions.matchFilters;
            }

            /* Faz o download */
            let youTubeMedia = null;
            await YouTube(linkURL, downOptions).then((result) => { youTubeMedia = result; }).catch(() => { youTubeMedia = 'dontDownload'; });

            /* Define como youTubeMedia */
            envFinish.value = youTubeMedia;

            /* Se for audio, faz funcionar no Iphone via encoding do codec opus */
            if (searchType === 'audio' && youTubeMedia != null && youTubeMedia !== 'dontDownload') {
                /* Define o novo arquivo */
                const newAudioFile = path.normalize(`${__dirname}/Cache/${Indexer('strings').generate(10).value}.ogg`);

                /* Executa o ajuste para Iphones */
                envFinish.value = await fixForIOS(downOptions.o, newAudioFile);
            }

            /* Se retornar vazio, como em casos de peso > 16MB */
            if (youTubeMedia == null || youTubeMedia === 'dontDownload' || envFinish.value === 'dontDownload' || envFinish.value == null) {
                /* Avisa a pessoa */
                await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Play', 'Failed', true, true, envInfo).value }, reply);

                /* Se certifica se não baixar */
                envFinish.value = 'dontDownload';
            }
        }

        /* Define como sucesso */
        envFinish.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Se for áudio... */
        if (searchType === 'audio') {
            /* Limpa ele */
            Indexer('clear').destroy(path.normalize(params[searchType].o));
        }

        /* Printa usando a Indexer */
        Indexer('color').report(error, 'YouTube');

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.sendMessage(chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'YOUTUBE',
                time: (new Date()).toLocaleString(),
            }).value,
        }, reply);
    }

    /* Retorna o que encontrou */
    return envFinish;
}

/* Cria a função de comando */
async function youTubeDownloader(
    kill = envInfo.functions.exec.arguments.kill.value,
    env = envInfo.functions.exec.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Importa os parâmetros que precisa */
            const {
                chatId,
                reply,
                arks,
                isOwner,
                command,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Ajusta a body */
            const body = env.value.body.replace(/(https:\/\/www\.youtube\.com|https:\/\/youtube\.com)\/shorts\/|\?si=.*$|\?feature.*$|-audio|-video|-link|^ /g, '');

            /* Define o menu de ajuda para devs */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Se não tiver nada */
            } else if (arks.includes('--help') || arks.length === 0) {
                /* Envia menu de ajuda sem informações sigilosas */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Se for uso normal */
            } else {
                /* Se permitido os avisos e não for só uma search */
                if (canAdvise === true && command !== 'ytsearch' && command !== 'videosearch') {
                    /* Avisa para esperar, pois vai pesquisar, filtrar, escolher a qualidade, baixar e enviar, demora */
                    if (config.waitMessage.value) await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Wait', true, true, envInfo).value }, reply);
                }

                /* Define qual vai ser o formato */
                let downFormat = (arks.includes('-audio') || command === 'play' || command === 'downaudio' || command === 'youtube') ? 'audio' : 'video';

                /* Verifica se a pessoa quer um formato e usou comando errado e se ela só queria pesquisar */
                downFormat = arks.includes('-video') ? 'video' : downFormat;
                downFormat = command.includes('search') && !arks.includes('-video') && !arks.includes('-audio') && !arks.includes('-link') ? 'audio' : downFormat;
                downFormat = arks.includes('-link') ? 'video' : downFormat;

                /* Define se tem URL e o formato de resultados de busca do YouTube */
                const haveURL = Indexer('regexp').urls(body).value;
                let youTubeData = {
                    value: [],
                    success: false,
                };

                /* Se for link de YouTube */
                if (haveURL.matchedURL.includes('youtube.com') || haveURL.matchedURL.includes('youtu.be')) {
                    /* Redefine como não sendo URL */
                    haveURL.isURL = false;
                    haveURL.matchedURL = 'none';
                }

                /* Define se é para YouTube ou além */
                if (haveURL.isURL === false) {
                    /* Pesquisa pelo video */
                    youTubeData = await searchYouTube(body, kill, chatId, reply);
                }

                /* Se não encontrar ou tiver erros */
                if ((youTubeData.value.length !== 0 && youTubeData.success === true && Array.isArray(youTubeData.value)) || haveURL.isURL === true) {
                    /* Se não for uma busca de YouTube */
                    if (haveURL.isURL === false) {
                        /* Define o download */
                        [youTubeData.value] = [youTubeData.value[0]];

                        /* Se for, define a URL direto */
                    } else youTubeData.value.url = haveURL.matchedURL;

                    /* Envia o link se for YouTube */
                    if (downFormat !== 'video' && !arks.includes('-link') && haveURL.isURL === false) {
                        /* Se não for video, senão manda 2 mensagens quase iguais */
                        await kill.sendMessage(chatId, { image: { url: youTubeData.value.image }, caption: Indexer('sql').languages(region, 'Play', 'Details', true, true, youTubeData.value).value }, reply);
                    }

                    /* Se foi só uma busca, cancela */
                    if (command.includes('search') && !arks.includes('-video') && !arks.includes('-audio') && !arks.includes('-link')) return logging.postResults(envInfo);

                    /* Ajusta para reel em vez de reels, senão o instagram não baixará */
                    youTubeData.value.url = youTubeData.value.url.replace(/\/reels\//gi, '/reel/');

                    /* Inicia o download */
                    const baixarYouTube = await createDownload(youTubeData.value.url, downFormat, kill, chatId, reply, haveURL);

                    /* Se deu erro, cancela aqui */
                    if (baixarYouTube.success === false || baixarYouTube.value === 'dontDownload') return logging.postResults(envInfo);

                    /* Verifica se o download deu errado */
                    if (
                        (fs.existsSync(baixarYouTube.value))
                        || (downFormat === 'video' && Indexer('regexp').urls(baixarYouTube.value).value.isURL)
                    ) {
                        /* Se for só obter Link */
                        if (arks.includes('-link')) {
                            /* Envia a URL e armazena a ID */
                            await kill.sendMessage(chatId, { text: baixarYouTube.value }, reply);

                            /* Se for áudio */
                        } else if (downFormat === 'audio') {
                            /* Envia como PTT e armazena a ID/PTT */
                            await kill.sendMessage(chatId, { audio: { url: baixarYouTube.value }, mimetype: 'audio/mp4', ptt: true }, reply);

                            /* Se for video YouTube */
                        } else if (downFormat === 'video' && haveURL.isURL === false) {
                            /* Envia como arquivo URL e armazena a ID */
                            await kill.sendMessage(chatId, { video: { url: baixarYouTube.value }, mimetype: 'video/mp4', caption: Indexer('sql').languages(region, 'Play', 'Details', true, true, youTubeData.value).value }, reply);

                            /* Se for outro video */
                        } else {
                            /* Envia como arquivo URL e armazena a ID */
                            await kill.sendMessage(chatId, { video: { url: baixarYouTube.value }, mimetype: 'video/mp4' }, reply);
                        }

                        /* Se for áudio... */
                        if (downFormat === 'audio') {
                            /* Limpa ele */
                            Indexer('clear').destroy(baixarYouTube.value);
                        }

                        /* Retorna um valor */
                        return envInfo.results;
                    }

                    /* ...Se não tem resultados */
                } else {
                    /* Envia a mensagem padrão */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Play', 'Empty', true, true, envInfo).value }, reply);
                }
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
                command: 'YOUTUBE',
                time: (new Date()).toLocaleString(),
            }).value,
        }, env.value.reply);
    }

    /* Retorna a nova Array */
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
        [envInfo.exports.search]: { value: searchYouTube },
        [envInfo.exports.down]: { value: createDownload },
        [envInfo.exports.exec]: { value: youTubeDownloader },
        [envInfo.exports.ios]: { value: fixForIOS },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
