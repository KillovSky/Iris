/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* Imports */
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Indexer from '../../index.js';

/* Define as funções __dirname e __filename com equivalentes em ESM */
const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

/* JSON */
const envInfo = JSON.parse(fs.readFileSync(`${thisDir}/utils.json`));

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
            watchedFolder.on('change', async (filename) => {
                /* Continua o recarregamento se configurado para isso */
                if (envInfo.settings.enabling.value !== false) {
                    /* Verifica se é um arquivo JavaScript */
                    if (filename.endsWith('.js')) {
                        /* Obtém o nome do módulo a partir do caminho do arquivo */
                        const moduleName = Indexer._internal.getModuleNameFromFilePath(path.join(irisPath, filename));

                        /* Verifica se o módulo existe no mapeamento interno antes de recarregar */
                        const cacheStats = Indexer._internal.getCacheStats();
                        const moduleExists = cacheStats.mappedNames.has(moduleName);
                        if (!moduleExists) {
                            logEvent('SKIPPED', filename, 'Módulo não está mapeado no sistema, ignorando recarregamento...');
                            return;
                        }

                        /* Faz o log de edição */
                        logEvent('CHANGE', filename, 'Detectei uma edição de arquivo, solicitando recarregamento via Indexer...');

                        /* Tenta recarregar dentro de sistemas seguros */
                        try {
                            /* Limpa o cache específico deste arquivo na Indexer */
                            Indexer._internal.clearCache(moduleName);

                            /* Força recarregamento via Indexer */
                            Indexer.controlSystem(moduleName);

                            /* Avisa que pode usar */
                            logEvent('OK!', filename, 'Recarregamento de CACHE concluído com sucesso, note que ESM pode exigir reinicialização do programa inteiro!');

                            /* Em caso de qualquer erro, faz um */
                        } catch (error) {
                            /* Log do erro */
                            logEvent('ERROR', filename, `Erro ao recarregar via Indexer: ${error.message}`);
                        }

                        /* Para arquivos não-JS */
                    } else {
                        /* Faz log do evento */
                        logEvent('MODIFIED', filename, 'O arquivo foi editado, verificando se há protocolos de recarregamentos especiais...');

                        /* Verifica se é config.json */
                        if (filename.endsWith('config.json')) {
                            /* Se for a config, tenta dar parse de forma segura */
                            try {
                                /* Usando fs e JSON.parse para ler o JSON */
                                const configContent = fs.readFileSync(filename, 'utf8');
                                const configData = JSON.parse(configContent);

                                /* Aplicando na global */
                                global.config = configData;

                                /* Solta alerta de evento */
                                logEvent('CONFIG UPDATED', filename, 'Configurações globais atualizadas com sucesso!');

                                /* Se der erro, avisa */
                            } catch (error) {
                                logEvent('ERROR', filename, `Erro ao carregar config.json: ${error.message}`);
                            }

                            /* Ou APIs.json para aplicar as mudanças */
                        } else if (filename.endsWith('APIs.json')) {
                            /* Se for a config, tenta dar parse de forma segura */
                            try {
                                /* Usando fs e JSON.parse para ler o JSON */
                                const apisContent = fs.readFileSync(filename, 'utf8');
                                const apisData = JSON.parse(apisContent);

                                /* Aplicando na global */
                                global.APIs = apisData;

                                /* Solta alerta de evento */
                                logEvent('APIs UPDATED', filename, 'APIs globais atualizadas com sucesso!');

                                /* Se der erro, avisa */
                            } catch (error) {
                                logEvent('ERROR', filename, `Erro ao carregar APIs.json: ${error.message}`);
                            }
                        }
                    }
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
                logging.echoError(error, envInfo, thisDir);

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
        logging.echoError(error, envInfo, thisDir);
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
        logging.echoError(error, envInfo, thisDir);
    }

    /* Retorna que não tem nada a parar */
    return envInfo.results.success;
}

/* Reset profundo para evitar circular */
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
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.watcher]: { value: startMonitore },
        [envInfo.exports.stopwatch]: { value: stopMonitore },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.reset]: { value: resetLocal },
    },
    parameters: {
        location: { value: thisFile },
        already: { value: monitoredFiles },
        choks: { value: chokExecs },
    },
}, envFile, changeKey, dirname);

/* Exporta todas as funções */
export default resetLocal();
