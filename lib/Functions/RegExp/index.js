/* Requires */
const fs = require('fs');
const path = require('path');
const removeAccents = require('remove-accents');

/* JSON */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
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
    return envInfo.results.success;
}

/* Cria uma nova RegExp */
function createRegExp(regValue) {
    /* Reseta a success */
    envInfo.results.success = false;

    /* Cria a RegExp padrão */
    let checkRegExp = false;

    /* Try-Catch para caso dê algum erro */
    try {
        /* Cria a regex padrão */
        checkRegExp = RegExp(regValue) || RegExp();

        /* Verifica se não é uma regex */
        if (!(regValue instanceof RegExp)) {
            /* Flags do RegExp */
            let regflag = '';

            /* Define a RegExp a usar */
            const RegExpr = String(regValue)
                .replace(/^[/]+/g, '')
                .replace(/\/|\/$|$/, '/');

            /* Verifica se deve inserir 2° parte */
            if (/\/[g|i|m|u|s|y]+$/.test(String(RegExpr))) {
                /* Segunda parte do RegExp */
                regflag = RegExpr.slice(
                    (((RegExpr
                        .replace(/^\//, '')
                        .lastIndexOf('/')) || -3) + 1
                    ),
                );
            }

            /* Cria a regex em const */
            checkRegExp = RegExp(
                /* 1° e 2° parte do RegExp */
                RegExpr.slice(
                    0,
                    ((RegExpr
                        .replace(/^\//, '')
                        .lastIndexOf('/'))
                        || String(RegExpr).length
                    ),
                ),
                regflag,
            );
        }

        /* Define como sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna a RegExp */
    return checkRegExp;
}

/* Filtro para o awaitMessages */
function confirmMessages(
    textMessage = envInfo.functions.mesrxp.arguments.textMessage.value,
    senderID = envInfo.functions.mesrxp.arguments.senderID.value,
    fromChat = envInfo.functions.mesrxp.arguments.fromChat.value,
    buttonID = envInfo.functions.mesrxp.arguments.buttonID.value,
    regexMatch = envInfo.functions.mesrxp.arguments.regexMatch.value,
) {
    /* Reseta a success */
    envInfo.results.success = false;

    /* Define o valor padrão */
    envInfo.results.value = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se os valores estão corretos */
        if ([senderID, fromChat, buttonID].some((data) => typeof data !== 'string') || typeof textMessage !== 'object') {
            /* Se não estiver, retorna o valor padrão */
            return postResults(envInfo.results);
        }

        /* Gera a RegExp */
        const myRegExp = createRegExp(regexMatch);

        /* Resultado em boolean do 'if' */
        envInfo.results.value = (
            (
                /* Verifica se é o usuário correto */
                textMessage?.sender?.id === senderID

                /* Verifica se é o chat correto */
                && textMessage?.from === fromChat
            )

            /* Condicional conjunta com 3 else'if */
            && (
                (
                    /* Olha se é uma mensagem sem marcação */
                    textMessage?.quotedMsg?.id === (null || undefined)

                    /* Verifica se a mensagem bate */
                    && myRegExp.test(removeAccents(textMessage?.text || ''))
                )

                /* 2° else if */
                || (
                    /* Verifica se a mensagem é marcação */
                    textMessage?.quotedMsg?.id !== null

                    /* Verifica se é o botão certo */
                    && buttonID.includes(textMessage?.quotedMsg?.id)
                )

                /* 3° else if */
                || (
                    /* Verifica se a regex bate com o texto da marcação */
                    myRegExp.test(removeAccents(textMessage?.text || ''))
                )
            )
        );

        /* Define como sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna o resultado */
    return postResults(envInfo.results);
}

/* Checa se é link de grupo */
function isInvitation(
    inviteText = envInfo.functions.invite.arguments.inviteText.value,
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define o valor padrão */
    envInfo.results.value = false;

    /* Try-Catch para casos de erro */
    try {
        /* Checa se é um texto válido */
        if (typeof inviteText === 'string') {
            /* Verifica se é um convite */
            envInfo.results.value = (

                /* Verifica pela RegExp 'chatexp' */
                (createRegExp(envInfo.parameters.chatexp.value)).test(inviteText)

                /* Verifica pela RegExp 'invitereg' */
                || (createRegExp(envInfo.parameters.invitereg.value)).test(inviteText)

                /* Verifica por includes */
                || inviteText.includes('chat.whatsapp.com')
            );
        }

        /* Define como sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna se é um convite */
    return postResults(envInfo.results);
}

/* Regex que retorna se a string é um local */
function isFolder(
    folderText = false,
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define um valor padrão */
    envInfo.results.value = false;

    /* Try-Catch para casos de erro */
    try {
        /* Checa se é um texto válido */
        if (typeof folderText === 'string') {
            /* Verifica se é uma pasta */
            envInfo.results.value = (

                /* Verifica pela RegExp 'folderexp' */
                (createRegExp(envInfo.parameters.folderexp.value)).test(folderText)

                /* Verifica se a pasta existe no PC */
                || fs.existsSync(folderText) === true
            );
        }

        /* Define como sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna o resultado */
    return postResults(envInfo.results);
}

/* Verifica se é uma URL */
function isURL(
    linkText = false,
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define um valor padrão */
    envInfo.results.value = false;

    /* Try-Catch para casos de erro */
    try {
        /* Checa se é um texto válido */
        if (typeof linkText === 'string') {
            /* Verifica se é uma URL */
            envInfo.results.value = (createRegExp(envInfo.parameters.linkexp.value)).test(linkText);
        }

        /* Define como sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna o resultado */
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

        /* Insere a create na envInfo */
        envInfo.functions.create.value = createRegExp;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = echoError;

        /* Insere a messages na envInfo */
        envInfo.functions.mesrxp.value = confirmMessages;

        /* Insere a invite na envInfo */
        envInfo.functions.invite.value = isInvitation;

        /* Insere a folders na envInfo */
        envInfo.functions.folders.value = isFolder;

        /* Insere a URL na envInfo */
        envInfo.functions.urls.value = isURL;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.mesrxp]: envInfo.functions.mesrxp.value,
                [envInfo.exports.create]: envInfo.functions.create.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.invite]: envInfo.functions.invite.value,
                [envInfo.exports.folders]: envInfo.functions.folders.value,
                [envInfo.exports.urls]: envInfo.functions.urls.value,
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
