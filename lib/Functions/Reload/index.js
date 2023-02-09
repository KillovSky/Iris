/* Requires */
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

/* JSON */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Define os arquivos já em monitoramento, fora da envInfo, para caso de resetar */
let monitoredFiles = [];
const chokExecs = {};

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
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
        console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →\x1B[39m`, `\x1b[33m${envInfo.parameters.message.value}\x1B[39m`);
    }

    /* Retorna o erro */
    return envInfo.results.success;
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
        /* Define se já foi iniciado */
        if (!monitoredFiles.includes(watchList)) {
            /* Verifica se o local existe */
            if (fs.existsSync(watchList)) {
                /* Inicia o monitoramento */
                const watchedFolder = chokidar.watch(watchList, {
                    ignored: envInfo.settings.ignore.value.concat(/^.*\.(?!js|json$)[^.]+$/),
                    ignoreInitial: true,
                });

                /* Em caso de mudanças */
                watchedFolder.on('change', (filename) => {
                    /* Para o recarregamento se configurado para isso */
                    if (envInfo.settings.enabling.value !== false) {
                        /* Verifica se o require contém o arquivo a recarregar */
                        if (Object.keys(require.cache).includes(path.resolve(filename))) {
                            /* Se o dono permitir mostrar as funções */
                            if (envInfo.settings.logconsole.value === true) {
                                /* Printa na tela que vai recarregar */
                                console.log('\x1b[31m[EDIÇÃO] →\x1B[39m \x1b[33mDetectei uma edição de arquivo require, recarregando arquivo...\x1B[39m');
                            }

                            /* Deleta o cache do módulo */
                            delete require.cache[require.resolve(path.resolve(filename))];

                            /* Realiza o require dele novamente */
                            /* eslint-disable-next-line import/no-dynamic-require, global-require */
                            require(path.resolve(filename));

                            /* Se o dono permitir mostrar as funções */
                            if (envInfo.settings.logconsole.value === true) {
                                /* Printa na tela que recarregou */
                                console.log('\x1b[32m[EDIÇÃO] →\x1B[39m \x1b[33mProntinho! Testa, Testa!\x1B[39m');
                            }

                            /* Caso não possua um require */
                        } else {
                            /* Printa que editou */
                            console.log('\x1b[32m[EDIÇÃO] →\x1B[39m \x1b[33mO arquivo\x1B[39m', `\x1b[31m'${filename}'\x1B[39m \x1b[33m`, 'foi editado, mas ele não requer recarregamento...\x1B[39m');
                        }
                    }
                });

                /* Caso adicione um arquivo */
                watchedFolder.on('add', (what) => {
                    /* Se o dono permitir mostrar as funções */
                    if (envInfo.settings.logconsole.value === true) {
                        /* Printa na tela que recarregou */
                        console.log('\x1b[32m[ADDED] →\x1B[39m \x1b[33mAdicionado\x1B[39m', `\x1b[31m'${what}'\x1B[39m \x1b[33m,`, 'você já pode utilizar caso seja um comando...\x1B[39m');
                    }
                });

                /* Caso adicione uma pasta */
                watchedFolder.on('addDir', (what) => {
                    /* Se o dono permitir mostrar as funções */
                    if (envInfo.settings.logconsole.value === true) {
                        /* Printa na tela que recarregou */
                        console.log('\x1b[32m[ADDED] →\x1B[39m \x1b[33mCaso\x1B[39m', `\x1b[31m'${what}'\x1B[39m \x1b[33m`, 'seja um comando, ele já pode ser utilizado normalmente...\x1B[39m');
                    }
                });

                /* Caso apague um arquivo */
                watchedFolder.on('unlink', (what) => {
                    /* Se o dono permitir mostrar as funções */
                    if (envInfo.settings.logconsole.value === true) {
                        /* Printa na tela que recarregou */
                        console.log('\x1b[31m[REMOVED] →\x1B[39m \x1b[33mArquivo\x1B[39m', `\x1b[31m'${what}'\x1B[39m \x1b[33m`, 'foi removido, essa ação pode causar erros, cuidado...\x1B[39m');
                    }
                });

                /* Caso apague uma pasta */
                watchedFolder.on('unlinkDir', (what) => {
                    /* Se o dono permitir mostrar as funções */
                    if (envInfo.settings.logconsole.value === true) {
                        /* Printa na tela que recarregou */
                        console.log('\x1b[31m[REMOVED] →\x1B[39m \x1b[33mA pasta\x1B[39m', `\x1b[31m'${what}'\x1B[39m \x1b[33m`, 'foi removida, essa ação pode causar erros, cuidado...\x1B[39m');
                    }
                });

                /* Caso obtenha erros */
                watchedFolder.on('error', (error) => {
                    /* Insere tudo na envInfo */
                    echoError(error);

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
        }

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
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
        if (Object.keys(chokExecs).includes(stopWhat)) {
            /* Para o monitoramento e faz o restante */
            await chokExecs[stopWhat].close();

            /* Deleta da Object */
            delete chokExecs[stopWhat];

            /* Deleta da Array */
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
        echoError(error);
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
        envInfo.functions.messedup.value = echoError;

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
        echoError(error);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
