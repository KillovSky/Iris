/* Imports */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

/* Define as funções base */
const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

/* JSON */
const envInfo = JSON.parse(fs.readFileSync(`${thisDir}/utils.json`));

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
        logging.echoError(error, envInfo, thisDir);
    }

    /* Retorna o resultado */
    return logging.postResults(envInfo);
}

/**
 * Restaura o ambiente e atualiza as exportações do módulo com a funcionalidade principal
 * @param {Object} [changeKey={}] - Chaves personalizadas para atualizar o envInfo
 * @param {Object} [envFile=envInfo] - Objeto com informações do ambiente
 * @param {string} [dirname=thisDir] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    changeKey = {},
    envFile = envInfo,
    dirname = thisDir,
) => logging.resetAmbient({
    functions: {
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.destroy]: { value: destroyPlace },
    },
    parameters: {
        location: { value: thisFile },
    },
}, envFile, changeKey, dirname);

/* Exporta todas as funções */
export default resetLocal();
