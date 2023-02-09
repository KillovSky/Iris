/* eslint-disable max-len */
/*
    Esse sistema apenas redireciona o tipo de função.
    Então não possui envInfo, é similar ao Indexer.
*/

/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const userDDI = (JSON.parse(fs.readFileSync('./lib/Databases/Settings/Config.json'))).DDI;
let irisNumber = false;

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

/* Função que decide o que rodar */
async function eventChanger(
    kill = envInfo.functions.events.arguments.kill.value,
    events = envInfo.functions.events.arguments.events.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        if (typeof kill === 'object' && typeof events === 'object') {
            /* Define o número da Íris */
            if (irisNumber === false) {
                irisNumber = `${await kill.getHostNumber()}@c.us`;
            }

            /* Só roda se não for a Íris */
            if (events.who !== irisNumber) {
                /* ---------------------- LISTADO NA LISTA NEGRA ---------------------- */

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
                const functions = JSON.parse(fs.readFileSync(chatData));

                /* Blacklist */
                if (
                    /* Entrou no grupo? */
                    events.action === 'add'

                    /* Grupo tem B.L ativo? */
                    && functions.blacklist.includes(events.chat)

                    /* O número de quem entrou está na B.L? */
                    && functions.antinumbers.some((black) => events.who === black && !functions.whitelist.includes(events.who))
                ) {
                    /* Define o resultado */
                    envInfo.results.value = await Indexer('blacklist').events(kill, events, 'blacklist');
                }

                /* ------------------------ ANTI NÚMEROS FAKES ------------------------ */

                /* Antifake */
                if (
                    /* Entrou no grupo? */
                    events.action === 'add'

                    /* Grupo tem A.F ativo? */
                    && functions.fake.includes(events.chat)

                    /* O número de quem entrou está no A.F e não é W.L? */
                    && !userDDI.some((ddi) => events.who.startsWith(ddi) && !functions.whitelist.includes(events.who))
                ) {
                    /* Define o resultado */
                    envInfo.results.value = await Indexer('fake').events(kill, events, 'antifake');
                }

                /* ---------------------------- BEM VINDOS ---------------------------- */

                /* Welcome */
                if (
                    /* Entrou no grupo? */
                    events.action === 'add'

                    /* Grupo tem boas vindas? */
                    && functions.welcome.includes(events.chat)
                ) {
                    /* Define o resultado */
                    envInfo.results.value = await Indexer('welcome').events(kill, events, 'welcome');
                }

                /* ------------------------ ADEUS PARTICIPANTE ------------------------ */

                /* Goodbye */
                if (
                    /* Saiu do grupo? */
                    events.action === 'remove'

                    /* Grupo tem adeus? */
                    && functions.goodbye.includes(events.chat)
                ) {
                    /* Define o resultado */
                    envInfo.results.value = await Indexer('goodbye').events(kill, events, 'goodbye');
                }
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

        /* Insere a eventChanger na envInfo */
        envInfo.functions.events.value = eventChanger;

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
