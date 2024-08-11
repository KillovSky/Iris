/* Requires */
const fs = require('fs');
const path = require('path');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
const Indexer = require('../../index');

/* JSON's | Utilidades */
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
        echoError(error);

        /* Avisa que deu erro, manda o erro e data ao sistema S.E.R (Send/Special Error Report) */
        await kill.sendMessage(env.value.chatId, {
            text: Indexer('sql').languages(region, 'S.E.R', error, true, true, {
                command: 'HEALTH',
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

        /* Insere a fitLifer na envInfo */
        envInfo.functions.exec.value = fitLifer;

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
