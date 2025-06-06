/* eslint-disable indent */
/* eslint-disable max-len */
/*
    Esse sistema apenas redireciona o tipo de função.
    Então não possui envInfo, é similar ao Indexer.
    Os sistemas ativam somente a 1 participante por vez...
    Permitir muitos de uma vez pode causar spam.
*/

/* Requires */
const fs = require('fs');
const Indexer = require('../../../index');

/* JSON"S | Utilidades */
const cooldown = {};
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

/* Função de remoção/adição */
async function runEvent(
    kill = envInfo.functions.events.arguments.kill.value,
    events = envInfo.functions.events.arguments.events.value,
    functions = envInfo.functions.events.arguments.functions.value,
    fireType = envInfo.functions.events.arguments.fireType.value,
    eventType = envInfo.functions.events.arguments.eventType.value,
) {
    /* Começa com um try para evitar danos */
    try {
        /* Define um cooldown separado */
        if (!Indexer('number').isint(cooldown[events.id]?.time).value) {
            /* Com base no predefinido */
            cooldown[events.id] = envInfo.parameters.lasttext.value;
        }

        /* Define os tipos de funções */
        const funTypes = Object.keys(envInfo.parameters.lasttext.value);

        /* Define um resultado padrão */
        envInfo.results.value = false;

        /* Define o sucesso */
        envInfo.results.success = false;

        /* Determina se algum parâmetro veio errado */
        if ([kill, events, functions].some((f) => typeof f === 'object') && funTypes.includes(fireType) && typeof eventType === 'string') {
            /* Define o nome do evento */
            const eventNomeclt = Indexer('string').upperland(fireType, false).value;

            /* Define os usuários a mencionar */
            let usersToMention = [...cooldown[events.id][fireType].person, ...events.participants].flat(5);

            /* Corrige se tiver null */
            usersToMention = usersToMention.filter((s) => s?.includes('@s.whatsapp.net'));

            /* Verifica se o tempo de envio da mensagem terminou */
            if (cooldown[events.id][fireType].time < Date.now()) {
                /* Define os dados do grupo */
                const groupMetadata = await kill.groupMetadata(events.id);

                /* Printa a mensagem na tela sobre o evento */
                console.log(
                    Indexer('color').echo(`[${fireType.toUpperCase()}]`, 'red').value,
                    Indexer('color').echo(Indexer('sql').languages(region, 'Console', eventNomeclt, true, true, {
                        userm: `@${usersToMention.join(', ').replace(/@s.whatsapp.net/g, '')}`,
                        groupm: `'${groupMetadata.subject}'`,
                    }).value, 'yellow').value,
                );

                /* Determina o tempo da mensagem */
                cooldown[events.id][fireType].time = Date.now() + (
                    /* Multiplicado em 1 minuto do valor que o dono quer */
                    Number(envInfo.parameters.timedate.value[fireType]) * 60000
                );

                /* Determina se roda o padrão ou uma mensagem customizada */
                if (typeof functions[fireType].text !== 'string') {
                    /* Define o nome do evento */
                    const eventTypeName = eventType === 'add' ? 'Welcome' : 'Goodbye';

                    /* Define a foto da pessoa */
                    let profilePicture = false;

                    /* Tenta obter a do usuário */
                    try {
                        /* Se der bom, insere */
                        profilePicture = await kill.profilePictureUrl(events.id, 'image');

                        /* Se der um erro */
                    } catch (err) {
                        /* Se falhar, usa uma padrão */
                        profilePicture = 'GIMMEAPICTURE';
                    }

                    /* Verifica se é uma URL */
                    if (!Indexer('regexp').urls(profilePicture).value.isURL) {
                        /* Define uma padrão */
                        profilePicture = envInfo.parameters.picProfile.value;
                    }

                    /* Cria a imagem de welcome */
                    const canvaGreetings = await Indexer('cards').greets(profilePicture, eventType, Indexer('sql').languages(region, 'Greets', `${eventTypeName}Title`, true, true, envInfo).value, Indexer('sql').languages(region, 'Greets', `${eventTypeName}Description`, true, true, envInfo).value);

                    /* Se for um Buffer */
                    if (Buffer.isBuffer(canvaGreetings.value)) {
                        /* Envia a mensagem customizada */
                        envInfo.results.value = await kill.sendMessage(events.id, {
                            image: canvaGreetings.value,
                            caption: Indexer('sql').languages(region, 'Greets', eventNomeclt, true, true, {
                                userm: `@${usersToMention.join(' @').replace(/@s.whatsapp.net/g, '')}`,
                                groupm: groupMetadata.subject,
                                desc: groupMetadata.desc,
                            }).value,
                            mentions: usersToMention,
                        });

                        /* Se não for contéudo para mandar */
                    } else {
                        /* Envia a mensagem sem imagem */
                        envInfo.results.value = await kill.sendMessage(events.id, {
                            text: Indexer('sql').languages(region, 'Greets', eventNomeclt, true, true, {
                                userm: `@${usersToMention.join(' @').replace(/@s.whatsapp.net/g, '')}`,
                                groupm: groupMetadata.subject,
                                desc: groupMetadata.desc,
                            }).value,
                            mentions: usersToMention,
                        });
                    }

                    /* Caso seja mensagem customizada tenha marcação */
                } else {
                    /* Cria uma Object com tudo acima para o replace */
                    const toReplacer = {
                        groupMetadata,
                        cooldown,
                        events,
                        functions,
                        fireType,
                        envInfo,
                    };

                    /* Define a lista de users formatados */
                    const formatedPart = usersToMention.map((s) => s.replace(/@s.whatsapp.net/g, ''));

                    /* Define a mensagem */
                    /* eslint-disable-next-line newline-per-chained-call */
                    const customMessage = (
                        functions[fireType].text
                        .replace(/{userm}/gi, `@${usersToMention.join(' @').replace(/@s.whatsapp.net/g, '')}`)
                        .replace(/{groupm}/gi, groupMetadata.subject)
                        .replace(/{rawuser}/gi, (events.participants[0] || 'N/A'))
                        .replace(/{rawlist}/gi, (usersToMention.join(', ') || 'N/A'))
                        .replace(/{formatlist}/gi, (formatedPart.join(', ') || 'N/A'))
                        .replace(/{formatuser}/gi, (events.participants[0] || 'N/A').replace(/@s.whatsapp.net/g, ''))
                        .replace(/{desc}/gi, groupMetadata.desc)
                        .replace(/\\n/gi, '\n')
                        .replace(/\{([^}]*)\}/gi, (match, key) => Indexer('others').repl(toReplacer, match, key))
                    );

                    /* Se tiver marcação */
                    if (functions[fireType].text.includes('userm') || functions[fireType].text.includes('groupm')) {
                        /* Envia a mensagem customizada por marcação */
                        envInfo.results.value = await kill.sendMessage(events.id, {
                            text: customMessage,
                            mentions: usersToMention,
                        });

                        /* Se a mensagem customizada não tem marcação */
                    } else {
                        /* Envia a mensagem sem @ */
                        envInfo.results.value = await kill.sendMessage(events.id, {
                            text: customMessage,
                        });
                    }
                }

                /* Reseta a lista dos 'deixados para depois' */
                cooldown[events.id][fireType].person = [];

                /* Se não for evento de remover */
            } else if (!envInfo.parameters.toremove.value.includes(fireType)) {
                /* Adiciona os não marcados na lista para a próxima marcação */
                cooldown[events.id][fireType].person.push(events.participants);
                cooldown[events.id][fireType].person = cooldown[events.id][fireType].person.flat(5);
            }

            /* Se for um evento de remoção */
            if (envInfo.parameters.toremove.value.includes(fireType)) {
                /* Remove o(s) usuário(s) */
                await kill.groupParticipantsUpdate(events.id, usersToMention, 'remove');
            }
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

/* Função que decide o que rodar */
async function eventChanger(
    kill = envInfo.functions.events.arguments.kill.value,
    events = envInfo.functions.events.arguments.events.value,
) {
    /* Define um resultado padrão temporário para não afetar a envInfo */
    const tempInfo = {
        results: {
            value: false,
            success: false,
        },
    };

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        if (kill?.sendMessage && typeof events.participants === 'object') {
            /* Só roda se não for a Íris */
            if (!events.participants.includes(irisNumber)) {
                /* Remove a BOT da lista, se estiver */
                const usersToMention = events.participants.filter((ids) => ids !== irisNumber);

                /* Define a functions e o events para sobrepor */
                const functions = Indexer('sql').get('groups', usersToMention[0], events.id).value;
                const assignEvent = events;

                /* Define os termos de cada uso */
                /* Whitelist */
                const whiteListed = functions.whitelist.values.map((wl) => `${wl.replace(/@s.whatsapp.net/gi, '')}@s.whatsapp.net`);

                /* Blacklist */
                let blackListed = functions.blacklist.values.map((bk) => `${bk.replace(/@s.whatsapp.net/gi, '')}@s.whatsapp.net`);
                blackListed = blackListed.filter((black) => usersToMention.includes(black) && (functions.whitelist.enable === false || (functions.whitelist.enable === true && !whiteListed.includes(black))));

                /* Antifake */
                let antiFaked = usersToMention.map((fk) => `${fk.replace(/@s.whatsapp.net/gi, '')}@s.whatsapp.net`);
                antiFaked = antiFaked.filter((fake) => functions.antifake.values.some((af) => fake.startsWith(af) && !whiteListed.some((wl) => fake.startsWith(wl) && functions.whitelist.enable === true)));

                /* ---------------------- LISTADO NA LISTA NEGRA ---------------------- */

                /* Se for evento de entrar, tiver blacklist ativo e quem entrou for bloqueado */
                if (assignEvent.action === 'add' && functions.blacklist.enable === true && blackListed.length > 0) {
                    /* Ajusta a participants para não usar em inocentes */
                    assignEvent.participants = blackListed;

                    /* Define o resultado */
                    tempInfo.results.value = await runEvent(kill, assignEvent, functions, 'blacklist', assignEvent.action);

                    /* Impede o uso das funções abaixo */
                    assignEvent.action = 'alreadyDone';
                }

                /* ------------------------ ANTI NÚMEROS FAKES ------------------------ */

                /* Se for evento de entrar, tiver antifake ativo e quem entrou for fake/estrangeiro */
                if (assignEvent.action === 'add' && functions.antifake.enable === true && antiFaked.length > 0) {
                    /* Ajusta a participants para não usar em inocentes */
                    assignEvent.participants = antiFaked;

                    /* Define o resultado */
                    tempInfo.results.value = await runEvent(kill, assignEvent, functions, 'antifake', assignEvent.action);

                    /* Impede o uso das funções abaixo */
                    assignEvent.action = 'alreadyDone';
                }

                /* ---------------------------- BEM VINDOS ---------------------------- */

                /* Se é evento de entrar e o grupo tem welcome ativo */
                if (assignEvent.action === 'add' && functions.welcome.enable === true) {
                    /* Define o resultado */
                    tempInfo.results.value = await runEvent(kill, events, functions, 'welcome', assignEvent.action);

                    /* Impede o uso das funções abaixo */
                    assignEvent.action = 'alreadyDone';
                }

                /* ------------------------------ ADEUS ------------------------------- */

                /* Se for um evento de saída e o grupo tiver goodbye ativo */
                if (assignEvent.action === 'remove' && functions.goodbye.enable === true) {
                    /* Define o resultado */
                    tempInfo.results.value = await runEvent(kill, events, functions, 'goodbye', assignEvent.action);

                    /* Impede o uso das funções abaixo */
                    assignEvent.action = 'alreadyDone';
                }
            }
        }

        /* Define o sucesso */
        tempInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return tempInfo;
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
        [envInfo.exports.runner]: { value: runEvent },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.events]: { value: eventChanger },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
