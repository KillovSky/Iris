/* eslint-disable max-len */
const Canvas = require('canvas');
const Canvacord = require('canvacord');
const Indexer = require('../index');
const Utils = require('./utils.json');

/* Parâmetros da descrição */
const envInfo = {
    arguments: {},
    command: 'Editor',
    description: 'Edita imagens utilizando o Canvas.',
    example: 'None',
    explain: {},
    exports: {
        Ambient: 'Obtém as variáveis do sistema de Edit.',
    },
    files: {
        'index.js': 'Sistema de funções do Edit.',
    },
    functions: {},
    madeBy: 'KillovSky & Pedro Batistop',
    parameters: {
        Utils,
    },
    requires: {
        './utils.json': 'Configurações do sistema de Edit.',
        '../index': 'Tools, as funções dos sistemas.',
        fs: 'Leitura do JSON.',
    },
    usage: "[USO RESTRITO] - Utilizável somente pelo comando 'EXEC'.",
};

/* Função de descrição geral */
exports.Ambient = () => envInfo;

exports.imgEditor = async (canvaimage, propX, propY, square) => {
    const frame = await Canvas.loadImage(canvaimage);
    propX = propX === 0 ? frame.width : propX;
    propY = propY === 0 ? frame.height : propY;
    const imgEditor = Canvas.createCanvas(Math.max(frame.width, frame.height) * propX / propY, Math.max(frame.width, frame.height));
    const ctx = imgEditor.getContext('2d');
    scaleToFill(frame, Math.max(frame.width, frame.height) * propX / propY, Math.max(frame.width, frame.height), 0, 0, ctx);
    if (square) {
        const squareFrame = await Canvas.loadImage(imgEditor.toBuffer());
        // let blurredSharpBG = await sharp(canvaimage).blur(5).modulate({
        //	brightness: 0.5
        // }).toBuffer();
        const blurredBG = await Canvas.loadImage(blurredSharpBG);
        const imgEditorSquare = Canvas.createCanvas(Math.max(frame.width, frame.height), Math.max(frame.width, frame.height));
        const ctx2 = imgEditorSquare.getContext('2d');
        scaleToFill(blurredBG, Math.max(frame.width, frame.height), Math.max(frame.width, frame.height), 0, 0, ctx2);
        scaleToFit(squareFrame, Math.max(frame.width, frame.height) * propX / propY, Math.max(frame.width, frame.height), (Math.max(frame.width, frame.height) - Math.max(frame.width, frame.height) * propX / propY) / 2, 0, ctx2);
        return imgEditorSquare.toBuffer();
    }
    return imgEditor.toBuffer();
};