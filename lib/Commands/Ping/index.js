/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const os = require('os');
const Indexer = require('../../index');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const packjson = JSON.parse(fs.readFileSync('./package.json'));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Cria a função de comando */
async function pingCollector(
    kill = envInfo.functions.exec.arguments.kill.value,
    env = envInfo.functions.exec.arguments.env.value,
) {
    /* Define o uptime */
    const upTimer = (process.uptime() * 1000);

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
                arks,
                reply,
                isOwner,
                pingTime,
                isBotGroupAdmins,
                actualMoment,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Menu de ajuda DEV */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                /* Não inclui informações secretas */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Sistema de Ping-Pong */
            } else {
                /* Define a String raiz */
                let overTexts = '';

                /* Define a Object de informações */
                const myInformation = {
                    processUptime: (Indexer('number').format(upTimer)).overall,
                    readTime: pingTime,
                    botName: config.botName.value,
                    userName: config.yourName.value,
                    version: packjson.version,
                    build: packjson.build_date,
                    buildname: packjson.build_name,
                };

                /* Se quiser informações sensíveis */
                if (isOwner && arks.includes('--show')) {
                    /* Define a quantidade de chats | Grupo / PV / Total */
                    const myGroupsData = await kill.groupFetchAllParticipating();
                    myInformation.groupLeng = Object.keys(myGroupsData).length;

                    /* Define a quantidade de mensagens totais */
                    myInformation.messagesReceived = global.messagesCount.total;
                    myInformation.groupSize = global.messagesCount.groups;
                    myInformation.privateSize = global.messagesCount.private;
                    myInformation.overallSize = global.messagesCount.overall;
                    myInformation.botSize = global.messagesCount.bot;

                    /* Adquire o status */
                    const myStatuses = await kill.fetchStatus(kill.user.id.replace(/:.*@/g, '@'));

                    /* Detalhes sobre a Íris */
                    myInformation.phoneInfo = {
                        id: kill.ws.config.auth.creds.signalIdentities[0].identifier.deviceId,
                        type: kill.type,
                        number: kill.user.id.replace(/:.*/g, ''),
                        status: myStatuses?.status || 'N/A',
                        statusWhen: (myStatuses?.setAt?.toLocaleString() || 'N/A'),
                        server: isBotGroupAdmins ? 'Admin' : 'User',
                        phone: kill.ws.config.auth.creds.platform,
                        pushname: kill.user.name,
                    };

                    /* Detalhes da sessão */
                    myInformation.sessionInfo = {
                        launchSeconds: global.startedTime.init,
                        WA_VERSION: (kill.ws.config.version.join('.')),
                        startedAt: (new Date(global.startedTime.in).toLocaleString()),
                    };

                    /* Define a Object de memoria */
                    myInformation.memoryInfo = {};

                    /* Define temporariamente a memoria e informações extras */
                    const freeMemory = os.freemem();
                    const nodeMemory = process.memoryUsage();
                    const computerData = os.cpus();
                    const computerUser = os.userInfo();

                    /* Total de memoria do PC */
                    myInformation.memoryInfo.total = Math.floor(os.totalmem() / 1024 / 1024);

                    /* Memoria usada */
                    myInformation.memoryInfo.used = (myInformation.memoryInfo.total - Math.floor(freeMemory / 1024 / 1024));

                    /* Memoria livre */
                    myInformation.memoryInfo.free = Math.floor(freeMemory / 1024 / 1024);

                    /* Overall de memoria */
                    myInformation.memoryInfo.overall = Indexer('sql').languages(region, 'Helper', 'Memorystamp', true, true, myInformation.memoryInfo).value;

                    /* Memoria do Node.js */
                    myInformation.memoryInfo.node = nodeMemory;

                    /* Ajusta tudo de uma vez */
                    Object.keys(nodeMemory).forEach((nmm) => {
                        /* Direto na Object */
                        myInformation.memoryInfo.node[nmm] = (Math.round((nodeMemory[nmm] / 1024 / 1024) * 100) / 100);
                    });

                    /* Overall memoria Node.js */
                    myInformation.memoryInfo.node.overall = Object.keys(nodeMemory).map((nmi) => `${myInformation.memoryInfo.node[nmi]} MB ${nmi}`).join(' | ');

                    /* Informações do PC */
                    myInformation.computerInfo = {
                        uptime: Indexer('number').format(os.uptime() * 1000),
                        cpu: computerData[0].model,
                        cores: computerData.length,
                        speed: computerData[0].speed,
                        so: os.type(),
                        version: os.version(),
                        arch: os.arch(),
                        platform: os.platform(),
                        kernel: os.release(),
                        username: computerUser.username,
                        home: computerUser.homedir,
                        shell: (computerUser.shell || process.env.SESSIONNAME || 'Terminal'),
                        groupId: computerUser.gid,
                        userId: computerUser.uid,
                        hostname: process.env.COMPUTERNAME,
                        endianness: os.endianness(),
                    };

                    /* Informações do Node.js */
                    myInformation.process = {
                        env: process.env,
                        versions: process.versions,
                        features: process.features,
                        version: process.version,
                        platform: process.platform,
                        execPath: process.execPath,
                        argv: process.argv,
                        title: process.title,
                        pid: process.pid,
                        ppid: process.ppid,
                        arch: process.arch,
                        release: process.release,
                    };

                    /* Windows 7 tem erros com a 'os.hostname()' */
                    try {
                        /* Então tenta ajustar dentro de try-catch   */
                        myInformation.computerInfo.hostname = os.hostname();
                    } catch (err) { /* Não faz nada se falhar */ }

                    /* Adiciona as informações de debug */
                    overTexts = Indexer('sql').languages(region, 'Helper', 'Pingdev', true, true, myInformation).value;

                    /* Verifica se o dono pediu a extra */
                    if (arks.includes('--secret')) {
                        /* Adiciona junto a String */
                        overTexts += `\n\n${Indexer('sql').languages(region, 'Helper', 'Pingsecret', true, true, myInformation).value}`;
                    }
                }

                /* Tempo de execução */
                myInformation.execTime = Indexer('number').format(Date.now() - actualMoment).overall;

                /* Define o ping padrão */
                overTexts = `${Indexer('sql').languages(region, 'Helper', 'Ping', true, true, myInformation).value}\n\n${overTexts}`;

                /* Faz o envio */
                envInfo.results.value = await kill.sendMessage(chatId, { text: overTexts.replace(/'false'/gi, '❌').replace(/'true'/gi, '✔️') }, reply);
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'PING',
                time: (new Date()).toLocaleString(),
            }).value,
        }, env.value.reply);
    }

    /* Retorna os resultados */
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
        [envInfo.exports.exec]: { value: pingCollector },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
