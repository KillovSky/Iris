/* eslint-disable max-len */

/* ---------------------------------------------------------------------------------- *
* Caso deseje mexer nos parâmetros de inicialização do baileys, veja isso > https://whiskeysockets.github.io/Baileys/modules.html#SocketConfig
* ---------------------------------------------------------------------------------- */

/* Requires */
const fs = require('fs');
const pino = require('pino');
const { fetchLatestBaileysVersion } = require('baileys');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Cria a função que constrói os parâmetros de inicialização */
async function generateArgs() {
    /* Define o resultado */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Criação de Object com os valores padrões */
    const startOptions = {};

    /* Define os valores que são boolean */
    const boolvalues = ['emitOwnEvents', 'fireInitQueries', 'generateHighQualityLinkPreview', 'markOnlineOnConnect', 'printQRInTerminal', 'syncFullHistory'];

    /* Define os que são números */
    const numvalues = ['defaultQueryTimeoutMs', 'connectTimeoutMs', 'keepAliveIntervalMs', 'linkPreviewImageThumbnailWidth', 'qrTimeout', 'retryRequestDelayMs'];

    /* Define os que são strings */
    const strvalues = ['waWebSocketUrl'];

    /* Try-Catch para casos de erro */
    try {
        /* Verifica todos os valores de boolean */
        boolvalues.forEach((op) => {
            /* Se for uma Boolean */
            if (typeof envInfo.parameters.settings.value[op] === 'boolean') {
                /* Insere na config */
                startOptions[op] = envInfo.parameters.settings.value[op];
            }
        });

        /* Verifica todos os valores de string */
        strvalues.forEach((op) => {
            /* Se for uma String */
            if (typeof envInfo.parameters.settings.value[op] === 'string') {
                /* E não tiver Opcional */
                if (!envInfo.parameters.settings.value[op].includes('Opcional')) {
                    /* Insere na config */
                    startOptions[op] = envInfo.parameters.settings.value[op];
                }
            }
        });

        /* Verifica todos os valores de number */
        numvalues.forEach((op) => {
            /* Se for uma String ou Number */
            if (typeof envInfo.parameters.settings.value[op] === 'number' || typeof envInfo.parameters.settings.value[op] === 'string') {
                /* E se a RegExp funcionar */
                if (/[0-9]+/g.test(envInfo.parameters.settings.value[op])) {
                    /* Insere na config */
                    startOptions[op] = Number(envInfo.parameters.settings.value[op]);
                }
            }
        });

        // Source: https://github.com/pinojs/pino/blob/master/docs/api.md#api
        // Existem centenas de configurações, inseri somente as básicas prontas...
        startOptions.logger = pino({
            level: envInfo.parameters.settings.value.pinoLogger,
        });

        /*
            Se precisar inserir valores extras, edite os seguintes, removendo-os como comentários
            Alguns valores usam 'bitwise', como o caso do processedHistoryMessages
            E alguns suportam array de objects, como o caso acima, se for o caso, basta inserir []
            Se quiser que um valor usado seja default, você pode apagar a key da object
            ----------------------------
            MAS NÃO MEXA SE NÃO SOUBER EXATAMENTE O QUE ESTÁ FAZENDO!!!
            OS VALORES JÁ INSERIDOS NÃO SÃO OS VALORES PADRÕES DO BAILEYS OU PRECONFIGURADOS
            ELES SÃO SOMENTE UMA TEMPLATE NÃO CONFIGURADA DO QUE POSSIVELMENTE É A CONFIGURAÇÃO
            NÃO USE ESSES VALORES ABAIXO, CONFIGURE-OS DE ACORDO!!!
        */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        /* startOptions.appStateMacVerification = {
            patch: false,
            snapshot: false
        }; */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Auth.ts
        /* startOptions.auth = {
            creds: {
                signedIdentityKey: {
                    private: new Uint8Array('Insert a private key'),
                    public: new Uint8Array('Insert a public key')
                },
                signedPreKey: {
                    keyId: 0,
                    keyPair: {
                        private: new Uint8Array('Insert a private key'),
                        public: new Uint8Array('Insert a public key')
                    },
                    signature: new Uint8Array('Insert a signature'),
                    timestampS: 0
                },
                registrationId: 0
            } & {
                account: {
                    accountSignature: new Uint8Array('Insert a signature'),
                    accountSignatureKey: new Uint8Array('Insert a signature key'),
                    details: new Uint8Array('Insert a signature details'),
                    deviceSignature: new Uint8Array('Insert a device signature')
                },
                accountSettings: {
                    defaultDisappearingMode: {
                        ephemeralExpiration: 0,
                        ephemeralSettingTimestamp: 0
                    },
                    unarchiveChats: false
                },
                accountSyncCounter: 0,
                advSecretKey: 'Insert a secret key',
                firstUnuploadedPreKeyId: 0,
                lastAccountSyncTimestamp: 0,
                me: {
                    id: 'Insert the contact ID',
                    imgUrl: 'Insert the profile URL picture',
                    name: 'Insert the contact name',
                    notify: 'Insert the contact name at WhatsApp',
                    status: 'Insert connection status',
                    verifiedName: 'Insert the contact name IF THE ACCOUNT IS A VERIFIED BUSINESS SERVICE LIKE WHATSAPP/FACEBOOK/HOYOVERSE'
                },
                myAppStateKeyId: 'Insert a appstate key',
                nextPreKeyId: 0,
                noiseKey: {
                    private: new Uint8Array('Insert a private key'),
                    public: new Uint8Array('Insert a public key')
                },
                platform: 'Insert the platform of system',
                processedHistoryMessages: {
                    key: {
                        fromMe: false,
                        id: 'Insert a messageKey ID',
                        participant: 'Insert a messageKey participant',
                        remoteJid: 'Insert a messageKey remoteJid'
                    },
                    messageTimestamp: 0
                },
                signalIdentities: {
                    identifier: {
                        deviceId: 0,
                        name: 'Insert the device name'
                    },
                    identifierKey: new Uint8Array('Insert a identifier key')
                }
            },
            keys: {
                SignalKeyStore: {
                    clear: async function clear() { 'Create a cleaning function here, returns void' },
                    get: async function get(type, ids) { 'Create a getter function here, returns object' },
                    set: async function set(data) { 'Create a setter function here, returns void' }
                }
            }
        }; */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        // startOptions.browser = ['Project Hermes 1.0.0', 'WhatsApp', '1.0'];

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        /* startOptions.version = [0, 0, 0]; */

        /* Se não configurou a versão corretamente */
        if (!Array.isArray(startOptions.version)) {
            /* Obtém a mais recente para usar */
            const addVersion = await fetchLatestBaileysVersion();

            /* Insere na Object de startOptions */
            startOptions.version = addVersion.version;
        }

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        /* startOptions.callOfferCache = {
            del: function del(key) { 'Create a del function to remove key from cache, returns void' },
            flushAll: function flushAll(type, ids) { 'Create a function to flush all cache, returns void' },
            set: function set(key, value) { 'Create a function to set key to value, returns void' }
            get: function get(key) { 'Create a function to get key, returns "T"' }
        }; */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        /* startOptions.mediaCache = {
            del: function del(key) { 'Create a del function to remove key from cache, returns void' },
            flushAll: function flushAll(type, ids) { 'Create a function to flush all cache, returns void' },
            set: function set(key, value) { 'Create a function to set key to value, returns void' }
            get: function get(key) { 'Create a function to get key, returns "T"' }
        }; */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        /* startOptions.msgRetryCounterCache = {
            del: function del(key) { 'Create a del function to remove key from cache, returns void' },
            flushAll: function flushAll(type, ids) { 'Create a function to flush all cache, returns void' },
            set: function set(key, value) { 'Create a function to set key to value, returns void' }
            get: function get(key) { 'Create a function to get key, returns "T"' }
        }; */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        /* startOptions.userDevicesCache = {
            del: function del(key) { 'Create a del function to remove key from cache, returns void' },
            flushAll: function flushAll(type, ids) { 'Create a function to flush all cache, returns void' },
            set: function set(key, value) { 'Create a function to set key to value, returns void' }
            get: function get(key) { 'Create a function to get key, returns "T"' }
        }; */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Message.ts
        /* startOptions.customUploadHosts = {
            hosts: {
                hostname: '',
                maxContentLengthBytes: 0
            }
        }; */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        /* startOptions.agent = function Agent() { 'Create a agent function here, returns Agent' } */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        /* startOptions.fetchAgent = function Agent() { 'Create a fetchAgent function here, returns Agent' } */

        // Source: https://axios-http.com/docs/req_config
        // NÃO RECOMENDADO, este não terá configurações em template, verifique acima
        /* startOptions.options = {} */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Auth.ts
        /* startOptions.transactionOpts = {
            delayBetweenTriesMs: 0,
            maxCommitRetries: 0
        } */

        // Source: https://github.com/WhiskeySockets/Baileys/blob/master/src/Types/Socket.ts
        /* startOptions.msgRetryCounterCache = {
            shouldIgnoreJid: function shouldIgnoreJid(jid) { 'Create a function to determine if should ignore someone, returns boolean' },
            patchMessageBeforeSending: function patchMessageBeforeSending(message, recipientJids) { 'Create a function to patch message (IMessage) before sending it, returns message object' },
            makeSignalRepository: function makeSignalRepository(auth) { 'Create a function to use "SignalAuthState", returns "SignalRepository"' }
            getMessage: function getMessage(key) { 'Create a function to prefilter messages, returns message object' },
            shouldSyncHistoryMessage: function shouldSyncHistoryMessage(msg) { 'Create a function to check if will sync messages (IHistorySyncNotification), returns boolean' }
        }; */

        /* Se for para logar via Pairing Code */
        startOptions.printQRInTerminal = !config.pairingCode.value;

        /* Se for pairing code */
        if (config.pairingCode.value) {
            /* Define o navegador */
            /* ATIVE SE A CONFIG PADRÃO DO BAILEYS NÃO FUNCIONAR NATURALMENTE! */
            /* startOptions.browser = ['Chrome (MacOS)', '', '']; */
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso der erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Define na envInfo */
    envInfo.results.value = startOptions;

    /* Manda os valores finais para criar uma sessão da Íris */
    return logging.postResults(envInfo);
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
        envInfo.functions.poswork.value = logging.postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a generateArgs na envInfo */
        envInfo.functions.create.value = generateArgs;

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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
