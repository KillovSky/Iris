var fetch = require('node-fetch')

// Função que adquire o JSON da 4 DEVS
exports.generate = async () => {
	let data = await fetch('https://www.4devs.com.br/ferramentas_online.php', {
		method: 'POST',
		headers: {
			'authority': 'www.4devs.com.br',
			'content-type': 'application/x-www-form-urlencoded',
			'accept': '*/*',
			'accept-language': 'en-US,en;q=0.9,pt;q=0.8'
		},
		body: 'acao=gerar_pessoa&pontuacao=S&txt_qtde=1'
	}).then((dataGen) => dataGen.json())
	return data
}