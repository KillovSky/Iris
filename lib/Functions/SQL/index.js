/* Requires */
const path = require('path');
const fs = require('fs');
const Indexer = require('../../index');

/* JSON */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Define o local da database SQL */
const databaseSQL = path.normalize(`${irisPath}/lib/Databases/Informations/users.db`);

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

/* Define a pasta correta */
function locateFolder(foldername) {
    /* Define o nome das pastas */
    let file = fs.readdirSync(__dirname);

    /* Busca a pasta correta do arquivo SQL */
    file = file.filter((fd) => fd.toLowerCase() === foldername.toLowerCase())[0] || 'NONE/EXIT';

    /* Retorna o encontrado */
    return file;
}

/* Função que executa o SQLite3 */
function executeSQLite(sqlfolder, typecode, user, chatId, keyup, limit, value) {
    /* Determina se vai rodar */
    if ([sqlfolder, typecode, user, chatId, keyup, limit, value].some((s) => s !== null)) {
        /* Define a pasta correta */
        const file = locateFolder(sqlfolder);

        /* Redefine como padrão */
        envInfo.results.value = envInfo.parameters.standard.value[file] || {};

        /* Define a mensagem de erro padrão no JSON */
        envInfo.results.value.error = `This function is not available because '${typecode}.sql' is not a function of '${file}', please check if you spelled it correctly or if your function resides on another system.`;

        /* Verifica se o arquivo existe */
        if (fs.existsSync(`${__dirname}/${file}/${typecode}.sql`)) {
            /* Ajusta a mensagem de erro para false, pois o arquivo existe */
            envInfo.results.value.error = false;

            /* Obtém o código SQL do arquivo em questão */
            let codeSQL = fs.readFileSync(`${__dirname}/${file}/${typecode}.sql`).toString();

            /* Faz as edições necessárias no código SQL */
            codeSQL = (codeSQL.replace(/{INSERTGROUP}/gi, `${chatId ?? user}`)
                .replace(/{INSERTKEY}/gi, `${keyup ?? ''}`)
                .replace(/{INSERTJSON}/gi, `${value ?? ''}`)
                .replace(/{INSERTMATHSYM}/gi, `${limit ?? ''}`)
                .replace(/{INSERTUSER}/gi, `${user ?? chatId}`)
                .replace(/{INSERTDEFAULT}/gi, `${JSON.stringify(envInfo.parameters.standard.value[file] || {})}`)
            );

            /* Ajusta e faz escape de caracteres especiais */
            codeSQL = `sqlite3 "${databaseSQL}" ${JSON.stringify(codeSQL.replace(/--[^\n]*\n?/g, '').replace(/\s+/g, ' '))}`;

            /* Roda o comando que insere dados no arquivo de database */
            const resultValue = Indexer('shell').bash(codeSQL);

            /* Caso tenha sido um sucesso */
            if (resultValue.success === true) {
                /* Define o valor no result, caso seja custom command */
                envInfo.results.value = resultValue.value.trim();

                /* Se não for custom command, faz parse */
                if (typecode !== 'custom') {
                    /* Tenta dar parse */
                    try {
                        /* O valor final recebido é um JSON, caso não seja, é por que deu erro */
                        envInfo.results.value = JSON.parse(resultValue.value);

                        /* Catch caso o bash retorne erros */
                    } catch (error) {
                        /* Redefine como padrão */
                        envInfo.results.value = envInfo.parameters.standard.value[file] || {};

                        /* Define a mensagem de erro no JSON */
                        envInfo.results.value.error = resultValue.value || true;
                    }
                }
            }
        }
    }
}

/* Função que válida um JSON, isolado da envInfo, pois é referenciado aqui */
function validateJSON(
    stringJSON = envInfo.functions.fixer.parameters.stringJSON.value,
) {
    /* Define um valor padrão para retornar */
    let inputJSON = false;

    /* Determina se é uma Object válida */
    if (['string', 'object', 'array'].includes(typeof stringJSON) && stringJSON != null) {
        /* Try & Catch, caso o parse falhe */
        try {
            /* Se for uma string */
            if (typeof stringJSON === 'string') {
                /* Corta os espaços e caracteres inválidos */
                inputJSON = stringJSON.trim();

                /* Faz ajuste das variáveis e demais */
                inputJSON = inputJSON.replace(/^[^{[]*|[^}\]]*$/g, '').replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ').replace(/'/g, '"');

                /* Se for outro */
            } else {
                /* Faz stringify do JSON */
                inputJSON = JSON.stringify(stringJSON);
            }

            /* Faz tentativa de parse para saber se é válido */
            inputJSON = JSON.parse(inputJSON);

            /* Define o JSON */
            inputJSON = JSON.stringify(inputJSON);

            /* Caso der erro */
        } catch (error) {
            /* Retorna como false */
            inputJSON = false;
        }
    }

    /* Retorna o valor */
    return inputJSON;
}

