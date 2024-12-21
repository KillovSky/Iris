/* eslint-disable max-len */
/* Requires */
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const Indexer = require('../../index');

/* JSON */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Define os arquivos já em monitoramento, fora da envInfo, para caso de resetar */
let monitoredFiles = [];
const chokExecs = {};

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Função para log de eventos */
function logEvent(eventType, what, message) {
    /* Se permite */
    if (envInfo.settings.logconsole.value === true) {
        /* Printa */
        console.log(
            '[',
            Indexer('color').echo(what, 'brightGreen').value,
            Indexer('color').echo(`| ${eventType}`, 'brightRed').value,
            ']',
            '→',
            Indexer('color').echo(message, 'brightYellow').value,
        );
    }
}

/*
    Função que recarrega os arquivos em casos de mudanças em tempo real.
    Não recomendado para longos usos, apenas para quando você quer editar e testar em tempo real.
*/
function startMonitore(
    watchList = envInfo.settings.monitore.value,
) {
    /* Reseta a success */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se o local existe */
        if (!monitoredFiles.includes(watchList) && fs.existsSync(watchList)) {
            /* Inicia o monitoramento */
            const watchedFolder = chokidar.watch(watchList, {
                ignored: envInfo.settings.ignore.value.concat(/^.*\.(?!js|json$)[^.]+$/),
                ignoreInitial: true,
            });

            /* Mapeia os eventos de adição e remoção */
            const eventMappings = {
                add: { eventType: 'ADDED FILE', message: 'Novo arquivo inicializado, ele já pode ser utilizado normalmente...' },
                addDir: { eventType: 'ADDED DIR', message: 'Nova pasta inserida, ela já pode ser utilizada normalmente...' },
                unlink: { eventType: 'PURGE FILE', message: 'Arquivo removido do sistema, essa ação pode causar erros, cuidado...' },
                unlinkDir: { eventType: 'PURGE DIR', message: 'Pasta removida do sistema, essa ação pode causar erros, cuidado...' },
            };

            /* Em caso de mudanças */
            watchedFolder.on('change', (filename) => {
                /* Continua o recarregamento se configurado para isso */
                if (envInfo.settings.enabling.value !== false) {
                    /* Verifica se o require contém o arquivo a recarregar */
                    if (Object.keys(require.cache).includes(path.resolve(filename))) {
                        /* Faz o log de edição */
                        logEvent('CHANGE', filename, 'Detectei uma edição de arquivo require, recarregando sistemas...');

                        /* Deleta o cache do módulo */
                        delete require.cache[require.resolve(path.resolve(filename))];

                        /* Realiza o require dele novamente */
                        /* eslint-disable-next-line import/no-dynamic-require, global-require */
                        require(path.resolve(filename));

                        /* Avisa que pode usar */
                        logEvent('OK!', filename, 'Arquivo recarregado! Testa, Testa!');

                        /* Se não tem o arquivo no require, diz que editou, mas tá sem uso */
                    } else logEvent('MODIFIED', filename, 'O arquivo foi editado, mas ele não requer recarregamento...');
                }
            });

            /* Adiciona listeners para eventos de adição e remoção */
            ['add', 'addDir', 'unlink', 'unlinkDir'].forEach((event) => {
                /* Se algum acontecer, printa no console */
                watchedFolder.on(event, (what) => logEvent(eventMappings[event].eventType, what, eventMappings[event].message));
            });

            /* Caso obtenha erros */
            watchedFolder.on('error', (error) => {
                /* Insere tudo na envInfo */
                logging.echoError(error, envInfo, __dirname);

                /* Retorna um valor */
                return envInfo.results.success;
            });

            /* Define o monitor na chokExecs */
            chokExecs[watchList] = watchedFolder;

            /* Insere na lista dos arquivos já monitorados, para evitar duplicidade */
            monitoredFiles.push(watchList);

            /* Insere na envInfo */
            envInfo.parameters.already.value = monitoredFiles;

            /* Insere as funções na envInfo para poder usar o close */
            envInfo.parameters.choks.value = chokExecs;

            /* Define como sucesso */
            envInfo.results.success = true;
        }

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Aumenta as funções rodadas na inicialização */
    global.tasksComplete += 1;

    /* Retorna false como sinal de já ter */
    return envInfo.results.success;
}

/* Para o monitoramento */
async function stopMonitore(
    stopWhat = monitoredFiles[0],
) {
    /* Reseta a success */
    envInfo.results.success = false;

    /* Try-Catch para caso de erro */
    try {
        /* Verifica se o monitor contém o que vai parar */
        if (chokExecs[stopWhat]) {
            /* Para o monitoramento e faz o restante */
            await chokExecs[stopWhat].close();

            /* Deleta da Object e da Array */
            delete chokExecs[stopWhat];
            monitoredFiles = monitoredFiles.filter((mnt) => mnt !== stopWhat);

            /* Refaz a envInfo */
            envInfo.parameters.already.value = monitoredFiles;
            envInfo.parameters.choks.value = chokExecs;

            /* Se o dono permitir mostrar as funções */
            if (envInfo.settings.logconsole.value === true) {
                /* Printa na tela que recarregou */
                console.log('\x1b[31m[STOP] →\x1B[39m \x1b[33mO arquivo ou pasta\x1B[39m', `\x1b[31m'${stopWhat}'\x1B[39m \x1b[33m`, 'não está mais em monitoramento...\x1B[39m');
            }

            /* Define como sucesso */
            envInfo.results.success = true;
        }

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna que não tem nada a parar */
    return envInfo.results.success;
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

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Define a monitoreFile na envInfo */
        envInfo.functions.watcher.value = startMonitore;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

        /* Define a stopMonitore na envInfo */
        envInfo.functions.stopwatch.value = stopMonitore;

        /* Define a reset na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Define o local completo na envInfo novamente */
        envInfo.parameters.location.value = __filename;

        /* Insere a Array na envInfo */
        envInfo.parameters.already.value = monitoredFiles;

        /* Insere a Object na envInfo */
        envInfo.parameters.choks.value = chokExecs;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.watcher]: envInfo.functions.watcher.value,
                [envInfo.exports.stopwatch]: envInfo.functions.stopwatch.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
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
