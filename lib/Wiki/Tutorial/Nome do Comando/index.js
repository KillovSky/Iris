/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
/* Apague dessa linha para cima quando começar a programar */

/* Requires */
const fs = require('fs');
const path = require('path');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
const Indexer = require('../../index');

/**
 * Estrutura de dados que descreve as configurações padrões de um comando, módulo ou função criados no Projeto Íris.
 * @typedef {Object} envInfo
 * @property {string} name - O nome do comando, módulo ou função.
 * @property {string} description - A descrição do comando, módulo ou função.
 * @property {Object} usage - Detalhes sobre como usar o comando, módulo ou função.
 * @property {string} usage.general - Uso geral do comando, módulo ou função.
 * @property {string[]} usage.examples - Exemplos de uso do comando, módulo ou função.
 * @property {string} license - A licença associada ao comando, módulo ou função.
 * @property {string[]} helps - Dicas adicionais sobre o comando, módulo ou função.
 * @property {Object.<string, string>} exports - As funções exportadas pelo comando, módulo ou função.
 * @property {string} developer - O desenvolvedor responsável pelo comando, módulo ou função.
 * @property {Object.<string, string>} files - Os arquivos relacionados ao comando, módulo ou função.
 * @property {Object.<string, string>} modules - Os módulos utilizados pelo comando, módulo ou função.
 * @property {Object.<string, FunctionDetails>} functions - Os detalhes das funções do comando, módulo ou função.
 * @property {Object.<string, ConfigSetting>} settings - As configurações do comando, módulo ou função.
 * @property {Object.<string, Parameter>} parameters - Os parâmetros adicionais do comando, módulo ou função.
 * @property {Result} results - O resultado final da função.
 */

/**
 * Detalhes de uma função.
 * @typedef {Object} FunctionDetails
 * @property {Object.<string, Argument>} arguments - Os argumentos da função.
 * @property {string} description - A descrição da função.
 * @property {string} type - O tipo de retorno da função.
 * @property {*} value - O valor padrão da função.
 */

/**
 * Detalhes de um argumento da função.
 * @typedef {Object} Argument
 * @property {string} description - A descrição do argumento.
 * @property {string} type - O tipo do argumento.
 * @property {*} value - O valor padrão do argumento.
 */

/**
 * Configuração de uma função.
 * @typedef {Object} ConfigSetting
 * @property {string} description - A descrição da configuração.
 * @property {string} type - O tipo da configuração.
 * @property {*} value - O valor padrão da configuração.
 */

/**
 * Parâmetro adicional do comando.
 * @typedef {Object} Parameter
 * @property {string} description - A descrição do parâmetro.
 * @property {string} type - O tipo do parâmetro.
 * @property {*} value - O valor padrão do parâmetro.
 */

/**
 * Resultado final da função.
 * @typedef {Object} Result
 * @property {string} description - A descrição do resultado.
 * @property {boolean} success - Indica se a função foi um sucesso.
 * @property {string} type - O tipo do resultado.
 * @property {*} value - O valor retornado pela função.
 */

/**
 * Configuração de fábrica do comando.
 * @type {envInfo}
 */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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

