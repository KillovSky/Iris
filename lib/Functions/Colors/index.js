/* Requires */
const path = require('path');
const fs = require('fs');

/* JSON */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Cores ANSI | https://www.npmjs.com/package/colors */
const colors = {
    reset: ['\x1B[0m', '\x1B[0m'],
    bold: ['\x1B[1m', '\x1B[22m'],
    dim: ['\x1B[2m', '\x1B[22m'],
    italic: ['\x1B[3m', '\x1B[23m'],
    underline: ['\x1B[4m', '\x1B[24m'],
    inverse: ['\x1B[7m', '\x1B[27m'],
    hidden: ['\x1B[8m', '\x1B[28m'],
    strikethrough: ['\x1B[9m', '\x1B[29m'],
    black: ['\x1B[30m', '\x1B[39m'],
    red: ['\x1B[31m', '\x1B[39m'],
    green: ['\x1B[32m', '\x1B[39m'],
    yellow: ['\x1B[33m', '\x1B[39m'],
    blue: ['\x1B[34m', '\x1B[39m'],
    magenta: ['\x1B[35m', '\x1B[39m'],
    cyan: ['\x1B[36m', '\x1B[39m'],
    white: ['\x1B[37m', '\x1B[39m'],
    gray: ['\x1B[90m', '\x1B[39m'],
    grey: ['\x1B[90m', '\x1B[39m'],
    brightRed: ['\x1B[91m', '\x1B[39m'],
    brightGreen: ['\x1B[92m', '\x1B[39m'],
    brightYellow: ['\x1B[93m', '\x1B[39m'],
    brightBlue: ['\x1B[94m', '\x1B[39m'],
    brightMagenta: ['\x1B[95m', '\x1B[39m'],
    brightCyan: ['\x1B[96m', '\x1B[39m'],
    brightWhite: ['\x1B[97m', '\x1B[39m'],
    bgBlack: ['\x1B[40m', '\x1B[49m'],
    bgRed: ['\x1B[41m', '\x1B[49m'],
    bgGreen: ['\x1B[42m', '\x1B[49m'],
    bgYellow: ['\x1B[43m', '\x1B[49m'],
    bgBlue: ['\x1B[44m', '\x1B[49m'],
    bgMagenta: ['\x1B[45m', '\x1B[49m'],
    bgCyan: ['\x1B[46m', '\x1B[49m'],
    bgWhite: ['\x1B[47m', '\x1B[49m'],
    bgGray: ['\x1B[100m', '\x1B[49m'],
    bgGrey: ['\x1B[100m', '\x1B[49m'],
    bgBrightRed: ['\x1B[101m', '\x1B[49m'],
    bgBrightGreen: ['\x1B[102m', '\x1B[49m'],
    bgBrightYellow: ['\x1B[103m', '\x1B[49m'],
    bgBrightBlue: ['\x1B[104m', '\x1B[49m'],
    bgBrightMagenta: ['\x1B[105m', '\x1B[49m'],
    bgBrightCyan: ['\x1B[106m', '\x1B[49m'],
    bgBrightWhite: ['\x1B[107m', '\x1B[49m'],
    blackBG: ['\x1B[40m', '\x1B[49m'],
    redBG: ['\x1B[41m', '\x1B[49m'],
    greenBG: ['\x1B[42m', '\x1B[49m'],
    yellowBG: ['\x1B[43m', '\x1B[49m'],
    blueBG: ['\x1B[44m', '\x1B[49m'],
    magentaBG: ['\x1B[45m', '\x1B[49m'],
    cyanBG: ['\x1B[46m', '\x1B[49m'],
    whiteBG: ['\x1B[47m', '\x1B[49m'],
};

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Função que gera cores em HEX, sem envInfo por padrão, por ser uma função referenciada */
function generateHEX(
    repeatFun = envInfo.functions.genhex.arguments.repeatFun.value,
    stringSize = envInfo.functions.genhex.arguments.stringSize.value,
    isAnotherFun = envInfo.functions.genhex.arguments.isAnotherFun.value,
) {
    /* Define o valor padrão sem envInfo, caso seja outra função usando */
    const resultValue = [];

    /* Define o sucesso, sem envInfo também */
    let successUse = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define o tamanho do HEX a gerar */
        const HEXSize = (/^[0-9]+$/.test(stringSize)
            /* Como o enviado */
            ? stringSize

            /* Como padrão (6) */
            : envInfo.functions.genhex.arguments.stringSize.value
        );

        /* Define a quantidade de repetição */
        const repeatHEX = (/^[0-9]+$/.test(repeatFun)
            /* Como o enviado */
            ? repeatFun

            /* Como padrão (1) */
            : envInfo.functions.genhex.arguments.repeatFun.value
        );

        /* Gera a quantidade requisitada, sem duplicados */
        for (let i = 0; i < Number(repeatHEX); i += 1) {
            /* Cria o resultado / Cria uma Array com 'x' tamanho */
            const defColors = (Array(Number(HEXSize))
                /* Preenche a Array com null's */
                .fill()

                /* Gera a letra/número de HEX via map (base16) */
                .map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase())

                /* Junta tudo */
                .join('')
            );

            /* Verifica se é valor duplicado */
            if (resultValue.includes(`#${defColors}`)) {
                /* Diminui o 'i' em 1, para a contagem continuar exata */
                i -= 1;
            }

            /* Faz o push do HEX */
            resultValue.push(`#${defColors}`);
        }

        /* Define o sucesso */
        successUse = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Se não for uma forma de uso referenciada */
        if (isAnotherFun === false) {
            /* Printa o erro na envInfo */
            logging.echoError(error, envInfo, __dirname);

            /* Se não printa direto para não afetar a envInfo */
        } else console.log(error);
    }

    /* Caso nenhum resultado válido exista */
    if (resultValue.length === 0) {
        /* Insere um HEX padrão */
        resultValue.push('#ffffff');
    }

    /* Define na envInfo se não for uma forma de uso referenciada */
    if (isAnotherFun === false) {
        /* Define o result */
        envInfo.results.value = resultValue;

        /* Define o sucesso */
        envInfo.results.success = successUse;

        /* Retorna com postResults */
        return logging.postResults(envInfo);
    }

    /* Retorna as cores HEX sem postResults */
    return resultValue;
}

