/* Importa requisitos */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
const commandExists = require('command-exists').sync;

/* Chama o Indexer para gerar variáveis globais */
/* eslint-disable-next-line no-unused-vars */
const Indexer = require('../index');

/* Define o arquivo de logging do dia */
const loggingFile = `${irisPath}/logs/${(new Date().toISOString()).replace(/:/gi, '-')}.log`;

/* Define se o log inicial foi feito */
let firstStart = true;

/**
 * Coleta informações detalhadas do sistema e do ambiente para ajudar na depuração.
 * @param {string} logFilePath - Caminho do arquivo de log onde as informações serão gravadas.
 * @param {Error} [error] - Objeto de erro opcional para capturar detalhes do erro.
 */
function logDebugInfo(logFilePath = loggingFile, error = null) {
    /* Garante que o diretório exista */
    const dir = path.dirname(logFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    /* Detecta a versão dos programas essenciais instalados */
    const getInstalledSoftwareVersions = () => {
        /* Faz em try para caso algo dê outro erro */
        try {
            /* Define uma Object com as versões */
            const versions = {
                nodeVersion: commandExists('node') ? execSync('node -v').toString().trim() : 'Not installed',
                npmVersion: commandExists('npm') ? execSync('npm -v').toString().trim() : 'Not installed',
                pythonVersion: commandExists('python') ? execSync('python --version').toString().trim() : 'Not installed',
            };

            /* Retorna elas */
            return versions;

            /* Se der erro obtendo */
        } catch (failure) {
            /* Manda um error para inserir no log */
            return { error: `Failed to retrieve software versions: ${failure?.message}` || 'CATCH MISSING INFO;' };
        }
    };

    /* Define os dados em uma POI */
    const systemInfo = {
        systemVersion: os.version(),
        logPath: logFilePath,
        architecture: os.arch(),
        memoryUsage: {
            process: process.memoryUsage(),
            systemFree: os.freemem(),
            systemTotal: os.totalmem(),
        },
        softwareVersions: getInstalledSoftwareVersions(),
        nodeVersion: process.version,
        otherInfo: {
            hostname: os.hostname(),
            platform: os.platform(),
            release: os.release(),
            uptime: os.uptime(),
            userInfo: os.userInfo(),
            networkInterfaces: os.networkInterfaces(),
            cpuUsage: os.cpus(),
        },
        errorDetails: error ? {
            message: error.message,
            stack: error.stack,
        } : null,
    };

    /* Define o log de erro */
    let logData = `\nError Details: ${error ? `Message: ${systemInfo.errorDetails.message}\nStack: ${systemInfo.errorDetails.stack}` : 'No error'}\n`;

    /* Define se deve fazer o log inicial */
    if (firstStart === true) {
        /* Dados iniciais do log */
        logData = `-------------------------\nPrivacy Note | Nota de Privacidade\n-------------------------\nAdiciona algumas informações vitais no arquivo para os devs analisarem a falha\nNão se preocupe, essas informações permanecem offline até você mesmo resolver enviar\nJamais postaremos, faremos upload ou qualquer coisa com esses dados! Não há nada pessoal aqui!\n-------------------------\nSystem Version: ${systemInfo.systemVersion}\nLog Path: ${systemInfo.logPath}\nArchitecture: ${systemInfo.architecture}\nMemory Usage (Process): ${JSON.stringify(systemInfo.memoryUsage.process, null, 2)}\nMemory Usage (System Free): ${systemInfo.memoryUsage.systemFree}\nMemory Usage (System Total): ${systemInfo.memoryUsage.systemTotal}\nNode.js Version: ${systemInfo.softwareVersions.nodeVersion}\nPython Version: ${systemInfo.softwareVersions.pythonVersion}\nNPM Version: ${systemInfo.softwareVersions.npmVersion}\nHostname: ${systemInfo.otherInfo.hostname}\nPlatform: ${systemInfo.otherInfo.platform}\nRelease: ${systemInfo.otherInfo.release}\nUptime: ${systemInfo.otherInfo.uptime}\nUser Info: ${JSON.stringify(systemInfo.otherInfo.userInfo, null, 2)}\nNetwork Interfaces: ${JSON.stringify(systemInfo.otherInfo.networkInterfaces, null, 2)}\nCPU Usage: ${JSON.stringify(systemInfo.otherInfo.cpuUsage, null, 2)}\n-------------------------\n\nError Details: ${error ? `Message: ${systemInfo.errorDetails.message}\nStack: ${systemInfo.errorDetails.stack}` : 'No error'}`;
    }

    /* Adiciona os dados no arquivo */
    fs.appendFileSync(logFilePath, logData);

    /* Define que o primeiro log já foi feito */
    firstStart = false;
}

/**
 * Obtém o caminho relativo entre o diretório de trabalho atual e o diretório de um script.
 *
 * @param {string} scriptDir O caminho absoluto onde o script está (geralmente `__dirname`).
 * @returns {{ folder: string, relative: string }} Um objeto com o nome da pasta e o local relativo.
 */
function getRelativePath(scriptDir) {
    /* Obtém o diretório de trabalho atual do processo */
    const currentDir = global.irisPath || process.cwd();

    /* Extrai o nome da pasta do caminho absoluto do script */
    const folderName = path.basename(scriptDir);

    /* Retorna o caminho relativo entre o diretório de trabalho atual e o diretório do script */
    const relativePath = path.relative(currentDir, scriptDir);

    /* Retorna o objeto desejado */
    return {
        folder: folderName,
        relative: relativePath,
    };
}

/**
 * Realiza um merge profundo (deep merge) entre duas objects, combinando recursivamente. \
 * PLACEHOLDER, USE ISSO NO LUGAR: Indexer('others').merge(obj, obj).value;
 *
 * @param {Object} target - O objeto destino que receberá as propriedades mescladas.
 * @param {Object} source - O objeto fonte de onde as propriedades serão copiadas.
 * @returns {Object} O objeto target modificado com as propriedades mescladas.
 *
 */
function deepMerge(target, source) {
    return Object.keys(source).reduce((result, key) => {
        const sourceValue = source[key];
        const targetValue = result[key];
        /* eslint-disable-next-line no-param-reassign */
        result[key] = (sourceValue instanceof Object && !Array.isArray(sourceValue)
            && targetValue instanceof Object && !Array.isArray(targetValue))
            ? deepMerge(targetValue, sourceValue)
            : sourceValue;
        return result;
    }, { ...target });
}

/**
 * Placeholder para geração via nodejs para aqueles que preferem fazer algo assim.
 * Função que gera um objeto de configuração envInfo para um sistema.
 * Aceita um objeto de configuração para sobrescrever os valores padrão.
 *
 * @param {Object} envData Objeto contendo os valores personalizados.
 * @returns {Object} O objeto envInfo com as propriedades de uma envInfo completa.
 * @example
 * const envData = {
 *   name: 'Ping',
 *   license: 'MIT',
 *   developer: 'Seu Nome',
 * };
 * const envInfo = envInfoGenerator(envData);
 * envInfo.name // 'Ping'
 * envInfo.license // 'MIT'
 */
function envInfoGenerator(envData = {}) {
    /* Define a config customizada definida em uma let */
    let customConfig = envData;

    /* Se caso não receber Object */
    customConfig = typeof envData === 'object' && envData !== null ? customConfig : {};

    /* Retorna os dados */
    return {
        name: customConfig.name || 'NomeDoComando (Nome da função)',
        description: customConfig.description || 'Descrição do comando',
        usage: {
            general: customConfig.usage?.general || '[Prefix][Alias] [Argumentos dele] (Valor se houver)',
            examples: customConfig.usage?.examples || [
                "NomeDoComando.execute('kill', 'params')",
                'NomeDoComando.env()',
                'NomeDoComando.reset()',
                "NomeDoComando.env().functions.execute.value('kill', 'params')",
            ],
        },
        license: customConfig.license || 'A licença que você quiser, recomendo deixar MIT',
        helps: customConfig.helps || [
            "Você pode mudar os parâmetros da exports enviando o valor da Object que deseja editar ao resetar, por exemplo → NomeDoComando.reset({ name: 'Body'}) ← Isso mudaria o module de NomeDoComando para Body, o uso então passaria ser: → Body.funcão ← Isso também permite que você edite a função usando o mesmo método.",
            "Você pode mudar o que os códigos rodam, em tempo real, basta usar a 'env', por exemplo → NomeDoComando.env().name = 'Body' ← Mas este método não atualizará o sistema, somente a Object, os sistemas permanecem intactos.",
            'Você pode configurar o tempo de reset dos resultados ou se eles devem ser resetados usando a env, por exemplo → NomeDoComando.env().settings.wait = 10000 ← Isso mudaria o tempo de espera para 10 segundos, o tempo deve ser em milissegundos.',
            'Alguém lê essas dicas? Se sim, torne-se um programador, ler os tutoriais é de suma importância e poucos desenvolvedores o fazem...',
            'Existem infinitas formas de uso secretas, explore os códigos para descobrir os mistérios dos sistemas!',
        ],
        exports: customConfig.exports || {
            env: 'env',
            messedup: 'messedup',
            reset: 'reset',
            poswork: 'finish',
        },
        developer: customConfig.developer || 'Seu Nome',
        files: customConfig.files || {
            'index.js': 'Sistema que faz a coleta das informações e envio.',
            'utils.json': 'Dados de fábrica da envInfo.',
        },
        modules: customConfig.modules || {
            fs: 'Leitura de diretórios e arquivos.',
            path: 'Para inserção do local na envInfo.',
            '../../index': 'Para rodar funções de outros arquivos.',
        },
        functions: customConfig.functions || {
            ambient: {
                arguments: false,
                description: 'Retorna as variáveis e sistemas do arquivo.',
                type: 'Boolean / Function',
                value: false,
            },
            messedup: {
                arguments: {
                    error: {
                        description: 'Instância de erro para formatação.',
                        type: 'Boolean / Error',
                        value: false,
                    },
                },
                description: 'Ajusta os valores de erro.',
                type: 'Boolean / Function',
                value: false,
            },
            poswork: {
                arguments: {
                    response: {
                        description: 'Resultados de uma função.',
                        type: 'Any',
                        value: false,
                    },
                },
                description: 'Verifica se pode resetar a envInfo e retorna o resultado da função.',
                type: 'Boolean / Function',
                value: false,
            },
            revert: {
                arguments: {
                    changeKey: {
                        description: 'Uma Object com valores que existem na envInfo, ela será usada para substituir o sistema em tempo real.',
                        type: 'Object value',
                        anyValue: false,
                    },
                },
                description: 'Reseta a envInfo para a Object padrão.',
                type: 'Boolean / Function',
                value: false,
            },
        },
        settings: customConfig.settings || {
            wait: {
                description: 'Tempo em MS que deve esperar antes de resetar.',
                type: 'Number',
                value: 5000,
            },
            error: {
                description: 'Define se pode printar qualquer erro.',
                type: 'Boolean',
                value: true,
            },
            ender: {
                description: 'Define se deve resetar a cada erro.',
                type: 'Boolean',
                value: true,
            },
            finish: {
                description: 'Define se deve resetar a cada finalização.',
                type: 'Boolean',
                value: true,
            },
        },
        parameters: customConfig.parameters || {
            location: {
                description: 'Local onde o módulo pode ser encontrado.',
                type: 'Boolean / String',
                value: './index',
            },
            code: {
                description: 'Código do erro que obter.',
                type: 'Boolean / String / Number',
                value: false,
            },
            message: {
                description: 'Armazena a mensagem do último erro recebido.',
                type: 'Boolean / String',
                value: false,
            },
        },
        results: customConfig.results || {
            description: 'Resultado final da função.',
            success: true,
            type: 'String / Boolean',
            value: false,
        },
    };
}

/**
 * Função para resetar/atualizar configurações de ambiente com base em um arquivo JSON ou objeto.
 * Permite a edição completa das configurações e inclui tratamento de erros robusto.
 *
 * @function resetAmbient
 * @param {Object} [changeKey={}] - Objeto contendo as chaves e valores a serem atualizados.
 * Estrutura deve ser similar a da `envData` em `envInfoGenerator`.
 *                                 Mas deve conter as seguintes chaves essenciais:
 *                                 - `name`: Nome do ambiente/projeto (string)
 *                                 - `parameters`: Objeto com parâmetros de configuração
 *                                 - `functions`: Objeto com funções do ambiente
 *                                 - `exports`: Objeto com exportações necessárias
 * @param {Object} jsonData - Objeto com as configs originais exportadas.
 * @param {Object} moreData - Mais uma object para merge, útil em função circular.
 * @param {string} dirfolder - Local de onde o sistema está executando a função.
 * @returns {Object} Retorna um objeto contendo:
 *                  - Todas as configurações atualizadas
 *                  - success: boolean indicando sucesso/fracasso
 *                  - error: null ou objeto de erro (se ocorrer)
 *
 * @throws {TypeError} Se os parâmetros não forem do tipo esperado
 * @throws {Error} Se houver falha ao ler/processar o arquivo de configuração
 *
 */
function resetAmbient(changeKey = {}, jsonData = {}, moreData = {}, dirfolder = false) {
    /* Define uma envInfo temporariamente */
    let envInfo = {};
    let dirStr = '';

    /* Uso com try, caso dê erros */
    try {
        /* Define como a envInfo será */
        if (typeof jsonData === 'object' && jsonData != null) {
            /* Se recebeu os dados prontos, usa eles */
            envInfo = envInfoGenerator(jsonData);

            /* Se for uma string */
        } else if (typeof dirfolder === 'string') {
            /* Para evitar crashes, roda em try-catch */
            try {
                /* Define o local do arquivo JSON */
                const filePath = `${dirfolder}/utils.json`;

                /* Se ele existir */
                if (fs.existsSync(filePath)) {
                    /* Abre dando parse */
                    envInfo = JSON.parse(fs.readFileSync(filePath));
                }

                /* Se falhar */
            } catch (error) {
                /* Faz um logging de erro simples e opcional */
                logging.echoError(error, envInfo, __dirname);
            }
        }
        dirStr = typeof dirfolder === 'string' ? dirfolder : 'SYS';

        /* Aplica as alterações se houver changeKey */
        envInfo = deepMerge(envInfo, changeKey);
        envInfo = deepMerge(envInfo, moreData);

        /* Indica sucesso na operação */
        envInfo.success = true;

        /* Em caso de erro qualquer */
    } catch (error) {
        /* Registra no objeto de retorno */
        envInfo.error = error;

        /* Opcional: loga o erro (comente se não quiser esse comportamento) */
        logging.echoError(error, envInfo, dirStr);
    }

    /* Constrói o retorno para módulo */
    const returnData = {};
    Object.keys(changeKey?.functions).forEach((data) => {
        returnData[data] = envInfo?.functions?.[data]?.value;
    });

    /* Retorna o objeto com os resultados */
    return {
        [envInfo?.name || 'Default']: {
            ...returnData,
        },
        Developer: envInfo?.Developer || 'KillovSky',
        Projects: envInfo?.Projects || 'https://github.com/KillovSky',
        envInfo,
    };
}

/**
 * Realiza funções de pós-finalização, incluindo a verificação e reset da `envData`.
 *
 * @param {Object} envData - O objeto que contém as configurações e dados do ambiente.
 * @returns {Object} O resultado das operações.
 */
function postResults(envData) {
    /* Verifica se pode resetar a envData */
    if (
        envData?.settings?.finish?.value === true
        || (envData?.settings?.ender?.value === true && envData?.results?.success === false)
    ) {
        /* setTimeout para poder retornar */
        setTimeout(() => {
            /* Reseta a envData */
            envData?.functions?.reset?.value();

            /* Reseta conforme o tempo */
        }, envData?.settings?.wait?.value || 5000);
    }

    /* Retorna o resultado de uma função */
    return envData?.results || {};
}

/**
 * Insere o erro na `envData`, define o código de erro e a mensagem, e faz o log do erro.
 *
 * @param {Error|any} errorInput - O erro a ser inserido na `envData`.
 * @param {Object} envData - O objeto que contém as configurações e dados do ambiente.
 * @param {string} place - O caminho atual do arquivo.
 * @returns {Object} O objeto `envData.results`, que contém o status do sucesso ou falha.
 */
function echoError(errorInput, envData, place) {
    /* Define a envLocal, para evitar erros de assignment */
    const envLocal = typeof envData === 'object' && envData !== null ? envData : {
        results: { success: false, value: false },
        settings: { error: { value: true }, fullError: { value: true } },
        parameters: { code: { value: '0' }, message: { value: 'Error' } },
    };

    /* Determina o erro */
    const myError = (!(errorInput instanceof Error)
        ? new Error(`Received a "${typeof errorInput}" in function 'messedup', expected an instance of "Error".`)
        : errorInput
    );

    /* Faz o logging de arquivo */
    logDebugInfo(loggingFile, myError);

    /* Determina o sucesso */
    envLocal.results.success = false;

    /* Determina a falha */
    envLocal.parameters.code.value = myError.code ?? '0';

    /* Determina a mensagem de erro */
    envLocal.parameters.message.value = myError.message ?? 'The operation cannot be completed because an unexpected error occurred.';

    /* Define se pode printar erros */
    if (envLocal.settings.error.value === true) {
        /* Define se vai printar inteiro */
        const showError = envLocal.settings.fullError?.value || true;

        /* Se pode printar o erro inteiro */
        if (showError) {
            /* Só joga o erro na tela */
            console.error(myError);

            /* Se não, formata e printa */
        } else console.log('\x1b[31m', `[${path.basename(place)} #${envLocal.parameters.code.value || 0}] →`, `\x1b[33m${envLocal.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envLocal.results;
}

/* Define globalmente */
global.logging = {
    resetAmbient,
    echoError,
    postResults,
    envInfoGenerator,
    getRelativePath,
};

/* Exporta */
module.exports = {
    resetAmbient,
    echoError,
    postResults,
    envInfoGenerator,
    getRelativePath,
};
