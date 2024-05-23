/* eslint-disable indent */
/* eslint-disable default-case */
/* eslint-disable max-len */
/* Requires */
const fs = require('fs');
const path = require('path');

/* Importa módulos, ajuste o local conforme onde usar esse sistema */
const Indexer = require('../../../index');

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
async function eventRunner(
    kill = envInfo.functions.exec.arguments.kill.value,
    data = envInfo.functions.exec.arguments.data.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Se recebeu tudo corretamente, se der ruim, não fará nada */
        if (typeof kill === 'object' && typeof data === 'object') {
            /* Define o timestamp */
            const timestamp = typeof data.messageTimestamp === 'string' ? data.messageTimestamp : data.messageTimestamp?.low || data.messageTimestamp?.high || Date.now();

            /* Define quem foi o alvo do evento */
            const participants = data?.messageStubParameters || [];
            const formattedPP = participants.map((usr) => usr.replace(/@s.whatsapp.net/gi, ''));

            /* Define o chat do evento em ID */
            const chatId = data?.key?.remoteJid || data?.key?.participant || irisNumber || config.owner.value[0];

            /* Define o participante pela key | "Causador do evento" */
            const user = data?.participant || data?.key?.participant || irisNumber;
            const userFormatted = user.replace(/@s.whatsapp.net/gi, '');

            /* Determina se é um grupo */
            const isGroup = chatId.includes('@g.us') || false;

            /* Define os dados de database do grupo e usuário */
            const groupDB = isGroup ? Indexer('sql').get('groups', user, chatId).value : 'PV';
            const personalDB = Indexer('sql').get('personal', user, chatId).value;

            /* Se tiver apenas um participante, puxa o nome dele na DB */
            const pName = participants.length === 1 ? Indexer('sql').get('personal', participants[0], chatId).value : 'N/A';

            /* Define o StupType */
            const stubType = data?.messageStubType || 0;

            /* Faz um switch com os tipos de função stub */
            switch (stubType) {
                /* Promote & Demote */
                case 'GROUP_PARTICIPANT_PROMOTE':
                case 'GROUP_PARTICIPANT_DEMOTE':
                case 29:
                case 30:
                    /* Se permitido fazer essa função */
                    if (groupDB?.spy?.enable === true) {
                        /* Define o tipo */
                        const isDemote = stubType === 30 || stubType === 'GROUP_PARTICIPANT_DEMOTE';

                        /* Define o tipo de promote/demote na key */
                        const keyTexts = isDemote ? 'demoteText' : 'promoteText';

                        /* Faz o aviso na tela */
                        console.log(Indexer('color').echo(`[ ${isDemote ? 'DEMOTE' : 'PROMOTE'} ~ ${groupDB.name.text || 'GP'} ] →`, config.colorSet.value[0]).value, Indexer('color').echo(`'${formattedPP} (${pName.name.text})' ${envInfo.parameters.admins.value[keyTexts]} '${userFormatted} (${personalDB.name.text})' as ${new Date(timestamp * 1000).toLocaleString()}\n`, config.colorSet.value[1]).value);

                        /* Avisa o grupo */
                        await kill.sendMessage(chatId, {
                            text: Indexer('sql').languages(region, 'Events', keyTexts, true, true, {
                                admin: `@${userFormatted}`,
                                user: `@${formattedPP.join(', @')}`,
                            }).value,
                            mentions: [user, ...participants],
                        });

                        /* Define que deve parar a execução */
                        envInfo.results.value = 'STOP';
                    }
                break;

                /* Approval (Admin permitiu a entrada) */
                case 27:
                case 'GROUP_PARTICIPANT_ADD':
                    /* Apenas se permitido fazer */
                    if (groupDB?.spy?.enable === true) {
                        /* Faz o aviso na tela */
                        console.log(Indexer('color').echo(`[ APPROVAL ~ ${groupDB.name.text || 'GP'} ] →`, config.colorSet.value[0]).value, Indexer('color').echo(`'${userFormatted} (${personalDB.name.text})' ${envInfo.parameters.admins.value.approvedText} '${formattedPP}' as ${new Date(timestamp * 1000).toLocaleString()}\n`, config.colorSet.value[1]).value);

                        /* Avisa o grupo */
                        await kill.sendMessage(chatId, {
                            text: Indexer('sql').languages(region, 'Events', 'approvedText', true, true, {
                                admin: `@${userFormatted}`,
                                user: `@${formattedPP.join(', @')}`,
                            }).value,
                            mentions: [user, ...participants],
                        });

                        /* Define que deve parar a execução */
                        envInfo.results.value = 'STOP';
                    }
                break;
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

        /* Insere a eventRunner na envInfo */
        envInfo.functions.exec.value = eventRunner;

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
