/* eslint-disable no-case-declarations */
/* eslint-disable no-eval */
/* eslint-disable indent */

/* Imports */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import Indexer from '../../index.js';

/* Define as funções __dirname e __filename com equivalentes em ESM */
const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

/* JSON"S | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${thisDir}/utils.json`));
let externalCodes = JSON.parse(fs.readFileSync(`${irisPath}/lib/Databases/Configurations/external.json`));
externalCodes = externalCodes.commands.value;
let commandFound = false;

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
 * Função para fazer checagem de comandos sem prefix. Verifica se um comando específico foi
 * encontrado, com opções para diferenciar entre comandos com ou sem prefixo.
 *
 * @param {string} [commandName=''] - O nome do comando a ser verificado.
 * @param {boolean} [onlyCommand=false] - Define se a verificação deve considerar apenas
 * comandos com prefixo (true) ou sem prefixo (false).
 * @param {boolean} [isCommand=false] - Defina essa opção como 'isCmd' e não mexa nela, pois ela é
 * responsável pela validação, se desejar customizar mais o prefix, edite apenas o 'onlyCommand'.
 * @returns {string|boolean} - Retorna o nome do comando encontrado (sem prefixo) se a
 * verificação for bem-sucedida, ou `false` caso contrário.
 */
function caseChecker(
    commandName = '',
    onlyCommand = false,
    isCommand = false,
) {
    /* Checa se possui o comando, não possui case insensitive */
    if (
        (commandFound.includes(commandName) && onlyCommand === false && isCommand === false)
        || (commandFound === commandName && onlyCommand === true && isCommand === true)
    ) {
        /* Retorna o 'comando' sem prefix */
        return commandFound;
    }

    /* Retorna que não achou */
    return false;
}

/**
 * Função que executa comandos com base no input recebido.
 *
 * @async
 * @function caseDefault
 * @param {boolean} [kill=false] - Funções padrões do Baileys, como sendMessage.
 * @param {Object} [env=false] - Objeto contendo informações do ambiente, como chatId, user, etc.
 * @returns {Promise<Object>} Retorna um objeto com os resultados da execução.
 */
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
                mentionedJidList,
                allCommands,
                argl,
                reply,
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
            /* Caso queira tornar o uso de comandos sem prefix insensitivo... */
            /* ...Adicione .toLowerCase() no commandFound da switch abaixo */
            /* eslint-disable-next-line padded-blocks */
            switch (commandFound) {

                /*
                    As cases são sensíveis com os caracteres recebidos...
                    Então cuidado com letras maiúsculas, números, símbolos e demais...
                    Você pode obter a ID da mensagem enviada usando 'envInfo.results.value ='...
                    ...antes de usar 'await kill' para enviar a mensagem.
                    =========================
                    Para criar comandos sem prefix, siga o mesmo estilo abaixo
                    Comandos sem prefix com ESPAÇOS funcionam agora!
                    E também diferenciam de letras maiúsculas, símbolos e números!
                    Funcionam até se inserir no meio da mensagem, cuidado!
                    Uso: caseChecker('nome do seu comando sem prefix', false, isCmd)
                    =========================
                    Para criar comandos com prefix, use da seguinte forma:
                    Uso: caseChecker('comando', true, isCmd)
                    =========================
                    Não defina nada em isCmd, apenas envie como está, apenas isCmd
                    Se você apenas digitar case 'comando', sem usar a função caseChecker
                    Digitar o nome do comando no WhatsApp pode executar o mesmo sem argumentos
                    Sendo um tipo de pseudo comando sem prefix
                    É arriscado no caso de bash, getvar e outros
                    Então se for um comando, use a função caseChecker
                    =========================
                    Se você definir que quer executar somente se for comando
                    Mas então definir o isCmd como false
                    Nada será executado, atente-se a isso
                    =========================
                    Em geral é: caseChecker("Command", "Only Command? (true/false)", isCmd)
                */
                case 'oldcommandsystem+@123':
                case 'old command system +@123':
                case 'OLD COMMAND SYSTEM +@123':
                case caseChecker('noprefix123+@', false, isCmd):
                case caseChecker('no prefix 123 +@', false, isCmd):
                case caseChecker('NO PREFIX 123 +@', false, isCmd):
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Standard', true, true, env.value).value }, reply);
                break;

                /*
                    Esse sistema permite executar códigos pelo WhatsApp
                    Evite mexer nos parâmetros deste, pois é perigoso
                */
                case caseChecker('eval', true, isCmd):
                    if (isOwner === true) return eval(arg);
                break;

                /*
                    Esse sistema permite executar Bash pelo WhatsApp
                    Evite mexer nos parâmetros deste, pois é perigoso
                */
                case caseChecker('bash', true, isCmd):
                    if (isOwner === true) {
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('bash').bash(arg).value }, reply);
                    }
                break;

                /*
                    Esse sistema permite obter variáveis do sistema
                    Evite mexer nos parâmetros deste, pois é perigoso
                */
                case caseChecker('getvar', true, isCmd):
                    /* eslint-disable-next-line no-eval */
                    if (isOwner === true) {
                        eval(`kill.sendMessage(chatId, { text: JSON.stringify(${arg}, null, 4) }, reply);`);
                    }
                break;

                /*
                    Case do menu, ele é autoconstruído usando Bash Scripting.
                    Alguns comandos, como o caso desses em formato de case...
                    ...Não aparecerão no menu
                */
                case caseChecker('menu', true, isCmd):
                    const showHelp = argl.includes('--help') || argl.includes('-help') ? `${JSON.stringify(Indexer('sql').languages(region, 'Helper', 'Menu', true, true, env.value).value)}` : '';
                    const setSearch = argl[0] === '--help' ? '.*' : argl[0];
                    const menuText = Indexer('bash').bash(`bash "${irisPath}/lib/Scripts/Others/Menu.sh" "${setSearch}" ${JSON.stringify(showHelp)} "${prefix}"`).value;
                    const menuObject = config.useBanner.value && !argl.includes('-text') && !argl.includes('--text') ? { image: { url: `${thisDir}/Cache/Banner.png` }, caption: menuText } : { text: menuText };
                    envInfo.results.value = await kill.sendMessage(chatId, menuObject, reply);
                break;

                /* Case do allCommands, retorna todos os comandos e alias */
                case caseChecker('allcmd', true, isCmd):
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: `_COMANDOS:_ *${allCommands.length}*\n\n${allCommands.sort().join('\n')}`,
                    }, reply);
                break;

                /* Comando para marcar a pessoa */
                case caseChecker('marcar', true, isCmd):
                case caseChecker('wame', true, isCmd):
                    envInfo.results.value = await kill.sendMessage(chatId, {
                        text: mentionedJidList.map((num) => `👤 @${num.replace(/@s.whatsapp.net|@lid/gi, '')}\n📎 wa.me/${num.replace(/@s.whatsapp.net|@lid/gi, '')}\n📞 ${num.replace(/@s.whatsapp.net|@lid/gi, '')}\n`).join('\n'),
                        mentions: mentionedJidList,
                    }, reply);
                break;

                /*
                    Default, não insira nada fora do if...
                    As mensagens que NÃO são comandos caem fora do if!
                */
                default:
                    if (isCmd === true && !externalCodes.includes(commandFound)) {
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Test', true, true, env.value).value }, reply);
                    }
                break;
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, thisDir);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

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
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.exec]: { value: caseDefault },
        [envInfo.exports.checker]: { value: caseChecker },
    },
    parameters: {
        location: { value: thisFile },
    },
}, envFile, changeKey, dirname);

/* Exporta todas as funções */
export default resetLocal();
