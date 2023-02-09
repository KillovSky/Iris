/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const language = require('../../Dialogues/index');

/* JSON's | Utilidades */
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

/* Cria a função de comando */
async function functionsEditor(
    kill = envInfo.functions.exec.arguments.kill.value,
    env = envInfo.functions.exec.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Constrói os parâmetros */
            const {
                chatId,
                id,
                isGroupMsg,
                isGroupAdmins,
                arks,
                isGroupCreator,
                funFile,
                functions,
                isOwner,
                isAllowed,
                command,
                argl,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define o nome da funcão */
            const type = command.toLowerCase();

            /* Determina quem pode executar */
            const conditions = (
                /* Se for administrador */
                (isGroupMsg && isGroupAdmins)

                /* Se for o dono do grupo */
                || (isGroupMsg && isGroupCreator)

                /* Se for o chefe da Íris */
                || (isGroupMsg && isOwner)

                /* Se for um VIP/MOD */
                || (isGroupMsg && isAllowed)

                /* Se for PV e for o Autosticker, prefix ou idioma */
                || (!isGroupMsg && ['autosticker', 'prefix', 'language'].includes(type))
            );

            /* Define se roda */
            if (conditions === true && type !== 'handlers') {
                /* Define o help */
                if (arks.includes('--help-dev') && isOwner === true) {
                    /* Manda a mensagem de ajuda de dev */
                    envInfo.results.value = await kill.reply(chatId, language(region, 'Helper', 'Developer', true, true, envInfo), id);

                    /* Se não tiver nada */
                } else if (arks.includes('--help')) {
                    envInfo.results.value = await kill.reply(chatId, language(region, 'Helper', 'User', true, true, envInfo), id);

                    /* Se for uma função de dono */
                } else if (type === 'disabled' && isOwner === true) {
                    /* Caso já esteja ativado */
                    if ((functions[type] === true && ['on', 'enable', '1'].includes(argl[0])) || (functions[type] === false && ['off', 'disable', '0'].includes(argl[0]))) {
                        /* Diz a mensagem de já ativado */
                        envInfo.results.value = await kill.reply(chatId, language(region, 'Extras', 'Defined', true, true, env.value), id);

                        /* Se tiver OK */
                    } else {
                        /* Faz a configuração do enable */
                        functions[type] = true;

                        /* Diz que ativou */
                        envInfo.results.value = await kill.reply(chatId, language(region, 'Extras', 'Finished', true, true, env.value), id);
                    }

                    /* Se for uma função de letras */
                } else if ((type === 'prefix' && !/^[a-zA-Z0-9]+$/gi.test(argl[0])) || (type === 'language' && language('G.A.L').includes(argl[0]))) {
                    /* Caso já esteja ativado */
                    if (functions[type] === argl[0]) {
                        /* Diz a mensagem de já ativado */
                        envInfo.results.value = await kill.reply(chatId, language(region, 'Extras', 'Defined', true, true, env.value), id);

                        /* Se tiver OK */
                    } else {
                        /* Faz a configuração do valor */
                        [functions[type]] = [argl[0]];

                        /* Diz que ativou */
                        envInfo.results.value = await kill.reply(chatId, language(region, 'Extras', 'Finished', true, true, env.value), id);
                    }

                    /* Se for ativar */
                } else if (['on', 'enable', '1'].includes(argl[0]) && type !== 'disabled') {
                    /* Caso já esteja ativado */
                    if (functions[type] === true) {
                        /* Diz a mensagem de já ativado */
                        envInfo.results.value = await kill.reply(chatId, language(region, 'Extras', 'Defined', true, true, env.value), id);

                        /* Se tiver OK */
                    } else {
                        /* Faz a configuração do enable */
                        functions[type] = true;

                        /* Diz que ativou */
                        envInfo.results.value = await kill.reply(chatId, language(region, 'Extras', 'Finished', true, true, env.value), id);
                    }

                    /* Se for desativar */
                } else if (['off', 'disable', '0'].includes(argl[0]) && type !== 'disabled') {
                    /* Caso já esteja ativado */
                    if (!functions[type] === false) {
                        /* Diz a mensagem de já ativado */
                        envInfo.results.value = await kill.reply(chatId, language(region, 'Extras', 'Defined', true, true, env.value), id);

                        /* Se tiver OK */
                    } else {
                        /* Faz a configuração do enable */
                        functions[type] = false;

                        /* Diz que desativou */
                        envInfo.results.value = await kill.reply(chatId, language(region, 'Extras', 'Finished', true, true, env.value), id);
                    }
                }

                /* Grava a functions em disco */
                fs.writeFileSync(funFile, JSON.stringify(functions));

                /* Se caso não for permitido */
            } else {
                /* Avisa que 'só adm' pode usar */
                envInfo.results.value = await kill.reply(chatId, language(region, 'Handler', 'Restrict', true, true, env.value), id);
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.reply(env.value.chatId, language(region, 'S.E.R', error, true, true, {
            command: 'Handler',
            time: (new Date()).toLocaleString(),
        }), env.value.id);
    }

    /* Retorna os resultados */
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

        /* Insere a functionsEditor na envInfo */
        envInfo.functions.exec.value = functionsEditor;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.exec]: envInfo.functions.exec.value,
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
