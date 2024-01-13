/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');
const language = require('../../../Dialogues/index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let ongoingChecks = [];

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

/* Configura o antispam */
async function filterLinks(
    kill = envInfo.functions.spam.arguments.kill.value,
    env = envInfo.functions.spam.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Importa os valores */
            const {
                urlData,
                isInvite,
                user,
                userFormated,
                isGroup,
                isOwner,
                messageKey,
                isBotGroupAdmins,
                groupMembersId,
                isModerator,
                isGroupAdmins,
                groupAdmins,
                chatId,
                isGroupCreator,
                functions,
            } = env.value;

            /* Só inicia em condições corretas */
            if (isGroup && !isGroupAdmins && !isGroupCreator && !isOwner && !isModerator && isBotGroupAdmins) {
                /* Define as condições */
                let conditions = functions.antilinks.enable === true && (
                    /* É um link com block de todos os links */
                    (urlData.isURL && functions.antilinks.type === 1)

                    /* É um convite com block de todos os links */
                    || (isInvite && functions.antilinks.type === 1)

                    /* É um convite com block apenas de convites */
                    || (isInvite && functions.antilinks.type === 2)
                );

                /* Reajuste da condição */
                if (conditions === false && functions.antilinks.type === 3 && functions.antilinks.enable === true) {
                    /* Faz um for para verificar cada link */
                    for (let i = 0; i < urlData.hostnames.length; i += 1) {
                        /* Define a execução no arquivo de hosts */
                        const isBadURL = Indexer('bash').bash(`bash "${path.normalize(`${irisPath}/lib/Scripts/Hosts.sh`)}" "${urlData.hostnames[i]}" "${path.normalize(`${irisPath}/lib/Databases/Utilities/hosts.txt`)}"`).value;

                        /* Se o link existir no arquivo de hosts */
                        if (/1/gi.test(isBadURL)) {
                            /* Determina para banir */
                            conditions = true;
                        }
                    }
                }

                /* Se for condição true e um link de convite */
                if (conditions && isInvite) {
                    /* Adquire o link do grupo */
                    const groupInvite = await kill.groupInviteCode(chatId);

                    /* Se o link recebido é apenas um e é o convite do grupo atual */
                    if (urlData.allURLs.length === 1) {
                        /* Verifica se é o link do grupo atual */
                        if (urlData.allURLs[0].includes(groupInvite) || urlData.matchedURL.includes(groupInvite)) {
                            /* Cancela o ban */
                            conditions = false;
                        }
                    }
                }

                /* Se as condições de ban forem true */
                if (conditions) {
                    /* Se ainda estiver no grupo, como casos de spam ou adm remover antes da Íris */
                    /* Também ajuda a evitar SPAM da mensagem de ban ou tentativas de banir já removidos */
                    if (groupMembersId.includes(user) && !ongoingChecks.includes(user)) {
                        /* Adiciona no sistema de evitar spam */
                        ongoingChecks.push(user);

                        /* Bloqueia o grupo para apenas adms */
                        await kill.groupSettingUpdate(chatId, 'announcement');

                        /* Remove do grupo */
                        await kill.groupParticipantsUpdate(chatId, [user], 'remove');

                        /* Define a mentions */
                        const mentioning = (config.tagAdmins.value === true
                            ? [...groupAdmins, user, ...config.owner.value]
                            : [user]
                        );

                        /* Avisa da URL e do banimento */
                        await kill.sendMessage(chatId, { text: language(region, 'Security', 'Notice', true, true, { userFormated, notice: 'URL' }), mentions: mentioning });

                        /* Tira do modo só admins */
                        await kill.groupSettingUpdate(chatId, 'not_announcement');

                        /* Tira do sistema de evitar spam */
                        ongoingChecks = ongoingChecks.filter((d) => d !== user);
                    }

                    /* Deleta a mensagem */
                    await kill.sendMessage(chatId, { delete: messageKey });
                }
            }
        }

        /* Define o sucesso, se seu comando der erro isso jamais será chamado */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
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

        /* Insere a filterLinks na envInfo */
        envInfo.functions.filter.value = filterLinks;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.filter]: envInfo.functions.filter.value,
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
