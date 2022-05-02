const chalk = require('chalk')
const crypto = require('crypto')
const shell = require('shelljs')
const notifier = require('node-notifier')
const moment = require('moment-timezone')
const fs = require('fs')
const removeAccents = require('remove-accents')
const wordwrap = require('word-wrapper')
const langTrans = require('@imlinhanchao/google-translate-api')
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'))
const {
	tools
} = require('./index')

// Checa se a cor usada é um hex
exports.isHex = (hex) => {
	let All_Color = JSON.parse(fs.readFileSync('./lib/config/Gerais/colors.json'))
	let All_Hex = Object.keys(All_Color).map(h => h.hex)
	if (All_Hex.includes(hex) || /((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})/gim.test(hex)) {
		return {
			"found": true,
			"color": hex
		}
	} else {
		return {
			"found": false,
			"color": tools('others').randVal(All_Hex)
		}
	}
}

// Adquire os arquivos de uma pasta organizados do mais antigo ao mais novo
exports.mostRecent = (dir, filter) => {
	const files = fs.readdirSync(dir)
	return files.map(fileName => ({
		name: fileName,
		time: fs.statSync(`${dir}/${fileName}`).mtime.getTime()
	})).sort((a, b) => a.time - b.time).map(file => file.name).slice(0, filter)
}

// Converte exponenciais em números inteiros
exports.toLargeNumber = (nbr) => {
	let Formated_Number = nbr.slice(nbr.indexOf('e')+1) < 0 ? '' : nbr.slice(0, nbr.indexOf('e'))
	for (let i = 0; i < Math.abs(nbr.slice(nbr.indexOf('e')+1)); i++) {
		Formated_Number += 0
	}
	Formated_Number = nbr.slice(nbr.indexOf('e')+1) < 0 ? Formated_Number += nbr.slice(0, nbr.indexOf('e')) : Formated_Number
	return Formated_Number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")
}

// Converte o tempo dos jogos e sistemas da Íris em formatos 'certos'
exports.getRemainTime = (mode, timing) => Math.abs((Number(config.Wait_to_Play * 60000) - (Date.now() - timing)) / mode).toFixed(2)

// Acha a posição de algo numa string
exports.findPos = (str, search, index) => {
	let posString = str.split(search, index).join(search).length
	if (str.slice(posString) == '') {
		posString = str.lastIndexOf(search)
	}
	return posString
}

// Filtro para o awaitMessages
exports.filterMsg = (msgw, whoSend, place, buttID, regex) => {
	if (msgw.quotedMsg !== null) {
		if (msgw.sender.id == whoSend && msgw.from == place && buttID.includes(msgw.quotedMsg.id)) {
			return true
		} else if (msgw.sender.id == whoSend && msgw.from == place && regex.test(removeAccents(msgw.body))) {
			return true
		} else return false
	} else {
		if (msgw.sender.id == whoSend && msgw.from == place && regex.test(removeAccents(msgw.body))) {
			return true
		} else return false
	}
}

// Traduz os textos
exports.translate = async (string) => {
	let transl = ''
	for (let txt of string.match(/.{1,4999}/g)) {
		await langTrans(txt, {
			to: region
		}).then(res => {
			if (txt.length < 4999) {
				transl += '\n' + res.text + '\n'
			} else transl += res.text
		})
	}
	return transl.replace(/\: \*/g, ':*').replace(/ \* /g, ' *').replace(/\: \_/g, ':_').replace(/ \_ /g, ' _').replace(/\: \~/g, ':~').replace(/ \~ /g, ' ~')
}

// Faz a primeira letra de uma string ser maiscula
exports.makeCaps = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// Regex que retorna se a string é um local
exports.isFolder = (string) => new RegExp(/^(.+)\/([^\/]+)$/gi).test(string)

// Formata uma string para pegar o valor de um object
exports.multikey = (string, obj) => {
    return string.split('.').reduce((old, next) => {
        return old ? old[next] : null
    }, obj || 'Fail')
}

// Informa erros no console de forma humanizada
exports.reportConsole = (command, error) => console.log(chalk.keyword('crimson')(`[${command.toUpperCase()}]`), chalk.keyword('gold')(`→ Obtive erros no comando "${config.Prefix}${command}" → "${error.message}" - Você pode ignorar.`))

// Conta quantas vezes uma string/palavra aparece | Por Pedro B.
exports.countHave = (string, word) => string.split(word).length - 1

