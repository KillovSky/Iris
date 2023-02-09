/* eslint-disable max-len */

/* Requires */
const canvacord = require('canvacord');
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
    XP = envInfo.functions.level.arguments.XP.value,
    nextXP = envInfo.functions.level.arguments.nextXP.value,
    level = envInfo.functions.level.arguments.level.value,
    rank = envInfo.functions.level.arguments.rank.value,
    guild = envInfo.functions.level.arguments.guild.value,
    nick = envInfo.functions.level.arguments.nick.value,
    team = envInfo.functions.level.arguments.team.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = envInfo.parameters.baseImage.value;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições */
        const conditions = (
            /* Todas as Strings */
            [avatar, guild, nick].every((res) => typeof res === 'string')

            /* Todas as strings que também podem ser números */
            && [XP, rank, nextXP, level, team].every((res) => typeof res === 'string' || typeof res === 'number')
        );

        /* Verifica se as condições batem */
        if (conditions) {
            /* Define as opções de design */
            const levColor = envInfo.parameters.leveling.value;

            /* Cria um novo Card */
            let rankCard = new canvacord.Rank();

            /* Renderiza os emojis */
            rankCard.renderEmojis(levColor.useEmojis);

            /* Avatar */
            rankCard.setAvatar(String(avatar));

            /* Imagem de fundo */
            rankCard.setBackground(levColor.background.format, levColor.background.image);

            /* Contorno da imagem de perfil */
            rankCard.setCustomStatusColor(levColor.status);

            /* Ranking */
            rankCard.setDiscriminator(String(rank), levColor.discriminator);

            /* Nível */
            rankCard.setLevel(Number(level));

            /* Cor do nível */
            rankCard.setLevelColor(levColor.level.name, levColor.level.value);

            /* Overlay */
            rankCard.setOverlay(levColor.overlay.color, levColor.overlay.opacity, levColor.overlay.enable);

            /* Cores da barra de progresso */
            rankCard.setProgressBar([
                levColor.progress.colorEnd,
                levColor.progress.colorStart,
            ], levColor.progress.type, levColor.progress.rounded);

            /* Cores da linha da barra de progresso */
            rankCard.setProgressBarTrack(levColor.progress.track);

            /* Guilda */
            rankCard.setRank(Number(team), String(guild), levColor.rank.enable);

            /* Cor do rank */
            rankCard.setRankColor(levColor.rank.name, levColor.rank.value);

            /* XP necessário para upar */
            rankCard.setRequiredXP(Number(nextXP), levColor.XP.needed);

            /* Username */
            rankCard.setUsername(String(nick), levColor.username);

            /* XP */
            rankCard.setCurrentXP(Number(XP), levColor.XP.smaller);

            /* Caso o XP esteja acima da metade necessária */
            if (Number(XP) > (Number(nextXP) / 2)) {
                /* Define como 'amarelo' */
                rankCard.setCurrentXP(Number(XP), levColor.XP.almost);
            }

            /* Gera a Card */
            rankCard = await rankCard.build();

            /* Retorna a Base64 */
            envInfo.results.value = Indexer('string').dataURI('image/png', rankCard);
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Valor padrão */
        envInfo.results.value = envInfo.parameters.baseImage.value;
    }

    /* Retorna a nova Array */
    return postResults(envInfo.results);
}

