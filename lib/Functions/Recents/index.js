/* Requires */
const fs = require('fs');
const tree = require('@killovsky/tree');

/* JSONs | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const isNumeric = /^[0-9]+$/;

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Função de classificação */
function sortByDate(
    folderName = envInfo.functions.sort.arguments.folderName.value,
    limitResult = envInfo.functions.sort.arguments.limitResult.value,
    onlyName = envInfo.functions.sort.arguments.onlyName.value,
) {
    /* Define um valor padrão */
    envInfo.results.value = [];

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Inicia o módulo tree no local especificado */
        const data = tree.View.init(folderName);

        /* Obtém a lista de arquivos e pastas ordenados por data de modificação */
        const sortedFiles = data.results.value.contents.sort((a, b) => a.changedAt - b.changedAt);

        /* Caso queira a array inteira ou um número específico de resultados */
        const resLimit = isNumeric.test(limitResult) ? Number(limitResult) : sortedFiles.length;

        /* Filtra a lista de arquivos para conter apenas nomes, se necessário */
        envInfo.results.value = (onlyName
            ? sortedFiles.map((file) => file.name).slice(0, resLimit)
            : sortedFiles.slice(0, resLimit)
        );

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se houver qualquer erro */
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
        [envInfo.exports.sort]: { value: sortByDate },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
