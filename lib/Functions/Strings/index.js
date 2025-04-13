/* Requires */
const crypto = require('crypto');
const fs = require('fs');

/* JSON */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/**
 * Função robusta para verificar e processar strings Base64
 * com manipulação de prefixos e múltiplas conversões
 * @param {string} str - String a ser validada como Base64 (pode conter prefixo data URI)
 * @returns {object} Objeto contendo detalhes de validação, conversões e metadados
 */
function formatBase64(
    baseValue = envInfo.functions.base64.arguments.baseValue.value,
) {
    /* Inicializa resultados com valores padrão */
    envInfo.results.value = {
        valid: false,
        base64: baseValue,
        buffer: false,
        string: false,
        json: false,
        type: false,
        size: 0,
        decodedSize: 0,
    };

    /* Executa em try-catch caso o parse falhe */
    try {
        /* Verificação inicial de tipo e existência da string */
        if (typeof baseValue !== 'string' || !baseValue.trim()) {
            /* Retorna os dados na forma de como chegaram */
            return logging.postResults(envInfo);
        }

        /* Processamento do prefixo data URI com operação segura */
        const hasPrefix = baseValue.startsWith('data:') && baseValue.includes('base64,');
        const [prefix, base64Part = baseValue] = hasPrefix ? baseValue.split('base64,') : [null, baseValue];

        /* Extrai tipo MIME do prefixo de forma otimizada */
        const type = prefix?.replace(/^data:([^;]+).*/, '$1') || 'unknown';

        /* Regex aprimorada para validação Base64 com suporte a whitespace */
        const base64Regex = /^[\s]*([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?[\s]*$/;
        const isValidBase64 = base64Regex.test(base64Part);

        /* Conversões condicionais somente se for Base64 válido */
        const conversions = {
            json: false,
        };

        /* Caso seja mesmo uma base64 */
        if (isValidBase64) {
            /* Faz trim dela para tirar caracteres invalidos */
            const cleanBase64 = base64Part.trim();

            /* Converte em Buffer */
            const buffer = Buffer.from(cleanBase64, 'base64');

            /* Converte em string */
            const stringValue = buffer.toString('utf8');

            /* Tenta parsear como JSON de forma segura */
            try {
                /* Inserindo como JSON se assim for */
                conversions.json = JSON.parse(stringValue);

                /* Ou em caso de erro onde não é JSON */
            } catch { /* Faz é nada, já será false automaticamente */ }

            /* Preenche objeto de resultados */
            envInfo.results.value.valid = true;
            envInfo.results.value.base64 = cleanBase64;
            envInfo.results.value.buffer = buffer;
            envInfo.results.value.string = stringValue;
            envInfo.results.value.json = conversions.json;
            envInfo.results.value.type = type;
            envInfo.results.value.size = buffer.length;
            envInfo.results.value.decodedSize = buffer.byteLength;

            /* Define o sucesso */
            envInfo.results.success = true;
        }

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo em caso de erro */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o valor resultante */
    return logging.postResults(envInfo);
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o valor resultante */
    return logging.postResults(envInfo);
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Ajusta o tamanho */
    envInfo.results.value = envInfo.results.value.slice(0, cryptoSize);

    /* Retorna o valor gerado com o tamanho especificado */
    return logging.postResults(envInfo);
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a string Data URI ou o valor padrão de base64 */
    return logging.postResults(envInfo);
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o número de ocorrências ou o valor padrão */
    return logging.postResults(envInfo);
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a posição ou o valor padrão */
    return logging.postResults(envInfo);
}

/* Aleatoriza as letras de uma string */
function shuffleChars(
    inputString = envInfo.functions.shuffle.arguments.inputString.value,
) {
    /* Reseta o sucesso */
    envInfo.results.success = false;

    /* Define o resultado padrão como a string original */
    envInfo.results.value = inputString;

    /* Try para caso dê algum erro */
    try {
        /* Verifica se o parâmetro é uma string válida */
        if (typeof inputString === 'string') {
            /* Converte a string em um array de caracteres */
            const charArray = inputString.split('');

            /* Embaralha os caracteres utilizando o algoritmo Fisher-Yates (Knuth Shuffle) */
            for (let i = charArray.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
            }

            /* Junta o array embaralhado de volta em uma string */
            envInfo.results.value = charArray.join('');
        }

        /* Determina sucesso */
        envInfo.results.success = true;

        /* E se der */
    } catch (error) {
        /* Registra o erro retornando o mesmo valor enviado */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os resultados */
    return logging.postResults(envInfo);
}

/* Reset profundo para evitar circular */
/**
 * Restaura o ambiente e atualiza as exportações do módulo com a funcionalidade principal
 * @param {Object} [changeKey={}] - Chaves personalizadas para atualizar o envInfo
 * @param {Object} [envFile=envInfo] - Objeto com informações do ambiente
 * @param {string} [dirname=__dirname] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    changeKey = {},
    envFile = envInfo,
    dirname = __dirname,
) => module.exports = logging.resetAmbient({
    functions: {
        [envInfo.exports.counter]: { value: stringCounter },
        [envInfo.exports.dataURI]: { value: bufferToDataURI },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.shuffle]: { value: shuffleChars },
        [envInfo.exports.base64]: { value: formatBase64 },
        [envInfo.exports.generate]: { value: createRandomString },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.searching]: { value: findPosition },
        [envInfo.exports.upperland]: { value: capitalizeStrings },
        [envInfo.exports.poswork]: { value: logging.postResults },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
