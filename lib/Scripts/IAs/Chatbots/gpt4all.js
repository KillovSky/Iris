/* Importa as funções necessárias */
const { createCompletion, loadModel } = require('gpt4all');
const { setMaxTokens } = require('./tokens');

/* Variáveis globais para armazenar o modelo, config e a sessão de chat */
let model = null;
let chat = null;
let calculatedToken = 0;
global.config = global.config || {};
global.region = global.region || 'pt';
let modelFile = global?.config?.gptModel?.value || 'rocket-3b.Q4_0.gguf';

/**
 * Retorna o estado atual do modelo e da sessão de chat.
 *
 * @returns {Object} - Objeto contendo o estado do modelo e da sessão de chat.
 */
function modelConfigs() {
    /* Retorna os dados completos */
    return {
        isOnline: model !== null && chat !== null,
        model,
        chat,
    };
}

/**
 * Inicializa o modelo e a sessão de chat.
 *
 * @param {string} [modelName='rocket-3b.Q4_0.gguf'] - Nome do modelo a ser carregado.
 * @param {Object} [moreSettings={}] - Nome do modelo a ser carregado.
 * @param {boolean} [isCleaning=false] - Nome do modelo a ser carregado.
 * @returns {Promise<Object|string>} - Uma promise que resolve ao carregar o model, chat ou 'ERROR'.
 */
async function initializeModel(modelName = 'rocket-3b.Q4_0.gguf', moreSettings = {}, isCleaning = false) {
    /* Try para casos onde há erros maiores */
    try {
        /* Se não for para fazer a limpeza apenas */
        if (!isCleaning) {
            /* Define o modelo */
            modelFile = modelName;

            /* Calcula o token limite se necessário */
            calculatedToken = config?.gptTokens?.value || calculatedToken || await setMaxTokens();

            /* Se o modelo estiver aberto, fecha, se não crashará */
            if (model) model.dispose();

            /* Carrega o modelo com as opções especificadas */
            model = await loadModel(modelFile, {
                verbose: false,
                device: 'gpu',
                nCtx: config?.gptWindowSize?.value || 2048,
            });
        }

        /* Define a idade da Íris */
        const botAge = config?.botAge?.value || ((new Date().getFullYear()) - 2014);

        /* Define o role */
        const role = `You are a ${config?.botPersonality?.value || 'charming, charismatic, intelligent, helpful, caring, patient, and adorable'} ${config?.botGender?.value || 'human girl'}. Your sexuality is ${config?.botSexuality?.value || 'asexual and aromantic'}. Your name is ${config?.botName?.value || 'Iris'}, and you are ${botAge} years old. You were raised by ${config?.yourName?.value || 'KillovSky'}. Your communication style is ${config?.answerMode?.value || 'short, very friendly, and laid-back'}.`;

        /* Inicializa uma sessão de chat no modelo */
        chat = await model.createChatSession({
            systemPrompt: config?.gptSystemPrompt?.value.replace(/DONT_TOUCH_HERE/gi, role) || `<|im_start|>system\n${role}<|im_end|>\n`,
            nPredict: moreSettings?.nPredict || calculatedToken || 50,
            temp: config?.gptTemperature?.value || 0.3,
            temperature: config?.gptTemperature?.value || 0.3,
            promptTemplate: config?.gptPromptTemplate?.value || '<|im_start|>user\n%1<|im_end|>\n<|im_start|>assistant',
            ...moreSettings,
        });

        /* Retorna o resultado */
        return chat;

        /* Se der erro */
    } catch (error) {
        /* Exibe o erro na stderr */
        console.error(error);

        /* Retorna ERROR para sinalizar falha */
        return 'ERROR';
    }
}

/**
 * Limpa o histórico das mensagens feitas na IA.
 */
async function clearHistory() {
    /* Reinicia o histórico de chats */
    await initializeModel(modelFile, {}, true);
}

/**
 * Gera uma resposta para o prompt fornecido.
 *
 * @param {string} prompt - O prompt para o qual a resposta deve ser gerada.
 * @returns {Promise<string>} - Uma promise que resolve com a response, 'INIT_REQUIRED' ou 'ERROR'.
 */
async function generateResponse(prompt) {
    /* Try para casos onde há erros maiores */
    try {
        /* Se não iniciou ainda, retorna necessidade de inicio */
        if (!chat) return 'INIT_REQUIRED';

        /* Se chegou no limite de janela */
        if (chat?.promptContext?.nPast > config?.gptWindowSize?.value) {
            /* Reinicia o histórico de chats */
            await clearHistory();
        }

        /* Cria uma conclusão usando o prompt fornecido */
        const response = await createCompletion(chat, prompt);

        /* Acessa e retorna a mensagem da resposta */
        return response.choices[0].message;

        /* Se der erro */
    } catch (error) {
        /* Exibe o erro na stderr */
        console.error(error);

        /* Retorna ERROR para sinalizar falha */
        return 'ERROR';
    }
}

/* Exporta as funções para serem utilizadas em outros módulos */
module.exports = {
    generate: generateResponse,
    initialize: initializeModel,
    config: modelConfigs,
    clear: clearHistory,
};
