/* eslint-disable max-len */
/* Requires */
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const Indexer = require('../../index');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const isNumeric = /^-?[0-9]+$/;

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
 * Realiza um merge profundo (deep merge) entre dois objetos, combinando propriedades recursivamente.
 *
 * @param {Object} target - O objeto destino que receberá as propriedades mescladas.
 * @param {Object} source - O objeto fonte de onde as propriedades serão copiadas.
 * @returns {Object} O objeto target modificado com as propriedades mescladas.
 *
 * @example
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { b: { d: 3 }, e: 4 };
 * deepMerge(obj1, obj2);
 * // Resultado: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *
 * @description
 * Esta função percorre todas as propriedades do objeto source e:
 * 1. Se a propriedade é um objeto (não array) em ambos target e source, faz merge recursivo
 * 2. Caso contrário, sobrescreve a propriedade no target com o valor do source
 *
 * Observação: Arrays e objetos especiais (como Date, RegExp) serão sobrescritos, não mesclados.
 */
function deepMerge(target, source) {
    /* Reseta o sucesso */
    envInfo.results.success = false;

    /* Define o valor padrão */
    envInfo.results.value = {
        date: true,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Cria uma cópia para evitar mutação direta do parâmetro */
        const result = { ...target };

        /* Inicia a iteração com os dados */
        Object.keys(source).forEach((key) => {
            /* Define ambos */
            const sourceValue = source[key];
            const targetValue = target[key];

            /* Se ambos são objetos e não são arrays, faz merge recursivo */
            if (sourceValue instanceof Object
                && !Array.isArray(sourceValue)
                && targetValue instanceof Object
                && !Array.isArray(targetValue)) {
                result[key] = deepMerge(targetValue, sourceValue);

                /* Caso contrário, simplesmente atribui o valor */
            } else result[key] = sourceValue;
        });

        /* Define o resultado e sucesso */
        envInfo.results.value = result;
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os resultados */
    return logging.postResults(envInfo);
}

/**
 * Converte e valida uma data (string ou timestamp) em um objeto padronizado.
 * @param {string|number} dateInput - Data como string (dd/mm/yy) ou timestamp.
 * @returns {Object} - Resultado com status, timestamp e formatos de data.
 */
function isValidDate(dateInput) {
    /* Inicializa o objeto de resultados */
    const result = {
        success: false,
        value: {
            date: false,
            toUnix: 0,
            formatted: {},
        },
    };

    /* Bloco try-catch para tratamento de erros */
    try {
        /* Declara variável para o objeto Date */
        let dateObj;

        /* Declara flag de validação */
        let isValid = false;

        /* Verifica se o input é um número (timestamp) */
        if (typeof dateInput === 'number') {
            /* Cria objeto Date diretamente do timestamp */
            dateObj = new Date(dateInput);

            /* Verifica se a data é válida */
            isValid = !Number.isNaN(dateObj.getTime());

            /* Verifica se o input é uma string (data formatada) */
        } else if (typeof dateInput === 'string') {
            /* Executa o teste de padrão na string */
            const match = dateInput.match(/^(\d{2})([/-])(\d{2})\2(\d{2,4})$/);

            /* Se o padrão for encontrado */
            if (match) {
                /* Extrai dia, separador, mês e ano da string */
                const [, day, , month, yearStr] = match;

                /* Converte para números */
                const dayNum = parseInt(day, 10);
                const monthNum = parseInt(month, 10) - 1; // Mês é 0-indexed no JS
                let yearNum = parseInt(yearStr, 10);

                /* Corrige anos com 2 dígitos (assume século 21 para 00-99) */
                if (yearStr.length === 2) {
                    yearNum = 2000 + yearNum;
                }

                /* Cria objeto Date usando o construtor com parâmetros separados */
                dateObj = new Date(yearNum, monthNum, dayNum);

                /* Verifica se a data é válida e corresponde aos valores de entrada */
                isValid = (!Number.isNaN(dateObj.getTime())
                    && dateObj.getDate() === dayNum
                    && dateObj.getMonth() === monthNum
                    && dateObj.getFullYear() === yearNum
                );
            }

            /* Se não for data válida ou não match no padrão */
            if (!isValid) {
                /* Usa data atual como fallback */
                dateObj = new Date();
            }
        }

        /* Se não for string nem número válido */
        if (!dateObj) {
            /* Cria objeto Date com data atual */
            dateObj = new Date();
        }

        /* Preenche os valores de resultado */
        result.value = {
            date: isValid,
            toUnix: Math.floor(dateObj.getTime() / 1000), /* Unix */
            toISOString: dateObj.toISOString(), /* Formato ISO */
            toUTCString: dateObj.toUTCString(), /* Formato UTC */
            toLocaleString: dateObj.toLocaleString(), /* Formato local */
            toDateString: dateObj.toDateString(), /* Data legível */
            toTimeString: dateObj.toTimeString(), /* Hora legível */
            toLocaleDateString: dateObj.toLocaleDateString(), /* Data local */
            toLocaleTimeString: dateObj.toLocaleTimeString(), /* Hora local */
        };

        /* Define o status de sucesso */
        result.success = isValid;

        /* Captura erros durante o processamento */
    } catch (error) {
        /* Loga o erro no console */
        console.error('Erro ao processar data:', error);

        /* Cria objeto Date atual para fallback */
        const now = new Date();

        /* Preenche os valores de resultado com fallback */
        result.value = {
            date: false,
            toUnix: Date.now(), /* Timestamp atual */
            toISOString: now.toISOString(), /* Formato ISO */
            toUTCString: now.toUTCString(), /* Formato UTC */
            toLocaleString: now.toLocaleString(), /* Formato local */
            toDateString: now.toDateString(), /* Data legível */
            toTimeString: now.toTimeString(), /* Hora legível */
            toLocaleDateString: now.toLocaleDateString(), /* Data local */
            toLocaleTimeString: now.toLocaleTimeString(), /* Hora local */
        };
    }

    /* Retorna o objeto de resultados */
    return result;
}

/**
 * Verifica se uma URL existe.
 * @async
 * @function urlExists
 * @param {string} [url=envInfo.functions.urlexist.arguments.url.value] - A URL a ser verificada.
 * @returns {Promise<boolean>} `true` se a URL existe, `false` caso contrário.
 */
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
    return logging.postResults(envInfo);
}

