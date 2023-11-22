/* eslint-disable no-return-assign */
/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

/* Define variaveis globais */
let clickCounter = 0;
let isSnowing = false;
let snowingInterval = false;

/* Aguarda o evento de carregamento do DOM */
document.addEventListener('DOMContentLoaded', () => {
    /* Obtém elementos do DOM e define valores */
    const { body } = document;
    const navbar = document.getElementById('navbar');
    const darkModeButton = document.getElementById('dark-mode-switch');
    const modeIcon = document.getElementById('mode-icon');
    const navbarBrand = document.querySelector('.navbar-brand');

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
        const snowflakeitems = document.querySelectorAll('.snowflake');
        const contextOneOr = document.querySelectorAll('body > div.content-section.section1 > div:nth-child(1) > div > p');
        const contextTwoOr = document.querySelectorAll('body > div.content-section.section2 > div:nth-child(2) > div > div > p');
        const originalTextsOne = Array.from(contextOneOr).map((p) => p.innerText);
        const originalTextsTwo = Array.from(contextTwoOr).map((p) => p.innerText);
        const originalFooter = document.querySelector('body > div.footer').innerText;

        /* Inicia ou para a neve */
        snowflakesContainer.classList.toggle('animate-snowfall', !isSnowing);

        /* Itera sobre todas as divs .snowflake */
        document.querySelectorAll('.snowflake').forEach((sf) => {
            sf.style.display = snowflakeDisplay;
            sf.style.left = `${Math.floor(Math.random() * 101)}%`;
        });

        /* Inverte o estado do efeito de neve */
        isSnowing = !isSnowing;

        /* Se estiver iniciando */
        if (isSnowing && snowingInterval === false) {
            /* Cria um efeito glitch de posição a cada 10s */
            snowingInterval = setInterval(() => {
                /* Define a chance de glitch (5% de chance de 100%) */
                const chanceGlitch = Math.random() < 0.05;

                /* Se deu */
                if (chanceGlitch) {
                    /* Adiciona uma classe temporária para escurecer a tela */
                    document.body.classList.add('black-screen');

                    /* Realiza as tarefas enquanto estiver de tela preta */
                    setTimeout(() => {
                        /* Troca as imagens e textos */
                        document.querySelector('body > div.content-section.section1 > div.secImage1.order-md-last > img').src = './monika.jpg';
                        document.querySelector('body > div.content-section.section2 > div.secImage2 > img').src = './creepymonika.png';
                        document.querySelector('#navbar > img').src = './glitch-header.jpg';
                        document.querySelector('#navbar > a').innerText = 'JUST MONIKA.';
                        document.querySelectorAll('body > div.content-section.section1 > div:nth-child(1) > div > p').forEach((r) => r.innerText = 'JUST MONIKA '.repeat(10));
                        document.querySelectorAll('body > div.content-section.section2 > div:nth-child(2) > div > div > p').forEach((r) => r.innerText = 'GET OF OF MY HEAD '.repeat(3));
                        document.querySelector('body > div.footer').innerText = 'THERE IS NOT GOD '.repeat(4);

                        /* Troca todas as neves por imagens de glitch */
                        document.querySelectorAll('.snowflake').forEach((sf) => {
                            const glitchImage = document.createElement('img');
                            glitchImage.src = `./glitch${Math.floor(Math.random() * 5)}.png`;
                            glitchImage.style.width = '180px';
                            glitchImage.style.height = '180px';
                            glitchImage.classList.add('glitch-image');
                            glitchImage.style.left = `${Math.floor(Math.random() * 100) + 1}%`;

                            /* Substitui a div pela imagem */
                            sf.parentNode.replaceChild(glitchImage, sf);
                        });

                        /* Adiciona a classe glitch-effect e remove a tela preta */
                        document.body.classList.remove('black-screen');
                        document.body.classList.add('glitch-effect');
                    }, 1000);

                    /* Adiciona novamente a tela preta após 5 segundos */
                    setTimeout(() => {
                        document.body.classList.remove('glitch-effect');
                        document.body.classList.add('black-screen');

                        /* 2s depois reseta as informações */
                        setTimeout(() => {
                            /* Restaura os snowflakes */
                            let sforigin = 0;
                            document.querySelectorAll('.glitch-image').forEach((img) => {
                                const defaultDiv = snowflakeitems[sforigin];
                                defaultDiv.style.left = `${Math.floor(Math.random() * 101)}%`;
                                img.parentNode.replaceChild(defaultDiv, img);
                                sforigin += 1;
                            });

                            /* Restaura os <p> do primeiro box */
                            let divpone = 0;
                            document.querySelectorAll('body > div.content-section.section1 > div:nth-child(1) > div > p').forEach((pd) => {
                                pd.innerText = originalTextsOne[divpone];
                                divpone += 1;
                            });

                            /* Restaura os <p> do segundo box */
                            divpone = 0;
                            document.querySelectorAll('body > div.content-section.section2 > div:nth-child(2) > div > div > p').forEach((pd) => {
                                pd.innerText = originalTextsTwo[divpone];
                                divpone += 1;
                            });

                            /* Restaura as imagens e textos originais */
                            document.querySelector('body > div.content-section.section1 > div.secImage1.order-md-last > img').src = './london.png';
                            document.querySelector('body > div.content-section.section2 > div.secImage2 > img').src = './sticker.png';
                            document.querySelector('#navbar > img').src = './favicon.ico';
                            document.querySelector('#navbar > a').innerText = 'PROJETO ÍRIS';
                            document.querySelector('body > div.footer').innerText = originalFooter;

                            /* Remove as classes glitch-effect e black-screen */
                            document.body.classList.remove('black-screen');
                            document.body.classList.add('glitch-effect');

                            /* Remove o glitch 1s e blackscreen (de novo) após 1s */
                            setTimeout(() => {
                                document.body.classList.remove('black-screen', 'glitch-effect');
                            }, 1000);
                        }, 1000);
                    }, 5000);
                }
            }, 10000);
        } else if (snowingInterval !== false) {
            /* Se não, cancela o intervalo */
            clearInterval(snowingInterval);
        }
    });

    /* Função para tornar uma lista de seletores visiveis */
    function toggleVisibility(selector, show) {
        /* Obtem eles */
        const elementClasses = document.querySelectorAll(selector);

        /* Itera sobre todos */
        elementClasses.forEach((item) => {
            /* Se visivel, insere a classe show e tira o hide */
            if (show) {
                item.classList.remove('hidethisfromscreen');
                item.classList.add('show');

                /* Se invisivel, tira o show e insere hide */
            } else {
                item.classList.remove('show');
                item.classList.add('hidethisfromscreen');
            }
        });
    }

    /* Adiciona um listener para resetar o menu de idioma */
    document.getElementsByClassName('languageMenu')[0].addEventListener('click', () => {
        /* Deixa as opções padrões visiveis */
        toggleVisibility('#defaultlanguage', true);
        toggleVisibility('#hiddenlanguage', false);
        toggleVisibility('#lastlanguage', false);

        /* Zera o counter da página de idioma */
        clickCounter = 0;
    });

    /* Função que define quais idiomas serão exibidos na página */
    function selectLanguageMenu() {
        /* Padrão */
        if (clickCounter >= 4) {
            /* Deixa as opções padrões visiveis */
            toggleVisibility('#defaultlanguage', true);
            toggleVisibility('#hiddenlanguage', false);
            toggleVisibility('#lastlanguage', false);

            /* Zera o counter da página de idioma */
            clickCounter = 0;

            /* Parte 3 */
        } else if (clickCounter >= 2) {
            /* Aumenta o contador em um */
            clickCounter += 1;

            /* Exibe o ultimo menu antes de resetar */
            toggleVisibility('#defaultlanguage', false);
            toggleVisibility('#hiddenlanguage', false);
            toggleVisibility('#lastlanguage', true);

            /* Parte 2 */
        } else {
            /* Exibe o menu do meio e desativa os outros */
            toggleVisibility('#defaultlanguage', false);
            toggleVisibility('#hiddenlanguage', true);
            toggleVisibility('#lastlanguage', false);

            /* Aumenta o contador em um */
            clickCounter += 1;
        }

        /* Aumenta o contador em um */
        clickCounter += 1;
    }

    /* Adiciona um listener para o seletor de idiomas */
    document.getElementById('startDropdown').addEventListener('click', selectLanguageMenu);
});

