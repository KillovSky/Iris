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

/* Define a pasta correta */
function locateFolder(foldername) {
    /* Lista os nomes das pastas no diretório atual */
    const folders = fs.readdirSync(__dirname);

    /* Busca a pasta correta do arquivo SQL, ignorando maiúsculas e minúsculas */
    const foundFolder = folders.find((fd) => fd.toLowerCase() === foldername.toLowerCase()) || 'NONE/EXIT';

    /* Retorna a pasta encontrada */
    return foundFolder;
}

/* Função que executa o SQLite3 */
function executeSQLite(sqlfolder, typecode, user, chatId, keyup, limit, value) {
    /* Determina se vai rodar */
    if ([sqlfolder, typecode, user, chatId, keyup, limit, value].some((s) => s !== null)) {
        /* Define a pasta correta */
        const file = locateFolder(sqlfolder);

        /* Redefine como padrão */
        envInfo.results.value = envInfo.parameters.standard.value[file] || {};
        envInfo.results.value.error = `This function is not available because '${typecode}.sql' is not a function of '${file}', please check if you spelled it correctly or if your function resides on another system.`;

        /* Define o arquivo de SQL */
        const sqlFilePath = `${__dirname}/${file}/${typecode}.sql`;

        /* Verifica se o arquivo existe */
        if (fs.existsSync(sqlFilePath)) {
            /* Ajusta a mensagem de erro para false, pois o arquivo existe */
            envInfo.results.value.error = false;

            /* Obtém o código SQL do arquivo em questão */
            let codeSQL = fs.readFileSync(sqlFilePath, 'utf8');

            /* Faz as edições necessárias no código SQL */
            codeSQL = (codeSQL.replace(/{INSERTGROUP}/gi, `${chatId ?? user}`)
                .replace(/{INSERTKEY}/gi, `${keyup ?? ''}`)
                .replace(/{INSERTJSON}/gi, `${value ?? ''}`)
                .replace(/{INSERTMATHSYM}/gi, `${limit ?? ''}`)
                .replace(/{INSERTUSER}/gi, `${user ?? chatId}`)
                .replace(/{INSERTDEFAULT}/gi, `${JSON.stringify(envInfo.parameters.standard.value[file] || {})}`)
            );

            /* Roda o comando que insere dados no arquivo de database */
            const resultValue = Indexer('shell').bash(`sqlite3 "${databaseSQL}"`, codeSQL);

            /* Caso tenha sido um sucesso */
            if (resultValue.success) {
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

/* Função que valida um JSON, isolada da envInfo, pois é referenciada aqui */
function validateJSON(
    stringJSON = envInfo.functions.fixer.parameters.stringJSON.value,
) {
    /* Inicia com try, caso der algum erro */
    try {
        /* Se for uma string, faz os ajustes necessários */
        const adjustedJSON = (typeof stringJSON === 'string'
            ? stringJSON.trim().replace(/^[^{[]*|[^}\]]*$/g, '').replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ').replace(/'/g, '"')
            : JSON.stringify(stringJSON)
        );

        /* Faz uma tentativa de parse para saber se é válido */
        const parsedJSON = JSON.parse(adjustedJSON);

        /* Retorna o JSON válido */
        return JSON.stringify(parsedJSON);

        /* Se der algum erro */
    } catch (error) {
        /* Retorna false em caso de erro */
        return false;
    }
}

/* Adquire um ou todos os valores de uma base de dados */
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
        /* Verifica se os valores de string estão corretos */
        const isStringValid = typeof file === 'string' && /@s.whatsapp.net|false/gi.test(user) && /@g.us|false|@s.whatsapp.net|getall/gi.test(chatId);

        /* Verifica se as condições batem */
        if (isStringValid) {
            /* Define se é para pegar todos os valores ou apenas um */
            const funUsage = chatId === 'getall' ? 'getall' : 'get';

            /* Executa o comando */
            executeSQLite(file, funUsage, user, chatId, false, false, false);

            /* Se as condições derem algum erro */
        } else {
            /* Define o erro como explicação */
            envInfo.results.value.error = 'The usage method is incorrect. A default object will be sent to avoid errors.';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores; caso nada acima seja feito, retorna os padrões */
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
        const areValuesValid = (
            /* Verifica se as strings estão corretas */
            [file, keyup].every((check) => typeof check === 'string' || typeof check === 'boolean' || typeof check === 'object')

            /* Verifica se o user contém uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Verifica se o chatId contém uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)
        );

        /* Verifica se as condições batem */
        if (areValuesValid) {
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

            /* Se as condições não baterem */
        } else {
            /* Define o erro como explicação */
            envInfo.results.value.error = 'The usage method is incorrect. A default Object will be sent to avoid errors.';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores; caso nada acima seja feito, retorna os padrões */
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
        const areValuesValid = (
            /* Verifica se as strings estão corretas */
            typeof file === 'string'

            /* Determina se enviou uma array */
            && Array.isArray(arrayundo)

            /* Verifica se o user contém uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Verifica se o chatId contém uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)
        );

        /* Verifica se as condições batem */
        if (areValuesValid) {
            /* Adquire os valores padrões baseado na array, retornando uma Object */
            const tempJson = validateJSON(arrayundo.reduce((o, key) => (
                { ...o, [key]: ambientEnv.value[key] || 0 }
            ), {}));

            /* Só continua caso o JSON seja válido */
            if (tempJson !== false) {
                /* Roda a função de atualizar valores */
                ambientEnv.value = updateValues(file, user, chatId, false, tempJson).value;
            }

            /* Se as condições não baterem */
        } else {
            /* Define o erro como explicação */
            envInfo.results.value.error = 'The usage method is incorrect. A default Object will be sent to avoid errors.';
        }

        /* Define o sucesso */
        ambientEnv.success = true;

        /* Se der algum erro */
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
        const areValuesValid = (
            /* Verifica se os valores de string estão corretos */
            [file, keysort].every((check) => typeof check === 'string')

            /* Define o limite de filtro */
            && /^[0-9]+$/.test(limit)
        );

        /* Verifica se as condições batem */
        if (areValuesValid) {
            /* Define a condição WHERE */
            /* eslint-disable-next-line no-nested-ternary */
            const newchatId = file === 'groups' ? chatId : (chatId === 'global' || file === 'bank' ? '--' : `WHERE chat = '${chatId}'`);

            /* Executa o comando */
            executeSQLite(file, 'sort', null, newchatId, keysort, limit, false);

            /* Se as condições não baterem */
        } else {
            /* Define o erro como explicação */
            envInfo.results.value.error = 'The usage method is incorrect. A default Object will be sent to avoid errors.';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Adquire uma Object de usuários com valor específico e numérico */
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
        const areValuesValid = (
            /* Verifica se os valores de string estão corretos */
            [file, keyfilt].every((check) => typeof check === 'string')

            /* Caso o user contenha uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Caso o chatId contenha uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)

            /* Verifica os tipos de MathSym */
            && ['=', '>', '<', '>=', '<=', '!=', '<>', 'IS NULL', 'IS NOT NULL', 'BETWEEN', 'IN'].includes(mathsymbols)
        );

        /* Verifica se as condições batem */
        if (areValuesValid) {
            /* Executa o comando */
            executeSQLite(file, 'find', user, chatId, keyfilt, mathsymbols, value);

            /* Se as condições não baterem */
        } else {
            /* Define o erro como explicação */
            envInfo.results.value.error = 'The usage method is incorrect. A default Object will be sent to avoid errors.';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Remove um usuário/grupo da base de dados */
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
        /* Define as condições de se os valores estão corretos */
        const areValuesValid = (
            /* Verifica se o file está correto */
            typeof file === 'string'

            /* Verifica se o user contém uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Verifica se o chatId contém uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)
        );

        /* Verifica se as condições batem */
        if (areValuesValid) {
            /* Executa o comando */
            executeSQLite(file, 'remove', user, chatId, false, false, false);

            /* Se as condições não forem válidas */
        } else {
            /* Define o erro como explicação */
            envInfo.results.value.error = 'The usage method is incorrect. A default Object will be sent to avoid errors.';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se algum erro acontecer */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores. Caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Executa um comando personalizado na base de dados */
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
        /* Define as condições de se os valores estão corretos */
        const areValuesValid = (
            /* Verifica se o file está correto */
            typeof file === 'string'

            /* Verifica se o código personalizado também está correto */
            && typeof customCode === 'string'
        );

        /* Verifica se as condições batem */
        if (areValuesValid) {
            /* Executa o comando personalizado */
            executeSQLite(file, 'custom', user, chatId, customCode, false, false);

            /* Se as condições não baterem */
        } else {
            /* Define o erro como explicação */
            envInfo.results.value.error = 'The usage method is incorrect. A default Object will be sent to avoid errors.';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores. Caso nada acima seja feito, retorna os padrões */
    return postResults(envInfo.results);
}

/* Remove valores específicos de um usuário ou grupo na base de dados */
function purgeValues(
    file = envInfo.functions.purge.arguments.file.value,
    user = envInfo.functions.purge.arguments.user.value,
    chatId = envInfo.functions.purge.arguments.chatId.value,
    initKey = envInfo.functions.purge.arguments.initKey.value,
    finKey = envInfo.functions.purge.arguments.finKey.value,
) {
    /* Define o valor final como o padrão */
    envInfo.results.value = envInfo.parameters.standard.value[locateFolder(file)] || {};

    /* Define o sucesso do SQL */
    envInfo.results.value.error = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições de se os valores estão corretos */
        const areValuesValid = (
            /* Verifica se os valores de finKey estão corretos */
            ['string', 'boolean', 'object'].includes(typeof finKey)

            /* Verifica se o initKey contém uso correto */
            && typeof initKey === 'string'

            /* Verifica se o user contém uso correto */
            && /@s.whatsapp.net|false/gi.test(user)

            /* Verifica se o chatId contém uso correto */
            && /@g.us|false|@s.whatsapp.net/gi.test(chatId)
        );

        /* Verifica se as condições batem */
        if (areValuesValid) {
            /* Re-define o valor de finKey */
            const finalKey = typeof finKey === 'string' && finKey !== '' ? `.${finKey}` : false;

            /* Executa o comando */
            executeSQLite(file, 'purge', user, chatId, initKey, false, finalKey);

            /* Se as condições não baterem */
        } else {
            /* Define o erro como explicação */
            envInfo.results.value.error = 'The usage method is incorrect. A default Object will be sent to avoid errors.';
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna os valores. Caso nada acima seja feito, retorna os padrões */
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
