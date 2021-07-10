/* ---------------------------------------------------------------------------------- *
* Para que você possa baixar videos do youtube e outros, é necessário baixar o chrome mais recente.
* Realize o download no Windows 10/8.1/8/7 usando "https://www.google.com.br/chrome/".
* Caso utilize o Linux, rode ambos os comandos abaixo e obviamente, como sudo/root.
* ---------------------------------------------------------------------------------
* wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
* sudo apt install ./google-chrome-stable_current_amd64.deb
* ---------------------------------------------------------------------------------
* Caso não queira usar chrome, adicione // ao "useChrome" sem as aspas, deve ficar assim, "//useChrome: true," 
* Mas saiba que alguns comandos NÃO FUNCIONARÃO se você fizer isso, geralmente os de vídeos.
* Se você trocar o "true" da headless para "false", poderá controlar e ver a Íris fazendo o trabalho.
* ----------------------------------------------------------------------------------
* Caso deseje mexer nos parâmetros de inicialização da Wa-Automate, veja isso > https://docs.openwa.dev/interfaces/api_model_config.configobject.html
* Aqui segue uma lista dos parâmetros que podem ser usados/apagados da chromiumArgs > https://peter.sh/experiments/chromium-command-line-switches
* Mexer nos parâmetros de inicialização do chromium pode gerar muito mais performance, desde que você não use incorretamente.
* ---------------------------------------------------------------------------------- */

const options = (start) => { 
	const startOptions = {
		authTimeout: 0,
		cacheEnabled: false,
		disableSpins: true,
		headless: true,
		killProcessOnBrowserClose: true,
		qrTimeout: 0,
		restartOnCrash: start,
		sessionId: 'Iris',
		throwErrorOnTosBlock: false,
		useChrome: true,
		userDataDir: "./logs/Chrome",
		chromiumArgs: [ '--aggressive-cache-discard', '--disable-application-cache', '--disable-cache', '--disable-offline-load-stale-cache', '--disable-setuid-sandbox', '--disk-cache-size=0', '--ignore-certificate-errors', '--no-sandbox' ]
	}
	if (startOptions.headless == false) startOptions.defaultViewport = null
	return startOptions
}

/* --------------------------------------------------------------------------------------
* Agora vem a parte das funções gerais da Íris, toda a "mágica" oculta.
* SEMPRE leia o resumo da função para "entender" um pouco dela.
* -------------------------------------------------------------------------------------- */

const fs = require('fs-extra')
const request = require('request')
const config = require('./config/Gerais/config.json')
const chalk = require('chalk')
const fetch = require('node-fetch')
const FormData = require('form-data')
const fromBuffer = require('file-type')
const ms = require('parse-ms')
const trans = require('@vitalets/google-translate-api')
const pollconfig = './lib/media/poll/'
const patents = require('./config/Gerais/patentes.json')
const { mylang } = require('./lang')

// Da a cor as mensagens do terminal
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) }

// Verifica se é uma URL
const isUrl = (url) => { return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)) }

// Função parecida com a de shell usada pra esperar certo tempo antes de rodar algo, usa sistema de milisegundos
const sleep = async (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }

// Upa imagens no telegra pra usar em comandos
const upload = async (buffData, type) => {
	return new Promise(async (resolve, reject) => {
		const { ext } = await fromBuffer(buffData)
		const filePath = './lib/media/tmp.' + ext
		await fs.writeFile(filePath, buffData, { encoding: 'base64' }, async (err) => {
			if (err) return reject(err)
			const fileData = fs.readFileSync(filePath)
			const form = new FormData()
			form.append('file', fileData, 'tmp.' + ext)
			await fetch('https://telegra.ph/upload', {
				method: 'POST',
				body: form
			}).then(res => res.json()).then(res => {
				if (res.error) return reject(res.error)
				resolve('https://telegra.ph' + res[0].src)
			}).then(() => fs.unlinkSync(filePath)).catch(err => reject(err))
		})
	})
}

// Verifica se ja usou comando
const usedCommandRecently = new Set()

// Caso tenha sido usado muitas vezes
const isFiltered = (from) => !!usedCommandRecently.has(from)

// Anti Flood
const addFilter = (from) => {
	usedCommandRecently.add(from)
	setTimeout(() => usedCommandRecently.delete(from), Number(config.Anti_Flood * 1000)) // * 1000 - Transforma o valor do tempo de aposta em segundos
}

// Tradutor
const translate = (text, lang) => { return new Promise(async (resolve, reject) => { trans(text, { client: 'gtx', to: lang }).then((res) => resolve(res.text)).catch((err) => reject(err)) }) }

