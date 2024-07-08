/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/* Declaração de variáveis globais */
let jsonData = {};
let backupData = {};
let currentFilePath = '';
let currentFileName = '';
let socket = {
    /* Função de placeholder para o socket.on */
    on() {
        console.log('[AVISO] Execução legada não pode executar recursos do socket.io, como retornar JSON para um programa (Íris) enquanto ela está em execução.');
    },
    /* Função de placeholder para o socket.emit */
    emit() {
        console.log('[AVISO] Execução legada não pode executar recursos do socket.io, como retornar JSON para um programa (Íris) enquanto ela está em execução.');
    },
};

try {
    /* Tenta inicializar o socket.io */
    socket = io();
} catch (err) {
    console.log('Parece que o site não consegue usar Node.js e Socket.IO. Não se preocupe, este site continuará funcionando corretamente.\nExecutando em modo legado...');
}

/* Função para trocar o ícone do modo noturno */
function darkModeIcon() {
    const { body } = document;
    const modeIcon = document.getElementById('modeIcon');
    const darkMode = body.classList.contains('dark-mode');
    modeIcon.classList.remove(darkMode ? 'bi-moon' : 'bi-sun');
    modeIcon.classList.add(darkMode ? 'bi-sun' : 'bi-moon');
    modeIcon.setAttribute('title', darkMode ? 'Sair do Modo Noturno (Dark Mode)' : 'Entrar no Modo Noturno (Dark Mode)');
}

/* Função para alternar entre os modos claro e escuro */
function toggleDarkMode() {
    const { body } = document;
    const container = document.querySelector('.container');
    const theme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    localStorage.setItem('theme', theme);
    darkModeIcon();
}

/* Event listener que é executado quando o conteúdo do DOM é carregado */
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        toggleDarkMode();
    }
    darkModeIcon();
    socket.emit('requestConfig', true);
});

/* Função para adicionar botões de adicionar e remover */
function addRemoveButtons(key, path, value) {
    const isObjectOrArray = Array.isArray(value) || typeof value === 'object';
    return `${isObjectOrArray ? `<button class="btn btn-link" onclick="addKey('${path}')" title="Adicionar"><i class="bi bi-plus-circle" aria-hidden="true"></i><span class="visually-hidden">Adicionar</span></button>` : ''}<button class="btn btn-link" onclick="removeKey('${path}')" title="Remover"><i class="bi bi-dash-circle" aria-hidden="true"></i><span class="visually-hidden">Remover</span></button>`;
}

/* Função para criar a interface de configurações a partir do JSON */
function createSettingsDiv(data, parentElement, currentPath = '') {
    if (data === null || typeof data !== 'object') {
        const path = currentPath || 'key';
        return `<input type="text" id="${path}" class="form-control" value=null oninput="updateJsonData(this, '${currentPath}', '${path}')" aria-label="${path}">`;
    }
    const itemsHtml = Object.entries(data).map(([key, value]) => {
        const path = currentPath ? `${currentPath}.${key}` : key;
        let itemHtml = '<div class="config-item">';
        itemHtml += `<label for="${path}">${key}:</label>`;
        itemHtml += addRemoveButtons(key, path, value);

        if (Array.isArray(value) || typeof value === 'object') {
            itemHtml += `<button class="expand-button" onclick="toggleNested(this, '${path}')" aria-expanded="false" aria-controls="${path}">➕</button>`;
            itemHtml += `<div class="nested" id="${path}">`;
            itemHtml += `${createSettingsDiv(value, '', path)}</div>`;
        } else {
            itemHtml += `<input type="text" id="${path}" class="form-control" value="${value}" oninput="updateJsonData(this, '${currentPath}', '${key}')" aria-label="${key}">`;
            itemHtml += `<i class="bi bi-bootstrap-reboot reset-button" onclick="resetCurrentField('${path}')" title="Reset"></i>`;
        }

        itemHtml += '</div>';
        return itemHtml;
    }).join('');

    return itemsHtml;
}

