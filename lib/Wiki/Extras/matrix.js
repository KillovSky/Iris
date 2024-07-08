/* eslint-disable no-undef */

/* Obtém a referência do elemento canvas pelo seu ID */
const canvas = document.getElementById('matrix');

/* Obtém o contexto 2D do canvas para desenho */
const ctx = canvas.getContext('2d');

/* Define a largura e altura do canvas como as dimensões do corpo da página */
const w = document.body.offsetWidth;
const h = document.body.offsetHeight;
canvas.width = w;
canvas.height = h;

/* Calcula o número de colunas com base na largura do canvas */
/* E define um array para armazenar as posições verticais das letras */
const cols = Math.floor(w / 20) + 1;
const ypos = Array(cols).fill(0);

/* Define a cor de preenchimento inicial como preto e preenche o canvas */
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, w, h);

/* Função para animar a matriz de caracteres */
function matrix() {
    /* Preenche o canvas com uma cor ligeiramente transparente para criar o efeito de rastro */
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, w, h);

    /* Define a cor verde para os caracteres e a fonte monoespaçada */
    ctx.fillStyle = '#0f0';
    ctx.font = '15pt monospace';

    /* Itera sobre cada coluna */
    ypos.forEach((y, ind) => {
        /* Gera um caractere aleatório ASCII */
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;

        /* Desenha o caractere na posição atual */
        ctx.fillText(text, x, y);

        /* Atualiza a posição vertical do caractere e reinicia se ultrapassar um limite */
        if (y > 100 + Math.random() * 10000) {
            ypos[ind] = 0;
        } else ypos[ind] = y + 20;
    });
}

/* Configura um intervalo para chamar a função matrix a cada 20 milissegundos */
setInterval(matrix, 20);
