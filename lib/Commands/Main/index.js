/* ARQUIVO AINDA NÃO FINALIZADO, MAS FUNCIONANDO! */

/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../../index');
// const Verifier = require('../../Functions/Verifiers/index');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const isPerfomance = (JSON.parse(fs.readFileSync('./lib/Databases/Configurations/config.json'))).perfomanceMode.value;

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

/* Função principal */
async function redirectCommands(
    kill = envInfo.functions.cmds.arguments.kill.value,
    message = envInfo.functions.cmds.arguments.message.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        if (typeof kill === 'object' && typeof message === 'object') {
            /* Adquire os dados da mensagem */
            const dataSets = await Indexer('construct').make(kill, message);

			/* Retorna se deu erros */
			if (dataSets.success === false) return postResults(envInfo.results);

            /* Roda as funções de mensagem */
            // const isSpammer = await Indexer('spam').harm(kill, dataSets);
            const isSpammer = { value: false };

            /* Define se deve executar caso seja comando */
            const commandExecuter = (dataSets.value.isCmd === true ? dataSets.value.command : 'default');

            /* Caso seja um spammer não vai continuar */
            if (isSpammer.value === false) {
                /* Verifica se é um comando */
                if (dataSets.value.isCmd === true) {
                    /* Diz que é comando */
                    console.log(
                        Indexer('color').echo(`> COMANDO "[${dataSets.value.prefix}${commandExecuter.toUpperCase()}]"`, 'green').value,
                        'AS',
                        Indexer('color').echo(dataSets.value.time, 'yellow').value,
                        'DE',
                        Indexer('color').echo(`"${dataSets.value.pushname} - [${dataSets.value.user.replace('@c.us', '')}]"`, 'green').value,
                    );
                } else {
                    /* Diz que é mensagem */
                    console.log(
                        Indexer('color').echo(`> MENSAGEM "[${dataSets.value.body.slice(0, 10)}...]"`, 'white').value,
                        'AS',
                        Indexer('color').echo(dataSets.value.time, 'yellow').value,
                        'DE',
                        Indexer('color').echo(`"${dataSets.value.pushname} - [${dataSets.value.user.replace('@c.us', '')}]"`, 'white').value,
                    );
                }

                /* Define como deve rodar a mensagem | Modo lento, mas seguro */
                if (isPerfomance === false) {
                    /* Roda as funções de mensagem */
                    // const stopExecution = await Verifier(kill, dataSets).value;
                    const stopExecution = false;

                    /* Só roda se nada impede acima */
                    if (stopExecution !== true) {
                        /* Adquire a função base */
                        envInfo.results.value = (await Indexer('construct')
                            /* Define o comando a rodar */
                            .control(commandExecuter)

                            /* Executa o comando direto, como se fosse uma obj inside obj */
                            .execute(kill, dataSets)
                        );
                    }

                    /* Modo performance | Rápido, mas >INSEGURO!< */
                } else {
                    /* Adquire a função base e roda sem esperar terminar */
                    const commandSystem = (Indexer('construct')
                        /* Define o comando a rodar */
                        .control(commandExecuter)

                        /* Executa o comando direto, como se fosse uma obj inside obj */
                        .execute(kill, dataSets)
                    );

                    /* Executa as verificações sem esperar ou pegar o retorno */
                    // Verifier(kill, dataSets);

                    /* Define o resultado final na envInfo */
                    envInfo.results.value = await commandSystem;
                }
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna a nova Array */
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

        /* Insere a redirectCommands na envInfo */
        envInfo.functions.cmds.value = redirectCommands;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.cmds]: envInfo.functions.cmds.value,
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
