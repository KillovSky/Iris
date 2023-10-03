/* eslint-disable max-len */
/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');
const language = require('../../../Dialogues/index');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const config = JSON.parse(fs.readFileSync('./lib/Databases/Settings/Config.json'));
let nextMessage = 0;

/* Realiza funções de pós finalização */
function postResults(response) {
    /* Verifica se pode resetar a envInfo */
    if ((envInfo.settings.finish.value === true)
        || (envInfo.settings.ender.value === true
            && envInfo.results.success === false
        )
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
        /* Printa o erro */
        console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envInfo.results;
}

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Sistemas de verificação */
async function startVerification(
    kill = envInfo.functions.safe.arguments.kill.value,
    env = envInfo.functions.safe.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Constrói os parâmetros */
            const {
                body,
                caption,
                chatId,
                comment,
                content,
                filename,
                footer,
                fromMe,
                functions,
                groupAdminsFormated,
                id,
                isBotGroupAdmins,
                isGroupAdmins,
                isGroupCreator,
                isGroupMsg,
                isOwner,
                isVIP,
                hydratedButtons,
                list,
                listButtonText,
                listDescription,
                listFooterText,
                listTitle,
                matchedText,
                name,
                pushname,
                stickerAuthor,
                stickerPack,
                text,
                type,
                user,
                userFormated,
            } = env.value;

            /* Define o motivo do arquivo na env */
            /* eslint-disable-next-line no-param-reassign */
            env.value.notice = language(region, 'Security', 'Urls', true, true, env.value);

            /* Define as condições para ignorar */
            let conditions = (
                /* Se for PV */
                !isGroupMsg

                /* Se for áudio */
                || type === 'ptt'

                /* Se for um grupo e tiver as funções certas desativadas */
                || (isGroupMsg && !functions.safelinks && !functions.antilinks && !Object.keys(functions.customized.links).includes(chatId) && !functions.anylinks)

                /* Se for um Sticker e não for pra checar eles */
                || (!config.Check_Stickers && type === 'sticker')

                /* Se a Íris não for ADM */
                || !isBotGroupAdmins

                /* Se o grupo estiver desabilitado */
                || functions.disabled

                /* Se for um dos ADMS */
                || isGroupAdmins

                /* Se for o dono do grupo */
                || isGroupCreator

                /* Se for o chefe da Íris */
                || isOwner

                /* Se for a Íris */
                || fromMe

                /* Se for um VIP e os Links forem permitidos */
                || (isVIP && config.VIP_Links === true)
            );

            /* Não filtra PV ou grupos que não ativaram, Íris precisa ser ADM para funcionar */
            if (conditions === true) return envInfo.results.value;

            /* Utilidades secundarias */
            const contactData = (env.value.basemessage?.vcardList?.map((g) => [g?.displayName, g?.vcard]) || ['']).flat();

            /* Define tudo em um */
            let messageTexts = [text, matchedText, footer, contactData, listTitle, listDescription, listButtonText, listFooterText, caption, comment, filename];

            /* Se não for midia, insere body e content */
            messageTexts = type === 'video' || type === 'image' || type === 'location' ? messageTexts : messageTexts.concat(body, content);

            /* Se for permitido checar stickers */
            messageTexts = config.Check_Stickers === true ? messageTexts.concat(stickerAuthor, stickerPack) : messageTexts;

            /* Checa o nickname se permitido */
            messageTexts = config.Check_Nickname === true ? messageTexts.concat(pushname) : messageTexts;

            /* Sistema para caso tenha botões híbridos */
            if (hydratedButtons?.length > 0) {
                /* Adquire os valores de uma vez */
                let hydraButtons = hydratedButtons?.map((bdata) => [
                    bdata?.urlButton?.displayText,
                    bdata?.urlButton?.url,
                    bdata?.callButton?.displayText,
                    bdata?.callButton?.phoneNumber,
                    bdata?.quickReplyButton?.displayText,
                    bdata?.quickReplyButton?.id,
                ]).flat();

                /* Filtra valores null e similar */
                hydraButtons = hydraButtons.filter((hdata) => hdata !== null);

                /* Faz concat com os valores e usa flat */
                messageTexts = messageTexts.concat(hydraButtons).flat();
            }

            /* Caso tenha sessões em botões */
            if (list?.sections?.length > 0) {
                /* Define os valores todos de uma vez */
                let listSections = list?.sections?.map((lsdata) => [
                    lsdata?.title,
                    lsdata?.rows?.map((gdata) => [
                        gdata?.rowId,
                        gdata?.title,
                        gdata?.description,
                    ]),
                ]).flat(5);

                /* Filtra valores null e similar */
                listSections = listSections.filter((sdata) => sdata !== null);

                /* Faz concat com os valores e usa flat */
                messageTexts = messageTexts.concat(listSections, list?.title, list?.description, list?.buttonText, list?.footerText).flat();
            }

            /* Limpa a messageTexts */
            messageTexts = messageTexts.filter((dcol) => dcol !== '' && dcol !== null && dcol !== false);

            /* Corrige a messageTexts */
            messageTexts = [...new Set(messageTexts)];
            messageTexts = messageTexts.filter((dat) => Indexer('regexp').urls(dat)).flat();

            /* Faz a verificação */
            envInfo.results.value = messageTexts.some((iurls) => {
                /* Condições */
                conditions = (
                    /* Bane qualquer link */
                    (functions.anylinks && Indexer('regexp').urls(iurls))

                    /* Links de grupo */
                    || (functions.antilinks && Indexer('regexp').invite(iurls))

                    /* Convite dentro de grupo e antilinks */
                    || (type.includes('invite') && functions.antilinks)

                    /* Convite dentro de grupo e anylinks */
                    || (type.includes('invite') && functions.anylinks)
                );

                /* Verifica por links de vírus e demais */
                if (functions.safelinks && conditions === false) {
                    /* Faz match das urls */
                    let matchedURLS = iurls.match(/(http:\/\/)?(www\.)?\w+\.([a-zA-Z0-9]+)/gim);

                    /* Só continua se tiver array */
                    if (Array.isArray(matchedURLS)) {
                        /* Verifica URL's novamente */
                        matchedURLS = matchedURLS.filter((mur) => Indexer('regexp').urls(mur));

                        /* Faz outro some para checar se alguma URL existe no 'hosts.txt' */
                        conditions = matchedURLS.some((nurl) => {
                            /* Executa via BASH */
                            const isDamage = Indexer('shell').bash(`bash lib/Scripts/Commands.sh badwords "${nurl}" "lib/Databases/Texts/Hosts.txt"`).value;

                            /* Retorna o resultado */
                            return isDamage.includes('1');
                        });
                    }
                }

                /* Verifica por links customizados */
                if (Object.keys(functions.customized.links).includes(chatId) && conditions === false) {
                    /* Usa find para localizar a URL na array em lowercase */
                    conditions = (functions.customized.links[chatId].find((surl) => iurls.toLowerCase() === surl.toLowerCase()) !== null);
                }

                /* Retorna o resultado */
                return conditions;
            });

            /* Verifica se as condições foram cumpridas */
            if (envInfo.results.value === true) {
                /* Alerta no console */
                console.log(Indexer('color').echo('[ANTI-LINKS]', 'red'), Indexer('color').echo(`Possível link recebido pelo → ${pushname} - [${userFormated}] no "${name || 'PV'}"...`, 'yellow'));

                /* Se for em grupo e a Íris for ADM */
                if (isGroupMsg && isBotGroupAdmins) {
                    /* Remove a pessoa */
                    await kill.removeParticipant(chatId, user);

                    /* Deleta a mensagem dela */
                    await kill.deleteMessage(chatId, id);
                }

                /* Se o autoblock estiver ativo */
                if (config.Auto_Block === true) {
                    /* Bloqueia a pessoa, esse sistema pode ser lento, desative se estiver com lags */
                    await kill.contactBlock(user);
                }
            }

            /* Avisa o por que do banimento, uma vez por hora para casos de flood */
            if (envInfo.results.value === true && nextMessage < Date.now() && isBotGroupAdmins) {
                /* Define a hora da próxima mensagem, espero que nunca :) */
                nextMessage = Number(Date.now()) + 3600000;

                /* Define se deve mencionar os adms */
                const menAdms = functions.mentions ? `@${groupAdminsFormated.join(', @')}` : '';

                /* Define a mensagem a mandar */
                const messageFinal = language(region, 'Security', 'Notice', true, true, env.value) + menAdms;

                /* Envia o motivo de ser banido */
                await kill.sendTextWithMentions(chatId, messageFinal);
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Retorna o resultado */
        return postResults(envInfo.results);

        /* Caso der erro não afeta o funcionamento */
    } catch (error) {
        /* Printa o erro */
        Indexer('color').reportConsole(error, 'ANTI-LINKS');

        /* Retorna pra parar */
        return true;
    }
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

        /* Insere a startVerification na envInfo */
        envInfo.functions.safe.value = startVerification;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.safe]: envInfo.functions.safe.value,
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
