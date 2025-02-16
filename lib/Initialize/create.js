/* eslint-disable no-await-in-loop */
/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
*/

/* Requires */
const {
    makeWASocket,
    useMultiFileAuthState,
} = require('baileys');
const fs = require('fs');
const readline = require('readline');
const finalize = require('./finish');
const Indexer = require('../index');

/* JSON's | Utilidades */
const launchInstance = JSON.parse(fs.readFileSync('./lib/Functions/Options/utils.json')).parameters.settings.value;
const packjson = JSON.parse(fs.readFileSync('./package.json'));

/* Funções de pairing code */
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
/* eslint-disable-next-line no-promise-executor-return */
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

/**
 * Gera uma sessão para a Íris.
 * @async
 * @function genSession
 * @param {Object} launchOpt - Opções de inicialização da sessão.
 * @param {number} i - Índice da sessão.
 * @param {Object} launchInstancer - Objeto e instância de inicialização para controle de processos.
 * @returns {Promise<Object>} Retorna um objeto contendo a instância do socket (`kill`)
 * e a função para salvar credenciais (`saveCreds`).
 */
async function genSession(launchOpt, i, launchInstancer) {
    /* Define a startOptions */
    const startOptions = launchOpt;
    startOptions.ignoredKeyUsage = `${launchInstancer.sessionDataPath}/${i}`;

    /* Define o salvamento da sessão */
    const {
        state,
        saveCreds,
    } = await useMultiFileAuthState(startOptions.ignoredKeyUsage);

    /* Insere para logar no socket */
    startOptions.auth = state;

    /* Com base no nome da sessão configurado */
    global.kill = await makeWASocket(startOptions);

    /* Retorna o kill */
    return {
        kill,
        saveCreds,
    };
}

/**
 * Inicia uma ou mais sessões da Íris.
 * @async
 * @function generateSessions
 * @returns {Promise<void>}
 */
async function generateSessions() {
    /* Try caso algo ocorra */
    try {
        /* Avisa que vai iniciar */
        console.log(
            Indexer('color').echo(`[${config.botName.value.toUpperCase()} V${packjson.version} ~ BUILD: ${packjson.build_date} (${packjson.build_name})]`, 'red').value,
            Indexer('color').echo(Indexer('sql').languages(region, 'Console', 'Start', true, true).value, 'green').value,
        );

        /* Const para armazenar as opções de inicio */
        let startOptions = await Indexer('options').create();
        startOptions = startOptions.value;

        /* Inicia as sessões */
        for (let i = 0; i < launchInstance.sessionsLength; i += 1) {
            /* Executa a geração da sessão */
            const client = await genSession(startOptions, i, launchInstance);

            /* Define o código do login */
            let loginCode = false;

            /* Define o login por pairing code */
            if (config.pairingCode.value && !client.kill.authState.creds.registered) {
                /* Pergunta o número de telefone */
                const phoneNumber = await question('Digite o número da sua Íris (e.g: 55123409876): ');

                /* Pede o código de pair */
                loginCode = await client.kill.requestPairingCode(phoneNumber);

                /* Printa ele */
                console.log(`Use esse código para conectar: ${loginCode}`);
            }

            /* Define que a sessão iniciou, em caso de multisessões pode ser um problema */
            global.startedTime.end = Date.now();
            global.startedTime.init = (global.startedTime.end - global.startedTime.in) / 1000;

            /* Envia para os runners e listeners */
            finalize(client.kill, client.saveCreds, genSession, startOptions, i, launchInstance);

            /* Se for pairing code */
            if (config.pairingCode.value && !client.kill.authState.creds.registered) {
                /* Printa o código de novo depois de 5s */
                await Indexer('others').sleep(5000);
                console.log(`Lembre-se de usar o código de login (se ainda não fez): ${loginCode}`);
            }
        }

        /* Caso der erro no meio */
    } catch (error) {
        /* Printa o erro */
        console.error(error);

        /* Se auto-desliga */
        process.exit(1);
    }
}

/* Inicia a geração */
generateSessions();
