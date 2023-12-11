/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/* Define uma função para executar no momento certo */
function createSocket() {
    /* Ajusta o placeholder */
    document.querySelector('#output').placeholder = "This terminal only accepts codes from Node.js/Iris, but you can run ANYTHING you want using a special function, see below...\n―――――――――――――――――――――\nGeneral Use: Indexer('bash').bash('Your Command').value;\n―――――――――――――――――――――\nExample: Indexer('bash').bash('ls -la').value;\n\nExample 2: Indexer('bash').bash('python -c \"command\"').value;\n\nExample 3: Indexer('bash').bash('sqlite3 \"database\" \"command\"').value;";

    /* Conecta o socket.io */
    const socket = io.connect();

    /* Armazena os últimos comandos para undo */
    let commandHistory = [];
    let commandIndex = 0;

    /* Adquire a input e a output */
    const input = document.querySelector('#input');
    const output = document.querySelector('#output');
    const button = document.querySelector('#submitvalue');

    /* Adiciona um listener para quando apertar o botão */
    button.addEventListener('click', (event) => {
        /* Evita comportamento padrão */
        event.preventDefault();

        /* Adquire o comando */
        const command = input.value.trim();

        /* Se for válido */
        if (command) {
            /* Se for clear */
            if (command === 'clear') {
                /* Limpa a página */
                [output.value, input.value] = ['', ''];

                /* Faz um console log de aviso */
                console.log('Input e Output limpas com sucesso!');
            } else {
                /* Adiciona o comando do User na output */
                output.value += `Admin@IrisBOT:~$ ${command}\n`;

                /* Emite o comando para o socket do node */
                socket.emit('command', command);

                /* Salva o comando e sua index */
                commandHistory.push(command);
                commandIndex = commandHistory.length - 1;

                /* Limpa a input */
                input.value = '';
            }
        }
    });

    /* Detecta se apertou uma tecla de evento */
    input.addEventListener('keydown', (event) => {
        /* Remove valores nulos e brancos do histórico de comandos */
        commandHistory = commandHistory.filter((d) => d !== '');

        /* Se for enter sem shift */
        if (event.key === 'Enter' && !event.shiftKey) {
            /* Previne a quebra de linha padrão */
            event.preventDefault();

            /* E envia o comando por meio de clique no botão */
            button.click();

            /* Se não */
        } else if (event.key === 'Enter') {
            /* Insere uma quebra de linha */
            input.value += '\n';

            /* Se for uma seta para cima */
        } else if (event.key === 'ArrowUp') {
            /* Impede ação padrão */
            event.preventDefault();

            /* Se tiver um index correto */
            if (commandIndex > 0) {
                /* Diminui ele para poder usando outros comandos */
                commandIndex -= 1;

                /* E envia o último comando executado */
                input.value = commandHistory[commandIndex];
            }

            /* Se for uma seta para baixo */
        } else if (event.key === 'ArrowDown') {
            /* Impede ação padrão */
            event.preventDefault();

            /* Verifica se o index é menor que a lista de comandos - 1 */
            if (commandIndex < commandHistory.length - 1) {
                /* Aumenta ele para poder usando outros comandos */
                commandIndex += 1;

                /* E envia outro comando executado */
                input.value = commandHistory[commandIndex];
            }
        }
    });

    /* Listener para resultados enviados do node */
    socket.on('result', (result) => {
        /* Printa o resultado com breakline */
        output.value += `${result}\n\n`;

        /* Faz a textarea rolar até o final */
        output.scrollTop = output.scrollHeight;
    });
}
