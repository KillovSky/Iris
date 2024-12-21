/* eslint-disable no-case-declarations */
/* eslint-disable indent */

/* Requires */
const fs = require('fs');
const gimages = require('@killovsky/gimages');
const Indexer = require('../../../index');

/* JSON'S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
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
        envInfo.functions.poswork.value = logging.postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