/**
 * @typedef {Object} LevelSettings
 * @property {Object} card - Determina se Íris deve enviar cartões de nível sempre que alguém atingir um novo nível.
 * @property {boolean} card.value - O valor booleano para ativar ou desativar os cartões de nível.
 * @property {Object} materials - A base de materiais obtidos por nível, usados para calcular o valor ótimo a fornecer.
 * @property {number} materials.multiply - O multiplicador para calcular a quantidade de materiais por nível.
 * @property {number} materials.attenuation - A atenuação aplicada aos materiais por nível.
 * @property {Object} materials.wins - A quantidade de cada tipo de material ganho por vitória.
 * @property {number} materials.wins.coin - Quantidade de moedas ganhas por vitória.
 * @property {number} materials.wins.diamond - Quantidade de diamantes ganhos por vitória.
 * @property {number} materials.wins.rubi - Quantidade de rubis ganhos por vitória.
 * @property {number} materials.wins.gold - Quantidade de ouro ganho por vitória.
 * @property {number} materials.wins.iron - Quantidade de ferro ganho por vitória.
 * @property {number} materials.wins.stone - Quantidade de pedra ganha por vitória.
 * @property {number} materials.wins.wood - Quantidade de madeira ganha por vitória.
 * @property {Object} messageXP - A quantidade de XP obtida por mensagem, excluindo mensagens desativadas, como reações.
 * @property {number} messageXP.value - A quantidade de XP obtida por mensagem.
 * @property {Object} base - A XP base para subir de nível, aplicada para calcular a XP correta por nível de usuário.
 * @property {number} base.value - A quantidade base de XP para subir de nível.
 * @property {Object} multiplier - O multiplicador usado para calcular os requisitos para alcançar o próximo nível.
 * @property {number} multiplier.value - O valor do multiplicador.
 * @property {Object} patentes - Os nomes dos níveis em diferentes idiomas.
 * @property {Object.<string, string>} patentes.pt - Níveis em português.
 * @property {Object.<string, string>} patentes.jp - Níveis em japonês.
 * @property {Object.<string, string>} patentes.en - Níveis em inglês.
 * @property {Object.<string, string>} patentes.fr - Níveis em francês.
 * @property {Object.<string, string>} patentes.es - Níveis em espanhol.
 * @property {Object.<string, string>} patentes.id - Níveis em indonésio.
 * @property {Object.<string, string>} patentes.ms - Níveis em malaio.
 * @property {Object.<string, string>} patentes.hi - Níveis em hindi.
 * @property {Object.<string, string>} patentes.de - Níveis em alemão.
 * @property {Object.<string, string>} patentes.it - Níveis em italiano.
 * @property {Object.<string, string>} patentes.ru - Níveis em russo.
 * @property {Object.<string, string>} patentes.lat - Níveis em latim.
*/

