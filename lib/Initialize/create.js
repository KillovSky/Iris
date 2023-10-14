/* eslint-disable no-await-in-loop */
/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
*/

/* Requires */
const {
    makeWASocket,
    useMultiFileAuthState,
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const finalize = require('./finish');
const Indexer = require('../index');
const language = require('../Dialogues');

/* JSON's | Utilidades */
const launchInstance = (JSON.parse(fs.readFileSync('./lib/Functions/Options/utils.json'))).parameters.settings.value;
const packjson = JSON.parse(fs.readFileSync('./package.json'));

/* Cria a função de gerar sessão */
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
    const kill = await makeWASocket(startOptions);

    /* Retorna o kill */
    return {
        kill,
        saveCreds,
    };
}

/* Inicia uma ou mais sessões do Hermes | Try-Catch para casos de erro */
async function generateSessions() {
    /* Try caso algo ocorra */
    try {
        /* Avisa que vai iniciar */
        console.log(
            Indexer('color').echo(`[${config.botName.value.toUpperCase()} V${packjson.version} (BUILD: ${packjson.build_date})]`, 'red').value,
            Indexer('color').echo(language(region, 'Console', 'Start', true, true), 'green').value,
        );

        /* Const para armazenar as opções de inicio */
        const startOptions = Indexer('options').create().value;

        /* Inicia as sessões */
        for (let i = 0; i < launchInstance.sessionsLength; i += 1) {
            /* Executa a geração da sessão */
            const client = await genSession(startOptions, i, launchInstance);

            /* Define que a sessão iniciou, em caso de multisessões pode ser um problema */
            global.startedTime.end = Date.now();
            global.startedTime.init = (global.startedTime.end - global.startedTime.in) / 1000;

            /* Envia para os runners e listeners */
            finalize(client.kill, client.saveCreds, genSession, startOptions, i, launchInstance);
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
