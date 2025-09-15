/* Imports */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Indexer from '../../index.js';

/* Equivalentes em ESM */
const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${thisDir}/utils.json`));
const timeouts = {
    bank: {},
    pay: {},
};

/**
 * Retorna todos os detalhes do ambiente (`envData`).
 *
 * @param {Object} envData - O objeto que contém as configurações e dados do ambiente.
 * @returns {Object} O objeto `envData`, que contém os detalhes do ambiente.
 */
function ambientDetails(envData) {
    /* Retorna a envData */
    return envData;
}

/* Cria a função de comando */
async function notSafeBank(
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
                reply,
                chatId,
                command,
                isOwner,
                prefix,
                argl,
                body,
                leveling,
                args,
                bank,
                isGroupMsg,
                userFormated,
                user,
                mentionedJidList,
                arks,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Se for dono, mas não grupo */
            if (!isGroupMsg) {
                /* Manda a mensagem só de grupos */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'OnlyGroups', true, true, envInfo).value }, reply);

                /* Define o menu de ajuda */
            } else if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Menu de ajuda normal */
            } else if (arks.includes('--help') || args.length === 0) {
                /* Manda a mensagem de ajuda normal */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Se for uso normal */
            } else {
                /* Define o lugar da função */
                const cooldownAct = ['doar', 'pay', 'donate', 'payment'].includes(command) ? 'pay' : 'bank';

                /* Define o chat atual na giveaway */
                timeouts[cooldownAct][user] = timeouts[cooldownAct][user] || 0;

                /* Verifica se já fez a ação, padrão de cooldown de 30 minutos */
                if (Date.now() >= timeouts[cooldownAct][user]) {
                    /* Define o local dos valores (eslint: max-len) */
                    const payAllowed = envInfo.parameters.payAllowed.value;
                    const payLimit = envInfo.parameters.payLimit.value;

                    /* Define a quem vai aplicar */
                    let mentionPeople = mentionedJidList || [];
                    mentionPeople = mentionPeople[0] || user;
                    let mentionFormatted = mentionPeople.replace(/@s.whatsapp.net|@lid/gi, '');

                    /* Define quais vai adicionar apartir de usar reduce numa array de elementos */
                    const newValues = payAllowed.reduce((accumulator, element) => {
                        /* Define uma RegExp para obter os valores na frente */
                        const regex = new RegExp(`${element}\\s*(-?\\d+)`);

                        /* Faz um match dos valores */
                        const match = body.match(regex);

                        /* Se encontrou algo */
                        if (match) {
                            /* Define o valor inicial como o encontrado ou zero */
                            const numericValue = parseInt(match[1], 10) || 0;

                            /* Define as condições */
                            const conditions = (
                                /* Tirar do banco e tem valores lá pra isso */
                                (!['doar', 'pay', 'donate', 'payment'].includes(command)
                                    && numericValue <= bank[element.substring(1)]
                                    && arks.includes('-get')
                                    && bank[element.substring(1)] > 0
                                )

                                /* Pagar os outros ou por no banco, tem valor pra isso */
                                || (!arks.includes('-get')
                                    && numericValue <= leveling[element.substring(1)]
                                    && leveling[element.substring(1)] > 0
                                )
                            );

                            /* Só obtém o que possuir */
                            if (conditions) {
                                /* Se o valor for abaixo do limite, adiciona */
                                if (numericValue >= -payLimit && numericValue <= payLimit) {
                                    /* Adiciona na object do acumulador dos resultados */
                                    accumulator[element.substring(1)] = Math.abs(numericValue);

                                    /* Se não, adiciona o valor positivo máximo */
                                } else accumulator[element.substring(1)] = Math.abs(payLimit);

                                /* Se não possui, define como adicionar/tirar zero */
                            } else accumulator[element.substring(1)] = 0;
                        }

                        /* Retorna o resultado até terminar */
                        return accumulator;

                        /* Define a object do acumulador para retornar no reduce */
                    }, {});

                    /* Define a Object de valores negativos para remoção eventual */
                    const remValue = {};
                    Object.keys(newValues).forEach((key) => {
                        /* Transforma os valores positivos em negativos inteiros */
                        remValue[key] = -Math.abs(newValues[key]);
                    });

                    /* Verifica se tem algo para inserir, caso não tiver */
                    if (Object.keys(newValues).length === 0) {
                        /* Envia uma mensagem de falha */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Stranded', true, true, env.value).value }, reply);

                        /* Verifica se todos os valores são zeros */
                    } else if (Object.values(newValues).every((v) => v === 0)) {
                        /* Envia uma mensagem de valor insuficiente */
                        envInfo.results.value = await kill.sendMessage(chatId, {
                            text: `${Indexer('sql').languages(region, 'Typings', 'Need', true, true, {
                                item: Object.keys(newValues)[0],
                                need: '1 ~ 10000',
                                have: '0',
                                amount: '1 ~ 10000',
                            }).value}\n\n💡 Tip: ${prefix}Level`,
                        }, reply);

                        /* Caso sim e for donates */
                    } else {
                        /* Define o tipo da mensagem */
                        const functionType = ['doar', 'pay', 'donate', 'payment'].includes(command) ? 'PAYMENT RECEIPT' : 'BANK TRANSFER';

                        /* Define qual função fará */
                        const functionName = functionType === 'PAYMENT RECEIPT' ? 'leveling' : 'bank';
                        mentionPeople = functionName === 'bank' ? user : mentionPeople;
                        mentionFormatted = functionName === 'bank' ? userFormated : mentionFormatted;

                        /* Se for uma ação de tirar do banco */
                        if (arks.includes('-get') && functionName === 'bank') {
                            /* Adiciona os valores para quem está pagando */
                            Indexer('sql').update('leveling', user, chatId, false, newValues);

                            /* Remove os valores de quem pagou */
                            Indexer('sql').update('bank', user, chatId, false, remValue);

                            /* Se for outras funcoes, como por no banco ou pagar alguém */
                        } else {
                            /* Adiciona os valores para quem está pagando */
                            Indexer('sql').update(functionName, mentionPeople, chatId, false, newValues);

                            /* Remove os valores de quem pagou */
                            Indexer('sql').update('leveling', user, chatId, false, remValue);
                        }

                        /* Define uma mensagem com os novos valores */
                        let textData = `🔎 @${mentionFormatted} 🕵️\n\n︵‿︵‿୨♡୧‿︵‿︵\n\n➖ *${functionType}* ➕\n`;

                        /* Faz a adicão automaticamente da mensagem */
                        Object.keys(newValues).forEach((key) => {
                            /* Se o emoji existir apenas */
                            if (envInfo.parameters.emojiData.value[key]) {
                                /* Adiciona a parte do valor */
                                textData += `\n${envInfo.parameters.emojiData.value[key]} ${Indexer('strings').upperland(key, false).value}: ${newValues[key] > 0 ? '+' : '-'}${newValues[key]}`;
                            }
                        });

                        /* Parte final */
                        textData += '\n\n︵‿︵‿୨♡୧‿︵‿︵';

                        /* Envia a mensagem */
                        envInfo.results.value = await kill.sendMessage(chatId, {
                            text: textData, mentions: [user, mentionPeople],
                        }, reply);

                        /* Define um cooldown */
                        timeouts[cooldownAct][user] = (
                            Date.now() + Number(envInfo.parameters.waitTime.value)
                        );
                    }

                    /* Se for para checar quanto tempo resta para usar novamente */
                } else if (argl[0] === '-time' && timeouts[cooldownAct][user] !== 0) {
                    /* Envia a mensagem com o tempo restante */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('number').format(timeouts[cooldownAct][user] - Date.now()).overall }, reply);

                    /* Se já fez a ação do momento */
                } else {
                    /* Envia a mensagem de espera com o tempo restante para poder usar */
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: Indexer('sql').languages(region, 'Typings', 'Wait', true, true, {
                            resttime: Indexer('number').format(timeouts[cooldownAct][user] - Date.now()).overall,
                        }).value,
                    }, reply);
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
        logging.echoError(error, envInfo, thisDir);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'BANK',
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
        [envInfo.exports.exec]: { value: notSafeBank },
    },
    parameters: {
        location: { value: thisFile },
    },
}, envFile, changeKey, dirname);

/* Exporta tudo */
export default resetLocal();
