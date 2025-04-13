/* eslint-disable no-case-declarations */
/* eslint-disable indent */

/* Requires */
const fs = require('fs');
const gimages = require('@killovsky/gimages');
const Indexer = require('../../../index');

/* JSON'S | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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
        [envInfo.exports.search]: { value: imageGetter },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
