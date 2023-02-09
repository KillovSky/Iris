/* eslint-disable max-len */

/* Requires */
const Canvas = require('canvas');
const Indexer = require('../index');
const Utils = require('./utils.json');

/*
    As Buffers e outras informações são muito grandes/recorrentes.
    Então nenhuma delas será mantidas no envInfo.
*/

/* Parâmetros da descrição */
const envInfo = {
    arguments: {
        bolsoDrake: {
            '1_MemerOne': 'Primeira imagem de geração dos memes.',
            '2_MemerTwo': 'Segunda imagem de geração dos memes.',
        },
        madeMeme: {
            '1_MemerOne': 'Primeira imagem de geração dos memes.',
            '2_TypeMemer': 'Tipo de geração de memes.',
        },
        madeMeme2: {
            '1_MemerOne': 'Primeira imagem de geração dos memes.',
            '2_MemerTwo': 'Segunda imagem de geração dos memes.',
            '3_TypeMemer': 'Tipo de geração de memes.',
        },
    },
    command: 'Memes',
    description: 'Realiza a criação de memes via Canvas.',
    example: 'None',
    explain: {},
    exports: {
        Ambient: 'Obtém as variáveis do sistema de memes.',
        bolsoDrake: 'Faz memes do Bolsonaro em formato Drake.',
        madeMeme: 'Sistema de memes com Blur, Bright e outros.',
        madeMeme2: 'Sistema de memes com múltiplas imagens e valores.',
    },
    files: {
        'index.js': 'Sistema de funções dos memes.',
        'utils.json': 'Configurações do sistema de memes.',
    },
    functions: {},
    madeBy: 'KillovSky & Pedro Batistop',
    parameters: {
        Utils,
    },
    requires: {
        './utils.json': 'Configurações do sistema de memes.',
        '../index': 'Tools, as funções dos sistemas.',
        canvas: 'Sistema de imagens para geração dos memes.',
    },
    usage: "[USO RESTRITO] - Utilizável somente pelo comando 'EXEC'.",
};

/* Função de descrição geral */
exports.Ambient = () => envInfo;

/* Faz um meme do Bolsonaro estilo 'Drake' */
exports.bolsoDrake = async (
    MemerOne = false,
    MemerTwo = false,
) => {
    /* Se as imagens enviadas forem válidas */
    if (MemerOne !== false && MemerTwo !== false) {
        /* Carrega a imagem base do meme */
        const baseMemer = await Canvas.loadImage(envInfo.parameters.Utils.BolsoDrake.Image);

        /* Cria um Canvas com a base */
        const baseCanvas = Canvas.createCanvas(baseMemer.width, baseMemer.height);

        /* Carrega a primeira imagem */
        const firstImage = await Canvas.loadImage(MemerOne);

        /* Carrega a segunda */
        const secondImage = await Canvas.loadImage(MemerTwo);

        /* Define a Width */
        const imageWidth = baseCanvas.width / 2;

        /* Adquire o contexto */
        const Context = baseCanvas.getContext('2d');

        /* Desenha a base */
        Context.drawImage(baseMemer, 0, 0, baseCanvas.width, baseCanvas.height);

        /* Desenha as duas imagens nos locais certos */
        Context.drawImage(firstImage, imageWidth, 0, imageWidth, imageWidth);
        Context.drawImage(secondImage, imageWidth, imageWidth, imageWidth, imageWidth);

        /* Retorna a imagem */
        return baseCanvas.toBuffer();
    }

    /* Retorna uma base64 padrão caso não retorne nada acima */
    return envInfo.parameters.Utils.Base64;
};

