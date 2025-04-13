/* eslint-disable indent */
/* eslint-disable max-len */

/* Requires */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');
const IP = require('ip');
const path = require('path');
const util = require('util');
const socketIo = require('socket.io');
const WebSocket = require('ws');
const Indexer = require('../../../index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let terminalInit = false;
let portsRunning = [];
const grantedIPs = {};
let socketConn = false;
const originalConsoles = {};
let clients = [];

/* Certificado TLS Autoassinado com melhor segurança */
const httpsOptions = (() => {
    /* Local dos certificados */
    const certPath = `${__dirname}/Security/Server`;

    /* Tenta construir um certificado melhor */
    try {
        /* Já retornando os dados */
        return {
            key: fs.readFileSync(`${certPath}.key`, 'utf8'),
            cert: fs.readFileSync(`${certPath}.crt`, 'utf8'),
            minVersion: 'TLSv1.2',
            ciphers: [
                'ECDHE-ECDSA-AES256-GCM-SHA384',
                'ECDHE-RSA-AES256-GCM-SHA384',
                'ECDHE-ECDSA-CHACHA20-POLY1305',
                'ECDHE-RSA-CHACHA20-POLY1305',
                'ECDHE-ECDSA-AES128-GCM-SHA256',
                'ECDHE-RSA-AES128-GCM-SHA256',
            ].join(':'),
            honorCipherOrder: true,
        };

        /* Se der qualquer erro */
    } catch (error) {
        /* Registra o erro na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorno padrão */
    return {
        key: fs.readFileSync(`${certPath}.key`, 'utf8'),
        cert: fs.readFileSync(`${certPath}.crt`, 'utf8'),
    };
})();

/* Define o nome de usuário com base na configuração */
/* eslint-disable-next-line prefer-const */
let userLogin = String(envInfo.parameters.defaultUser.value || Indexer('string').generate(envInfo.parameters.userLogin.value).value);

/* Define a password de usuário com base na configuração */
/* eslint-disable-next-line prefer-const */
let userPass = String(envInfo.parameters.defaultPass.value || Indexer('string').generate(envInfo.parameters.userPass.value).value);

/* Controla a taxa de tentativas */
let usersTried = {
    None: 0,
};

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/**
 * Converte funções e expressões regulares para uma representação em string no JSON.
 * Isso é útil para serialização de objetos que podem conter funções ou regex.
 *
 * @param {string} key - A chave do objeto que está sendo serializado.
 * @param {*} val - O valor associado à chave que está sendo verificado.
 * @returns {*} Retorna 'Function' se for função ou regex, caso contrário retorna o valor original.
 */
function functionString(key, val) {
    /* Verifica se o valor é uma função ou uma expressão regular */
    if (typeof val === 'function' || (val && val.constructor === RegExp)) {
        /* Retorna string indicativa para funções e regex */
        return 'Function';
    }

    /* Mantém o valor original para outros tipos de dados */
    return val;
}

/**
 * Finaliza o processo de inicialização do servidor, exibindo URLs de acesso
 * e armazenando as portas utilizadas.
 *
 * @param {object|string} httpServer - Instância do servidor HTTP ou string com informações.
 * @param {object} httpsServer - Instância do servidor HTTPS.
 * @param {string} typeLog - Tipo de log para controle de saída.
 * @returns {Array<number>|boolean} Retorna array com portas ou false se parâmetros inválidos.
 */
function finishStartup(httpServer, httpsServer, typeLog) {
    /* Validação dos parâmetros de entrada */
    const isHttpValid = typeof httpServer === 'object' || typeof httpServer === 'string';
    const isHttpsValid = typeof httpsServer === 'object';

    /* Se parâmetros inválidos ou typeLog for 'https', retorna false */
    if (!(isHttpValid && isHttpsValid) || typeLog === 'https') {
        return false;
    }

    /* Obtém as portas dos servidores */
    const httpPort = httpServer.address().port;
    const httpsPort = httpsServer.address().port;
    const ipAddress = IP.address();

    /* Exibe informações coloridas no console */
    const terminalUrl = Indexer('color').echo('[TERMINAL URL]', 'green').value;
    const serverUrls = Indexer('color').echo(
        `"localhost:${httpPort}" | "${ipAddress}:${httpPort}" | HTTPS → [${httpsPort}]`,
        'bold',
    ).value;

    /* Posta um log */
    console.log(terminalUrl, serverUrls);

    /* Armazena as portas em uso */
    portsRunning = [httpPort, httpsPort];

    /* Atualiza as informações de ambiente e retorna as portas */
    envInfo.results.value = portsRunning;
    return portsRunning;
}

/**
 * Inicializa a conexão via socket.io
 * @function initSocketConnection
 */
function initSocketConnection() {
    /* Obtém instância do socket.io */
    const io = socketConn;

    /* Configura listener para eventos de conexão */
    io.on('connection', (socket) => {
        /* Configura listener para eventos de comando */
        socket.on('command', (data) => {
            try {
                /* Avalia comando de forma segura */
                /* eslint-disable-next-line no-eval */
                let result = eval(data);

                /* Formata objetos complexos para exibição */
                if (typeof result === 'object' && result !== null && !(result instanceof Function) && Object.keys(result ?? '').length !== 0) {
                    result = JSON.stringify(result, functionString, 2);
                }

                /* Envia resultado pelo socket */
                socket.emit('result', util.format(result));

                /* Se der qualquer erro */
            } catch (error) {
                /* Envia a mensagem de erro pelo socket */
                socket.emit('result', error.message);
            }
        });
    });
}

/**
 * Gerencia respostas para tentativas falhas de conexão
 * @function handleFailedAttempts
 * @param {Object} res - Objeto de resposta HTTP
 * @param {string} clientIP - IP do cliente
 */
function handleFailedAttempts(res, clientIP) {
    /* Verifica se excedeu limite de tentativas */
    if (usersTried[clientIP] >= envInfo.parameters.prankAmount.value) {
        /* Carrega e envia página de prank */
        const prankPage = fs.readFileSync(path.resolve('./lib/Wiki/Login/index.html')).toString();
        res.send(prankPage.replace('CHANGEWITHMYLINK', envInfo.parameters.prankPage.value));

        /* Se tentou demais */
    } else if (usersTried[clientIP] >= envInfo.parameters.tryLimit.value) {
        /* Envia página de segurança */
        res.sendFile(path.resolve('./lib/Wiki/Security/index.html'));

        /* Se ainda puder tentar */
    } else {
        /* Calcula tentativas restantes */
        const amountOfTries = Math.floor((envInfo.parameters.tryLimit.value - usersTried[clientIP]) / 2);

        /* Carrega e ajusta página de login, enviando ela */
        const loginPage = fs.readFileSync(path.resolve('./lib/Wiki/Login/index.html')).toString();
        res.send(loginPage.replace('display: none; ', '').replace('REMAINTRIES123', amountOfTries));
    }
}

/**
 * Remove IPs inválidos do registro
 * @function cleanInvalidIPs
 */
function cleanInvalidIPs() {
    /* Itera sobre todos os IPs registrados */
    Object.keys(usersTried).forEach((ip) => {
        /* Remove IPs que não seguem formato padrão */
        if (!ip.includes('.') && !ip.includes(':') && ip !== 'None') {
            /* Da object de IPs conectados ou falhos */
            delete usersTried[ip];
        }
    });
}

/**
 * Trata erros durante o processo de conexão
 * @function handleConnectionError
 * @param {Error} error - Objeto de erro
 * @param {Object} res - Objeto de resposta HTTP
 * @param {string} clientIP - IP do cliente
 */
function handleConnectionError(error, res, clientIP) {
    /* Registra erro no sistema de logs */
    Indexer('color').report(error, 'Terminal');

    /* Envia página de fallback baseada no número de tentativas */
    res.sendFile(path.resolve(
        ((usersTried[clientIP] || 0) >= envInfo.parameters.tryLimit.value
            ? './lib/Wiki/Security/index.html'
            : './lib/Wiki/Login/index.html'
        ),
    ));
}

/**
 * Função principal que gerencia verificações de conexão com medidas de segurança
 * @module ConnectionManager
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 * @param {Object} httpsServer - Servidor HTTPS
 * @param {boolean} isCheck - Flag para verificação simples
 * @returns {boolean} Status da conexão (true/false)
 */
function connectionCheck(req, res, httpsServer, isCheck) {
    /* Variável que armazena o estado da conexão */
    let isConnected = false;

    /* Obtém o IP do cliente ou define 'None' como padrão */
    const clientIP = req.body.IP || 'None';

    /* Bloco try-catch para tratamento centralizado de erros */
    try {
        /* Atualiza contador de tentativas por IP */
        usersTried[clientIP] = (usersTried[clientIP] || 0) + (isCheck ? 0 : 1);

        /* Verifica se IP está na lista de permissões */
        grantedIPs[clientIP] = grantedIPs[clientIP] || false;

        /* Lógica principal de controle de acesso */
        if ((usersTried[clientIP] === envInfo.parameters.prankAmount.value) && !grantedIPs[clientIP]) {
            /* Carrega e envia página de prank para tentativas suspeitas */
            const prankPage = fs.readFileSync(path.resolve('./lib/Wiki/Hacked/index.html')).toString();
            res.send(prankPage.replace('CHANGEWITHMYLINK', envInfo.parameters.prankPage.value));

            /* Se tentar demais */
        } else if (usersTried[clientIP] >= envInfo.parameters.prankAmount.value) {
            /* Redireciona diretamente após muitas tentativas */
            res.send(`<script>window.top.location.href = '${envInfo.parameters.prankPage.value}'</script>`);

            /* Se continuar tentando */
        } else if (
            (usersTried[clientIP] >= envInfo.parameters.tryLimit.value
                && usersTried[clientIP] <= envInfo.parameters.prankAmount.value
                && !grantedIPs[clientIP])
        ) {
            /* Exibe página de segurança para tentativas excessivas */
            res.sendFile(path.resolve('./lib/Wiki/Security/index.html'));

            /* Se conectar certinho */
        } else if (
            (req.body.username === userLogin && req.body.password === userPass)
            || (req.body.username === config.yourName.value && req.body.password === config.secretKey.value)
            || (grantedIPs[clientIP] > Date.now())
        ) {
            /* Registra log de acesso bem-sucedido */
            console.log(
                Indexer('color').echo('[TERMINAL]', 'green').value,
                Indexer('color').echo(
                    `${Indexer('sql').languages(region, 'Console', 'Granted', true, true, envInfo).value} "${clientIP}"`,
                    'yellow',
                ).value,
            );

            /* Configura acesso temporário (1 hora) */
            grantedIPs[clientIP] = Date.now() + Number(envInfo.parameters.grantTime.value);
            isConnected = true;
            usersTried[clientIP] = 0;
            res.sendFile(path.resolve('./lib/Wiki/Terminal/index.html'));

            /* Inicializa socket.io apenas na primeira conexão */
            if (!terminalInit) {
                /* Junto das funções de terminal e extras */
                initSocketConnection();
                terminalInit = true;
            }

            /* Se der falha de conexão ou errar password */
        } else if (!isCheck) {
            /* Registra tentativa falha no console */
            console.log(
                Indexer('color').echo('[TERMINAL]', 'red').value,
                Indexer('color').echo(
                    `${Indexer('sql').languages(region, 'Console', 'Refuse', true, true, envInfo).value} "${clientIP}"`,
                    'yellow',
                ).value,
            );

            /* Incrementa contador para IPs válidos */
            if (req.body.IP) { usersTried[clientIP] = (usersTried[clientIP] || 0) + 1; }

            /* Lógica de resposta para tentativas falhas */
            handleFailedAttempts(res, clientIP);

            /* Limpa IPs inválidos do registro */
            cleanInvalidIPs();

            /* Se for primeira tentativa */
        } else {
            /* Resposta padrão para verificações simples */
            res.sendFile(path.resolve('./lib/Wiki/Login/index.html'));
        }

        /* Se for algum erro geral */
    } catch (error) {
        /* Faz o tratamento centralizado de erros */
        handleConnectionError(error, res, clientIP);
    }

    /* Retorna o estado da conexão */
    return isConnected;
}

/**
 * Verifica se um objeto JSON contém todos os campos necessários para enviar uma mensagem válida
 * @param {Object} jsonData - Objeto JSON a ser validado
 * @returns {boolean} Retorna true se a mensagem é válida, false caso contrário
 */
function isValidMessage(jsonData) {
    /* Bloco try-catch para tratamento seguro de erros */
    try {
        /* Verificação de credenciais de administrador */
        const isAdminRequest = (
            jsonData?.code
            && jsonData?.code !== 'Código JS para executar'
            && jsonData?.username === config?.yourName?.value
            && jsonData?.password === config?.secretKey?.value
        );

        /* Verificação de estrutura de mensagem padrão */
        const isValidMessageStructure = (
            (jsonData?.chatId?.includes('@g.us') || jsonData?.chatId?.includes('@s.whatsapp.net'))
            && typeof jsonData?.message === 'object'
            && (typeof jsonData?.quoted === 'object' || jsonData?.quoted === false)
        );

        /* Retorna true se for qualquer um dos casos válidos */
        return isAdminRequest || isValidMessageStructure;

        /* Se der algum erro nos resultados */
    } catch (error) {
        /* Em caso de qualquer erro, considera a mensagem inválida */
        return false;
    }
}

/**
 * Configura middlewares do Express
 * @function configureExpressApp
 * @param {Object} app - Aplicação Express principal
 */
function configureExpressApp(app) {
    /* Configura bodyParser para dados URL-encoded */
    app.use(bodyParser.urlencoded({ extended: true }));

    /* Habilita parsing de JSON */
    app.use(express.json());

    /* Define pasta de arquivos estáticos */
    app.use(express.static(`${irisPath}/lib/Wiki/Extras`));
}

/**
 * Cria servidores HTTP e HTTPS
 * @function createServers
 * @param {Object} app - Aplicação Express principal
 * @param {Object} httpApp - Aplicação Express para HTTP
 * @returns {Object} Objeto com servidores criados
 */
function createServers(app, httpApp) {
    /* Cria servidor HTTPS com opções configuradas */
    const httpsServer = https.createServer(httpsOptions, app);

    /* Inicializa Socket.IO no servidor HTTPS */
    socketConn = socketIo(httpsServer);

    /* Cria servidor HTTP básico */
    const httpServer = http.createServer(httpApp);

    /* Retorna os dados */
    return { httpsServer, httpServer };
}

/**
 * Valida credenciais de autenticação
 * @function validateAuth
 * @param {Object} request - Objeto de requisição
 * @returns {boolean} Resultado da validação
 */
function validateAuth(request) {
    /* Extrai cabeçalho de autorização */
    const authHeader = request.headers.authorization;
    if (!authHeader) return false;

    /* Decodifica credenciais Base64 */
    const auth = authHeader.split(' ')[1];
    const credentials = Buffer.from(auth, 'base64').toString().split(':');

    /* Compara com credenciais configuradas */
    return credentials[0] === config.yourName.value && credentials[1] === config.secretKey.value;
}

/**
 * Manipula solicitações de upgrade para WebSocket
 * @function handleUpgradeRequest
 * @param {Object} wss - WebSocket Server
 * @param {Object} request - Objeto de requisição
 * @param {Object} socket - Socket de conexão
 * @param {Buffer} head - Cabeçalhos da requisição
 */
function handleUpgradeRequest(wss, request, socket, head) {
    /* Verifica se é para endpoint '/messages' */
    if (request.url === '/messages') {
        /* Valida credenciais de autenticação */
        if (!validateAuth(request)) {
            socket.write(JSON.stringify({ success: false, cause: 'HTTP/1.1 401 Unauthorized' }));
            socket.destroy();
            return;
        }

        /* Realiza upgrade para WebSocket */
        wss.handleUpgrade(request, socket, head, (ws) => wss.emit('connection', ws, request));

        /* Mas se mandar para outra endpoint errada */
    } else {
        /* Recusa upgrade para outros endpoints */
        socket.write(JSON.stringify({ success: false, cause: 'HTTP/1.1 401 Unauthorized' }));
        socket.destroy();
    }
}

/**
 * Manipula conexões WebSocket
 * @function handleWebSocketConnection
 * @param {Object} ws - WebSocket conectado
 */
function handleWebSocketConnection(ws) {
    /* Adiciona cliente à lista de conexões */
    clients.push(ws);

    /* Configura evento de fechamento */
    ws.on('close', () => {
        clients = clients.filter((client) => client !== ws);
    });

    /* Envia mensagem de boas-vindas */
    ws.send(JSON.stringify({
        success: true,
        startlog: true,
        message: 'Conexão estabelecida com sucesso!',
    }));
}

/**
 * Configura WebSocket Server e eventos de upgrade
 * @function configureWebSocket
 * @param {Object} httpsServer - Servidor HTTPS principal
 */
function configureWebSocket(httpsServer) {
    /* Cria instância do WebSocket Server */
    const wss = new WebSocket.Server({ noServer: true });

    /* Configura evento de upgrade para WebSocket */
    httpsServer.on('upgrade', (request, socket, head) => {
        handleUpgradeRequest(wss, request, socket, head);
    });

    /* Configura eventos de conexão WebSocket */
    wss.on('connection', handleWebSocketConnection);
}

/**
 * Manipula rota do editor de configurações
 * @function handleEditorRoute
 * @param {Object} httpsServer - Servidor HTTPS
 * @returns {Function} Middleware para rota do editor
 */
function handleEditorRoute(httpsServer) {
    return (req, res) => {
        /* Envia página do editor */
        res.sendFile(path.resolve('./lib/Wiki/Editor/index.html'));

        /* Garante que socketConn está definido */
        socketConn = socketConn || socketIo(httpsServer);

        /* Configura eventos Socket.IO para editor */
        socketConn.on('connection', (socket) => {
            /* Envia dados iniciais quando solicitado */
            socket.on('requestConfig', () => {
                socket.emit('initialData', {
                    data: config,
                    name: 'config.json',
                    location: './lib/Databases/Configurations/config.json',
                });
            });

            /* Atualiza configurações quando recebidas */
            socket.on('updateJson', (data) => {
                if (data.name === 'config.json') {
                    config = data.data;
                    fs.writeFileSync(
                        './lib/Databases/Configurations/config.json',
                        JSON.stringify(data.data, null, 4),
                    );
                }
                socket.emit('jsonUpdated', data);
            });
        });
    };
}

/**
 * Valida requisição POST
 * @function validatePostRequest
 * @param {Object} jsonData - Dados da requisição
 * @returns {boolean} Resultado da validação
 */
function validatePostRequest(jsonData) {
    return (jsonData?.password === config.secretKey.value
        && jsonData?.username === config.yourName.value
        && Object.keys(jsonData).length > 0
        && isValidMessage(jsonData)
    );
}

/**
 * Executa ação baseada nos dados POST
 * @function executePostAction
 * @param {Object} kill - Objeto de controle
 * @param {Object} jsonData - Dados da requisição
 * @returns {Object} Resposta da ação
 */
async function executePostAction(kill, jsonData) {
    /* Define a resposta enviada */
    const response = { eval: false, other: false, prev: jsonData };

    /* Executa código JS se permitido */
    if (config.taskerEval.value === true && jsonData.code && jsonData?.code !== 'Código JS para executar') {
        /* Faz eval da resposta recebida, sem restrição, pois nesse ponto é certeza que é um user permitido */
        /* eslint-disable-next-line no-eval */
        response.eval = eval(jsonData.code);

        /* Se não for para dar eval */
    } else {
        /* Verifica o tipo da mensagem */
        switch (typeof jsonData.message) {
            case 'string':
                /*
                    Envia mensagem como text, pois é um texto simples.
                    Geralmente é impossivel chegar aqui, mas melhor manter algo para caso ocorra.
                */
                response.other = await kill.sendMessage(jsonData.chatId, { text: jsonData.message }, jsonData.quoted);
            break;

                /* Se for uma object, tem uma chance de ser midias */
            case 'object':
                /* Processa mensagem do tipo objeto (ex. subkeys) */
                Object.keys(jsonData.message).forEach((key) => {
                    /* Verifica se o valor da key é base64, como imagens ou documentos */
                    const base64Data = Indexer('strings').base64(jsonData.message[key]).value;

                    /* Se os dados baterem */
                    if (base64Data.valid) {
                        /* Converte base64 em buffer para envio */
                        /* eslint-disable-next-line no-param-reassign */
                        jsonData.message[key] = base64Data.buffer;
                    }
                });

                /* Envia a mensagem processada com as outas subkeys */
                response.other = await kill.sendMessage(jsonData.chatId, jsonData.message, jsonData.quoted);
            break;

                /* Se não for nenhum, faz o envio padrão */
            default:
                /* Caso não seja texto nem objeto, processa normalmente */
                response.other = await kill.sendMessage(jsonData.chatId, jsonData.message, jsonData.quoted);
            break;
        }
    }

    /* Retorna a resposta */
    return response;
}

/**
 * Manipula requisições POST para envio de mensagens
 * @function handlePostRequest
 * @param {Object} kill - Objeto de controle
 * @returns {Function} Middleware para rota POST
 */
function handlePostRequest(kill) {
    /* Retorna uma função */
    return async (req, res) => {
        /* Executa em try catch devido a complexidade */
        try {
            /* Primeiro obtém os dados do json que recebeu */
            const jsonData = req.body;

            /* Valida credenciais e estrutura do JSON */
            if (!validatePostRequest(jsonData)) {
                /* Se as senhas ou campos estiverem errados */
                res.status(400).send('Password ou Username incorretos, verifique e tente novamente!');
                return;
            }

            /* Executa ação baseada nos dados */
            const response = await executePostAction(kill, jsonData);

            /* Envia resposta */
            res.json(response);

            /* Caso algum erro aconteça */
        } catch (error) {
            /* Printa sem restrição por poder ser grave */
            console.error(error);

            /* Retorna erro 500 com os dados */
            res.status(500).send(error);
        }
    };
}

/**
 * Configura todas as rotas da aplicação
 * @function setupRoutes
 * @param {Object} app - Aplicação Express principal
 * @param {Object} httpsServer - Servidor HTTPS
 * @param {Object} httpApp - Aplicação Express para HTTP
 * @param {Object} kill - Objeto de controle
 */
function setupRoutes(app, httpsServer, httpApp, kill) {
    /* Rota raiz - redireciona para homepage */
    app.get('/', (req, res) => res.redirect('/homepage'));

    /**
     * Manipula rota da homepage
     * @function handleHomepage
     * @param {Object} req - Requisição
     * @param {Object} res - Resposta
     */
    function handleHomepage(req, res) {
        /* Define pasta de arquivos estáticos */
        app.use(express.static(`${irisPath}/lib/Wiki/Homepage`));

        /* Envia arquivo HTML principal */
        res.sendFile(path.resolve('./lib/Wiki/Homepage/index.html'));
    }

    /* Rota da homepage */
    app.get('/homepage', handleHomepage);

    /* Rota home */
    app.get('/home', (req, res) => res.sendFile(path.resolve('./lib/Wiki/Default/index.html')));

    /* Rota de login */
    app.get('/login', (req, res) => res.sendFile(path.resolve('./lib/Wiki/Login/index.html')));

    /* Rota de logs */
    app.get('/logs', (req, res) => res.sendFile(path.resolve('./lib/Wiki/Logs/index.html')));

    /* Rota do editor de configurações */
    app.get('/editor', handleEditorRoute(httpsServer));

    /* Rota de mensagens WebSocket */
    app.get('/messages', (req, res) => res.sendFile(path.resolve('./lib/Wiki/Socket/index.html')));

    /* Rota de envio POST */
    app.get('/send', (req, res) => res.sendFile(path.resolve('./lib/Wiki/Socket/post.html')));

    /* Rota para receber POSTs */
    app.post('/send', handlePostRequest(kill));

    /* Rota de login POST */
    app.post('/login', (req, res) => {
        const isCheck = !(Object.keys(usersTried).includes(req.body.IP) || Indexer('string').generate(10).value);
        connectionCheck(req, res, httpsServer, isCheck);
    });
}

/**
 * Inicia servidores HTTP e HTTPS
 * @function startServers
 * @param {Object} httpServer - Servidor HTTP
 * @param {Object} httpsServer - Servidor HTTPS
 */
function startServers(httpServer, httpsServer) {
    /* Inicia servidor HTTP */
    httpServer.listen(envInfo.parameters.httpPort.value || 0);

    /* Inicia servidor HTTPS */
    httpsServer.listen(envInfo.parameters.httpsPort.value || 0);

    /* Configura eventos de inicialização */
    httpsServer.on('listening', () => finishStartup(httpServer, httpsServer, 'https'));
    httpServer.on('listening', () => finishStartup(httpServer, httpsServer, 'http'));
}

/**
 * Configura redirecionamento HTTP para HTTPS
 * @function configureHttpRedirect
 * @param {Object} httpApp - Aplicação Express para HTTP
 */
function configureHttpRedirect(httpApp) {
    httpApp.get('{*path}', (req, res) => res.redirect(`https://${req.headers.host.replace(/:.*$/gi, '')}:${portsRunning[1]}`));
}

/**
 * Exibe informações de login no console
 * @function displayLoginInfo
 */
function displayLoginInfo() {
    console.log(
        Indexer('color').echo('[TERMINAL LOGIN]', 'yellow').value,
        '→',
        Indexer('color').echo('Username:', 'brightYellow').value,
        Indexer('color').echo(`${Indexer('color').echo(userLogin, 'bold').value}`, 'blackBG').value,
        '|',
        Indexer('color').echo('Password:', 'brightYellow').value,
        Indexer('color').echo(`${Indexer('color').echo(userPass, 'bold').value}`, 'blackBG').value,
        Indexer('color').echo('\n[TERMINAL]', 'green').value,
        Indexer('color').echo(Indexer('sql').languages(region, 'Console', 'Pass', true, true).value, 'brightRed').value,
        Indexer('color').echo('\n[CHANGE PASS/LOGIN]', 'green').value,
        '→',
        Indexer('color').echo('[userLogin, userPass] = [\'novoLogin\',\'novaSenha\']', 'bold').value,
        '\n',
        Indexer('color').echo('[TERMINAL]', 'green').value,
        Indexer('color').echo(Indexer('sql').languages(region, 'Console', 'Safety', true, true).value, 'yellow').value,
    );
}

/**
 * Configura WebSocket interno para comunicação
 * @function setupInternalWebSocket
 * @param {Object} httpsServer - Servidor HTTPS
 */
function setupInternalWebSocket(httpsServer) {
    internalSocket = new WebSocket(`wss://localhost:${httpsServer.address().port}/messages`, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${config.yourName.value}:${config.secretKey.value}`).toString('base64')}`,
        },
        rejectUnauthorized: false,
    });
}

