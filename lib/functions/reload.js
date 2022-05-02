const {
	color
} = require('./others')
const fs = require('fs')

/* Função que recarrega os arquivos em casos de mudanças em tempo real, não é recomendado para longos usos, apenas para quando você quer programar e testar em tempo real. */

exports.watchFile = (file) => {
	let Correct_File = Object.keys(require.cache).filter(k => k.includes(file) && !k.includes('node_modules'))
	Correct_File = Correct_File.length >= 1 ? Correct_File[0] : file
	try {
		fs.watchFile(Correct_File, () => {
			console.log(color('[EDIÇÃO]', 'crimson'), color(`Detectei que você fez edições, irei reiniciar!`, 'yellow'))
			delete require.cache[require.resolve(Correct_File)]
			console.log(color('[EDIÇÃO]', 'lime'), color(`Prontinho! Testa, Testa!`, 'yellow'))
		})
	} catch (error) {
		console.log(color('[WATCH]', 'red'), color(`Um erro foi detectado no update! -> ${error}`, 'yellow'))
	}
}