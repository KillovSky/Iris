/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const dataInfos = {
    filterUsers: new Set(),
    lastTimestamp: 0,
    mediaStamps: {},
};

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

/* ----------- Mensagens/Comandos ----------- */

/* Função que verifica se é spammer */
function isFiltered(
    from = envInfo.functions.filter.arguments.from.value,
) {
    /* Retorna se contém x pessoa */
    return dataInfos.filterUsers.has(from);
}

/* Adiciona usos no SPAM */
function addFilter(
    from = envInfo.functions.addfilter.arguments.from.value,
) {
    /* Se o filtro não tiver a pessoa, continua */
    if (!isFiltered(from)) {
        /* Adiciona no filtro */
        dataInfos.filterUsers.add(from);

        /* Determina um tempo de espera no filtro */
        setTimeout(() => {
            /* Deleta do filtro */
            dataInfos.filterUsers.delete(from);
        }, Number(envInfo.parameters.spamDefs.value.Command) * 1000);
    }

    /*
        1000 representa o tempo de uso em segundos.
        60000 representa o tempo em minutos.
        E assim vai, não mexa se não entender.
    */

    /* Retorna a Set */
    return dataInfos.filterUsers;
}

/* ----------------- Mídias ----------------- */

/* Função que verifica se está sendo SPAM */
function isSpam(
    from = envInfo.functions.spammer.arguments.from.value,
) {
    /* Condições de SPAM */
    const conditions = (

        /* Caso a quantidade de mídias seja maior que o limite */
        Number(dataInfos.mediaStamps[from]) > Number(envInfo.parameters.spamDefs.value.MaxSend)

        /* E a ultima mídia esteja em espera ainda */
        && dataInfos.lastTimestamp > Date.now()
    );

    /* Senão, false */
    return conditions;
}

/* Anti Spam de Mídia */
function addMidia(
    from = envInfo.functions.midia.arguments.from.value,
) {
    /* Aumenta ou inicializa o SPAM */
    dataInfos.mediaStamps[from] = Number(dataInfos.mediaStamps[from]) + 1 || 1;

    /* Caso a pessoa tenha esperado corretamente */
    if (dataInfos.lastTimestamp < Date.now()) {
        /* Reseta o SPAM */
        dataInfos.mediaStamps[from] = 1;
    }

    /* Define o novo timestamp de espera */
    dataInfos.lastTimestamp = Number(Date.now()) + (Number(envInfo.parameters.spamDefs.value.Media) * 1000);

    /* Retorna a quantidade de SPAM atual */
    return dataInfos.mediaStamps[from];
}

/* Função que faz as checagens antes dos comandos */
async function checkSpammer(
    kill = envInfo.functions.harm.arguments.kill.value,
    env = envInfo.functions.harm.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Determina o arquivo de Grupo/Chat */
        const functions = JSON.parse(fs.readFileSync(env.value.funFile));

        /* ----------------- Mídias ----------------- */

        /* Define as condições do SPAM de mídia */
        envInfo.results.value = (

            /* Se é uma mídia */
            env.value.isMedia === true

            /* Se o SPAM está ativado */
            && Object.keys(functions.Spammer).includes(env.value.chatId) === true

            /* Se é um grupo */
            && env.value.isGroupMsg === true

            /* Se não é o dono dele */
            && env.value.isGroupCreator === false

            /* A Íris */
            && env.value.isBot === false

            /* Um MOD */
            && env.value.isModerator === false

            /* Um ademiro */
            && env.value.isGroupAdmins === false

            /* Ou o dono */
            && env.value.isOwner === false
        );

        /* Verifica se retornou true acima */
        if (envInfo.results.value === true) {
            /* Adiciona +1 no SPAM de mídia */
            addMidia(env.value.user);

            /* Define se é Spammer */
            envInfo.results.value = isSpam(env.value.user);

            /* Verifica se o usuário está no SPAM */
            if (envInfo.results.value === true) {
                /* Avisa no terminal */
                console.log(
                    Indexer('color').echo('[ANTI-SPAM]', 'red').value,
                    Indexer('color').echo(`Possível spam de mídia recebido pelo → ${env.value.pushname}`, 'yellow').value,
                    Indexer('color').echo(`- [${env.value.user}] em "${env.value.chat?.kind || '?'}"...`, 'yellow').value,
                );

                /* Verifica se deve banir ou alertar */
                if (functions.Spammer[env.value.chatId] === true) {
                    /* Envia a mensagem de BAN */
                    await kill.sendText(env.value.chatId, 'Banido.'); // `${Indexer.Tools('texts').BanInjusto(env.value.user)}Spam`

                    /* Remove o participante */
                    await kill.removeParticipant(env.value.chatId, env.value.user);

                    /* Se for somente aviso */
                } else {
                    /* Envia a mensagem para ele */
                    await kill.sendTextWithMentions(env.value.chatId, 'Para de floodar ai'); // `@${env.value.user.replace(/@c.us/gi, '')} - Pare de floodar, você está no limite de mídias.`
                }

                /* Retorna que deve parar */
                return postResults(envInfo.results);
            }
        }

        /* ----------- Mensagens/Comandos ----------- */

        /* Define as condições do SPAM de comandos */
        envInfo.results.value = (

            /* Verifica se é um comando */
            env.value.isCmd === true

            /* Se está filtrado */
            && isFiltered(env.value.chatId) === true

            /* E não é o dono */
            && env.value.isOwner === false
        );

        /* Anti Flood universal */
        if (envInfo.results.value === true) {
            /* Avisa no terminal */
            console.log(
                Indexer('color').echo(`> [FLOOD] [${env.value.prefix}${env.value.command.toUpperCase()}] |`, 'red').value,
                Indexer('color').echo(env.value.time, 'yellow').value,
                Indexer('color').echo(`| "${env.value.pushname} - [${env.value.user.replace(/@c.us/gi, '')}]" |`, 'yellow').value,
                Indexer('color').echo(`${env.value.typeName}`, 'yellow').value,
            );

            /* Retorna se deve parar */
            return postResults(envInfo.results);
        }

        /* ---------------- Sistemas ---------------- */

        /* Verifica se é um comando e não é dono */
        if (env.value.isCmd === true && env.value.isOwner === false) {
            /* Determina o tipo de SPAM */
            const typeSpam = env.value[envInfo.parameters.spamDefs.value.Type] || env.value.chatId;

            /* Insere no SPAM */
            addFilter(typeSpam);
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
