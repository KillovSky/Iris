/* Requires */
const fs = require('fs');
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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
async function levelGet(
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
                isGroupMsg,
                groupMembersId,
                user,
                arks,
                name,
                patente,
                leveling,
                requiredXP,
                profilePics,
                personal,
                mentionedJidList,
                bank,
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

                /* Se dono, admin, mod ou pode rodar */
            } else if (isGroupMsg) {
                /* Define as objects */
                const infoDetail = {
                    leveling,
                    bank,
                    personal,
                };

                /* Define as menções */
                const mentionedPlayers = mentionedJidList.filter((j) => (
                    groupMembersId.includes(j) && j !== irisNumber && j !== user
                ));

                /* Se tiver alguma menção,  */
                if (mentionedPlayers.length > 0) {
                    /* Atualiza os dados para o de quem foi mencionado */
                    infoDetail.leveling = Indexer('sql').get('leveling', mentionedPlayers[0], chatId).value;
                    infoDetail.bank = Indexer('sql').get('bank', mentionedPlayers[0], chatId).value;
                    infoDetail.personal = Indexer('sql').get('personal', mentionedPlayers[0], chatId).value;
                }

                /* Define temporariamente o nome */
                const userNome = (infoDetail.personal.name.text === 'default' ? infoDetail.personal.name.number : infoDetail.personal.name.text);

                /* Define a mensagem padrão, não há necessidade de usar o dialogues */
                const dialogueLvL = `🔎 ${userNome} 🕵️\n\n︵‿︵‿୨♡୧‿︵‿︵\n\n🌟 *Level* 🌟\n\n🎓 Patente: ${patente}\n📈 XP: ${infoDetail.leveling.xp}/${requiredXP}\n🎚️ Level: ${infoDetail.leveling.level}\n📬 Messages: ${infoDetail.leveling.messages}\n💰 Coin: ${infoDetail.leveling.coin}\n💎 Diamond: ${infoDetail.leveling.diamond}\n🔴 Rubi: ${infoDetail.leveling.rubi}\n🪨 Stone: ${infoDetail.leveling.stone}\n🏆 Gold: ${infoDetail.leveling.gold}\n🪙 Iron: ${infoDetail.leveling.iron}\n🌲 Wood: ${infoDetail.leveling.wood}\n\n︵‿︵‿୨♡୧‿︵‿︵\n\n💰 *Bank* 💰\n\n💰 Coin: ${infoDetail.bank.coin}\n💎 Diamond: ${infoDetail.bank.diamond}\n🔴 Rubi: ${infoDetail.bank.rubi}\n🪨 Stone: ${infoDetail.bank.stone}\n🏆 Gold: ${infoDetail.bank.gold}\n🪙 Iron: ${infoDetail.bank.iron}\n🌲 Wood: ${infoDetail.bank.wood}`;

                /* Se for para mandar como texto */
                if (arks.includes('-text')) {
                    /* Envia como texto e salva o retorno na envInfo */
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: dialogueLvL,
                    }, reply);

                    /* Se for imagem ou outros */
                } else {
                    /* Obtém imagens de perfil */
                    const pfImages = Array.isArray(profilePics) ? { value: profilePics } : await Indexer('profile').perfil(kill, env);

                    /* Constrói o card de level */
                    const cardLeveling = await Indexer('cards').level(pfImages.value[0], userNome, patente, infoDetail.leveling.xp, requiredXP, infoDetail.leveling.level, groupMembersId.indexOf(user), name);

                    /* Envia */
                    await kill.sendMessage(
                        chatId,
                        { image: cardLeveling.value, caption: dialogueLvL, mentions: [user] },
                        reply,
                    );
                }
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);

        /* Avisa que deu erro, envia o comando e data atual pro sistema S.E.R (Send Error Report) */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'LEVEL',
                time: (new Date()).toLocaleString(),
            }).value,
        }, env.value.reply);
    }

    /* Retorna os resultados */
    return logging.postResults(envInfo);
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
        envInfo.functions.poswork.value = logging.postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a levelGet na envInfo */
        envInfo.functions.exec.value = levelGet;

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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