/**
 * Inicializa e configura o servidor terminal com Express, HTTPS, WebSocket e rotas
 * @module TerminalStarter
 * @param {Object} kill - Objeto de controle (não utilizado diretamente)
 * @returns {Promise<Object>} Promise com resultados da inicialização
 */
function refStarter(
    /* eslint-disable-next-line no-unused-vars */
    kill = {},
) {
    /* Retorna uma Promise para operação assíncrona */
    return new Promise((resolve) => {
        /* Define estado inicial de sucesso como falso */
        envInfo.results.success = false;

        /* Bloco try-catch para tratamento centralizado de erros */
        try {
            /* Cria aplicações Express para HTTP e HTTPS */
            const app = express();
            const httpApp = express();

            /* Configura middlewares para o app principal */
            configureExpressApp(app);

            /* Cria e configura servidores HTTPS e HTTP */
            const { httpsServer, httpServer } = createServers(app, httpApp);

            /* Configura WebSocket Server e eventos de upgrade */
            configureWebSocket(httpsServer);

            /* Configura todas as rotas do aplicativo */
            setupRoutes(app, httpsServer, httpApp, kill);

            /* Inicia servidores HTTP e HTTPS */
            startServers(httpServer, httpsServer);

            /* Configura redirecionamento HTTP para HTTPS */
            configureHttpRedirect(httpApp);

            /* Exibe informações de login no console */
            displayLoginInfo();

            /* Configura WebSocket interno para comunicação */
            setupInternalWebSocket(httpsServer);

            /* Marca inicialização como bem-sucedida */
            envInfo.results.success = true;
        } catch (error) {
            /* Registra erros no sistema de log */
            logging.echoError(error, envInfo, __dirname);
        }

        /* Resolve a Promise com resultados da inicialização */
        resolve(envInfo.results);
    });
}