/* Define o idioma */
let gTranslateSelect = false;
const gTranslateLanguages = 'ja,en,fr,es,id,ms,hi,de,it,ru,la';

/* Função de inicialização do Google Translate */
function initGoogleTranslate() {
    /* Configuração do Google Translate */
    new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: gTranslateLanguages,
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
    }, 'google_translate_element');

    /* Obtém a referência ao elemento de seleção de idioma */
    gTranslateSelect = document.getElementById('google_translate_element').querySelector('.goog-te-combo');
}

/* Função para disparar o evento de mudança */
function triggerChangeEvent(el) {
    if (el.fireEvent) {
        /* Para navegadores IE */
        el.fireEvent('onchange');
    } else {
        /* Para outros navegadores */
        const eventObject = document.createEvent('HTMLEvents');

        /* Dispara o evento de tradução */
        eventObject.initEvent('change', false, true);
        el.dispatchEvent(eventObject);
    }
}

/* Função para ao idioma original */
function stopTranslating() {
    /* Obtém o elemento que contém a tradução */
    const transpage = document.getElementsByClassName('goog-te-banner-frame')[0];

    /* Se ela existir, restaura o idioma */
    if (transpage) {
        /* Obtém a document da tradução */
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;

        /* Obtém todos os botões nela */
        const stopButtons = innerDoc.getElementsByTagName('button');

        /* Itera sobre os botões */
        for (let i = 0; i < stopButtons.length; i += 1) {
            /* Verifica se o ID do botão contém "close" */
            if (stopButtons[i].id.indexOf('close') >= 0) {
                /* Clica no link de fechar */
                closeLink[0].click();

                /* Encerra a função após fechar a barra de tradução */
                break;
            }
        }

        /* Se não, recarrega a página */
    } else window.location.reload();
}

/* Função para trocar o idioma */
function changeLanguage(languageCode) {
    /* Se for uma tradução válida */
    if (gTranslateSelect && languageCode !== 'pt') {
        /* Define o valor do idioma no seletor */
        gTranslateSelect.value = languageCode;

        /* Dispara o evento de mudança */
        triggerChangeEvent(gTranslateSelect);
    } else if (languageCode === 'pt' && gTranslateLanguages.split(',').includes(gTranslateSelect.value)) {
        /* Se for PT e tiver traduzido para outro idioma, restaura o original */
        stopTranslating();
    }
}
