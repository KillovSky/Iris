/* eslint-disable no-case-declarations */
/* eslint-disable indent */

/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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

/* Cria a função de comando */
async function changeUser(
    kill = envInfo.functions.exec.arguments.kill.value,
    env = envInfo.functions.exec.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Define os dados necessarios */
            const {
                quoteThis,
                chatId,
                isOwner,
                isGroupMsg,
                isAllowed,
                chat,
                user,
                argl,
                mentionedJidList,
                body,
                groupAdmins,
                groupCreator,
                groupMembersId,
                command,
                arks,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Se não for grupo */
            if (!isGroupMsg) {
                /* Manda a mensagem só de grupos */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'OnlyGroups', true, true, envInfo).value }, { quoted: quoteThis });

                /* Define o menu de ajuda */
            } else if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, { quoted: quoteThis });

                /* Menu de ajuda normal */
            } else if (arks.includes('--help') || command === 'manager') {
                /* Manda a mensagem de ajuda normal */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, { quoted: quoteThis });

                /* Se dono, admin, mod ou pode rodar */
            } else if (isAllowed && isGroupMsg) {
                /* Remove as menções invalidas */
                let mentionsDo = mentionedJidList.filter((j) => groupMembersId.includes(j));

                /* Define se vai enviar a mensagem de falta de pessoas */
                let theresNoOne = false;

                /* Define o que fazer por nome de comando */
                switch (command) {
                    /* Limitar grupo, sempre realiza a função inversa */
                    case 'soadm':
                    case 'onlyadms':
                    case 'censor':
                    case 'uncensor':
                        /* Define qual deve ser a ação */
                        const actionSetting = chat.announce === true ? 'not_announcement' : 'announcement';

                        /* Atualiza */
                        await kill.groupSettingUpdate(chatId, actionSetting);
                    break;

                    /* Adicionar ou retirar um aviso para um usuário */
                    case 'warn':
                    case 'unwarn':
                        /* Define as pessoas que não sofrerão avisos */
                        mentionsDo = mentionsDo.filter((j) => (
                            groupMembersId.includes(j)
                            && !groupAdmins.includes(j)
                            && j !== irisNumber
                            && j !== user
                            && !config.owner.value.includes(j)
                        ));

                        /* Define as Objects de quem banir */
                        const warnLimiter = {
                            banPeoples: 0,
                        };

                        /* Se as menções não forem uma quantidade de zero */
                        if (mentionsDo.length !== 0) {
                            /* Insere um aviso para todos os mencionados */
                            for (let i = 0; i < mentionsDo.length; i += 1) {
                                /* Define a informação da pessoa */
                                let originalData = Indexer('sql').get('personal', mentionsDo[i], chatId).value;

                                /* Define o originalData por grupo */
                                if (originalData.warn[chatId] == null) {
                                    /* Com valores padrões */
                                    originalData.warn[chatId] = {
                                        amount: 0,
                                        lastWarnDate: 0,
                                        firstWarnDate: 0,
                                        firstWarnAdmin: false,
                                        lastWarnAdmin: false,
                                    };
                                }

                                /* Define se remove ou adiciona um warn */
                                if (command === 'unwarn') {
                                    /* Tira 1 */
                                    originalData.warn[chatId].amount -= 1;

                                    /* Se não, adiciona */
                                } else originalData.warn[chatId].amount += 1;

                                /* Se o warn ficou negativo */
                                if (originalData.warn[chatId].amount < 0) {
                                    /* Reseta ele a zero */
                                    originalData.warn[chatId].amount = 0;
                                }

                                /* Atualiza um a um deles */
                                originalData.warn[chatId].lastWarnDate = Date.now();
                                originalData.warn[chatId].lastWarnAdmin = user;
                                originalData.warn[chatId].firstWarnDate = (
                                    originalData.warn[chatId].firstWarnDate || Date.now()
                                );
                                originalData.warn[chatId].firstWarnAdmin = (
                                    originalData.warn[chatId].firstWarnAdmin !== '1234@s.whatsapp' && originalData.warn[chatId].firstWarnAdmin !== false
                                    ? originalData.warn[chatId].firstWarnAdmin
                                    : user
                                );

                                /* Insere um aviso */
                                const warnData = Indexer('sql').update('personal', mentionsDo[i], chatId, 'warn', originalData.warn);
                                originalData = warnData.value;

                                /* Adiciona normal apenas */
                                warnLimiter[mentionsDo[i]] = {
                                    warn: warnData.value.warn[chatId].amount,
                                    number: mentionsDo[i].replace(/@s.whatsapp.net/gi, ''),
                                    ban: false,
                                };

                                /* Verifica se está no limite */
                                if (warnData.value.warn[chatId].amount >= config.warnLimit.value) {
                                    /* Insere na object para remoção */
                                    warnLimiter.banPeoples += 1;
                                    warnLimiter[mentionsDo[i]].ban = true;
                                }
                            }

                            /* Se o warn não for todos banidos */
                            if (warnLimiter.banPeoples !== mentionsDo.length) {
                                /* Envia a mensagem do motivo do warn */
                                envInfo.results.value = await kill.sendMessage(chatId, {
                                    text: Indexer('sql').languages(region, 'Security', 'Warn', true, true, {
                                        people: Object.keys(warnLimiter).map((f) => warnLimiter[f].number).join(' @'),
                                        reason: (body.includes('|') ? body.split('|')[1] : body) || '...',
                                        warns: (
                                            Object.keys(warnLimiter).filter((g) => g !== 'banPeoples')
                                            .map((f) => `${warnLimiter[f].number} = [${warnLimiter[f].warn}/${config.warnLimit.value}]`)
                                            .join('\n@')
                                        ),
                                    }).value,
                                    mentions: mentionsDo,
                                });
                            }

                            /* Se tiver algum para banir */
                            if (warnLimiter.banPeoples > 0) {
                                /* Define quem banir */
                                const bannedPeople = (
                                    Object.keys(warnLimiter).filter((g) => warnLimiter[g].ban)
                                );

                                /* Envia a mensagem de ban | warn é o mesmo que limit */
                                envInfo.results.value = await kill.sendMessage(chatId, {
                                    text: Indexer('sql').languages(region, 'Security', 'Notice', true, true, {
                                        userFormated: bannedPeople.map((s) => s.replace(/@s.whatsapp.net/gi, '')).join(' @'),
                                        notice: `"[WARN] ~ ${(body.includes('|') ? body.split('|')[1] : body) || '...'}"`,
                                    }).value,
                                    mentions: bannedPeople,
                                });

                                /* Remove os que chegaram ao limite */
                                await kill.groupParticipantsUpdate(chatId, bannedPeople, 'remove');

                                /* Reseta a Db do Warn de quem foi removido */
                                for (let i = 0; i < bannedPeople.length; i += 1) {
                                    /* Define a informação da pessoa */
                                    const originalData = Indexer('sql').get('personal', bannedPeople[i], chatId).value;

                                    /* Define valores padrões */
                                    originalData.warn[chatId] = {
                                        amount: 0,
                                        lastWarnDate: 0,
                                        firstWarnDate: 0,
                                        firstWarnAdmin: false,
                                        lastWarnAdmin: false,
                                    };

                                    /* Reinicia o contador delas */
                                    Indexer('sql').update('personal', bannedPeople[i], chatId, 'warn', originalData.warn);
                                }
                            }

                            /* Se tiver falta de pessoas para isso */
                        } else theresNoOne = true;
                    break;

                    /* Remoções e banimentos temporários */
                    case 'softban':
                    case 'kick':
                    case 'remove':
                        /* Define as pessoas a banir */
                        mentionsDo = mentionsDo.filter((j) => (
                            groupMembersId.includes(j)
                            && !groupAdmins.includes(j)
                            && j !== irisNumber
                            && j !== user
                            && !config.owner.value.includes(j)
                        ));

                        /* Se as menções não forem uma quantidade de zero */
                        if (mentionsDo.length !== 0 || (mentionsDo.length !== 0 && /[0-9]+/gi.test(argl[0] || '') && command === 'softban')) {
                            /* Envia a mensagem de banimento */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Remove', true, true, envInfo).value, mentions: mentionsDo }, { quoted: quoteThis });

                            /* Bane as pessoas */
                            if (command !== 'softban' || config.allowAddParticipants.value === true) await kill.groupParticipantsUpdate(chatId, mentionsDo, 'remove');

                            /* Verifica se o argumento 1 é númerico e o comando é softban */
                            if (command === 'softban' && config.allowAddParticipants.value === true) {
                                /* Aguarda o tempo para voltar a pessoa em minutos */
                                await Indexer('others').sleep(Number(argl[0]) * 60000);

                                /* Adiciona as pessoas */
                                await kill.groupParticipantsUpdate(chatId, mentionsDo, 'add');

                                /* Envia a mensagem de voltando */
                                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Softban', true, true, envInfo).value, mentions: mentionsDo });

                                /* Desiste de rodar o comando se não permitido */
                            } else theresNoOne = true;

                            /* Se tiver falta de pessoas para isso */
                        } else theresNoOne = true;
                    break;

                    /* Promover a administrador */
                    case 'promote':
                    case 'toadm':
                    case 'giveadm':
                        /* Define quem vai promover */
                        mentionsDo = mentionedJidList.filter((j) => !groupAdmins.includes(j));

                        /* Se as menções não forem uma quantidade de zero */
                        if (mentionsDo.length !== 0) {
                            /* Envia a mensagem de banimento */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Promote', true, true, envInfo).value, mentions: mentionsDo }, { quoted: quoteThis });

                            /* Promove as pessoas */
                            await kill.groupParticipantsUpdate(chatId, mentionsDo, 'promote');

                            /* Se tiver falta de pessoas para isso */
                        } else theresNoOne = true;
                    break;

                    /* Demitir um administrador */
                    case 'demote':
                    case 'tiraradm':
                    case 'undoadm':
                        /* Define quem vai demitir */
                        mentionsDo = mentionedJidList.filter((j) => (
                            groupAdmins.includes(j)
                            && j !== groupCreator
                            && !config.owner.value.includes(j)
                            && j !== user
                        ));

                        /* Se as menções não forem uma quantidade de zero */
                        if (mentionsDo.length !== 0) {
                            /* Envia a mensagem de banimento */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Demote', true, true, envInfo).value, mentions: mentionsDo }, { quoted: quoteThis });

                            /* Promove as pessoas */
                            await kill.groupParticipantsUpdate(chatId, mentionsDo, 'demote');

                            /* Se tiver falta de pessoas para isso */
                        } else theresNoOne = true;
                    break;

                    /* Adicionar um membro */
                    case 'add':
                    case 'unban':
                    case 'unkick':
                        /* Se o dono ativou o sistema de adicionar */
                        if (config.allowAddParticipants.value === true) {
                            /* Define quem vai adicionar */
                            mentionsDo = mentionedJidList.filter((j) => (
                                !groupMembersId.includes(j)
                            ));

                            /* Define a let de resultado e se tem um body superior a 7 caracteres */
                            let bodyNumbers = '';
                            if (body.length > 7 && /\d/.test(body)) {
                                /* Ajusta a body */
                                bodyNumbers = body.replace(/[a-zA-Z]/gi).replace(/\+?(\d{1,5})[-\s]?(\d{1,4}[-\s]?\d{1,4})\b/gi, (match, country, rest) => `${country}${rest.replace(/\D/gi, '')}`).split(' ')
                                .map((d) => `${d.replace(/\D/g, '')}@s.whatsapp.net`)
                                .filter((n) => /[0-9]+@s.whatsapp.net/gi.test(n));
                            }

                            /* Define os números pela body */
                            mentionsDo = [
                                ...mentionsDo,
                                ...bodyNumbers,
                            ].filter((j) => !groupMembersId.includes(j));

                            /* Define quem adicionar */
                            const adicionate = [];

                            /* Se as menções não forem uma quantidade de zero */
                            if (mentionsDo.length !== 0) {
                                /* Executa um loop para adicionar um a um */
                                for (let number = 0; number < mentionsDo.length; number += 1) {
                                    /* Se o número estiver no WhatsApp */
                                    /* eslint-disable-next-line no-await-in-loop */
                                    const [result] = await kill.onWhatsApp(mentionsDo[number]);

                                    /* E passar na verificação */
                                    if (result.exists === true) {
                                        /* Adiciona a pessoa na lista de adicionar */
                                        adicionate.push(result.jid);
                                    }
                                }

                                /* Adiciona todos */
                                await kill.groupParticipantsUpdate(chatId, adicionate, 'add');

                                /* Envia a mensagem de adicionar */
                                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Add', true, true, envInfo).value, mentions: adicionate }, { quoted: quoteThis });

                                /* Se tiver falta de pessoas para isso */
                            } else theresNoOne = true;
                        } else theresNoOne = true;
                    break;

                    /* Se não for comando válido */
                    default:
                        theresNoOne = true;
                    break;
                }

                /* Se não rodou nada */
                if (theresNoOne === true) {
                    /* Manda a mensagem de falta de pessoas/comando errado */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'None', true, true, envInfo).value, mentions: mentionsDo });
                }

                /* Se caso não for permitido */
            } else {
                /* Avisa que 'só adm' pode usar */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Restrict', true, true, env.value).value }, { quoted: quoteThis });
            }
        }

        /*
            Define o sucesso, se seu comando der erro isso jamais será chamado
            Então o success automaticamente será false em falhas
        */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        /* Insira o name que você definiu na envInfo (name) onde pede abaixo */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'MANAGER',
                time: (new Date()).toLocaleString(),
            }).value,
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

        /* Insere a changeUser na envInfo */
        envInfo.functions.exec.value = changeUser;

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