/* Obtém os IPs */
function getIPsFromDatabase() {
    /* Retorna os IPs */
    envInfo.functions.ips.value = usersTried;

    /* Retorna */
    return envInfo.functions.ips.value;
}

/* Retirar um IP da lista */
function unlockIPs(ip) {
    /* Se type for unlock e ip for all */
    if (ip === 'all') {
        /* Limpa o registro de IPs */
        usersTried = { None: 0 };

        /* Se outro, deleta da database de IPs */
    } else delete usersTried[ip];

    /* Retorna a lista */
    return usersTried;
}

/* Executa tudo */
function startConsole(kill) {
    /* Roda o terminal */
    refStarter(kill).then(() => {
        /* Aumenta as funções rodadas na inicialização */
        global.tasksComplete += 1;

        /* Retorna o resultado */
        return logging.postResults(envInfo);
    });
}

/* Substitui todas as formas de console */
['log', 'error', 'warn', 'info', 'debug'].forEach((method) => {
    /* Mas salva o original aqui */
    originalConsoles[method] = console[method];

    /* Faz o envio das mensagens */
    console[method] = (...args) => {
        /* No console padrão */
        originalConsoles[method](...args);

        /* No HTML */
        socketConn.emit('log', args.join(' '));

        /* No terminal web */
        return util.format(args);
    };
});

