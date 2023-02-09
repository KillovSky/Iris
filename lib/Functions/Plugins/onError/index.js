/*
    Esse local é restrito em nível máximo, usar ele na exec pode causar danos.
    Portanto, a envInfo daqui é diferente das demais.
*/

/* Requires */
const fs = require('fs');

/* JSON's | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Função que retorna todo o arquivo */
function ambientDetails() {
    /* Retorna a envInfo */
    return envInfo;
}

/* Função que verifica o erro | Sinta-se a vontade para fazer a sua função aqui */
async function inspectError(
    theError = false,
    kill = {},
) {
    /* Exibe o erro no terminal */
    console.log(theError);

    /* Diz que vai desligar */
    console.log('Shutting down, please restart manually if is not running at PM2...');

    /* Try-Catch */
    try {
        /* Desliga a Íris */
        await kill?.kill?.();

        /* Caso a função kill não funcione mais */
    } catch (err) {
        /* Printa o erro */
        console.log(err);
    }

    /* Desliga o node se ainda não tiver */
    process.exit(1);
}

/* Função que reseta tudo */
function resetAmbient(
    changeKey = {},
) {
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

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a inspectError na envInfo | PERIGO: ISSO DESLIGARÁ A ÍRIS SE USADO!!! */
        envInfo.functions.exit.value = inspectError;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.exit]: envInfo.functions.exit.value,
            },
            Developer: 'KillovSky',
            Projects: 'https://github.com/KillovSky',
        };

        /* Define o valor retornado */
        exporting = module.exports;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        console.log(error);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
