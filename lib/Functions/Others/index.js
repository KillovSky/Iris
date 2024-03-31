/* eslint-disable max-len */
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

/* Define se a URL existe */
async function urlExists(
    url = envInfo.functions.urlexist.arguments.url.value,
) {
    /* Define um resultado padrão */
    envInfo.results.success = false;
    envInfo.results.value = false;

    /* Se der erro no request */
    try {
        /* Verifica se é uma string */
        if (typeof url === 'string') {
            /* Adquire a resposta do axios */
            const response = await axios.head(url);

            /* Se for diferente de 4**, existe, logo true */
            envInfo.results.value = !/4\d\d/.test(response.status);
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se deu erro */
    } catch (error) { /* Faz nada */ }

    /* Retorna os resultados */
    return postResults(envInfo.results);
}

/* Função que pega uma patente, sem envInfo, pois é muito pequena e não dará erros por padrão */
function getPatent(
    level = envInfo.functions.patent.arguments.level.value,
    patents = envInfo.functions.patent.arguments.patents.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = patents['0'];

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Define o nível */
    let leveler = typeof level === 'string' || typeof level === 'number' ? level : 500;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (/[0-9]+/gi.test(leveler) && typeof patents === 'object') {
            /* Se o level for acima de 500, define como a patente mais alta */
            leveler = leveler > 500 ? 500 : leveler;

            /* Encontre o nível adequado usando a lógica */
            const nivel = Object.keys(patents).find((n) => Number(leveler) <= Number(n));

            /* Insere o resultado na envInfo para retornar tudo */
            envInfo.results.value = patents[nivel || '0'];
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os resultados */
    return postResults(envInfo.results);
}

/* Função que corrige o replace de variáveis */
function replaceSystem(obj, match, key) {
    /* Define as keys */
    const parsedKeys = key.split('.');

    /* Faz o parse */
    const netterValue = parsedKeys.reduce((result, onmed, idlen) => {
        /* Define o resultado */
        const resRed = result[onmed] ?? 'N/A';

        /* Formata a Array, une e retorna */
        if (Array.isArray(resRed)) return resRed.map((val, idx) => `> *${idx}.* _'${val}'_\n`).join('');

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
                                if (typeof resRed[val][dat][fns] === 'object' && resRed[val][dat][fns] !== null && !!resRed[val][dat][fns]) {
                                    /* Retorna outra OIB com join */
                                    return Object.keys(resRed[val][dat][fns]).map((ttd) => `\n> *${idx}.* _⟶ '${onmed}' → '${val}' → '${dat}' → '${fns}' → '${ttd}' →_ *'${resRed[val][dat][fns][ttd]}'*`).join('');
                                }

                                /* Retorna a OIB padrão */
                                return `\n> *${idx}.* _⟶ '${onmed}' → '${val}' → '${dat}' → '${fns}' →_ → *'${resRed[val][dat][fns]}'*`;
                            }).join('');
                        }

                        /* Retorna a OIO padrão */
                        return `\n> *${idx}.* _⟶ '${onmed}' → '${val}' → '${dat}' →_ *'${resRed[val][dat]}'*`;
                    }).join('');
                }

                /* Se não, retorna a Object padrão */
                return `\n> *${idx}.* _⟶ '${onmed}' → '${val}' →_ *'${resRed[val]}'*`;
            }).join('');
        }

        /* Retorna a key */
        return resRed;
    }, obj);

    /* Retorna se o valor não for null/undefined */
    if (netterValue != null) return netterValue;

    /* Retorna '?' por padrão */
    return '?';
}

