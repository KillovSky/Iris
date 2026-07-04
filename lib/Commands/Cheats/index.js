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
async function doNotCheat(
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
                isOwner,
                body,
                isGroupMsg,
                user,
                args,
                mentionedJidList,
                arks,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Se for dono, mas não grupo */
            if (!isGroupMsg && !arks.includes('--bank')) {
                /* Manda a mensagem só de grupos */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'OnlyGroups', true, true, envInfo).value }, reply);

                /* Se não for dono */
            } else if (!isOwner) {
                /* Manda a mensagem de restrito */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Unauthorized', true, true, envInfo).value }, reply);

                /* Define o menu de ajuda */
            } else if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Menu de ajuda normal */
            } else if (arks.includes('--help') || args.length === 0) {
                /* Manda a mensagem de ajuda normal */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Se for uso normal e dono apenas */
            } else if (isOwner) {
                /* Define o local dos valores (eslint: max-len) */
                const cheatAllowed = envInfo.parameters.cheatAllowed.value;
                const cheatLimit = envInfo.parameters.cheatLimit.value;
                let mentionPeople = mentionedJidList || [];
                let mentionFormatted = mentionPeople.map((fix) => fix.replace(/@s.whatsapp.net|@lid/gi, ''));
                const placeDeposit = arks.includes('--bank') ? 'bank' : 'leveling';

                /* Verifica se não contém apenas o user */
                if (mentionPeople.length > 1 && !arks.includes('-me')) {
                    /* Se sim, remove o user da lista se não tiver -me */
                    mentionPeople = mentionPeople.filter((usr) => usr !== user);
                    mentionFormatted = mentionPeople.map((fix) => fix.replace(/@s.whatsapp.net|@lid/gi, ''));
                }

                /* Define quais vai adicionar apartir de usar reduce numa array de elementos */
                const newValues = cheatAllowed.reduce((accumulator, element) => {
                    /* Define uma RegExp para obter os valores na frente */
                    const regex = new RegExp(`${element}\\s*(-?\\d+)`);

                    /* Faz um match dos valores */
                    const match = body.match(regex);

                    /* Se encontrou algo */
                    if (match) {
                        /* Define o valor inicial como o encontrado ou zero */
                        const numericValue = parseInt(match[1], 10) || 0;

                        /* Se o valor for abaixo do limite, adiciona */
                        if (numericValue >= -cheatLimit && numericValue <= cheatLimit) {
                            /* Adiciona na object do acumulador dos resultados */
                            accumulator[element.substring(1)] = numericValue;

                            /* Se não, define como limite */
                        } else if (numericValue < 0) {
                            /* Define negativo */
                            accumulator[element.substring(1)] = -cheatLimit;

                            /* Se nenhum acima, positivo */
                        } else accumulator[element.substring(1)] = cheatLimit;
                    }

                    /* Retorna o resultado até terminar */
                    return accumulator;

                    /* Define a object do acumulador para retornar no reduce */
                }, {});

                /* Verifica se tem algo para inserir, caso não */
                if (
                    Object.values(newValues).every((v) => v === 0)
                    || Object.keys(newValues).length === 0
                ) {
                    /* Envia uma mensagem de falha */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Stranded', true, true, env.value).value }, reply);

                    /* Caso sim */
                } else {
                    /* Se for uma adição ao banco */
                    if (placeDeposit === 'bank') {
                        /* Retira a key XP, level e messages para evitar bugs */
                        delete newValues.xp;
                        delete newValues.level;
                        delete newValues.messages;
                    }

                    /* Faz a adição para todos os mencionados */
                    for (let i = 0; i < mentionPeople.length; i += 1) {
                        /* Adiciona os valores */
                        Indexer('sql').update(placeDeposit, mentionPeople[i], chatId, false, newValues);
                    }

                    /* Define uma mensagem com os novos valores */
                    let textData = `🔎 @${mentionFormatted.join(' @')} 🕵️\n\n︵‿︵‿୨♡୧‿︵‿︵\n\n➖ *CHEAT ACTIVATED* ➕\n`;

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
                        text: textData, mentions: [user, ...mentionPeople],
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
                command: 'CHEATS',
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
        [envInfo.exports.exec]: { value: doNotCheat },
    },
    parameters: {
        location: { value: thisFile },
    },
}, envFile, changeKey, dirname);

/* Exporta todas as funções */
export default resetLocal();
