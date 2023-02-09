/* Requires */
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

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

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Faz a primeira letra de uma String ser maiúscula */
function capitalizeStrings(
    aString = envInfo.functions.upperland.arguments.aString.value,
    everySpace = envInfo.functions.upperland.arguments.everySpace.value,
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define o valor padrão */
    envInfo.results.value = envInfo.parameters.upper.value;

    /* Try-Catch para casos de erro */
    try {
        /* Caso um parâmetro seja invalido */
        if (typeof aString === 'string' && everySpace === false) {
            /* Faz a edição */
            envInfo.results.value = `${aString.charAt(0).toUpperCase() + aString.slice(1)}`;

            /* Verifica se é uma String */
        } else if (typeof aString === 'string' && everySpace === true) {
            /* Separa por espaços */
            envInfo.results.value = aString.split(' ');

            /* Converte a cada espaço */
            envInfo.results.value = envInfo.results.value.map((txt) => `${txt.charAt(0).toUpperCase() + txt.slice(1)}`);

            /* Junta */
            envInfo.results.value = envInfo.results.value.join(' ');
        }

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna */
    return postResults(envInfo.results.value);
}

/* Cria uma string aleatória */
function createStrings(
    stringSize = envInfo.functions.generate.arguments.stringSize.value,
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Cria o valor padrão */
    let cryptoSize = envInfo.functions.generate.arguments.stringSize.value;

    /* Try-Catch para casos de erro */
    try {
        /* Determina temporariamente o tamanho gerado */
        cryptoSize = Number(stringSize) || envInfo.functions.generate.arguments.stringSize.value;

        /* Faz a geração da String */
        envInfo.results.value = crypto.randomBytes(cryptoSize).toString('hex');

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna o valor */
    return postResults(envInfo.results.value.slice(0, cryptoSize));
}

/* Transforma uma Buffer em Base64 */
function toDataURI(
    mimetype = envInfo.functions.dataURI.arguments.mimetype.value,
    bufferData = envInfo.functions.dataURI.arguments.bufferData.value,
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define a base64 padrão */
    envInfo.results.value = envInfo.parameters.base64.value;

    /* Try-Catch para casos de erro */
    try {
        /* Caso os parâmetros sejam válidos */
        if (typeof mimetype === 'string' && (bufferData instanceof Buffer || typeof bufferData === 'string')) {
            /* Faz a edição da Base64 */
            envInfo.results.value = `data:${mimetype};base64,${bufferData.toString('base64')}`;
        }

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna ela ou a base64 padrão */
    return postResults(envInfo.results.value);
}

/* Conta as aparições de uma palavra em uma String */
function stringCounter(
    phrase = envInfo.functions.counter.arguments.phrase.value,
    specWord = envInfo.functions.counter.arguments.specWord.value,
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define o resultado padrão */
    envInfo.results.value = envInfo.parameters.lengoter.value;

    /* Try-Catch para casos de erro */
    try {
        /* Caso um parâmetro seja invalido */
        if (typeof phrase === 'string' && typeof specWord === 'string') {
            /* Faz a contagem de novo */
            envInfo.results.value = phrase.split(specWord).length - 1;
        }

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna */
    return postResults(envInfo.results.value);
}

/* Acha a posição de algo numa string */
function findPosition(
    longText = envInfo.functions.searching.arguments.longText.value,
    wordFind = envInfo.functions.searching.arguments.wordFind.value,
    startAt = envInfo.functions.searching.arguments.startAt.value,
) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define o resultado padrão */
    envInfo.results.value = envInfo.parameters.lengoter.value;

    /* Try-Catch para casos de erro */
    try {
        /* Caso os parâmetros sejam válidos */
        if (typeof longText === 'string' && typeof wordFind === 'string' && !Number.isNaN(Number(startAt))) {
            /* Separa o texto até 'x' posição */
            envInfo.results.value = longText.split(wordFind, startAt);

            /* Junta ele */
            envInfo.results.value = envInfo.results.value.join(wordFind);

            /* Determina o tamanho dele */
            envInfo.results.value = envInfo.results.value.length;

            /* Verifica se está correto */
            if (longText.slice(envInfo.results.value).length === 0) {
                /* Se não estiver define como a ultima posição na String inteira */
                envInfo.results.value = longText.lastIndexOf(wordFind);
            }
        }

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna */
    return postResults(envInfo.results.value);
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

        /* Insere a counter na envInfo */
        envInfo.functions.counter.value = stringCounter;

        /* Insere a dataURI na envInfo */
        envInfo.functions.dataURI.value = toDataURI;

        /* Insere a generate na envInfo */
        envInfo.functions.generate.value = createStrings;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a searching na envInfo */
        envInfo.functions.searching.value = findPosition;

        /* Insere a capitalizeStrings na envInfo */
        envInfo.functions.upperland.value = capitalizeStrings;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.counter]: envInfo.functions.counter.value,
                [envInfo.exports.dataURI]: envInfo.functions.dataURI.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.generate]: envInfo.functions.generate.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.searching]: envInfo.functions.searching.value,
                [envInfo.exports.upperland]: envInfo.functions.upperland.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
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
