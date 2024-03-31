/* Arquivo sem necessidade de envInfo, pois é pequeno demais */

/* Requires */
const Indexer = require('../../index');

/* Função que faz as checagens antes dos comandos */
async function verifySystem(kill = false, env = false) {
    /* Executa apenas se os parâmetros forem válidos */
    if (typeof env === 'object' && typeof kill === 'object') {
        /* Não verifica se for o dono ou Íris */
        if (!env.value.isOwner && !env.value.isBot) {
            /* Verifica por URLs */
            let checkSuccess = await Indexer('antiurl').analizer(kill, env);

            /* Verifica por SPAM */
            if (!checkSuccess.value) {
                /* Se tiver, define como true */
                checkSuccess = await Indexer('flood').analizer(kill, env);
            }

            /* Para futuros sistemas de segurança */
            /* if (!checkSuccess.value) { checkSuccess = await Indexer('something')...; } */

            /* Retorna se pode continuar */
            return checkSuccess;
        }
    }

    /* Retorna false se os parâmetros não forem válidos ou se for o dono */
    return false;
}

/* Exporta o módulo */
module.exports = {
    security: {
        harm: verifySystem,
    },
};
