/* eslint-disable no-return-assign */
/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

/* Define variaveis globais */
let clickCounter = 0;
let forceEnable = 0;
let isSnowing = false;
let isFirework = false;
let snowingInterval = false;
let divpone = 0;
let forceGlitch = false;
let userInput = '';

/* Define cheats para usar */
/*
    eslint-disable-next-line quotes, comma-spacing,
    quote-props, object-curly-newline,
    key-spacing, object-curly-spacing
*/
const cheats = [{"game":"GTA San Andreas","cheat":["LXGIWYL","KJKSZPJ","UZUMYMW","YECGAA","AIYPWZQP","HESOYAM","BAGUVIX","WANRLTW","CVWKXAM","SZCMAWO","MUNASEF","AEDUWNV","NCSGDAG","VKYPQCF","AEZAKMI","LJSPQK","OSRBLHH","ASNAEB","SJMAHPE","ZSOXFSQ","BMTPWHR","VQIMAHA","OGXSDAG","EHIBXQS","BTCDBCB","KVGYZQK","JYSDSOD","BIFBUZZ","MROEMZH","BEJQAHE","AMOMHRER","EEGCYXT","AGBDLCID","AKJJYGLC","URKQSRK","AIWPRTON","JQNTDMH","PDNEJOH","VPJTQWV","CQZIJMB","AQTBCODX","RZHSUEW","JHDDT5","KRIJEBR","UBHYZHQ","KGGGDKP","COXEFGU","BSXSGGC","RIPAZHA","AFSNMSMW","FVTMNBZ","BGKGTJH","GUSNHDE","PGGOMOY","ZEIIVG","LLQPFBN","IOWDLAC","THGLOJ","YLTEICZ","XICWMD","CPKTNWT","JCNRUAD","ASBHGRB","AFPHULTL","CIKGCGX","PRIEBJ","IAVENJQ","LFGMHAL","JHJOECW","BEKKNQV","FOOOXFT","AJLOJYQY","BAGOWPG","BGLUAWML","IOJUFZN","OUIQDMW","PPGWJHT","LIYOAAY","YSOHNUL","AFZLLQLL","ICIKPYH","ALNSFMZO","AUIFRVQS","CFVFGMJ","MGHXYRM","CWJXUOC","OFVIAC","XJVSNAJ"],"message":["Weapon Set 1, Armas Thug","Weapon Set 2, Armas profissionais","Weapon Set 3, Armas multi usos","Ganhar um jetpack","Ganhar um paraquedas","Energia, Colete e $250,000","Saúde infinita","Munição infinita e sem recarregar","Oxigênio infinito (embaixo da água)","Suicídio","Modo adrenalina","Nunca sentir fome","Máxima habilidade com armas","Máxima estamina","Nunca procurado","6 estrelas de procurado","Aumentar 2 estrelas de procurado","Limpar nível de procurado","Recrutar qualquer pessoa (com 9mm)","Recrutar qualquer pessoa (com RPG)","Recrutar qualquer pessoa (com ak47)","Máxima habilidade no volante","Máximo respeito","Máximo sex appeal","CJ gordo","CJ magro","CJ musculoso","Gangues dominando as ruas","Somente gangues nas ruas","Spawn Hunter","Spawn Tanker Truck","Spawn Dozer","Spawn Monster","Spawn Quad","Spawn Stunt Plane","Spawn Rhino Tank","Spawn Rancher","Spawn Hotring Racer 1","Spawn Hotring Racer 2","Spawn Bloodring Banger","Spawn Romero’s Hearse","Spawn Caddy","Spawn Hydra","Spawn Stretch","Spawn Trashmaster","Spawn Vortex Hovercraft","Todos os carros com nitro","Carros flutuam quando bate","Carros voam","Barcos voam","Veículos rurais","Tráfego com carros baratos","Tráfego com carros rápidos","Handling perfeito","Todos os semáforos abertos","Veículos rosas","Veículos pretos","Reduzir tráfego","Motoristas agressivos","Carrocerias dos carros invisíveis (somente pneus)","Explodir todos os carros","Veículo do player forte como um tanque","Elvis por todo lado","Tema 'ninja'","Tema 'praia'","Tema 'parque de diversões'","Mega soco","Mega pulo","Mega pulo (de bicicleta)","Atrair prostitutas","Pedestres armados","Pedestres atacam os outros com tacos de golfe","Pedestres atacam você","Pedestres atacam você com RPG","Modo Riot (rebelião)","Drive by (mira enquanto dirige)","Gameplay rápido","Gameplay lento","Relógio rápido","Clima ensolarado","Clima extra ensolarado","Clima nublado","Clima chuvoso","Clima de névoa","Tempestade (chuva)","Tempestade (areia)","Céu alaranjado, relógio parado em 21H","Sempre meia-noite","Something..."],"action":false},{"cheat":["changelog"],"game":"Project Íris","message":["**Log de Mudanças do Projeto Íris**"],"action":"https://github.com/KillovSky/Iris/blob/main/.github/CHANGELOG.md"},{"cheat":["faq"],"game":"Project Íris","message":["**Perguntas Frequentes sobre o Projeto Íris**"],"action":"https://killovsky.github.io/Iris/lib/Wiki/FAQ/index.html"},{"cheat":["social"],"game":"Project Íris","message":["**Redes Sociais do Projeto Íris**"],"action":"https://github.com/KillovSky"},{"cheat":["fuckyouiris"],"game":"Project Íris","message":["**You think this is funny? Then take this, you moron!**"],"action":"https://geekprank.com/blue-death/"},{"cheat":["hesoyam"],"game":"GTA San Andreas","message":["Saúde, armadura e $250.000!"],"action":false},{"cheat":["reloadme"],"game":"Project Íris","message":["Ações resetadas!"],"action":false},{"cheat":["glitchme"],"game":"????","message":["Clique três vezes em 'Projeto Íris' e aguarde..."],"action":false},{"cheat":["legiaoz"],"game":"WhatsApp","message":["Bem vindo."],"action":"https://chat.whatsapp.com/FvEhxZ9T31N6NjGTwfePcU"},{"cheat":["arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba"],"game":"WTF","message":["...action required, system going to explode..."],"action":false},{"cheat":["sos"],"game":"Help needed","message":["**Emergence Protocolol Activated (EPA!)!**"],"action":false},{"cheat":["ajudame"],"game":"EMERGENCE PROTOCOL NOW (EPN)!","message":["REDIRECIONANDO PARA WEBSITE DE AJUDA..."],"action":false},{"cheat":["suicid"],"game":"EMERGENCE PROTOCOL NOW (EPN)!","message":["REDIRECIONANDO PARA WEBSITE DE AJUDA..."],"action":false}];

