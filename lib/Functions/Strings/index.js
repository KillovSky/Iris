/* Requires */
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

/* JSON */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Realiza funções de pós finalização */
function postResults(response) {
    /* Verifica se pode resetar a envInfo */
    if (
        envInfo.settings.finish.value === true
        || (envInfo.settings.ender.value === true && envInfo.results.success === false)
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
        /* Define se vai printar inteiro */
        const showError = config?.fullError?.value || true;

        /* Se pode printar o erro inteiro */
        if (showError) {
            /* Só joga o erro na tela */
            console.error(error);

            /* Se não, formata e printa */
        } else console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envInfo.results;
}

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Converte a primeira letra de uma string para maiúscula */
function capitalizeStrings(
    inputString = envInfo.functions.upperland.arguments.inputString.value,
    capitalizeEveryWord = envInfo.functions.upperland.arguments.capitalizeEveryWord.value,
) {
    /* Reseta o sucesso */
    envInfo.results.success = false;

    /* Define o valor padrão */
    envInfo.results.value = envInfo.parameters.upper.value;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se a entrada é uma string válida */
        if (typeof inputString === 'string') {
            /* Se deve capitalizar cada palavra */
            if (capitalizeEveryWord) {
                /* Separa a string em palavras */
                const words = inputString.split(' ');

                /* Capitaliza cada palavra */
                const capitalizedWords = words.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`);

                /* Junta as palavras novamente */
                envInfo.results.value = capitalizedWords.join(' ');

                /* Se não for para fazer em cada palavra */
            } else {
                /* Capitaliza apenas a primeira letra da string */
                envInfo.results.value = `${inputString.charAt(0).toUpperCase()}${inputString.slice(1)}`;
            }

            /* Define sucesso */
            envInfo.results.success = true;
        }

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo em caso de erro */
        echoError(error);
    }

    /* Retorna o valor resultante */
    return postResults(envInfo.results);
}

/* Cria uma string aleatória com o tamanho especificado */
function createRandomString(
    stringSize = envInfo.functions.generate.arguments.stringSize.value,
) {
    /* Reseta o sucesso */
    envInfo.results.success = false;

    /* Define o tamanho padrão */
    let cryptoSize = envInfo.functions.generate.arguments.stringSize.value;

    /* Try-Catch para casos de erro */
    try {
        /* Determina temporariamente o tamanho gerado */
        cryptoSize = Number(stringSize) || envInfo.functions.generate.arguments.stringSize.value;

        /* Gera a string aleatória */
        const randomBytes = crypto.randomBytes(cryptoSize);
        envInfo.results.value = randomBytes.toString('hex');

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo em caso de erro */
        echoError(error);
    }

    /* Ajusta o tamanho */
    envInfo.results.value = envInfo.results.value.slice(0, cryptoSize);

    /* Retorna o valor gerado com o tamanho especificado */
    return postResults(envInfo.results);
}

/* Converte um Buffer em uma string Data URI base64 */
function bufferToDataURI(
    mimetype = envInfo.functions.dataURI.arguments.mimetype.value,
    bufferData = envInfo.functions.dataURI.arguments.bufferData.value,
) {
    /* Reseta o sucesso */
    envInfo.results.success = false;

    /* Define a base64 padrão */
    envInfo.results.value = envInfo.parameters.base64.value;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se os parâmetros são válidos */
        if (typeof mimetype === 'string' && (bufferData instanceof Buffer || typeof bufferData === 'string')) {
            /* Converte o Buffer para base64 e cria a string Data URI */
            envInfo.results.value = `data:${mimetype};base64,${Buffer.from(bufferData).toString('base64')}`;
        }

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Se der um erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna a string Data URI ou o valor padrão de base64 */
    return postResults(envInfo.results);
}

/* Conta as ocorrências de uma palavra em uma string */
function stringCounter(
    phrase = envInfo.functions.counter.arguments.phrase.value,
    specWord = envInfo.functions.counter.arguments.specWord.value,
) {
    /* Reseta o sucesso */
    envInfo.results.success = false;

    /* Define o resultado padrão */
    envInfo.results.value = envInfo.parameters.lengoter.value;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se ambos os parâmetros são strings */
        if (typeof phrase === 'string' && typeof specWord === 'string') {
            /* Faz a contagem de ocorrências */
            const occurrences = phrase.split(specWord).length - 1;

            /* Atualiza o valor no resultado */
            envInfo.results.value = occurrences;
        }

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Se der erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna o número de ocorrências ou o valor padrão */
    return postResults(envInfo.results);
}

/* Encontra a posição de uma palavra em uma string a partir de uma determinada posição */
function findPosition(
    longText = envInfo.functions.searching.arguments.longText.value,
    wordFind = envInfo.functions.searching.arguments.wordFind.value,
    startAt = envInfo.functions.searching.arguments.startAt.value,
) {
    /* Reseta o sucesso */
    envInfo.results.success = false;

    /* Define o resultado padrão */
    envInfo.results.value = envInfo.parameters.lengoter.value;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se os parâmetros são válidos */
        if (typeof longText === 'string' && typeof wordFind === 'string' && !Number.isNaN(Number(startAt))) {
            /* Encontra a posição da palavra na string começando a busca da posição especificada */
            envInfo.results.value = longText.indexOf(wordFind, startAt);

            /* Verifica se a palavra foi encontrada */
            if (envInfo.results.value !== -1) {
                /* Se encontrada, atualiza a posição para a posição especificada */
                envInfo.results.value = longText.lastIndexOf(wordFind, startAt);

                /* Adiciona o comprimento da palavra para obter a posição final */
                envInfo.results.value += wordFind.length;
            }
        }

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Se der um erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna a posição ou o valor padrão */
    return postResults(envInfo.results);
}

/* Aleatoriza as letras de uma string */
function shuffleChars(
    inputString = envInfo.functions.shuffle.arguments.inputString.value,
) {
    /* Reseta o sucesso*/
    envInfo.results.success = false;

    /* Define o resultado padrão como a string original*/
    envInfo.results.value = inputString;

    /* Try para caso dê algum erro */
    try {
        /* Verifica se o parâmetro é uma string válida*/
        if (typeof inputString === 'string') {
            /* Converte a string em um array de caracteres*/
            let charArray = inputString.split('');

            /* Embaralha os caracteres utilizando o algoritmo Fisher-Yates (Knuth Shuffle)*/
            for (let i = charArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
            }

            /* Junta o array embaralhado de volta em uma string*/
            envInfo.results.value = charArray.join('');
        }

        /* Determina sucesso*/
        envInfo.results.success = true;

        /* E se der */
    } catch (error) {
        /* Registra o erro retornando o mesmo valor enviado */
        echoError(error);
    }

    /* Retorna os resultados */
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

        /* Insere a counter na envInfo */
        envInfo.functions.counter.value = stringCounter;

        /* Insere a dataURI na envInfo */
        envInfo.functions.dataURI.value = bufferToDataURI;

        /* Insere a generate na envInfo */
        envInfo.functions.generate.value = createRandomString;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a searching na envInfo */
        envInfo.functions.searching.value = findPosition;

        /* Insere a capitalizeStrings na envInfo */
        envInfo.functions.upperland.value = capitalizeStrings;

        /* Insere a shuffleChars na envInfo */
        envInfo.functions.shuffle.value = shuffleChars;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.counter]: envInfo.functions.counter.value,
                [envInfo.exports.dataURI]: envInfo.functions.dataURI.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.shuffle]: envInfo.functions.shuffle.value,
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
