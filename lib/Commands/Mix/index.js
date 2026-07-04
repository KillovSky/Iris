/* eslint-disable max-len */

/* Imports */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import Indexer from '../../index.js';

/* Define as funções __dirname e __filename com equivalentes em ESM */
const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${thisDir}/utils.json`));
const onlineGames = {};
const playUsers = {};

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
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
                            playerNumber = playerNumber.value.name.text === 'default' ? player.replace(/@s.whatsapp.net|@lid/gi, '') : playerNumber.value.name.text;

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
        logging.echoError(error, envInfo, thisDir);

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
    return logging.postResults(envInfo);
}

/**
 * Restaura o ambiente e atualiza as exportações do módulo com a funcionalidade principal
 * @param {Object} [changeKey={}] - Chaves personalizadas para atualizar o envInfo
 * @param {Object} [envFile=envInfo] - Objeto com informações do ambiente
 * @param {string} [dirname=thisDir] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    changeKey = {},
    envFile = envInfo,
    dirname = thisDir,
) => logging.resetAmbient({
    functions: {
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.exec]: { value: guessGame },
    },
    parameters: {
        location: { value: thisFile },
    },
}, envFile, changeKey, dirname);

/* Exporta todas as funções */
export default resetLocal();
