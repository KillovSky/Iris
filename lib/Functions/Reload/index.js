/* eslint-disable max-len */
/* Requires */
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const Indexer = require('../../index');

/* JSON */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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
                ignored: (locarel) => {
                    /* Normaliza barras (Windows -> Unix) */
                    const normalizedPath = locarel.replace(/\\/g, '/');

                    /* Ignora arquivos que NÃO terminam com .js ou .json */
                    if (/^.*\.(?!js|json$)[^.]+$/.test(locarel)) return true;

                    /* Pastas a ignorar (verifica se o caminho contém algum desses padrões) */
                    const ignoredFolders = envInfo.settings.ignore.value;

                    /* Retorna a verificação dos dados */
                    return ignoredFolders.some((folder) => normalizedPath.includes(folder));
                },
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

                        /* Limpa a Indexer */
                        /* eslint-disable-next-line no-underscore-dangle */
                        Indexer._internal.clearCache();

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
        [envInfo.exports.watcher]: { value: startMonitore },
        [envInfo.exports.stopwatch]: { value: stopMonitore },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.reset]: { value: resetLocal },
    },
    parameters: {
        location: { value: __filename },
        already: { value: monitoredFiles },
        choks: { value: chokExecs },
    },
}, envFile, changeKey, dirname);
resetLocal();
