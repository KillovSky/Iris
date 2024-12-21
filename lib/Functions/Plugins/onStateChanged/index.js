/* Requires */
const fs = require('fs');
const {
    Boom,
} = require('@hapi/boom');
const {
    DisconnectReason,
} = require('baileys');
const Indexer = require('../../../index');
const listener = require('../../Listener/index');

/* JSON"S | Utilidades */
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

/* Função que verifica o newState */
async function determineState(
    newState = envInfo.functions.spec.arguments.newState.value,
    genSession = process.exit,
    startOptions = {},
    indexlaunch = 0,
    launchInstance = {},
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Insere o state de resultado */
    envInfo.results.value = newState;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        if (typeof newState === 'object') {
            /* Se a sessão mudou para close */
            if (newState.connection === 'close') {
                /* Verifica a reação */
                const lastReason = new Boom(newState.lastDisconnect?.error)?.output?.statusCode;

                /* Avisa que a sessão mudou */
                console.log(Indexer('color').echo(`[${(DisconnectReason[lastReason] || 'UNKNOWN').toUpperCase()}]`, 'red').value, Indexer('color').echo(Indexer('sql').languages(region, 'States', `${lastReason}`, true, true).value, 'green').value);

                /* Se foi desconexão por logout */
                if (lastReason === DisconnectReason.loggedOut) {
                    /* Apaga a sessão salva */
                    Indexer('clear').destroy(startOptions.ignoredKeyUsage, 1000);
                }

                /* Recria a sessão */
                genSession(startOptions, indexlaunch, launchInstance).then((client) => {
                    /* Envia para os runners e listeners */
                    /* eslint-disable-next-line max-len */
                    listener(client.kill, client.saveCreds, genSession, startOptions, indexlaunch, launchInstance);
                });

                /* Se for connecting ou open */
            } else if (newState.connection === 'open' || newState.connection === 'connecting') {
                /* Avisa que a sessão está carregando */
                console.log(Indexer('color').echo(`[${(newState.connection || 'UNKNOWN').toUpperCase()}]`, 'red').value, Indexer('color').echo(Indexer('sql').languages(region, 'States', newState.connection, true, true).value, 'green').value);
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Recria a sessão */
        genSession(startOptions, indexlaunch, launchInstance).then((client) => {
            /* Envia para os runners e listeners */
            /* eslint-disable-next-line max-len */
            listener(client.kill, client.saveCreds, genSession, startOptions, indexlaunch, launchInstance);
        });

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

        /* Insere a determineState na envInfo */
        envInfo.functions.spec.value = determineState;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.spec]: envInfo.functions.spec.value,
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
