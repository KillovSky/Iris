/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/* Função para converter códigos de cor ANSI para HTML */
function convertAnsiToHtml(text) {
    /* Expressão regular para detectar códigos ANSI */
    // eslint-disable-next-line no-control-regex
    const ansiRegex = /\x1b\[(\d+)m/g;

    /* Mapeamento de códigos ANSI para estilos CSS, excluindo o preto (se não fica invisivel) */
    const ansiStyles = {
        30: 'color: #EBECF0;', // Bright gray
        31: 'color: #FF5555;', // Bright red
        32: 'color: #50FA7B;', // Bright green
        33: 'color: #F1FA8C;', // Bright yellow
        34: 'color: #BD93F9;', // Bright purple
        35: 'color: #FF79C6;', // Bright magent
        36: 'color: #8BE9FD;', // Bright cyan
        37: 'color: #FFFFFF;', // White
        90: 'color: #EBECF0;', // Bright gray
        40: 'background-color: #000000;', // Pure black
        41: 'background-color: #660000;', // Dark red
        42: 'background-color: #003300;', // Dark green
        43: 'background-color: #666600;', // Dark yellow (olive)
        44: 'background-color: #000066;', // Dark blue
        45: 'background-color: #660066;', // Dark magenta
        46: 'background-color: #006666;', // Dark cyan
        47: 'background-color: #4D4D4D;', // Dark gray
    };

    /* Define o HTML das cores */
    let html = '';

    /* Define as correspondências de RegExp */
    let match = null;

    /* Define o último check */
    let lastIndex = 0;

    /* Define quais styles usou */
    const styleStack = [];

    /* Loop para processar todas as correspondências de códigos ANSI */
    // eslint-disable-next-line no-cond-assign
    while ((match = ansiRegex.exec(text)) !== null) {
        /* Adiciona o texto anterior ao código ANSI ao HTML */
        html += text.substring(lastIndex, match.index);

        /* Atualiza o último índice processado */
        lastIndex = ansiRegex.lastIndex;

        /* Estilo correspondente ao código ANSI */
        let style = ansiStyles[match[1]];

        /* Substitui a cor preta por uma cor azul mediana, assim o texto não parecerá invisivel */
        if (match[1] === '30') {
            style = 'color: #6272A4;';
        }

        /* Se houver style */
        if (style) {
            /* Adiciona o estilo à pilha e aplica ao HTML */
            styleStack.push(style);
            html += `<span style="${styleStack.join(' ')}">`;

            /* Se já chegou no ANSI zero */
        } else if (match[1] === '0') {
            /* Fecha todas as tags de estilo quando encontra o código ANSI '0' */
            while (styleStack.length) {
                html += '</span>';
                styleStack.pop();
            }
        }
    }

    /* Adiciona o texto restante após o último código ANSI */
    html += text.substring(lastIndex);

    /* Fecha todas as tags de style restantes */
    while (styleStack.length) {
        html += '</span>';
        styleStack.pop();
    }

    /* Retorna o HTML de cores */
    return html;
}

/* Define a função do socket */
function createSocket() {
    /* Cria a execução */
    const socket = io();

    /* Obtém o elemento do terminal */
    const output = document.getElementById('output');

    /* Quando receber logs */
    socket.on('log', (logMessage) => {
        /* Define o texto dele em conjunto com o que já existe */
        output.innerHTML += `${convertAnsiToHtml(logMessage)}\n`;

        /* E leva para o final do HTML */
        output.scrollTop = output.scrollHeight;
    });
}