// Faz uma tabela como o /menu || Pedro B.
exports.tablefy = (imput, titulo) => {
	if (titulo) {
		var tabelinha = '```╭───── 「``` ' + titulo.toUpperCase() + ' ```」 ──────```\n```│```\n\`\`\`│\`\`\` '
	} else var tabelinha = '```╭───────────────────────```\n```│```\n\`\`\`│\`\`\` '
	var mapimput = wordwrap(imput, {
		width: 36
	}).trim().split(/\n/)
	for (let i = 0; i < mapimput.length; i++) {
		if (tools('others').countHave(mapimput[i], '*') % 2 !== 0) {
			mapimput[i] += '*'
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '*' + mapimput[i + 1]
			}
		}
		if (tools('others').countHave(mapimput[i], '_') % 2 !== 0) {
			mapimput[i] += '_'
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '_' + mapimput[i + 1]
			}
		}
		if (tools('others').countHave(mapimput[i], '~') % 2 !== 0) {
			mapimput[i] += '~'
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '~' + mapimput[i + 1]
			}
		}
		if (tools('others').countHave(mapimput[i], '```') % 2 !== 0) {
			mapimput[i] += '```'
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '```' + mapimput[i + 1]
			}
		}
		tabelinha += mapimput[i] + '\n\`\`\`│\`\`\` '
	}
	return tabelinha += '\n\`\`\`╰───────────────────────\`\`\`'
}

// Transforma uma Buffer em Base64
exports.dataURI = (type, image) => `data:${type};base64,${image.toString('base64')}`

// Cria uma string aleatoria
exports.randomString = (length) => crypto.randomBytes(length).toString('hex')

// Verifica se é um número inteiro
exports.isInt = (val) => Number.isInteger(Number(val))

// Aleatoriza arrays
exports.randomArr = (arr) => arr.sort(() => Math.random() - 0.5)

exports.newArray = (min, max, lenmin, lenmax) => {
	let array = Array(max - min + 1).fill().map((_, idx) => min + idx)
	return lenmin !== null ? array.slice(lenmin, lenmax) : array
}

// Da a cor as mensagens do terminal
exports.color = (text, color) => !color ? chalk.green(text) : chalk.keyword(color)(text)

// Verifica se é uma URL
exports.isUrl = (url) => new RegExp(/(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|(www\.)?){1}([0-9A-Za-z-\.@:%_+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/gi).test(url)

// Faz a função esperar 'x' tempo antes de avançar
exports.sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Envia notificações
exports.notify = (title, message, icon) => {
	notifier.notify({
		title: title,
		message: message,
		icon: icon
	})
}

// Escolhe um número aleatório
exports.randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

// Adquire o tempo de processamento
exports.processTime = (timestamp, now) => moment.duration(now - moment(timestamp * 1000)).asSeconds()

// Formata uma array com object de forma crescente
exports.sort = (obj, value) => {
	let objRetn = {}
	let sorted = Object.keys(obj).sort(function(a,b) {
		return obj[b][value] - obj[a][value]
	}).map(k => objRetn[k] = obj[k])
	return objRetn
}

// Randomiza uma array
exports.randVal = (value) => value[Math.floor(Math.random() * value.length)]

// Função que separa o "Sim" de cada língua da Íris
exports.yesAwnsers = () => config.Language == 'pt' ? 'Sim' : config.Language == 'en' ? 'Yes' : 'Si'

// Função que separa o "Não" de cada língua na Íris [eu sei, ambas são 'inúteis' :)]
exports.noAwnsers = () => config.Language == 'pt' ? 'Não' : 'No'

// Função que pega uma linha aleatoria do texto usando shell script
exports.getRandLine = (qtd, file) => {
	return shell.exec(`bash lib/functions/config.sh line ${qtd} "${file}"`, {
		silent: true
	}).stdout.split('\n')
}

// Função que verifica se algo existe e então o apaga em "x" tempo
exports.clearFile = (p, t = 10000, isDir = false) => {
	try {
		if (fs.existsSync(p)) {
			setTimeout(() => {
				if (isDir) {
					fs.rmSync(p, {
						recursive: true
					})
				} else fs.unlinkSync(p)
			}, t)
		}
	} catch (error) {
		console.log(error, '\nTalvez você não tenha permissão de edição, tente mudar o local da pasta da Íris ou rodar como administrador.')
	}
}