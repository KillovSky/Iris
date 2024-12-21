/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Lista de parceiros com informações detalhadas.
 * @type {Array<Object>}
 */
const partners = [
    {
        name: 'Akanano',
        description: 'Um streamer legal, faz diversas atividades como lives de jogos e edits, em sua maioria de animes e gachas, como Genshin Impact. Prefere ser chamado por Aka, Akashi ou Akanano.',
        url: 'https://m.twitch.tv/akanano0299',
        image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/2deccd13-6c5f-4c10-a68d-69782c5450c8-profile_image-150x150.png',
        added: '2024-12-14',
        type: 'Streamer',
    },
    {
        name: 'Baileys',
        description: 'Projeto que deu vida a Íris, já que é o kernel funcional dela para operar no WhatsApp.',
        url: 'https://github.com/WhiskeySockets/Baileys',
        image: 'https://avatars.githubusercontent.com/u/131354555?s=200&v=4',
        added: '2024-12-14',
        type: 'Project',
    },
    {
        name: 'xtgmpx',
        description: "Criador de contéudo que posta em sua maioria 'Tipografia de músicas Paraenses', mas também cria contéudo, como gameplays e edits de animes.",
        url: 'https://www.tiktok.com/@xtgmpx',
        image: 'https://p16-amd-va.tiktokcdn.com/tos-maliva-avt-0068/fc3999af8870e6e2bdf4e7b750bad4c8~tplv-tiktokx-cropcenter-q:1080:1080:q75.jpeg',
        added: '2024-12-14',
        type: 'Tiktoker',
    },
];

/**
 * Variável que controla o estado de exibição da lista de parceiros.
 * @type {boolean}
 */
let isListView = false;

/**
 * Objeto que armazena a coluna e a direção de ordenação atual.
 * @type {Object}
 * @property {string|null} column - Nome da coluna atualmente sendo ordenada.
 * @property {boolean} ascending - Se a ordenação é crescente.
 */
let currentSort = { column: null, ascending: true };

/**
 * Alterna o menu de navegação em dispositivos móveis.
 */
document.getElementById('hamburgerMenu').onclick = function changeView() {
    const menuList = document.getElementById('menuList');
    menuList.style.display = (menuList.style.display === 'flex') ? 'none' : 'flex';
};

/**
 * Ajusta a visibilidade do menu de navegação com base no tamanho da tela.
 */
window.addEventListener('resize', () => {
    const menuList = document.getElementById('menuList');
    menuList.style.display = (window.innerWidth > 768) ? 'flex' : 'none';
});

/**
 * Cria um cartão de exibição para um parceiro.
 * @param {Object} partner - O objeto do parceiro.
 * @param {number} index - Índice do parceiro na lista.
 * @returns {HTMLElement} - O elemento do cartão.
 */
function createCard(partner, index) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4');
    cardDiv.innerHTML = `
        <div class="card">
            <img src="${partner.image}" class="card-img-top" alt="${partner.name}">
            <div class="card-body text-center">
                <p class="name">${partner.name}</p>
                <p class="type">${partner.type}</p>
                <p class="added-date">Adicionado em: ${partner.added}</p>
                <p class="description-text" id="card-description-${index}">
                    ${partner.description.substring(0, 60)}...<br>
                    <button class="btn btn-link" onclick="toggleDescription(${index})" style="color: red;">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <a href="${partner.url}" class="btn btn-link" style="color: red;" target="_blank">
                        <i class="fa-solid fa-link"></i>
                    </a>
                </p>
            </div>
        </div>
    `;
    return cardDiv;
}

/**
 * Cria uma linha de lista para um parceiro.
 * @param {Object} partner - O objeto do parceiro.
 * @param {number} index - Índice do parceiro na lista.
 * @returns {HTMLElement} - O elemento da linha da lista.
 */
function createListRow(partner, index) {
    const listRow = document.createElement('tr');
    listRow.innerHTML = `
        <td>${index + 1}</td>
        <td><img src="${partner.image}" alt="${partner.name}" style="width: 50px;"></td>
        <td>${partner.name}</td>
        <td>
            <span class="description-text" id="list-description-${index}">
                ${partner.description.substring(0, 30)}...
                <button class="btn btn-link" onclick="toggleDescription(${index}, true)" style="color: red;">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </span>
        </td>
        <td>${partner.added}</td>
        <td>${partner.type} <a href="${partner.url}" class="btn btn-link" style="color: red;" target="_blank"><i class="fa-solid fa-link"></i></a></td>
    `;
    return listRow;
}

/**
 * Gera o conteúdo da lista de parceiros e exibe conforme o modo (cartão ou lista).
 */