/**
 * Obtém uma patente com base no nível fornecido.
 * @function getPatent
 * @param {string|number} [level=envInfo.functions.patent.arguments.level.value] - O nível da patente.
 * @param {Object} [patents=envInfo.functions.patent.arguments.patents.value] - O objeto contendo as patentes disponíveis.
 * @returns {*} A patente correspondente ao nível ou a patente padrão (`patents['0']`).
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os resultados */
    return logging.postResults(envInfo);
}

/**
 * Função que corrige o replace de variáveis em um objeto.
 * @function replaceSystem
 * @param {Object} obj - O objeto onde a substituição será realizada.
 * @param {string} match - O padrão de correspondência para substituição.
 * @param {string} key - A chave para localizar o valor no objeto.
 * @returns {string} O valor substituído ou '?' se não encontrado.
 */
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

/**
 * Função base para localizar uma chave em um objeto.
 * @function locateObjectKey
 * @param {Object} obj - O objeto onde a chave será buscada.
 * @param {Array<string>} keys - As chaves a serem localizadas.
 * @param {Array<string>} types - Os tipos de dados permitidos para os valores.
 * @param {Array<string>} ignores - As chaves a serem ignoradas.
 * @param {number} [depth=0] - A profundidade atual da busca.
 * @param {Set} [visited=new Set()] - Conjunto de objetos já visitados para evitar referências circulares.
 * @returns {*} O valor da chave encontrada ou `false` se não encontrado.
 */
function locateObjectKey(obj, keys, types, ignores, depth = 0, visited = new Set()) {
    /* Define o resultado padrão */
    let keyInObject = false;

    /* Verifica se a profundidade máxima foi atingida ou se é circular */
    if (depth > 100 || visited.has(obj)) return keyInObject;

    /* Marca o objeto como visitado */
    visited.add(obj);

    /* Busca a partir de um loop */
    Object.keys(obj).some((prop) => {
        /* Se já tiver achado o valor */
        if (!keyInObject) {
            /* Se a propriedade já for o valor requisitado */
            if (keys.includes(prop) && types.includes(typeof obj[prop]) && !ignores.includes(prop)) {
                /* Retorna o valor da propriedade */
                keyInObject = obj[prop];

                /* Verifica se é um objeto */
            } else if (typeof obj[prop] === 'object' && obj[prop] !== null && !ignores.includes(prop)) {
                /* Executa novamente com o novo objeto */
                keyInObject = locateObjectKey(obj[prop], keys, types, ignores, depth + 1, visited);
            }
        }

        /* Retorna se o valor foi encontrado */
        return keyInObject;
    });

    /* Retorna o que foi encontrado */
    return keyInObject;
}

