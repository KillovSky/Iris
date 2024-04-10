/* eslint-disable no-case-declarations */
/* eslint-disable indent */

/* Requires */
const fs = require('fs');
const path = require('path');
const gimages = require('@killovsky/gimages');
const Indexer = require('../../../index');

/* JSON'S | Utilidades */
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

/* Gera um Card de nível */
async function imageGetter(
    env = envInfo.functions.search.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = 'https://source.unsplash.com/featured/?random';

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Define o texto da caption para enviar */
    envInfo.results.details = `✏️ By ${config.botName.value} 🖼️`;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se as condições batem */
        if (typeof env === 'object' && env != null) {
            /* Define as URLs de busca */
            const locateURL = {
                loli: `https://media.publit.io/file/Twintails/${Indexer('number').randnum(1, 145).value}.jpg`,
                qr: `https://api.qrserver.com/v1/create-qr-code/?data=${(env.body || 'Write something!').replace(/-sticker/gi, '')}`,
                randomimage: 'https://source.unsplash.com/featured/?random',
                search: `${env.body.replace(/-sticker|^ /gi, '')}`,
            };

            /* Define o comando */
            const searchx = env.command.toLowerCase();

            /* Define se pode contéudo adulto */
            let adultsAllowed = env.functions?.nsfw?.enable || false;
            adultsAllowed = !env.isGroup || !env.isGroupMsg || adultsAllowed;

            /* Define o resultado final da busca */
            let resultSearch = false;

            /* Define os comandos */
            switch (searchx) {
                /* Faz a busca por imagens que não precisam de especificação manual */
                case 'loli':
                case 'qr':
                case 'randomimage':
                    /* Define a URL */
                    envInfo.results.value = locateURL[searchx];
                break;

                /* Busca usando o DDG */
                case 'search':
                case 'getsticker':
                    /* Define o que filtrar */
                    const safeSearch = {
                      safe: true,
                      query: locateURL.search || 'Anime girl baguette',
                    };

                    /* Se for um grupo adulto */
                    if (adultsAllowed === true) {
                        /* Tira o safesearch */
                        safeSearch.safe = false;
                    }

                    /* Define a busca */
                    resultSearch = await gimages.get(safeSearch);
                    resultSearch = resultSearch.images;

                    /* Se houver nada */
                    if (resultSearch.length === 0) {
                        /* Define uma URL padrão */
                        resultSearch = locateURL.randomimage;

                        /* Se houver */
                    } else {
                        /* Define a imagem filtrando valores que não são válidos e adquirindo um */
                        resultSearch = Indexer('array').extract(Indexer('array').sort(resultSearch).value).value;

                        /* Define os detalhes e URL */
                        envInfo.results.details = `🌐 URL → ${resultSearch.url || 'N/A'}\n\n📐 Size → ${resultSearch.width || 'N/A'}x${resultSearch.height || 'N/A'}`;
                        envInfo.results.value = resultSearch.url || locateURL.randomimage;
                    }
                break;

                    /* Imagem padrão */
                default:
                    /* Define na env uma random */
                    envInfo.results.value = locateURL.randomimage;
                break;
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
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

        /* Insere a imageGetter na envInfo */
        envInfo.functions.search.value = imageGetter;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.search]: envInfo.functions.search.value,
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
