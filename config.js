/* ----------- VERY IMPORTANT NOTICE - AVISO MUITO IMPORTANTE - AVISO MUY IMPORTANTE ------------------
*
* Construído por Lucas R. - KillovSky, agradecimentos especiais ao grupo Legião Z.
*
* Reprodução, edição e outros estão autorizados MAS SEM REMOVER MEUS CRÉDITOS.
* Caso remova, resulta na quebra da licença do mesmo, o que é um crime federal.
* Leia mais em http://escolhaumalicenca.com.br/licencas/mit/ ou no comando /termos.
*
* Desculpe pelos comandos que estão em "inglês" como o "/groupinfo", amo o inglês! 
* Então os programo dessa forma. (Desconheço palavras suficientes em português) :'D
*
* Plagiar meus comandos não te torna coder, vá estudar, não seja um ladrão miserável.
* Levei meses nesse projeto e não paro de me empenhar em deixar todos felizes.
* Então você gostaria de ter algo que se esforçou muito de GRAÇA roubado de você? Pois eu não.
*
* Se ainda planeja roubar, saiba que eu espero de coração que você nunca seja roubado.
* P.S: Plagiar este BOT significa estar vendendo a alma para Lucas R. - KillovSky! ;D
*
* Obrigado a todos que me apoiam, que não roubam isso, que pegam e põem os créditos e...
*
* 						Obrigado a você que escolheu a Íris.
*
* ---------------------------------------------------------------------------------------------------*/

// MODULOS
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const math = require('mathjs')
const { search } = require("simple-play-store-search")
const google = require('google-it')
const isPorn = require('is-porn')
const moment = require('moment-timezone')
const sinesp = require('sinesp-api')
const { Aki } = require('aki-api')
const request = require('request')
const canvas = require('canvacord')
const ffmpeg = require('fluent-ffmpeg')
const { spawn, exec, execFile } = require('child_process')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const { removeBackgroundFromImageBase64 } = require('remove.bg')
const fetch = require('node-fetch')
const ms = require('parse-ms')
const ytsearch = require('yt-search')
const removeAccents = require('remove-accents')
const { stdout } = require('process')
const bent = require('bent')
const tts = require('node-gtts')
const brainly = require('brainly-scraper-v2')
const deepai = require('deepai')
const wiki = require("@dada513/wikipedia-search")
const { EmojiAPI } = require("emoji-api");
const os = require('os')
const puppeteer = require('puppeteer')
const { XVDL } = require("xvdl")
const youtubedl = require('youtube-dl-exec')
const sharp = require('sharp')

// UTILIDADES
const { color, sleep, ss, isUrl, upload, addFilter, isFiltered, translate, isInt } = require('./lib/functions')
const { getLevel, getMsg, getXp, addLevel, addXp, getRank, isWin, wait, addLimit, addMsg, getLimit } = require('./lib/gaming')
const poll = require('./lib/poll')
const config = require('./lib/config/Bot/config.json')
const patents = require('./lib/config/Bot/patentes.json')
const { mylang } = require('./lib/lang')
const options = { headless: true, defaultViewport: null, args: [ "--aggressive-cache-discard", "--disable-application-cache", "--disable-cache", "--disable-dev-profile","--disable-dev-shm-usage", "--disable-extensions", "--disable-gpu", "--disable-offline-load-stale-cache", "--disable-setuid-sandbox", "--disable-web-security", "--disk-cache-size=0", "--ignore-certificate-errors", "--no-sandbox" ] }

// ATIVADORES & CONFIGS EXTRAS
const region = config.lang
const aki = new Aki(region)
const akinit = async () => { try { await aki.start() } catch (error) { console.log(color('[AKI]', 'crimson'), color(`→ Obtive erros ao iniciar o akinator → ${error.message} - Você pode ignorar.`, 'gold')) } }
akinit()
const cd = Number(config.timePlay * 60000) // * 60000 - Transforma o valor do tempo de aposta em minutos
const mess = mylang()
moment.tz.setDefault('America/Sao_Paulo').locale('pt_BR')
const emoji = new EmojiAPI();
var jogadas = 0
axios.defaults.headers.common['User-Agent'] = config.userAgent
var isMuteAll = 0
var prefix = config.prefix

// JSON'S
const nsfw_ = JSON.parse(fs.readFileSync('./lib/config/Grupos/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/config/Grupos/welcome.json'))
const atporn = JSON.parse(fs.readFileSync('./lib/config/Grupos/antiporn.json'))
const bklist = JSON.parse(fs.readFileSync('./lib/config/Grupos/blacklist.json'))
const xp = JSON.parse(fs.readFileSync('./lib/config/Grupos/xp.json'))
const nivel = JSON.parse(fs.readFileSync('./lib/config/Bot/level.json'))
const atbk = JSON.parse(fs.readFileSync('./lib/config/Bot/anti.json'))
const faki = JSON.parse(fs.readFileSync('./lib/config/Grupos/fake.json'))
const slce = JSON.parse(fs.readFileSync('./lib/config/Bot/silence.json'))
const atstk = JSON.parse(fs.readFileSync('./lib/config/Grupos/sticker.json'))
const msgcount = JSON.parse(fs.readFileSync('./lib/config/Bot/msgcount.json'))
const atlinks = JSON.parse(fs.readFileSync('./lib/config/Grupos/antilinks.json'))
const trava = JSON.parse(fs.readFileSync('./lib/config/Grupos/antitrava.json'))

