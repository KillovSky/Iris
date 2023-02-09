/* eslint-disable max-len */
/* ---------------------------------------------------------------------------------- *
 * Para que você possa baixar mídias, é necessário usar o chrome mais recente.
 * Realize o download no Windows 10/8.1/8/7 usando "https://www.google.com.br/chrome/".
 * Caso utilize o Linux, rode ambos os comandos abaixo e obviamente, como sudo/root.
 * ---------------------------------------------------------------------------------
 * wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
 * sudo apt install ./google-chrome-stable_current_amd64.deb
 * ---------------------------------------------------------------------------------
 * Caso deseje mexer nos parâmetros de inicialização da Wa-Automate, veja isso > https://docs.openwa.dev/interfaces/api_model_config.ConfigObject.html
 * Aqui segue uma lista dos parâmetros que podem ser usados/apagados da chromiumArgs > https://peter.sh/experiments/chromium-command-line-switches
 * Mexer nos parâmetros de inicialização do chromium pode gerar performance, se não usar errado.
 * ---------------------------------------------------------------------------------- */

/*
    Esse arquivo não será explicado linha a linha devido a quantidade de condições e demais.
    Isso faria com que ele tivesse um tamanho ainda maior.
*/

/* Requires */
const fs = require('fs');
const path = require('path');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const utils = envInfo.parameters.settings.value;

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

/* Função de emergência para caso de erros e a pessoa tenha modificado o initialize */
const shutOff = () => process.exit();

