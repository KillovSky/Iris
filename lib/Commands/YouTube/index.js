/* eslint-disable max-len */

/* Requires */
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const removeAccents = require('remove-accents');
const Search = require('yt-search');
const YouTube = require('youtube-dl-exec');
const language = require('../../Dialogues/index');
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const isMultiDevice = (JSON.parse(fs.readFileSync('./lib/Functions/Options/utils.json'))).Multi_Devices;
const canAdvise = (JSON.parse(fs.readFileSync('./lib/Databases/Settings/Config.json'))).Wait_Message;
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
    id = envInfo.functions.search.arguments.id.value,
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
        await kill.reply(chatId, language(region, 'S.E.R', error, true, true, {
            command: 'YouTube',
            time: (new Date()).toLocaleString(),
        }), id);
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
    id = envInfo.functions.down.arguments.id.value,
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
            const youTubeMedia = await YouTube(linkURL, params[searchType]);

            /* Define como youTubeMedia */
            envFinish.value = youTubeMedia;

            /* Se é áudio */
            if (searchType === 'audio') {
                /* Define como local do arquivo MP3 */
                envFinish.value = path.normalize(params[searchType].o);
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
        await kill.reply(chatId, language(region, 'S.E.R', error, true, true, {
            command: 'YouTube',
            time: (new Date()).toLocaleString(),
        }), id);
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
                id,
                body,
                arks,
                isOwner,
                user,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define o menu de ajuda para devs */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.reply(chatId, language(region, 'Helper', 'Developer', true, true, envInfo), id);

                /* Se não tiver nada */
            } else if (arks.includes('--help')) {
                envInfo.results.value = await kill.reply(chatId, language(region, 'Helper', 'User', true, true, envInfo), id);

                /* Se for uso normal */
            } else {
                /* Se permitido os avisos */
                if (canAdvise === true) {
                    /* Avisa para esperar, pois vai pesquisar, filtrar, escolher a qualidade, baixar e enviar, demora */
                    await kill.reply(chatId, language(region, 'Extras', 'Wait', true, true, {}), id);
                }

                /* Define a data de agora para casos de erro */
                const newDate = (new Date()).toLocaleString();

                /* Pesquisa pelo video */
                const youTubeData = await searchYouTube(body, kill, chatId, id);

                /* Se deu erro, cancela aqui */
                if (youTubeData.value.success === false) return postResults(envInfo.results);

                /* Se não encontrar ou tiver erros */
                if (youTubeData.value.length !== 0) {
                    /* Define o video a usar */
                    [youTubeData.value] = [youTubeData.value[0]];

                    /* Envia o link */
                    await kill.sendFileFromUrl(chatId, youTubeData.value.image, 'thumb.png', language(region, 'Play', 'Details', true, true, youTubeData.value), id);

                    /* Define os modos de escolha */
                    const choiceTypes = {
                        first: 'audio',
                        two: 'video',
                        three: 'cancelar',
                        time: 5,
                        buttonID: 'DefaultButtonKey',
                    };

                    /* Determina que tipo de sistema utilizar */
                    if (isMultiDevice === false) {
                        /* Caso seja os botões, envia eles e armazena a ID na let */
                        choiceTypes.buttonID = await kill.sendButtons(chatId, Indexer('texts').language(region, 'Extras', 'ButtonStop', true, true, choiceTypes), [
                            {
                                id: '1',
                                text: '📀 Áudio 🎵',
                            },
                            {
                                id: '2',
                                text: '🎥 Vídeo 📹',
                            },
                            {
                                id: '3',
                                text: '🚫 Cancelar 🚫',
                            },
                        ], language(region, 'Play', 'Format', true, true, youTubeData.value), language(region, 'Extras', 'Choice', true, true, choiceTypes));

                    /* Envia as informações caso seja por texto */
                    } else await kill.reply(chatId, language(region, 'Play', 'Options', true, true, choiceTypes), id);

                    /* Cria uma função de filtro para o sistema de esperar resposta */
                    const myFilter = (msgw) => Indexer('regexp').mesrxp(msgw, user, chatId, choiceTypes.buttonID, /video|audio|cancel/gi).value;

                    /* Função de esperar uma mensagem */
                    (kill.awaitMessages(chatId, myFilter, envInfo.parameters.systemSets.value.mesHandler)

                        /* Se 'funcionar' */
                        .then(async (collected) => {
                            /* Define a resposta */
                            let mesFinale = removeAccents(Array.from(collected)[0][1].text).toLowerCase();

                            /* Define a escolha */
                            mesFinale = mesFinale.match(/cancel|audio|video/gi).sort();

                            /* Define o endereço PTT */
                            let filePTT = false;

                            /* Se escolheu áudio ou video */
                            if (mesFinale.includes('audio') || mesFinale.includes('video')) {
                                /* Envia a confirmação de inicio do download */
                                await kill.reply(chatId, language(region, 'Extras', 'Continue', true, true, youTubeData.value), id);

                                /* Inicia o download */
                                const baixarYouTube = await createDownload(youTubeData.value.url, mesFinale[0]);

                                /* Se deu erro, cancela aqui */
                                if (baixarYouTube.success === false) return postResults(envInfo.results);

                                /* Verifica se o download deu errado */
                                if (fs.existsSync(baixarYouTube.value) || Indexer('regexp').urls(baixarYouTube.value)) {
                                    /* Se for áudio */
                                    if (mesFinale[0] === 'audio') {
                                        /* Envia como PTT e armazena a ID/PTT */
                                        envInfo.results.value = await kill.sendPtt(chatId, baixarYouTube.value, id);
                                        filePTT = baixarYouTube.value;

                                        /* Se for video */
                                    } else {
                                        /* Envia como arquivo URL e armazena a ID */
                                        envInfo.results.value = await kill.sendFileFromUrl(chatId, baixarYouTube.value, `${youTubeData.value.title}.mp4`, language(region, 'Play', 'Details', true, true, youTubeData.value), id);
                                    }

                                    /* Se falhar */
                                } else {
                                    /* Diz que o download recebeu falhas */
                                    await kill.reply(chatId, language(region, 'Play', 'Failed', true, true, youTubeData.value), id);
                                }

                                /* Se não cair em nenhuma opção acima/cancel */
                            } else {
                                /* Diz que cancelou */
                                envInfo.results.value = await kill.reply(chatId, language(region, 'Extras', 'Cancel', true, true, youTubeData.value), id);
                            }

                            /* Se for áudio... */
                            if (mesFinale[0] === 'audio') {
                                /* Limpa ele */
                                Indexer('clear').destroy(filePTT);
                            }

                            /* Retorna um valor */
                            return envInfo.results;
                        })

                        /* Se erro ou demorar */
                        .catch(async (error) => {
                            /* Insere tudo na envInfo */
                            echoError(error);

                            /* Define a string do erro */
                            let errStringer = language(region, 'S.E.R', error, true, true, {
                                command: 'YouTube',
                                time: newDate,
                            });

                            /* Adiciona o timeout na frase */
                            errStringer += `\n\n${language(region, 'Play', 'Timeout', true, true, {})}`;

                            /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
                            await kill.reply(chatId, errStringer, id);
                        })
                    );

                    /* ...Se não tem resultados */
                } else {
                    /* Envia a mensagem padrão */
                    envInfo.results.value = await kill.reply(chatId, language(region, 'Play', 'Empty', true, true, {}), id);
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
        await kill.reply(env.value.chatId, language(region, 'S.E.R', error, true, true, {
            command: 'YouTube',
            time: (new Date()).toLocaleString(),
        }), env.value.id);
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
