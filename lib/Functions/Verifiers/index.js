/* Arquivo sem necessidade de envInfo, pois é pequeno demais */

/* Requires */
const Indexer = require('../../index');

/* Função que faz as checagens antes dos comandos */
async function verifySystem(
    kill = false,
    env = false,
) {
    /* Define o resultado */
    let checkSuccess = false;

    /* Executa apenas se os parâmetros forem válidos */
    if (typeof env === 'object' && typeof kill === 'object') {
        /* Faz o sistema de bloqueios */
        checkSuccess = await Indexer('blockers').limit(kill, env);

        /* Faz o sistema de MUTE
        if (checkSuccess === false) {
            checkSuccess = await Indexer.Tools('silencer').Limited(kill, env);
        } */
    }

    /* Retorna se pode continuar */
    return checkSuccess;
}

/* Exporta o módulo */
module.exports = verifySystem;
