/* eslint-disable max-len */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

/* Requires - Importações essenciais para o funcionamento do módulo */
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { pathToFileURL } = require('url');
const { LRUCache } = require('lru-cache');

/**
 * Log de performance padronizado
 * @param {string} type - Tipo de carregamento
 * @param {string} pathy - Caminho do módulo
 * @param {number} start - Timestamp de início
 */
function logPerformance(type, pathy, start) {
    const time = (performance.now() - start).toFixed(2);
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    if (global?.config?.logIndexer?.value) console.debug(`[${type} LOAD] ${pathy} - ${time}ms | ${memory} MB`);
}

/**
 * Carrega arquivos de configuração com tratamento de erros e retentativas
 * @param {string} configPath - Caminho do arquivo de configuração
 * @returns {object} Objeto JSON carregado
 * @throws {Error} Se o arquivo não puder ser carregado após retentativas
 */
function loadConfigWithRetry(configPath, retries = 3, delay = 100) {
    /* Tenta dar parse no JSON */
    try {
        return JSON.parse(fs.readFileSync(configPath));

        /* Se der qualquer errinho */
    } catch (err) {
        /* E tentativas ainda for superior a zero */
        if (retries > 0) {
            /* Avisa da tentativa */
            if (global?.config?.logIndexer?.value) console.warn(`[CONFIG] Retentativa para carregar ${configPath}...`);

            /* Espera um certo tempo */
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay);

            /* Tenta de novo */
            return loadConfigWithRetry(configPath, retries - 1, delay * 2);
        }

        /* Dropa um erro se não conseguir carregar mesmo após tantas tentativas */
        throw new Error(`Falha ao carregar configuração: ${configPath}`);
    }
}

/**
 * Cache de módulos com política LRU (Least Recently Used), mais eficiente que um Map simples.
 *
 * @constant
 * @type {LRU}
 * @property {number} max - Número máximo de itens no cache.
 * @property {number} maxSize - Tamanho máximo do cache em bytes.
 * @property {function} sizeCalculation - Função que calcula o tamanho de cada item em bytes.
 * @property {number} ttl - Tempo de vida dos itens no cache (em milissegundos).
 *
*/
const commandCache = new LRUCache({
    max: 100,
    maxSize: 50 * 1024 * 1024,
    sizeCalculation: (value) => JSON.stringify(value).length,
    ttl: 1000 * 60 * 15,
});

/* JSON's | Utilidades - Arquivos de configuração com carregamento seguro */
const commandPlaces = loadConfigWithRetry('./lib/Databases/Configurations/symlinks.json');

/* Configurações globais - Carregamento seguro com fallback */
global.config = global.config || loadConfigWithRetry('./lib/Databases/Configurations/config.json');
global.irisPath = global.irisPath || process.cwd();
global.region = global.region || 'pt';
global.logging = global.logging || require('./Initialize/logging');

/**
 * Valida e sanitiza nomes de comandos para prevenir injeção
 * @param {string} commandName - Nome do comando a ser validado
 * @returns {string} Nome sanitizado
 */
function validateCommandName(commandName) {
    if (typeof commandName !== 'string') return 'Default';
    return commandName.replace(/[^a-z0-9_-]/gi, '').toLowerCase();
}

/**
 * Junção segura de caminhos para prevenir directory traversal
 * @param {string} base - Caminho base
 * @param {...string} paths - Partes do caminho
 * @returns {string} Caminho seguro
 * @throws {Error} Se tentativa de directory traversal for detectada
 */
