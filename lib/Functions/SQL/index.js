/* eslint-disable max-len */

/* Requires */
const path = require('path');
const fs = require('fs');
const BSQLite = require('better-sqlite3');
const Indexer = require('../../index');

/* Define o local da database SQL */
const dialogsSQL = path.normalize(`${irisPath}/lib/Databases/Informations/dialogues.db`);
const extrasSQL = path.normalize(`${irisPath}/lib/Databases/Utilities/extras.db`);

/* JSON | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let allLanguages = [];
const databaseSQL = path.normalize(`${irisPath}/lib/Databases/Informations/${envInfo?.parameters?.databaseName?.value || 'general.db'}`);

/**
 * Cria uma nova instância da database SQLite
 * @constant {BSQLite}
 */
const sqlDatabase = new BSQLite(databaseSQL);
const dialDatabase = new BSQLite(dialogsSQL);
const extrasDatabase = new BSQLite(extrasSQL);

/**
 * Remove comentários e linhas vazias do código SQL
 * @param {string} sql - A string SQL original
 * @returns {string} - A string SQL sem comentários e linhas vazias
 */
function removeCommentsAndEmptyLines(sql) {
    return (sql
        .split('\n')
        .filter((line) => {
            const trimmedLine = line.trim();
            return trimmedLine && !trimmedLine.startsWith('--');
        })
        .join('\n')
    );
}

/**
 * Executa um comando SQL de forma síncrona
 * @param {string} sql - O comando SQL a ser executado
 * @param {Object} params - Parâmetros para substituição no SQL
 * @returns {any} - O resultado da execução do SQL
 */
function executeSQLCommand(sql) {
    /* Executa em try-catch para caso dê erro no exec */
    try {
        /* Faz a remoção dos comentários no SQL */
        const finalSQL = removeCommentsAndEmptyLines(sql);

        /* Filtra as linhas de comandos */
        const sqlCommands = finalSQL.split(';').filter((command) => command.trim() !== '');

        /* Define o resultado ou DB */
        let selectResult;

        /* Executa linha a linha dos comandos */
        sqlCommands.forEach((command) => {
            /* Se começar com SELECT significa final */
            const lastCommand = sqlCommands[sqlCommands.length - 1].toUpperCase();
            if (lastCommand.includes('SELECT') && command.toUpperCase() === lastCommand) {
                /* O que faz com que o resultado seja posto na let feita acima */
                selectResult = sqlDatabase.prepare(command).get();

                /* Caso contrário, só continua executando */
            } else sqlDatabase.exec(command);
        });

        /* Tenta fazer um parse dentro do try-catch, pois se não for nele, dará erros */
        try {
            /* Resultado ? Valores : Falso (Indica não ter dados) */
            return selectResult ? JSON.parse(selectResult[Object.keys(selectResult)[0]]) : false;

            /* Se o parse falhar */
        } catch (error) {
            /* Retorna que esta sem dados também */
            return false;
        }

        /* Caso a execução na DB falhe */
    } catch (error) {
        /* Retorna o erro via logging */
        logging.echoError(error, envInfo, __dirname);

        /* E um aviso que não tem dados */
        return false;
    }
}

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
 * Localiza a pasta correta com base no nome fornecido.
 * @function locateFolder
 * @param {string} foldername - Nome da pasta a ser localizada.
 * @returns {string} Nome da pasta encontrada ou 'NONE/EXIT' se não encontrada.
 */
function locateFolder(foldername) {
    /* Lista os nomes das pastas no diretório atual */
    const folders = fs.readdirSync(__dirname);

    /* Busca a pasta correta do arquivo SQL, ignorando maiúsculas e minúsculas */
    const foundFolder = folders.find((fd) => fd.toLowerCase() === foldername.toLowerCase()) || 'NONE/EXIT';

    /* Retorna a pasta encontrada */
    return foundFolder;
}