/* Faz memes que precisam de Blur */
exports.madeMeme = async (
    MemerOne = false,
    TypeMemer = false,
) => {
    /* Se as imagens enviadas forem válidas */
    if (MemerOne !== false && TypeMemer !== false) {
        /* Obtém a Buffer pela URL */
        const imageBuffer = await Indexer.Tools('others').getBuffer(MemerOne);

        /* Faz a edição via Sharp */
        const sharpImage = await Indexer.Tools('others').blurThis(imageBuffer, envInfo.parameters.Utils[TypeMemer].Blur, envInfo.parameters.Utils[TypeMemer].Bright);

        /* Carrega a imagem editada */
        const firstImage = await Canvas.loadImage(sharpImage);

        /* Carrega a imagem de fundo */
        const secondImage = await Canvas.loadImage(envInfo.parameters.Utils[TypeMemer].Image);

        /* Carrega a imagem do meme */
        const thirdImage = await Canvas.loadImage(MemerOne);

        /* Cria uma Canvas */
        const memeCanvas = Canvas.createCanvas(secondImage.width, secondImage.height);

        /* Adquire o contexto */
        let Context = memeCanvas.getContext('2d');

        /* Desenha o 'max' */
        Context = Indexer.Tools('others').drawScale(firstImage, envInfo.parameters.Utils[TypeMemer].Param1, envInfo.parameters.Utils[TypeMemer].Param2, envInfo.parameters.Utils[TypeMemer].Param3, envInfo.parameters.Utils[TypeMemer].Param4, Context, 'max') || Context;

        /* Desenha o 'min' */
        Context = Indexer.Tools('others').drawScale(thirdImage, envInfo.parameters.Utils[TypeMemer].Param1, envInfo.parameters.Utils[TypeMemer].Param2, envInfo.parameters.Utils[TypeMemer].Param3, envInfo.parameters.Utils[TypeMemer].Param4, Context, 'min') || Context;

        /* Desenha a base */
        Context.drawImage(secondImage, envInfo.parameters.Utils[TypeMemer].Param5, envInfo.parameters.Utils[TypeMemer].Param6, memeCanvas.width, memeCanvas.height);

        /* Retorna o Buffer */
        return memeCanvas.toBuffer();
    }

    /* Retorna uma base64 padrão caso não retorne nada acima */
    return envInfo.parameters.Utils.Base64;
};