function safePathJoin(base, ...paths) {
    /* Sanitiza os paths por meio de mapear seus locais */
    const sanitizedPaths = paths.map((p) => {
        /* Primeiro: Normalização */
        const normalized = path.normalize(p);

        /* Se tiver um exploit de ataque */
        if (normalized.match(/(^|\/)\.\.($|\/)/)) {
            /* Dropa um erro dizendo que é exploit */
            throw new Error('[Directory Traversal] NOT ALLOWED OPERATION! DANGER!');
        }

        /* Retorna normalizado */
        return normalized;
    });

    /* Define os paths corretos, sanitizados e resolvidos */
    const fullPath = path.resolve(base, ...sanitizedPaths);
    const resolvedBase = path.resolve(base);

    /* Verificação mais rigorosa de caminho seguro */
    if (!fullPath.startsWith(resolvedBase)) {
        /* Vai que tenta acessar via classico .. no meio do local, pode causar vunerabilidades */
        throw new Error(`Tentativa de acesso a caminho não permitido: ${fullPath}`);
    }

    /* Retorna o local completo e corrigido */
    return fullPath;
}

/**
 * Atualiza o arquivo symlinks.json com novos comandos de forma atômica
 * @param {string} commandName - Nome do novo comando
 * @throws {Error} Se a escrita falhar
 */
function updateSymlinks(commandName) {
    /* Define os locais de JSON corretos */
    const tempPath = './lib/Databases/Configurations/symlinks.temp.json';
    const finalPath = './lib/Databases/Configurations/symlinks.json';

    /* Define os dados que vai salvar */
    commandPlaces[commandName] = {
        alias: [commandName],
        place: `./Functions/${commandName}`,
    };

    /* Escrita atômica para prevenir corrupção de arquivo */
    fs.writeFileSync(tempPath, JSON.stringify(commandPlaces, null, 4));

    /* Ai é só renomear para o nome correto */
    fs.renameSync(tempPath, finalPath);
}

/**
 * Lida com comandos não mapeados com cache local
 * @param {string} commandName - Nome do comando
 * @returns {Array<string>} Nome da pasta do comando
 */
function handleUnmappedCommand(commandName) {
    /* Cache local para evitar I/O repetido e mais consumo */
    if (handleUnmappedCommand.cache.has(commandName)) {
        /* Retorna os dados via cache */
        return handleUnmappedCommand.cache.get(commandName);
    }

    /* Define o let que armazenará o diretorio temporariamente */
    let tempFolders = [];

    /* Tenta via try catch para caso o local seja restrito ou dê erros */
    try {
        /* Faz a leitura dos nomes de pastas */
        tempFolders = (fs.readdirSync('./lib/Functions')
            .map((s) => s.toLowerCase())
        );

        /* Se der mesmo erro, aponta ele com detalhes */
    } catch (err) {
        /* E retorna o uso para a default */
        if (global?.config?.logIndexer?.value) console.warn(`[WARN] Pasta Functions não encontrada: ${err.message}`);
        return ['Default'];
    }

    /* Mas se der certo, atualiza os symlinks para as pastas corretas */
    const result = (tempFolders.includes(commandName)
        ? (updateSymlinks(commandName), [commandName])
        : ['Default']
    );

    /* Depois só coloca em cache e retorna */
    handleUnmappedCommand.cache.set(commandName, result);
    return result;
}

/* Cria um cachezinho de handleUnmappedCommand da função acima */
handleUnmappedCommand.cache = new Map();

/**
 * Resolve o caminho completo para o comando com verificações
 * @param {Array<string>} commandFolder - Nome da pasta do comando
 * @returns {string} Caminho resolvido
 * @throws {Error} Se o caminho for inválido
 */
function resolveCommandPath(commandFolder) {
    /* Define a pasta para localizar */
    const [folder] = commandFolder;

    /* Se NÃO encontrar certinho um dado dropa um erro */
    if (!commandPlaces[folder]) { throw new Error(`Configuração não encontrada para: ${folder}`); }

    /* Resolve o local do comando e faz um join seguro */
    const commandPath = path.resolve(__dirname, commandPlaces[folder].place);
    return safePathJoin(__dirname, path.normalize(commandPath));
}

