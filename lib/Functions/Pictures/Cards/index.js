/* eslint-disable no-nested-ternary */
/* eslint-disable new-cap */
/* eslint-disable max-len */

/* Requires */
const canvacord = require('canvacord');
const canvafy = require('canvafy');
const chessImageGenerator = require('chess-image-generator');
const validateFEN = require('chess.js').validateFen;
const fs = require('fs');
const Indexer = require('../../../index');

/* JSON'S | Utilidades */
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

/* Gera um card de Xadrez */
async function chessCard(
    fenData = envInfo.functions.chess.arguments.fenData.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = Buffer.from(envInfo.parameters.baseImage.value, 'base64');

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Define o FEN */
    const fenMoves = typeof fenData === 'string' ? (validateFEN(fenData).ok === true ? fenData : envInfo.functions.chess.arguments.fenData.value) : envInfo.functions.chess.arguments.fenData.value;

    /* Try-Catch para casos de erro */
    try {
        /* Inicializa o board */
        const chessBoarding = new chessImageGenerator({
            size: 800,
            style: 'alpha',
        });

        /* Carrega a FEN */
        await chessBoarding.loadFEN(fenMoves);

        /* Define a imagem */
        envInfo.results.value = await chessBoarding.generateBuffer();

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

/* Gera um card de TicTacToe */
async function tttCard(
    board = envInfo.functions.ttt.arguments.board.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = Buffer.from(envInfo.parameters.baseImage.value, 'base64');

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se o board é um objeto não nulo e não um array */
        if (typeof board === 'object' && board !== null && !Array.isArray(board)) {
            /* Constrói o board */
            envInfo.results.value = await canvacord.Canvas.tictactoe(board, {
                bg: '#000000',
                bar: '#FFFFFF',
            });
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

/* Gera uma Card de LevelUP */
async function levelUP(
    avatar = envInfo.functions.up.arguments.avatar.value,
    username = envInfo.functions.up.arguments.username.value,
    oldlevel = envInfo.functions.up.arguments.oldlevel.value,
    newlevel = envInfo.functions.up.arguments.newlevel.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = Buffer.from(envInfo.parameters.baseImage.value, 'base64');

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Se a avatar não for URL, usa a padrão */
    const myAvatar = Indexer('regexp').urls(avatar).value.isURL ? avatar : envInfo.functions.greets.arguments.avatar.value;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições */
        const conditions = (
            /* Todas as strings que também podem ser números */
            [oldlevel, newlevel].every((res) => /[0-9]+/gi.test(res))

            /* Se for URL na avatar */
            && Indexer('regexp').urls(myAvatar).value.isURL === true
        );

        /* Verifica se as condições batem */
        if (conditions) {
            /* Define as opções de design */
            const upDesign = envInfo.parameters.stockValues.value.up;

            /* Cria o card */
            const upgradeLevel = await new canvafy.LevelUp();

            /* Avatar */
            upgradeLevel.setAvatar(myAvatar);

            /* Levels */
            upgradeLevel.setLevels(oldlevel, newlevel);

            /* Background */
            upgradeLevel.setBackground(envInfo.parameters.stockValues.value.background.format, envInfo.parameters.stockValues.value.background.value);

            /* Username */
            upgradeLevel.setUsername(username || 'User', upDesign.username);

            /* Cor da borda */
            upgradeLevel.setBorder(upDesign.contColor);

            /* Cor da borda de avatar */
            upgradeLevel.setAvatarBorder(upDesign.avatarBorder);

            /* Opacidade do overlay */
            upgradeLevel.setOverlayOpacity(upDesign.overlayOpacity);

            /* Gera a Card */
            envInfo.results.value = await upgradeLevel.build();
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
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
    envInfo.results.value = Buffer.from(envInfo.parameters.baseImage.value, 'base64');

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Se a avatar não for URL, usa a padrão */
    const myAvatar = Indexer('regexp').urls(avatar).value.isURL ? avatar : envInfo.functions.greets.arguments.avatar.value;

    /* Try-Catch para casos de erro */
    try {
        /* Define as condições */
        const conditions = (
            /* Todas as Strings */
            [patente, guilda].every((res) => /[0-9a-zA-Z]+/gi.test(res))

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
            rankCard.setUsername(username || 'User', levColor.username);

            /* Nível */
            rankCard.setLevel(Number(level), patente);

            /* XP atual */
            rankCard.setCurrentXp(Number(myXP), levColor.currentXP);

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

            /* Guilda e posição nela */
            rankCard.setRank(Number(rank), String(guilda));

            /* Cor da guilda */
            rankCard.setRankColor({ text: levColor.rank.name, number: levColor.rank.value });

            /* Gera a Card */
            envInfo.results.value = await rankCard.build();
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
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

            /* Define o Titulo */
            greetCard.setTitle(typeof title === 'string' ? title : greetColors[initCard].title);

            /* Define uma descrição customizada */
            greetCard.setDescription(typeof description === 'string' ? description : greetColors[initCard].description);

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
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
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
        [envInfo.exports.messedup]: { value: logging.echoError },
        [envInfo.exports.poswork]: { value: logging.postResults },
        [envInfo.exports.reset]: { value: resetLocal },
        [envInfo.exports.level]: { value: levelingCard },
        [envInfo.exports.up]: { value: levelUP },
        [envInfo.exports.greets]: { value: greetsCard },
        [envInfo.exports.ttt]: { value: tttCard },
        [envInfo.exports.chess]: { value: chessCard },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
