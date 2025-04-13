/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-case-declarations */
/* eslint-disable indent */
/* eslint-disable max-len */

/* Requires */
const canvafy = require('canvafy');
const canvacord = require('canvacord');
const canvas = require('@napi-rs/canvas');
const mumaker = require('mumaker');
const petPetGif = require('pet-pet-gif');
const fs = require('fs');
const path = require('path');
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

/* Faz a escala de fill na imagem */
function scaleToFill(imageBase, areaWidth, areaHeight, topLeftWidth, topLeftHeight, context) {
    /* Calcula o fator de escala para preencher a área alvo */
    const scale = Math.max(areaWidth / imageBase.width, areaHeight / imageBase.height);

    /* Calcula as coordenadas para desenhar a imagem escalada com base no ponto superior esquerdo */
    const x = (areaWidth / 2) - (imageBase.width / 2) * scale + topLeftWidth;
    const y = (areaHeight / 2) - (imageBase.height / 2) * scale + topLeftHeight;

    /* Desenha a imagem escalada no contexto do canvas */
    context.drawImage(imageBase, x, y, imageBase.width * scale, imageBase.height * scale);
}

/* Faz a escala de fit na imagem */
function scaleToFit(imageBase, areaWidth, areaHeight, topLeftWidth, topLeftHeight, context) {
    /* Calcula o fator de escala para ajustar à área alvo */
    const scale = Math.min(areaWidth / imageBase.width, areaHeight / imageBase.height);

    /* Calcula as coordenadas para desenhar a imagem escalada com base no ponto superior esquerdo */
    const x = (areaWidth / 2) - (imageBase.width / 2) * scale + topLeftWidth;
    const y = (areaHeight / 2) - (imageBase.height / 2) * scale + topLeftHeight;

    /* Desenha a imagem escalada no contexto do canvas */
    context.drawImage(imageBase, x, y, imageBase.width * scale, imageBase.height * scale);
}

