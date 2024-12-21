/* Requires */
const fs = require('fs');
const linkify = require('linkifyjs');

/* Adiciona checagem de URL para IP */
/* eslint-disable-next-line no-unused-vars */
const linkip = require('linkify-plugin-ip');

/* JSON */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/* Cria uma nova RegExp */
function createRegExp(regValue, regreplace = false) {
    /* Cria a RegExp padrão */
    let checkRegExp = new RegExp();

    /* Try-Catch para caso dê algum erro */
    try {
        /* Verifica se não é uma regex */
        if (!(regValue instanceof RegExp)) {
            /* Flags do RegExp */
            let regflag = '';

            /* Define a RegExp a usar */
            const regExpr = String(regValue).replace(/^[/]+/g, '').replace(/\/|\/$|$/, '/');

            /* Verifica se deve inserir 2° parte */
            if (/\/[g|i|m|u|s|y]+$/.test(regExpr)) {
                /* Segunda parte do RegExp */
                regflag = regExpr.slice(((regExpr.replace(/^\//, '').lastIndexOf('/')) || -3) + 1);
            }

            /* Se for para por uma reg customizada */
            if (typeof regreplace === 'string') {
                /* Troca pela custom */
                regflag = regreplace;
            }

            /* Cria a regex em const */
            checkRegExp = new RegExp(
                /* 1° e 2° parte do RegExp e as flags */
                regExpr.slice(0, ((regExpr.replace(/^\//, '').lastIndexOf('/')) || regExpr.length)),
                regflag,
            );

            /* Se já for RegExp */
        } else checkRegExp = regValue;

        /* Caso de algum erro */
    } catch (error) {
        /* Printa o erro direto */
        console.log(error);
    }

    /* Retorna a RegExp */
    return checkRegExp;
}

/* Checa se é link de grupo */
function isInvitation(
    inviteText = envInfo.functions.invite.arguments.inviteText.value,
) {
    /* Reseta a Success e define o valor padrão */
    envInfo.results.success = false;
    envInfo.results.value = false;

    /* Try-Catch para casos de erro */
    try {
        /* Checa se é um texto válido */
        if (typeof inviteText === 'string') {
            /* Define as RegExp para verificar */
            const chatexpRegExp = createRegExp(envInfo.parameters.chatexp.value);
            const inviteregRegExp = createRegExp(envInfo.parameters.invitereg.value);

            /* Verifica se é um convite usando a RegExp e includes */
            envInfo.results.value = chatexpRegExp.test(inviteText) || inviteregRegExp.test(inviteText) || inviteText.includes('chat.whatsapp.com');
        }

        /* Define como sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna se é um convite */
    return logging.postResults(envInfo);
}

/* Regex que retorna se a string é um local */
function isFolder(
    folderText = envInfo.functions.folders.arguments.folderText.value,
) {
    /* Reseta a Success e define o valor padrão */
    envInfo.results.success = false;
    envInfo.results.value = false;

    /* Try-Catch para casos de erro */
    try {
        /* Checa se é um texto válido */
        if (typeof folderText === 'string') {
            /* Define a RegExp para verificar */
            const folderexpRegExp = createRegExp(envInfo.parameters.folderexp.value);

            /* Verifica se é uma pasta usando a RegExp e fs.existsSync */
            envInfo.results.value = folderexpRegExp.test(folderText) || fs.existsSync(folderText);
        }

        /* Define como sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o resultado */
    return logging.postResults(envInfo);
}

/* Verifica se é uma URL */
function isURL(
    linkText = envInfo.functions.urls.arguments.linkText.value,
) {
    /* Reseta a Success e define o valor padrão */
    envInfo.results.success = false;
    envInfo.results.value = false;

    /* Try-Catch para casos de erro */
    try {
        /* Checa se é um texto válido */
        if (typeof linkText === 'string') {
            /* Define a RegExp */
            const netProtocols = createRegExp(envInfo.parameters.netprefix.value);

            /* Define uma array de valores e se já tem URL */
            const searchURLs = linkify.find(linkText);

            /* Define a results padrão */
            envInfo.results.value = {
                isURL: searchURLs.some((d) => d.isLink),
                base: searchURLs,
                matchedURL: searchURLs[0]?.value || '',
                allURLs: searchURLs.map((u) => u.value),
                hostnames: [],
            };

            /* Define as hostnames */
            envInfo.results.value.hostnames = envInfo.results.value.allURLs.map((f) => {
                /* Define a URL */
                let urlRead = f.replace(/.*:/g, '').replace(netProtocols, '');

                /* Se não tiver http/https */
                if (!/^https?:\/\//i.test(urlRead)) {
                    /* Adiciona temporariamente */
                    urlRead = `http://${urlRead}`;
                }

                /* Obtém a URL */
                const url = new URL(urlRead);

                /* Retorna a hostname */
                return url.hostname;
            });
        }

        /* Define como sucesso */
        envInfo.results.success = true;

        /* Se der algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o resultado */
    return logging.postResults(envInfo);
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
        envInfo.functions.poswork.value = logging.postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a create na envInfo */
        envInfo.functions.create.value = createRegExp;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

        /* Insere a invite na envInfo */
        envInfo.functions.invite.value = isInvitation;

        /* Insere a folders na envInfo */
        envInfo.functions.folders.value = isFolder;

        /* Insere a URL na envInfo */
        envInfo.functions.urls.value = isURL;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.create]: envInfo.functions.create.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.invite]: envInfo.functions.invite.value,
                [envInfo.exports.folders]: envInfo.functions.folders.value,
                [envInfo.exports.urls]: envInfo.functions.urls.value,
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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
