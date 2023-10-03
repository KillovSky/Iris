/* eslint-disable no-await-in-loop */
/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
*/

/* Requires */
const connectWA = require('@adiwajshing/baileys');
const sessionSave = require('baileys-bottle');
const fs = require('fs');
const finalize = require('./finish');
const Indexer = require('../index');
const language = require('../Dialogues');

/* JSON's | Utilidades */
const launchInstance = (JSON.parse(fs.readFileSync('./lib/Functions/Options/utils.json'))).parameters.settings.value;
const packjson = JSON.parse(fs.readFileSync('./package.json'));

/* Cria a função de gerar sessão */
async function genSession(launchOpt, i) {
    /* Define a startOptions */
    const startOptions = launchOpt;

    /* Cria a sessão */
    const baileysData = await sessionSave.default.init({
        type: 'sqlite',
        database: `${launchInstance.sessionDataPath}/database.sql`,
    });

    /* Inicializa a database */
    const {
        auth,
        store,
    } = await baileysData.createStore(launchInstance.sessionId[i]);

    /* Quando a store tiver sido criada, adquire o auth handle */
    const {
        state,
        saveState,
    } = await auth.useAuthHandle();

    /* Insere para logar no socket */
    startOptions.auth = state;

    /* Insere a versão */
    const {
        version,
    } = await connectWA.fetchLatestBaileysVersion();
    startOptions.version = version;

    /* Com base no nome da sessão configurado */
    const kill = connectWA.default(startOptions);

    /* Faz bind do kill acima */
    store.bind(kill.ev);

    /* Retorna o kill */
    return {
        kill,
        saveState,
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
        for (let i = 0; i < launchInstance.sessionId.length; i += 1) {
            /* Executa a geração da sessão */
            const client = await genSession(startOptions, i);

            /* Define que a sessão iniciou, em caso de multisessões pode ser um problema */
            global.startedTime.end = Date.now();
            global.startedTime.init = (global.startedTime.end - global.startedTime.in) / 1000;

            /* Envia para os runners e listeners */
            finalize(client.kill, client.saveState, genSession, startOptions, i);
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
