/* Requires */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');
const pack = require('../../../../package.json');
const language = require('../../../Dialogues');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let versionCheck = false;

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
async function getVersion() {
    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch, para caso de erro */
    try {
        /* Só adquire se o dono permitiu */
        if (envInfo.parameters.enableChecker.value) {
            /* Faz a requisição */
            const packVersion = await axios.get('https://raw.githubusercontent.com/KillovSky/Hermes/main/package.json');

            /* Verifica se as versões estão atualizadas */
            if (pack.version === packVersion.data.version) {
                /* Parabeniza o dono por manter atualizado */
                console.log(Indexer('color').echo('[UPDATE]', 'green').value, Indexer('color').echo(language(region, 'Updates', 'Updated', true, true), 'yellow').value);

                /* Se a versão não for igual, ou seja... */
            } else {
                /* Caso tenha atualização */
                console.log(Indexer('color').echo('[UPDATE]', 'red').value, Indexer('color').echo(`${language(region, 'Updates', 'Available', true, true)} → [${packVersion.data.version}] | ${packVersion.data.homepage}`, 'yellow').value);
            }

            /* Caso tenha executado uma vez */
        } else {
            /* Para de executar */
            clearInterval(versionCheck);
        }

        /* Caso der erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Para de executar a checagem */
        clearInterval(versionCheck);
    }

    /* Define o sucesso */
    envInfo.results.success = true;

    /* Retorna algo */
    return envInfo.results;
}

/* Função que verifica as transmissões */
function startChecking() {
    /* Adquire a primeira transmissão */
    getVersion().then((res) => {
        /* Aumenta as funções rodadas na inicialização */
        global.tasksComplete += 1;

        /* Repete de hora em hora */
        versionCheck = setInterval(getVersion, Number(envInfo.parameters.checkInterval.value));

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

        /* Insere a startChecking na envInfo */
        envInfo.functions.check.value = startChecking;

        /* Insere a getVersion na envInfo */
        envInfo.functions.get.value = getVersion;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Define o interval novamente */
        envInfo.results.value = versionCheck;

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
