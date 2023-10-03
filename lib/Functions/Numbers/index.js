/* eslint-disable max-len */

/* Requires */
const {
    prettyNum,
} = require('pretty-num');
const path = require('path');
const fs = require('fs');
const Indexer = require('../../index');
const language = require('../../Dialogues/index');

/* JSONs | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const isNumeric = /^[0-9]+$/;
const isAlphaNum = /^[0-9]+[a-z]+$/i;

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

    /* Retorna tudo */
    return envInfo;
}

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Função que calcula o tempo ligado da Íris/PC e demais */
function getFormatedTime(
    upTimer = envInfo.functions.format.arguments.upTimer.value,
) {
    /* Define primeiro os milissegundos */
    const startedTime = {
        minMS: (upTimer % (60 * 1000)),
        hoursMS: (upTimer % (60 * 60 * 1000)),
        daysMS: (upTimer % (24 * 60 * 60 * 1000)),
    };

    /* Define em formato 'humano' */
    startedTime.seconds = Math.floor((startedTime.minMS) / (1000));
    startedTime.minutes = Math.floor((startedTime.hoursMS) / (60 * 1000));
    startedTime.hours = Math.floor((startedTime.daysMS) / (60 * 60 * 1000));
    startedTime.days = Math.floor(upTimer / (24 * 60 * 60 * 1000));

    /* Se tudo for zero */
    if (startedTime.seconds <= 0 && startedTime.minutes <= 0 && startedTime.hours <= 0 && startedTime.days <= 0) {
        /* Define os valores como zero */
        startedTime.seconds = 0;
        startedTime.minutes = 0;
        startedTime.hours = 0;
        startedTime.days = 0;

        /* Calcula segundos como milissegundos */
        startedTime.seconds = Math.abs(startedTime.minMS / 1000);

        /* Verifica se continua em zero */
        if (startedTime.seconds === 0) {
            /* Define como abaixo de 0.01, pode ser bem abaixo disso, mas é um valor padrão realístico */
            startedTime.seconds = -0.01;
        }
    }

    /* Define a String */
    startedTime.overall = language(region, 'Helper', 'Timestamp', true, true, startedTime);

    /* Retorna formatado */
    return startedTime;
}

/* Converte o tempo dos jogos e sistemas da Íris em formatos 'certos' */
function getWaitTime(
    actualTime = envInfo.functions.remain.arguments.actualTime.value,
    timingRest = envInfo.functions.remain.arguments.timingRest.value,
) {
    /* Define um valor padrão */
    envInfo.results.value = 0;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Recebe apenas Strings e Números */
        if (isNumeric.test(actualTime) && isNumeric.test(timingRest)) {
            /* Define o tempo inicial */
            const sTime = ((envInfo.parameters.waiter.value * 60000) - (Date.now() - timingRest));

            /* Divide para obter o tempo correto */
            envInfo.results.value = ((Math.abs(sTime) / actualTime)
                /* Conta 2 float's dos MS */
                .toFixed(2)
            );
        }

        /* Define o sucesso */
        envInfo.parameters.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os dados */
    return postResults(envInfo.results);
}