/**
 * Executa um comando SQLite3 com base nos parâmetros fornecidos.
 * @function executeSQLite
 * @param {string} sqlfolder - Nome da pasta onde o arquivo SQL está localizado.
 * @param {string} typecode - Nome do arquivo SQL (sem extensão).
 * @param {string} user - Identificador do usuário.
 * @param {string} chatId - Identificador do chat.
 * @param {string} keyup - Chave para atualização.
 * @param {string} limit - Limite para a consulta.
 * @param {string} value - Valor a ser inserido ou atualizado.
 * @returns {void}
 */
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
                .replace(/{INSERTLANG}/gi, `${region ?? 'pt'}`)
                .replace(/{INSERTUSER}/gi, `${user ?? chatId}`)
                .replace(/{INSERTDEFAULT}/gi, `${JSON.stringify(envInfo.parameters.standard.value[file] || {})}`)
            );

            /* Roda o comando que insere dados no arquivo de database */
            const sqlResponse = executeSQLCommand(codeSQL);

            /* Se for false significa que não tem dados */
            if (sqlResponse !== false) {
                /* Mas caso não, é sinal que deu certo */
                envInfo.results.value = sqlResponse;
            }
        }
    }
}

/**
 * Valida e corrige um JSON.
 * @function validateJSON
 * @param {string|Object} [stringJSON=envInfo.functions.fixer.parameters.stringJSON.value] - JSON a ser validado.
 * @returns {string|boolean} Retorna o JSON válido como string ou `false` em caso de erro.
 */
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

/**
 * Adquire um ou todos os valores de uma base de dados.
 * @function getValues
 * @param {string} [file=envInfo.functions.get.arguments.file.value] - Nome do arquivo SQL.
 * @param {string} [user=envInfo.functions.get.arguments.chatId.value] - Identificador do usuário.
 * @param {string} [chatId=envInfo.functions.get.arguments.chatId.value] - Identificador do chat.
 * @returns {Object} Retorna os valores obtidos ou um objeto padrão em caso de erro.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores; caso nada acima seja feito, retorna os padrões */
    return logging.postResults(envInfo);
}

/**
 * Atualiza um valor específico na base de dados.
 * @function updateValues
 * @param {string} [file=envInfo.functions.update.arguments.file.value] - Nome do arquivo SQL.
 * @param {string} [user=envInfo.functions.update.arguments.user.value] - Identificador do usuário.
 * @param {string} [chatId=envInfo.functions.update.arguments.chatId.value] - Identificador do chat.
 * @param {string} [keyup=envInfo.functions.update.arguments.keyup.value] - Chave para atualização.
 * @param {string|Object} [value=envInfo.functions.update.arguments.value.value] - Valor a ser atualizado.
 * @returns {Object} Retorna os valores atualizados ou um objeto padrão em caso de erro.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores; caso nada acima seja feito, retorna os padrões */
    return logging.postResults(envInfo);
}

