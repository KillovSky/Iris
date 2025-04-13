/* Requires */
const fs = require('fs');
const linkify = require('linkifyjs');

/* Adiciona checagem de URL para IP */
/* eslint-disable-next-line no-unused-vars */
const linkip = require('linkify-plugin-ip');

/* JSON */
const envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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

/**
 * Restaura o ambiente e atualiza as exportações do módulo com a funcionalidade principal
 * @param {Object} [changeKey={}] - Chaves personalizadas para atualizar o envInfo
 * @param {Object} [envFile=envInfo] - Objeto com informações do ambiente
 * @param {string} [dirname=__dirname] - Caminho do diretório atual
 * @returns {Object} Exportações do módulo com todas as funções configuradas
 */
/* eslint-disable-next-line no-return-assign */
const resetLocal = (
    changeKey = {},
    envFile = envInfo,
    dirname = __dirname,
) => module.exports = logging.resetAmbient({
    functions: {
        [envInfo.exports.env]: { value: ambientDetails },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.create]: { value: createRegExp },
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.invite]: { value: isInvitation },
        [envInfo.exports.folders]: { value: isFolder },
        [envInfo.exports.urls]: { value: isURL },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
