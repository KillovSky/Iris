/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
/* eslint-disable indent */

/* Imports */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import Indexer from '../../index.js';

/* Define as funções __dirname e __filename com equivalentes em ESM */
const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

/* JSON's | Utilitários */
const envInfo = JSON.parse(fs.readFileSync(`${thisDir}/utils.json`));
const shopping = JSON.parse(fs.readFileSync(`${irisPath}/lib/Databases/Configurations/shopping.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/**
 * Calcula o troco em pedras e madeiras com base no valor e taxas de conversão.
 *
 * @param {number} value - O valor a ser convertido
 * @param {Object} conversionRates - Objeto contendo as taxas de conversão de moedas
 * @returns {Object} Objeto contendo as quantidades de pedra e madeira
 */
function calculateChange(value, conversionRates) {
    /* Define os itens de troco */
    const stoneRate = conversionRates.coin.stone;
    const woodRate = conversionRates.coin.wood;

    /* Define o valor de meia */
    const halfValue = value / 2;
    let stone = Math.floor(halfValue / stoneRate);
    let wood = Math.floor(halfValue / woodRate);

    /* Trata restos da divisão */
    const stoneRemainder = halfValue % stoneRate;
    const woodRemainder = halfValue % woodRate;

    /* Faz uma validação se são maiores que zero */
    if (stoneRemainder > 0 || woodRemainder > 0) {
        /* E se sim, soma eles */
        stone += stoneRemainder / stoneRate;
        wood += woodRemainder / woodRate;
    }

    /* Retorna os dados */
    return {
        stone: Math.round(stone),
        wood: Math.round(wood),
    };
}

/**
 * Gerencia as operações do sistema de compras incluindo compra, venda e conversão de itens.
 *
 * @param {Object} kill - Interface de mensagens
 * @param {Object} env - Objeto de ambiente com dados do usuário e chat
 * @returns {Promise<Object>} Resultados da operação
 */
async function shoppeIris(kill, env) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            const {
                user, chatId, leveling, reply, body, arks, argl, isOwner,
            } = env.value;

            /* Define alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Mapeamento de emojis */
            const emojis = {
                diamond: '💎',
                rubi: '🔴',
                gold: '🟡',
                iron: '⚙️',
                stone: '🪨',
                wood: '🪵',
                coin: '💰',
            };

            /* Comandos de ajuda */
            if (arks.includes('--help-dev') && isOwner === true) {
                envInfo.results.value = await kill.sendMessage(
                    chatId,
                    { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value },
                    reply,
                );
                envInfo.results.success = true;
                return logging.postResults(envInfo);
            }

            /* Mostra exemplos de uso */
            if (arks.includes('--examples') || arks.includes('--example') || arks.includes('--usage')) {
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Shopping', 'Guide', true, true, envInfo).value }, reply);
                envInfo.results.success = true;
                return logging.postResults(envInfo);
            }

            /* Consulta de conversão de moedas */
            if (arks.includes('-convert')) {
                /* Define o item a usar */
                const usageItem = body.match(/-convert (\S+)/)?.[1] || 'coin';

                /* Verifica se o item é válido */
                if (!shopping.monetary[usageItem]) {
                    /* Se for, manda uma mensagem de aviso demonstrando como usa */
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: Indexer('sql').languages(region, 'Shopping', 'Wrong', true, true, {
                            ...envInfo,
                            usageItem,
                            availableItems: Object.keys(shopping.monetary).map((i) => `• ${emojis[i] || '📌'} ${i}`).join('\n'),
                        }).value,
                    }, reply);

                    /* Retorna resultados */
                    return logging.postResults(envInfo);
                }

                /* Verifica se há um número na string body */
                const amount = parseFloat(body.match(/(\d+)/)?.[0]) || 1;

                /* Gera mensagem de cotação */
                const cotaMessage = (
                    `📊 *COTAÇÃO PARA ${usageItem.toUpperCase()}* ${emojis[usageItem]}\n`
                    + '----------------------------------------\n'
                    + `🔹 *Recebe:* \n${
                        Object.entries(shopping.monetary[usageItem]).map(([target, value]) => `   • ${emojis[target] || ''} ${target}: ${Math.round((value * amount).toFixed(2))}`).join('\n')
                    }\n`
                    + '----------------------------------------\n'
                    + `💡 *Conversão com base no valor informado: ${amount} ${usageItem.toUpperCase()}*\n`
                    + '🎁 *O Troco será convertido em itens simples:*\n'
                    + '----------------------------------------\n'
                );

                /* Envia mensagem de cotação */
                envInfo.results.value = await kill.sendMessage(chatId, {
                    text: cotaMessage,
                }, reply);

                /* Define sucesso de operação */
                envInfo.results.success = true;

                /* E retorna os dados */
                return logging.postResults(envInfo);
            }

            /* Ajuda para usuário */
            if (arks.includes('--help') || argl.length === 0) {
                /* Envia a mensagem de ajuda da função */
                envInfo.results.value = await kill.sendMessage(
                    chatId,
                    { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value },
                    reply,
                );

                /* Define sucesso de operação */
                envInfo.results.success = true;

                /* E retorna os dados */
                return logging.postResults(envInfo);
            }

            /* Processamento principal de transações */
            const operation = {
                get: (arks.match(/-get (\S+)/)?.[1] || (arks.includes('-sell') ? 'coin' : null)),
                pay: (arks.match(/-pay (\S+)/)?.[1] || null),
                sell: (arks.match(/-sell (\S+)/)?.[1] || null),
                amount: Math.max(
                    1,
                    parseInt(
                        (arks.match(/-amount (\d+)/)?.[1] || arks.match(/(\d+)/)?.[0] || 10),
                        10,
                    ),
                ),
                result: [],
                apply: {},
            };

            /* Obtém os itens da loja */
            const validItems = Object.keys(shopping.monetary);

            /* Faz uma validação do que for possivel */
            [operation.get, operation.pay, operation.sell].forEach((item, i) => {
                /* Se for item, mas não válido */
                if (item && !validItems.includes(item)) {
                    /* Informa o item escrito errado */
                    operation.result.push(`❌ ${['Receber', 'Pagar', 'Vender'][i]}: Item inválido "${item}"!`);
                }
            });

            /* Se a operação der resultado positivo e sucesso */
            if (operation.result.length > 0) {
                /* Envia uma mensagem com os dados */
                envInfo.results.value = await kill.sendMessage(
                    chatId,
                    { text: operation.result.join('\n') },
                );

                /* Define sucesso de operação */
                envInfo.results.success = true;

                /* Retorna os resultados */
                return logging.postResults(envInfo);
            }

            /* Processa operação de compra */
            if (operation.pay && operation.get) {
                /* Define a taxa */
                const rate = shopping.monetary[operation.get]?.[operation.pay];

                /* Se não tiver o item ou taxa */
                if (!rate) {
                    /* Avisa que a operação não é possivel */
                    operation.result.push(`❌ Não é possível trocar ${operation.pay} por ${operation.get}`);

                    /* Se tiver, mas não puder pagar */
                } else if (leveling[operation.pay] < operation.amount) {
                    /* Avisa de saldo baixo */
                    operation.result.push(`❌ Saldo insuficiente de ${operation.pay} ${emojis[operation.pay]}`);

                    /* Se der certo */
                } else {
                    /* Faz o calculo de valores */
                    const received = Math.floor(operation.amount / rate);
                    const change = operation.amount % rate;

                    /* Se tiver o valor certinho continua */
                    if (received > 0) {
                        /* Define o valor que vai tirar e mandar no equivalente */
                        operation.apply[operation.pay] = -operation.amount;
                        operation.apply[operation.get] = (
                            operation.apply[operation.get] || 0
                        ) + received;

                        /* Define mensagem de operação */
                        operation.result.push(
                            `➖ ${operation.amount} ${operation.pay} ${emojis[operation.pay]}`,
                            `➕ ${received} ${operation.get} ${emojis[operation.get]}`,
                        );

                        /* Processa troco */
                        if (change > 0.1) {
                            /* Sempre nos itens mais baratos para não dar divergência */
                            const { stone, wood } = calculateChange(change, shopping.monetary);

                            /* Se tiver troco em stone */
                            if (stone > 0) {
                                /* Define o valor dela e a mensagem de troco */
                                operation.apply.stone = (operation.apply.stone || 0) + stone;
                                operation.result.push(`➕ ${stone} Stone 🪨 (BONUS 🎁)`);
                            }

                            /* Se tiver troco em stone */
                            if (wood > 0) {
                                /* Define o valor dela e a mensagem de troco */
                                operation.apply.wood = (operation.apply.wood || 0) + wood;
                                operation.result.push(`➕ ${wood} Wood 🪵 (BONUS 🎁)`);
                            }
                        }

                        /* Atualiza banco de dados */
                        Indexer('sql').update('leveling', user, chatId, false, operation.apply);

                        /* Se os valores não são suficientes */
                    } else {
                        /* Define uma mensagem avisando */
                        operation.result.push(
                            `❌ O valor de ${operation.amount} ${operation.pay} não é suficiente para realizar a troca.`,
                            `💡 Certifique-se de ter ofertar pelo menos ${rate} ${operation.pay} para obter ${operation.get}'s.`,
                        );
                    }
                }
            }

            /* Processa operação de venda */
            if (operation.sell) {
                /* Define a taxa monetária das moedas */
                const rate = operation.get === 'coin' ? 1 : shopping.monetary[operation.get]?.[operation.sell];

                /* Se a taxa não for possivel */
                if (!rate && operation.get !== 'coin') {
                    /* Anuncia que não pode fazer */
                    operation.result.push(`❌ Não é possível vender ${operation.sell} por ${operation.get}`);

                    /* Se não tiver o bastante pra pagar */
                } else if (leveling[operation.sell] < operation.amount) {
                    /* Mensagem dizendo ser pobre */
                    operation.result.push(`❌ Saldo insuficiente de ${operation.sell} ${emojis[operation.sell]}`);

                    /* Se der certo */
                } else {
                    /* Faz o calculo de ganho */
                    const received = Math.floor(operation.amount * rate);
                    const change = operation.amount - (received / rate);

                    /* Feito ele, se deu certo a conta */
                    if (received > 0) {
                        /* Define o que vai ganhar */
                        operation.apply[operation.sell] = -operation.amount;
                        operation.apply[operation.get] = (
                            operation.apply[operation.get] || 0
                        ) + received;

                        /* Define mensagem dizendo que deu certo */
                        operation.result.push(
                            `➖ ${operation.amount} ${operation.sell} ${emojis[operation.sell]}`,
                            `➕ ${received} ${operation.get} ${emojis[operation.get]}`,
                        );

                        /* Processa troco para vendas não-coin */
                        if (change > 0.1 && operation.get !== 'coin') {
                            /* Faz um calculo simples do que vai sobrar */
                            const changeValue = change * shopping.monetary.coin[operation.sell];

                            /* Obtem o valor */
                            const { stone, wood } = calculateChange(changeValue, shopping.monetary);

                            /* Se tiver troco de stone */
                            if (stone > 0) {
                                /* Faz o calculo e define a mensagem de retorno */
                                operation.apply.stone += stone;
                                operation.result.push(`➕ ${stone} Stone 🪨 (BONUS 🎁)`);
                            }

                            /* Se tiver troca de wood */
                            if (wood > 0) {
                                /* Faz o calculo e define a mensagem de retorno */
                                operation.apply.wood += wood;
                                operation.result.push(`➕ ${wood} Wood 🪵 (BONUS 🎁)`);
                            }
                        }

                        /* Atualiza banco de dados */
                        Indexer('sql').update('leveling', user, chatId, false, operation.apply);
                    }
                }
            }

            /* Mensagem final */
            const finalMessage = (operation.result.length > 0
                ? `💸 *LOG* 💰\n\n${operation.result.join('\n')}`
                : '⚠️ Nenhuma operação válida! Use `--help` para ajuda.'
            );

            /* Faz o envio e retorna os dados da mensagem */
            envInfo.results.value = await kill.sendMessage(chatId, { text: finalMessage });
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
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'SHOPPING',
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
        [envInfo.exports.exec]: { value: shoppeIris },
    },
    parameters: {
        location: { value: thisFile },
    },
}, envFile, changeKey, dirname);

/* Exporta todas as funções */
export default resetLocal();
