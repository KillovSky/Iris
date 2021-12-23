/*----------- VERY IMPORTANT NOTICE - AVISO MUITO IMPORTANTE - AVISO MUY IMPORTANTE ------------------
*
* Reprodução, edição e outros estão autorizados MAS SEM REMOVER MEUS CRÉDITOS.
* Caso remova, resulta na quebra da licença do mesmo, sendo um crime.
* Leia mais sobre o que você pode fazer aqui -> https://escolhaumalicenca.com.br/licencas/mit/
* Ou digite o comando /Termos, fiz um resumo em 3 idiomas lá.
*
* Desculpem pelos comandos em "inglês", eu e meu pessoal gostamos do inglês. 
* Então os programo dessa forma. (Desconheço palavras suficientes em português) :'D
*
* Plagiar meus códigos não te torna coder, vá estudar, não seja um ladrão miserável.
* Esse projeto é feito com muita disposição, sem fins lucrativos, apenas para divertir, e claro, de graça.
* Eu realmente não gosto de ter minhas coisas roubadas, especialmente as que fiz gratuitamente, e você?
*
* Se ainda planeja roubar, saiba que quando baixou a Íris, você aceitou um acordo eheheheh
* Isso mesmo, plagiar meu código significa estar vendendo a alma para mim! 😎
*
* Agradecimentos especiais -> Pedro Batistop - Por sua enorme ajuda durante esses meses.
*
*				Obrigado também a todos que ajudam e a você que escolheu a Íris.
*
* -------------- DUVIDAS? LEIA A GITHUB OU ABRA UMA ISSUE POR LÁ PARA PEDIR AJUDA -------------------

/*MODULOS*/
const {
	bomber
} = require("bomber-api") /*Se desejar desativar o auto-abrir navegador leia a página inicial da Íris na github*/
const {
	Aki
} = require('aki-api')
const {
	decryptMedia
} = require('@open-wa/wa-decrypt')
const {
	EmojiAPI
} = require("emoji-api")
const {
	IamAuthenticator
} = require('ibm-watson/auth')
const {
	removeBackgroundFromImageBase64
} = require('remove.bg')
const {
	XVDL
} = require("xvdl")
const {
	Brainly
} = require("brainly-scraper-v2")
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1')
const axios = require('axios')
const bent = require('bent')
const canvacord = require('canvacord')
const canvas = require('canvas')
const deepai = require('deepai')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const ddg = require('ddg-scraper')
const duck = require("ddgimages-node")
const isPorn = require('is-porn')
const math = require('mathjs')
const moment = require('moment-timezone')
const ms = require('parse-ms')
const nhentai = require('nhentai-js')
const os = require('os')
const petPetGif = require('pet-pet-gif')
const Pokemon = require('pokemon.js')
const removeAccents = require('remove-accents')
const sharp = require('sharp')
const sinesp = require('sinesp-api')
const shell = require('shelljs')
const store = require("playstore-scraper")
const text2png = require('text2png')
const tts = require('node-gtts')
const translate = require('@imlinhanchao/google-translate-api')
const webp = require('webp-converter')
const wordwrap = require('word-wrapper')
const youtubedl = require('youtube-dl-exec')
const ytsearch = require('yt-search')
const maker = require('free-textmaker-alpha')
const TicTacToe = require('tictactoe-agent')
const genshin = require('genshin-db')
const chess = require('chess.js')
const chessImageGenerator = require("chess-image-generator")

/*UTILIDADES*/
const shop = require('./lib/functions/shop')
const hentao = require('./lib/functions/nhentai')
const {
	mylang
} = require('./lib/lang')
const {
	tools
} = require('./lib/functions')

/*JSON'S*/
const config = JSON.parse(fs.readFileSync('./lib/config/Gerais/config.json'))
const shopconf = JSON.parse(fs.readFileSync('./lib/config/Gerais/shop.json'))
const cmds = JSON.parse(fs.readFileSync('./lib/config/Gerais/cmds.json'))
const ctmprefix = JSON.parse(fs.readFileSync('./lib/config/Gerais/prefix.json'))
const reward = JSON.parse(fs.readFileSync('./lib/config/Gerais/rewards.json'))
const custom = JSON.parse(fs.readFileSync('./lib/config/Gerais/custom.json'))
const deleted = JSON.parse(fs.readFileSync('./lib/config/Gerais/message.json'))
const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'))
const hail = JSON.parse(fs.readFileSync('./lib/config/Gerais/greetings.json'))
const languages = JSON.parse(fs.readFileSync('./lib/config/Gerais/lang.json'))
var nivel = JSON.parse(fs.readFileSync('./lib/config/Gerais/level.json'))

/*ATIVADORES & CONFIGS EXTRAS*/

global.region = config.Language
var mess = mylang(region)
moment.tz.setDefault(config.Moment_Timezone).locale(config.Moment_Locale)
axios.defaults.headers.common['User-Agent'] = config.User_Agent
var gameconfig = {}
let chessGame = {}
var lotery = {
	"hasLast": false,
	"users": [],
	"lastUserPart": 0,
	"prize": {
		"icoin": 0,
		"xp": 0,
		"rubi": 0,
		"dima": 0
	},
	"lastprize": {
		"icoin": 0,
		"xp": 0,
		"rubi": 0,
		"dima": 0
	},
	"isStarted": false,
	"time": 0,
	"win": 0,
	"winner": 0,
	"lastTime": 0
}
var objconfig = {
	GuildExist: 0,
	agiotas: [],
	ohayo: [],
	bonjour: [],
	noch: [],
	dawn: [],
	isMuteAll: 0,
	isTyping: [],
	akistarted: 0,
	jogadas: 0,
	noLimits: 0,
	oneImage: 0,
	oneLink: 0,
	oneTrava: 0
}
var tttSet = {}
var placar = {}