/* Gera um Card para quem sair ou entrar em grupos */
async function greetsCard(
    userName = envInfo.functions.greets.arguments.userName.value,
    rank = envInfo.functions.greets.arguments.rank.value,
    groupName = envInfo.functions.greets.arguments.groupName.value,
    members = envInfo.functions.greets.arguments.members.value,
    avatar = envInfo.functions.greets.arguments.avatar.value,
    event = envInfo.functions.greets.arguments.event.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = envInfo.parameters.baseImage.value;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições */
        const conditions = (
            /* Todas as Strings */
            [userName, rank, userName, event, groupName].every((res) => typeof res === 'string')

            /* As que devem ser número, só um no caso */
            && /^[0-9]+$/.test(members)
        );

        /* Verifica se as condições batem */
        if (conditions) {
            /* Cria um novo welcome */
            let greetCard = new canvacord.Welcomer();

            /* Define como welcome */
            let initCard = 'welcome';

            /* Define o design */
            const greetColors = envInfo.parameters.greetings.value;

            /* Caso seja um goodbye */
            if (event !== 'add') {
                /* Faz o Welcome */
                greetCard = new canvacord.Leaver();

                /* Define a função como goodbye */
                initCard = 'goodbye';
            }

            /* Username */
            greetCard.setUsername(String(userName));

            /* Discriminator */
            greetCard.setDiscriminator(String(rank));

            /* Nome do grupo */
            greetCard.setGuildName(String(groupName));

            /* Contagem de membros */
            greetCard.setMemberCount(Number(members));

            /* Avatar */
            greetCard.setAvatar(String(avatar));

            /* Caso deva usar o design customizado */
            if (greetColors[initCard].apply === true) {
                /* Define o HEX temporário */
                let hexDatas = false;

                /* Verifica se quer: Texto customizado de Titulo */
                if (greetColors[initCard].Title !== null) {
                    /* Define o Titulo */
                    greetCard.setText('title', String(greetColors[initCard].title));
                }

                /* Verifica se quer: Texto customizado de nome do Chat */
                if (greetColors[initCard].Chat !== null) {
                    /* Define um Chat customizado */
                    greetCard.setText('message', String(greetColors[initCard].chat));
                }

                /* Verifica se quer: Texto customizado de quantidade de membros */
                if (greetColors[initCard].Members !== null) {
                    /* Define o Members customizado */
                    greetCard.setText('member-count', String(greetColors[initCard].members));
                }

                /* Verifica se quer: Cor HEX da borda do Card */
                hexDatas = Indexer('color').ishex(greetColors.contColor);
                if (hexDatas.value.found === true) {
                    /* Define o Border customizado */
                    greetCard.setColor('border', String(hexDatas.value.hex[0]));
                }

                /* Verifica se quer: Cor HEX da Hashtag */
                hexDatas = Indexer('color').ishex(greetColors.hashtagColor);
                if (hexDatas.value.found === true) {
                    /* Define o Hashtag customizado */
                    greetCard.setColor('hashtag', String(hexDatas.value.hex[0]));
                }

                /* Verifica se quer: Cor HEX da borda do titulo */
                hexDatas = Indexer('color').ishex(greetColors.borderColor);
                if (hexDatas.value.found === true) {
                    /* Define a borda de titulo customizado */
                    greetCard.setColor('title-border', String(hexDatas.value.hex[0]));
                }

                /* Verifica se quer: Cor HEX da box do username */
                hexDatas = Indexer('color').ishex(greetColors.nameColor);
                if (hexDatas.value.found === true) {
                    /* Define o box do username customizado */
                    greetCard.setColor('username-box', String(hexDatas.value.hex[0]));
                }

                /* Verifica se quer: Cor HEX do discriminator */
                hexDatas = Indexer('color').ishex(greetColors.discColor);
                if (hexDatas.value.found === true) {
                    /* Define o discriminator customizado */
                    greetCard.setColor('discriminator-box', String(hexDatas.value.hex[0]));
                }

                /* Verifica se quer: Cor HEX do titulo */
                hexDatas = Indexer('color').ishex(greetColors.titleColor);
                if (hexDatas.value.found === true) {
                    /* Define o titulo customizado */
                    greetCard.setColor('title', String(hexDatas.value.hex[0]));
                }

                /* Verifica se quer: Opacidade do box de username */
                if (!Number.isNaN(Number(greetColors.userOpacity))) {
                    /* Define a opacidade do box de username */
                    greetCard.setOpacity('username-box', Number(greetColors.userOpacity));
                }

                /* Verifica se quer: Opacidade do discriminator */
                if (!Number.isNaN(Number(greetColors.discOpacity))) {
                    /* Define a opacidade do discriminator */
                    greetCard.setOpacity('discriminator-box', Number(greetColors.discOpacity));
                }

                /* Verifica se quer: Opacidade das bordas */
                if (!Number.isNaN(Number(greetColors.borderOpacity))) {
                    /* Define a opacidade das bordas */
                    greetCard.setOpacity('border', Number(greetColors.borderOpacity));
                }
            }

            /* Define a finalização */
            greetCard = await greetCard.build();

            /* Retorna a Base64 */
            envInfo.results.value = Indexer('string').dataURI('image/png', greetCard);
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);

        /* Valor padrão */
        envInfo.results.value = envInfo.parameters.baseImage.value;
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
