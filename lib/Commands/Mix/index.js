/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const onlineGames = {};
const playUsers = {};

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
async function guessGame(
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
                chatId,
                isOwner,
                reply,
                arks,
                body,
                command,
                isGroupMsg,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Cria um objeto em memória se for um grupo */
            if (isGroupMsg) {
                /* Se ela já existir usa a que existe, se não, cria */
                onlineGames[chatId] = onlineGames[chatId] || {};

                /* Se for menu de ajuda de DEV */
                if (arks.includes('--help-dev') && isOwner === true) {
                    /* Manda a mensagem de ajuda de dev */
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value,
                    }, reply);

                    /* Menu de ajuda normal */
                } else if (arks.includes('--help')) {
                    /* Sem dados para DEVs e mais */
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value,
                    }, reply);

                    /* Se pedir placar */
                } else if (arks.includes('--placar')) {
                    /* Verifica se não tem jogos */
                    if (Object.keys(playUsers).length === 0) {
                        /* Diz que já pode criar */
                        await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Games', 'NoPlacar', true, true, env.value).value }, reply);

                        /* Se tiver */
                    } else {
                        /* Cria o placar */
                        const scoreboard = Object.keys(playUsers).sort((a, b) => playUsers[b].rank - playUsers[a].rank).map((player) => {
                            /* Define o número para marcar */
                            let playerNumber = Indexer('sql').get('personal', player, chatId);
                            playerNumber = playerNumber.value.name.text === 'default' ? player.replace(/@s.whatsapp.net/gi, '') : playerNumber.value.name.text;

                            /* Define e retorna a string */
                            return `👤 ${playerNumber}: ${playUsers[player].rank} 🏆`;
                        });

                        /* Avisa que apagou */
                        await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Games', 'Placar', true, true, { scoreboard: scoreboard.join('\n\n') }).value }, reply);
                    }

                    /* Se for uso normal */
                } else {
                    /* Obtém todos os tipos de palavras */
                    const listTypes = JSON.parse(Indexer('sql').keywords(region, false, false, false, 'SELECT json_group_array(DISTINCT type) FROM words').value);

                    /* Se for pedindo um guia */
                    if (arks.includes('--lists')) {
                        /* Envia a mensagem */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: JSON.stringify(listTypes, null, 4) });

                        /* Retorna a envInfo sem detalhes */
                        return envInfo.results;
                    }

                    /* Define os parametros */
                    const guessConfig = {
                        list: (body.match(new RegExp(`(?:^|\\s+)-*(${listTypes.join('|')})\\b`, 'i')) || ['-NONE', 'NONE'])[1],
                        language: (body.match(/(?:^|\s+)-*(pt|ar|jp|en|fr|es|id|ms|hi|de|it|ru|lat)\b/i) || ['-pt', 'pt'])[1],
                        table: 'words',
                        random: true,
                        command: false,
                        pay: true,
                        style: 'mix',
                        time: envInfo.parameters.maxTime.value,
                        limit: Date.now() + envInfo.parameters.maxTime.value,
                    };

                    /* Se estiver usando guess customizado */
                    guessConfig.random = guessConfig.list === 'NONE';
                    guessConfig.list = guessConfig.random ? 'jobs' : guessConfig.list;

                    /* Define outras formas */
                    guessConfig.style = command === 'encoded' ? 'encoded' : guessConfig.style;
                    guessConfig.style = ['forca', 'hang', 'hangsman'].includes(command) ? 'forca' : guessConfig.style;
                    guessConfig.style = ['advinha', 'guess'].includes(command) ? 'guess' : guessConfig.style;
                    guessConfig.style = ['back', 'inverse'].includes(command) ? 'back' : guessConfig.style;

                    /* Define a palavra a usar */
                    const getKeyword = Indexer('sql').keywords(guessConfig.language, guessConfig.list, guessConfig.table, guessConfig.random, guessConfig.command);
                    const guessWord = {
                        ...getKeyword.value,
                    };

                    /* Define o tipo da palavra */
                    guessConfig.list = guessWord.type;

                    /* Define qual dos tipos de palavra usar */
                    guessConfig.wordUse = guessConfig.style === 'encoded' ? 'encoded' : 'mixed';
                    guessConfig.wordUse = guessConfig.style === 'forca' ? 'arrmistery' : guessConfig.wordUse;
                    guessConfig.wordUse = guessConfig.style === 'guess' ? 'mistery' : guessConfig.wordUse;
                    guessConfig.wordUse = guessConfig.style === 'back' ? 'reverse' : guessConfig.wordUse;

                    /* Salva em memória */
                    onlineGames[chatId][guessConfig.style] = onlineGames[chatId][guessConfig.style] || {};
                    onlineGames[chatId][guessConfig.style][guessWord.id] = { ...guessWord, ...guessConfig };

                    /* Se já estiver no limite */
                    if (Object.keys(onlineGames[chatId][guessConfig.style]).length > envInfo.parameters.maxGames.value) {
                        /* Define como sem pagamento */
                        guessConfig.pay = false;
                    }

                    /* Define nos dados para não pagar também */
                    guessWord.pay = guessConfig.pay;

                    /* Determina os ganhos com base no tamanho da palavra */
                    guessConfig.win = guessWord.pay ? Math.floor((guessWord.word.length * envInfo.parameters.winTax.value * (envInfo.parameters.typeWin.value[guessConfig.style] || 1)) + guessWord.word.length) : 0;

                    /* Envia a mensagem de novo jogo */
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: Indexer('sql').languages(region, 'Games', 'wordStart', true, true, {
                            title: guessConfig.style.toUpperCase(),
                            time: `${Math.floor(guessConfig.time / 60000)}m`,
                            keyword: guessWord[guessConfig.wordUse].toUpperCase(),
                            wins: `${guessConfig.win} Í-Coins`,
                            type: guessConfig.list.toUpperCase(),
                            initial: guessWord.word.toUpperCase().slice(0, Math.max(Math.floor(guessWord[guessConfig.wordUse].length * 0.3), 1)),
                            letters: guessWord[guessConfig.wordUse].length,
                            spaces: (guessWord[guessConfig.wordUse].match(/\s/g) || []).length,
                            traces: (guessWord[guessConfig.wordUse].match(/-/g) || []).length,
                            idioma: guessConfig.language,
                        }).value,
                    });

                    /* Define a função do filtro e de vitória */
                    async function winGame(message) {
                        /* Define o texto para checar */
                        const guessText = message.body || message.arks || message.argl.join(' ') || '';

                        /* Define se o texto é a resposta */
                        if (guessText?.toLowerCase() === guessWord.word.toLowerCase()) {
                            /* Define a vitória */
                            playUsers[message.user] = playUsers[message.user] || {
                                amount: 0,
                                rank: 0,
                                cooldown: Date.now(),
                                item: 'coin',
                            };

                            /* Adiciona 1 ganho e insere a data atual */
                            playUsers[message.user].amount += 1;
                            playUsers[message.user].rank += 1;
                            playUsers[message.user].lastwin = Date.now();

                            /* Se foi três vezes já */
                            if (playUsers[message.user].amount > envInfo.parameters.maxWins.value) {
                                /* Define o dialogo de ganhos */
                                let dialogueLimit = `${Indexer('sql').languages(region, 'Typings', 'Winner', true, true, { winner: message.userFormated, prize: envInfo.parameters.cdType.value, win: guessConfig.win }).value}`;

                                /* Se for a primeira vez excedendo o limite, aplica o cooldown */
                                if (playUsers[message.user].cooldown < Date.now()) {
                                    /* Aplica o novo limite de data */
                                    playUsers[message.user].cooldown = Date.now() + envInfo.parameters.winCooldown.value;

                                    /* Insere o diálogo de primeira vez */
                                    dialogueLimit += `\n\n${Indexer('sql').languages(region, 'Games', 'gameLimit', true, true, { waittime: Indexer('number').format(playUsers[message.user].cooldown - Date.now()).overall }).value}`;

                                    /* Insere o contador normal */
                                } else dialogueLimit += `\n\n⌛ ~ '${Indexer('number').format(playUsers[message.user].cooldown - Date.now()).overall}' for coins...`;

                                /* Define o limite de ganhos */
                                guessConfig.win = Math.floor(guessConfig.win * envInfo.parameters.typeWin.value.cooldown);

                                /* Define o ganho como o válido */
                                playUsers[message.user].item = envInfo.parameters.cdType.value;

                                /* Manda a mensagem de vitória diferente */
                                envInfo.results.value = await kill.sendMessage(chatId, {
                                    text: dialogueLimit,
                                    mentions: [message.user],
                                }, message.reply);

                                /* Se for ganho normal */
                            } else {
                                /* Envia a mensagem de vitória */
                                envInfo.results.value = await kill.sendMessage(chatId, {
                                    text: Indexer('sql').languages(region, 'Games', 'winGame', true, true, { winGame: guessConfig.win }).value,
                                }, message.reply);
                            }

                            /* Se passou do prazo */
                            if (Date.now() > playUsers[message.user].cooldown && playUsers[message.user].amount > envInfo.parameters.maxWins.value) {
                                /* Reseta o contador de ganhos para voltar a ganhar coins */
                                playUsers[message.user].amount = 0;
                                playUsers[message.user].cooldown = 0;
                            }

                            /* Deleta o jogo atual */
                            delete onlineGames[chatId][guessConfig.style][guessWord.id];

                            /* Adiciona os ganhos */
                            envInfo.results.value = Indexer('sql').update('leveling', message.user, message.chatId, playUsers[message.user].item, guessConfig.win);

                            /* Encerra o jogo atual | STOP = Encerrar | Continuar = * (Anything) */
                            return 'STOP';
                        }

                        /* Se não, retorna para continuar */
                        return 'CONTINUE';
                    }

                    /* Aguarda pela resposta */
                    await kill.awaitMessages(chatId, winGame, guessConfig.time);
                }

                /* Se não for grupo */
            } else {
                /* Manda a mensagem só de grupos */
                envInfo.results.value = await kill.sendMessage(chatId, {
                    text: Indexer('sql').languages(region, 'Extras', 'OnlyGroups', true, true, envInfo).value,
                }, reply);
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
                command: 'MIX',
                time: (new Date()).toLocaleString(),
            }).value,
        }, env.value.reply);
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

        /* Insere a guessGame na envInfo */
        envInfo.functions.exec.value = guessGame;

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
