/* Requires */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let checkOTA = false;

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

/* Função que recebe a transmissão */
async function getOTA() {
    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch, para caso de erro */
    try {
        /* Só adquire se o dono permitiu */
        if (envInfo.parameters.enableOTA.value) {
            /* Faz a requisição */
            const GOV = await axios.get('https://pastebin.com/raw/mhDCmszg');

            /* Printa no console */
            console.log(Indexer('color').echo('[KILLOVSKY]', 'magenta').value, Indexer('color').echo(GOV.data, 'green').value);

            /* Caso tenha executado uma vez */
        } else {
            /* Para de executar */
            clearInterval(checkOTA);
        }

        /* Caso der erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Para de executar a checagem */
        clearInterval(checkOTA);
    }

    /* Define o sucesso */
    envInfo.results.success = true;

    /* Retorna algo */
    return envInfo.results;
}

/* Função que verifica as transmissões */
function startOTA() {
    /* Adquire a primeira transmissão */
    getOTA().then((res) => {
        /* Aumenta as funções rodadas na inicialização */
        global.tasksComplete += 1;

        /* Repete de hora em hora */
        checkOTA = setInterval(getOTA, Number(envInfo.parameters.checkInterval.value));

        /* Retorna o dialogo */
        return postResults(res);
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
        envInfo.functions.poswork.value = postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = echoError;

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
        echoError(error);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
