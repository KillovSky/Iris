/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, não existe função Ambient ou demais funções de exports, não utilize.
*/

/* Requires */
const {
    create,
} = require('@open-wa/wa-automate');
const fs = require('fs');
const finalize = require('./finish');
const Indexer = require('../index');
const language = require('../Dialogues');

/* JSON's | Utilidades */
const config = (JSON.parse(fs.readFileSync('./lib/Databases/Settings/Config.json'))).Bot_Name;
const launchInstance = (JSON.parse(fs.readFileSync('./lib/Functions/Options/utils.json'))).parameters.settings.value;
const packjson = JSON.parse(fs.readFileSync('./package.json'));

/* Inicia uma ou mais sessões da Íris | Try-Catch para casos de erro */
function generateSessions() {
    /* Try caso algo ocorra */
    try {
        /* Avisa que vai iniciar */
        console.log(
            Indexer('color').echo(`[${config.toUpperCase()} V${packjson.version} (BUILD: ${packjson.build_date})]`, 'red').value,
            Indexer('color').echo(language(region, 'Console', 'Start', true, true), 'green').value,
        );

        /* Inicia as sessões */
        launchInstance.sessionSettings.sessionID.forEach((ses, idx) => {
            (create(Indexer('options').create(ses, `${launchInstance.sessionSettings.sessionDataPath}/${ses}`).value)

                /* Finaliza */
                .then((kill) => {
                    /* Limpa o console */
                    process.stdout.write('\x1Bc');
                    console.clear();

                    /* Envia pra etapa 2 */
                    finalize(kill, idx);
                })

                /* Caso der problema no meio da inicialização | Printa na tela */
                .catch((err) => Indexer('colors').report(err, 'START'))
            );
        });

        /* Caso der erro no meio */
    } catch (error) {
        /* Printa o erro */
        console.error(error);

        /* Se auto-desliga */
        process.exit(1);
    }
}

/* Inicia a geração */
generateSessions();
