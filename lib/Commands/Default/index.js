/* eslint-disable no-eval */
/* eslint-disable indent */

/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../index');
const language = require('../../Dialogues');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let commandFound = false;

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

/* Função para fazer checagem de comandos sem prefix */
function caseChecker(
    whatFinder = false,
) {
    /* Checa se possui o comando, não possui case insensitive */
    if (commandFound.includes(whatFinder)) {
        /* Retorna o 'comando' sem prefix */
        return commandFound;
    }

    /* Retorna que não achou */
    return false;
}

/* Exporta a função que roda os comandos */
async function caseDefault(
    kill = false,
    env = false,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Importa os parâmetros, basta inserir o nome do que quiser pegar */
            const {
                chatId,
                isOwner,
                isCmd,
                prefix,
                argl,
                quoteThis,
                arg,
            } = env.value;

            /* Define o comando na envInfo para caso seja no-prefix */
            commandFound = env.value.command;

            /* Caso não seja um 'comando' */
            if (isCmd === false) {
                /* Define a mensagem como comando */
                commandFound = env.value.body;
            }

            /* Switch para os comandos, para saber mais leia os tutoriais */
            /* eslint-disable-next-line padded-blocks */
            switch (commandFound) {

                /*
                    As cases são sensíveis com os caracteres recebidos...
                    Então cuidado com letras maiúsculas, números, símbolos e demais...
                    Você pode obter a ID da mensagem enviada usando 'envInfo.results.value ='...
                    ...antes de usar 'await kill' para enviar a mensagem.
                */

                /*
                    Construção de comandos de forma antiga ainda funciona!
                    Porem agora eles suportam ESPAÇOS!
                    E diferenciam de letras, símbolos e números!
                */
                case 'oldcommandsystem+@123':
                case 'old command system +@123':
                case 'OLD COMMAND SYSTEM +@123':
                    envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Cases', 'Standard', true, true, env.value) }, { quoted: quoteThis });
                break;

                /*
                    Para criar comandos sem prefix, siga o mesmo estilo abaixo
                    Comandos sem prefix com ESPAÇOS funcionam agora!
                    E também diferenciam de letras maiúsculas, símbolos e números!
                    Funcionam até se inserir no meio da mensagem, cuidado!
                    Uso: caseChecker('nome do seu comando sem prefix')
                */
                case caseChecker('noprefix123+@'):
                case caseChecker('no prefix 123 +@'):
                case caseChecker('NO PREFIX 123 +@'):
                    envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Cases', 'Standard', true, true, env.value) }, { quoted: quoteThis });
                break;

                /*
                    Esse sistema permite executar códigos pelo WhatsApp
                    Evite mexer nos parâmetros deste, pois é perigoso
                */
                case 'eval':
                    if (isOwner === true) return eval(arg);
                break;

                /*
                    Esse sistema permite executar Bash pelo WhatsApp
                    Evite mexer nos parâmetros deste, pois é perigoso
                */
                case 'bash':
                    if (isOwner === true) {
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('bash').bash(arg).value }, { quoted: quoteThis });
                    }
                break;

                /*
                    Esse sistema permite obter variaveis do sistema
                    Evite mexer nos parâmetros deste, pois é perigoso
                */
                case 'getvar':
                    /* eslint-disable-next-line no-eval */
                    if (isOwner === true) {
                        eval(`kill.sendMessage(chatId, { text: JSON.stringify(${arg}, null, 4) }, { quoted: quoteThis });`);
                    }
                break;

                /*
                    Case do menu, ele é autoconstruido usando Bash Scripting.
                    Alguns comandos, como o caso desses em formato de case...
                    ...Não aparecerão no menu
                */
                case 'menu':
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: Indexer('bash').bash(`bash "${irisPath}/lib/Scripts/Menu.sh" "${argl[0]}" ${JSON.stringify(language(region, 'Helper', 'Menu', true, true, env.value))} "${prefix}"`).value,
                    }, { quoted: quoteThis });
                break;

                /*
                    Default, não insira nada fora do if...
                    As mensagens que NÃO são comandos caem fora do if!
                */
                default:
                    if (isCmd === true) {
                        envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Cases', 'Test', true, true, env.value) }, { quoted: quoteThis });
                    }
                break;
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna a nova Array */
    return postResults(envInfo.results);
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

        /* Insere a caseDefault na envInfo */
        envInfo.functions.exec.value = caseDefault;

        /* Insere a caseChecker na envInfo */
        envInfo.functions.checker.value = caseChecker;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.exec]: envInfo.functions.exec.value,
                [envInfo.exports.checker]: envInfo.functions.checker.value,
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
