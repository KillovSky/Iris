/* Requires */
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const isNumeric = /^-?[0-9]+$/;
const isURL = /(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|(www\.)?){1}([0-9A-Za-z-.@:%_+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/i;

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

/* Função que corrige o replace de variaveis */
function replaceSystem(objt, match, key) {
    /* Define as keys */
    const parsedKeys = key.split('.');

    /* Faz o parse */
    const netterValue = parsedKeys.reduce((result, onmed, idlen) => {
        /* Define o resultado */
        const resRed = result[onmed] ?? 'N/A';

        /* Formata a Array, une e retorna */
        if (Array.isArray(resRed)) return resRed.map((val, idx) => `*${idx}.* _'${val}'_\n`).join('');

        /* Se for Object */
        if (typeof resRed === 'object' && resRed !== null && !!resRed && parsedKeys.length === idlen + 1) {
            /* Retorna uma String formatada com Object e join */
            return Object.keys(resRed).map((val, idx) => {
                /* Se for Obj-in-Obj */
                if (typeof resRed[val] === 'object' && resRed[val] !== null && !!resRed[val]) {
                    /* Retorna a OIB com join */
                    return Object.keys(resRed[val]).map((dat) => {
                        /* Se for outra Object-in-Object */
                        if (typeof resRed[val][dat] === 'object' && resRed[val][dat] !== null && !!resRed[val][dat]) {
                            /* Retorna outra OIB com join */
                            return Object.keys(resRed[val][dat]).map((fns) => {
                                /* Se for outra Object-in-Object */
                                /* eslint-disable-next-line max-len */
                                if (typeof resRed[val][dat][fns] === 'object' && resRed[val][dat][fns] !== null && !!resRed[val][dat][fns]) {
                                    /* Retorna outra OIB com join */
                                    return Object.keys(resRed[val][dat][fns]).map((ttd) => `\n*${idx}.* _⟶ '${onmed}' → '${val}' → '${dat}' → '${fns}' → '${ttd}' →_ *'${resRed[val][dat][fns][ttd]}'*`).join('');
                                }

                                /* Retorna a OIB padrão */
                                return `\n*${idx}.* _⟶ '${onmed}' → '${val}' → '${dat}' → '${fns}' →_ → *'${resRed[val][dat][fns]}'*`;
                            }).join('');
                        }

                        /* Retorna a OIO padrão */
                        return `\n*${idx}.* _⟶ '${onmed}' → '${val}' → '${dat}' →_ *'${resRed[val][dat]}'*`;
                    }).join('');
                }

                /* Se não, retorna a Object padrão */
                return `\n*${idx}.* _⟶ '${onmed}' → '${val}' →_ *'${resRed[val]}'*`;
            }).join('');
        }

        /* Retorna a key */
        return resRed;

        /* Faz a finalização e adiciona a object raiz */
    }, objt);

    /* Retorna se o valor não for null/undefined */
    if (netterValue != null) return netterValue;

    /* Retorna '?' por padrão */
    return '?';
}

/* Função que faz o preenchimento */
function drawScale(
    imageData = envInfo.functions.scale.arguments.imageData.value,
    widthVal = envInfo.functions.scale.arguments.widthVal.value,
    heightVal = envInfo.functions.scale.arguments.heightVal.value,
    topLeftWidth = envInfo.functions.scale.arguments.topLeftWidth.value,
    topLeftHeight = envInfo.functions.scale.arguments.topLeftHeight.value,
    context = envInfo.functions.scale.arguments.context.value,
    typer = envInfo.functions.scale.arguments.typer.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = context;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Caso tudo seja false */
        const conditions = (

            /* Verifica se é um tipo de Object */
            imageData instanceof Object
            && context instanceof Object

            /* Verifica se é um número */
            && isNumeric.test(widthVal)
            && isNumeric.test(heightVal)
            && isNumeric.test(topLeftHeight)
            && isNumeric.test(topLeftWidth)

            /* Verifica se é uma String */
            && typeof typer === 'string'
        );

        /* Caso as condições estejam corretas */
        if (conditions === true) {
            /* Define a Scale */
            const scale = Math[typer](widthVal / imageData.width, heightVal / imageData.height);

            /* 'Desenha' a imagem seguindo os parâmetros acima */
            context.drawImage(

                /* Define a escala */
                scale,

                /* Define o Width apropriado */
                ((widthVal / 2) - (imageData.width / 2) * scale) + topLeftWidth,

                /* Define o Height apropriado */
                ((heightVal / 2) - (imageData.height / 2) * scale) + topLeftHeight,

                /* Define o Width Scale */
                imageData.width * scale,

                /* Define o Height Scale */
                imageData.height * scale,
            );

            /* Define um resultado novamente, embora não seja preciso... */
            envInfo.results.value = context;
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

/* Faz o Blur de uma imagem */
async function blurImage(
    imageBuffer = envInfo.functions.blur.arguments.imageBuffer.value,
    blurL = envInfo.functions.blur.arguments.blurL.value,
    brightL = envInfo.functions.blur.arguments.brightL.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = Buffer.from(envInfo.parameters.buffer.value);

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se é um Buffer */
        if (imageBuffer instanceof Buffer) {
            /* Define o brilho padrão */
            let brightLevel = 0.5;

            /* Define o brilho padrão */
            let blurLevel = 5;

            /* Verifica se os valores são válidos */
            if (isNumeric.test(blurL)) {
                /* Ajusta o nível de blur */
                blurLevel = Number(blurL);
            }

            /* Verifica se os valores são válidos */
            if (isNumeric.test(brightL)) {
                /* Ajusta o nível de blur */
                brightLevel = Number(brightL);
            }

            /* Edita a imagem e adquire o Buffer */
            envInfo.results.value = (await sharp(imageBuffer)

                /* Adiciona BLUR de fundo */
                .blur(blurLevel)

                /* Faz modulação */
                .modulate({

                    /* Define um novo nível de brilho */
                    brightness: brightLevel,
                })

                /* Transforma em Buffer */
                .toBuffer()
            );
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

/* Adquire o Buffer de uma URL */
async function getBuffer(
    imageURL = envInfo.functions.buffer.arguments.imageURL.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = Buffer.from(envInfo.parameters.buffer.value);

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se a URL é válida */
        if (isURL.test(imageURL)) {
            /* Faz a requisição do URL */
            const arrbuff = await axios.get(imageURL, {

                /* Em ArrayBuffer */
                responseType: 'arraybuffer',
            });

            /* Converte para Buffer */
            envInfo.results.value = Buffer.from(arrbuff.data, 'utf-8');
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

/* Faz a função esperar "x" tempo antes de avançar */
async function sleep(
    miliscds = envInfo.functions.sleep.arguments.miliscds.value,
) {
    /* Define um resultado padrão | MS */
    envInfo.results.value = miliscds;

    /* Verifica se o valor não é número */
    if (!isNumeric.test(miliscds)) {
        /* Define uma espera padrão */
        envInfo.results.value = envInfo.functions.sleep.arguments.miliscds.value;
    }

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Faz a função esperar o tempo antes de retornar resolve */
        await new Promise((resolve) => {
            /* Espera a função finalizar */
            setTimeout(resolve, envInfo.results.value);
        });

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

/* Transforma o grupo num tipo de seletor por números */
function createList(
    chatIDs = envInfo.functions.list.arguments.chatIDs.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = {};

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Caso o ChatIDs seja válido */
        if (chatIDs instanceof Array) {
            /* Formata Chat por Chat */
            envInfo.results.value = chatIDs.map((val, idx) => (
                /* Retorna uma Object indexada com os valores */
                {
                    [idx]: {
                        id: (val?.id ?? idx),
                        name: (val?.name ?? 'unknown'),
                    },
                }
            ));

            /* Transforma em Object */
            envInfo.results.value = Object.assign({}, ...envInfo.results.value);
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

        /* Insere a drawScale na envInfo */
        envInfo.functions.scale.value = drawScale;

        /* Insere a blurImage na envInfo */
        envInfo.functions.blur.value = blurImage;

        /* Insere a getBuffer na envInfo */
        envInfo.functions.buffer.value = getBuffer;

        /* Insere a sleep na envInfo */
        envInfo.functions.sleep.value = sleep;

        /* Insere a createList na envInfo */
        envInfo.functions.list.value = createList;

        /* Insere a replaceSystem na envInfo */
        envInfo.functions.repl.value = replaceSystem;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.scale]: envInfo.functions.scale.value,
                [envInfo.exports.blur]: envInfo.functions.blur.value,
                [envInfo.exports.buffer]: envInfo.functions.buffer.value,
                [envInfo.exports.sleep]: envInfo.functions.sleep.value,
                [envInfo.exports.list]: envInfo.functions.list.value,
                [envInfo.exports.repl]: envInfo.functions.repl.value,
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
