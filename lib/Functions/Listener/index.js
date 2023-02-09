/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
*/

/* Requires */
const Indexer = require('../../index');

/* Inicia as funções gerais */
function createListener(kill) {
    /* Caso a função raiz seja invalida */
    if (typeof kill === 'object') {
        /* Try Catch para evitar erros */
        try {
            /* Caso der algum erro grave */
            kill.getPage().on('error', async (error) => {
                await Indexer('error').inspect(error, kill);
            });

            /* Forçar recarregamento caso obtenha erros */
            kill.onStateChanged(async (state) => {
                await Indexer('states').spec(kill, state);
            });

            /* Sistema de Welcome */
            kill.onGlobalParticipantsChanged(async (events) => {
                await Indexer('greetings').events(kill, events);
            });

            /* Sistema de recebimento de mensagens */
            kill.onAnyMessage(async (message) => {
                await Indexer('commands').cmds(kill, message);
            });

            /* Avisa que iniciou */
            console.log(Indexer('color').echo('----------- [START - OK] -----------', 'brightGreen').value);

            /* Caso der erros em algo */
        } catch (error) {
            /* Printa o erro */
            console.error(error);
        }
    }
}

/* Exporta o módulo */
module.exports = createListener;
