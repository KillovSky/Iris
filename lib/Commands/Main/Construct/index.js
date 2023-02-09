/* eslint-disable no-control-regex */
/* eslint-disable max-len */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

/* Requires */
const fs = require('fs');
const path = require('path');
const removeAccents = require('remove-accents');
const Indexer = require('../../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const config = JSON.parse(fs.readFileSync('./lib/Databases/Settings/Config.json'));
const commands = JSON.parse(fs.readFileSync('./lib/Databases/Settings/Rules.json'));
let botNumber = false;

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
    let messageData = {};

    /* Try-Catch para casos de erro */
    try {
        /* Determina se algum parâmetro veio errado */
        if (typeof kill === 'object' && typeof message === 'object') {
            /* Define a mensagem na envInfo */
            messageData.encryptMedia = message;

            /* Verifica se o número da Íris já foi adquirido */
            if (botNumber === false) {
                /* Adquire o número */
                botNumber = `${await kill.getHostNumber()}@c.us`;
            }

            /* Insere o número */
            messageData.botNumber = botNumber;

            /* Define a hora de agora */
            messageData.dateOfDay = (new Date()).getHours();

            /* Define a medição de tempo */
            messageData.timestamp = message.t || message.timestamp || Date.now();

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

            /* --------------------- Mensagem --------------------------- */

            /* Define a marcação de mensagem */
            messageData.quotedMsg = message?.quotedMsg || message?.quotedMsgObj || messageData.quotedMsg || {};

            /* Define a marcação de mensagem com objeto */
            messageData.quotedMsgObj = message?.quotedMsgObj || message?.quotedMsg || messageData.quotedMsg || messageData.quotedMsgObj || {};

            /* Define o usuário */
            messageData.sender = message?.sender || messageData.quotedMsg?.sender || messageData.quotedMsgObj?.sender || messageData.sender || {};

            /* Determina a Chat */
            messageData.chat = message?.chat || messageData.quotedMsg?.chat || messageData.quotedMsgObj?.chat || messageData.chat || {};

            /* Define o nome do grupo */
            messageData.name = messageData.chat?.name || messageData.chat?.formattedTitle || messageData.chat?.contact?.name || messageData.chat?.contact?.formattedName || messageData.name || '';

            /* Define o número de quem enviou */
            messageData.user = message?.author || message?.sender?.id || messageData.chat?.lastReceivedKey?.participant || message?.to || message?.quotedParticipant || messageData.botNumber || messageData.quotedMsg?.author || messageData.quotedMsg?.sender?.id || messageData.quotedMsg?.to || messageData.quotedMsg?.quotedParticipant || messageData.quotedMsgObj?.author || messageData.quotedMsgObj?.sender?.id || messageData.quotedMsgObj?.to || messageData.quotedMsgObj?.quotedParticipant || messageData.user || '';

            /* Define o nome de usuário */
            messageData.pushname = messageData.sender?.pushname || message?.notifyName || messageData.sender?.verifiedName || messageData.user || messageData.pushname || '"Censored by Government"';

            /* Determina a ID do Chat */
            messageData.chatId = message?.chatId || messageData.chat?.id || message?.from || messageData.chat?.contact?.id || messageData.chat?.groupMetadata?.id || messageData.chat?.presence?.id || messageData.chat?.contact?.profilePicThumbObj?.id || messageData.chatId || messageData.chat?.lastReceivedKey?.remote || config.Secure_Group || messageData.user || messageData.chatId || '';

            /* Determina o tipo de mensagem */
            messageData.type = message?.type || messageData.quotedMsg?.type || messageData.quotedMsgObj?.type || messageData.type || 'chat';

            /* Determina se é uma mídia */
            messageData.isMedia = message?.isMedia || false;

            /* Determina se é um grupo */
            messageData.isGroup = messageData.chat?.isGroup || false;

            /* Determina se é um grupo - avançado */
            if (messageData.isGroup === false) {
                /* Verifica pela ID, kind e outros */
                if (messageData.chatId?.endsWith('@g.us') || messageData.chat?.kind === 'group' || messageData.chat?.contact?.isUser === false) {
                    /* Determina que é */
                    messageData.isGroup = true;
                }
            }

            /* Determina se é uma mensagem em grupo */
            messageData.isGroupMsg = message?.isGroupMsg || false;

            /* Define a ID */
            messageData.id = message.id || messageData.serial || messageData.id || false;

            /* Cria uma cópia da ID por segurança */
            messageData.serial = messageData.id;

            /* Define o mimetype */
            messageData.mimetype = message?.mimetype || '';

            /* Define se é video */
            messageData.isVideo = ['video/mp4', 'video', 'video/mpeg', 'video/quicktime', 'video/x-flv', 'video/x-ms-asf', 'video/avi', 'video/3gpp'].some((plg) => (
                /* Type de video */
                messageData.type === plg

                /* Type da mensagem marcada */
                || messageData.quotedMsg?.type === plg

                /* Mesma de cima */
                || messageData.quotedMsgObj?.type === plg

                /* Mimetype */
                || message?.mimetype === plg
            ));

            /* Define se é imagem */
            messageData.isImage = ['image', 'image/jpeg', 'image/bmp', 'image/png', 'image/webp'].some((plg) => (
                /* Type de video */
                messageData.type === plg

                /* Type da mensagem marcada */
                || messageData.quotedMsg?.type === plg

                /* Mesma de cima */
                || messageData.quotedMsgObj?.type === plg

                /* Mimetype */
                || message?.mimetype === plg
            ));

            /* Define se pode ser feito sticker disso */
            messageData.canSticker = messageData.isImage || messageData.isVideo || false;

            /* -------------------- Functions ----------------------- */

            /* Determina a ID de verificação */
            messageData.specialID = messageData.chatId.replace(/[@g.us|@c.us]|[^a-zA-Z0-9]+/gi, '');

            /* Determina o arquivo de dados */
            if (messageData.isGroup === true) {
                /* Como grupo */
                messageData.funFile = `./lib/Databases/Groups/${messageData.specialID}.json`;
            } else {
                /* Como PV */
                messageData.funFile = './lib/Databases/Groups/Default.json';
            }

            /* Determina se tem um arquivo privado de grupo */
            if (!fs.existsSync(messageData.funFile) && messageData.isGroup === true) {
                /* Define a function padrão */
                const defChat = JSON.parse(fs.readFileSync('./lib/Databases/Groups/Default.json'));

                /* Salva o arquivo no PC */
                fs.writeFileSync(messageData.funFile, JSON.stringify(defChat));
            }

            /* Define a functions */
            const functions = JSON.parse(fs.readFileSync(messageData.funFile));

            /* --------------------- Body --------------------------- */

            /* Determina o texto */
            messageData.body = message?.text || message?.body || '';

            /* Verifica o texto */
            if (messageData.type === 'image' || messageData.type === 'video' || messageData.type === 'document') {
                /* Define como contexto caso seja mídia */
                messageData.body = message?.text || message?.caption || messageData.body || '';

                /* Caso seja localização */
            } else if (messageData.type === 'location') {
                /* Define como contexto caso seja mídia */
                messageData.body = message?.comment || message?.text || messageData.body || '';
            }

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
            const prefixes = config?.Prefix || ['/'];
            [messageData.prefix] = [prefixes[0]];

            /* Verifica se é outro prefix */
            if (typeof functions.prefix === 'string') {
                /* Define o customizado */
                messageData.prefix = functions.prefix;

                /* Verifica se é prefix dinâmico */
            } else if (prefixes.includes(messageData.body.slice(0, 1))) {
                /* Define o customizado */
                messageData.prefix = messageData.body.slice(0, 1);
            }

            /* --------------------- Commands --------------------------- */

            /* Adquire a primeira palavra e converte em lowercase */
            messageData.command = (messageData.body.slice(messageData.prefix.length)
                .trim()
                .split(/ +/)
                .shift()
                .toLowerCase()
            );

            /* Remove os acentos dela */
            messageData.command = removeAccents(messageData.command);

            /* Determina a pasta de verificação por case */
            let commander = Object.keys(envInfo.parameters.alias.value).filter((cm) => envInfo.parameters.alias.value[cm].includes(messageData.command));
            commander = commander[0] || 'Default';

            /* Determina se é um comando */
            messageData.isCmd = messageData.body.startsWith(messageData.prefix);

            /* --------------------- ADMS/Donos/Membros --------------------------- */

            /* Define as menções */
            messageData.mentionedJidList = message?.mentionedJidList || [];

            /* Determina os membros padrões do grupo */
            messageData.groupMembersId = [messageData.user];

            /* Verifica apenas se for grupo */
            if (messageData.isGroupMsg === true) {
                /* Filtra os membros sem a função async */
                messageData.groupMembersId = messageData.chat?.groupMetadata?.participants?.map((prs) => prs.id) || [];

                /* Verifica se tem resultados e continua */
                if (messageData.groupMembersId.length === 0) {
                    /* Adquire com a função async caso tudo falhe */
                    messageData.groupMembersId = await kill.getGroupMembersId(messageData.chatId);
                }
            }

            /* Determina os ADMS padrões */
            messageData.groupAdmins = [];

            /* Verifica os ADMS apenas em grupo */
            if (messageData.isGroupMsg === true) {
                /* Filtra os ADMS sem a função async */
                messageData.groupAdmins = messageData.chat?.groupMetadata?.participants?.filter((prs) => prs?.isAdmin === true || prs?.isSuperAdmin === true) || [];

                /* Verifica se tem resultados e continua */
                if (messageData.groupAdmins.length !== 0) {
                    /* Filtra somente as IDs */
                    messageData.groupAdmins = messageData.groupAdmins?.map((prs) => prs?.id) || [];
                }

                /* Verifica se tem resultados e continua */
                if (messageData.groupAdmins.length !== 0) {
                    /* Adquire com a função async caso tudo falhe */
                    messageData.groupAdmins = await kill.getGroupAdmins(messageData.chatId);
                }
            }

            /* Verifica se faz parte dos ADMS */
            messageData.isGroupAdmins = messageData.groupAdmins?.includes(messageData.user) || false;

            /* Verifica se a Íris é ADM */
            messageData.isBotGroupAdmins = messageData.groupAdmins?.includes(messageData.botNumber) || false;

            /* Define se é o criador do grupo */
            messageData.isGroupCreator = messageData.user === messageData.chat?.groupMetadata?.owner;

            /* Define se é o dono */
            messageData.isOwner = config?.Owner?.includes(messageData.user) || messageData.body.includes(config?.Owner_SECRET_Password) || false;

            /* Define se é a Íris */
            messageData.isBot = message?.fromMe || messageData.botNumber === messageData.user || false;

            /* --------------------- Membros --------------------------- */

            /* Determina as informações padrões de quem foi mencionado */
            messageData.mentionedInfo = {};

            /* Só ajusta se tiver menções */
            if (messageData.mentionedJidList > 0) {
                /* Adquire as informações da pessoa marcada */
                const mentionData = await kill.getContact(messageData.mentionedJidList[0]);

                /* Finaliza */
                messageData.mentionedInfo = mentionData;
            }

            /* Adquire o nome aoenas da pessoa mencionada */
            messageData.mentionedName = messageData.mentionedInfo?.pushname || '"Censored by Government"';

            /* Adquire os bloqueados */
            messageData.blockNumber = await kill.getBlockedIds();

            /* Define se o usuário está bloqueado */
            messageData.isBlocked = messageData.blockNumber.includes(messageData.user);

            /* --------------------- Sticker --------------------------- */

            /* Define uma let para não substituir a config */
            let stckAuth = config.Sticker_Author;

            /* Verifica se pode deixar os dados do sticker com nome do grupo */
            if (config.Sticker_Author.includes('DONTEDITGPN')) {
                /* Se sim, remove os acentos e troca pelo nome */
                stckAuth = removeAccents(config.Sticker_Author.replace(/DONTEDITGPN/g, messageData.name).replace(/DONTEDITUSR/g, messageData.pushname));

                /* Verifica qualquer indicio de ASCII nas letras, se continuar da erro no encoding */
                if (/[^\u0000-\u007f]/.test(stckAuth)) {
                    /* Define outra let pra dar parse */
                    const sticPA = [removeAccents(messageData.name), removeAccents(messageData.pushname)].filter((j) => !/[^\u0000-\u007f]/.test(j));

                    /* Define o resultado final adequado */
                    if (sticPA.length === 2) {
                        /* Two Names */
                        stckAuth = `${sticPA[0]} - ${sticPA[1]}`;

                        /* Se não tem 2 */
                    } else if (sticPA.length === 1) {
                        /* Modo one name */
                        [stckAuth] = [sticPA[0]];

                        /* Se não */
                    } else {
                        /* Nome do owner */
                        stckAuth = removeAccents(config.Your_Name);
                    }
                }

                /* Adiciona dois emojis pra deixar bonitinho */
                stckAuth = `🎁 ${stckAuth} ☆`;
            }

            /* Define o Pack do Sticker */
            const stckPack = (removeAccents(config.Sticker_Pack) || '🔰 Legião Z [bit.ly/BOT-IRIS] Íris ⚜️');

            /* Metadados do Sticker */
            messageData.stickerConfig = {
                author: stckAuth,
                pack: stckPack,
                keepScale: true,
                circle: false,
            };

            /* Metadados do Sticker MP4 */
            messageData.stickMp4Config = {
                author: stckAuth,
                pack: stckPack,
                crop: false,
                loop: 1,
                fps: config.Fig_FPS,
                stickerMetadata: true,
            };

            /* --------------------- Outros --------------------------- */

            /* Define se é um VIP */
            messageData.isVIP = false;

            /* Verifica apenas se houver a Object */
            if (Object.keys(functions.vips).includes(messageData.chatId)) {
                /* Insere caso tenha */
                messageData.isVIP = functions.vips[messageData.chatId]?.includes(messageData.user) || false;
            }

            /* Define se é um MOD */
            messageData.isModerator = functions.vips?.[messageData.chatId]?.[messageData.user] || false;

            /* Sugere um comando */
            [messageData.suggestCMD] = [Indexer('shell').liner(1, './lib/Texts/Commands.txt').value[0]];

            /* Ajusta os valores da mídia caso tenha menção */
            if (Object.keys(messageData.quotedMsgObj).length !== 0) {
                /* Insere a mensagem marcada como mídia */
                messageData.encryptMedia = messageData.quotedMsgObj;
            }

            /* Verifica se é um comando, se for remove o prefix */
            if (messageData.isCmd === true) {
                /* Define as duas body's */
                messageData.body = messageData.body.slice(1);
            }

            /* Determina o arquivo de votação */
            messageData.elections = `./lib/Databases/Games/Poll/${messageData.specialID}.json`;

            /* Define dois números da sorte */
            messageData.side = Indexer('numbers').randnum(1, 2).value;
            messageData.lvpc = Indexer('numbers').randnum(1, 100).value;

            /* Adquire o nível do usuário */
            // messageData.checkLvL = Indexer('gaming').getValue(messageData.user, messageData.chatId, 'level').value;

            /* Adquire a patente do usuário */
            // messageData.patente = Indexer('gaming').getPatent(messageData.checkLvL).value;

            /* Randomiza as recompensas */
            messageData.Win_Rewards = Indexer('arrays').sort(envInfo.parameters.winTypes.value).value;

            /* Determina o MIX */
            messageData.mixTypes = envInfo.parameters.mixFiles.value;

            /* Define o tipo de chat para argumento */
            messageData.typeChat = messageData.isGroupMsg ? '-gp' : '-pv';

            /* Define o tipo de nome a usar */
            messageData.typeName = messageData.isGroupMsg ? messageData.name : messageData.pushname;

            /* Define o tipo de ID sem sufixo a usar */
            messageData.typeId = (messageData.isGroupMsg ? messageData.chatId : messageData.user).replace(/@c.us|@g.us/gi, '');

            /* Escolhe um membro aleatório */
            messageData.randomMember = Indexer('arrays').extract(messageData.groupMembersId).value;

            /* Comando com uppercase na 1 letra */
            messageData.upperCommand = Indexer('string').upperland(messageData.command).value;

            /* Alias dos comandos */
            messageData.alias = envInfo.parameters.alias.value[commander] || [];

            /* Functions */
            messageData.functions = functions;
            
            /* Define se é VIP */
            messageData.isAllowed = (
                /* VIP */
                (messageData.isVIP && !messageData.isModerator && commands.VIP.includes(messageData.cmd))

                /* MOD */
                || (messageData.isModerator && commands.MOD.includes(messageData.cmd))

                /* None */
                || false
            );
            
            /* ----------------------- SECURITY ----------------------- */
            
            /* Definições para os sistemas de segurança, já usadas acima em outras formas */
            messageData.oldbody = message.body || '';
            messageData.content = message.content || '';
            messageData.caption = message.caption || '';
            messageData.comment = message.comment || '';
            messageData.filename = message.filename || '';
            messageData.matchedText = message.matchedText || '';
            messageData.footer = message.footer || '';
            messageData.list = message.list || {};
            messageData.text = message.text || '';
            messageData.stickerPack = message.stickerPack || message.stickerPackName || message.mediaData?.stickerPackName || '';
            messageData.stickerAuthor = message.stickerAuthor || message.stickerPackPublisher || message.mediaData?.stickerPackPublisher || '';
            messageData.listTitle = messageData.list?.title || '';
            messageData.listDescription = messageData.list?.description || '';
            messageData.listButtonText = messageData.list?.buttonText || '';
            messageData.listFooterText = messageData.list?.footerText || '';
            messageData.hydratedButtons = messageData.list?.hydratedButtons || [];

            /* Caso um dos parâmetros enviados não esteja OK */
        } else {
            /* Define os dados como a mensagem raiz (ainda causará erros, mas será muito melhor que null, false, etc */
            messageData = message;
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

/* Faz a função para obter os comandos, sem envInfo */
function controlSystem(
    cmdTimes = envInfo.functions.control.arguments.cmdTimes.value,
) {
    /* Determina o resultado */
    let switcheroo = false;

    /* Define valor padrão */
    let commandName = cmdTimes || 'Default';

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

        /* Verifica pelo commandName */
        if (fs.existsSync(`${envInfo.parameters.baseCMDs.value}${commandName}`)) {
            /* Define a pasta */
            switcheroo = `../../${commandName}`;

            /* Verifica pelo commander */
        } else if (fs.existsSync(`${envInfo.parameters.baseCMDs.value}${commander}`)) {
            /* Define a pasta */
            switcheroo = `../../${commander}`;

            /* Caso não tenha o comando */
        } else {
            /* Define como Default */
            switcheroo = '../../Default';
        }

        /* Faz a exports e retorna ela */
        const Sys = require(switcheroo);
        return Sys[Object.keys(Sys)[0]];

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
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
