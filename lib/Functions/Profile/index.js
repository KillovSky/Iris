/* eslint-disable max-len */
const telegraph = require('@killovsky/telegraph');
const {
    decryptMedia,
} = require('@open-wa/wa-decrypt');
const path = require('path');
const fs = require('fs');
const Indexer = require('../../index');

/* JSON's */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

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

/*
    Função que pega uma foto de alguém aleatório e checa se deu bom.
    Limite ajustável pela 'utils.json', basta definir algo acima de 2.
*/
async function randomPhotos(kill, personList) {
    /* Define se a imagem foi obtida com sucesso */
    let myProfile = envInfo.parameters.failed.value;

    /* Só roda se os valores estiverem corretos */
    if (typeof kill === 'object' && personList instanceof Array) {
        /* forEach para checar as fotos de perfil */
        [...Array(envInfo.parameters.uses.value)].forEach(async () => {
            /* Executa somente se a imagem ainda não é válida */
            if (myProfile !== envInfo.parameters.failed.value) {
                /* Escolhe alguém aleatório para obter a foto */
                const luckyBast = Indexer('array').extract(personList);

                /* Adquire a imagem de um aleatório */
                const myImage = await kill.getProfilePicFromServer(luckyBast);

                /* Verifica se é uma imagem URL */
                if (Indexer('regex').urls(myImage)) {
                    /* Insere a imagem */
                    myProfile = myImage;
                }
            }
        });
    }

    /* Retorna o que achou */
    return myProfile;
}

/* Adquire as imagens de perfil */
async function lookupPhotos(kill, userFind, randUsers) {
    /* Define se a imagem foi obtida com sucesso */
    let imageServit = envInfo.parameters.failed.value;

    /* Só roda se os valores estiverem corretos */
    if (typeof kill === 'object' && typeof userFind === 'string' && randUsers instanceof Array) {
        /* Adquire a imagem */
        imageServit = await kill.getProfilePicFromServer(userFind);

        if (!Indexer('regex').urls(imageServit)) {
            imageServit = await randomPhotos(kill, randUsers);
        }
    }

    /* Retorna o que achou */
    return imageServit;
}

