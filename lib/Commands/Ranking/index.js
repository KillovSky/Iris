/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
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
                        username: (userData.name.text === 'default' ? userData.name.number : `${userData.name.text} [${userData.name.number.slice(0, 9)}...]`),
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
        echoError(error);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'SCORE',
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

        /* Insere a rankScore na envInfo */
        envInfo.functions.exec.value = rankScore;

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
