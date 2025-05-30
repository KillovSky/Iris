/*
    Este local é restrito em nível máximo, o uso desta função por meio da exec causará danos.
    Por isso não existem funções exports ou Ambient, não use envInfo aqui.
    NÃO REMOVA ESSA PASTA OU SEUS ARQUIVOS!
*/

/* Requires */
const fs = require('fs');

/**
 * Canvas deve ser chamado no inicio do programa antes que sharp
 * para que não crashe e ambos funcionem no Windows.
 * Essa issue não afeta o Linux, Termux, MacOS ou qualquer outro sistema.
 *
 * Outros Devs: Faça downgrade do Sharp para 0.29.3; E faça o mesmo que aqui.
 * Isso fará com que o Sharp funcione junto com qualquer módulo Canvas.
 * @ignore
 */
/* eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies */
const canvas = require('canvas');

/* Importa a class de formatação de erros e finalização */
require('./logging');

/* Define o OS como global para corrigir o erro de hostname em sistemas antigos */
global.os = require('os');

/* JSON's | Utilidades */
global.config = JSON.parse(fs.readFileSync('./lib/Databases/Configurations/config.json'));
global.APIs = JSON.parse(fs.readFileSync('./lib/Databases/Configurations/APIs.json'));
global.region = config.language.value;
global.startedTime = {
    in: Date.now(),
    end: 0,
    init: 0,
};
global.tasksComplete = 0;
global.irisPath = process.cwd();
global.messagesCount = {
    groups: 0,
    private: 0,
    bot: 0,
    total: 0,
    overall: 0,
};
global.kill = {};
global.internalSocket = false;

/* Try-catch para caso seja < Windows 7 & Node < 16 */
try {
    /* Tenta usar o hostname */
    os.hostname();

    /* Se falhar */
} catch (error) {
    /* Utiliza uma alternativa */
    os.hostname = () => process.env?.COMPUTERNAME || 'localhost';
}

/**
 * Impede de desligar quando sofre erros se ativar a atualização em tempo real.
 * Configura listeners para eventos de erro e avisos do processo.
 */
if (config.codeReload.value === true) {
    /* Caso ocorra uma rejeição de promise, printa o erro com console.error */
    process.on('unhandledRejection', (why, onw) => console.error(why, `\nUnhandled Rejection at Promise:\n${onw}`));

    /* Caso ocorra uma falha sem catch, printa o erro com console.error */
    process.on('uncaughtException', (err) => console.error(err, `\nUncaught Exception thrown:\n${err}`));

    /* Caso uma promise seja rejeitada sem um handle */
    process.on('unhandledPromiseRejection', (err) => console.error(`Unhandled Promise Rejection:\n${err}`));
}

/* Caso haja um aviso */
process.on('warning', (warning) => console.warn(`Warning:\n${warning.stack}`));

/* Se acontecer esse 'erro', é algo 'grave' e o node vai fechar sozinho */
process.on('beforeExit', (code) => console.log(`Process is about to exit with code ${code}`));

/* Faz o inicio */
require('./create');
