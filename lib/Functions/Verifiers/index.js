/* Arquivo sem necessidade de envInfo, pois é pequeno demais */

/* Requires */
const Indexer = require('../../index');

/* Função que faz as checagens antes dos comandos */
async function verifySystem(kill = false, env = false) {
    /* Executa apenas se os parâmetros forem válidos */
    if (typeof env === 'object' && typeof kill === 'object') {
        /* Não verifica se for o dono ou Íris */
        if (!env.value.isOwner && !env.value.isBot) {
            /* Verifica por SPAM | const pois só existe um sistema de segurança atualmente */
            const checkSuccess = await Indexer('flood').analizer(kill, env);

            /* Para futuros sistemas de segurança, definir como let acima */
            /* if (!checkSuccess) { checkSuccess = await Indexer('something')...; } */

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
