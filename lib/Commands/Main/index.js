/* Requires */
const fs = require('fs');
const Indexer = require('../../index');

/* JSON"S | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
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

/**
 * Função assíncrona que processa e executa ações com base nas mensagens recebidas.
 *
 * @async
 * @param {Object} msg - A mensagem que está sendo processada.
 * @param {Object} original - A mensagem original que está sendo processada.
 *
 * @returns {Promise<void>} Uma promise que é resolvida após o processamento da mensagem.
 */
async function readingMessages(msg, original) {
    /* Adquire os dados da mensagem */
    const dataSets = await Indexer('construct').make(kill, msg, original);
    const shouldReact = (dataSets.value?.isCmd && config.reactOnWork?.value?.enable) === true;
    const reactMessageId = dataSets.value?.messageKey;
    let reactEndType = config.reactOnWork?.value?.emojis?.DONE || '✅';

    /* Retorna se deu erros */
    if (dataSets.success === false || dataSets.success === 'DONTRUNTHIS' || dataSets.value?.quoteThis == null) {
        logging.postResults(envInfo);
        return;
    }

    /* Define se deve reagir na mensagem como sinalização */
    if (shouldReact) {
        /* Reage com o emoji de WORKING */
        await kill.sendMessage(dataSets.value?.chatId, {
            react: {
                text: config.reactOnWork?.value?.emojis?.WAIT || '⌛',
                key: reactMessageId,
            },
        });
    }

    /* Define se deve executar caso seja comando */
    const commandExecuter = dataSets.value.isCmd ? dataSets.value.command : 'default';

    /* Define a mensagem de log */
    let consoleLogger = '';
    let simpleLog = '';

    /* Define como deve rodar a mensagem | Modo lento, mas seguro */
    if (config.ignoreSecurityChecks.value === false) {
        /* Roda as funções de mensagem */
        const stopExecution = await Indexer('verifier').harm(kill, dataSets);

        /* Só roda se nada impede acima */
        if (stopExecution.value !== true) {
            /* Faz o logging */
            consoleLogger = endLogger(kill, dataSets, commandExecuter);
            simpleLog = consoleLogger.replace(/─/gi, '-').replace(/[│|┘|┐]/gi, '|');

            /* Define se é um comando exclusivo dessa Íris */
            if (dataSets.value.arks.includes('--only')
                && dataSets.value.isCmd
                && (!dataSets.value.arks.includes(global.irisNumber.replace(/@s.whatsapp.net/gi, ''))
                || !dataSets.value.mentionedJidList.includes(global.irisNumber))) {
                return;
            }

            /* Executa uma função diretamente e retorna seus resultados */
            envInfo.results.value = await Indexer('construct').control(commandExecuter).execute(kill, dataSets);

            /* Caso mande parar */
        } else reactEndType = config.reactOnWork?.value?.emojis?.COOLDOWN || '❌';

        /* Se caso preferir o modo rápido */
    } else {
        /* Modo performance | Rápido, mas **MUITO INSEGURO!** */
        consoleLogger = endLogger(kill, dataSets, commandExecuter);
        simpleLog = consoleLogger.replace(/─/gi, '-').replace(/[│|┘|┐]/gi, '|');

        /* Define se é um comando exclusivo dessa Íris */
        if (dataSets.value.arks.includes('--only')
            && dataSets.value.isCmd
            && (!dataSets.value.arks.includes(global.irisNumber.replace(/@s.whatsapp.net/gi, ''))
            || !dataSets.value.mentionedJidList.includes(global.irisNumber))) {
            return;
        }

        /* Executa uma função diretamente e retorna uma promise */
        const commandSystem = Indexer('construct').control(commandExecuter).execute(kill, dataSets);

        /* Executa as verificações sem esperar ou pegar o retorno */
        const verifySystem = Indexer('verifier').harm(kill, dataSets);

        /* Define o resultado final na envInfo após aguardar o fim das promises */
        envInfo.results.value = await commandSystem;
        await verifySystem;
    }

    /* Se deu erro na função de comando */
    if (envInfo?.results?.value?.value === false) reactEndType = config.reactOnWork?.value?.emojis?.ERROR || '❌';

    /* Define se deve reagir na mensagem como sinalização */
    if (shouldReact) {
        /* Aguarda 2 segundos para não causar reação falha */
        await Indexer('others').sleep(2000);

        /* Reage com o emoji de DONE */
        await kill.sendMessage(dataSets.value?.chatId, {
            react: {
                text: reactEndType,
                key: reactMessageId,
            },
        });
    }

    /* Manda para o WS */
    console.socket({ ...dataSets.value, printerMessage: consoleLogger, simpleLog });
}

/**
 * Função assíncrona que processa uma lista de mensagens, executando ações com base em dados
 * extraídos de cada mensagem e enviando resultados para o WebSocket.
 *
 * @async
 * @param {Array} messages - Um array de mensagens a serem processadas. Cada mensagem será
 *                            manipulada individualmente.
 *
 * @param {Object} original - A array com as mensagens originais a serem processadas.
 *
 * @returns {Promise<Array>} Um array de resultados de todas as execuções, resolvido após
 *                            todas as mensagens terem sido processadas.
 *
 * @example
 * const messages = [...]; // Array de mensagens a serem processadas
 * processMessages(messages).then(results => {
 *     console.log(results); // Exibe os resultados após o processamento
 * });
 */
async function processMessages(messages, original) {
    /* Define uma let para o retorno do sistema */
    let results = false;

    /* Se a pessoa quer que as mensagens antigas sejam lidas */
    if (config.readOldMessages.value) {
        /* Usa promise.all para esperar a resolução de todas as execuções */
        results = await Promise.all(messages.map(async (msg) => {
            /* Rodando mensagem a mensagem */
            await readingMessages(msg, original);
        }));

        /* Se preferir apenas as novas, joga a atual para rodar ignorando o resto */
    } else await readingMessages(messages[0], original);

    /* Retorna os resultados */
    return results;
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
            /* Processa todas as mensagens */
            envInfo.results.value = await processMessages(message.messages, message);
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

/**
 * Restaura o ambiente e atualiza as exportações do módulo com a funcionalidade principal
 * @param {Object} [changeKey={}] - Chaves personalizadas para atualizar o envInfo
 * @param {Object} [envFile=envInfo] - Objeto com informações do ambiente
 * @param {string} [dirname=__dirname] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    changeKey = {},
    envFile = envInfo,
    dirname = __dirname,
) => module.exports = logging.resetAmbient({
    functions: {
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.cmds]: { value: redirectCommands },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
