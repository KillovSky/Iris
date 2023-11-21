/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

/* Aguarda o evento de carregamento do DOM */
document.addEventListener('DOMContentLoaded', () => {
    /* Obtém elementos do DOM e define valores */
    const { body } = document;
    const navbar = document.getElementById('navbar');
    const darkModeButton = document.getElementById('dark-mode-switch');
    const modeIcon = document.getElementById('mode-icon');
    const navbarBrand = document.querySelector('.navbar-brand');
    let isSnowing = false;

    /* Função para definir o tema com base na classe, remover e adicionar ícones */
    function setTheme(themeClass, removeIcon, addIcon) {
        body.className = themeClass;
        navbar.className = `navbar navbar-expand-lg navbar-dark ${themeClass === 'dark-mode' ? 'bg-dark' : 'bg-light'}`;
        modeIcon.classList.remove(removeIcon);
        modeIcon.classList.add(addIcon);
        localStorage.setItem('dark-mode', themeClass === 'dark-mode' ? 'enabled' : null);
    }

    /* Função para ativar o tema dark mode */
    function enableDarkMode() {
        setTheme('dark-mode', 'fa-moon', 'fa-sun');
    }

    /* Função para ativar o tema light mode */
    function enableLightMode() {
        setTheme('light-mode', 'fa-sun', 'fa-moon');
    }

    /* Função para alternar entre dark mode e light mode */
    function switchTheme() {
        body.classList.contains('dark-mode') ? enableLightMode() : enableDarkMode();
    }

    /* Adiciona um listener ao botão para alternar o tema */
    darkModeButton.addEventListener('click', switchTheme);

    /* Ativa o dark mode por padrão */
    enableDarkMode();

    /* Obtém a posição inicial da barra de navegação */
    const initialOffset = navbar.offsetTop;

    /* Função chamada ao rolar a página */
    function adjustNavBar() {
        const currentScrollPos = window.scrollY;
        navbar.style.position = currentScrollPos > initialOffset ? 'fixed' : 'relative';
        navbar.style.top = currentScrollPos > initialOffset ? '0' : 'auto';
        navbar.classList.toggle('initial', currentScrollPos <= initialOffset);
    }

    /* Ajusta a posição inicial da barra de navegação ao carregar a página */
    window.onscroll = adjustNavBar;
    window.onload = adjustNavBar;

    /* Efeito de neve ativado/desativado ao clicar na marca da barra de navegação */
    navbarBrand.addEventListener('click', () => {
        /* Define os elementos e valores para usar */
        const snowflakesContainer = document.querySelector('.snowflakes');
        const snowflakeDisplay = isSnowing ? 'none' : 'block';

        /* Inicia ou para a neve */
        snowflakesContainer.classList.toggle('animate-snowfall', !isSnowing);

        /* Itera sobre todas as divs .snowflake */
        document.querySelectorAll('.snowflake').forEach((sf) => {
            sf.style.display = snowflakeDisplay;
        });

        /* Inverte o estado do efeito de neve */
        isSnowing = !isSnowing;
    });
});