function generateContent() {
    const cardsContainer = document.getElementById('cards');
    const listBody = document.getElementById('listBody');
    cardsContainer.innerHTML = '';
    listBody.innerHTML = '';

    partners.forEach((partner, index) => {
        const cardDiv = createCard(partner, index);
        cardsContainer.appendChild(cardDiv);

        const listRow = createListRow(partner, index);
        listBody.appendChild(listRow);
    });
}

/**
 * Alterna entre o modo de exibição de lista e cartão.
 */
function toggleListView() {
    isListView = !isListView;
    document.getElementById('cards').style.display = isListView ? 'none' : 'flex';
    document.getElementById('listView').style.display = isListView ? 'block' : 'none';
    this.innerHTML = isListView ? '<i class="fa-solid fa-id-card"></i> Modo Card' : '<i class="fa-solid fa-list"></i> Modo Lista';
    generateContent();
}
document.getElementById('toggleViewBtn').onclick = toggleListView;

/**
 * Redireciona para a URL de um parceiro.
 * @param {number} index - Índice do parceiro na lista.
 */
function urlGo(index) {
    const partner = partners[index];
    if (!partner?.url) {
        console.error(`URL não encontrada para o parceiro no índice ${index}`);
        return;
    }
    window.location.href = partner.url;
}

/**
 * Alterna entre exibir a descrição completa ou resumida de um parceiro.
 * @param {number} index - Índice do parceiro na lista.
 * @param {boolean} [isList=false] - Se a exibição é no modo lista.
 */
function toggleDescription(index, isList = false) {
    const descriptionId = isList ? `list-description-${index}` : `card-description-${index}`;
    const descriptionText = document.getElementById(descriptionId);
    const isExpanded = descriptionText.innerText.includes('...');
    const fullDescription = partners[index].description;
    const truncatedDescription = (isList
        ? fullDescription.substring(0, 30)
        : fullDescription.substring(0, 60)
    );

    descriptionText.innerHTML = isExpanded
        ? `${fullDescription}<br><button class="btn btn-link" onclick="toggleDescription(${index}, ${isList})" style="color: red;"><i class="fa-solid fa-minus"></i></button><button class="btn btn-link" onclick="urlGo(${index})" style="color: red;"><i class="fa-solid fa-link"></i></button>`
        : `${truncatedDescription}...<br><button class="btn btn-link" onclick="toggleDescription(${index}, ${isList})" style="color: red;"><i class="fa-solid fa-plus"></i></button><button class="btn btn-link" onclick="urlGo(${index})" style="color: red;"><i class="fa-solid fa-link"></i></button>`;
}

/**
 * Atualiza os ícones de ordenação de acordo com a coluna e a direção.
 * @param {string} column - A coluna que está sendo ordenada.
 * @param {boolean} ascending - Se a ordenação é crescente.
 */
function updateSortIcons(column, ascending) {
    document.querySelectorAll('.sort-icon i').forEach((icon) => {
        icon.classList.remove('fa-arrow-up', 'fa-arrow-down');
        icon.classList.add('fa-arrow-down');
    });

    const activeIcon = document.querySelector(`.sort-icon[data-sort="${column}"] i`);
    activeIcon.classList.remove('fa-arrow-down', 'fa-arrow-up');
    activeIcon.classList.add(ascending ? 'fa-arrow-up' : 'fa-arrow-down');
}

/**
 * Ordena a lista de parceiros pela coluna especificada.
 * @param {string} column - A coluna a ser ordenada.
 * @param {boolean} ascending - Se a ordenação é crescente.
 */
function sortByColumn(column, ascending) {
    const sortFunctions = {
        name: (a, b) => a.name.localeCompare(b.name),
        type: (a, b) => a.type.localeCompare(b.type),
        date: (a, b) => new Date(a.added) - new Date(b.added),
        number: (a, b) => partners.indexOf(a) - partners.indexOf(b),
    };

    partners.sort(
        (a, b) => (ascending ? sortFunctions[column](a, b) : sortFunctions[column](b, a)),
    );
    currentSort = { column, ascending };
    updateSortIcons(column, ascending);
    generateContent();
}
document.querySelectorAll('.sort-icon').forEach((button) => {
    button.addEventListener('click', function sortView() {
        const column = this.dataset.sort;
        const ascending = currentSort.column !== column || !currentSort.ascending;
        sortByColumn(column, ascending);
    });
});

/**
 * Exporte os dados dos parceiros para um arquivo JSON.
 */
document.getElementById('exportJSON').onclick = function exportJSON() {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(partners))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'partners.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

/* Inicia */
generateContent();
