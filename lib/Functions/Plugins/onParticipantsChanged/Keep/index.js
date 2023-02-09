/* eslint-disable max-len */
/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../../index');
const language = require('../../../../Dialogues');

/* JSON'S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const cooldown = envInfo.parameters.lasttext.value;

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

/* Função de remoção */
async function runEvent(
    kill = envInfo.functions.events.arguments.kill.value,
    events = envInfo.functions.events.arguments.events.value,
    fireType = envInfo.functions.events.arguments.fireType.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = cooldown;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Determina se algum parâmetro veio errado */
        if (typeof kill === 'object' && typeof events === 'object' && envInfo.parameters.funtypes.value.includes(fireType)) {
            /* Verifica se o tempo de envio da mensagem terminou */
            if (cooldown[fireType].time < Date.now()) {
                /* Define o nome do evento */
                const eventNomeclt = Indexer('string').upperland(fireType, false);

                /* Define as informações da pessoa que entrou */
                const personInfo = await kill.getContact(events.who);

                /* Define as informações do grupo */
                const groupInfo = await kill.getChatById(events.chat);

                /* Determina a ID de verificação */
                const idChat = events.chat.replace(/[@g.us|@c.us]|[^a-zA-Z0-9]+/gi, '');

                /* Determina o arquivo de grupo */
                const chatData = `./lib/Databases/Groups/${idChat}.json`;

                /* Determina se tem um arquivo privado de grupo */
                if (fs.existsSync(chatData) === false) {
                    /* Define a function padrão */
                    const defChat = JSON.parse(fs.readFileSync('./lib/Databases/Groups/Default.json'));

                    /* Salva o arquivo no PC */
                    fs.writeFileSync(chatData, JSON.stringify(defChat));
                }

                /* Define a functions */
                const cmessages = (JSON.parse(fs.readFileSync(chatData))).Customized.Texts;

                /* Define a pushname */
                const pushname = personInfo.pushname || personInfo.verifiedName || personInfo.formattedName || events.who.replace(/@c.us/gi, '') || 'Anonymous';

                /* Printa o evento na tela */
                console.log(Indexer('color').echo(`[${fireType.toUpperCase()}]`, 'red').value, Indexer('color').echo((language(region, 'Console', eventNomeclt, true, true).replace('{userm}', `${pushname} - (${events.who.replace('@c.us', '')})`).replace('{groupm}', groupInfo.name)), 'yellow').value);

                /* Determina o tempo da mensagem */
                cooldown[fireType].time = Date.now() + (Number(envInfo.parameters.timedate[fireType]) * 60000);

                /* Se o grupo não possuir uma mensagem personalizada */
                if (!Object.keys(cmessages).includes(events.chat)) {
                    /* Gera uma base pra ele */
                    cmessages[events.chat] = {};
                }

                /* Determina se roda o padrão ou uma mensagem customizada */
                if (!Object.keys(cmessages[events.chat]).includes(fireType)) {
                    /* Obtém a foto de perfil */
                    const profileImage = await Indexer('profile').perfil(kill, false, {}, {}, {}, [events.who, events.chat], groupInfo.groupMetadata.participants).value;

                    /* Obtém a imagem do tipo */
                    const canvaImage = await Indexer('cards').greets(pushname, events.who.slice(6, 10), groupInfo.name, groupInfo.groupMetadata.participants.length, profileImage[0], events.action);

                    /* Define a mensagem padrão */
                    let eventSender = (language(region, 'Greets', eventNomeclt, true, true).replace('{userm}', pushname).replace('{groupm}', groupInfo.name));

                    /* Se a função tiver pessoas na lista ainda */
                    if (cooldown[fireType].person.length > 0) {
                        /* Define como marcação pra todos que entraram */
                        eventSender = (language(region, 'Greets', eventNomeclt, true, true).replace('{userm}', `@${cooldown[fireType].person.join(' @')}`).replace('{groupm}', groupInfo.name));
                    }

                    /* Envia a imagem no grupo marcando */
                    envInfo.results.value = await kill.sendFile(events.chat, canvaImage, `${fireType}.png`, eventSender).catch(async () => {
                        envInfo.results.value = await kill.sendTextWithMentions(events.chat, eventSender);
                    });

                    /* Caso seja permitido enviar um áudio */
                    if (envInfo.parameters.sendAudio.value.enabled === true) {
                        /* Envia por URL */
                        envInfo.results.value = await kill.sendPtt(events.chat, envInfo.parameters.sendAudio.value[fireType]);
                    }

                    /* Caso a mensagem customizada tenha marcação */
                } else if (cmessages[events.chat][fireType].message.includes('userm')) {
                    /* Envia a mensagem customizada por marcação */
                    envInfo.results.value = await kill.sendTextWithMentions(events.chat, cmessages[events.chat][fireType].message.replace('{userm}', `@${events.who.replace('@c.us', '')}`).replace('{groupm}', groupInfo.name));

                    /* Se a mensagem customizada não tem marcação */
                } else {
                    /* Envia a mensagem customizada sem @ */
                    envInfo.results.value = await kill.sendText(events.chat, cmessages[events.chat][fireType].message);
                }

                /* Senão */
            } else {
                /* Adiciona na lista pra mais tarde */
                cooldown[fireType].person.push(events.who.replace('@c.us', ''));
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna a nova Array */
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

        /* Insere a runEvent na envInfo */
        envInfo.functions.events.value = runEvent;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.events]: envInfo.functions.events.value,
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
