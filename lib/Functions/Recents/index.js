/* Requires */
const fs = require('fs');
const path = require('path');

/* JSONs | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
const isNumeric = /^[0-9]+$/;

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

/* Função de classificação */
function sortByDate(
    folderName = envInfo.functions.sort.arguments.folderName.value,
    limitResult = envInfo.functions.sort.arguments.limitResult.value,
    onlyName = envInfo.functions.sort.arguments.onlyName.value,
) {
    /* Define um valor padrão */
    envInfo.results.value = [];

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Caso o local seja invalido */
        if (fs.existsSync(folderName)) {
            /* Adquire os dados do diretório */
            const filesInFolder = fs.readdirSync(folderName);

            /* Define a Array/Object com os dados */
            let formatedFiles = [];

            /* Formata os dados por nome e tempo */
            filesInFolder.forEach((file) => {
                /* Adquire informações do arquivo */
                const timerFile = ((fs.statSync(`${folderName}/${file}`))
                    /* Acessa o tempo de modificação */
                    .mtime
                    /* Define o tempo */
                    .getTime()
                );

                /* Salva na object */
                formatedFiles.push({
                    name: file,
                    time: timerFile,
                });
            });

            /* Formata a Object pela data de modificação */
            formatedFiles = formatedFiles.sort((a, b) => a.time - b.time);

            /* Caso queira retornar apenas os nomes */
            if (onlyName === true) {
                /* Formata a Object para ter apenas nomes */
                formatedFiles = formatedFiles.map((fl) => fl.name);
            }

            /* Caso queira a array inteira */
            if (isNumeric.test(limitResult)) {
                /* Retorna tudo */
                formatedFiles = formatedFiles.slice(0, Number(limitResult));
            }

            /* Define na envInfo */
            envInfo.results.value = formatedFiles;
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

        /* Insere a sortByDate na envInfo */
        envInfo.functions.sort.value = sortByDate;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.sort]: envInfo.functions.sort.value,
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
