/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const removeAccents = require('remove-accents');
const { extractMetadata } = require('wa-sticker-formatter');
const issimilar = require('similarity');
const { downloadMediaMessage, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const Indexer = require('../../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const commands = JSON.parse(fs.readFileSync('./lib/Databases/Configurations/definitions.json'));
const levelSettings = JSON.parse(fs.readFileSync('./lib/Databases/Configurations/leveling.json'));
let arrayOfCommands = JSON.parse(Indexer('bash').bash(`bash "${irisPath}/lib/Scripts/Menu.sh" "array"`).value);
const oldLanguage = region;
let conditions = false;

/* Insere todos os comandos na arrayOfCommands */
arrayOfCommands = [...arrayOfCommands, Object.values(envInfo.parameters.alias.value).flat(5)].flat(5);
arrayOfCommands = [...new Set(arrayOfCommands)];

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

/* Faz a formatação e coleta dos dados */
async function dataCollect(
    kill = envInfo.functions.make.arguments.kill.value,
    message = envInfo.functions.make.arguments.message.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Define a Object padrão */
    let messageData = {
        actualMoment: Date.now(),
        readDate: (message.currentTimeDate / 1000).toFixed(0),
        levelSettings,
        allCommands: arrayOfCommands,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Determina se algum parâmetro veio errado */
        if (typeof kill === 'object' && typeof message === 'object') {
            /* Define a mensagem a marcar */
            [messageData.quoteThis] = [message?.messages[0] || {}];

            /* Define as condições iniciais */
            conditions = (
                /* Se a mensagem não for uma Object (possivel evento) */
                !typeof messageData.quoteThis?.message === 'object'

                /* Se não tiver mensagem (possivel evento) */
                || messageData.quoteThis?.message == null

                /* Se for um evento e não tiver indicador de mensagem */
                || (message.type === 'append' && Object.keys(messageData.quoteThis.message).every((ms) => !ms.includes('Message')))
            );

            /* Impede de continuar se a mensagem estiver com problema | Permite se for evento, impede se der problema no começo */
            if ((conditions && config.allowEvents.value === false) || messageData.quoteThis == null) return postResults(envInfo.results);

            /* Define uma Object de mensagem pra não matar o sistema */
            messageData.quoteThis.message = messageData?.quoteThis?.message || {};

            /* Se tiver ephemeralMessage ou viewOnce */
            if (Object.keys(messageData?.quoteThis?.message).includes('ephemeralMessage') || Object.keys(messageData?.quoteThis?.message).includes('viewOnceMessage') || Object.keys(messageData?.quoteThis?.message).includes('viewOnceMessageV2')) {
                /* Define um backup da mensagem para uso externo */
                messageData.quoteThis.backupMessage = message?.messages[0].message;

                /* Define a mensagem ephemeral na object message */
                messageData.quoteThis.message = messageData.quoteThis.message?.ephemeralMessage?.message || messageData.quoteThis.message?.viewOnceMessage?.message || messageData.quoteThis.message?.viewOnceMessageV2?.message || messageData.quoteThis.message?.viewOnceMessage?.message || messageData.quoteThis.message?.viewOnceMessageV2 || messageData.quoteThis.message?.ephemeralMessage;
            }

            /* Define a medição de tempo */
            messageData.timestamp = messageData.quoteThis.messageTimestamp || Date.now();

            /* Define o Ping avançado */
            messageData.pingTime = Indexer('number').format(messageData.readDate - messageData.timestamp).overall;

            /* Define o Ping */
            messageData.procTime = Indexer('number').format(messageData.readDate - messageData.timestamp).seconds;

            /* Define se é editada */
            messageData.editedMessageObj = Indexer('others').findkey(messageData.quoteThis, ['editedMessage'], ['object'], ['contextInfo', 'quotedMessage']).value;
            messageData.editedMessage = !!messageData?.editedMessageObj;

            /* Define a key da mensagem */
            const chatMessage = messageData.quoteThis.key;
            messageData.messageKey = chatMessage;

            /* Define se é ViewOnce */
            let isViewOnce = messageData.quoteThis.message?.viewOnceMessageV2 || messageData.quoteThis.message?.viewOnceMessage;
            isViewOnce = isViewOnce ? isViewOnce[Object.keys(isViewOnce)[0]] : isViewOnce;
            messageData.isViewOnce = isViewOnce;

            /* Roda o sistema de eventos */
            const eventRunner = await Indexer('events').execute(kill, messageData.quoteThis);

            /* Define as condições */
            conditions = (
                /* Mensagem de si mesmo, mas não permitido pelo dono */
                (chatMessage?.fromMe && config.botCommands.value === false)

                /* Mensagens editadas */
                || messageData.editedMessage

                /* Atualizações de enquetes */
                || (Object.keys(messageData.quoteThis?.message).includes('pollUpdate') && config.listenPolls.value === false)

                /* Transmissões */
                || (messageData.quoteThis.broadcast === true && config.listenBroadcasts.value === false)

                /* Reações em mensagens */
                || (Object.keys(messageData.quoteThis?.message).includes('reactionMessage') && config.listenReactions.value === false)

                /* Se o evento mandar parar */
                || eventRunner.value === 'STOP'
            );

            /* Define se deve ignorar o processamento das mensagens da Íris, editadas, broadcast e reações como mensagens normais */
            if (conditions) {
                /* Define soft error */
                envInfo.results.success = 'DONTRUNTHIS';
                envInfo.results.value = {};

                /* Retorna algo */
                return envInfo.results;
            }

            /* Busca avançada de object para localizar a perfeita, faz isso em 4 niveis de busca */
            const messageKeys = ['audioMessage', 'bcallMessage', 'botInvokeMessage', 'buttonsMessage', 'buttonsResponseMessage', 'contactMessage', 'conversation', 'contactsArrayMessage', 'documentMessage', 'documentWithCaptionMessage', 'editedMessage', 'ephemeralMessage', 'extendedTextMessage', 'groupInviteMessage', 'groupMentionedMessage', 'imageMessage', 'interactiveMessage', 'interactiveResponseMessage', 'invoiceMessage', 'listMessage', 'listResponseMessage', 'liveLocationMessage', 'locationMessage', 'lottieStickerMessage', 'messageHistoryBundle', 'newsletterAdminInviteMessage', 'orderMessage', 'pollCreationMessage', 'pollCreationMessageV2', 'pollCreationMessageV3', 'pollUpdateMessage', 'productMessage', 'protocolMessage', 'ptvMessage', 'reactionMessage', 'requestPaymentMessage', 'scheduledCallCreationMessage', 'scheduledCallEditMessage', 'sendPaymentMessage', 'senderKeyDistributionMessage', 'stickerMessage', 'templateButtonReplyMessage', 'templateMessage', 'videoMessage', 'viewOnceMessage', 'viewOnceMessageV2', 'viewOnceMessageV2Extension'];
            let recMessage = messageData?.quoteThis;
            recMessage = Indexer('others').findkey(recMessage, messageKeys, ['object', 'string'], ['contextInfo', 'quotedMessage']).value || recMessage;
            recMessage = Indexer('others').findkey(recMessage, messageKeys, ['object', 'string'], ['contextInfo', 'quotedMessage']).value || recMessage;
            recMessage = Indexer('others').findkey(recMessage, messageKeys, ['object', 'string'], ['contextInfo', 'quotedMessage']).value || recMessage;
            recMessage = Indexer('others').findkey(recMessage, messageKeys, ['object', 'string'], ['contextInfo', 'quotedMessage']).value || recMessage;

            /* Se for mensagem editada */
            messageData.quoteThis = messageData.editedMessage ? recMessage : messageData.quoteThis;

            /* Por mais que eu não goste disso, o try-catch aqui é essencial para lidar com mensagens bugadas que o Baileys envia, como a futureProofMessage (???) */
            try {
                /* Define o peso se não tiver */
                recMessage.fileLength = recMessage?.fileLength || { low: 1000, high: 0, unsigned: false };

                /* Se der erro */
            } catch (err) {
                /* Printa a mensagem pedindo para criar um report, pois essa informação será de extrema utilidade para correções */
                console.log('\x1b[31m', 'REPORT THIS TO PROJECT ÍRIS [https://github.com/KillovSky/Iris]!\n', `\x1b[33m${JSON.stringify(message)}`);

                /* Printa o erro */
                console.error(err);

                /* Define soft error */
                envInfo.results.success = 'DONTRUNTHIS';
                envInfo.results.value = {};

                /* Retorna algo */
                return envInfo.results;
            }

            /* Define a mensagem na envInfo */
            messageData.basemessage = message;

            /* Define a mídia criptografada na envInfo */
            messageData.encryptMedia = recMessage;

            /* Define a marcação de mensagem */
            messageData.quotedMsg = Indexer('others').findkey(recMessage, ['contextInfo'], ['object'], []).value || {};
            messageData.isQuotedMsg = Object.keys(messageData.quotedMsg).length > 1;

            /* Define a marcação de mensagem com objeto e se é viewOnce */
            messageData.quotedMsgObj = messageData.quotedMsg?.quotedMessage ? messageData.quotedMsg?.quotedMessage[Object.keys(messageData.quotedMsg.quotedMessage)[0]] : {};
            const isQuotedViewOnce = messageData.quotedMsgObj?.message;

            /* Se for uma mensagem marcada com key Message ainda, reduz novamente */
            messageData.quotedMsgObj = isQuotedViewOnce ? isQuotedViewOnce[Object.keys(isQuotedViewOnce)[0]] : messageData.quotedMsgObj;

            /* Se a quoted object estiver vazia, define como a quotedMessage padrão */
            messageData.quotedMsgObj = messageData.isQuotedMsg && messageData.quotedMsgObj == null ? messageData.quotedMsg : messageData.quotedMsgObj;

            /* Determina se é uma mídia */
            messageData.isMedia = !!recMessage?.mimetype;
            messageData.decryptFormats = ['ppic', 'product', 'image', 'video', 'sticker', 'audio', 'gif', 'ptt', 'thumbnail-document', 'thumbnail-image', 'thumbnail-link', 'thumbnail-video', 'md-app-state', 'md-msg-hist', 'document', 'product-catalog-image', 'payment-bg-image'];

            /* Determina o tipo de mensagem */
            messageData.type = Object.keys(messageData.quoteThis.message)[0] || 'conversation';
            messageData.typeFormatted = messageData.type.replace('Message', '');

            /* Define a hora de agora */
            messageData.dateOfDay = (new Date()).getHours();

            /* Define o tempo formatado */
            messageData.time = new Date(messageData.timestamp * 1000).toLocaleString();

            /* Define o tempo de execução de debug */
            messageData.debugExec = Indexer('number').format((Date.now() / 1000) - messageData.readDate).seconds;

            /* Comando debug */
            if (recMessage?.caption === '/debugping' || recMessage === '/debugping' || recMessage?.text === '/debugping') return await kill.sendMessage((chatMessage?.remoteJid || chatMessage?.participant), { text: `Debug (Read): ${messageData.procTime}s\nDebug (Exec): ${messageData.debugExec.toFixed(6)}s` }, { quoted: messageData.quoteThis });

            /* --------------------- Mensagem --------------------------- */

            /* Define o usuário */
            messageData.sender = chatMessage?.participant || {};

            /* Determina a Chat */
            messageData.chat = chatMessage?.remoteJid.includes('@g.us') ? await kill.groupMetadata(chatMessage?.remoteJid) : {};

            /* Define o nome do grupo */
            messageData.originalName = messageData.chat?.subject || '';
            messageData.name = messageData.originalName;

            /* Troque a linha acima por essa abaixo, caso der erros em ASCII e demais */
            // eslint-disable-next-line no-useless-escape
            /* messageData.name = messageData.originalName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); */

            /* Define o número de quem enviou */
            messageData.user = chatMessage?.participant || chatMessage?.remoteJid || '';

            /* Define uma user formatada */
            messageData.userFormated = messageData.user.replace(/@s.whatsapp.net|@g.us/gi, '');

            /* Define o nome de usuário */
            messageData.originalPushname = message?.messages[0]?.pushName || '"Censored by Government"';
            messageData.pushname = messageData.originalPushname;

            /* Troque a linha acima por essa abaixo, caso der erros em ASCII e demais */
            /* eslint-disable-next-line no-useless-escape */
            /* messageData.pushname = messageData.originalPushname.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); */

            /* Determina a ID do Chat */
            messageData.chatId = chatMessage?.remoteJid || messageData.user || '';
            messageData.chatId = messageData.chatId === 'status@broadcast' ? messageData.user : messageData.chatId;

            /* Determina se é um grupo */
            messageData.isGroup = messageData.chatId.includes('@g.us') || false;

            /* Redefine o nome do grupo se for PV */
            messageData.name = messageData.isGroup ? messageData.name : 'PV';

            /* Determina se é uma mensagem em grupo */
            messageData.isGroupMsg = messageData.isGroup;

            /* Define a ID */
            messageData.id = chatMessage?.id || '';

            /* Cria uma cópia da ID por segurança */
            messageData.serial = messageData.id;

            /* Define o mimetype */
            messageData.mimetype = recMessage?.mimetype || '';

            /* Define se é video */
            messageData.isVideo = ['video/mp4', 'video', 'video/mpeg', 'video/quicktime', 'video/x-flv', 'video/x-ms-asf', 'video/avi', 'video/3gpp'].includes(messageData.mimetype);

            /* Define se é imagem */
            messageData.isImage = ['image', 'image/jpeg', 'image/bmp', 'image/png', 'image/webp'].includes(messageData.mimetype);

            /* Define se pode ser feito sticker disso */
            messageData.canSticker = messageData.isImage || messageData.isVideo || false;

            /* -------------------- Functions ----------------------- */

            /* Define os JSONs */
            const stockDefault = Indexer('sql').env().parameters.standard.value;
            let functions = stockDefault.Groups;
            let {
                Leveling,
                Bank,
            } = stockDefault;

            /* Dados pessoais */
            messageData.personal = Indexer('sql').get('personal', messageData.user, messageData.chatId).value;

            /* Se for DB antiga */
            if (messageData.personal.name.number === '0') {
                /* Atualiza o número */
                messageData.personal = Indexer('sql').update('personal', messageData.user, messageData.chatId, 'name', { number: messageData.userFormated }).value;
            }

            /* Determina o arquivo de dados */
            if (messageData.isGroup === true && /@g.us/gi.test(messageData.chatId) && /@s.whatsapp.net/g.test(messageData.user)) {
                /* Ajusta a leveling para o valor real */
                Leveling = Indexer('sql').get('leveling', messageData.user, messageData.chatId).value;

                /* Ajusta a bank para o valor correto */
                Bank = Indexer('sql').get('bank', messageData.user, messageData.chatId).value;

                /* Adquire as funções de grupo ativas */
                functions = Indexer('sql').get('groups', messageData.user, messageData.chatId).value;

                /* Adiciona +1 no contador de mensagens, e 10 no XP */
                Indexer('sql').update('leveling', messageData.user, messageData.chatId, 'messages', 1);
                Indexer('sql').update('leveling', messageData.user, messageData.chatId, 'xp', Number(levelSettings.messageXP.value));
            }

            /* Redefine o idioma */
            region = oldLanguage;

            /* Define a região com base nas condições fornecidas */
            if (functions.language?.enable && Indexer('sql').languages('G.A.L').includes(functions.language?.text)) {
                /* Define como o armazenado nas funções de grupo */
                region = functions.language?.text;
            }

            /* Se for PV e tiver ativado a language */
            if (messageData.personal.language?.enable && Indexer('sql').languages('G.A.L').includes(messageData.personal.language?.text)) {
                /* Define com base no valor padrão */
                region = messageData.personal.language?.text;
            }

            /* Define o nome da pessoa, caso ainda esteja em default, se um dia não der pra obter o nome, esse nome aqui será usado */
            if (messageData.personal.name?.text !== 'default' && messageData?.pushname === '"Censored by Government"') {
                /* Nome pela database */
                messageData.pushname = messageData.personal.name?.text;

                /* Se a database estiver desatualizada e o pushname puder ser obtido */
            } else if ((messageData.personal.name.text === 'default' || messageData.personal.name.text !== messageData.pushname) && messageData.pushname !== '"Censored by Government"') {
                /* Atualiza a database com o nome atual */
                messageData.personal = Indexer('sql').update('personal', messageData.user, messageData.chatId, 'name', {
                    text: messageData.pushname, lastDate: Date.now(), number: messageData.userFormated, lastValue: messageData.personal.name.text, firstEdition: messageData.personal.name.firstEdition || messageData.personal.name.text, firstDate: messageData.name.firstDate || Date.now(),
                }).value;
            }

            /* Define o nome do grupo na DB caso tenha mudado */
            if (functions.name?.text !== messageData.name && messageData.isGroup === true) {
                /* Atualiza a database com o nome atual */
                functions = Indexer('sql').update('groups', messageData.user, messageData.chatId, 'name', {
                    text: messageData.name, lastDate: Date.now(), lastValue: functions.name.text,
                }).value;
            }

            /* --------------------- Body --------------------------- */

            /* Determina o texto, a array esta organizada de forma a obter na ordem dela, se achar a caption não vai buscar text e outros */
            const bodyKeys = ['caption', 'conversation', 'text', 'selectedId', 'selectedRowId', 'selectedButtonId', 'matchedText', 'displayName', 'title', 'fileName', 'selectedDisplayText', 'note', 'body', 'description'];
            messageData.body = Indexer('others').findkey(recMessage, bodyKeys, ['string', 'number'], ['contextInfo', 'quotedMessage']).value || Indexer('others').findkey(messageData.quoteThis, bodyKeys, ['string', 'number'], ['contextInfo', 'quotedMessage']).value || Indexer('others').findkey(message?.messages[0], bodyKeys, ['string', 'number'], ['contextInfo', 'quotedMessage']).value || '';
            messageData.body = messageData.typeFormatted === 'sticker' || (messageData.isMedia && !recMessage?.caption) ? '' : messageData.body;
            messageData.body = (messageData.isCmd && messageData.isQuotedMsg) || !messageData.isQuotedMsg || !messageData.isCmd ? messageData.body : '';

            /* Define se teve URLs */
            messageData.urlData = Indexer('regexp').urls(messageData.body).value;

            /* Define se a mensagem é um convite */
            messageData.isInvite = Indexer('regexp').invite(messageData.body).value || messageData.type === 'groupInviteMessage' || messageData.body?.includes('chat.whatsapp.net') || false;

            /* Cria uma copia da body para eventuais razões */
            messageData.message = messageData.body;

            /* Define os argumentos */
            messageData.arguments = messageData.body.split(/ +/);

            /* Define os argumentos sem o comando */
            messageData.args = messageData.arguments.slice(1);

            /* Junta os argumentos de texto */
            messageData.arg = messageData.args.join(' ');

            /* Define os argumentos em Lowercase */
            messageData.argl = messageData.args.map((al) => al.toLowerCase());

            /* Junta os argumentos em Lowercase */
            messageData.arks = messageData.argl.join(' ');

            /* Define os argumentos em Uppercase */
            messageData.argc = messageData.args.map((ac) => ac.toUpperCase());

            /* Junta os argumentos em Uppercase */
            messageData.arqc = messageData.argc.join(' ');

            /* Extrai os emojis do body */
            messageData.emojis = messageData.body.match(/[\p{Emoji}]/gu) || [];

            /* --------------------- Prefix --------------------------- */

            /* Determina o prefix padrão */
            let prefixes = config?.prefixes.value.filter((p) => p === messageData.body.slice(0, 1));
            messageData.prefix = prefixes[0] || '/';

            /* Verifica se é outro prefix */
            if (messageData.isGroupMsg) {
                /* Verifica se o prefix atual é parte */
                if (functions.prefix.enable === true) {
                    /* Verifica por prefixos */
                    prefixes = functions.prefix.values.filter((p) => p === messageData.body.slice(0, 1));

                    /* Define o customizado ou um da lista, impossibilitando rodar comandos sem ele */
                    messageData.prefix = prefixes[0] || functions.prefix.values[0] || '/';
                }
            }

            /* --------------------- Commands --------------------------- */

            /* Determina se é um comando */
            messageData.isCmd = messageData.body.startsWith(messageData.prefix);

            /* Define a mensagem decriptada */
            messageData.decryptedMedia = messageData.isCmd && messageData.decryptFormats.includes(messageData.typeFormatted) && !messageData.quoteThis.message.viewOnceMessageV2 && ((recMessage?.fileLength?.low || recMessage?.fileLength?.high || 1000) / 1024) <= config.maxDecryptSize.value ? await downloadMediaMessage(messageData.quoteThis, 'buffer') : '';

            /* Adquire a primeira palavra e converte em lowercase */
            messageData.command = (messageData.body
                .trim()
                .split(/ +/)
                .shift()
                .toLowerCase()
            );

            /* Se for mesmo um comando, tira o prefix dele */
            messageData.command = (messageData.isCmd === true ? messageData.command.slice(messageData.prefix.length) : messageData.command);

            /* Remove os acentos dela */
            messageData.command = removeAccents(messageData.command);

            /* Determina a pasta de verificação por case */
            let commander = Object.keys(envInfo.parameters.alias.value).filter((cm) => envInfo.parameters.alias.value[cm].includes(messageData.command));
            commander = commander[0] || 'Default';

            /* --------------------- ADMS/Donos/Membros --------------------------- */

            /* Faz a busca automatica por menções */
            const mentionFinder = Indexer('others').findkey(recMessage, ['mentionedJid'], ['array', 'object'], []);

            /* Define as menções */
            messageData.mentionedJidList = Indexer('others').findkey(recMessage, ['mentionedJid'], ['object', 'array'], []).value || [];
            messageData.mentionedJidList.push(messageData.quotedMsg?.participant || messageData.user);

            /* Insere o autor da mensagem também */
            messageData.mentionedJidList.push(messageData.user);

            /* Se houve menções */
            if (typeof mentionFinder.value === 'object') {
                /* Adiciona elas no inicio de tudo */
                messageData.mentionedJidList = [...mentionFinder.value, ...messageData.mentionedJidList];
            }

            /* Define formatada */
            messageData.mentionedJidListFormated = messageData.mentionedJidList.map((s) => s.replace(/@s.whatsapp.net|@/gi, ''));

            /* Ajusta tirando valores errados */
            messageData.mentionedJidListFormated = messageData.mentionedJidListFormated.filter((s) => /[0-9]+/gi.test(s));
            messageData.mentionedJidList = messageData.mentionedJidList.filter((s) => s.includes('@s.whatsapp.net'));

            /* Remove duplicações */
            messageData.mentionedJidListFormated = [...new Set(messageData.mentionedJidListFormated)];
            messageData.mentionedJidList = [...new Set(messageData.mentionedJidList)];

            /* Determina os membros padrões do grupo */
            messageData.groupMembersId = [messageData.user];

            /* Verifica apenas se for grupo */
            if (messageData.isGroupMsg === true) {
                /* Filtra os membros sem a função async */
                messageData.groupMembersId = messageData.chat?.participants?.map((prs) => prs.id) || [];
            }

            /* Define os IDs dos participantes do grupo, mas formatados */
            messageData.groupMembersIdFormated = messageData.groupMembersId.map((us) => us.replace(/@g.us|@s.whatsapp.net/gi, ''));

            /* Determina os ADMS padrões */
            messageData.groupAdmins = [];

            /* Verifica os ADMS apenas em grupo */
            if (messageData.isGroupMsg === true) {
                /* Filtra os ADMS sem a função async */
                messageData.groupAdmins = messageData.chat?.participants?.filter((prs) => prs?.admin === 'admin' || prs?.admin === 'superadmin') || [];

                /* Obtém somente os números */
                messageData.groupAdmins = messageData.groupAdmins.map((udm) => udm?.id) || [];
            }

            /* Define uma groupAdmins formatada */
            messageData.groupAdminsFormated = messageData.groupAdmins.map((ausr) => (ausr || '').replace(/@g.us|@s.whatsapp.net/gi, ''));

            /* Verifica se faz parte dos ADMS */
            messageData.isGroupAdmins = messageData.groupAdmins?.includes(messageData.user) || false;

            /* Verifica se a Íris é ADM */
            messageData.isBotGroupAdmins = messageData.groupAdmins?.includes(global.irisNumber) || false;

            /* Define se é o criador do grupo */
            messageData.groupCreator = messageData.chat?.participants?.filter((prs) => prs?.admin === 'superadmin')[0];
            messageData.isGroupCreator = messageData.groupCreator === messageData.user;

            /* Define se é o dono */
            messageData.isOwner = config?.owner?.value?.includes(messageData.user) || messageData.body.includes(config?.secretKey?.value) || false;

            /* Define se é a Íris */
            messageData.isBot = chatMessage?.fromMe || global.irisNumber === messageData.user || false;

            /* Define a plataforma do usuário */
            messageData.userPlatform = 'WhatsApp Web';
            messageData.userPlatform = chatMessage.id.length > 30 ? 'Android' : messageData.userPlatform;
            messageData.userPlatform = chatMessage.id.substring(0, 2) === '3A' ? 'iOS' : messageData.userPlatform;

            /* --------------------- Membros --------------------------- */

            /* Adquire os bloqueados */
            messageData.blockNumber = await kill.fetchBlocklist();

            /* Define se o usuário está bloqueado */
            messageData.isBlocked = messageData.blockNumber.includes(messageData.user);

            /* --------------------- Sticker --------------------------- */

            /* Define uma let para não substituir a config */
            let stckAuth = config.stickerAuthor.value;

            /* Verifica se pode deixar os dados do sticker com nome do grupo */
            if (config.stickerAuthor.value.includes('DONTEDITUSER')) {
                /* Se sim, remove os acentos e troca pelo nome */
                stckAuth = removeAccents(config.stickerAuthor.value.replace(/DONTEDITFROM/g, messageData.name).replace(/DONTEDITUSER/g, messageData.pushname).replace(/DONTEDITBY/g, config.botName.value).replace(/DONTEDITMADEAS/g, new Date().toLocaleString()));
            }

            /* Define o Pack do Sticker */
            const stckPack = (removeAccents(config.stickerPack.value) || '🔰 Legião Z [linktr.ee/killovsky] Íris ⚜️');

            /*
                Metadados do Sticker
                type = 'default', 'crop', 'full', 'circle, 'rounded'
                background = {r:0,g:0,b:0,alpha:1}, #ffffff
            */
            messageData.stickerConfig = {
                author: stckAuth,
                pack: stckPack,
                type: undefined,
                categories: messageData.emojis[0] != null ? messageData.emojis : undefined,
                quality: 100,
                background: 'transparent',
                id: config.botName.value,
            };

            /* --------------------- Outros --------------------------- */

            /* Define se é um VIP */
            messageData.isVIP = false;
            messageData.isModerator = false;

            /* Verifica os mods e vips apenas se houver mensagem em grupo */
            if (messageData.isGroupMsg) {
                /* Define se é um VIP */
                messageData.isVIP = functions?.vips?.values?.includes(messageData.user.userFormated) && functions?.vips?.enable === true;

                /* Define se é um MOD */
                messageData.isModerator = functions?.mods?.values?.includes(messageData.userFormated) && functions?.mods?.enable === true;
            }

            /* Sugere um comando */
            messageData.suggestCMD = Indexer('array').extract(arrayOfCommands).value;

            /* Verifica se é um comando */
            if (messageData.isCmd === true) {
                /* Define a remoção do comando */
                const removeRegExp = new RegExp(`^${messageData.command}`, 'gi');

                /* Remove o prefix e comando */
                messageData.body = messageData.body.slice(1).replace(removeRegExp, '');
            }

            /* Define dois números da sorte */
            messageData.side = Indexer('numbers').randnum(1, 2).value;
            messageData.lvpc = Indexer('numbers').randnum(1, 100).value;

            /* Define o tipo de chat para argumento */
            messageData.typeChat = messageData.isGroupMsg ? 'groups' : 'private';

            /* Se não for a Íris */
            if (!messageData.isBot) {
                /* Adiciona 1 no contador de mensagens gerais */
                global.messagesCount[messageData.typeChat] += 1;

                /* Se for adiciona 1 no contador da Íris */
            } else global.messagesCount.bot += 1;

            /* Ajusta a contagem final */
            global.messagesCount.total = global.messagesCount.groups + global.messagesCount.private;
            global.messagesCount.overall = global.messagesCount.groups + global.messagesCount.bot + global.messagesCount.private;

            /* Define o tipo de nome a usar */
            messageData.typeName = messageData.isGroupMsg ? messageData.name : messageData.pushname;

            /* Define o tipo de ID sem sufixo a usar */
            messageData.typeId = (messageData.isGroupMsg ? messageData.chatId : messageData.user).replace(/@s.whatsapp.net|@g.us/gi, '');

            /* Escolhe um membro aleatório */
            messageData.randomMember = Indexer('arrays').extract(messageData.groupMembersId).value;

            /* Comando com uppercase na 1 letra */
            messageData.upperCommand = Indexer('string').upperland(messageData.command).value;

            /* Alias dos comandos */
            messageData.alias = envInfo.parameters.alias.value[commander] || [];

            /* JSONs na messageData */
            messageData.functions = functions;
            messageData.leveling = Leveling;
            messageData.bank = Bank;

            /* Define se é VIP */
            messageData.isAllowed = (
                /* VIP */
                (messageData.isVIP && commands.vipCommands.includes(messageData.cmd))

                /* MOD */
                || (messageData.isModerator && commands.moderatorCommands.includes(messageData.command))

                /* Dono */
                || messageData.isOwner

                /* Admin */
                || messageData.isGroupAdmins

                /* None */
                || false
            );

            /* Ajusta o administrador */
            messageData.isGroupAdmins = messageData.isAllowed;

            /* ----------------------- SECURITY ----------------------- */

            /* Definições para os sistemas de segurança, já usadas acima em outras formas */
            messageData.oldbody = message?.messages[0].message?.conversation || '';
            messageData.content = Indexer('others').findkey(recMessage, ['content'], ['string'], ['contextInfo', 'quotedMessage']).value || '';
            messageData.caption = Indexer('others').findkey(recMessage, ['caption'], ['string'], ['contextInfo', 'quotedMessage']).value || '';
            messageData.comment = Indexer('others').findkey(recMessage, ['comment'], ['string'], ['contextInfo', 'quotedMessage']).value || '';
            messageData.filename = Indexer('others').findkey(recMessage, ['filename'], ['string'], ['contextInfo', 'quotedMessage']).value || '';
            messageData.matchedText = Indexer('others').findkey(recMessage, ['matchedText'], ['string'], ['contextInfo', 'quotedMessage']).value || '';
            messageData.text = Indexer('others').findkey(recMessage, ['text'], ['string'], ['contextInfo', 'quotedMessage']).value || '';
            messageData.descriptionT = Indexer('others').findkey(recMessage, ['description'], ['string'], ['contextInfo', 'quotedMessage']).value || '';
            messageData.titleT = Indexer('others').findkey(recMessage, ['title'], ['string'], ['contextInfo', 'quotedMessage']).value || '';
            messageData.pollName = messageData.quoteThis.message?.pollCreationMessage?.name;
            messageData.pollOptions = messageData.quoteThis.message?.pollCreationMessage?.options?.map((all) => all.optionName);
            messageData.recMessage = recMessage;

            /* Se for uma marcação de mídia */
            if ((messageData.isCmd && messageData.quotedMsgObj?.mimetype && !messageData.isMedia) || (messageData.isCmd && isViewOnce)) {
                /* Define o conteúdo como a quotedMessage */
                let quotMessage = isViewOnce || messageData.quotedMsg?.quotedMessage || isQuotedViewOnce;

                /* Se for uma quoted com ViewOnce */
                quotMessage = isQuotedViewOnce || quotMessage;

                /* Define o mimetype da quotedMessage */
                const myMimetype = quotMessage[Object.keys(quotMessage)[0]]?.mimetype || 'Not valid';

                /* Verifica se é algo válido para descriptografar */
                if (messageData.decryptFormats.includes(Object.keys(quotMessage)[0].replace('Message', ''))) {
                    /* Só baixa se não passar do peso limite (16MB padrão) */
                    if (((recMessage?.fileLength?.low || recMessage?.fileLength?.high || 1000) / 1024) <= config.maxDecryptSize.value) {
                        /* Baixa a mídia */
                        const demess = await downloadContentFromMessage(quotMessage[Object.keys(quotMessage)[0]], Object.keys(quotMessage)[0].replace('Message', ''));

                        /* Cria um buffer */
                        messageData.decryptedMedia = Buffer.from([]);

                        /* Faz um for await para unir os pedaços de buffer */
                        // eslint-disable-next-line no-restricted-syntax
                        for await (const chunk of demess) {
                            /* Adicionando eles como a mídia descriptograda */
                            messageData.decryptedMedia = Buffer.concat([messageData.decryptedMedia, chunk]);
                        }

                        /* Redefine variaveis para a mídia marcada */
                        messageData.encryptMedia = isViewOnce ? isViewOnce[Object.keys(isViewOnce)[0]] : messageData.quotedMsgObj;
                        messageData.isMedia = true;
                        messageData.mimetype = myMimetype || '';
                        messageData.isVideo = ['video/mp4', 'video', 'video/mpeg', 'video/quicktime', 'video/x-flv', 'video/x-ms-asf', 'video/avi', 'video/3gpp'].includes(myMimetype);
                        messageData.isImage = ['image', 'image/jpeg', 'image/bmp', 'image/png', 'image/webp'].includes(myMimetype);
                        messageData.canSticker = messageData.isImage || messageData.isVideo || false;
                    }
                }

                /* Define os tipos */
                messageData.quotedType = messageData.quotedMsg?.quotedMessage ? (Object.keys(messageData.quotedMsg?.quotedMessage)[0] || 'conversation') : 'conversation';
                messageData.quotedBaseMsg = messageData.quotedMsg?.quotedMessage || {};

                /* Ajusta a type se for ViewOnce marcada */
                if (isQuotedViewOnce) {
                    messageData.quotedType = isQuotedViewOnce ? (Object.keys(isQuotedViewOnce)[0] || 'conversation') : 'conversation';
                    messageData.quotedBaseMsg = isQuotedViewOnce || {};
                }

                /* Define o type formatado */
                messageData.quotedTypeFormated = messageData.quotedType.replace('Message', '');
            }

            /* --------------------- Sticker Info -------------------- */

            /* Define se é um sticker */
            messageData.isSticker = messageData.typeFormatted === 'sticker';

            /* Define se é um sticker mencionado */
            messageData.isQuotedSticker = messageData.quotedTypeFormated === 'sticker';

            /* Define se é animado */
            messageData.isAnimated = recMessage?.isAnimated === true;

            /* Define se é um sticker mencionado animado */
            messageData.isQuotedAnimated = messageData.quotedMsgObj.isAnimated;

            /* Se for um sticker */
            if ((messageData.isSticker || messageData.isQuotedSticker) && messageData.decryptedMedia) {
                /* Extrai a metadata */
                messageData.stickerMetadata = await extractMetadata(messageData.decryptedMedia).catch(() => {
                    /* Redefine o stickerMetadata */
                    messageData.stickerMetadata = {
                        emojis: [],
                        'sticker-pack-id': '',
                        'sticker-pack-name': '',
                        'sticker-author-name': '',
                        'sticker-pack-publisher': '',
                        'android-app-store-link': '',
                        'ios-app-store-link': '',
                    };
                });
            }

            /* --------------------- Jogos --------------------------- */

            /* Define as patentes pelo idioma */
            messageData.allPatents = levelSettings.patentes[region];

            /* Adquire a patente do usuário */
            messageData.patente = Indexer('others').patent(Leveling.level, messageData.allPatents).value;

            /* Define o XP total para upar */
            messageData.requiredXP = Math.floor((Leveling.level + 1) * (levelSettings.base.value * levelSettings.multiplier.value));

            /* Calcula o novo nível */
            let newLevel = 0;
            let fullLevel = Leveling.level;

            /* Verifica se o XP atual é suficiente para avançar para o próximo nível */
            if (Leveling.xp >= messageData.requiredXP) {
                /* Calcula o novo nível com base no XP atual | 0.82 é o expoente mais seguro */
                newLevel = Math.floor(((Leveling.xp - messageData.requiredXP) / (levelSettings.base.value * levelSettings.multiplier.value)) ** 0.82);
                fullLevel += newLevel;

                /* Atualiza o XP necessário com base no novo nível */
                messageData.requiredXP = Math.floor((fullLevel + 1) * (levelSettings.base.value * levelSettings.multiplier.value));

                /* Se o XP atual ainda é suficiente */
                if (Leveling.xp >= messageData.requiredXP) {
                    /* Aumenta o level em +1 */
                    newLevel += 1;
                    fullLevel = Leveling.level + newLevel;

                    /* Ajusta novamente o XP necessário */
                    messageData.requiredXP = Math.floor((fullLevel + 1) * (levelSettings.base.value * levelSettings.multiplier.value));
                }
            }

            /* Define o nivel atual sem considerar o último upado */
            fullLevel -= 1;

            /* Define a base das imagens */
            messageData.profilePics = false;

            /* Define a Object de atualizar valores */
            const gainValues = {
                level: newLevel,
            };

            /* Define quanto vai ganhar de cada item */
            Object.keys(levelSettings.materials.value.wins).forEach((h) => {
                /* Salva na object o valor */
                gainValues[h] = (Math.floor(levelSettings.materials.value.wins[h] * (fullLevel * levelSettings.materials.value.multiply) - fullLevel)) || levelSettings.materials.value.wins[h];
            });

            /* Remove valores inválidos */
            Object.keys(gainValues).forEach((g) => {
                /* Como abaixo de zero ou Infinity */
                if (gainValues[g] < 0 || gainValues[g] === Infinity) {
                    /* Define o valor como 1 */
                    gainValues[g] = 1;

                    /* Se for level, ajusta o XP requisitado */
                    if (g === 'level') {
                        /* Ajusta novamente o XP necessário */
                        messageData.requiredXP = Math.floor((gainValues.level + 1) * (levelSettings.base.value * levelSettings.multiplier.value));
                    }
                }
            });
            messageData.winTaxes = gainValues;

            /* Verifica se foi level up */
            if (newLevel !== 0 && functions.leveling.enable) {
                /* Ganha valores */
                messageData.leveling = Indexer('sql').update('leveling', messageData.user, messageData.chatId, false, gainValues).value;

                /* Adquire a patente do usuário novamente */
                messageData.patente = Indexer('others').patent(messageData.leveling.level, messageData.allPatents).value;

                /* Se tiver o card ativo */
                if (levelSettings.card.value) {
                    /* Obtém a foto de perfil */
                    messageData.profilePics = await Indexer('profile').perfil(kill, {
                        value: {
                            quotedMsg: messageData.quotedMsg,
                            decryptedMedia: messageData.decryptedMedia,
                            mentionedJidList: messageData.mentionedJidList,
                            groupMembersId: messageData.groupMembersId,
                            canSticker: messageData.canSticker,
                            mimetype: messageData.mimetype,
                        },
                    }, true);
                    messageData.profilePics = messageData.profilePics.value;

                    /* Gera um card */
                    const cardLeveling = await Indexer('cards').up(messageData.profilePics[0], messageData.personal.name.text, Leveling.level, messageData.leveling.level);

                    /* Envia */
                    await kill.sendMessage(messageData.chatId, { image: cardLeveling.value, caption: `🎉 *LEVEL UP! @${messageData.userFormated}!* 🎉\n\n🎓 Patente: ${messageData.patente}\n📈 XP: ${messageData.leveling.xp}/${messageData.requiredXP}\n🎚️ Level: ${Leveling.level} ➔ ${messageData.leveling.level}\n📬 Messages: ${messageData.leveling.messages}\n💰 Coin: ${messageData.leveling.coin}\n💎 Diamond: ${messageData.leveling.diamond}\n🔴 Rubi: ${messageData.leveling.rubi}\n🪨 Stone: ${messageData.leveling.stone}\n🏆 Gold: ${messageData.leveling.gold}\n🪙 Iron: ${messageData.leveling.iron}\n🌲 Wood: ${messageData.leveling.wood}`, mentions: [messageData.user] });
                }
            }

            /* Caso um dos parâmetros enviados não esteja OK */
        } else {
            /* Define os dados como a mensagem raiz (ainda causará erros, mas será muito melhor que null, false, etc */
            let recMessage = messageData.quoteThis.message[Object.keys(messageData.quoteThis.message)[0]];
            recMessage = recMessage?.message ? recMessage?.message[Object.keys(recMessage?.message)[0]] : recMessage;
            messageData = {
                ...messageData,
                ...recMessage,
            };
        }

        /* Define o resultado final */
        envInfo.results.value = messageData;

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

/* Define a pasta correta */
function locateFolder(foldername) {
    /* Define o nome das pastas */
    let file = fs.readdirSync(envInfo.parameters.baseCMDs.value);

    /* Busca a pasta correta do arquivo SQL */
    file = file.filter((fd) => fd.toLowerCase() === foldername.toLowerCase())[0] || false;

    /* Retorna o encontrado */
    return file;
}

/* Faz a função para obter os comandos, sem envInfo */
function controlSystem(
    cmdTimes = envInfo.functions.control.arguments.cmdTimes.value,
) {
    /* Determina o resultado */
    let switcheroo = false;

    /* Define valor padrão */
    let commandName = locateFolder(cmdTimes) || cmdTimes || 'Default';

    /* Try pra caso o arquivo de função não exista */
    try {
        /* Define Default se for main */
        if (cmdTimes === 'main' || cmdTimes === 'Main') {
            /* Retorna 'default', indo para os comandos sem prefix */
            commandName = 'Default';
        }

        /* Determina a pasta de verificação por case */
        let commander = Object.keys(envInfo.parameters.alias.value).filter((cm) => envInfo.parameters.alias.value[cm].includes(commandName));

        /* Se ainda for vazio */
        if (commander.length === 0) {
            /* Obtém comandos similares */
            commander = Object.entries(envInfo.parameters.alias.value).reduce((result, [key, words]) => {
                /* Faz uma verificação de palavra a palavra */
                const similarWords = words.filter((f) => {
                    /* Similar -> 0-100 */
                    const similarity = issimilar(commandName, f) * 100;

                    /* Se ela for maior que x (70% padrão) */
                    return similarity >= config.minSimilarity.value;
                });

                /* Se houver palavras similares */
                if (similarWords.length > 0) {
                    /* Adiciona ao resultado a pasta do comando */
                    result.push(key);
                }

                /* Retorna o resultado */
                return result;
            }, []);
        }

        /* Define o comando */
        commander = commander[0] || 'Default';

        /* Verifica pelo commandName (Pelo nome da pasta) */
        if (fs.existsSync(`${envInfo.parameters.baseCMDs.value}${commandName}`)) {
            /* Define a pasta */
            switcheroo = `../../${commandName}`;

            /* Só edita se não existir no formato atual */
            if (envInfo.parameters.alias.value[commandName] == null) {
                /* Define o arquivo padrão para não enviar dados ruins */
                const defaultEnvir = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

                /* Define a alias atual */
                const alliesBro = Object.keys(defaultEnvir.parameters.alias.value).filter((d) => d.toLowerCase() === commandName.toLowerCase())[0];

                /* Se existir um valor já, mas a pasta tenha sido só trocado pelo case insensitive */
                if (defaultEnvir.parameters.alias.value[alliesBro] != null && alliesBro !== commandName) {
                    /* Troca o valor */
                    defaultEnvir.parameters.alias.value[commandName] = defaultEnvir.parameters.alias.value[alliesBro];

                    /* Deleta o antigo */
                    delete defaultEnvir.parameters.alias.value[alliesBro];

                    /* Se nenhum caso, define automaticamente */
                } else {
                    /* Com base no commandName */
                    defaultEnvir.parameters.alias.value[commandName] = defaultEnvir.parameters.alias.value[commandName] || [commandName.toLowerCase()];
                }

                /* Salva no arquivo */
                fs.writeFileSync(`${__dirname}/utils.json`, JSON.stringify(defaultEnvir, null, 4));

                /* Redefine a envInfo */
                envInfo.functions.revert.value();
            }

            /* Verifica pelo commander (Alias) */
        } else if (fs.existsSync(`${envInfo.parameters.baseCMDs.value}${commander}`)) {
            /* Define a pasta */
            switcheroo = `../../${commander}`;

            /* Caso não tenha o comando */
        } else {
            /* Define como Default (Cases/No Prefix) */
            switcheroo = '../../Default';
        }

        /* Faz a exports e retorna ela */
        /* eslint-disable-next-line global-require, import/no-dynamic-require */
        const Sys = require(switcheroo);
        return Sys[Object.keys(Sys)[0]];

        /* Caso de algum erro */
    } catch (error) {
        /* Exibe o erro direto, essa parte não é da envInfo, até por que é sensivel */
        console.log(error);
    }

    /* Retorna um valor padrão se não funcionar acima */
    return false;
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

        /* Insere a dataCollect na envInfo */
        envInfo.functions.make.value = dataCollect;

        /* Insere a controlSystem na envInfo */
        envInfo.functions.control.value = controlSystem;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.make]: envInfo.functions.make.value,
                [envInfo.exports.control]: envInfo.functions.control.value,
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