/* Adquire um ou todos os valores de uma database */
function getValues(
    file = envInfo.functions.get.arguments.file.value,
    user = envInfo.functions.get.arguments.chatId.value,
    chatId = envInfo.functions.get.arguments.chatId.value,
) {
    /* Define o valor final como o padrão */
    envInfo.results.value = envInfo.parameters.standard.value[locateFolder(file)] || {};

    /* Define o sucesso do SQL */
    envInfo.results.value.error = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições de se valores estão corretos */
        const conditions = (
            /* Caso os valores de string estiverem certos */
            typeof file === 'string'

            /* Caso o user contenha uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Caso o chatId contenha uso correto */
            && /@g.us|false|@s.whatsapp.net|getall/gi.test(chatId)
        );

        /* Verifica se as condições batem */
        if (conditions === true) {
            /* Define se é pegar todos */
            const funUsage = chatId === 'getall' ? 'getall' : 'get';

            /* Executa o comando */
            executeSQLite(file, funUsage, user, chatId, false, false, false);

            /* Se não */
        } else {
            /* Define o error como explicação */
            envInfo.results.value.error = 'The usage method is incorrect, a default Object will be sent to avoid errors...';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Atualiza somente um valor, função fácil */
function updateValues(
    file = envInfo.functions.update.arguments.file.value,
    user = envInfo.functions.update.arguments.user.value,
    chatId = envInfo.functions.update.arguments.chatId.value,
    keyup = envInfo.functions.update.arguments.keyup.value,
    value = envInfo.functions.update.arguments.value.value,
) {
    /* Define o valor final como o padrão */
    envInfo.results.value = envInfo.parameters.standard.value[locateFolder(file)] || {};

    /* Define o sucesso do SQL */
    envInfo.results.value.error = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições de se valores estão corretos */
        const conditions = (
            /* Caso os valores de string estiverem certos */
            [file, keyup].some((check) => typeof check === 'string' || typeof check === 'boolean' || typeof check === 'object')

            /* Caso o user contenha uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Caso o chatId contenha uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)
        );

        /* Verifica se as condições batem */
        if (conditions === true) {
            /* Define o valor de Object */
            let tempJson = validateJSON(value);

            /* Se a keyup for uma string */
            if (typeof keyup === 'string') {
                /* Define um JSON Object */
                tempJson = validateJSON({
                    [keyup]: (value || envInfo.results.value[keyup] || 0),
                });
            }

            /* Só continua caso o JSON seja válido */
            if (tempJson !== false) {
                /* Executa o comando */
                executeSQLite(file, 'update', user, chatId, keyup, false, tempJson);
            }

            /* Se não */
        } else {
            /* Define o error como explicação */
            envInfo.results.value.error = 'The usage method is incorrect, a default Object will be sent to avoid errors...';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        console.log(error);
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Reseta um valor da DB */
function undoValues(
    file = envInfo.functions.purge.arguments.file.value,
    user = envInfo.functions.purge.arguments.user.value,
    chatId = envInfo.functions.purge.arguments.chatId.value,
    arrayundo = envInfo.functions.purge.arguments.keyundo.value,
) {
    /* Define uma const para hospedar os valores, pois senão serão sobrepostos por outra função */
    const ambientEnv = envInfo.results;

    /* Define o valor final como o padrão */
    ambientEnv.value = envInfo.parameters.standard.value[locateFolder(file)] || {};

    /* Define o sucesso do SQL */
    ambientEnv.value.error = false;

    /* Define o sucesso */
    ambientEnv.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições de se valores estão corretos */
        const conditions = (
            /* Caso os valores de string estiverem certos */
            typeof file === 'string'

            /* Determina se enviou uma array */
            && Array.isArray(arrayundo)

            /* Caso o user contenha uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Caso o chatId contenha uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)
        );

        /* Verifica se as condições batem */
        if (conditions === true) {
            /* Adquire os valores padrões baseado na array, retornando uma Object */
            const tempJson = validateJSON(arrayundo.reduce((o, key) => (
                { ...o, [key]: ambientEnv.value[key] || 0 }
            ), {}));

            /* Só continua caso o JSON seja válido */
            if (tempJson !== false) {
                /* Roda a função de atualizar valores */
                ambientEnv.value = updateValues(file, user, chatId, false, tempJson).value;
            }

            /* Se não */
        } else {
            /* Define o error como explicação */
            envInfo.results.value.error = 'The usage method is incorrect, a default Object will be sent to avoid errors...';
        }

        /* Define o sucesso */
        ambientEnv.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return postResults(ambientEnv);
}

/* Adquire o JSON de um ID especifico */
function rankingValues(
    file = envInfo.functions.finder.arguments.file.value,
    chatId = envInfo.functions.finder.arguments.chatId.value,
    keysort = envInfo.functions.finder.arguments.keysort.value,
    limit = envInfo.functions.finder.arguments.limit.value,
) {
    /* Define o valor final como o padrão */
    envInfo.results.value = envInfo.parameters.standard.value[locateFolder(file)] || {};

    /* Define o sucesso do SQL */
    envInfo.results.value.error = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições de se valores estão corretos */
        const conditions = (
            /* Caso os valores de string estiverem certos */
            [file, keysort].some((check) => typeof check === 'string')

            /* Define o limite de filtro */
            && /[0-9]+/g.test(limit)
        );

        /* Verifica se as condições batem */
        if (conditions === true) {
            /* Define a key */
            let newchatId = chatId === 'global' || file === 'bank' ? '--' : `WHERE chat = '${chatId}'`;

            /* Redefine se for grupo */
            newchatId = file === 'groups' ? chatId : newchatId;

            /* Executa o comando */
            executeSQLite(file, 'sort', null, newchatId, keysort, limit, false);

            /* Se não */
        } else {
            /* Define o error como explicação */
            envInfo.results.value.error = 'The usage method is incorrect, a default Object will be sent to avoid errors...';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Adquire uma Object de usuários com valor especifico e númerico */
function filterValues(
    file = envInfo.functions.finder.arguments.file.value,
    user = envInfo.functions.finder.arguments.user.value,
    chatId = envInfo.functions.finder.arguments.chatId.value,
    keyfilt = envInfo.functions.finder.arguments.keysort.value,
    mathsym = envInfo.functions.finder.arguments.mathsym.value,
    value = envInfo.functions.finder.arguments.value.value,
) {
    /* Define o valor final como o padrão */
    envInfo.results.value = envInfo.parameters.standard.value[locateFolder(file)] || {};

    /* Define o sucesso do SQL */
    envInfo.results.value.error = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Redefine o mathsym */
    const mathsymbols = typeof mathsym === 'string' ? mathsym.toUpperCase() : envInfo.functions.finder.arguments.mathsym.value;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições de se valores estão corretos */
        const conditions = (
            /* Caso os valores de string estiverem certos */
            [file, keyfilt].some((check) => typeof check === 'string')

            /* Caso o user contenha uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Caso o chatId contenha uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)

            /* Verifica os tipos de MathSym */
            && ['=', '>', '<', '>=', '<=', '!=', '<>', 'IS NULL', 'IS NOT NULL', 'BETWEEN', 'IN'].includes(mathsymbols)
        );

        /* Verifica se as condições batem */
        if (conditions === true) {
            /* Executa o comando */
            executeSQLite(file, 'find', user, chatId, keyfilt, mathsymbols, value);

            /* Se não */
        } else {
            /* Define o error como explicação */
            envInfo.results.value.error = 'The usage method is incorrect, a default Object will be sent to avoid errors...';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Remove um user/group da database */
function removeValues(
    file = envInfo.functions.remove.arguments.file.value,
    user = envInfo.functions.remove.arguments.user.value,
    chatId = envInfo.functions.remove.arguments.chatId.value,
) {
    /* Define o valor final como o padrão */
    envInfo.results.value = envInfo.parameters.standard.value[locateFolder(file)] || {};

    /* Define o sucesso do SQL */
    envInfo.results.value.error = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições de se valores estão corretos */
        const conditions = (
            /* Caso o file esteja correto */
            typeof file === 'string'

            /* Caso o user contenha uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Caso o chatId contenha uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)
        );

        /* Verifica se as condições batem */
        if (conditions === true) {
            /* Executa o comando */
            executeSQLite(file, 'remove', user, chatId, false, false, false);

            /* Se não */
        } else {
            /* Define o error como explicação */
            envInfo.results.value.error = 'The usage method is incorrect, a default Object will be sent to avoid errors...';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Remove um user/group da database */
function customCommand(
    file = envInfo.functions.custom.arguments.file.value,
    user = envInfo.functions.custom.arguments.user.value,
    chatId = envInfo.functions.custom.arguments.chatId.value,
    customCode = envInfo.functions.custom.arguments.customCode.value,
) {
    /* Define o valor final como o padrão */
    envInfo.results.value = envInfo.parameters.standard.value[locateFolder(file)] || {};

    /* Define o sucesso do SQL */
    envInfo.results.value.error = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições de se valores estão corretos */
        const conditions = (
            /* Caso o file esteja correto */
            typeof file === 'string'

            /* E o código também */
            && typeof customCode === 'string'
        );

        /* Verifica se as condições batem */
        if (conditions === true) {
            /* Executa o comando */
            executeSQLite(file, 'custom', user, chatId, customCode, false, false);

            /* Se não */
        } else {
            /* Define o error como explicação */
            envInfo.results.value.error = 'The usage method is incorrect, a default Object will be sent to avoid errors...';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Adquire o JSON de um ID especifico */
function purgeValues(
    file = envInfo.functions.purge.arguments.file.value,
    user = envInfo.functions.purge.arguments.user.value,
    chatId = envInfo.functions.purge.arguments.chatId.value,
    initkey = envInfo.functions.purge.arguments.initkey.value,
    finkey = envInfo.functions.purge.arguments.finkey.value,
) {
    /* Define o valor final como o padrão */
    envInfo.results.value = envInfo.parameters.standard.value[locateFolder(file)] || {};

    /* Define o sucesso do SQL */
    envInfo.results.value.error = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições de se valores estão corretos */
        const conditions = (
            /* Caso os valores de finkey estiverem certos */
            ['string', 'boolean', 'object'].includes(typeof finkey)

            /* Caso o initkey contenha uso correto */
            && typeof initkey === 'string'

            /* Caso o user contenha uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Caso o chatId contenha uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)
        );

        /* Verifica se as condições batem */
        if (conditions === true) {
            /* Re-define o valor de finkey */
            const finalKeys = typeof finkey === 'string' && finkey !== '' ? `.${finkey}` : false;

            /* Executa o comando */
            executeSQLite(file, 'purge', user, chatId, initkey, false, finalKeys);

            /* Se não */
        } else {
            /* Define o error como explicação */
            envInfo.results.value.error = 'The usage method is incorrect, a default Object will be sent to avoid errors...';
        }
        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
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

        /* Insere a updateValues na envInfo */
        envInfo.functions.update.value = updateValues;

        /* Insere a undoValues na envInfo */
        envInfo.functions.undo.value = undoValues;

        /* Insere a rankingValues na envInfo */
        envInfo.functions.ranking.value = rankingValues;

        /* Insere a filterValues na envInfo */
        envInfo.functions.finder.value = filterValues;

        /* Insere a purgeValues na envInfo */
        envInfo.functions.purge.value = purgeValues;

        /* Insere a fixer na envInfo */
        envInfo.functions.fixer.value = validateJSON;

        /* Insere a removeValues na envInfo */
        envInfo.functions.remove.value = removeValues;

        /* Insere a customCommand na envInfo */
        envInfo.functions.custom.value = customCommand;

        /* Insere a getValues na envInfo */
        envInfo.functions.get.value = getValues;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.update]: envInfo.functions.update.value,
                [envInfo.exports.finder]: envInfo.functions.finder.value,
                [envInfo.exports.get]: envInfo.functions.get.value,
                [envInfo.exports.remove]: envInfo.functions.remove.value,
                [envInfo.exports.ranking]: envInfo.functions.ranking.value,
                [envInfo.exports.custom]: envInfo.functions.custom.value,
                [envInfo.exports.purge]: envInfo.functions.purge.value,
                [envInfo.exports.undo]: envInfo.functions.undo.value,
                [envInfo.exports.fixer]: envInfo.functions.fixer.value,
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
