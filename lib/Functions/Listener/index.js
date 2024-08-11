/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
    NÃO DELETE ESSA PASTA OU ARQUIVO!
*/

/* Requires */
const ffmpeglocation = require('@ffmpeg-installer/ffmpeg');
global.fluent_ffmpeg_1 = require('fluent-ffmpeg');
const Indexer = require('../../index');
const extender = require('./messages');

/* Ajusta o ffmpeg para sobrepor o uso dos módulos que usem ele */
global.fluent_ffmpeg_1.setFfmpegPath(ffmpeglocation.path);
global.irisNumber = false;

/* Define uma let para armazenar se rodou com sucesso */
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
            /* Processa os eventos um a um */
            kill.ev.process(async (events) => {
                /* Caso a sessão mude de estado */
                if (events['connection.update']) {
                    /* Envia pro reload */
                    await Indexer('states').spec(events['connection.update'], genSession, startOptions, indexlaunch, launchInstance);
                }

                /* Se atualizar a sessão */
                if (events['creds.update']) {
                    /* Salva na pasta de sessões armazenadas */
                    await saveCreds();
                }

                /* Se tiver um evento de alteração no participante de um grupo */
                if (events['group-participants.update']) {
                    /* Roda as funções de greetings */
                    await Indexer('greetings').events(kill, events['group-participants.update']);
                }

                /* Se tiver um evento de caso alguém pedir para entrar */
                if (events['group.join-request']) {
                    /* Roda as funções de approval */
                    await Indexer('approval').events(kill, events['group.join-request']);
                }

                /* Se for um evento de mensagem */
                if (events['messages.upsert']) {
                    /* E for a primeira mensagem recebida */
                    if (sucessfulInit === false) {
                        /* Define sucesso na inicialização */
                        sucessfulInit = true;

                        /* Reajusta o número da Íris */
                        irisNumber = irisNumber === false ? `${kill?.user?.id.split('@')[0].split(':')[0]}@s.whatsapp.net` : irisNumber;

                        /* Avisa que iniciou */
                        console.log(Indexer('color').echo('----------- [START - OK] -----------', 'brightGreen').value);
                    }

                    /* Define a object e o tempo atual */
                    const messageObject = events['messages.upsert'];
                    messageObject.currentTimeDate = Date.now();

                    /* Envia a mensagem para formatação e funções posteriores */
                    await Indexer('commands').cmds(kill, messageObject);
                }

                /* Injeta o awaitMessages na kill para uso global */
                /* eslint-disable-next-line no-param-reassign */
                kill.awaitMessages = extender.awaitMessages;
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
