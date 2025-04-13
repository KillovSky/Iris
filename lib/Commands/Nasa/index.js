/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const NASA = require('@killovsky/nasa');
const {
    translate,
} = require('@vitalets/google-translate-api');
const Indexer = require('../../index');

/* JSON's | Utilidades */
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

/* Cria a função de comando */
async function getInformation(
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
            /* Define os dados necessarios */
            const {
                reply,
                chatId,
                argl,
                isOwner,
                arks,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define o menu de ajuda */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Sistema da NASA */
            } else {
                /* Avisa para esperar, pois vai usar request e a velocidade depende da internet */
                if (config.waitMessage.value) await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Wait', true, true, envInfo).value }, reply);

                /* Define a data atual para usar */
                let theDate = new Date().toISOString().split('T')[0];

                /* Se caso for uma data customizada */
                if (argl[0] === '-date') {
                    /* Define a data customizada, o módulo faz o parse sozinho */
                    [theDate] = [argl[1]];
                }

                /* Obtém os dados da NASA */
                const NASA_INFO = await NASA.APOD(Indexer('array').extract(APIs.nasa.key).value, theDate, false, false);

                /* Traduz o texto */
                const translText = NASA_INFO.nasa.explanation ? await translate(NASA_INFO.nasa.explanation, { to: region }) : 'N/A';

                /* Constroi a object para substituir o dialogo */
                const objectReplacer = {
                    title: NASA_INFO.nasa.title || 'N/A',
                    author: NASA_INFO.nasa.copyright || 'N/A',
                    date: NASA_INFO.nasa.date || NASA_INFO.date || NASA_INFO.headers.date || 'N/A',
                    explanation: translText.text,
                    url: NASA_INFO.nasa.url || NASA_INFO.nasa.hdurl || NASA_INFO.nasa.thumbnail_url || NASA_INFO.best_image || envInfo.parameters.image.value,
                    type: NASA_INFO.nasa.media_type || 'image',
                    thumb: NASA_INFO.best_image || envInfo.parameters.image.value,
                    version: NASA_INFO.nasa.service_version || 'N/A',
                    usage: NASA_INFO.headers['x-ratelimit-remaining'],
                    maxUsage: NASA_INFO.headers['x-ratelimit-limit'],
                    errors: NASA_INFO.error || NASA_INFO.download || NASA_INFO.dev_msg || NASA_INFO.data_msg || NASA_INFO.error_msg || 'N/A',
                    code: NASA_INFO.code,
                    codeText: NASA_INFO.explain.code,
                    why: NASA_INFO.explain.why,
                };

                /* Envia eles */
                envInfo.results.value = await kill.sendMessage(chatId, { image: { url: objectReplacer.thumb }, caption: Indexer('sql').languages(region, 'Helper', 'Nasa', true, true, objectReplacer).value }, reply);
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
        logging.echoError(error, envInfo, __dirname);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        /* Insira o name que você definiu na envInfo (name) onde pede abaixo */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'NASA',
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
        [envInfo.exports.exec]: { value: getInformation },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