/* Converte unidade por letra */
function extendNumber(
    comNumber = envInfo.functions.extend.arguments.comNumber.value,
    typeExtend = envInfo.functions.extend.arguments.typeExtend.value,
) {
    /* Define um valor padrão | Verifica se é um número sem compact */
    envInfo.results.value = (isNumeric.test(comNumber)
        /* Define como o número recebido */
        ? comNumber
        /* Define como zero */
        : 0
    );

    /* Define o tipo */
    const sendUnit = {
        Time: 'ms',
        Value: 'un',
    };

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Recebe apenas Strings e Números */
        if (isAlphaNum.test(comNumber)) {
            /* Faz parse dos números e letras */
            const numerParse = (comNumber
                /* Separa número de letra com , */
                .replace(/([0-9]+)/, '$1,')
                /* Transforma em Array */
                .split(',')
            );

            /* Faz a conversão do valor */
            envInfo.results.value = Indexer.Tools('metrics').Calculate(`${sendUnit[typeExtend] || '?'}${numerParse[1]}`, numerParse[0]);
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os dados */
    return postResults(envInfo.results);
}

/* Converte números em números compactos */
function compactNumber(
    numberFull = envInfo.functions.compact.arguments.numberFull.value,
) {
    /* Define um valor padrão */
    envInfo.results.value = '0k';

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Recebe apenas Strings e Números */
        if (isNumeric.test(numberFull)) {
            /* Formata como compacto | ES2020 */
            envInfo.results.value = (Intl

                /* Define como formatação de número */
                .NumberFormat(
                    'en-US',

                    /* Object com configurações */
                    {
                        /* Forma compacta */
                        notation: 'compact',
                    },
                )

                /* Insere o número a formatar */
                .format(numberFull)
            );
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os dados */
    return postResults(envInfo.results);
}

/* Verifica se é um número inteiro */
function isInteger(
    numerInt = envInfo.functions.isint.arguments.numerInt.value,
) {
    /* Define um valor padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Recebe apenas Strings e Números */
        if (isNumeric.test(numerInt)) {
            /* Verifica se é um inteiro */
            envInfo.results.value = Number.isInteger(Number(numerInt));
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os dados */
    return postResults(envInfo.results);
}

/* Escolhe um número aleatório */
function getRandomNumber(
    minNumber = envInfo.functions.randnum.arguments.minNumber.value,
    maxNumber = envInfo.functions.randnum.arguments.maxNumber.value,
) {
    /* Define um valor padrão */
    envInfo.results.value = 0;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Recebe apenas Strings e Números */
        if (isNumeric.test(minNumber) && isNumeric.test(maxNumber)) {
            /* Gera um número aleatório */
            envInfo.results.value = Math.floor(
                /* Gera um valor entre 0 e 1 */
                Math.random()
                /* Multiplica pela subtração do máximo ao mínimo com mais um */
                * (maxNumber - minNumber + 1)
                /* Adiciona o valor mínimo no fim */
                + minNumber,
            );
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os dados */
    return postResults(envInfo.results);
}

/* Adquire o tempo de processamento */
function getProcessTime(
    timeUnix = envInfo.functions.process.arguments.timeUnix.value,
) {
    /* Define o tempo agora */
    const timeNow = Date.now();

    /* Define um valor padrão */
    envInfo.results.value = 0;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Recebe apenas Strings e Números */
        if (isNumeric.test(timeUnix)) {
            /* Define o tempo */
            const timedUnix = (String(timeUnix)
                /* Ajusta para o mesmo tamanho do timeNow */
                .padEnd(String(timeNow).length, '0')
            );

            /* Converte o Timestamp em Segundos */
            envInfo.results.value = (timeNow - Number(timedUnix)) / 1000;
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os dados */
    return postResults(envInfo.results);
}

/* Converte exponenciais em números inteiros */
function expandNumber(
    expoNumber = envInfo.functions.expand.arguments.expoNumber.value,
    useAccents = envInfo.functions.expand.arguments.useAccents.value,
    resizeEnd = envInfo.functions.expand.arguments.resizeEnd.value,
    resizeIndex = envInfo.functions.expand.arguments.resizeIndex.value,
) {
    /* Define um valor padrão */
    envInfo.results.value = 0;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Recebe apenas Strings e Números */
        if (isNumeric.test(expoNumber) && isNumeric.test(resizeIndex)) {
            /* Opções padrões de parse */
            const parsing = {
                precision: 10,
                precisionSetting: 2,
            };

            /* Define se deve usar pontuação */
            if (useAccents !== false) {
                /* Insere nas opções */
                parsing.thousandsSeparator = '.';
            }

            /* Faz a correção do valor e converte em String */
            let prettyValue = prettyNum(expoNumber, parsing).toString();

            /* Define se deve cortar, afim de não virar trava de zeros */
            if (resizeEnd !== false) {
                /* Ajusta os valores */
                prettyValue = (
                    `${(prettyValue
                        /* Separa o número de acordo com a resizeIndex */
                        .split('.', Number(resizeIndex)))

                        /* Une ele novamente */
                        .join('.')

                        /* Insere um aviso de que ainda tem número pra frente */
                    }....`
                );
            }

            /* Define o valor final */
            envInfo.results.value = prettyValue;
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os dados */
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

        /* Insere a getWaitTime na envInfo */
        envInfo.functions.remain.value = getWaitTime;

        /* Insere a extendNumber na envInfo */
        envInfo.functions.extend.value = extendNumber;

        /* Insere a compactNumber na envInfo */
        envInfo.functions.compact.value = compactNumber;

        /* Insere a isInteger na envInfo */
        envInfo.functions.isint.value = isInteger;

        /* Insere a getRandomNumber na envInfo */
        envInfo.functions.randnum.value = getRandomNumber;

        /* Insere a getProcessTime na envInfo */
        envInfo.functions.process.value = getProcessTime;

        /* Insere a expandNumber na envInfo */
        envInfo.functions.expand.value = expandNumber;

        /* Insere a getFormatedTime na envInfo */
        envInfo.functions.format.value = getFormatedTime;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.remain]: envInfo.functions.remain.value,
                [envInfo.exports.extend]: envInfo.functions.extend.value,
                [envInfo.exports.compact]: envInfo.functions.compact.value,
                [envInfo.exports.isint]: envInfo.functions.isint.value,
                [envInfo.exports.randnum]: envInfo.functions.randnum.value,
                [envInfo.exports.process]: envInfo.functions.process.value,
                [envInfo.exports.expand]: envInfo.functions.expand.value,
                [envInfo.exports.format]: envInfo.functions.format.value,
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
