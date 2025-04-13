/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
*/

/* Requires | Utilidades */
const Indexer = require('../index');
const listener = require('../Functions/Listener/index');

/* Utilidades */
let interval = false;

/**
 * Função que verifica se todas as tarefas de inicialização foram concluídas.
 * @function checker
 * @param {Object} kill - Objeto principal que contém a sessão e métodos do WhatsApp.
 * @param {Function} saveCreds - Função para salvar as credenciais da sessão.
 * @param {Function} genSession - Função para gerar ou recarregar a sessão.
 * @param {Object} startOptions - Opções de inicialização para a sessão.
 * @param {number} indexlaunch - Índice de inicialização para controle de múltiplas sessões.
 * @param {Object} launchInstance - Objeto para as configurações de inicialização.
 * @returns {void}
 */
function checker(kill, saveCreds, genSession, startOptions, indexlaunch, launchInstance) {
    /* Verifica se finalizou tudo */
    if (global.tasksComplete >= 6) {
        /* Limpa a repetição de verificação */
        clearInterval(interval);

        /* Faz o require do inicializador */
        listener(kill, saveCreds, genSession, startOptions, indexlaunch, launchInstance);
    }
}

/**
 * Função de pós-inicialização que executa tarefas essenciais.
 * @function runTasks
 * @param {Object} kill - Objeto principal que contém a sessão e métodos do WhatsApp.
 * @param {Function} saveCreds - Função para salvar as credenciais da sessão.
 * @param {Function} genSession - Função para gerar ou recarregar a sessão.
 * @param {Object} startOptions - Opções de inicialização para a sessão.
 * @param {number} useIndex - Índice de inicialização para controle de múltiplas sessões.
 * @param {Object} launchInstance - Objeto para as configurações de inicialização.
 * @returns {void}
 */
function runTasks(kill, saveCreds, genSession, startOptions, useIndex, launchInstance) {
    /* Só roda 1x */
    if (useIndex === 0) {
        /* Exibe a barra de inicialização */
        console.log(Indexer('color').echo('-------------------------------', 'brightRed').value);

        /* setInterval para verificar as funções até elas finalizarem */
        /* eslint-disable-next-line max-len */
        interval = setInterval(checker, 1000, kill, saveCreds, genSession, startOptions, useIndex, launchInstance);

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
