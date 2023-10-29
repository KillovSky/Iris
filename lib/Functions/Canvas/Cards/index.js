/* eslint-disable max-len */

/* Requires */
const canvafy = require('canvafy');
const fs = require('fs');
const path = require('path');
const Indexer = require('../../../index');

/* JSON'S | Utilidades */
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

/* Gera um Card de nível */
async function levelingCard(
    avatar = envInfo.functions.level.arguments.avatar.value,
    username = envInfo.functions.level.arguments.username.value,
    patente = envInfo.functions.level.arguments.patente.value,
    myXP = envInfo.functions.level.arguments.myXP.value,
    nextXP = envInfo.functions.level.arguments.nextXP.value,
    level = envInfo.functions.level.arguments.level.value,
    rank = envInfo.functions.level.arguments.rank.value,
    guilda = envInfo.functions.level.arguments.guilda.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = envInfo.parameters.baseImage.value;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Se a avatar não for URL, usa a padrão */
    const myAvatar = Indexer('regexp').urls(avatar).value.isURL ? avatar : envInfo.functions.greets.arguments.avatar.value;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições */
        const conditions = (
            /* Todas as Strings */
            [patente, username, guilda].every((res) => /[0-9a-zA-Z]+/gi.test(res))

            /* Todas as strings que também podem ser números */
            && [myXP, rank, nextXP, level].every((res) => /[0-9]+/gi.test(res))

            /* Se for URL na avatar */
            && Indexer('regexp').urls(myAvatar).value.isURL === true
        );

        /* Verifica se as condições batem */
        if (conditions) {
            /* Define as opções de design */
            const levColor = envInfo.parameters.stockValues.value.leveling;

            /* Cria um novo Card */
            const rankCard = await new canvafy.Rank();

            /* Define a fonte menor */
            rankCard.rank.data_size = 34;
            rankCard.level.data_size = 34;

            /* Avatar */
            rankCard.setAvatar(myAvatar);

            /* Borda do avatar */
            rankCard.setCustomStatus(levColor.status);

            /* Imagem de fundo */
            rankCard.setBackground(envInfo.parameters.stockValues.value.background.format, envInfo.parameters.stockValues.value.background.value);

            /* Username */
            rankCard.setUsername(username, levColor.username);

            /* Nível */
            rankCard.setLevel(Number(level), patente);

            /* XP atual */
            rankCard.setCurrentXp(Number('487'), levColor.currentXP);

            /* XP necessário para upar */
            rankCard.setRequiredXp(Number(nextXP), levColor.requiredXP);

            /* Cor da borda */
            rankCard.setBorder(levColor.contColor);

            /* Cores da linha da barra de progresso */
            rankCard.setBarColor(levColor.progressBar);

            /* Opacidade do overlay */
            rankCard.setOverlayOpacity(levColor.overlayOpacity);

            /* Cor do nível */
            rankCard.setLevelColor({ text: levColor.level.name, number: levColor.level.value });

            /* Patente */
            rankCard.setRank(Number(rank), String(guilda));

            /* Cor do rank */
            rankCard.setRankColor({ text: levColor.rank.name, number: levColor.rank.value });

            /* Gera a Card */
            envInfo.results.value = await rankCard.build();
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

/* Gera um Card para quem sair ou entrar em grupos */
async function greetsCard(
    avatar = envInfo.functions.greets.arguments.avatar.value,
    event = envInfo.functions.greets.arguments.event.value,
    title = envInfo.functions.greets.arguments.title.value,
    description = envInfo.functions.greets.arguments.description.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = Buffer.from(envInfo.parameters.baseImage.value, 'base64');

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Se a avatar não for URL, usa a padrão */
    const myAvatar = Indexer('regexp').urls(avatar).value.isURL ? avatar : envInfo.parameters.stockValues.profile;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se as condições batem */
        if (Indexer('regexp').urls(myAvatar).value.isURL && typeof event === 'string') {
            /* Cria um novo welcome */
            const greetCard = await new canvafy.WelcomeLeave();

            /* Define o tipo de evento */
            const initCard = event !== 'add' ? 'goodbye' : 'welcome';

            /* Define o design */
            const greetColors = envInfo.parameters.stockValues.value.greetings;

            /* Background */
            greetCard.setBackground(envInfo.parameters.stockValues.value.background.format, envInfo.parameters.stockValues.value.background.value);

            /* Avatar */
            greetCard.setAvatar(myAvatar);

            /* Verifica se quer: Texto customizado de Titulo */
            if (typeof title === 'string') {
                /* Define o Titulo */
                greetCard.setTitle(title || greetColors[initCard].title);

                /* Define como o padrão */
            } else greetCard.setTitle(greetColors[initCard].title);

            /* Verifica se quer: Texto customizado de nome do Chat */
            if (typeof description === 'string') {
                /* Define uma descrição customizada */
                greetCard.setDescription(description || greetColors[initCard].description);

                /* Define como o padrão */
            } else greetCard.setDescription(greetColors[initCard].description);

            /* Caso deva usar o design customizado */
            if (greetColors.apply === true) {
                /* Define o Border customizado */
                greetCard.setBorder(greetColors.borderColor);

                /* Define o Hashtag customizado */
                greetCard.setAvatarBorder(greetColors.contColor);

                /* Define a opacidade das bordas */
                greetCard.setOverlayOpacity(Number(greetColors.cardOpacity));
            }

            /* Define a finalização */
            envInfo.results.value = await greetCard.build();
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

        /* Insere a levelingCard na envInfo */
        envInfo.functions.level.value = levelingCard;

        /* Insere a greetsCard na envInfo */
        envInfo.functions.greets.value = greetsCard;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.level]: envInfo.functions.level.value,
                [envInfo.exports.greets]: envInfo.functions.greets.value,
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
