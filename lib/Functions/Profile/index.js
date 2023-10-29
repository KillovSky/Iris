/* eslint-disable max-len */
const telegraph = require('@killovsky/telegraph');
const path = require('path');
const fs = require('fs');
const Indexer = require('../../index');

/* JSON's */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let tryLimit = 3;

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
    Limite ajustável pela 'utils.json', basta definir algo acima de 2 URLS.
*/
async function randomPhotos(kill, personList) {
    /* Define se a imagem foi obtida com sucesso */
    let myProfile = envInfo.parameters.failed.value;

    /* Só roda se os valores estiverem corretos */
    if (typeof kill === 'object' && personList instanceof Array) {
        /* Se já esgotou a array */
        if (personList.length === 0) return myProfile;

        /* Escolhe alguém aleatório para obter a foto */
        const luckyBast = Indexer('array').extract(personList).value;

        /* Adquire a imagem de um aleatório com try catch */
        try {
            /* Baileys dropa erros se a imagem não puder ser obtida */
            myProfile = await kill.profilePictureUrl(luckyBast, 'image');
        } catch (err) { /* Faz nada */ }

        /* Se não for uma URL válida */
        if (!Indexer('regex').urls(myProfile).value.isURL) {
            /* Tira um do limite */
            tryLimit -= 1;

            /* Se chegou ao limite */
            if (tryLimit < 0) {
                /* Adiciona uma imagem padrão */
                myProfile = Indexer('array').extract(envInfo.parameters.images.value).value;

                /* Se não chegou ao limite, tenta de novo */
            } else {
                /* Tira a pessoa que falhou da array atual */
                const newPersonList = personList.filter((p) => p !== luckyBast);

                /* A mesma função, até obter uma imagem ou chegar ao limite */
                myProfile = await randomPhotos(kill, newPersonList);
            }

            /* Se for, reseta o limitador */
        } else tryLimit = 3;
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
        /* Adquire a imagem com try catch */
        try {
            /* Baileys dropa erros se a imagem não puder ser obtida */
            imageServit = await kill.profilePictureUrl(userFind, 'image');
        } catch (err) { /* Faz nada */ }

        /* Se ainda não for imagem válida */
        if (!Indexer('regex').urls(imageServit).value.isURL) {
            /* Manda pra obtenção de random's */
            imageServit = await randomPhotos(kill, randUsers);
        }
    }

    /* Retorna o que achou */
    return imageServit;
}

/* Função para obter a foto do participante e caso der erro obter de alguém aleatório */
async function getProfileImages(
    kill = false,
    env = false,
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
            } = env.value;

            /* ------------------- WEBIMAGEM ------------------- */

            /* Caso tenha uma imagem */
            if (canSticker) {
                /* Faz upload */
                const upPhotos = await telegraph.upload(decryptedMedia, mimetype);

                /* Define o que adicionar */
                if (Indexer('regexp').urls(upPhotos.images).value.isURL) {
                    /* URL de imagem de emergencia */
                    envInfo.results.value.push(upPhotos.images);

                    /* Se a normal funcionar */
                } else if (Indexer('regexp').urls(upPhotos.images[0]?.src).value.isURL) {
                    /* Imagem normal */
                    envInfo.results.value.push(upPhotos.images[0]?.src);
                }
            }

            /* ------------------- 1° IMAGEM ------------------- */

            /* 1° foto de perfil */
            const firstImageUser = (
                /* QuotedMsg */
                quotedMsg?.participant

                /* MentionedJidList */
                || mentionedJidList[0]

                /* Pessoa random */
                || Indexer('array').extract(groupMembersId).value
            );

            /* Adquire a primeira imagem */
            const firstImage = await lookupPhotos(kill, firstImageUser, groupMembersId);

            /* Insere na envInfo */
            envInfo.results.value.push(firstImage);

            /* ------------------- 2° IMAGEM ------------------- */

            /* Define se tem UMA menção que não é a firstImageUser */
            const mentionsJid = mentionedJidList.filter((usr) => usr !== firstImageUser);

            /* 2° foto de perfil */
            let secondImageUser = mentionsJid[0] || false;

            /* Se for uma questão de quoted message */
            if (quotedMsg?.participant && firstImageUser !== quotedMsg?.participant) {
                /* Define como marcado */
                secondImageUser = quotedMsg?.participant;

                /* Verifica se mentioned é igual ao primeiro valor */
            } else if (secondImageUser && secondImageUser === firstImageUser) {
                /* Define como @ */
                secondImageUser = Indexer('array').extract(groupMembersId).value;
            }

            /* Adquire a segunda imagem */
            const secondImage = await lookupPhotos(kill, secondImageUser, groupMembersId);

            /* Insere na envInfo */
            envInfo.results.value.push(secondImage);

            /* ------------------- 3° IMAGEM ------------------- */

            /* Define se tem UMA menção que não é a firstImageUser/secondImageUser */
            const finaleMent = mentionedJidList.filter((usr) => usr !== firstImageUser && usr !== secondImageUser);

            /* 3° foto de perfil */
            let thirdImageUser = finaleMent[0] || false;

            /* Se for uma questão de quoted message */
            if (quotedMsg?.participant && firstImageUser !== quotedMsg?.participant && quotedMsg?.participant !== secondImageUser) {
                /* Define como marcado */
                thirdImageUser = quotedMsg?.participant;

                /* Verifica se mentioned é igual ao primeiro ou segundo valor */
            } else if ((thirdImageUser && thirdImageUser === firstImageUser) || (thirdImageUser && thirdImageUser === secondImageUser)) {
                /* Define como @ */
                thirdImageUser = Indexer('array').extract(groupMembersId).value;
            }

            /* Adquire a segunda imagem */
            const thirdImage = await lookupPhotos(kill, thirdImageUser, groupMembersId);

            /* Insere na envInfo */
            envInfo.results.value.push(thirdImage);

            /* ------------------- FINALIZAR ------------------- */

            /* Remove qualquer valor que não seja URL */
            envInfo.results.value = envInfo.results.value.filter((lurl) => Indexer('regex').urls(lurl).value.isURL);

            /* Caso tenha algo errado */
            if (envInfo.results.value.length < 2) {
                /* Adiciona as de segurança */
                envInfo.results.value = envInfo.results.value.push(envInfo.parameters.images.value).flat();
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

        /* Insere a getProfileImages na envInfo */
        envInfo.functions.perfil.value = getProfileImages;

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
