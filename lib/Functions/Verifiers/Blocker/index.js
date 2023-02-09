/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Realiza funções de pós finalização */
function postResults(response) {
    /* Verifica se pode resetar a envInfo */
    if ((envInfo.settings.finish.value === true)
        || (envInfo.settings.ender.value === true
            && envInfo.results.success === false
        )
    ) {
        /* setTimeout para poder retornar */
        setTimeout(() => {
            /* Reseta a envInfo */
            envInfo.functions.revert.value();

            /* Reseta conforme o tempo */
        }, envInfo.settings.wait.value);
    }

    /* Retorna o resultado de uma função */
    return response;
}

/* Insere o erro na envInfo */
function echoError(error) {
    /* Determina o erro */
    const myError = !(error instanceof Error) ? new Error(`Received a instance of "${typeof error}" in function 'messedup', expected an instance of "Error".`) : error;

    /* Determina o sucesso */
    envInfo.results.success = false;

    /* Determina a falha */
    envInfo.parameters.code.value = myError.code ?? '0';

    /* Determina a mensagem de erro */
    envInfo.parameters.message.value = myError.message ?? 'The operation cannot be completed because an unexpected error occurred.';

    /* Define se pode printar erros */
    if (envInfo.settings.error.value === true) {
        /* Printa o erro */
        console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envInfo.results;
}

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Determina o que os sistemas de block rodam */
async function needStop(
    kill = envInfo.functions.limit.arguments.kill.value,
    env = envInfo.functions.limit.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se a pessoa já está bloqueada */
        if (env.value.isBlocked) {
            /* Avisa no terminal */
            console.log(
                Indexer('color').echo('[IGNORED]', 'red').value,
                Indexer('color').echo(`Ignorando comando de ${env.value.pushname} - [${env.value.user.replace(/@c.us/gi, '')}] por ele estar bloqueado...`, 'yellow').value,
            );

            /* Determina que deve parar */
            envInfo.results.value = env.value.isBlocked;
        }

        /* Auto Blocks */
        if (envInfo.parameters.BlockTypes.includes(env.value.Blocking)) {
            /* Define os tipos de usuário */
            const blockedInfo = [
                /* Dono do grupo */
                env.value.isGroupCreator,

                /* BOT */
                env.value.isBot,

                /* Moderador */
                env.value.isModerator,

                /* VIP */
                env.value.isVIP,

                /* Admin */
                env.value.isGroupAdmins,

                /* Bloqueado */
                env.value.isBlocked,

                /* Dono */
                env.value.isOwner,
            ].every((blk) => blk === false);

            /* Roda apenas se todos os acimas forem false */
            if (blockedInfo === true) {
                /* Define as condições de bloqueio */
                const conditions = (

                    /* Bloqueia mensagens em grupo, exceto comandos */
                    (env.value.Blocking === 'MSG_GP' && env.value.isGroupMsg && !env.value.isCmd)

                    /* Bloqueia mensagens em privado, exceto comandos */
                    || (env.value.Blocking === 'MSG_PV' && !env.value.isGroupMsg && !env.value.isCmd)

                    /* Bloqueia comandos em grupo, exceto mensagens */
                    || (env.value.Blocking === 'CMD_GP' && env.value.isGroupMsg && env.value.isCmd)

                    /* Bloqueia comandos em privado, exceto mensagens */
                    || (env.value.Blocking === 'CMD_PV' && !env.value.isGroupMsg && env.value.isCmd)

                    /* Bloqueia tudo */
                    || env.value.Blocking === 'ALLONE'
                );

                /* Caso a condição retorne true */
                if (conditions === true) {
                    /* Avisa no terminal */
                    console.log(
                        Indexer('color').echo('[AUTOBLOCK]', 'red').value,
                        Indexer('color').echo(`Bloqueando usuário → ${env.value.user}...`, 'yellow').value,
                    );

                    /* Bloqueia */
                    await kill.contactBlock(env.value.user);

                    /* Define bloqueado */
                    envInfo.results.value = conditions;
                }
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna a nova Array */
    return postResults(envInfo.results);
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
        envInfo.functions.poswork.value = postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = echoError;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a needStop na envInfo */
        envInfo.functions.limit.value = needStop;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.limit]: envInfo.functions.limit.value,
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
        echoError(error);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
