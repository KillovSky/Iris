/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
*/

/* Requires | Utilidades */
const Indexer = require('../index');
const listener = require('../Functions/Listener/index');

/* Utilidades */
let interval = false;

/* Função que checa se terminou tudo */
function checker(kill, saveCreds, genSession, startOptions, indexlaunch) {
    /* Verifica se finalizou tudo */
    if (global.tasksComplete >= 6) {
        /* Limpa a repetição de verificação */
        clearInterval(interval);

        /* Faz o require do inicializador */
        listener(kill, saveCreds, genSession, startOptions, indexlaunch);
    }
}

/* Função de pós inicialização */
function runTasks(kill, saveCreds, genSession, startOptions, useIndex) {
    /* Só roda 1x */
    if (useIndex === 0) {
        /* Exibe a barra de inicialização */
        console.log(Indexer('color').echo('-------------------------------', 'brightRed').value);

        /* setInterval para verificar as funções até elas finalizarem */
        interval = setInterval(checker, 1000, kill, saveCreds, genSession, startOptions, useIndex);

        /* Transmissão de KillovSky */
        Indexer('ota').check();

        /* Checa por atualizações */
        Indexer('update').check();

        /* Tarefa de inicialização dos backups */
        Indexer('zip').runner();

        /* Auto atualização dos arquivos */
        Indexer('reload').init();

        /* Inicia o Terminal */
        Indexer('terminal').starter(kill);

        /* Limpeza dos backups */
        Indexer('zip').clear();
    }
}

/* Exporta a função */
module.exports = runTasks;