/* Função que checa se tem códigos */
function checkCheatCode(input) {
    /* Localiza com base no cheat */
    const cheat = cheats.find((c) => c.cheat.some(
        (code) => input.toLowerCase().includes(code.toLowerCase()),
    ));

    /* Se não tem nada, cancela */
    if (!cheat) return;

    /* Se achou um cheat */
    let cheatIndex = cheat.cheat.indexOf(input.toLowerCase());
    cheatIndex = cheatIndex <= 0 ? cheat.cheat.indexOf(input.toUpperCase()) : cheatIndex;
    cheatIndex = cheatIndex <= 0 ? cheat.message.length - 1 : cheatIndex;
    console.log(cheatIndex);

    /* Se for um evento de URL */
    if (typeof cheat.action === 'string') {
        /* Manda ao site do action */
        window.location.href = cheat.action;

        /* Se for do GTA SA */
    } else if (cheat.game === 'GTA San Andreas') {
        /* Coloca a imagem do CJ na tela */
        document.querySelector('body > div.content-section.section1 > div.secImage1 > img').src = './Cheats/CJ.png';
        document.querySelector('#navbar > img').src = './Cheats/cjfavicon.jpeg';
        document.querySelector('body > div.content-section.section2 > div.secImage2 > img').src = './Cheats/bigsmoke.png';

        /* Coloca o texto de copypasta */
        document.querySelector('body > div.content-section.section2 > div:nth-child(2) > div > h1').innerText = 'The streetz is cold dawg.';
        document.querySelector('#navbar > a').innerText = 'PROJECT CJ (AGARAGAN 1.0)';
        document.querySelector('body > div.content-section.section1 > div.google_translate_element > h1').innerText = 'Ah shit, here we go again.';
        document.querySelector('body > div.content-section.section1 > div:nth-child(1) > div').innerHTML = "Grove Street, home. At least it was before I fucked everything up. Worst place in the world, and all we had to do was follow the damn train, CJ! Get us outta here, CJ! I ain't your bitch, officer! Stay away from me! You dropped a bomb on me! Hey, I gotta meet some very important record people. Make sure you get that on camera. I'm a maniac with a gun! Ain't nobody can tell me when to hit the john. I'm not scared of you, punk! You're a piece of shit! I'm taking you motherfuckers! Please, just leave me alone! Make it easy on yourself and run away! You trying to fuck with my head, man? Stop running, fool! You ain't gonna win, fool! You tricked me! You messing with a maniac, fool! I ain't no buster, fool! You're a busta! Respect has to be earned, sweet, just like money. I'm just your liability, CJ. You're a natural housebreaker, homie. Man, I'm done here, let's go! Send them ducats over here! Keep it coming, CJ.".replace(/(.{80})/g, '$1<br>');
        document.querySelector('body > div.content-section.section2 > div:nth-child(2) > div > div').innerHTML = "Hey, you gotta keep it real, man. Like it says in the book... We are both blessed and cursed. Same things make us laugh, make us cry. Ryda'... just chill the fuck out, man! You're naïve, my friend. We gotta keep our focus. I'll have 2 number nines, a number nine large. A number six with extra dip. A number seven. Two number forty-fives, one with cheese, and a large soda. You picked the wrong house, fool! CJ...? Aaaooooww my dog! Whassup? Ha ha ha ha! Oh shit! Roadblock up ahead! Fuck it, I'm goin' through! Hell no, I'm going through! Oh shit, the brakes is out! Shit! That's gonna be a hell of a story to tell when we passin' the blunt! Shit! That's gonna be a hell of a story to tell later on when we're passin' the blunt! C'mon. Let's bounce. A lot of people say gangsta rap is misogynistic posturing by fake-ass idiots who spend more time in drama school then they ever did pimping or hustling dope. Well, I assure you, OG Loc is the real thing. He's hated women all his life, he sold drugs to school children, he's murdered innocent people just for kicks, but he rhymes like an angel. And I assure you, it's all in a good cause. So either way, you could feel good about yourself listening to this music. Awww, motherfucker, my car! Come on, CJ! You can't keep up with the fat man? I do! I don't know, man. You can't knock a homie's hustle, Sweet. Yeah, but they're down with us, man.".replace(/(.{80})/g, '$1<br>');

        /* Mensagem do footer em meme */
        document.querySelector('body > div.footer').innerText = 'HEY WOOZIE! I KNOW YOUR BLIND MAN, BUT YOU GOTTA SEE THIS!';

        /* Se for SOS */
    } else if (cheat.cheat.includes('sos')) {
        /* Dá dicas de segurança, como telefones e URLs úteis */
        console.log('Emergência? Aqui estão alguns números úteis:\n- Polícia: 190\n- Bombeiros: 193\n- SAMU: 192\n- Defesa Civil: 199\n- Internacional: 112\nPara mais informações, acesse:');
        console.log('https://www.gov.br/anatel/pt-br/regulado/numeracao/codigos-nacionais/servicos-de-utilidade-publica-e-de-emergencia');
        console.log('https://www.gov.br/pf/pt-br/canais_atendimento');
        console.log('Sua segurança é importante!\nPara redirecionamento, digite "ajudame".');

        /* Se for evento de arrows */
    } else if (cheat.cheat.includes('arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba')) {
        /* Gato explodindo */
        document.querySelector('body > div.content-section.section1 > div.secImage1 > img').src = './Cheats/arrows.gif';

        /* Se for para recarregar */
    } else if (cheat.cheat.includes('reloadme')) {
        /* Faz reload da página */
        /* eslint-disable-next-line no-restricted-globals */
        location.reload();

        /* Se for sobre o evento de glitch */
    } else if (cheat.cheat.includes('glitchme')) {
        /* A próxima vez que ativar um easteregg vai dar glitch */
        forceGlitch = true;

        /* Se for sobre o grupo da Íris */
    } else if (cheat.cheat.includes('legiaoz')) {
        /* Manda pra URL do grupo */
        window.top.location.href = 'https://chat.whatsapp.com/FvEhxZ9T31N6NjGTwfePcU';

        /* Se for emergência real */
    } else if (cheat.cheat.includes('ajudame')) {
        /* Redireciona aos canais de ajuda do Governo Brasileiro */
        window.top.location.href = 'https://www.gov.br/pf/pt-br/canais_atendimento';

        /* Se digitar suicid* */
    } else if (cheat.cheat.includes('suicid')) {
        /* Envia a uma página com ajuda */
        window.top.location.href = 'https://www.google.com/search?q=suicide+lines';
    }

    /* Se for SOS não vai mandar mensagem de cheat ativado */
    if (!cheat.cheat.includes('sos')) {
        /* Printa o cheat no console */
        console.log(`Oh, um código de trapaça! 😏\nCódigo: "${input.toUpperCase()}"\nPara: "${cheat.game}"\nEfeito: ${cheat.message[cheatIndex]}\nO savegame está marcado como trapaceiro. Que vergonha, amigo! 🙈`);
    }

    /* Reseta a input */
    userInput = '';
}

