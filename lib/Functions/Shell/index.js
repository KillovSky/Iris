/* Requires */
const child = require('child_process');
const fs = require('fs');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Função que executa comandos via shell */
function execShell(
    termComma = envInfo.functions.bash.arguments.termComma.value,
    stdinData = null,
) {
    /* Essa função não usa envInfo pois pode ser demorada */
    const resultParse = {
        success: false,
        value: false,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Se stdinData for fornecido, configure a entrada padrão para 'pipe' e envie os dados */
        const options = {
            encoding: 'utf8',
            stdio: stdinData ? ['pipe', 'pipe', 'pipe'] : 'pipe',
            input: stdinData,
        };

        /* Executa o comando shell com a entrada padrão redirecionada, se fornecida */
        resultParse.value = child.execSync(termComma, options);

        /* Define como bem sucedido */
        resultParse.success = true;

        /* Se houver algum erro */
    } catch (error) {
        /* Define o sucesso */
        resultParse.success = false;

        /* Insere a mensagem de valor */
        resultParse.value = error.message;

        /* Printa no console */
        console.log(resultParse.value);
    }

    /* Retorna o dialogo */
    return resultParse;
}

/* Função que pega uma linha aleatória de texto */
function getRandomLine(
    linesGet = envInfo.functions.liner.arguments.linesGet.value,
    fileTexts = envInfo.functions.liner.arguments.fileTexts.value,
    customSearch = envInfo.functions.liner.arguments.customSearch.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = ['This is a default text, this only appears when parse receives some error.'];

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define o comando a executar */
        let defaultSh = `bash -c "shuf -n '${linesGet}' '${fileTexts}'"`;
        defaultSh = typeof customSearch === 'string' ? `bash -c "grep -Ri '${customSearch}' '${fileTexts}' | shuf -n '${linesGet}'"` : defaultSh;

        /* Faz a execução usando execShell */
        const shellResult = execShell(defaultSh);

        /* Verifica se a execução foi bem sucedida */
        if (shellResult.success) {
            /* Insere as linhas aleatórias */
            envInfo.results.value = (shellResult.value.split('\n')
                .map((line) => line.replace(/\r/gi, ''))
                .filter((line) => line !== '')
            );

            /* Define o sucesso */
            envInfo.results.success = true;

            /* Se deu qualquer erro */
        } else {
            /* Insere a mensagem de erro na envInfo */
            envInfo.results.value = shellResult.value;

            /* Define o sucesso */
            envInfo.results.success = false;
        }

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
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

        /* Insere a getOneValue na envInfo */
        envInfo.functions.liner.value = getRandomLine;

        /* Insere o execShell na envInfo */
        envInfo.functions.bash.value = execShell;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.liner]: envInfo.functions.liner.value,
                [envInfo.exports.bash]: envInfo.functions.bash.value,
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
