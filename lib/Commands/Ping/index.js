/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const os = require('os');
const path = require('path');
const Indexer = require('../../index');
const language = require('../../Dialogues/index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const packjson = JSON.parse(fs.readFileSync('./package.json'));

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
                quoteThis,
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
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'Developer', true, true, envInfo) }, { quoted: quoteThis });

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                /* Não inclui informações secretas */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });

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
                        status: myStatuses.status,
                        statusWhen: (myStatuses.setAt.toLocaleString()),
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
                    myInformation.memoryInfo.overall = language(region, 'Helper', 'Memorystamp', true, true, myInformation.memoryInfo);

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
                    overTexts = language(region, 'Helper', 'Pingdev', true, true, myInformation);

                    /* Verifica se o dono pediu a extra */
                    if (arks.includes('--secret')) {
                        /* Adiciona junto a String */
                        overTexts += `\n\n${language(region, 'Helper', 'Pingsecret', true, true, myInformation)}`;
                    }
                }

                /* Tempo de execução */
                myInformation.execTime = Indexer('number').format(Date.now() - actualMoment).overall;

                /* Define o ping padrão */
                overTexts = `${language(region, 'Helper', 'Ping', true, true, myInformation)}\n\n${overTexts}`;

                /* Faz o envio */
                envInfo.results.value = await kill.sendMessage(chatId, { text: overTexts.replace(/'false'/gi, '❌').replace(/'true'/gi, '✔️') }, { quoted: quoteThis });
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.sendMessage(env.value.chatId, {
            text: language(region, 'S.E.R', error, true, true, {
                command: 'Ping',
                time: (new Date()).toLocaleString(),
            }),
        }, { quoted: env.value.quoteThis });
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

        /* Insere a pingCollector na envInfo */
        envInfo.functions.exec.value = pingCollector;

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
