/* eslint-disable max-len */
/* Requires */
const fs = require('fs');
const path = require('path');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const giveaways = {
    prize: 0,
};
const timeouts = {};

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

/* Define o vencedor do sorteio, função de uso exclusivo daqui, então sem envInfo neste */
function pickWinner(users) {
    /* Calcula o total de tickets somando a quantidade de tickets de todos os usuários */
    const totalTickets = Object.values(users).reduce((total, user) => total + user.tickets, 0);

    /* Gera um número aleatório entre 0 e o total de tickets */
    const winningNumber = Math.floor(Math.random() * totalTickets);

    /* Inicializa a contagem de tickets */
    let count = 0;
    let winner;

    /* Utilize o método forEach para iterar sobre as entradas do objeto */
    Object.entries(users).forEach(([user, userData]) => {
        /* Adiciona a quantidade de tickets do usuário atual à contagem */
        count += userData.tickets;

        /* Se a contagem ultrapassar o número sorteado e ainda não tiver um vencedor */
        if (count > winningNumber && !winner) {
            /* Define o vencedor como o usuário atual */
            winner = user;
        }
    });

    /* Se nenhum usuário for selecionado, retorna o primeiro */
    return winner || Object.keys(users)[0];
}

/* Define a chance de vencer, função de uso exclusivo daqui, então sem envInfo neste */
function winChances(users, player) {
    /* Calcula o total de tickets somando a quantidade de tickets de todos os usuários */
    const totalTickets = Object.values(users).reduce((total, user) => total + user.tickets, 0);

    /* Obtém a quantidade de tickets do jogador específico */
    const playerTickets = users[player].tickets;

    /* Calcula a chance de vencer do jogador específico */
    const winningChance = (playerTickets / totalTickets) * 100;

    /* Limita o resultado a duas casas decimais */
    return winningChance.toFixed(2);
}

