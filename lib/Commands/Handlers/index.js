/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const language = require('../../Dialogues/index');
const Indexer = require('../../index');

/* JSON's | Utilidades */
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
    const toDisable = ['off', 'disable', '0'];
    const toEnable = ['on', 'enable', '1'];
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
                isGroupCreator,
                functions,
                prefix,
                isOwner,
                isAllowed,
                command,
                argl,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

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

            /* Define se roda */
            if (conditions === true && type !== 'none') {
                /* Define o tipo de valor final */
                const isHandling = DisEna.includes(body) || DisEna.includes(argl[0]);
                const enaDis = toEnable.includes(body) || toEnable.includes(argl[0]);
                let theCode = Indexer('sql').jsonfixer(body);

                /* Se houver um JSON válido */
                if (theCode !== false) {
                    /* Tenta fazer um parse */
                    theCode = JSON.parse(body);

                    /* Se for, define como a body */
                } else theCode = body.replace(/-add|-rem|-clear/gi, '');

                /* Case para comandos de ajuda normais */
                if (arks.includes('--help') || type === 'handlers') {
                    /* Envia uma mensagem de ajuda comum */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });

                    /* Case para comandos de ajuda de dono */
                } else if (arks.includes('--help-dev') && isOwner === true) {
                    /* Manda a mensagem de ajuda de dev */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'Developer', true, true, envInfo) }, { quoted: quoteThis });

                    /* Outros */
                } else if (isHandling) {
                    /* Checa se já está no valor ideal */
                    if (functions[type]?.enable === enaDis) {
                        /* Retorna o resultado como a mensagem e termina de executar */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Extras', 'Defined', true, true, env.value) }, { quoted: quoteThis });

                        /* Se não for o caso, configura */
                    } else {
                        /* Faz a configuração do enable */
                        Indexer('sql').update('groups', user, chatId, type, { enable: enaDis });

                        /* Diz que ativou */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Extras', 'Finished', true, true, env.value) }, { quoted: quoteThis });
                    }

                    /* Caso seja uma Array */
                } else if (Array.isArray(theCode) && isOwner) {
                    /* Define o dialogo para mandar */
                    let setDialogue = language(region, 'Extras', 'Finished', true, true, env.value);

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
                            Indexer('sql').update('groups', user, chatId, type, { values: newArraye });

                            /* Se não for, define o dialogo como menu de ajuda */
                        } else setDialogue = language(region, 'Helper', 'User', true, true, envInfo);
                    } else setDialogue = language(region, 'Helper', 'User', true, true, envInfo);

                    /* Manda o dialogo */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: setDialogue }, { quoted: quoteThis });

                    /* Se for uma Object */
                } else if (!Array.isArray(theCode) && typeof theCode === 'object' && theCode !== null && isOwner) {
                    /* Executa a Object no SQL */
                    Indexer('sql').update('groups', user, chatId, type, theCode);

                    /* Diz que executou */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Extras', 'Finished', true, true, env.value) }, { quoted: quoteThis });

                    /* Se for String */
                } else if (typeof theCode === 'string') {
                    /* if para definir os diferentes tipos de comando */
                    if (['vips', 'mods', 'blacklist', 'prefix', 'whitelist', 'antifake'].includes(type) && argl[0] !== '-text') {
                        /* Determina se deve adicionar */
                        if (argl[0] === '-add') {
                            /* Adiciona os usuários ou demais na lista */
                            Indexer('sql').update('groups', user, chatId, type, { values: [...functions[type].values, argl[1]].flat(5) });

                            /* Determina se deve remover */
                        } else if (argl[0] === '-rem') {
                            /* Remove da lista */
                            Indexer('sql').update('groups', user, chatId, type, { values: functions[type].values.filter((d) => d !== argl[1]) });

                            /* Determina se deve resetar */
                        } else if (argl[0] === '-clear') {
                            /* Limpa os users da lista */
                            Indexer('sql').update('groups', user, chatId, type, { values: [] });

                            /* Se nenhum */
                        } else {
                            /* Manda ajuda */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });
                        }

                        /* Sistemas de texto */
                    } else if (['goodbye', 'promote', 'demote', 'welcome', 'blacklist', 'antifake'].includes(type) && argl[0] === '-text') {
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
                            if (functions[type]?.text === bodhy) {
                                /* Retorna o resultado como a mensagem e termina de executar */
                                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Extras', 'Defined', true, true, env.value) }, { quoted: quoteThis });

                                /* Se não for o caso, configura */
                            } else {
                                /* Adiciona os usuários ou demais na lista */
                                Indexer('sql').update('groups', user, chatId, type, { text: bodhy });
                            }

                            /* Determina se deve remover */
                        } else if (argl[1] === '-rem') {
                            /* Remove da lista */
                            Indexer('sql').update('groups', user, chatId, type, { text: bodhy });

                            /* Determina se deve resetar */
                        } else if (argl[1] === '-clear') {
                            /* Limpa os users da lista */
                            Indexer('sql').update('groups', user, chatId, type, { text: bodhy });

                            /* Se nenhum */
                        } else {
                            /* Manda ajuda */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });
                        }
                    }

                    /* Diz que executou */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Extras', 'Finished', true, true, env.value) }, { quoted: quoteThis });

                    /* Padrão */
                } else {
                    /* Manda ajuda */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });
                }

                /* Se caso não for permitido */
            } else {
                /* Avisa que 'só adm' pode usar */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'Restrict', true, true, env.value) }, { quoted: quoteThis });
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
                command: 'Handler',
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