/**
 * Reseta um ou mais valores na base de dados.
 * @function undoValues
 * @param {string} [file=envInfo.functions.purge.arguments.file.value] - Nome do arquivo SQL.
 * @param {string} [user=envInfo.functions.purge.arguments.user.value] - Identificador do usuário.
 * @param {string} [chatId=envInfo.functions.purge.arguments.chatId.value] - Identificador do chat.
 * @param {Array<string>} [arrayundo=envInfo.functions.purge.arguments.keyundo.value] - Array de chaves a serem resetadas.
 * @returns {Object} Retorna os valores resetados ou um objeto padrão em caso de erro.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return ambientEnv;
}

/**
 * Adquire o JSON de um ID específico, ordenando os valores com base em uma chave.
 * @function rankingValues
 * @param {string} [file=envInfo.functions.finder.arguments.file.value] - Nome do arquivo SQL.
 * @param {string} [chatId=envInfo.functions.finder.arguments.chatId.value] - Identificador do chat.
 * @param {string} [keysort=envInfo.functions.finder.arguments.keysort.value] - Chave para ordenação.
 * @param {string} [limit=envInfo.functions.finder.arguments.limit.value] - Limite de resultados.
 * @returns {Object} Retorna os valores ordenados ou um objeto padrão em caso de erro.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return logging.postResults(envInfo);
}

/**
 * Filtra valores específicos de usuários ou grupos na base de dados com base em uma chave e operador matemático.
 * @function filterValues
 * @param {string} [file=envInfo.functions.finder.arguments.file.value] - Nome do arquivo SQL.
 * @param {string} [user=envInfo.functions.finder.arguments.user.value] - Identificador do usuário.
 * @param {string} [chatId=envInfo.functions.finder.arguments.chatId.value] - Identificador do chat.
 * @param {string} [keyfilt=envInfo.functions.finder.arguments.keysort.value] - Chave para filtragem.
 * @param {string} [mathsym=envInfo.functions.finder.arguments.mathsym.value] - Operador matemático para filtragem.
 * @param {string|number} [value=envInfo.functions.finder.arguments.value.value] - Valor para comparação.
 * @returns {Object} Retorna os valores filtrados ou um objeto padrão em caso de erro.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores, caso nada acima seja feito, retorna os padrões */
    return logging.postResults(envInfo);
}
/**
 * Remove um usuário ou grupo da base de dados.
 * @function removeValues
 * @param {string} [file=envInfo.functions.remove.arguments.file.value] - Nome do arquivo SQL.
 * @param {string} [user=envInfo.functions.remove.arguments.user.value] - Identificador do usuário.
 * @param {string} [chatId=envInfo.functions.remove.arguments.chatId.value] - Identificador do chat.
 * @returns {Object} Retorna os valores atualizados ou um objeto padrão em caso de erro.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores. Caso nada acima seja feito, retorna os padrões */
    return logging.postResults(envInfo);
}

/**
 * Executa um comando personalizado na base de dados.
 * @function customCommand
 * @param {string} [file=envInfo.functions.custom.arguments.file.value] - Nome do arquivo SQL.
 * @param {string} [user=envInfo.functions.custom.arguments.user.value] - Identificador do usuário.
 * @param {string} [chatId=envInfo.functions.custom.arguments.chatId.value] - Identificador do chat.
 * @param {string} [customCode=envInfo.functions.custom.arguments.customCode.value] - Código SQL personalizado.
 * @returns {Object} Retorna os resultados do comando ou um objeto padrão em caso de erro.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores. Caso nada acima seja feito, retorna os padrões */
    return logging.postResults(envInfo);
}

/**
 * Recria as tabelas da base de dados mantendo seus dados (útil para atualizações que exigem alterações na estrutura).
 * @function fixDatabase
 * @param {Object} [params={}] - Parâmetros adicionais para a correção da base de dados.
 * @param {string} [params.first=envInfo.functions.fixdb.arguments.param1.value] - Primeiro parâmetro.
 * @param {string} [params.second=envInfo.functions.fixdb.arguments.param2.value] - Segundo parâmetro.
 * @param {string} [params.third=envInfo.functions.fixdb.arguments.param3.value] - Terceiro parâmetro.
 * @param {string} [params.fourth=envInfo.functions.fixdb.arguments.param4.value] - Quarto parâmetro.
 * @param {string} [params.fifth=envInfo.functions.fixdb.arguments.param5.value] - Quinto parâmetro.
 * @param {string} [params.oldDb=envInfo.functions.fixdb.arguments.oldDb.value] - Nome da base de dados antiga.
 * @param {Array<string>} [params.dbNames=envInfo.functions.fixdb.arguments.dbNames.value] - Nomes das bases de dados a serem recriadas.
 * @returns {Object} Retorna os resultados da correção ou um objeto padrão em caso de erro.
 */