/* Faz memes que precisam de imagem única */
exports.madeMeme2 = async (
    MemerOne = false,
    MemerTwo = false,
    TypeMemer = false,
) => {
    /* Se as imagens enviadas forem válidas */
    if (MemerOne !== false && TypeMemer !== false) {
        /* Caso seja algo que use base */
        let baseMemer = false;
        if (envInfo.parameters.Utils.madeMeme.includes(TypeMemer)) {
            /* Carrega a imagem base do meme */
            baseMemer = await Canvas.loadImage(envInfo.parameters.Utils[TypeMemer].Image);
        }

        /* Carrega a imagem enviada */
        const firstImage = await Canvas.loadImage(MemerOne);

        /* Caso a imagem base ainda seja false */
        if (baseMemer === false) {
            baseMemer = firstImage;
        }

        /* Cria um Canvas com a base */
        const baseCanvas = Canvas.createCanvas(baseMemer.width, baseMemer.height);

        /* Define a Width */
        const imageWidth = baseCanvas.width / 2;
        const memeWidth = firstImage.width / 2;

        /* Caso tenha uma 2° imagem */
        let secondImage;
        if (MemerTwo !== false) {
            /* Carrega a 2° imagem */
            secondImage = await Canvas.loadImage(MemerTwo);
        }

        /* Adquire o contexto */
        const Context = baseCanvas.getContext('2d');

        /* Determina a ordem de execução */
        /* Wolverine */
        if (TypeMemer === 'Wolve1') {
            /* Desenha primeiro a imagem */
            Context.drawImage(firstImage, envInfo.parameters.Utils[TypeMemer].Param1, envInfo.parameters.Utils[TypeMemer].Param2, envInfo.parameters.Utils[TypeMemer].Param3, envInfo.parameters.Utils[TypeMemer].Param4);

            /* Depois a base */
            Context.drawImage(baseMemer, envInfo.parameters.Utils[TypeMemer].Param5, envInfo.parameters.Utils[TypeMemer].Param6, baseCanvas.width, baseCanvas.height);

            /* Invert */
        } else if (TypeMemer === 'Invert1') {
            /* Adiciona a tradução de transformação da matriz */
            Context.translate(baseCanvas.width, envInfo.parameters.Utils[TypeMemer].Param1);

            /* Insere uma escala */
            Context.scale(envInfo.parameters.Utils[TypeMemer].Param2, envInfo.parameters.Utils[TypeMemer].Param3);

            /* E então insere a imagem */
            Context.drawImage(firstImage, envInfo.parameters.Utils[TypeMemer].Param4, envInfo.parameters.Utils[TypeMemer].Param5, baseCanvas.width, baseCanvas.height);

            /* Morre Praga */
        } else if (TypeMemer === 'Praga1') {
            /* Primeiro a base */
            Context.drawImage(baseMemer, envInfo.parameters.Utils[TypeMemer].Param5, envInfo.parameters.Utils[TypeMemer].Param6, baseCanvas.width, baseCanvas.height);

            /* Depois a imagem */
            Context.drawImage(firstImage, envInfo.parameters.Utils[TypeMemer].Param1, envInfo.parameters.Utils[TypeMemer].Param2, envInfo.parameters.Utils[TypeMemer].Param3, envInfo.parameters.Utils[TypeMemer].Param4);

            /* Drake */
        } else if (TypeMemer === 'Drake1') {
            /* Base */
            Context.drawImage(baseMemer, envInfo.parameters.Utils[TypeMemer].Param1, envInfo.parameters.Utils[TypeMemer].Param2, baseCanvas.width, baseCanvas.height);

            /* Primeira imagem */
            Context.drawImage(firstImage, imageWidth, envInfo.parameters.Utils[TypeMemer].Param3, imageWidth, imageWidth);

            /* Segunda imagem */
            Context.drawImage(secondImage, imageWidth, imageWidth, imageWidth, imageWidth);

            /* Ojjo */
        } else if (TypeMemer === 'Ojjo1') {
            /* Desenha primeiro a imagem */
            Context.drawImage(firstImage, imageWidth, envInfo.parameters.Utils[TypeMemer].Param1, baseCanvas.width, baseCanvas.height);

            /* Adiciona a tradução de transformação da matriz */
            Context.translate(baseCanvas.width, envInfo.parameters.Utils[TypeMemer].Param2);

            /* Insere uma escala */
            Context.scale(envInfo.parameters.Utils[TypeMemer].Param3, envInfo.parameters.Utils[TypeMemer].Param4);

            /* Desenha a imagem novamente */
            Context.drawImage(firstImage, imageWidth, envInfo.parameters.Utils[TypeMemer].Param5, baseCanvas.width, baseCanvas.height);

            /* Jooj */
        } else if (TypeMemer === 'Jooj1') {
            /* Adiciona a tradução de transformação da matriz */
            Context.translate(baseCanvas.width, envInfo.parameters.Utils[TypeMemer].Param1);

            /* Insere uma escala */
            Context.scale(envInfo.parameters.Utils[TypeMemer].Param2, envInfo.parameters.Utils[TypeMemer].Param3);

            /* Desenha a imagem */
            Context.drawImage(firstImage, envInfo.parameters.Utils[TypeMemer].Param4, envInfo.parameters.Utils[TypeMemer].Param5, baseCanvas.width, baseCanvas.height);

            /* Adiciona a tradução de transformação da matriz novamente */
            Context.translate(baseCanvas.width, envInfo.parameters.Utils[TypeMemer].Param6);

            /* Insere uma escala novamente */
            Context.scale(envInfo.parameters.Utils[TypeMemer].Param7, envInfo.parameters.Utils[TypeMemer].Param8);

            /* Desenha a imagem novamente */
            Context.drawImage(firstImage, envInfo.parameters.Utils[TypeMemer].Param9, envInfo.parameters.Utils[TypeMemer].Param10, memeWidth, firstImage.height, envInfo.parameters.Utils[TypeMemer].Param11, envInfo.parameters.Utils[TypeMemer].Param12, imageWidth, baseCanvas.height);

            /* Medal */
        } else if (TypeMemer === 'Medal1') {
            /* Desenha a base */
            Context.drawImage(baseMemer, envInfo.parameters.Utils[TypeMemer].Param1, envInfo.parameters.Utils[TypeMemer].Param2, (baseCanvas.width - 10), (baseCanvas.height - 10));

            /* Define o tamanho da linha */
            Context.lineWidth = envInfo.parameters.Utils[TypeMemer].Param3;

            /* Define o tamanho do contorno */
            Context.strokeRect(envInfo.parameters.Utils[TypeMemer].Param4, envInfo.parameters.Utils[TypeMemer].Param5, baseCanvas.width, baseCanvas.height);

            /* Desenha a primeira imagem */
            Context.drawImage(firstImage, envInfo.parameters.Utils[TypeMemer].Param6, envInfo.parameters.Utils[TypeMemer].Param7, envInfo.parameters.Utils[TypeMemer].Param8, envInfo.parameters.Utils[TypeMemer].Param9);

            /* Desenha a segunda */
            Context.drawImage(secondImage, envInfo.parameters.Utils[TypeMemer].Param10, envInfo.parameters.Utils[TypeMemer].Param11, envInfo.parameters.Utils[TypeMemer].Param12, envInfo.parameters.Utils[TypeMemer].Param13);

            /* Qualquer outro */
        } else {
            /* Primeiro a base */
            Context.drawImage(baseMemer, envInfo.parameters.Utils[TypeMemer].Param5, envInfo.parameters.Utils[TypeMemer].Param6, baseCanvas.width, baseCanvas.height);

            /* Depois a imagem */
            Context.drawImage(firstImage, envInfo.parameters.Utils[TypeMemer].Param1, envInfo.parameters.Utils[TypeMemer].Param2, envInfo.parameters.Utils[TypeMemer].Param3, envInfo.parameters.Utils[TypeMemer].Param4);
        }

        /* Retorna o meme */
        return baseCanvas.toBuffer();
    }

    /* Retorna uma base64 padrão caso não retorne nada acima */
    return envInfo.parameters.Utils.Base64;
};