/* Função base para a findProperty, NÃO DEFINA NA ENV */
function locateObjectKey(obj, keys, types, ignores) {
    /* Define o resultado padrão */
    let keyInObject = false;

    /* Busca a partir de um loop */
    Object.keys(obj).some((prop) => {
        /* Se já tiver achado o valor */
        if (!keyInObject) {
            /* Se a object já for o valor requisitado */
            if (keys.includes(prop) && types.includes(typeof obj[prop]) && !ignores.includes(prop)) {
                /* Retorna a Object */
                keyInObject = obj[prop];

                /* Verifica se é um objeto */
            } else if (typeof obj[prop] === 'object' && !ignores.includes(prop)) {
                /* Executa novamente com o novo objeto */
                keyInObject = locateObjectKey(obj[prop], keys, types, ignores);
            }
        }

        /* Retorna o encontrado */
        return keyInObject;
    });

    /* Retorna o que foi encontrado */
    return keyInObject;
}

/* Função para filtrar a chave de um objeto */
function findProperty(
    myObject = envInfo.functions.findkey.arguments.myObject.value,
    findKey = envInfo.functions.findkey.arguments.findKey.value,
    typeKey = envInfo.functions.findkey.arguments.typeKey.value,
    ignoreKeys = envInfo.functions.ignoreKeys.arguments.typeKey.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para lidar com possíveis erros */
    try {
        /* Executa apenas se os tipos estiverem corretos */
        if (typeof myObject === 'object' && Array.isArray(findKey) && Array.isArray(typeKey) && Array.isArray(ignoreKeys)) {
            /* Verifica se o objeto tem a chave desejada */
            envInfo.results.value = locateObjectKey(myObject, findKey, typeKey, ignoreKeys);
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
            /* Adiciona blur, faz modulação com nivel de brilho e finalmente converte em buffer */
            envInfo.results.value = await sharp(imageBuffer).blur(blurLevel).modulate({ brightness: brightLevel }).toBuffer();
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
            const response = await axios.get(imageURL, {
                /* Em ArrayBuffer */
                responseType: 'arraybuffer',
            });

            /* Converte para Buffer */
            envInfo.results.value = Buffer.from(response.data, 'utf-8');
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
    /* Cria uma cópia do objeto original */
    const defObject = { ...obj };

    /* Itera sobre as chaves do objeto */
    Object.keys(defObject).forEach((objkey) => {
        /* Se tiver e for string */
        if (typeof defObject[objkey] === 'string') {
            /* Substitui o texto */
            defObject[objkey] = defObject[objkey].replace(ftext, ntext).replace(new RegExp(ftext, 'gi'), ntext);

            /* Se não, mas for um objeto, continua a busca */
        } else if (typeof defObject[objkey] === 'object') {
            /* Enviando ela para rodar novamente a função */
            defObject[objkey] = replaceText(defObject[objkey], ftext, ntext);
        }
    });

    /* Retorna o objeto modificado */
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
    miliseconds = envInfo.functions.sleep.arguments.miliseconds.value,
) {
    /* Define um resultado padrão | MS */
    envInfo.results.value = miliseconds;

    /* Verifica se o valor não é número */
    if (!isNumeric.test(miliseconds)) {
        /* Define uma espera padrão */
        envInfo.results.value = envInfo.functions.sleep.arguments.miliseconds.value;
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
        if (Array.isArray(chatIDs)) {
            /* Formata Chat por Chat */
            envInfo.results.value = chatIDs.map((val, idx) => (
                /* Retorna um objeto indexado com os valores */
                {
                    [idx]: {
                        id: val?.id ?? idx,
                        name: val?.name ?? 'unknown',
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

        /* Insere a getPatent na envInfo */
        envInfo.functions.patent.value = getPatent;

        /* Insere a replaceInAll na envInfo */
        envInfo.functions.farpc.value = replaceInAll;

        /* Insere a urlExists na envInfo */
        envInfo.functions.urlexists.value = urlExists;

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
                [envInfo.exports.patent]: envInfo.functions.patent.value,
                [envInfo.exports.repl]: envInfo.functions.repl.value,
                [envInfo.exports.findkey]: envInfo.functions.findkey.value,
                [envInfo.exports.urlexists]: envInfo.functions.urlexists.value,
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