function fixDatabase(params = {}) {
    /* Define o sucesso */
    envInfo.results.success = false;

    /* Define parametros, caso um dia a correção precise */
    const settings = {
        ...params,
    };

    /* Ajusta os valores para caso venha null ou errado */
    settings.first = settings.first ?? envInfo.functions.fixdb.arguments.param1.value;
    settings.second = settings.second ?? envInfo.functions.fixdb.arguments.param2.value;
    settings.third = settings.third ?? envInfo.functions.fixdb.arguments.param3.value;
    settings.fourth = settings.fourth ?? envInfo.functions.fixdb.arguments.param4.value;
    settings.fifth = settings.fifth ?? envInfo.functions.fixdb.arguments.param5.value;
    settings.oldDb = settings.oldDb ?? envInfo.functions.fixdb.arguments.oldDb.value;
    settings.dbNames = settings.dbNames ?? envInfo.functions.fixdb.arguments.dbNames.value;

    /* Try-Catch para casos de erro */
    try {
        /* Define o nome da antiga DB */
        const oldDatabase = path.normalize(`${irisPath}/lib/Databases/Informations/${settings.oldDb}`);

        /* Try catch secundário para o uso do accessSync */
        try {
            /* Verifica se a antiga DB realmente existe */
            fs.accessSync(oldDatabase, fs.constants.F_OK);

            /* Renomeia o arquivo antigo para o novo DB */
            fs.renameSync(oldDatabase, databaseSQL);

            /* Se o arquivo não existir ou se ocorrer um erro ao acessar ou renomear */
        } catch (error) {
            /* Printa na tela sem limitação por ser 'grave' */
            console.error(error);
            console.log('\nSua database não existe, está aberta ou está com defeitos, ignorando uso de antiga database....\n');
        }

        /* Executa os códigos de correção da database */
        settings.dbNames.forEach((db) => {
            /* Um a um por meio de loop */
            executeSQLite(db, 'recreate', settings.first, settings.second, settings.third, settings.fourth, settings.fifth);
        });

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores. Caso nada acima seja feito, retorna os padrões */
    return logging.postResults(envInfo);
}

/**
 * Remove valores específicos de um usuário ou grupo na base de dados.
 * @function purgeValues
 * @param {string} [file=envInfo.functions.purge.arguments.file.value] - Nome do arquivo SQL.
 * @param {string} [user=envInfo.functions.purge.arguments.user.value] - Identificador do usuário.
 * @param {string} [chatId=envInfo.functions.purge.arguments.chatId.value] - Identificador do chat.
 * @param {string} [initKey=envInfo.functions.purge.arguments.initKey.value] - Chave inicial para remoção.
 * @param {string|boolean|Object} [finKey=envInfo.functions.purge.arguments.finKey.value] - Chave final para remoção.
 * @returns {Object} Retorna os valores atualizados ou um objeto padrão em caso de erro.
 */
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores. Caso nada acima seja feito, retorna os padrões */
    return logging.postResults(envInfo);
}

/**
 * Obtém diálogos com base em parâmetros específicos, como idioma, pasta, diálogo e substituições.
 * @function dialoguePicker
 * @param {string} [regionPicker=envInfo.functions.languages.arguments.regionPicker.value] - Idioma a ser utilizado. Enviar 'G.A.L' nesse paramêtro retorna uma array de sigla dos idiomas.
 * @param {string} [folderPicker=envInfo.functions.languages.arguments.folderPicker.value] - Pasta onde o diálogo está localizado.
 * @param {string|Error} [dialogPicker=envInfo.functions.languages.arguments.dialogPicker.value] - Nome do diálogo ou erro a ser tratado.
 * @param {boolean} [randomOrder=envInfo.functions.languages.arguments.randomOrder.value] - Define se a ordem dos diálogos deve ser aleatória.
 * @param {boolean} [singleText=envInfo.functions.languages.arguments.singleText.value] - Define se deve retornar apenas um diálogo.
 * @param {Object} [objectReplacer=envInfo.functions.languages.arguments.objectReplacer.value] - Objeto para substituir variáveis no diálogo.
 * @returns {Object} Retorna o diálogo formatado, uma array de siglas de idiomas ou um objeto padrão em caso de erro.
 */
