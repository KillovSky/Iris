/* eslint-disable max-len */

/* Requires */
const fs = require('fs');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
const Indexer = require('../../index');

/* JSON's | Utilidades */
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

/* Cria a função de comando */
async function rankScore(
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
            /* Define as variáveis raizes */
            const {
                chatId,
                isGroupMsg,
                isOwner,
                reply,
                argl,
                arks,
                originalName,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Se não for grupo */
            if (!isGroupMsg) {
                /* Manda a mensagem só de grupos */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'OnlyGroups', true, true, envInfo).value }, reply);

                /* Define o menu de ajuda */
            } else if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                /* Não inclui informações secretas */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Se for grupo */
            } else {
                /* Determina os valores da busca */
                const rankSet = {
                    item: (argl.filter((s) => ['-xp', '-coin', '-diamond', '-gold', '-iron', '-rubi', '-stone', '-wood', '-messages', '-level'].includes(s))[0] || envInfo.parameters.stockitem.value).replace(/-/gi, ''),
                    limit: argl.filter((s) => /[0-9]+/gi.test(s))[0] || envInfo.parameters.maxlist.value,
                    table: arks.includes('-bank') ? 'bank' : 'leveling',
                    place: arks.includes('-global') ? 'global' : chatId,
                    emojis: [
                        '🏆',
                        '🥇',
                        '🏅',
                        '🥈',
                        '🎖️',
                        '🥉',
                        '🏅',
                    ],
                    score: {},
                    board: {},
                    result: '',
                };

                /* Define os dados de ranking atual */
                rankSet.board = Indexer('sql').ranking(rankSet.table, rankSet.place, rankSet.item, rankSet.limit);
                rankSet.board = rankSet.board.value;

                /* Se caso for banking */
                if (rankSet.table === 'bank') {
                    /* Cria uma nova DB local */
                    const arrayData = [];

                    /* Faz um forEach para organizar a DB */
                    Object.keys(rankSet.board).forEach((db) => {
                        /* Insere no formato do leveling */
                        arrayData.push({
                            [db]: {
                                from: chatId,
                                values: rankSet.board[db],
                            },
                        });
                    });

                    /* Define os novos dados */
                    rankSet.board = arrayData;
                }

                /* Primeiro reorganiza ela com base no maior valor */
                rankSet.board.sort((a, b) => b[Object.keys(b)[0]].values[rankSet.item] - a[Object.keys(a)[0]].values[rankSet.item]);

                /* Faz um foreach para iterar sob cada objeto */
                rankSet.board.forEach((data, index) => {
                    /* Define a ID do usuário atual na Object raiz */
                    const userId = Object.keys(data)[0];

                    /* Obtém o nome do grupo e do user */
                    const groupData = Indexer('sql').get('groups', userId, data[userId].from).value;
                    const userData = Indexer('sql').get('personal', userId, data[userId].from).value;

                    /* Insere os dados organizados na object */
                    rankSet.score[index + 1] = {
                        user: userId.split('@')[0],
                        username: (userData.name.text === 'default' ? (userData.name?.number?.slice(0, 9) || 'N/A') : `${userData.name.text} [${(userData.name?.number?.slice(0, 9) || 'N/A')}...]`),
                        from: groupData.name.text,
                        emoji: index < rankSet.emojis.length ? rankSet.emojis[index] : rankSet.emojis[rankSet.emojis.length - 1],
                        value: data[userId].values[rankSet.item],
                    };
                });

                /* Define a base do ranking */
                rankSet.result += `⛷️ ${rankSet.item.toUpperCase()} ~ TOP ${rankSet.limit} 🤑\n🔎 ${rankSet.place === 'global' ? 'GLOBAL' : originalName} 📈\n\n︵‿︵‿୨♡୧‿︵‿︵\n\n`;

                /* Faz um foreach para construir a tabela de ranking */
                Object.keys(rankSet.score).forEach((pos) => {
                    /* Define os dados organizadamente */
                    rankSet.result += `${rankSet.score[pos].emoji} Nº ${pos}\n👤 ${rankSet.score[pos].username}\n🏠 ${rankSet.score[pos].from}\n💲 ${rankSet.score[pos].value} ${rankSet.item.toUpperCase()}\n\n`;
                });

                /* Faz o fechamento da base */
                rankSet.result += '︵‿︵‿୨♡୧‿︵‿︵';

                /* Faz o envio */
                envInfo.results.value = await kill.sendMessage(chatId, { text: rankSet.result }, reply);
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
        logging.echoError(error, envInfo, __dirname);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'SCORE',
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
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.exec]: { value: rankScore },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
