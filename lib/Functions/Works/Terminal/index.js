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
const Indexer = require('../../../index');
const language = require('../../../Dialogues');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let terminalInit = false;
let portsRunning = [];

/* Para restaurar depois */
const print = console.log;

/* Certificado TLS */
const httpsOptions = {
    key: fs.readFileSync(`${__dirname}/Security/Server.key`, 'utf8'),
    cert: fs.readFileSync(`${__dirname}/Security/Server.crt`, 'utf8'),
};

/* Define o nome de usuário com base na configuração */
/* eslint-disable-next-line prefer-const */
let userLogin = String(envInfo.parameters.defaultUser.value || Indexer('string').generate(envInfo.parameters.userLogin.value));

/* Define a password de usuário com base na configuração */
// eslint-disable-next-line prefer-const
let userPass = String(envInfo.parameters.defaultPass.value || Indexer('string').generate(envInfo.parameters.userPass.value));

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

                /* Define o express para os arquivos da pasta Extras */
                app.use(express.static(`${irisPath}/lib/Wiki/Extras`));

                /* Inicia o APP HTTPS */
                const httpsServer = https.createServer(httpsOptions, app);

                /* Inicia o APP HTTP */
                const httpServer = http.createServer(httpApp);
                
                /* Caso receba um request raiz */
                app.get('/', (req, res) => {
                    /* Envia a página da Github */
                    res.redirect('/homepage');
                });

                /* Caso receba um request raiz */
                app.get('/homepage', (req, res) => {
                    /* Define o express para os arquivos da pasta Homepage */
                    app.use(express.static(`${irisPath}/lib/Wiki/Homepage`));

                    /* Envia a página Default */
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
                app.get('/github', (req, res) => {
                    /* Envia a página da Github */
                    res.redirect('https://github.com/KillovSky/Iris');
                });

                /* Caso receba um request na about */
                app.get('/login', (req, res) => {
                    /* Envia a página de login */
                    res.sendFile(path.resolve('./lib/Wiki/Login/index.html'));
                });

                /* Quando o dono finalizar o login */
                app.post('/login', (req, res) => {
                    /* Try-Catch para caso possua erros */
                    try {
                        /* Aumenta o contador do IP */
                        usersTried[req.body.IP || 'None'] = usersTried[req.body.IP] || 0;
                        usersTried[req.body.IP || 'None'] += 1;

                        /* Se não fez a prank e a pessoa continua tentando */
                        if ((usersTried[req.body.IP || 'None']) === (envInfo.parameters.prankAmount.value)) {
                            /* Define a página prank */
                            const prankPage = fs.readFileSync(path.resolve('./lib/Wiki/Hacked/index.html')).toString();

                            /* Manda para uma URL prank */
                            res.send(prankPage.replace('CHANGEWITHMYLINK', envInfo.parameters.prankPage.value));

                            /* Se passou do limite de tentativas prank e já fez a prank */
                        } else if ((usersTried[req.body.IP || 'None']) >= envInfo.parameters.prankAmount.value) {
                            /* Redireciona direto */
                            res.send(`<script>window.top.location.href = '${envInfo.parameters.prankPage.value}'</script>`);

                            /* Se passou do limite de tentativas, mas não passou da prank */
                        } else if ((usersTried[req.body.IP || 'None']) >= envInfo.parameters.tryLimit.value && (usersTried[req.body.IP || 'None']) <= envInfo.parameters.prankAmount.value) {
                            /* Envia a página de bloqueado */
                            res.sendFile(path.resolve('./lib/Wiki/Security/index.html'));

                            /* Se não for o caso, verifica se digitou o login corretamente */
                        } else if ((req.body.username === userLogin && req.body.password === userPass) || (req.body.username === config.yourName.value && req.body.password === config.secretKey.value)) {
                            /* Exibe o IP de quem logou */
                            console.log(
                                Indexer('color').echo('[TERMINAL]', 'green').value,
                                Indexer('color').echo(
                                    `${language(region, 'Console', 'Granted', true, true)} "${req.body.IP}"`,
                                    'yellow',
                                ).value,
                            );

                            /* Reseta o contador do IP para não bloquear */
                            usersTried[req.body.IP || 'None'] = 0;

                            /* Envia a página de terminal */
                            res.sendFile(path.resolve('./lib/Wiki/Terminal/index.html'));

                            /* Verifica se já tem um socket.io criado */
                            if (!terminalInit) {
                                /* Se não tiver, cria */
                                const io = socketIo(httpsServer);

                                /* Em caso de de conexão */
                                io.on('connection', (socket) => {
                                    /* Com comando */
                                    socket.on('command', (data) => {
                                        /* Faz um try catch com o eval */
                                        try {
                                            /* Converte o console.log em algo para usar no eval */
                                            console.log = (...val) => util.format(val);

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

                                        /* Reseta o console.log */
                                        console.log = print;
                                    });

                                    /* Define que já tem um socket.io agora */
                                    terminalInit = true;
                                });
                            }

                            /* Se a senha ou user estiverem incorretos */
                        } else {
                            /* Exibe o IP de quem realizou a tentativa */
                            console.log(
                                Indexer('color').echo('[TERMINAL]', 'red').value,
                                Indexer('color').echo(
                                    `${language(region, 'Console', 'Refuse', true, true)} "${req.body.IP}"`,
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
                        }

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
                    return usersTried;
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
                    Indexer('color').echo(language(region, 'Console', 'Pass', true, true), 'brightRed').value,
                    Indexer('color').echo('\n[CHANGE PASS/LOGIN]', 'green').value,
                    '→',
                    Indexer('color').echo('[userLogin, userPass] = [\'novoLogin\',\'novaSenha\']', 'bold').value,
                );

                /* Informa sobre problemas com certificado */
                console.log(
                    Indexer('color').echo('[TERMINAL]', 'green').value,
                    Indexer('color').echo(language(region, 'Console', 'Safety', true, true), 'yellow').value,
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