function dialoguePicker(
    regionPicker = envInfo.functions.languages.arguments.regionPicker.value,
    folderPicker = envInfo.functions.languages.arguments.folderPicker.value,
    dialogPicker = envInfo.functions.languages.arguments.dialogPicker.value,
    randomOrder = envInfo.functions.languages.arguments.randomOrder.value,
    singleText = envInfo.functions.languages.arguments.singleText.value,
    objectReplacer = envInfo.functions.languages.arguments.objectReplacer.value,
) {
    /* Define o sucesso do SQL */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Caso ainda não tenha a array de idiomas */
        if (allLanguages.length === 0) {
            /* Define no código */
            const tables = dialDatabase.prepare('SELECT json_group_array(name) AS tables FROM sqlite_master WHERE type=\'table\'').get();
            allLanguages = JSON.parse(tables.tables);

            /* Usa um valor estático padrão dos diálogos, se falhar */
            if (!allLanguages.length) {
                /* Pode não conter todos os idiomas! */
                allLanguages = ['pt', 'ar', 'jp', 'en', 'fr', 'es', 'id', 'ms', 'hi', 'de', 'it', 'ru', 'lat'];
            }
        }

        /* Define o idioma, mas antes verifica se é string */
        let userLang = (typeof regionPicker === 'string' ? regionPicker.toLowerCase() : 'pt');

        /* Se for só obtenção dos diálogos */
        if (userLang.toLowerCase() === 'g.a.l') return allLanguages;

        /* Define a query base */
        let query = '';

        /* Define se deve ajustar os diálogos de novo */
        if (!allLanguages.includes(userLang)) {
            /* Define o padrão */
            userLang = 'pt';
        }

        /* Redefine o objeto */
        const replaceData = objectReplacer;

        /* Define o arquivo, mas antes verifica se é string */
        let taskName = (typeof folderPicker === 'string' ? folderPicker : 'Default');

        /* Define o diálogo final */
        let nameKey = (typeof dialogPicker === 'string' || dialogPicker instanceof Error ? dialogPicker : 'Default');

        /* Se for o report de erros especial [Special Error Report] */
        if (nameKey instanceof Error && taskName === 'S.E.R' && config.sendSER.value === true) {
            /* Formata o local e demais informações */
            const stderr = nameKey.stack ? nameKey.stack.match(/\(.*\)/gi)[0].replace(/\(|\)/gi, '').split(/:/gi) : ['Disk', './', 'Unknown', 'Unknown'];
            stderr[0] = stderr[0] || 'Disk';
            stderr[1] = stderr[1] || './';
            stderr[2] = stderr[2] || 'Unknown';
            stderr[3] = stderr[3] || 'Unknown';

            /* Local */
            replaceData.path = path.dirname(path.resolve(stderr[0] || './')).replace(irisPath, '').replace('\\', '');

            /* Arquivo */
            replaceData.file = path.basename(stderr[0]);

            /* Se é na Íris */
            replaceData.isMe = (stderr[0].includes('node') ? '❌' : '✔️');

            /* Linha do arquivo */
            [replaceData.line] = [stderr[1]];

            /* Caractere */
            [replaceData.character] = [stderr[2]];

            /* Mensagem de erro */
            replaceData.fullbo = nameKey.message;

            /* Nome do erro */
            replaceData.typeerror = nameKey.name;

            /* Determina o tipo | RangeError */
            if (nameKey.name === 'RangeError') {
                /* RangeError | Númerico */
                query = `SELECT data FROM ${userLang} WHERE LOWER(task) = LOWER('Errors') AND LOWER(name) = LOWER('RangeError') ORDER BY RANDOM() LIMIT 1;`;

                /* ReferenceError */
            } else if (nameKey.name === 'ReferenceError') {
                /* Falta código */
                query = `SELECT REPLACE(data, '{lostvar}', '${nameKey.message.slice(0, -15)}') FROM ${userLang} WHERE LOWER(task) = LOWER('Errors') AND LOWER(name) = LOWER('ReferenceFix') ORDER BY RANDOM() LIMIT 1;`;

                /* SyntaxError */
            } else if (nameKey.name === 'SyntaxError') {
                /* Código mal feito */
                query = `SELECT data FROM ${userLang} WHERE LOWER(task) = LOWER('Errors') AND LOWER(name) = LOWER('SyntaxFix') ORDER BY RANDOM() LIMIT 1;`;

                /* TypeError */
            } else if (nameKey.name === 'TypeError') {
                /* Constante sendo usada como let/var */
                query = `SELECT data FROM ${userLang} WHERE LOWER(task) = LOWER('Errors') AND LOWER(name) = LOWER('TypeFix') ORDER BY RANDOM() LIMIT 1;`;

                /* Qualquer outro [Existe?] */
            } else {
                /* Diz desconhecido */
                query = `SELECT data FROM ${userLang} WHERE LOWER(task) = LOWER('Errors') AND LOWER(name) = LOWER('OtherFix') ORDER BY RANDOM() LIMIT 1;`;
            }

            /* Obtém o diálogo de sugestão */
            const suggestion = dialDatabase.prepare(query).get();
            replaceData.suggestion = suggestion.data;

            /* Ajusta os valores para pegar a mensagem correta */
            nameKey = 'Fail';
            taskName = 'Errors';

            /* Se for erro, mas não tem permissão de mandar o full */
        } else if (nameKey instanceof Error && taskName === 'S.E.R' && config.sendSER.value === false) {
            /* Define os valores da mensagem de falha */
            userLang = region;
            taskName = 'Loggers';
            nameKey = 'Error';
        }

        /* Define a query */
        query = `SELECT CASE WHEN COALESCE((SELECT data FROM ${userLang} WHERE LOWER(task) = LOWER('${taskName}') AND LOWER(name) = LOWER('${nameKey}') ${randomOrder ? 'ORDER BY RANDOM()' : ''} ${singleText ? ' LIMIT 1' : ''}), '[]') = '[]' THEN (SELECT data FROM ${userLang} WHERE LOWER(name) = LOWER('Default') AND LOWER(task) = LOWER('Default') ${randomOrder ? 'ORDER BY RANDOM()' : ''} ${singleText ? ' LIMIT 1' : ''}) ELSE (SELECT data FROM ${userLang} WHERE LOWER(task) = LOWER('${taskName}') AND LOWER(name) = LOWER('${nameKey}') ${randomOrder ? 'ORDER BY RANDOM()' : ''} ${singleText ? ' LIMIT 1' : ''}) END;`;

        /* Faz ajustes se preciso */
        query = !singleText ? query.replace(/SELECT data/gi, 'SELECT json_group_array(data)').replace(/LIMIT 1/gi, '') : query;

        /* Obtém o diálogo */
        const dialogData = dialDatabase.prepare(query).get();
        envInfo.results.value = dialogData[Object.keys(dialogData)[0]];

        /* Ajusta as variáveis internas se for apenas 1 diálogo */
        if (singleText === true) {
            /* Retorna o primeiro, use aleatorização para dinamismo */
            envInfo.results.value = envInfo.results.value.replace(/\{([^}]*)\}/gi, (match, key) => Indexer('others').repl(replaceData, match, key));

            /* Se não faz parse */
        } else envInfo.results.value = JSON.parse(envInfo.results.value);

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Faz trim do valor */
        envInfo.results.value = envInfo.results.value.trim();

        /* Se ainda não tiver nada */
        if (envInfo.results.value === '') {
            /* Executa uma query simples e ajusta ela */
            const simpleDial = dialDatabase.prepare(`SELECT data FROM ${userLang} WHERE LOWER(name) = 'Default' AND task = 'Default' ORDER BY RANDOM() LIMIT 1;`).get();
            envInfo.results.value = simpleDial.data;
            envInfo.results.value = envInfo.results.value.trim();
        }

        /* Se der erro em qualquer parte acima */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os dados do diálogo */
    return logging.postResults(envInfo);
}

