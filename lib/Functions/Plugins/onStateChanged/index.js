/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');
const language = require('../../../Dialogues');

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

/* Função que verifica o newState */
async function determineState(
    kill = envInfo.functions.spec.arguments.kill.value,
    newState = envInfo.functions.spec.arguments.newState.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Insere o state de resultado */
    envInfo.results.value = newState;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        /* As console.log's apenas printam o motivo e o que deve ser feito */
        if (typeof kill === 'object' && typeof newState === 'string') {
            /* Conflito, aparece quando tem varias sessões conectadas ao mesmo tempo */
            if (newState === 'CONFLICT' || newState === 'UNLAUNCHED') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Duplicate', true, true), 'green').value);
            }

            /* Avisa que houve desconexão da sessão entre o PC e o Telefone */
            if (newState === 'DISCONNECTED') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Disconnect', true, true), 'green').value);
            }

            /* Avisa que possui uma versão desatualizada do WhatsApp Web */
            if (newState === 'DEPRECATED_VERSION') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Deprecated', true, true), 'green').value);
            }

            /* Avisa que está recarregando uma sessão */
            if (newState === 'OPENING') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Open', true, true), 'green').value);
            }

            /* Avisa que está conectando na sessão */
            if (newState === 'PAIRING') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Pair', true, true), 'green').value);
            }

            /* Avisa que está sincronizando */
            if (newState === 'SYNCING') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Sync', true, true), 'green').value);
            }

            /* Avisa que aconteceu um timeout da sessão */
            if (newState === 'TIMEOUT') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Timeout', true, true), 'green').value);
            }

            /* Avisa que a sessão conectou */
            if (newState === 'CONNECTED') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Connect', true, true), 'green').value);
            }

            /* Avisa que tem um proxy bloqueando */
            if (newState === 'PROXYBLOCK') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Proxy', true, true), 'green').value);
            }

            /* Avisa que a sessão pode ter desconectado */
            if (newState === 'UNPAIRED' || newState === 'UNPAIRED_IDLE') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Unpaired', true, true), 'green').value);
            }

            /* Avisa de um conflito entre o navegador e user-agent, também aparece ao ser banido */
            if (newState === 'SMB_TOS_BLOCK' || newState === 'TOS_BLOCK') {
                console.log(Indexer('color').echo(`[${newState.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'States', 'Ban', true, true), 'green').value);
                console.log(Indexer('color').echo('[KILLOVSKY]', 'red').value, Indexer('color').echo(language(region, 'States', 'KillovSky', true, true), 'green').value);
            }

            /* Caso seja preciso desligar */
            if (envInfo.parameters.shutdower.value.includes(newState)) {
                /* Fecha a Íris imediatamente */
                process.exit(1);
            }

            /* Caso precise de reinicio */
            if (envInfo.parameters.restarter.value.includes(newState)) {
                /* Recarrega a sessão */
                envInfo.results.value = await kill.forceRefocus();
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

        /* Insere a determineState na envInfo */
        envInfo.functions.spec.value = determineState;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.spec]: envInfo.functions.spec.value,
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
