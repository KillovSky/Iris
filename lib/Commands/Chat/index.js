/* Requires */
const fs = require('fs');
const path = require('path');
const gtts = require('@killovsky/gtts');
const cleverbot = require('cleverbot-free');
const simsimi = require('chats-simsimi');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
const Indexer = require('../../index');
const language = require('../../Dialogues/index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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

/* Cria a função de comando */
async function speakIris(
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
            /* Importa os valores */
            const {
                chatId,
                quoteThis,
                arks,
                command,
                body,
                isOwner,
                argl,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Menu de ajuda DEV */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'Developer', true, true, envInfo) }, { quoted: quoteThis });

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                /* Não inclui informações secretas */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });

                /* Sistema de conversas */
            } else {
                /* Define a resposta final */
                let sendRes = { text: language(region, 'Typings', 'noSpeak', true, true, env.value) };
                let isFile = false;

                /* Define se deve buscar por palavras chave */
                const customSearch = argl.some((ark) => ['-find', '-cleverbot', '-gpt', '-simsimi'].includes(ark)) || command === 'tts' ? body.replace(/\s*-\s*(find|gpt|tts|cleverbot|simsimi)\s*/g, ' ').trim() : false;

                /* Define uma resposta generica */
                const randomRes = Indexer('bash').liner(1, `${`${path.normalize(irisPath)}/lib/Databases/Utilities/chats.txt`}`, customSearch).value;

                /* Faz via try-catch, assim evita que crashe */
                try {
                    /* Define se fará o request pelo cleverbot */
                    if (arks.includes('-cleverbot') && command !== 'tts') {
                        /* Faz o request */
                        const responseClever = await cleverbot(customSearch);

                        /* Insere na object */
                        sendRes = { text: responseClever };

                        /* Se for simsimi */
                    } else if (arks.includes('-simsimi') && command !== 'tts') {
                        /* Faz o request */
                        const responseSimi = await simsimi(customSearch, region);

                        /* Se deu sucesso */
                        if (responseSimi.status === true) {
                            /* Insere na object */
                            sendRes = { text: responseSimi.result };
                        }

                        /* Se for um local GPT */
                    } else if (arks.includes('-gpt') && command !== 'tts' && config.allowGPT.value === true) {
                        /* Faz o request */
                        const gptText = Indexer('bash').bash(`python ./lib/Scripts/IA.py "${customSearch}"`);

                        /* Se deu sucesso */
                        if (gptText.success) {
                            /* Insere na object */
                            sendRes = { text: `${gptText.value.trim()}\n\n> *_This GPT can be slow and dumber than the others, as it is a simplified version for bad computers, do not abuse it and wait patiently for a response, use english only._*` };
                        }
                    }

                    /* Se der erro não faz nada */
                } catch (err) { /* Pois o dialogo já será o padrão */ }

                /* Se tiver resultados */
                if (randomRes.length > 0 && !arks.includes('-cleverbot') && !arks.includes('-gpt') && !arks.includes('-simsimi')) {
                    /* Define como o primeiro dialogo do 'liner' */
                    sendRes = { text: randomRes[0] };
                }

                /* Se o comando for de TTS */
                if (command === 'tts') {
                    /* Define a mensagem da pessoa como fala */
                    sendRes = { text: customSearch };
                }

                /* Se for modo áudio */
                if (arks.includes('-tts') || command === 'tts') {
                    /* Cria um buffer */
                    const speakdata = await gtts.create(region, sendRes.text, true, `${path.normalize(`${__dirname}/Cache/`)}`);

                    /* Define o arquivo de saida */
                    const exitFile = `${path.normalize(`${__dirname}/Cache/${Indexer('strings').generate(10)}.mp3`)}`;

                    /* Faz o fix para IOS */
                    const fixedAudio = await Indexer('youtube').fixer(speakdata.gtts.local, exitFile);

                    /* Se não for invalido */
                    if (fixedAudio !== 'dontDownload') {
                        /* Define como envio de áudio */
                        sendRes = { audio: { url: fixedAudio }, mimetype: 'audio/mp4', ptt: true };

                        /* Define como arquivo de audio */
                        isFile = true;

                        /* Se for invalido, usa o Buffer que não lê em IOS mesmo */
                    } else sendRes = { audio: speakdata.gtts.buffer, mimetype: 'audio/mp4', ptt: true };
                }

                /* Envia a resposta */
                envInfo.results.value = await kill.sendMessage(chatId, sendRes, {
                    quoted: quoteThis,
                });

                /* Se foi áudio */
                if (isFile) {
                    /* Remove o arquivo do disco */
                    Indexer('clear').destroy(sendRes.audio.url);
                }
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
        await kill.sendMessage(env.value.chatId, {
            text: language(region, 'S.E.R', error, true, true, {
                command: 'CHAT',
                time: (new Date()).toLocaleString(),
            }),
        }, { quoted: env.value.quoteThis });
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

        /* Define a speakIris na envInfo */
        envInfo.functions.exec.value = speakIris;

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
