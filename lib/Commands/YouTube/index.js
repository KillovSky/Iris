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
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const canAdvise = global.config?.waitMessage?.value;
const params = envInfo.parameters.systemSets.value;
params.audio.ffmpegLocation = ffmpegloc.path;
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
                    if (command.includes('search') && !arks.includes('-video') && !arks.includes('-audio') && !arks.includes('-link')) return postResults(envInfo.results);

                    /* Ajusta para reel em vez de reels, senão o instagram não baixará */
                    youTubeData.value.url = youTubeData.value.url.replace(/\/reels\//gi, '/reel/');

                    /* Inicia o download */
                    const baixarYouTube = await createDownload(youTubeData.value.url, downFormat, kill, chatId, reply, haveURL);

                    /* Se deu erro, cancela aqui */
                    if (baixarYouTube.success === false || baixarYouTube.value === 'dontDownload') return postResults(envInfo.results);

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
        echoError(error);

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'YOUTUBE',
                time: (new Date()).toLocaleString(),
            }).value,
        }, env.value.reply);
    }

    /* Retorna a nova Array */
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

        /* Insere a searchYouTube na envInfo */
        envInfo.functions.search.value = searchYouTube;

        /* Insere a fixForIOS na envInfo */
        envInfo.functions.ios.value = fixForIOS;

        /* Insere a createDownload na envInfo */
        envInfo.functions.down.value = createDownload;

        /* Insere a youTubeDownloader na envInfo */
        envInfo.functions.exec.value = youTubeDownloader;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.search]: envInfo.functions.search.value,
                [envInfo.exports.down]: envInfo.functions.down.value,
                [envInfo.exports.exec]: envInfo.functions.exec.value,
                [envInfo.exports.ios]: envInfo.functions.ios.value,
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