/**
  * Object com todos os dados da mensagem e demais funções.
  * @typedef {Object} SpecificInfo
  * @property {number} actualMoment - O momento atual em milissegundos.
  * @property {string} readDate - A data de leitura da mensagem, em segundos.
  * @property {LevelSettings} levelSettings - As configurações de nível.
  * @property {Array<string>} allCommands - Todos os comandos disponíveis.
  * @property {Object} quoteThis - A mensagem a ser citada.
  * @property {Object} quoteThis.message - A mensagem citada.
  * @property {Object} quoteThis.backupMessage - Backup da mensagem original.
  * @property {number} timestamp - O timestamp da mensagem.
  * @property {string} pingTime - O tempo de ping avançado.
  * @property {number} procTime - O tempo de ping.
  * @property {Object} editedMessageObj - O objeto da mensagem editada.
  * @property {boolean} editedMessage - Indica se a mensagem foi editada.
  * @property {string} messageKey - A chave da mensagem.
  * @property {boolean} isViewOnce - Indica se a mensagem é do tipo ViewOnce.
  * @property {Object} basemessage - A mensagem base.
  * @property {Object} encryptMedia - A mídia criptografada.
  * @property {Object} quotedMsg - A mensagem citada.
  * @property {boolean} isQuotedMsg - Indica se a mensagem é citada.
  * @property {Object} quotedMsgObj - O objeto da mensagem citada.
  * @property {boolean} isMedia - Indica se a mensagem é uma mídia.
  * @property {Array<string>} decryptFormats - Os formatos de mídia para descriptografia.
  * @property {string} type - O tipo de mensagem.
  * @property {string} typeFormatted - O tipo de mensagem formatado.
  * @property {number} dateOfDay - A hora do dia.
  * @property {string} time - O tempo da mensagem.
  * @property {number} debugExec - O tempo de execução de debug.
  * @property {string} sender - O remetente da mensagem.
  * @property {Object} chat - O chat da mensagem.
  * @property {string} originalName - O nome original do grupo.
  * @property {string} name - O nome do grupo.
  * @property {string} user - O número do remetente.
  * @property {string} userFormated - O número do remetente formatado.
  * @property {string} originalPushname - O pushname original.
  * @property {string} pushname - O pushname formatado.
  * @property {string} chatId - A ID do chat.
  * @property {boolean} isGroup - Indica se é um grupo.
  * @property {boolean} isGroupMsg - Indica se é uma mensagem de grupo.
  * @property {string} id - A ID da mensagem.
  * @property {string} serial - A cópia da ID da mensagem.
  * @property {string} mimetype - O tipo de mídia da mensagem.
  * @property {boolean} isVideo - Indica se a mensagem é um vídeo.
  * @property {boolean} isImage - Indica se a mensagem é uma imagem.
  * @property {boolean} canSticker - Indica se é possível fazer um sticker da mídia.
  * @property {Object} personal - Os dados pessoais do remetente.
  * @property {string} region - A região do idioma.
  * @property {Object} functions - As funções do grupo.
  * @property {Object} Leveling - Os dados de leveling do usuário.
  * @property {Object} Bank - Os dados bancários do usuário.
  * @property {Array<string>} prefixes - Os prefixos disponíveis.
  * @property {string} prefix - O prefixo usado na mensagem.
  * @property {string} body - O conteúdo da mensagem.
  * @property {Array<Object>} urlData - Os dados das URLs encontradas na mensagem.
  * @property {boolean} isInvite - Indica se a mensagem é um convite.
  * @property {Array<string>} arguments - Os argumentos da mensagem.
  * @property {Array<string>} args - Os argumentos sem o comando.
  * @property {string} arg - Os argumentos em uma única string.
  * @property {Array<string>} argl - Os argumentos em lowercase.
  * @property {string} arks - Os argumentos em lowercase em uma única string.
  * @property {Array<string>} argc - Os argumentos em uppercase.
  * @property {string} arqc - Os argumentos em uppercase em uma única string.
  * @property {Array<string>} emojis - Os emojis encontrados na mensagem.
  * @property {boolean} isCmd - Indica se a mensagem é um comando.
  * @property {string} decryptedMedia - A mídia descriptografada.
  * @property {string} command - O comando da mensagem.
  * @property {string} commander - O responsável pelo comando.
  * @property {Object} mentionFinder - O objeto de busca por menções.
  * @property {Array<string>} mentionedJidList - A lista de IDs mencionados.
  * @property {Array<string>} mentionedJidListFormated - A lista de IDs mencionados formatados.
  * @property {Array<string>} groupMembersId - A lista de IDs dos membros do grupo.
  * @property {Array<string>} groupMembersIdFormated - A lista de IDs dos membros do grupo formatados.
  * @property {Array<string>} groupAdmins - A lista de IDs dos administradores do grupo.
  * @property {Array<string>} groupAdminsFormated - A lista de IDs dos admins do grupo formatados.
  * @property {boolean} isGroupAdmins - Indica se o remetente é um administrador do grupo.
  * @property {boolean} isBotGroupAdmins - Indica se a Íris é um administrador do grupo.
  * @property {Object} groupCreator - O criador do grupo.
  * @property {boolean} isGroupCreator - Indica se o remetente é o criador do grupo.
  * @property {boolean} isOwner - Indica se o remetente é o dono do bot.
  * @property {boolean} isBot - Indica se a mensagem foi enviada pela Íris.
  * @property {string} userPlatform - A plataforma do usuário.
  * @property {string[]} blockNumber - A lista de números bloqueados.
  * @property {boolean} isBlocked - Indica se o remetente está bloqueado.
  * @property {object} stickerConfig - As configurações do sticker.
  * @property {boolean} isVIP - Indica se o remetente é VIP.
  * @property {boolean} isModerator - Indica se o remetente é moderador.
  * @property {boolean} isAllowed - Indica se o remetente tem permissão para executar o comando.
  * @property {string} suggestCMD - Sugestão de comando.
  * @property {number} side - Número aleatório entre 1 e 2.
  * @property {number} lvpc - Número aleatório entre 1 e 100.
  * @property {string} typeChat - Tipo de chat ('groups' ou 'private').
  * @property {string} typeName - Nome do remetente (grupo ou usuário).
  * @property {string} typeId - ID do remetente (grupo ou usuário).
  * @property {string} randomMember - Membro aleatório do grupo.
  * @property {string} upperCommand - Comando com a primeira letra em maiúscula.
  * @property {string[]} alias - Alias dos comandos.
  * @property {object} functions - Funções do grupo.
  * @property {object} leveling - Dados de level do usuário.
  * @property {object} bank - Dados bancários do usuário.
  * @property {string} oldbody - Corpo antigo da mensagem.
  * @property {string} content - Conteúdo da mensagem.
  * @property {string} caption - Legenda da mensagem.
  * @property {string} comment - Comentário da mensagem.
  * @property {string} filename - Nome do arquivo da mensagem.
  * @property {string} matchedText - Texto correspondido na mensagem.
  * @property {string} text - Texto da mensagem.
  * @property {string} descriptionT - Descrição da mensagem.
  * @property {string} titleT - Título da mensagem.
  * @property {string} pollName - Nome da enquete.
  * @property {string[]} pollOptions - Opções da enquete.
  * @property {string} recMessage - Mensagem recebida.
  * @property {boolean} isSticker - Indica se a mensagem é um sticker.
  * @property {boolean} isQuotedSticker - Indica se a mensagem possui um sticker citado.
  * @property {boolean} isAnimated - Indica se o sticker é animado.
  * @property {boolean} isQuotedAnimated - Indica se o sticker citado é animado.
  * @property {object} stickerMetadata - Metadados do sticker.
  * @property {string[]} allPatents - Todas as patentes disponíveis.
  * @property {string} patente - A patente do usuário.
  * @property {number} requiredXP - O XP necessário para o próximo nível.
  * @property {object} winTaxes - Os ganhos do usuário ao subir de nível.
  * @property {object} leveling - Dados de level do usuário atualizados.
  * @property {string[]} profilePics - A foto de perfil do usuário.
*/

