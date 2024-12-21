/*
    SISTEMA AINDA EM PRODUÇÃO, NÃO HÁ ATUALMENTE FUNÇÕES RODANDO POR AQUI
    DEVE VIR PRONTO NA PRÓXIMA VERSÃO
*/

/* Requires */
const fs = require('fs');
// const Indexer = require('../../../index');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

/* Função que reseta tudo */
function resetAmbient(
    changeKey = {},
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define o valor padrão */
    let exporting = {
        reset: resetAmbient,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Define a envInfo padrão */
        envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

        /* Define se algum valor deve ser salvo */
        if (Object.keys(changeKey).length !== 0) {
            /* Faz a listagem de keys */
            Object.keys(changeKey).forEach((key) => {
                /* Edita se a key existir */
                if (Object.keys(envInfo).includes(key) && key !== 'developer') {
                    /* Edita a key customizada */
                    envInfo[key] = changeKey[key];
                }
            });
        }

        /* Insere a postResults na envInfo */
        envInfo.functions.poswork.value = logging.postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a runEvent na envInfo */
        envInfo.functions.events.value = runEvent;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.events]: envInfo.functions.events.value,
            },
            Developer: 'KillovSky',
            Projects: 'https://github.com/KillovSky',
        };

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Define o valor retornado */
        exporting = module.exports;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
