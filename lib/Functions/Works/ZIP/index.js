/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');
const language = require('../../../Dialogues');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let execInterval = false;

/* Realiza funções de pós finalização */
function postResults(response) {
    /* Verifica se pode resetar a envInfo */
    if ((envInfo.settings.finish.value === true)
        || (envInfo.settings.ender.value === true
            && envInfo.results.success === false
        )
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
        /* Printa o erro */
        console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envInfo.results;
}

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Função que realiza o backup */
function createZIP() {
    /* Adquire a data de agora */
    const dateFormated = (new Date()
        /* Converte em Locale */
        .toLocaleString()

        /* Ajusta para poder criar um arquivo */
        .replace(/(:|\/)/g, '-')
    );

    /* Exibe a 1° mensagem */
    console.log(Indexer('color').echo('[BACKUP]', 'green').value, Indexer('color').echo(`→ ${language(region, 'Backups', 'Start', true, true)}`, 'yellow').value);

    /* Executa o comando de backup */
    const execBackup = Indexer('shell').bash(`bash -c "find . -path ./node_modules -prune -o -name '*.json' -o -name 'Users.db' | zip '${envInfo.parameters.backupFolder.value}/${dateFormated}.zip' -@"`);

    /* Caso der algum erro */
    if (execBackup.success === false) {
        /* Exibe a 3° mensagem */
        console.log(Indexer('color').echo('[BACKUP]', 'red').value, Indexer('color').echo(`→ ${language(region, 'Backups', 'Error', true, true)} → "${execBackup.value.replace(/\n/g, ' | ')}"`, 'yellow').value);

        /* Caso não der erro */
    } else {
        /* Exibe a 2° mensagem */
        console.log(Indexer('color').echo('[BACKUP]', 'green').value, Indexer('color').echo(`→ ${language(region, 'Backups', 'Success', true, true)}`, 'yellow').value);
    }
}

/* Função que permite iniciar o backup */
function backupNOW() {
    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Faz apenas se o dono autorizou o backup */
        if (envInfo.parameters.enableBackups.value === true) {
            /* Inicia o Backup */
            createZIP();

            /* Repete de hora em hora */
            execInterval = setInterval(createZIP, envInfo.parameters.backupTime.value);
            envInfo.results.value = execInterval;
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso der erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Aumenta as funções rodadas na inicialização */
    global.tasksComplete += 1;

    /* Retorna o dialogo */
    return postResults(envInfo.results);
}

/* Função que limpa a pasta de backups */
function clearBackups() {
    /* Define o padrão sem envInfo */
    const objectBackup = {
        value: false,
        success: false,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Limpa os backups conforme limite do dono */
        const readDirect = fs.readdirSync(envInfo.parameters.backupFolder.value);

        /* Retorna caso esteja no limite */
        if (readDirect.length > envInfo.parameters.maxBackups.value) {
            /* Calcula os backups que devem ser removidos */
            const howMuchRemove = (readDirect.length - Number(envInfo.parameters.maxBackups.value));

            /* Filtra os backups mais recentes */
            const filesRemoving = Indexer('recent').sort(envInfo.parameters.backupFolder.value, howMuchRemove, true).value;

            /* Filtra o arquivo readme */
            objectBackup.value = filesRemoving.filter((val) => val !== 'readme.txt');

            /* Roda um a um */
            objectBackup.value.forEach((erase) => {
                /* Envia pra função de deletar */
                Indexer('clear').destroy(`${envInfo.parameters.backupFolder.value}/${erase}`, 100);
            });
        }

        /* Caso der erro */
    } catch (error) {
        /* Insere a mensagem */
        objectBackup.value = error.message;

        /* Define falha */
        objectBackup.success = false;
    }

    /* Aumenta as funções rodadas na inicialização */
    global.tasksComplete += 1;

    /* Retorna o dialogo */
    return postResults(objectBackup);
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

        /* Insere a createZIP na envInfo */
        envInfo.functions.create.value = createZIP;

        /* Insere a backupNOW na envInfo */
        envInfo.functions.runner.value = backupNOW;

        /* Insere a clearBackups na envInfo */
        envInfo.functions.clear.value = clearBackups;

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
        echoError(error);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
