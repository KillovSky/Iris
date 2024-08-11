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
                let mentionFormatted = mentionPeople.map((fix) => fix.replace(/@s.whatsapp.net/gi, ''));
                const placeDeposit = arks.includes('--bank') ? 'bank' : 'leveling';

                /* Verifica se não contém apenas o user */
                if (mentionPeople.length > 1 && !arks.includes('-me')) {
                    /* Se sim, remove o user da lista se não tiver -me */
                    mentionPeople = mentionPeople.filter((usr) => usr !== user);
                    mentionFormatted = mentionPeople.map((fix) => fix.replace(/@s.whatsapp.net/gi, ''));
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
        echoError(error);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'CHEATS',
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

        /* Insere a doNotCheat na envInfo */
        envInfo.functions.exec.value = doNotCheat;

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
