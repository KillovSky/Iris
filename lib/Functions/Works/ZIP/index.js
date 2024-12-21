/* Requires */
const fs = require('fs');
const Indexer = require('../../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
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

        /* Insere a createBackupZIP na envInfo */
        envInfo.functions.create.value = createBackupZIP;

        /* Insere a initiateBackup na envInfo */
        envInfo.functions.runner.value = initiateBackup;

        /* Insere a clearBackupFolder na envInfo */
        envInfo.functions.clear.value = clearBackupFolder;

        /* Insere a interval novamente */
        envInfo.results.value = execInterval;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.create]: envInfo.functions.create.value,
                [envInfo.exports.runner]: envInfo.functions.runner.value,
                [envInfo.exports.clear]: envInfo.functions.clear.value,
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
