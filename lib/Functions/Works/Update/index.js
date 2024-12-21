/* Requires */
const axios = require('axios');
const fs = require('fs');
const Indexer = require('../../../index');
const pack = require('../../../../package.json');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
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

        /* Insere a startChecking na envInfo */
        envInfo.functions.check.value = startChecking;

        /* Insere a getVersion na envInfo */
        envInfo.functions.get.value = getVersion;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Define o interval novamente */
        envInfo.results.value = versionCheck;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.check]: envInfo.functions.check.value,
                [envInfo.exports.get]: envInfo.functions.get.value,
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
