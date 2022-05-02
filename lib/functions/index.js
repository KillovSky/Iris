function tools(fun) {
	try {
		return exports[fun] = require(`./${fun}`)
	} catch (error) {
		console.log('Tool não encontrada ou erro, detalhes abaixo!\n\n', error)
	}
}

module.exports = {
	tools
}