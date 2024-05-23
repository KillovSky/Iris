/* eslint-disable max-len */

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
async function functionsEditor(
    kill = envInfo.functions.exec.arguments.kill.value,
    env = envInfo.functions.exec.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Define os valores para considerar ativar ou desativar */
    const toDisable = ['off', 'disable'];
    const toEnable = ['on', 'enable'];
    const DisEna = [...toDisable, ...toEnable];

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Constrói os parâmetros */
            const {
                chatId,
                quoteThis,
                body,
                user,
                isGroupMsg,
                isGroupAdmins,
                arks,
                mentionedJidList,
                isGroupCreator,
                personal,
                args,
                prefix,
                isOwner,
                isAllowed,
                command,
                argl,
            } = env.value;
            const settingsData = env.value.functions;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define o tipo avançado de uso */
            const sqlType = !isGroupMsg ? 'personal' : 'groups';

            /* Define a verdadeira functions */
            const functions = !isGroupMsg ? personal : settingsData;

            /* Define o filter para nao adicionar o próprio usuário nas listas */
            let mentionAdd = mentionedJidList.filter((t) => t !== user);
            mentionAdd = mentionAdd.map((f) => f.replace(/@|@s.whatsapp.net/gi, ''));

            /* Define o nome da funcão */
            const typeBase = command.toLowerCase();
            let type = Object.keys(functions).filter((s) => s.toLowerCase() === typeBase && s !== 'error')[0] || 'none';
            type = typeBase === 'handlers' ? typeBase : type;

            /* Determina quem pode executar */
            const conditions = (
                /* Se for administrador */
                (isGroupMsg && isGroupAdmins)

                /* Se for o dono do grupo */
                || (isGroupMsg && isGroupCreator)

                /* Se for o chefe da Íris */
                || (isGroupMsg && isOwner)

                /* Se for um VIP/MOD */
                || (isGroupMsg && isAllowed)
            );

            /* Condições 2 */
            const conditions2 = (
                /* Se for language em grupo */
                (type === 'language' && argl.some((gl) => Indexer('sql').languages('G.A.L').value.includes(gl)) && conditions)

                /* Se for language e no PV, ativador */
                || (type === 'language' && argl.some((gl) => DisEna.includes(gl)) && !isGroupMsg)

                /* Se for language e no PV, definição */
                || (type === 'language' && argl.some((gl) => Indexer('sql').languages('G.A.L').value.includes(gl)) && !isGroupMsg)

                /* Se for modo DND */
                || (type === 'dnd' && argl.some((gl) => DisEna.includes(gl)) && !Object.keys(functions).some((key) => body.includes(key)))
            );

            /* Define se roda */
            if ((conditions && type !== 'none') || (conditions2 && type !== 'none')) {
                /* Define o tipo de valor final */
                const isHandling = DisEna.some((rs) => body.includes(rs));
                const enaDis = toEnable.some((rs) => body.includes(rs));
                let theCode = Indexer('sql').jsonfixer(body);

                /* Se houver um JSON válido */
                if (theCode !== false) {
                    /* Tenta fazer um parse */
                    theCode = JSON.parse(body);

                    /* Se for, define como a body */
                } else theCode = body.replace(/-add|-rem|-clear/gi, '');

                /* Se quer apenas os exemplos */
                if (arks.includes('--examples')) {
                    /* Envia uma mensagem de ajuda com apenas exemplos */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: '1. *ATIVAR/DESATIVAR/MULTI-ATIVAR & DESATIVAR* ⬇️\n> 🔧 /handlers -antifake -antilinks -blacklist -prefix -nsfw -spy -language -goodbye -whitelist -leveling -welcome -antispam -dnd on/off\n> 🔧 /command on/off\n\n2. *ADICIONAR VALOR/ADICIONAR LISTA* ⬇️\n> ➕ /antifake -add 1\n> ➕ /antifake -add 54|351|99\n> ➕ /whitelist -add 551234|198765|1\n> ➕ /blacklist -add 1|54|351\n> ➕ /vips -add 1|54|351\n> ➕ /mods -add 1|54|351\n> ➕ /prefix -add !|^|<\n\n3. *REMOVER VALOR/REMOVER LISTA* ⬇️\n> ➖ /antifake -rem 1\n> ➖ /antifake -rem 54|351|99\n> ➖ /whitelist -rem 551234|198765|1\n> ➖ /blacklist -rem 1|54|351\n> ➖ /vips -rem 1|54|351\n> ➖ /mods -rem 1|54|351\n> ➖ /prefix -rem !|^|<\n\n4. *RESETAR/LIMPAR FUNÇÃO* ⬇️\n> 🗑️ /antifake -clear\n> 🗑️ /whitelist -clear\n> 🗑️ /blacklist -clear\n> 🗑️ /vips -clear\n> 🗑️ /mods -clear\n> 🗑️ /prefix -clear\n\n5. *USOS CUSTOMIZADOS* ⬇️\n> 🔄 /antilinks -set 1/2/3\n> 🚫 /antispam -ban/-set 10\n\n6. *ADICIONAR TEXTOS CUSTOMIZADOS* ⬇️\n> ✏️ /welcome -text -add {userm} entrou em {groupm}, leia a {desc}!\n> ✏️ /goodbye -text -add {userm} saiu de {groupm}!\n> ✏️ /antifake -text -add {userm} é número fake ou estrangeiro!\n> ✏️ /blacklist -text -add {userm} fez porcaria antes e foi posto na blacklist!\n> ✏️ /language -text -add pt\n\n7. *LIMPAR TEXTOS CUSTOMIZADOS* ⬇️\n> 🗑️ /welcome -text -clear\n> 🗑️ /goodbye -text -clear\n> 🗑️ /antifake -text -clear\n> 🗑️ /blacklist -text -clear\n> 🗑️ /language -text -clear\n\n8. *ANTI-EVERYONE (USER ALLOWED COMMAND)* ⬇️\n> 🔇 /dnd on/off' }, { quoted: quoteThis });

                    /* Caso para comandos de ajuda normais */
                } else if (arks.includes('--help') || type === 'handlers' || args.length === 0) {
                    /* Envia uma mensagem de ajuda comum */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, { quoted: quoteThis });

                    /* Case para comandos de ajuda de dono */
                } else if (arks.includes('--help-dev') && isOwner === true) {
                    /* Manda a mensagem de ajuda de dev */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, { quoted: quoteThis });

                    /* Outros */
                } else if (isHandling) {
                    /* Define todos os ativadores */
                    let sysFunctions = (body.match(/-\s?\w+/g) || []).map((word) => word.replace(/-| on/gi, '').trim());
                    sysFunctions.push(command);
                    sysFunctions = sysFunctions.filter((r) => Object.keys(functions).includes(r));

                    /* Define apenas os que vá realmente ativar */
                    const validValues = sysFunctions.filter((en) => functions[en]?.enable !== enaDis || en === 'dnd');

                    /* Checa for permitido o uso */
                    if (validValues.length > 0 || validValues.includes('dnd')) {
                        /* Cria uma Object para cada item ativado */
                        const objectActive = {};
                        validValues.forEach((obj) => {
                            objectActive[obj] = {
                                enable: enaDis, lastDate: Date.now(), lastUser: user, lastState: functions[obj]?.enable, firstEdition: functions[obj]?.firstEdition || functions[obj]?.enable, firstUser: functions[obj]?.firstUser || user, firstDate: functions[obj]?.firstDate || Date.now(),
                            };
                        });

                        /* Se tiver modo DND ativando, adiciona quem usou */
                        if (Object.keys(objectActive).includes('dnd') && enaDis === true) {
                            /* Define a values do modo DND */
                            objectActive.dnd.values = [user, ...functions.dnd.values].flat(5);

                            /* Se for modo remoção */
                        } else if (Object.keys(objectActive).includes('dnd') && enaDis === false) {
                            /* Faz um filtro */
                            objectActive.dnd.values = functions.dnd.values.filter((usr) => usr !== user);
                        }

                        /* Faz a configuração do enable */
                        const newValues = Indexer('sql').update(sqlType, user, chatId, false, objectActive);

                        /* Define uma resposta adicional para saber quais ativou */
                        const functionValues = Object.entries(newValues.value).map(([key, { enable, values }], index) => `${index + 1}. ${key}\n> Enable: ${enable ? '✅' : '❌'}\n> Values: ${values && values.length > 0 ? values.join(', ') : '[]'}\n\n`).join('');

                        /* Diz que ativou */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: `${Indexer('sql').languages(region, 'Extras', 'Finished', true, true, env.value).value}\n\n🔎 Functions:\n\n${functionValues}` }, { quoted: quoteThis });

                        /* Se não for o caso */
                    } else {
                        /* Retorna o resultado como a mensagem e termina de executar */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Defined', true, true, env.value).value }, { quoted: quoteThis });
                    }

                    /* Caso seja uma Array */
                } else if (Array.isArray(theCode) && isOwner) {
                    /* Define o dialogo para mandar */
                    let setDialogue = Indexer('sql').languages(region, 'Extras', 'Finished', true, true, env.value).value;

                    /* Se existir a key que vai usar */
                    if (functions[type] !== null) {
                        /* If's para assimilar os valores corretamente de acordo com a necessidade */
                        if (functions[type].values !== null) {
                            /* Define se é troca, remover ou adicionar */
                            let newArraye = [];

                            /* 1 - Adicionar */
                            if (argl.includes('add')) newArraye = [...functions[type].values, ...theCode];

                            /* 2 - Remover */
                            else if (argl.includes('remove')) newArraye = functions[type].values.filter((d) => !theCode.includes(d));

                            /* 3 - Trocar */
                            else if (argl.includes('change')) newArraye = theCode;

                            /* Faz a inserção da nova array */
                            Indexer('sql').update(sqlType, user, chatId, type, { values: newArraye });

                            /* Se não for, define o dialogo como menu de ajuda */
                        } else setDialogue = Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value;
                    } else setDialogue = Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value;

                    /* Manda o dialogo */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: setDialogue }, { quoted: quoteThis });

                    /* Se for uma Object */
                } else if (!Array.isArray(theCode) && typeof theCode === 'object' && theCode !== null && isOwner) {
                    /* Executa a Object no SQL */
                    Indexer('sql').update(sqlType, user, chatId, type, theCode);

                    /* Diz que executou */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Finished', true, true, env.value).value }, { quoted: quoteThis });

                    /* Se for String */
                } else if (typeof theCode === 'string') {
                    /* Define a nova object no fim */
                    let newDatas = { value: functions };

                    /* if para definir os diferentes tipos de comando */
                    /* Este define se é para setar valores na array, como antifake, prefixos, etc */
                    if (['vips', 'mods', 'blacklist', 'prefix', 'whitelist', 'antifake'].includes(type) && argl[0] !== '-text' && !['antilinks', 'level', 'nsfw', 'antispam', 'spy'].includes(type)) {
                        /* Define o multiadd */
                        let multipleVal = body.split('|').map((val) => val.replace(/-add|-rem|-clear/gi, '').trim());
                        multipleVal = multipleVal.filter((d) => d !== '-add' && d !== '-rem' && d !== '-clear');

                        /* Define os novos valores */
                        const standardValues = type === 'prefix' ? [...new Set([multipleVal])] : [...new Set([multipleVal, ...mentionAdd])].flat(5);
                        let newCodeValues = [...new Set([...functions[type].values, ...standardValues])].flat(5);
                        newCodeValues = newCodeValues.filter((f) => f != null);

                        /* Determina se deve adicionar */
                        if (argl[0] === '-add') {
                            /* Adiciona os usuários ou demais na lista */
                            newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                values: newCodeValues, lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.values, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.values, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                            });

                            /* Determina se deve remover */
                        } else if (argl[0] === '-rem') {
                            /* Remove da lista */
                            newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                values: functions[type].values.filter((d) => !standardValues.includes(d)), lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.values, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.values, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                            });

                            /* Determina se deve resetar */
                        } else if (argl[0] === '-clear') {
                            /* Limpa os users da lista */
                            newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                values: [], lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.values, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.values, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                            });

                            /* Se nenhum */
                        } else {
                            /* Manda ajuda */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, { quoted: quoteThis });
                        }

                        /* Sistemas de texto, como mensagens customizadas de ban, welcome e goodbye */
                    } else if (['goodbye', 'promote', 'demote', 'welcome', 'blacklist', 'antifake', 'language'].includes(type) && argl[0] === '-text' && !['antilinks', 'level', 'nsfw', 'antispam', 'spy'].includes(type)) {
                        /* Define uma RegExp */
                        const regExpCmd = [new RegExp(command, 'gi'), new RegExp(`${prefix}${command}`, 'gi')];

                        /* Define o novo body, tem suporte a diversas criações com variaveis */
                        const bodhy = (body
                            .replace(/-text|-add|-rem|-clear/g, '')
                            .replace(regExpCmd[0], '')
                            .replace(regExpCmd[1], '')
                            .replace(/ {2}/g, '')
                            .replace(/^ /g, '')
                        );

                        /* Determina se deve adicionar */
                        if (argl[1] === '-add') {
                            /* Verifica se já está no valor */
                            if (functions[type]?.text === bodhy || functions[type]?.text === argl[2]) {
                                /* Retorna o resultado como a mensagem e termina de executar */
                                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Defined', true, true, env.value).value }, { quoted: quoteThis });

                                /* Se não for o caso, configura */
                            } else {
                                /* Define o que adicionar */
                                const textAddiction = type === 'language' ? argl[2] : bodhy;

                                /* Adiciona os usuários ou demais na lista */
                                newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                    text: textAddiction, lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.text, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.text, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                                });
                            }

                            /* Determina se deve resetar */
                        } else if (argl[1] === '-clear') {
                            /* Limpa os users da lista */
                            newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                text: false, lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.text, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.text, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                            });

                            /* Se nenhum */
                        } else {
                            /* Manda ajuda */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, { quoted: quoteThis });
                        }

                        /* Define o uso do antispam separadamente */
                    } else if (type === 'antispam') {
                        /* Define a Object de update */
                        const updateSystem = {
                            ban: argl.includes('-ban'), limit: Number((argl.filter((n) => /[0-9]+/gi.test(n))[0] || 10)), lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.limit, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.limit, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                        };

                        /* Executa a atualização dessa função */
                        newDatas = Indexer('sql').update('groups', user, chatId, 'antispam', updateSystem);

                        /* Define o uso do antilinks separadamente | 1 = Todos os links, 2 = Convites de Grupo, 3 = Pornograficos, Virus e Demais */
                    } else if (type === 'antilinks') {
                        /* Define a Object de update */
                        const updateSystem = {
                            type: Number((argl.filter((n) => /[1-3]+/gi.test(n))[0] || 1)), lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.limit, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.limit, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                        };

                        /* Executa a atualização dessa função */
                        newDatas = Indexer('sql').update('groups', user, chatId, 'antilinks', updateSystem);
                    }

                    /* Define uma resposta adicional para saber quais ativou */
                    const dataValues = Object.entries(newDatas.value).map(([key, { enable, values }], index) => `${index + 1}. ${key}\n> Enable: ${enable ? '✅' : '❌'}\n> Values: ${values && values.length > 0 ? values.join(', ') : '[]'}\n\n`).join('');

                    /* Diz que executou */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: `${Indexer('sql').languages(region, 'Extras', 'Finished', true, true, env.value).value}\n\n🔎 Functions:\n\n${dataValues}` }, { quoted: quoteThis });

                    /* Padrão */
                } else {
                    /* Manda ajuda */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, { quoted: quoteThis });
                }

                /* Se não for grupo */
            } else if (!isGroupMsg) {
                /* Manda a mensagem só de grupos */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'OnlyGroups', true, true, envInfo).value }, { quoted: quoteThis });

                /* Se caso não for permitido */
            } else {
                /* Avisa que 'só adm' pode usar */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Restrict', true, true, env.value).value }, { quoted: quoteThis });
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
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'Handler',
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

        /* Insere a functionsEditor na envInfo */
        envInfo.functions.exec.value = functionsEditor;

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
