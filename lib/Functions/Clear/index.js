/* Requires */
const fs = require('fs');

/* JSON */
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

/* Função de apagar arquivos e pastas */
function destroyPlace(
    placeDel = envInfo.functions.destroy.arguments.placeDel.value,
    timedDel = envInfo.functions.destroy.arguments.timedDel.value,
) {
    /* Define o resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se os valores estão corretos */
        if (typeof placeDel === 'string' && typeof timedDel === 'number') {
            /* Checa se o local existe e determina o tipo de limpeza */
            if (fs.existsSync(placeDel)) {
                /* Define o tipo de edição padrão */
                const startClear = (fs.lstatSync(placeDel).isDirectory() === true
                    /* Caso seja um diretório */
                    ? fs.rmSync
                    /* Caso seja um arquivo */
                    : fs.unlinkSync
                );

                /* Define a limpeza... */
                setTimeout(() => {
                    /* Função de limpeza */
                    startClear(placeDel, envInfo.parameters.params.value);

                    /* Define o nome do arquivo removido */
                    envInfo.results.value = placeDel;

                    /* ...Baseada no tempo enviado em MS */
                }, Number(timedDel));
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o resultado */
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

        /* Insere a destroyPlace na envInfo */
        envInfo.functions.destroy.value = destroyPlace;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.destroy]: envInfo.functions.destroy.value,
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
