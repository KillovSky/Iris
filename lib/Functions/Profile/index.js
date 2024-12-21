/* eslint-disable max-len */
const telegraph = require('@killovsky/telegraph');
const fs = require('fs');
const Indexer = require('../../index');

/* JSON's */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let tryLimit = 3;

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/*
    Função que pega uma foto de alguém aleatório e checa se deu bom.
    Limite ajustável pela 'utils.json', basta definir algo acima de 2 URLS.
*/
async function randomPhotos(kill, personList) {
    /* Define a imagem padrão como a de segurança */
    let myProfile = envInfo.parameters.failed.value;

    /* Só roda se os valores estiverem corretos */
    if (typeof kill === 'object' && Array.isArray(personList)) {
        /* Se já esgotou a array retorna a de segurança */
        if (personList.length === 0) return myProfile;

        /* Escolhe alguém aleatório para obter a foto */
        const luckyBast = Indexer('array').extract(personList).value;

        /* Roda em try para evitar danos ao myProfile */
        try {
            /* Baileys dropa erros se a imagem não puder ser obtida */
            myProfile = await kill.profilePictureUrl(luckyBast, 'image');

            /* Se deu erro pela pessoa ocultar imagem ou outros */
        } catch (err) { /* Ignora, pois vai tentar com outra pessoa */ }

        /* Se não for uma URL válida */
        if (!Indexer('regex').urls(myProfile).value.isURL) {
            /* Tira um do limite */
            tryLimit -= 1;

            /* Se chegou ao limite */
            if (tryLimit < 0) {
                /* Adiciona imagens padrão */
                myProfile = Indexer('array').extract(envInfo.parameters.images.value).value;

                /* Se ainda consegue puxar pessoas */
            } else {
                /* Tira a pessoa que falhou da array atual e chama a função recursivamente */
                const newPersonList = personList.filter((p) => p !== luckyBast);
                myProfile = await randomPhotos(kill, newPersonList);
            }

            /* Se for uma URL válida, reseta o limitador */
        } else tryLimit = 3;
    }

    /* Retorna o que achou */
    return myProfile;
}

/* Adquire as imagens de perfil */
async function lookupPhotos(kill, userFind, randUsers) {
    /* Define a imagem padrão como falha */
    let imageServit = envInfo.parameters.failed.value;

    /* Verifica se os parâmetros são do tipo esperado */
    if (typeof kill === 'object' && typeof userFind === 'string' && Array.isArray(randUsers)) {
        /* Executa em um try para evitar danos ao imageServit */
        try {
            /* Tenta obter a imagem usando a biblioteca Baileys */
            imageServit = await kill.profilePictureUrl(userFind, 'image');

            /* Se a pessoa oculta a foto ou deu erro */
        } catch (err) { /* Não faz nada, pois a imagem foi inserida como uma de segurança */ }

        /* Verifica se a imagem obtida é uma URL válida */
        if (!Indexer('regex').urls(imageServit).value.isURL) {
            /* Se não for uma URL válida, obtém uma imagem aleatória */
            imageServit = await randomPhotos(kill, randUsers);
        }
    }

    /* Retorna a imagem obtida */
    return imageServit;
}

/* Função para obter a foto do participante e caso der erro obter de alguém aleatório */
async function getProfileImages(
    kill = false,
    env = false,
    userfirst = false,
) {
    /* Define um resultado padrão */
    envInfo.results.value = [];

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se os parâmetros recebidos estão certos */
        if ([kill, env].every((val) => typeof val === 'object' && val !== null)) {
            /* Importa os valores */
            const {
                quotedMsg,
                decryptedMedia,
                mentionedJidList,
                groupMembersId,
                canSticker,
                mimetype,
                user,
            } = env.value;

            /* Adiciona a Íris na lista de menções */
            mentionedJidList.push(irisNumber);

            /* ------------------- WEBIMAGEM ------------------- */

            /* Caso tenha uma imagem */
            if (canSticker) {
                /* Faz upload */
                const upPhotos = await telegraph.upload(decryptedMedia, mimetype);

                /* Define o que adicionar, se imagem ou erro */
                if (Indexer('regexp').urls(upPhotos.images).value.isURL) {
                    /* URL de imagem de emergencia */
                    envInfo.results.value.push(upPhotos.images);

                    /* Se fez upload certo */
                } else if (Indexer('regexp').urls(upPhotos.images[0]?.src).value.isURL) {
                    /* Imagem normal */
                    envInfo.results.value.push(upPhotos.images[0]?.src);
                }
            }

            /* ------------------- OBTENDO FOTOS DE PERFIL ------------------- */

            /* Define uma mini função para checar o usuário */
            const lookupAndPushImage = async (people) => {
                /* Com base na lookup */
                const image = await lookupPhotos(kill, people, groupMembersId);

                /* Adiciona o valor na envInfo */
                envInfo.results.value.push(image);
            };

            /* 1° foto de perfil */
            const firstImageUser = userfirst ? user : quotedMsg?.participant || mentionedJidList[0] || Indexer('array').extract(groupMembersId).value;
            await lookupAndPushImage(firstImageUser);

            /* 2° foto de perfil */
            const mentionsJid = mentionedJidList.filter((usr) => usr !== firstImageUser);
            const secondImageUser = mentionsJid[0] || false;
            await lookupAndPushImage(secondImageUser);

            /* 3° foto de perfil */
            const finaleMent = mentionedJidList.filter((usr) => usr !== firstImageUser && usr !== secondImageUser);
            const thirdImageUser = finaleMent[0] || false;
            await lookupAndPushImage(thirdImageUser);

            /* Remove qualquer valor que não seja URL */
            envInfo.results.value = envInfo.results.value.filter((lurl) => Indexer('regex').urls(lurl).value.isURL);

            /* Caso tenha algo errado */
            if (envInfo.results.value.length < 2) {
                /* Adiciona as de segurança */
                envInfo.results.value.push(envInfo.parameters.images.value);
                envInfo.results.value = envInfo.results.value.flat(5);
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);

        /* Define valores padrões */
        envInfo.results.value.push(envInfo.parameters.images.value);
        envInfo.results.value = envInfo.results.value.flat(5);
    }

    /* Retorna */
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

        /* Insere a getProfileImages na envInfo */
        envInfo.functions.perfil.value = getProfileImages;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a lookupPhotos na envInfo */
        envInfo.functions.lookup.value = lookupPhotos;

        /* Insere a randomPhotos na envInfo */
        envInfo.functions.aleator.value = randomPhotos;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
