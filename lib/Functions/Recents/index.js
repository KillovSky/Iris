/* Requires */
const fs = require('fs');
const tree = require('@killovsky/tree');

/* JSONs | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
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

        /* Insere a sortByDate na envInfo */
        envInfo.functions.sort.value = sortByDate;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.sort]: envInfo.functions.sort.value,
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
