/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
    NÃO DELETE ESSA PASTA OU ARQUIVO!
*/

/* Armazena os manipuladores de mensagens com seus timeouts */
const messageHandlers = {};

/**
 * Adiciona um manipulador de mensagens com timeout.
 * @param {string} chatId - O ID do chat para o qual o coletor é adicionado.
 * @param {Function} handler - A função de aguardar mensagens.
 * @param {number} timeout - O tempo em milissegundos após o qual o coletor será removido.
 */
function addMessageHandler(chatId, handler, timeout = 60000) {
    /* Define se tem key da Chat, se não, cria */
    messageHandlers[chatId] = messageHandlers[chatId] || {};

    /* Define a key do handler */
    const waitCount = Object.keys(messageHandlers[chatId]).length + 1;

    /* Define o handler do local com a função a executar */
    messageHandlers[chatId][waitCount] = async (message) => {
        /* Usa dentro de try para segurança adicional */
        try {
            /* Define o retorno do handler */
            const finalResponse = await handler(message);

            /* Se o retorno do Handler for 'STOP', deleta ele */
            if (finalResponse === 'STOP') delete messageHandlers[chatId][waitCount];

            /* Como em casos de erro, se ocorrer */
        } catch (err) {
            /* Deleta a função e printa o erro */
            delete messageHandlers[chatId][waitCount];
            console.log(err);
        }
    };

    /* Define um timeout para autolimpeza */
    setTimeout(() => {
        /* Deleta a função */
        delete messageHandlers[chatId][waitCount];

        /* De acordo com o tempo limite */
    }, timeout);
}

/* Evento de mensagem recebida */
function enableCollector() {
    /* Se o socket não for false mais */
    if (internalSocket !== false) {
        /* Define o socket */
        internalSocket.onmessage = async (event) => {
            /* Executa com try, caso tenha algum problema */
            try {
                /* Faz parse dos dados da construct */
                const message = JSON.parse(event.data);

                /* Se tiver um handler no chatId */
                if (messageHandlers[message.chatId]) {
                    /* Executa todas as awaitMessages geradas nessa chatId e as insere em Array */
                    const promises = Object.keys(messageHandlers[message.chatId]).map(async (f) => {
                        /* Com async, caso haja uso de sistemas assincronos */
                        await messageHandlers[message.chatId][f](message);
                    });

                    /* Executa todas as funções assíncronas simultaneamente */
                    await Promise.all(promises);
                }

                /* Se der erro, printa na tela */
            } catch (error) {
                /* Sem censura ou formatação, pois é sistema avançado e não deve ser limitado */
                console.error(error);
            }
        };

        /* Se for, aguarda 3 segundos e faz de novo */
    } else setTimeout(enableCollector, 3000);
}

/* Executa o enableCollector para ativar o sistema */
enableCollector();

/* Exporta para uso global */
exports.awaitMessages = addMessageHandler;
