/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
/* eslint-disable indent */

/* Requires */
const fs = require('fs');
const path = require('path');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
const Indexer = require('../../index');
const language = require('../../Dialogues/index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const prisionData = {};

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
async function cassinoPlays(
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
                lvpc,
                isGroupMsg,
                user,
                mentionedJidList,
                command,
                arks,
                winTaxes,
                leveling,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define as pessoas marcadas */
            let sorryPeople = mentionedJidList.filter((s) => s !== user && s !== irisNumber);
            sorryPeople = sorryPeople[0] || false;

            /* Define a info da pessoa na cadeia */
            prisionData[user] = prisionData[user] || 0;
            prisionData[user] = prisionData[user] < Date.now() ? 0 : prisionData[user];

            /* Define se está na cadeia */
            if (prisionData[user] !== 0) {
                /* Define o tempo de espera */
                const waitDate = Math.floor((prisionData[user] - Date.now()) / 1000);
                const waitMin = Math.floor(waitDate / 60);
                const waitSecs = waitDate % 60;

                /* Avisa que está na cadeia */
                envInfo.results.value = await kill.sendMessage(chatId, {
                    text: language(region, 'Games', 'emCana', true, true, {
                        waitMin,
                        waitSecs,
                    }),
                }, { quoted: quoteThis });

                /* Se não for grupo */
            } else if (!isGroupMsg) {
                /* Manda a mensagem só de grupos */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Extras', 'OnlyGroups', true, true, envInfo) }, { quoted: quoteThis });

                /* Define o menu de ajuda */
            } else if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'Developer', true, true, envInfo) }, { quoted: quoteThis });

                /* Menu de ajuda normal */
            } else if (arks.includes('--help') || command === 'games') {
                /* Manda a mensagem de ajuda normal */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });

                /* Se for roubo e não marcar ninguém */
            } else if (['steal', 'roubar'].includes(command) && sorryPeople === false) {
                /* Manda marcar alguém */
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Cases', 'None', true, true, envInfo) }, { quoted: quoteThis });

                /* Se for uso normal */
            } else {
                /* Define um valor de base no level */
                const addictValue = Indexer('numbers').randnum(2, leveling.level).value;

                /* Define os ganhos e percas com base em nível */
                /* Perderá ou ganhará pelo menos 2 Í-Coins */
                const gameChecker = {
                    winGame: Math.floor(Math.abs(winTaxes.coin + addictValue)),
                    lostGame: Math.floor(Math.abs(winTaxes.coin - addictValue) || 2),
                };

                /* Ajusta para não negativar */
                gameChecker.lostGame = (gameChecker.lostGame > leveling.coin
                    ? leveling.coin
                    : gameChecker.lostGame
                );

                /*
                    Determina o resultado na roleta russa com base em balas no revólver.
                    Usaremos o Smith & Wesson Modelo 29, com capacidade de 6 balas.
                    Atualmente, temos 3 balas carregadas e 3 encaixes vazios.
                    Isso é 50% de chance de ganhar (true) e 50% de perder (false).
                    Math.random() > (Munição Inserida / (Munição Inserida + Capsula Vazia));
                */
                let youLost = Math.random() > (3 / (3 + 3));

                /* Torna o valor em perda */
                gameChecker.lostGame = -gameChecker.lostGame;

                /* Define o tipo do jogo */
                let finalType = 'winGame';

                /* Define uma switch para cada jogo */
                switch (command) {
                    /* Roleta, chances calculadas com base em uma arma de 6 capsulas */
                    case 'roleta':
                    case 'rolette':
                    case 'roll':
                        /* Se perdeu */
                        if (youLost) {
                            /* Define o tipo como perda */
                            finalType = 'lostGame';
                        }

                        /* Envia a imagem do tipo com valor ganho/perdido */
                        await kill.sendMessage(chatId, {
                            image: { url: `${__dirname}/Cache/${finalType}.jpg` },
                            caption: language(region, 'Games', finalType, true, true, { finalType, ...gameChecker }),
                        }, { quoted: quoteThis });

                        /* Faz os ganhos ou percas de Í-Coins */
                        envInfo.results.value = Indexer('sql').update('leveling', user, chatId, 'coin', gameChecker[finalType]);
                    break;

                    /* Flip, se o resultado for igual o comando, vence */
                    case 'cara':
                    case 'coroa':
                        /* Define os valores */
                        const flipValue = lvpc > 50 ? 'cara' : 'coroa';
                        youLost = command === flipValue;

                        /* Se perdeu */
                        if (!youLost) {
                            /* Define o tipo como perda */
                            finalType = 'lostGame';
                        }

                        /* Envia a imagem do tipo com valor ganho/perdido */
                        await kill.sendMessage(chatId, {
                            image: { url: `${__dirname}/Cache/${flipValue}.png` },
                            caption: language(region, 'Games', finalType, true, true, { finalType, ...gameChecker }),
                        }, { quoted: quoteThis });

                        /* Faz os ganhos ou percas de Í-Coins */
                        envInfo.results.value = Indexer('sql').update('leveling', user, chatId, 'coin', gameChecker[finalType]);
                    break;

                    /* Jokenpo, se o resultado for igual o comando, vence */
                    case 'pedra':
                    case 'papel':
                    case 'tesoura':
                        /* Define os valores */
                        let jokenpoValue = 'tesoura';
                        jokenpoValue = (lvpc > 0 && lvpc < 35) ? 'pedra' : jokenpoValue;
                        jokenpoValue = (lvpc > 35 && lvpc < 70) ? 'papel' : jokenpoValue;
                        youLost = (
                            (command === 'pedra' && jokenpoValue === 'tesoura')
                            || (command === 'papel' && jokenpoValue === 'pedra')
                            || (command === 'tesoura' && jokenpoValue === 'papel')
                        );

                        /* Determina se foi empate */
                        const isDraw = command === jokenpoValue;

                        /* Define emojis para usar */
                        const jokenItens = {
                            pedra: ['✊', '✊🏻', '✊🏼', '✊🏽', '✊🏾'],
                            papel: ['✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿', '🤚', '🤚🏻', '🤚🏼', '🤚🏽', '🤚🏾', '🤚🏿'],
                            tesoura: ['✌️', '✌🏻', '✌🏼', '✌🏽', '✌🏾', '✌🏿'],
                        };

                        /* Se perdeu */
                        if (!youLost) {
                            /* Define o tipo como perda */
                            finalType = 'lostGame';
                        }

                        /* Determina o dialogo */
                        let dialogueFiles = language(region, 'Games', finalType, true, true, { finalType, ...gameChecker });
                        dialogueFiles = isDraw ? language(region, 'Games', 'Empate', true, true, env.value) : dialogueFiles;

                        /* Envia a imagem do tipo com valor ganho/perdido */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: `Jo...ken..PO!\n\n${jokenItens[jokenpoValue][Math.floor(Math.random() * jokenItens[jokenpoValue].length)]} x ${jokenItens[command][Math.floor(Math.random() * jokenItens[command].length)]}\n\n${dialogueFiles}` }, { quoted: quoteThis });

                        /* Faz os ganhos ou percas de Í-Coins */
                        if (!isDraw) {
                            /* Se não for um empate */
                            envInfo.results.value = Indexer('sql').update('leveling', user, chatId, 'coin', gameChecker[finalType]);
                        }
                    break;

                    /* Spin, se houver três emojis iguais, vence */
                    case 'cassino':
                    case 'spin':
                        /* Define os valores do spin */
                        const emojis = ['🍇', '🍋', '🍒', '🍊', '🍉'];

                        /* Define o valor final do cassino */
                        const textCassino = [];
                        const otherItens = [];

                        /* Seleciona aleatoriamente um emoji para cada "roda" da máquina */
                        textCassino.push(emojis[Math.floor(Math.random() * emojis.length)]);
                        textCassino.push(emojis[Math.floor(Math.random() * emojis.length)]);
                        textCassino.push(emojis[Math.floor(Math.random() * emojis.length)]);

                        /* Define uma variação para a parte de cima e baixo */
                        otherItens.push(emojis[Math.floor(Math.random() * emojis.length)]);
                        otherItens.push(emojis[Math.floor(Math.random() * emojis.length)]);
                        otherItens.push(emojis[Math.floor(Math.random() * emojis.length)]);

                        /* Verifica se os três emojis NÃO são iguais */
                        youLost = !textCassino.every((emoji) => emoji === textCassino[0]);

                        /* Se perdeu */
                        if (youLost) {
                            /* Define o tipo como perda */
                            finalType = 'lostGame';
                        }

                        /* Envia a imagem do tipo com valor ganho/perdido */
                        await kill.sendMessage(chatId, { text: `\`\`\`┏━━━━━━━━━━━━━┓\n┃   ${otherItens[0]} ${otherItens[2]} ${otherItens[1]}\n┃➤ ${textCassino.join(' ')}   ┃\n┃   ${otherItens[2]} ${otherItens[0]} ${otherItens[1]}\n┗━━━━━━━━━━━━━┛\`\`\`\n\n${language(region, 'Games', finalType, true, true, { finalType, ...gameChecker })}` }, { quoted: quoteThis });

                        /* Faz os ganhos ou percas de Í-Coins */
                        envInfo.results.value = Indexer('sql').update('leveling', user, chatId, 'coin', gameChecker[finalType]);
                    break;

                    /* Steal, se pego paga suborno, vai pra cadeia ou consegue roubar */
                    /* Tem 1% de chance de perder tudo ou ganhar tudo */
                    case 'steal':
                    case 'roubar':
                        /* Define a chance de roubo com base no nivel */
                        /* Quanto maior, mais chance, limitado a 75% */
                        let stealChance = Indexer('numbers').randnum(Math.floor(leveling.level / 2), leveling.level).value + 10;
                        stealChance = Math.min((stealChance / 75) * 100, 75);

                        /* --------------------- ROUBO --------------------- */
                        /* Define a quantidade de steal */
                        const stealData = Indexer('sql').get('leveling', sorryPeople, chatId).value;

                        /* Define os materiais para roubar no comando steal */
                        let stealMatterie = Object.keys(stealData).filter((d) => d !== 'xp' && d !== 'level' && d !== 'messages' && d !== 'error');
                        stealMatterie = stealMatterie.filter((d) => stealData[d] > 0);

                        /* Se não tiver nada para roubar */
                        if (stealMatterie.length === 0) {
                            /* Fala que essa pessoa não rola */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Games', 'noMoney', true, true, env.value) }, { quoted: quoteThis });

                            /* Retorna o sistema */
                            return postResults(envInfo.results);
                        }

                        /* Se tiver, obtém o que roubar */
                        stealMatterie = Indexer('array').extract(stealMatterie).value;

                        /* Define a quantidade do roubo */
                        let stealQuantity = stealData[stealMatterie];

                        /* 1% de chance de ganhar tudo */
                        stealQuantity = Math.random() <= 0.01 ? stealQuantity : Indexer('numbers').randnum(1, stealQuantity).value;

                        /* -------------------- SUBORNO -------------------- */
                        /* Define os materiais para pagar no comando steal */
                        let paymentCops = stealMatterie;

                        /* Define a quantidade de suborno se pego */
                        let payCops = leveling[paymentCops];

                        /* Se não tiver o mesmo material que vai roubar */
                        if (payCops < 0) {
                            /* Adquire outro material */
                            paymentCops = Object.keys(leveling).filter((d) => d !== 'xp' && d !== 'level' && d !== 'messages' && d !== 'error');
                            paymentCops = paymentCops.filter((d) => leveling[d] > 0);

                            /* Se não tiver nada para roubar */
                            if (paymentCops.length === 0) {
                                /* Fala que essa pessoa não rola */
                                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Games', 'noSteal', true, true, { prisonTime: envInfo.parameters.prisonTime.value }) }, { quoted: quoteThis });

                                /* Adiciona na prisão */
                                prisionData[user] = Date.now() + (
                                    envInfo.parameters.prisonTime.value * 60000
                                );

                                /* Retorna o sistema */
                                return postResults(envInfo.results);
                            }

                            /* Se tiver, ajusta os valores */
                            paymentCops = Indexer('array').extract(paymentCops).value;
                            payCops = leveling[paymentCops];
                        }

                        /* 1% de chance de perder tudo */
                        payCops = Math.random() <= 0.01 ? payCops : Indexer('numbers').randnum(1, payCops).value;

                        /* Se conseguiu roubar */
                        if (lvpc <= stealChance) {
                            /* Avisa que deu certo */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Games', 'winSteal', true, true, { sorryPeople: sorryPeople.replace(/@s.whatsapp.net/gi, ''), stealQuantity, stealMatterie }), mentions: [user, sorryPeople] }, { quoted: quoteThis });

                            /* Adquire e retira os valores */
                            envInfo.results.value = Indexer('sql').update('leveling', user, chatId, stealMatterie, stealQuantity);
                            envInfo.results.value = Indexer('sql').update('leveling', sorryPeople, chatId, stealMatterie, -stealQuantity);

                            /* Se for pego */
                        } else {
                            /* Avisa que pagou suborno aos policiais (Vitima) */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Games', 'lostSteal', true, true, { payCops, paymentCops }), mentions: [user, sorryPeople] }, { quoted: quoteThis });

                            /* Paga o suborno */
                            envInfo.results.value = Indexer('sql').update('leveling', sorryPeople, chatId, paymentCops, payCops);
                            envInfo.results.value = Indexer('sql').update('leveling', user, chatId, paymentCops, -payCops);
                        }
                    break;
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
        /* Insira o name que você definiu na envInfo (name) onde pede abaixo */
        await kill.sendMessage(env.value.chatId, {
            text: language(region, 'S.E.R', error, true, true, {
                command: 'GAMES',
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

        /* Insere a cassinoPlays na envInfo */
        envInfo.functions.exec.value = cassinoPlays;

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