/* Função para obter a foto do participante e caso der erro obter de alguém aleatório */
async function profileImages(
    kill = false,
    hasImage = false,
    encryptMedia = false,
    qtmsg = false,
    qmsgobj = false,
    menjls = false,
    gmemid = false,
) {
    /* Define um resultado padrão */
    envInfo.results.value = [];

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        const conditions = (
            /* Todas as Objects */
            [kill, encryptMedia, qtmsg, qmsgobj].every((val) => typeof val === 'object' && val !== null)

            /* Todas as Arrays */
            && [menjls, gmemid].every((val) => Array.isArray(val))

            /* Só tem uma hasImage */
            && typeof hasImage === 'boolean'
        );

        /* Verifica se os parâmetros recebidos estão certos */
        if (conditions) {
            /* Corrige os valores */
            /* QuotedMsg */
            const quotedMsg = Object.keys(qtmsg).length !== 0 ? qtmsg : {};

            /* QuotedMsgObj */
            const quotedMsgObj = Object.keys(qmsgobj).length !== 0 ? qmsgobj : {};

            /* MentionedJidList */
            const mentionedJidList = menjls.length !== 0 ? menjls : [];

            /* GroupMembersId */
            const groupMembersId = gmemid.length !== 0 ? gmemid : [];

            /* ------------------- WEBIMAGEM ------------------- */

            /* Caso tenha uma imagem */
            if (hasImage) {
                /* Decripta a imagem */
                const decImages = await decryptMedia(encryptMedia);

                /* Faz upload */
                const upPhotos = await telegraph.upload(decImages, 'jpg');

                /* Insere na Array */
                envInfo.results.value.push(upPhotos.images[0].src);
            }

            /* ------------------- 1° IMAGEM ------------------- */

            /* 1° foto de perfil */
            let firstImage = (
                /* QuotedMsg */
                quotedMsg?.sender?.id

                /* QuotedMsgObj */
                || quotedMsgObj?.sender?.id

                /* MentionedJidList */
                || mentionedJidList[0]

                /* Pessoa random */
                || Indexer('array').extract(groupMembersId)
            );

            /* Adquire a primeira imagem */
            firstImage = await lookupPhotos(kill, firstImage, mentionedJidList);

            /* Insere na envInfo */
            envInfo.results.value.push(firstImage);

            /* ------------------- 2° IMAGEM ------------------- */

            /* Define se tem UMA menção que não é a firstImage */
            let mentionsJid = mentionedJidList.filter((usr) => usr !== firstImage);
            mentionsJid = mentionsJid[0] || false;

            /* 2° foto de perfil */
            let secondImage = false;

            /* Determina qual vai ser a 2° | MentionedJidList */
            if (mentionsJid !== false) {
                /* Define como menção total */
                secondImage = mentionsJid;

                /* Senão, QuotedMsg */
            } else if (quotedMsg?.sender?.id && firstImage !== quotedMsg?.sender?.id) {
                /* Define como marcado */
                secondImage = quotedMsg?.sender?.id;

                /* Senão, QuotedMsgObj */
            } else if (quotedMsgObj?.sender?.id && firstImage !== quotedMsgObj?.sender?.id) {
                /* Define como marcado, mas na menção Obj */
                secondImage = quotedMsgObj?.sender?.id;

                /* Se ainda nada */
            } else {
                /* Define random do grupo */
                secondImage = Indexer('array').extract(groupMembersId);
            }

            /* Adquire a segunda imagem */
            secondImage = await lookupPhotos(kill, secondImage, mentionedJidList);

            /* Insere na envInfo */
            envInfo.results.value.push(secondImage);

            /* ------------------- 3° IMAGEM ------------------- */

            /* Define se tem UMA menção que não é a firstImage/secondImage */
            let finaleMent = mentionedJidList.filter((usr) => usr !== firstImage && usr !== secondImage);
            finaleMent = finaleMent[0] || false;

            /* 3° foto de perfil */
            let thirdImage = false;

            /* Determina qual vai ser a 2° | MentionedJidList */
            if (finaleMent !== false) {
                /* Define como menção total */
                thirdImage = finaleMent;

                /* Senão, QuotedMsg */
            } else if (quotedMsg?.sender?.id && ![firstImage, secondImage].includes(quotedMsg?.sender?.id)) {
                /* Define como marcado */
                thirdImage = quotedMsg?.sender?.id;

                /* Senão, QuotedMsgObj */
            } else if (quotedMsgObj?.sender?.id && ![firstImage, secondImage].includes(quotedMsgObj?.sender?.id)) {
                /* Define como marcado, mas na menção Obj */
                thirdImage = quotedMsgObj?.sender?.id;

                /* Se ainda nada */
            } else {
                /* Define random do grupo */
                thirdImage = Indexer('array').extract(groupMembersId);
            }

            /* Adquire a segunda imagem */
            thirdImage = await lookupPhotos(kill, thirdImage, mentionedJidList);

            /* Insere na envInfo */
            envInfo.results.value.push(thirdImage);

            /* ------------------- FINALIZAR ------------------- */

            /* Remove qualquer valor que não seja URL */
            envInfo.results.value = envInfo.results.value.filter((lurl) => Indexer('regex').urls(lurl));

            /* Caso tenha algo errado */
            if (envInfo.results.value.length < 2) {
                /* Adiciona as de segurança */
                envInfo.results.value.push(envInfo.parameters.images.value).flat();
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Define valores padrões */
        envInfo.results.value.push(envInfo.parameters.images.value).flat();
    }

    /* Retorna */
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

        /* Insere a profileImages na envInfo */
        envInfo.functions.perfil.value = profileImages;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a lookupPhotos na envInfo */
        envInfo.functions.lookup.value = lookupPhotos;

        /* Insere a randomPhotos na envInfo */
        envInfo.functions.aleator.value = randomPhotos;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = echoError;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Define o local completo na envInfo para usar o reload novamente */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.perfil]: envInfo.functions.perfil.value,
                [envInfo.exports.lookup]: envInfo.functions.lookup.value,
                [envInfo.exports.aleator]: envInfo.functions.aleator.value,
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
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