/**
 * Carrega o módulo do comando com cache e circuit breaker
 * @param {string} commandPath - Caminho do módulo
 * @returns {Object} Módulo carregado
 * @throws {Error} Se o carregamento falhar
 */
function loadCommandModule(commandPath) {
    /* Circuit Breaker: Verifica se o módulo está em estado de falha */
    if (loadCommandModule.failedModules.has(commandPath)) { throw new Error(`Módulo ${commandPath} está em estado de falha`); }

    /* Tenta com try catch para caso haja falhas adicionais */
    try {
        /* Verificação de cache com LRU */
        if (commandCache.has(commandPath)) {
            /* Se tiver ele, apenas retorna uma mensagem e então diz que achou em cache */
            if (global?.config?.logIndexer?.value) console.debug(`[CACHE HIT] ${commandPath}`);
            return commandCache.get(commandPath);
        }

        /* Define a contagem de perfomance atual */
        const start = performance.now();

        /* Tenta carregar o módulo e definir seus dados */
        const Sys = require(commandPath);
        const module = Sys[Object.keys(Sys)[0]];

        /* Insere em cache e printa o resultado da perfomance */
        commandCache.set(commandPath, module);
        logPerformance('SYNC', commandPath, start);

        /* Retorna os dados */
        return module;

        /* Caso dê erro nesse módulo */
    } catch (err) {
        /* Circuit Breaker: Marca módulo como falho */
        loadCommandModule.failedModules.set(commandPath, Date.now());

        /* Dropa um erro */
        throw err;
    }
}

/* Cra um cache para os módulos que falharam */
loadCommandModule.failedModules = new Map();

/**
 * Carrega módulo de forma assíncrona com tratamento moderno
 * @param {string} commandPath - Caminho do módulo
 * @returns {Promise<Object>} Promise com o módulo
 * @throws {Error} Se o carregamento falhar
 */
async function loadCommandModuleAsync(commandPath) {
    /* Circuit Breaker: Verifica se o módulo está em estado de falha */
    if (loadCommandModule.failedModules.has(commandPath)) {
        throw new Error(`Módulo ${commandPath} está em estado de falha`);
    }

    /* Tenta executar dentro de try-catch para lidar com falhas */
    try {
        /* Verificação de cache com LRU */
        if (commandCache.has(commandPath)) {
            /* Se o módulo estiver no cache, retorna o módulo */
            if (global?.config?.logIndexer?.value) console.debug(`[ASYNC CACHE HIT] ${commandPath}`);
            return commandCache.get(commandPath);
        }

        /* Define o início da contagem de performance */
        const start = performance.now();

        /* Tenta carregar o módulo de forma assíncrona e obter seus dados */
        const { default: Sys } = await import(pathToFileURL(commandPath));
        const module = Sys[Object.keys(Sys)[0]];

        /* Insere o módulo carregado no cache */
        commandCache.set(commandPath, module);

        /* Registra a performance do carregamento assíncrono */
        logPerformance('ASYNC', commandPath, start);

        /* Retorna o módulo carregado */
        return module;

    /* Se ocorrer qualquer erro ao carregar o módulo */
    } catch (err) {
        /* Circuit Breaker: Marca o módulo como falho */
        loadCommandModule.failedModules.set(commandPath, Date.now());

        /* Propaga o erro */
        throw err;
    }
}

/**
 * Tratamento de erros avançado com suporte a analytics
 * @param {Error} error - Objeto de erro
 * @param {string} [context] - Contexto adicional
 */
function handleSystemError(error, context = '') {
    /* Define os dados de erro */
    const errorData = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        context,
        memoryUsage: process.memoryUsage(),
    };

    /* Printa ele de forma especial */
    console.error('[SYSTEM ERROR]', errorData);

    /* Se logging global estiver disponível */
    if (global.logging && global.logging.echoError) {
        /* Envia para analytics */
        global.logging.echoError(error, false, __dirname);
    }
}