module.exports = kconfig = async (kill, message) => {

	/*Isso antes da try possibilita receber os alertas no WhatsApp*/
	const {
		type,
		from,
		t,
		sender,
		author,
		isGroupMsg,
		chat,
		chatId,
		caption,
		isMedia,
		mimetype,
		quotedMsg,
		quotedMsgObj,
		mentionedJidList
	} = message
	const id = message.type == "buttons_response" ? message.quotedMsgObj.id : message.id
	let {
		body
	} = message
	body = (type == 'chat' || type == "buttons_response") ? body : ((type == 'image' || type == 'video') && caption) ? caption : ''
	let prefix = (!ctmprefix[chatId] && config.Prefix.includes(body.slice(0, 1)) && body.length > 1) ? body.slice(0, 1) : ctmprefix[chatId] ? ctmprefix[chatId] : config.Prefix[0]
	mess.newprefix(prefix)
	const command = removeAccents(body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase())
	const time = moment(t * 1000).format('DD/MM/YY HH:mm:ss')

	try {

		/*PARAMETROS & Daily*/
		var daily = JSON.parse(fs.readFileSync('./lib/config/Gerais/limit.json'))
		let name = chat.name || chat.formattedTitle || 'PV'
		let pushname = sender.pushname || sender.verifiedName || sender.formattedName || '"Censored by Government"' // Caso der erros e.e
		const botNumber = await kill.getHostNumber()
		const blockNumber = await kill.getBlockedIds()
		const isOwner = config.Owner.includes(sender.id)
		const isBot = sender.id == `${botNumber}@c.us`
		var groupMembersId = isGroupMsg ? await kill.getGroupMembersId(chatId) : false
		const groupAdmins = isGroupMsg ? await kill.getGroupAdmins(chatId) : false
		const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
		const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
		const isNsfw = isGroupMsg ? functions.nsfw.includes(chatId) : false
		const autoSticker = isGroupMsg ? functions.sticker.includes(chatId) : false
		const dateOfDay = (new Date()).getHours()
		const arg = body.trim().substring(body.indexOf(' ') + 1)
		const args = body.trim().split(/ +/).slice(1)
		const isCmd = body.startsWith(prefix)
		const isBlocked = blockNumber.includes(sender.id)
		const isAntiPorn = isGroupMsg ? functions.antiporn.includes(chatId) : false
		const isAntiTravas = isGroupMsg ? functions.antitrava.includes(chatId) : false
		const isAntiLink = isGroupMsg ? functions.antilinks.includes(chatId) : false
		const isxp = isGroupMsg ? functions.xp.includes(chatId) : false
		const mute = isGroupMsg ? functions.silence.includes(chatId) : false
		const pvmte = !isGroupMsg ? functions.silence.includes(sender.id) : false
		const isQuotedImage = quotedMsg && quotedMsg.type == 'image'
		const isQuotedVideo = quotedMsg && quotedMsg.type == 'video'
		const isQuotedSticker = quotedMsg && quotedMsg.type == 'sticker'
		const isQuotedGif = quotedMsg && quotedMsg.mimetype == 'image/gif'
		const isQuotedAudio = quotedMsg && quotedMsg.type == 'audio'
		const isQuotedPtt = quotedMsg && quotedMsg.type == 'ptt'
		const isImage = type == 'image'
		const isVideo = type == 'video'
		const isAudio = type == 'audio'
		const isPtt = type == 'ptt'
		const isGif = mimetype == 'image/gif'
		const arqs = body.trim().split(' ')
		const arks = args.join(' ')
		const argl = args.map(argl => argl.toLowerCase())
		const argc = args.map(argc => argc.toUpperCase())
		const isTrava = type == 'oversized'
		const randomMember = isGroupMsg ? tools('others').randVal(groupMembersId) : sender.id
		const isGroupCreator = isGroupMsg ? sender.id == chat.groupMetadata.owner : false

		/*OUTRAS*/
		const pollfile = `./lib/media/poll/${chatId.replace('@g.us', '')}.json`
		var side = tools('others').randomNumber(1, 2)
		var lvpc = tools('others').randomNumber(1, 100)
		var milSort = tools('others').randomNumber(1, 1000)
		const errorurl = 'https://img.wallpapersafari.com/desktop/1920/1080/19/44/evOxST.jpg'
		const personPhoto = 'https://thispersondoesnotexist.com/image'
		const errorImg = 'https://i.ibb.co/jRCpLfn/user.png'
		const checkLvL = tools('gaming').getValue(sender.id, nivel, chatId, 'level')
		const patente = tools('gaming').getPatent(checkLvL)
		const fileFor = ['pais', 'fruta', 'capital', 'empresa', 'nome']
		const typeChat = isGroupMsg ? '-gp' : '-pv'
		const typeName = isGroupMsg ? name : pushname
		const typeId = isGroupMsg ? chatId.replace('@g.us', '') : sender.id.replace('@c.us', '')
		const encryptMedia = isQuotedImage || isQuotedAudio || isQuotedPtt || isQuotedVideo || isQuotedSticker || isQuotedGif || quotedMsgObj ? quotedMsg : message

		/*Sistema que permite ignorar comandos de um grupo, caso você já possua um BOT nele e queira deixar a Íris desligada apenas lá, basta ativar*/
		/*if (isGroupMsg && isCmd && !isOwner && !isBot && chatId == 'Insira a id do grupo') return*/

		/*Bloqueia todas as travas, seja contato, localização, texto e outros*/
		if (!isOwner && !isBot) {
			try {
				if (!isGroupMsg && body.length > Number(config.Max_Characters) || !isGroupMsg && isTrava) {
					await kill.contactBlock(sender.id)
					await kill.sendText(config.Owner[0], mess.recTrava(sender.id))
				}
				if (isAntiTravas && isTrava && !isGroupAdmins && isBotGroupAdmins) {
					if (objconfig.oneTrava == 1 || body.length > Number(config.Max_Characters)) return kill.removeParticipant(chatId, sender.id)
					objconfig.oneTrava = 1
					await kill.setGroupToAdminsOnly(chatId, true)
					await kill.removeParticipant(chatId, sender.id)
					console.log(tools('others').color('[TRAVA]', 'red'), tools('others').color(`Possível trava recebida pelo → ${pushname} - [${sender.id.replace('@c.us', '')}] em ${name}...`, 'yellow'))
					await kill.sendText(from, `⡴⠑⡄⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀\n⡇⠀⠿⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀\n⠀⠀⠀⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆\n⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆\n⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢴⣆ \n⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⡿ \n⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉\n⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿\n⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇\n⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃\n⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁\n⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉\n\n`.repeat(10), id)
					await kill.sendTextWithMentions(from, `ACORDA - WAKE UP ADM\n\n@${groupAdmins.toString().replace(/@c.us/g, '').replace(/,/g, '\n- @')}​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​`)
					await kill.sendTextWithMentions(from, mess.nopanic() + '\n\n' + mess.baninjusto(sender.id) + 'Travas.')
					await kill.sendText(config.Owner[0], mess.recTrava(sender.id) + `\nAt/No > ${name}`)
					await kill.setGroupToAdminsOnly(chatId, false)
					if (config.Auto_Block) {
						await kill.contactBlock(event.who)
					}
					return objconfig.oneTrava = 0
				}
			} catch (error) {
				objconfig.oneTrava = 0
			}
		}
		/*Para limpar automaticamente sem você verificar, adicione "await kill.clearChat(chatId)" onde quiser dentro do "if".*/

		/*Anti Imagens pornográficas*/
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiPorn && isMedia && isImage && !isCmd && !isOwner && objconfig.oneImage == 0 && !isBot) {
			try {
				objconfig.oneImage = 1
				console.log(tools('others').color('[IMAGEM]', 'red'), tools('others').color('Verificando a imagem por pornografia...', 'yellow'))
				let mediaData = await decryptMedia(encryptMedia)
				const getUrl = await tools('cloud').upload(mediaData)
				deepai.setApiKey(config.API_DeepAI)
				const resp = await deepai.callStandardApi("nsfw-detector", {
					image: `${getUrl}`
				})
				if (resp.output.nsfw_score > 0.85) {
					console.log(tools('others').color('[NSFW]', 'red'), tools('others').color(`A imagem contém traços de conteúdo adulto, removerei o → ${pushname} - [${sender.id}]...`, 'yellow'))
					await kill.removeParticipant(chatId, sender.id)
					await kill.sendTextWithMentions(from, mess.baninjusto(sender.id) + 'Porno.')
					return objconfig.oneImage = 0
				} else {
					console.log(tools('others').color('[SEM NSFW]', 'lime'), tools('others').color(`→ A imagem não parece ser pornográfica.`, 'gold'))
					objconfig.oneImage = 0
				}
			} catch (error) {
				objconfig.oneImage = 0
			}
		}

		/*Anti links de grupo*/
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiLink && !isOwner && objconfig.oneLink == 0 && !isBot) {
			try {
				if (body.match(new RegExp(/(https:\/\/chat.whatsapp.com)/gi))) {
					objconfig.oneLink = 1
					const gplka = await kill.inviteInfo(body)
					if (gplka) {
						console.log(tools('others').color('[BAN]', 'red'), tools('others').color('Link de grupo detectado, removendo participante...', 'yellow'))
						await kill.removeParticipant(chatId, sender.id)
						await kill.sendTextWithMentions(from, mess.baninjusto(sender.id) + 'WhatsApp Link.')
						return objconfig.oneLink = 0
					} else {
						objconfig.oneLink = 0
						console.log(tools('others').color('[ALERTA]', 'yellow'), tools('others').color('Link de grupo invalido recebido...', 'yellow'))
					}
				}
			} catch (error) {
				oneLink = 0
			}
		}

		/*Anti links pornográficos*/
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiPorn && !isOwner && objconfig.oneLink == 0 && !isBot) {
			try {
				if (objconfig.oneLink == 1) return await kill.removeParticipant(chatId, sender.id)
				if (tools('others').isUrl(body)) {
					objconfig.oneLink = 1
					const inilkn = new URL(body)
					console.log(tools('others').color('[URL]', 'yellow'), 'URL recebida →', inilkn.hostname)
					await isPorn(inilkn.hostname, async (err, status) => {
						if (err) return console.error(err)
						if (status) {
							console.log(tools('others').color('[NSFW]', 'red'), tools('others').color(`O link é pornografico, removerei o → ${pushname} - [${sender.id.replace('@c.us', '')}]...`, 'yellow'))
							await kill.removeParticipant(chatId, sender.id)
							await kill.sendTextWithMentions(from, mess.baninjusto(sender.id) + 'Porno/Porn.')
							return objconfig.oneLink = 0
						} else {
							console.log(tools('others').color('[SEM NSFW]', 'lime'), tools('others').color(`→ O link não possui pornografia.`, 'gold'))
							objconfig.oneLink = 0
						}
					})
				}
			} catch (error) {
				objconfig.oneLink = 0
			}
		}

		/*Contador de Mensagens (em grupo) | Para contar do PV bote sem aspas "isGroupMsg || !isGroupMsg"*/
		if (isGroupMsg) {
			tools('gaming').addValue(sender.id, 1, nivel, chatId, 'msg')
		}

		/*Muda a linguagem para a requisitada no comando newlang*/
		if (isGroupMsg && isCmd && languages.en.includes(chatId)) {
			mess = mylang('en')
			region = 'en'
		} else if (isGroupMsg && isCmd && languages.es.includes(chatId)) {
			mess = mylang('es')
			region = 'es'
		} else if (isGroupMsg && isCmd && languages.pt.includes(chatId)) {
			mess = mylang('pt')
			region = 'pt'
		}

		/*Manda Bom Dia/Tarde/Noite sem floodar*/
		if (config.Day_Messages && !config.Auto_Update) {
			if (isGroupMsg && dateOfDay >= '5' && dateOfDay < '11') {
				if (!objconfig.ohayo.includes(chatId)) {
					objconfig.ohayo.push(chatId)
					await kill.sendText(from, mess.ohayo())
				}
			} else if (isGroupMsg && dateOfDay >= '12' && dateOfDay <= '17') {
				if (!objconfig.bonjour.includes(chatId)) {
					objconfig.bonjour.push(chatId)
					objconfig.ohayo.splice(chatId, 1)
					await kill.sendText(from, mess.bonjour())
				}
			} else if (isGroupMsg && dateOfDay >= '18' && dateOfDay < '23') {
				if (!objconfig.noch.includes(chatId)) {
					objconfig.noch.push(chatId)
					objconfig.ohayo.splice(chatId, 1)
					objconfig.bonjour.splice(chatId, 1)
					await kill.sendText(from, mess.noch())
				}
			} else if (isGroupMsg && dateOfDay >= '0' && dateOfDay < '6') {
				if (!objconfig.dawn.includes(chatId)) {
					objconfig.dawn.push(chatId)
					objconfig.ohayo.splice(chatId, 1)
					objconfig.bonjour.splice(chatId, 1)
					objconfig.noch.splice(chatId, 1)
					await kill.sendText(from, mess.dawn())
				}
			}
		}

		/*Ensina a rodar comandos pelo WhatsApp da BOT*/
		if (isBot && isCmd && chatId !== `${botNumber}@c.us`) {
			await kill.reply(config.Owner[0], mess.howtorun(`wa.me/+${botNumber}`), id)
		}

		/*Mantém a BOT escrevendo caso o dono queira*/
		if (isGroupMsg && objconfig.isTyping.includes(chatId) || isCmd) {
			await kill.simulateTyping(from, true)
		}

		/*Sistema do XP - Baseado no de Bocchi - Slavyan*/
		if (isGroupMsg && isxp && !tools('gaming').isWin(sender.id) && !isBlocked) {
			try {
				tools('gaming').wait(sender.id)
				var gainedXP = Math.floor(Math.random() * Number(config.Max_XP_Earn)) + Number(config.Min_XP_Earn)
				const usuarioLevel = tools('gaming').getValue(sender.id, nivel, chatId, 'level')
				var myGuildN = tools('gaming').getValue(sender.id, nivel, chatId, 'guild')
				if (myGuildN.toUpperCase() == 'COMPANIONS') {
					gainedXP = parseInt(gainedXP + (usuarioLevel * 4), 10) /*Guilda Companions ganha 4X*/
				} else if (myGuildN.toUpperCase() == 'THIEVES') {
					gainedXP = parseInt(gainedXP + (usuarioLevel * 3), 10) /*Guilda Thieves ganha 3X*/
				} else if (myGuildN.toUpperCase() !== 'NO_GUILD') {
					gainedXP = parseInt(gainedXP + (usuarioLevel * 2), 10) /* Guildas genericas ganham 2X */
				}
				myGuildN = myGuildN !== '' ? `\n➸ *Guilda:* ${myGuildN.toUpperCase()}` : ''
				tools('gaming').addValue(sender.id, gainedXP, nivel, chatId, 'xp')
				const haveXptoUp = tools('gaming').getValue(sender.id, nivel, chatId, 'xp')
				if (tools('gaming').LevelEXP(checkLvL) <= haveXptoUp) {
					tools('gaming').addValue(sender.id, 1, nivel, chatId, 'level')
					tools('gaming').addValue(sender.id, Number(config.Iris_Coin), nivel, chatId, 'coin')
					let userStats = tools('gaming').getValue(sender.id, nivel, chatId, null)
					const rankPh = await kill.getProfilePicFromServer(sender.id)
					var ohotLev = rankPh.includes('ERR') || rankPh == null || typeof rankPh === 'object' || !tools('others').isUrl(rankPh) ? errorurl : rankPh
					let rankCard = await tools('canvas').ranking(ohotLev, haveXptoUp, tools('gaming').LevelEXP(userStats.level), userStats.level, Object.keys(nivel[chatId]).indexOf(sender.id), Number(gainedXP), `${tools('gaming').getPatent(userStats.level)} - ${(userStats.guild).toUpperCase()}`, pushname)
					await kill.sendFile(from, rankCard, `${sender.id.replace('@c.us', '')}_card.png`, `🔭 - ${pushname} - ${name}\n🎮 - ${haveXptoUp} / ${tools('gaming').LevelEXP(userStats.level)} XP\n☄️ - Level ${userStats.level}\n⏱️ - ${userStats.msg} Mensagens\n🃏 - ${tools('gaming').getPatent(userStats.level)}\n💵 - ${userStats.coin} Í-coins\n⚔️ - ${(userStats.guild).toUpperCase()}\n🔶 - ${userStats.rubi} Rubis\n💎 - ${userStats.dima} Diamantes`, id)
					/*Desative ou Apague as linhas a partir de "userStats" ate "sendFile", se sua Íris floodar mensagens de "Level UP"*/
				}
			} catch (error) {
				console.log(tools('others').color('[XP]', 'crimson'), error)
			}
		}

		/*Adiciona nível caso tenha ganhado XP demais*/
		let userStats = tools('gaming').getValue(sender.id, nivel, chatId, null)
		if (userStats.xp >= tools('gaming').LevelEXP(userStats.level)) {
			tools('gaming').addValue(sender.id, 1, nivel, chatId, 'level')
		}
		
		/* Insere a Íris no ranking */
		tools('gaming').addValue(botNumber+'@c.us', 100, nivel, chatId, 'coin')

		/*Auto-stickers de fotos*/
		if (isGroupMsg && autoSticker && isMedia && isImage && !isCmd && !isBot) {
			let mediaData = await decryptMedia(encryptMedia)
			await kill.sendImageAsSticker(from, tools('others').dataURI(mediaData), {
				author: config.Sticker_Author,
				pack: config.Sticker_Pack,
				keepScale: true
			})
		}

		/*Auto-sticker de videos & gifs*/
		if (isGroupMsg && autoSticker && isMedia && isVideo && !isCmd && !isBot) {
			let mediaData = await decryptMedia(encryptMedia)
			await kill.sendMp4AsSticker(from, mediaData, null, {
				stickerMetadata: true,
				pack: config.Sticker_Pack,
				author: config.Sticker_Author,
				fps: 10,
				crop: false,
				loop: 0
			})
		}

		/*Ative para banir quem mandar todos os tipos de links (Ative removendo a / * e * /)*/
		/*if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiLink && !isOwner && tools('others').isUrl(body) && !isBot) return await kill.removeParticipant(chatId, sender.id)*/

		/*Comandos sem prefix, esse responde se marcar a BOT*/
		if (!tools('cooldown').isFiltered(from) && !isCmd) {
			try {
				if (message.body.includes(`@${botNumber.replace('@c.us', '')}`)) {
					await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], id)
				}
			} catch (error) {
				/*Nada a ser feito*/
			}
		}

		// Sistema de acerto do Mix
		if (!isMedia && !isCmd && Object.keys(gameconfig).includes(chatId)) {
			if (chatId == gameconfig[chatId]['whoplay'] && gameconfig[chatId]['word'] !== 0 && removeAccents(body.toLowerCase()) == gameconfig[chatId]['word']) {
				try {
					savePoint = pushname == null ? sender.id : sender.id + '  [' + pushname + ']'
					placar[savePoint] == null ? placar[savePoint] = 1 : placar[savePoint]++
					gameconfig[chatId]['word'] = 0
					gameconfig[chatId]['whoplay'] = 0
					gameconfig[chatId]['hint'] = 0
					let winType = tools('others').randVal(['xp', 'coin', 'rubi', 'dima'])
					let winChos = await tools('others').randomNumber(config.Prize_Value_Min, config.Prize_Value_Max)
					tools('gaming').addValue(sender.id, Number(winChos), nivel, chatId, winType)
					await kill.sendTextWithMentions(from, `@${sender.id.replace('@c.us', '')} acertou!\n\n> ${body.toUpperCase()}\n\nRecompensa: ${winChos} ${winType.toUpperCase()}`)
				} catch (error) {
					/*Nada a ser feito*/
				}
			}
		}

		/*Caso deseje criar siga o estilo disso abaixo, para usar a base remova a /* e pronto. - */
		/*if (!tools('cooldown').isFiltered(from) && !isCmd) {
			try {
				if (message.body.toLowerCase() == 'Mensagem a receber, sem espaços') await kill.reply(from, 'Resposta para enviar', id)
			} catch (e) {
				// Ignora erros se deixar vazio
			}
		}*/
		/*Se falhar você pode tentar "message.body.toLowerCase().includes == 'Mensagem' "*/

		/*Impede comandos em PV'S mutados*/
		if (!isGroupMsg && isCmd && pvmte && !isOwner) return console.log(tools('others').color('> [SILENCE]', 'red'), tools('others').color(`Ignorando comando de ${pushname} - [${sender.id.replace('@c.us', '')}] pois ele está mutado...`, 'yellow'))

		/*Impede comandos em grupos mutados*/
		if (isGroupMsg && isCmd && !isGroupAdmins && mute && !isOwner) return console.log(tools('others').color('> [SILENCE]', 'red'), tools('others').color(`Ignorando comando de ${name} pois ele está mutado...`, 'yellow'))

		/*Muta geral, reseta ao reiniciar*/
		if (isCmd && !isOwner && objconfig.isMuteAll == 1) return console.log(tools('others').color('> [SILENCE]', 'red'), tools('others').color(`Ignorando comando de ${pushname} pois os PV'S e Grupos estão mutados...`, 'yellow'))

		/*Ignora pessoas bloqueadas*/
		if (isBlocked && isCmd && !isOwner) return console.log(tools('others').color('> [BLOCK]', 'red'), tools('others').color(`Ignorando comando de ${pushname} - [${sender.id.replace('@c.us', '')}] por ele estar bloqueado...`, 'yellow'))

		/*Anti Flood para PV'S*/
		if (isCmd && tools('cooldown').isFiltered(chatId) && !isGroupMsg && !isOwner) {
			tools('gaming').addValue(sender.id, Number(-100), nivel, chatId, 'xp')
			return console.log(tools('others').color('> [FLOOD AS]', 'red'), tools('others').color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), tools('others').color(`"[${prefix}${command.toUpperCase()}] [${args.length}]"`, 'red'), 'DE', tools('others').color(`"${pushname} - [${sender.id.replace('@c.us', '')}]"`, 'red'))
		}

		/*Anti Flood para grupos*/
		if (isCmd && tools('cooldown').isFiltered(chatId) && isGroupMsg && !isOwner) {
			tools('gaming').addValue(sender.id, Number(-100), nivel, chatId, 'xp')
			return console.log(tools('others').color('> [FLOOD AS]', 'red'), tools('others').color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), tools('others').color(`"[${prefix}${command.toUpperCase()}] [${args.length}]"`, 'red'), 'DE', tools('others').color(`"${pushname} - [${sender.id.replace('@c.us', '')}]"`, 'red'), 'EM', tools('others').color(`"${name}"`))
		}

		/*Mensagens no PV*/
		if (!isCmd && !isGroupMsg) {
			return console.log('> MENSAGEM AS', tools('others').color(time, 'yellow'), 'DE', tools('others').color(`"${pushname} - [${sender.id.replace('@c.us', '')}]"`))
		}

		/*Mensagem em Grupo*/
		if (!isCmd && isGroupMsg) {
			return console.log('> MENSAGEM AS', tools('others').color(time, 'yellow'), 'DE', tools('others').color(`"${pushname} - [${sender.id.replace('@c.us', '')}]"`), 'EM', tools('others').color(`"${name}"`))
		}

		/*Comandos no PV*/
		if (isCmd && !isGroupMsg) {
			console.log(tools('others').color(`> COMANDO "[${prefix}${command.toUpperCase()}]"`), 'AS', tools('others').color(time, 'yellow'), 'DE', tools('others').color(`"${pushname} - [${sender.id.replace('@c.us', '')}]"`))
		}

		/*Comandos em grupo*/
		if (isCmd && isGroupMsg) {
			console.log(tools('others').color(`> COMANDO "[${prefix}${command.toUpperCase()}]"`), 'AS', tools('others').color(time, 'yellow'), 'DE', tools('others').color(`"${pushname} - [${sender.id.replace('@c.us', '')}]"`), 'EM', tools('others').color(`"${name}"`))
		}

		/*Impede SPAM*/
		if (isCmd && !isOwner) {
			tools('cooldown').addFilter(chatId) // Para limitar apenas usuarios em vez de grupo, troque "chatId" por "user"
		}

		/* Roda multiplos comandos */
		let cmdtorun = [command]
		args.filter(c => c.includes(prefix) && !tools('others').isUrl(c)).map(b => cmdtorun.push(b.slice(1))) // Limitado para rodar apenas com o mesmo prefix se for todos os comandos

		for (let i = 0; i < cmdtorun.length; i++) {

			switch (cmdtorun[i]) {

				case 'fake':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await tools('handler').switchs(argl[0], functions, 'fake', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'blacklist':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await tools('handler').switchs(argl[0], functions, 'blacklist', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'bklist':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (argl[0] == 'on') {
							if (functions.antinumbers.includes(`${argl[1]}@c.us`)) return await kill.reply(from, mess.jaenabled(), id)
							functions.antinumbers.push(`${argl[1]}@c.us`)
							await kill.reply(from, mess.bkliston(), id)
						} else if (argl[0] == 'off') {
							if (!functions.antinumbers.includes(`${argl[1]}@c.us`)) return await kill.reply(from, mess.jadisabled(), id)
							functions.antinumbers.splice(`${argl[1]}@c.us`, 1)
							await kill.reply(from, mess.bklistoff(), id)
						} else return await kill.reply(from, mess.kldica2(), id)
						fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"))
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'onlyadms':
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (argl[0] == 'on') {
							await kill.setGroupToAdminsOnly(chatId, true)
							await kill.sendText(from, mess.admson())
						} else if (argl[0] == 'off') {
							await kill.setGroupToAdminsOnly(chatId, false)
							await kill.sendText(from, mess.admsoff())
						} else return await kill.reply(from, mess.kldica1(), id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'revoke':
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await kill.revokeGroupInviteLink(chatId)
						await kill.reply(from, mess.revoga(), id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'setimage':
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (isMedia && type == 'image' || isQuotedImage) {
							const picgp = await kill.getProfilePicFromServer(chatId)
							if (!tools('others').isUrl(picgp)) {
								var backup = errorurl
							}
							await kill.sendFileFromUrl(from, backup, 'group.png', 'Backup', id)
							let mediaData = await decryptMedia(encryptMedia)
							await kill.setGroupIcon(chatId, tools('others').dataURI(mimetype, mediaData))
						} else if (args.length == 1) {
							if (!tools('others').isUrl(args[0])) return await kill.reply(from, mess.nolink(), id)
							const picgpo = await kill.getProfilePicFromServer(chatId)
							if (!tools('others').isUrl(picgpo)) {
								var backup = errorurl
							}
							await kill.sendFileFromUrl(from, back, 'group.png', 'Backup', id)
							await kill.setGroupIconByUrl(chatId, args[0]).then(async (r) => (!r && r !== null) ? await kill.reply(from, mess.nolink(), id) : await kill.reply(from, mess.maked(), id))
						} else return await kill.reply(from, mess.onlyimg(), id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'nsfw':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await tools('handler').switchs(argl[0], functions, 'nsfw', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'welcome':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
						await tools('handler').switchs(argl[0], functions, 'welcome', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break
				
				case 'goodbye':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
						await tools('handler').switchs(argl[0], functions, 'goodbye', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'link':
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						const inviteLink = await kill.getGroupInviteLink(chatId)
						await kill.sendLinkWithAutoPreview(from, inviteLink, `❤️ - ${name}`)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'everyone':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await kill.sendTextWithMentions(from, `═✪〘 🖊️ - ${body.slice(10)} - 🐂 〙✪═\n\n- @${groupMembersId.toString().replace(/@c.us/g, '').replace(/,/g, '\n- @')}​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n\n═✪〘 ❤️ - BOT Íris - 📢 〙✪═`)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'add':
					try {
						if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
						if (args.length !== 1 && isNaN(args[0])) return await kill.reply(from, mess.usenumber(), id)
						if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
							if (groupMembersId.includes(args[0] + '@c.us')) return await kill.reply(from, mess.janogp(), id)
							await kill.addParticipant(from, `${args[0]}@c.us`)
						} else if (isGroupMsg) {
							await kill.reply(from, mess.soademiro(), id)
						} else return await kill.reply(from, mess.sogrupo(), id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.addpessoa() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'unban':
				case 'unkick':
					try {
						if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
						if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
							if (!quotedMsg) return await kill.reply(from, mess.nomark, id)
							const unbanq = quotedMsgObj.sender.id
							if (groupMembersId.includes(unbanq)) return await kill.reply(from, mess.janogp(), id)
							await kill.sendTextWithMentions(from, mess.unban(unbanq))
							await kill.addParticipant(chatId, unbanq)
						} else if (isGroupMsg) {
							await kill.reply(from, mess.soademiro(), id)
						} else return await kill.reply(from, mess.sogrupo(), id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.addpessoa() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'kick':
				case 'k':
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (quotedMsg) {
							const negquo = quotedMsgObj.sender.id
							if (config.Owner.includes(negquo)) return await kill.reply(from, mess.vip(), id)
							if (groupAdmins.includes(negquo)) return await kill.reply(from, mess.removeradm(), id)
							if (!groupMembersId.includes(negquo)) return await kill.reply(from, mess.notongp(), id)
							await kill.sendTextWithMentions(from, mess.ban(negquo))
							await kill.removeParticipant(chatId, negquo)
						} else {
							if (mentionedJidList.length == 0) return await kill.reply(from, mess.semmarcar(), id)
							await kill.sendTextWithMentions(from, mess.kick(mentionedJidList))
							for (let i in mentionedJidList) {
								if (config.Owner.includes(mentionedJidList[i])) return await kill.reply(from, mess.vip(), id)
								if (groupAdmins.includes(mentionedJidList[i])) return await kill.reply(from, mess.removeradm(), id)
								await kill.removeParticipant(chatId, mentionedJidList[i])
							}
						}
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'sair':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await kill.sendText(from, mess.goodbye()).then(async () => {
							await kill.leaveGroup(chatId)
						})
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'promote':
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (quotedMsg) {
							const proquo = quotedMsgObj.sender.id
							if (groupAdmins.includes(proquo)) return await kill.reply(from, mess.isadm(), id)
							await kill.sendTextWithMentions(from, mess.promote(proquo))
							await kill.promoteParticipant(chatId, proquo)
						} else {
							if (mentionedJidList.length == 0) return await kill.reply(from, mess.semmarcar(), id)
							await kill.sendTextWithMentions(from, mess.promote(mentionedJidList))
							var isPromo = ''
							for (let i in mentionedJidList) {
								if (groupAdmins.includes(mentionedJidList[i])) {
									isPromo += `@${mentionedJidList[i].replace('@c.us', '')} `
								}
								await kill.promoteParticipant(chatId, mentionedJidList[i])
							}
							if (isPromo !== '') {
								isPromo += `\n\n${mess.isadm()}`
								await kill.sendTextWithMentions(from, isPromo, id)
							}
						}
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'demote':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
						if (quotedMsg) {
							const demquo = quotedMsgObj.sender.id
							if (!groupAdmins.includes(demquo)) return await kill.reply(from, mess.notadm, id)
							await kill.sendTextWithMentions(from, mess.demote(demquo))
							await kill.demoteParticipant(chatId, demquo)
						} else {
							if (mentionedJidList.length == 0) return await kill.reply(from, mess.semmarcar(), id)
							await kill.sendTextWithMentions(from, mess.demote(mentionedJidList))
							var notDemoted = ''
							for (let i in mentionedJidList) {
								if (!groupAdmins.includes(mentionedJidList[i])) notDemoted += `@${mentionedJidList[i].replace('@c.us', '')} `
								await kill.demoteParticipant(chatId, mentionedJidList[i])
							}
							if (notDemoted !== '') {
								notDemoted += `\n\n${mess.notadm()}`
								await kill.sendTextWithMentions(from, notDemoted, id)
							}
						}
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'delete':
				case 'del':
					if (quotedMsg && !quotedMsgObj.fromMe) return await kill.reply(from, mess.mymess(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await kill.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'antiporn':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await tools('handler').switchs(argl[0], functions, 'antiporn', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'antilinks':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await tools('handler').switchs(argl[0], functions, 'antilinks', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'admins':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await kill.reply(from, mess.admins(), id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'mute':
				case 'silence':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await tools('handler').switchs(argl[0], functions, 'silence', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'autosticker':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await tools('handler').switchs(argl[0], functions, 'sticker', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'rank':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await tools('handler').switchs(argl[0], functions, 'xp', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'ghost':
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					if (isNaN(args[0])) return await kill.reply(from, mess.kickcount(), id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await kill.reply(from, mess.wait(), id);
						var userRem = `Removidos ↓\n\n`
						if (functions.welcome.includes(chatId)) {
							functions.welcome.splice(chatId, 1)
							let useWelcomeAFT = 1
							fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"))
						}
						for (let member of groupMembersId) {
							if (!groupAdmins.includes(member) || !botNumber.includes(member) || !config.Owner.includes(member)) {
								if (tools('gaming').getValue(member, nivel, chatId, 'msg') < Number(args[0])) {
									await kill.removeParticipant(chatId, member)
									memberRem += `@${member}\n\n`
								}
							} else return console.log(tools('others').color('[VIP] - ', 'crimson'), member)
						}
						if (useWelcomeAFT == 1) {
							functions.welcome.push(chatId)
							fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"))
						}
						await kill.sendTextWithMentions(from, userRem.replace('@c.us', ''))
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

					/*Obrigado pela base Leonardo*/
				case 'softban':
					try {
						if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
							if (args.length == 0 || isNaN(args[0]) && isNaN(args[1]) || !quotedMsg && mentionedJidList.length == 0) return await kill.reply(from, mess.nomark() + ' + time/tempo (minutos/minutes)\n(Ex: 30)', id)
							if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
							const aatimep = quotedMsg ? Number(args[0] * 60000) : Number(args[1] * 60000)
							var banThisGuy = quotedMsg ? quotedMsgObj.sender.id : mentionedJidList[0]
							if (config.Owner.includes(banThisGuy) || groupAdmins.includes(banThisGuy) || botNumber.includes(banThisGuy)) return await kill.reply(from, mess.vip(), id)
							if (!groupMembersId.includes(banThisGuy)) return await kill.reply(from, mess.notongp(), id)
							await kill.sendTextWithMentions(from, mess.softban(banThisGuy, aatimep))
							await tools('others').sleep(1000)
							await kill.removeParticipant(chatId, banThisGuy)
							await tools('others').sleep(aatimep)
							groupMembersId = await kill.getGroupMembersId(chatId)
							if (groupMembersId.includes(banThisGuy)) return await kill.reply(from, mess.janogp(), id)
							await kill.reply(from, mess.timeadd(), id)
							await kill.addParticipant(chatId, banThisGuy)
							await tools('others').sleep(Number(aatimep + 5000))
							await kill.sendText(from, mess.voltargp())
						} else if (isGroupMsg) {
							await kill.reply(from, mess.soademiro(), id)
						} else return await kill.reply(from, mess.sogrupo(), id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.addpessoa() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'bomb':
					if (args.length >= 1 && isGroupMsg && isGroupAdmins || args.length >= 1 && isOwner) {
						if (argl[0] == '-stop') {
							const cancelBomb = await fetch(`http://localhost:3000/stop?number=${args[0]}`).then((data) => data.json())
							console.log(tools('others').color('[BOMB]', 'crimson'), tools('others').color(`→ Ataque ao alvo → "${args[0]}" cancelado por "${pushname}".`, 'gold'))
							if (cancelBomb.success) {
								await kill.reply(from, mess.bombstop(args), id)
							} else return await kill.reply(from, mess.cancelbomb(), id)
						}
						if (argl[0] == '-list') {
							const getBombs = await fetch('http://localhost:3000/list').then((data) => data.json())
							if (getBombs.success) {
								await kill.sendTextWithMentions(from, '💀 - Bombers [ALVOS] - 💀\n\n' + getBombs.result.map(a => `@${a.number}\n`))
							} else return await kill.reply(from, `Não há alvos sofrendo ataques.`, id)
						}
						if (isNaN(args[0])) return await kill.reply(from, mess.usenumber(), id)
						if (config.Owner.includes(`${args[0]}@c.us`) && !isOwner || args[0].includes(`${botNumber.replace('@c.us', '')}`) && !isOwner) {
							await kill.sendText(config.Owner[0], mess.nobomb(pushname, sender.id))
							await kill.reply(from, mess.fuckbomb(), id)
							if (config.Auto_Block) {
								await kill.contactBlock(event.who)
							}
							return console.log(tools('others').color('[BOMB]', 'crimson'), tools('others').color(`→ ${sender.id} tentou fazer BOMB em mim ou você!.`, 'red'))
						}
						const startAtk = await fetch(`http://localhost:3000/attack?number=${args[0]}&loops=30`).then((data) => data.json()) /* Se você alterou a porta do bomber, mude aqui/nos outros também*/
						console.log(tools('others').color('[BOMB]', 'crimson'), tools('others').color(`→ Pedido de BOMB feito pelo "${pushname}" no alvo → "${args[0]}".`, 'gold'))
						if (startAtk.success) {
							await kill.reply(from, mess.bombstd(args), id)
						} else return await kill.reply(from, mess.bomber(), id)
					} else return await kill.reply(from, mess.bomber(), id)
				break

				case 'antitravas':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await tools('handler').switchs(argl[0], functions, 'antitrava', chatId, mess.kldica1(), kill, message)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'destrava':
					if (isGroupMsg && isGroupAdmins || isOwner) {
						await kill.reply(from, `⡴⠑⡄⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀\n⡇⠀⠿⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀\n⠀⠀⠀⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆\n⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆\n⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢴⣆ \n⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⡿ \n⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉\n⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿\n⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇\n⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃\n⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁\n⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉`, id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'newprefix':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (args.length == 0 || argl[0] == '-help') return await kill.reply(from, mess.noargs() + 'new prefix.', id)
						ctmprefix[chatId] = args[0]
						fs.writeFileSync('./lib/config/Gerais/prefix.json', JSON.stringify(ctmprefix, null, "\t"))
						await kill.reply(from, mess.newprefix(args), id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'newlang':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						Object.keys(languages).map(i => languages[i].splice(chatId))
						if (!Object.keys(languages).includes(argl[0]) || languages[argl[0]].includes(chatId)) return await kill.reply(from, mess.usinglang(), id)
						if (argl[0] == 'en') {
							languages.en.push(chatId)
						} else if (argl[0] == 'es') {
							languages.es.push(chatId)
						} else if (argl[0] == 'pt') {
							languages.pt.push(chatId)
						} else return await kill.reply(from, mess.usinglang(), id)
						fs.writeFileSync('./lib/config/Gerais/lang.json', JSON.stringify(languages, null, "\t"))
						await kill.reply(from, mess.enabled(), id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'greet':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (args.length <= 1 || !arks.includes('|') || argl[0] == '-help') return await kill.reply(from, mess.customWlc() + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
						hail[chatId] = {
							"welcome": {
								message: `${arg.split('|')[0]}`,
								onlyText: arg.split('|')[1].replace(' ', '') == 'on' ? true : false
							}
						}
						fs.writeFileSync('./lib/config/Gerais/greetings.json', JSON.stringify(hail, null, "\t"))
						await kill.reply(from, mess.enabled(), id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'bye':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (args.length <= 1 || !arks.includes('|') || argl[0] == '-help') return await kill.reply(from, mess.customWlc() + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
						hail[chatId] = {
							"goodbye": {
								message: `${arg.split('|')[0]}`,
								onlyText: arg.split('|')[1].replace(' ', '') == 'on' ? true : false
							}
						}
						fs.writeFileSync('./lib/config/Gerais/greetings.json', JSON.stringify(hail, null, "\t"))
						await kill.reply(from, mess.enabled(), id)
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

					/*Feito por Pedro Batistop*/
				case 'dellast':
					if (isNaN(args[0])) return await kill.reply(from, mess.onlynumber(), id)
					if (isGroupMsg && isGroupAdmins || isOwner) {
						try {
							let lastMes = (await kill.getAllMessagesInChat(from, true)).filter(my => my.sender.id == botNumber + '@c.us' && my.type !== "revoked")
							lastMes.slice(Math.max(lastMes.length - Number(args[0]), 0)).map(async (m) => {
								await kill.deleteMessage(from, m.id)
							})
						} catch (error) {
							await kill.reply(from, mss.dellastmsg(args[0]), id)
						}
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'broad':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					if (args.length == 0) return await kill.reply(from, mess.broad(), id)
					const chatall = await kill.getAllChatIds()
					const isGroupC = await chatall.filter(group => group.includes('@g.us'))
					const isPrivateC = await chatall.filter(privat => privat.includes('@c.us'))
					try {
						const sendQFileC = async (quotedMsgObj, ids) => {
							let replyOnReply = await kill.getMessageById(quotedMsgObj.id)
							let obj = replyOnReply.quotedMsgObj
							if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
								if (quotedMsgObj.animated) quotedMsgObj.mimetype = ''
							} else if (obj && /ptt|audio|video|image/.test(obj.type)) {
								quotedMsgObj = obj
							} else return
							let mediaData = await decryptMedia(quotedMsgObj)
							await kill.sendFile(ids, tools('others').dataURI(quotedMsgObj.mimetype, mediaData), '', `> ${pushname}.`)
						}
						if (argl[0] == '-all') {
							for (let ids of chatall) {
								var cvk = await kill.getChatById(ids)
								if (!cvk.isReadOnly) {
									try {
										await kill.sendText(ids, `[Transmissão de ${pushname} ]\n\n${body.slice(12)}`)
										if (quotedMsgObj) return await sendQFileC(quotedMsgObj, ids)
									} catch (error) {
										console.log(tools('others').color('[BROADCAST]', 'crimson'), tools('others').color(`→ Uma das mensagens não foi enviada - Você pode ignorar.`, 'gold'))
									}
								}
							}
							await kill.reply(from, mess.maked(), id)
						} else if (argl[0] == '-gps') {
							for (let ids of isGroupC) {
								var cvk = await kill.getChatById(ids)
								if (!cvk.isReadOnly) {
									try {
										await kill.sendText(ids, `[Transmissão de ${pushname} ]\n\n${body.slice(12)}`)
										if (quotedMsgObj) return await sendQFileC(quotedMsgObj, ids)
									} catch (error) {
										console.log(tools('others').color('[BROADCAST]', 'crimson'), tools('others').color(`→ Uma das mensagens não foi enviada - Você pode ignorar.`, 'gold'))
									}
								}
							}
							await kill.reply(from, mess.maked(), id)
						} else if (argl[0] == '-pvs') {
							for (let ids of isPrivateC) {
								try {
									await kill.sendText(ids, `[Transmissão de ${pushname} ]\n\n${body.slice(12)}`)
									if (quotedMsgObj) return await sendQFileC(quotedMsgObj, ids)
								} catch (error) {
									console.log(tools('others').color('[BROADCAST]', 'crimson'), tools('others').color(`→ Uma das mensagens não foi enviada - Você pode ignorar.`, 'gold'))
								}
							}
							await kill.reply(from, mess.maked(), id)
						} else return await kill.reply(from, mess.broad(), id)
					} catch (error) {
						await kill.reply(from, mess.noctt() + '\n\n' + mess.fail(command, error, time), id)
						tools('others').reportConsole(command, error)
					}
				break

				case 'arquivar':
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					if (isGroupMsg) {
						if (isGroupCreator || isOwner) {
							for (let member of groupMembersId) {
								if (groupAdmins.includes(member) || config.Owner.includes(member)) {
									console.log(tools('others').color('[VIP] - ', 'crimson'), member)
								} else return await kill.removeParticipant(chatId, member)
							}
							await kill.reply(from, mess.maked(), id)
						} else return await kill.reply(from, mess.gpowner(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'leave':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					const allGroups = await kill.getAllGroups()
					for (let gclist of allGroups) {
						await kill.sendText(gclist.contact.id, mess.goodbye())
						await kill.leaveGroup(gclist.contact.id)
					}
					await kill.reply(from, mess.maked(), id)
				break

				case 'clear':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					const allChatz = await kill.getAllChats()
					if (functions.welcome.includes(chatId)) {
						functions.welcome.splice(chatId, 1)
						let useWelcomeStd = 1
						fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"))
					}
					for (let dchat of allChatz) {
						await kill.deleteChat(dchat.id)
						await kill.clearChat(dchat.id)
					}
					if (useWelcomeStd == 1) {
						functions.welcome.push(chatId)
						fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"))
					}
					await kill.reply(from, mess.maked(), id)
				break

				case 'tela':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					const sesPic = await kill.getSnapshot()
					await kill.sendFile(from, sesPic, 'session.png', 'Neh...', id)
				break

				case 'blocklist':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					await kill.sendTextWithMentions(from, `🔐 - Block: ${blockNumber.length}\n\n${blockNumber.join('\n➸ @').replace(/@c.us/g, '')}`)
				break

				case 'shutdown':
				case 'encerrar':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					var timeToShut = !isNaN(args[0]) ? Number(args[0]) * 1000 : 10000
					await kill.reply(from, mess.shutdown((timeToShut / 1000).toString()), id)
					config.SafeBoot = 0
					fs.writeFileSync('./lib/config/Gerais/config.json', JSON.stringify(config, null, "\t"))
					await tools('others').sleep(timeToShut)
					await kill.kill()
				break

				case 'create':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.newgp(), id)
					const peopleAdd = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList : sender.id)
					await kill.createGroup(arg.split('|')[0], peopleAdd)
					await kill.reply(from, mess.maked(), id)
				break

				case 'dono':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					await kill.reply(from, mess.owner(), id)
				break

				case 'cmd':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					await kill.reply(from, mess.cmd(), id)
					let cmdw = await shell.exec(`bash -c "${body.slice(5)}"`, {
						silent: true
					})
					if (cmdw.stdout == '') {
						await kill.reply(from, cmdw.stderr, id)
						console.log(cmdw.stderr)
					} else {
						await kill.reply(from, cmdw.stdout, id)
						console.log(cmdw.stdout)
					}
				break

				case 'mutepv':
					if (args.length == 0) return await kill.reply(from, mess.kldica2(), id)
					let pvmt = argl[0] == 'on' ? `${body.slice(11)}@c.us` : `${body.slice(12)}@c.us`
					if (isOwner) {
						if (argl[0] == 'on') {
							if (functions.silence.includes(pvmt)) return await kill.reply(from, mess.jadisabled(), id)
							functions.silence.push(pvmt)
							fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"))
							await kill.reply(from, mess.enabled(), id)
						} else if (argl[0] == 'off') {
							if (!functions.silence.includes(pvmt)) return await kill.reply(from, mess.jadisabled(), id)
							functions.silence.splice(pvmt, 1)
							fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"))
							await kill.reply(from, mess.disabled(), id)
						} else return await kill.reply(from, mess.kldica2(), id)
					} else return await kill.reply(from, mess.sodono())
				break

				case 'unblock':
					if (isOwner) {
						if (isGroupMsg && quotedMsg || isGroupMsg && mentionedJidList.length !== 0 || args.length !== 0) {
							const unblokea = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : args[0] + '@c.us')
							await kill.contactUnblock(`${unblokea}`)
							await kill.sendTextWithMentions(from, mess.unblock(unblokea))
						} else return await kill.reply(from, mess.semmarcar(), id)
					} else return await kill.reply(from, mess.sodono(), id)
				break

				case 'block':
					if (isOwner) {
						if (isGroupMsg && quotedMsg || isGroupMsg && mentionedJidList.length !== 0 || args.length !== 0) {
							const blokea = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : args[0] + '@c.us')
							await kill.contactBlock(`${blokea}`)
							await kill.sendTextWithMentions(from, mess.block(blokea))
						} else return await kill.reply(from, mess.semmarcar(), id)
					} else return await kill.reply(from, mess.sodono(), id)
				break

				case 'give':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					if (args.length <= 2 || argl[0] == 'coin' || argl[0] == 'level' || argl[0] == 'xp' || argl[0] == 'dima' || argl[0] == 'rubi') {
						if (mentionedJidList.length !== 0) xpUserGet = await kill.getContact(mentionedJidList[0])
						var userGainXp = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? xpUserGet.id : sender.id)
						var theValuetoAdd = quotedMsg ? args[1] : (mentionedJidList.length !== 0 ? args[2] : args[2])
						if (isNaN(theValuetoAdd)) return await kill.reply(from, mess.onlynumber(), id)
						tools('gaming').addValue(userGainXp, Number(theValuetoAdd), nivel, chatId, argl[0]);
						await kill.sendTextWithMentions(from, mess.gainxp(userGainXp, theValuetoAdd) + argl[0].toUpperCase() + '.')
					} else return await kill.reply(from, mess.semmarcar() + `\n\nEx: ${prefix}give -xp/-level/-coin @user <value/valor>`, id)
				break

				case 'botnome':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					if (body.slice(6).length >= 25) return await kill.reply(from, mess.letlimit() + '25.', id)
					await kill.setMyName(body.slice(6))
					await kill.reply(from, mess.maked(), id)
				break

				case 'recado':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					if (body.slice(8).length >= 250) return await kill.reply(from, mess.letlimit() + '250.', id)
					await kill.setMyStatus(body.slice(8))
					await kill.reply(from, mess.maked(), id)
				break

				case 'botfoto':
					if (isMedia && type == 'image' || isQuotedImage) {
						if (!isOwner) return await kill.reply(from, mess.sodono(), id)
						const bkmypic = await kill.getProfilePicFromServer(botNumber)
						if (typeof bkmypic == 'object' || !tools('others').isUrl(bkmypic)) {
							bkmypic = await kill.getProfilePicFromServer(randomMember)
							if (typeof bkmypic == 'object' || !tools('others').isUrl(bkmypic)) {
								bkmypic = errorImg
							}
						}
						await kill.sendFileFromUrl(from, bkmypic, '', 'Backup', id);
						let mediaData = await decryptMedia(encryptMedia)
						await kill.setProfilePic(mediaData)
						await kill.reply(from, mess.maked(), id)
					} else return await kill.reply(from, mess.onlyimg(), id)
				break

				case 'exec':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + `JS Code/Código.`, id);
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					try {
						eval(body.slice(6))
					} catch (error) {
						console.log(tools('others').color('[EXEC]', 'crimson'), tools('others').color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
					}
				break

				case 'resetall':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id)
					fs.writeFileSync('./lib/config/Utilidades/lolicon.txt', 'Lolicons ↓')
					fs.writeFileSync('./lib/config/Utilidades/reversecon.txt', 'Menores Denunciados ↓')
					fs.writeFileSync('./lib/config/Utilidades/entregados.txt', 'Auto-denuncias ↓')
					fs.writeFileSync('./lib/config/Utilidades/gaysreport.txt', 'LGTB\'S Denunciados ↓')
					fs.writeFileSync('./lib/config/Utilidades/crimereport.txt', 'Crimes Reportados ↓')
					await kill.reply(from, mess.maked(), id)
				break

				case 'nolimit':
					if (isOwner) {
						if (argl[0] == 'on') {
							fs.writeFileSync('./lib/config/Gerais/limit.json', JSON.stringify(JSON.parse("{\n\t\"games\": {},\n\t\"steal\": {},\n\t\"guild\": {},\n\t\"reward\": {}\n}"), null, "\t"));
							await kill.reply(from, mess.enabled(), id)
							objconfig.noLimits = 1
						} else if (argl[0] == 'off') {
							await kill.reply(from, mess.disabled(), id)
							objconfig.noLimits = 0
						} else return await kill.reply(from, mess.kldica2(), id)
					} else return await kill.reply(from, mess.sodono(), id)
				break

				case 'muteall':
					if (isOwner) {
						if (argl[0] == 'on') {
							objconfig.isMuteAll = 1;
							await kill.reply(from, mess.enabled(), id)
						} else if (argl[0] == 'off') {
							objconfig.isMuteAll = 0;
							await kill.reply(from, mess.disabled(), id)
						} else return await kill.reply(from, mess.kldica2(), id)
					} else return await kill.reply(from, mess.sodono(), id)
				break

				case 'noadms':
				case 'noadmin':
					if (isGroupMsg) {
						const groupOwnerz = sender.id === chat.groupMetadata.owner
						if (groupOwnerz || isOwner) {
							if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
							for (let noadms of groupAdmins) {
								if (noadms == groupOwnerz || config.Owner.includes(noadms) || noadms == botNumber) {
									console.log(tools('others').color('[VIP] - ', 'crimson'), noadms)
								} else return await kill.demoteParticipant(chatId, noadms)
							}
							await kill.reply(from, mess.maked(), id)
						} else return await kill.reply(from, mess.gpowner(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'alladms':
				case 'alladmin':
					if (isGroupMsg) {
						if (isGroupCreator || isOwner) {
							if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
							for (let alladmin of groupMembersId) {
								if (groupAdmins.includes(alladmin)) {
									console.log(tools('others').color('[JÁ ADM] - ', 'crimson'), alladmin)
								} else return await kill.promoteParticipant(chatId, alladmin)
							}
							await kill.reply(from, mess.maked(), id)
						} else return await kill.reply(from, mess.gpowner(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'reload':
					if (!isOwner) return await kill.reply(from, mess.sodono(), id);
					await kill.reply(from, mess.wait(), id)
					await kill.refresh()
					await kill.reply(from, mess.refreshed(), id)
				break

				case 'type':
					if (isOwner) {
						if (args.length == 0) return await kill.reply(from, mess.onoff(), id)
						if (argl[0] == 'on') {
							objconfig.isTyping.push(chatId)
							await kill.reply(from, mess.enabled(), id)
						} else if (argl[0] == 'off') {
							objconfig.isTyping.splice(chatId, 1)
							await kill.reply(from, mess.disabled(), id)
						} else return await kill.reply(from, mess.kldica2(), id)
					} else return await kill.reply(from, mess.sodono(), id)
				break

				case 'darkmode':
					if (isOwner) {
						if (args.length == 0) return await kill.reply(from, mess.onoff(), id)
						if (argl[0] == 'on') {
							await kill.darkMode(true)
							await kill.reply(from, mess.enabled(), id)
						} else if (argl[0] == 'off') {
							await kill.darkMode(false)
							await kill.reply(from, mess.disabled(), id)
						} else return await kill.reply(from, mess.kldica2(), id)
					} else return await kill.reply(from, mess.sodono(), id)
				break

				case 'upload':
					if (args.length !== 2) return await kill.reply(from, mess.filesend(), id)
					if (isOwner) {
						await kill.sendFile(from, args[0], args[1], '', id).catch(async (err) => {
							console.log(err)
							await kill.reply(from, mess.filexist(args), id)
						})
					} else return kill.reply(from, mess.sodono(), id)
				break

				case 'sticker':
				case 'fig':
				case 'figurinha':
				case 'stiker':
				case 'f':
				case 's':
				case 'stickergif':
				case 'gif':
				case 'g':
				case 'gifsticker':
					await kill.reply(from, mess.wait(), id)
					const sharpre = async (mimetype, isCircle, Cut, mediaData) => {
						let resizedImageBuffer = await sharp(mediaData).resize({
							width: 512,
							height: 512,
							fit: 'fill'
						})
						await kill.sendImageAsSticker(from, resizedImageBuffer, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: Cut,
							circle: isCircle
						})
					}
					if (isMedia && isImage || isQuotedImage) {
						let mediaData = await decryptMedia(encryptMedia)
						var isCircle = arks.includes('-circle') ? true : false
						var Cut = arks.includes('-cut') ? false : true
						if (arks.includes('-fill')) return await sharpre(encryptMedia.mimetype, isCircle, Cut, mediaData)
						await kill.sendImageAsSticker(from, mediaData, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: Cut,
							circle: isCircle
						})
					} else if (isMedia && isVideo || isGif || isQuotedVideo || isQuotedGif) {
						let mediaData = await decryptMedia(encryptMedia)
						await kill.sendMp4AsSticker(from, mediaData, null, {
							stickerMetadata: true,
							pack: config.Sticker_Pack,
							author: config.Sticker_Author,
							fps: config.Fig_FPS,
							crop: false,
							loop: 1
						}).catch(async () => {
							await kill.reply(from, mess.gifail(), id)
						})
					} else if (args.length == 1) {
						if (tools('others').isUrl(args[0])) {
							var isCircle = arks.includes('-circle') ? true : false
							var Cut = arks.includes('-cut') ? false : true
							await kill.sendStickerfromUrl(from, args[0], {
								method: 'get'
							}, {
								author: config.Sticker_Author,
								pack: config.Sticker_Pack,
								keepScale: Cut,
								circle: isCircle
							})
						} else return await kill.reply(from, mess.nolink(), id)
					} else return await kill.reply(from, mess.sticker(), id)
				break

				case 'ttp':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers | color (english).', id)
					await kill.reply(from, mess.wait(), id)
					let ttpstker = await text2png(wordwrap(arg.split('|')[0], {
						width: 20
					}), {
						font: '80px sans-serif',
						color: 'white',
						strokeWidth: 2,
						strokeColor: (arg.split('|')[1] || ' white').slice(1),
						textAlign: 'center',
						lineSpacing: 10,
						padding: 20,
						backgroundColor: 'transparent'
					})
					await kill.sendImageAsSticker(from, ttpstker, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'attp':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					await kill.reply(from, mess.wait(), id)
					let attp = await tools('attp').create(body.slice(6))
					await kill.sendImageAsSticker(from, attp, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'emoji':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'emoji.', id)
					let emoji = new EmojiAPI()
					await emoji.get(args[0]).then(async (emoji) => {
						await tools('others').sleep(3000)
						if (emoji.emoji == null) return await kill.reply(from, mess.noemoji(), id)
						await kill.reply(from, `Emoji: ${emoji.emoji}\n\nUnicode: ${emoji.unicode}\n\nNome: ${emoji.name}\n\nInformações: ${emoji.description}\n\n` + emoji.images.map(res => `${res.vendor} → ${res.url}\n\n`) + mess.emojis(), id)
						await kill.sendStickerfromUrl(from, emoji.images[0].url, {
							method: 'get'
						}, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					})
				break

				case 'getsticker':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					let filterAdu = isNsfw || isAntiPorn ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT
					const getSticker = await duck.search(body.slice(12), filterAdu)
					if (getSticker.length == 0) return await kill.sendFileFromUrl(from, errorImg, '', mess.noresult() + '\n\nTãn tãn tãn...', id)
					await kill.sendStickerfromUrl(from, tools('others').randVal(getSticker.map(c => c.image)), {
						method: 'get'
					}, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'wasted':
					try {
						await kill.reply(from, mess.wait(), id)
						if (isImage || isQuotedImage) {
							let mediaData = await decryptMedia(encryptMedia)
							var thePicWasted = await tools('cloud').upload(mediaData)
						} else {
							var thePicWasted = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
						}
						if (typeof thePicWasted == 'object' || !tools('others').isUrl(thePicWasted)) {
							thePicWasted = await kill.getProfilePicFromServer(randomMember)
							if (typeof thePicWasted == 'object' || !tools('others').isUrl(thePicWasted)) thePicWasted = personPhoto
						}
						await canvacord.Canvas.wasted(thePicWasted).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `wasted.png`, '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'trigger':
					try {
						await kill.reply(from, mess.wait(), id)
						if (isImage || isQuotedImage) {
							let mediaData = await decryptMedia(encryptMedia)
							var getTrigger = await tools('cloud').upload(mediaData)
						} else {
							var getTrigger = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
						}
						if (getTrigger == null || typeof getTrigger === 'object') {
							getTrigger = await kill.getProfilePicFromServer(randomMember)
							if (getTrigger == null || typeof getTrigger === 'object') getTrigger = errorImg
						}
						await canvacord.Canvas.trigger(getTrigger).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `trigger.png`, 'Run...', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

					/*LEMBRE-SE, REMOVER CRÈDITO È CRIME E PROIBIDO*/
				case 'about':
					await kill.sendFileFromUrl(from, 'https://i.ibb.co/cC5SPKZ/iris.png', 'iris.png', mess.about(), id)
					await kill.reply(from, mess.everhost(), id)
				break

				case 'nobg':
					if (isImage || isQuotedImage) {
						await kill.reply(from, mess.wait(), id)
						let mediaData = await decryptMedia(encryptMedia)
						var result = await removeBackgroundFromImageBase64({
							base64img: tools('others').dataURI(`${encryptMedia.mimetype}`, mediaData),
							apiKey: config.API_RemoveBG,
							size: 'auto',
							type: 'auto'
						})
						await kill.sendImageAsSticker(from, tools('others').dataURI(encryptMedia.mimetype, result.base64img), {
							pack: config.Sticker_Pack,
							author: config.Sticker_Author,
							keepScale: true
						})
						await kill.reply(from, mess.nobgms(), id)
					} else return await kill.reply(from, mess.onlyimg(), id)
				break

				case 'simg':
					try {
						if (isImage || isQuotedImage) {
							await kill.reply(from, mess.wait(), id)
							let mediaData = await decryptMedia(encryptMedia)
							const sImgUp = await tools('cloud').upload(mediaData)
							let googleRes = (await axios.get(`https://node-reverse-image-search.herokuapp.com/?imageUrl=${sImgUp}`)).data
							await kill.reply(from, googleRes.map(a => '\n' + a.title + '\n' + a.url + '\n').slice(1).toString().replace(/^\,/gm, ''), id)
						} else return await kill.reply(from, mess.onlyimg(), id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time) + '\n\nMaybe/Talvez...' + mess.upfail(), id)
					}
				break

				case 'upimg':
					try {
						if (isImage || isQuotedImage) {
							let mediaData = await decryptMedia(encryptMedia)
							const upImg = await tools('cloud').upload(mediaData)
							await kill.reply(from, mess.tempimg(upImg), id)
						} else return await kill.reply(from, mess.onlyimg(), id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time) + '\n\nMaybe/Talvez...' + mess.upfail(), id)
					}
				break

				case 'morte':
				case 'death':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'nomes/nombres/names.', id)
					const predea = await axios.get(`https://api.agify.io/?name=${encodeURIComponent(args[0])}`)
					if (predea.data.age == null) return await kill.reply(from, mess.validname(), id)
					await kill.reply(from, mess.death(predea), id)
				break

					/*Botei todas as Tags do Xvideos que achei*/
				case 'oculto':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await kill.sendTextWithMentions(from, mess.oculto(randomMember, tools('others').getRandLine(1, './lib/config/Utilidades/porn.txt')[0]))
				break

				case 'gender':
				case 'genero':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'nomes/nombres/names.', id)
					const seanl = await axios.get(`https://api.genderize.io/?name=${encodeURIComponent(args[0])}`)
					if (seanl.data.gender == null) return await kill.reply(from, mess.validname(), id)
					await kill.reply(from, mess.genero(seanl), id)
				break

				case 'detector':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await kill.reply(from, mess.wait(), id)
					await kill.sendTextWithMentions(from, mess.gostosa(randomMember))
				break

				case 'math':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'número & simbolos matematicos/numbers & mathematical symbols.', id)
					try {
						await kill.reply(from, `${body.slice(6)}\n\n*=*\n\n${math.evaluate(body.slice(6))}`, id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.onlynumber() + '\nUse	+	-	*	/' + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'inverter':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					await kill.reply(from, `${body.slice(10).split('').reverse().join('')}`, id)
				break

				case 'contar':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					await kill.reply(from, mess.contar(body, args), id)
				break

				case 'giphy':
					if (!tools('others').isUrl(args[0])) return await kill.reply(from, mess.nolink(), id)
					const isGiphy = args[0].match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
					const isMediaGiphy = args[0].match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
					if (isGiphy) {
						const getGiphyCode = args[0].match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
						if (!getGiphyCode) return await kill.reply(from, mess.fail(command, error, time) + '\n\nGiphy site error.', id)
						await kill.sendGiphyAsSticker(from, `https://media.giphy.com/media/${getGiphyCode[0].replace(/[-\/]/gi, '')}/giphy-downsized.gif`)
					} else if (isMediaGiphy) {
						const gifUrl = args[0].match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
						if (!gifUrl) return await kill.reply(from, mess.fail(command, error, time) + '\n\nGiphy site error.', id)
						await kill.sendGiphyAsSticker(from, args[0].replace(gifUrl[0], 'giphy-downsized.gif'))
					} else return await kill.reply(from, mess.nolink(), id)
				break

				case 'msg':
				case 'print':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					await kill.sendText(from, `${args.join(' ')}`)
				break

				case 'id':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await kill.reply(from, mess.idgrupo(chatId), id)
				break

					/*LEMBRE-SE, REMOVER CREDITO E CRIME E PROIBIDO*/
				case 'legiao':
					if (isGroupMsg) return await kill.reply(from, mess.sopv(), id)
					await kill.sendLinkWithAutoPreview(from, 'https://bit.ly/BOT-IRIS', '\nEsse grupo é apenas a recepção do grupo Legião Z e não é para suporte da Íris, responda as perguntas na descrição e aguarde pela chegada de um administrador para te adicionar.\nPessoas banidas não serão re-adicionadas!')
				break

				case 'water':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
					await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
					try {
						await maker.textpro('https://textpro.me/dropwater-text-effect-872.html', body.slice(6)).then(async (data) => {
							await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'img':
					if (isQuotedSticker) {
						await kill.reply(from, mess.wait(), id)
						let mediaData = await decryptMedia(encryptMedia)
						await kill.sendFile(from, tools('others').dataURI(quotedMsg.mimetype, mediaData), 'sticker.png', 'e.e', id)
					} else return await kill.reply(from, mess.onlyst(), id)
				break

				case 'randomanime':
					const nime = await axios.get('https://nekos.life/api/v2/img/wallpaper')
					await kill.sendFileFromUrl(from, `${nime.data.url}`, ``, 'e.e', id)
				break

				case 'frase':
					const aiquote = await axios.get("https://inspirobot.me/api?generate=true")
					await kill.sendFileFromUrl(from, aiquote.data, 'quote.jpg', '~Ok...?~\n\n❤️', id)
				break

				case 'make':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					const diary = await axios.get(`https://st4rz.herokuapp.com/api/nulis?text=${encodeURIComponent(body.slice(6))}`)
					await kill.sendImage(from, `${diary.data.result}`, '', mess.diary(), id)
				break

				case 'neko':
					const neko = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["kemonomimi", "neko", "ngif", "fox_girl"])}`)
					await kill.sendFileFromUrl(from, `${neko.data.url}`, ``, `🌝`, id)
				break

				case 'image':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					let filterP = isNsfw || isAntiPorn ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT
					const getImage = await duck.search(body.slice(7), filterP)
					if (getImage.length == 0) return await kill.sendFileFromUrl(from, errorImg, '', 'Tãn tãn tãn...', id)
					await kill.sendFileFromUrl(from, tools('others').randVal(getImage.map(c => c.image)), '', ';)', id)
				break

				case 'yaoi':
					let filterH = isNsfw || isAntiPorn ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT
					const iHateYaoi = await duck.search('yaoi', filterH)
					if (iHateYaoi.length == 0) return await kill.sendFileFromUrl(from, errorImg, '', 'Tãn tãn tãn...', id)
					await kill.sendFileFromUrl(from, tools('others').randVal(iHateYaoi.map(c => c.image)), '', ';)', id)
				break

					/*Adicione mais no arquivo fml.txt na pasta config, obs, em inglês*/
				case 'life':
					if (region == 'en') return await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/fml.txt')[0], id)
					await translate(tools('others').getRandLine(1, './lib/config/Utilidades/fml.txt')[0], {
						to: region
					}).then(async (lfts) => {
						await kill.reply(from, lfts.text, id)
					})
				break

				case 'fox':
					const fox = await axios.get(`https://some-random-api.ml/img/fox`)
					await kill.sendFileFromUrl(from, fox.data.link, ``, '🥰', id)
				break

				case 'wiki':
					try {
						if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
						const wikip = await axios.get(`https://${region}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(body.slice(6))}&prop=info&inprop=url`)
						const wikis = await axios.get(`https://${region}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${wikip.data.query.search[0].pageid}`)
						await kill.reply(from, wikis.data.query.pages[Object.keys(wikis.data.query.pages)].extract, id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.noresult() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'nasa':
					const needsTime = args.length !== 0 && argl[0] == '-data' ? `&date=${encodeURIComponent(args[1])}` : '&'
					const nasa = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${config.API_NASA}${needsTime}`)
					if (region == 'en') {
						if (nasa.data.media_type == 'image') {
							await kill.sendFileFromUrl(from, nasa.data.url, '', `\n${nasa.data.date} → ${nasa.data.title}\n\n${nasa.data.explanation}`, id)
						} else await kill.sendYoutubeLink(from, nasa.data.url, `${nasa.data.date} → ${nasa.data.title}\n\n${nasa.data.explanation}`)
					} else {
						await translate(nasa.data.explanation, {
							to: region
						}).then(async (result) => {
							if (nasa.data.media_type == 'image') {
								await kill.sendFileFromUrl(from, nasa.data.url, '', `\n${nasa.data.date} → ${nasa.data.title}\n\n${result.text}`, id)
							} else await kill.sendYoutubeLink(from, nasa.data.url, `${nasa.data.date} → ${nasa.data.title}\n\n${result.text}`)
						})
					}
				break

				case 'stalkig':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'instagram usernames.', id)
					const ig = (await axios.get(`https://www.instagram.com/${encodeURIComponent(body.slice(9))}/?__a=1`)).data
					if (JSON.stringify(ig) == '{}') return await kill.reply(from, mess.noresult(), id)
					await kill.sendFileFromUrl(from, `${ig.data.graphql.user.profile_pic_url}`, ``, mess.insta(ig), id)
				break

				case 'fatos':
					const animl = await axios.get(`https://some-random-api.ml/facts/${tools('others').randVal(["dog", "cat", "bird", "panda", "fox", "koala"])}`)
					if (region == 'en') return await kill.reply(from, animl.data.fact, id)
					await translate(animl.data.fact, {
						to: region
					}).then(async (result) => {
						await kill.reply(from, result.text, id)
					})
				break

				case 'sporn':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					if (args.length == 0) return await kill.reply(from, mess.noargs(), id)
					const xxxSearch = await XVDL.search(body.slice(7))
					const sPornX = await XVDL.getInfo(xxxSearch.videos[0].url)
					await kill.sendFileFromUrl(from, `${xxxSearch.videos[0].thumbnail.static}`, '', mess.sporn(xxxSearch, sPornX), id)
				break

				case 'xvideos':
					try {
						if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
						if (args.length == 0 || !tools('others').isUrl(args[0]) || !args[0].includes('xvideos.com')) return await kill.reply(from, mess.nolink(), id)
						await kill.reply(from, mess.wait(), id)
						let sPornD = await XVDL.getInfo(args[0])
						await kill.sendFileFromUrl(from, `${sPornD.streams.lq}`, 'xvideos.mp4', `🌚`, id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.nolink() + mess.fail(command, error, time), id)
					}
				break

				case 'downvideo':
					if (args.length == 0 || !tools('others').isUrl(args[0])) return await kill.reply(from, mess.nolink(), id)
					try {
						await kill.reply(from, mess.wait(), id)
						const vdoClip = await tools('youtube').downVideo(args[0])
						if (vdoClip instanceof Error) {
							await kill.reply(from, mess.verybig() + mess.fail(command, vdoClip, time), id)
							tools('others').reportConsole(command, vdoClip)
						} else await kill.sendFileFromUrl(from, vdoClip, `downloads.mp4`, `e.e`, id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.verybig() + mess.fail(command, error, time), id)
					}
				break

					/*Isso e o de cima somente funciona se o local não precisar de um login.*/
				case 'downaudio':
					if (args.length == 0 || !tools('others').isUrl(args[0])) return await kill.reply(from, mess.nolink(), id)
					await kill.reply(from, mess.wait(), id)
					const ytPlayer = await tools('youtube').downPlay(args[0])
					if (ytPlayer instanceof Error) {
						await kill.reply(from, mess.verybig() + mess.fail(command, ytPlayer, time), id)
						tools('others').reportConsole(command, ytPlayer)
					} else {
						await kill.sendPtt(from, ytPlayer, id)
						tools('others').clearFile(ytPlayer)
					}
				break

					/*Se obter erros com o 'replace' apague a "${sender.id.replace('@c.us', '')}" de todos os comandos de download que o possuem.*/
				case 'play':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Títulos do YouTube/YouTube Titles.', id)
					await kill.reply(from, mess.wait(), id)
					const ytres = await ytsearch(`${body.slice(6)}`)
					await kill.sendYoutubeLink(from, `${ytres.all[0].url}`, '\n' + mess.play(ytres))
					const playMusic = await tools('youtube').downPlay(`https://youtu.be/${ytres.all[0].videoId}`)
					if (playMusic instanceof Error) {
						await kill.reply(from, mess.verybig() + mess.fail(command, playMusic, time), id)
						tools('others').reportConsole(command, playMusic)
					} else {
						await kill.sendPtt(from, playMusic, id)
						tools('others').clearFile(playMusic)
					}
				break

				case 'video':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Títulos do YouTube/YouTube Titles.', id)
					try {
						await kill.reply(from, mess.wait(), id)
						const vipres = await ytsearch(`${body.slice(7)}`)
						await kill.sendYoutubeLink(from, `${vipres.all[0].url}`, '\n' + mess.play(vipres))
						const ytClip = await tools('youtube').downVideo(`https://www.youtube.com/watch?v=${vipres.all[0].videoId}`)
						if (ytClip instanceof Error) {
							await kill.reply(from, mess.verybig() + mess.fail(command, ytClip, time), id)
							tools('others').reportConsole(command, ytClip)
						} else {
							await kill.sendFileFromUrl(from, ytClip, `${vipres.all[0].title}.mp4`, `${vipres.all[0].title}`, id)
						}
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.verybig() + mess.fail(command, error, time), id)
					}
				break

				case 'ytsearch':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Títulos do YouTube/YouTube Titles.', id)
					await kill.reply(from, mess.wait(), id)
					const ytvrz = await ytsearch(`${body.slice(10)}`)
					await kill.sendYoutubeLink(from, `${ytvrz.all[0].url}`, '\n' + mess.play(ytvrz))
				break

				case 'qr':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					await kill.sendFileFromUrl(from, `https://api.qrserver.com/v1/create-qr-code/?data=${body.slice(4)}`, '', mess.maked(), id)
				break

				case 'readqr':
					try {
						if (isImage || isQuotedImage) {
							let mediaData = await decryptMedia(encryptMedia)
							const upQrCode = await tools('cloud').upload(mediaData)
							const getQrText = await axios.get(`https://api.qrserver.com/v1/read-qr-code/?fileurl=${upQrCode}`)
							if (getQrText.data[0].symbol[0].data == null) return await kill.reply(from, 'Not a QR - Não é um QR.\n\nOu erro - Or error.', id)
							await kill.reply(from, `→ ${getQrText.data[0].symbol[0].data}`, id)
						} else return await kill.reply(from, mess.onlyimg() + '\nQR-Code!', id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time) + '\n\nMaybe/Talvez...' + mess.upfail(), id)
					}
				break

				case 'send':
					try {
						if (args.length == 0 || !tools('others').isUrl(args[0])) return await kill.reply(from, mess.nolink(), id)
						await kill.sendFileFromUrl(from, args[0], '', '', id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time) + '\n\nMaybe/Talvez...' + mess.onlyimg(), id)
					}
				break

				case 'quote':
					if (args.length <= 1 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
					await kill.reply(from, mess.wait(), id)
					const quoteimg = await axios.get(`https://terhambar.com/aw/qts/?kata=${encodeURIComponent(arg.split('|')[0])}&author=${encodeURIComponent(arg.split('|')[1])}&tipe=random`)
					await kill.sendFileFromUrl(from, `${quoteimg.data.result}`, '', 'Compreensível.', id)
				break


				case 'translate':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'idioma/language & words/palavras ou/or marca/mark a message/mensagem.', id)
					await kill.reply(from, mess.wait(), id)
					try {
						await translate((quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : body.slice(14)), {
							to: args[0]
						}).then(async (result) => {
							await kill.reply(from, `→ ${result.text}`, id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.ttsiv() + '\n\nOu' + mess.gblock() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'tts':
					if (args.length <= 1) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					try {
						let placet = `./lib/media/audio/tts[${argl[0]}]-${tools('others').randomString(10)}.mp3`
						await tts(argl[0]).save(placet, body.slice(8), async () => {
							await kill.sendPtt(from, placet, id)
							tools('others').clearFile(placet)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.ttsiv() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'idiomas':
					await kill.reply(from, mess.idiomas(), id)
				break

				case 'resposta':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers/emojis/etc.', id)
					fs.appendFile('./lib/config/Utilidades/reply.txt', `\n${body.slice(10)}`)
					await kill.reply(from, mess.maked(), id)
				break

				case 'criador':
					await kill.reply(from, `☀️ - Host: https://wa.me/${config.Owner[0].replace('@c.us', '')}\n🌙 - Dev: Lucas R. - KillovSkyᴸᶻ [http://bit.ly/BOT-IRIS]\n\n${mess.everhost()}`, id)
				break

				case 'akinator':
				case 'aki':
					let startAki = async () => {
						global.aki = new Aki({region})
						await aki.start()
						objconfig.akistarted = 1
					}
					if (objconfig.akistarted == 0) {
						await startAki()
					}
					try {
						if (argl[0] == '-r') {
							if (!args[1].match(/^[0-9]+$/)) return await kill.reply(from, mess.aki(), id)
							await aki.step(args[1])
							objconfig.jogadas++
							if (aki.progress >= config.Akinator_Win || aki.currentStep >= config.Akinator_Win) {
								await aki.win()
								await kill.sendFileFromUrl(from, `${aki.answers[0].absolute_picture_path}`, '', mess.akiwon(aki, aki.answers[0]), id)
							} else await kill.reply(from, mess.akistart(aki), id)
						} else if (argl[0] == '-new') {
							await startAki()
							objconfig.jogadas = 0
							await kill.reply(from, mess.akistart(aki), id)
						} else if (argl[0] == '-back') {
							if (isNaN(argl[1])) return await kill.reply(from, `Especifique a quantidade de jogadas que deseja voltar, se deseja criar um novo jogo use "-new".\nVocê fez ${objconfig.jogadas} jogadas.`, id)
							for (let i = 0; i < Number(argl[1]); i++) {
								await aki.back()
							}
							objconfig.jogadas = 0
							await kill.reply(from, mess.akistart(aki), id)
						} else return await kill.reply(from, mess.akistart(aki), id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.akifail() + mess.fail(command, error, time), id)
						objconfig.akistarted = 0
						objconfig.jogadas = 0
					}
				break

					/*Se quiser adicione respostas na reply.txt ou use o comando '/resposta', Íris também consegue adicionar ela mesma sozinha*/
				case 'iris':
					if (args.length == 0) return await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], id)
					try {
						if (argl[0] == '-g') {
							let awnser = await shell.exec(`bash -c "grep -i '${args[1]}' './lib/config/Utilidades/reply.txt' | shuf -n 1"`, {
								silent: true
							}).stdout
							if (awnser == '') {
								await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], id)
							} else return await kill.reply(from, awnser, id)
						} else {
							const iris = await axios.get(`${config.SimSimi_Host}?key=${tools('others').randVal(config.API_SimSimi)}&lc=${region}&text=${encodeURIComponent(body.slice(6))}`)
							if (iris.data.result !== '100') {
								await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], id)
							} else {
								await kill.reply(from, iris.data.response, id)
								fs.appendFile('./lib/config/Utilidades/reply.txt', `\n${iris.data.response}`)
							}
						}
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'speak':
					try {
						const sppt = require('node-gtts')(region)
						let speakttplc = `./lib/media/audio/speak[${region}]-${tools('others').randomString(10)}.mp3`
						if (args.length == 0) return await sppt.save(speakttplc, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], async function() {
							await kill.sendPtt(from, speakttplc, id)
							tools('others').clearFile(speakttplc)
						})
						if (argl[0] == '-g') {
							let voiceaw = await shell.exec(`bash -c "grep -i '${args[1]}' './lib/config/Utilidades/reply.txt' | shuf -n 1"`, {
								silent: true
							}).stdout
							if (voiceaw == '') {
								await sppt.save(speakttplc, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], async function() {
									await kill.sendPtt(from, speakttplc, id)
								})
							} else return await sppt.save(speakttplc, voiceaw, async function() {
								await kill.sendPtt(from, speakttplc, id)
							})
						} else {
							const spiris = await axios.get(`${config.SimSimi_Host}?key=${tools('others').randVal(config.API_SimSimi)}&lc=${region}&text=${encodeURIComponent(body.slice(6))}`)
							if (spiris.data.result !== '100') {
								await sppt.save(speakttplc, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], async function() {
									await kill.sendPtt(from, speakttplc, id)
								})
							} else {
								await sppt.save(speakttplc, spiris.data.result, async function() {
									await kill.sendPtt(from, speakttplc, id)
									fs.appendFile('./lib/config/Utilidades/reply.txt', `\n${spiris.data.result}`)
								})
							}
						}
						tools('others').clearFile(speakttplc)
					} catch (error) {
						tools('others').reportConsole(command, error)
						tools('others').clearFile(speakttplc)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'curiosidade':
					try {
						if (argl[0] == '-g') {
							let curist = await shell.exec(`bash -c "grep -i "${args[1]}" lib/config/Utilidades/curiosidades.txt | shuf -n 1"`, {
								silent: true
							}).stdout
							if (curist == '') {
								await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/curiosidades.txt')[0], id)
							} else return await kill.reply(from, curist, id)
						} else return await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/curiosidades.txt')[0], id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'trecho':
					try {
						if (argl[0] == '-g') {
							let trecd = await shell.exec(`bash -c "grep -i "${args[1]}" lib/config/Utilidades/frases.txt | shuf -n 1"`, {
								silent: true
							}).stdout
							if (trecd == '') {
								await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/frases.txt')[0], id)
							} else return await kill.reply(from, trecd, id)
						} else return await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/frases.txt')[0], id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'roll':
					await kill.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + tools('others').randomNumber(1, 6) + '.png', {
						method: 'get'
					}, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'rolette':
				case 'roleta':
					if (!isxp) return await kill.reply(from, mess.needxpon(), id)
					if (tools('gaming').isLimit(sender.id, daily, 'games')) return await kill.reply(from, mess.limitgame(), id)
					const gamerRol = parseInt(tools('gaming').getValue(sender.id, nivel, chatId, 'coin'))
					if (isNaN(args[0]) || !tools('others').isInt(args[0]) || Number(args[0]) >= gamerRol) return await kill.reply(from, mess.gaming(gamerRol), id)
					var iRoll = tools('others').randomNumber(config.Iris_Coin, gamerRol * 2)
					if (tools('others').randomNumber(1, 2) == 1) {
						await kill.sendFileFromUrl(from, 'https://i.ibb.co/vQj6nq4/roleta1.png', 'rol1.png', mess.loseshot(iRoll), id)
						tools('gaming').addValue(sender.id, Number(-iRoll), nivel, chatId, 'coin')
					} else {
						await kill.sendFileFromUrl(from, 'https://i.ibb.co/PwKR2nR/roleta.jpg', 'rol.jpg', mess.winshot(iRoll), id)
						tools('gaming').addValue(sender.id, Number(iRoll), nivel, chatId, 'coin')
					}
					if (objconfig.noLimits == 0) return tools('gaming').addLimit(sender.id, daily, 'games')
				break

				case 'flip':
					if (!isxp) return await kill.reply(from, mess.needxpon(), id)
					if (tools('gaming').isLimit(sender.id, daily, 'games') == 1) return await kill.reply(from, mess.limitgame(), id)
					const gamerFlip = parseInt(tools('gaming').getValue(sender.id, nivel, chatId, 'coin'))
					if (isNaN(args[1]) || !tools('others').isInt(args[1]) || Number(args[1]) >= gamerFlip) return await kill.reply(from, mess.gaming(gamerFlip), id)
					var iFlip = tools('others').randomNumber(config.Iris_Coin, gamerFlip * 2)
					let flipSor = await tools('others').randomNumber(1, 2) == 1
					if (argl[0] == 'cara' && flipSor == 1) {
						await kill.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png', {
							method: 'get'
						}, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
						await kill.reply(from, mess.flipwin(iFlip) + ' "cara".', id)
						tools('gaming').addValue(sender.id, Number(iFlip), nivel, chatId, 'coin')
					} else if (argl[0] == 'coroa' && flipSor == 2) {
						await kill.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png', {
							method: 'get'
						}, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
						await kill.reply(from, mess.flipwin(iFlip) + ' "coroa".', id)
						tools('gaming').addValue(sender.id, Number(iFlip), nivel, chatId, 'coin')
					} else if (argl[0] == 'coroa' || argl[0] == 'cara') {
						await kill.reply(from, mess.fliplose(iFlip) + ` "${argl[0]}".`, id)
						tools('gaming').addValue(sender.id, Number(-iFlip), nivel, chatId, 'coin')
					} else return await kill.reply(from, mess.fliphow(), id)
					if (objconfig.noLimits == 0) return tools('gaming').addLimit(sender.id, daily, 'games')
				break

				case 'cassino':
					if (!isxp) return await kill.reply(from, mess.needxpon(), id)
					if (tools('gaming').isLimit(sender.id, daily, 'games') == 1) return await kill.reply(from, mess.limitgame(), id)
					const gamerCas = parseInt(tools('gaming').getValue(sender.id, nivel, chatId, 'coin'))
					if (isNaN(args[0]) || !tools('others').isInt(args[0]) || Number(args[0]) >= gamerCas) return await kill.reply(from, mess.gaming(gamerCas), id)
					var iCass = tools('others').randomNumber(config.Iris_Coin, gamerCas * 2)
					var cassin = ['- 🍒 ', '- 🎃 ', '- 🍐 ']
					var cassinend = tools('others').randVal(cassin) + tools('others').randVal(cassin) + tools('others').randVal(cassin) + '-'
					if (cassinend == '- 🍒 - 🍒 - 🍒 -' || cassinend == '- 🍐 - 🍐 - 🍐 -' || cassinend == '- 🎃 - 🎃 - 🎃 -') {
						tools('gaming').addValue(sender.id, Number(iCass), nivel, chatId, 'coin')
						await kill.reply(from, mess.caswin(cassinend, Number(iCass)), id)
					} else {
						tools('gaming').addValue(sender.id, Number(-iCass), nivel, chatId, 'coin')
						await kill.reply(from, mess.caslose(cassinend, Number(iCass)), id)
					}
					if (objconfig.noLimits == 0) return tools('gaming').addLimit(sender.id, daily, 'games')
				break

				case 'poll':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await tools('poll').get(kill, message, pollfile)
				break

				case 'vote':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await tools('poll').vote(kill, message, args[0], pollfile)
				break

				case 'newpoll':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					if (argl[0] == '-delete') {
						tools('others').clearFile(pollfile, 1000)
						await kill.reply(from, `Votação cancelada e excluida.`, id)
					} else {
						await tools('poll').create(kill, message, pollfile, arg.split('|'))
					}
				break

				case 'ins':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await tools('poll').add(kill, message, body.slice(5), pollfile, isGroupAdmins)
				break

				case 'macaco':
				case 'monkey':
					await kill.sendFileFromUrl(from, `https://source.unsplash.com/featured/?monkey,monkey`, "result.jpg", "🙏\n~Brazil loves monkey soup~.", id)
				break

				case 'ball':
					const ball = await axios.get('https://nekos.life/api/v2/img/8ball')
					await kill.sendStickerfromUrl(from, ball.data.url, {
						method: 'get'
					}, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'cafune':
					const cfnean = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["pat", "cuddle", "poke"])}`)
					if (cfnean.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(cfnean, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, cfnean.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'quack':
					const patu = await axios.get('https://nekos.life/api/v2/img/goose')
					await kill.sendFileFromUrl(from, patu.data.url, '', '', id)
				break

				case 'poke':
					const pokean = await axios.get('https://nekos.life/api/v2/img/poke')
					await kill.sendStickerfromUrl(from, pokean.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'cocegas':
					const cocegas = await axios.get('https://nekos.life/api/v2/img/tickle')
					if (cocegas.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(nekons, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, cocegas.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'food':
					const feed = await axios.get('https://nekos.life/api/v2/img/tickle')
					await kill.sendStickerfromUrl(from, feed.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'baka':
					let bakaYaro = await axios.get("https://nekos.life/api/v2/img/baka")
					if (bakaYaro.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(bakaYaro, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, bakaYaro.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'lizard':
					const lizard = await axios.get('https://nekos.life/api/v2/img/lizard')
					await kill.sendFileFromUrl(from, lizard.data.url, '', '', id)
				break

				case 'duck':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					await kill.reply(from, mess.wait(), id)
					ddg.search({
						q: body.slice(8),
						max: config.Search_Results
					}, async (err, urls) => {
						if (err) return await kill.reply(from, mess.noresult(), id)
						await kill.reply(from, '🦆 - ' + urls.join('\n\n🦆 - '), id)
					})
				break

				case 'clima':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'city names/nomes de cidade/nombres de ciudad.', id)
					const clima = await axios.get(`https://pt.wttr.in/${encodeURIComponent(body.slice(7))}?format=Cidade%20=%20%l+\n\nEstado%20=%20%C+%c+\n\nTemperatura%20=%20%t+\n\nUmidade%20=%20%h\n\nVento%20=%20%w\n\nLua agora%20=%20%m\n\nNascer%20do%20Sol%20=%20%S\n\nPor%20do%20Sol%20=%20%s`)
					await kill.sendFileFromUrl(from, `https://wttr.in/${encodeURIComponent(body.slice(7))}.png`, '', mess.wttr(clima), id)
				break

				case 'boy':
					await kill.sendFileFromUrl(from, 'https://source.unsplash.com/featured/?boy,man', "result.jpg", "😍", id)
				break

				case 'aptoide':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'app name/Nome do App/Nombre de aplicación.', id)
					const aptoide = await axios.get(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(body.slice(9))}&trusted=true`)
					if (aptoide.data.datalist.total == 0) return await kill.reply(from, mess.noresult(), id)
					await kill.sendFileFromUrl(from, `${aptoide.data.datalist.list[0].graphic}`, 'aptoide.png', mess.aptoide(aptoide.data.datalist.list[0], (aptoide.data.datalist.list[0].size / 1048576).toFixed(1)), id)
				break

				case 'girl':
					await kill.sendFileFromUrl(from, 'https://source.unsplash.com/featured/?girl,woman', "result.jpg", "😍", id)
				break

				case 'anime':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'anime name/nome do anime/nombre de anime.', id)
					const getAnime = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(body.slice(7))}&limit=1`)
					if (getAnime.data.status == 404 || getAnime.data.results[0] == '') return await kill.sendFileFromUrl(from, errorurl, 'error.png', mess.noresult())
					if (region == 'en') return await kill.sendFileFromUrl(from, `${getAnime.data.results[0].image_url}`, 'anime.jpg', `✔️ - Is that?\n\n✨️ *Title:* ${getAnime.data.results[0].title}\n\n🎆️ *Episode:* ${getAnime.data.results[0].episodes}\n\n💌️ *Rating:* ${getAnime.data.results[0].rated}\n\n❤️ *Note:* ${getAnime.data.results[0].score}\n\n💚️ *Synopsis:* ${getAnime.data.results[0].synopsis}\n\n🌐️ *Link*: ${getAnime.data.results[0].url}`, id)
					await translate(getAnime.data.results[0].synopsis, {
						to: region
					}).then(async (syno) => {
						await kill.sendFileFromUrl(from, `${getAnime.data.results[0].image_url}`, 'anime.jpg', mess.getanime(syno.text, getAnime), id)
					})
				break

				case 'manga':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'manga name/nome do manga/nombre de manga.', id)
					const getManga = await axios.get(`https://api.jikan.moe/v3/search/manga?q=${encodeURIComponent(body.slice(7))}&limit=1`)
					if (getManga.data.status == 404 || getManga.data.results[0] == '') return await kill.sendFileFromUrl(from, errorurl, 'error.png', mess.noresult())
					if (region == 'en') return await kill.sendFileFromUrl(from, `${getManga.data.results[0].image_url}`, 'manga.jpg', `✔️ - Is that?\n\n✨️ *Title:* ${getManga.data.results[0].title}\n\n🎆️ *Chapters:* ${getManga.data.results[0].chapters}\n\n💌️ *Volumes:* ${getManga.data.results[0].volumes}\n\n❤️ *Note:* ${getManga.data.results[0].score}\n\n💚️ *Synopsis:* ${getManga.data.results[0].synopsis}\n\n🌐️ *Link*: ${getManga.data.results[0].url}`, id)
					await translate(getManga.data.results[0].synopsis, {
						to: region
					}).then(async (syno) => {
						await kill.sendFileFromUrl(from, `${getManga.data.results[0].image_url}`, 'manga.jpg', mess.getmanga(syno.text, getManga), id)
					})
				break

				case 'nh':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					await hentao(args, kill, message)
				break

				case 'profile':
				case 'perfil':
					if (isGroupMsg) {
						await kill.reply(from, mess.wait(), id)
						var qmid = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? await kill.getContact(mentionedJidList[0]).id : sender.id)
						let peoLevel = tools('gaming').getValue(qmid, nivel, chatId, 'level')
						var pic = await kill.getProfilePicFromServer(qmid)
						let pfp = pic.includes('ERR') || pic == null || typeof pic === 'object' || !tools('others').isUrl(pic) ? errorurl : pic
						var namae = (quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? await kill.getContact(mentionedJidList[0]).pushname : pushname)) || "Censored by Government"
						var sts = await kill.getStatus(qmid)
						let status = sts.status == '' || sts.status == '401' ? sts.status = '' : sts.status = `\n\n💌️ *Frase do recado?*\n${sts.status}`
						let customTexts = {
							customRec: '',
							GodKillsToo: '',
							fuckALLife: '',
							getGirlfriend: '',
							myGuild: '',
							stateOrigin: '\n\n👪 *Clã:* '
						}
						try {
							if (config.Language == 'en') throw new Error('Tradução cancelada pois o BOT ta em gringanês')
							await translate(tools('others').getRandLine(1, './lib/config/Utilidades/biblia.txt')[0], {
								to: region
							}).then((bibles) => {
								customTexts.GodKillsToo = bibles.text
							})
							await translate(tools('others').getRandLine(1, './lib/config/Utilidades/fml.txt')[0], {
								to: region
							}).then((lifes) => {
								customTexts.fuckALLife = lifes.text
							})
							await translate(tools('others').getRandLine(1, './lib/config/Utilidades/cantadas.txt')[0], {
								to: region
							}).then((love) => {
								customTexts.getGirlfriend = love.text
							})
						} catch (error) {
							customTexts.fuckALLife = tools('others').getRandLine(1, './lib/config/Utilidades/fml.txt')[0]
							customTexts.GodKillsToo = tools('others').getRandLine(1, './lib/config/Utilidades/biblia.txt')[0]
							customTexts.getGirlfriend = tools('others').getRandLine(1, './lib/config/Utilidades/cantadas.txt')[0]
						}
						customTexts.myGuild = tools('gaming').getValue(sender.id, nivel, chatId, 'guild') !== '' ? `\n\n⚔️ *Guilda:* ${(tools('gaming').getValue(sender.id, nivel, chatId, 'guild')).toUpperCase()}` : ''
						for (let i of await kill.getAllGroups()) {
							if (i.groupMetadata.participants.map(m => m.id._serialized).includes(qmid)) {
								customTexts.stateOrigin += `\n➸ ${i.name}`
							}
						}
						Object.keys(custom).forEach((i) => {
							if (custom[i][sender.id] == qmid) {
								customTexts.customRec = `\n\n🌟 *Nota:* ${custom[i].msg}`
							}
						})
						let profileSend = mess.profile(namae, tools('gaming').getValue(qmid, nivel, chatId, 'msg'), groupAdmins.includes(qmid) ? tools('others').yesAwnsers() : tools('others').noAwnsers(), functions.silence.includes(qmid) ? tools('others').yesAwnsers() : tools('others').noAwnsers(), blockNumber.includes(qmid) ? tools('others').yesAwnsers() : tools('others').noAwnsers(), status, peoLevel, tools('gaming').getValue(qmid, nivel, chatId, 'xp'), tools('gaming').LevelEXP(peoLevel), tools('gaming').getPatent(peoLevel)) + `\n\n💴 *Í-Coin*: ${tools('gaming').getValue(qmid, nivel, chatId, 'coin')}\n\n🏷️ *TAG:* #${tools('others').getRandLine(1, './lib/config/Utilidades/porn.txt')[0]}‎\n\n❇️ *Arma:* ${tools('others').getRandLine(1, './lib/config/Utilidades/armas.txt')[0]}‎\n\n📢 *Inspire-se:* ${tools('others').getRandLine(1, './lib/config/Utilidades/frases.txt')[0]}‎\n\n💡 *Aprenda:* ${tools('others').getRandLine(1, './lib/config/Utilidades/curiosidades.txt')[0]}‎\n\n🐏 *Versículo:* ${customTexts.GodKillsToo}\n\n🔮 *Futuro:* ${customTexts.fuckALLife}‎\n\n🌺 *Cantada:* ${customTexts.getGirlfriend}\n\n🐂 *Tipo:* ${tools('others').getRandLine(1, './lib/config/Utilidades/corno.txt')[0]}` + customTexts.customRec + customTexts.myGuild + customTexts.stateOrigin
						await kill.sendFileFromUrl(from, pfp, 'pfo.jpg', profileSend, id).catch(async () => {
							await kill.reply(from, profileSend, id)
						})
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'brainly':
					const brain = new Brainly(region)
					let resBrainl = await brain.searchWithMT(region, body.slice(9))
					if (resBrainl.length == 0) return await kill.reply(from, mess.noresult(), id)
					if (resBrainl[0].question.attachments.length > 0) {
						await kill.sendFileFromUrl(from, resBrainl[0].question.attachments[0], 'brainly.jpg', mess.brainlyres(resBrainl[0].question), id)
					} else return await kill.reply(from, mess.brainlyres(resBrainl[0].question), id)					
				break

				case 'store':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'app name/Nome do App/Nombre de aplicación.', id)
					await kill.reply(from, mess.wait(), id)
					let storeInfo = await store.search(`${body.slice(7)}`)
					let stsp = await store.getExtendedInfo(storeInfo.results[0].link)
					if (region == 'en') return await kill.sendFileFromUrl(from, stsp.icon, '', mess.store(stsp, stsp.description), id)
					await translate(stsp.description, {
						to: region
					}).then(async (playst) => {
						await kill.sendFileFromUrl(from, stsp.icon, '', mess.store(stsp, playst), id)
					})
				break

				case 'search':
					if (isImage || isQuotedImage) {
						await kill.reply(from, mess.searchanime(), id)
						let mediaData = await decryptMedia(encryptMedia)
						const animeFind = await axios.get(`https://api.trace.moe/search?url=${tools('cloud').upload(mediaData)}`)
						await kill.sendFileFromUrl(from, animeFind.result[0].video, animeFind.result[0].filename, mess.sanimetk(animeFind), id).catch(async () => {
							await kill.reply(from, mess.sanimetk(animeFind), id)
						})
					} else return await kill.sendFileFromUrl(from, errorurl, 'error.png', mess.searchanime() + '\n\n' + mess.onlyimg())
				break

				case 'ptt':
					if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
						let mediaData = await decryptMedia(encryptMedia)
						await kill.sendPtt(from, tools('others').dataURI(quotedMsgObj.mimetype, mediaData), '', id)
					} else kill.reply(from, mess.onlyaudio(), id)
				break

				case 'get':
					if (isQuotedImage || isQuotedAudio || isQuotedPtt || isQuotedVideo || isQuotedSticker || isQuotedGif || quotedMsgObj || isMedia) {
						let mediaData = await decryptMedia(encryptMedia)
						await kill.sendFile(from, tools('others').dataURI(quotedMsgObj.mimetype, mediaData), 'file.'+quotedMsgObj.mimetype, '', id)
					} else kill.reply(from, mess.onlymidia(), id)
				break

				case 'adms':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await kill.sendTextWithMentions(from, `═✪〘 🎻 - ADEMIROS - 🐂 〙✪═\n\n- @${groupAdmins.toString().replace(/@c.us/g, '').replace(/,/g, '\n- @')}​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n\n═✪〘 ❤️ - ${name} - 📢 〙✪═`)
				break

				case 'groupinfo':
				case 'info':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					let admgp = ''
					for (let admon of groupAdmins) {
						var adminsls = await kill.getContact(admon)
						admgp += `➸ ${adminsls.pushname || 'wa.me/' + admon.replace(/@c.us/g, '')}\n`
					}
					var donodeGp = await kill.getContact(chat.groupMetadata.owner)
					var gpOwner = donodeGp == null ? '??? - Top secret name - ???' : donodeGp.pushname == null ? `wa.me/${chat.groupMetadata.owner.replace('@c.us', '')}` : donodeGp.pushname
					var welgrp = functions.welcome.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var fakegp = functions.fake.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var bklistgp = functions.blacklist.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var xpgp = functions.xp.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var slcegp = functions.silence.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var ngrp = functions.nsfw.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var autostk = functions.sticker.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var atpngy = functions.antiporn.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var atlka = functions.antilinks.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var anttra = functions.antitrava.includes(chatId) ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					var grouppic = await kill.getProfilePicFromServer(chatId)
					let pfp = grouppic.includes('ERR') || grouppic == null || typeof grouppic === 'object' || !tools('others').isUrl(grouppic) ? errorurl : grouppic
					await kill.sendFileFromUrl(from, pfp, 'group.png', mess.groupinfo(name, chat.groupMetadata.participants.length, welgrp, atpngy, atlka, anttra, xpgp, fakegp, bklistgp, slcegp, autostk, ngrp, chat.groupMetadata.desc, gpOwner, admgp), id)
				break

				case 'chefe':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await kill.sendTextWithMentions(from, `👉 @${chat.groupMetadata.owner}`)
				break

				case 'wame':
					if (quotedMsg) {
						await kill.reply(from, `📞 - https://wa.me/${quotedMsgObj.sender.id.replace('@c.us', '')} - ${quotedMsgObj.sender.id.replace('@c.us', '')}`, id)
					} else if (mentionedJidList.length !== 0) {
						await kill.sendTextWithMentions(from, mentionedJidList.map(x => `\n📞 - https://wa.me/${x.replace('@c.us', '')} - @${x.replace('@c.us', '')}`).join('\n'), id)
					} else return await kill.reply(from, `📞 - https://wa.me/${sender.id.replace('@c.us', '')} - ${sender.id.replace('@c.us', '')}`, id)
				break

				case 'maps':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'city names/nomes de cidade/nombres de ciudad.', id)
					await kill.sendImage(from, `https://image.maps.api.here.com/mia/1.6/mapview?app_id=${config.Here_APP_ID}&app_code=${config.Here_APP_Code}&ci=${encodeURIComponent(body.slice(6))}&h=800&w=800&t=3`, '', `*📍 ${body.slice(6).toUpperCase()}*`)
				break

				case 'sip':
					if (args.length !== 1) return await kill.reply(from, mess.noargs() + 'IPV4 (ex: 8.8.8.8).', id)
					const ip = await axios.get(`https://ipwhois.app/json/${encodeURIComponent(body.slice(5))}`)
					if (ip.data.latitude == null) return await kill.reply(from, mess.noresult(), id)
					await kill.sendLocation(from, `${ip.data.latitude}`, `${ip.data.longitude}`, '')
					await kill.reply(from, mess.sip(ip) + '\n\n' + 'Searching place photo - Buscando foto do local...', id)
					await kill.sendFileFromUrl(from, `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${ip.data.latitude},%20${ip.data.longitude}&sensor=false&key=${config.API_Google_Maps}`, id)
				break

				case 'scep':
					if (!region == 'pt') return await kill.reply(from, 'Brazil only/Brasil solamente!', id)
					if (args.length !== 1 || body.slice(6).length > 8) return await kill.reply(from, mess.noargs() + 'CEP (ex: 03624090).', id)
					const viacep = await axios.get(`https://viacep.com.br/ws/${encodeURIComponent(body.slice(6))}/json/`)
					if (viacep.data.erro) return await kill.reply(from, mess.noresult(), id)
					await kill.reply(from, mess.scep(viacep), id)
					await axios.get(`https://brasilapi.com.br/api/cep/v2/${args[0]}`).then(async (cep) => {
						await kill.sendLocation(from, `${cep.data.location.coordinates.latitude}`, `${cep.data.location.coordinates.longitude}`, `${cep.data.street}, ${cep.data.city}`)
					}).catch(async (error) => {
						await kill.reply(from, `[${error.response.data.name} - ${error.response.data.type}]\n\n${error.response.data.message}\n\n` + error.response.data.errors.map(res => `${res.service.toUpperCase()} -> ${res.message}\n\n`).join(''), id)
					})
				break

				case 'random':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await kill.sendTextWithMentions(from, `═✪〘 👉 - ${body.slice(8)} - 🐂 〙✪═ \n\n @${randomMember.replace(/@c.us/g, '')}`)
				break

				case '3d':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
					await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
					try {
						await maker.textpro(tools('others').randVal(["https://textpro.me/3d-gradient-text-effect-online-free-1002.html", "https://textpro.me/3d-box-text-effect-online-880.html"]), body.slice(4)).then(async (data) => {
							await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'slogan':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
					await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
					try {
						await maker.textpro("https://textpro.me/1917-style-text-effect-online-980.html", body.slice(8)).then(async (data) => {
							await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'gaming':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					await kill.reply(from, mess.wait(), id)
					await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/gaming?text=${body.slice(8)}`, '', '', id)
				break

				case 'thunder':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
					await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
					try {
						await maker.textpro("https://textpro.me/thunder-text-effect-online-881.html", body.slice(8)).then(async (data) => {
							await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'light':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
					await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
					try {
						await maker.textpro("https://textpro.me/create-a-futuristic-technology-neon-light-text-effect-1006.html", body.slice(7)).then(async (data) => {
							await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'wolf':
					if (args.length < 2 && !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
					if (arg.split('|')[0].length >= 10 || arg.split('|')[1].length >= 10) return await kill.reply(from, 'Max: 10 letras/letters p/frase - phrase.', id)
					await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
					try {
						await maker.textpro(tools('others').randVal(["https://textpro.me/create-wolf-logo-black-white-937.html", "https://textpro.me/create-wolf-logo-galaxy-online-936.html"]), arg.split('|')).then(async (data) => {
							await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'neon':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
					await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
					try {
						await maker.textpro("https://textpro.me/create-blackpink-logo-style-online-1001.html", body.slice(6)).then(async (data) => {
							await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'retro':
					if (args.length >= 4 && arks.includes('|')) {
						if (arg.split('|')[0].length >= 10 || arg.split('|')[1].length >= 10 || arg.split('|')[2].length >= 10) return await kill.reply(from, 'Max: 10 letras/letters p/frase - phrase.', id)
						await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
						try {
							await maker.textpro("https://textpro.me/80-s-retro-neon-text-effect-online-979.html", arg.split('|')).then(async (data) => {
								await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
							})
						} catch (error) {
							tools('others').reportConsole(command, error)
							await kill.reply(from, mess.fail(command, error, time), id)
						}
					} else return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 2 "|".', id)
				break

				case 'porn':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const porn = await axios.get('https://meme-api.herokuapp.com/gimme/porn')
					await kill.sendFileFromUrl(from, `${porn.data.url}`, '', `${porn.data.title}`, id)
				break

				case 'lesbian':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const lesb = await axios.get('https://meme-api.herokuapp.com/gimme/lesbians')
					await kill.sendFileFromUrl(from, `${lesb.data.url}`, '', `${lesb.data.title}`, id)
				break

				case 'pgay':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const gay = await axios.get('https://meme-api.herokuapp.com/gimme/gayporn')
					await kill.sendFileFromUrl(from, `${gay.data.url}`, '', `${gay.data.title}`, id)
				break

				case 'logo':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
					await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
					try {
						await maker.textpro("https://textpro.me/create-blackpink-logo-style-online-1001.html", body.slice(6)).then(async (data) => {
							await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'pornhub':
					if (args.length >= 2 && arks.includes('|')) {
						if (arg.split('|')[0].length >= 10 || arg.split('|')[1].length >= 10) return await kill.reply(from, 'Max: 10 letras/letters p/frase - phrase.', id)
						await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
						try {
							await maker.textpro("https://textpro.me/pornhub-style-logo-online-generator-free-977.html", arg.split('|')).then(async (data) => {
								await kill.sendFileFromUrl(from, data, 'textpro.jpg', '', id)
							})
						} catch (error) {
							tools('others').reportConsole(command, error)
							await kill.reply(from, mess.fail(command, error, time), id)
						}
					} else return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
				break

				case 'meme':
					if (isImage && args.length >= 2 && arks.includes('|') || isQuotedImage && args.length >= 2 && arks.includes('|')) {
						let mediaData = await decryptMedia(encryptMedia)
						await kill.sendFileFromUrl(from, `https://api.memegen.link/images/custom/${encodeURIComponent(arg.split('|')[0])}/${encodeURIComponent(arg.split('|')[1])}.png?background=${await tools('cloud').upload(mediaData)}`, 'image.png', '', id).catch(async () => {
							await kill.reply(from, mess.upfail(), id)
						})
					} else return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
				break

				case 'ping':
					const rTime = (seconds) => {
						return `${Math.floor(seconds / (60*60))} horas | ${Math.floor(seconds % (60*60) / 60)} minutos | ${Math.floor(seconds % 60)} segundos - HH:MM:SS`
					}
					let myInfo = await kill.getMe()
					let totalMemo = `${Math.floor(os.totalmem() / 1024 / 1024) - Math.floor(os.freemem() / 1024 / 1024)} MB / ${Math.floor(os.totalmem() / 1024 / 1024)} MB - [${Math.floor(os.freemem() / 1024 / 1024)} MB Livres]`
					await kill.reply(from, mess.stats(rTime(process.uptime()), rTime(os.uptime()), totalMemo, os, await kill.getAmountOfLoadedMessages(), await kill.getAllGroups(), await kill.getAllChatIds(), await tools('others').processTime(t, moment()), await kill.getWAVersion(), await kill.getIsPlugged(), myInfo), id)
				break

				case 'join':
					if (args.length == 0) return await kill.reply(from, mess.nolink(), id)
					const tGr = await kill.getAllGroups()
					const check = await kill.inviteInfo(args[0])
					if (!args[0].match(/(https:\/\/chat.whatsapp.com)/gi)) return await kill.reply(from, mess.nolink(), id)
					if (tGr.length > config.Max_Groups) return await kill.reply(from, mess.cheio(tGr), id)
					if (check.size < config.Min_Membros) return await kill.reply(from, mess.noreq(check.size), id)
					if (check.status == 200) {
						await kill.joinGroupViaLink(args[0]).then(async () => {
							await kill.reply(from, mess.maked())
						})
					} else return await kill.reply(from, mess.nolink(), id)
				break

				case 'placa':
					if (!region == 'pt') return await kill.reply(from, 'Brazil only/Brasil solamente', id)
					if (args.length == 0) return await kill.reply(from, 'Coloque uma placa para puxar.', id)
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					await sinesp.search(`${args[0]}`).then(async (dados) => {
						await kill.reply(from, `Placa: ${dados.placa}\n\nSituação: ${dados.situacao}\n\nModelo: ${dados.modelo}\n\nMarca: ${dados.marca}\n\nCor: ${dados.cor}\n\nAno: ${dados.ano}\n\nAno do modelo: ${dados.anoModelo}\n\nEstado: ${dados.uf}\n\nMunicipio: ${dados.municipio}\n\nChassi: ${dados.chassi}.`, id)
					}).catch(async (error) => {
						tools('others').reportConsole(command, error)
						await kill.reply(from, 'Não encontrei nada, pode ser um erro ou a placa não existe.\n\n' + mess.fail(command, error, time), id)
					})
				break

				case 'phcom':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let mediaData = await decryptMedia(encryptMedia)
						var thephComP = await tools('cloud').upload(mediaData)
					} else {
						var thephComP = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (thephComP.includes('ERR') || thephComP == null || typeof thephComP == 'object' || !tools('others').isUrl(thephComP)) {
						thephComP = await kill.getProfilePicFromServer(randomMember)
						if (thephComP == null || typeof thephComP === 'object') {
							thephComP = errorImg
						}
					}
					await canvacord.Canvas.phub({
						username: arg.split('|')[0].replace(mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join(' '), ''),
						message: arg.split('|')[1],
						image: thephComP
					}).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `pornhub.png`, '', id)
					})
				break

				case 'ytcom':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let mediaData = await decryptMedia(encryptMedia)
						var theYtComP = await tools('cloud').upload(mediaData)
					} else {
						var theYtComP = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (theYtComP.includes('ERR') || theYtComP == null || typeof theYtComP == 'object' || !tools('others').isUrl(theYtComP)) {
						theYtComP = await kill.getProfilePicFromServer(randomMember)
						if (theYtComP == null || typeof theYtComP === 'object') {
							theYtComP = errorImg
						}
					}
					await canvacord.Canvas.youtube({
						username: arg.split('|')[0].replace(mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join(' '), ''),
						content: arg.split('|')[1],
						avatar: theYtComP,
						dark: false
					}).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `youtube.png`, '', id)
					})
				break

				case 'enviar':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
					try {
						const sendAFile = async (quotedMsgObj, args, type, typeName) => {
							let replyOnReply = await kill.getMessageById(quotedMsgObj.id)
							let obj = replyOnReply.quotedMsgObj
							if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
								if (quotedMsgObj.animated) quotedMsgObj.mimetype = ''
							} else if (obj && /ptt|audio|video|image/.test(obj.type)) {
								quotedMsgObj = obj
							} else return
							let mediaData = await decryptMedia(quotedMsgObj)
							await kill.sendFile(`${args[1]}` + type, `data:${quotedMsgObj.mimetype};base64,${mediaData.toString('base64')}`, '', `De/From ${typeName}`)
						}
						if (argl[0] == '-gp') {
							await kill.sendText(`${args[1]}` + '@g.us', `_Mensagem >_\n"${arg.split('|')[1]} "` + '\n\n_Quem enviou =_ ' + '\n*"' + typeName + '"*' + '\n\n_Como responder:_')
							await kill.sendText(`${args[1]}` + '@g.us', `${prefix}enviar ${typeChat} ${typeId} | Coloque sua resposta aqui`)
							await kill.reply(from, mess.maked(), id)
							if (quotedMsgObj) {
								await sendAFile(quotedMsgObj, args, '@g.us', typeName)
							}
						} else if (argl[0] == '-pv') {
							await kill.sendText(`${args[1]}` + '@c.us', `_Mensagem >_\n"${arg.split('|')[1]}"` + '\n\n_Quem enviou =_ ' + '*' + typeName + '*' + '\n\n_Como responder:_')
							await kill.sendText(`${args[1]}` + '@c.us', `${prefix}enviar ${typeChat} ${typeId} | Coloque sua resposta aqui`)
							await kill.reply(from, mess.maked(), id)
							if (quotedMsgObj) {
								await sendAFile(quotedMsgObj, args, '@c.us', typeName)
							}
						} else return await kill.reply(from, mess.enviar(), id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.noctt() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'loli':
					await kill.sendFileFromUrl(from, `https://media.publit.io/file/Twintails/${tools('others').randomNumber(1, 145)}.jpg`, 'loli.jpg', mess.logomgs(), id)
				break

				case 'hug':
					let hugPeo = await axios.get("https://nekos.life/api/v2/img/hug")
					if (hugPeo.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(hugPeo, command, kill, message)
					} else await kill.sendStickerfromUrl(from, hugPeo.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'baguette':
					let filterBg = isNsfw || isAntiPorn ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT
					const getBaguette = await duck.search('anime baguette girls', filterBg)
					await kill.sendFileFromUrl(from, tools('others').randVal(getBaguette.map(c => c.image)), `baguette.jpg`, '🥖', id)
				break

				case 'dva':
					let filterDva = isNsfw || isAntiPorn ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT
					const getDVA = await duck.search('dva overwatch', filterDva)
					await kill.sendFileFromUrl(from, tools('others').randVal(getDVA.map(c => c.image)), `dva.jpg`, '😍', id)
				break

				case 'waifu':
					const waifu3 = await axios.get(`https://waifu.pics/api/sfw/waifu`)
					await kill.sendFileFromUrl(from, waifu3.data.url, '', 'hmmm...', id)
				break

				case 'husb':
					let filterHusb = isNsfw || isAntiPorn ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT
					const getHusb = await duck.search('husbando anime boys', filterHusb)
					await kill.sendFileFromUrl(from, tools('others').randVal(getHusb.map(c => c.image)), `husb.jpg`, '-.-', id)
				break

				case 'iecchi':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const ecchi = await axios.get('https://nekos.life/api/v2/img/' + tools('others').randVal(["ero", "erokemo", "erok"]))
					await kill.sendFileFromUrl(from, ecchi.data.url, id)
				break

				case 'tits':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const rtitsc = tools('others').randVal(["tits", "BestTits", "boobs", "BiggerThanYouThought", "smallboobs", "TinyTits", "SmallTitsHugeLoad", "amazingtits"])
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/' + rtitsc)
					await kill.sendFileFromUrl(from, `${tits.data.url}`, '', `${tits.data.title}`, id)
				break

				case 'milf':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const rmilfc = tools('others').randVal(["Bbwmilf", "milf"])
					const milf1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + rmilfc)
					await kill.sendFileFromUrl(from, `${milf1.data.url}`, '', `${milf1.data.title}`, id)
				break

				case 'bdsm':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const rbdsmc = tools('others').randVal(["BDSMPics", "bdsm", "TeenBDSM"])
					const bdsm1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + rbdsmc)
					await kill.sendFileFromUrl(from, `${bdsm1.data.url}`, '', `${bdsm1.data.title}`, id)
				break

				case 'ass':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const rassc = tools('others').randVal(["CuteLittleButts", "ass", "bigasses"])
					const bowass = await axios.get('https://meme-api.herokuapp.com/gimme/' + rassc)
					await kill.sendFileFromUrl(from, `${bowass.data.url}`, '', `${bowass.data.title}`, id)
				break

				case 'pussy':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const rpussyc = tools('others').randVal(["pussy", "ass", "LegalTeens"])
					const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + rpussyc)
					await kill.sendFileFromUrl(from, `${bows1.data.url}`, '', `${bows1.data.title}`, id)
				break

				case 'blowjob':
				case 'boquete':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					let blowJobs = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["bj", "blowjob"])}`)
					if (blowJobs.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(blowJobs, command, kill, message)
					} else await kill.sendStickerfromUrl(from, blowJobs.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'feet':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					let feetGet = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["feetg", "erofeet"])}`)
					if (feetGet.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(feetGet, command, kill, message)
					} else await kill.sendStickerfromUrl(from, feetGet.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'hard':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					let hardGet = await axios.get(`https://nekos.life/api/v2/img/spank`)
					if (hardGet.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(hardGet, command, kill, message)
					} else await kill.sendStickerfromUrl(from, hardGet.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'boobs':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					let getboobs = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["boobs", "tits"])}`)
					if (getboobs.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getboobs, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, getboobs.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'lick':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					let getlick = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["kuni", "les"])}`)
					if (getlick.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getlick, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, getlick.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'femdom':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const rfemdonc = tools('others').randVal(["femdom", "yuri", "eroyuri"])
					const femdom = await axios.get('https://nekos.life/api/v2/img/' + rfemdonc)
					await kill.sendFileFromUrl(from, femdom.data.url, '', '', id)
				break

				case 'futanari':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const futanari = await axios.get('https://nekos.life/api/v2/img/futanari')
					await kill.sendFileFromUrl(from, futanari.data.url, '', '', id)
				break

				case 'masturb':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					let getMasturb = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["solo", "solog"])}`)
					if (getMasturb.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getMasturb, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, getMasturb.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'anal':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					let getanal = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["cum", "cum_jpg"])}`)
					if (getanal.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getanal, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, getanal.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'randomloli':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const loliz = await axios.get('https://nekos.life/api/v2/img/keta')
					await kill.sendImageAsSticker(from, loliz.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'nsfwicon':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const icon = await axios.get('https://nekos.life/api/v2/img/nsfw_avatar')
					await kill.sendImageAsSticker(from, icon.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'truth':
					const memean = await axios.get('https://nekos.life/api/v2/img/gecg')
					await kill.sendFileFromUrl(from, memean.data.url, '', '', id)
				break

				case 'icon':
					const avatarz = await axios.get('https://nekos.life/api/v2/img/avatar')
					await kill.sendImageAsSticker(from, avatarz.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'face':
					const gasm = await axios.get('https://nekos.life/api/v2/img/gasm')
					await kill.sendImageAsSticker(from, gasm.data.url, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
				break

				case 'pezinho':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const pezin = await axios.get('https://nekos.life/api/v2/img/feet')
					await kill.sendFileFromUrl(from, pezin.data.url, '', '', id)
				break

				case 'corno':
					let corno = tools('others').getRandLine(2, './lib/config/Utilidades/corno.txt')
					let corno2 = (quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)).replace('@c.us', '')
					await kill.sendTextWithMentions(from, `@${corno2} é ${lvpc}%...\n\n"${corno[0]}"\n\nE nas horas vagas ${100 - lvpc}%...\n\n"${corno[1]}" 😳.`)
				break

				case 'gamemode':
					if (args.length == 0) return await kill.reply(from, mess.cors(), id)
					if (argl[0] == '0' || argl[0] == 's' || argl[0] == 'survival') {
						await kill.sendTextWithMentions(from, mess.mine(sender.id) + 'survival.')
					} else if (argl[0] == '1' || argl[0] == 'c' || argl[0] == 'creative') {
						await kill.sendTextWithMentions(from, mess.mine(sender.id) + 'creative.')
					} else if (argl[0] == '2' || argl[0] == 'a' || argl[0] == 'adventure') {
						await kill.sendTextWithMentions(from, mess.mine(sender.id) + 'adventure.')
					} else if (argl[0] == '3' || argl[0] == 'spectator') {
						await kill.sendTextWithMentions(from, mess.mine(sender.id) + 'espectador.')
					} else return await kill.reply(from, mess.cors(), id)
				break

				case 'ihentai':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					let ihentai = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["hentai", "pussy_jpg", "pussy"])}`)
					if (ihentai.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(ihentai, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, ihentai.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'yuri':
					let filterYu = isNsfw || isAntiPorn ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT
					const getYuri = await duck.search('yuri anime kiss', filterYu)
					await kill.sendFileFromUrl(from, tools('others').randVal(getYuri.map(c => c.image)), `yuri.jpg`, 'Pro inferno com as Fujoshis ehehe!', id)
				break

				case 'randomneko':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const nekons = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["hololewd", "lewdk", "lewdkemo", "eron", "holoero", "nsfw_neko_gif"])}`)
					if (nekons.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(nekons, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, nekons.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'trap':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					const tapr = await axios.get('https://nekos.life/api/v2/img/trap')
					await kill.sendFileFromUrl(from, tapr.data.url, '', '', id)
				break

				case 'randomwall':
					const walnime = await axios.get('https://nekos.life/api/v2/img/wallpaper')
					await kill.sendFileFromUrl(from, walnime.data.url, '', '', id)
				break

				case 'valor':
					if (args.length !== 2) return await kill.reply(from, mess.moneyerr(), id)
					const money = await axios.get(`https://${encodeURIComponent(args[0])}.rate.sx/${encodeURIComponent(args[1])}`)
					if (/^[0-9+]/.test(money.data)) return await kill.reply(from, mess.moneyerr(), id)
					await kill.reply(from, `*${args[1]}* → *${money.data.toFixed(2)}* ${args[0]}`, id)
				break

				case 'dog':
					const list = await axios.get('https://shibe.online/api/shibes')
					await kill.sendFileFromUrl(from, list.data[0], '', '🐕', id)
				break

				case 'look':
					let getLook = await axios.get(`https://nekos.life/api/v2/img/smug`)
					if (getLook.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getLook, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, getLook.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'holo':
					const holo = await axios.get('https://nekos.life/api/v2/img/holo')
					await kill.sendFileFromUrl(from, holo.data.url, '', '', id)
				break

				case 'kisu':
					let getKisu = await axios.get(`https://nekos.life/api/v2/img/kiss`)
					if (getKisu.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getKisu, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, getKisu.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'tapa':
					let getSlap = await axios.get(`https://nekos.life/api/v2/img/slap`)
					if (getSlap.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getSlap, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, getSlap.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
				break

				case 'gato':
				case 'cat':
					if (args.length !== 2 || isNaN(args[0]) || isNaN(args[1])) {
						const catu = await axios.get('https://nekos.life/api/v2/img/meow')
						await kill.sendFileFromUrl(from, catu.data.url, 'gato.jpg', mess.cats(), id)
					} else {
						await kill.sendFileFromUrl(from, `https://placekitten.com/${args[0]}/${args[1]}`, 'neko.png', 'Nekooo', id)
					}
				break

				case 'pokemon':
					if (args.length == 0) return await kill.sendFileFromUrl(from, `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${randomNumber(1, 898)}.png`, 'Pokemon.png', mess.nopoke(), id)
					config.Language == 'es' ? Pokemon.setLanguage('spanish') : Pokemon.setLanguage('english')
					const pokemae = await Pokemon.getPokemon(args[0])
					if (pokemae == null) return await kill.reply(from, mess.noresult(), id)
					await kill.sendFileFromUrl(from, pokemae.sprites.front_default, 'pokemon.png', mess.pokemon(pokemae, `\n➸ ${pokemae.moves.join('\n➸ ')}`), id)
				break

				case 'screenshot':
					if (args.length == 0 || !tools('others').isUrl(args[0])) return await kill.reply(from, mess.nolink(), id)
					await kill.sendFileFromUrl(from, `https://api.apiflash.com/v1/urltoimage?access_key=${config.API_NoFlash}&url=${args[0]}`, 'ss.jpeg', mess.noporn(), id)
				break

				case 'ship':
					if (isGroupMsg && args.length == 2 && mentionedJidList.length !== 0) {
						await kill.sendTextWithMentions(from, mess.love(arqs, lvpc))
					} else if (args.length == 1) {
						await kill.reply(from, mess.lovepv(arqs, lvpc))
					} else return await kill.reply(from, mess.nocrush(), id)
				break

					/*Se quiser por mais pra zoar, abra o arquivo lgbt e adicione 1 por linha*/
				case 'gay':
				case 'lgbt':
					var twgui = tools('others').getRandLine(2, './lib/config/Utilidades/lgbt.txt')
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let mediaData = await decryptMedia(encryptMedia)
						var theLgBtic = await tools('cloud').upload(mediaData)
					} else {
						var theLgBtic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (theLgBtic == null || typeof theLgBtic === 'object') theLgBtic = errorImg
					await canvacord.Canvas.rainbow(theLgBtic).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `gay.png`, mess.lgbt(lvpc, twgui[0], (100 - lvpc), twgui[1]), id)
					})
				break

				case 'chance':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					await kill.reply(from, mess.botmonkey(body, lvpc), id)
				break

				case 'kiss':
					const getMeKiss = quotedMsg ? quotedMsgObj.sender.id.replace('@c.us', '') : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
					let getKiss = await axios.get(`https://nekos.life/api/v2/img/kiss`)
					if (getKiss.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getKiss, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, getKiss.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
					await kill.sendTextWithMentions(from, mess.kiss(sender.id, getMeKiss))
				break

				case 'slap':
					const getMeSlap = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
					let getTapa = await axios.get(`https://nekos.life/api/v2/img/slap`)
					if (getTapa.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getTapa, command, kill, message)
					} else {
						await kill.sendStickerfromUrl(from, getTapa.data.url, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
					await kill.sendTextWithMentions(from, mess.tapa(sender.id, getMeSlap))
				break

				case 'getmeme':
					var thememer = region == 'pt' ? 'memesbrasil' : (region == 'en' ? 'memes' : 'SpanishMeme')
					const response = await axios.get('https://meme-api.herokuapp.com/gimme/' + thememer)
					await kill.sendFileFromUrl(from, `${response.data.url}`, 'meme.jpg', `${response.data.title}`, id)
				break

				case 'date':
				case 'data':
					await kill.reply(from, `${time}`, id)
				break

				case 'menu':
					const theMsg = tools('gaming').getValue(sender.id, nivel, chatId, 'msg')
					const uzrXp = tools('gaming').getValue(sender.id, nivel, chatId, 'xp')
					const uzrlvl = tools('gaming').getValue(sender.id, nivel, chatId, 'level')
					const mping = tools('others').processTime(t, moment())
					await kill.sendButtons(from, 'Atalhos →', [
						{
							"id": "1",
							"text": "/Admins"
						},
						{
							"id": "2",
							"text": "/Tudo"
						},
						{
							"id": "3",
							"text": "/Legião"
						}
					], mess.menu(pushname, time, theMsg, uzrXp, tools('gaming').LevelEXP(uzrlvl), uzrlvl, mping, patente))
				break

				case 'stickers':
					await kill.reply(from, mess.stickers(), id)
				break

				case 'otaku':
					await kill.reply(from, mess.anime(), id)
				break

				case 'games':
					await kill.reply(from, mess.games(), id)
				break

				case 'adult':
					if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
					await kill.reply(from, mess.adult(), id)
				break

				case 'down':
					await kill.reply(from, mess.down(), id)
				break

				case 'dados':
					await kill.reply(from, mess.dados(), id)
				break

				case 'midia':
					await kill.reply(from, mess.midia(), id)
				break

				case 'outros':
					await kill.reply(from, mess.outros(), id)
				break

				case 'maker':
					await kill.reply(from, mess.maker(), id)
				break

				case 'tudo':
					await kill.reply(from, (mess.stickers() + '\n\n' + mess.anime() + '\n\n' + mess.games() + '\n\n' + mess.adult() + '\n\n' + mess.down() + '\n\n' + mess.dados() + '\n\n' + mess.midia() + '\n\n' + mess.outros() + '\n\n' + mess.maker()).replace(' ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​', ''), id)
				break

					/*LEMBRE-SE, REMOVER CRÈDITO È CRIME E PROIBIDO!*/
				case 'termos':
					await kill.sendFileFromUrl(from, 'https://i.ibb.co/nczyDbx/licenca.png', 'licenca.png', mess.everhost() + '\n\n' + mess.tos(), id)
					await kill.sendPtt(from, `https://www.myinstants.com/media/sounds/resident-evil-4-merchant-thank-you.mp3`, id);
				break
					/*NÃO REMOVA ESSA PARTE!*/

				case 'mac':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'mac (ex: 70:B3:D5:03:62:A1).', id)
					await kill.reply(from, mess.wait(), id)
					const maclk = await axios.get(`https://api.macvendors.com/${encodeURIComponent(body.slice(5))}`)
					await kill.reply(from, `📱 → ${maclk.data}.`, id)
				break

				case 'converter':
				case 'conv':
					if (args == 0) return await kill.reply(from, mess.conv(), id)
					try {
						if (argl[0] == '-f') {
							if (isNaN(args[1])) return await kill.reply(from, mess.onlynumber(), id)
							await kill.reply(from, `*${args[1]}* _C° - Celsius =_ ${args[1] / 5 * 9 + 32} _F° - Fahrenheit._`, id)
						} else if (argl[0] == '-c') {
							if (isNaN(args[1])) return await kill.reply(from, mess.onlynumber(), id)
							await kill.reply(from, `*${args[1]}* _F° - Fahrenheit =_ *${5 * (args[1] - 32) / 9}* _C° - Celsius._`, id)
						} else if (argl[0] == '-m') {
							if (isNaN(args[1])) return await kill.reply(from, mess.onlynumber(), id)
							await kill.reply(from, `*${args[1]}* _KM =_ *${args[1] * 0.62137}* _MI._`, id)
						} else if (argl[0] == '-q') {
							if (isNaN(args[1])) return await kill.reply(from, mess.onlynumber(), id)
							await kill.reply(from, `*${args[1]}* _MI =_ *${args[1] / 0.62137}* _KM._`, id)
						} else return await kill.reply(from, mess.conv(), id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.onlynumber() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'scnpj':
					if (!region == 'pt') return await kill.reply(from, 'Brazil only/Brasil solamente!', id)
					if (args.length == 1) {
						const cnpj = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${encodeURIComponent(body.slice(7))}`)
						if (cnpj.data.status == 'ERROR') return await kill.reply(from, cnpj.data.message, id)
						await kill.reply(from, `✪ CNPJ: ${cnpj.data.cnpj}\n\n✪ Tipo: ${cnpj.data.tipo}\n\n✪ Nome: ${cnpj.data.nome}\n\n✪ Região: ${cnpj.data.uf}\n\n✪ Telefone: ${cnpj.data.telefone}\n\n✪ Situação: ${cnpj.data.situacao}\n\n✪ Bairro: ${cnpj.data.bairro}\n\n✪ Logradouro: ${cnpj.data.logradouro}\n\n✪ CEP: ${cnpj.data.cep}\n\n✪ Casa N°: ${cnpj.data.numero}\n\n✪ Municipio: ${cnpj.data.municipio}\n\n✪ Abertura: ${cnpj.data.abertura}\n\n✪ Fantasia: ${cnpj.data.fantasia}\n\n✪ Jurisdição: ${cnpj.data.natureza_juridica}`, id)
					} else return await kill.reply(from, 'Especifique um CNPJ sem os traços e pontos.', id)
				break

				case 'coins':
					await kill.reply(from, mess.coins(), id)
				break

				case 'allid':
				case 'grupos':
					let idmsgp = ''
					for (let i of await kill.getAllGroups()) {
						idmsgp += `\n➸ ${i.name} =\n${i.id.replace(/@g.us/g,'')}\n${i.participantsCount} Users\n`
					}
					await kill.reply(from, idmsgp, id)
				break

				case 'help':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'motivo/razon/reason.', id)
					await kill.sendText(config.Owner[0], mess.advise(typeName, typeChat, sender.id, body, typeId) + '\n\n' + mess.thanks())
				break

				case 'level':
				case 'nivel':
					if (!isxp) return await kill.reply(from, mess.needxpon(), id)
					if (mentionedJidList.length !== 0) lvlusrph = await kill.getContact(mentionedJidList[0])
					var yourName = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? lvlusrph.pushname : pushname)
					var wdfWho = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
					const userLevel = tools('gaming').getValue(wdfWho, nivel, chatId, 'level')
					const userXp = tools('gaming').getValue(wdfWho, nivel, chatId, 'xp')
					const ppLink = await kill.getProfilePicFromServer(wdfWho)
					var perf = ppLink.includes('ERR') || ppLink == null || typeof ppLink === 'object' || !tools('others').isUrl(ppLink) ? errorurl : ppLink
					let rankCard = await tools('canvas').ranking(perf, userXp, tools('gaming').LevelEXP(userLevel), userLevel, Object.keys(nivel[chatId]).indexOf(wdfWho), 0, `${tools('gaming').getPatent(userLevel)} - ${(tools('gaming').getValue(sender.id, nivel, chatId, 'guild')).toUpperCase()}`, yourName)
					await kill.sendFile(from, rankCard, `${wdfWho.replace('@c.us', '')}_card.png`, `🔭 - ${yourName} - ${name}\n🎮 - ${userXp} / ${tools('gaming').LevelEXP(userLevel)} XP\n☄️ - Level ${userLevel}\n⏱️ - ${tools('gaming').getValue(wdfWho, nivel, chatId, 'msg')} Mensagens\n🃏 - ${tools('gaming').getPatent(userLevel)}\n💵 - ${tools('gaming').getValue(wdfWho, nivel, chatId, 'coin')} Í-coins\n⚔️ - ${(tools('gaming').getValue(sender.id, nivel, chatId, 'guild')).toUpperCase()}\n🔶 - ${tools('gaming').getValue(wdfWho, nivel, chatId, 'rubi')} Rubis\n💎 - ${tools('gaming').getValue(wdfWho, nivel, chatId, 'dima')} Diamantes`, id)
				break

				case 'ativos':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					nivel[chatId] = tools('others').sort(nivel[chatId], 'msg')
					let active = '-----[ *RANKING DOS ATIVOS* ]----\n\n'
					let CountMsg = 0
					try {
						for (let i = Object.keys(nivel[chatId]).length; i > Object.keys(nivel[chatId]).length - 11; i--) {
							if (Object.keys(nivel[chatId])[i] == null) return
							Object.keys(nivel[chatId])[i] == null ? i = i - 1 : i = i
							CountMsg++
							const aRandVar = await kill.getContact(Object.keys(nivel[chatId])[i])
							active += `${CountMsg} → *${aRandVar.pushname || 'wa.me/' + Object.keys(nivel[chatId])[i].replace('@c.us', '')}*\n➸ *Mensagens*: ${nivel[Object.keys(nivel[chatId])[i]]['msg']}\n\n`
						}
						await kill.sendText(from, active)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.tenpeo() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'geral':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					let geralRank = `-----[ *${name}* [${groupMembersId.length}]]----\n\n`
					nivel[chatId] = tools('others').sort(nivel[chatId], 'xp')
					try {
						for (let i = Object.keys(nivel[chatId]).length; i > 0; i--) {
							if (Object.keys(nivel[chatId])[i] == null) return
							if (groupMembersId.includes(Object.keys(nivel[chatId])[i])) {
								const bRandV = await kill.getContact(Object.keys(nivel[chatId])[i])
								let userInfo = tools('gaming').getValue(Object.keys(nivel[chatId])[i], nivel, chatId, null)
								geralRank += `${i + 1} → *${bRandV.pushname || 'wa.me/' + Object.keys(nivel[chatId])[i].replace('@c.us', '')}*\n➸ *Mensagens*: ${userInfo.msg}\n➸ *XP*: ${userInfo.xp} / ${tools('gaming').LevelEXP(userInfo.level)}\n➸ *Level*: ${userInfo.level}\n➸ *Í-Coin*: ${userInfo.coin}\n➸ *Patente*: ${tools('gaming').getPatent(userInfo.level)}\n\n`
							}
						}
						await kill.sendText(from, geralRank)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.tenpeo() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'ranking':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					nivel[chatId] = tools('others').sort(nivel[chatId], 'xp')
					let CountUp = 0
					let board = '-----[ *RANKING DE XP* ]----\n\n'
					try {
						for (let i = Object.keys(nivel[chatId]).length; i > Object.keys(nivel[chatId]).length - 11; i--) {
							CountUp++
							Object.keys(nivel[chatId])[i] == null ? i = i - 1 : i = i
							if (Object.keys(nivel[chatId])[i] == null) return
							var aRandNe = await kill.getContact(Object.keys(nivel[chatId])[i])
							let userInfo = tools('gaming').getValue(Object.keys(nivel[chatId])[i], nivel, chatId, null)
							board += `${CountUp} → *${aRandNe.pushname || 'wa.me/' + Object.keys(nivel[chatId])[i].replace('@c.us', '')}*\n➸ *Mensagens*: ${userInfo.msg}\n➸ *XP*: ${userInfo.xp} / ${tools('gaming').LevelEXP(userInfo.level)}\n➸ *Level*: ${userInfo.level}\n➸ *Patente*: ${tools('gaming').getPatent(userInfo.level)}\n➸ *Í-Coin*: ${userInfo.coin}\n\n`
						}
						await kill.sendText(from, board)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.tenpeo() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'marcar':
					await kill.sendTextWithMentions(from, `@${sender.id.replace('@c.us', '')}`)
				break

				case 'letra':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'name of song/nome da música/nombre de música.', id)
					try {
						const liric = await axios.get(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(body.slice(7))}`)
						await kill.sendFileFromUrl(from, liric.data.thumbnail.genius, '', `*🎸*\n\n${liric.data.title}\n\n*🎵*\n\n${liric.data.lyrics}`, id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.noresult() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'reedit':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'subreddit name/nombre/nome.', id)
					try {
						await kill.reply(from, mess.wait(), id)
						const reed = await axios.get(`https://meme-api.herokuapp.com/gimme/${encodeURIComponent(body.slice(8))}`)
						if (!reed.data.nsfw || !isGroupMsg) {
							await kill.sendFileFromUrl(from, reed.data.url, '', reed.data.title, id)
						} else {
							if (isGroupMsg && !isNsfw) {
								await kill.reply(from, mess.gpadulto(), id)
							} else {
								await kill.sendFileFromUrl(from, reed.data.url, '', reed.data.title, id)
							}
						}
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.noresult() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				/*Obrigado pela base Jon*/
				case 'wallhaven':
				case 'wallpaper':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'wallpaper name/nome/nombre.', id)
					await kill.reply(from, mess.wait(), id)
					try {
						const wpphe = await axios.get(`https://wallhaven.cc/api/v1/search?apikey=${config.API_WallHaven}&q=${encodeURIComponent(body.slice(11))}`)
						await kill.sendFileFromUrl(from, tools('others').randVal(wpphe.data.data.map(w => w.path)), 'WallHaven.jpg', '<3', id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.noresult() + '\n\n' + mess.fail(command, error, time), id)
					}
				break

				case 'decode':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'binary code/código binario.', id)
					await kill.reply(from, `${body.slice(8)}\n\n*→*\n\n${body.slice(8).split(" ").map(x => String.fromCharCode(parseInt(x, 2))).join("")}`, id)
				break

				case 'encode':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
					await kill.reply(from, `${body.slice(8)}\n\n*→*\n\n${body.slice(8).split('').map(function (char) { return char.charCodeAt(0).toString(2) }).join(' ')}`, id)
				break

				case 'covid':
					if (args.lenght == 0) return await kill.reply(from, mess.coviderr(), id)
					const covidnb = await axios.get(`https://coronavirus-19-api.herokuapp.com/countries/${encodeURIComponent(body.slice(7))}`)
					if (covidnb.data == 'Country not found') return await kill.reply(from, mess.coviderr(), id)
					await kill.reply(from, mess.covidata(covidnb), id)
				break

				case 'paises':
					await kill.reply(from, mess.covid(), id)
				break

				case 'reverter':
				case 'rev':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let mediaData = await decryptMedia(encryptMedia)
						var revUpl = await tools('cloud').upload(mediaData)
					} else {
						var revUpl = await kill.getProfilePicFromServer(quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id))
					}
					if (revUpl == null || typeof revUpl === 'object') {
						revUpl = errorImg
					}
					await canvacord.Canvas.invert(revUpl).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `rev.png`, 'Ah não, sou daltônica!', id)
					})

				break

				case 'encurtar':
				case 'tinyurl':
					if (args.length == 0) return await kill.reply(from, mess.nolink(), id)
					const tinurl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`)
					if (tinurl.data == 'Error') return await kill.reply(from, mess.nolink() + '\n\n' + mess.fail(command, error, time), id)
					await kill.reply(from, `${args[0]} → ${tinurl.data}`, id)
				break

				case 'signo':
				case 'horoscopo':
					const signoerr = `❌ → ${args[0]} ← ❌!\n\n✔️ → Aries --- Taurus --- Gemini --- Cancer --- Leo --- Virgo --- Libra --- Scorpio --- Sagittarius --- Capricorn --- Aquarius --- Pisces.`
					if (args.length == 0) return await kill.reply(from, signoerr, id);
					const zodd = await axios.get(`https://horoscope-api.herokuapp.com/horoscope/today/${encodeURIComponent(args[0])}`)
					if (zodd.data.horoscope == '[]') return await kill.reply(from, signoerr, id);
					if (region == 'en') return await kill.reply(from, zodd.data.horoscope, id)
					await translate(zodd.data.horoscope, {
						to: region
					}).then(async (horoZod) => {
						await kill.reply(from, horoZod.text, id)
					})
				break

				case 'book':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'book name/nome do livro/nombre del libro.', id)
					const takeBook = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(body.slice(6))}&langRestrict=${region}`)
					const getBook = await axios.get(`${takeBook.data.items[0].selfLink}`)
					await kill.sendFileFromUrl(from, `${getBook.data.volumeInfo.imageLinks.thumbnail}`, 'book.jpg', mess.book(getBook), id)
				break

					/*As piadas VEM DE SERVIDOR e NÃO CONTROLAMOS elas.*/
				case 'piada':
					const piada = await axios.get('https://v2.jokeapi.dev/joke/Any?format=txt');
					if (region == 'en') return await kill.reply(from, piada.data, id)
					await translate(piada.data, {
						to: region
					}).then(async (getPiada) => {
						await kill.reply(from, getPiada.text, id)
					})
				break

				case 'alarme':
					if (args.length == 0 || isNaN(args[0]) || !arks.includes('|')) return await kill.reply(from, mess.timealarm() + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
					await kill.reply(from, mess.alarmact(args), id)
					setTimeout(() => {
						kill.reply(from, `⏰ - ${arg.split('|')[1]}!`, id)
					}, Number(arg.split('|')[0]) * 60000)
				break

				case 'hitler':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var thehitlerpic = await tools('cloud').upload(encryptMedia)
					} else {
						var thehitlerpic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (thehitlerpic == null || typeof thehitlerpic === 'object') thehitlerpic = errorImg
					await canvacord.Canvas.hitler(thehitlerpic).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `hitler.png`, '卍', id)
					})
				break

				case 'trash':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let mediaData = await decryptMedia(encryptMedia)
						var theTrashpic = await tools('cloud').upload(mediaData)
					} else {
						var theTrashpic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (theTrashpic == null || typeof theTrashpic === 'object') theTrashpic = errorImg
					await canvacord.Canvas.trash(theTrashpic).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `trash.png`, '🚮', id)
					})
				break

				case 'shit':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let mediaData = await decryptMedia(encryptMedia)
						var theshitpic = await tools('cloud').upload(mediaData)
					} else {
						var theshitpic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (theshitpic == null || typeof theshitpic === 'object') theshitpic = errorImg
					await canvacord.Canvas.shit(theshitpic).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `shit.png`, '💩💩💩', id)
					})
				break

				case 'blur':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let mediaData = await decryptMedia(encryptMedia)
						var theBlurpic = await tools('cloud').upload(mediaData)
					} else {
						var theBlurpic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (theBlurpic == null || typeof theBlurpic === 'object') theBlurpic = errorImg
					await canvacord.Canvas.blur(theBlurpic).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `blur.png`, '💡', id)
					})

				break

				case 'rip':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let mediaData = await decryptMedia(encryptMedia)
						var theRippic = await tools('cloud').upload(mediaData)
					} else {
						var theRippic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (theRippic == null || typeof theRippic === 'object') theRippic = errorImg
					await canvacord.Canvas.rip(theRippic).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `rip.png`, '☠️', id)
					})
				break

				case 'github':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Github Username.', id)
					await kill.reply(from, mess.wait(), id)
					const gitData = await axios.get(`https://api.github.com/users/${args[0]}`)
					const companY = (gitData.data.company == null) ? tools('others').noAwnsers() : gitData.data.company
					const bloG = (gitData.data.blog == "") ? tools('others').noAwnsers() : gitData.data.blog
					const emaiL = (gitData.data.email == null) ? tools('others').noAwnsers() : gitData.data.email
					const tramPar = (gitData.data.hireable == null) ? tools('others').noAwnsers() : gitData.data.hireable
					if (gitData.data.message == 'Not Found') return await kill.reply(from, mess.noresult(), id)
					await kill.sendFileFromUrl(from, `${gitData.data.avatar_url}`, 'avatar.png', mess.github(siteAdmin, companY, bloG, emaiL, tramPar, gitData), id)
				break

				case 'roubar':
					if (isQuotedSticker && arks.includes('|')) {
						await kill.reply(from, mess.wait(), id)
						let mediaData = await decryptMedia(encryptMedia)
						await kill.sendImageAsSticker(from, tools('others').dataURI(quotedMsg.mimetype, mediaData), {
							author: arg.split('|')[1],
							pack: arg.split('|')[0]
						})
					} else return await kill.reply(from, mess.onlyst() + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
				break

					/*Não deixe seus usuarios floodarem, caso contrario a bot pode desligar*/
				case 'sound':
				case 'bass':
					if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt || isMedia && isVideo || isQuotedVideo) {
						var format = (isMedia && isVideo || isQuotedVideo) ? 'mp4' : 'mp3'
						let mediaData = await decryptMedia(encryptMedia)
						await tools('ffmpeg').bass(mediaData, argl[0], argl[1], argl[2], argl[3], kill, message, format)
					} else return await kill.reply(from, mess.onlyaudio(), id)
				break

					/*Não deixe seus usuarios floodarem, caso contrario a bot pode desligar*/
				case 'nightcore':
					if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt || isMedia && isVideo || isQuotedVideo) {
						var format = (isMedia && isVideo || isQuotedVideo) ? 'mp4' : 'mp3'
						let mediaData = await decryptMedia(encryptMedia)
						await tools('ffmpeg').nightcore(mediaData, argl[0], kill, message, format)
					} else return await kill.reply(from, mess.onlyaudio(), id)
				break

					/*Não deixe seus usuarios floodarem, caso contrario a bot pode desligar*/
				case 'audio':
					if (isMedia && isVideo || isQuotedVideo) {
						let mediaData = await decryptMedia(encryptMedia)
						await tools('ffmpeg').audio(mediaData, kill, message, encryptMedia.mimetype)
					} else return await kill.reply(from, mess.onlyvideo(), id)
				break
				
				case 'reverse':
					var decryptedMedia = await decryptMedia(encryptMedia)
					if (isMedia && isVideo || isQuotedVideo) {
						await tools('ffmpeg').reverse(decryptedMedia, kill, message, args)
					} else if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
						await tools('ffmpeg').areverse(decryptedMedia, kill, message)
					} else return await kill.reply(from, `Use esse comando com audios e vídeos, se tentar usar em outro tipo de mídia não funcionará (use marcando!).`, id)
				break

				case 'bew':
				case 'peb':
				case 'alpha':
				case 'gray':
					if (isMedia && isVideo || isQuotedVideo) {
						var decryptedMedia = await decryptMedia(encryptMedia)
						await tools('ffmpeg').gray(decryptedMedia, kill, message)
					} else return await kill.reply(from, mess.onlyvideo(), id)
				break

				case 'mutevideo':
				case 'mutev':
					if (isMedia && isVideo || isQuotedVideo) {
						var decryptedMedia = await decryptMedia(encryptMedia)
						await tools('ffmpeg').mute(decryptedMedia, kill, message)
					} else return await kill.reply(from, mess.onlyvideo(), id)
				break


				case 'vblur':
					if (isMedia && isVideo || isQuotedVideo) {
						if (isNaN(Number(args[0])) && args.length != 0 || Number(args[0]) > 10 && args.length != 0) return await kill.reply(from, `Use este comando sem nada (Ex.: "/vblur") ou com um número de 1 até 10 para definir o quanto borrado ficará o vídeo (Ex.: "/vblur 5").`)
						var radius = args.length == 0 ? 20 : parseInt(Number(args[0]))
						var decryptedMedia = await decryptMedia(encryptMedia)
						await tools('ffmpeg').blur(decryptedMedia, kill, message, radius)
					} else return await kill.reply(from, mess.onlyvideo(), id)
				break

					/*Não, não possuo interesse em criar um painel que puxe dados pessoais de pessoas, pare de fod** gente inocente.*/
				case 'cpf':
					if (!region == 'pt') return await kill.reply(from, 'Brazil only/Brasil solamente!', id)
					if (args.length == 0) return await kill.reply(from, 'Insira um CPF', id)
					await kill.reply(from, mess.wait(), id)
					await tools('cpf').consulta(args[0], kill, message)
				break

				case 'policia':
					await kill.reply(from, mess.policemenu(), id)
				break

				case '01':
					if (mentionedJidList.length == 0 && !quotedMsg) return await kill.reply(from, mess.howtololi(), id)
					var addedLolicon = quotedMsg ? quotedMsgObj.sender.pushname : pushname
					if (mentionedJidList.length !== 0) {
						let mentPush = await kill.getContact(mentionedJidList[0])
						addedLolicon = mentPush.pushname || ' - "Censored by Government"'
					}
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Culpado') {
						fs.appendFileSync('./lib/config/Utilidades/lolicon.txt', `\n\n${addedLolicon} - ${lvpc} Years/Anos 🔒`)
					} else {
						fs.appendFileSync('./lib/config/Utilidades/lolicon.txt', `\n\n${addedLolicon} - Innocent/inocente 🔓`)
					}
					await kill.reply(from, mess.fbi(), id)
				break

				case '02':
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Inocente') {
						fs.appendFileSync('./lib/config/Utilidades/entregados.txt', `\n\n${pushname} - Innocent/inocente 🔓`)
					} else {
						fs.appendFileSync('./lib/config/Utilidades/entregados.txt', `\n\n${pushname} - ${lvpc} Years/Anos 🔒`)
					}
					await kill.reply(from, mess.arrested(), id)
				break

				case '03':
					if (mentionedJidList.length == 0 && !quotedMsg) return await kill.reply(from, mess.howtoshota(), id)
					var takeChild = quotedMsg ? quotedMsgObj.sender.pushname : pushname
					if (mentionedJidList.length !== 0) {
						let mentPush = await kill.getContact(mentionedJidList[0])
						takeChild = mentPush.pushname || ' - "Censored by Government"'
					}
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Culpado') {
						fs.appendFileSync('./lib/config/Utilidades/reversecon.txt', `\n\n${takeChild} - ${lvpc} Years/Anos 🔒`)
					} else {
						fs.appendFileSync('./lib/config/Utilidades/reversecon.txt', `\n\n${takeChild} - Innocent/inocente 🔓`)
					}
					await kill.reply(from, mess.cia(), id)
				break

				case '04':
					if (mentionedJidList.length == 0 && !quotedMsg) return await kill.reply(from, mess.howtocrime(), id)
					var crimeNet = quotedMsg ? quotedMsgObj.sender.pushname : pushname
					if (mentionedJidList.length !== 0) {
						let mentPush = await kill.getContact(mentionedJidList[0])
						crimeNet = mentPush.pushname || ' - "Censored by Government"'
					}
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Culpado') {
						fs.appendFileSync('./lib/config/Utilidades/crimereport.txt', `\n\n${crimeNet} (${arg.split('|')[1] || '🤢'}) - ${lvpc} Years/Anos 🔒`)
					} else {
						fs.appendFileSync('./lib/config/Utilidades/crimereport.txt', `\n\n${crimeNet} (${arg.split('|')[1] || '🤢'}) - Innocent/inocente 🔓`)
					}
					await kill.reply(from, mess.stars(), id)
				break

				case '05':
					if (mentionedJidList.length == 0 && !quotedMsg) return await kill.reply(from, mess.howtolgbts(), id)
					var genderFuck = quotedMsg ? quotedMsgObj.sender.pushname : pushname
					if (mentionedJidList.length !== 0) {
						let mentPush = await kill.getContact(mentionedJidList[0])
						genderFuck = mentPush.pushname || ' - "Censored by Government"'
					}
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Culpado') {
						fs.appendFileSync('./lib/config/Utilidades/gaysreport.txt', `\n\n${genderFuck} [${tools('others').getRandLine(1, './lib/config/Utilidades/lgbt.txt')[0]}] - ${lvpc} Years/Anos 🔒`)
					} else {
						fs.appendFileSync('./lib/config/Utilidades/gaysreport.txt', `\n\n${genderFuck} [${tools('others').getRandLine(1, './lib/config/Utilidades/lgbt.txt')[0]}] - Innocent/inocente 🔓`)
					}
					await kill.reply(from, mess.bsaa(), id)
				break

				case 'fbi':
					const loliconList = fs.readFileSync('./lib/config/Utilidades/lolicon.txt').toString()
					await kill.reply(from, loliconList, id)
				break

				case 'rpd':
					const peopleCrz = fs.readFileSync('./lib/config/Utilidades/entregados.txt').toString()
					await kill.reply(from, peopleCrz, id)
				break

				case 'cia':
					const reversePedo = fs.readFileSync('./lib/config/Utilidades/reversecon.txt').toString()
					await kill.reply(from, reversePedo, id)
				break

				case 'bsaa':
					const gaysArrest = fs.readFileSync('./lib/config/Utilidades/gaysreport.txt').toString()
					await kill.reply(from, gaysArrest, id)
				break

				case 'stars':
					const aLotCrime = fs.readFileSync('./lib/config/Utilidades/crimereport.txt').toString()
					await kill.reply(from, aLotCrime, id)
				break

					/*Adicione mais no arquivo "desafio.txt" e "verdade.txt", mas em inglês.*/
				case 'tord':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					if (args.length == 0) return await kill.reply(from, mess.tordare(), id)
					if (argl[0] == '-dare') {
						const desafios = fs.readFileSync('./lib/config/Utilidades/desafio.txt').toString().split('\n')
						const getDare = desafios[Math.floor(Math.random() * desafios.length)]
						if (region == 'en') return await kill.reply(from, getDare, id)
						await translate(getDare, {
							to: region
						}).then(async (darem) => {
							await kill.reply(from, darem.text, id)
						})
					} else if (argl[0] == '-truth') {
						const verdadeG = fs.readFileSync('./lib/config/Utilidades/verdade.txt').toString().split('\n')
						const getTruth = verdadeG[Math.floor(Math.random() * verdadeG.length)]
						if (region == 'en') return await kill.reply(from, getTruth, id)
						await translate(getTruth, {
							to: region
						}).then(async (truthm) => {
							await kill.reply(from, truthm.text, id)
						})
					} else if (argl[0] == '-r') {
						await kill.reply(from, 'OK! Vamos outra!\nVerdade ou Desafio? (-truth or -dare)?', id)
					} else return await kill.reply(from, mess.tordare(), id)
				break

					/*Adicione mais no arquivo "never.txt", mas em inglês.*/
				case 'nunca':
					if (region == 'en') return await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/never.txt')[0], id)
					await translate(tools('others').getRandLine(1, './lib/config/Utilidades/never.txt')[0], {
						to: region
					}).then(async (willdo) => {
						await kill.reply(from, willdo.text, id)
					})
				break

					/*Adicione mais no arquivo "cantadas.txt", mas em inglês.*/
				case 'cantada':
					if (region == 'en') return await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/cantadas.txt')[0], id)
					await translate(tools('others').getRandLine(1, './lib/config/Utilidades/cantadas.txt')[0], {
						to: region
					}).then(async (notHappy) => {
						await kill.reply(from, notHappy.text, id)
					})
				break

				case 'sort':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar(), id)
					await kill.reply(from, tools('others').randVal(arg.split('|')), id)
				break

				case 'biblia':
				case 'bible':
					try {
						if (argl[0] == '-g') {
							let biblin = await shell.exec(`bash -c "grep -i "${body.slice(13)}" lib/config/Utilidades/biblia.txt | shuf -n 1"`, {
								silent: true
							}).stdout
							if (biblin == '') {
								if (region == 'en') return await kill.reply(from, tools('others').getRandLine(1, './lib/config/Utilidades/biblia.txt')[0], id)
								await translate(tools('others').getRandLine(1, './lib/config/Utilidades/biblia.txt')[0], {
									to: region
								}).then(async (bible) => {
									await kill.reply(from, bible.text, id)
								})
							} else {
								if (region == 'en') return await kill.reply(from, biblin, id)
								await translate(biblin, {
									to: region
								}).then(async (bible) => {
									await kill.reply(from, bible.text, id)
								})
							}
						} else return await translate(tools('others').getRandLine(1, './lib/config/Utilidades/biblia.txt')[0], {
							to: region
						}).then(async (bible) => {
							await kill.reply(from, bible.text, id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'steal':
					if (!isxp) return await kill.reply(from, mess.needxpon(), id)
					if (mentionedJidList.length == 0 && !quotedMsg) return await kill.reply(from, mess.semmarcar(), id)
					if (tools('gaming').isLimit(sender.id, daily, 'steal')) return await kill.reply(from, mess.steal(), id)
					var theStealK = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : null)
					if (theStealK == null || theStealK == botNumber) return await kill.reply(from, mess.cmdfailed(), id)
					const stealAlvo = tools('gaming').getValue(theStealK, nivel, chatId, 'xp')
					if (stealAlvo <= 1000) return await kill.sendTextWithMentions(from, mess.notalvo(theStealK, stealAlvo), id) /*Precisa de 1000 XP para roubar*/
					const checkUserXP = tools('gaming').getValue(sender.id, nivel, chatId, 'xp')
					const getUsrLevel = tools('gaming').getValue(sender.id, nivel, chatId, 'level')
					var xpSteal = parseInt(stealAlvo / 10, 10);
					var stealGain = Math.floor(Math.random() * xpSteal + Number(lvpc)) + Number(lvpc);
					var stealLose = Number(-stealGain)
					let forTimes = 0
					while (forTimes < 10) {
						forTimes++
						if (stealLose < -checkUserXP || isNaN(stealGain) || isNaN(stealLose) || stealGain > Number(config.Max_Steal)) {
							stealGain = parseInt(stealGain / 2, 10)
							stealLose = Number(-stealGain)
						}
					}
					var stGuild = tools('gaming').getValue(sender.id, nivel, chatId, 'guild')
					if (stGuild.toUpperCase() == 'THIEVES') {
						lvpc = parseInt(lvpc + (getUsrLevel / 3), 10) /*Beneficio da Guilda Thieves, melhora o Steal sem limites*/
					} else if (stGuild.toUpperCase() == 'COMPANIONS') {
						lvpc = parseInt(lvpc + (getUsrLevel / 5), 10)
					} /*Beneficio da Guilda Companions, melhora o Steal mas com limitação*/
					if (lvpc > 70) {
						await kill.sendTextWithMentions(from, mess.stealwkd(theStealK, stealGain))
						tools('gaming').addValue(sender.id, Number(stealGain), nivel, chatId, 'xp')
						tools('gaming').addValue(theStealK, Number(stealLose), nivel, chatId, 'xp')
					} else {
						await kill.sendTextWithMentions(from, mess.stealfail(theStealK, stealLose))
						tools('gaming').addValue(sender.id, Number(stealLose), nivel, chatId, 'xp')
						tools('gaming').addValue(theStealK, Number(stealGain), nivel, chatId, 'xp')
					}
					if (objconfig.noLimits == 0) return tools('gaming').addLimit(sender.id, daily, 'steal')
				break

				case 'doar':
					if (!isxp) return await kill.reply(from, mess.needxpon(), id)
					if (objconfig.agiotas.includes(sender.id)) return await kill.reply(from, `Você agiotou ou foi agiotado por alguém, para fazer isso novamente aguarde que a agiotagem anterior termine.`, id)
					if (args.length == 0) return await kill.reply(from, mess.semmarcar() + `\n\nEx: ${prefix}give @user <value/valor>`, id)
					const checkValue = tools('gaming').getValue(sender.id, nivel, chatId, 'xp')
					var theXpdonate = quotedMsg ? parseInt(args[0], 10) : (mentionedJidList.length !== 0 ? parseInt(args[1], 10) : parseInt(args[1], 10))
					if (isNaN(theXpdonate) || !tools('others').isInt(theXpdonate) || Number(theXpdonate) > checkValue || theXpdonate < 1) return await kill.reply(from, mess.noxpalv(checkValue), id)
					var sortFd = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : null)
					if (sortFd == null) return await kill.reply(from, mess.cmdfailed(), id)
					tools('gaming').addValue(sender.id, Number(-theXpdonate), nivel, chatId, 'xp')
					tools('gaming').addValue(sortFd, Number(theXpdonate), nivel, chatId, 'xp')
					await kill.sendTextWithMentions(from, mess.xpdon(sortFd, theXpdonate))
				break

				case 'bang':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					var bangme = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : randomMember)
					await kill.sendStickerfromUrl(from, `https://steamuserimages-a.akamaihd.net/ugc/693902535301465982/17F72381587B6BE37BF2E36D159A75486CA097AA/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false`, {
						author: config.Sticker_Author,
						pack: config.Sticker_Pack,
						keepScale: true
					})
					await kill.sendTextWithMentions(from, mess.lolibang(sender.id, bangme, tools('others').getRandLine(1, './lib/config/Utilidades/armas.txt')[0]), id)
				break

				case 'trends':
					var aFplaceOnEarth = args.length !== 0 ? args[0] : region == 'pt' ? 'brazil' : region == 'en' ? 'united-states' : 'spain'
					if (argl[0] == '-global') aFplaceOnEarth = ''
					const newsNow = await tools('trends').refs(`https://trends24.in/${aFplaceOnEarth}`)
					if (newsNow[0].length == 0) return await kill.reply(from, mess.noresult(), id)
					await kill.reply(from, `🌎 - Twitter Trendings [${aFplaceOnEarth.toUpperCase()}]\n\n${newsNow[0].join('\n\n#')}`, id)
				break

					/*Obrigado pela base Pedro Batistop*/
				case 'market':
					if (args.length == 0) return await kill.reply(from, mess.reMerchant(), id) /*Mude o MLB se desejar*/
					const getML = await axios.get(`https://api.mercadolibre.com/sites/${arg.split('|')[1] || 'MLB'}/search?q=${encodeURIComponent(arg.split('|')[1] || body.slice(7))}&limit=1#json`)
					const isNewP = getML.data.results[0].condition == 'new' ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					const temLoja = getML.data.results[0].shipping.store_pick_up ? tools('others').yesAwnsers() : tools('others').noAwnsers()
					await kill.sendFileFromUrl(from, `${getML.data.results[0].thumbnail}`, 'produto.jpg', mess.theStore(getML, isNewP, temLoja), id)
				break

					/*Sem XP, por que precisamos de jogos livres também*/
				case 'jokenpo':
					const bigThree = Math.floor(Math.random() * 3) + 1;
					const jokenPedra = ['pedra', '✊', '✊🏻', '✊🏼', '✊🏽', '✊🏾', 'rock', 'piedra', '🪨'];
					const jokenLesb = ['tesoura', '✌️', '✌🏻', '✌🏼', '✌🏽', '✌🏾', '✌🏿', 'scissors', 'tijera', '✂️'];
					const jokenPaper = ['papel', '✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿', 'paper', '🤚', '🤚🏻', '🤚🏼', '🤚🏽', '🤚🏾', '🤚🏿']
					if (!jokenPedra.includes(args[0]) && !jokenPaper.includes(args[0]) && !jokenLesb.includes(args[0])) return await kill.reply(from, mess.noargs() + 'pedra [✊🏻], papel [✋🏿] ou tesoura [✌️]', id)
					const needPlay = jokenPedra.includes(args[0]) ? 1 : jokenPaper.includes(args[0]) ? 2 : jokenLesb.includes(args[0]) ? 3 : false
					const theMove = bigThree == 1 ? '✊🏻 - Pedra/Rock/Piedra' : bigThree == 2 ? '✋🏿 - Papel/Paper' : bigThree == 3 ? '✌️ - Tesoura/Tijera/Scissors' : 'Algo'
					if (needPlay == bigThree) {
						await kill.reply(from, mess.nowinjoken(theMove), id)
					} else if (needPlay == 2 && bigThree == 1 || needPlay == 3 && bigThree == 2 || needPlay == 1 && bigThree == 3) {
						await kill.reply(from, mess.winjoken(theMove, args), id)
					} else return await kill.reply(from, mess.losejoken(theMove, args), id)
				break

				case 'views':
					if (!quotedMsg) return await kill.reply(from, mess.nomark(), id)
					if (!quotedMsgObj.fromMe) return await kill.reply(from, mess.mymess(), id)
					const whoInpo = await kill.getMessageReaders(quotedMsg.id)
					var eAK47 = '👀 - Views - 👀\n'
					if (whoInpo[0] == null) return kill.reply(from, mess.noviews(), id)
					for (let i in whoInpo) {
						var thefuckName = whoInpo[i].pushname == null ? '??? - Top secret name - ???' : whoInpo[i].pushname
						eAK47 += `\n- ${thefuckName} - (wa.me/${whoInpo[i].id.replace('@c.us', '')})\n`
					}
					await kill.reply(from, eAK47, id)
				break

				case 'ctt':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.noargs(), id)
					await kill.sendVCard(from, `BEGIN:VCARD\nVERSION:3.0\nFN;CHARSET=UTF-8:${arg.split('|')[1]}\nTEL;TYPE=CELL,VOICE:${arg.split('|')[0]}\nEND:VCARD`)
				break

				case 'gerador':
					let genpeo = await shell.exec(`bash lib/functions/config.sh dados`, {
						silent: true
					})
					if (genpeo.stdout == '') {
						await kill.reply(from, mess.fail(command, genpeo.stderr, time), id)
						console.log(genpeo.stderr)
					} else return await kill.sendFileFromUrl(from, 'https://thispersondoesnotexist.com/image', 'image.jpg', genpeo.stdout, id)
				break

				case 'movie':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'movie Name/Nome de Filme.', id)
					const movieInfo = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${config.API_TheMovieDB}&query=${encodeURIComponent(body.slice(7))}&language=${region}`)
					if (movieInfo.data.total_results == 0) return await kill.reply(from, mess.noresult(), id)
					const fotoFilme = movieInfo.data.results[0].backdrop_path == null ? errorImg : `https://image.tmdb.org/t/p/original${movieInfo.data.results[0].backdrop_path}`
					await kill.sendFileFromUrl(from, fotoFilme, 'filme.jpg', mess.movies(region, movieInfo), id)
				break

				case 'news':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Theme/Tema.', id)
					const theNews = await axios.get(`https://news.google.com/rss/search?q=${body.slice(6)}&hl=${region}`)
					fs.writeFileSync('./lib/news.xml', theNews.data)
					let graNews = await shell.exec(`bash -c "grep -i "${body.slice(13)}" lib/config/Utilidades/biblia.txt | shuf -n 1"`, {
						silent: true
					})
					if (graNews.stdout == '') {
						await kill.reply(from, mess.fail(command, graNews.stderr, time), id)
						console.log(graNews.stderr)
					} else return await kill.reply(from, graNews.stdout, id)
				break

				case 'tweet':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Twitter @.', id)
					const twitterMsg = await axios.get(`https://decapi.me/twitter/latest/${args[0]}`).catch(async (e) => {
						await kill.reply(from, 'Nada encontrado', id)
					})
					await kill.reply(from, `${args[0]} → "${twitterMsg.data}".`, id)
				break

				case 'number':
					if (args.length == 0 || isNaN(args[0]) || isNaN(args[1])) return await kill.reply(from, mess.noargs() + `Min-Number Max-Number.\n\nEx: ${prefix}Number 1 10`, id)
					await kill.reply(from, `☘ - ${tools('others').randomNumber(args[0], args[1])} - ☘`, id)
				break

				case 'deezer':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'name of song/nome da música/nombre de música.', id)
					try {
						const musicFind = (await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(body.slice(8))}`)).data
						if (musicFind.total == 0) return await kill.reply(from, mess.noresult(), id)
						await kill.sendFileFromUrl(from, musicFind.data[0].album.cover, 'cover.jpg', mess.musicdzr(musicFind.data[0]), id)
						await kill.sendAudio(from, musicFind.data[0].preview, id)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time) + '\n\n' + `Use ${prefix}Play.`, id)
					}
				break

				case 'dark':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Dark/Deep-Web Website.', id)
					const darkNet = await axios.get(`https://darksearch.io/api/search?query=${encodeURIComponent(body.slice(6))}`)
					if (darkNet.data.total == 0) return await kill.reply(from, mess.noresult(), id)
					await kill.reply(from, `Sites: ${darkNet.data.data.length}\n\n` + darkNet.data.data.map(res => `\n${res.title}\n\n${res.link}\n\n`).join(''), id)
				break

				case 'drink':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Bebida/Drink.', id)
					const aSolitareDrink = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(body.slice(7))}`).data
					if (aSolitareDrink.drinks == null) return await kill.reply(from, mess.noresult(), id)
					const garsonDK = aSolitareDrink.drinks[0]
					var aCock = ''
					var ingredient = 0
					var qtdozig = 0
					let whileTimes = 0
					while (whileTimes < 10) {
						whileTimes++
						var funcDrink = eval(`garsonDK.strIngredient${i}`);
						var ingreDrink = eval(`garsonDK.strMeasure${i}`)
						if (!funcDrink == null || !funcDrink == '') {
							aCock += `Item ${ingredient + 1} = ${funcDrink} `
							ingredient = ingredient + 1
						}
						if (!ingreDrink == null || !ingreDrink == '') {
							aCock += `- ${ingreDrink}\n\n`
							qtdozig = qtdozig + 1
						}
					}
					if (region == 'en') return await kill.sendFileFromUrl(from, garsonDK.strDrinkThumb, 'drink.jpg', `Drink: ${garsonDK.strDrink}\n\nAlcoholic? ${garsonDK.strAlcoholic == 'Alcoholic' ? 'Yes' : 'No'}\n\n${aCock}\n\nMaking: ${garsonDK.strInstructions}`, id)
					await translate(garsonDK.strInstructions, {
						to: region
					}).then(async (drink) => {
						await kill.sendFileFromUrl(from, garsonDK.strDrinkThumb, 'drink.jpg', mess.drinkcmd(garsonDK, aCock, drink.text), id)
					})
				break

				case 'meal':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Food/Comida.', id)
					const sanjiFood = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(body.slice(6))}`)
					if (sanjiFood.data.meals == null) return await kill.reply(from, mess.noresult(), id)
					const garsonFD = sanjiFood.data.meals[0];
					var cookTa = '';
					var fingredi = 0;
					var ingdefod = 0
					let repeatTimes = 0
					while (repeatTimes < 10) {
						repeatTimes++
						var funcFood = eval(`garsonFD.strIngredient${i}`);
						var ingreFood = eval(`garsonFD.strMeasure${i}`)
						if (!funcFood == null || !funcFood == '') {
							cookTa += `Item ${fingredi + 1} = ${funcFood} `;
							fingredi = fingredi + 1
						}
						if (!ingreFood == null || !ingreFood == '') {
							cookTa += `- ${ingreFood}\n\n`;
							ingdefod = ingdefod + 1
						}
					}
					if (region == 'en') return await kill.sendFileFromUrl(from, garsonFD.strMealThumb, 'food.jpg', `Food: ${garsonFD.strMeal}\n\nTypical: ${garsonFD.strArea}\n\n${cookTa}\n\nCooking: ${garsonFD.strInstructions}`, id)
					await translate(garsonFD.strInstructions, {
						to: region
					}).then(async (food) => {
						await kill.sendFileFromUrl(from, garsonFD.strMealThumb, 'food.jpg', mess.mealcmd(garsonFD, cookTa, food.text), id)
					})
				break

				case 'mymsg':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Recado.', id)
					delete custom[sender.id]
					custom[sender.id] = {
						msg: body.slice(7)
					}
					fs.writeFileSync('./lib/config/Gerais/custom.json', JSON.stringify(custom, null, "\t"))
					await kill.reply(from, mess.maked(), id)
				break

				case 'jail':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var theJailPictu = await tools('cloud').upload(encryptMedia)
					} else {
						var sendJailPictre = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var theJailPictu = await kill.getProfilePicFromServer(sendJailPictre)
					}
					if (typeof theJailPictu == 'object' || !tools('others').isUrl(theJailPictu)) {
						theJailPictu = await kill.getProfilePicFromServer(randomMember)
						if (typeof theJailPictu == 'object' || !tools('others').isUrl(theJailPictu)) {
							theJailPictu = errorImg
						}
					}
					await canvacord.Canvas.jail(theJailPictu, true).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `jail.png`, '', id)
					})
				break

				case 'beijo':
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							let encryptMedia = await decryptMedia(encryptMedia)
							var theKisuPict = await tools('cloud').upload(encryptMedia)
							var theKisuPict2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
						} else {
							if (mentionedJidList.length == 2) {
								var theKisuPict = await kill.getProfilePicFromServer(mentionedJidList[0])
								var theKisuPict2 = await kill.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var theKisuPict = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id)
								var theKisuPict2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : await kill.getProfilePicFromServer(sender.id)
							}
							if (theKisuPict == null || typeof theKisuPict === 'object') theKisuPict = errorImg;
							if (theKisuPict2 == null || typeof theKisuPict2 === 'object') theKisuPict2 = errorImg
						}
						await canvacord.Canvas.kiss(theKisuPict, theKisuPict2).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `kiss.png`, '', id)
						})
					} else return await kill.reply(from, mess.semmarcar() + '\n2x.', id)
				break

				case 'bed':
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							let encryptMedia = await decryptMedia(encryptMedia)
							var theBedPict = await tools('cloud').upload(encryptMedia)
							var theBedPict2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
						} else {
							if (mentionedJidList.length == 2) {
								var theBedPict = await kill.getProfilePicFromServer(mentionedJidList[0])
								var theBedPict2 = await kill.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var theBedPict = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id)
								var theBedPict2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : await kill.getProfilePicFromServer(sender.id)
							}
							if (theBedPict == null || typeof theBedPict === 'object') theBedPict = errorImg;
							if (theBedPict2 == null || typeof theBedPict2 === 'object') theBedPict2 = errorImg
						}
						await canvacord.Canvas.bed(theBedPict, theBedPict2).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `bed.png`, '', id)
						})
					} else return await kill.reply(from, mess.semmarcar() + '\n2x.', id)
				break

				case 'clyde':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Message/Mensagem.', id)
					await canvacord.Canvas.clyde(body.slice(7)).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `clyde.png`, '', id)
					})
				break

				case 'spank':
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							let encryptMedia = await decryptMedia(encryptMedia)
							var theSpankPic = await tools('cloud').upload(encryptMedia)
							var theSpankPic2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
						} else {
							if (mentionedJidList.length == 2) {
								var theSpankPic = await kill.getProfilePicFromServer(mentionedJidList[0])
								var theSpankPic2 = await kill.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var theSpankPic = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id)
								var theSpankPic2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : await kill.getProfilePicFromServer(sender.id)
							}
							if (theSpankPic == null || typeof theSpankPic === 'object') theSpankPic = errorImg;
							if (theSpankPic2 == null || typeof theSpankPic2 === 'object') theSpankPic2 = errorImg
						}
						await canvacord.Canvas.spank(theSpankPic, theSpankPic2).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `spank.png`, '', id)
						})
					} else return await kill.reply(from, mess.semmarcar() + '\n2x.', id)
				break

				case 'batslap':
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							let encryptMedia = await decryptMedia(encryptMedia)
							var theBatSlap = await tools('cloud').upload(encryptMedia)
							var theBatSlap2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
						} else {
							if (mentionedJidList.length == 2) {
								var theBatSlap = await kill.getProfilePicFromServer(mentionedJidList[0])
								var theBatSlap2 = await kill.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var theBatSlap = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id)
								var theBatSlap2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : await kill.getProfilePicFromServer(sender.id)
							}
							if (theBatSlap == null || typeof theBatSlap === 'object') theBatSlap = errorImg;
							if (theBatSlap2 == null || typeof theBatSlap2 === 'object') theBatSlap2 = errorImg
						}
						await canvacord.Canvas.slap(theBatSlap, theBatSlap2).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `spank.png`, '', id)
						})
					} else return await kill.reply(from, mess.semmarcar() + '\n2x.', id)
				break

				case 'distract':
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							let encryptMedia = await decryptMedia(encryptMedia)
							var theboyfriend = await tools('cloud').upload(encryptMedia)
							var theboyfriend2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
							var theboyfriend3 = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[1]) : await kill.getProfilePicFromServer(sender.id)
						} else {
							if (mentionedJidList.length == 3) {
								var theboyfriend = await kill.getProfilePicFromServer(mentionedJidList[0])
								var theboyfriend2 = await kill.getProfilePicFromServer(mentionedJidList[1])
								var theboyfriend3 = await kill.getProfilePicFromServer(mentionedJidList[2])
							} else {
								var theboyfriend = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id)
								var theboyfriend2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : await kill.getProfilePicFromServer(sender.id)
								var theboyfriend3 = await kill.getProfilePicFromServer(randomMember)
							}
							if (theboyfriend == null || typeof theboyfriend === 'object') theboyfriend = errorImg
							if (theboyfriend2 == null || typeof theboyfriend2 === 'object') theboyfriend2 = errorImg
							if (theboyfriend3 == null || typeof theboyfriend3 === 'object') theboyfriend3 = errorImg
						}
						await canvacord.Canvas.distracted(theboyfriend, theboyfriend2, theboyfriend3).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `distract.png`, '', id)
						})
					} else return await kill.reply(from, mess.semmarcar() + '\n3x.', id)
				break

				case 'joke':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var jokErPictF = await tools('cloud').upload(encryptMedia)
					} else {
						var jokErPictF = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (jokErPictF == null || typeof jokErPictF === 'object') jokErPictF = errorImg
					await canvacord.Canvas.jokeOverHead(jokErPictF).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `joke.png`, '', id)
					})
				break

				case 'mind':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Message/Mensagem.', id)
					await canvacord.Canvas.changemymind(body.slice(6)).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `mind.png`, '', id)
					})

				break

				case 'ohno':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Message/Mensagem.', id)
					await canvacord.Canvas.ohno(body.slice(6)).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `ohno.png`, '', id)
					})

				break

				case 'baby':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var thenidabPictu = await tools('cloud').upload(encryptMedia)
					} else {
						var thenidabPictu = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (thenidabPictu == null || typeof thenidabPictu === 'object') thenidabPictu = errorImg
					await canvacord.Canvas.affect(thenidabPictu).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `baby.png`, '', id)
					})

				break

				case 'fuse':
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							let encryptMedia = await decryptMedia(encryptMedia)
							var fundPict = await tools('cloud').upload(encryptMedia)
							var fundPict2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
						} else {
							if (mentionedJidList.length == 2) {
								var fundPict = await kill.getProfilePicFromServer(mentionedJidList[0])
								var fundPict2 = await kill.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var fundPict = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id)
								var fundPict2 = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : await kill.getProfilePicFromServer(sender.id)
							}
							if (fundPict == null || typeof fundPict === 'object') fundPict = errorImg;
							if (fundPict2 == null || typeof fundPict2 === 'object') fundPict2 = errorImg
						}
						await canvacord.Canvas.fuse(fundPict, fundPict2).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `fuse.png`, '', id)
						})
					} else return await kill.reply(from, mess.semmarcar() + '\n2x.', id)

				break

				case 'beauty':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var thebeautPictu = await tools('cloud').upload(encryptMedia)
					} else {
						var thebeautPictu = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (thebeautPictu == null || typeof thebeautPictu === 'object') thebeautPictu = errorImg
					await canvacord.Canvas.beautiful(thebeautPictu).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `beautiful.png`, '', id)
					})

				break

				case 'pixel':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var thePixelPictu = await tools('cloud').upload(encryptMedia)
					} else {
						var thePixelPictu = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (thePixelPictu == null || typeof thePixelPictu === 'object') thePixelPictu = errorImg
					await canvacord.Canvas.pixelate(thePixelPictu).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `pixelate.png`, '', id)
					})
				break

				case 'reward':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const getWantedPic = decryptMedia(encryptMedia)
						var thePicWanted = await tools('cloud').upload(getWantedPic)
					} else {
						var thePicWanted = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (thePicWanted == null || typeof thePicWanted === 'object') thePicWanted = errorImg
					await canvacord.Canvas.wanted(thePicWanted).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `reward.png`, '', id)
					})

				break

				case 'sharp':
					await kill.reply(from, mess.wait(), id);
					var sharplvl = 1
					if (isImage || isQuotedImage) {
						const downNmrImg = decryptMedia(encryptMedia)
						var theSharpedImg = await tools('cloud').upload(downNmrImg)
					} else {
						var theSharpedImg = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (theSharpedImg == null || typeof theSharpedImg === 'object') theSharpedImg = errorImg;
					sharplvl = mentionedJidList.length !== 0 ? args[1] : args.length >= 1 && !isNaN(args[0]) ? args[0] : 1
					await canvacord.Canvas.sharpen(theSharpedImg).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `sharp.png`, '', id)
					})

				break

				case 'burn':
					await kill.reply(from, mess.wait(), id);
					var burnlvl = 1
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var theBurnFire = await tools('cloud').upload(encryptMedia)
					} else {
						var theBurnFire = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (theBurnFire == null || typeof theBurnFire === 'object') theBurnFire = errorImg;
					burnlvl = mentionedJidList.length !== 0 ? args[1] : args.length >= 1 && !isNaN(args[0]) ? args[0] : 1
					await canvacord.Canvas.burn(theBurnFire, Number(burnlvl)).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `burn.png`, '', id)
					})

				break

				case 'shold':
					await kill.reply(from, mess.wait(), id);
					var thrqtd = 100
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var theThreImg = await tools('cloud').upload(encryptMedia)
					} else {
						var theThreImg = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
					}
					if (theThreImg == null || typeof theThreImg === 'object') theThreImg = errorImg;
					thrqtd = mentionedJidList.length !== 0 ? Number(args[1]) + 100 : args.length >= 1 && !isNaN(args[0]) ? Number(args[0]) + 100 : 100
					await canvacord.Canvas.threshold(theThreImg, Number(thrqtd)).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `threshold.png`, '', id)
					})

				break

				case 'opnion':
					await kill.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var theLGBTopn = await tools('cloud').upload(encryptMedia)
					} else {
						var optimg = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var theLGBTopn = await kill.getProfilePicFromServer(optimg)
					}
					if (typeof theLGBTopn == 'object' || !tools('others').isUrl(theLGBTopn)) {
						theLGBTopn = await kill.getProfilePicFromServer(randomMember)
						if (typeof theLGBTopn == 'object' || !tools('others').isUrl(theLGBTopn)) {
							theLGBTopn = errorImg
						}
					}
					await canvacord.Canvas.opinion(theLGBTopn, body.slice(8).replace(mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join(' '), '')).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `opnion.png`, '', id)
					})
				break

				case 'surprise':
					const surpmother = fs.readFileSync('./lib/config/Utilidades/sounds.txt').toString().split('\n')
					try {
						await kill.sendFileFromUrl(from, `https://www.myinstants.com/media/sounds/${tools('others').randVal(surpmother)}`, 'audio.mp3', '', null, null, null, true, null, null)
					} catch (error) {
						await kill.sendPtt(from, 'https://www.myinstants.com/media/sounds/soviet-anthem-but-its-sung-by-a-loli-audiotrimmer.mp3')
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'casal':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					if (args.length == 0 || isNaN(args[0])) return await kill.reply(from, mess.casais(), id)
					var casaltop = `-----[ *❤️ TOP ${args[0]} CASAIS ❤️* ]----\n\n`
					for (let i = 0; i < Number(args[0]); i++) {
						let csl1 = await kill.getContact(tools('others').randVal(groupMembersId))
						let csl2 = await kill.getContact(tools('others').randVal(groupMembersId))
						casaltop += `${i + 1} - (${csl1.pushname || 'wa.me/' + csl1.id.replace('@c.us', '')}) + (${csl2.pushname || 'wa.me/' + csl2.id.replace('@c.us', '')})\n\n`
					}
					await kill.reply(from, casaltop, id)
				break

				case 'top':
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
					if (args.length <= 1 || !arks.includes('|') || isNaN(arg.split('|')[0])) return await kill.reply(from, mess.noargs() + 'Max. Users | TOP' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
					var umtoprps = `-----[ *# TOP ${arg.split('|')[0]} ${arg.split('|')[1]} #* ]----\n\n`
					for (let i = 0; i < Number(arg.split('|')[0]); i++) {
						let top1 = await kill.getContact(tools('others').randVal(groupMembersId))
						umtoprps += `${i + 1} - (${top1.pushname || 'wa.me/' + top1.id.replace('@c.us', '')})\n\n`
					}
					await kill.reply(from, umtoprps, id)
				break

				case 'custom':
					if (args.length <= 1 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'CMD | MSG' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
					if (Object.keys(cmds).includes(chatId) && Object.keys(cmds[chatId]).includes(removeAccents(arg.split('|')[0].replace(' ', '').toLowerCase()))) {
						await kill.reply(from, mess.cmdExist(), id)
					} else {
						if (!Object.keys(cmds).includes(chatId)) {
							cmds[chatId] = {}
						}
						cmds[chatId][removeAccents(arg.split('|')[0].replace(' ', '').toLowerCase())] = arg.split('|')[1]
						fs.writeFileSync('./lib/config/Gerais/cmds.json', JSON.stringify(cmds, null, "\t"))
						await kill.reply(from, mess.cmdAdded(arg), id)
					}
				break

				case 'run':
					if (args.length == 0) return await kill.reply(from, mess.onlyccmds(), id)
					if (Object.keys(cmds).includes(chatId) && Object.keys(cmds[chatId]).includes(argl[0])) {
						await kill.reply(from, cmds[chatId][argl[0]], id)
					} else if (Object.keys(cmds['global']).includes(argl[0])) {
						await kill.reply(from, cmds['global'][argl[0]], id)
					} else await kill.reply(from, mess.cmdnotfound(argl[0]))	
				break

				case 'cmds':
					if (Object.keys(cmds).includes(chatId)) {
						await kill.reply(from, `Custom CMDS ↓\n\n➸ ${Object.keys(cmds[chatId]).join('\n➸ ')}`, id)
					} else await kill.reply(from, mess.noresult(), id)
				break

				// Você pode jogar sozinho marcando a Íris de oponente, ela sabe jogar
				case 'tictac':
					if (args.length == 0 || argl[0] == '-help') return await kill.reply(from, mess.tictactoe(), id)
					const theplayer2 = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : null)
					const resetGameNew = () => {
						tttSet[chatId] = {
							thePlayerGame: 0,
							thePlayerGame2: 0,
							thePlayerGameOld: 0,
							thePlayerGameOld2: 0,
							xjogadas: [],
							ojogadas: [],
							waitJogo: 0,
							timesPlayed: 0,
							tictacplays: ["a1", "b1", "c1", "a2", "b2", "c2", "a3", "b3", "c3"],
							aiplaying: ["-", "-", "-", "-", "-", "-", "-", "-", "-"],
							tttboard: {
								a1: 'A1',
								a2: 'A2',
								a3: 'A3',
								b1: 'B1',
								b2: 'B2',
								b3: 'B3',
								c1: 'C1',
								c2: 'C2',
								c3: 'C3'
							},
							finalAwnser: 0,
							isValidGame: 0
						}
					}
					const tboards = async () => {
						delete tttSet[chatId].tttboard.undefined // Caso alguma jogada por como erro
						let anamazs = await canvacord.Canvas.tictactoe(tttSet[chatId].tttboard, {
							bg: '#000000',
							bar: '#FFFFFF'
						})
						return anamazs
					}
					if (!Object.keys(tttSet).includes(chatId)) {
						resetGameNew()
					}
					if (argl[0] == '-show') {
						await kill.sendImageAsSticker(from, await tboards(), {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
					if (theplayer2 !== null) {
						tttSet[chatId]['isValidGame'] = 1
					}
					if (sender.id == tttSet[chatId].thePlayerGameOld && argl[0] == '-cancel' || sender.id == tttSet[chatId].thePlayerGameOld2 && argl[0] == '-cancel') {
						await kill.reply(from, mess.cancelgame(), id)
						return await resetGameNew()
					}
					if (tttSet[chatId].thePlayerGame == 0 && tttSet[chatId].waitJogo == 0 && tttSet[chatId].isValidGame == 1 || sender.id == tttSet[chatId].thePlayerGame && tttSet[chatId].waitJogo == 0 && tttSet[chatId].isValidGame == 1 || tttSet[chatId].thePlayerGame2 == sender.id && tttSet[chatId].waitJogo == 0 && tttSet[chatId].isValidGame == 1) {
						if (!tttSet[chatId].tictacplays.includes(argl[0])) return await kill.reply(from, mess.tictactoe(), id)
						tttSet[chatId].waitJogo = 1
						tttSet[chatId].timesPlayed == 0 ? tttSet[chatId].thePlayerGame = sender.id : tttSet[chatId].thePlayerGame = tttSet[chatId].thePlayerGameOld
						tttSet[chatId].timesPlayed == 0 ? tttSet[chatId].thePlayerGame2 = theplayer2 : tttSet[chatId].thePlayerGame2 = tttSet[chatId].thePlayerGameOld2
						tttSet[chatId].thePlayerGameOld = tttSet[chatId].thePlayerGame
						tttSet[chatId].thePlayerGameOld2 = tttSet[chatId].thePlayerGame2
						if (sender.id == tttSet[chatId].thePlayerGameOld) {
							var spliceindex = tttSet[chatId].xjogadas.push(argl[0])
							tttSet[chatId].tttboard[argl[0]] = 'X'
							var spliceindex2 = tttSet[chatId].tictacplays.indexOf(argl[0])
							if (spliceindex2 !== -1) {
								tttSet[chatId].tictacplays.splice(spliceindex2, 1)
								tttSet[chatId].aiplaying[spliceindex2] = 'X'
							}
						} else if (sender.id == tttSet[chatId].thePlayerGameOld2) {
							var irissplice = tttSet[chatId].ojogadas.push(argl[0])
							tttSet[chatId].tttboard[argl[0]] = 'O'
							var irissplice2 = tttSet[chatId].tictacplays.indexOf(argl[0])
							if (irissplice2 !== -1) {
								tttSet[chatId].tictacplays.splice(irissplice2, 1)
								tttSet[chatId].aiplaying[irissplice2] = 'O'
							}
						}
						if (tttSet[chatId].thePlayerGameOld2 == botNumber + '@c.us') {
							var model = new TicTacToe.Model(tttSet[chatId].aiplaying.join(''), 'O')
							var recommendation = model.getRecommendation()
							let irisJog = (tttSet[chatId].tttboard[recommendation.index] || tools('others').randVal(tttSet[chatId]['tictacplays']))
							var irissplice = tttSet[chatId].ojogadas.push(irisJog)
							tttSet[chatId].tttboard[irisJog] = 'O'
							var irissplice2 = tttSet[chatId].tictacplays.indexOf(irisJog)
							if (irissplice2 !== -1) {
								tttSet[chatId].tictacplays.splice(irissplice2, 1)
								tttSet[chatId].aiplaying[irissplice2] = 'O'
							}
							await kill.sendTextWithMentions(from, `Estou fazendo minha jogada, vou mandar o tabuleiro assim que eu terminar @${tttSet[chatId].thePlayerGameOld.replace('@c.us', '')}.`)
							tttSet[chatId].thePlayerGame = tttSet[chatId].thePlayerGameOld
							tttSet[chatId].thePlayerGame2 = 1
						}
						await kill.sendImageAsSticker(from, await tboards(), {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
						if (tttSet[chatId].thePlayerGameOld == sender.id) {
							tttSet[chatId].thePlayerGame2 = tttSet[chatId].thePlayerGameOld2
							tttSet[chatId].thePlayerGame = 1
						} else if (tttSet[chatId].thePlayerGameOld2 == sender.id) {
							tttSet[chatId].thePlayerGame = tttSet[chatId].thePlayerGameOld
							tttSet[chatId].thePlayerGame2 = 1
						}
						if (tttSet[chatId].thePlayerGameOld2 == botNumber + '@c.us') {
							tttSet[chatId].thePlayerGame = tttSet[chatId].thePlayerGameOld
							tttSet[chatId].thePlayerGame2 = 1
						} else if (tttSet[chatId].thePlayerGameOld == botNumber + '@c.us') {
							tttSet[chatId].thePlayerGame2 = tttSet[chatId].thePlayerGameOld2
							tttSet[chatId].thePlayerGame = 1
						}
						tttSet[chatId].timesPlayed = 1
						tttSet[chatId].waitJogo = 0
						var theVeredict = tools('gaming').verify(tttSet, chatId)
						if (theVeredict == 1) {
							await kill.sendTextWithMentions(from, mess.playerWin(tttSet[chatId].thePlayerGameOld))
							return await resetGameNew()
						}
						if (theVeredict == 2) {
							await kill.sendTextWithMentions(from, mess.playerWin(tttSet[chatId].thePlayerGameOld2))
							return await resetGameNew()
						}
						if (theVeredict == 3) {
							await kill.sendText(from, mess.draw())
							return await resetGameNew()
						}
					} else if (tttSet[chatId].thePlayerGameOld !== 0) {
						await kill.sendTextWithMentions(from, mess.someoneplay(tttSet[chatId].thePlayerGameOld.replace('@c.us', ''), tttSet[chatId].thePlayerGameOld2.replace('@c.us', '')), id)
					} else return await kill.reply(from, mess.tictactoe(), id)
				break

				case 'detect':
					if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
						let encryptMedia = await decryptMedia(encryptMedia)
						await tools('acrcloud').recognize(`./lib/media/audio/detect-${tools('others').randomString(10)}.mp3`, encryptMedia, kill, message)
					} else return await kill.reply(from, mess.onlyaudio(), id)
				break

				case 'agiotar':
					let cdagiot = `Você agiotou ou foi agiotado por alguém, para fazer isso novamente aguarde que a agiotagem anterior termine.`
					if (objconfig.agiotas.includes(sender.id)) return await kill.reply(from, cdagiot, id)
					if (!isxp) return await kill.reply(from, mess.needxpon(), id)
					if (args.length <= 1) return await kill.reply(from, mess.semmarcar() + `\n\nEx: ${prefix}Agiotar @user <value/valor> <time/tempo>`, id)
					const checkAgiota = tools('gaming').getValue(sender.id, nivel, chatId, 'xp')
					var theAgiota = quotedMsg ? parseInt(args[0], 10) : (mentionedJidList.length !== 0 ? parseInt(args[1], 10) : parseInt(args[1], 10))
					var timeAgiota = quotedMsg ? args[1] : (mentionedJidList.length !== 0 ? args[2] : args[2])
					if (isNaN(theAgiota) || !tools('others').isInt(theAgiota) || Number(theAgiota) > checkAgiota || theAgiota < 100 || isNaN(timeAgiota) || timeAgiota < 5) return await kill.reply(from, mess.maxAgiota(checkAgiota), id)
					var alvoAgiota = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : null)
					if (objconfig.agiotas.includes(sender.id)) return await kill.reply(from, cdagiot, id)
					if (alvoAgiota == null) return await kill.reply(from, mess.cmdfailed(), id)
					objconfig.agiotas.push(sender.id)
					objconfig.agiotas.push(alvoAgiota)
					tools('gaming').addValue(sender.id, Number(-theAgiota), nivel, chatId, 'xp')
					tools('gaming').addValue(alvoAgiota, Number(theAgiota), nivel, chatId, 'xp')
					await kill.sendTextWithMentions(from, mess.moneyagi(theAgiota, alvoAgiota, timeAgiota))
					setTimeout(async () => {
						await kill.sendTextWithMentions(from, mess.backmoney(theAgiota, sender.id, alvoAgiota))
						tools('gaming').addValue(alvoAgiota, Number(-theAgiota), nivel, chatId, 'xp')
						tools('gaming').addValue(sender.id, Number(theAgiota), nivel, chatId, 'xp')
						objconfig.agiotas.splice(sender.id, 1)
						objconfig.agiotas.splice(alvoAgiota, 1)
					}, Number(timeAgiota * 60000))
				break

				case 'sepia':
					try {
						await kill.reply(from, mess.wait(), id)
						if (isImage || isQuotedImage) {
							let encryptMedia = await decryptMedia(encryptMedia)
							var sepiaUpl = await tools('cloud').upload(encryptMedia)
						} else {
							var whatCanva = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
							var sepiaUpl = await kill.getProfilePicFromServer(whatCanva)
						}
						if (typeof sepiaUpl == 'object' || !tools('others').isUrl(sepiaUpl)) {
							sepiaUpl = await kill.getProfilePicFromServer(randomMember)
							if (typeof sepiaUpl == 'object' || !tools('others').isUrl(sepiaUpl)) {
								sepiaUpl = errorImg
							}
						}
						await canvacord.Canvas.invert(sepiaUpl).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `sepia.png`, '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'medal':
					try {
						if (isImage || isQuotedImage) {
							let encryptMedia = await decryptMedia(encryptMedia)
							var personOne = await tools('cloud').upload(encryptMedia)
							var personTwo = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id))
						} else {
							var whatCanva = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
							var whatCanva2 = mentionedJidList.length > 1 ? mentionedJidList[1] : sender.id
							var personOne = await kill.getProfilePicFromServer(whatCanva)
							var personTwo = await kill.getProfilePicFromServer(whatCanva2)
						}
						if (typeof personOne == 'object' || !tools('others').isUrl(personOne)) {
							personOne = await kill.getProfilePicFromServer(randomMember)
							if (typeof personOne == 'object' || !tools('others').isUrl(personOne)) {
								personOne = errorImg
							}
						}
						if (typeof personTwo == 'object' || !tools('others').isUrl(personTwo)) {
							personTwo = await kill.getProfilePicFromServer(randomMember)
							if (typeof personTwo == 'object' || !tools('others').isUrl(personTwo)) {
								personTwo = errorImg
							}
						}
						await tools('canvas').medal(personOne, personTwo).then(async (buffer) => {
							await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `medal.png`, '', id)
						})
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'guild':
				case 'guilda':
					if (tools('gaming').isLimit(sender.id, daily, 'guild')) return await kill.reply(from, mess.waitNewGuild(), id)
					if (args.length == 0) return await kill.reply(from, mess.helpGuild(), id)
					if (functions.guild.includes(argc[0]) && tools('gaming').getValue(sender.id, nivel, chatId, 'guild') !== argc[0]) {
						tools('gaming').changeGuild(sender.id, nivel, chatId, argc[0])
						await kill.reply(from, mess.newGuild(), id)
						if (objconfig.noLimits == 0) return tools('gaming').addLimit(sender.id, daily, 'guild')
					} else return await kill.reply(from, `A guilda informada não existe ou você já está nela.`, id)
				break

				case 'spoiler':
					await kill.reply(from, mess.spoiler(), id)
				break

				case 'myguild':
					if (args.length == 0) return await kill.reply(from, `Você esqueceu de inserir o nome da Guilda.`, id)
					if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id) //).join('\n-> ')
					try {
						var guildTit = `----- [ *GUILDA ${argl[0].toUpperCase()}* ] -----\n\n`
						let countS = 0
						for (let p of Object.keys(nivel[chatId])) {
							if (nivel[p]['guild'] == argc[0]) {
								countS++
								let skybor = await kill.getContact(p)
								guildTit += `${countS} -> *[${skybor.pushname || 'wa.me/' + z.replace('@c.us', '')}]*\n\n`
							}
						}
						await kill.sendText(from, guildTit)
					} catch (error) {
						tools('others').reportConsole(command, error)
						await kill.reply(from, mess.fail(command, error, time), id)
					}
				break

				case 'ddd':
					if (!region == 'pt') return await kill.reply(from, 'Brazil only/Brasil solamente!', id)
					if (args.length == 0 || isNaN(args[0])) return await kill.reply(from, `Você esqueceu de inserir o DDD.`, id)
					const ddds = (await axios.get(`https://brasilapi.com.br/api/ddd/v1/${args[0]}`)).data
					if (ddds.type == 'ddd_error') return await kill.reply(from, ddds.message, id)
					await kill.reply(from, `Lista de Cidades de ${ddds.state} com este DDD [${ddds.cities.length}] >\n → ${ddds.cities.join('\n\n→ ')}`, id)
				break

				case 'newguild':
					if (args.length > 1) return await kill.reply(from, mess.noargs() + 'Guild.', id)
					if (functions.guild.includes(argc[0])) return await kill.reply(from, 'A guilda que você deseja criar já existe.', id)
					functions.guild.push(argc[0])
					if (tools('gaming').getValue(sender.id, nivel, chatId, 'guild') == argc[0]) return await kill.reply(from, `A guilda informada não existe ou você já está nela.`, id)
					tools('gaming').changeGuild(sender.id, nivel, chatId, argc[0])
					fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"))
					await kill.reply(from, `Guilda ${argc[0]} criada com sucesso, chame alguém para entrar com ${prefix}Guild ${argc[0]}!`, id)
				break

				case 'allguild':
					await kill.reply(from, `Guildas ↓\n\n${functions.guild.join('\n')}`, id)
				break

				case 'jogo':
				case 'jogos':
				case 'game':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'nome do jogo/game name/nombre de juego', id)
					const gamesearch = await axios.get(`https://api.rawg.io/api/games?key=${config.API_Rawg}&search=${encodeURIComponent(arg)}&page_size=1`)
					let esrb = gamesearch.data.results[0].esrb_rating === null ? 'Not Found' : gamesearch.data.results[0].esrb_rating.name
					let plataforms = ''
					for (let i in gamesearch.data.results[0].platforms) {
						plataforms += `${gamesearch.data.results[0].platforms[i].platform.name}, `
					}
					plataforms += `${gamesearch.data.results[0].platforms[gamesearch.data.results[0].platforms.length - 1].platform.name}`
					let whrtobuy = ''
					for (let i in gamesearch.data.results[0].stores) {
						whrtobuy += `${gamesearch.data.results[0].stores[i].store.name}, `
					}
					whrtobuy += `${gamesearch.data.results[0].stores[gamesearch.data.results[0].stores.length - 1].store.name}`
					if (gamesearch.data.results[0].genres.length === 0) {
						await kill.sendFile(from, gamesearch.data.results[0].background_image, 'game.png', mess.gameinfo(gamesearch.data.results[0].name, 'Not Found', plataforms, whrtobuy, gamesearch.data.results[0].playtime, gamesearch.data.results[0].released, gamesearch.data.results[0].rating, gamesearch.data.results[0].rating_top, esrb), id)
					} else {
						let genres = ''
						for (let i in gamesearch.data.results[0].genres) {
							genres += `${gamesearch.data.results[0].genres[i].name}, `
						}
						genres += `${gamesearch.data.results[0].genres[gamesearch.data.results[0].genres.length - 1].name}`
						await kill.sendFile(from, gamesearch.data.results[0].background_image, 'game.png', mess.gameinfo(gamesearch.data.results[0].name, genres, plataforms, whrtobuy, gamesearch.data.results[0].playtime, gamesearch.data.results[0].released, gamesearch.data.results[0].rating, gamesearch.data.results[0].rating_top, esrb), id)
					}
				break

				case '8d':
					if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt || isMedia && isVideo || isQuotedVideo) {
						var format = (isMedia && isVideo || isQuotedVideo) ? 'mp4' : 'mp3'
						let mediaData = await decryptMedia(encryptMedia)
						await tools('ffmpeg').octasound(mediaData, argl[0], kill, message, format)
					} else return await kill.reply(from, mess.onlyaudio(), id)
				break

				case 'petpet':
				case 'patpat':
				case 'pat':
				case 'pet':
					if (isMedia && type === 'image' || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var canvaimage = await tools('cloud').upload(encryptMedia)
					} else {
						var whatCanva = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var canvaimage = await kill.getProfilePicFromServer(whatCanva)
					}
					if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
						canvaimage = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
							canvaimage = errorImg
						}
					}
					console.log(canvaimage)
					let animatedGif = await petPetGif(canvaimage)
					fs.writeFile(`./lib/media/img/petpet${sender.id.replace('@c.us', '')}${lvpc}.gif`, animatedGif, async (err) => {
						if (err) return console.error(err)
						const resultwebp = webp.gwebp(`./lib/media/img/petpet${sender.id.replace('@c.us', '')}${lvpc}.gif`, `./lib/media/img/petpet${sender.id.replace('@c.us', '')}${lvpc}.webp`, "-q 100", logging = "-v").then(async () => {
							await kill.sendImageAsSticker(from, `./lib/media/img/petpet${sender.id.replace('@c.us', '')}${lvpc}.webp`, {
								author: config.Sticker_Author,
								pack: config.Sticker_Pack,
								keepScale: true
							})
							await tools('others').sleep(10000).then(async () => {
								fs.unlinkSync(`./lib/media/img/petpet${sender.id.replace('@c.us', '')}${lvpc}.gif`)
								fs.unlinkSync(`./lib/media/img/petpet${sender.id.replace('@c.us', '')}${lvpc}.webp`)
							})
						})
					})
				break

					/*Feito por Pedro Batistop*/
				case 'stt':
				case 'watson':
					if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
						let BkMesa = quotedMsgObj ? quotedMsgObj : message
						if (BkMesa.duration > 60) return await kill.reply(from, mess.watsonmsg(), id)
						let watsonst = `./lib/media/audio/stt-${tools('others').randomString(10)}.ogg`
						let encryptMedia = await decryptMedia(encryptMedia)
						fs.writeFile(watsonst, encryptMedia, async (err) => {
							if (err) return console.error(err)
							const speechToText = new SpeechToTextV1({
								authenticator: new IamAuthenticator({
									apikey: config.API_IBM_Watson
								}),
								serviceUrl: config.Watson_Host,
								disableSslVerification: true
							})
							const recognizeStream = await speechToText.recognizeUsingWebSocket({
								objectMode: false,
								contentType: 'audio/ogg',
								model: config.Watson_Model
							})
							fs.createReadStream(watsonst).pipe(recognizeStream)
							recognizeStream.setEncoding('utf8')
							recognizeStream.on('data', async function(data, event) {
								await kill.reply(from, '🎙️: "' + data + '"', id)
								await kill.reply(from, mess.nobgms(), id)
							})
							recognizeStream.on('error', async function(error, event) {
								tools('others').reportConsole(command, error)
								await kill.reply(from, mess.fail(command, error, time), id)
							})
							recognizeStream.on('close', async function(event) {})
						})
						tools('others').clearFile(watsonst, 10000, false)
					} else return await kill.reply(from, mess.onlyaudio(), id)
				break

					/*Feito por Pedro Batistop*/
				case 'bolsonaro':
					if (isMedia && type === 'image' || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var canvaimage = await tools('cloud').upload(encryptMedia)
						var canvaimage2 = mentionedJidList.length !== 0 ? kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id)
					} else {
						var whatCanva = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var whatCanva2 = mentionedJidList.length > 1 ? mentionedJidList[1] : sender.id
						var canvaimage = await kill.getProfilePicFromServer(whatCanva)
						var canvaimage2 = await kill.getProfilePicFromServer(whatCanva2)
					}
					if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
						canvaimage = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
							canvaimage = errorImg
						}
					}
					if (typeof canvaimage2 == 'object' || !tools('others').isUrl(canvaimage2)) {
						canvaimage2 = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage2 == 'object' || !tools('others').isUrl(canvaimage2)) {
							canvaimage2 = errorImg
						}
					}
					await tools('canvas').bolsonero(canvaimage2, canvaimage).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `bolsonaro.png`, ``, id)
					})
				break

					/*Feito por Pedro Batistop*/
				case 'morrepraga':
				case 'morre':
				case 'praga':
				case 'dieplague':
				case 'die':
				case 'plague':
					if (isMedia && type === 'image' || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var canvaimage = await tools('cloud').upload(encryptMedia)
					} else {
						var whatCanva = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var canvaimage = await kill.getProfilePicFromServer(whatCanva)
					}
					if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
						canvaimage = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
							canvaimage = errorImg
						}
					}
					await tools('canvas').morrepraga(canvaimage).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `praga.png`, ``, id)
					})
				break

					/*Feito por Pedro Batistop*/
				case 'invert':
					if (isMedia && type === 'image' || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var canvaimage = await tools('cloud').upload(encryptMedia)
					} else {
						var whatCanva = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var canvaimage = await kill.getProfilePicFromServer(whatCanva)
					}
					if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
						canvaimage = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
							canvaimage = errorImg
						}
					}
					await tools('canvas').invert(canvaimage).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `invert.png`, ``, id)
					})
				break

					/*Feito por Pedro Batistop*/
				case 'drake':
					if (isMedia && type === 'image' || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var canvaimage = await tools('cloud').upload(encryptMedia)
						var canvaimage2 = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(sender.id)
					} else {
						var whatCanva = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var whatCanva2 = mentionedJidList.length > 1 ? mentionedJidList[1] : sender.id
						var canvaimage = await kill.getProfilePicFromServer(whatCanva)
						var canvaimage2 = await kill.getProfilePicFromServer(whatCanva2)
					}
					if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
						canvaimage = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
							canvaimage = errorImg
						}
					}
					if (typeof canvaimage2 == 'object' || !tools('others').isUrl(canvaimage2)) {
						canvaimage2 = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage2 == 'object' || !tools('others').isUrl(canvaimage2)) {
							canvaimage2 = errorImg
						}
					}
					await tools('canvas').drake(canvaimage, canvaimage2).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `drake.png`, ``, id)
					})
				break

				case 'wolverine':
					if (isMedia && type === 'image' || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var canvaimage = await tools('cloud').upload(encryptMedia)
					} else {
						var whatCanva = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var canvaimage = await kill.getProfilePicFromServer(whatCanva)
					}
					if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
						canvaimage = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
							canvaimage = errorImg
						}
					}
					tools('canvas').wolverine(canvaimage).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `wolve.png`, ``, id)
					})
				break

				case 'jooj':
					if (isMedia && type === 'image' || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var canvaimage = await tools('cloud').upload(encryptMedia)
					} else {
						var whatCanva = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var canvaimage = await kill.getProfilePicFromServer(whatCanva)
					}
					if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
						canvaimage = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
							canvaimage = errorImg
						}
					}
					await tools('canvas').jooj(canvaimage).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `jooj.png`, ``, id)
					})
				break

				case 'ojjo':
					if (isImage || isQuotedImage) {
						let encryptMedia = await decryptMedia(encryptMedia)
						var canvaimage = await tools('cloud').upload(encryptMedia)
					} else {
						var ojoacx = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						var canvaimage = await kill.getProfilePicFromServer(ojoacx)
					}
					if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
						canvaimage = await kill.getProfilePicFromServer(randomMember)
						if (typeof canvaimage == 'object' || !tools('others').isUrl(canvaimage)) {
							canvaimage = errorImg
						}
					}
					await tools('canvas').ojjo(canvaimage).then(async (buffer) => {
						await kill.sendFile(from, tools('others').dataURI('image/png', buffer), `ojjo.png`, ``, id)
					})
				break

				case 'time':
					const getlimit = tools('gaming').getLimit(sender.id, daily, 'games')
					if (getlimit !== undefined) {
						const whenminutes = Math.floor((Date.now() - getlimit) / 60000)
						const whenseconds = Math.floor(((Date.now() - getlimit) % 60000) / 1000) + 1
						const timeremainminutes = Math.abs(Math.floor((Number(config.Wait_to_Play)) - ((Date.now() - getlimit) / 60000)))
						const timeremainseconds = Math.abs(Math.floor(Number(config.Wait_to_Play) - (((Date.now() - getlimit) % 60000) / 1000)))
						if (whenminutes < Number(config.Wait_to_Play)) {
							await kill.reply(from, `⏱️ - Espere *${timeremainminutes} minutos* & *${timeremainseconds} segundos* para apostar novamente.\n\n🎮 - Apostou por último *${whenminutes} minutos* & *${whenseconds} segundos* atrás.`, id)
						} else {
							await kill.reply(from, `⏱️ - Você pode apostar desde *${timeremainminutes} minutos* & *${timeremainseconds} segundos* atrás.\n\n🎮 - Apostou por último *"${whenminutes} minutos* & *${whenseconds} segundos"* atrás.`, id)
						}
					} else return await kill.reply(from, 'Você não jogou ainda?', id)
				break

				case 'mix':
					if (!Object.keys(gameconfig).includes(chatId)) {
						gameconfig[chatId] = {
							lives: 6,
							dicas: 0,
							forcw: 0,
							hint: 0,
							wordVsb: 0,
							wordOct: 0,
							word: 0,
							whoplay: chatId,
							gameFile: 0,
							forcFile: 0
						}
					}
					gameconfig[chatId]['gameFile'] = gameconfig[chatId]['gameFile'] == 0 ? tools('others').randVal(fileFor) : gameconfig[chatId]['gameFile']
					if (argl[0] == '-dica' && gameconfig[chatId]['word'] !== 0) {
						if (gameconfig[chatId]['hint'] !== 0) return await kill.reply(from, `Você já usou todas as dicas deste jogo atual, irei re-ordenar as letras!\n\n❗ - ${gameconfig[chatId]['gameFile'].toUpperCase()}\n\n❓ - "${tools('others').randomArr(gameconfig[chatId]['word'].split('').sort()).toString()}""`, id)
						if (gameconfig[chatId]['gameFile'] == 'empresa') {
							await kill.reply(from, `A palavra começa com as letras... "${gameconfig[chatId]['word'].slice(0, gameconfig[chatId]['word'].length / 2 + 1).toUpperCase()}"`, id)
						} else await kill.reply(from, `A palavra começa com as letras... "${gameconfig[chatId]['word'].slice(0, await tools('others').randomNumber(1, gameconfig[chatId]['word'].length / 2)).toUpperCase()}"`, id)
						gameconfig[chatId]['hint = 1']
					} else if (argl[0] == '-placar') {
						if (Object.keys(placar) == '') return await kill.reply(from, `Ninguém venceu até agora.\n\n❗ - ${gameconfig[chatId]['gameFile'].toUpperCase()}\n\n❓ - "${tools('others').randomArr(gameconfig[chatId]['word'].split('').sort()).toString()}"`, id)
						let score = ''
						for (let i of Object.keys(placar)) {
							score += `"wa.me/${i.replace('@c.us', '')}" = "${placar[i]}" Points\n\n`
						}
						await kill.reply(from, score, id)
					} else if (gameconfig[chatId]['word'] == 0 || argl[0] == '-new') {
						gameconfig[chatId]['word'] = fileFor.includes(argl[1]) ? tools('others').getRandLine(1, `./lib/config/Utilidades/${argl[1]}.txt`)[0] : tools('others').getRandLine(1, `./lib/config/Utilidades/${gameconfig[chatId]['gameFile']}.txt`)[0]
						gameconfig[chatId]['whoplay'] = chatId
						gameconfig[chatId]['hint'] = 0
						gameconfig[chatId]['gameFile'] = fileFor.includes(argl[1]) ? argl[1] : gameconfig[chatId]['gameFile']
						let wordMix = gameconfig[chatId]['word'].split(' ')
						wordMix = wordMix.length > 1 ? wordMix.map(w => '   ' + tools('others').randomArr(w.split(''))).toString().replace('   ', '') : tools('others').randomArr(wordMix[0].split('')).toString()
						await kill.reply(from, `❗ - ${gameconfig[chatId]['gameFile'].toUpperCase()}\n\n❓ - "${wordMix}"`, id)
					} else return await kill.reply(from, `❗ - ${gameconfig[chatId]['gameFile'].toUpperCase()}\n\n❓ - "${tools('others').randomArr(gameconfig[chatId]['word'].split('').sort()).toString()}"`, id)
				break

				case '2d':
					if (args.length == 0) return await kill.reply(from, 'Insira um personagem de anime.', id)
					let charac = await axios.get(`https://www.animecharactersdatabase.com/api_series_characters.php?character_q=${encodeURIComponent(body.slice(4))}`)
					if (charac.data == '-1') return await kill.reply(from, mess.noresult(), id)
					await translate(charac.data.search_results[0].desc, {
						to: region
					}).then(async (desc) => {
						await kill.sendFileFromUrl(from, `${response.data.search_results[0].character_image}`, 'char.jpg', `${response.data.search_results[0].name} - ${response.data.search_results[0].gender}\n\n${response.data.search_results[0].anime_name}\n\n${desc.text}`)
					})
				break

				case 'forca':
					if (!Object.keys(gameconfig).includes(chatId)) {
						gameconfig[chatId] = {
							lives: 6,
							dicas: 0,
							forcw: 0,
							hint: 0,
							wordVsb: 0,
							wordOct: 0,
							word: 0,
							whoplay: chatId,
							gameFile: 0,
							forcFile: 0
						}
					}
					gameconfig[chatId]['forcFile'] = gameconfig[chatId]['forcFile'] == 0 ? tools('others').randVal(fileFor) : gameconfig[chatId]['forcFile']
					let resetForca = () => {
						gameconfig[chatId]['forcw'] = 0
						gameconfig[chatId]['wordVsb'] = 0
						gameconfig[chatId]['wordOct'] = 0
						gameconfig[chatId]['whoplay'] = 0
						gameconfig[chatId]['lives'] = 0
						gameconfig[chatId]['forcFile'] = 0
					}
					let mandarFig = async (link) => {
						await kill.sendStickerfromUrl(from, link, {
							method: 'get'
						}, {
							author: config.Sticker_Author,
							pack: config.Sticker_Pack,
							keepScale: true
						})
					}
					if (gameconfig[chatId]['forcw'] == 0 || argl[0] == '-new') {
						gameconfig[chatId]['forcw'] = tools('others').getRandLine(1, `./lib/config/Utilidades/${gameconfig[chatId]["forcFile"]}.txt`)[0]
						gameconfig[chatId]['wordVsb'] = gameconfig[chatId]['forcw'].replace(/[a-zA-Z]/g, '_ ').split(' ')
						gameconfig[chatId]['wordOct'] = gameconfig[chatId]['forcw'].split('')
						gameconfig[chatId]['whoplay'] = chatId
						await kill.reply(from, `❗ - ${gameconfig[chatId]['forcFile'].toUpperCase()}\n\n❓ - "${gameconfig[chatId]['wordVsb'].join(' ')}"`, id)
					} else if (argl.length >= 2 && argl[0] == '-r') {
						if (gameconfig[chatId]['wordVsb'].includes(argl[1].split('')[0])) return await kill.reply(from, 'Já possui esta letra.' + '\n\n' + gameconfig[chatId]["wordVsb"].join(' '), id)
						let awnserFind = 0
						for (let i = 0; i < gameconfig[chatId]['wordVsb'].length; i++) {
							if (gameconfig[chatId]['wordOct'][i] == argl[1][0]) {
								gameconfig[chatId]['wordVsb'][i] = gameconfig[chatId]['wordOct'][i]
								awnserFind = 1
							}
						}
						if (awnserFind == 1) {
							await kill.reply(from, 'Letra encontrada! > ' + gameconfig[chatId]['wordVsb'].join(' '), id)
							if (gameconfig[chatId]['wordVsb'].filter((a => a == '_')).length == 0) {
								await kill.reply(from, 'A palavra era -> "' + gameconfig[chatId]['wordVsb'].join(' ') + '", você venceu!' , id)
								resetForca()
							}
						} else {
							gameconfig[chatId]['lives'] -= 1
							if (gameconfig[chatId]['lives'] == 5) {
								await mandarFig('https://i.ibb.co/9v1M4pT/1.png')
							} else if (gameconfig[chatId]['lives'] == 4) {
								await mandarFig('https://i.ibb.co/NWCQQbN/2.png')
							} else if (gameconfig[chatId]['lives'] == 3) {
								await mandarFig('https://i.ibb.co/gV3vHR6/3.png')
							} else if (gameconfig[chatId]['lives'] == 2) {
								await mandarFig('https://i.ibb.co/sHh7Rvs/4.png')
							} else if (gameconfig[chatId]['lives'] == 1) {
								await mandarFig('https://i.ibb.co/zRr6TyR/5.png')
							} else if (gameconfig[chatId]['lives'] == 0) {
								await kill.sendFileFromUrl(from, 'https://i.redd.it/d4wty8ntup301.jpg', 'lose.jpg', `Você perdeu! Não encontrei a letra "${argl[1].split('')[0].toUpperCase()}"\n\nA palavra era "${gameconfig[chatId]['forcw'].toUpperCase()}"`, id)
								return resetForca()
							}
							await kill.reply(from, `Não encontrei a letra ${argl[1].split('')[0].toUpperCase()}\n\n - "${gameconfig[chatId]['forcFile'].toUpperCase()}" - \n\n"${gameconfig[chatId]['wordVsb'].join(' ')}"`, id)
						}
					} else if (argl[0] == '-dica') {
						if (gameconfig[chatId]['dicas'] !== 0) return await kill.reply(from, `Você já usou todas as dicas deste jogo atual!\n\n"${gameconfig[chatId]['wordVsb'].join(' ')}"`, id)
						gameconfig[chatId]['dicas'] = 1
						let getDica = () => {
							let randNbr = tools('others').randomNumber(1, gameconfig[chatId]['wordVsb'].length)
							if (gameconfig[chatId]['wordVsb'][randNbr] !== '_') {
								randNbr = gameconfig[chatId]['wordVsb'].indexOf('_')
							}
							gameconfig[chatId]['wordVsb'][randNbr] = gameconfig[chatId]['wordOct'][randNbr]
						}
						if (gameconfig[chatId]['wordVsb'].length < 6) {
							getDica()
						} else {
							getDica()
							getDica()
						}
						await kill.reply(from, 'Aqui está uma letra, você só pode obter uma dica por jogo.\n' + gameconfig[chatId]['wordVsb'].join(' '), id)
					} else if (argl.length >= 2 && argl[0] == '-allin') {
						if (removeAccents(argl[1]) == gameconfig[chatId]['forcw']) {
							await kill.reply(from, `Parabéns!\nA palavra correta "${gameconfig[chatId]['forcw']}", você acertou em cheio!`, id)
						} else return await kill.reply(from, `Você perdeu após apostar tudo, palavra correta = "${gameconfig[chatId]['forcw'].toUpperCase()}"`, id)
					} else return kill.reply(from, `❗ - ${gameconfig[chatId]['forcFile'].toUpperCase()}\n\n❓ - "${gameconfig[chatId]['wordVsb'].join(' ')}"`, id)
				break

				case 'shop':
					if (args.includes('-menu')) return await kill.reply(from, mess.shopping(), id)
					if (args.length < 1) return await kill.reply(from, mess.noargs() + 'Opção/Option', id)
					if (args[1] == '3' || args[1] == '4' || args[1] == '5') {
						let pforj = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : sender.id)
						await shop(kill, message, args, pforj, nivel)
					} else {
						await shop(kill, message, args, sender.id, nivel)
					}
				break

				case 'fipe':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'código tabela FIPE.', id)
					let fipe = (await axios.get(`https://brasilapi.com.br/api/fipe/preco/v1/${args[0]}`)).data[0]
					await kill.reply(from, `🚗 ${fipe.marca} - ${fipe.modelo}\n\n📅 ${fipe.anoModelo}\n\n💸 ${fipe.valor}\n\n⛽ ${fipe.combustivel} [${fipe.siglaCombustivel}]`, id)
				break

				case 'feriados':
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'ANO.', id)
					let ferias = (await axios.get(`https://brasilapi.com.br/api/feriados/v1/${args[0]}`)).data
					await kill.reply(from, ferias.map(res => `*"${res.name}"* [${res.date} / ${res.type}]`).join('\n\n'), id)
				break

				case 'loteria':
					if (!isxp) return await kill.reply(from, mess.needxpon(), id)
					if (argl[0] == '-buy') {
						if (lotery['users'].includes(sender.id)) return await kill.reply(from, `Você já está no sorteio, apenas espere que ele finalize para participar novamente.`, id)
						const icoinTick = parseInt(tools('gaming').getValue(sender.id, nivel, chatId, 'coin'))
						const xpPrize = parseInt(tools('gaming').getValue(sender.id, nivel, chatId, 'xp'))
						const rubiPrize = parseInt(tools('gaming').getValue(sender.id, nivel, chatId, 'rubi'))
						const diamoPrize = parseInt(tools('gaming').getValue(sender.id, nivel, chatId, 'rubi'))
						if (Number(shopconf.Ticket_Price) > icoinTick) return await kill.reply(from, `Você precisa ter ${shopconf.Ticket_Price} I'Coin para participar, você tem apenas ${icoinTick}, junte mais antes que o tempo expire!`, id)
						lotery['users'].push(sender.id)
						lotery['prize']['icoin'] += parseInt(icoinTick + 10)
						lotery['prize']['xp'] += parseInt(xpPrize * 2 / 3)
						lotery['prize']['rubi'] += parseInt(rubiPrize + 10)
						lotery['prize']['dima'] += parseInt(diamoPrize + 10)
						tools('gaming').addValue(sender.id, Number(-shopconf.Ticket_Price), nivel, chatId, 'coin')
						if (lotery['hasLast']) {
							await kill.sendTextWithMentions(from, `Atualmente os premios são de:\n\n- ${lotery['prize']['icoin']} I'coin.\n- ${lotery['prize']['xp']} XP.\n- ${lotery['prize']['rubi']} Rubis.\n- ${lotery['prize']['dima']} Diamantes.\n\nOs premios aumentam conforme a quantidade de apostadores, atualmente existem ${lotery['users'].length} apostadores, as chances de você ganhar são de ${parseFloat(100/Number(lotery['users'].length)).toFixed(2)}%.\n\nPara comprar um ticket, digite \"${prefix}loteria -buy\", tenha certeza de ter ${shopconf.Ticket_Price} I'coins para comprar!\n\nUltimo sorteio foi as ${moment(lotery['lasttime']).toString()}.\n\nUltimo ganhador foi @${lotery['winner'].replace('@c.us', '')}.\n\nGanhou ${Number(lotery['lastprize'][lotery['win']])} ${lotery['win']}.\n\nHouveram ${Number(lotery['lastUserPart'])} participantes.`)
						} else await kill.reply(from, `Atualmente os premios são de:\n\n- ${lotery['prize']['icoin']} I'coin.\n- ${lotery['prize']['xp']} XP.\n- ${lotery['prize']['rubi']} Rubis.\n- ${lotery['prize']['dima']} Diamantes.\n\nOs premios aumentam conforme a quantidade de apostadores, atualmente existem ${lotery['users'].length} apostadores, as chances de você ganhar são de ${parseFloat(100/Number(lotery['users'].length)).toFixed(2)}%.\n\nPara comprar um ticket, digite \"${prefix}loteria -buy\", tenha certeza de ter ${shopconf.Ticket_Price} I'coins para comprar!`, id)
						if (!lotery['isStarted']) {
							lotery['isStarted'] = true
							lotery['time'] = moment().add(shopconf.Lotery_Time, 'minutes').unix()
							await tools('others').sleep(2 * 60000)
							lotery['win'] = tools('others').randVal(['xp', 'coin', 'rubi', 'dima'])
							lotery['winner'] = tools('others').randVal(lotery['users'])
							tools('gaming').addValue(lotery['winner'], Number(lotery['prize'][lotery['win']]), nivel, chatId, lotery['prize'])
							await kill.sendTextWithMentions(from, `Parabéns @${lotery['winner'].replace('@c.us','')}, você ganhou ${lotery['prize'][lotery['win']]} ${lotery['win']}!`)
							lotery['lastTime'] = Number(moment().unix())
							lotery['lastUserPart'] = lotery['users'].length
							lotery['prize'] = {
								"icoin": lotery['prize']['icoin'],
								"xp": lotery['prize']['xp'],
								"rubi": lotery['prize']['rubi'],
								"dima": lotery['prize']['dima']
							}
							lotery['users'] = []
							lotery['prize'] = {
								"icoin": 0,
								"xp": 0,
								"rubi": 0,
								"dima": 0
							}
							lotery['isStarted'] = false
							lotery['hasLast'] = true
						}
					} else if (argl[0] == '-time') {
						await kill.reply(from, `Faltam ${((lotery['time'] - moment().unix()) / 60).toFixed(2)} Minutos para o sorteio!`, id)
					} else return await kill.reply(from, `Use com -buy ou -time.`, id)
				break

				case 'deleted':
					if (args.length == 0) return await kill.reply(from, `Para ativar esse recurso use "-log".\nPara desativar use "-nolog".\nPara listar as mensagens apagadas use "-show".`, id)
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						await kill.reply(from, `Isso apenas funciona se meu dono não estiver usando a função "Anti-Revoke" no WhatsApp.`, id)
						if (arks.includes('-log')) {
							if (deleted.log.includes(chatId)) return await kill.reply(from, mess.jaenabled(), id)
							deleted.log.push(from)
							fs.writeFileSync('./lib/config/Gerais/message.json', JSON.stringify(deleted, null, "\t"))
							await kill.reply(from, mess.enabled(), id)
						} else if (arks.includes('-nolog')) {
							if (!deleted.log.includes(chatId)) return await kill.reply(from, mess.jadisabled(), id)
							deleted.log = deleted.log.filter(g => g !== chatId)
							fs.writeFileSync('./lib/config/Gerais/message.json', JSON.stringify(deleted, null, "\t"))
							await kill.reply(from, mess.disabled(), id)
						} else if (arks.includes('-show')) {
							await kill.sendText(from, 'Mensagens apagadas:\n\n' + deleted.texts.map(msgdl => `De: "${msgdl.user.replace('@c.us', '')}"\nPara: "${msgdl.to}"\nQuando: "${msgdl.time}"\nMensagem: "${msgdl.message}"\n\n`).toString().replace(/,De/g, 'De'))
						}
					} else if (isGroupMsg) {
						await kill.reply(from, mess.soademiro(), id)
					} else return await kill.reply(from, mess.sogrupo(), id)
				break

				case 'daily':
				case 'diario':
					if (!isxp) return await kill.reply(from, mess.needxpon(), id)
					if (tools('gaming').isLimit(sender.id, daily, 'reward')) return await kill.reply(from, `Você já resgatou sua recompensa diaria, volte depois para ter acesso a outra, ela só pode ser obtida uma vez por dia, você pode obter o tempo restante digitando "${prefix[0]}Time".`, id)
					let winType = await tools('others').randVal(['xp', 'rubi', 'dima'])
					if (!Object.keys(reward).includes(sender.id)) {
						reward[sender.id] = {
							"rewards": 1,
							"dayWin": time,
							"prevWin": winType,
							"lastDate": time,
							"mouth": moment().format('YYYY-MM')
						}
					} else {
						if (moment(reward[sender.id]['mouth'], "YYYY-MM").daysInMonth() !== moment().daysInMonth() || reward[sender.id]["rewards"] >= moment(reward[sender.id]['mouth'], "YYYY-MM").daysInMonth()) {
							reward[sender.id]['mouth'] = moment().format('YYYY-MM')
							reward[sender.id]["rewards"] = 0
						}
						reward[sender.id]["rewards"]++,
						reward[sender.id]["lastDate"] = reward[sender.id]["dayWin"],
						reward[sender.id]["dayWin"] = time,
						reward[sender.id]["prevWin"] = winType
					}
					fs.writeFileSync('./lib/config/Gerais/rewards.json', JSON.stringify(reward, null, "\t"))
					var dailyReward = tools('others').randomNumber(config.Daily_Reward, config.Daily_Reward * reward[sender.id]["rewards"])
					var dailyIcoin = tools('others').randomNumber(config.Iris_Coin, config.Iris_Coin * reward[sender.id]["rewards"])
					tools('gaming').addValue(sender.id, Number(dailyReward), nivel, chatId, winType)
					tools('gaming').addValue(sender.id, Number(dailyIcoin), nivel, chatId, 'coin')
					await kill.reply(from, `Você resgatou com sucesso sua recompensa diaria de "${dailyReward} ${winType}" e "${dailyIcoin} I'coins", você possui ${reward[sender.id]["rewards"]} recompensas acumuladas, seus premios aumentam conforme você acumula.\nVocê recebeu "${reward[sender.id]["prevWin"].toUpperCase()}" na ultima vez em ${reward[sender.id]["lastDate"]}.`, id)
					tools('gaming').addLimit(sender.id, daily, 'reward')
				break
				
				
				case 'genshin':
					if (args.length == 0) return await kill.reply(from, `Insira o nome de uma personagem para buscar.`, id)
					let stanLang = config.Language == 'en' ? 'English' : (config.Language == 'pt' ? 'Portuguese' : 'Spanish')
					if (argl[0] == '-char') {
						let impact = await genshin.characters(body.slice(15), {
							resultLanguage: stanLang
						})
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.sendFileFromUrl(from, (impact.images.card || impact.images.portrait || impact.images.cover1), 'card.png', `Nome -> ${impact.name}\n\nTitulo -> ${impact.title}\n\nDescrição -> ${impact.description}\n\nRaridade (estrelas) -> ${impact.rarity}\n\nElemento -> ${impact.element}\n\nArma -> ${impact.weapontype}\n\nSub-Status -> ${impact.substat}\n\nGenero -> ${impact.gender}\n\nCorpo de -> ${impact.body}\n\nAssociação -> ${impact.association}\n\nRegião -> ${impact.region}\n\nAfiliação -> ${impact.affiliation}\n\nAniversario -> ${impact.birthdaymmdd} [${impact.birthday}]\n\nConstelação -> ${impact.constellation}\n\nDublagem inglesa -> ${impact.cv.english}\n\nDublagem chinesa -> ${impact.cv.chinese}\n\nDublagem japonesa -> ${impact.cv.japanese}\n\nDublagem coreana -> ${impact.cv.korean}\n\nFandom -> ${impact.url.fandom}\n\nMateriais de Ascenção #1 ->\n${impact.costs.ascend1.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #2 ->\n${impact.costs.ascend2.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #3 ->\n${impact.costs.ascend3.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #4 ->\n${impact.costs.ascend4.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #5 ->\n${impact.costs.ascend5.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #6 ->\n${impact.costs.ascend6.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nImagens para você:\n\n${impact.images.nameiconcard || 'Card'} -> ${impact.images.card || 'Não possui.'}\n\n${impact.images.namegachasplash || 'Retrato'} -> ${impact.images.portrait || 'Não possui.'}\n\n${impact.images.nameicon || 'Icon'} -> ${impact.images.icon || 'Não possui.'}\n\n${impact.images.namegachaslice || 'Icon Gacha'} -> ${impact.images.sideicon || 'Não possui.'}\n\nCover 1 -> ${impact.images.cover1 || 'Não possui'}\n\nCover 2 -> ${impact.images.cover2 || 'Não possui.'}\n\nAvatar no APP -> ${impact.images['hoyolab-avatar'] || 'Não possui.'}`, id)
					} else if (argl[0] == '-weapon') {
						let impact = await genshin.weapons(body.slice(17), {
							resultLanguage: stanLang
						})
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.sendFileFromUrl(from, impact.images.image, 'image.png', `Nome -> ${impact.name}\n\nDescrição -> ${impact.description}\n\nRaridade (estrelas) -> ${impact.rarity}\n\nBase-ATK -> ${impact.baseatk}\n\nSub-Status -> ${impact.substat}\n\nSub-Valor -> ${impact.subvalue}\n\nEfeito -> ${impact.effectname}\n\nDetalhes do efeito -> ${impact.effect}\n\nPoder do efeito em #R1 -> ${impact.r1.join(', ')}\n\nPoder do efeito em #R2 -> ${impact.r2.join(', ')}\n\nPoder do efeito em #R3 -> ${impact.r3.join(', ')}\n\nPoder do efeito em #R4 -> ${impact.r4.join(', ')}\n\nPoder do efeito em #R5 -> ${impact.r5.join(', ')}\n\nFeito de -> ${impact.weaponmaterialtype}\n\nMateriais de Ascenção #1 -> ${impact.costs.ascend1.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #2 -> ${impact.costs.ascend2.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #3 -> ${impact.costs.ascend3.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #4 -> ${impact.costs.ascend4.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #5 -> ${impact.costs.ascend5.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nMateriais de Ascenção #6 -> ${impact.costs.ascend6.map(as => `\n${as.count} ${as.name}`).toString().replace(/,/g, '')}\n\nImagens para você:\n\n${impact.images.namegacha || 'Imagem'} -> ${impact.images.image || 'Não possui.'}\n\n${impact.images.nameicon || 'Icon'} -> ${impact.images.icon || 'Não possui.'}\n\n${impact.images.nameawakenicon || 'Icon 2'} -> ${impact.images.awakenicon || 'Não possui.'}`, id)
					} else if (argl[0] == '-obj') {
						let impact = await genshin.materials(body.slice(14), {
							resultLanguage: stanLang
						})
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.sendFileFromUrl(from, (impact.images.redirect || impact.images.fandom), 'image.png', `Nome -> ${impact.name} #${impact.sortorder}\n\nDescrição -> ${impact.description}\n\nRaridade (estrelas) -> ${impact.rarity || 'Não possui.'}\n\nCategoria -> ${impact.category}\n\nTipo de material -> ${impact.materialtype}\n\nLocais -> ${impact.source.join(', ')}\n\nFandom -> ${impact.url.fandom}\n\nImagens para você:\n\n${impact.images.nameicon || 'Icon 1'} -> ${impact.images.redirect || 'Não possui.'}\n\nIcon 2 [Fandom] -> ${impact.images.fandom || 'Não possui.'}`, id)
					} else if (argl[0] == '-art') {
						let impact = await genshin.artifacts(body.slice(14), {
							resultLanguage: stanLang
						})
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.sendFileFromUrl(from, impact.images.flower, 'image.png', `Nome -> ${impact.name}\n\nRaridade (estrelas) -> ${impact.rarity.join(' / ')}\n\n2PC -> ${impact['2pc']}\n\n4PC -> ${impact['4pc']}\n\nFlor ->\n${impact.flower.name} - ${impact.flower.relictype}\nDescrição -> ${impact.flower.description}\n\nPena ->\n${impact.plume.name} - ${impact.plume.relictype}\nDescrição -> ${impact.plume.description}\n\nAmpulheta ->\n${impact.sands.name} - ${impact.sands.relictype}\nDescrição -> ${impact.sands.description}\n\nCalice ->\n${impact.goblet.name} - ${impact.goblet.relictype}\nDescrição -> ${impact.goblet.description}\n\nCoroa ->\n${impact.circlet.name} - ${impact.circlet.relictype}\nDescrição -> ${impact.circlet.description}\n\nFandom -> ${impact.url.fandom}\n\nImagens para você:\n\nFlor -> ${impact.images.flower || 'Não possui.'}\n\nPena -> ${impact.images.plume || 'Não possui.'}\n\nAmpulheta -> ${impact.images.sands || 'Não possui.'}\n\nCalice -> ${impact.images.goblet || 'Não possui.'}\n\nCoroa -> ${impact.images.circlet || 'Não possui.'}\n\n`, id)
					} else if (argl[0] == '-boss') {
						let impact = await genshin.enemies(body.slice(15), {
							resultLanguage: stanLang
						})
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.reply(from, `Nome -> ${impact.name}\n\nNome Especial -> ${impact.specialname}\n\nRaridade -> ${impact.enemytype}\n\nCategoria -> ${impact.category}\n\nDescrição -> ${impact.description}\n\nEspecie -> ${impact.investigation.name}\n\nDificuldade -> ${impact.investigation.category}\n\nDescrição Esp. -> ${impact.investigation.description}\n\nGanhos ->\n${impact.rewardpreview.map(re => `${re.name}\n`).toString().replace(/,/g, '')}`, id)
					} else if (argl[0] == '-food') {
						let impact = await genshin.foods(body.slice(15), {
							resultLanguage: stanLang
						})
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.reply(from, `Nome -> ${impact.name}\n\nRaridade (estrelas) -> ${impact.rarity}\n\nCategoria -> ${impact.foodtype}\n\nFiltrado por -> ${impact.foodfilter}\n\nCategoria -> ${impact.effect}\n\nDescrição -> ${impact.description}\n\nBad Food -> ${impact.suspicious.effect}\n${impact.suspicious.description}\n\nNormal Food -> ${impact.normal.effect}\n${impact.normal.description}\n\nDelicious Food -> ${impact.delicious.effect}\n${impact.delicious.description}\n\nFandom -> ${impact.url.fandom}\n\nIngredientes ->\n${impact.ingredients.map(re => `${re.count} ${re.name}\n`).toString().replace(/,/g, '')}`, id)
					} else if (argl[0] == '-dom') {
						let impact = await genshin.domains(body.slice(14), {
							resultLanguage: stanLang
						})
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.reply(from, `Nome -> ${impact.name}\n\nRegião -> ${impact.region}\n\nLocal -> ${impact.domainentrance}\n\nCategoria -> ${impact.domaintype}\n\nDescrição -> ${impact.description}\n\nLevel Recomendado -> ${impact.recommendedlevel}\n\nElementos Recomendados -> ${impact.recommendedelements.join(', ')}\n\nDias da Semana ->\n${impact.daysofweek.join('\n')}\n\nDebloqueia no Level -> ${impact.unlockrank}\n\nTipo de desordem ->\n${impact.disorder.join('\n')}\n\nLista de monstros ->\n${impact.monsterlist.join('\n')}\n\nGanhos ->\n${impact.rewardpreview.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}`, id)
					} else if (argl[0] == '-talent') {
						let impact = await genshin.talents(body.slice(17), {
							resultLanguage: stanLang
						})
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.reply(from, `Nome -> ${impact.name}\n\nCombate 1 -> ${impact.combat1.name}\nDescrição -> ${impact.combat1.info}\n\nCombate 2 -> ${impact.combat2.name}\nDescrição -> ${impact.combat2.info}\n\nCombate 3 -> ${impact.combat3.name}\nDescrição -> ${impact.combat3.info}\n\nPassivo 1 -> ${impact.passive1.name}\nDescrição -> ${impact.passive1.info}\n\nPassivo 2 -> ${impact.passive2.name}\nDescrição -> ${impact.passive2.info}\n\nPassivo 3 -> ${impact.passive3.name}\nDescrição -> ${impact.passive3.info}\n\nLevel 2 ->\n${impact.costs.lvl2.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}\nLevel 3 ->\n${impact.costs.lvl3.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}\nLevel 4 ->\n${impact.costs.lvl4.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}\nLevel 5 ->\n${impact.costs.lvl5.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}\nLevel 6 ->\n${impact.costs.lvl6.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}\nLevel 7 ->\n${impact.costs.lvl7.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}\nLevel 8 ->\n${impact.costs.lvl8.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}\nLevel 9 ->\n${impact.costs.lvl9.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}\nLevel 10 ->\n${impact.costs.lvl10.map(re => `${re.count || '?'} ${re.name}\n`).toString().replace(/,/g, '')}`, id)
					} else if (argl[0] == '-cos') {
						let impact = await genshin.constellations(body.slice(14), {
							resultLanguage: stanLang
						})
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.sendFileFromUrl(from, impact.images.c1, 'image.png', `Nome -> ${impact.name}\n\nC1 -> ${impact.c1.name}\nDescrição -> ${impact.c1.effect}\n\nC2 -> ${impact.c2.name}\nDescrição -> ${impact.c2.effect}\n\nC3 -> ${impact.c3.name}\nDescrição -> ${impact.c3.effect}\n\nC4 -> ${impact.c4.name}\nDescrição -> ${impact.c4.effect}\n\nC5 -> ${impact.c5.name}\nDescrição -> ${impact.c5.effect}\n\nC6 -> ${impact.c6.name}\nDescrição -> ${impact.c6.effect}`, id)
					} else if (argl[0] == '-ment') {
						let impact = await genshin.elements(body.slice(15))
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.sendFileFromUrl(from, (impact.images.base64 || impact.images.wikia), 'image.png', `Nome -> ${impact.name}\n\nTipo -> ${impact.type}\n\nCor HEX -> ${impact.color}\n\nCódigo emoji (Hoyolab) -> ${impact.emoji}\n\nRegião -> ${impact.region}\n\nArconte -> ${impact.archon}\n\nTema -> ${impact.theme}`, id)
					} else if (argl[0] == '-type') {
						let impact = await genshin.weaponmaterialtypes(body.slice(15))
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.reply(from, `Nome -> ${impact.name}\n\n2 Star -> ${impact['2starname']}\n\n3 Star -> ${impact['3starname']}\n\n4 Star -> ${impact['4starname']}\n\n5 Star -> ${impact['5starname']}\n\nOnde achar -> ${impact.location} - ${impact.region}\n\nNome do Local -> ${impact.domainofforgery}\n\nDias da semana ->\n${impact.day.join('\n')}`, id)
					} else if (argl[0] == '-tal') {
						let impact = await genshin.talentmaterialtypes(body.slice(14))
						if (impact == null) return await kill.reply(from, mess.noresult(), id)
						await kill.reply(from, `Nome -> ${impact.name}\n\n2 Star -> ${impact['2starname']}\n\n3 Star -> ${impact['3starname']}\n\n4 Star -> ${impact['4starname']}\n\n5 Star -> ${impact['5starname']}\n\nOnde achar -> ${impact.location} - ${impact.region}\n\nNome do Local -> ${impact.domainofforgery}\n\nDias da semana ->\n${impact.day.join('\n')}`, id)
					}
				break

				case 'chess':
					if (args.length == 0 || args[0] == '-help') return await kill.sendFileFromUrl(from, 'https://i.imgur.com/vIo4IAW.png', 'chess.png', `Esse é o tabuleiro de xadrez que utilizo para processar as jogadas de vocês.\n\nPara jogar insira o comando com o subsistema, pessoa e sua jogada.\nExemplo -> "${prefix}Chess -new @Iris a4"\n\nFunções -> ["-new", "-play", "-show"].`, id)
					const chessglayer = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : null)
					var chessglate = new chessImageGenerator({
						size: 800,
						style: 'alpha'
					})
					const newGame = (chatId, user, user2) => {
						global.chessg = new chess.Chess()
						chessGame[chatId] = {
							'fen': chessg.fen(),
							'b': user2,
							'w': user
						}
					}
					const getGame = async (chatId) => {
						await chessglate.loadFEN(chessGame[chatId]['fen'])
						let imageBoard = await chessglate.generateBuffer()
						try {
							await kill.sendImage(from, tools('others').dataURI('image/png', imageBoard), 'chess.png', '', id)
							await kill.sendTextWithMentions(from, `Fiz minha jogada, sua vez @${chessGame[chatId][chessGame[chatId]['fen'].split(' ')[1]]}.\nVocê pode jogar nas seguintes posições [Digite igual] ->\n${chessg.moves().join(',  ')}`, id)
						} catch (error) {
							console.error(error)
							await kill.reply(from, mess.fail('CHESS', error, (new Date().toString())), id)
						}
					}
					if (args[0] == '-new') {
						if (args[2] == null) return await kill.reply(from, `Forneça uma jogada.\nJogadas possíveis ->\n${chessg.moves().join(',  ')}`, id)
						newGame(chatId, sender.id, chessglayer)
						let moved = (chessg.move(args[2]) == null ? 'Error' : 'Not Error')
						if (moved !== 'Not Error') return await kill.reply(from, `Sua jogada é invalida, jogadas possíveis ->\n${chessg.moves().join(',  ')}`, id)
						chessGame[chatId]['fen'] = chessg.fen()
						global.chessg = new chess.Chess(chessGame[chatId]['fen'])
					} else if (args[0] == '-play') {
						if (chessGame[chatId] == null) return await kill.reply(from, `Você precisa iniciar uma partida com ${prefix}Chess -new`, id)
						if (chessGame[chatId]['w'] !== sender.id && chessGame[chatId]['b'] !== sender.id) return await kill.reply(from, `Você não é um jogador!`, id)
						global.chessg = new chess.Chess(chessGame[chatId]['fen'])
						let moved = (chessg.move(args[1]) == null ? 'Error' : 'Not Error')
						if (moved !== 'Not Error') return await kill.reply(from, `Sua jogada é invalida, jogadas possíveis ->\n${chessg.moves().join(',  ')}`, id)
						chessGame[chatId]['fen'] = chessg.fen()
						global.chessg = new chess.Chess(chessGame[chatId]['fen'])
					} else if (args[0] == '-show') {
						global.chessg = new chess.Chess(chessGame[chatId]['fen'])
						await getGame(chatId)
					}
					global.chessg = new chess.Chess(chessGame[chatId]['fen'])
					if (chessGame[chatId][chessGame[chatId]['fen'].split(' ')[1]] == botNumber + '@c.us') {
						var chessJog = tools('others').randVal(chessg.moves())
						let moved = chessg.move(chessJog)
						chessGame[chatId]['fen'] = chessg.fen()
						global.chessg = new chess.Chess(chessGame[chatId]['fen'])
						await getGame(chatId)
					} else await getGame(chatId)
					if (chessGame[chatId] !== null) {
						if (chessg.in_draw()) return await kill.reply(from, `O jogo terminou em empate!`, id)
						if (chessg.in_stalemate()) return await kill.reply(from, `O jogo terminou em afogamento!`, id)
						if (chessg.insufficient_material()) return await kill.reply(from, `O jogo terminou em empate por falta de peças!`, id)
						if (chessg.in_checkmate()) return await kill.reply(from, `O jogo terminou em xeque-mate!`, id)
						if (chessg.in_check()) return await kill.reply(from, `O jogo não pode continuar pois está em xeque-mate!`, id)
						if (chessg.game_over()) return await kill.reply(from, `O jogo terminou, incie outro com ${prefix}Chess -new`, id)
					}
				break
				
				case 'speed':
					var decryptedMedia = await decryptMedia(encryptMedia)
					var format = (isMedia && isVideo || isQuotedVideo) ? 'mp4' : 'mp3'
					if (isMedia && isVideo || isQuotedVideo || isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
						await tools('ffmpeg').speed(decryptedMedia, kill, message, Number(args[0]), format)
					} else return await kill.reply(from, `Use esse comando com audios e vídeos, se tentar usar em outro tipo de mídia não funcionará (use marcando!).`, id)
				break
				
				case 'reverse':
					var decryptedMedia = await decryptMedia(encryptMedia)
					var format = (isMedia && isVideo || isQuotedVideo) ? 'mp4' : 'mp3'
					if (isMedia && isVideo || isQuotedVideo || isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
						await tools('ffmpeg').reverse(decryptedMedia, kill, message, args, format)
					} else return await kill.reply(from, `Use esse comando com audios e vídeos, se tentar usar em outro tipo de mídia não funcionará (use marcando!).`, id)
				break

				/*Para usar a base remova o "/*" e o "* /" e bote um nome dentro das aspas da case e em seguida sua mensagem dentro das aspas na frente do from */
				/*case 'Nome do comando sem espaços':
					await kill.reply(from, 'Sua mensagem', id)
				break*/

				default:
					if (isCmd && prefix != "@" && /[a-zA-Z]/.test(command)) {
						if (Object.keys(cmds).includes(chatId) && Object.keys(cmds[chatId]).includes(command)) {
							await kill.reply(from, cmds[chatId][command], id)
						} else if (Object.keys(cmds['global']).includes(command)) {
							await kill.reply(from, cmds['global'][command], id)
						} else {
							let cmdprew = await shell.exec(`bash -c "grep -i '${command.slice(0, 3)}' lib/config/Utilidades/comandos.txt | shuf -n 1"`, {
								silent: true
							})
							if (cmdprew.stdout == '') {
								await kill.reply(from, mess.nocmd(command), id)
							} else {
								await kill.sendButtons(from, '→', [{
									"id": "1",
									"text": prefix + cmdprew
								}], mess.previewcmd())
							}
						}
					}
				break
				/*Desativa a linha "fantasma" no meu bloco de notas*/
			}

			// Sistema que roda múltiplos comandos de uma vez
			if (config.Multitasking && !tools('others').isUrl(cmdtorun[i]) && cmdtorun.length < 2 || !tools('others').isUrl(cmdtorun[i]) && !isOwner || cmdtorun.length >= config.Max_Commands) {
				break
			}
		}
	} catch (error) {
		await kill.reply(from, mess.fail(command, error, time), id)
		await kill.simulateTyping(from, true)
		if (config.WhatsApp_Report) {
			await kill.sendText(config.Owner[0], mess.wpprpt(command, error))
		}
		console.log(tools('others').color('[FALHA GERAL]', 'red'), error)
	}
}
