/* eslint-disable no-irregular-whitespace */
/* eslint-disable max-len */

/* Imports */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import Indexer from '../../index.js';

/* Define as funções __dirname e __filename com equivalentes em ESM */
const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${thisDir}/utils.json`));
const translateKeys = JSON.parse(fs.readFileSync(`${thisDir}/translate.json`));

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
* Gera uma lista de funções ativadas e desativadas junto com detalhes adicionais.
 *
 * @param {Object} data – Os dados que contêm informações da função.
 * @param {string} lang – O código do idioma para traduções.
 * @param {string} chatId – A id do chat atualmente.
 * @returns {string} – Uma string formatada com funções habilitadas e desabilitadas e detalhes adicionais.
 */
function generateList(data, chatId, lang = 'pt') {
    /* Define os textos de cada categoria */
    const enabledFunctions = [];
    const disabledFunctions = [];
    const additionalKeys = [];
    const translation = translateKeys[lang] || translateKeys.pt;

    /* Faz uma espécie de loop para cada valor da object */
    Object.entries(data).forEach(([key, value]) => {
        /* Se for realmente uma Object, não for vazio ou array */
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            /* Pega o valor de enable e o resto */
            const { enable, ...rest } = value;

            /* Se enable for diferente de undefined em typeof */
            if (typeof enable !== 'undefined') {
                /* Verifica se é algo true */
                if (enable) {
                    /* Se sim, adiciona a função na lista de ativadores */
                    enabledFunctions.push(key);

                    /* Adiciona na lista adicional */
                    additionalKeys.push(`> *# ${key?.toUpperCase() || 'N/A'}*`);
                    additionalKeys.push(`- *${translation.enable}:* ${enable ? '✔️' : '❌'}`);

                    /* E formata suas subkeys */
                    Object.entries(rest).forEach(([subKey, subValue]) => {
                        /* Traduz a chave, se houver tradução disponível */
                        const translatedKey = translation[subKey] || subKey;
                        let valueKey = subValue;

                        /* Se subkey for uma @user */
                        if (typeof valueKey === 'string' || typeof valueKey === 'number') {
                            /* E tiver certinho a id com @s... */
                            if (String(valueKey).includes('@s.whatsapp.net') || String(valueKey).includes('@lid')) {
                                /* Obtém os valores de nome da DB para não marcar a pessoa */
                                const userData = Indexer('sql').get('personal', valueKey, chatId).value;

                                /* E usa seu nome no lugar do valor de ID */
                                valueKey = (userData.name.text === 'default' ? (userData.name?.number?.slice(0, 9) || 'N/A') : `${userData.name.text} [${(userData.name?.number?.slice(0, 9) || 'N/A')}...]`);

                                /* Se caso for números apenas e acima de 0, é pra ser uma data */
                            } else if (String(valueKey) !== '0' && typeof valueKey === 'number') {
                                /* Checa se é data */
                                const isDate = Indexer('others').date(valueKey);

                                /* Se for válida e identificada como data */
                                if (isDate?.value?.date === true) {
                                    /* Insere como data em vez de epoch */
                                    valueKey = isDate?.value?.toLocaleString;
                                }
                            }

                            /* Se for uma boolean */
                        } else if (typeof valueKey === 'boolean') {
                            /* Troca os valores por emojis */
                            valueKey = valueKey ? '✔️' : '❌';

                            /* Se for uma array */
                        } else if (Array.isArray(valueKey)) {
                            /* Faz um map com os valores */
                            valueKey = valueKey.map((usr) => {
                                /* Da qual se um valor for pessoa */
                                if (usr.includes('@s.whatsapp.net') || usr.includes('@lid')) {
                                    /* Obtém os valores de nome da DB para não marcar a pessoa */
                                    const userInfo = Indexer('sql').get('personal', usr, chatId).value;

                                    /* E usa seu nome no lugar do valor de ID */
                                    return (userInfo.name.text === 'default' ? (userInfo.name?.number?.slice(0, 9) || 'N/A') : `${userInfo.name.text} [${(userInfo.name?.number?.slice(0, 9) || 'N/A')}...]`);
                                }

                                /* Se não, retorna o valor mesmo */
                                return usr;
                            });

                            /* Junta tudo */
                            valueKey = valueKey.join(', ');
                        }

                        /* Usando 'markdown' */
                        additionalKeys.push(`- *${translatedKey}:* ${valueKey}`);
                    });

                    /* Adiciona breakline */
                    additionalKeys.push('\n');

                    /* Se não, manda pra lista desativada */
                } else disabledFunctions.push(key);
            }
        }
    });

    /* Define os textos */
    const enabledList = `\n*Enabled (✅):* (${enabledFunctions.join(', ')})\n`;
    const disabledList = `*Disabled (❌):* (${disabledFunctions.join(', ')})`;
    const additionalList = `*Adicionais (➕):*\n\n${additionalKeys.join('\n')}`;

    /* Retorna eles */
    return `${enabledList}\n${disabledList}\n\n${additionalList}`;
}

