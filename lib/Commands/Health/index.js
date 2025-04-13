/* Requires */
const fs = require('fs');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
const Indexer = require('../../index');

/* JSON's | Utilidades */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Cria a função de comando */
async function fitLifer(
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
            /* Define os dados necessarios */
            const {
                reply,
                chatId,
                isOwner,
                arks,
                command,
                argl,
            } = env.value;

            /* Define o alias na envInfo */
            envInfo.alias = env.value.alias;

            /* Menu de ajuda DEV */
            if (arks.includes('--help-dev') && isOwner === true) {
                /* Manda a mensagem de ajuda de dev */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'Developer', true, true, envInfo).value }, reply);

                /* Menu de ajuda normal */
            } else if (arks.includes('--help')) {
                /* Não inclui informações secretas */
                envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Helper', 'User', true, true, envInfo).value }, reply);

                /* Sistema de calculo */
            } else {
                /* Define o peso */
                let kgSize = argl.includes('--kg') ? argl[argl.indexOf('--kg') + 1] : 0;
                kgSize = argl.includes('--kg') && /[0-9]+/.test(kgSize) ? kgSize : 0;

                /* Define a altura */
                let hSize = argl.includes('--cm') ? argl[argl.indexOf('--cm') + 1] : 0;
                hSize = argl.includes('--cm') && /[0-9]+/.test(hSize) ? hSize : 0;

                /* Define a idade */
                let ageCount = argl.includes('--age') ? argl[argl.indexOf('--age') + 1] : 0;
                ageCount = argl.includes('--age') && /[0-9]+/.test(ageCount) ? ageCount : 0;

                /* Se for calcular IMC */
                if (arks.includes('--imc') || command === 'imc') {
                    /* Inicia o calculo */
                    const imcResult = Indexer('default').calcularIMC(kgSize, hSize);

                    /* Faz o envio */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: `_1. 💪 IMC:_ *${imcResult.imc}*\n\n_2. 🎯 Peso Ideal:_ *${imcResult.best}*\n\n_3. 🔒 Faixa do IMC:_ *${imcResult.limit}*\n\n_4. ⚖️ Peso (Atual):_ *${imcResult.kg}*\n\n_5. 📏 Altura (Atual):_ *${imcResult.size}*\n\n_6. 🚨 Saudável:_ *${imcResult.healthy ? '✔️' : '❌'}*\n\n_7. 📉 Detalhes:_ *${imcResult.detail}*` }, reply);

                    /* Calcular KCAL */
                } else if (arks.includes('--kcal') || command === 'kcal') {
                    /* Inicia o calculo */
                    const kcalResult = Indexer('default').calcularKCAL(kgSize, hSize, ageCount, !arks.includes('--male'));

                    /* Faz o texto do KCAL */
                    const KCAL = kcalResult.kcal.map((ar, idx) => `*${ar[idx].type}*\n_1. 💪 Kcal diárias:_ *${ar[idx].kcal}*\n_2. 🎯 Mínimo calórico ideal:_ *${ar[idx].minimal}*\n_3. 🔒 Máximo calórico ideal:_ *${ar[idx].best}*`).join('\n\n');

                    /* Faz o envio */
                    envInfo.results.value = await kill.sendMessage(chatId, { text: `_1. ⚖️ Peso (Atual):_ *${kcalResult.kg}*\n_2. 📏 Altura (Atual):_ *${kcalResult.size}*\n_3. 🚨 Idade:_ *${kcalResult.age} anos*\n_4. 🔎 Gênero:_ *${kcalResult.gender === 'm' ? '🤷‍♂️' : '🙍‍♀️'} (${kcalResult.gender.toUpperCase()})*\n\n*😵 KCAL (Activity Rate) 🥣*\n\n${KCAL}` }, reply);
                }
            }
        }

        /*
            Define o sucesso, se seu comando der erro isso jamais será chamado
            Então o success automaticamente será false em falhas
        */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'HEALTH',
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
 * @param {string} [dirname=__dirname] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    changeKey = {},
    envFile = envInfo,
    dirname = __dirname,
) => module.exports = logging.resetAmbient({
    functions: {
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.exec]: { value: fitLifer },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
