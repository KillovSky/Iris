/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let ongoingChecks = [];

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
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
                        const isBadURL = Indexer('bash').bash(`bash "${path.normalize(`${irisPath}/lib/Scripts/Others/Hosts.sh`)}" "${urlData.hostnames[i]}" "${path.normalize(`${irisPath}/lib/Databases/Utilities/hosts.txt`)}"`).value;

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
                        await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Security', 'Notice', true, true, { userFormated, notice: 'URL' }).value, mentions: mentioning });

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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os resultados */
    return logging.postResults(envInfo);
}

/* Reset profundo para evitar circular */
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
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.filter]: { value: filterLinks },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