/**
 * Controlador principal do sistema
 * @param {string} systemName - Nome do sistema/comando
 * @returns {Object|boolean} Módulo carregado ou false
 */
function controlSystem(systemName = 'Default') {
    /* Define o início da contagem de performance */
    const startTime = performance.now();

    /* Try catch para mais e mais erros absurdos */
    try {
        /* Valida o nome do comando para evitar exploits */
        const toyBox = validateCommandName(systemName);

        /* Busca o local do comando com base no alias */
        let commandFolder = (Object.keys(commandPlaces)
            .filter((objname) => commandPlaces[objname].alias.includes(toyBox))
        );

        /* Caso o local não seja encontrado, tenta mapear o comando */
        if (commandFolder.length === 0) { commandFolder = handleUnmappedCommand(toyBox); }

        /* Resolve o caminho do comando para carregamento */
        const commandPath = resolveCommandPath(commandFolder);

        /* Carrega o módulo usando o carregador principal */
        const module = loadCommandModule(commandPath);

        /* Registra a performance do carregamento */
        logPerformance('PERF', systemName, startTime);

        /* Retorna o módulo carregado */
        return module;

        /* Caso ocorra algum erro no processo */
    } catch (error) {
        /* Trata o erro e registra informações úteis */
        handleSystemError(error, `controlSystem: ${systemName}`);

        /* Retorna false para indicar falha */
        return false;
    }
}

/**
 * Versão assíncrona com suporte a hot reload
 * @param {string} systemName - Nome do sistema/comando
 * @param {boolean} [bypassCache=false] - Ignora cache para hot reload
 * @returns {Promise<Object|boolean>} Promise com o módulo ou false
 */
async function controlSystemAsync(systemName = 'Default', bypassCache = false) {
    /* Define o início da contagem de performance */
    const startTime = performance.now();

    /* Try catch para mais e mais erros absurdos */
    try {
        /* Valida o nome do comando para evitar exploits */
        const toyBox = validateCommandName(systemName);

        /* Busca o local do comando com base no alias */
        let commandFolder = (Object.keys(commandPlaces)
            .filter((objname) => commandPlaces[objname].alias.includes(toyBox))
        );

        /* Caso o local não seja encontrado, tenta mapear o comando */
        if (commandFolder.length === 0) { commandFolder = handleUnmappedCommand(toyBox); }

        /* Resolve o caminho do comando para carregamento */
        const commandPath = resolveCommandPath(commandFolder);

        /* Caso o hot reload seja habilitado, limpa o cache */
        if (bypassCache) { commandCache.delete(commandPath); }

        /* Carrega o módulo de forma assíncrona */
        const module = await loadCommandModuleAsync(commandPath);

        /* Registra a performance do carregamento assíncrono */
        logPerformance('ASYNC PERF', systemName, startTime);

        /* Retorna o módulo carregado */
        return module;

        /* Caso ocorra algum erro no processo */
    } catch (error) {
        /* Trata o erro e registra informações úteis */
        handleSystemError(error, `controlSystemAsync: ${systemName}`);

        /* Retorna false para indicar falha */
        return false;
    }
}

/* Mensagem de inicialização com diagnóstico completo */
if (global?.config?.logIndexer?.value) {
    console.debug('[SYSTEM BOOT]', {
        status: 'ready',
        memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        cachedCommands: commandCache.size,
        nodeVersion: process.version,
    });
}

/* Exporta a API com TypeScript-like types via JSDoc */
module.exports = Object.assign(
    (systemName) => controlSystem(systemName),
    {
        controlSystem,
        controlSystemAsync,
        _internal: {
            validateCommandName,
            safePathJoin,
            resolveCommandPath,
            clearCache: () => commandCache.clear(),
            getCacheStats: () => ({
                size: commandCache.size,
                hits: commandCache.hits,
                misses: commandCache.misses,
            }),
        },
    },
);
