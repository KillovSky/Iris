const usedCommandRecently = new Set() // Isso é o anti flood

const isFiltered = (from) => !!usedCommandRecently.has(from)

const addFilter = (from) => {
    usedCommandRecently.add(from)
    setTimeout(() => usedCommandRecently.delete(from), 5000) // Espera 5 segundos antes de rodar outro comando, é util para evitar um belo banimento do WhatsApp, 5000 = 5 segundos, aumente ou diminua se quiser
}

module.exports = {
    isFiltered,
    addFilter
}