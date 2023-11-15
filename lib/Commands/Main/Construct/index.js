/* eslint-disable no-unused-vars */
/* eslint-disable no-control-regex */
/* eslint-disable max-len */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

/* Requires */
const fs = require('fs');
const path = require('path');
const removeAccents = require('remove-accents');
const { downloadMediaMessage, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const Indexer = require('../../../index');
const language = require('../../../Dialogues/index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const commands = JSON.parse(fs.readFileSync('./lib/Databases/Configurations/definitions.json'));
const arrayOfCommands = JSON.parse(Indexer('bash').bash(`bash "${irisPath}/lib/Scripts/Menu.sh" "array"`).value);
const oldLanguage = region;

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
        console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →\x1B[39m`, `\x1b[33m${envInfo.parameters.message.value}\x1B[39m`);
    }

    /* Retorna o erro */
    return envInfo.results.success;
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
    const messageData = {
        actualMoment: Date.now(),
    };

    /* Try-Catch para casos de erro */
    try {
        /* Determina se algum parâmetro veio errado */
        if (typeof kill === 'object' && typeof message === 'object') {
            /* Define a mensagem a marcar */
            [messageData.quoteThis] = [message.messages[0]];

            /* Impede de continuar se a mensagem estiver com problema */
            if (!typeof messageData.quoteThis?.message === 'object' || messageData.quoteThis?.message == null || messageData.quoteThis == null) return postResults(envInfo.results);

            /* Define a mensagem para tratar */
            let recMessage = messageData.quoteThis.message[Object.keys(messageData.quoteThis.message)[0]];
            recMessage = recMessage?.message ? recMessage?.message[Object.keys(recMessage?.message)[0]] : recMessage;

            /* Se for mensagem editada */
            messageData.quoteThis = recMessage?.editedMessage ? recMessage : messageData.quoteThis;

            /* Define se é editada */
            const editedMessage = !!messageData.quoteThis?.editedMessage;

            /* Se for edição de mensagem */
            if (recMessage?.editedMessage) {
                /* Ajusta a editedMessage para message apenas */
                recMessage.message = recMessage?.editedMessage;

                /* Se for só texto */
                recMessage = recMessage?.message.conversation ? recMessage?.message.conversation : recMessage;
            }

            /* Define a key da mensagem */
            const chatMessage = messageData.quoteThis.key;

            /* Define se é ViewOnce */
            let isViewOnce = messageData.quoteThis.message?.viewOnceMessageV2 || messageData.quoteThis.message?.viewOnceMessage;
            isViewOnce = isViewOnce ? isViewOnce[Object.keys(isViewOnce)[0]] : isViewOnce;

            /* Define se deve ignorar as mensagens da Íris, editadas, broadcast e reações */
            if (((chatMessage?.fromMe && config.botCommands.value === false)) || editedMessage || (messageData.quoteThis.broadcast === true && config.listenBroadcasts.value === false) || (Object.keys(messageData.quoteThis?.message).includes('reactionMessage') && config.listenReactions.value === false)) {
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
            messageData.quotedMsg = recMessage?.contextInfo || {};
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

            /* Define a medição de tempo */
            messageData.timestamp = messageData.quoteThis.messageTimestamp || Date.now();

            /* Define o Ping avançado */
            messageData.pingTime = Indexer('number').format((messageData.actualMoment) - (messageData.timestamp * 1000)).overall;

            /* Define o tempo formatado */
            messageData.time = new Date(messageData.timestamp * 1000).toLocaleString();

            /* Define o Ping */
            messageData.procTime = Math.abs(new Date().getTime() - new Date(messageData.timestamp * 1000).getTime()) / 1000;

            /* Caso o tempo esteja como apenas 0 */
            if (messageData.procTime < 0) {
                /* Define a velocidade mais aceitável */
                messageData.procTime = '0.001-';
            }
            /* Velocidade de recebimento pode ser bem menor do que 0.001, mas defini como 'aceitável', no mínimo */

            /* Comando debug */
            if (recMessage?.caption === '/debugping' || recMessage === '/debugping' || recMessage?.text === '/debugping') return await kill.sendMessage(chatMessage.remoteJid, { text: `DEBUG: ${messageData.procTime} segundos` }, { quoted: messageData.quoteThis });

            /* --------------------- Mensagem --------------------------- */

            /* Define o usuário */
            messageData.sender = chatMessage?.participant || {};

            /* Determina a Chat */
            messageData.chat = chatMessage?.remoteJid.includes('@g.us') ? await kill.groupMetadata(chatMessage?.remoteJid) : {};

            /* Define o nome do grupo */
            messageData.name = messageData.chat?.subject || '';

            /* Define o número de quem enviou */
            messageData.user = chatMessage?.participant || chatMessage?.remoteJid || '';

            /* Define uma user formatada */
            messageData.userFormated = messageData.user.replace(/@s.whatsapp.net|@g.us/gi, '');

            /* Define o nome de usuário */
            messageData.pushname = message?.messages[0]?.pushName || '"Censored by Government"';

            /* Determina a ID do Chat */
            messageData.chatId = chatMessage?.remoteJid || messageData.user || '';

            /* Determina se é um grupo */
            messageData.isGroup = messageData.chatId.includes('@g.us') || false;

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
                Indexer('sql').update('leveling', messageData.user, messageData.chatId, 'xp', Number(config.ExpPerMessage.value));
            }

            /* Redefine o idioma */
            region = oldLanguage;

            /* Define a região com base nas condições fornecidas */
            if (functions.language?.enable && language('G.A.L').includes(functions.language?.text)) {
                /* Define como o armazenado nas funções de grupo */
                region = functions.language?.text;
            }

            /* Se for PV e tiver ativado a language */
            if (messageData.personal.language?.enable && language('G.A.L').includes(messageData.personal.language?.text)) {
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
                    text: messageData.pushname, lastDate: Date.now(), lastValue: messageData.personal.name.text, firstEdition: messageData.personal.name.firstEdition || messageData.personal.name.text, firstDate: messageData.name.firstDate || Date.now(),
                }).value;
            }

            /* --------------------- Body --------------------------- */

            /* Determina o texto, a array esta organizada de forma a obter na ordem dela, se achar a caption não vai buscar text e outros */
            const bodyKeys = ['caption', 'conversation', 'text', 'selectedId', 'selectedRowId', 'selectedButtonId', 'matchedText', 'displayName', 'title', 'fileName'];
            messageData.body = Indexer('others').findkey(recMessage, bodyKeys, ['string', 'number']).value || Indexer('others').findkey(messageData.quoteThis, bodyKeys, ['string', 'number']).value || Indexer('others').findkey(message?.messages[0], bodyKeys, ['string', 'number']).value || '';
            messageData.body = messageData.typeFormatted === 'sticker' ? '' : messageData.body;

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

                    /*
                        Define o customizado ou um da lista, impossibilitando rodar comandos sem ele
                        Se quiser que o comando prefix funcione também com os prefixos padrões
                        Sendo um comando só para adicionar mais formas de usar comandos

                        Insira isso no if (na frente de true):
                        && functions.prefix.values.includes(messageData.body.slice(0, 1))

                        Delete a linha prefixes acima e mude a messageData.prefix abaixo para essa:
                        messageData.prefix = messageData.body.slice(0, 1);
                    */
                    messageData.prefix = prefixes[0] || functions.prefix.values[0] || '/';
                }
            }

            /* --------------------- Commands --------------------------- */

            /* Determina se é um comando */
            messageData.isCmd = messageData.body.startsWith(messageData.prefix);

            /* Define a mensagem decriptada */
            messageData.decryptedMedia = messageData.isCmd && messageData.decryptFormats.includes(messageData.typeFormatted) && !messageData.quoteThis.message.viewOnceMessageV2 ? await downloadMediaMessage(messageData.quoteThis, 'buffer') : '';

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

            /* Define as menções */
            messageData.mentionedJidList = recMessage?.contextInfo?.mentionedJid || [];
            messageData.mentionedJidList.push(messageData.quotedMsg?.participant || messageData.user);

            /* Insere o autor da mensagem também */
            messageData.mentionedJidList.push(messageData.user);

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
            const stckPack = (removeAccents(config.stickerPack.value) || '🔰 Legião Z [bit.ly/BOT-IRIS] Íris ⚜️');

            /*
                Metadados do Sticker
                type = 'default', 'crop', 'full', 'circle,'rounded'
                background = {r:0,g:0,b:0,alpha:1}, #ffffff
                categories = array of emojis
            */
            messageData.stickerConfig = {
                author: stckAuth,
                pack: stckPack,
                type: undefined,
                categories: undefined,
                quality: 100,
                background: undefined,
            };

            /* --------------------- Outros --------------------------- */

            /* Define se é um VIP */
            messageData.isVIP = false;
            messageData.isModerator = false;

            /* Verifica os mods e vips apenas se houver mensagem em grupo */
            if (messageData.isGroupMsg) {
                /* Define se é um VIP */
                messageData.isVIP = functions?.vips?.values?.includes(messageData.user) && functions?.vips?.enable === true;

                /* Define se é um MOD */
                messageData.isModerator = functions?.mods?.values?.includes(messageData.user) && functions?.mods?.enable === true;
            }

            /* Sugere um comando */
            [messageData.suggestCMD] = [arrayOfCommands[0]];

            /* Insere todos os comandos na Object */
            messageData.allCommands = arrayOfCommands;

            /* Verifica se é um comando */
            if (messageData.isCmd === true) {
                /* Define a remoção do comando */
                const removeRegExp = new RegExp(messageData.command, 'gi');

                /* Remove o prefix e comando */
                messageData.body = messageData.body.slice(1).replace(removeRegExp, '');
            }

            /* Define dois números da sorte */
            messageData.side = Indexer('numbers').randnum(1, 2).value;
            messageData.lvpc = Indexer('numbers').randnum(1, 100).value;

            /* Adquire a patente do usuário */
            // messageData.patente = Indexer('gaming').getPatent(messageData.checkLvL).value;

            /* Randomiza as recompensas */
            messageData.Win_Rewards = Indexer('arrays').sort(envInfo.parameters.winTypes.value).value;

            /* Determina o MIX */
            messageData.mixTypes = envInfo.parameters.mixFiles.value;

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
                (messageData.isVIP && !messageData.isModerator && commands.VIP.includes(messageData.cmd))

                /* MOD */
                || (messageData.isModerator && commands.MOD.includes(messageData.cmd))

                /* Dono */
                || messageData.isOwner

                /* Admin */
                || messageData.isGroupAdmins

                /* None */
                || false
            );

            /* ----------------------- SECURITY ----------------------- */

            /* Definições para os sistemas de segurança, já usadas acima em outras formas */
            messageData.oldbody = message?.messages[0].message?.conversation || '';
            messageData.content = recMessage?.content || '';
            messageData.caption = recMessage?.caption || '';
            messageData.comment = recMessage?.comment || '';
            messageData.filename = recMessage?.filename || '';
            messageData.matchedText = recMessage?.matchedText || '';
            messageData.pollName = messageData.quoteThis.message?.pollCreationMessage?.name;
            messageData.pollOptions = messageData.quoteThis.message?.pollCreationMessage?.options?.map((all) => all.optionName);
            messageData.text = recMessage?.text || '';
            messageData.descriptionT = recMessage?.description || '';
            messageData.titleT = recMessage?.title || '';
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

            /* Caso um dos parâmetros enviados não esteja OK */
        } else {
            /* Define os dados como a mensagem raiz (ainda causará erros, mas será muito melhor que null, false, etc */
            let recMessage = messageData.quoteThis.message[Object.keys(messageData.quoteThis.message)[0]];
            recMessage = recMessage?.message ? recMessage?.message[Object.keys(recMessage?.message)[0]] : recMessage;
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
            /* Retorna false, simbolizando 'falha' */
            commandName = 'Default';
        }

        /* Determina a pasta de verificação por case */
        let commander = Object.keys(envInfo.parameters.alias.value).filter((cm) => envInfo.parameters.alias.value[cm].includes(commandName));
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
