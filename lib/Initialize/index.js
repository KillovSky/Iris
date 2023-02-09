/*
    Este local é restrito em nível máximo, o uso desta função por meio da exec causará danos.
    Por isso não existem funções exports ou Ambient, não use.
*/

/* Requires */
const fs = require('fs');

/* JSON's | Utilidades */
const config = JSON.parse(fs.readFileSync('./lib/Databases/Settings/Config.json'));
global.region = config.Language;
global.tasksComplete = 0;
global.irisPath = process.cwd();

/* Impede de desligar quando sofre erros se ativar a atualização em tempo real */
if (config.Auto_Update) {
    process.on('unhandledRejection', (why, onw) => {
        console.error(why, '\nUnhandled Rejection at Promise', onw);
    });
    process.on('uncaughtException', (err) => {
        console.error(err, '\nUncaught Exception thrown');
    });
}

/* Faz o inicio */
require('./create');