/* Função para renderizar o JSON na interface */
function renderJSON(json) {
    const settingsElement = document.getElementById('configurations');
    settingsElement.innerHTML = createSettingsDiv(json, settingsElement);
}

/* Função para remover uma chave do JSON */
function removeKey(path) {
    const keys = path.split('.');
    let obj = jsonData;
    for (let i = 0; i < keys.length - 1; i += 1) {
        obj = obj[keys[i]];
    }
    delete obj[keys[keys.length - 1]];
    renderJSON(jsonData);
}

/* Função para atualizar os dados do JSON */
function updateJsonData(input, path, key) {
    const fullPath = `${path}.${key}`;
    const keys = fullPath.split('.').filter((s) => s !== '');
    const currentLevel = jsonData;

    keys.reduce((obj, keyPart, index) => {
        const keyName = Object.keys(obj).includes(key) ? key : keyPart;

        if (index === keys.length - 1 || Object.keys(obj).includes(key)) {
            let valueToSet = input.value.trim();

            /* Trata valores numéricos */
            if (!isNaN(valueToSet) && valueToSet !== '') {
                valueToSet = parseFloat(valueToSet);
            }

            /* Trata valores booleanos */
            if (valueToSet === 'true' || valueToSet === 'false') {
                valueToSet = valueToSet === 'true';
            }

            /* Trata valor null */
            if (valueToSet === 'null') {
                valueToSet = null;
            }

            /* Atualiza o objeto com o valor convertido */
            obj[keyName] = valueToSet;
        } else if (!obj[keyName]) {
            obj[keyName] = {};
        }

        return obj[keyName];
    }, currentLevel);
}

/* Função para alternar exibição de elementos aninhados */
function toggleNested(button, path) {
    const nestedDiv = document.getElementById(path);
    const allNestedDivs = document.querySelectorAll('.nested');
    allNestedDivs.forEach((div) => {
        if (div.id !== path && div.classList.contains('active') && !div.contains(button)) {
            div.classList.remove('active');
            const correspondingButton = div.previousElementSibling.querySelector('.expand-button');
            if (correspondingButton) {
                correspondingButton.textContent = '➕';
            }
        }
    });
    nestedDiv.classList.toggle('active');
    button.textContent = nestedDiv.classList.contains('active') ? '➖' : '➕';
    button.setAttribute('aria-expanded', nestedDiv.classList.contains('active'));
}

/* Função para atualizar o JSON */
function updatedJSON(json) {
    document.getElementById('loadingSpinner').classList.add('active');
    renderJSON(json.data);
    jsonData = {
        ...json.data,
    };
    backupData = {
        ...json.data,
    };
    currentFilePath = json.location;
    currentFileName = json.name || 'config.json';
    document.getElementById('fileNameDisplay').textContent = json.name;
    document.getElementById('loadingSpinner').classList.remove('active');
}

/* Event listener para atualização do JSON via socket */
socket.on('jsonUpdated', (data) => {
    updatedJSON(data);
    alert('Arquivo modificado e salvo com sucesso!');
});

/* Função para abrir o seletor de arquivos */
function openFile() {
    document.getElementById('fileInput').click();
}

/* Função para carregar o arquivo selecionado */
function loadFile(event) {
    const file = event.target.files[0];
    if (file) {
        currentFileName = file.name || 'config.json';
        document.getElementById('fileNameDisplay').textContent = file.name;
        document.getElementById('loadingSpinner').classList.add('active');
        const reader = new FileReader();
        reader.onload = function readFiles(e) {
            const content = e.target.result;
            try {
                const json = JSON.parse(content);
                renderJSON(json);
                jsonData = {
                    ...json,
                };
                backupData = {
                    ...json,
                };
            } catch (err) {
                alert(`Erro ao carregar o arquivo JSON: ${err.message}`);
            }
        };
        document.getElementById('loadingSpinner').classList.remove('active');
        reader.readAsText(file);
    }
}

