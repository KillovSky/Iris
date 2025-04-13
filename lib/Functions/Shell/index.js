/* Requires */
const child = require('child_process');
const fs = require('fs');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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
    changeKey = {},
    envFile = envInfo,
    dirname = __dirname,
) => module.exports = logging.resetAmbient({
    functions: {
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.liner]: { value: getRandomLine },
        [envInfo.exports.bash]: { value: execShell },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
