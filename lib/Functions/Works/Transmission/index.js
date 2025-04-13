/* Requires */
const axios = require('axios');
const fs = require('fs');
const Indexer = require('../../../index');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let checkOTA = false;

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Função responsável por receber a transmissão OTA */
async function getOTA() {
    /* Define o sucesso como falso por padrão */
    envInfo.results.success = false;

    /* Try par caso der um erro de request */
    try {
        /* Realiza a aquisição apenas se o proprietário permitir */
        if (envInfo.parameters.enableOTA.value) {
            /* Faz a requisição */
            const response = await axios.get('https://pastebin.com/raw/mhDCmszg');

            /* Exibe no console */
            console.log(
                Indexer('color').echo('[KILLOVSKY]', 'magenta').value,
                Indexer('color').echo(response.data, 'green').value,
            );

            /* Se foi desativado em plena execução */
        } else {
            /* Para de executar */
            clearInterval(checkOTA);
        }

        /* Se der algum erro */
    } catch (error) {
        /* Registra o erro na envInfo */
        logging.echoError(error, envInfo, __dirname);

        /* Para de executar a checagem */
        clearInterval(checkOTA);
    }

    /* Define o sucesso como verdadeiro */
    envInfo.results.success = true;

    /* Retorna os resultados */
    return envInfo.results;
}

/* Função que inicia a verificação OTA */
function startOTA() {
    /* Adquire a primeira transmissão */
    getOTA().then((res) => {
        /* Incrementa o número de tarefas concluídas na inicialização */
        global.tasksComplete += 1;

        /* Repete de tempo em tempo */
        checkOTA = setInterval(getOTA, Number(envInfo.parameters.checkInterval.value));

        /* Retorna os resultados processados */
        return res;
    });
}

/* Reset profundo para evitar circular */
/**
 * Restaura o ambiente e atualiza as exportações do módulo com a funcionalidade principal
 * @param {Object} [changeKey={}] - Chaves personalizadas para atualizar o envInfo
 * @param {Object} [envFile=envInfo] - Objeto com informações do ambiente
 * @param {string} [dirname=__dirname] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    anotherData = false,
    envFile = envInfo,
    dirname = __dirname,
) => module.exports = logging.resetAmbient({
    functions: {
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.check]: { value: startOTA },
        [envInfo.exports.get]: { value: getOTA },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, anotherData, dirname);
resetLocal();