/* Gera um RGB aleatório */
function generateRGB(
    amountGen = envInfo.functions.genrgb.arguments.amountGen.value,
    isSubFun = envInfo.functions.genrgb.arguments.isSubFun.value,
) {
    /* Define o valor padrão sem envInfo, caso seja outra função usando */
    const endedValues = [];

    /* Define o sucesso, sem envInfo também */
    let okayUsage = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define a quantidade de repetição */
        const amountRGB = (/^[0-9]+$/.test(amountGen)
            /* Como o enviado */
            ? amountGen

            /* Como padrão (1) */
            : envInfo.functions.genrgb.arguments.amountGen.value
        );

        /* Gera a quantidade requisitada, sem duplicados */
        for (let v = 0; v < Number(amountRGB); v += 1) {
            /* Cria o resultado / Cria uma Array com 'x' tamanho */
            const rgbValue = (Array(3)
                /* Preenche a Array */
                .fill()

                /* Gera o valor do Red, Green e Blue, sem Alpha, senão seria RGBA */
                .map(() => Math.floor(Math.random() * 256))

                /* Junta tudo */
                .join(',')
            );

            /* Verifica se é valor duplicado */
            if (endedValues.includes(`rgb(${rgbValue})`)) {
                /* Diminui o 'v' em 1, para a contagem continuar exata */
                v -= 1;
            }

            /* Faz o push do RGB */
            endedValues.push(`rgb(${rgbValue})`);
        }

        /* Define o sucesso */
        okayUsage = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Se não for uma forma de uso referenciada */
        if (isSubFun === false) {
            /* Printa o erro na envInfo */
            logging.echoError(error, envInfo, __dirname);

            /* Se não printa direto para não afetar a envInfo */
        } else console.log(error);
    }

    /* Corrige os resultados, se não tiver nenhum */
    if (endedValues.length === 0) {
        /* Insere um RGB */
        endedValues.push('rgb(0,0,0)');
    }

    /* Define na envInfo se não for uma função referenciada */
    if (isSubFun === false) {
        /* Define o result */
        envInfo.results.value = endedValues;

        /* Define o sucesso */
        envInfo.results.success = okayUsage;

        /* Retorna com postResults */
        return logging.postResults(envInfo);
    }

    /* Retorna as cores RGB sem postResults */
    return endedValues;
}