/* Função para resetar todas as alterações */
function resetAllChanges() {
    jsonData = {
        ...backupData,
    };
    renderJSON(jsonData);
}

/* Função para resetar um campo específico */
function resetCurrentField(path) {
    const input = document.getElementById(path);
    const keys = path.split('.');
    let value = backupData;

    for (let i = 0; i < keys.length; i += 1) {
        value = value[keys[i]];
    }

    input.value = value;
    updateJsonData(input, keys.slice(0, -1).join('.'), keys[keys.length - 1]);
}

/* Função para exportar o JSON */
function exportJSON() {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = currentFileName || 'config.json';
    link.click();
}

/* Event listener para dados iniciais via socket */
socket.on('initialData', (data) => {
    updatedJSON(data);
    document.getElementById('loadingSpinner').classList.remove('active');
});

/* Função para atualizar uma chave específica no JSON */
function updateKey(path, value) {
    const keys = path.split('.');
    let obj = jsonData;
    for (let i = 0; i < keys.length - 1; i += 1) {
        obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    renderJSON(jsonData);
}

/* Função para lidar com a escolha do usuário ao salvar */
function handleUserChoice(key, choice) {
    if (choice === '1' || choice === 1 || choice.toLowerCase() === 'delete') {
        removeKey(key);
    } else if (!isNaN(choice) && choice !== '') {
        updateKey(key, parseFloat(choice));
    } else if (choice.toLowerCase() === 'true' || choice.toLowerCase() === 'false') {
        updateKey(key, (choice.toLowerCase() === 'true'));
    } else if (choice.toLowerCase() === 'null') {
        updateKey(key, null);
    }
}

/* Função para salvar o JSON */
function onSave() {
    const emptyKeys = [];

    /* Função recursiva para verificar chaves vazias */
    function checkEmptyKeys(obj, path = '') {
        if (!obj || typeof obj !== 'object') return;

        Object.keys(obj).forEach((key) => {
            const fullPath = path ? `${path}.${key}` : key;
            if (obj[key] === '') emptyKeys.push(fullPath);
            else if (typeof obj[key] === 'object') checkEmptyKeys(obj[key], fullPath);
        });
    }

    checkEmptyKeys(jsonData);

    if (emptyKeys.length > 0) {
        const key = emptyKeys[0];
        const userChoice = prompt(`"${key}" está sem valor. Para remover, digite "delete" ou "1". Para adicionar um valor, digite um valor válido (null, false, true, string, number, etc)...`);
        handleUserChoice(key, userChoice);
    }

    document.getElementById('loadingSpinner').classList.add('active');
    try {
        socket.emit('updateJson', { location: currentFilePath, name: currentFileName, data: jsonData });
    } catch (err) {
        exportJSON();
    }
    document.getElementById('loadingSpinner').classList.remove('active');
}

/* Função para adicionar uma nova chave no JSON */
function addKey(path) {
    const keys = path.split('.');
    let obj = jsonData;

    /* Percorre o caminho nested */
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];

        /* Verifica se o nível atual existe, se não, cria um objeto vazio */
        if (!obj[key]) obj[key] = {};

        /* Move para o próximo nível */
        obj = obj[key];

        /* Se for o último nível, solicita o nome da nova chave e adiciona */
        if (i === keys.length - 1) {
            const newKey = prompt('Qual será o nome da nova key? Digite "ARRAY" (maiúsculo) se for adicionar valores em uma array.');
            const newValue = prompt('Qual será o valor da key? (Use {} ou [] para objetos)');
            try {
                if (newKey === 'ARRAY') {
                    if (!Array.isArray(obj)) return alert('Isso só pode ser usado em arrays. Crie uma array dando um nome à key e usando "[]" como valor, ou utilize em um array existente!');
                    obj.push(newValue);
                } else if (newKey) obj[newKey] = JSON.parse(newValue);
            } catch (err) {
                if (newKey) obj[newKey] = newValue;
            }
        }
    }

    renderJSON(jsonData);
    return jsonData;
}
