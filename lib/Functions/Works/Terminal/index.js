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

/* Certificado TLS */
const httpsOptions = {
    key: fs.readFileSync(`${__dirname}/Security/Server.key`, 'utf8'),
    cert: fs.readFileSync(`${__dirname}/Security/Server.crt`, 'utf8'),
};

/* Define o nome de usuário com base na configuração */
/* eslint-disable-next-line prefer-const */
let userLogin = String(envInfo.parameters.defaultUser.value || Indexer('string').generate(envInfo.parameters.userLogin.value).value);

/* Define a password de usuário com base na configuração */
// eslint-disable-next-line prefer-const
let userPass = String(envInfo.parameters.defaultPass.value || Indexer('string').generate(envInfo.parameters.userPass.value).value);

/* Controla a taxa de tentativas */
let usersTried = {
    None: 0,
};

/* Realiza funções de pós finalização */
function postResults(response) {
    /* Verifica se pode resetar a envInfo */
    if (
        envInfo.settings.finish.value === true
        || (envInfo.settings.ender.value === true && envInfo.results.success === false)
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
        /* Define se vai printar inteiro */
        const showError = config?.fullError?.value || true;

        /* Se pode printar o erro inteiro */
        if (showError) {
            /* Só joga o erro na tela */
            console.error(error);

            /* Se não, formata e printa */
        } else console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envInfo.results;
}

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Formata as funções para JSON */
function functionString(key, val) {
    /* Se for uma function ou uma expressão regular */
    if (typeof val === 'function' || (val && val.constructor === RegExp)) {
        /* Retorna a string 'Function' para indicar que é uma função ou expressão regular */
        return 'Function';
    }

    /* Senão, retorna o valor normal */
    return val;
}

/* Finaliza as etapas de inicialização */
function finishStartup(httpServer, httpsServer, typeLog) {
    /* Retorna false se os parâmetros não forem válidos ou se typeLog for 'https' */
    if (
        !(
            (typeof httpServer === 'object' || typeof httpServer === 'string')
            && typeof httpsServer === 'object'
        )
        || typeLog === 'https'
    ) return false;

    /* Printa o HTTPS */
    console.log(
        Indexer('color').echo('[TERMINAL URL]', 'green').value,
        Indexer('color').echo(`"localhost:${httpServer.address().port}" | "${IP.address()}:${httpServer.address().port}" | HTTPS → [${httpsServer.address().port}]`, 'bold').value,
    );

    /* Insere na Array as portas */
    portsRunning = [httpServer.address().port, httpsServer.address().port];

    /* Define as portas na envInfo */
    envInfo.results.value = portsRunning;

    /* Retorna as portas */
    return portsRunning;
}

/* Função que permite a conexão */
function connectionCheck(req, res, httpsServer, isCheck) {
    /* Define se conectou */
    let isConnected = false;

    /* Try-Catch para caso possua erros */
    try {
        /* Aumenta o contador do IP */
        usersTried[req.body.IP || 'None'] = usersTried[req.body.IP] || 0;
        usersTried[req.body.IP || 'None'] += 1;

        /* Se for modo check, tira um dos usos */
        if (isCheck === true) usersTried[req.body.IP || 'None'] -= 1;

        /* Define a conexão permitida */
        grantedIPs[req.body.IP || 'None'] = grantedIPs[req.body.IP] || false;

        /* Se não fez a prank e a pessoa continua tentando */
        if ((usersTried[req.body.IP || 'None']) === (envInfo.parameters.prankAmount.value) && grantedIPs[req.body.IP || 'None'] === false) {
            /* Define a página prank */
            const prankPage = fs.readFileSync(path.resolve('./lib/Wiki/Hacked/index.html')).toString();

            /* Manda para uma URL prank */
            res.send(prankPage.replace('CHANGEWITHMYLINK', envInfo.parameters.prankPage.value));

            /* Se passou do limite de tentativas prank e já fez a prank */
        } else if ((usersTried[req.body.IP || 'None']) >= envInfo.parameters.prankAmount.value) {
            /* Redireciona direto */
            res.send(`<script>window.top.location.href = '${envInfo.parameters.prankPage.value}'</script>`);

            /* Se passou do limite de tentativas, mas não passou da prank */
        } else if ((usersTried[req.body.IP || 'None']) >= envInfo.parameters.tryLimit.value && (usersTried[req.body.IP || 'None']) <= envInfo.parameters.prankAmount.value && grantedIPs[req.body.IP || 'None'] === false) {
            /* Envia a página de bloqueado */
            res.sendFile(path.resolve('./lib/Wiki/Security/index.html'));

            /* Se não for o caso, verifica se digitou o login corretamente */
        } else if ((req.body.username === userLogin && req.body.password === userPass) || (req.body.username === config.yourName.value && req.body.password === config.secretKey.value) || grantedIPs[req.body.IP || 'None'] > Date.now()) {
            /* Exibe o IP de quem logou */
            console.log(
                Indexer('color').echo('[TERMINAL]', 'green').value,
                Indexer('color').echo(
                    `${Indexer('sql').languages(region, 'Console', 'Granted', true, true, envInfo).value} "${req.body.IP}"`,
                    'yellow',
                ).value,
            );

            /* Permite a conexão por 1 hora */
            grantedIPs[req.body.IP || 'None'] = Date.now() + Number(envInfo.parameters.grantTime.value);
            isConnected = true;

            /* Reseta o contador do IP para não bloquear */
            usersTried[req.body.IP || 'None'] = 0;

            /* Envia a página de terminal */
            res.sendFile(path.resolve('./lib/Wiki/Terminal/index.html'));

            /* Verifica se já tem um socket.io criado */
            if (!terminalInit) {
                /* Se não tiver, cria */
                const io = socketConn;

                /* Em caso de de conexão */
                io.on('connection', (socket) => {
                    /* Com comando */
                    socket.on('command', (data) => {
                        /* Faz um try catch com o eval */
                        try {
                            /* Armazena o resultado do eval na result */
                            // eslint-disable-next-line no-eval
                            let result = eval(data);

                            /* Se for uma Object ou similar */
                            if (typeof result === 'object' && result !== null && !(result instanceof Function) && Object.keys(result ?? '').length !== 0) {
                                /* Formata como Object */
                                result = JSON.stringify(result, functionString, 2);
                            }

                            /* Retorna o resultado */
                            socket.emit('result', util.format(result));

                            /* Se der erro */
                        } catch (error) {
                            /* Retorna o erro */
                            socket.emit('result', error.message);
                        }
                    });

                    /* Define que já tem um socket.io agora */
                    terminalInit = true;
                });
            }

            /* Se a senha ou user estiverem incorretos e não for check */
        } else if (!isCheck) {
            /* Exibe o IP de quem realizou a tentativa */
            console.log(
                Indexer('color').echo('[TERMINAL]', 'red').value,
                Indexer('color').echo(
                    `${Indexer('sql').languages(region, 'Console', 'Refuse', true, true, envInfo).value} "${req.body.IP}"`,
                    'yellow',
                ).value,
            );

            /* Se o ip for válido */
            if (req.body.IP) {
                /* Adiciona a tentiva como +1 */
                usersTried[req.body.IP] = usersTried[req.body.IP] || 0;
                usersTried[req.body.IP] += 1;
            }

            /* Se passou do limite de tentativas prank */
            if ((usersTried[req.body.IP || 'None']) >= envInfo.parameters.prankAmount.value) {
                /* Define a página */
                const prankPage = fs.readFileSync(path.resolve('./lib/Wiki/Login/index.html')).toString();

                /* Manda para uma URL prank */
                res.send(prankPage.replace('CHANGEWITHMYLINK', envInfo.parameters.prankPage.value));

                /* Se passou do limite de tentativas, mas não passou da prank */
            } else if ((usersTried[req.body.IP || 'None']) >= envInfo.parameters.tryLimit.value) {
                /* Envia a página de bloqueado */
                res.sendFile(path.resolve('./lib/Wiki/Security/index.html'));

                /* Se não for o caso */
            } else {
                /* Define as tentativas */
                const amountOfTries = Math.floor((envInfo.parameters.tryLimit.value - usersTried[req.body.IP || 'None']) / 2);

                /* Define a página */
                const loginPage = fs.readFileSync(path.resolve('./lib/Wiki/Login/index.html')).toString();

                /* Envia ela com a mensagem de password */
                res.send(loginPage.replace('display: none; ', '').replace('REMAINTRIES123', amountOfTries));
            }

            /* Remove os IPs inválidos */
            Object.keys(usersTried).forEach((ip) => {
                /* Se o IP for incorreto */
                if (!ip.includes('.') && !ip.includes(':') && ip !== 'None') {
                    /* Deleta ele */
                    delete usersTried[ip];
                }
            });

            /* Se for check, manda o login de volta */
        } else res.sendFile(path.resolve('./lib/Wiki/Login/index.html'));

        /* Se der algum erro */
    } catch (error) {
        /* Retorna o erro recebido */
        Indexer('color').report(error, 'Terminal');

        /* Se passou do limite de tentativas */
        if ((usersTried[req.body.IP] || 0) >= envInfo.parameters.tryLimit.value) {
            /* Envia a página de bloqueado */
            res.sendFile(path.resolve('./lib/Wiki/Security/index.html'));

            /* Se não for o caso, retorna o login */
        } else res.sendFile(path.resolve('./lib/Wiki/Login/index.html'));
    }

    /* Retorna os IPs conectados, não tem muito uso */
    return isConnected;
}

/* Função para verificar se o JSON tem os campos necessários para enviar a mensagem */
function isValidMessage(jsonData) {
    /* Try para caso não seja json */
    try {
        /* Retorna true ou false, se for true é válido */
        return (
            /* Se for código válido com senha etc */
            (jsonData?.code && jsonData?.code !== 'Código JS para executar' && jsonData?.username === config?.yourName?.value && jsonData?.password === config?.secretKey?.value)

            /* Ou se os dados de mensagem forem corretos */
            /* eslint-disable-next-line no-mixed-operators */
            || (jsonData?.chatId?.includes('@g.us') || jsonData?.chatId?.includes('@s.whatsapp.net'))
            && typeof jsonData?.message === 'object'
            /* eslint-disable-next-line no-mixed-operators */
            && (typeof jsonData?.quoted === 'object' || jsonData?.quoted === false)
        );

        /* Se der erro só retorna false direto */
    } catch (err) { return false; }
}

/* Abre uma sessão do terminal */
function refStarter(
    // eslint-disable-next-line no-unused-vars
    kill = {},
) {
    /* Retorna uma promise direto */
    return new Promise((resolve) => {
        /* Define o sucesso */
        envInfo.results.success = false;

        /* Try-Catch para casos de erro */
        try {
            /* Inicia apenas se permitido pelo dono */
            if (envInfo.parameters.enableConsole.value === true) {
                /* Cria o APP */
                const app = express();
                const httpApp = express();

                /* Faz ele usar o bodyParser */
                app.use(bodyParser.urlencoded({
                    extended: true,
                }));

                /* Faz usar o JSON */
                app.use(express.json());

                /* Define o express para os arquivos da pasta Extras */
                app.use(express.static(`${irisPath}/lib/Wiki/Extras`));

                /* Inicia o APP HTTPS e define o socketIo dele */
                const httpsServer = https.createServer(httpsOptions, app);
                socketConn = socketIo(httpsServer);

                /* Inicia o APP HTTP */
                const httpServer = http.createServer(httpApp);

                /* Cria um websocket */
                const wss = new WebSocket.Server({ noServer: true });

                /* Evento de upgrade para lidar com solicitações de WebSocket */
                httpsServer.on('upgrade', (request, socket, head) => {
                    /* Verificar se o pedido de upgrade é para o endpoint '/messages' */
                    if (request.url === '/messages') {
                        /* Extraia as credenciais de autenticação do cabeçalho de upgrade */
                        const authHeader = request.headers.authorization;

                        /* Se não tiver elas */
                        if (!authHeader) {
                            /* Manda recusado, fecha a conexão e sai */
                            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                            socket.destroy();
                            return;
                        }

                        /* Formata o cabeçalho de autenticação */
                        const auth = authHeader.split(' ')[1];
                        const credentials = Buffer.from(auth, 'base64').toString().split(':');

                        /* Verificar as credenciais de autenticação */
                        if (!(credentials[0] === config.yourName.value && credentials[1] === config.secretKey.value)) {
                            /* Se tiverem erradas recusada, fecha conexão e sai */
                            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                            socket.destroy();
                            return;
                        }

                        /* Se as credenciais estiverem corretas, realiza o upgrade para WebSocket */
                        wss.handleUpgrade(request, socket, head, (ws) => wss.emit('connection', ws, request));

                        /* Se for no local errado */
                    } else {
                        /* Diz que não achou */
                        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');

                        /* E fecha a conexão */
                        socket.destroy();
                    }
                });

                // Evento de conexão WebSocket
                wss.on('connection', (ws) => {
                    /* Adicionar o cliente conectado à lista de clientes */
                    clients.push(ws);

                    /* Evento quando a conexão é fechada */
                    ws.on('close', () => {
                        /* Remove o cliente da lista quando ele desconectar */
                        clients = clients.filter((client) => client !== ws);
                    });

                    /* Diz que conectou */
                    ws.send('Conexão estabelecida com sucesso.');
                });

                /* Caso receba um request raiz */
                app.get('/', (req, res) => {
                    /* Envia a página de homepage */
                    res.redirect('/homepage');
                });

                /* Caso receba um request na homepage */
                app.get('/homepage', (req, res) => {
                    /* Define o express para os arquivos da pasta Homepage */
                    app.use(express.static(`${irisPath}/lib/Wiki/Homepage`));

                    /* Envia a página */
                    res.sendFile(path.resolve('./lib/Wiki/Homepage/index.html'));

                    /* Define o express para os arquivos da pasta Extras */
                    app.use(express.static(`${irisPath}/lib/Wiki/Homepage`));
                });

                /* Caso receba um request na home */
                app.get('/home', (req, res) => {
                    /* Envia a página Default */
                    res.sendFile(path.resolve('./lib/Wiki/Default/index.html'));
                });

                /* Caso receba um request na about */
                app.get('/login', (req, res) => {
                    /* Envia a página de login */
                    res.sendFile(path.resolve('./lib/Wiki/Login/index.html'));
                });

                /* Caso receba um request na logs */
                app.get('/logs', (req, res) => {
                    /* Envia a página de login */
                    res.sendFile(path.resolve('./lib/Wiki/Logs/index.html'));
                });

                /* Caso receba um request nas configurações */
                app.get('/editor', (req, res) => {
                    /* Envia a página de configurações JSON */
                    res.sendFile(path.resolve('./lib/Wiki/Editor/index.html'));

                    /* Define o socket se ainda não definiu */
                    socketConn = socketConn || socketIo(httpsServer);

                    /* Se receber sinal de conexão */
                    socketConn.on('connection', (socket) => {
                        /* E for pedido do editor */
                        socket.on('requestConfig', () => {
                            /* Emite os dados da config para edição */
                            socket.emit('initialData', {
                                data: config,
                                name: 'config.json',
                                location: './lib/Databases/Configurations/config.json',
                            });
                        });

                        /* Quando receber dados atualizados */
                        socket.on('updateJson', (data) => {
                            /* E for a config */
                            if (data.name === 'config.json') {
                                /* Atualiza a config no sistema */
                                config = data.data;

                                /* E no disco, não confio de deixar location aqui, então inseri manualmente o local */
                                fs.writeFileSync('./lib/Databases/Configurations/config.json', JSON.stringify(data.data, null, 4));
                            }

                            /* Emite o JSON novo de volta */
                            socket.emit('jsonUpdated', data);
                        });
                    });
                });

                /* Ativa o modo WS e alerta de como usar */
                app.get('/messages', (req, res) => {
                    /* Envia a página de Socat */
                    res.sendFile(path.resolve('./lib/Wiki/Socket/index.html'));
                });

                /* Ativa o modo POST e alerta de como usar */
                app.get('/send', (req, res) => {
                    /* Envia a página de POST */
                    res.sendFile(path.resolve('./lib/Wiki/Socket/post.html'));
                });

                /* Rota que recebe POST com JSON */
                app.post('/send', async (req, res) => {
                    /* Tenta executar o código em bloco try */
                    try {
                        /* Define os dados do JSON */
                        const jsonData = req.body;

                        /* Verifica se foram passados username e password corretos */
                        if (jsonData?.password === config.secretKey.value && jsonData?.username === config.yourName.value && Object.keys(jsonData).length > 0) {
                            /* Verifica as condições adicionais para enviar a mensagem */
                            if (isValidMessage(jsonData)) {
                                /* Define o resultado inicial */
                                const responseUse = {
                                    eval: false,
                                    other: false,
                                };

                                /* Executa eval do código recebido se permitido */
                                if (config.taskerEval.value === true && jsonData.code && jsonData?.code !== 'Código JS para executar') {
                                    /* NÃO ATIVE A CONFIGURAÇÃO TASKEREVAL SE VOCÊ NÃO VAI USAR ISSO!!! */
                                    /* Roda o código recebido */
                                    /* eslint-disable-next-line no-eval */
                                    responseUse.eval = eval(jsonData.code);

                                    /* Caso seja enviar mensagem */
                                } else {
                                    /* Realiza o envio com os dados do JSON */
                                    responseUse.other = await kill.sendMessage(jsonData.chatId, jsonData.message, jsonData.quoted);
                                }

                                /* Envia o resultado como resposta */
                                res.json(responseUse);

                                /* Envia o evento para todos os clientes conectados (WebSocket) */
                                clients.forEach((client) => {
                                    /* Desde que esteja em OPEN */
                                    if (client.readyState === WebSocket.OPEN) {
                                        /* Faz em formato de JSON */
                                        client.send(JSON.stringify(responseUse));
                                    }
                                });

                                /* Se os dados não baterem */
                            } else {
                                /* Define erro 400 e envia a mensagem de ajuda */
                                res.status(400).send('Configurações da mensagem ou código inválidos, verifique e tente novamente!');
                            }

                            /* Se a senha tiver errada ou demais */
                        } else {
                            /* Define erro 400 e envia a mensagem de ajuda */
                            res.status(400).send('Password ou Username incorretos, verifique e tente novamente!');
                        }

                        /* Se deu erro */
                    } catch (error) {
                        /* Retorna erro 500 e o log da falha */
                        console.error(error);
                        res.status(500).send(error);
                    }
                });

                /* Quando o dono finalizar o login */
                app.post('/login', (req, res) => {
                    /* Define se é um check de IP */
                    const isCheck = !(Object.keys(usersTried).includes(req.body.IP || Indexer('string').generate(10).value));

                    /* Verifica a conexão */
                    connectionCheck(req, res, httpsServer, isCheck);
                });

                /* Faz o listen no httpServer */
                httpServer.listen(envInfo.parameters.httpPort.value || 0);

                /* Faz o listen no httpsServer */
                httpsServer.listen(envInfo.parameters.httpsPort.value || 0);

                /* Roda funções após ligar o modo HTTPS, sem uso real, edite se quiser */
                httpsServer.on('listening', () => {
                    /* Envia pras funções de finalização, mas não faz nada */
                    finishStartup(httpServer, httpsServer, 'https');
                });

                /* Verifica se já está tudo funcional */
                httpServer.on('listening', () => {
                    /* Roda as funções http */
                    finishStartup(httpServer, httpsServer, 'http');
                });

                /* Caso acesse o terminal via HTTP, redireciona para HTTPS */
                httpApp.get('*', (req, res) => res.redirect(`https://${req.headers.host.replace(/:.*$/gi, '')}:${portsRunning[1]}`));

                /* Diz a password e username */
                console.log(
                    Indexer('color').echo('[TERMINAL LOGIN]', 'yellow').value,
                    '→',
                    Indexer('color').echo('Username:', 'brightYellow').value,
                    Indexer('color').echo(
                        `${Indexer('color').echo(userLogin, 'bold').value}`,
                        'blackBG',
                    ).value,
                    '|',
                    Indexer('color').echo('Password:', 'brightYellow').value,
                    Indexer('color').echo(
                        `${Indexer('color').echo(userPass, 'bold').value}`,
                        'blackBG',
                    ).value,
                    Indexer('color').echo('\n[TERMINAL]', 'green').value,
                    Indexer('color').echo(Indexer('sql').languages(region, 'Console', 'Pass', true, true).value, 'brightRed').value,
                    Indexer('color').echo('\n[CHANGE PASS/LOGIN]', 'green').value,
                    '→',
                    Indexer('color').echo('[userLogin, userPass] = [\'novoLogin\',\'novaSenha\']', 'bold').value,
                );

                /* Informa sobre problemas com certificado */
                console.log(
                    Indexer('color').echo('[TERMINAL]', 'green').value,
                    Indexer('color').echo(Indexer('sql').languages(region, 'Console', 'Safety', true, true).value, 'yellow').value,
                );
            }

            /* Define o sucesso */
            envInfo.results.success = true;

            /* Se deu algum erro */
        } catch (error) {
            /* Insere tudo na envInfo */
            echoError(error);
        }

        /* Retorna o dialogo */
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
        return postResults(envInfo.results);
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
        envInfo.functions.poswork.value = postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = echoError;

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
        echoError(error);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