// Verifica se é um número inteiro
const isInt = (number) => { return !isNaN(number) && (function(x) { return (x | 0) === x; })(parseFloat(number)) }

/* --------------------------------------------------------------------------------------
* Agora vem a parte das votações [Eleições] - A famosa urna eletrônica do Zap-Zap
* -------------------------------------------------------------------------------------- */

// Lê o arquivo JSON das votações
const readJsonFile = (filename) => {
	try {
		filename = pollconfig + filename
		return JSON.parse(fs.readFileSync(filename))
	} catch (e) { console.log(e) }
}

// Função extra que ajuda na de baixo
const isvoted = async (message, voterslistfile) => { let data = await readJsonFile(voterslistfile);return data['list'].includes(message.author) }

// Isso te permite votar, verificando se já votou no processo
const vote = async (kill, message, pollfile, voterslistfile) => {
	const isVotedP = await isvoted(message, voterslistfile)
	if (isVotedP) { await kill.reply(message.chatId, mylang(config.Language).polliv(), message.id, true);return }
	let data = await readJsonFile(pollfile)
	if (data['candis'] === 'null') { await kill.reply(message.chatId, mylang(config.Language).nocand(), message.id, true);return }
	let arr = data['candis']
	for (let i = 0; i < arr.length; i++) { if (message.body.includes((i + 1).toString())) { await addvote(kill, message, i, pollfile, voterslistfile);return } }
	await kill.reply(message.chatId, mylang(config.Language).fail(), message.id, true)
}

// Adiciona candidatos na lista
const add = async (kill, message, candi, pollfile, voterslistfile) => {
	let data = await readJsonFile(pollfile)
	if (data['candis'] === 'null') {
		let cd = { name: candi, votes: 0 }
		delete data['candis'];data['candis'] = [cd, ]
	} else {
		let cd = { name: candi, votes: 0 }
		data['candis'].push(cd)
	}
	await saveJsonFile(pollfile, data);await kill.reply(message.chatId, mylang(config.Language).addcand(candi), message.id, true)
}

// Salva os votos no arquivo JSON
const addvote = async (kill, message, num, pollfile, voterslistfile) => {
	let data = await readJsonFile(pollfile);let vts = data['candis'][num]['votes'];vts = vts + 1;delete data['candis'][num]['votes'];data['candis'][num]['votes'] = vts
	await saveJsonFile(pollfile, data)
	let arr = data['candis']
	let op;op = `📥 - Votou em "${data['candis'][num]['name']}"\n\n🗳️ - Em ${data['title']}\n`
	let ls = ''
	for (let i = 0; i < arr.length; i++) { let cd = arr[i]; ls = ls + ((i + 1).toString()) + ')' + cd['name'] + ' : [' + cd['votes'] + ' Votos] \n\n' }
	op = op + ls;op = op + mylang(config.Language).howvote();await kill.reply(message.chatId, op, message.id, true)
	let datavtrk = await readJsonFile(voterslistfile);datavtrk['list'].push(message.author);await saveJsonFile(voterslistfile, datavtrk)
}

// Adquire a votação
const get = async (kill, message, pollfile, voterslistfile) => {
	let data = await readJsonFile(pollfile);let op = ''
	if (data['candis'] == 'null') {
		op = mylang(config.Language).nocand()
	} else {
		op = `🗳️ - ${data['title']}\n\n`
		let ls = '';let arr = data['candis'];
		for (let i = 0; i < arr.length; i++) { let cd = arr[i];ls = ls + (i + 1).toString() + ') ' + cd['name'] + ' : [' + cd['votes'] + ' Votos]\n\n' }
		op = op + ls;op = op + mylang(config.Language).howvote()
	}
	await kill.reply(message.chatId, op, message.id, true)
}

// Cria uma votação
const resetp = async (kill, message, polltitle, pollfile, voterslistfile) => {
	let base = { title: polltitle, candis: 'null' }
	await saveJsonFile(pollfile, base);await kill.reply(message.chatId, mylang(config.Language).startvote(polltitle), message.id)
	let data = { list: ['Exemplo'] }
	await saveJsonFile(voterslistfile, data)
}

// Salva o arquivo JSON
const saveJsonFile = async (filename, object) => {
	filename = pollconfig + filename
	await fs.writeFileSync(filename, JSON.stringify(object))
}

/* --------------------------------------------------------------------------------------
* Agora vem a parte das funções de jogo
* -------------------------------------------------------------------------------------- */

// PEGA VALORES
const getValue = async (userId, _dir, data) => {
	let pos = null;let found = false
	Object.keys(_dir).forEach((i) => { if (_dir[i].id === userId) { pos = i;found = true } })
	if (found === false && pos === null) {
		const obj = { id: userId, xp: 0, level: 0, msg: 0, coin: 0 }
		_dir.push(obj)
		await fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(_dir))
		return 0
	} else { let finalVal = eval(`_dir[pos].${data}`);return finalVal }
}

