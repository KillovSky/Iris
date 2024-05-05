/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/* Define se mostra ou oculta a navbar */
function toggleNavVisibility() {
    /* Primeiro obtém os elementos pela ID */
    const navbar = document.getElementById('navbar');
    const icon = document.getElementById('iconi');

    /* Verifica se a barra de navegação está visível */
    const isVisible = !navbar.hasAttribute('hidden');

    /* Altera a visibilidade da barra de navegação */
    navbar.toggleAttribute('hidden', isVisible);

    /* Altera o ícone com base na visibilidade atual */
    icon.classList.toggle('fa-list', isVisible);
    icon.classList.toggle('fa-eye-slash', !isVisible);
}

/* Define o lugar a salvar o IP */
let ipaddr = 'Error';

/* Função para obter o IP (callback de uma solicitação JSONP) */
const getIP = (json) => {
    ipaddr = json.ip;
};

/* Função para adicionar o IP ao elemento com ID 'IPADDR' */
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('IPADDR').value = ipaddr;
    document.getElementById('ipForm').submit();
});