/* Cria a função que constrói os parâmetros de inicialização */
function generateArgs(
    sessionName = utils.sessionSettings.sessionID[0],
    folderSessions = `${utils.sessionSettings.sessionDataPath}/${utils.sessionSettings.sessionID[0]}`,
) {
    /* Define o resultado */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Criação de Object com os valores padrões */
    const startOptions = {};

    /*
        Abaixo são os sistemas de verificação que fazem os parâmetros de inicialização.
        Leia a página da wa automate para obter detalhes.
    */

    /* Try-Catch para casos de erro */
    try {
        /* Utiliza uma limpeza de memoria agressiva */
        if (utils.sessionSettings.aggressiveGarbageCollection !== 'Opcional | True | False') {
            startOptions.aggressiveGarbageCollection = utils.sessionSettings.aggressiveGarbageCollection;
        }

        /* Reinicia ao crashar por meio de função */
        if (utils.sessionSettings.restartOnCrash !== 'Opcional | True | False') {
            startOptions.restartOnCrash = shutOff;
        }

        /* Sessão que ativa um limitador de tempo nas funções */
        if (utils.sessionSettings.callTimeout !== 'Opcional | Number' && !Number.isNaN(Number(utils.sessionSettings.callTimeout))) {
            startOptions.callTimeout = Number(utils.sessionSettings.callTimeout);
        }

        /* Sessão que espera pela timeout de login da sessão */
        if (utils.sessionSettings.authTimeout !== 'Opcional | Number' && !Number.isNaN(Number(utils.sessionSettings.authTimeout))) {
            startOptions.authTimeout = Number(utils.sessionSettings.authTimeout);
        }

        /* A função abaixo faz screenshot do erro, pode enviar mensagens de JS_Handle se ativado */
        if (utils.sessionSettings.screenshotError !== 'Opcional | True | False') {
            startOptions.screenshotOnInitializationBrowserError = utils.sessionSettings.screenshotError;
        }

        /* Verifica se a sessão é 100% usável na primeira inicialização */
        if (utils.sessionSettings.ensureHeadfulIntegrity !== 'Opcional | True | False') {
            startOptions.ensureHeadfulIntegrity = utils.sessionSettings.ensureHeadfulIntegrity;
        }

        /* Bloqueia o envio de logs de crash para o whatsapp */
        if (utils.sessionSettings.blockCrashLogs !== 'Opcional | True | False') {
            startOptions.blockCrashLogs = utils.sessionSettings.blockCrashLogs;
        }

        /* Passa a perna no CSP */
        if (utils.sessionSettings.bypassCSP !== 'Opcional | True | False') {
            startOptions.bypassCSP = utils.sessionSettings.bypassCSP;
        }

        /* Usa patches locais em vez dos atualizados online */
        if (utils.sessionSettings.cachedPatch !== 'Opcional | True | False') {
            startOptions.cachedPatch = utils.sessionSettings.cachedPatch;
        }

        /* Ativa o cache do chrome */
        if (utils.sessionSettings.cacheEnabled !== 'Opcional | True | False') {
            startOptions.cacheEnabled = utils.sessionSettings.cacheEnabled;
        }

        /* Ativa a pasta de sessão da Íris no local desejado */
        if (utils.sessionSettings.useCustomDataDir !== 'Opcional | True | False') {
            startOptions.userDataDir = folderSessions;
        }

        /* Usa nomes customizados de sessão */
        if (utils.sessionSettings.useCustomSessionID !== 'Opcional | True | False') {
            startOptions.sessionId = sessionName;
        }

        /* Usa nomes customizados de sessão */
        if (utils.sessionSettings.useCustomSessionPath !== 'Opcional | True | False') {
            startOptions.sessionDataPath = utils.sessionSettings.sessionDataPath;
        }

        /* Usa um servidor de sticker customizado */
        if (utils.sessionSettings.useCustomStickerServer !== 'Opcional | True | False') {
            startOptions.stickerServerEndpoint = utils.sessionSettings.stickerServerEndpoint;
        }

        /* Especifica o tipo de QR */
        if (utils.sessionSettings.qrFormat !== 'Opcional | String') {
            startOptions.qrFormat = utils.sessionSettings.qrFormat;
        }

        /* Faz um fix no cors desde que esteja obtendo erros no mesmo */
        if (utils.sessionSettings.corsFix !== 'Opcional | True | False') {
            startOptions.corsFix = utils.sessionSettings.corsFix;
        }

        /* Deleta a sessão no Logout */
        if (utils.sessionSettings.deleteSessionDataOnLogout !== 'Opcional | True | False') {
            startOptions.deleteSessionDataOnLogout = utils.sessionSettings.deleteSessionDataOnLogout;
        }

        /* Ativa a DEV_Tools */
        if (utils.sessionSettings.devTools !== 'Opcional | True | False') {
            startOptions.devtools = utils.sessionSettings.devTools;
        }

        /* Ativa a interface ASCII */
        if (utils.sessionSettings.disableSpins !== 'Opcional | True | False') {
            startOptions.disableSpins = utils.sessionSettings.disableSpins;
        }

        /* Ativa os loggins de eventos, ex: participantes mudando */
        if (utils.sessionSettings.eventMode !== 'Opcional | True | False') {
            startOptions.eventMode = utils.sessionSettings.eventMode;
        }

        /* Envia uma URL pra voce escanear o QR fora do PC */
        if (utils.sessionSettings.ezQR !== 'Opcional | True | False') {
            startOptions.ezqr = utils.sessionSettings.ezQR;
        }

        /* Usa os patches da github em vez dos locais e atualizados da open-wa */
        if (utils.sessionSettings.ghPatch !== 'Opcional | True | False') {
            startOptions.ghPatch = utils.sessionSettings.ghPatch;
        }

        /* Usa a Íris de fundo */
        if (utils.sessionSettings.headless !== 'Opcional | True | False') {
            startOptions.headless = utils.sessionSettings.headless;
        }

        /* Pelo que entendi, tira o @g.us e @c.us dos ID's */
        if (utils.sessionSettings.idCorrection !== 'Opcional | True | False') {
            startOptions.idCorrection = utils.sessionSettings.idCorrection;
        }

        /* Não avisa/ignora se o user for desconectado */
        if (utils.sessionSettings.ignoreNuke !== 'Opcional | True | False') {
            startOptions.ignoreNuke = utils.sessionSettings.ignoreNuke;
        }

        /* Força a wa-automate a estar sempre atualizada */
        if (utils.sessionSettings.keepUpdated !== 'Opcional | True | False') {
            startOptions.keepUpdated = utils.sessionSettings.keepUpdated;
        }

        /* Desliga a Íris em casos de Logout */
        if (utils.sessionSettings.killClientOnLogout !== 'Opcional | True | False') {
            startOptions.killClientOnLogout = utils.sessionSettings.killClientOnLogout;
        }

        /* Desliga a Íris em casos de navegador fechar */
        if (utils.sessionSettings.killClientOnBrowserClose !== 'Opcional | True | False') {
            startOptions.killProcessOnBrowserClose = utils.sessionSettings.killClientOnBrowserClose;
        }

        /* Desliga a Íris em casos de timeout */
        if (utils.sessionSettings.killClientOnTimeout !== 'Opcional | True | False') {
            startOptions.killProcessOnTimeout = utils.sessionSettings.killClientOnTimeout;
        }

        /* Usa o modo legacy (antiga) wa automate */
        if (utils.sessionSettings.legacy !== 'Opcional | True | False') {
            startOptions.legacy = utils.sessionSettings.legacy;
        }

        /* Printa as mensagens do console do navegador */
        if (utils.sessionSettings.logConsole !== 'Opcional | True | False') {
            startOptions.logConsole = utils.sessionSettings.logConsole;
        }

        /* Printa as mensagens de erro do console do navegador */
        if (utils.sessionSettings.logConsoleErrors !== 'Opcional | True | False') {
            startOptions.logConsoleErrors = utils.sessionSettings.logConsoleErrors;
        }

        /* Função que loga os erros em formato de Object no console */
        if (utils.sessionSettings.logDebugInfoAsObject !== 'Opcional | True | False') {
            startOptions.logDebugInfoAsObject = utils.sessionSettings.logDebugInfoAsObject;
            delete startOptions.disableSpins;
        }

        /* Manda as mensagens de erro do console do navegador pra um arquivo | dir/ID/TimeStamp.log */
        if (utils.sessionSettings.logFile !== 'Opcional | True | False') {
            startOptions.logFile = utils.sessionSettings.logFile;
        }

        /* Ativa o Multiple_Devices na sessão */
        if (utils.sessionSettings.multiDevices === true) {
            startOptions.multiDevice = utils.sessionSettings.multiDevices;
        }

        /* Insere as Chromium Args, não recomendado na Multiple_Devices */
        if ((utils.chromeOptions.enableOptions === true && utils.sessionSettings.multiDevices === false) || (utils.chromeOptions.enableOptions === true && utils.chromeOptions.forcedMode === true)) {
            startOptions.chromiumArgs = utils.chromeOptions.defaultArgs;
        }

        /* Função que abre uma página com os Logs e QR's */
        if (utils.sessionSettings.popup && utils.sessionSettings.popupPort !== 'Opcional | Number' && !Number.isNaN(Number(utils.sessionSettings.popupPort))) {
        /* eslint-disable-next-line no-bitwise */
            startOptions.popup = utils.sessionSettings.popup | utils.sessionSettings.popupPort;
        }

        /* Função que faz a qualidade do QR aumentar ou cair */
        if (utils.sessionSettings.qrQuality !== 'Opcional | Number' && !Number.isNaN(Number(utils.sessionSettings.qrQuality))) {
            startOptions.qrQuality = Number(utils.sessionSettings.qrQuality);
        }

        /* Função que mexe com a timeout do QR */
        if (utils.sessionSettings.qrTimeout !== 'Opcional | Number' && !Number.isNaN(Number(utils.sessionSettings.qrTimeout))) {
            startOptions.qrTimeout = Number(utils.sessionSettings.qrTimeout);
        }

        /* Função que abre uma página com apenas o QR */
        if (utils.sessionSettings.qrPopUpOnly !== 'Opcional | True | False') {
            startOptions.qrPopUpOnly = utils.sessionSettings.qrPopUpOnly;
        }

        /* Pula o QR no terminal */
        if (utils.sessionSettings.qrLogSkip !== 'Opcional | True | False') {
            startOptions.qrLogSkip = utils.sessionSettings.qrLogSkip;
        }

        /* Modo Raspberry PI */
        if (utils.sessionSettings.raspi !== 'Opcional | True | False') {
            startOptions.raspi = utils.sessionSettings.raspi;
        }

        /* Resiza a janela */
        if (utils.sessionSettings.headless === false) {
            startOptions.headless = utils.sessionSettings.headless;
            startOptions.resizable = utils.sessionSettings.resizable;
        }

        /* Safe-Mode Usage da wa-automate */
        if (utils.sessionSettings.safeMode !== 'Opcional | True | False') {
            startOptions.safeMode = utils.sessionSettings.safeMode;
        }

        /* Printa um erro se não der pra pegar o QR */
        if (utils.sessionSettings.throwErrorOnTosBlock !== 'Opcional | True | False') {
            startOptions.throwErrorOnTosBlock = utils.sessionSettings.throwErrorOnTosBlock;
        }

        /* Faz a função não carregar outro QR em caso de sessão expirada */
        if (utils.sessionSettings.throwOnExpiredSessionData !== 'Opcional | True | False') {
            startOptions.throwOnExpiredSessionData = utils.sessionSettings.throwOnExpiredSessionData;
        }

        /* Ativa uso do chrome */
        if (utils.sessionSettings.useChrome !== 'RECOMENDADO TRUE | True | False') {
            startOptions.useChrome = utils.sessionSettings.useChrome;
        }

        /* Pula o check de segurança */
        if (utils.sessionSettings.skipBrokenMethodsCheck !== 'Opcional | True | False') {
            startOptions.skipBrokenMethodsCheck = utils.sessionSettings.skipBrokenMethodsCheck;
        }

        /* Não salva a sessão */
        if (utils.sessionSettings.skipSessionSave !== 'Opcional | True | False') {
            startOptions.skipSessionSave = utils.sessionSettings.skipSessionSave;
        }

        /* Não verifica updates da wa-automate */
        if (utils.sessionSettings.skipUpdateCheck !== 'Opcional | True | False') {
            startOptions.skipUpdateCheck = utils.sessionSettings.skipUpdateCheck;
        }

        /* Ativa o modo Stealth */
        if (utils.sessionSettings.useStealth !== 'Opcional | True | False') {
            startOptions.useStealth = utils.sessionSettings.useStealth;
        }

        /* Bloqueia o uso dos assets */
        if (utils.sessionSettings.blockAssets !== 'Opcional | True | False') {
            startOptions.blockAssets = utils.sessionSettings.blockAssets;
        }

        /* Verifica se a sessão é 100% usável na primeira inicialização */
        if (utils.sessionSettings.waitForRipeSession !== 'Opcional | True | False') {
            startOptions.waitForRipeSession = utils.sessionSettings.waitForRipeSession;
        }

        /* Auto detecta emojis feitos em ASCII */
        if (utils.sessionSettings.autoEmoji !== 'Opcional') {
            startOptions.autoEmoji = utils.sessionSettings.autoEmoji;
        }

        /* Função que baixa uma versão especifica do Chromium */
        if (utils.sessionSettings.browserRevision !== 'Opcional | Number') {
            startOptions.browserRevision = utils.sessionSettings.browserRevision;
            delete startOptions.Use_Chrome;
            delete startOptions.executablePath;
        }

        /* Insere o local correto do chrome, se não feito pelo user, caso não tenha é deletado a key */
        if ((utils.sessionSettings.useChrome === true && utils.sessionSettings.executablePath === 'INSIRA O LOCAL DO EXECUTAVEL DO CHROME') || (utils.sessionSettings.useChrome === true && !fs.existsSync(utils.sessionSettings.executablePath))) {
            /* Insere o local na Object */
            if (fs.existsSync(utils.chromePath.win32)) {
                startOptions.executablePath = utils.chromePath.win32;
                utils.sessionSettings.executablePath = utils.chromePath.win32;
            } else if (fs.existsSync(utils.chromePath.win64)) {
                startOptions.executablePath = utils.chromePath.win64;
                utils.sessionSettings.executablePath = utils.chromePath.win64;
            } else if (fs.existsSync(utils.chromePath.linuxChromeStable)) {
                startOptions.executablePath = utils.chromePath.linuxChromeStable;
                utils.sessionSettings.executablePath = utils.chromePath.linuxChromeStable;
            } else if (fs.existsSync(utils.chromePath.linuxChrome)) {
                startOptions.executablePath = utils.chromePath.linuxChrome;
                utils.sessionSettings.executablePath = utils.chromePath.linuxChrome;
            } else if (fs.existsSync(utils.chromePath.darwin)) {
                startOptions.executablePath = utils.chromePath.darwin;
                utils.sessionSettings.executablePath = utils.chromePath.darwin;
            } else {
            /* Se o local do Chrome foi configurado (COMO?) mas não foi encontrado, remove a key */
                delete startOptions.executablePath;
            }

            /* Verifica se o local está inserido */
            if (Object.keys(startOptions).includes('executablePath')) {
                /* Caso esteja inserido, salva no JSON */
                fs.writeFileSync(`${__dirname}/utils.json`, JSON.stringify(envInfo, null, 4));

                console.log('Local do chrome não configurado, escolhendo local: ', startOptions.executablePath);
            }
        }

        /* Função que adiciona a ID do discord no Sticker (Ler mais) */
        if (utils.sessionSettings.discordID !== 'Opcional') {
            startOptions.discord = utils.sessionSettings.discordID;
        }

        /* User-Agent customizada */
        if (utils.sessionSettings.customUserAgent !== 'Opcional') {
            startOptions.customUserAgent = utils.sessionSettings.customUserAgent;
        }

        /* Função que limita os QR's gerados */
        if (utils.sessionSettings.qrMax !== 'Opcional | Number' && !Number.isNaN(Number(utils.sessionSettings.qrMax))) {
            startOptions.qrMax = Number(utils.sessionSettings.qrMax);
        }

        /* Função que resiza a página para um valor customizado */
        if (utils.sessionSettings.customPageHeight !== 0 && utils.sessionSettings.viewPortWidth !== 0) {
            startOptions.viewport = {
                height: utils.sessionSettings.viewPortHeight,
                width: utils.sessionSettings.viewPortWidth,
            };
            delete startOptions.resizable;
        }

        /* Caso esteja usando proxy */
        if (utils.sessionSettings.useNativeProxy !== 'Opcional | True | False') {
            startOptions.useNativeProxy = utils.sessionSettings.useNativeProxy;
        }

        /* Função que limita o uso até x chats atingirem */
        if (utils.sessionSettings.maxChats !== 'Opcional | Number' && !Number.isNaN(Number(utils.sessionSettings.maxChats))) {
            startOptions.maxChats = Number(utils.sessionSettings.maxChats);
        }

        /* Função que limita o uso até x mensagens serem recebidas */
        if (utils.sessionSettings.maxMessages !== 'Opcional | Number' && !Number.isNaN(Number(utils.sessionSettings.maxMessages))) {
            startOptions.maxMessages = Number(utils.sessionSettings.maxMessages);
        }

        /* Seta o local do Chrome ou qualquer navegador que o puppeteer rode, como o MS-EDGE */
        if (utils.sessionSettings.executablePath !== 'INSIRA O LOCAL DO EXECUTAVEL DO CHROME') {
            startOptions.executablePath = utils.sessionSettings.executablePath;
        }

        /* Função que adiciona a licença da Wa-Automate */
        if (utils.sessionSettings.licenseKey !== 'Opcional') {
            startOptions.licenseKey = utils.sessionSettings.licenseKey;
        }

        /* Ativa o modo de segurança removendo parâmetros perigosos e mudando outros */
        if (utils.sessionSettings.safeMode === true) {
            utils.unsafeOptions.forEach((key) => {
                delete startOptions[key];
            });

            /* Só permite usar args em certas condições */
            if ((utils.sessionSettings.multiDevices === false && utils.chromeOptions.enableOptions === true)
                || (utils.chromeOptions.enableOptions === true && utils.chromeOptions.forcedMode === true)
            ) {
                startOptions.chromiumArgs = utils.chromeOptions.safeArgs;
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso der erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Define na envInfo */
    envInfo.results.value = startOptions;

    /* Manda os valores finais para criar uma sessão da Íris */
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

        /* Insere a generateArgs na envInfo */
        envInfo.functions.create.value = generateArgs;

        /* Insere a shutOff na envInfo | PERIGO: ISSO DESLIGARÁ A ÍRIS SE USADO!!! */
        envInfo.functions.exit.value = shutOff;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.create]: envInfo.functions.create.value,
                [envInfo.exports.exit]: envInfo.functions.exit.value,
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
