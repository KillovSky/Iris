/* Requires */
const axios = require('axios');
const fs = require('fs');
const Indexer = require('../../../index');
const pack = require('../../../../package.json');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let versionCheck = false;

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Função responsável por receber a transmissão de versão */
async function getVersion() {
    /* Define o sucesso como falso por padrão */
    envInfo.results.success = false;

    /* Try-Catch, para caso de erro */
    try {
        /* Só adquire se o dono permitiu */
        if (envInfo.parameters.enableChecker.value) {
            /* Faz a requisição */
            const packVersion = await axios.get('https://raw.githubusercontent.com/KillovSky/Iris/main/package.json');

            /* Verifica se as versões estão atualizadas */
            if (
                pack.version === packVersion.data.version
                && pack.build_date === packVersion.data.build_date
                && pack.build_name === packVersion.data.build_name
            ) {
                /* Parabeniza o dono por manter o sistema atualizado */
                console.log(Indexer('color').echo('[UPDATE]', 'green').value, Indexer('color').echo(Indexer('sql').languages(region, 'Updates', 'Updated', true, true, envInfo).value, 'yellow').value);

                /* Se elas não forem iguais */
            } else {
                /* Diz sobre uma atualização disponível */
                console.log(Indexer('color').echo('[UPDATE]', 'red').value, Indexer('color').echo(`${Indexer('sql').languages(region, 'Updates', 'Available', true, true, envInfo).value} → [${packVersion.data.version} ~ ${packVersion.data.build_name.toUpperCase()} ~ ${packVersion.data.build_date.toUpperCase()}] | ${packVersion.data.homepage}`, 'yellow').value);
            }

            /* Caso tenha executado uma vez */
        } else {
            /* Para de executar */
            clearInterval(versionCheck);
        }

        /* Se der algum erro */
    } catch (error) {
        /* Insere informações de erro na envInfo */
        logging.echoError(error, envInfo, __dirname);

        /* Para de executar a checagem */
        clearInterval(versionCheck);
    }

    /* Define o sucesso como verdadeiro */
    envInfo.results.success = true;

    /* Retorna os resultados */
    return envInfo.results;
}

/* Função que inicia a verificação de versão */
function startChecking() {
    /* Adquire a primeira transmissão */
    getVersion().then((res) => {
        /* Incrementa o número de tarefas concluídas na inicialização */
        global.tasksComplete += 1;

        /* Repete de tempo em tempo */
        versionCheck = setInterval(getVersion, Number(envInfo.parameters.checkInterval.value));

        /* Retorna os resultados processados */
        return res;
    });
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
        [envInfo.exports.check]: { value: startChecking },
        [envInfo.exports.get]: { value: getVersion },
    },
    parameters: {
        location: { value: __filename },
        results: { value: versionCheck },
    },
}, envFile, changeKey, dirname);
resetLocal();
