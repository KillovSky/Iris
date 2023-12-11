/* eslint-disable no-alert */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/* Define o lugar a salvar o IP */
let ipaddr = 'Error';

/* Função para obter o IP (callback de uma solicitação JSONP) */
const getIP = (json) => {
    ipaddr = json.ip;
};

/* Função para adicionar o IP ao elemento com ID 'IPADDR' */
const AddIP = () => {
    document.getElementById('IPADDR').value = ipaddr;
};

/* Adiciona um listener de evento quando o conteúdo do DOM é carregado */
document.addEventListener('DOMContentLoaded', () => {
    /* Obtém a referência do elemento de entrada de senha pelo ID */
    const passwordInput = document.getElementById('password');

    /* Obtém a referência do elemento de esqueceu a senha pelo ID */
    const forgotPasswordButton = document.getElementById('forgotPassword');

    /* Obtém a referência do elemento de ícone do olho pelo ID */
    const eyeIcon = document.getElementById('eye-icon');

    /* Adiciona um listener de evento para alternar a visibilidade da senha */
    document.getElementById('togglePassword').addEventListener('click', () => {
        /* Verifica se a senha é visível */
        const isVisible = passwordInput.type === 'text';

        /* Altera o tipo de entrada da senha com base na visibilidade atual */
        passwordInput.type = isVisible ? 'password' : 'text';

        /* Altera a classe do ícone do olho com base na visibilidade atual */
        eyeIcon.className = isVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
    });

    /* Adiciona um listener de evento para o botão "Esqueceu sua senha" */
    forgotPasswordButton.addEventListener('click', () => {
        /* Exibe um alerta com as informações sobre senhas e nomes de usuários */
        alert('Se você não se lembra da senha que apareceu no seu terminal, você pode utilizar o nome de usuário e senha definidos no arquivo "config.json".\n\nSe não puder abrir o arquivo, você pode verificar eles digitando o comando abaixo no WhatsApp da sua Íris:\n\n/eval kill.sendMessage(chatId, { text: `Username: ${config.yourName.value} | Password: ${config.secretKey.value}` })');
    });
});
