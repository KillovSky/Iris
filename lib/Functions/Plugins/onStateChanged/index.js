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
const qrcode = require('qrcode-terminal');

/* JSON"S | Utilidades */
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

            /* Se for um novo QR Code */
            if (typeof newState.qr === 'string') {
                /* Printa ele na tela - Breaking Change (Baileys Auto-QR Deprecation) */
                console.log(qrcode.generate(newState.qr, { small: true }));
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
        [envInfo.exports.spec]: { value: determineState },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