// ADICIONA VALORES
const addValue = async (userId, amount, _dir, data) => {
	let position = null
	Object.keys(_dir).forEach((i) => { if (_dir[i].id === userId) { position = i } })
	if (position !== null) {
		eval(`_dir[position].${data} += amount`)
		await fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(_dir))
	} else {
		const xpVal = data == 'xp' ? amount : 0;const levelVal = data == 'level' ? amount : 0;const coinVal = data == 'coin' ? amount : 0
		const obj = { id: userId, xp: Number(xpVal), level: Number(levelVal), msg: 0, coin: Number(coinVal) }
		_dir.push(obj)
		await fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(_dir))
	}
}

// PEGA O RANK
const getRank = async (userId, _dir) => { let position = null;let found = false;_dir.sort((a, b) => (a.xp < b.xp) ? 1 : -1);Object.keys(_dir).forEach((i) => { if (_dir[i].id === userId) { position = i;found = true } });if (found === false && position === null) { const obj = { id: userId, xp: 0, level: 0, msg: 0, coin: 0 };_dir.push(obj);await fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(_dir));return 99 } else { return position } }

// ACIONA O GERADOR DE XP
const xpGain = new Set()

// VERIFICA SE GANHOU XP JÁ
const isWin = (userId) => { return !!xpGain.has(userId) }

// Função que espera certo tempo para dar XP
const wait = (userId) => {
	xpGain.add(userId)
	setTimeout(() => { return xpGain.delete(userId) }, Number(config.Wait_to_Win) * 1000)
}

// Adiciona limite ao usuário
const addLimit = async (userId, _dir, place) => {
	const obj = { id: userId, time: Date.now() }
	_dir.push(obj)
	await fs.writeFileSync(place, JSON.stringify(_dir))
}

// Adquire o limite do usuário
const getLimit = (userId, _dir) => {
	let position = null
	Object.keys(_dir).forEach((i) => { if (_dir[i].id === userId) { position = i } })
	if (position !== null) { return _dir[position].time }
}

const isLimit = (stealTime) => {
	const cd = Number(config.Wait_to_Play * 60000) // * 60000 - Transforma o valor do tempo de aposta em minutos
	if (stealTime !== undefined && cd - (Date.now() - stealTime) > 0) {
		const time = ms(cd - (Date.now() - stealTime)); return 1
	} else return 0
}

// As patentes
const getPatent = (nivel) => {
	var role = patents.a0
	if (nivel <= 3) { role = role } else if (nivel <= 5) { role = patents.a1 } else if (nivel <= 10) { role = patents.a2 } else if (nivel <= 15) { role = patents.a3 } else if (nivel <= 20) { role = patents.a4 } else if (nivel <= 25) { role = patents.a5 } else if (nivel <= 30) { role = patents.a6 } else if (nivel <= 35) { role = patents.a7 } else if (nivel <= 40) { role = patents.a8 } else if (nivel <= 45) { role = patents.a9 } else if (nivel <= 50) { role = patents.a10 } else if (nivel <= 55) { role = patents.a11 } else if (nivel <= 60) { role = patents.a12 } else if (nivel <= 65) { role = patents.a13 } else if (nivel <= 70) { role = patents.a14 } else if (nivel <= 75) { role = patents.a15 } else if (nivel <= 80) { role = patents.a16 } else if (nivel <= 85) { role = patents.a17 } else if (nivel <= 90) { role = patents.a18 } else if (nivel <= 95) { role = patents.a19 } else if (nivel <= 100) { role = patents.a20 } else if (nivel <= 200) { role = patents.a21 } else if (nivel <= 300) { role = patents.a22 } else if (nivel <= 400) { role = patents.a23 } else if (nivel <= 500) { role = patents.a24 } else if (nivel <= 550) { role = patents.a25 } else if (nivel <= 600) { role = patents.a26 } else if (nivel <= 700) { role = patents.a27 } else if (nivel <= 800) { role = patents.a28 } else if (nivel <= 900) { role = patents.a29 } else if (nivel <= 1000 || nivel >= 1000) { role = patents.a30 }
	return role
}

// Exporta os consts para a config.js
module.exports = { poll: { add, vote, get, resetp, readJsonFile, saveJsonFile }, gaming: { getValue, addValue, getRank, isWin, wait, addLimit, getLimit, isLimit, getPatent }, isFiltered, addFilter, color, sleep, isUrl, isInt, upload, translate, options }