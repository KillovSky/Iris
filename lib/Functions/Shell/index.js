/* Requires */
const child = require('child_process');
const path = require('path');
const fs = require('fs');

/* JSON's | Utilidades */
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

/* Função para executar comandos em bash */
function execShell(
    termComma = envInfo.functions.bash.arguments.termComma.value,
) {
    /* Essa função não usa envInfo pois pode ser demorada */
    const resultParse = {
        success: false,
        value: false,
    };

    /* Define um resultado padrão */
    resultParse.value = false;

    /* Define o sucesso */
    resultParse.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Faz a execução sem envInfo */
        resultParse.value = child.execSync(termComma, {
            encoding: 'utf8',
            stdio: [],
        });

        /* Define o sucesso */
        resultParse.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Diz o erro */
        resultParse.success = false;
        /* Insere a mensagem de valor */
        resultParse.value = error.message;
    }

    /* Retorna o dialogo */
    return resultParse;
}

/* Faz parse dos diálogos via shell, alternativa ao padrão | Sem uso real no momento */
function dialParse(
    textDial = envInfo.functions.dial.arguments.textDial.value,
    dialLang = envInfo.functions.dial.arguments.dialLang.value,
    textType = envInfo.functions.dial.arguments.textType.value,
    funcType = envInfo.functions.dial.arguments.funcType.value,
    dialSize = envInfo.functions.dial.arguments.dialSize.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Faz a execução */
        const respDial = child.execSync(`bash "lib/Bash/parse.sh" "${textDial}" "${dialLang}" "${textType}" "${funcType}" "${dialSize}"`, {
            encoding: 'utf8',
            stdio: [],
        });

        /* Try-Catch, caso seja JSON invalido */
        try {
            /* Faz o parse somente do valor recebido em vez do JSON inteiro */
            envInfo.results.value = JSON.parse(respDial);

            /* Se der erro */
        } catch (fail) {
            /* Retorna a String recebida */
            envInfo.results.value = respDial;
        }

        /* Caso ainda esteja vazia */
        if (envInfo.results.value instanceof Array && envInfo.results.value[0] == null) {
            /* Define uma resposta padrão */
            envInfo.results.value = ['This is a default text, this only appears when parse receives some error.'];

            /* Senão */
        } else {
            /* Transforma em Array */
            envInfo.results.value = Array(envInfo.results.value).flat();
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna o dialogo */
    return postResults(envInfo.results);
}

/* Função que pega uma linha aleatória de texto */
function getRandomLine(
    linesGet = envInfo.functions.liner.arguments.linesGet.value,
    fileTexts = envInfo.functions.liner.arguments.fileTexts.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Faz a execução */
        const lineRand = child.execSync(`bash "lib/Bash/commands.sh" "line" "${linesGet}" "${fileTexts}"`, {
            encoding: 'utf8',
            stdio: [],
        });

        /* Try-Catch 2, caso der erro em erro */
        try {
            /* Insere as linhas aleatórias */
            let textSplit = lineRand.split('\n');

            /* Remove a breakline */
            textSplit = textSplit.map((line) => line.replace(/\r/gi, ''));

            /* Remove os valores vazios */
            textSplit = textSplit.filter((line) => line !== '');

            /* Define o resultado */
            envInfo.results.value = textSplit;

            /* Se der erro */
        } catch (fail) {
            /* Define um resultado padrão */
            envInfo.results.value = ['This is a default text, this only appears when parse receives some error.'];
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

        /* Insere a dialParse na envInfo */
        envInfo.functions.dial.value = dialParse;

        /* Insere a getOneValue na envInfo */
        envInfo.functions.liner.value = getRandomLine;

        /* Insere o execShell na envInfo */
        envInfo.functions.bash.value = execShell;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.dial]: envInfo.functions.dial.value,
                [envInfo.exports.liner]: envInfo.functions.liner.value,
                [envInfo.exports.bash]: envInfo.functions.bash.value,
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
