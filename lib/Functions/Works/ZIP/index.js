/* Requires */
const fs = require('fs');
const Indexer = require('../../../index');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let execInterval = false;

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Função que limpa a pasta de backups */
function clearBackupFolder() {
    /* Define o objeto de retorno com padrão inicial */
    const backupObject = {
        value: false,
        success: false,
    };

    /* Try-Catch para lidar com erros */
    try {
        /* Limpa os backups conforme o limite definido pelo proprietário */
        const backFiles = fs.readdirSync(envInfo.parameters.backupFolder.value);

        /* Retorna se o número de backups ultrapassar o limite estabelecido */
        if (backFiles.length > envInfo.parameters.maxBackups.value) {
            /* Calcula quantos backups precisam ser removidos */
            const backToRemove = (backFiles.length - Number(envInfo.parameters.maxBackups.value));

            /* Filtra os backups mais antigos */
            const filesToRemove = Indexer('recent').sort(envInfo.parameters.backupFolder.value, backToRemove, true).value;

            /* Remove o arquivo readme da lista */
            backupObject.value = filesToRemove.filter((file) => file !== 'readme.txt');

            /* Remove um a um */
            backupObject.value.forEach((backupFile) => {
                /* Chama a função de exclusão */
                Indexer('clear').destroy(`${envInfo.parameters.backupFolder.value}/${backupFile}`, 100);
            });
        }

        /* Se der erros */
    } catch (error) {
        /* Insere a mensagem de erro no objeto de retorno */
        backupObject.value = error.message;

        /* Define falha como verdadeira */
        backupObject.success = false;
    }

    /* Incrementa o número de tarefas concluídas na inicialização */
    global.tasksComplete += 1;

    /* Retorna os resultados processados */
    return backupObject;
}

/* Função responsável por realizar o backup */
function createBackupZIP() {
    /* Obtém a data atual formatada */
    const formattedDate = new Date().toLocaleString().replace(/(:|\/)/g, '-');

    /* Exibe a primeira mensagem */
    console.log(Indexer('color').echo('[BACKUP]', 'green').value, Indexer('color').echo(`→ ${Indexer('sql').languages(region, 'Backups', 'Start', true, true, envInfo).value}`, 'yellow').value);

    /* Executa o comando de backup */
    const backupCommand = Indexer('shell').bash(`bash -c "find ./lib/Databases \\( -name '*.json' -o -name '*.db' \\) | zip '${envInfo.parameters.backupFolder.value}/${formattedDate}.zip' -@"`);

    /* Se houver algum erro */
    if (backupCommand.success === false) {
        /* Exibe a terceira mensagem */
        console.log(Indexer('color').echo('[BACKUP]', 'red').value, Indexer('color').echo(`→ ${Indexer('sql').languages(region, 'Backups', 'Error', true, true, envInfo).value} → "${backupCommand.value.replace(/\n/g, ' | ')}"`, 'yellow').value);

        /* Se os backups foram feitos */
    } else {
        /* Exibe a segunda mensagem */
        console.log(Indexer('color').echo('[BACKUP]', 'green').value, Indexer('color').echo(`→ ${Indexer('sql').languages(region, 'Backups', 'Success', true, true, envInfo).value}`, 'yellow').value);
    }
}

/* Função que inicia o backup */
function initiateBackup() {
    /* Define o sucesso como falso por padrão */
    envInfo.results.success = false;

    /* Try-Catch para lidar com erros */
    try {
        /* Executa apenas se o proprietário permitir backups */
        if (envInfo.parameters.enableBackups.value === true) {
            /* Inicia o backup imediatamente */
            createBackupZIP();

            /* Repete a cada intervalo de tempo definido pelo usuário */
            execInterval = setInterval(createBackupZIP, envInfo.parameters.backupTime.value);
            envInfo.results.value = execInterval;
        }

        /* Define o sucesso como verdadeiro */
        envInfo.results.success = true;

        /* Se der erro */
    } catch (error) {
        /* Insere informações de erro na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Incrementa o número de tarefas concluídas na inicialização */
    global.tasksComplete += 1;

    /* Retorna os resultados processados */
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
        [envInfo.exports.create]: { value: createBackupZIP },
        [envInfo.exports.runner]: { value: initiateBackup },
        [envInfo.exports.clear]: { value: clearBackupFolder },
    },
    parameters: {
        location: { value: __filename },
        results: { value: execInterval },
    },
}, envFile, changeKey, dirname);
resetLocal();
