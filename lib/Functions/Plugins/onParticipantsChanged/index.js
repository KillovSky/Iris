/* eslint-disable max-len */
/*
    Esse sistema apenas redireciona o tipo de função.
    Então não possui envInfo, é similar ao Indexer.
    Os sistemas ativam somente a 1 participante por vez...
    Permitir muitos de uma vez pode causar spam.
*/

/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');
const language = require('../../../Dialogues');

/* JSON"S | Utilidades */
const cooldown = {};
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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

/* Função de remoção/adição */
async function runEvent(
    kill = envInfo.functions.events.arguments.kill.value,
    events = envInfo.functions.events.arguments.events.value,
    functions = envInfo.functions.events.arguments.functions.value,
    fireType = envInfo.functions.events.arguments.fireType.value,
    eventType = envInfo.functions.events.arguments.eventType.value,
) {
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

    /* Try-Catch para casos de erro */
    try {
        /* Determina se algum parâmetro veio errado */
        if ([kill, events, functions].some((f) => typeof f === 'object') && funTypes.includes(fireType) && typeof eventType === 'string') {
            /* Define o nome do evento */
            const eventNomeclt = Indexer('string').upperland(fireType, false);

            /* Define os usuario a marcar */
            let usersToMention = [...cooldown[events.id][fireType].person, ...events.participants].flat(5);

            /* Corrige se tiver null */
            usersToMention = usersToMention.filter((s) => s?.includes('@s.whatsapp.net'));

            /* Verifica se o tempo de envio da mensagem terminou */
            if (cooldown[events.id][fireType].time < Date.now()) {
                /* Define os dados do grupo */
                const groupMetadata = await kill.groupMetadata(events.id);

                /* Printa a mensagem na tela sobre o evento */
                console.log(Indexer('color').echo(`[${fireType.toUpperCase()}]`, 'red').value, Indexer('color').echo(language(region, 'Console', eventNomeclt, true, true, { userm: `@${usersToMention.join(', ').replace(/@s.whatsapp.net/g, '')}`, groupm: `'${groupMetadata.subject}'` }), 'yellow').value);

                /* Determina o tempo da mensagem */
                cooldown[events.id][fireType].time = Date.now() + (
                    /* Multiplicado em 1min do valor que o dono quer */
                    Number(envInfo.parameters.timedate.value[fireType]) * 60000
                );

                /* Determina se roda o padrão ou uma mensagem customizada */
                if (typeof functions[fireType].text !== 'string') {
                    /* Define o nome do evento */
                    const eventTypeName = eventType === 'add' ? 'Welcome' : 'Goodbye';

                    /* Define a foto da pessoa */
                    let profilePicture = false;

                    /* Tenta obter a do usuario */
                    try {
                        /* Se der bom, insere */
                        profilePicture = await kill.profilePictureUrl(events.id, 'image');

                        /* Se falhar */
                    } catch (err) {
                        /* Usa uma padrão */
                        profilePicture = 'GIMMEAPICTURE';
                    }

                    /* Verifica se é uma URL */
                    if (!Indexer('regexp').urls(profilePicture).value.isURL) {
                        /* Define uma padrão */
                        profilePicture = 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/user.png';
                    }

                    /* Cria a imagem de welcome */
                    const canvaGreetings = await Indexer('cards').greets(profilePicture, eventType, language(region, 'Greets', `${eventTypeName}Title`, true, true, {}), language(region, 'Greets', `${eventTypeName}Description`, true, true, {}));

                    /* Se for um Buffer */
                    if (Buffer.isBuffer(canvaGreetings.value)) {
                        /* Envia a mensagem customizada */
                        envInfo.results.value = await kill.sendMessage(events.id, {
                            image: canvaGreetings.value,
                            caption: language(region, 'Greets', eventNomeclt, true, true, { userm: `@${usersToMention.join(' @').replace(/@s.whatsapp.net/g, '')}`, groupm: groupMetadata.subject }),
                            mentions: usersToMention,
                        });

                        /* Se não for */
                    } else {
                        /* Envia a mensagem sem imagem */
                        envInfo.results.value = await kill.sendMessage(events.id, { text: language(region, 'Greets', eventNomeclt, true, true, { userm: `@${usersToMention.join(' @').replace(/@s.whatsapp.net/g, '')}`, groupm: groupMetadata.subject }), mentions: usersToMention });
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

                    /* Define a mensagem */
                    const customMessage = functions[fireType].text.replace(/{userm}/gi, `@${usersToMention.join(' @').replace(/@s.whatsapp.net/g, '')}`).replace(/{groupm}/gi, groupMetadata.subject).replace(/\\n/gi, '\n').replace(/\{([^}]*)\}/gi, (match, key) => Indexer('others').repl(toReplacer, match, key));

                    /* Se tiver marcação */
                    if (functions[fireType].text.includes('userm') || functions[fireType].text.includes('groupm')) {
                        /* Envia a mensagem customizada por marcação */
                        envInfo.results.value = await kill.sendMessage(events.id, { text: customMessage, mentions: usersToMention });

                        /* Se a mensagem customizada não tem marcação */
                    } else {
                        /* Envia a mensagem customizada sem @ */
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
                /* Remove o usuario(s) */
                await kill.groupParticipantsUpdate(events.id, usersToMention, 'remove');
            }
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

/* Função que decide o que rodar */
async function eventChanger(
    kill = envInfo.functions.events.arguments.kill.value,
    events = envInfo.functions.events.arguments.events.value,
) {
    /* Define um resultado padrão temporario para não afetar a envInfo */
    const tempInfo = {
        results: {
            value: false,
            success: false,
        },
    };

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        if (typeof kill?.sendMessage === 'function' && typeof events?.participants === 'object') {
            /* Só roda se não for a Íris */
            if (!events.participants.some((ids) => ids === irisNumber)) {
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

                /* Se for um evento de saida e o grupo tiver goodbye ativo */
                if (assignEvent.action === 'remove' && functions.goodbye.enable === true) {
                    /* Define o resultado */
                    tempInfo.results.value = await runEvent(kill, events, functions, 'goodbye', assignEvent.action);

                    /* Impede o uso das funções abaixo */
                    assignEvent.action = 'alreadyDone';
                }

                /* ------------------------------- PROMOTE ------------------------------- */

                /* Se for um evento de saida e o grupo tiver goodbye ativo */
                if (assignEvent.action === 'promote' && functions.promote.enable === true) {
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
        echoError(error);
    }

    /* Retorna a nova Array */
    return postResults(tempInfo.results);
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

        /* Insere a eventChanger na envInfo */
        envInfo.functions.events.value = eventChanger;

        /* Insere a runEvent na envInfo */
        envInfo.functions.runner.value = runEvent;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.runner]: envInfo.functions.runner.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.events]: envInfo.functions.events.value,
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