module.exports = kconfig = async (kill, message) => {
	
	// Isso antes da try possibilita receber os alertas no WhatsApp
	const { type, id, from, t, sender, author, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
	let { body } = message
	const ownerNumber = config.owner
	const chats = (type === 'chat') ? body : ((type === 'image' || type === 'video')) ? caption : ''
	body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
	const comma = body.slice(1).trim().split(/ +/).shift().toLowerCase()
	const command = removeAccents(comma)
	
    try {
		
		// PARAMETROS & Daily
		var daily = JSON.parse(fs.readFileSync('./lib/config/Bot/diario.json'))
		const { name, formattedTitle } = chat
		let { pushname, verifiedName, formattedName } = sender
		pushname = pushname || verifiedName || formattedName
        const botNumber = await kill.getHostNumber()
        const blockNumber = await kill.getBlockedIds()
        const user = sender.id
		const isOwner = ownerNumber.includes(user)
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupMembers = isGroupMsg ? await kill.getGroupMembers(groupId) : false
        const groupMembersId = isGroupMsg ? await kill.getGroupMembersId(groupId) : false
        const groupAdmins = isGroupMsg ? await kill.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(user) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const isNsfw = isGroupMsg ? nsfw_.includes(groupId) : false
        const autoSticker = isGroupMsg ? atstk.includes(groupId) : false
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
		const processTime = (timestamp, now) => { return moment.duration(now - moment(timestamp * 1000)).asSeconds() }
		const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const url = args.length !== 0 ? args[0] : ''
        const uaOverride = config.userAgent
        const isBlocked = blockNumber.includes(user)
        const isAntiPorn = isGroupMsg ? atporn.includes(groupId) : false
        const isAntiTravas = isGroupMsg ? trava.includes(groupId) : false
        const isAntiLink = isGroupMsg ? atlinks.includes(groupId) : false
        const isxp = isGroupMsg ? xp.includes(groupId) : false
		const mute = isGroupMsg ? slce.includes(groupId) : false
		const pvmte = !isGroupMsg ? slce.includes(user) : false
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
        const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
        const isQuotedAudio = quotedMsg && quotedMsg.type === 'audio'
        const isQuotedPtt = quotedMsg && quotedMsg.type === 'ptt'
        const isImage = type === 'image'
        const isVideo = type === 'video'
        const isAudio = type === 'audio'
        const isPtt = type === 'ptt'
        const isGif = mimetype === 'image/gif'
        const arqs = body.trim().split(' ')
        const arks = args.join(' ')
		const isTrava = type === 'oversized'
		const aMemberS = isGroupMsg ? groupMembers[Math.floor(Math.random() * groupMembers.length)] : user
		const randomMember = isGroupMsg ? aMemberS.id : user
		
		// OUTRAS
        const side = Math.floor(Math.random() * 2) + 1
		const lvpc = Math.floor(Math.random() * 100) + 1
		const lvrq = 100 - lvpc
		const milSort = Math.floor(Math.random() * 1000) + 1
        global.pollfile = 'poll_Config_' + groupId + '.json'
        global.voterslistfile = 'poll_voters_Config_' + groupId + '.json'
		const errorurl = 'https://img.wallpapersafari.com/desktop/1920/1080/19/44/evOxST.jpg'
		const errorImg = 'https://i.ibb.co/jRCpLfn/user.png'
		const irisMsgs = await fs.readFileSync('./lib/config/Utilidades/reply.txt').toString().split('\n')
		const chatBotR = irisMsgs[Math.floor(Math.random() * irisMsgs.length)].replace('%name$', `${name}`).replace('%battery%', `${lvpc}`)
		const lgbt = await fs.readFileSync('./lib/config/Utilidades/lgbt.txt').toString().split('\n')
		const guei = lgbt[Math.floor(Math.random() * lgbt.length)]
		const weaponC = await fs.readFileSync('./lib/config/Utilidades/armas.txt').toString().split('\n')
		const whatWeapon = weaponC[Math.floor(Math.random() * weaponC.length)]
		
		// Sobe patente por nível, se desejar edite as patentes em 'lib/config/Bot/patentes.json'
        const check = await getLevel(user, nivel)
		var patente = patents.a0
		if (check <= 4) { patente = patents.a1 } else if (check <= 10) { patente = patents.a2 } else if (check <= 15) { patente = patents.a3 } else if (check <= 20) { patente = patents.a4 } else if (check <= 25) { patente = patents.a5 } else if (check <= 30) { patente = patents.a6 } else if (check <= 35) { patente = patents.a7 } else if (check <= 40) { patente = patents.a8 } else if (check <= 45) { patente = patents.a9 } else if (check <= 50) { patente = patents.a10 } else if (check <= 55) { patente = patents.a11 } else if (check <= 60) { patente = patents.a12 } else if (check <= 65) { patente = patents.a13 } else if (check <= 70) { patente = patents.a14 } else if (check <= 75) { patente = patents.a15 } else if (check <= 80) { patente = patents.a16 } else if (check <= 85) { patente = patents.a17 } else if (check <= 90) { patente = patents.a18 } else if (check <= 95) { patente = patents.a19 } else if (check <= 100) { patente = patents.a20 } else if (check <= 200) { patente = patents.a21 } else if (check <= 300) { patente = patents.a22 } else if (check <= 400) { patente = patents.a23 } else if (check <= 500) { patente = patents.a24 } else if (check <= 550) { patente = patents.a25 } else if (check <= 600) { patente = patents.a26 } else if (check <= 700) { patente = patents.a27 } else if (check <= 800) { patente = patents.a28 } else if (check <= 900) { patente = patents.a29 } else if (check <= 1000 || check >= 1000) { patente = patents.a30 }

        // Sistema do XP - Baseado no de Bocchi - Slavyan
        if (isGroupMsg && isxp && !isWin(user) && !isBlocked) {
            try {
                await wait(user)
                const levelAtual = await getLevel(user, nivel)
                const xpAtual = Math.floor(Math.random() * 20) + 11 // XP de 10 a 30
                const neededXp = 5 * Math.pow(levelAtual, 2) + 50 * levelAtual + 100
				await sleep(2000)
                await addXp(user, xpAtual, nivel)
                if (neededXp <= getXp(user, nivel)) {
                    await addLevel(user, 1, nivel)
					// Ative isso para fazer a Íris mandar mensagem de level UP, todavia vai atrapalhar em casos de muito xp ganho nos jogos e steal
                    //const userLevel = await getLevel(user, nivel)
                    //const takeXp = 5 * Math.pow(userLevel, 2) + 50 * userLevel + 100
                    //await kill.reply(from, `*「 +1 NIVEL 」*\n\n➸ *Nome*: ${pushname}\n➸ *XP*: ${await getXp(user, nivel)} / ${takeXp}\n➸ *Level*: ${levelAtual} -> ${await getLevel(user, nivel)} 🆙 \n➸ *Patente*: *${patente}* 🎉`, id)
                }
            } catch (err) { console.log(color('[XP]', 'crimson'), err) }
        }
		
		// Anti Imagens pornográficas
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiPorn && isMedia && isImage && !isCmd && !isOwner) {
			try {
				console.log(color('[IMAGEM]', 'red'), color('Verificando a imagem por pornografia...', 'yellow'))
				const mediaData = await decryptMedia(message, uaOverride)
				const getUrl = await upload(mediaData, false)
				deepai.setApiKey(config.deepai)
				const resp = await deepai.callStandardApi("nsfw-detector", { image: `${getUrl}` })
				if (resp.output.nsfw_score > 0.85) {
					await kill.removeParticipant(groupId, user).then(async () => { await kill.sendTextWithMentions(from, mess.baninjusto(user) + 'Porno.') })
					return console.log(color('[NSFW]', 'red'), color(`A imagem contém traços de contéudo adulto, removerei o → ${pushname} - [${user}]...`, 'yellow'))
				} else { console.log(color('[SEM NSFW]', 'lime'), color(`→ A imagem não aparententa ser pornografica.`, 'gold')) }
			} catch (error) { return }
		}
		
        // Auto-stickers de fotos
        if (isGroupMsg && autoSticker && isMedia && isImage && !isCmd) {
            const mediaData = await decryptMedia(message, uaOverride)
            await kill.sendImageAsSticker(from, `data:${mimetype};base64,${mediaData.toString('base64')}`, { author: config.author, pack: config.pack, keepScale: true })
        }
		
		// Auto-sticker de videos & gifs
		if (isGroupMsg && autoSticker && isMedia && isVideo && !isCmd) {
			const mediaData = await decryptMedia(message, uaOverride)
			await kill.sendMp4AsSticker(from, `data:${mimetype};base64,${mediaData.toString('base64')}`, null, { stickerMetadata: true, pack: config.pack, author: config.author, fps: 10, crop: true, loop: 0 })
		}

        // Anti links de grupo
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiLink && !isOwner) {
			try {
				if (chats.match(new RegExp(/(https:\/\/chat.whatsapp.com)/gi))) {
					const gplka = await kill.inviteInfo(chats)
					if (gplka) {
						console.log(color('[BAN]', 'red'), color('Link de grupo detectado, removendo participante...', 'yellow'))
						return await kill.removeParticipant(groupId, user).then(async () => { await kill.sendTextWithMentions(from, mess.baninjusto(user) + 'WhatsApp Link.') })
					} else { console.log(color('[ALERTA]', 'yellow'), color('Link de grupo invalido recebido...', 'yellow')) }
				}
			} catch (error) { return }
		}

		// Bloqueia todas as travas, seja contato, localização, texto e outros
		if (isGroupMsg && isAntiTravas && isTrava && !isGroupAdmins && isBotGroupAdmins && !isOwner) {
			try {
				console.log(color('[TRAVA]', 'red'), color(`Possivel trava recebida pelo → ${pushname} - [${user.replace('@c.us', '')}] em ${name}...`, 'yellow'))
				let wakeAdm = 'ACORDA - WAKE UP ADM\n\n'
				var shrekDes = ''
				for (let i = 0; i < 20; i++) { shrekDes += `⢀⡴⠑⡄⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \n⠸⡇⠀⠿⡀⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠑⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢀⢴⣶⣆ \n⠀⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⠸⣼⡿ \n⠀⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉⠀⠀⠀⠀⠀ \n⠀⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ \n⠀⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉\n\n` }
				for (let adminls of groupAdmins) { wakeAdm += `➸ @${adminls.replace(/@c.us/g, '')}\n` }
				await kill.removeParticipant(groupId, user).then(async () => { await kill.setGroupToAdminsOnly(groupId, true) }) // Fecha só para admins e bane o cara que travou
				await kill.sendText(from, shrekDes, id).then(async () => { await kill.sendTextWithMentions(from, wakeAdm) })  // Anti-Trava BR do Shrek muahauhauha + Chamar ADMS
				await kill.sendTextWithMentions(from, mess.baninjusto(user) + 'Travas.').then(async () => { await kill.sendText(from, mess.nopanic(), id) }) // Manda o motivo do ban e explica para os membros
				await kill.sendText(ownerNumber[0], mess.recTrava(user) + `\nAt/No > ${name}`).then(async () => { await kill.contactBlock(user) }) // Avisa o dono do bot e bloqueia o cara
				return await kill.setGroupToAdminsOnly(groupId, false) // Reabre o grupo
			} catch (error) { return }
		}
		
		// Bloqueia travas no PV
		if (!isGroupMsg && !isOwner && isTrava) { await kill.contactBlock(user).then(async () => { await kill.sendText(ownerNumber[0], mess.recTrava(user)) }) }
		// Para limpar automaticamente sem você verificar, adicione "await kill.clearChat(chatId)", o mesmo no de grupos.

        // Anti links pornográficos
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiPorn && !isOwner) {
			try {
				if (isUrl(chats)) {
					const inilkn = new URL(chats)
					console.log(color('[URL]', 'yellow'), 'URL recebida →', inilkn.hostname)
					await isPorn(inilkn.hostname, async (err, status) => {
						if (err) return console.error(err)
						if (status) {
							console.log(color('[NSFW]', 'red'), color(`O link é pornografico, removerei o → ${pushname} - [${user.replace('@c.us', '')}]...`, 'yellow'))
							return await kill.removeParticipant(groupId, user).then(async () => { await kill.sendTextWithMentions(from, mess.baninjusto(user) + 'Porno/Porn.') })
						} else { console.log(color('[SEM NSFW]', 'lime'), color(`→ O link não possui pornografia.`, 'gold')) }
					})
				}
			} catch (error) { return }
		}
		
		// Impede travas ou textos que tenham mais de 5.000 linhas
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && !isOwner) {
			try {
				if (chats.length > 5000) {
					console.log(color('[TRAVA]', 'red'), color(`Possivel trava recebida pelo → ${pushname} - [${user.replace('@c.us', '')}] em ${name}...`, 'yellow'))
					await kill.removeParticipant(groupId, user).then(async () => { await kill.sendTextWithMentions(from, mess.baninjusto(user) + 'Travas.') }) // Remove e manda o motivo no grupo
					return await kill.sendText(ownerNumber[0], mess.recTrava(user)).then(async () => { await kill.contactBlock(user) }) // Avisa o dono e então bloqueia a pessoa
				}
			} catch (error) { return }
		}
		
		// Bloqueia travas no PV que tenham mais de 5.000 linhas
		if (!isGroupMsg && !isOwner) {
			try {
				if (chats.length > 5000) {
					console.log(color('[TRAVA]', 'red'), color(`Possivel trava recebida pelo → ${pushname} - [${user.replace('@c.us', '')}]...`, 'yellow'))
					return await kill.contactBlock(user).then(async () => { await kill.sendText(ownerNumber[0], mess.recTrava(user)) }) // Avisa o dono e bloqueia
				}
			} catch (error) { return }
		}
		
		// Ative para banir quem mandar todos os tipos de links (Ative removendo a /* e */)
		/*if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiLink && !isOwner && isUrl(chats)) { await kill.removeParticipant(groupId, user) }*/
		
		// Comandos sem prefix, esse responde se marcar a BOT
		if (!isFiltered(from) && !isMedia && !isCmd) { try { if (chats.includes(`@${botNumber.replace('@c.us', '')}`)) { await kill.reply(from, chatBotR, id) } } catch (error) { return } }
		
		// Caso deseje criar siga o estilo disso abaixo, para usar a base remova a /* e a */
		/*if (!isFiltered(from) && !isCmd) { try { if (chats == 'Mensagem a receber, sem espaços') await kill.reply(from, 'Resposta para enviar', id) } catch (error) { return } }*/
		
		// Impede comandos em PV'S mutados
		if (!isGroupMsg && isCmd && pvmte && !isOwner ) return console.log(color('> [SILENCE]', 'red'), color(`Ignorando comando de ${pushname} - [${user.replace('@c.us', '')}] pois ele está mutado...`, 'yellow'))
		
		// Impede comandos em grupos mutados
		if (isGroupMsg && isCmd && !isGroupAdmins && mute && !isOwner) return console.log(color('> [SILENCE]', 'red'), color(`Ignorando comando de ${name} pois ele está mutado...`, 'yellow'))

		// Muta geral, reseta ao reiniciar
		if (isCmd && !isOwner && isMuteAll == 1) return console.log(color('> [SILENCE]', 'red'), color(`Ignorando comando de ${pushname} pois os PV'S e Grupos estão mutados...`, 'yellow'))

		// Ignora pessoas bloqueadas
		if (isBlocked && isCmd && !isOwner) return console.log(color('> [BLOCK]', 'red'), color(`Ignorando comando de ${pushname} - [${user.replace('@c.us', '')}] por ele estar bloqueado...`, 'yellow'))

        // Anti Flood para PV'S
        if (isCmd && isFiltered(from) && !isGroupMsg && !isOwner) { await addXp(user, -100, nivel); return console.log(color('> [FLOOD AS]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`"[${prefix}${command.toUpperCase()}] [${args.length}]"`, 'red'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`, 'red')) }
		
		// Anti Flood para grupos
        if (isCmd && isFiltered(from) && isGroupMsg && !isOwner) { await addXp(user, -100, nivel); return console.log(color('> [FLOOD AS]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`"[${prefix}${command.toUpperCase()}] [${args.length}]"`, 'red'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`, 'red'), 'EM', color(`"${name || formattedTitle}"`)) }
		
		// Contador de Mensagens (em grupo) | Para contar do PV bote sem aspas "isGroupMsg || !isGroupMsg"
        if (isGroupMsg) { await getMsg(user, msgcount); await addMsg(user, 1, msgcount) }
		
        // Mensagens no PV
        if (!isCmd && !isGroupMsg) { return console.log('> MENSAGEM AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`)) }
		
		// Mensagem em Grupo
        if (!isCmd && isGroupMsg) { return console.log('> MENSAGEM AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`), 'EM', color(`"${name || formattedTitle}"`)) }
		
		// Comandos no PV
		if (isCmd && !isGroupMsg) { console.log(color(`> COMANDO "[${prefix}${command.toUpperCase()}]"`), 'AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`)) }
		
		// Comandos em grupo
        if (isCmd && isGroupMsg) { console.log(color(`> COMANDO "[${prefix}${command.toUpperCase()}]"`), 'AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`), 'EM', color(`"${name || formattedTitle}"`)) }
		
        // Impede SPAM
        if (isCmd) await addFilter(from)

        switch(command) {
			
        case 'sticker':;case 'fig':;case 'figurinha':;case 'stiker':;case 'f':;case 's':
			const sharpre = async (mimetype, isCircle, noCut, mediaData) => { await sharp(mediaData).resize({ width: 512, height: 512, fit: 'fill' }).toBuffer().then(async (resizedImageBuffer) => { await kill.sendImageAsSticker(from, `data:${mimetype};base64,${resizedImageBuffer.toString('base64')}`, { author: config.author, pack: config.pack, keepScale: noCut, circle: isCircle }) }) }
            if (isMedia && isImage) {
				await kill.reply(from, mess.wait(), id)
                const mediaData = await decryptMedia(message, uaOverride)
				if (arks.includes('-circle')) { var isCircle = true } else { var isCircle = false }
				if (arks.includes('-nocut')) { var noCut = true } else { var noCut = false }
				if (arks.includes('-fill')) { return await sharpre(mimetype, isCircle, noCut, mediaData) }
				await kill.sendImageAsSticker(from, `data:${mimetype};base64,${mediaData.toString('base64')}`, { author: config.author, pack: config.pack, keepScale: noCut, circle: isCircle })
            } else if (isQuotedImage) {
				await kill.reply(from, mess.wait(), id)
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
				if (arks.includes('-circle')) { var isCircle = true } else { var isCircle = false }
				if (arks.includes('-nocut')) { var noCut = true } else { var noCut = false }
				if (arks.includes('-fill')) { return await sharpre(quotedMsg.mimetype, isCircle, noCut, mediaData) }
				await kill.sendImageAsSticker(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, { author: config.author, pack: config.pack, keepScale: noCut, circle: isCircle })
            } else if (args.length == 1) {
				await kill.reply(from, mess.wait(), id)
                if (isUrl(url)) {
					if (arks.includes('-circle')) { var isCircle = true } else { var isCircle = false }
					if (arks.includes('-nocut')) { var noCut = true } else { var noCut = false }
					await kill.sendStickerfromUrl(from, url, { method: 'get' }, { author: config.author, pack: config.pack, keepScale: noCut, circle: isCircle })
				} else return await kill.reply(from, mess.nolink(), id)
            } else return await kill.reply(from, mess.sticker(), id)
            break
			
			
		case 'ttp':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			const ttpst = await axios.get(`https://api.areltiyan.site/sticker_maker?text=${encodeURIComponent(body.slice(5))}`)
			await kill.sendImageAsSticker(from, ttpst.data.base64, { author: config.author, pack: config.pack, keepScale: true })
			break
			
			
		case 'attp':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			await kill.reply(from, mess.wait(), id)
			await axios.get(`https://api.xteam.xyz/attp?file&text=${encodeURIComponent(body.slice(6))}`, { responseType: 'arraybuffer' }).then(async (response) => {
				const attp = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, attp, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
        case 'wasted':
            if (isMedia && type === 'image' || isQuotedImage) {
                await kill.reply(from, mess.wait(), id)
                const wastedmd = isQuotedImage ? quotedMsg : message
                const wstddt = await decryptMedia(wastedmd, uaOverride)
				const wastedUpl = await upload(wstddt, false)
                await kill.sendFileFromUrl(from, `https://some-random-api.ml/canvas/wasted?avatar=${wastedUpl}`, 'Wasted.jpg', mess.wasted(), id).catch(async () => { await kill.reply(from, mess.upfail(), id) })
            } else return await kill.reply(from, mess.onlyimg(), id)
            break
			
			
        case 'trigger':
            if (isMedia && type === 'image' || isQuotedImage) {
                await kill.reply(from, mess.wait(), id)
                const triggermd = isQuotedImage ? quotedMsg : message
                const upTrigger = await decryptMedia(triggermd, uaOverride)
				const getTrigger = await upload(upTrigger, false)
				await axios.get(`https://some-random-api.ml/canvas/triggered?avatar=${getTrigger}`, { responseType: 'arraybuffer' }).then(async (response) => {
					const theTigger = Buffer.from(response.data, 'binary').toString('base64')
					await kill.sendImageAsSticker(from, theTigger, { author: config.author, pack: config.pack, keepScale: true })
				}).catch(async () => { await kill.reply(from, mess.upfail(), id) })
            } else return await kill.reply(from, mess.onlyimg(), id)
            break
			
		// LEMBRE-SE, REMOVER CRÈDITO È CRIME E PROIBIDO
		case 'about':
			await kill.sendFile(from, './lib/media/img/iris.png', 'iris.png', mess.about(), id)
			break
			
			
        case 'nobg':
			if (isMedia && type === 'image' || isQuotedImage) {
				const nobgmd = isQuotedImage ? quotedMsg : message
				const mediaData = await decryptMedia(nobgmd, uaOverride)
				const imageBase64 = `data:${nobgmd.mimetype};base64,${mediaData.toString('base64')}`
				await kill.reply(from, mess.wait(), id) 
				const base64img = imageBase64
				const outFile = `./lib/media/img/${user.replace('@c.us', '')}noBg.png`
				var result = await removeBackgroundFromImageBase64({ base64img, apiKey: config.nobg, size: 'auto', type: 'auto', outFile })
				await fs.writeFile(outFile, result.base64img)
				await kill.sendImageAsSticker(from, `data:${nobgmd.mimetype};base64,${result.base64img}`, { pack: config.pack, author: config.author, keepScale: true })
				await kill.reply(from, mess.nobgms(), id)
				setTimeout(() => { fs.unlinkSync(`./lib/media/img/${user.replace('@c.us', '')}noBg.png`) }, 30000)
            } else return await kill.reply(from, mess.onlyimg(), id)
            break
			
			
        case 'stickergif':;case 'gif':;case 'g':;case 'gifsticker':
			if (isMedia && isVideo || isGif || isQuotedVideo || isQuotedGif) {
                await kill.reply(from, mess.wait(), id)
				const encryptMedia = isQuotedGif || isQuotedVideo ? quotedMsg : message
				const mediaData = await decryptMedia(encryptMedia, uaOverride)
				await kill.sendMp4AsSticker(from, mediaData, null, { stickerMetadata: true, pack: config.pack, author: config.author, fps: 10, crop: true, loop: 0 }).catch(async () => { await kill.reply(from, mess.gifail(), id) })
            } else return await kill.reply(from, mess.onlyvgif(), id)
            break
			
			
		case 'simg':
            if (isMedia && type === 'image' || isQuotedImage) {
                const shimgoh = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(shimgoh, uaOverride)
				await kill.reply(from, mess.wait(), id)
				const sImgUp = await upload(mediaData, false)
				const sbrowser = await puppeteer.launch(options)
				const spage = await sbrowser.newPage()
				await spage.goto('https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(sImgUp))
				const simages = await spage.evaluate(() => { return Array.from(document.body.querySelectorAll('div div a h3')).slice(2).map(e => e.parentNode).map(el => ({ url: el.href, title: el.querySelector('h3').innerHTML })) })
				await sbrowser.close()
				var titleS = `🔎 「 Google Imagens 」 🔎\n\n`
				for (let i = 1; i < simages.length; i++) { titleS += `${simages[i].title}\n${simages[i].url}\n\n══════════════════════════════\n\n` }
				await kill.reply(from, titleS, id).catch(async () => { await kill.reply(from, mess.upfail(), id) })
			} else return await kill.reply(from, mess.onlyimg(), id)
			break
			
			
		case 'upimg':
            if (isMedia && type === 'image' || isQuotedImage) {
                const upimgoh = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(upimgoh, uaOverride)
                const upImg = await upload(mediaData, false)
				await kill.reply(from, mess.tempimg(upImg), id).catch(async () => { await kill.reply(from, mess.upfail(), id) })
			} else return await kill.reply(from, mess.onlyimg(), id)
			break
			
			
        case 'getsticker':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			const stkm = await fetch(`https://api.fdci.se/sosmed/rep.php?gambar=${encodeURIComponent(body.slice(12))}`)
			const stimg = await stkm.json()
			let stkfm = stimg[Math.floor(Math.random() * stimg.length) + 1]
			if (stkfm == null) return await kill.reply(from, mess.noresult(), id)
			await kill.sendStickerfromUrl(from, stkfm, { method: 'get' }, { author: config.author, pack: config.pack, keepScale: true })
            break
			
			
		case 'morte':;case 'death':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'nomes/nombres/names.', id)
			const predea = await axios.get(`https://api.agify.io/?name=${encodeURIComponent(args[0])}`)
			if (predea.data.age == null) return await kill.reply(from, mess.validname(), id)
			await kill.reply(from, mess.death(predea), id)
			break			
			
		// Botei todas as Tags do Xvideos
	    case 'oculto':
            if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			const xvid = await fs.readFileSync('./lib/config/Utilidades/porn.txt').toString().split('\n')
			const surp2 = xvid[Math.floor(Math.random() * xvid.length)]
            await kill.sendTextWithMentions(from, mess.oculto(randomMember, surp2))
            await sleep(2000)
            break
			
			
		case 'gender':;case 'genero':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'nomes/nombres/names.', id)
			const seanl = await axios.get(`https://api.genderize.io/?name=${encodeURIComponent(args[0])}`)
			if (seanl.data.gender == null) return await kill.reply(from, mess.validname(), id)
			await kill.reply(from, mess.genero(seanl), id)
			break
			
			
        case 'detector':
            if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			await kill.reply(from, mess.wait(), id)
            await sleep(3000)
            await kill.sendTextWithMentions(from, mess.gostosa(randomMember))
            await sleep(2000)
            break
			
			
		case 'math':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'número & simbolos matematicos/numbers & mathematical symbols.', id)
            const mtk = body.slice(6)
			try {
				if (typeof math.evaluate(mtk) !== "number") return await kill.reply(from, mess.onlynumber() + '\nUse +  -  *  /', id)
				await kill.reply(from, `${mtk}\n\n*=*\n\n${math.evaluate(mtk)}`, id)
			} catch (error) {
				await kill.reply(from, mess.onlynumber() + '\n+, -, *, /', id)
				console.log(color('[MATH]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
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
            if (args.length !== 1) return await kill.reply(from, mess.nolink(), id)
            const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
            const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
            if (isGiphy) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return await kill.reply(from, mess.fail() + '\n\nGiphy site error.', id) }
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                await kill.sendGiphyAsSticker(from, smallGifUrl)
            } else if (isMediaGiphy) {
                const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return await kill.reply(from, mess.fail() + '\n\nGiphy site error.', id) }
                const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
                await kill.sendGiphyAsSticker(from, smallGifUrl)
            } else return await kill.reply(from, mess.nolink(), id)
            break
			
			
		case 'msg':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			await kill.sendText(from, `${body.slice(5)}`)
			break
			
			
		case 'id':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			await kill.reply(from, mess.idgrupo(groupId), id)
			break
			
			
        case 'fake':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					if (faki.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					faki.push(groupId)
					await fs.writeFileSync('./lib/config/Grupos/fake.json', JSON.stringify(faki))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!faki.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					faki.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Grupos/fake.json', JSON.stringify(faki))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
            } else return await kill.reply(from, mess.soademiro(), id)
            break
			
			
        case 'blacklist':
            if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					if (bklist.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					bklist.push(groupId)
					await fs.writeFileSync('./lib/config/Grupos/blacklist.json', JSON.stringify(bklist))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!bklist.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					bklist.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Grupos/blacklist.json', JSON.stringify(bklist))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
            } else return await kill.reply(from, mess.soademiro(), id)
            break	
			
			
        case 'bklist':
            if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length == 0) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					const bkls = body.slice(11) + '@c.us'
					if (atbk.includes(bkls)) return await kill.reply(from, mess.jaenabled(), id)
					atbk.push(bkls)
					await fs.writeFileSync('./lib/config/Bot/anti.json', JSON.stringify(atbk))
					await kill.reply(from, mess.bkliston(), id)
				} else if (args[0] == 'off') {
					const bkls = body.slice(11) + '@c.us'
					if (!atbk.includes(bkls)) return await kill.reply(from, mess.jadisabled(), id)
					atbk.splice(bkls, 1)
					await fs.writeFileSync('./lib/config/Bot/anti.json', JSON.stringify(atbk))
					await kill.reply(from, mess.bklistoff(), id)
				} else return await kill.reply(from, mess.kldica2(), id)
            } else return await kill.reply(from, mess.soademiro(), id)
            break
			
			
		case 'onlyadms':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            if (!isGroupAdmins) return await kill.reply(from, mess.soademiro(), id)
            if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
			if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
            if (args[0] == 'on') {
				await kill.setGroupToAdminsOnly(groupId, true).then(async () => { await kill.sendText(from, mess.admson()) })
			} else if (args[0] == 'off') {
				await kill.setGroupToAdminsOnly(groupId, false).then(async () => { await kill.sendText(from, mess.admsoff()) })
			} else return await kill.reply(from, mess.kldica1(), id)
			break
			
		 // LEMBRE-SE, REMOVER CREDITO E CRIME E PROIBIDO	
		case 'legiao':
			if (isGroupMsg) return await kill.reply(from, mess.sopv(), id)
			await kill.sendLinkWithAutoPreview(from, 'https://chat.whatsapp.com/H53MdwhtnRf7TGX1VJ2Jje', 'S2')
			break
			
			
		case 'revoke':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            if (!isGroupAdmins) return await kill.reply(from, mess.soademiro(), id)
            if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
			await kill.revokeGroupInviteLink(groupId).then(async () => { await kill.reply(from, mess.revoga(), id) })
			break
			
			
		case 'water':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			try {
				if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
				await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
				const browser = await puppeteer.launch(options)
				const page = await browser.newPage()
				await page.goto("https://textpro.me/dropwater-text-effect-872.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
					await page.waitForSelector('#text-0')
					await page.type("#text-0", body.slice(6))
					await page.click("#submit")
					await sleep(10000) // Aumente se sua conexão for superr lenta
					await page.waitForSelector('div[class="thumbnail"] > img')
					const divElement = await page.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
					await kill.sendFileFromUrl(from, divElement, 'neon.jpg', '', id)
					await browser.close()
				})
			} catch (error) {
				await kill.reply(from, mess.fail(), id)
				console.log(color('[WATER]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'setimage':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            if (!isGroupAdmins) return await kill.reply(from, mess.soademiro(), id)
            if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
			if (isMedia && type == 'image' || isQuotedImage) {
				const dataMedia = isQuotedImage ? quotedMsg : message
				const mediaData = await decryptMedia(dataMedia, uaOverride)
				const picgp = await kill.getProfilePicFromServer(groupId)
				if (picgp == undefined) { var backup = errorurl } else { var backup = picgp }
				await kill.sendFileFromUrl(from, backup, 'group.png', 'Backup', id)
				await kill.setGroupIcon(groupId, `data:${mimetype};base64,${mediaData.toString('base64')}`)
			} else if (args.length == 1) {
				if (!isUrl(url)) { await kill.reply(from, mess.nolink(), id) }
				const picgpo = await kill.getProfilePicFromServer(groupId)
				if (picgpo == undefined) { var back = errorurl } else { var back = picgpo }
				await kill.sendFileFromUrl(from, back, 'group.png', 'Backup', id)
				await kill.setGroupIconByUrl(groupId, url).then(async (r) => (!r && r !== undefined) ? kill.reply(from, mess.nolink(), id) : kill.reply(from, mess.maked(), id))
			} else return await kill.reply(from, mess.onlyimg(), id)
			break
			
			
		case 'img':
            if (isQuotedSticker) {
				await kill.reply(from, mess.wait(), id)
				const mediaData = await decryptMedia(quotedMsg, uaOverride)
				await kill.sendFile(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, '', '', id)
            } else return await kill.reply(from, mess.onlyst(), id)
			break
			
			
        case 'randomanime':
            const nime = await axios.get('https://api.computerfreaker.cf/v1/anime')
            await kill.sendFileFromUrl(from, `${nime.data.url}`, ``, 'e.e', id)
            break
			
			
        case 'frase':
			const aiquote = await axios.get("http://inspirobot.me/api?generate=true")
			await kill.sendFileFromUrl(from, aiquote.data, 'quote.jpg', '~Ok...?~\n\n❤️', id )
            break
			
			
        case 'make':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
            const diary = await axios.get(`https://st4rz.herokuapp.com/api/nulis?text=${encodeURIComponent(body.slice(6))}`)
            await kill.sendImage(from, `${diary.data.result}`, '', mess.diary(), id)
            break
			
			
        case 'neko':
    	    const rnekol = ["https://nekos.life/api/v2/img/kemonomimi", "https://nekos.life/api/v2/img/neko", "https://nekos.life/api/v2/img/ngif", "https://nekos.life/api/v2/img/fox_girl"];
    	    const rnekolc = rnekol[Math.floor(Math.random() * rnekol.length)];
			const neko = await axios.get(rnekolc)
			await kill.sendFileFromUrl(from, `${neko.data.url}`, ``, `🌝`, id)
            break
			
			
        case 'image':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
            const linp = await fetch(`https://api.fdci.se/sosmed/rep.php?gambar=${encodeURIComponent(body.slice(7))}`)
			const pint = await linp.json()
            let erest = pint[Math.floor(Math.random() * pint.length)]
			if (erest == null) return await kill.reply(from, mess.noresult(), id)
            await kill.sendFileFromUrl(from, erest, '', ';)', id)
            break
			
			
        case 'yaoi':
            const yam = await fetch(`https://api.fdci.se/sosmed/rep.php?gambar=yaoi`)
			const yaoi = await yam.json()
            let flyaoi = yaoi[Math.floor(Math.random() * yaoi.length)]
			if (flyaoi == null) return await kill.reply(from, mess.noresult(), id)
            await kill.sendFileFromUrl(from, flyaoi, '', 'Tururu...', id)
            break
			
		// Adicione mais no arquivo fml.txt na pasta config, obs, em inglês
        case 'life':
			const fml = await fs.readFileSync('./lib/config/Utilidades/fml.txt').toString().split('\n')
			const fmylife = fml[Math.floor(Math.random() * fml.length)]
			if (config.lang == 'en') return await kill.reply(from, fmylife, id)
			await sleep(5000)
			await translate(fmylife, config.lang).then(async (lfts) => { await kill.reply(from, lfts, id) })
			break
			
			
        case 'fox':
            const fox = await axios.get(`https://some-random-api.ml/img/fox`)
			await kill.sendFileFromUrl(from, fox.data.link, ``, '🥰', id)
			break
			
			
        case 'wiki':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
            const wikip = await wiki.search(`${body.slice(6)}`, config.lang)
			const wikis = await axios.get(`https://${config.lang}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${wikip[0].pageid}`)
			const getData = Object.keys(wikis.data.query.pages)
			await kill.reply(from, wikis.data.query.pages[getData].extract, id).catch(async () => { await kill.reply(from, mess.noresult(), id) })
            break
			
			
        case 'nasa':
        	if (args[0] == '-data') {
            	const nasa = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${encodeURIComponent(args[1])}`)
				if (config.lang == 'en') return await kill.sendFileFromUrl(from, `${nasa.data.url}`, '', `${nasa.data.date} → ${nasa.data.title}\n\n ${nasa.data.explanation}`, id)
				await sleep(4000)
            	await translate(nasa.data.explanation, config.lang).then(async (result) => { await kill.sendFileFromUrl(from, `${nasa.data.url}`, '', `${nasa.data.date} → ${nasa.data.title}\n\n ${result}`, id) })
			} else {
            	const nasa = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`)
				if (config.lang == 'en') return await kill.sendFileFromUrl(from, `${nasa.data.url}`, '', `${nasa.data.date} → ${nasa.data.title}\n\n ${nasa.data.explanation}`, id)
				await sleep(4000)
            	await translate(nasa.data.explanation, 'pt').then(async (result) => { await kill.sendFileFromUrl(from, `${nasa.data.url}`, '', `${nasa.data.date} → ${nasa.data.title}\n\n ${result}`, id) })
			}
			break
			
			
        case 'stalkig':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'instagram usernames.', id)
            const ig = await axios.get(`https://www.instagram.com/${body.slice(9)}/?__a=1`)
			const stkig = JSON.stringify(ig.data)
			if (stkig == '{}') return await kill.reply(from, mess.noresult(), id)
			await kill.sendFileFromUrl(from, `${ig.data.graphql.user.profile_pic_url}`, ``, mess.insta(ig), id)
            break
			
			
		case 'fatos':
			var anifac = ["dog", "cat", "bird", "panda", "fox", "koala"];
			var tsani = anifac[Math.floor(Math.random() * anifac.length)];
			const animl = await axios.get(`https://some-random-api.ml/facts/${tsani}`)
			if (config.lang == 'en') return await kill.reply(from, animl.data.fact, id)
			await sleep(5000)
        	await translate(animl.data.fact, 'pt').then(async (result) => { await kill.reply(from, result, id) })
			break
			
			
		case 'sporn':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
			if (args.length == 0) return await kill.reply(from, mess.noargs(), id)
			const xxxSearch = await XVDL.search(body.slice(7))
			const sPornX = await XVDL.getInfo(xxxSearch.videos[0].url)
			await kill.sendFileFromUrl(from, `${xxxSearch.videos[0].thumbnail.static}`, '', mess.sporn(xxxSearch, sPornX), id)
            break
			
			
		case 'xvideos':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
			if (args.length == 0 || !isUrl(url) || !url.includes('xvideos.com')) return await kill.reply(from, mess.nolink(), id)
			await kill.reply(from, mess.wait(), id)
			const sPornD = await XVDL.getInfo(url)
			await kill.sendFileFromUrl(from, `${sPornD.streams.lq}`, 'xvideos.mp4', `🌚`, id).catch(async () => { await kill.reply(from, mess.nolink() + '\n\nOu falha geral/or failed on download.', id) })
            break
			
			
		// Pediram demais, então trouxe o youtube-dl para os 4 comandos abaixo, mas se ele cair, responsabilidade é de vocês que deixam seus membros floodarem os comandos.
		case 'downvideo':
			if (args.length == 0 || !isUrl(url)) return await kill.reply(from, mess.nolink(), id)
            try {
				await kill.reply(from, mess.wait(), id)
				await youtubedl(`${url}`, { noWarnings: true, noCallHome: true, noCheckCertificate: true, preferFreeFormats: true, youtubeSkipDashManifest: true, referer: `${url}`, getUrl: true, x: true, format: 'mp4', skipDownload: true, matchFilter: `filesize < ${Number(config.maxSize)}M` }).then(async (video) => { await kill.sendFileFromUrl(from, video, `downloads.mp4`, `e.e`, id) })
			} catch (error) {
				await kill.reply(from, mess.verybig(), id)
				console.log(color('[DOWNVIDEO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
		// Isso e o de cima somente funciona se o local não precisar de um login.
		case 'downaudio':
			if (args.length == 0 || !isUrl(url)) return await kill.reply(from, mess.nolink(), id)
            try {
				await kill.reply(from, mess.wait(), id)
				await youtubedl(`${url}`, { noWarnings: true, noCallHome: true, noCheckCertificate: true, preferFreeFormats: true, youtubeSkipDashManifest: true, referer: `${url}`, x: true, audioFormat: 'mp3', o: `./lib/media/audio/d${user.replace('@c.us', '')}${lvpc}.mp3` }).then(async () => { await kill.sendPtt(from, `./lib/media/audio/d${user.replace('@c.us', '')}${lvpc}.mp3`, id) })
				setTimeout(() => { fs.unlinkSync(`./lib/media/audio/d${user.replace('@c.us', '')}${lvpc}.mp3`) }, 30000)
			} catch (error) {
				await kill.reply(from, mess.verybig(), id)
				console.log(color('[DOWNAUDIO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
		// Se os comandos caírem por seus membros não escutarem meus avisos, não venha dizer que não avisei e pedir uma correção, sem contar que floodar pode danificar você e seu PC.
        case 'play':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Títulos do YouTube/YouTube Titles.', id)
			try {
				await kill.reply(from, mess.wait(), id)
				const ytres = await ytsearch(`${body.slice(6)}`)
				await kill.sendYoutubeLink(from, `${ytres.all[0].url}`, '\n' + mess.play(ytres))
				await youtubedl(`https://youtu.be/${ytres.all[0].videoId}`, { noWarnings: true, noCallHome: true, noCheckCertificate: true, preferFreeFormats: true, youtubeSkipDashManifest: true, referer: `https://youtu.be/${ytres.all[0].videoId}`, x: true, audioFormat: 'mp3', o: `./lib/media/audio/${user.replace('@c.us', '')}${lvpc}.mp3` }).then(async () => { await kill.sendPtt(from, `./lib/media/audio/${user.replace('@c.us', '')}${lvpc}.mp3`, id) })
				await sleep(30000)
				setTimeout(() => { fs.unlinkSync(`./lib/media/audio/${user.replace('@c.us', '')}${lvpc}.mp3`) }, 30000)
			} catch (error) {
				await kill.reply(from, mess.verybig(), id)
				console.log(color('[PLAY]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
		 // Se obter erros com o 'replace' apague a "${user.replace('@c.us', '')}" de todos os comandos de download que o possuem.
        case 'video':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'Títulos do YouTube/YouTube Titles.', id)
			try {
				await kill.reply(from, mess.wait(), id)
				const vipres = await ytsearch(`${body.slice(7)}`)
				await kill.sendYoutubeLink(from, `${vipres.all[0].url}`, '\n' + mess.play(vipres))
				await youtubedl(`https://www.youtube.com/watch?v=${vipres.all[0].videoId}`, { noWarnings: true, noCallHome: true, noCheckCertificate: true, preferFreeFormats: true, youtubeSkipDashManifest: true, referer: `https://www.youtube.com/watch?v=${vipres.all[0].videoId}`, getUrl: true, x: true, format: 'mp4', skipDownload: true, matchFilter: `filesize < ${Number(config.maxSize)}M` }).then(async (video) => { await kill.sendFileFromUrl(from, video, `${vipres.all[0].title}.mp4`, `${vipres.all[0].title}`, id) })
			} catch (error) {
				await kill.reply(from, mess.verybig(), id)
				console.log(color('[VIDEO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
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
			await kill.sendFileFromUrl(from, `http://api.qrserver.com/v1/create-qr-code/?data=${body.slice(4)}`, '', mess.maked(), id)
			break
			
			
        case 'readqr':
            if (isMedia && type === 'image' || isQuotedImage) {
                const qrCode = isQuotedImage ? quotedMsg : message
                const downQr = await decryptMedia(qrCode, uaOverride)
				const upQrCode = await upload(downQr, false)
				const getQrText = await axios.get(`http://api.qrserver.com/v1/read-qr-code/?fileurl=${upQrCode}`)
				const theQRText = getQrText.data[0].symbol[0].error
				if (theQRText !== null) return await kill.reply(from, 'Not a QR - Não é um QR.\n\nOu erro - Or error.', id).catch(async () => { await kill.reply(from, mess.upfail(), id) })
            } else return await kill.reply(from, mess.onlyimg() + '\nQR-Code!', id)
            break
			
			
		case 'send':
			if (args.length == 0 || !isUrl(url)) return await kill.reply(from, mess.nolink(), id)
			await kill.sendFileFromUrl(from, url, '', '', id).catch(async () => { await kill.reply(from, mess.onlyimg(), id) })
			break
			
			
        case 'quote':
			if (args.length <= 1 | !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
			const quotes = arg.split('|')[0]
			const qauth = arg.split('|')[1]
			await kill.reply(from, mess.wait(), id)
			const quoteimg = await axios.get(`https://terhambar.com/aw/qts/?kata=${encodeURIComponent(quotes)}&author=${encodeURIComponent(qauth)}&tipe=random`)
			await kill.sendFileFromUrl(from, `${quoteimg.data.result}`, '', 'Compreensível.', id)
            break
			
			
       case 'translate':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'idioma/language & words/palavras ou/or marca/mark a message/mensagem.', id)
			await kill.reply(from, mess.wait(), id)
			try {
				if (quotedMsg) {
					const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
					await sleep(5000)
					await translate(quoteText, args[0]).then(async (result) => { await kill.reply(from, `→ ${result}`, quotedMsgObj.id) })
				} else {
					const txttotl = body.slice(14)
					await sleep(5000)
					await translate(txttotl, args[0]).then(async (result) => { await kill.reply(from, `→ ${result}`, id) })
				}
			} catch (error) {
				await kill.reply(from, mess.ttsiv() + '\n\nOu' + mess.gblock(), id)
				console.log(color('[TRANSLATE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
			
        case 'tts':
            if (args.length <= 1) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			try {
				const dataText = body.slice(8)
				var langtts = args[0]
				if (args[0] == 'br') langtts = 'pt-br'
				var idptt = tts(langtts)
				await idptt.save(`./lib/media/audio/res${idptt}.mp3`, dataText, async () => {
					await sleep(3000)
					await kill.sendPtt(from, `./lib/media/audio/res${idptt}.mp3`, id)
				})
			} catch (error) { 
				await kill.reply(from, mess.ttsiv(), id)
				console.log(color('[TTS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
			
        case 'idiomas':
            await kill.sendText(from, mess.idiomas())
            break
			
			
		case 'resposta':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers/emojis/etc.', id)
			await fs.appendFile('./lib/config/Utilidades/reply.txt', `\n${body.slice(10)}`)
			await kill.reply(from, mess.maked(), id)
			break
			
			
        case 'criador':
			await kill.reply(from, `☀️ - Host: https://wa.me/${config.owner[0].replace('@c.us', '')}\n🌙 - Dev: https://wa.me/5518998044132`, id)
			await kill.reply(from, mess.everhost(), id)
            break
			
			
		case 'akinator':;case 'aki':
			try {
				if (args[0] == '-r') {
					let akinm = args[1].match(/^[0-9]+$/)
					if (!akinm) return await kill.reply(from, mess.aki(), id)
					const myAnswer = `${args[1]}`
					await aki.step(myAnswer);
					jogadas = jogadas + 1
					if (aki.progress >= 90 || aki.currentStep >= 90) {
						await aki.win()
						var akiwon = aki.answers[0]
						await kill.sendFileFromUrl(from, `${akiwon.absolute_picture_path}`, '', mess.akiwon(aki, akiwon), id)
					} else { await kill.reply(from, mess.akistart(aki), id) }
				} else if (args[0] == '-back' || args[0] == '-new') {
					for (let i = 0; i < jogadas; i++) { await aki.back() }
					jogadas = 0
					await kill.reply(from, mess.akistart(aki), id)
				} else return await kill.reply(from, mess.akistart(aki), id)
			} catch (error) {
				await kill.reply(from, mess.akifail(), id)
				akinit()
				await kill.reply(from, mess.akistart(aki), id)
				console.log(color('[AKINATOR]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
		// Se quiser adicione respostas na reply.txt ou use o comando '/resposta', Íris também consegue adicionar ela mesma sozinha
        case 'iris':
			try {
				if (args[0] == '-g') {
					await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${args[1]}" reply.txt | shuf -n 1'`, async (error, stdout, stderr) => {
						if (error || stderr || stdout == null || stdout == '') {
							await kill.reply(from, chatBotR, id)
						} else return await kill.reply(from, stdout, id)
					})
				} else {
					const iris = await axios.get(`http://simsumi.herokuapp.com/api?text=${encodeURIComponent(body.slice(6))}&lang=${config.lang}`)
					if (iris.data.success == 'Limit 50 queries per hour.' || iris.data.success == '' || iris.data.success == null) {
						await kill.reply(from, chatBotR, id)
					} else {
						if (iris.data.success == 'Curta a pagina Gamadas por Bieber no facebook ;)') return await kill.reply(from, 'Oi sua gostosa, como vai?', id)
						await kill.reply(from, iris.data.success, id)
						await fs.appendFile('./lib/config/Utilidades/reply.txt', `\n${iris.data.success}`)
					}
				}
			} catch (error) { 
				await kill.reply(from, chatBotR, id)
				console.log(color('[IRIS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
        case 'speak':
			const sppt = require('node-gtts')(config.lang)
			try {
				if (args[0] == '-g') {
					await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${args[1]}" reply.txt | shuf -n 1'`, async (error, stdout, stderr) => {
						if (error || stderr || stdout == null || stdout == '') {
							await sppt.save('./lib/media/audio/resPtm.mp3', chatBotR, async function () { await kill.sendPtt(from, './lib/media/audio/resPtm.mp3', id) })
						} else { await sppt.save('./lib/media/audio/resPtm.mp3', stdout, async function () { await kill.sendPtt(from, './lib/media/audio/resPtm.mp3', id) }) }
					})
				} else {
					const spiris = await axios.get(`http://simsumi.herokuapp.com/api?text=${encodeURIComponent(body.slice(7))}&lang=${config.lang}`)
					const a = spiris.data.success
					if (a == 'Limit 50 queries per hour.' || a == '' || a == null) {
						await sppt.save('./lib/media/audio/resPtm.mp3', chatBotR, async function () { await kill.sendPtt(from, './lib/media/audio/resPtm.mp3', id) })
					} else {
						await sppt.save('./lib/media/audio/resPtm.mp3', a, async function () {
							await kill.sendPtt(from, './lib/media/audio/resPtm.mp3', id)
							await fs.appendFile('./lib/config/Utilidades/reply.txt', `\n${a}`)
						})
					}
				}
			} catch (error) {
				await sppt.save('./lib/media/audio/resPtm.mp3', chatBotR, async function () { await kill.sendPtt(from, './lib/media/audio/resPtm.mp3', id) })
				console.log(color('[SPEAK]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
        case 'curiosidade':
			const rcurio = await fs.readFileSync('./lib/config/Utilidades/curiosidades.txt').toString().split('\n')
			const rsidd = rcurio[Math.floor(Math.random() * rcurio.length)]
			try {
				if (args[0] == '-g') {
					await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${args[1]}" curiosidades.txt | shuf -n 1'`, async (error, stdout, stderr) => {
						if (error || stderr || stdout == null || stdout == '') {
							await kill.reply(from, rsidd, id)
						} else return await kill.reply(from, stdout, id)
					})
				} else return await kill.reply(from, rsidd, id)
			} catch (error) { 
				await kill.reply(from, rsidd, id)
				console.log(color('[CURIOSIDADE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
        case 'trecho':
			const rcit = await fs.readFileSync('./lib/config/Utilidades/frases.txt').toString().split('\n')
			const racon = rcit[Math.floor(Math.random() * rcit.length)]
			try {
				if (args[0] == '-g') {
					await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${args[1]}" frases.txt | shuf -n 1'`, async (error, stdout, stderr) => {
						if (error || stderr || stdout == null || stdout == '') {
							await kill.reply(from, racon, id)
						} else return await kill.reply(from, stdout, id)
					})
				} else return await kill.reply(from, racon, id)
			} catch (error) { 
				await kill.reply(from, rsidd, id)
				console.log(color('[TRECHO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
        case 'roll':
            const dice = Math.floor(Math.random() * 6) + 1
            await kill.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png', { method: 'get' }, { author: config.author, pack: config.pack, keepScale: true })
            break
			
			
		case 'rolette':;case 'roleta':
			const checkxpr = await getXp(user, nivel)
			const xpMenorT = parseInt(checkxpr / 2, 10)
			if (isNaN(args[0]) || !isInt(args[0]) || Number(args[0]) >= xpMenorT || Number(args[0]) < 250) return await kill.reply(from, mess.gaming(checkxpr, xpMenorT), id)
			var nrolxp = Math.floor(Math.random() * -milSort) - Number(args[0])
			var prolxp = Math.floor(Math.random() * milSort) + Number(args[0])
			const limitrl = await getLimit(user, daily)
            if (limitrl !== undefined && cd - (Date.now() - limitrl) > 0) {
                const time = ms(cd - (Date.now() - limitrl))
                await kill.reply(from, mess.limitgame(), id)
			} else {
				if (side == 1) {
					await kill.sendFile(from, './lib/media/img/roleta1.png', 'rol1.png', mess.loseshot(nrolxp), id)
					await sleep(2000)
					await addXp(user, nrolxp, nivel)
				} else if (side == 2) {
					await kill.sendFile(from, './lib/media/img/roleta.jpg', 'rol.jpg', mess.winshot(prolxp), id)
					await sleep(2000)
					await addXp(user, prolxp, nivel)
				}
				await addLimit(user, daily) // remova para tirar o limite dos jogos
			}
			break
			
			
        case 'flip':
			const checkxp = await getXp(user, nivel)
			const xpMenorc = parseInt(checkxp / 2, 10)
			if (isNaN(args[1]) || !isInt(args[1]) || Number(args[1]) >= xpMenorc || Number(args[1]) < 250) return await kill.reply(from, mess.gaming(checkxp, xpMenorc), id)
			var nflipxp = Math.floor(Math.random() * -milSort) - Number(args[1])
			var pflipxp = Math.floor(Math.random() * milSort) + Number(args[1])
			const limitfp = await getLimit(user, daily)
            if (limitfp !== undefined && cd - (Date.now() - limitfp) > 0) {
                const time = ms(cd - (Date.now() - limitfp))
                await kill.reply(from, mess.limitgame(), id)
			} else {
				if (args[0] == 'cara' || args[0] == 'coroa') {
					if (side == 1) {
						await kill.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png', { method: 'get' }, { author: config.author, pack: config.pack, keepScale: true })
						if (args[0] == 'cara') {
							await kill.reply(from, mess.flipwin(pflipxp) + ' "cara".', id)
							await sleep(2000)
							await addXp(user, pflipxp, nivel)
						} else {
							await kill.reply(from, mess.fliplose(nflipxp) + ' "coroa".', id)
							await sleep(2000)
							await addXp(user, nflipxp, nivel)
						}
					} else {
						await kill.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png', { method: 'get' }, { author: config.author, pack: config.pack, keepScale: true })
						if (args[0] == 'coroa') {
							await kill.reply(from, mess.flipwin(pflipxp) + ' "coroa".', id)
							await sleep(2000)
							await addXp(user, pflipxp, nivel)
						} else {
							await sleep(2000)
							await kill.reply(from, mess.fliplose(nflipxp) + ' "cara".', id)
							await addXp(user, nflipxp, nivel)
						}
					}
				} else return await kill.reply(from, mess.fliphow(), id)
				await addLimit(user, daily) // remova para tirar o limite dos jogos
			}
            break
			
			
		case 'cassino':
			var checkxpc = await getXp(user, nivel)
			const xpMenor = parseInt(checkxpc / 2, 10)
			if (isNaN(args[0]) || !isInt(args[0]) || Number(args[0]) >= xpMenor || Number(args[0]) < 250) return await kill.reply(from, mess.gaming(checkxpc, xpMenor), id)
			var ncasxp = Math.floor(Math.random() * -milSort) - Number(args[0])
			var pcasxp = Math.floor(Math.random() * milSort) + Number(args[0])
            const limitcs = await getLimit(user, daily)
            if (limitcs !== undefined && cd - (Date.now() - limitcs) > 0) {
				const time = ms(cd - (Date.now() - limitcs))
                await kill.reply(from, mess.limitgame(), id)
			} else {
				var cassin = ['🍒', '🎃', '🍐']
				const cassin1 = cassin[Math.floor(Math.random() * cassin.length)]
				const cassin2 = cassin[Math.floor(Math.random() * cassin.length)]
				const cassin3 = cassin[Math.floor(Math.random() * cassin.length)]
				var cassinend = cassin1 + cassin2 + cassin3
				if (cassinend == '🍒🍒🍒' || cassinend == '🎃🎃🎃' || cassinend == '🍐🍐🍐') {
					await kill.reply(from, mess.caswin(cassin1, cassin2, cassin3, pcasxp), id)
					await sleep(2000)
					await addXp(user, Number(pcasxp), nivel)
				} else {
					await kill.reply(from, mess.caslose(cassin1, cassin2, cassin3, ncasxp), id)
					await sleep(2000)
					await addXp(user, Number(ncasxp), nivel)
				}
				await addLimit(user, daily) // remova para tirar o limite de tempo
			}
			break
			
			
       case 'poll':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            poll.get(kill, message, pollfile, voterslistfile).catch(async () => { await kill.reply(from, '0 votações abertas.', id) })
            break    
			
			
       case 'vote':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            poll.vote(kill, message, pollfile, voterslistfile).catch(async () => { await kill.reply(from, '0 votações abertas.', id) })
            break
			
			
       case 'newpoll':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            poll.reset(kill, message, message.body.slice(9), pollfile, voterslistfile)
            break
			
			
       case 'ins':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            poll.add(kill, message, message.body.slice(5), pollfile, voterslistfile).catch(async () => { await kill.reply(from, '0 votações abertas.', id) })
            break
			
			
        case 'nsfw':
            if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args[0] == 'on') {
					if (nsfw_.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					nsfw_.push(groupId)
					await fs.writeFileSync('./lib/config/Grupos/NSFW.json', JSON.stringify(nsfw_))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!nsfw_.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					nsfw_.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Grupos/NSFW.json', JSON.stringify(nsfw_))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'welcome':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					if (welkom.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					welkom.push(groupId)
					await fs.writeFileSync('./lib/config/Grupos/welcome.json', JSON.stringify(welkom))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!welkom.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					welkom.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Grupos/welcome.json', JSON.stringify(welkom))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
		case 'macaco':
			await axios.get("https://api.fdci.se/sosmed/rep.php?gambar=macaco").then(async (result) => {
				var mon = JSON.parse(JSON.stringify(result.data))
				var nkey = mon[Math.floor(Math.random() * mon.length)]
				if (nkey == null) return await kill.reply(from, mess.noresult(), id)
              	await kill.sendFileFromUrl(from, nkey, "", "🙏 🙏 🙏", id)
			})
			break
			
			
		case 'ball':
			const ball = await axios.get('https://nekos.life/api/v2/img/8ball')
			await kill.sendStickerfromUrl(from, ball.data.url, { method: 'get' }, { author: config.author, pack: config.pack, keepScale: true })
			break
			
			
		case 'cafune':
    	    const rcafune = ["https://nekos.life/api/v2/img/pat", "https://nekos.life/api/v2/img/cuddle"];
    	    const rcafulc = rcafune[Math.floor(Math.random() * rcafune.length)];
			const cfnean = await axios.get('https://nekos.life/api/v2/img/poke')
			await axios.get(cfnean.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const cfune = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, cfune, { author: config.author, pack: config.pack, keepScale: true })
			})
			break			
			
			
		case 'quack':
			const patu = await axios.get('https://nekos.life/api/v2/img/goose')
			await kill.sendFileFromUrl(from, patu.data.url, '', '', id)
			break
			
			
		case 'poke':
			const pokean = await axios.get('https://nekos.life/api/v2/img/poke')
			await axios.get(pokean.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const teco = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, teco, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
		case 'cocegas':
			const cocegas = await axios.get('https://nekos.life/api/v2/img/tickle')
			await axios.get(cocegas.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const cosqha = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, cosqha, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
		case 'food':
			const feed = await axios.get('https://nekos.life/api/v2/img/tickle')
			await axios.get(feed.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const gfood = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, gfood, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
		case 'baka':
			const baka = await axios.get('https://nekos.life/api/v2/img/baka')
			await axios.get(baka .data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const bakay = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, bakay, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
		case 'lizard':
			const lizard = await axios.get('https://nekos.life/api/v2/img/lizard')
			await kill.sendFileFromUrl(from, lizard.data.url, '', '', id)
			break
			

        case 'google':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			await kill.reply(from, mess.wait(), id)
            await google({ 'query': body.slice(8) }).then(async (results) => {
				let vars = `🔎 「 ${body.slice(8)} 」 🔎\n`
				for (let i = 0; i < results.length; i++) { vars += `\n═════════════════\n→ ${results[i].title}\n\n→ ${results[i].snippet}\n\n→ ${results[i].link}` }
				await kill.reply(from, vars, id)
            }).catch(async () => { await kill.reply(from, mess.gblock(), id) })
            break
			
			
       case 'clima':
       		if (args.length == 0) return await kill.reply(from, mess.noargs() + 'city names/nomes de cidade/nombres de ciudad.', id)
			const clima = await axios.get(`https://pt.wttr.in/${encodeURIComponent(body.slice(7))}?format=Cidade%20=%20%l+\n\nEstado%20=%20%C+%c+\n\nTemperatura%20=%20%t+\n\nUmidade%20=%20%h\n\nVento%20=%20%w\n\nLua agora%20=%20%m\n\nNascer%20do%20Sol%20=%20%S\n\nPor%20do%20Sol%20=%20%s`)
			await kill.sendFileFromUrl(from, `https://wttr.in/${encodeURIComponent(body.slice(7))}.png`, '', mess.wttr(clima), id)
            break
			
			
        case 'boy':
    	    var hite = ["eboy", "garoto", "homem", "men", "garoto oriental", "japanese men", "pretty guy", "homem bonito"];
    	    var hesc = hite[Math.floor(Math.random() * hite.length)];
			var men = "https://api.fdci.se/sosmed/rep.php?gambar=" + hesc;
			await axios.get(men).then(async (result) => {
				var h = JSON.parse(JSON.stringify(result.data))
				var cewek =  h[Math.floor(Math.random() * h.length)]
				if (cewek == null) return await kill.reply(from, mess.noresult(), id)
              	await kill.sendFileFromUrl(from, cewek, "result.jpg", "👨🏻", id)
			})
			break
			
			
		case 'aptoide':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'app name/Nome do App/Nombre de aplicación.', id)
			const aptoide = await axios.get(`http://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(body.slice(9))}&trusted=true`)
			if (aptoide.data.datalist.total == 0) return await kill.reply(from, mess.noresult(), id)
			const getApk = aptoide.data.datalist.list[0]
			const sizeApk = (getApk.size / 1048576).toFixed(1)
			await kill.sendFileFromUrl(from, `${getApk.graphic}`, 'aptoide.png', mess.aptoide(getApk, sizeApk), id)
            break
			
			
        case 'girl':
    	    var items = ["garota adolescente", "saycay", "alina nikitina", "belle delphine", "teen girl", "teen cute", "japanese girl", "garota bonita oriental", "oriental girl", "korean girl", "chinese girl", "teen egirl", "brazilian teen girl", "pretty teen girl", "korean teen girl", "garota adolescente bonita", "menina adolescente bonita", "egirl", "cute girl"];
    	    var cewe = items[Math.floor(Math.random() * items.length)];
			var girl = "https://api.fdci.se/sosmed/rep.php?gambar=" + cewe;
			await axios.get(girl).then(async (result) => {
				var b = JSON.parse(JSON.stringify(result.data));
				var cewek =  b[Math.floor(Math.random() * b.length)];
				if (cewek == null) return await kill.reply(from, mess.noresult(), id)
              	await kill.sendFileFromUrl(from, cewek, "result.jpg", "😍", id)
			})
			break
			
			
        case 'anime':
		    if (args.length == 0) return await kill.reply(from, mess.noargs() + 'anime name/nome do anime/nombre de anime.', id)
			const getAnime = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(body.slice(7))}&limit=1`)
			if (getAnime.data.status == 404 || getAnime.data.results[0] == '') return await kill.sendFileFromUrl(from, errorurl, 'error.png', mess.noresult())
			if (config.lang == 'en') return await kill.sendFileFromUrl(from, `${getAnime.data.results[0].image_url}`, 'anime.jpg', `✔️ - Is that?\n\n✨️ *Title:* ${getAnime.data.results[0].title}\n\n🎆️ *Episode:* ${getAnime.data.results[0].episodes}\n\n💌️ *Rating:* ${getAnime.data.results[0].rated}\n\n❤️ *Note:* ${getAnime.data.results[0].score}\n\n💚️ *Synopsis:* ${getAnime.data.results[0].synopsis}\n\n🌐️ *Link*: ${getAnime.data.results[0].url}`, id)
			await sleep(5000)
			await translate(getAnime.data.results[0].synopsis, config.lang).then(async (syno) => { await kill.sendFileFromUrl(from, `${getAnime.data.results[0].image_url}`, 'anime.jpg', mess.getanime(syno, getAnime), id) })
			break
			
			
        case 'manga':
		    if (args.length == 0) return await kill.reply(from, mess.noargs() + 'manga name/nome do manga/nombre de manga.', id)
			const getManga = await axios.get(`https://api.jikan.moe/v3/search/manga?q=${encodeURIComponent(body.slice(7))}&limit=1`)
			if (getManga.data.status == 404 || getManga.data.results[0] == '') return await kill.sendFileFromUrl(from, errorurl, 'error.png', mess.noresult())
			if (config.lang == 'en') return await kill.sendFileFromUrl(from, `${getManga.data.results[0].image_url}`, 'manga.jpg', `✔️ - Is that?\n\n✨️ *Title:* ${getManga.data.results[0].title}\n\n🎆️ *Chapters:* ${getManga.data.results[0].chapters}\n\n💌️ *Volumes:* ${getManga.data.results[0].volumes}\n\n❤️ *Note:* ${getManga.data.results[0].score}\n\n💚️ *Synopsis:* ${getManga.data.results[0].synopsis}\n\n🌐️ *Link*: ${getManga.data.results[0].url}`, id)
			await sleep(5000)
			await translate(getManga.data.results[0].synopsis, config.lang).then(async (syno) => { await kill.sendFileFromUrl(from, `${getManga.data.results[0].image_url}`, 'manga.jpg', mess.getmanga(syno, getManga), id) })
			break
			
			
        case 'nh':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
			if (args.length == 1) {
				await kill.reply(from, mess.wait(), id)
				const cek = await nhentai.exists(args[0])
				if (cek == true)  {
					const api = new API()
					const pic = await api.getBook(args[0]).then(book => { return api.getImageURL(book.cover) })
					const dojin = await nhentai.getDoujin(args[0])
					const { title, details, link } = dojin
					const { parodies, tags, artists, groups, languages, categories } = await details
					await kill.sendFileFromUrl(from, pic, '', mess.nhentai(title, parodies, tags, artists, groups, languages, categories, link), id)
					await kill.sendFileFromUrl(from, `https://nhder.herokuapp.com/download/nhentai/${args[0]}/zip`, 'hentai.zip', '', id).catch(async () => { await kill.reply(from, 'Fail at download', id) })
				} else return await kill.reply(from, mess.noresult(), id) 
			} else return await kill.reply(from, mess.noargs() + '6 digit/digitos (code/código nhentai) (ex: 215600).', id)
			break
			
			
        case 'profile':;case 'perfil':
            if (isGroupMsg) {
				if (mentionedJidList.length !== 0) menUser = await kill.getContact(mentionedJidList[0])
				var qmid = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? menUser.id : user)
				const peoXp = await getXp(qmid, nivel)
				const myMsg = await getMsg(qmid, msgcount)
				const peoLevel = await getLevel(qmid, nivel)
				const ineedxp = 5 * Math.pow(peoLevel, 2) + 50 * peoLevel + 100
				var pic = await kill.getProfilePicFromServer(qmid)
				var namae = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? menUser.pushname : pushname)
				var sts = await kill.getStatus(qmid)
				var adm = groupAdmins.includes(qmid) ? 'Sim' : 'Não'
				var muted = slce.includes(qmid) ? 'Sim' : 'Não'
				var blocked = blockNumber.includes(qmid) ? 'Sim' : 'Não'
				const { status } = sts
				if (pic == undefined) { var pfp = errorurl } else { var pfp = pic }
				var playerRole = patents.a0
				if (peoLevel <= 4) { playerRole = patents.a1 } else if (peoLevel <= 10) { playerRole = patents.a2 } else if (peoLevel <= 15) { playerRole = patents.a3 } else if (peoLevel <= 20) { playerRole = patents.a4 } else if (peoLevel <= 25) { playerRole = patents.a5 } else if (peoLevel <= 30) { playerRole = patents.a6 } else if (peoLevel <= 35) { playerRole = patents.a7 } else if (peoLevel <= 40) { playerRole = patents.a8 } else if (peoLevel <= 45) { playerRole = patents.a9 } else if (peoLevel <= 50) { playerRole = patents.a10 } else if (peoLevel <= 55) { playerRole = patents.a11 } else if (peoLevel <= 60) { playerRole = patents.a12 } else if (peoLevel <= 65) { playerRole = patents.a13 } else if (peoLevel <= 70) { playerRole = patents.a14 } else if (peoLevel <= 75) { playerRole = patents.a15 } else if (peoLevel <= 80) { playerRole = patents.a16 } else if (peoLevel <= 85) { playerRole = patents.a17 } else if (peoLevel <= 90) { playerRole = patents.a18 } else if (peoLevel <= 95) { playerRole = patents.a19 } else if (peoLevel <= 100) { playerRole = patents.a20 } else if (peoLevel <= 200) { playerRole = patents.a21 } else if (peoLevel <= 300) { playerRole = patents.a22 } else if (peoLevel <= 400) { playerRole = patents.a23 } else if (peoLevel <= 500) { playerRole = patents.a24 } else if (peoLevel <= 550) { playerRole = patents.a25 } else if (peoLevel <= 600) { playerRole = patents.a26 } else if (peoLevel <= 700) { playerRole = patents.a27 } else if (peoLevel <= 800) { playerRole = patents.a28 } else if (peoLevel <= 900) { playerRole = patents.a29 } else if (peoLevel <= 1000 || peoLevel >= 1000) { playerRole = patents.a30 }
				await kill.sendFileFromUrl(from, pfp, 'pfo.jpg', mess.profile(namae, myMsg, adm, muted, blocked, status, peoLevel, peoXp, ineedxp, playerRole))
			} else return await kill.reply(from, mess.sogrupo(), id)
			break
			
			
        case 'brainly':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'perguntas/preguntas/questions.', id)
			const question = body.slice(9)
			if (args.length >= 10) return await kill.reply(from, mess.tenargs(), id)
			var langbl = config.lang
			if (langbl == 'en') langbl = 'us'
			brainly(question, 1, config.lang).then(async (res) => {
				if (res.message == 'Data not found') return await kill.reply(from, mess.noresult(), id)
				await kill.reply(from, mess.brainlyres(res), id)
			})
            break
			
			
		case 'store':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'app name/Nome do App/Nombre de aplicación.', id)
			await kill.reply(from, mess.wait(), id)
			await sleep(5000)
			const stsp = await search(`${body.slice(7)}`)
			if (config.lang == 'en') return await kill.sendFileFromUrl(from, stsp.icon, '', `*Name >* ${stsp.name}\n\n*Link >* ${stsp.url}\n\n*Price >* ${stsp.price}\n\n*Description >* ${stsp.description}\n\n*Rating >* ${stsp.rating}/5\n\n*Developer >* ${stsp.developer.name}\n\n*Others >* ${stsp.developer.url}`, id)
			await sleep(5000)
        	await translate(stsp.description, config.lang).then(async (playst) => { await kill.sendFileFromUrl(from, stsp.icon, '', mess.store(stsp, playst), id) })
			break
			
			
        case 'search':
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
				const tMData = isQuotedImage ? quotedMsg : message
				const mediaData = await decryptMedia(tMData, uaOverride)
                await kill.reply(from, mess.searchanime(), id)
                fetch('https://trace.moe/api/search', { method: 'POST', body: JSON.stringify({ image: `data:${mimetype};base64,${mediaData.toString('base64')}` }), headers: { "Content-Type": "application/json" } }).then(respon => respon.json()).then(async (resolt) => {
                	if (resolt.docs && resolt.docs.length <= 0) { await kill.reply(from, mess.noresult(), id) }
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.90) { teks = '*Not sure/Não tenho certeza/No estoy segura...* :\n\n' }
                    teks += mess.sanimetk(title, title_chinese, title_romaji, title_english, is_adult, episode, similarity)
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    await kill.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(async () => { await kill.reply(from, teks, id) })
                })
            } else return await kill.sendFileFromUrl(from, errorurl, 'error.png', mess.searchanime() + '\n\n' + mess.onlyimg())
            break
			
			
        case 'link':
            if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
            if (isGroupMsg) {
                const inviteLink = await kill.getGroupInviteLink(groupId);
                await kill.sendLinkWithAutoPreview(from, inviteLink, `❤️ - ${name}`)
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
					} else if (obj && /ptt|audio|video|image/.test(obj.type)) { quotedMsgObj = obj } else return
					const mediaData = await decryptMedia(quotedMsgObj)
					await kill.sendFile(ids, `data:${quotedMsgObj.mimetype};base64,${mediaData.toString('base64')}`, '', `Enviado pelo Dono.`)
				}
				let msg = body.slice(12)
				if (args[0] == '-all') {
					for (let ids of chatall) {
						var cvk = await kill.getChatById(ids)
						if (!cvk.isReadOnly) {
							await kill.sendText(ids, `[Transmissão de ${pushname} ]\n\n${msg}`)
							if (quotedMsgObj) { sendQFileC(quotedMsgObj, ids) }
						}
					}
					await kill.reply(from, mess.maked(), id)
				} else if (args[0] == '-gps') {
					for (let ids of isGroupC) {
						var cvk = await kill.getChatById(ids)
						if (!cvk.isReadOnly) {
							await kill.sendText(ids, `[Transmissão de ${pushname} ]\n\n${msg}`)
							if (quotedMsgObj) { sendQFileC(quotedMsgObj, ids) }
						}
					}
					await kill.reply(from, mess.maked(), id)
				} else if (args[0] == '-pvs') {
					for (let ids of isPrivateC) {
						await kill.sendText(ids, `[Transmissão de ${pushname} ]\n\n${msg}`)
						if (quotedMsgObj) { sendQFileC(quotedMsgObj, ids) }
					}
					await kill.reply(from, mess.maked(), id)
				} else return await kill.reply(from, mess.broad(), id)
			} catch (error) {
				await kill.reply(from, mess.noctt(), id)
				console.log(color('[BROADCAST]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
			
        case 'ptt':
            if (quotedMsgObj) {
                let replyOnReply = await kill.getMessageById(quotedMsgObj.id)
                let obj = replyOnReply.quotedMsgObj
                if (/ptt|audio/.test(quotedMsgObj.type)) {
                    if (quotedMsgObj.animated) quotedMsgObj.mimetype = ''
                } else if (obj && /ptt|audio/.test(obj.type)) { quotedMsgObj = obj } else return
                const mediaData = await decryptMedia(quotedMsgObj)
                await kill.sendPtt(from, `data:${quotedMsgObj.mimetype};base64,${mediaData.toString('base64')}`, '', id)
            } else kill.reply(from, mess.onlyaudio(), id)
            break
			
			
        case 'get':
			if (quotedMsgObj) {
				let replyOnReply = await kill.getMessageById(quotedMsgObj.id)
				let obj = replyOnReply.quotedMsgObj
				if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
					if (quotedMsgObj.animated) quotedMsgObj.mimetype = ''
				} else if (obj && /ptt|audio|video|image/.test(obj.type)) { quotedMsgObj = obj } else return
				const mediaData = await decryptMedia(quotedMsgObj)
				await kill.sendFile(from, `data:${quotedMsgObj.mimetype};base64,${mediaData.toString('base64')}`, '', '')
            } else kill.reply(from, mess.onlymidia(), id)
            break


        case 'adms':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            let mimin = ''
            for (let admon of groupAdmins) { mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` }
            await sleep(2000)
            await kill.sendTextWithMentions(from, mimin)
            break
			
			
        case 'groupinfo':;case 'info':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            let admgp = ''
            for (let admon of groupAdmins) {
				var adminsls = await kill.getContact(admon)
				var getAdmsLst = adminsls.pushname
				if (getAdmsLst == null) getAdmsLst = 'wa.me/' + admon.replace(/@c.us/g, '')
				admgp += `➸ ${getAdmsLst}\n`
			}
			var donodeGp = await kill.getContact(chat.groupMetadata.owner)
			var gpOwner = (donodeGp.pushname == undefined) ? `wa.me/${chat.groupMetadata.owner.replace('@c.us', '')}` : donodeGp.pushname
            var welgrp = welkom.includes(groupId) ? 'Sim' : 'Não'
            var fakegp = faki.includes(groupId) ? 'Sim' : 'Não'
            var bklistgp = bklist.includes(groupId) ? 'Sim' : 'Não'
            var xpgp = xp.includes(groupId) ? 'Sim' : 'Não'
            var slcegp = slce.includes(groupId) ? 'Sim' : 'Não'
            var ngrp = nsfw_.includes(groupId) ? 'Sim' : 'Não'
            var autostk = atstk.includes(groupId) ? 'Sim' : 'Não'
            var atpngy = atporn.includes(groupId) ? 'Sim' : 'Não'
            var atlka = atlinks.includes(groupId) ? 'Sim' : 'Não'
            var grouppic = await kill.getProfilePicFromServer(groupId)
            if (grouppic == undefined) { var pfp = errorurl } else { var pfp = grouppic }
            await kill.sendFileFromUrl(from, pfp, 'group.png', mess.groupinfo(groupname, totalMem, welgrp, atpngy, atlka, xpgp, fakegp, bklistgp, slcegp, autostk, ngrp, desc, gpOwner, admgp), id)
			break
			
			
        case 'chefe':
            if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			const guildMaster = chat.groupMetadata.owner
            await kill.sendTextWithMentions(from, `👉 @${guildMaster}`)
            break
			
			
		case 'wame':
			if (quotedMsg) {
				await kill.reply(from, `📞 - https://wa.me/${quotedMsgObj.sender.id.replace('@c.us', '')} - ${quotedMsgObj.sender.id.replace('@c.us', '')}`, id)
			} else if (mentionedJidList.length !== 0) {
				var wame = ''
				for (let i = 0; i < mentionedJidList.length; i++) { wame += `\n📞 - https://wa.me/${mentionedJidList[i].replace('@c.us', '')} - @${mentionedJidList[i].replace('@c.us', '')}` }
				await kill.sendTextWithMentions(from, wame, id)
			} else return await kill.reply(from, `📞 - https://wa.me/${user.replace('@c.us', '')} - ${user.replace('@c.us', '')}`, id)
			break
			
			
		case 'maps':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'city names/nomes de cidade/nombres de ciudad.', id)
			const mapz2 = await axios.get(`https://mnazria.herokuapp.com/api/maps?search=${encodeURIComponent(body.slice(6))}`)
			const { gambar } = mapz2.data
			const pictk = await bent("buffer")(gambar)
			await kill.sendImage(from, `data:image/jpg;base64,${pictk.toString("base64")}`, 'maps.jpg', `*📍 ${body.slice(6)}*`)
			break
			
			
		case 'sip':
			if (args.length !== 1) return await kill.reply(from, mess.noargs() + 'IPV4 (ex: 8.8.8.8).', id)
			const ip = await axios.get(`http://ipwhois.app/json/${encodeURIComponent(body.slice(5))}`)
			if (ip.data.latitude == undefined) return await kill.reply(from, mess.noresult(), id)
			await kill.sendLocation(from, `${ip.data.latitude}`, `${ip.data.longitude}`, '')
			await kill.reply(from, mess.sip(ip), id)
			await kill.reply(from, 'Searching place photo - Buscando foto do local...\nEspere - Wait...\n+20S...', id)
			const browserip = await puppeteer.launch(options)
			const pageip = await browserip.newPage()
			await pageip.goto(`http://www.google.com/maps?layer=c&cbll=${ip.data.latitude},${ip.data.longitude}`, { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
				await sleep(20000)
				await pageip.screenshot({path: `./lib/media/img/${user.replace('@c.us', '')}ip.png`})
				await browserip.close()
			})
			await kill.sendFile(from, `./lib/media/img/${user.replace('@c.us', '')}ip.png`, 'ip.png', 'Maybe here - Talvez aqui! 📍', id)
			setTimeout(() => { fs.unlinkSync(`./lib/media/img/${user.replace('@c.us', '')}ip.png`) }, 30000)
			break
			
			
		case 'scep':
			if (!config.lang == 'pt') return await kill.reply(from, 'Brazil only/Brasil solamente!', id)
			if (args.length !== 1) return await kill.reply(from, mess.noargs() + 'CEP (ex: 03624090).', id)
			const cep = await axios.get(`https://viacep.com.br/ws/${encodeURIComponent(body.slice(6))}/json/`)
			await kill.reply(from, mess.scep(cep), id)
			break
			
			
        case 'everyone':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				let hehe = `═✪〘 🎸 - 🐂 〙✪═\n═✪〘 🖊️ ${body.slice(10)} 〙✪═\n\n`
				for (let i = 0; i < groupMembers.length; i++) { hehe += `- @${groupMembers[i].id.replace(/@c.us/g, '')}\n` }
				hehe += '\n═✪〘 ❤️ - BOT Íris - 📢〙✪═'
				await sleep(2000)
				await kill.sendTextWithMentions(from, hehe)
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'random':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            await kill.sendTextWithMentions(from, `═✪〘 🎸 - 🐂 〙✪═ \n\n @${randomMember.replace(/@c.us/g, '')}\n\n═✪〘 👉 ${body.slice(8)} 〙✪═`)
            await sleep(2000)
            break
			
			
        case 'arquivar':
			if (isGroupMsg) {
				const groupOwner = user === chat.groupMetadata.owner
				if (groupOwner || isOwner) {
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					for (let i = 0; i < groupMembers.length; i++) {
						if (groupAdmins.includes(groupMembers[i].id) || ownerNumber.includes(groupMembers[i].id)) {
							console.log(color('[VIP] - ', 'crimson'), groupMembers[i].id)
						} else { await kill.removeParticipant(groupId, groupMembers[i].id) }
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
            for (let dchat of allChatz) { await kill.clearChat(dchat.id) }
            await kill.reply(from, mess.maked(), id)
            break
			
			
	    case 'add':
            if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            if (!isGroupAdmins) return await kill.reply(from, mess.soademiro(), id)
            if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
	        if (args.length !== 1 && isNaN(args[0])) return await kill.reply(from, mess.usenumber(), id)
			if (groupMembersId.includes(args[0] + '@c.us')) return await kill.reply(from, mess.janogp(), id)
            try {
                await kill.addParticipant(from,`${args[0]}@c.us`)
            } catch (error) { 
				await kill.reply(from, mess.addpessoa(), id)
				console.log(color('[ADICIONAR]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
			
		case '3d':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			const tdtype = ["https://textpro.me/3d-gradient-text-effect-online-free-1002.html", "https://textpro.me/3d-box-text-effect-online-880.html"];
    	    const tdchoice = tdtype[Math.floor(Math.random() * tdtype.length)];
			if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
			await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
			const browsertd = await puppeteer.launch(options)
			const pagetd = await browsertd.newPage()
			await pagetd.goto(tdchoice, { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
				await pagetd.waitForSelector('#text-0')
				await pagetd.type("#text-0", body.slice(4))
				await pagetd.click("#submit")
				await sleep(10000) // Aumente se sua conexão for superr lenta
				await pagetd.waitForSelector('div[class="thumbnail"] > img')
				const divElement = await pagetd.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
				await kill.sendFileFromUrl(from, divElement, '3d.jpg', '', id)
				await browsertd.close()
			})
			break
			
			
		case 'slogan':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
			await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
			const browsersg = await puppeteer.launch(options)
			const pagesg = await browsersg.newPage()
			await pagesg.goto('https://textpro.me/1917-style-text-effect-online-980.html', { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
				await pagesg.waitForSelector('#text-0')
				await pagesg.type("#text-0", body.slice(8))
				await pagesg.click("#submit")
				await sleep(10000) // Aumente se sua conexão for superr lenta
				await pagesg.waitForSelector('div[class="thumbnail"] > img')
				const divElement = await pagesg.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
				await kill.sendFileFromUrl(from, divElement, 'slogan.jpg', '', id)
				await browsersg.close()
			})
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
			const browserth = await puppeteer.launch(options)
			const pageth = await browserth.newPage()
			await pageth.goto("https://textpro.me/thunder-text-effect-online-881.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
				await pageth.waitForSelector('#text-0')
				await pageth.type("#text-0", body.slice(9))
				await pageth.click("#submit")
				await sleep(10000) // Aumente se sua conexão for superr lenta
				await pageth.waitForSelector('div[class="thumbnail"] > img')
				const divElement = await pagelg.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
				await kill.sendFileFromUrl(from, divElement, 'thunder.jpg', '', id)
				await browserth.close()
			})
			break
			
			
		case 'light':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
			await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
			const browserlg = await puppeteer.launch(options)
			const pagelg = await browserlg.newPage()
			await pagelg.goto("https://textpro.me/create-a-futuristic-technology-neon-light-text-effect-1006.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
				await pagelg.waitForSelector('#text-0')
				await pagelg.type("#text-0", body.slice(7))
				await pagelg.click("#submit")
				await sleep(10000) // Aumente se sua conexão for superr lenta
				await pagelg.waitForSelector('div[class="thumbnail"] > img')
				const divElement = await pagelg.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
				await kill.sendFileFromUrl(from, divElement, 'light.jpg', '', id)
				await browserlg.close()
			})
			break
			
			
		case 'wolf':
			if (args.length >= 2 && arks.includes('|')) {
				const wolftype = ["https://textpro.me/create-wolf-logo-black-white-937.html", "https://textpro.me/create-wolf-logo-galaxy-online-936.html"];
				const wolfchoice = wolftype[Math.floor(Math.random() * wolftype.length)];
				const wflogo = arg.split('|')[0]
				const wflogo2 = arg.split('|')[1]
				if (wflogo.length >= 10 || wflogo2.length >= 10) return await kill.reply(from, 'Max: 10 letras/letters p/frase - phrase.', id)
				await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
				const browserwf = await puppeteer.launch(options)
				const pagewf = await browserwf.newPage()
				await pagewf.goto(wolfchoice, { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
					await pagewf.waitForSelector('#text-0')
					await pagewf.type("#text-0", wflogo)
					await pagewf.type("#text-1", wflogo2)
					await pagewf.click("#submit")
					await sleep(10000) // Aumente se sua conexão for superr lenta
					await pagewf.waitForSelector('div[class="thumbnail"] > img')
					const divElement = await pagewf.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
					await kill.sendFileFromUrl(from, divElement, 'wolf.jpg', '', id)
					await browserwf.close()
				})
			} else return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
			break
			
			
		case 'neon':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			if (arks.length >= 16) return await kill.reply(from, 'Max: 10 letras/letters.', id)
			await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
			const browsernn = await puppeteer.launch(options)
			const pagenn = await browsernn.newPage()
			await pagenn.goto("https://textpro.me/create-blackpink-logo-style-online-1001.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
				await pagenn.waitForSelector('#text-0')
				await pagenn.type("#text-0", body.slice(6))
				await pagenn.click("#submit")
				await sleep(10000) // Aumente se sua conexão for superr lenta
				await pagenn.waitForSelector('div[class="thumbnail"] > img')
				const divElement = await pagenn.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
				await kill.sendFileFromUrl(from, divElement, 'neon.jpg', '', id)
				await browsernn.close()
			})
			break
			
			
		case 'retro':
			if (args.length >= 4 && arks.includes('|')) {
				const nnlogo = arg.split('|')[0]
				const nnlogo2 = arg.split('|')[1]
				const nnlogo3 = arg.split('|')[2]
				if (nnlogo.length >= 10 || nnlogo2.length >= 10 || nnlogo3.length >= 10) return await kill.reply(from, 'Max: 10 letras/letters p/frase - phrase.', id)
				await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
				const browserrt = await puppeteer.launch(options)
				const pagert = await browserrt.newPage()
				await pagert.goto("https://textpro.me/80-s-retro-neon-text-effect-online-979.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
					await pagert.waitForSelector('#text-0')
					await pagert.type("#text-0", nnlogo)
					await pagert.type("#text-1", nnlogo2)
					await pagert.type("#text-2", nnlogo3)
					await pagert.click("#submit")
					await sleep(10000) // Aumente se sua conexão for superr lenta
					await pagert.waitForSelector('div[class="thumbnail"] > img')
					const divElement = await pagert.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
					await kill.sendFileFromUrl(from, divElement, 'retro.jpg', '', id)
					await browserrt.close()
				})
			} else return await kill.reply(from,mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 2 "|".', id)
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
			const browser = await puppeteer.launch(options)
			const page = await browser.newPage()
			await page.goto("https://textpro.me/create-blackpink-logo-style-online-1001.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
				await page.waitForSelector('#text-0')
				await page.type("#text-0", body.slice(6))
				await page.click("#submit")
				await sleep(10000) // Aumente se sua conexão for superr lenta
				await page.waitForSelector('div[class="thumbnail"] > img')
				const divElement = await page.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
				await kill.sendFileFromUrl(from, divElement, 'blackpint.jpg', '', id)
				await browser.close()
			})
			break
			
			
		case 'pornhub':
			if (args.length >= 2 && arks.includes('|')) {
				const phlogo = arg.split('|')[0]
				const phlogo2 = arg.split('|')[1]
				if (phlogo.length >= 10 || phlogo2.length >= 10) return await kill.reply(from, 'Max: 10 letras/letters p/frase - phrase.', id)
				await kill.reply(from, mess.wait() + '\n\n20+ s.', id)
				const browserph = await puppeteer.launch(options)
				const pageph = await browserph.newPage()
				await pageph.goto("https://textpro.me/pornhub-style-logo-online-generator-free-977.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
					await pageph.waitForSelector('#text-0')
					await pageph.type("#text-0", phlogo)
					await pageph.type("#text-1", phlogo2)
					await pageph.click("#submit")
					await sleep(10000) // Aumente se sua conexão for superr lenta
					await pageph.waitForSelector('div[class="thumbnail"] > img')
					const divElement = await pageph.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
					await kill.sendFileFromUrl(from, divElement, 'pornhub.jpg', '', id)
					await browserph.close()
				})
			} else return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
			break
			
			
        case 'meme':
            if (isMedia && type === 'image' && args.length >= 2 && arks.includes('|') || isQuotedImage && args.length >= 2 && arks.includes('|')) {
                const top = arg.split('|')[0]
                const bottom = arg.split('|')[1]
                const memeData = isQuotedImage ? quotedMsg : message
                const memeupm = await decryptMedia(memeData, uaOverride)
				const memeUpl = await upload(memeupm, false)
                await kill.sendFileFromUrl(from, `https://api.memegen.link/images/custom/${encodeURIComponent(top)}/${encodeURIComponent(bottom)}.png?background=${memeUpl}`, 'image.png', '', id).catch(async () => { await kill.reply(from, mess.upfail(), id) })
            } else return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
            break
			
			
		case 'unban':;case 'unkick':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
				if (!quotedMsg) return await kill.reply(from, mess.nomark, id) 
				const unbanq = quotedMsgObj.sender.id
				if (groupMembersId.includes(unbanq)) return await kill.reply(from, mess.janogp(), id)
				await kill.sendTextWithMentions(from, mess.unban(unbanq))
				await kill.addParticipant(groupId, unbanq) //.catch(async () => { await kill.reply(from, mess.addpessoa(), id) })
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'kick':;case 'k':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
				if (quotedMsg) {
					const negquo = quotedMsgObj.sender.id
					if (ownerNumber.includes(negquo)) return await kill.reply(from, mess.vip(), id)
					if (groupAdmins.includes(negquo)) return await kill.reply(from, mess.removeradm(), id)
					if (!groupMembersId.includes(negquo)) return await kill.reply(from, mess.notongp(), id)
					await kill.sendTextWithMentions(from, mess.ban(negquo))
					await kill.removeParticipant(groupId, negquo)
				} else {
					if (mentionedJidList.length == 0) return await kill.reply(from, mess.semmarcar(), id)
					await kill.sendTextWithMentions(from, mess.kick(mentionedJidList))
					for (let i = 0; i < mentionedJidList.length; i++) {
						if (ownerNumber.includes(mentionedJidList[i])) return await kill.reply(from, mess.vip(), id)
						if (groupAdmins.includes(mentionedJidList[i])) return await kill.reply(from, mess.removeradm(), id)
						await kill.removeParticipant(groupId, mentionedJidList[i])
					}
				}
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'sair':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				await kill.sendText(from, mess.goodbye()).then(async () => { await kill.leaveGroup(groupId) })
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'promote':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
				if (quotedMsg) {
					const proquo = quotedMsgObj.sender.id
					if (groupAdmins.includes(proquo)) return await kill.reply(from, mess.isadm(), id)
					await kill.sendTextWithMentions(from, mess.promote(proquo))
					await kill.promoteParticipant(groupId, proquo)
				} else {
					if (mentionedJidList.length == 0) return await kill.reply(from, mess.semmarcar(), id)
					await kill.sendTextWithMentions(from, mess.promote(mentionedJidList))
					var isPromo = ''
					for (let i = 0; i < mentionedJidList.length; i++) {
						if (groupAdmins.includes(mentionedJidList[i])) isPromo += `@${mentionedJidList[i].replace('@c.us', '')} `
						await kill.promoteParticipant(groupId, mentionedJidList[i])
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
					await kill.demoteParticipant(groupId, demquo)
				} else {
					if (mentionedJidList.length == 0) return await kill.reply(from, mess.semmarcar(), id)
					await kill.sendTextWithMentions(from, mess.demote(mentionedJidList))
					var isNaM = ''
					for (let i = 0; i < mentionedJidList.length; i++) {
						if (!groupAdmins.includes(mentionedJidList[i])) isNaM += `@${mentionedJidList[i].replace('@c.us', '')} `
						await kill.demoteParticipant(groupId, mentionedJidList[i])
					}
					if (isNaM !== '') {
						isNaM += `\n\n${mess.notadm()}`
						await kill.sendTextWithMentions(from, isNaM, id)
					}
				}
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'ping':
			const rTime = (seconds) => {
				const pad = (s) => { return (s < 10 ? '0' : '') + s }
				var hours = Math.floor(seconds / (60*60)); var minutes = Math.floor(seconds % (60*60) / 60); var seconds = Math.floor(seconds % 60)
				return `${pad(hours)} horas | ${pad(minutes)} minutos | ${pad(seconds)} segundos - HH:MM:SS`
			}
			const osUptime = () => {
				var up_sec = os.uptime(); var up_min = up_sec / 60; var up_hour = up_min / 60; up_sec = Math.floor(up_sec); up_min = Math.floor(up_min); up_hour = Math.floor(up_hour); up_hour = up_hour % 60; up_min = up_min % 60; up_sec = up_sec % 60
				return `${up_hour} horas | ${up_min} minutos | ${up_sec} segundos - HH:MM:SS`
			}
			const ramMemory = () => {
				var allRam = os.totalmem(); var kbRam = allRam/1024; var mbRam = kbRam/1024; var gbRam = mbRam/1024; kbRam = Math.floor(kbRam); mbRam = Math.floor(mbRam); gbRam = Math.floor(gbRam); mbRam = mbRam%1024; kbRam = kbRam%1024; allRam = allRam%1024;
				return `${gbRam}GB | ${mbRam}MB | ${kbRam}KB | ${allRam} Bytes`
			}
			const timeBot = rTime(process.uptime())
            const loadedMsg = await kill.getAmountOfLoadedMessages()
            const chatIds = await kill.getAllChatIds()
            const groups = await kill.getAllGroups()
			const zapVer = await kill.getWAVersion()
			const botBat = await kill.getBatteryLevel()
			const isEnergy = await kill.getIsPlugged()
            await kill.sendText(from, mess.stats(timeBot, osUptime, ramMemory, os, loadedMsg, groups, chatIds, processTime, t, moment, zapVer, botBat, isEnergy))
            break
			
			
        case 'join':
            if (args.length == 0) return await kill.reply(from, mess.nolink(), id)
            const gplk = body.slice(6)
            const tGr = await kill.getAllGroups()
            const isLink = gplk.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await kill.inviteInfo(gplk)
			const memberlmt = check.size
            if (!isLink) return await kill.reply(from, mess.nolink(), id)
            if (tGr.length > config.gpLimit) return await kill.reply(from, mess.cheio(tGr), id)
            if (memberlmt < config.memberReq) return await kill.reply(from, mess.noreq(memberlmt), id)
            if (check.status == 200) {
                await kill.joinGroupViaLink(gplk).then(async () => { await kill.reply(from, mess.maked()) })
            } else return await kill.reply(from, mess.fail(), id)
            break
			
			
        case 'delete':;case 'del':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (!quotedMsg) return await kill.reply(from, mess.mymess(), id)
				if (!quotedMsgObj.fromMe) return await kill.reply(from, mess.mymess(), id)
				await kill.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
			} else if (isGroupMsg) {
				if (!quotedMsgObj.fromMe) return await kill.reply(from, mess.mymess(), id)
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'tela':
            if (!isOwner) return await kill.reply(from, mess.sodono(), id)
            const sesPic = await kill.getSnapshot()
            await kill.sendFile(from, sesPic, 'session.png', 'Neh...', id)
            break
			
			
		case 'placa':
			if (!config.lang == 'pt') return await kill.reply(from, 'Brazil only/Brasil solamente', id)
			if (args.length == 0) return await kill.reply(from, 'Coloque uma placa para puxar.', id)
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			sinesp.search(`${args[0]}`).then(async (dados) => {
				await kill.reply(from, `Placa: ${dados.placa}\n\nSituação: ${dados.situacao}\n\nModelo: ${dados.modelo}\n\nMarca: ${dados.marca}\n\nCor: ${dados.cor}\n\nAno: ${dados.ano}\n\nAno do modelo: ${dados.anoModelo}\n\nEstado: ${dados.uf}\n\nMunicipio: ${dados.municipio}\n\nChassi: ${dados.chassi}.`, id)
			}).catch(async (err) => {
				await kill.reply(from, 'Nenhuma placa encontrada.', id)
				console.log(color('[SINESP]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error} - Você pode ignorar.`, 'gold'))
			})
			break
			
			
		case 'phcom':
			if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
			const phuser = arg.split('|')[0]
			const phcom = arg.split('|')[1]
			await kill.reply(from, mess.wait(), id)
            if (isMedia && type === 'image' || isQuotedImage) {
				const phcoM = isQuotedImage ? quotedMsg : message
				const getphComP = await decryptMedia(phcoM, uaOverride)
				var thephComP = await upload(getphComP, false)
			} else { var thephComP = errorImg }
			const getPhCom = await axios.get(`https://nekobot.xyz/api/imagegen?type=phcomment&image=${thephComP}&text=${encodeURIComponent(phcom)}&username=${encodeURIComponent(phuser)}`)
			await sleep(3000)
			await kill.sendFileFromUrl(from, getPhCom.data.message, 'comment.jpg', 'o.o', id)
			break
			
			
		case 'ytcom':
			if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
			const ytuser = arg.split('|')[0]
			const ytcom = arg.split('|')[1]
			await kill.reply(from, mess.wait(), id)
            if (isMedia && type === 'image' || isQuotedImage) {
				const ytcoM = isQuotedImage ? quotedMsg : message
				const getYtComP = await decryptMedia(ytcoM, uaOverride)
				var theYtComP = await upload(getYtComP, false)
			} else { var theYtComP = errorImg }
			await kill.sendFileFromUrl(from, `https://some-random-api.ml/canvas/youtube-comment?avatar=${theYtComP}&comment=${encodeURIComponent(ytcom)}&username=${encodeURIComponent(ytuser)}`, 'comment.jpg', 'o.o', id)
			break
			
			
        case 'enviar':
            if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
			const gid = isGroupMsg ? groupId.replace('@g.us', '') : user.replace('@c.us', '')
			const nofsender = isGroupMsg ? name : pushname
			const gporpv = isGroupMsg ? '-gp' : '-pv'
			try {
				const sendAFile = async (quotedMsgObj, args, type, nofsender) => {
					let replyOnReply = await kill.getMessageById(quotedMsgObj.id)
					let obj = replyOnReply.quotedMsgObj
					if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
						if (quotedMsgObj.animated) quotedMsgObj.mimetype = ''
					} else if (obj && /ptt|audio|video|image/.test(obj.type)) { quotedMsgObj = obj } else return
					const mediaData = await decryptMedia(quotedMsgObj)
					await kill.sendFile(`${args[1]}` + type, `data:${quotedMsgObj.mimetype};base64,${mediaData.toString('base64')}`, '', `De/From ${nofsender}`)
				}
				if (args[0] == '-gp') {
					await kill.sendText(`${args[1]}` + '@g.us', `_Mensagem >_\n"${arg.split('|')[1]} "` + '\n\n_Quem enviou =_ ' + '\n*"' + nofsender + '"*' + '\n\n_Como responder:_')
					await kill.sendText(`${args[1]}` + '@g.us', `${prefix}enviar ${gporpv} ${gid} | Coloque sua resposta aqui`)
					await kill.reply(from, mess.maked(), id)
					if (quotedMsgObj) { sendAFile(quotedMsgObj, args, '@g.us', nofsender) }
				} else if (args[0] == '-pv') {
					await kill.sendText(`${args[1]}` + '@c.us', `_Mensagem >_\n"${arg.split('|')[1]}"` + '\n\n_Quem enviou =_ ' + '*' + nofsender + '*' + '\n\n_Como responder:_')
					await kill.sendText(`${args[1]}` + '@c.us', `${prefix}enviar ${gporpv} ${gid} | Coloque sua resposta aqui`)
					await kill.reply(from, mess.maked(), id)
					if (quotedMsgObj) { sendAFile(quotedMsgObj, args, '@c.us', nofsender) }
				} else return await kill.reply(from, mess.enviar(), id)
			} catch (error) {
				await kill.reply(from, mess.noctt(), id)
				console.log(color('[ENVIAR]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
        case 'blocklist':
            if (!isOwner) return await kill.reply(from, mess.sodono(), id)
            let hih = `🔐 - Block: ${blockNumber.length}\n\n`
            for (let i of blockNumber) { hih += `➸ @${i.replace(/@c.us/g,'')}\n` }
            await kill.sendTextWithMentions(from, hih)
            break
			
			
        case 'shutdown':;case 'encerrar':
            if (!isOwner) return await kill.reply(from, mess.sodono(), id)
			var timeToShut = 10 * 1000
			var timeForTxT = 10
			if (args.length !== 0) timeToShut = Number(args[0]) * 1000; timeForTxT = args[0]
			await kill.reply(from, mess.shutdown(timeForTxT), id)
		    await sleep(timeToShut)
			await kill.kill()
            break
			
			
        case 'loli':
			const onefive = Math.floor(Math.random() * 145) + 1
			await kill.sendFileFromUrl(from, `https://media.publit.io/file/Twintails/${onefive}.jpg`, 'loli.jpg', mess.logomgs(), id)
            break
			
			
        case 'hug':
    	    const ahug = ["https://api.computerfreaker.cf/v1/hug", "https://nekos.life/api/v2/img/hug"];
    	    const bhug = ahug[Math.floor(Math.random() * ahug.length)];
            const chug = await axios.get(bhug);
			await axios.get(chug.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const hugsz = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, hugsz, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
        case 'antiporn':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					if (atporn.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					atporn.push(groupId)
					await fs.writeFileSync('./lib/config/Grupos/antiporn.json', JSON.stringify(atporn))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!atporn.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					atporn.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Grupos/antiporn.json', JSON.stringify(atporn))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'antilinks':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					if (atlinks.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					atlinks.push(groupId)
					await fs.writeFileSync('./lib/config/Grupos/antilinks.json', JSON.stringify(atlinks))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!atlinks.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					atlinks.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Grupos/antilinks.json', JSON.stringify(atlinks))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'baguette':
            const baguette = await axios.get('https://api.computerfreaker.cf/v1/baguette')
            await kill.sendFileFromUrl(from, `${baguette.data.url}`, `baguette.jpg`, '🥖', id)
            break
			
			
        case 'dva':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
            const dva = await axios.get('https://api.computerfreaker.cf/v1/dva')
            await kill.sendFileFromUrl(from, `${dva.data.url}`, `dva.jpg`, `😍`, id)
            break
			
			
        case 'waifu':
            if (side == 1) {
				const waifu = await fs.readFileSync('./lib/config/Utilidades/waifu.json')
				const waifuParse = JSON.parse(waifu)
				const waifuChoice = Math.floor(Math.random() * waifuParse.length)
				const getWaifu = waifuParse[waifuChoice]
				await kill.sendFileFromUrl(from, getWaifu.image, 'waifu.jpg', getWaifu.desc, id)
            } else if (side == 2) {
				const waifu3 = await axios.get(`https://waifu.pics/api/sfw/waifu`)
				await kill.sendFileFromUrl(from, waifu3.data.url, '', 'hmmm...', id)
			}
            break
			
			
        case 'husb':
			const husb = await fs.readFileSync('./lib/config/Utilidades/husb.json')
			const husbParse = JSON.parse(husb)
			const husbChoice = Math.floor(Math.random() * husbParse.length)
			const getHusb = husbParse[husbChoice]
			await kill.sendFileFromUrl(from, getHusb.image, 'husb.jpg', getHusb.desc, id)
            break
			
			
        case 'iecchi':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const recchi = ["https://nekos.life/api/v2/img/ero", "https://nekos.life/api/v2/img/erokemo", "https://nekos.life/api/v2/img/erok"];
    	    const recchic = recchi[Math.floor(Math.random() * recchi.length)];
			const ecchi = await axios.get(recchic)
			await kill.sendFileFromUrl(from, ecchi.data.url, id)
			break
			
			
        case 'tits':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rtits = ["https://meme-api.herokuapp.com/gimme/tits", "https://meme-api.herokuapp.com/gimme/BestTits", "https://meme-api.herokuapp.com/gimme/boobs", "https://meme-api.herokuapp.com/gimme/BiggerThanYouThought", "https://meme-api.herokuapp.com/gimme/smallboobs", "https://meme-api.herokuapp.com/gimme/TinyTits", "https://meme-api.herokuapp.com/gimme/SmallTitsHugeLoad", "https://meme-api.herokuapp.com/gimme/amazingtits"];
    	    const rtitsc = rtits[Math.floor(Math.random() * rtits.length)];
			const tits = await axios.get(rtitsc)
			await kill.sendFileFromUrl(from, `${tits.data.url}`, '', `${tits.data.title}`, id)
            break
			
			
	    case 'milf':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rmilf = ["https://meme-api.herokuapp.com/gimme/Bbwmilf", "https://meme-api.herokuapp.com/gimme/milf"];
    	    const rmilfc = rmilf[Math.floor(Math.random() * rmilf.length)];
            const milf1 = await axios.get(rmilfc);
            await kill.sendFileFromUrl(from, `${milf1.data.url}`, '', `${milf1.data.title}`, id)
			break
			
			
        case 'bdsm':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rbdsm = ["https://meme-api.herokuapp.com/gimme/BDSMPics", "https://meme-api.herokuapp.com/gimme/bdsm", "https://meme-api.herokuapp.com/gimme/TeenBDSM"];
    	    const rbdsmc = rbdsm[Math.floor(Math.random() * rbdsm.length)];
            const bdsm1 = await axios.get(rbdsmc);
            await kill.sendFileFromUrl(from, `${bdsm1.data.url}`, '', `${bdsm1.data.title}`, id)
			break
			
			
        case 'ass':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rass = ["https://meme-api.herokuapp.com/gimme/CuteLittleButts", "https://meme-api.herokuapp.com/gimme/ass", "https://meme-api.herokuapp.com/gimme/bigasses"];
    	    const rassc = rass[Math.floor(Math.random() * rass.length)];
            const bowass = await axios.get(rassc);
            await kill.sendFileFromUrl(from, `${bowass.data.url}`, '', `${bowass.data.title}`, id)
            break		
			
			
        case 'pussy':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rpussy = ["https://meme-api.herokuapp.com/gimme/pussy", "https://meme-api.herokuapp.com/gimme/ass", "https://meme-api.herokuapp.com/gimme/LegalTeens"];
    	    const rpussyc = rpussy[Math.floor(Math.random() * rpussy.length)];
            const bows1 = await axios.get(rpussyc)
            await kill.sendFileFromUrl(from, `${bows1.data.url}`, '', `${bows1.data.title}`, id)
            break
			
			
        case 'blowjob':;case 'boquete':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rblowj = ["https://nekos.life/api/v2/img/bj", "https://nekos.life/api/v2/img/blowjob"];
    	    const rblowjc = rblowj[Math.floor(Math.random() * rblowj.length)];
			const blowjob = await axios.get(rblowjc)
			await axios.get(blowjob.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const bjanime = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, bjanime, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
        case 'feet':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rfeet = ["https://nekos.life/api/v2/img/feetg", "https://nekos.life/api/v2/img/erofeet"];
    	    const rfeetc = rfeet[Math.floor(Math.random() * rfeet.length)];
			const feet = await axios.get(rfeetc)
			await axios.get(feet.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const pezinime = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, pezinime, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
        case 'hard':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
			const hard = await axios.get('https://nekos.life/api/v2/img/spank')
			await axios.get(hard.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const spank = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, spank, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
        case 'boobs':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rboobs = ["https://nekos.life/api/v2/img/boobs", "https://nekos.life/api/v2/img/tits"];
    	    const rboobsc = rboobs[Math.floor(Math.random() * rboobs.length)];
			const bobis = await axios.get(rboobsc)
			await axios.get(bobis.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const tetbobs = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, tetbobs, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
        case 'lick':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rlick = ["https://nekos.life/api/v2/img/kuni", "https://nekos.life/api/v2/img/les"];
    	    const rlickc = rlick[Math.floor(Math.random() * rlick.length)];
			const lick = await axios.get(rlickc)
			await axios.get(lick.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const lingani = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, lingani, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
        case 'femdom':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rfemdon = ["https://nekos.life/api/v2/img/femdom", "https://nekos.life/api/v2/img/yuri", "https://nekos.life/api/v2/img/eroyuri"];
    	    const rfemdonc = rfemdon[Math.floor(Math.random() * rfemdon.length)];
			const femdom = await axios.get(rfemdonc)
			await kill.sendFileFromUrl(from, femdom.data.url, '', '', id)
			break
			
			
        case 'futanari':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
			const futanari = await axios.get('https://nekos.life/api/v2/img/futanari')
			await kill.sendFileFromUrl(from, futanari.data.url, '', '', id)
			break
			
			
        case 'masturb':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rmastub = ["https://nekos.life/api/v2/img/solo", "https://nekos.life/api/v2/img/solog"];
    	    const rmastubc = rmastub[Math.floor(Math.random() * rmastub.length)];
			const mstbra = await axios.get(rmastubc)
			await axios.get(mstbra.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const twodedo = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, twodedo, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
        case 'anal':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const ranal = ["https://nekos.life/api/v2/img/cum", "https://nekos.life/api/v2/img/cum_jpg"];
    	    const ranalc = ranal[Math.floor(Math.random() * ranal.length)];
			const solog = await axios.get(ranalc)
			await axios.get(solog.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const anlnime = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, anlnime, { author: config.author, pack: config.pack, keepScale: true })
			})
			break        
			
			
		case 'randomloli':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
			const loliz = await axios.get('https://nekos.life/api/v2/img/keta')
			await kill.sendImageAsSticker(from, loliz.data.url, { author: config.author, pack: config.pack, keepScale: true })
			break
			
			
        case 'nsfwicon':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
			const icon = await axios.get('https://nekos.life/api/v2/img/nsfw_avatar')
			await kill.sendImageAsSticker(from, icon.data.url, { author: config.author, pack: config.pack, keepScale: true })
			break
			
			
		case 'truth':
			const memean = await axios.get('https://nekos.life/api/v2/img/gecg')
			await kill.sendFileFromUrl(from, memean.data.url, '', '', id)
			break
			
			
		case 'icon':
			const avatarz = await axios.get('https://nekos.life/api/v2/img/avatar')
			await kill.sendImageAsSticker(from, avatarz.data.url, { author: config.author, pack: config.pack, keepScale: true })
			break
			
			
		case 'face':
			const gasm = await axios.get('https://nekos.life/api/v2/img/gasm')
			await kill.sendImageAsSticker(from, gasm.data.url, { author: config.author, pack: config.pack, keepScale: true })
			break
			
			
		case 'pezinho':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
			const pezin = await axios.get('https://nekos.life/api/v2/img/feet')
			await kill.sendFileFromUrl(from, pezin.data.url, '', '', id)
			break
			
			
		case 'corno':
			const getChifre = await fs.readFileSync('./lib/config/Utilidades/corno.txt').toString().split('\n')
			const howGado = getChifre[Math.floor(Math.random() * getChifre.length)]
			const howCorno = getChifre[Math.floor(Math.random() * getChifre.length)]
			if (mentionedJidList.length !== 0) {
				await kill.sendTextWithMentions(from, `${arqs[1]} é ${lvpc}%...\n\n"${howGado}"\n\nE nas horas vagas ${lvrq}%...\n\n"${howCorno}" 😳.`)
			} else { await kill.reply(from, `Você é ${lvpc}%...\n\n"${howGado}"\n\nE nas horas vagas ${lvrq}%...\n\n"${howCorno}" 😳.`, id) }
			break
			
			
		case 'gamemode':
			if (args.length == 0) return await kill.reply(from, mess.cors(), id)
			if (args[0] == '0' || args[0] == 's' || args[0] == 'survival') {
				await kill.sendTextWithMentions(from, mess.mine(user) + 'survival.')
			} else if (args[0] == '1' || args[0] == 'c' || args[0] == 'creative') {
				await kill.sendTextWithMentions(from, mess.mine(user) + 'creative.')
			} else if (args[0] == '2' || args[0] == 'a' || args[0] == 'adventure') {
				await kill.sendTextWithMentions(from, mess.mine(user) + 'adventure.')
			} else if (args[0] == '3' || args[0] == 'spectator') {
				await kill.sendTextWithMentions(from, mess.mine(user) + 'espectador.')
			} else return await kill.reply(from, mess.cors(), id)
            break
			
			
        case 'ihentai':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const hntai = ["https://nekos.life/api/v2/img/hentai", "https://nekos.life/api/v2/img/pussy", "https://nekos.life/api/v2/img/pussy_jpg", "https://nekos.life/api/v2/img/classic", "https://api.computerfreaker.cf/v1/hentai"];
    	    const hentcc = hntai[Math.floor(Math.random() * hntai.length)];
			const hentai1 = await axios.get(hentcc)
			await axios.get(hentai1.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const hntimg = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, hntimg, { author: config.author, pack: config.pack, keepScale: true })
			})
            break
			
			
        case 'yuri':
            const yuri = await axios.get('https://api.computerfreaker.cf/v1/yuri')
            await kill.sendFileFromUrl(from, `${yuri.data.url}`, ``, ``, id)
            break 
			
			
        case 'randomneko':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rnekoi = ["https://nekos.life/api/v2/img/nsfw_neko_gif", "https://nekos.life/api/v2/img/hololewd", "https://nekos.life/api/v2/img/lewdk", "https://nekos.life/api/v2/img/lewdkemo", "https://nekos.life/api/v2/img/eron", "https://nekos.life/api/v2/img/holoero", "https://api.computerfreaker.cf/v1/nsfwneko"];
    	    const rnekoc = rnekoi[Math.floor(Math.random() * rnekoi.length)];
			const nekons = await axios.get(rnekoc)
			await axios.get(nekons.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const gatadlc = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, gatadlc, { author: config.author, pack: config.pack, keepScale: true })
			})
            break
			
			
        case 'trap':
			if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
    	    const rtrap = ["https://nekos.life/api/v2/img/trap", "https://api.computerfreaker.cf/v1/trap"];
    	    const rtrapc = rtrap[Math.floor(Math.random() * rtrap.length)];
			const tapr = await axios.get(rtrapc)
			await kill.sendFileFromUrl(from, tapr.data.url, '', '', id)
            break
			
			
        case 'randomwall' :
            const walnime = await axios.get('https://nekos.life/api/v2/img/wallpaper')
            await kill.sendFileFromUrl(from, walnime.data.url, '', '', id)
            break
			
			
		case 'valor':
			if (args.length !== 2) return await kill.reply(from, mess.moneyerr(), id)
			const money = await axios.get(`https://${encodeURIComponent(args[0])}.rate.sx/${encodeURIComponent(args[1])}`)
			const chkmy = money.data
			if (isNaN(chkmy)) return await kill.reply(from, mess.moneyerr(), id)
			await kill.reply(from, `*${args[1]}* → *${money.data.toFixed(2)}* ${args[0]}`, id)
			break
			
			
        case 'dog':
		    if (side == 1) {
				const list = await axios.get('http://shibe.online/api/shibes')
				const doguin = list.data[0]
				await kill.sendFileFromUrl(from, doguin, '', '🐕', id)
			} else if (side == 2) {
				const doug = await axios.get('https://nekos.life/api/v2/img/woof')
				await kill.sendFileFromUrl(from, doug.data.url, '', '🐕', id)
			}
            break
			
			
        case 'look' :
            const smug = await axios.get('https://nekos.life/api/v2/img/smug')
			await axios.get(smug.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const piscaeye = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, piscaeye, { author: config.author, pack: config.pack, keepScale: true })
			})
            break
			
			
        case 'holo' :
            const holo = await axios.get('https://nekos.life/api/v2/img/holo')
            await kill.sendFileFromUrl(from, holo.data.url, '', '', id)
            break
			
			
		case 'kisu':
			const kisu = await axios.get('https://nekos.life/api/v2/img/kiss')
			await axios.get(kisu.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const beijaod = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, beijaod, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
		case 'tapa':
			const tapi = await axios.get('https://nekos.life/api/v2/img/slap')
			await axios.get(tapi.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
				const tapasso = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, tapasso, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
        case 'gato':;case 'cat':
			if (args.length !== 2 || isNaN(args[0]) || isNaN(args[1])) {
				const catu = await axios.get('https://nekos.life/api/v2/img/meow')
				await kill.sendFileFromUrl(from, catu.data.url, 'gato.jpg', mess.cats(), id)
			} else { await kill.sendFileFromUrl(from, `https://placekitten.com/${args[0]}/${args[1]}`, 'neko.png', 'Nekooo', id) }
            break
			
			
        case 'pokemon':
            pokem = Math.floor(Math.random() * 898) + 1;
            await kill.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + pokem + '.png', 'Pokemon.png', '', id)
            break		
			
			
        case 'screenshot':
            if (args.length == 0 || !isUrl(url)) return await kill.reply(from, mess.nolink(), id)
			await kill.sendFileFromUrl(from, `https://api.apiflash.com/v1/urltoimage?access_key=${config.apifla}&url=${url}`, 'ss.jpeg', mess.noporn(), id)
            break
			
			
		case 'ship':
			if (isGroupMsg && args.length == 2 && mentionedJidList.length !== 0) { 
				await kill.sendTextWithMentions(from, mess.love(arqs, lvpc))
			} else if (args.length == 1) {
				await kill.reply(from, mess.lovepv(arqs, lvpc))
			} else return await kill.reply(from, mess.nocrush(), id)
			break	
			
		// se quiser por mais pra zoar, abra o arquivo lgbt e adicione 1 por linha
        case 'gay':;case 'lgbt':
			var twgui = lgbt[Math.floor(Math.random() * lgbt.length)]
			try {
				await kill.reply(from, mess.wait(), id)
				if (isMedia && type === 'image' || isQuotedImage) {
					const ALgBTt = isQuotedImage ? quotedMsg : message
					const getLgBtPic = await decryptMedia(ALgBTt, uaOverride)
					var theLgBtic = await upload(getLgBtPic, false)
				} else { var theLgBtic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(user)) }
				if (theLgBtic === undefined) theLgBtic = errorImg
				canvas.Canvas.rainbow(theLgBtic).then(async (buffer) => { await kill.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `gay.png`, mess.lgbt(lvpc, guei, lvrq, twgui), id) })
			} catch (error) {
				console.log(color('[GAY]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				await kill.reply(from, mess.fail(), id)
			}
			break
			
			
		case 'chance':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			await kill.reply(from, mess.botmonkey(body, lvpc), id)
			break
			
			
		case 'kiss':
			if (isGroupMsg && args.length == 1 && mentionedJidList.length !== 0) {
				const kiss = await axios.get('https://nekos.life/api/v2/img/kiss')
				await axios.get(kiss.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
					const kissup = Buffer.from(response.data, 'binary').toString('base64')
					await kill.sendImageAsSticker(from, kissup, { author: config.author, pack: config.pack, keepScale: true })
				})
				await kill.sendTextWithMentions(from, mess.kiss(user, arqs))
			} else if (isGroupMsg) {
				await kill.reply(from, mess.semmarcar(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
			break
			
			
        case 'slap':
			if (isGroupMsg && args.length == 1 && mentionedJidList.length !== 0) {
				const tapa = await axios.get('https://nekos.life/api/v2/img/slap')
				await axios.get(tapa.data.url, { responseType: 'arraybuffer' }).then(async (response) => {
					const tapaol = Buffer.from(response.data, 'binary').toString('base64')
					await kill.sendImageAsSticker(from, tapaol, { author: config.author, pack: config.pack, keepScale: true })
				})
				await kill.sendTextWithMentions(from, mess.tapa(user, arqs))
			} else if (isGroupMsg) {
				await kill.reply(from, mess.semmarcar(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'getmeme':
			var thememer = ''
			if (config.lang == 'pt') thememer = 'https://meme-api.herokuapp.com/gimme/memesbrasil'
			if (config.lang == 'en') thememer = 'https://meme-api.herokuapp.com/gimme/memes'
			if (config.lang == 'es') thememer = 'https://meme-api.herokuapp.com/gimme/SpanishMeme'
            const response = await axios.get(thememer);
            await kill.sendFileFromUrl(from, `${response.data.url}`, 'meme.jpg', `${response.data.title}`, id)
            break
			
			
        case 'date':;case 'data':
			await kill.reply(from, `${time}`, id)
			break
			
			
        case 'menu':
			const theMsg = await getMsg(user, msgcount)
			const uzrXp = await getXp(user, nivel)
			const uzrlvl = await getLevel(user, nivel)
			const uneedxp = 5 * Math.pow(uzrlvl, 2) + 50 * uzrlvl + 100
			const mping = processTime(t, moment())
			await kill.sendText(from, mess.menu(pushname, time, theMsg, uzrXp, uneedxp, uzrlvl, mping, patente))
            break
			
			
		case 'stickers':
			await kill.sendText(from, mess.stickers())
			break
			
			
		case 'otaku':
			await kill.sendText(from, mess.anime())
			break
			
			
		case 'games':
			await kill.sendText(from, mess.games())
			break
			
			
        case 'admins':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            if (!isGroupAdmins && !isOwner) return await kill.reply(from, mess.soademiro(), id)
            await kill.sendText(from, mess.admins())
            break
			
			
        case 'adult':
            if (isGroupMsg && !isNsfw) return await kill.reply(from, mess.gpadulto(), id)
            await kill.sendText(from, mess.adult())
            break
			
			
        case 'dono':
            if (!isOwner) return await kill.reply(from, mess.sodono(), id)
            await kill.sendText(from, mess.owner())
            break
			
			
        case 'down':
            await kill.sendText(from, mess.down())
            break
			
			
        case 'dados':
            await kill.sendText(from, mess.dados())
            break
			
			
        case 'midia':
            await kill.sendText(from, mess.midia())
            break
			
			
        case 'outros':
            await kill.sendText(from, mess.outros())
            break
			
			
        case 'maker':
            await kill.sendText(from, mess.maker())
            break
			
		// LEMBRE-SE, REMOVER CRÈDITO È CRIME E PROIBIDO!
        case 'termos':
			await kill.sendFile(from, './lib/media/img/licenca.png', 'licenca.png', mess.tos(), id)
			await kill.sendPtt(from, `./lib/media/audio/termos.mp3`, id)
			await kill.reply(from, mess.everhost(), id)
            break
		// NÃO REMOVA ESSA PARTE!
			
		case 'cmd':
			if (!isOwner) return await kill.reply(from, mess.sodono(), id)
			await kill.reply(from, mess.cmd(), id)
			const cmdw = await exec(`bash -c '${body.slice(5)}'`, async (error, stdout, stderr) => {
				if (error || stderr || stdout == null || stdout == '') {
					console.log(stderr, error)
					await kill.reply(from, error + '\n\n' + stderr, id)
				} else {
					console.log(stdout)
					await kill.reply(from, stdout, id)
				}
			})
			break
			
			
		case 'mac':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'mac (ex: 70:B3:D5:03:62:A1).', id)
			await kill.reply(from, mess.wait(), id)
			await sleep(3000)
			const maclk = await axios.get(`https://api.macvendors.com/${encodeURIComponent(body.slice(5))}`)
			await kill.reply(from, `📱 → ${maclk.data}.`, id)
			break
			
			
		case 'converter':;case 'conv':
			if (args == 0) return await kill.reply(from, mess.conv(), id)
			try {
				if (args[0] == '-f') {
					if (isNaN(args[1])) return await kill.reply(from, mess.onlynumber(), id)
					const cels = args[1] / 5 * 9 + 32
					await kill.reply(from, `*${args[1]}* _C° - Celsius =_ ${cels} _F° - Fahrenheit._`, id)
				} else if (args[0] == '-c') {
					if (isNaN(args[1])) return await kill.reply(from, mess.onlynumber(), id)
					const fahf = 5 * (args[1] - 32) / 9
					await kill.reply(from, `*${args[1]}* _F° - Fahrenheit =_ *${fahf}* _C° - Celsius._`, id)
				} else if (args[0] == '-m') {
					if (isNaN(args[1])) return await kill.reply(from, mess.onlynumber(), id)
					const ktom = args[1] * 0.62137
					await kill.reply(from, `*${args[1]}* _KM =_ *${ktom}* _MI._`, id)
				} else if (args[0] == '-q') {
					if (isNaN(args[1])) return await kill.reply(from, mess.onlynumber(), id)
					const mtok = args[1] / 0.62137
					await kill.reply(from, `*${args[1]}* _MI =_ *${mtok}* _KM._`, id)
				} else return await kill.reply(from, mess.conv(), id)
			} catch (error) { 
				await kill.reply(from, mess.onlynumber(), id)
				console.log(color('[CONVERSOR]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
        case 'mute':;case 'silence':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					if (slce.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					slce.push(groupId)
					await fs.writeFileSync('./lib/config/Bot/silence.json', JSON.stringify(slce))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!slce.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					slce.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Bot/silence.json', JSON.stringify(slce))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
            } else return await kill.reply(from, mess.soademiro(), id)
            break
			
			
		case 'scnpj':
			if (!config.lang == 'pt') return await kill.reply(from, 'Brazil only/Brasil solamente!', id)
			if (args.length == 1) {
				const cnpj = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${encodeURIComponent(body.slice(7))}`)
				if (cnpj.data.status == 'ERROR') return await kill.reply(from, cnpj.data.message, id)
				await kill.reply(from, `✪ CNPJ: ${cnpj.data.cnpj}\n\n✪ Tipo: ${cnpj.data.tipo}\n\n✪ Nome: ${cnpj.data.nome}\n\n✪ Região: ${cnpj.data.uf}\n\n✪ Telefone: ${cnpj.data.telefone}\n\n✪ Situação: ${cnpj.data.situacao}\n\n✪ Bairro: ${cnpj.data.bairro}\n\n✪ Logradouro: ${cnpj.data.logradouro}\n\n✪ CEP: ${cnpj.data.cep}\n\n✪ Casa N°: ${cnpj.data.numero}\n\n✪ Municipio: ${cnpj.data.municipio}\n\n✪ Abertura: ${cnpj.data.abertura}\n\n✪ Fantasia: ${cnpj.data.fantasia}\n\n✪ Jurisdição: ${cnpj.data.natureza_juridica}`, id)
            } else return await kill.reply(from, 'Especifique um CNPJ sem os traços e pontos.', id)
			break
			
			
		case 'coins':
			await kill.sendText(from, mess.coins())
			break
			
			
        case 'mutepv':
			if (args.length == 0) return await kill.reply(from, mess.kldica2(), id)
            if (isOwner) {
				if (args[0] == 'on') {
					const pvmt = body.slice(11) + '@c.us'
					if (slce.includes(pvmt)) return await kill.reply(from, mess.jadisabled(), id)
					slce.push(pvmt)
					await fs.writeFileSync('./lib/config/Bot/silence.json', JSON.stringify(slce))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					const pvmt = body.slice(11) + '@c.us'
					if (!slce.includes(pvmt)) return await kill.reply(from, mess.jadisabled(), id)
					slce.splice(pvmt, 1)
					await fs.writeFileSync('./lib/config/Bot/silence.json', JSON.stringify(slce))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica2(), id)
			} else return await kill.reply(from, mess.sodono())
			break
			
			
        case 'autosticker':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					if (atstk.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					atstk.push(groupId)
					await fs.writeFileSync('./lib/config/Grupos/sticker.json', JSON.stringify(atstk))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!atstk.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					atstk.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Grupos/sticker.json', JSON.stringify(atstk))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
			} else if (isGroupMsg) {
				await kill.reply(from, mess.soademiro(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
		case 'unblock':
			if (isOwner) {
				if (isGroupMsg && quotedMsg || isGroupMsg && mentionedJidList.length !== 0 ) {
					const unblokea = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : args[0] + '@c.us')
					await kill.contactUnblock(`${unblokea}`).then(async () => { await kill.sendTextWithMentions(from, mess.unblock(unblokea)) })
				} else return await kill.reply(from, mess.semmarcar(), id)
			} else return await kill.reply(from, mess.sodono(), id)
			break
			
			
		case 'block':
			if (isOwner) {
				if (isGroupMsg && quotedMsg || isGroupMsg && mentionedJidList.length !== 0 ) {
					const blokea = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : args[0] + '@c.us')
					await kill.contactBlock(`${blokea}`).then(async () => { await kill.sendTextWithMentions(from, mess.block(blokea)) })
				} else return await kill.reply(from, mess.semmarcar(), id)
			} else return await kill.reply(from, mess.sodono(), id)
			break
			
			
		case 'allid':;case 'grupos':
			const gpids = await kill.getAllGroups()
			let idmsgp = ''
			for (let ids of gpids) { idmsgp += `➸ ${ids.contact.name} =\n${ids.contact.id.replace(/@g.us/g,'')}\n\n` }
			await kill.reply(from, idmsgp, id)
			break
			
			
		case 'help':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'motivo/razon/reason.', id)
			const hpgp = isGroupMsg ? groupId.replace('@g.us', '') : user.replace('@c.us', '')
			const nopvne = isGroupMsg ? name : pushname
			const isgorp = isGroupMsg ? '-gp' : '-pv'
			await kill.sendText(ownerNumber[0], mess.advise(nopvne, isgorp, user, body, hpgp))
			await kill.reply(from, mess.thanks(), id)
			break
			
			
        case 'rank':
            if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					if (xp.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					xp.push(groupId)
					await fs.writeFileSync('./lib/config/Grupos/xp.json', JSON.stringify(xp))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!xp.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					xp.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Grupos/xp.json', JSON.stringify(xp))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
            } else return await kill.reply(from, mess.soademiro(), id)
            break
			
			
        case 'level':
            if (!isxp) return await kill.reply(from, mess.needxpon(), id)
			if (mentionedJidList.length !== 0) lvlusrph = await kill.getContact(mentionedJidList[0])
			var yourName = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? lvlusrph.pushname : pushname)
			var wdfWho = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : user)
            const userLevel = await getLevel(wdfWho, nivel)
            const userXp = await getXp(wdfWho, nivel)
            const ppLink = await kill.getProfilePicFromServer(wdfWho)
            if (ppLink === undefined) { var pepe = errorImg } else { pepe = ppLink }
            const requiredXp = 5 * Math.pow(userLevel, 2) + 50 * userLevel + 100
            const ranq = new canvas.Rank().setAvatar(pepe)
			.setLevel(userLevel)
			.setLevelColor('#ffa200', '#ffa200')
			.setRank(Number(getRank(wdfWho, nivel)))
			.setCurrentXP(userXp)
			.setOverlay('#000000', 100, false)
			.setRequiredXP(requiredXp)
			.setProgressBar('#ffa200', 'COLOR')
			.setBackground('COLOR', '#000000')
			.setUsername(yourName)
			.setDiscriminator(wdfWho.substring(6, 10))
			ranq.build().then(async (buffer) => {
				canvas.write(buffer, `${wdfWho}_card.png`)
				await kill.sendFile(from, `${wdfWho}_card.png`, `${wdfWho}_card.png`, '', id)
				setTimeout(() => { fs.unlinkSync(`${wdfWho}_card.png`) }, 30000)
			})
            break
			
			
		case 'ghost':
            if (!isGroupMsg) return await kill.reply(from. mess.sogrupo(), id)
			if (!isGroupAdmins) return await kill.reply(from, mess.soademiro(), id)
			if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
			if (isNaN(args[0])) return await kill.reply(from, mess.kickcount(), id)
			await kill.reply(from, mess.wait(), id)
			var userRem = `Removidos ↓\n\n`
            try {
				welkom.splice(groupId, 1)
				await fs.writeFileSync('./lib/config/Grupos/welcome.json', JSON.stringify(welkom))
                for (let i = 0; i < groupMembers.length; i++) {
					const msgCount = await getMsg(groupMembers[i].id, msgcount)
					if (groupAdmins.includes(groupMembers[i].id) || botNumber.includes(groupMembers[i].id) || ownerNumber.includes(groupMembers[i].id)) {
						console.log(color('[VIP] - ', 'crimson'), groupMembers[i].id)
					} else {
						if (msgCount < Number(args[0])) {
							await kill.removeParticipant(groupId, groupMembers[i].id)
							userRem += `@${groupMembers[i].id}\n\n`
						}
					}
				}
                await kill.sendTextWithMentions(from, userRem.replace('@c.us', ''))
				welkom.push(groupId)
				await fs.writeFileSync('./lib/config/Grupos/welcome.json', JSON.stringify(welkom))
            } catch (err) { await kill.reply(from, mess.fail() + '\nMaybe mistake/Talvez engano/0 removidos/0 removed.', id) }
            break
			
			
		case 'ativos':
            if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			msgcount.sort((a, b) => (a.msg < b.msg) ? 1 : -1)
            let active = '-----[ *RANKING DOS ATIVOS* ]----\n\n'
            try {
                for (let i = 0; i < 10; i++) {
					const aRandVar = await kill.getContact(msgcount[i].id)
					var getPushname = aRandVar.pushname
					if (getPushname == null) getPushname = 'wa.me/' + msgcount[i].id.replace('@c.us', '')
					active += `${i + 1} → *${getPushname}*\n➸ *Mensagens*: ${msgcount[i].msg}\n\n`
				}
                await kill.sendText(from, active)
            } catch (error) { 
				await kill.reply(from, mess.tenpeo(), id)
				console.log(color('[ATIVOS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
			
		case 'geral':
            if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            let geralRank = `-----[ *${name}* ]----\n\n`
            try {
                for (let i = 0; i < groupMembers.length; i++) {
					const bRandV = await kill.getContact(groupMembers[i].id)
					const msgCount = await getMsg(groupMembers[i].id, msgcount)
					const levelCount = await getLevel(groupMembers[i].id, nivel)
					const xpCount = await getXp(groupMembers[i].id, nivel)
					const xpToUp = 5 * Math.pow(levelCount, 2) + 50 * levelCount + 100
					var getUserName = bRandV.pushname
					if (getUserName == null) getUserName = 'wa.me/' + groupMembers[i].id.replace('@c.us', '')
					geralRank += `→ *${getUserName}*\n➸ *Mensagens*: ${msgCount}\n➸ *XP*: ${xpCount} / ${xpToUp}\n➸ *Level*: ${levelCount}\n\n`
				}
                await kill.sendText(from, geralRank)
            } catch (error) { 
				await kill.reply(from, mess.tenpeo(), id)
				console.log(color('[RANK GERAL]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
			
		case 'ranking':
            if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
            nivel.sort((a, b) => (a.xp < b.xp) ? 1 : -1)
			msgcount.sort((a, b) => (a.msg < b.msg) ? 1 : -1)
            let board = '-----[ *RANKING DE XP* ]----\n\n'
            try {
                for (let i = 0; i < 10; i++) {
					var role = patents.a0
					if (nivel[i].level <= 4) { role = patents.a1 } else if (nivel[i].level <= 10) { role = patents.a2 } else if (nivel[i].level <= 15) { role = patents.a3 } else if (nivel[i].level <= 20) { role = patents.a4 } else if (nivel[i].level <= 25) { role = patents.a5 } else if (nivel[i].level <= 30) { role = patents.a6 } else if (nivel[i].level <= 35) { role = patents.a7 } else if (nivel[i].level <= 40) { role = patents.a8 } else if (nivel[i].level <= 45) { role = patents.a9 } else if (nivel[i].level <= 50) { role = patents.a10 } else if (nivel[i].level <= 55) { role = patents.a11 } else if (nivel[i].level <= 60) { role = patents.a12 } else if (nivel[i].level <= 65) { role = patents.a13 } else if (nivel[i].level <= 70) { role = patents.a14 } else if (nivel[i].level <= 75) { role = patents.a15 } else if (nivel[i].level <= 80) { role = patents.a16 } else if (nivel[i].level <= 85) { role = patents.a17 } else if (nivel[i].level <= 90) { role = patents.a18 } else if (nivel[i].level <= 95) { role = patents.a19 } else if (nivel[i].level <= 100) { role = patents.a20 } else if (nivel[i].level <= 200) { role = patents.a21 } else if (nivel[i].level <= 300) { role = patents.a22 } else if (nivel[i].level <= 400) { role = patents.a23 } else if (nivel[i].level <= 500) { role = patents.a24 } else if (nivel[i].level <= 550) { role = patents.a25 } else if (nivel[i].level <= 600) { role = patents.a26 } else if (nivel[i].level <= 700) { role = patents.a27 } else if (nivel[i].level <= 800) { role = patents.a28 } else if (nivel[i].level <= 900) { role = patents.a29 } else if (nivel[i].level <= 1000 || nivel[i].level >= 1000) { role = patents.a30 }
					var aRandNe = await kill.getContact(nivel[i].id)
					var getTheName = aRandNe.pushname
					if (getTheName == null) getTheName = 'wa.me/' + nivel[i].id.replace('@c.us', '')
					board += `${i + 1} → *${getTheName}*\n➸ *Mensagens*: ${msgcount[i].msg}\n➸ *XP*: ${nivel[i].xp}\n➸ *Level*: ${nivel[i].level}\n➸ *Patente*: ${role}\n\n`
                }
                await kill.sendText(from, board)
            } catch (error) { 
				await kill.reply(from, mess.tenpeo(), id)
				console.log(color('[RANKING]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
			
        case 'givexp':
            if (!isOwner) return await kill.reply(from, mess.sodono(), id)
            if (args.length == 0) return await kill.reply(from, mess.semmarcar() + `\n\nEx: ${prefix}givexp @user <value/valor>`, id)
			if (mentionedJidList.length !== 0) xpUserGet = await kill.getContact(mentionedJidList[0])
			var userGainXp = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? xpUserGet.id : user)
			var theXPtoAdd = quotedMsg ? args[0] : (mentionedJidList.length !== 0 ? args[1] : args[1])
			if (isNaN(theXPtoAdd)) return await kill.reply(from, mess.onlynumber(), id)
			await sleep(2000)
            await addXp(userGainXp, Number(theXPtoAdd), nivel)
			await kill.sendTextWithMentions(from, mess.gainxp(userGainXp, theXPtoAdd) + 'XP.')
			break
			
			
        case 'givelvl':
            if (!isOwner) return await kill.reply(from, mess.sodono(), id)
            if (args.length == 0) return await kill.reply(from, mess.semmarcar() + `\n\nEx: ${prefix}givelvl @user <value/valor>`, id)
			if (mentionedJidList.length !== 0) xpUserGet = await kill.getContact(mentionedJidList[0])
			var usermrLvl = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? xpUserGet.id : user)
			var aLvLtoAdd = quotedMsg ? args[0] : (mentionedJidList.length !== 0 ? args[1] : args[1])
			if (isNaN(aLvLtoAdd)) return await kill.reply(from, mess.onlynumber(), id)
			await sleep(2000)
            await addLevel(usermrLvl, Number(aLvLtoAdd), nivel)
			await kill.sendTextWithMentions(from, mess.gainxp(usermrLvl, aLvLtoAdd) + 'Level.')
			break
			
		// Por Leonardo, updates KillovSky
		case 'softban':
			try {
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					const aatimep = Number(args[0]) * 60000
					const timeaddmsg = Number(aatimep) + 10000
					if (quotedMsg) {
						if (args.length == 0 || isNaN(args[0])) return await kill.reply(from, mess.nomark() + ' + time/tempo (minutos/minutes)\n(Ex: 30)', id)
						const bgmcomum = quotedMsgObj.sender.id
						if (ownerNumber.includes(bgmcomum) || groupAdmins.includes(bgmcomum)) return await kill.reply(from, mess.vip(), id)
						if (!groupMembersId.includes(bgmcomum)) return await kill.reply(from, mess.notongp(), id)
						await kill.sendTextWithMentions(from, mess.irritouqm(bgmcomum, args))
						await sleep(3000)
						await kill.removeParticipant(groupId, bgmcomum)
						await sleep(aatimep)
						const checkIsHere = await kill.getGroupMembersId(groupId)
						if (checkIsHere.includes(bgmcomum)) return await kill.reply(from, mess.janogp(), id)
						await kill.reply(from, mess.timeadd(), id)
						await kill.addParticipant(groupId, bgmcomum)
						await sleep(timeaddmsg)
						await kill.sendText(from, mess.voltargp())
					} else {
						if (args.length == 0 || isNaN(args[1]) || mentionedJidList.length == 0) return await kill.reply(from, mess.semmarcar() + '\n\n@user time/tempo (minutos/minutes)\n(Ex: @user 30)', id)
						if (!groupMembersId.includes(mentionedJidList[0])) return await kill.reply(from, mess.notongp(), id)
						await kill.sendTextWithMentions(from, mess.irritouml(mentionedJidList, args))
						await sleep(3000)
						if (ownerNumber.includes(mentionedJidList[0]) || groupAdmins.includes(mentionedJidList[0])) return await kill.reply(from, mess.vip(), id)
						await kill.removeParticipant(groupId, mentionedJidList[0])
						await sleep(aatimep)
						const checkIsHerea = await kill.getGroupMembersId(groupId)
						if (checkIsHerea.includes(mentionedJidList[0])) return await kill.reply(from, mess.janogp(), id)
						await kill.reply(from, mess.timeadd(), id)
						await kill.addParticipant(groupId, mentionedJidList[0])
						await sleep(timeaddmsg)
						await kill.sendText(from, mess.voltargp())
					}
				} else if (isGroupMsg) {
					await kill.reply(from, mess.soademiro(), id)
				} else return await kill.reply(from, mess.sogrupo(), id)
            } catch (error) { 
				await kill.reply(from, mess.addpessoa(), id)
				console.log(color('[SOFTBAN]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
			
		case 'marcar':
			await kill.sendTextWithMentions(from, `@${user.replace('@c.us', '')}`)
			break
			
			
		case 'nivel':
			var qualDeles = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : user)
			if (mentionedJidList.length !== 0) lvlusrnl = await kill.getContact(mentionedJidList[0])
			var yourfkName = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? lvlusrnl.pushname : pushname)
			const wtfXP = await getXp(qualDeles, nivel)
			const shesMSG = await getMsg(qualDeles, msgcount)
			const uzerlvl = await getLevel(qualDeles, nivel)
            const thexpnde = 5 * Math.pow(uzerlvl, 2) + 50 * uzerlvl + 100
            await kill.reply(from, `*「 STATS 」*\n\n➸ *Nick*: ${yourfkName}\n➸ *XP*: ${wtfXP} / ${thexpnde}\n➸ *Level*: ${uzerlvl}\n➸ *MSG*: ${shesMSG}`, id)
			break
			
			
		case 'letra':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'name of song/nome da música/nombre de música.', id)
			try {
				const liric = await axios.get(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(body.slice(7))}`)
				await kill.sendFileFromUrl(from, liric.data.thumbnail.genius, '', `*🎸*\n\n${liric.data.title}\n\n*🎵*\n\n${liric.data.lyrics}`, id)
			} catch (error) {
				await kill.reply(from, mess.noresult(), id)
				console.log(color('[LYRICS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
        case 'reedit':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'subreddit name/nombre/nome.', id)
			try {
				await kill.reply(from, mess.wait(), id)
				const reed = await axios.get(`https://meme-api.herokuapp.com/gimme/${encodeURIComponent(body.slice(8))}`)
				if (reed.data.nsfw == false || !isGroupMsg) {
					await kill.sendFileFromUrl(from, reed.data.url, '', reed.data.title, id)
				} else {
					if (isGroupMsg && !isNsfw) {
						await kill.reply(from, mess.gpadulto(), id)
					} else { await kill.sendFileFromUrl(from, reed.data.url, '', reed.data.title, id) }
				}
			} catch (error) {
				await kill.reply(from, mess.noresult(), id)
				console.log(color('[LYRICS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
		// Por Jon, updates KillovSky
		case 'wallhaven':;case 'wallpaper':
            if (args.length == 0) return await kill.reply(from, mess.noargs() + 'wallpaper name/nome/nombre.', id)
			await kill.reply(from, mess.wait(), id)
			try {
				const wpphe = await axios.get(`https://wallhaven.cc/api/v1/search?apikey=${config.wallhv}&q=${encodeURIComponent(body.slice(11))}`)
				var rwlpp = ''
				for (let i = 0; i < 10; i++) { rwlpp += `${wpphe.data.data[i].path}\n` }
				const heavenwpp = rwlpp.toString().split('\n')
				const rmvempty = heavenwpp.splice(heavenwpp.indexOf(''), 1)
				const rWallHe = heavenwpp[Math.floor(Math.random() * heavenwpp.length)]
				await kill.sendFileFromUrl(from, rWallHe, 'WallHaven.jpg', '<3', id)
			} catch (error) {
				await kill.reply(from, mess.noresult(), id)
				console.log(color('[WALLHAVEN]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
            break
			
		// Por Tio das Trevas, updates KillovSky
		case 'decode':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'binary code/código binario.', id)
			const dbin = await axios.get(`https://some-random-api.ml/binary?decode=${encodeURIComponent(body.slice(8))}`)
			await kill.reply(from, `*🤖1️⃣  =*\n\n${body.slice(8)}\n\n *= 📓✏️*\n\n${dbin.data.text}`, id)
			break
			
		// Por Tio das Trevas, updates KillovSky
		case 'encode':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			const cbin = await axios.get(`https://some-random-api.ml/binary?text=${encodeURIComponent(body.slice(8))}`)
			await kill.reply(from, `*📓✏️ → *\n\n${body.slice(8)}\n\n*🤖1️⃣  → *\n\n${cbin.data.binary}`, id)
			break
			
			
		case 'covid':
			if (args.lenght == 0) return await kill.reply(from, mess.coviderr(), id)
			const covidnb = await axios.get(`https://coronavirus-19-api.herokuapp.com/countries/${encodeURIComponent(body.slice(7))}`)
			if (covidnb.data == 'Country not found') return await kill.reply(from, mess.coviderr(), id)
			await kill.reply(from, mess.covidata(covidnb), id)
			break
			
		
		case 'paises':
			await kill.sendText(from, mess.covid())
			break
			
			
		case 'email':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'email | title/titulo | mensagem/message.' + '\n\n' + mess.argsbar() + 'use 2 "|".', id)
			try {
				await kill.reply(from, mess.wait(), id)
				const emailsd = arg.split('|')[0]
				const assuml = arg.split('|')[1]
				const textoma = arg.split('|')[2]
				const mails = await axios.get(`https://videfikri.com/api/spamemail/?email=${encodeURIComponent(emailsd)}&subjek=${encodeURIComponent(assuml)}&pesan=${encodeURIComponent(textoma)}`)
				const mailres = mails.data.result
				if (mailres.status == '200') {
					await kill.reply(from, `✔️ - *📠 → *: ${mailres.target}\n\n*📧 → * ${mailres.subjek}\n\n*📋 → * ${mailres.pesan}`, id)
				} else return await kill.reply(from, mess.mails(), id)
			} catch (error) {
				await kill.reply(from, mess.mails(), id)
				console.log(color('[EMAIL]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'gtav':
            if (isMedia && type === 'image' || isQuotedImage) {
			    await kill.reply(from, mess.wait(), id)
                const gtavmd = isQuotedImage ? quotedMsg : message
				const gtaddt = await decryptMedia(gtavmd, uaOverride)
				const gtaUpl = await upload(gtaddt, false)
                await kill.sendFileFromUrl(from, `https://videfikri.com/api/textmaker/gtavposter/?urlgbr=${gtaUpl}`, 'Gtav.jpg', 'GTA V PS2!', id).catch(async () => { await kill.reply(from, mess.upfail(), id) })
            } else return await kill.reply(from, mess.onlyimg(), id)
            break
			
			
		case 'reverter':;case 'rev':
            if (isMedia && type === 'image' || isQuotedImage) {
			    await kill.reply(from, mess.wait(), id)
                const revimg = isQuotedImage ? quotedMsg : message
                const revigb = await decryptMedia(revimg, uaOverride)
				const revUpl = await upload(revigb, false)
                await kill.sendFileFromUrl(from, `https://some-random-api.ml/canvas/invert?avatar=${revUpl}`, 'rev.jpg', 'Mãe, Pai, estou daltônica!', id).catch(async () => { await kill.reply(from, mess.upfail(), id) })
            } else return await kill.reply(from, mess.onlyimg(), id)
            break
			
			
		case 'encurtar':;case 'tinyurl':
			if (args.length == 0) return await kill.reply(from, mess.nolink(), id)
			const tinurl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`)
			if (tinurl.data == 'Error') return await kill.reply(from, mess.nolink() + '\n\n' + mess.fail(), id)
			await kill.reply(from, `${args[0]} → ${tinurl.data}`, id)
			break
			
    
		case 'signo':;case 'horoscopo':
			const signoerr = `❌ → ${args[0]} ← ❌!\n\n✔️ → Aries --- Taurus --- Gemini --- Cancer --- Leo --- Virgo --- Libra --- Scorpio --- Sagittarius --- Capricorn --- Aquarius --- Pisces.`
			if (args.length == 0) return await kill.reply(from, signoerr, id)
			const zodd = await axios.get(`http://horoscope-api.herokuapp.com/horoscope/today/${encodeURIComponent(args[0])}`)
			if (zodd.data.horoscope == '[]') return await kill.reply(from, signoerr, id)
			const myZod = zodd.data.horoscope
			if (config.lang == 'en') return await kill.reply(from, myZod, id)
			await sleep(5000)
			await translate(myZod, config.lang).then(async (horoZod) => { await kill.reply(from, horoZod, id) })
			break
			
			
		case 'bomb':
			var opsys = process.platform
			if (opsys == "win32" || opsys == "win64") { opsys = './lib/bomb/bomb.exe' } else { opsys = './lib/bomb/lbomb' }
			if (args.length == 1 && isGroupMsg && isGroupAdmins || args.length == 1 && isOwner) {
				if (isNaN(args[0])) return await kill.reply(from, mess.usenumber(), id)
				if (ownerNumber.includes(`${args[0]}@c.us`) || args[0].includes(`${botNumber.replace('@c.us', '')}`)) {
					await kill.sendText(ownerNumber[0], mess.nobomb(pushname, user))
					await kill.reply(from, mess.fuckbomb(), id)
					return await kill.contactBlock(user)
				}
				await kill.sendTextWithMentions(from, mess.bombstd(args))
				console.log(color('[BOMB]', 'crimson'), color(`→ Pedido de BOMB feito pelo ${pushname} no alvo → ${args[0]}.`, 'gold'))
				const atk = execFile(opsys, [`${args[0]}`, '3', '1', '0'], async function(err, data) { if (err) return await kill.reply(from, mess.bombend(), id) })
			} else return await kill.reply(from, mess.usenumber() + '\n\n' + mess.sogrupo(), id)
			break
			
			
		case 'botnome':
			if (!isOwner) return await kill.reply(from, mess.sodono(), id)
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			const newname = body.slice(6)
			if (newname.length >= 25) return await kill.reply(from, mess.letlimit() + '25.', id)
			await kill.setMyName(newname)
			await kill.reply(from, mess.maked(), id)
			break
			
			
		case 'recado':
			if (!isOwner) return await kill.reply(from, mess.sodono(), id)
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
			const newstat = body.slice(8)
			if (newstat.length >= 250) return await kill.reply(from, mess.letlimit() + '250.', id)
			await kill.setMyStatus(newstat)
			await kill.reply(from, mess.maked(), id)
			break
			
			
		case 'botfoto':
			if (isMedia && type == 'image' || isQuotedImage) {
				if (!isOwner) return await kill.reply(from, mess.sodono(), id)
				const dataMedia = isQuotedImage ? quotedMsg : message
				const mediaData = await decryptMedia(dataMedia, uaOverride)
				const bkmypic = await kill.getProfilePicFromServer(botNumber)
				if (bkmypic == undefined) { var backpt = errorurl } else { var backpt = bkmypic }
				await kill.sendFileFromUrl(from, backpt, '', 'Backup', id)
				await kill.setProfilePic(mediaData)
				await kill.reply(from, mess.maked(), id)
			} else return await kill.reply(from, mess.onlyimg(), id)
			break
			
			
		case 'book':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'book name/nome do livro/nombre del libro.', id)
			const takeBook = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(body.slice(6))}&langRestrict=${config.lang}`)
			const getBook = await axios.get(`${takeBook.data.items[0].selfLink}`)
			await kill.sendFileFromUrl(from, `${getBook.data.volumeInfo.imageLinks.thumbnail}`, 'book.jpg', mess.book(getBook), id)
			break
			
		// As piadas são péssimas mas é algo simples, então o uso
		case 'piada':
			const piada = await axios.get('https://v2.jokeapi.dev/joke/Any?format=txt')
			if (config.lang == 'en') return await kill.reply(from, piada.data, id)
			await sleep(5000)
			await translate(piada.data, config.lang).then(async (getPiada) => { await kill.reply(from, getPiada, id) })
			break
			
			
		case 'alarme':
			if (args.length == 0 || isNaN(args[0]) || !arks.includes('|')) return await kill.reply(from, mess.timealarm() + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
			const timetorem = Number(arg.split('|')[0]) * 60000
            const alarmname = arg.split('|')[1]
			await kill.reply(from, mess.alarmact(args), id)
			setTimeout(() => { kill.reply(from, `⏰ - ${alarmname}!`, id) }, timetorem)
			break
			
			
		case 'emoji':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'emoji.', id)
			emoji.get(args[0]).then(async (emoji) => {
				await sleep(3000)
				if (emoji.emoji == null) return await kill.reply(from, mess.noemoji(), id)
				let moji = `Emoji: ${emoji.emoji}\n\nUnicode: ${emoji.unicode}\n\nNome: ${emoji.name}\n\nInformações: ${emoji.description}\n\n`
				for (let i = 0; i < emoji.images.length; i++) { moji += `${emoji.images[i].vendor} → ${emoji.images[i].url}\n\n═════════════════\n\n` }
				await kill.reply(from, moji + mess.emojis(), id)
				await kill.sendStickerfromUrl(from, emoji.images[0].url, { method: 'get' }, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
		case 'cosplay':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'nome/nombre/name.', id)
			const plate = await axios.get(`https://rest.farzain.com/api/special/fansign/cosplay/cosplay.php?apikey=rambu&text=${encodeURIComponent(body.slice(9))}`, { responseType: 'arraybuffer' }).then(async (response) => {
				const myplaye = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendImageAsSticker(from, myplaye, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
		case 'hitler':
			try {
				await kill.reply(from, mess.wait(), id)
				if (isMedia && type === 'image' || isQuotedImage) {
					const hitlerPict = isQuotedImage ? quotedMsg : message
					const gethitlerPic = await decryptMedia(hitlerPict, uaOverride)
					var thehitlerpic = await upload(gethitlerPic, false)
				} else { var thehitlerpic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(user)) }
				if (thehitlerpic === undefined) thehitlerpic = errorImg
				canvas.Canvas.hitler(thehitlerpic).then(async (buffer) => { await kill.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `hitler.png`, '卍', id) })
			} catch (error) {
				await kill.reply(from, mess.fail(), id)
				console.log(color('[HITLER]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'trash':
			try {
				await kill.reply(from, mess.wait(), id)
				if (isMedia && type === 'image' || isQuotedImage) {
					const trashPict = isQuotedImage ? quotedMsg : message
					const getTrashPic = await decryptMedia(trashPict, uaOverride)
					var theTrashpic = await upload(getTrashPic, false)
				} else { var theTrashpic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(user)) }
				if (theTrashpic === undefined) theTrashpic = errorImg
				canvas.Canvas.trash(theTrashpic).then(async (buffer) => { await kill.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `trash.png`, '🚮', id) })
			} catch (error) {
				await kill.reply(from, mess.fail(), id)
				console.log(color('[TRASH]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'shit':
			try {
				await kill.reply(from, mess.wait(), id)
				if (isMedia && type === 'image' || isQuotedImage) {
					const shitPict = isQuotedImage ? quotedMsg : message
					const getshitPic = await decryptMedia(shitPict, uaOverride)
					var theshitpic = await upload(getshitPic, false)
				} else { var theshitpic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(user)) }
				if (theshitpic === undefined) theshitpic = errorImg
				canvas.Canvas.shit(theshitpic).then(async (buffer) => { await kill.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `shit.png`, '💩💩💩', id) })
			} catch (error) {
				await kill.reply(from, mess.fail(), id)
				console.log(color('[SHIT]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'blur':
			try {
				await kill.reply(from, mess.wait(), id)
				if (isMedia && type === 'image' || isQuotedImage) {
					const shitBlurt = isQuotedImage ? quotedMsg : message
					const getshitPic = await decryptMedia(shitBlurt, uaOverride)
					var theBlurpic = await upload(getshitPic, false)
				} else { var theBlurpic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(user)) }
				if (theBlurpic === undefined) theBlurpic = errorImg
				canvas.Canvas.blur(theBlurpic).then(async (buffer) => { await kill.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `blur.png`, '💡', id) })
			} catch (error) {
				await kill.reply(from, mess.fail(), id)
				console.log(color('[BLUR]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'rip':
			try {
				await kill.reply(from, mess.wait(), id)
				if (isMedia && type === 'image' || isQuotedImage) {
					const ARipt = isQuotedImage ? quotedMsg : message
					const getRipPic = await decryptMedia(ARipt, uaOverride)
					var theRippic = await upload(getRipPic, false)
				} else { var theRippic = quotedMsg ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(user)) }
				if (theRippic === undefined) theRippic = errorImg
				canvas.Canvas.rip(theRippic).then(async (buffer) => { await kill.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `rip.png`, '☠️', id) })
			} catch (error) {
				await kill.reply(from, mess.fail(), id)
				console.log(color('[RIP]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'exec':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + `Wa Automate function/função da Wa Automate.\n\nEx: ${prefix}exec await kill.reply(from, 'Oi', id)`, id)
			if (!isOwner) return await kill.reply(from, mess.sodono(), id)
			try {
				const waitEval = (cmd) => { return new Promise((resolve, reject) => { eval(cmd) }) }
				(async () => { await waitEval(body.slice(6).replace('await', '')) })()
			} catch (error) {
				await kill.reply(from, mess.fail(), id)
				console.log(color('[EXEC]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'github':
			if (args.length == 0) return await kill.reply(from, mess.noargs() + 'github username', id)
			await kill.reply(from, mess.wait(), id)
			const gitData = await axios.get(`https://api.github.com/users/${args[0]}`)
			const siteAdmin = (gitData.data.site_admin == false) ? 'Não' : gitData.data.site_admin
			const companY = (gitData.data.company == null) ? 'Não' : gitData.data.company
			const bloG = (gitData.data.blog == "") ? 'Não' : gitData.data.blog
			const emaiL = (gitData.data.email == null) ? 'Não' : gitData.data.email
			const tramPar = (gitData.data.hireable == null) ? 'Não' : gitData.data.hireable
			if (gitData.data.message == 'Not Found') return await kill.reply(from, mess.noresult(), id)
			await kill.sendFileFromUrl(from, `${gitData.data.avatar_url}`, 'avatar.png', mess.github(siteAdmin, companY, bloG, emaiL, tramPar, gitData), id)
			break
			
			
		case 'roubar':
			if (quotedMsg && quotedMsg.type == 'sticker' && arks.includes('|')) {
				await kill.reply(from, mess.wait(), id)
				const stickerMeta = await decryptMedia(quotedMsg)
				const packName = arg.split('|')[0]
				const authorName = arg.split('|')[1]
				await kill.sendImageAsSticker(from, `data:${quotedMsg.mimetype};base64,${stickerMeta.toString('base64')}`, { author: authorName, pack: packName })
			} else return await kill.reply(from, mess.onlyst() + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
            break
			
		// Não deixe seus usuarios floodarem, caso contrario a bot pode desligar
		case 'sound':;case 'bass':
			if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
				if (args.length == 1 && !isNaN(args[0])) {
					try {
						await kill.reply(from, mess.wait(), id)
						const encryptMedia = isQuotedAudio || isQuotedPtt ? quotedMsg : message
						const mediaData = await decryptMedia(encryptMedia, uaOverride)
						await fs.writeFile(`./lib/media/audio/${user.replace('@c.us', '')}${lvpc}.mp3`, mediaData, (err) => {
							if (err) return console.error(err)
							console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de audio "Bass" pedida por → ${pushname} - Você pode ignorar.`, 'gold'))
							ffmpeg(`./lib/media/audio/${user.replace('@c.us', '')}${lvpc}.mp3`).audioFilter(`equalizer=f=40:width_type=h:width=50:g=${args[0]}`).format('mp3').save(`./lib/media/audio/audio-${user.replace('@c.us', '')}${lvpc}.mp3`) // Você pode editar o equalizador ali
							.on('error', async function (error, stdout, stderr) {
								await kill.reply(from, mess.fail(), id)
								console.log(color('[BASS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
							})
							.on('end', async () => {
								console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de audio "Bass" finalizada, enviando para → ${pushname} - Você pode ignorar...`, 'gold'))
								await kill.sendFile(from, `./lib/media/audio/audio-${user.replace('@c.us', '')}${lvpc}.mp3`, 'audio.mp3', '', id)
								setTimeout(() => {
									fs.unlinkSync(`./lib/media/audio/audio-${user.replace('@c.us', '')}${lvpc}.mp3`)
									fs.unlinkSync(`./lib/media/audio/${user.replace('@c.us', '')}${lvpc}.mp3`)
								}, 30000)
							})
						})
					} catch (error) {
						await kill.reply(from, mess.fail(), id)
						console.log(color('[BASS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
					}
				} else return await kill.reply(from, mess.noargs() + 'quantidade de bass | bass quantity.', id)
			} else return await kill.reply(from, mess.onlyaudio(), id)
			break
			
		// Não deixe seus usuarios floodarem, caso contrario a bot pode desligar
		case 'nightcore':
			if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
				try {
					await kill.reply(from, mess.wait(), id)
					const encryptMedia = isQuotedAudio || isQuotedPtt ? quotedMsg : message
					const mediaData = await decryptMedia(encryptMedia, uaOverride)
					await fs.writeFile(`./lib/media/audio/n${user.replace('@c.us', '')}${lvpc}.mp3`, mediaData, (err) => {
						if (err) return console.error(err)
						console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de audio para versão "nightcore" pedida por → ${pushname} - Você pode ignorar.`, 'gold'))
						ffmpeg(`./lib/media/audio/n${user.replace('@c.us', '')}${lvpc}.mp3`).audioFilter('asetrate=44100*1.25').format('mp3').save(`./lib/media/audio/night-${user.replace('@c.us', '')}${lvpc}.mp3`) // Você pode editar o valor acima (44100*1.25)
						.on('error', async function (error, stdout, stderr) {
							await kill.reply(from, mess.fail(), id)
							console.log(color('[NIGHTCORE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
						})
						.on('end', async () => {
							console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de audio para versão "nightcore" finalizada, enviando para → ${pushname} - Você pode ignorar...`, 'gold'))
							await kill.sendFile(from, `./lib/media/audio/night-${user.replace('@c.us', '')}${lvpc}.mp3`, 'audio.mp3', '', id)
							setTimeout(() => {
								fs.unlinkSync(`./lib/media/audio/night-${user.replace('@c.us', '')}${lvpc}.mp3`)
								fs.unlinkSync(`./lib/media/audio/n${user.replace('@c.us', '')}${lvpc}.mp3`)
							}, 30000)
						})
					})
				} catch (error) {
					await kill.reply(from, mess.fail(), id)
					console.log(color('[NIGHTCORE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
			} else return await kill.reply(from, mess.onlyaudio(), id)
			break
			
		// Não deixe seus usuarios floodarem, caso contrario a bot pode desligar
		case 'audio':
			if (isMedia && isVideo || isQuotedVideo) {
				try {
					await kill.reply(from, mess.wait(), id)
					const vTypeA = isQuotedVideo ? quotedMsg : message
					const mediaData = await decryptMedia(vTypeA, uaOverride)
					await fs.writeFile(`./lib/media/video/${user.replace('@c.us', '')}${lvpc}.${vTypeA.mimetype.replace(/.+\//, '')}`, mediaData, (err) => {
						if (err) return console.error(err)
						console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de video para audio pedida por → ${pushname} - Você pode ignorar.`, 'gold'))
						ffmpeg(`./lib/media/video/${user.replace('@c.us', '')}${lvpc}.${vTypeA.mimetype.replace(/.+\//, '')}`).format('mp3').save(`./lib/media/video/v${user.replace('@c.us', '')}${lvpc}.mp3`)
						.on('error', async function (error, stdout, stderr) {
							await kill.reply(from, mess.fail(), id)
							console.log(color('[AUDIO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
						})
						.on('end', async () => {
							console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de video para audio terminada, enviando para → ${pushname} - Você pode ignorar...`, 'gold'))
							await kill.sendFile(from, `./lib/media/video/v${user.replace('@c.us', '')}${lvpc}.mp3`, 'audio.mp3', '', id)
							setTimeout(() => {
								fs.unlinkSync(`./lib/media/video/v${user.replace('@c.us', '')}${lvpc}.mp3`)
								fs.unlinkSync(`./lib/media/video/${user.replace('@c.us', '')}${lvpc}.${vTypeA.mimetype.replace(/.+\//, '')}`)
							}, 30000)
						})
					})
				} catch (error) {
					await kill.reply(from, mess.fail(), id)
					console.log(color('[AUDIO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
			} else return await kill.reply(from, mess.onlyvideo(), id)
			break
			
		// Não, não possuo interesse em criar um painel que puxe dados pessoais de pessoas, pare de fod** gente inocente.
		case 'cpf':
			if (!config.lang == 'pt') return await kill.reply(from, 'Brazil only/Brasil solamente!', id)
			try {
				if (args[0].length > 11) return await kill.reply(from, 'cpf invalido.', id)
				await kill.reply(from, mess.wait(), id)
				const browsercf = await puppeteer.launch(options)
				const pagecf = await browsercf.newPage()
				await pagecf.goto("https://www.situacao-cadastral.com", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
					await pagecf.waitForSelector("#doc")
					await pagecf.type("#doc", args[0])
					await pagecf.click("#consultar")
					await pagecf.waitForSelector('div[id="resultado"] > span.dados.nome')
					const cpfName = await pagecf.$eval('div[id="resultado"] > span.dados.nome', cpfnome => cpfnome.textContent)
					const situation = await pagecf.$eval('#resultado > span.dados.situacao > span', situCad => situCad.textContent)
					await kill.reply(from, `O CPF *"${args[0]}"* possui como dono *"${cpfName}"* que está com *"${situation}".*`, id)
					await browsercf.close()
				})
			} catch (error) {
				await kill.reply(from, 'CPF não encontrado ou erros.', id)
				console.log(color('[CPF]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'policia':
			await kill.sendText(from, mess.policemenu())
			break
			
			
		case '01':
			if (mentionedJidList.length == 0 && !quotedMsg) return await kill.reply(from, mess.howtololi(), id)
			if (mentionedJidList.length !== 0) theLolicon = await kill.getContact(mentionedJidList[0])
			var getLolicon = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? theLolicon.pushname : pushname)
			if (getLolicon == undefined) getLolicon = `??? - Top secret name - ???`
			await fs.appendFile('./lib/config/Utilidades/lolicon.txt', `\n\n${getLolicon} - ${lvpc} Years/Anos 🔒`)
			await kill.reply(from, mess.fbi(), id)
			break
			
			
		case '02':
			var aBraPlP = pushname
			if (aBraPlP == undefined) aBraPlP = `\n\n??? - Top secret name - ??? - ${lvpc} Years/Anos 🔒`
			await fs.appendFile('./lib/config/Utilidades/entregados.txt', `\n\n${aBraPlP} - ${lvpc} Years/Anos 🔒`)
			await kill.reply(from, mess.arrested(), id)
			break
			
			
		case '03':
			if (mentionedJidList.length == 0 && !quotedMsg) return await kill.reply(from, mess.howtoshota(), id)
			if (mentionedJidList.length !== 0) theShotaCmnl = await kill.getContact(mentionedJidList[0])
			var takeChild = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? theShotaCmnl.pushname : pushname)
			if (takeChild == undefined) takeChild = `??? - Top secret name - ???`
			await fs.appendFile('./lib/config/Utilidades/reversecon.txt', `\n\n${takeChild} - ${lvpc} Years/Anos 🔒`)
			await kill.reply(from, mess.cia(), id)
			break
			
			
		case '04':
			if (mentionedJidList.length == 0 && args.length <= 3 && !arks.includes('|') || !quotedMsg && args.length <= 2 && !arks.includes('|')) return await kill.reply(from, mess.howtocrime(), id)
			var theCrime = arg.split('|')[1]
			if (mentionedJidList.length !== 0) criminalSmooth = await kill.getContact(mentionedJidList[0])
			var crimeReported = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? criminalSmooth.pushname : pushname)
			if (crimeReported == undefined) crimeReported = `??? - Top secret name - ???`
			if (theCrime == undefined) theCrime = `??? - Top secret crime - ???`
			await fs.appendFile('./lib/config/Utilidades/crimereport.txt', `\n\n${crimeReported} (${theCrime}) - ${lvpc} Years/Anos 🔒`)
			await kill.reply(from, mess.stars(), id)
			break
			
			
		case '05':
			if (mentionedJidList.length == 0 && !quotedMsg) return await kill.reply(from, mess.howtolgbts(), id)
			if (mentionedJidList.length !== 0) the1000gender = await kill.getContact(mentionedJidList[0])
			var genderFuck = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? the1000gender.pushname : pushname)
			if (genderFuck == undefined) genderFuck = `??? - Top secret name - ???`
			await fs.appendFile('./lib/config/Utilidades/gaysreport.txt', `\n\n${genderFuck} [${guei}] - ${lvpc} Years/Anos 🔒`)
			await kill.reply(from, mess.bsaa(), id)
			break
			
			
		case 'fbi':
			const loliconList = await fs.readFileSync('./lib/config/Utilidades/lolicon.txt').toString()
			await kill.reply(from, loliconList, id)
			break
			
			
		case 'rpd':
			const peopleCrz = await fs.readFileSync('./lib/config/Utilidades/entregados.txt').toString()
			await kill.reply(from, peopleCrz, id)
			break
			
			
		case 'cia':
			const reversePedo = await fs.readFileSync('./lib/config/Utilidades/reversecon.txt').toString()
			await kill.reply(from, reversePedo, id)
			break
			
			
		case 'bsaa':
			const gaysArrest = await fs.readFileSync('./lib/config/Utilidades/gaysreport.txt').toString()
			await kill.reply(from, gaysArrest, id)
			break
			
			
		case 'stars':
			const aLotCrime = await fs.readFileSync('./lib/config/Utilidades/crimereport.txt').toString()
			await kill.reply(from, aLotCrime, id)
			break
			
			
		case 'resetall':
			if (!isOwner) return await kill.reply(from, mess.sodono(), id)
			await fs.writeFileSync('./lib/config/Utilidades/lolicon.txt', 'Lolicons ↓')
			await fs.writeFileSync('./lib/config/Utilidades/reversecon.txt', 'Menores Denunciados ↓')
			await fs.writeFileSync('./lib/config/Utilidades/entregados.txt', 'Auto-denuncias ↓')
			await fs.writeFileSync('./lib/config/Utilidades/gaysreport.txt', 'LGTB\'S Denunciados ↓')
			await fs.writeFileSync('./lib/config/Utilidades/crimereport.txt', 'Crimes Reportados ↓')
			await kill.reply(from, mess.maked(), id)
			break
			
		// Se tiver um link de video DIRETO, adicione-o na "lolis.txt".
		case 'lolireal':
			const aLolisV = await fs.readFileSync('./lib/config/Utilidades/lolis.txt').toString().split('\n')
			const getLoliVideo = aLolisV[Math.floor(Math.random() * aLolisV.length)]
			await kill.reply(from, mess.wait(), id)
			await kill.sendFileFromUrl(from, getLoliVideo, 'loli.mp4', 'Lolicon!', id).catch(async () => { await kill.reply(from, mess.fbispoted(), id) })
			break
			
		// Adicione mais no arquivo "desafio.txt" e "verdade.txt", mas em inglês.
		case 'tord':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			if (args.length == 0) return await kill.reply(from, mess.tordare(), id)
			if (args[0] == '-dare') {
				const desafios = await fs.readFileSync('./lib/config/Utilidades/desafio.txt').toString().split('\n')
				const getDare = desafios[Math.floor(Math.random() * desafios.length)]
				if (config.lang == 'en') return await kill.reply(from, getDare, id)
				await translate(getDare, config.lang).then(async (darem) => { await kill.reply(from, darem, id) })
			} else if (args[0] == '-truth') {
				const verdadeG = await fs.readFileSync('./lib/config/Utilidades/verdade.txt').toString().split('\n')
				const getTruth = verdadeG[Math.floor(Math.random() * verdadeG.length)]
				if (config.lang == 'en') return await kill.reply(from, getTruth, id)
				await translate(getTruth, config.lang).then(async (truthm) => { await kill.reply(from, truthm, id) })
			} else if (args[0] == '-r') {
				await kill.reply(from, 'OK! Vamos outra!\nVerdade ou Desafio? (-truth or -dare)?', id)
			} else return await kill.reply(from, mess.tordare(), id)
			break
			
		// Adicione mais no arquivo "never.txt", mas em inglês.
		case 'nunca':
			const neverT = await fs.readFileSync('./lib/config/Utilidades/never.txt').toString().split('\n')
			const getNeverland = neverT[Math.floor(Math.random() * neverT.length)]
			if (config.lang == 'en') return await kill.reply(from, getNeverland, id)
			await translate(getNeverland, config.lang).then(async (willdo) => { await kill.reply(from, willdo, id) })
			break
			
		// Adicione mais no arquivo "cantadas.txt", mas em inglês.
		case 'cantada':
			const letmeHpy = await fs.readFileSync('./lib/config/Utilidades/cantadas.txt').toString().split('\n')
			const getHappyness = letmeHpy[Math.floor(Math.random() * letmeHpy.length)]
			if (config.lang == 'en') return await kill.reply(from, getHappyness, id)
			await translate(getHappyness, config.lang).then(async (notHappy) => { await kill.reply(from, notHappy, id) })
			break
			
			
		case 'sort':
			if (args.length == 0 || !arks.includes('|')) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar(), id)
			var listChoice = ''
			const sortArgs = arg.split('|')
			for (let i = 0; i < sortArgs.length; i++) { listChoice += `${sortArgs[i]}\n` }
			listChoice = listChoice.toString().split('\n')
			const choiceSomethg = listChoice[Math.floor(Math.random() * listChoice.length)]
			await kill.reply(from, choiceSomethg, id)
			break
			
			
        case 'antitravas':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				if (args.length !== 1) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					if (trava.includes(groupId)) return await kill.reply(from, mess.jaenabled(), id)
					trava.push(groupId)
					await fs.writeFileSync('./lib/config/Grupos/antitrava.json', JSON.stringify(trava))
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					if (!trava.includes(groupId)) return await kill.reply(from, mess.jadisabled(), id)
					trava.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Grupos/antitrava.json', JSON.stringify(trava))
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica1(), id)
            } else return await kill.reply(from, mess.soademiro(), id)
            break
			
			
		case 'destrava':
			if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
				var shrekDes = ''
				for (let i = 0; i < 20; i++) { shrekDes += `⢀⡴⠑⡄⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \n⠸⡇⠀⠿⡀⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠑⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢀⢴⣶⣆ \n⠀⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⠸⣼⡿ \n⠀⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉⠀⠀⠀⠀⠀ \n⠀⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ \n⠀⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀ \n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉\n\n` }
				await kill.sendText(from, shrekDes, id)
            } else return await kill.reply(from, mess.soademiro(), id)
			break
			
			
        case 'biblia':;case 'bible':
			const bibleal = await fs.readFileSync('./lib/config/Utilidades/biblia.txt').toString().split('\n')
			const randomBible = bibleal[Math.floor(Math.random() * bibleal.length)]
			try {
				if (args[0] == '-g') {
					await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${body.slice(13)}" biblia.txt | shuf -n 1'`, async (error, stdout, stderr) => {
						if (error || stderr || stdout == null || stdout == '') {
							if (config.lang == 'en') return await kill.reply(from, randomBible, id)
							await sleep(5000)
							await translate(randomBible, config.lang).then(async (bible) => { await kill.reply(from, bible, id) })
						} else {
							if (config.lang == 'en') return await kill.reply(from, stdout, id)
							await sleep(5000)
							await translate(stdout, config.lang).then(async (bible) => { await kill.reply(from, bible, id) })
						}
					})
				} else return await translate(randomBible, config.lang).then(async (bible) => { await kill.reply(from, bible, id) })
			} catch (error) { 
				await kill.reply(from, randomBible, id)
				console.log(color('[BIBLIA]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
			}
			break
			
			
		case 'steal':
			if (mentionedJidList.length == 0 && !quotedMsg) return await kill.reply(from, mess.semmarcar(), id)
			var theStealK = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : user)
			const stealAlvo = await getXp(theStealK, nivel)
			const checkUserXP = await getXp(user, nivel)
			const noStealTm = await getLimit(user, daily)
			if (stealAlvo <= 1000) return await kill.sendTextWithMentions(from, mess.notalvo(theStealK, stealAlvo), id) // Precisa de 1000 XP para roubar
			if (stealAlvo <= 10000 || checkUserXP <= 10000) { var diviseXP = 20 } else if (stealAlvo <= 50000 || checkUserXP <= 50000) { var diviseXP = 50 } else if (stealAlvo <= 100000 || checkUserXP <= 100000 || checkUserXP <= 100000 || stealAlvo >= 100000) { var diviseXP = 70 }
			var theXpShame = parseInt(stealAlvo / diviseXP, 10)
			var xpRandomChs = parseInt(checkUserXP / diviseXP, 10)
			var theXpTOtake = Math.floor(Math.random() * xpRandomChs) + 200
			var stealGain = Math.floor(Math.random() * theXpShame) + 200
			var stealLose = Number(-stealGain)
			if (stealLose < -checkUserXP) stealLose = Number(-theXpTOtake); stealGain = Number(theXpTOtake)
            if (noStealTm !== undefined && cd - (Date.now() - noStealTm) > 0) {
                const time = ms(cd - (Date.now() - noStealTm))
                await kill.reply(from, mess.steal(), id)
			} else {
				if (side == 1) {
					await kill.sendTextWithMentions(from, mess.stealwkd(theStealK, stealGain))
					await sleep(2000)
					await addXp(user, stealGain, nivel)
					await addXp(theStealK, stealLose, nivel)
				} else {
					await kill.sendTextWithMentions(from, mess.stealfail(theStealK, stealLose))
					await sleep(2000)
					await addXp(user, stealLose, nivel)
					await addXp(theStealK, stealGain, nivel)
				}
				await addLimit(user, daily) // remova para tirar o limite dos jogos
			}
			break
			
			
		case 'nolimit':
			if (!isOwner) return await kill.reply(from, mess.sodono(), id)
			await fs.writeFileSync('./lib/config/Bot/diario.json', '[]')
			await kill.reply(from, mess.maked(), id)
			break
			
			
		case 'doar':
            if (args.length == 0) return await kill.reply(from, mess.semmarcar() + `\n\nEx: ${prefix}give @user <value/valor>`, id)
			const checkValue = await getXp(user, nivel)
			var theXpdonate = quotedMsg ? parseInt(args[0]) : (mentionedJidList.length !== 0 ? parseInt(args[1]) : parseInt(args[1]))
			if (isNaN(theXpdonate) || !isInt(theXpdonate) || Number(theXpdonate) > checkValue || theXpdonate < 1) return await kill.reply(from, mess.noxpalv(checkValue), id)
			var sortFd = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : user)
			await sleep(2000)
			await addXp(user, Number(-theXpdonate), nivel)
			await addXp(sortFd, Number(theXpdonate), nivel)
			await kill.sendTextWithMentions(from, mess.xpdon(sortFd, theXpdonate))
			break
			
			
		case 'bang':
			if (!isGroupMsg) return await kill.reply(from, mess.sogrupo(), id)
			var bangme = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : randomMember)
			await axios.get(`https://s3.gifyu.com/images/ezgif-2-ceb28112dbdd.gif`, { responseType: 'arraybuffer' }).then(async (response) => {
				const bangstkc = Buffer.from(response.data, 'binary').toString('base64')
				await kill.sendTextWithMentions(from, mess.lolibang(user, bangme, whatWeapon), id)
				await kill.sendImageAsSticker(from, bangstkc, { author: config.author, pack: config.pack, keepScale: true })
			})
			break
			
			
		case 'muteall':
            if (isOwner) {
				if (args.length == 0) return await kill.reply(from, mess.onoff(), id)
				if (args[0] == 'on') {
					isMuteAll = 1
					await kill.reply(from, mess.enabled(), id)
				} else if (args[0] == 'off') {
					isMuteAll = 0
					await kill.reply(from, mess.disabled(), id)
				} else return await kill.reply(from, mess.kldica2(), id)
            } else return await kill.reply(from, mess.sodono(), id)
			break
			
			
		case 'newprefix':
            if (isOwner) {
				if (args.length == 0) return await kill.reply(from, mess.noargs() + 'new prefix.', id)
				prefix = args[0]
				await kill.reply(from, mess.newprefix(args), id)
            } else return await kill.reply(from, mess.sodono(), id)
			break
			
			
        case 'noadms':;case 'noadmin':
			if (isGroupMsg) {
				const groupOwnerz = user === chat.groupMetadata.owner
				if (groupOwnerz || isOwner) {
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					for (let noadms of groupAdmins) {
						if (noadms == groupOwnerz || ownerNumber.includes(noadms) || noadms == botNumber) {
							console.log(color('[VIP] - ', 'crimson'), noadms)
						} else { await kill.demoteParticipant(groupId, noadms) }
					}
					await kill.reply(from, mess.maked(), id)
				} else return await kill.reply(from, mess.gpowner(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
			
        case 'alladms':;case 'alladmin':
			if (isGroupMsg) {
				const groupOwneran = user === chat.groupMetadata.owner
				if (groupOwneran || isOwner) {
					if (!isBotGroupAdmins) return await kill.reply(from, mess.botademira(), id)
					for (let alladmin of groupMembersId) {
						if (groupAdmins.includes(alladmin)) {
							console.log(color('[JÁ ADM] - ', 'crimson'), alladmin)
						} else { await kill.promoteParticipant(groupId, alladmin) }
					}
					await kill.reply(from, mess.maked(), id)
				} else return await kill.reply(from, mess.gpowner(), id)
			} else return await kill.reply(from, mess.sogrupo(), id)
            break
			
		// Para usar a base remova o /* e o */ e bote um nome dentro das aspas da case e em seguida sua mensagem dentro das aspas na frente do from
		/*case 'Nome do comando sem espaços':
			await kill.reply(from, 'Sua mensagem', id)
			break*/
			
			
        default:
            if (isCmd) { await kill.reply(from, mess.nocmd(command), id) }
            break
			
			
        }
    } catch (err) {
		//await kill.sendText(ownerNumber[0], mess.wpprpt(command, err))
		await kill.reply(from, mess.fail(), id)
        console.log(color('[FALHA GERAL]', 'red'), err)
    }
}