/**
 * Obtém uma palavra ou dado de uma tabela específica na base de dados.
 * @function getKeyword
 * @param {string} [selectLang=region] - Idioma a ser utilizado.
 * @param {string} [nameList=envInfo.functions.keywords.arguments.nameList.value] - Nome da lista de palavras.
 * @param {string} [tableName=envInfo.functions.keywords.arguments.tableName.value] - Nome da tabela na base de dados.
 * @param {boolean} [randomWord=envInfo.functions.keywords.arguments.randomWord.value] - Define se a palavra deve ser escolhida aleatoriamente.
 * @param {string} [fullCommand=envInfo.functions.keywords.arguments.fullCommand.value] - Comando SQL personalizado (opcional).
 * @returns {Object} Retorna a palavra ou dado obtido, com informações adicionais, ou um objeto padrão em caso de erro.
 */
function getKeyword(
    selectLang = region,
    nameList = envInfo.functions.keywords.arguments.nameList.value,
    tableName = envInfo.functions.keywords.arguments.tableName.value,
    randomWord = envInfo.functions.keywords.arguments.randomWord.value,
    fullCommand = envInfo.functions.keywords.arguments.fullCommand.value,
) {
    /* Define o valor final como um fail keyword */
    envInfo.results.value = {
        id: 999,
        language: 'ALL',
        type: 'entity',
        word: config.botName.value,
        error: true,
    };

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define os valores a usar */
        const getLists = {
            language: typeof selectLang === 'string' ? selectLang : region,
            table: typeof tableName === 'string' ? tableName : envInfo.functions.keywords.arguments.tableName.value,
            random: typeof randomWord === 'boolean' ? randomWord : envInfo.functions.keywords.arguments.randomWord.value,
            name: typeof nameList === 'string' ? nameList : envInfo.functions.keywords.arguments.nameList.value,
            command: typeof fullCommand === 'string' ? fullCommand : envInfo.functions.keywords.arguments.fullCommand.value,
        };

        /* Constrói a query SQLite3 */
        const query = getLists.command || `SELECT json_object('id', id, 'type', type, 'language', language, 'word', name) FROM ${getLists.table} ${getLists.language === 'any' ? '' : `WHERE language = '${getLists.language}'`} ${getLists?.name && getLists?.language !== 'any' ? `AND type = '${getLists.name}'` : ''} ${getLists.random ? 'ORDER BY RANDOM()' : ''} LIMIT 1;`;

        /* Obtém a palavra */
        const wordSelect = extrasDatabase.prepare(query).get();
        envInfo.results.value = wordSelect ? wordSelect[Object.keys(wordSelect)[0]] : '';

        /* Se não for código customizado */
        if (!getLists.command && envInfo.results.value) {
            /* Faz versões alternativas, como JSON, invertido, etc */
            envInfo.results.value = JSON.parse(envInfo.results.value);
            envInfo.results.value.mistery = envInfo.results.value.word[0] + '_'.repeat(envInfo.results.value.word.length - 1);
            envInfo.results.value.encoded = Buffer.from(envInfo.results.value.word).toString('base64');
            envInfo.results.value.mixed = Indexer('strings').shuffle(envInfo.results.value.word).value;
            envInfo.results.value.chars = envInfo.results.value.word.split('');
            envInfo.results.value.mixedchars = Indexer('array').sort(envInfo.results.value.word.split('')).value;
            envInfo.results.value.reverse = envInfo.results.value.chars.reverse().join('');
            envInfo.results.value.arrmistery = envInfo.results.value.mistery.split('');
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna os valores; caso nada acima seja feito, retorna os padrões */
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
    anotherData = false,
    envFile = envInfo,
    dirname = __dirname,
) => module.exports = logging.resetAmbient({
    functions: {
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.update]: { value: updateValues },
        [envInfo.exports.undo]: { value: undoValues },
        [envInfo.exports.ranking]: { value: rankingValues },
        [envInfo.exports.finder]: { value: filterValues },
        [envInfo.exports.languages]: { value: dialoguePicker },
        [envInfo.exports.purge]: { value: purgeValues },
        [envInfo.exports.fixer]: { value: validateJSON },
        [envInfo.exports.remove]: { value: removeValues },
        [envInfo.exports.fixdb]: { value: fixDatabase },
        [envInfo.exports.custom]: { value: customCommand },
        [envInfo.exports.get]: { value: getValues },
        [envInfo.exports.keywords]: { value: getKeyword },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, anotherData, dirname);
resetLocal();
