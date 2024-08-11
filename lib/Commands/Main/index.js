/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../index');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Realiza funções de pós finalização */
function postResults(response) {
    /* Verifica se pode resetar a envInfo */
    if (
        envInfo.settings.finish.value === true
        || (envInfo.settings.ender.value === true && envInfo.results.success === false)
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
        /* Define se vai printar inteiro */
        const showError = config?.fullError?.value || true;

        /* Se pode printar o erro inteiro */
        if (showError) {
            /* Só joga o erro na tela */
            console.error(error);

            /* Se não, formata e printa */
        } else console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envInfo.results;
}

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Funções finais de logging */
function endLogger(kill, dataSets, commandExecuter) {
    /* Define se deve printar */
    if (
        (config.consoleType.value === 1)
        || (config.consoleType.value === 2 && dataSets.value.isCmd === false)
        || (config.consoleType.value === 3 && dataSets.value.isCmd === true)
    ) {
        /* Define o tipo de print */
        const messageType = dataSets.value.isCmd ? `COMMAND ~ ${dataSets.value.typeFormatted.toUpperCase()}` : dataSets.value.typeFormatted.toUpperCase();

        /* Define a cor dela */
        const msgColor = dataSets.value.isCmd ? config.colorSet.value[4] : config.colorSet.value[1];
        const cmdColor = dataSets.value.isCmd ? config.colorSet.value[1] : config.colorSet.value[0];
        const previewText = dataSets.value.isCmd ? dataSets.value.prefix + commandExecuter.toUpperCase() : `${dataSets.value.body?.slice(0, 30) || '?'}...`;

        /* Define infos extras legais de saber */
        const extraInfo = ['isGroupAdmins', 'isBlocked', 'isMedia', 'isInvite', 'isOwner', 'isVIP', 'isModerator', 'isSticker', 'isQuotedSticker', 'isAnimated', 'isQuotedAnimated', 'isAllowed', 'isBot', 'isGroupCreator', 'isCmd', 'canSticker', 'isVideo', 'isImage', 'isAudio', 'isDocument', 'isContact', 'isContactArray', 'isLocation', 'isLiveLocation', 'isReaction', 'isGroup', 'isGroupMsg', 'isQuotedMsg', 'isViewOnce'].filter((f) => dataSets.value[f] === true);

        /* Define a mensagem a printar */
        const printMessage = `${Indexer('color').echo('│', Indexer('array').extract(config.colorSet.value).value).value
            + Indexer('color').echo('───────────────────────────────────────', cmdColor).value
            + Indexer('color').echo('┘\n', Indexer('array').extract(config.colorSet.value).value).value}${Indexer('color').echo(`│> ${messageType}`, cmdColor).value}: ${Indexer('color').echo(previewText, msgColor).value}\n`
            + `${Indexer('color').echo('│> DATA', config.colorSet.value[0]).value}: ${Indexer('color').echo(dataSets.value.time, config.colorSet.value[2]).value}\n`
            + `${Indexer('color').echo('│> SYSTEM', config.colorSet.value[0]).value}: ${Indexer('color').echo(dataSets.value.userPlatform, Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> READ PING', config.colorSet.value[0]).value}: ${Indexer('color').echo(`${dataSets.value.procTime.toString()}s`, Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> USER', config.colorSet.value[0]).value}: ${Indexer('color').echo(dataSets.value.originalPushname || dataSets.value.originalName, Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> CHATID', config.colorSet.value[0]).value}: ${Indexer('color').echo(dataSets.value.chatId || dataSets.value.user, Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> NUMBER', config.colorSet.value[0]).value}: ${Indexer('color').echo(dataSets.value.userFormated, Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> PATENTE', config.colorSet.value[0]).value}: ${Indexer('color').echo(dataSets.value.patente, Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> XP', config.colorSet.value[0]).value}: ${Indexer('color').echo(`${dataSets.value.leveling?.xp?.toString() || '0'}/${dataSets.value?.requiredXP?.toString()}` || '1000', Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> MENSAGENS', config.colorSet.value[0]).value}: ${Indexer('color').echo(dataSets.value.leveling?.messages?.toString(), Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> LEVEL', config.colorSet.value[0]).value}: ${Indexer('color').echo(dataSets.value.leveling?.level?.toString(), Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> LOCAL', config.colorSet.value[0]).value}: ${Indexer('color').echo(dataSets.value?.originalName || 'PRIVADO', Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> LANGUAGE', config.colorSet.value[0]).value}: ${Indexer('color').echo(region, Indexer('array').extract(config.colorSet.value).value).value}\n`
            + `${Indexer('color').echo('│> OUTROS', config.colorSet.value[0]).value}: ${Indexer('color').echo(extraInfo?.join(', ') || '...', Indexer('array').extract(config.colorSet.value).value).value}\n${Indexer('color').echo('│', Indexer('array').extract(config.colorSet.value).value).value}${Indexer('color').echo('───────────────────────────────────────', cmdColor).value}${Indexer('color').echo('┐', Indexer('array').extract(config.colorSet.value).value).value}`;

        /* Realiza a impressão */
        console.log(printMessage);

        /* Retorna o print da mensagem */
        return printMessage;
    }

    /* Retorna String vazia se não bater o if */
    return '';
}

/* Função principal */
async function redirectCommands(
    kill = envInfo.functions.cmds.arguments.kill.value,
    message = envInfo.functions.cmds.arguments.message.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        if (typeof kill === 'object' && typeof message === 'object') {
            /* Adquire os dados da mensagem */
            const dataSets = await Indexer('construct').make(kill, message);

            /* Retorna se deu erros */
            if (dataSets.success === false || dataSets.success === 'DONTRUNTHIS' || dataSets.value?.quoteThis == null) return postResults(envInfo.results);

            /* Define se deve executar caso seja comando */
            const commandExecuter = dataSets.value.isCmd ? dataSets.value.command : 'default';

            /* Define a mensagem de log */
            let consoleLogger = '';

            /* Define como deve rodar a mensagem | Modo lento, mas seguro */
            if (config.ignoreSecurityChecks.value === false) {
                /* Roda as funções de mensagem */
                const stopExecution = await Indexer('verifier').harm(kill, dataSets);

                /* Só roda se nada impede acima */
                if (stopExecution.value !== true) {
                    /* Faz o logging */
                    consoleLogger = endLogger(kill, dataSets, commandExecuter);

                    /* Executa uma função diretamente e retorna seus resultados */
                    envInfo.results.value = await Indexer('construct').control(commandExecuter).execute(kill, dataSets);
                }

                /* Modo performance | Rápido, mas **MUITO INSEGURO!** */
            } else {
                /* Faz o logging */
                consoleLogger = endLogger(kill, dataSets, commandExecuter);

                /* Executa uma função diretamente e retorna uma promise */
                const commandSystem = Indexer('construct').control(commandExecuter).execute(kill, dataSets);

                /* Executa as verificações sem esperar ou pegar o retorno */
                const verifySystem = Indexer('verifier').harm(kill, dataSets);

                /* Define o resultado final na envInfo após aguardar o fim das promises */
                envInfo.results.value = await commandSystem;
                await verifySystem;
            }

            /* Manda para o WS */
            console.socket({ ...dataSets.value, printerMessage: consoleLogger });
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

        /* Insere a redirectCommands na envInfo */
        envInfo.functions.cmds.value = redirectCommands;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.cmds]: envInfo.functions.cmds.value,
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
