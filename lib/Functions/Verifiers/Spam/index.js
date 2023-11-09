/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const language = require('../../../Dialogues/index');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const spamInfo = {
    file: {},
    command: {},
};

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

/* Cria a função de comando, EDITE O NOME DELA AQUI */
async function spamInfomer(
    kill = envInfo.functions.spam.arguments.kill.value,
    env = envInfo.functions.spam.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Declarava os valores que vai usar */
            const {
                isMedia,
                user,
                userFormated,
                isGroup,
                isCmd,
                groupAdmins,
                chatId,
                functions,
            } = env.value;

            /* Define se foi um SPAM */
            let isSpammer = false;

            /* Define o Object padrão */
            const defUserObj = {
                time: 0, next: 0, amount: 0, blocked: false,
            };

            /* Define qual Object usar */
            const kindSpam = isMedia && functions.antispam.enable === true ? 'file' : 'command';

            /* Se for grupo */
            if (isGroup) {
                /* Ajusta as Objects para terem dados da pessoa */
                spamInfo[kindSpam][chatId] = spamInfo[kindSpam][chatId] || {};
                spamInfo[kindSpam][chatId][user] = spamInfo[kindSpam][chatId][user] || defUserObj;

                /* Se for PV, usa o prototipo sem chatId */
            } else {
                spamInfo[kindSpam][user] = spamInfo[kindSpam][user] || defUserObj;
            }

            /* Ajusta a Object que vai usar */
            let spamData = isGroup ? spamInfo[kindSpam][chatId][user] : spamInfo[kindSpam][user];

            /* Ajusta o valor do user em blocks */
            spamData = spamData?.time == null ? defUserObj : spamData;

            /* Se o tempo de mute por floodar já for inferior ao tempo atual */
            if (
                (spamData.blocked === true && Date.now() > spamData.time)
                || ((spamData.blocked === false && Date.now() > spamData.next) && (spamData.amount >= functions.antispam.limit || spamData.amount >= config.maxCommands.value || spamData.amount === 0))
            ) {
                /* Reinicia o contador e permite que a pessoa use de novo */
                spamData = defUserObj;

                /* Se a verificação do próximo comando ou mídia for inferior à data atual */
            } else if (spamData.blocked === true) {
                /* Considere como flood */
                envInfo.results.value = true;
                envInfo.results.success = true;

                /* Retorna flood para a Íris abortar a execução */
                return postResults(envInfo.results);
            }

            /* Se for comando ou grupo com antispam */
            if (isCmd || (isMedia && functions.antispam.enable === true)) {
                /* Aumenta em 1 o número de spam */
                spamData.amount += 1;
            }

            /* Define as condições */
            const conditions = (
                /* Quantidade de SPAM maior que a configurada */
                (spamData.amount > functions.antispam.limit

                /* Com sistema ativo */
                && functions.antispam.enable === true

                /* E ser media */
                && isMedia

                /* E o tempo limite ainda esta contando */
                && spamData.next > Date.now())

                /* Ou se for comando */
                || (isCmd

                /* Tiver passado do limite */
                && spamData.amount > config.maxCommands.value

                /* E do tempo limite */
                && spamData.next > Date.now())
            );

            /* Define se deve contar */
            if (conditions) {
                /* Reseta o contador de spam, pra evitar ser banido em outros grupos */
                spamData.amount = 0;

                /* Define a mentions */
                const mentioning = config.tagAdmins.value === true ? [...groupAdmins, user, ...config.owner.value] : [user];

                /* Se permitido banir */
                if (functions.antispam.ban === true && isMedia) {
                    /* Remove do grupo */
                    await kill.groupParticipantsUpdate(chatId, [user], 'remove');

                    /* Avisa do SPAM e bloqueia os comandos da pessoa por x minutos */
                    await kill.sendMessage(chatId, { text: language(region, 'Security', 'Notice', true, true, { userFormated, notice: 'SPAM' }), mentions: mentioning });

                    /* Avisa que foi SPAM e limita por 5 minutos */
                } else {
                    /* Avisa do SPAM e bloqueia os comandos da pessoa por x minutos */
                    await kill.sendMessage(chatId, { text: language(region, 'Security', 'Mute', true, true, { userFormated, timeLimit: (config.spammerTime.value / 1000 / 60) }), mentions: mentioning });
                }

                /* Define o blocks para bloquear por x minutos, também funciona caso bana em um grupo e a pessoa use noutro */
                spamData.time = Date.now() + config.spammerTime.value;
                spamData.blocked = true;

                /* Define direto também para comandos */
                if (kindSpam === 'file' && isGroup) {
                    /* Para ignorar caso não use em mídia depois */
                    spamInfo.command[chatId] = spamInfo[kindSpam][chatId] || {};
                    spamInfo.command[user] = spamInfo[kindSpam][chatId][user] || {};

                    /* Mesmo, mas PV */
                } else if (kindSpam === 'file' && !isGroup) {
                    /* Para ignorar caso não use em mídia depois */
                    spamInfo.command[user] = spamInfo[kindSpam][user] || {};
                }

                /* Define o spammer como true */
                isSpammer = true;
                envInfo.results.value = isSpammer;

                /* Se não for SPAM e for comando */
            } else if (isCmd && Date.now() > spamData.next) {
                /* Ajusta o cooldown */
                spamData.next = Date.now() + config.commandsCooldown.value;

                /* Se não for SPAM e não for comando */
            } else if (isMedia && Date.now() > spamData.next) {
                /* Ajusta o cooldown */
                spamData.next = Date.now() + config.mediaCooldown.value;
            }

            /* Salva os valores na Object */
            if (isGroup) {
                /* Se for grupo */
                spamInfo[kindSpam][chatId][user] = spamData;

                /* Se for PV */
            } else spamInfo[kindSpam][user] = spamData;
        }

        /* Define o sucesso, se seu comando der erro isso jamais será chamado, então o success automaticamente será false em falhas */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
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

        /* Insere a spamInfomer na envInfo */
        envInfo.functions.spam.value = spamInfomer;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.spam]: envInfo.functions.spam.value,
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
