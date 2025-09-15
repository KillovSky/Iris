/*
    SISTEMA AINDA EM PRODUÇÃO, NÃO HÁ ATUALMENTE FUNÇÕES RODANDO POR AQUI
    DEVE VIR PRONTO NA PRÓXIMA VERSÃO
*/

/* Imports */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
// import Indexer from '../../../index.js';

/* Define as funções __dirname e __filename com equivalentes em ESM */
const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

/* JSON"S | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${thisDir}/utils.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Função de remoção/adição */
async function runEvent(
    kill = envInfo.functions.events.arguments.kill.value,
    events = envInfo.functions.events.arguments.events.value,
) {
    /* Começa com um try para evitar danos */
    try {
        /* Define um resultado padrão */
        envInfo.results.value = false;

        /* Define o sucesso */
        envInfo.results.success = false;

        /* Determina se algum parâmetro veio errado */
        if ([kill, events].some((f) => typeof f === 'object')) {
            /* Só roda se for pedido aguardando aprovação */
            if (events.action !== 'revoked' && events.action !== 'rejected') {
                /* Determina as funções do grupo */
                // const functions = Indexer('sql').get('groups', events.participant, events.id);

                /* Aprova a entrada */
                /* eslint-disable-next-line max-len */
                // await kill.groupRequestParticipantsUpdate(events.id, [events.participant], 'approve');
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, thisDir);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

/**
 * Restaura o ambiente e atualiza as exportações do módulo com a funcionalidade principal
 * @param {Object} [changeKey={}] - Chaves personalizadas para atualizar o envInfo
 * @param {Object} [envFile=envInfo] - Objeto com informações do ambiente
 * @param {string} [dirname=thisDir] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    changeKey = {},
    envFile = envInfo,
    dirname = thisDir,
) => logging.resetAmbient({
    functions: {
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.events]: { value: runEvent },
    },
    parameters: {
        location: { value: thisFile },
    },
}, envFile, changeKey, dirname);

/* Exporta todas as funções */
export default resetLocal();