/* Função para memes de criação manual, isolado da envInfo por ser implementação em outra função */
async function unikeMemes(profilePictures, memename) {
    /* Define um resultado padrão */
    let envResults = Buffer.from(envInfo.parameters.baseImage.value, 'base64');

    /* Try-Catch para casos de erro */
    try {
        /* Define se os requisitos estão certos */
        if (Array.isArray(profilePictures) && typeof memename === 'string') {
            /* Define a base dos memes */
            const firstImage = await canvas.loadImage(String(profilePictures[0] || ''));
            const secondImage = await canvas.loadImage(String(profilePictures[1] || ''));
            const backgroundImage = ['ojjo', 'jooj', 'reverse'].includes(memename) ? '' : await canvas.loadImage(path.normalize(`${__dirname}/images/${memename}.jpg`));
            let createdCanvas = ['ojjo', 'jooj', 'reverse'].includes(memename) ? '' : canvas.createCanvas(backgroundImage.width, backgroundImage.height);
            let context = ['ojjo', 'jooj', 'reverse'].includes(memename) ? '' : createdCanvas.getContext('2d');
            let blurImageBase = await Indexer('others').buffer(profilePictures[0]);
            blurImageBase = await Indexer('others').blur(blurImageBase.value);
            const firstImageBlur = await canvas.loadImage(blurImageBase.value);
            const secondImageBlur = await canvas.loadImage(profilePictures[0]);

            /* Switch para desenhar os memes de forma adequada */
            // eslint-disable-next-line default-case
            switch (memename) {
                /* Bolsonero */
                case 'bolsonero':
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                    context.drawImage(firstImage, createdCanvas.width / 2, 0, createdCanvas.width / 2, createdCanvas.width / 2);
                    context.drawImage(secondImage, createdCanvas.width / 2, createdCanvas.width / 2, createdCanvas.width / 2, createdCanvas.width / 2);
                break;

                /* Morre praga */
                case 'morrepraga':
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                    context.drawImage(firstImage, 170, 220, 330, 330);
                break;

                /* Reverse */
                case 'reverse':
                    createdCanvas = canvas.createCanvas(firstImage.width, firstImage.height);
                    context = createdCanvas.getContext('2d');
                    context.translate(createdCanvas.width, 0);
                    context.scale(-1, 1);
                    context.drawImage(firstImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Drake */
                case 'drake':
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                    context.drawImage(firstImage, createdCanvas.width / 2, 0, createdCanvas.width / 2, createdCanvas.width / 2);
                    context.drawImage(secondImage, createdCanvas.width / 2, createdCanvas.width / 2, createdCanvas.width / 2, createdCanvas.width / 2);
                break;

                /* Wolverine */
                case 'wolverine':
                    context.drawImage(firstImage, 160, 460, 380, 380);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Jooj */
                case 'jooj':
                    createdCanvas = canvas.createCanvas(firstImage.width, firstImage.height);
                    context = createdCanvas.getContext('2d');
                    context.translate(createdCanvas.width, 0);
                    context.scale(-1, 1);
                    context.drawImage(firstImage, 0, 0, createdCanvas.width, createdCanvas.height);
                    context.translate(createdCanvas.width, 0);
                    context.scale(-1, 1);
                    context.drawImage(firstImage, 0, 0, firstImage.width / 2, firstImage.height, 0, 0, createdCanvas.width / 2, createdCanvas.height);
                break;

                /* Ojjo */
                case 'ojjo':
                    createdCanvas = canvas.createCanvas(firstImage.width, firstImage.height);
                    context = createdCanvas.getContext('2d');
                    context.drawImage(firstImage, createdCanvas.width / 2, 0, createdCanvas.width, createdCanvas.height);
                    context.translate(createdCanvas.width, 0);
                    context.scale(-1, 1);
                    context.drawImage(firstImage, createdCanvas.width / 2, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Medal */
                case 'medal':
                    createdCanvas = canvas.createCanvas(760, 481);
                    context = createdCanvas.getContext('2d');
                    context.drawImage(backgroundImage, 5, 5, createdCanvas.width - 10, createdCanvas.height - 10);
                    context.lineWidth = 10;
                    context.strokeRect(0, 0, createdCanvas.width, createdCanvas.height);
                    context.drawImage(firstImage, 160, 96, 200, 200);
                    context.drawImage(secondImage, 380, 10, 200, 200);
                break;

                /* BolsoTV */
                case 'bolsolike':
                    scaleToFill(firstImageBlur, 275, 155, 107, 8, context);
                    scaleToFit(secondImageBlur, 275, 155, 107, 8, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* BolsoFrame */
                case 'bolsoframe':
                    scaleToFill(firstImageBlur, 100, 120, 300, 36, context);
                    scaleToFit(secondImageBlur, 100, 120, 300, 36, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* BolsoTV */
                case 'bolsotv':
                    scaleToFill(firstImageBlur, 222, 130, 213, 35, context);
                    scaleToFit(secondImageBlur, 222, 130, 213, 35, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* SpongeBob */
                case 'spongebob':
                    scaleToFill(firstImageBlur, 102, 135, 27, 36, context);
                    scaleToFit(secondImageBlur, 102, 135, 27, 36, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Briggs */
                case 'briggs':
                    scaleToFill(firstImageBlur, 165, 200, 218, 67, context);
                    scaleToFit(secondImageBlur, 165, 200, 218, 67, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Bandeira */
                case 'bandeira':
                    scaleToFill(firstImageBlur, 425, 333, 46, 178, context);
                    scaleToFit(secondImageBlur, 425, 333, 46, 178, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Edtv */
                case 'edtv':
                    scaleToFill(firstImageBlur, 142, 105, 270, 21, context);
                    scaleToFit(secondImageBlur, 142, 105, 270, 21, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Suckerberg */
                case 'suckerberg':
                    scaleToFill(firstImageBlur, 412, 300, 513, 88, context);
                    scaleToFit(secondImageBlur, 412, 300, 513, 88, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Paper */
                case 'paper':
                    scaleToFill(firstImageBlur, 135, 101, 178, 216, context);
                    scaleToFit(secondImageBlur, 135, 101, 178, 216, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Pepe */
                case 'pepe':
                    scaleToFill(firstImageBlur, 100, 100, 81, 1, context);
                    scaleToFit(secondImageBlur, 100, 100, 81, 1, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* ShotTV */
                case 'shottv':
                    scaleToFill(firstImageBlur, 155, 108, 558, 66, context);
                    scaleToFit(secondImageBlur, 155, 108, 558, 66, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;

                /* Romero */
                case 'romero':
                    scaleToFill(firstImageBlur, 186, 276, 16, 18, context);
                    scaleToFit(secondImageBlur, 186, 276, 16, 18, context);
                    context.drawImage(backgroundImage, 0, 0, createdCanvas.width, createdCanvas.height);
                break;
            }

            /* Termina */
            envResults = await createdCanvas.toBuffer('image/png');
        }

        /* Caso de algum erro */
    } catch (error) {
        /* Printa o erro direto */
        console.log(error);
    }

    /* Retorna a nova Array */
    return envResults;
}

/* Gera um Card de nível */
async function memeMaker(
    typememe = envInfo.functions.memes.arguments.typememe.value,
    avatars = envInfo.functions.memes.arguments.avatars.value,
    env = envInfo.functions.memes.arguments.env.value,
) {
    /* Define um resultado padrão */
    envInfo.results.value = Buffer.from(envInfo.parameters.baseImage.value, 'base64');

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Define o que precisa */
    const {
        body,
        pushname,
        mentionedJidList,
        chatId,
        ignoreCommands,
    } = env;

    /* Define o texto da caption para enviar */
    envInfo.results.details = `✏️ By ${config.botName.value} 🖼️`;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se as condições batem */
        if (typeof typememe === 'string' && Array.isArray(avatars)) {
            /* Define os avatares */
            let myAvatares = [
                'https://http.cat/418.jpg',
                'https://http.dog/418.jpg',
                'https://http.cat/420.jpg',
                'https://http.dog/420.jpg',
                'https://http.dog/403.jpg',
                'https://http.cat/403.jpg',
                'https://http.dog/100.jpg',
                'https://http.cat/100.jpg',
                'https://thispersondoesnotexist.com',
            ];

            /* Define outros requisitos */
            let makerImage = envInfo.results.value;
            let myUsername = pushname;
            const regexpRepl = /--dark|-sticker|--dim|--light|--verified|--liked|--saved|--story/gi;

            /* Define as URLs da TextPRO */
            const locateURL = {
                '3dg': 'https://textpro.me/3d-gradient-text-effect-online-free-1002.html',
                light: 'https://textpro.me/create-a-futuristic-technology-neon-light-text-effect-1006.html',
                '3db': 'https://textpro.me/3d-box-text-effect-online-880.html',
                1917: 'https://textpro.me/1917-style-text-effect-online-980.html',
                thunder: 'https://textpro.me/create-thunder-text-effect-online-881.html',
                water: 'https://textpro.me/dropwater-text-effect-872.html',
                wolfb: 'https://textpro.me/create-wolf-logo-black-white-937.html',
                wolfg: 'https://textpro.me/create-wolf-logo-galaxy-online-936.html',
                bpink: 'https://textpro.me/create-blackpink-logo-style-online-1001.html',
                pornhub: 'https://textpro.me/pornhub-style-logo-online-generator-free-977.html',
                '80s': 'https://textpro.me/80-s-retro-neon-text-effect-online-979.html',
            };

            /* Se não for um meme de texto, ajusta os avatares */
            if (!ignoreCommands.includes(typememe.toLowerCase())) {
                /* Se a avatar não for URL, usa a padrão */
                myAvatares = avatars.map((ulk) => (Indexer('regexp').urls(ulk).value.isURL ? ulk : 'NONE'));
                myAvatares = myAvatares.filter((d) => d !== 'NONE');
                myAvatares = [...new Set(myAvatares)];
            }

            /* Dropa o uso se não tiver links adequados */
            if (myAvatares.length !== 0) {
                /* Define o comando */
                let memetic = typememe.toLowerCase();

                /* Define os meios de rodar, se canvacord ou canvafy */
                switch (memetic) {
                    /* Canvafy */
                    case 'gay':
                    case 'delete':
                    case 'batslap':
                    case 'beautiful':
                    case 'greyscale':
                    case 'invert':
                    case 'kiss':
                    case 'affect':
                        /* Cria o meme e define na env */
                        envInfo.results.value = await canvafy.Image[memetic](myAvatares[0], myAvatares[1], myAvatares[2]);
                    break;

                    /* Canvafy - Instagram Post */
                    case 'instapost':
                        /* Define o nome */
                        myUsername = Indexer('sql').get('personal', mentionedJidList[0], chatId);
                        myUsername = myUsername.value.name.text === 'default' ? pushname : myUsername.value.name.text;
                        myUsername = typeof myUsername === 'string' ? myUsername : pushname;
                        myUsername = typeof myUsername === 'string' ? myUsername : 'User';

                        /* Define os argumentos */
                        let instaSplit = (body || '0 | Likes | 31/12/2025').replace(regexpRepl, '').split('|') || [];
                        instaSplit.push([0, 'Likes', Date.now()]);
                        instaSplit = instaSplit.flat(5);

                        /* Base */
                        const instaImage = await new canvafy.Instagram();

                        /* Avatar */
                        instaImage.setAvatar(myAvatares[0]);

                        /* Post Image */
                        instaImage.setPostImage(myAvatares[1]);

                        /* Story */
                        instaImage.setStory(body.includes('--story'));

                        /* User */
                        instaImage.setUser({ username: myUsername });

                        /* Like */
                        instaImage.setLike({
                            count: Number(/[0-9]+/.test(instaSplit[0]) ? instaSplit[0] : instaSplit[1]),
                            likeText: String(instaSplit[1] !== instaSplit[0] ? instaSplit[1] : instaSplit[0]),
                        });

                        /* Theme */
                        instaImage.setTheme(body.includes('--dark') ? 'dark' : 'light');

                        /* Verified */
                        instaImage.setVerified(body.includes('--verified'));

                        /* Liked */
                        instaImage.setLiked(body.includes('--liked'));

                        /* Saved */
                        instaImage.setSaved(body.includes('--saved'));

                        /* Date */
                        instaImage.setPostDate(Indexer('others').date(instaSplit[2])?.value?.toUnix || Date.now());

                        /* Constroi a imagem */
                        envInfo.results.value = await instaImage.build();
                    break;

                    /* Canvafy - Advanced Ship */
                    case 'ship':
                        /* Base */
                        const shipImage = await new canvafy.Ship();

                        /* Avatar 1 e 2 */
                        shipImage.setAvatars(myAvatares[0], myAvatares[1]);

                        /* Background */
                        shipImage.setBackground(envInfo.parameters.stockValues.value.background.format, envInfo.parameters.stockValues.value.background.value);

                        /* Border */
                        shipImage.setBorder(envInfo.parameters.stockValues.value.ship.border);

                        /* Overlay */
                        shipImage.setOverlayOpacity(envInfo.parameters.stockValues.value.ship.overlayOpacity);

                        /* Ship level */
                        shipImage.setCustomNumber(Indexer('number').randnum(0, 100).value);

                        /* Constroi a imagem */
                        envInfo.results.value = await shipImage.build();
                    break;

                    /* Canvafy - Tweet Message */
                    case 'tweet':
                        /* Define o nome */
                        myUsername = Indexer('sql').get('personal', mentionedJidList[0], chatId);
                        myUsername = myUsername.value.name.text === 'default' ? pushname : myUsername.value.name.text;
                        myUsername = typeof myUsername === 'string' ? myUsername : pushname;
                        myUsername = typeof myUsername === 'string' ? myUsername : 'User';

                        /* Define os argumentos */
                        let tweetData = (body || 'Write | Bro | Ok!').replace(regexpRepl, '').split('|') || ['Write', 'Bro', 'Ok!'];
                        tweetData.push(['?', '?', '?']);
                        tweetData = tweetData.flat(5);

                        /* Base */
                        const tweetImage = await new canvafy.Tweet();

                        /* Avatar */
                        tweetImage.setAvatar(myAvatares[0]);

                        /* Comment */
                        tweetImage.setComment(tweetData[0]);

                        /* User */
                        tweetImage.setUser({ displayName: tweetData[1], username: tweetData[2] });

                        /* Theme */
                        tweetImage.setTheme(
                            /* eslint-disable-next-line no-nested-ternary */
                            (body.includes('--dark') ? 'dark'
                                : (body.includes('--light') ? 'light' : 'dim')
                            ),
                        );

                        /* Verified */
                        tweetImage.setVerified(body.includes('--verified'));

                        /* Constroi a imagem */
                        envInfo.results.value = await tweetImage.build();
                    break;

                    /* Canvacord */
                    case 'rainbow':
                    case 'grey':
                    case 'sepia':
                    case 'revert':
                    case 'trigger':
                    case 'blur':
                    case 'pixelate':
                    case 'sharpen':
                    case 'burn':
                    case 'circle':
                    case 'fuse':
                    case 'beijo':
                    case 'trash':
                    case 'spank':
                    case 'slap':
                    case 'lindo':
                    case 'facepalm':
                    case 'rip':
                    case 'lixo':
                    case 'hitler':
                    case 'joke':
                    case 'distracted':
                    case 'later':
                    case 'jail':
                    case 'bed':
                    case 'apagar':
                    case 'wanted':
                    case 'wasted':
                    case 'shit':
                        /* Redefine os nomes */
                        const overallname = {
                            grey: 'greyscale',
                            beijo: 'kiss',
                            lindo: 'beautiful',
                            lixo: 'trash',
                            joke: 'jokeOverHead',
                            later: 'affect',
                            apagar: 'delete',
                        };

                        /* Reajusta o nome */
                        memetic = overallname[memetic] || memetic;

                        /* Cria o meme e define na env */
                        envInfo.results.value = await canvacord.canvacord[memetic](myAvatares[0], myAvatares[1], myAvatares[2]);
                    break;

                    /* Canvacord, Texto sem Imagem */
                    case 'cmm':
                    case 'ohno':
                    case 'clyde':
                        /* Reajusta o nome */
                        memetic = memetic === 'cmm' ? 'changemymind' : memetic;

                        /* Cria o meme e define na env */
                        envInfo.results.value = await canvacord.canvacord[memetic]((body || 'Say something!').replace(regexpRepl, ''));
                    break;

                    /* TextPro */
                    case '3dg':
                    case 'light':
                    case '3db':
                    case '1917':
                    case 'thunder':
                    case 'water':
                    case 'bpink':
                        /* Cria o meme, converte em buffer e define na env */
                        makerImage = await mumaker.textpro(locateURL[memetic] || locateURL.water, (body || 'Say something!').replace(regexpRepl, ''));
                        makerImage = await Indexer('others').buffer(makerImage.image);
                        envInfo.results.value = makerImage.value;
                    break;

                    /* TextPro 2 argumentos */
                    case 'wolfb':
                    case 'wolfg':
                    case '80s':
                    case 'pornhub':
                        /* Define os argumentos */
                        let textSplitter = (body || 'Write | Bro!').replace(regexpRepl, '').split('|') || ['Write', 'Bro!'];
                        textSplitter.push(['?', '?']);
                        textSplitter = textSplitter.flat(5);

                        /* Cria o meme, converte em buffer e define na env */
                        makerImage = await mumaker.textpro(locateURL[memetic] || locateURL.wolfb, textSplitter.slice(0, 2));
                        makerImage = await Indexer('others').buffer(makerImage.image);
                        envInfo.results.value = makerImage.value;
                    break;

                    /* Canvacord com argumentos */
                    case 'ytcom':
                    case 'phcom':
                        /* Reajusta o comando */
                        const renameCommand = {
                            phcom: 'phub',
                            ytcom: 'youtube',
                        };

                        /* Define o nome */
                        myUsername = Indexer('sql').get('personal', mentionedJidList[0], chatId);
                        myUsername = myUsername.value.name.text === 'default' ? pushname : myUsername.value.name.text;
                        myUsername = typeof myUsername === 'string' ? myUsername : pushname;
                        myUsername = typeof myUsername === 'string' ? myUsername : 'User';

                        /* Cria o meme e define na env */
                        envInfo.results.value = await canvacord.canvacord[renameCommand[memetic] || 'phub']({
                            username: myUsername,
                            message: body.replace(regexpRepl, ''),
                            content: body.replace(regexpRepl, ''),
                            avatar: myAvatares[0],
                            image: myAvatares[0],
                            dark: body.includes('--dark'),
                        });
                    break;

                    /* PetPet */
                    case 'petpet':
                        /* Cria o meme e define na env */
                        envInfo.results.value = await petPetGif(myAvatares[0]);
                    break;

                    /* Canvacord, Texto com Imagem */
                    case 'opinion':
                        /* Cria o meme e define na env */
                        envInfo.results.value = await canvacord.canvacord[memetic](myAvatares[0], body || 'Say something!');
                    break;

                    /* Memes customizados */
                    case 'bandeira':
                    case 'bolsoframe':
                    case 'bolsolike':
                    case 'bolsonero':
                    case 'bolsotv':
                    case 'briggs':
                    case 'drake':
                    case 'edtv':
                    case 'jooj':
                    case 'medal':
                    case 'morrepraga':
                    case 'ojjo':
                    case 'paper':
                    case 'pepe':
                    case 'reverse':
                    case 'romero':
                    case 'shottv':
                    case 'spongebob':
                    case 'suckerberg':
                    case 'wolverine':
                        /* Cria o meme e define na env */
                        envInfo.results.value = await unikeMemes(myAvatares, memetic);
                    break;

                    /* Memes padrão */
                    default:
                        /* Cria o meme e define na env */
                        envInfo.results.value = await canvafy.Image.gay(myAvatares[0], myAvatares[1], myAvatares[2]);
                    break;
                }
            }
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
        [envInfo.exports.memes]: { value: memeMaker },
    },
    parameters: {
        location: { value: __filename },
    },
}, envFile, changeKey, dirname);
resetLocal();
