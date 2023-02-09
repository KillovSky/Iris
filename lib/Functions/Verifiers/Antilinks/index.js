/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const config = JSON.parse(fs.readFileSync('./lib/Databases/Settings/Config.json'));
const firewall = JSON.parse(fs.readFileSync('./lib/Databases/Settings/Firewall.json'));
let Prox_Msg = 0;

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
            /* Constrói os parâmetros */
            const {
                body,
                botNumber,
                caption,
                chatId,
                comment,
                content,
                filename,
                footer,
                fromMe,
                functions,
                groupAdmins,
                id,
                isBotGroupAdmins,
                isGroupAdmins,
                isGroupMsg,
                isOwner,
                hydratedButtons,
                list,
                listButtonText,
                listDescription,
                listFooterText,
                listTitle,
                matchedText,
                name,
                oldbody,
                pushname,
                stickerAuthor,
                stickerPack,
                text,
                type,
                user,
            } = env.value;

            /* Define as condições para ignorar */
            let conditions = (
                /* Se for PV */
                !isGroupMsg

                /* Se for áudio */
                || type === 'ptt'

                /* Se for um grupo e tiver as funções certas desativadas */
                || isGroupMsg && !functions.safelinks && !functions.antilinks && !functions.customized.links.hasOwnProperty(chatId) && !functions.anylinks

                /* Se for um Sticker e não for pra checar eles */
                || !config.Check_Stickers && type == 'sticker'

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
                || Object.keys(functions.vips).includes(user) && config.VIP_Links == true
            );

            /* Não filtra PV ou grupos que não ativaram, Íris precisa ser ADM para funcionar */
            if (conditions === true) return envInfo.results.value;

            /* Utilidades secundarias */
            const contactData = (message?.vcardList?.map((g) => [g?.displayName,  g?.vcard]) || ['']).flat();

            let Message_Texts = [text, matchedText, footer, contactData, listTitle, listDescription, listButtonText, listFooterText, caption, comment, filename];

            Message_Texts = type == 'video' || type == 'image' || type == 'location' ? Message_Texts : Message_Texts.concat(body, content);

            Message_Texts = config.Check_Stickers == true ? Message_Texts.concat(stickerAuthor, stickerPack) : Message_Texts;

            Message_Texts = config.Check_Nickname == true ? Message_Texts.concat(pushname) : Message_Texts;

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
                    hydraButtons = hydraButtons.filter((hdata) => hdata != null);
                    
                    /* Faz concat com os valores e usa flat */
                    Message_Texts = Message_Texts.concat(hydraButtons).flat();
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
                listSections = listSections.filter((sdata) => sdata != null);

                /* Faz concat com os valores e usa flat */
                Message_Texts = Message_Texts.concat(listSections, list?.title, list?.description, list?.buttonText, list?.footerText).flat();
            }
            
            /* Limpa a Message_Texts */
            Message_Texts = Message_Texts.filter((dcol) => dcol != '' && dcol != null && dcol != false)

            /* Corrige a Message_Texts */
            Message_Texts = [...new Set()];
            Message_Texts = ().filter(g => tools('others').isUrl(g)).flat();
            Message_Texts = ([...new Set(Message_Texts.concat(Message_Texts.join(" ").split(" ")))]).flat();

            /* Não verifica dono, ADMS e BOT */
            if (!isOwner && !isGroupAdmins && !fromMe) {

                /* Faz a verificação */
                needs_ban = false;
                motive_ban = false;
                URLs.some(plink => {
                    var Received_Value = false;
                    if (functions.anylinks.includes(chatId) && tools('others').isUrl(plink) || functions.antilinks.includes(chatId) && tools('others').Is_Invite_Link(plink) || type == 'groups_v4_invite' && functions.antilinks.includes(chatId)) {
                        Received_Value = true;
                    } else if (functions.safelinks.includes(chatId)) {
                        var Get_URLS = plink.match(/(http:\/\/)?(www\.)?\w+\.([a-zA-Z0-9]+)/gim) || [];
                        Get_URLS = Get_URLS.filter(j => tools('others').isUrl(j));
                        const is_BURL = (shell.exec(`bash lib/functions/config.sh badwords "${Get_URLS[0]}" "lib/config/Utilidades/hosts.txt"`, {
                            silent: true
                        })).stdout;
                        if (is_BURL.includes('1')) {
                            Received_Value = true;
                        }
                    } else if (Object.keys(functions.customized.links).includes(chatId)) {
                        const databter = functions.customized.links[chatId].some(gtr => plink.toLowerCase().includes(gtr));
                        if (databter) {
                            Received_Value = true;
                        }
                    }
                    if (Received_Value == true) {
                        needs_ban = true;
                        motive_ban = `Link dentro de um/a ${type} ou nickname`;
                        return true;
                    }
                });

            } else return true;

            /* Bane a pessoa caso grupo */
            if (needs_ban == true) {
                Can_Continue = false;
                if (config.Show_Functions == true) {
                    console.log(tools('others').color('[ANTI-LINKS]', 'red'), tools('others').color(`Possível link recebido pelo → ${pushname} - [${user.replace('@c.us', '')}] no "${name || 'PV'}"...`, 'yellow'));
                }
                if (isGroupMsg && isBotGroupAdmins) {
                    await kill.removeParticipant(chatId, user);
                    await kill.deleteMessage(chatId, id);
                }
                if (firewall.Block == true) {
                    await kill.contactBlock(user);
                }
            }

            /* Avisa o por que do banimento, uma vez por hora para casos de flood */
            if (needs_ban == true && Prox_Msg < Date.now() && isBotGroupAdmins) {
                Prox_Msg = Number(Date.now()) + 3600000;
                var banInjust = mylang(region).baninjusto(user) + motive_ban;
                banInjust = firewall.Mention_Admins == true ? banInjust + `.\n@${groupAdmins.join(' @').replace(/@c.us/gim, '')}` : banInjust;
                await kill.sendTextWithMentions(chatId, banInjust);
            }
        }

        /* Diz se pode executar como comando ou mensagem */
        return Can_Continue;

        /* Caso der erro não afeta o funcionamento */
    } catch (error) {
        if (config.Show_Error == true) {
            tools('others').reportConsole('ANTI-LINKS', error);
        }
        return true;
    }

};

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

        /* Insere a isFiltered na envInfo */
        envInfo.functions.filter.value = isFiltered;

        /* Insere a addFilter na envInfo */
        envInfo.functions.addfilter.value = addFilter;

        /* Insere a isSpam na envInfo */
        envInfo.functions.spammer.value = isSpam;

        /* Insere a addMidia na envInfo */
        envInfo.functions.midia.value = addMidia;

        /* Insere a checkSpammer na envInfo */
        envInfo.functions.harm.value = checkSpammer;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.filter]: envInfo.functions.filter.value,
                [envInfo.exports.addfilter]: envInfo.functions.addfilter.value,
                [envInfo.exports.spammer]: envInfo.functions.spammer.value,
                [envInfo.exports.midia]: envInfo.functions.midia.value,
                [envInfo.exports.harm]: envInfo.functions.harm.value,
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