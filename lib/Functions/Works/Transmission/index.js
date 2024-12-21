/* Requires */
const axios = require('axios');
const fs = require('fs');
const Indexer = require('../../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
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

        /* Insere a startOTA na envInfo */
        envInfo.functions.check.value = startOTA;

        /* Insere a getOTA na envInfo */
        envInfo.functions.get.value = getOTA;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Define o interval novamente */
        envInfo.results.value = checkOTA;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.check]: envInfo.functions.check.value,
                [envInfo.exports.get]: envInfo.functions.get.value,
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
