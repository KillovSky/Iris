/* Define o módulo contador de Tokens */
const { setMaxTokens } = require('./tokens');

/* Variável global para armazenar o pipeline e config */
let pipelineInstance = false;
let calculatedToken = 0;
global.config = global.config || {};

/**
 * Retorna se o pipeline está online.
 *
 * @returns {Object} - Objeto contendo o estado do pipeline.
 */
function modelConfigs() {
    /* Se o pipeline está inicializado */
    return {
        isOnline: pipelineInstance !== false,
        pipeline: pipelineInstance,
    };
}

/**
 * Inicializa o pipeline do modelo.
 * https://huggingface.co/models?library=transformers.js
 *
 * @param {string} [modelName='Xenova/blenderbot_small-90M'] - Nome do modelo a ser carregado.
 * @param {string} [modelType='text2text-generation'] - Tipo do modelo a ser usado.
 * @returns {Promise<Object>} - Uma promise que resolve ao carregar o pipeline do modelo.
 */
async function initializeModel(modelName = 'Xenova/blenderbot_small-90M', modelType = 'text2text-generation') {
    /* Try para casos de erro */
    try {
        /* Importa o módulo */
        const { pipeline, env } = await import('@xenova/transformers');

        /* Define o local de download dos modelos */
        env.localModelPath = './lib/Scripts/IAs/Models/';
        env.backends.onnx.wasm.wasmPaths = './lib/Scripts/IAs/Models/';
        env.cacheDir = './lib/Scripts/IAs/Models/';

        /* Configura o pipeline para o modelo especificado */
        pipelineInstance = await pipeline(modelType, modelName);

        /* Retorna o pipeline inicializado */
        return pipelineInstance;

        /* Se der erro */
    } catch (error) {
        /* Exibe o erro no console */
        console.error(error);

        /* Retorna error para parar a execução */
        return 'ERROR';
    }
}

/**
 * Gera uma resposta para a pergunta fornecida.
 *
 * @param {string} question - A pergunta para a qual a resposta deve ser gerada.
 * @returns {Promise<string>} - Uma promise que resolve com a mensagem da resposta.
 */
async function generateResponse(question) {
    /* Try para casos de erro */
    try {
        /* Verifica se o pipeline está inicializado */
        if (!pipelineInstance) return 'INIT_REQUIRED';

        /* Calcula o token se quiser */
        calculatedToken = config?.gptTokens?.value || calculatedToken || await setMaxTokens();

        /* Gera a resposta usando o modelo */
        const [output] = await pipelineInstance(question, {
            max_new_tokens: calculatedToken || 2048,
        });

        /* Retorna a resposta */
        return output;

        /* Se der erro */
    } catch (error) {
        /* Exibe o erro no console */
        console.error(error);

        /* Retorna error para parar a execução */
        return 'ERROR';
    }
}

/* Exporta as funções para serem utilizadas em outros módulos */
module.exports = { generate: generateResponse, initialize: initializeModel, config: modelConfigs };