/* Cria a função de comando */
async function functionsEditor(
    kill = envInfo.functions.exec.arguments.kill.value,
    env = envInfo.functions.exec.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Define os valores para considerar ativar ou desativar */
    const toDisable = ['off', 'disable'];
    const toEnable = ['on', 'enable'];
    const DisEna = [...toDisable, ...toEnable];

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Constrói os parâmetros */
            const {
                chatId,
                reply,
                body,
                user,
                isGroupMsg,
                isGroupAdmins,
                arks,
                mentionedJidList,
                isGroupCreator,
                personal,
                args,
                prefix,
                isOwner,
                isAllowed,
                command,
                argl,
            } = env.value;
            const settingsData = env.value.functions;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Define o tipo avançado de uso */
            const sqlType = !isGroupMsg ? 'personal' : 'groups';

            /* Define a verdadeira functions */
            const functions = !isGroupMsg ? personal : settingsData;

            /* Define o filter para nao adicionar o próprio usuário nas listas */
            let mentionAdd = mentionedJidList.filter((t) => t !== user);
            mentionAdd = mentionAdd.map((f) => f.replace(/[@|@s.whatsapp.net|@lid]/gi, ''));

            /* Define o nome da funcão */
            const typeBase = command.toLowerCase();
            let type = Object.keys(functions).filter((s) => s.toLowerCase() === typeBase && s !== 'error')[0] || 'none';
            type = typeBase === 'handlers' ? typeBase : type;

            /* Determina quem pode executar */
            const conditions = (
                /* Se for administrador */
                (isGroupMsg && isGroupAdmins)

                /* Se for o dono do grupo */
                || (isGroupMsg && isGroupCreator)

                /* Se for o chefe da Íris */
                || (isGroupMsg && isOwner)

                /* Se for um VIP/MOD */
                || (isGroupMsg && isAllowed)
            );

            /* Condições 2 */
            const conditions2 = (
                /* Se for language em grupo */
                (type === 'language' && argl.some((gl) => Indexer('sql').languages('G.A.L').includes(gl)) && conditions)

                /* Se for language e no PV, ativador */
                || (type === 'language' && argl.some((gl) => DisEna.includes(gl)) && !isGroupMsg)

                /* Se for language e no PV, definição */
                || (type === 'language' && argl.some((gl) => Indexer('sql').languages('G.A.L').includes(gl)) && !isGroupMsg)

                /* Se for modo DND */
                || (type === 'dnd' && argl.some((gl) => DisEna.includes(gl)) && !Object.keys(functions).some((key) => body.includes(key)))
            );

            /* Define se roda */
            if ((conditions && type !== 'none') || (conditions2 && type !== 'none')) {
                /* Define o tipo de valor final */
                const isHandling = DisEna.some((rs) => body.includes(rs));
                const enaDis = toEnable.some((rs) => body.includes(rs));
                let theCode = Indexer('sql').jsonfixer(body);

                /* Se houver um JSON válido */
                if (theCode !== false) {
                    /* Tenta fazer um parse */
                    theCode = JSON.parse(body);

                    /* Se for, define como a body */
                } else theCode = body.replace(/-add|-rem|-clear/gi, '');

                /* Se quer apenas os exemplos */
                if (arks.includes('--examples')) {
                    /* Envia uma mensagem de ajuda com apenas exemplos */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: '1. *ATIVAR/DESATIVAR/MULTI-ATIVAR & DESATIVAR* ⬇️\n> 🔧 /handlers -antifake -antilinks -blacklist -prefix -nsfw -spy -language -goodbye -whitelist -leveling -welcome -antispam -dnd on/off\n> 🔧 /command on/off\n\n2. *ADICIONAR VALOR/ADICIONAR LISTA* ⬇️\n> ➕ /antifake -add 1\n> ➕ /antifake -add 54|351|99\n> ➕ /whitelist -add 551234|198765|1\n> ➕ /blacklist -add 1|54|351\n> ➕ /vips -add 1|54|351\n> ➕ /mods -add 1|54|351\n> ➕ /prefix -add !|^|<\n\n3. *REMOVER VALOR/REMOVER LISTA* ⬇️\n> ➖ /antifake -rem 1\n> ➖ /antifake -rem 54|351|99\n> ➖ /whitelist -rem 551234|198765|1\n> ➖ /blacklist -rem 1|54|351\n> ➖ /vips -rem 1|54|351\n> ➖ /mods -rem 1|54|351\n> ➖ /prefix -rem !|^|<\n\n4. *RESETAR/LIMPAR FUNÇÃO* ⬇️\n> 🗑️ /antifake -clear\n> 🗑️ /whitelist -clear\n> 🗑️ /blacklist -clear\n> 🗑️ /vips -clear\n> 🗑️ /mods -clear\n> 🗑️ /prefix -clear\n\n5. *USOS CUSTOMIZADOS* ⬇️\n> 🔄 /antilinks -set 1/2/3\n> 🚫 /antispam -ban/-set 10\n\n6. *ADICIONAR TEXTOS CUSTOMIZADOS* ⬇️\n> ✏️ /welcome -text -add {userm} entrou em {groupm}, leia a {desc}!\n> ✏️ /goodbye -text -add {userm} saiu de {groupm}!\n> ✏️ /antifake -text -add {userm} é número fake ou estrangeiro!\n> ✏️ /blacklist -text -add {userm} fez porcaria antes e foi posto na blacklist!\n> ✏️ /language -text -add pt\n\n7. *LIMPAR TEXTOS CUSTOMIZADOS* ⬇️\n> 🗑️ /welcome -text -clear\n> 🗑️ /goodbye -text -clear\n> 🗑️ /antifake -text -clear\n> 🗑️ /blacklist -text -clear\n> 🗑️ /language -text -clear\n\n8. *ANTI-EVERYONE (USER ALLOWED COMMAND)* ⬇️\n> 🔇 /dnd on/off' }, reply);

                    /* Caso para comandos de ajuda normais */
                } else if (arks.includes('--help') || args.length === 0) {
                    /* Envia uma mensagem de ajuda comum */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                    /* Case para comandos de ajuda de dono */
                } else if (arks.includes('--help-dev') && isOwner === true) {
                    /* Manda a mensagem de ajuda de dev */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                    /* Outros */
                } else if (isHandling) {
                    /* Define todos os ativadores */
                    let sysFunctions = (body.match(/-\s?\w+/g) || []).map((word) => word.replace(/-| on/gi, '').trim());
                    sysFunctions.push(command);
                    sysFunctions = sysFunctions.filter((r) => Object.keys(functions).includes(r));

                    /* Define apenas os que vá realmente ativar */
                    const validValues = sysFunctions.filter((en) => functions[en]?.enable !== enaDis || en === 'dnd');

                    /* Checa for permitido o uso */
                    if (validValues.length > 0 || validValues.includes('dnd')) {
                        /* Cria uma Object para cada item ativado */
                        const objectActive = {};
                        validValues.forEach((obj) => {
                            objectActive[obj] = {
                                enable: enaDis, lastDate: Date.now(), lastUser: user, lastState: functions[obj]?.enable, firstEdition: functions[obj]?.firstEdition || functions[obj]?.enable, firstUser: functions[obj]?.firstUser || user, firstDate: functions[obj]?.firstDate || Date.now(),
                            };
                        });

                        /* Se tiver modo DND ativando, adiciona quem usou */
                        if (Object.keys(objectActive).includes('dnd') && enaDis === true) {
                            /* Define a values do modo DND */
                            objectActive.dnd.values = [user, ...functions.dnd.values].flat(5);

                            /* Se for modo remoção */
                        } else if (Object.keys(objectActive).includes('dnd') && enaDis === false) {
                            /* Faz um filtro */
                            objectActive.dnd.values = functions.dnd.values.filter((usr) => usr !== user);
                        }

                        /* Faz a configuração do enable */
                        const newValues = Indexer('sql').update(sqlType, user, chatId, false, objectActive);

                        /* Define os valores de informação */
                        const moreInfo = ` ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​${generateList(newValues.value, chatId, region)}`;

                        /* Diz que ativou */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: `${Indexer('sql').languages(region, 'Extras', 'Finished', true, true, env.value).value}\n${moreInfo}` }, reply);

                        /* Se não for o caso */
                    } else {
                        /* Retorna o resultado como a mensagem e termina de executar */
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Defined', true, true, env.value).value }, reply);
                    }

                    /* Caso seja uma Array */
                } else if (Array.isArray(theCode) && isOwner) {
                    /* Define o dialogo para mandar */
                    let setDialogue = Indexer('sql').languages(region, 'Extras', 'Finished', true, true, env.value).value;

                    /* Se existir a key que vai usar */
                    if (functions[type] !== null) {
                        /* If's para assimilar os valores corretamente de acordo com a necessidade */
                        if (functions[type].values !== null) {
                            /* Define se é troca, remover ou adicionar */
                            let newArraye = [];

                            /* 1 - Adicionar */
                            if (argl.includes('add')) newArraye = [...functions[type].values, ...theCode];

                            /* 2 - Remover */
                            else if (argl.includes('remove')) newArraye = functions[type].values.filter((d) => !theCode.includes(d));

                            /* 3 - Trocar */
                            else if (argl.includes('change')) newArraye = theCode;

                            /* Faz a inserção da nova array */
                            Indexer('sql').update(sqlType, user, chatId, type, { values: newArraye });

                            /* Se não for, define o dialogo como menu de ajuda */
                        } else setDialogue = Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value;
                    } else setDialogue = Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value;

                    /* Manda o dialogo */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: setDialogue }, reply);

                    /* Se for uma Object */
                } else if (!Array.isArray(theCode) && typeof theCode === 'object' && theCode !== null && isOwner) {
                    /* Executa a Object no SQL */
                    Indexer('sql').update(sqlType, user, chatId, type, theCode);

                    /* Diz que executou */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Finished', true, true, env.value).value }, reply);

                    /* Se for String */
                } else if (typeof theCode === 'string') {
                    /* Define a nova object no fim */
                    let newDatas = { value: functions };

                    /* if para definir os diferentes tipos de comando */
                    /* Este define se é para setar valores na array, como antifake, prefixos, etc */
                    if (['vips', 'mods', 'blacklist', 'prefix', 'whitelist', 'antifake'].includes(type) && argl[0] !== '-text' && !['antilinks', 'level', 'nsfw', 'antispam', 'spy'].includes(type)) {
                        /* Define o multiadd */
                        let multipleVal = body.split('|').map((val) => val.replace(/-add|-rem|-clear/gi, '').trim());
                        multipleVal = multipleVal.filter((d) => d !== '-add' && d !== '-rem' && d !== '-clear');

                        /* Define os novos valores */
                        const standardValues = type === 'prefix' ? [...new Set([multipleVal])] : [...new Set([multipleVal, ...mentionAdd])].flat(5);
                        let newCodeValues = [...new Set([...functions[type].values, ...standardValues])].flat(5);
                        newCodeValues = newCodeValues.filter((f) => f != null);

                        /* Determina se deve adicionar */
                        if (argl[0] === '-add') {
                            /* Adiciona os usuários ou demais na lista */
                            newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                values: newCodeValues, lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.values, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.values, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                            });

                            /* Determina se deve remover */
                        } else if (argl[0] === '-rem') {
                            /* Remove da lista */
                            newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                values: functions[type].values.filter((d) => !standardValues.includes(d)), lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.values, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.values, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                            });

                            /* Determina se deve resetar */
                        } else if (argl[0] === '-clear') {
                            /* Limpa os users da lista */
                            newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                values: [], lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.values, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.values, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                            });

                            /* Se nenhum */
                        } else {
                            /* Manda ajuda */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);
                        }

                        /* Sistemas de texto, como mensagens customizadas de ban, welcome e goodbye */
                    } else if (['goodbye', 'promote', 'demote', 'welcome', 'blacklist', 'antifake', 'language'].includes(type) && argl[0] === '-text' && !['antilinks', 'level', 'nsfw', 'antispam', 'spy'].includes(type)) {
                        /* Define uma RegExp */
                        const regExpCmd = [new RegExp(command, 'gi'), new RegExp(`${prefix}${command}`, 'gi')];

                        /* Define o novo body, tem suporte a diversas criações com variaveis */
                        const bodhy = (body
                            .replace(/-text|-add|-rem|-clear/g, '')
                            .replace(regExpCmd[0], '')
                            .replace(regExpCmd[1], '')
                            .replace(/ {2}/g, '')
                            .replace(/^ /g, '')
                        );

                        /* Determina se deve adicionar */
                        if (argl[1] === '-add') {
                            /* Verifica se já está no valor */
                            if (functions[type]?.text === bodhy || functions[type]?.text === argl[2]) {
                                /* Retorna o resultado como a mensagem e termina de executar */
                                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'Defined', true, true, env.value).value }, reply);

                                /* Se não for o caso, configura */
                            } else {
                                /* Define o que adicionar */
                                const textAddiction = type === 'language' ? argl[2] : bodhy;

                                /* Adiciona os usuários ou demais na lista */
                                newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                    text: textAddiction, lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.text, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.text, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                                });
                            }

                            /* Determina se deve resetar */
                        } else if (argl[1] === '-clear') {
                            /* Limpa os users da lista */
                            newDatas = Indexer('sql').update(sqlType, user, chatId, type, {
                                text: false, lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.text, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.text, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                            });

                            /* Se nenhum */
                        } else {
                            /* Manda ajuda */
                            envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);
                        }

                        /* Define o uso do antispam separadamente */
                    } else if (type === 'antispam') {
                        /* Define a Object de update */
                        const updateSystem = {
                            ban: argl.includes('-ban'), limit: Number((argl.filter((n) => /[0-9]+/gi.test(n))[0] || 10)), lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.limit, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.limit, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                        };

                        /* Executa a atualização dessa função */
                        newDatas = Indexer('sql').update('groups', user, chatId, 'antispam', updateSystem);

                        /* Define o uso do antilinks separadamente | 1 = Todos os links, 2 = Convites de Grupo, 3 = Pornograficos, Virus e Demais */
                    } else if (type === 'antilinks') {
                        /* Define a Object de update */
                        const updateSystem = {
                            type: Number((argl.filter((n) => /[1-3]+/gi.test(n))[0] || 1)), lastDate: Date.now(), lastUser: user, lastValue: functions[type]?.limit, lastState: functions[type]?.enable, firstEdition: functions[type]?.firstEdition || functions[type]?.limit, firstUser: functions[type]?.firstUser || user, firstDate: functions[type]?.firstDate || Date.now(),
                        };

                        /* Executa a atualização dessa função */
                        newDatas = Indexer('sql').update('groups', user, chatId, 'antilinks', updateSystem);
                    }

                    /* Define os valores de informação */
                    const addInfo = ` ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​${generateList(newDatas.value, chatId, region)}`;

                    /* Diz que executou */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: `${Indexer('sql').languages(region, 'Extras', 'Finished', true, true, env.value).value}\n${addInfo}` }, reply);

                    /* Padrão */
                } else {
                    /* Manda ajuda */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);
                }

                /* Se não for grupo */
            } else if (!isGroupMsg) {
                /* Manda a mensagem só de grupos */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Extras', 'OnlyGroups', true, true, envInfo).value }, reply);

                /* Se caso não for permitido */
            } else {
                /* Avisa que 'só adm' pode usar */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Restrict', true, true, env.value).value }, reply);
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, thisDir);

        /* Avisa que deu erro enviando o comando e data atual pro sistema SER */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'Handler',
                time: (new Date()).toLocaleString(),
            }).value,
        }, env.value.reply);
    }

    /* Retorna os resultados */
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
        [envInfo.exports.exec]: { value: functionsEditor },
    },
    parameters: {
        location: { value: thisFile },
    },
}, envFile, changeKey, dirname);

/* Exporta todas as funções */
export default resetLocal();
