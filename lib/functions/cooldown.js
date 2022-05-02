const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'))

// Cria uma object com o "Set"
var usedCommandRecently = new Set()

// Verifica se a object tem a pessoa
exports.isFiltered = (from) => usedCommandRecently.has(from)

// Anti Flood
exports.addFilter = (from) => {
	usedCommandRecently.add(from)
	setTimeout(() => usedCommandRecently.delete(from), Number(config.Anti_Flood * 1000)) // * 1000 - Transforma o valor do tempo de aposta em segundos
}