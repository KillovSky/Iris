/* Requires */
const fs = require('fs');

/* JSONs | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const isNumeric = /^[0-9]+$/;

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Função que gera as Arrays, não utilizada na envInfo por ser referênciada */
function makeArray(
    arrayValues = envInfo.functions.make.arguments.arrayValues.value,
) {
    /* Substituto da envInfo */
    const envData = {
        value: false,
        success: false,
    };

    /* Define os valores padrões sem a envInfo */
    envData.value = envInfo.parameters.array.value;

    /* Define o sucesso */
    envData.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se é object */
        if (!Array.isArray(arrayValues) && arrayValues !== null && typeof arrayValues === 'object') {
            /* Converte as keys em Array */
            envData.value = Object.keys(arrayValues);

            /* Verifica se é Array */
        } else if (Array.isArray(arrayValues)) {
            /* Insere como Array */
            envData.value = arrayValues;

            /* Verifica se é Número */
        } else if (!Number.isNaN(Number(arrayValues))) {
            /* Insere ele em uma Array */
            envData.value = [Number(arrayValues)];

            /* Caso seja outra coisa e não seja null */
        } else if (arrayValues !== null) {
            /* Transforma os valores enviados em Array */
            envData.value = new Array(arrayValues);
        }

        /* Verifica se os valores estão vazios */
        if (envData.value.length === 0 || envData.value[0] == null) {
            /* Define o padrão novamente */
            envData.value = envInfo.parameters.array.value;
        }

        /* Define o sucesso */
        envData.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return envData;
}

/* Aleatoriza arrays */
function aleatorizeArray(
    arraySend = envInfo.functions.sort.arguments.arraySend.value,
) {
    /* Formata a Array */
    envInfo.results.value = makeArray(arraySend).value;

    /* Aleatoriza ela */
    envInfo.results.value = envInfo.results.value.sort(() => Math.random() - 0.5);

    /* Retorna a Array */
    return logging.postResults(envInfo);
}

/* Randomiza uma array */
function getRandomValue(
    arrayRandom = envInfo.functions.extract.arguments.arrayRandom.value,
) {
    /* Formata a Array */
    envInfo.results.value = makeArray(arrayRandom).value;

    /* Faz a extração */
    envInfo.results.value = envInfo.results.value[
        Math.floor(Math.random() * envInfo.results.value.length)
    ];

    /* Retorna o valor */
    return logging.postResults(envInfo);
}

/* Gera uma Array numérica */
function createArrayNumber(
    startIdx = envInfo.functions.create.arguments.startIdx.value,
    endIdx = envInfo.functions.create.arguments.endIdx.value,
    startSlice = envInfo.functions.create.arguments.startSlice.value,
    endSlice = envInfo.functions.create.arguments.endSlice.value,
) {
    /* Define um valor padrão */
    envInfo.results.value = envInfo.parameters.array.value;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Caso tenha enviado apenas um valor */
        if (isNumeric.test(startIdx)) {
            /* Faz uma Array aleatoria com x quantidade */
            (envInfo.results.value = Array(Number(startIdx))
                /* Preenche a Array */
                .fill()
                /* Adquire apenas o index dela */
                .map((_, idx) => idx)
            );
        }

        /* Verifica se os valores estão corretos */
        const conditions = (
            /* Verifica se a startIdx é um número */
            (isNumeric.test(startIdx)

                /* Verifica se a endIdx é um número */
                && isNumeric.test(endIdx)
            )

            /* Verifica se os slices são válidos */
            && (

                /* Começando pela startSlice */
                (isNumeric.test(startSlice)

                    /* Então a endSlice */
                    && isNumeric.test(endSlice)
                )

                /* Verifica se a startSlice é inválida */
                || (!isNumeric.test(startSlice)

                    /* Verifica a endSlice agora */
                    && !isNumeric.test(endSlice)
                )
            )
        );

        /* Caso o valor enviado seja válido */
        if (conditions === true) {
            /* Define com qual deve começar */
            const interline = (Number(startIdx) >= Number(endIdx)
                /* Caso seja reverso, o contrario (final como inicio) */
                ? [Number(endIdx), Number(startIdx)]

                /* Senão, o normal (final como final) */
                : [Number(startIdx), Number(endIdx)]
            );

            /* Define o calculo do tamanho da Array (final - comeco + 1) */
            const calculine = (interline[1] - interline[0]) + 1;

            /* Cria uma Array */
            (envInfo.results.value = [...Array(calculine)]
                /* Preenche ela de null */
                .fill()
                /* Converte os null's em númerações */
                .map((_, idx) => interline[0] + Number(idx))
            );

            /* Verifica se os valores são nulos de novo, segurança em primeiro lugar */
            if (isNumeric.test(startSlice) && isNumeric.test(endSlice)) {
                /* Verifica se a slice deve ser inversa */
                if (Number(startSlice) > Number(endSlice)) {
                    /* Inverte (obtém os números do final pro inicio) */
                    envInfo.results.value = envInfo.results.value.slice(endSlice, startSlice);

                    /* Se forem valores de Slice diferentes (ou seja: normais) */
                } else if (Number(startSlice) !== Number(endSlice)) {
                    /* Faz slice da Array normalmente (inicio ao fim) */
                    envInfo.results.value = envInfo.results.value.slice(startSlice, endSlice);
                }
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Printa ele na tela */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores gerados pela envInfo */
    return logging.postResults(envInfo);
}

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
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.create]: { value: createArrayNumber },
        [envInfo.exports.extract]: { value: getRandomValue },
        [envInfo.exports.make]: { value: makeArray },
        [envInfo.exports.sort]: { value: aleatorizeArray },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
