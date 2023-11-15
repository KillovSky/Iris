/* Requires */
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Indexer = require('../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const isNumeric = /^-?[0-9]+$/;

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

/* Função base para a findProperty, NÃO DEFINA NA ENV */
function locateObjectKey(obj, keys, types) {
    /* Define o resultado padrão */
    let keyinobject = false;

    /* Busca a partir de um loop */
    Object.keys(obj).forEach((prop) => {
        /* Se já tiver achado o valor */
        if (keyinobject === false) {
            /* Verifica se é um objeto */
            if (typeof obj[prop] === 'object') {
                /* Executa novamente com a nova objeto */
                keyinobject = locateObjectKey(obj[prop], keys, types);

                /* Se não for, verifica se a objeto atual tem a chave */
            } else if (keys.includes(prop)) {
                /* Se for do tipo desejado */
                if (types.includes(typeof obj[prop])) {
                    /* Se sim, retorna o valor da chave */
                    keyinobject = obj[prop];
                }
            }
        }
    });

    /* Retorna o que foi encontrado */
    return keyinobject;
}

/* Função para filtrar a chave de um objeto */
function findProperty(
    myObject = envInfo.functions.findkey.arguments.myObject.value,
    findKey = envInfo.functions.findkey.arguments.findKey.value,
    typeKey = envInfo.functions.findkey.arguments.typeKey.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para lidar com possíveis erros */
    try {
        /* Executa apenas se os tipos estiverem corretos */
        if (typeof myObject === 'object' && Array.isArray(findKey) && Array.isArray(typeKey)) {
            /* Verifica se o objeto tem a chave desejada */
            envInfo.results.value = locateObjectKey(myObject, findKey, typeKey);
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Em caso de erro, captura e registra no envInfo */
    } catch (error) {
        /* Registra o erro no envInfo */
        echoError(error);
    }

    /* Retorna o novo valor */
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
        if (Indexer('regexp').urls(imageURL).value.isURL) {
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

/* Define uma mini função para buscar o objeto, NÃO DEFINA NA ENV */
function replaceText(obj, ftext, ntext) {
    /* Define a Object padrão */
    const defObject = obj;

    /* Itera sobre as chaves do objeto */
    Object.keys(obj).forEach((objkey) => {
        /* Se tiver e for string */
        if (typeof obj[objkey] === 'string') {
            /* Substitui o texto */
            defObject[objkey] = obj[objkey].replace(ftext, ntext).replace(new RegExp(ftext, 'gi'), ntext);

            /* Se não */
        } else if (typeof obj[objkey] === 'object') {
            /* Continua a busca se for um objeto ainda */
            replaceText(obj[objkey], ftext, ntext);
        }
    });

    /* Retorna a object */
    return defObject;
}

/* Faz a função esperar "x" tempo antes de avançar */
function replaceInAll(
    myObject = envInfo.functions.replaceInAll.arguments.myObject.value,
    findText = envInfo.functions.replaceInAll.arguments.findText.value,
    newText = envInfo.functions.replaceInAll.arguments.newText.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = myObject;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Inicia o processo e define o valor */
        envInfo.results.value = replaceText(myObject, findText, newText);

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

        /* Insere a blurImage na envInfo */
        envInfo.functions.blur.value = blurImage;

        /* Insere a getBuffer na envInfo */
        envInfo.functions.buffer.value = getBuffer;

        /* Insere a replaceInAll na envInfo */
        envInfo.functions.farpc.value = replaceInAll;

        /* Insere a findProperty na envInfo */
        envInfo.functions.findkey.value = findProperty;

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
                [envInfo.exports.farpc]: envInfo.functions.farpc.value,
                [envInfo.exports.blur]: envInfo.functions.blur.value,
                [envInfo.exports.buffer]: envInfo.functions.buffer.value,
                [envInfo.exports.sleep]: envInfo.functions.sleep.value,
                [envInfo.exports.list]: envInfo.functions.list.value,
                [envInfo.exports.repl]: envInfo.functions.repl.value,
                [envInfo.exports.findkey]: envInfo.functions.findkey.value,
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
