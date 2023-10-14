/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
*/

/* Requires */
const ffmpeglocation = require('@ffmpeg-installer/ffmpeg');
global.fluent_ffmpeg_1 = require('fluent-ffmpeg');
const Indexer = require('../../index');

/* Definições */
global.fluent_ffmpeg_1.setFfmpegPath(ffmpeglocation.path);
global.irisNumber = false;
let sucessfulInit = false;

/* Inicia as funções gerais */
function createListener(kill, saveCreds, genSession, startOptions, indexlaunch, launchInstance) {
    /* Caso a função raiz seja invalida */
    if (
        typeof kill === 'object'
        && [saveCreds, genSession].some((t) => typeof t === 'function')
        && typeof startOptions === 'object'
        && typeof launchInstance === 'object'
        && /[0-9]+/g.test(indexlaunch)
    ) {
        /* Try Catch para evitar erros */
        try {
            kill.ev.process(async (events) => {
                /* Caso a sessão mude de estado */
                if (events['connection.update']) {
                    /* Envia pro reload */
                    await Indexer('states').spec(events['connection.update'], genSession, startOptions, indexlaunch, launchInstance);
                }

                /* Se atualizar a sessão */
                if (events['creds.update']) {
                    /* Salva a mesma */
                    await saveCreds();
                }

                /* Se tiver promote, demote, add ou remove */
                if (events['group-participants.update']) {
                    /* Roda as funções de greeting */
                    await Indexer('greetings').events(kill, events['group-participants.update']);
                }

                /* Sistema de recebimento de mensagens */
                if (events['messages.upsert']) {
                    /* Se receber uma mensagem */
                    if (sucessfulInit === false) {
                        /* Define sucesso na inicialização */
                        sucessfulInit = true;

                        /* Reajusta o número da Íris */
                        irisNumber = irisNumber === false ? `${kill?.user?.id.split('@')[0].split(':')[0]}@s.whatsapp.net` : irisNumber;

                        /* Avisa que iniciou */
                        console.log(Indexer('color').echo('----------- [START - OK] -----------', 'brightGreen').value);
                    }

                    /* Envia a mensagem para rodar e exibir */
                    await Indexer('commands').cmds(kill, events['messages.upsert']);
                }
            });

            /* Caso der erros em algo */
        } catch (error) {
            /* Printa o erro */
            console.error(error);
        }
    }
}

/* Exporta o módulo */
module.exports = createListener;