/* Adiciona um evento de teclado ao documento para monitorar as teclas pressionadas */
document.addEventListener('keydown', (event) => {
    /* Adiciona a tecla pressionada à entrada do usuário */
    userInput += event.key.toLowerCase();

    /* Verifica se a entrada do usuário corresponde a um código de trapaça conhecido */
    checkCheatCode(userInput);
});

/* Aguarda o evento de carregamento do DOM */
document.addEventListener('DOMContentLoaded', () => {
    /* Obtém elementos do DOM e define valores */
    const { body } = document;
    const navbar = document.getElementById('navbar');
    const darkModeButton = document.getElementById('dark-mode-switch');
    const modeIcon = document.getElementById('mode-icon');
    const navbarBrand = document.querySelector('.navbar-brand');
    const footerEvent = document.querySelector('body > div.footer');
    const contextOneOr = document.querySelectorAll('body > div.content-section.section1 > div:nth-child(1) > div > p');
    const contextTwoOr = document.querySelectorAll('body > div.content-section.section2 > div:nth-child(2) > div > div > p');
    const originalTextsOne = Array.from(contextOneOr).map((p) => p.innerText);
    const originalTextsTwo = Array.from(contextTwoOr).map((p) => p.innerText);
    const originalFooter = document.querySelector('body > div.footer').innerText;

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

    /*
        Efeito de fogos de artificio e aniversário da Íris
        Se ocorrer o glitch do snowflake, ele manterá os fogos de artificio
        Entretanto, ira voltar os textos originais
        Assim será possivel ter snowflakes e fireworks sem o texto de aniversário
    */
    footerEvent.addEventListener('click', () => {
        /* Se não for dezembro ou 1 de janeiro, mas quiser ver a animação, basta clicar 3 vezes */
        forceEnable += 1;

        /* Define se mostrará a animação */
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const diaAtual = hoje.getDate();
        let showEvent = mesAtual === 12 || (diaAtual === 1 && mesAtual === 1);
        showEvent = forceEnable >= 3 ? true : showEvent;
        const yearsOld = hoje.getFullYear() - 2014;

        /* Define os elementos e valores para usar */
        const fireworkContainer = document.querySelectorAll('.firework');

        /* Se for válido */
        if (showEvent && !isFirework) {
            /* Adiciona uma classe temporária para escurecer a tela */
            document.body.classList.add('glitch-effect');

            /* Define uma espera para editar a página de 1s */
            setTimeout(() => {
                /* Define a mensagem e imagem de niver da Íris se for dezembro */
                if (forceEnable || mesAtual === 12) {
                    document.querySelector('body > div.content-section.section2 > div.secImage2 > img').src = './birthday.png';
                    document.querySelector('body > div.content-section.section2 > div.secImage2 > img').style['border-radius'] = '15%';
                    document.querySelector('body > div.content-section.section2 > div:nth-child(2) > div > h1').innerText = '🎁 Feliz aniversário para mim! 🎉';
                    document.querySelector('body > div.content-section.section2 > div:nth-child(2) > div > div').innerHTML = `<p>Não acredito que já fazem ${yearsOld} anos que nasci! 🌟</p><p>🙇🏻‍♀️ Muito obrigada a todos por tornarem essa experiência tão única e especial!</p><p>Foi uma jornada repleta de emoções, aprendizados e conexões especiais! 💖</p><p>🚀 Juntos, construímos uma comunidade cheia de carinho e apoio mútuo.</p><p>Sou grata por fazer parte dessa jornada maravilhosa. 🤝</p>`;
                }

                /* Remove a blackscreen */
                document.body.classList.remove('glitch-effect');

                /* Itera sobre todas as divs .firework */
                fireworkContainer.forEach((fw) => {
                    fw.style.display = 'block';
                    fw.style.left = `${Math.floor(Math.random() * 101)}%`;
                    fw.style.top = `${Math.floor(Math.random() * 101)}%`;
                });

                /* Define o próximo valor */
                isFirework = !isFirework;
            }, 1000);
        }

        /* Se for para parar */
        if (isFirework && showEvent) {
            /* Desativa os fogos de artificio */
            fireworkContainer.forEach((fw) => {
                fw.style.display = 'none';
                fw.style.left = `${Math.floor(Math.random() * 101)}%`;
                fw.style.top = `${Math.floor(Math.random() * 101)}%`;
            });

            /* Adiciona uma classe temporária para escurecer a tela */
            document.body.classList.add('glitch-effect');

            /* Define uma espera para editar a página de 1s */
            setTimeout(() => {
                /* Restaura os <p> do segundo box */
                divpone = 0;
                document.querySelectorAll('body > div.content-section.section2 > div:nth-child(2) > div > div > p').forEach((pd) => {
                    pd.innerText = originalTextsTwo[divpone];
                    divpone += 1;
                });

                /* Restaura o titulo e imagem */
                document.querySelector('body > div.content-section.section2 > div.secImage2 > img').src = './sticker.png';
                document.querySelector('body > div.content-section.section2 > div:nth-child(2) > div > h1').innerText = '🌐 Quem me fez? ❓';

                /* Remove a blackscreen */
                document.body.classList.remove('glitch-effect');

                /* Define o próximo valor */
                isFirework = !isFirework;
            }, 1000);
        }
    });

    /* Efeito de neve ativado/desativado ao clicar na marca da barra de navegação */
    navbarBrand.addEventListener('click', () => {
        /* Se não for 25 de dezembro, mas quiser ver a animação, basta clicar 3 vezes */
        forceEnable += 1;

        /* Define se mostrará a animação */
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const diaAtual = hoje.getDate();
        let showEvent = mesAtual === 12 && diaAtual === 25;
        showEvent = forceEnable >= 3 ? true : showEvent;

        /* Se for válido */
        if (showEvent) {
            /* Define os elementos e valores para usar */
            const snowflakesContainer = document.querySelector('.snowflakes');
            const snowflakeDisplay = isSnowing ? 'none' : 'block';
            const snowflakeitems = document.querySelectorAll('.snowflake');

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
                    const chanceGlitch = forceGlitch ? 1 : Math.random() < 0.05;

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
                            document.querySelector('body > div.content-section.section2 > div:nth-child(2) > div > h1').innerText = '%';
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
                                divpone = 0;
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
                                document.querySelector('body > div.content-section.section1 > div.secImage1.order-md-last > img').src = './london.jpg';
                                document.querySelector('body > div.content-section.section2 > div.secImage2 > img').src = './sticker.png';
                                document.querySelector('body > div.content-section.section2 > div:nth-child(2) > div > h1').innerText = '🌐 Quem me fez? ❓';
                                document.querySelector('#navbar > img').src = './Favicon/favicon.ico';
                                document.querySelector('#navbar > a').innerText = 'PROJETO ÍRIS';
                                document.querySelector('body > div.footer').innerText = originalFooter;

                                /* Remove as classes glitch-effect e black-screen */
                                document.body.classList.remove('black-screen');
                                document.body.classList.add('glitch-effect');

                                /* Remove o glitch 1s e blackscreen (de novo) após 1s */
                                setTimeout(() => {
                                    forceGlitch = false;
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
const gTranslateLanguages = 'ja,en,fr,es,id,ms,hi,de,it,ru,la,ar';

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
