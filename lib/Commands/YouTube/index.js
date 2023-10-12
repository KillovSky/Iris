/* eslint-disable max-len */

/* Requires */
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const Search = require('yt-search');
const YouTube = require('youtube-dl-exec');
const language = require('../../Dialogues/index');
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const canAdvise = global.config.waitMessage.value;
const params = envInfo.parameters.systemSets.value;
params.audio.ffmpegLocation = ffmpeg.path;

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

/* Função que faz a busca dos vídeos */
async function searchYouTube(
    seaTerms = envInfo.functions.search.arguments.seaTerms.value,
    kill = envInfo.functions.search.arguments.kill.value,
    chatId = envInfo.functions.search.arguments.chatId.value,
    quoteThis = envInfo.functions.search.arguments.id.value,
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
            searchResults.all = searchResults.all.concat(searchResults.video).flat();

            /* Corrige valores nulos */
            searchResults.all = searchResults.all.filter((res) => res != null).flat();

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
                }).flat();

                /* Adiciona os outros resultados de antes, caso o filter acima falhe */
                envResults.value = searchResults.all.concat(responseBase.videos).concat(responseBase.all).flat();
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
            text: language(region, 'S.E.R', error, true, true, {
                command: 'YouTube',
                time: (new Date()).toLocaleString(),
            }),
        }, { quoted: quoteThis });
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
    quoteThis = envInfo.functions.down.arguments.id.value,
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
        if (Indexer('regexp').urls(linkURL)) {
            /* Se áudio */
            if (searchType === 'audio') {
                /* Define a pasta de download */
                params[searchType].o = path.normalize(`${__dirname}/Cache/${Indexer('strings').generate(10)}.mp3`);
            }

            /* Faz o download/etc */
            let youTubeMedia = null;
            await YouTube(linkURL, params[searchType]).then((result) => { youTubeMedia = result; }).catch(() => { youTubeMedia = 'dontDownload'; });

            /* Define como youTubeMedia */
            envFinish.value = youTubeMedia;

            /* Se é áudio */
            if (searchType === 'audio') {
                /* Define como local do arquivo MP3 */
                envFinish.value = path.normalize(params[searchType].o);
            }

            /* Se retornar vazio, como em casos de peso > 16MB */
            if (youTubeMedia == null || youTubeMedia === 'dontDownload') {
                /* Avisa a pessoa */
                await kill.sendMessage(chatId, { text: language(region, 'play', 'failed', true, true, envInfo) }, { quoted: quoteThis });

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
            text: language(region, 'S.E.R', error, true, true, {
                command: 'YouTube',
                time: (new Date()).toLocaleString(),
            }),
        }, { quoted: quoteThis });
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
                quoteThis,
                arks,
                isOwner,
                command,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Ajusta a body */
            const body = env.value.body.replace(/-audio|-video/g, '');

            /* Define o menu de ajuda para devs */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'Developer', true, true, envInfo) }, { quoted: quoteThis });

                /* Se não tiver nada */
            } else if (arks.includes('--help') || arks.length === 0) {
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });

                /* Se for uso normal */
            } else {
                /* Se permitido os avisos e não for só uma search */
                if (canAdvise === true && command !== 'ytsearch' && command !== 'videosearch') {
                    /* Avisa para esperar, pois vai pesquisar, filtrar, escolher a qualidade, baixar e enviar, demora */
                    await kill.sendMessage(chatId, { text: language(region, 'Extras', 'Wait', true, true, {}) }, { quoted: quoteThis });
                }

                /* Define qual vai ser o formato */
                let downFormat = (arks.includes('-audio') || command === 'play' || command === 'downaudio' || command === 'youtube') ? 'audio' : 'video';

                /* Verifica se a pessoa quer um formato e usou comando errado e se ela só queria pesquisar */
                downFormat = arks.includes('-video') ? 'video' : downFormat;
                downFormat = command.includes('search') && !arks.includes('-video') && !arks.includes('-audio') ? 'audio' : downFormat;

                /* Pesquisa pelo video */
                const youTubeData = await searchYouTube(body, kill, chatId, quoteThis);

                /* Se não encontrar ou tiver erros */
                if (youTubeData.value.length !== 0 && youTubeData.success === true && Array.isArray(youTubeData.value)) {
                    /* Define o video a usar */
                    [youTubeData.value] = [youTubeData.value[0]];

                    /* Envia o link */
                    if (downFormat !== 'video') {
                        /* Se não for video, senão manda 2 mensagens quase iguais */
                        await kill.sendMessage(chatId, { image: { url: youTubeData.value.image }, caption: language(region, 'Play', 'Details', true, true, youTubeData.value) }, { quoted: quoteThis });
                    }

                    /* Se foi só uma busca, cancela */
                    if (command.includes('search') && !arks.includes('-video') && !arks.includes('-audio')) return postResults(envInfo.results);

                    /* Inicia o download */
                    const baixarYouTube = await createDownload(youTubeData.value.url, downFormat, kill, chatId, quoteThis);

                    /* Se deu erro, cancela aqui */
                    if (baixarYouTube.success === false || baixarYouTube.value === 'dontDownload') return postResults(envInfo.results);

                    /* Verifica se o download deu errado */
                    if (
                        (fs.existsSync(baixarYouTube.value))
                        || (downFormat === 'video' && Indexer('regexp').urls(baixarYouTube.value))
                    ) {
                        /* Se for áudio */
                        if (downFormat === 'audio') {
                            /* Envia como PTT e armazena a ID/PTT */
                            await kill.sendMessage(chatId, { audio: { url: baixarYouTube.value }, mimetype: 'audio/mp4' }, { quoted: quoteThis });

                            /* Se for video */
                        } else {
                            /* Envia como arquivo URL e armazena a ID */
                            await kill.sendMessage(chatId, { video: { url: baixarYouTube.value }, mimetype: 'video/mp4', caption: language(region, 'Play', 'Details', true, true, youTubeData.value) }, { quoted: quoteThis });
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
                    envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Play', 'Empty', true, true, {}) }, { quoted: quoteThis });
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
            text: language(region, 'S.E.R', error, true, true, {
                command: 'YouTube',
                time: (new Date()).toLocaleString(),
            }),
        }, { quoted: env.value.quoteThis });
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
