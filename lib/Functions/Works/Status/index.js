/* Requires */
const fs = require('fs');
const path = require('path');
const language = require('../../../Dialogues');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const config = JSON.parse(fs.readFileSync('./lib/Databases/Settings/Config.json'));
const custom = JSON.parse(fs.readFileSync('./lib/Databases/Users/Custom.json'));

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

/* Sistema que envia as mensagens ao iniciar */
function statusChanger(
    kill = envInfo.functions.status.arguments.kill.value,
) {
    /* Define o resultado */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define se a kill é válida */
        if (typeof kill?.getHostNumber === 'function') {
            /* Adquire o número da Íris */
            kill.getHostNumber().then(async (host) => {
                /* Converte em valor ok */
                const botNumber = `${host}@c.us`;

                /* Verifica se existe um recado ativo */
                if (custom[botNumber]?.rec?.enable === true && typeof custom[botNumber]?.rec?.on !== 'undefined') {
                    /* Verifica se o status tem 250 letras ou menos (limite do WhatsApp) */
                    if (custom[botNumber].rec.on.length >= 251) {
                        /* Caso tenha mais do que pode, avisará o dono */
                        envInfo.results.value = await kill.sendText((config.Secure_Group || config.Owner[0]), language(region, 'Extras', 'Status', true, true));

                        /* Caso esteja OK */
                    } else {
                        /* Edita o status */
                        envInfo.results.value = await kill.setMyStatus(custom[botNumber].rec.on);
                    }
                }
            });
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso der erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Aumenta as funções rodadas na inicialização */
    global.tasksComplete += 1;

    /* Retorna o dialogo */
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

        /* Insere a statusChanger na envInfo */
        envInfo.functions.status.value = statusChanger;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.status]: envInfo.functions.status.value,
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