/**
 * Função para filtrar a chave de um objeto.
 * @function findProperty
 * @param {Object} [myObject=envInfo.functions.findkey.arguments.myObject.value] - O objeto onde a chave será buscada.
 * @param {Array<string>} [findKey=envInfo.functions.findkey.arguments.findKey.value] - As chaves a serem localizadas.
 * @param {Array<string>} [typeKey=envInfo.functions.findkey.arguments.typeKey.value] - Os tipos de dados permitidos para os valores.
 * @param {Array<string>} [ignoreKeys=envInfo.functions.ignoreKeys.arguments.typeKey.value] - As chaves a serem ignoradas.
 * @returns {*} O valor da chave encontrada ou `false` se não encontrado.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o novo valor */
    return logging.postResults(envInfo);
}

/**
 * Aplica um efeito de blur e ajusta o brilho em uma imagem.
 * @async
 * @function blurImage
 * @param {Buffer} [imageBuffer=envInfo.functions.blur.arguments.imageBuffer.value] - O buffer da imagem.
 * @param {number} [blurL=envInfo.functions.blur.arguments.blurL.value] - O nível de blur a ser aplicado.
 * @param {number} [brightL=envInfo.functions.blur.arguments.brightL.value] - O nível de brilho a ser ajustado.
 * @returns {Promise<Buffer>} O buffer da imagem com os efeitos aplicados.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

/**
 * Adquire o Buffer de uma URL.
 * @async
 * @function getBuffer
 * @param {string} [imageURL=envInfo.functions.buffer.arguments.imageURL.value] - A URL da imagem.
 * @returns {Promise<Buffer>} O buffer da imagem.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

/**
 * Substitui texto em um objeto.
 * @function replaceText
 * @param {Object} obj - O objeto onde o texto será substituído.
 * @param {string} ftext - O texto a ser substituído.
 * @param {string} ntext - O novo texto.
 * @returns {Object} O objeto com o texto substituído.
 */
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

/**
 * Substitui texto em todas as ocorrências dentro de um objeto.
 * @function replaceInAll
 * @param {Object} [myObject=envInfo.functions.replaceInAll.arguments.myObject.value] - O objeto onde o texto será substituído.
 * @param {string} [findText=envInfo.functions.replaceInAll.arguments.findText.value] - O texto a ser substituído.
 * @param {string} [newText=envInfo.functions.replaceInAll.arguments.newText.value] - O novo texto.
 * @returns {Object} O objeto com o texto substituído.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

/**
 * Faz a função esperar "x" tempo antes de avançar.
 * @async
 * @function sleep
 * @param {number} [miliseconds=envInfo.functions.sleep.arguments.miliseconds.value] - O tempo de espera em milissegundos.
 * @returns {Promise<number>} O tempo de espera em milissegundos.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

/**
 * Transforma o grupo num tipo de seletor por números.
 * @function createList
 * @param {Array} [chatIDs=envInfo.functions.list.arguments.chatIDs.value] - A lista de IDs de chat.
 * @returns {Object} Um objeto indexado com os valores dos chats.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
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
        [envInfo.exports.farpc]: { value: replaceInAll },
        [envInfo.exports.blur]: { value: blurImage },
        [envInfo.exports.buffer]: { value: getBuffer },
        [envInfo.exports.merge]: { value: deepMerge },
        [envInfo.exports.sleep]: { value: sleep },
        [envInfo.exports.list]: { value: createList },
        [envInfo.exports.date]: { value: isValidDate },
        [envInfo.exports.patent]: { value: getPatent },
        [envInfo.exports.repl]: { value: replaceSystem },
        [envInfo.exports.findkey]: { value: findProperty },
        [envInfo.exports.urlexists]: { value: urlExists },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
