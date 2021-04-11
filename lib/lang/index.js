const config = require('../config/config.json')
const lang = config.lang

function mylang() {
	try {
		if (lang == 'pt') {
			return exports.pt = require('./pt')
		} else if (lang == 'en') {
			return exports.en = require('./en')
		} else if (lang == 'es') {
			return exports.es = require('./es')
		} else {
			console.log('Apenas "en", "pt" e "es" são suportados!')
			return process.exit(1);
		}
	} catch (error) {
		console.log('Faltam arquivos importantes na pasta "config/lang"!\nReinstale ou baixe os arquivos em falta!')
		console.log(error)
		return process.exit(1);
	}
}

module.exports = { mylang };