/* Checa se a cor usada é um HEX */
function isHEX(
    recColor = envInfo.functions.ishex.arguments.recColor.value,
) {
    /* Define o valor padrão */
    envInfo.results.value = {
        found: false,
        hex: generateHEX(3, 6, true),
    };

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se o parâmetro é válido */
        if (typeof recColor === 'string') {
            /* Define a RegExp */
            const colorReg = envInfo.parameters.colorexp.value.hex;

            /* Verifica se é uma HEX */
            if (RegExp(colorReg.regex, colorReg.flag).test(recColor)) {
                /* Define como achado */
                envInfo.results.value.found = true;

                /* Define a cor para retornar */
                envInfo.results.value.hex = ([recColor]
                    /* Insere as cores já geradas na frente */
                    .concat(envInfo.results.value.hex)

                    /* Mescla arrays dentro de arrays */
                    .flat()
                );
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os dados */
    return logging.postResults(envInfo);
}

/* Converte HEX para RGB */
function convertToRGB(
    colorHEX = envInfo.functions.torgb.arguments.colorHEX.value,
) {
    /* Define o RGB padrão */
    envInfo.results.value = [...generateRGB(3, true)];

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se o parâmetro é válido */
        if (typeof colorHEX === 'string') {
            /* Define a RegExp */
            const colorReg = envInfo.parameters.colorexp.value.rgb;

            /* Faz um parse com o HEX */
            const parsedRGB = RegExp(colorReg.regex, colorReg.flag).exec(colorHEX);

            /* Verifica se o resultado é válido */
            if (parsedRGB instanceof Array) {
                /* Obtém os valores RGB da string e converte para formato RGB */
                const rgbValues = (parsedRGB
                    .slice(1, 4)
                    .map((rgb) => parseInt(rgb, 16))
                );

                /* Adiciona a cor gerada na frente da array */
                envInfo.results.value = [`rgb(${rgbValues.join(',')})`, ...envInfo.results.value];
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os dados */
    return logging.postResults(envInfo);
}

/* Da a cor as mensagens do terminal, sem envInfo por ser referenciada */
function printConsole(
    textMessage = envInfo.functions.echo.arguments.textMessage.value,
    colorEcho = envInfo.functions.echo.arguments.colorEcho.value,
    isThirdFun = envInfo.functions.echo.arguments.isThirdFun.value,
) {
    /* Define o resultado padrão sem envInfo, por hora */
    let printerText = `\x1b[31m[${path.basename(__dirname)}]\x1B[39m → \x1b[33mThe operation cannot be completed because no text has been sent.\x1B[39m`;

    /* Define o sucesso */
    let printerSuc = false;

    /* Define a cor a usar */
    let colorRain = colors.green;

    /* Try-Catch para casos de erro */
    try {
        /* Caso não envie um texto será ignorado */
        if (typeof textMessage === 'string') {
            /* Verifica se a cor enviada é válida */
            if (Object.keys(colors).includes(colorEcho)) {
                /* Ajusta novamente a cor */
                colorRain = colors[colorEcho];
            }

            /* Define o texto que vai printar com as cores ideais */
            printerText = `${colorRain[0]}${textMessage}${colorRain[1]}`;
        }

        /* Define o sucesso */
        printerSuc = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Se não for uma forma de uso referenciada */
        if (isThirdFun === false) {
            /* Printa o erro na envInfo */
            logging.echoError(error, envInfo, __dirname);

            /* Se não printa direto para não afetar a envInfo */
        } else console.log(error);
    }

    /* Define na envInfo se não for uma forma de uso referenciada */
    if (isThirdFun === false) {
        /* Define o result */
        envInfo.results.value = printerText;

        /* Define o sucesso */
        envInfo.results.success = printerSuc;

        /* Retorna com postResults */
        return logging.postResults(envInfo);
    }

    /* Retorna a mensagem com cores via postResults */
    return printerText;
}

/* Informa erros no console de forma humanizada */
function reportConsole(
    failError = envInfo.functions.report.arguments.failError.value,
    errorCommand = envInfo.functions.report.arguments.errorCommand.value,
) {
    /* Define o resultado padrão */
    envInfo.results.value = `\x1b[31m[${path.basename(__dirname)}]\x1B[39m → \x1b[33mThe operation cannot be completed because no text has been sent.\x1B[39m`;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se a falha enviada é válida */
        if (failError instanceof Error) {
            /* Define o pretexto */
            const preEcho = `[${errorCommand.toUpperCase()}]`;

            /* Define o erro */
            const errorEcho = `Obtive o seguinte erro → "${failError.message}"`;

            /* Define a mensagem inteira */
            envInfo.results.value = `${printConsole(preEcho, 'red', true)} → ${printConsole(errorEcho, 'yellow', true)}`;
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a mensagem no console */
    console.log(envInfo.results.value);

    /* Retorna os dados */
    return logging.postResults(envInfo);
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
        envInfo.functions.poswork.value = logging.postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a generateHEX na envInfo */
        envInfo.functions.genhex.value = generateHEX;

        /* Insere a isHEX na envInfo */
        envInfo.functions.ishex.value = isHEX;

        /* Insere a generateRGB na envInfo */
        envInfo.functions.genrgb.value = generateRGB;

        /* Insere a convertToRGB na envInfo */
        envInfo.functions.torgb.value = convertToRGB;

        /* Insere a printConsole na envInfo */
        envInfo.functions.echo.value = printConsole;

        /* Insere a report na envInfo */
        envInfo.functions.report.value = reportConsole;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.genhex]: envInfo.functions.genhex.value,
                [envInfo.exports.ishex]: envInfo.functions.ishex.value,
                [envInfo.exports.genrgb]: envInfo.functions.genrgb.value,
                [envInfo.exports.torgb]: envInfo.functions.torgb.value,
                [envInfo.exports.echo]: envInfo.functions.echo.value,
                [envInfo.exports.report]: envInfo.functions.report.value,
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