/**
 * Um objeto com uma propriedade "value" que é do tipo {SpecificInfo}.
 * @typedef {Object} MyObject
 * @property {SpecificInfo} value - Object com todos os dados.
*/

/**
 * Cria a função de comando, EDITE O NOME DELA AQUI
 * @param {MyObject} env - A object contendo as informações.
*/
async function myFunction(
    kill = envInfo.functions.exec.arguments.kill.value,
    env = envInfo.functions.exec.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            /*
                Programe seu comando abaixo:
                kill: https://whiskeysockets.github.io/Baileys/functions/makeWASocket.html
                env: Olhe o arquivo: Lib/Commands/Construct/Index.js
                -----
                Forma de uso do kill: kill.função
                Forma de uso da env: env.value.objectKey
                -----
                Exemplo: const { chatId, user, isOwner, body, quoteThis } = env.value;
                Exemplo2: await kill.sendMessage(chatId, { text: body }, reply)
            */

            /* COMECE A PROGRAMAR DAQUI */

            /* Insere o resultado na envInfo para retornar tudo
                Exemplo: Define o que o comando retorna
                Apague isso e defina o valor final do seu sistema
            */
            envInfo.results.value = 'Oi, essa é a resposta final do comando!';
        }

        /*
            Define o sucesso, se seu comando der erro isso jamais será chamado
            Então o success automaticamente será false em falhas
        */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        /* Insira o name que você definiu na envInfo (name) onde pede abaixo */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'Insira o mesmo que na envInfo.name',
                time: (new Date()).toLocaleString(),
            }).value,
        }, env.value.reply);
    }

    /* Retorna os resultados */
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

        /* Insere a myFunction na envInfo, EDITE O NOME DELA AQUI */
        envInfo.functions.exec.value = myFunction;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.exec]: envInfo.functions.exec.value,
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