/* Cria a função de comando, EDITE O NOME DELA AQUI */
async function myFunction(
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
            /* Obtém os dados da raiz */
            const {
                chatId,
                user,
                isOwner,
                reply,
                arks,
                argl,
                isGroupMsg,
                leveling,
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
                /* Envia sem detalhes de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Se for grupo */
            } else if (isGroupMsg) {
                /* Define o chat atual na giveaway */
                giveaways[chatId] = giveaways[chatId] || {};
                timeouts[chatId] = timeouts[chatId] || {
                    clock: '',
                    time: 0,
                    cooldown: 0,
                };

                /* Verifica se já fez a loteria do 'dia' */
                if (Date.now() >= timeouts[chatId].cooldown) {
                    /* Se for compra */
                    if (argl[0] === '-buy') {
                        /* Dados da loteria a fazer */
                        const insertUser = {
                            tickets: /[0-9]+/gi.test(argl[1]) ? Math.abs(Number(argl[1])) : 1,
                        };

                        /* Adiciona o valor dos tickets da pessoa */
                        insertUser.coins = insertUser.tickets * Number(envInfo.parameters.ticketValue.value);

                        /* Valor dos tickets atuais somados, usado para verificar se tem o valor a pagar */
                        let ticketsCoins = insertUser.coins;

                        /* Se existir na loteria já */
                        if (Object.keys(giveaways[chatId]).includes(user)) {
                            /* Adiciona o valor dos tickets já existentes */
                            ticketsCoins += giveaways[chatId][user].coins;
                        }

                        /* Verifica se tem o dinheiro */
                        if (leveling.coin >= ticketsCoins) {
                            /* Se já existir na loteria, adiciona os valores como tickets extras */
                            if (Object.keys(giveaways[chatId]).includes(user)) {
                                /* Adiciona o valor dos tickets ao existente */
                                giveaways[chatId][user].tickets += insertUser.tickets;

                                /* Agora adiciona o valor que vai cobrar */
                                giveaways[chatId][user].coins += insertUser.coins;

                                /* Se não, cria na database */
                            } else giveaways[chatId][user] = insertUser;

                            /* Adiciona os valores pagos no premio final */
                            giveaways.prize = Object.values(giveaways[chatId]).reduce((total, usert) => total + usert.coins, 0);
                            giveaways.prize = parseInt(giveaways.prize + Math.random() * (giveaways.prize * envInfo.parameters.lotteryExtra.value), 10);

                            /* Se já tiver dado o total minimo de participantes */
                            if (Object.keys(giveaways[chatId]).length >= envInfo.parameters.lotteryUsers.value) {
                                /* Define o tempo atual se for a primeira vez que atingiu o total de users */
                                if (timeouts[chatId].time === 0 && timeouts[chatId].clock === '') {
                                    /* Define a hora atual para calcular o tempo restante */
                                    timeouts[chatId].time = Date.now() + envInfo.parameters.lotteryTime.value;

                                    /* Define o timeout para começar */
                                    timeouts[chatId].clock = setTimeout(async () => {
                                        /* Define os participantes */
                                        const lotteryPlayers = giveaways[chatId];

                                        /* Remove valor a valor de quem fez a compra dos tickets */
                                        for (let i = 0; i < lotteryPlayers.length; i += 1) {
                                            /* Se não tiver o valor por ter perdido ele já, ficará devendo */
                                            Indexer('sql').update('leveling', lotteryPlayers[i], chatId, 'coin', -giveaways[chatId][lotteryPlayers[i]].coins);
                                        }

                                        /* Define o ganhador */
                                        const winnerUser = pickWinner(lotteryPlayers);

                                        /* Avisa o grupo do vencedor mostrando os ganhos dele */
                                        envInfo.results.value = await kill.sendMessage(chatId, {
                                            text: Indexer('sql').languages(region, 'Typings', 'Winner', true, true, {
                                                winner: winnerUser.replace(/@s.whatsapp.net/gi, ''),
                                                win: giveaways.prize,
                                                prize: 'Í-Coins',
                                            }).value,
                                            mentions: [winnerUser],
                                        }, reply);

                                        /* Deposita os ganhos */
                                        Indexer('sql').update('leveling', winnerUser, chatId, 'coin', giveaways.prize);

                                        /* Reseta os dados de loteria atual do grupo */
                                        giveaways[chatId] = {};
                                        timeouts[chatId] = {
                                            clock: '',
                                            time: 0,
                                            cooldown: Date.now() + envInfo.parameters.lotteryCooldown.value,
                                        };

                                        /* Determina o tempo, padrão de 5 minutos */
                                    }, envInfo.parameters.lotteryTime.value);
                                }

                                /* Diz que comprou os tickets e da o aviso de que deu o tempo limite e inicia a contar */
                                envInfo.results.value = await kill.sendMessage(chatId, {
                                    text: Indexer('sql').languages(region, 'Typings', 'Start', true, true, {
                                        chance: winChances(giveaways[chatId], user),
                                        amount: giveaways[chatId][user].tickets,
                                        item: 'Tickets',
                                        win: giveaways.prize,
                                        prize: 'Í-Coins',
                                        price: giveaways[chatId][user].coins,
                                        payment: 'Í-Coins',
                                        remain: Indexer('number').format(timeouts[chatId].time - Date.now()).overall,
                                    }).value,
                                }, reply);

                                /* Caso ainda não deu a quantidade de players */
                            } else {
                                /* Manda a mensagem normal de compra de ticket e diz que falta X players */
                                envInfo.results.value = await kill.sendMessage(chatId, {
                                    text: Indexer('sql').languages(region, 'Typings', 'Buy', true, true, {
                                        chance: winChances(giveaways[chatId], user),
                                        amount: giveaways[chatId][user].tickets,
                                        item: 'Tickets',
                                        win: giveaways.prize,
                                        prize: 'Í-Coins',
                                        price: giveaways[chatId][user].coins,
                                        payment: 'Í-Coins',
                                        waiting: envInfo.parameters.lotteryUsers.value - Object.keys(giveaways[chatId]).length,
                                    }).value,
                                }, reply);
                            }

                            /* Se não tem o dinheiro */
                        } else {
                            /* Envia a mensagem de não tem dinheiro */
                            envInfo.results.value = await kill.sendMessage(chatId, {
                                text: `${Indexer('sql').languages(region, 'Typings', 'Need', true, true, {
                                    need: ticketsCoins,
                                    item: 'Í-Coins',
                                    have: leveling.coin,
                                    amount: (ticketsCoins - leveling.coin),
                                }).value}\nMax Tickets: ${(leveling.coin / Number(envInfo.parameters.ticketValue.value)).toFixed(0)}`,
                            }, reply);
                        }

                        /* Se for para checar quanto tempo resta para o sorteio */
                    } else if (argl[0] === '-time' && timeouts[chatId].time !== 0) {
                        /* Envia a mensagem com o tempo restante */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('number').format(timeouts[chatId].time - Date.now()).overall }, reply);

                        /* Se for para checar os participantes */
                    } else if (argl[0] === '-users' && Object.keys(giveaways[chatId]).length > 0) {
                        /* Define o placar de jogadores */
                        const userList = Object.entries(giveaways[chatId]).map(([key, obj], index) => {
                            /* Obtém o nome do usuário */
                            const userData = Indexer('sql').get('personal', key, chatId).value;

                            /* Retorna a string formatada */
                            return `${index + 1}. ${userData.name.text} ~ ${userData.name.number.slice(0, 9)}...\n🎫 ${obj.tickets} Tickets\n💸 ${obj.coins}$ Í-Coins`;

                            /* Une ela com as outras se tiver 2 ou mais players */
                        }).join('\n\n');

                        /* Envia a mensagem com o tempo restante */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: userList }, reply);

                        /* Se não tem ninguém participando */
                    } else if (Object.keys(giveaways[chatId]).length === 0) {
                        /* Envia a mensagem dizendo pra comprar um ticket */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Typings', 'NoGames', true, true, envInfo).value }, reply);

                        /* Manda o menu de ajuda */
                    } else {
                        /* Envia sem detalhes de dev */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);
                    }

                    /* Se já fez a loteria do dia */
                } else {
                    /* Envia a mensagem de loteria já executada com o tempo restante para voltar  */
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: Indexer('sql').languages(region, 'Typings', 'Wait', true, true, {
                            resttime: Indexer('number').format(timeouts[chatId].cooldown - Date.now()).overall,
                        }).value,
                    }, reply).value;
                }
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
                command: 'LOTTERY',
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

        /* Insere a myFunction na envInfo, EDITE O NOME DELA AQUI */
        envInfo.functions.exec.value = myFunction;

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