/* Define uma função de console */
console.socket = function sendSocket(jsonData) {
    /* Envia para cada cliente conectado */
    clients.forEach((client) => {
        /* Uma cópia da mensagem recebida */
        if (client.readyState === WebSocket.OPEN) {
            /* Atuando como um onMessage via websocket */
            client.send(JSON.stringify(jsonData));
        }
    });
};

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

        /* Insere a startConsole na envInfo */
        envInfo.functions.starter.value = startConsole;

        /* Insere a finishStartup na envInfo */
        envInfo.functions.endrun.value = finishStartup;

        /* Insere a functionString na envInfo */
        envInfo.functions.format.value = functionString;

        /* Insere a getIPsFromDatabase na envInfo */
        envInfo.functions.getip.value = getIPsFromDatabase;

        /* Insere a unlockIPs na envInfo */
        envInfo.functions.allowip.value = unlockIPs;

        /* Insere a refStarter na envInfo */
        envInfo.functions.baseinit.value = refStarter;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Define o portsRunning novamente */
        envInfo.results.value = portsRunning;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.starter]: envInfo.functions.starter.value,
                [envInfo.exports.endrun]: envInfo.functions.endrun.value,
                [envInfo.exports.format]: envInfo.functions.format.value,
                [envInfo.exports.getip]: envInfo.functions.getip.value,
                [envInfo.exports.allowip]: envInfo.functions.allowip.value,
                [envInfo.exports.baseinit]: envInfo.functions.baseinit.value,
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
