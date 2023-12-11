/* eslint-disable no-undef */

/* Função para gerar um número aleatório dentro de um intervalo especificado */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Função para mover a imagem do hacker para uma posição aleatória na tela */
function moveHackerImage() {
    /* Obtém a referência da imagem do hacker pelo seu ID */
    const hackerImage = document.getElementById('hacker-image');

    /* Obtém as dimensões do corpo da página */
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;

    /* Gera posições aleatórias dentro dos limites do corpo da página */
    const randomLeft = getRandomNumber(0, bodyWidth - hackerImage.width);
    const randomTop = getRandomNumber(0, bodyHeight - hackerImage.height);

    /* Define a posição da imagem do hacker com base nos valores aleatórios gerados */
    hackerImage.style.left = `${randomLeft}px`;
    hackerImage.style.top = `${randomTop}px`;

    /* Define um timeout para chamar recursivamente a função após 1000 milissegundos (1 segundo) */
    setTimeout(moveHackerImage, 1000);
}

/* Inicia o movimento da imagem hacker após 1 segundo */
setTimeout(() => {
    moveHackerImage();
}, 1000);
