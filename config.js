/*
* Recodado por Lucas R.
* Legião Z é o melhor, to famoso pessoal!
* Reprodução autorizada MAS sem remover os creditos do criador deste BOT!
*/

// MODULOS
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const sharp = require('sharp')
const math = require('mathjs')
const search = require("simple-play-store-search")
const google = require('google-it')
const isPorn = require('is-porn')
const imgsearch = require('node-reverse-image-search')
const imgbbUploader = require('imgbb-uploader')
const moment = require('moment-timezone')
const get = require('got')
const sinesp = require('sinesp-api')
const { Aki } = require('aki-api')
const request = require('request')
const { spawn, exec, execFile } = require('child_process')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const { removeBackgroundFromImageBase64 } = require('remove.bg')
const fetch = require('node-fetch')

// UTILIDADES
const color = require('./lib/color')
const { randomNimek, sleep, wall, tulis, ss, isUrl } = require('./lib/functions')
const { owner, donate, down, help, admins, adult, readme, lang, convh } = require('./lib/help')
const { stdout } = require('process')
const bent = require('bent')
const { doing } = require('./lib/translate.js')
const { meme, msgFilter, translate, killo, ngtts } = require('./lib')
const { uploadImages } = require('./lib/fether')
const feature = require('./lib/poll')
const { sobre } = require('./lib/sobre')
const BrainlySearch = require('./lib/brainly')
const { coins } = require('./lib/coins')
moment.tz.setDefault('America/Sao_Paulo').locale('pt_BR')
const config = require('./lib/config/config.json')

// JSON'S 
const nsfw_ = JSON.parse(fs.readFileSync('./lib/config/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/config/welcome.json'))
const exsv = JSON.parse(fs.readFileSync('./lib/config/exclusive.json'))
const bklist = JSON.parse(fs.readFileSync('./lib/config/blacklist.json'))
const atbk = JSON.parse(fs.readFileSync('./lib/config/anti.json'))
const faki = JSON.parse(fs.readFileSync('./lib/config/fake.json'))
const slce = JSON.parse(fs.readFileSync('./lib/config/silence.json'))
const atstk = JSON.parse(fs.readFileSync('./lib/config/sticker.json'))

module.exports = kconfig = async (kill, message) => {
    try {
        // Prefix
        const prefix = config.prefix

		// PARAMETROS
		const { type, id, from, t, sender, author, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
		let { body } = message
		const { name, formattedTitle } = chat
		let { pushname, verifiedName, formattedName } = sender
		pushname = pushname || verifiedName || formattedName
        const botNumber = await kill.getHostNumber()
        const blockNumber = await kill.getBlockedIds()
		const ownerNumber = config.owner
        const usuario = sender.id
		const isOwner = usuario.includes(ownerNumber)
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await kill.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false
        const autoSticker = isGroupMsg ? atstk.includes(groupId) : false
        const chats = (type === 'chat') ? body : ((type === 'image' || type === 'video')) ? caption : ''
        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
		const processTime = (timestamp, now) => { return moment.duration(now - moment(timestamp * 1000)).asSeconds() }
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
		const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const url = args.length !== 0 ? args[0] : ''
        const uaOverride = process.env.UserAgent
        const isBlocked = blockNumber.includes(sender.id)
        const isLeg = exsv.includes(chatId)
		const mute = slce.includes(chatId)
		const pvmte = slce.includes(sender.id)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
        const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
        const isImage = type === 'image'
        const isVideo = type === 'video'
        global.pollfile = 'poll_Config_'+chat.id+'.json'
        global.voterslistfile = 'poll_voters_Config_'+chat.id+'.json'
		global.client = kill
		
		// OUTRAS
        const double = Math.floor(Math.random() * 2) + 1
        const four = Math.floor(Math.random() * 4) + 1
        const triple = Math.floor(Math.random() * 3) + 1
        const cinco = Math.floor(Math.random() * 5) + 1
        const six = Math.floor(Math.random() * 6) + 1
        const seven = Math.floor(Math.random() * 7) + 1
        const octo = Math.floor(Math.random() * 8) + 1
		const lvpc = Math.floor(Math.random() * 100) + 1
		const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
		const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
		
		
        const mess = {
            wait: 'Ok amore, espere um pouquinho...',
            error: {
                St: 'Você usou errado haha!\nPara usar isso, envie ou marque uma foto com essa mensagem, se for um gif, use o comando /gif.',
                Ki: 'Para remover administradores, você precisa primeiro remover o ADM deles.',
                Ad: 'Erros! Não pude adicionar, pode ser por limitação de adicionar ou erros meus.',
                Go: 'Oras, apenas o dono de um grupo pode usar esse tipo de comando.',
				Kl: 'Opa! Isso é apenas meu criador, você não pode acessar.',
				Ga: 'Apenas Administradores podem usar, então trate de virar um haha!',
				Gp: 'Desculpe, mas isso é um comando para grupos.',
				Ac: 'Somente grupos que permitem conteúdo +18 podem usar comandos assim, se você é o dono e quer isso, use /nsfw enable, ou use no PV.',
				Ba: 'Caro administrador, se quiser que eu use esses comandos, precisa me deixar ser uma ademira!',
                Iv: 'Esse link está correto? Ele me parece errado...'
            }
        }
	

        // ANTI LINK DE GRUPO
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isLeg && !isOwner) {
			try {
				if (chats.match(new RegExp(/(https:\/\/chat.whatsapp.com)/gi))) {
					const gplka = await kill.inviteInfo(chats)
					if (gplka == '200') {
						console.log(color('[BAN]', 'red'), color('Link de grupo detectado, removendo participante...', 'yellow'))
						await kill.removeParticipant(groupId, sender.id)
					} else {
						console.log(color('[ALERTA]', 'yellow'), color('Link de grupo invalido recebido...', 'yellow'))
					}
				}
			} catch (error) {
				return
			}
		}

        // Anti Porno
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isLeg && !isOwner) {
			try {
				if (isUrl(chats)) {
					const inilkn = new URL(isUrl(chats))
					console.log(color('[LINK]', 'yellow'), 'Link recebido:', inilkn.hostname)
					isPorn(inilkn.hostname, async (err, status) => {
						if (err) return console.error(err)
						if (status) {
							console.log(color('[NSFW]', 'red'), color('O link contém pornografia dentro, removendo participante...', 'yellow'))
							await kill.removeParticipant(groupId, sender.id)
						} else {
							console.log(('[SAFE]'), color('O link recebido é seguro.'))
						}
					})
				}
			} catch (error) {
				return
			}
		}
		

        // Auto-sticker
        if (isGroupMsg && autoSticker && isMedia && isImage && !isCmd) {
            const mediaData = await decryptMedia(message, uaOverride)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            await kill.sendImageAsSticker(from, imageBase64)
        }
		

        // ANTI FLOOD PRIVADO
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return console.log(color('FLOOD AS', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'de', color(pushname)) }
		
		// ANTI FLOOD GRUPOS
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return console.log(color('FLOOD AS', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'de', color(pushname), 'em', color(name || formattedTitle)) }
		
		
        // MENSAGEM PV
        if (!isCmd && !isGroupMsg) { return console.log('> MENSAGEM AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'de', color(pushname)) }
		
		// MENSAGEM GP
        if (!isCmd && isGroupMsg) { return console.log('> MENSAGEM AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'de', color(pushname), 'em', color(name || formattedTitle)) }
		
		
		// COMANDOS
        if (isCmd && !isGroupMsg) { console.log(color(`> COMANDO "${command} [${args.length}]" AS`), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'de', color(pushname)) }
		
		// COMANDOS GP
        if (isCmd && isGroupMsg) { console.log(color(`> COMANDO "${command} [${args.length}]" AS`), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'de', color(pushname), 'em', color(name || formattedTitle)) }
		

        // Impede SPAM
        if (isCmd && !isOwner) msgFilter.addFilter(from)
	

        switch(command) {


        case 'sticker':
        case 'fig':
        case 'figurinha':
        case 'stiker':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isMedia && isImage) {
                const mediaData = await decryptMedia(message, uaOverride)
				sharp(mediaData)
				.resize(512, 512, {
					fit: sharp.fit.contain
				})
				.toBuffer()
				.then(async (resizedImageBuffer) => {
					let resizedImageData = resizedImageBuffer.toString('base64');
					let resizedBase64 = `data:${mimetype};base64,${resizedImageData}`;
					await kill.sendImageAsSticker(from, resizedBase64)
				})
            } else if (isQuotedImage) {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
				sharp(mediaData)
				.resize(512, 512, {
					fit: sharp.fit.contain
				})
				.toBuffer()
				.then(async (resizedImageBuffer) => {
					let resizedImageData = resizedImageBuffer.toString('base64');
					let resizedBase64 = `data:${quotedMsg.mimetype};base64,${resizedImageData}`;
					await kill.sendImageAsSticker(from, resizedBase64)
				})
            } else if (args.length == 1) {
                const url = args[1]
                if (url.match(isUrl)) {
                    await kill.sendStickerfromUrl(from, url, { method: 'get' })
                        .catch(err => console.log('Erro: ', err))
                } else {
                    kill.reply(from, mess.error.Iv, id)
                }
            } else {
                    kill.reply(from, mess.error.St, id)
            }
            break
			

		case 'ttp':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) return kill.reply(from, 'Cadê a frase né?', id)
			axios.get(`https://st4rz.herokuapp.com/api/ttp?kata=${body.slice(5)}`)
			.then(res => {
				kill.sendImageAsSticker(from, res.data.result)
			})
			break
			
			
        case 'wasted':
            if (isMedia && type === 'image' || isQuotedImage) {
                const wastedmd = isQuotedImage ? quotedMsg : message
                const wstddt = await decryptMedia(wastedmd, uaOverride)
                await kill.reply(from, mess.wait, id)
				const options = {
					apiKey: config.imgbb,
					imagePath: './lib/media/img/wasted.jpg',
					expiration: 1800
				}
                var wstdimg = './lib/media/img/wasted.jpg'
                await fs.writeFile(wstdimg, wstddt)
				const wasteup = await imgbbUploader(options)
				console.log(wasteup.url)
                await kill.sendFileFromUrl(from, `https://some-random-api.ml/canvas/wasted?avatar=${wasteup.url}`, 'Wasted.jpg', 'Alguém viu essa pessoa por aqui?', id)
            } else {
                await kill.reply(from, 'Você não está usando isso com uma foto...', id)
            }
            break
			
			
		case 'about':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			await kill.sendFile(from, './lib/media/img/iris.png', 'iris.png', sobre, id)
			break

			
        case 'stickernobg':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (isMedia) {
                try {
                    var mediaData = await decryptMedia(message, uaOverride)
                    var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    var base64img = imageBase64
                    var outFile = './lib/media/img/noBg.png'
                    var result = await removeBackgroundFromImageBase64({ base64img, apiKey: config.nobg, size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await kill.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
					await kill.reply(from, 'Certifique-se de evitar usar isso quando não precisar,', id)
                } catch(err) {
                    console.log(err)
					await kill.reply(from, 'Ups! Alguma coisa deu errado nesse comando!', id)
                }
            }
            break


        case 'stickergif':
        case 'gifsticker':
        case 'gif':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isMedia && type === 'video' || mimetype === 'image/gif' || isQuotedVideo || isQuotedGif) {
                await kill.reply(from, mess.wait, id)
                try {
                    const encryptMedia = isQuotedGif || isQuotedVideo ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const gifSticker = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    await kill.sendMp4AsSticker(from, gifSticker, { fps: 30, startTime: '00:00:00.0', endTime : '00:00:05.0', loop: 0 })
                } catch (err) {
                    console.error(err)
                    await kill.reply(from, 'Desculpe, obtive alguns erros ao fazer seu sticker.', id)
                }
            } else {
                await kill.reply(from, 'Isso somente pode ser usado com videos e gifs.', id)
            }
            break
	

		case 'simg':
			if (mute || pvmte) return console.log('Comando ignorado [Silence]')
            if (isMedia && type === 'image' || isQuotedImage) {
                const shimgoh = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(shimgoh, uaOverride)
				kill.reply(from, 'Aguarde, leva mais de 20 segundos.', id)
				const sendres = (results) => {
					const ttile = results[0].title.replace('<span>', '').replace('</span>', '')
					const ttscig = results[1].title.replace('<span>', '').replace('</span>', '')
					kill.reply(from, `*${ttile}*\n\n*Titulo >* ${ttscig}\n\n${results[1].url}`, id)
					console.log(results)
				}
                var seaimg = './lib/media/img/imagesearch.jpg'
                await fs.writeFile(seaimg, mediaData)
				let options = {
					apiKey: config.imgbb,
					imagePath: './lib/media/img/imagesearch.jpg',
					expiration: 1800
				}
				const upimg = await imgbbUploader(options)
				console.log(upimg.url)
				await sleep(10000)
				const resimg = await imgsearch(upimg.url, sendres)
			} else {
				await kill.reply(from, 'Amigo(a), isso somente funciona com imagens.', id)
			}
			break
			

		case 'upimg':
			if (mute || pvmte) return console.log('Comando ignorado [Silence]')
            if (isMedia && type === 'image' || isQuotedImage) {
                const upimgoh = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(upimgoh, uaOverride)
                var uplimg = './lib/media/img/imageupl.jpg'
                await fs.writeFile(uplimg, mediaData)
				let options = {
					apiKey: config.imgbb,
					imagePath: './lib/media/img/imageupl.jpg',
					expiration: 604800
				}
				const sdimg = await imgbbUploader(options)
				console.log(sdimg.url_viewer)
				await kill.reply(from, `*OBS!* _Essa link tem duração de 7 dias, após isso a imagem será automaticamente deletada do servidor._\n\n${sdimg.url_viewer}`, id)
			} else {
				await kill.reply(from, 'Amigo(a), isso somente funciona com imagens.', id)
			}
			break
			
			
        case 'makesticker':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Faltou algo para usar de referência!', id)
            const stkm = await fetch(`http://api.fdci.se/rep.php?gambar=${body.slice(7)}`)
			const stimg = await stkm.json()
            let stkfm = stimg[Math.floor(Math.random() * stimg.length) + 1]
			console.log(stkfm)
            await kill.sendStickerfromUrl(from, stkfm)
			.catch(() => {
                kill.reply(from, 'Nenhuma imagem recebida ou servidor offline, tente mais tarde.', id)
            })
            break
			
			
		case 'morte':
		case 'death':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Coloque um nome, apenas um, nada de sobrenome ou nomes inteiros, ainda mais por sua segurança!', id)
			const predea = await axios.get(`https://api.agify.io/?name=${args[0]}`)
			await kill.reply(from, `Pessoas com este nome "${predea.data.name}" tendem a morrer aos ${predea.data.age} anos de idade.`, id)
			break			
			
			
	    case 'oculto':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isGroupMsg) return kill.reply(from, 'Apenas grupos!', id)
            const eur = await kill.getGroupMembers(groupId)
            const surpresa = eur[Math.floor(Math.random() * eur.length)]
			console.log(surpresa.id)
    	    var xvid = ["Negoes branquelos e feministas", `${pushname} se depilando na banheira`, `${pushname} comendo meu cuzinho`, `${pushname} quer me comer o que fazer?`, "lolis nuas e safadas", "Ursinhos Mansos Peludos e excitados", "mae do adm cozida na pressao", "Buceta de 500 cm inflavel da boneca chinesa lolita company", "corno manso batendo uma pra mim com meu rosto na webcam", "tigresa vip da buceta de mel", "belle delphine dando o cuzinho no barzinho da esquina", "fazendo anal no negao", "africanos nus e chupando pau", "anal africano", "comendo a minha tia", "lgbts fazendo ahegao", "adm gostoso tirando a roupa", "gays puxando o intestino pra fora", "Gore de porno de cachorro", "anoes baixinhos do pau grandao", "Anões Gays Dotados Peludos", "anões gays dotados penetradores de botas", "Ursinhos Mansos Peludos", "Jailson Mendes", "Vendo meu Amigo Comer a Esposa", "Golden Shower"]
            const surpresa2 = xvid[Math.floor(Math.random() * xvid.length)]
            await kill.sendTextWithMentions(from, `*EQUIPE ❌VIDEOS*\n\n_Caro usuário @${surpresa.id.replace(/@c.us/g, '')} ..._\n\n_Sou da administração do Xvideos e nós percebemos que você não entrou em sua conta por mais de 2 semanas e decidimos checar pra saber se está tudo OK com o(a) nosso(a) usuário(a) mais ativo(a)._ \n\n_Desde a última vez que você visitou nosso site, você procurou mais de centenas de vezes por_ *"${surpresa2}"* _(acreditamos ser sua favorita), viemos dizer que elas foram adicionadas e temos certeza que você irá gostar bastante._ \n_Esperamos você lá!_\n\n_Para o nosso usuário(a) favorito(a), com carinho, Equipe Xvideos._`)
            await sleep(2000)
            break
			
			
		case 'gender':
		case 'genero':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Coloque um nome, apenas um, nada de sobrenome ou nomes inteiros, ainda mais por sua segurança!', id)
			const seanl = await axios.get(`https://api.genderize.io/?name=${args[0]}`)
			const gender = seanl.data.gender.replace('female', 'mulheres').replace('male', 'homens')
			await kill.reply(from, `O nome "${seanl.data.name}" é mais usado por ${gender}.`, id)
			break
			
			
        case 'detector' :
            if (!isGroupMsg) return kill.reply(from, 'Apenas grupos!', id)
			await kill.reply(from, 'Calculando foto dos participantes do grupo...', id)
            await sleep(3000)
            const eu = await kill.getGroupMembers(groupId)
            const gostosa = eu[Math.floor(Math.random() * eu.length)]
			console.log(gostosa.id)
            await kill.sendTextWithMentions(from, `*ＤＥＴＥＣＴＯＲ   ＤＥ  ＧＯＳＴＯＳＡＳ👩‍⚕️*\n\n*pi pi pi pi*  \n*pipipipi🚨🚨🚨pipipipi🚨🚨🚨pipipipi🚨🚨🚨pipi*\n\n@${gostosa.id.replace(/@c.us/g, '')} *PARADA(O) AÍ🖐*\n\n*VOCÊ ACABA DE RECEBER DUAS MULTAS*\n\n*1 por não dar bom dia,boa tarde,boa noite e outra por ser muito*\n\n*gostosa(o)*\n\n*valor da multa:*\n*FOTO DA TETINHA NO PV kkkkk*`)
            await sleep(2000)
            break			

			
			
		case 'math':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Você não especificou uma conta matematica.', id)
            const mtk = body.slice(6)
            if (typeof math.evaluate(mtk) !== "number") {
            kill.reply(from, `Você definiu mesmo uma conta? Isso não parece uma.`, id)
			} else {
				kill.reply(from, `_A equação:_\n\n*${mtk}*\n\n_tem resultado de:_\n\n*${math.evaluate(mtk)}*`, id)
			}
			break
			
			
		case 'inverter':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Você não especificou uma frase para ser invertida.', id)
			const inver = body.slice(10).split('').reverse().join('')
			await kill.reply(from, inver, id)
			break
			
			
		case 'contar':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Isso possui 0 letras, afinal, não há texto.', id)
			const count = body.slice(8).length
			await kill.reply(from, `O texto possui ${count} letras.`, id)
			break
			
			
        case 'giphy':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			gark = body.trim().split(/ +/).slice(1)
			const link = gark.length !== 0 ? gark[0] : ''
            if (gark.length !== 1) return kill.reply(from, `Ownn, você esqueceu de inserir o link?`, id)
            const isGiphy = link.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
            const isMediaGiphy = link.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
            if (isGiphy) {
                const getGiphyCode = link.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return kill.reply(from, 'Que peninha! O código de download dele está distante demais, mas talvez se você tentar novamente *apenas mais 1 vez...*', id) }
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                kill.sendGiphyAsSticker(from, smallGifUrl)
                .catch((err) => kill.reply(from, `Um passarinho me disse que esse erro está relacionado ao envio do sticker...`, id))
            } else if (isMediaGiphy) {
                const gifUrl = link.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return kill.reply(from, 'Que peninha! O código de download dele está distante demais, mas talvez se você tentar novamente *apenas mais 1 vez...*', id) }
                const smallGifUrl = link.replace(gifUrl[0], 'giphy-downsized.gif')
                kill.sendGiphyAsSticker(from, smallGifUrl)
                .catch(() => {
                    kill.reply(from, `Um passarinho me disse que esse erro está relacionado ao envio do sticker...`, id)
                })
            } else {
                await kill.reply(from, 'Desculpa, mas eu só posso aceitar links do giphy.', id)
            }
            break


		case 'msg':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Você esqueceu de inserir uma mensagem... e.e', id)
			await kill.sendText(from, `${body.slice(5)}`)
			break
			
			
		case 'id':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
			kill.reply(from, `A ID desse grupo é ${groupId}`, id)
			break
			
        case 'fake':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (isGroupMsg && isGroupAdmins) {
				if (args.length !== 1) return kill.reply(from, 'Você esqueceu de colocar se quer ativado [on], ou desativado [off].', id)
				if (args[0] == 'on') {
					faki.push(chatId)
					fs.writeFileSync('./lib/config/fake.json', JSON.stringify(faki))
					kill.reply(from, 'Anti-Fakes habilitado.', id)
				} else if (args[0] == 'off') {
					let yath = faki.indexOf(chatId)
					faki.splice(yath, 1)
					fs.writeFileSync('./lib/config/fake.json', JSON.stringify(faki))
					kill.reply(from, 'Anti-fakes desabilitado.', id)
				}
			} else if (isGroupMsg && isOwner) {
				if (args.length !== 1) return kill.reply(from, 'Você esqueceu de colocar se quer ativado [on], ou desativado [off].', id)
				if (args[0] == 'on') {
					faki.push(chatId)
					fs.writeFileSync('./lib/config/fake.json', JSON.stringify(faki))
					kill.reply(from, 'Anti-Fakes habilitado.', id)
				} else if (args[0] == 'off') {
					let yath = faki.indexOf(chatId)
					faki.splice(yath, 1)
					fs.writeFileSync('./lib/config/fake.json', JSON.stringify(faki))
					kill.reply(from, 'Anti-fakes desabilitado.', id)
				}
            } else {
                kill.reply(from, mess.error.Ga, id)
            }
            break
			
			
        case 'blacklist':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg && isGroupAdmins) {
				if (args.length !== 1) return kill.reply(from, 'Defina entre on e off!', id)
				if (args[0] == 'on') {
					bklist.push(chatId)
					fs.writeFileSync('./lib/config/blacklist.json', JSON.stringify(bklist))
					kill.reply(from, 'Anti números acionado.\nUse /bklist (Número) para adicionar números.', id)
				} else if (args[0] == 'off') {
					let exclu = bklist.indexOf(chatId)
					bklist.splice(exclu, 1)
					fs.writeFileSync('./lib/config/blacklist.json', JSON.stringify(bklist))
					kill.reply(from, 'Anti números offline.', id)
				}
			} else if (isGroupMsg && isOwner) {
				if (args.length !== 1) return kill.reply(from, 'Defina entre on e off!', id)
				if (args[0] == 'on') {
					bklist.push(chatId)
					fs.writeFileSync('./lib/config/blacklist.json', JSON.stringify(bklist))
					kill.reply(from, 'Anti números acionado.\nUse /bklist (Número) para adicionar números.', id)
				} else if (args[0] == 'off') {
					let exclu = bklist.indexOf(chatId)
					bklist.splice(exclu, 1)
					fs.writeFileSync('./lib/config/blacklist.json', JSON.stringify(bklist))
					kill.reply(from, 'Anti números offline.', id)
				}
            } else {
                kill.reply(from, mess.error.Ga, id)
            }
            break	
		
			
        case 'bklist':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg && isGroupAdmins) {
				if (args[0] == 'on') {
					if (args.length == 0) return kill.reply(from, 'Você deve definir [on e off] e em seguida o número da pessoa.', id)
					const bkls = body.slice(11) + '@c.us'
					atbk.push(bkls)
					fs.writeFileSync('./lib/config/anti.json', JSON.stringify(atbk))
					await kill.reply(from, 'Número adicionado a black-list', id)
				} else if (args[0] == 'off') {
					if (args.length == 0) return kill.reply(from, 'Você deve definir [on e off] e em seguida o número da pessoa.', id)
					const bkls = body.slice(11) + '@c.us'
					let blks = atbk.indexOf(bkls)
					atbk.splice(blks, 1)
					fs.writeFileSync('./lib/config/anti.json', JSON.stringify(atbk))
					await kill.reply(from, 'Número removido da black-list', id)
				} else {
					await kill.reply(from, 'Você deve definir [on e off] e em seguida o número da pessoa.', id)
				}
			} else if (isGroupMsg && isOwner) {
				if (args[0] == 'on') {
					if (args.length == 0) return kill.reply(from, 'Você deve definir [on e off] e em seguida o número da pessoa.', id)
					const bkls = body.slice(11) + '@c.us'
					atbk.push(bkls)
					fs.writeFileSync('./lib/config/anti.json', JSON.stringify(atbk))
					await kill.reply(from, 'Número adicionado a black-list', id)
				} else if (args[0] == 'off') {
					if (args.length == 0) return kill.reply(from, 'Você deve definir [on e off] e em seguida o número da pessoa.', id)
					const bkls = body.slice(11) + '@c.us'
					let blks = atbk.indexOf(bkls)
					atbk.splice(blks, 1)
					fs.writeFileSync('./lib/config/anti.json', JSON.stringify(atbk))
					await kill.reply(from, 'Número removido da black-list', id)
				} else {
					await kill.reply(from, 'Você deve definir [on e off] e em seguida o número da pessoa.', id)
				}
            } else {
                kill.reply(from, mess.error.Ga, id)
            }
            break
			
			
		case 'onlyadms':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			onar = body.trim().split(/ +/).slice(1)
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            if (!isGroupAdmins) return kill.reply(from, mess.error.Ga, id)
            if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
			if (onar.length !== 1) return kill.reply(from, `Você esqueceu de colocar se quer ativado [On], ou desativado [Off].`, id)
            if (onar[0] == 'on') {
				kill.setGroupToAdminsOnly(groupId, true).then(() => kill.sendText(from, 'Aqui está a prova de poder dos ademiros!\nO silenciador :O'))
			} else if (onar[0] == 'off') {
				kill.setGroupToAdminsOnly(groupId, false).then(() => kill.sendText(from, 'E os membros comuns podem voltar a badernar! e.e'))
			} else {
				kill.reply(from, `Você esqueceu de colocar se quer ativado [On], ou desativado [Off].`, id)
			}
			break
			
			
		case 'legiao':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (isGroupMsg) return kill.reply(from, 'Pode ser que esse grupo não permita links, então use esse comando no PV okay?', id)
			kill.sendLinkWithAutoPreview(from, 'https://chat.whatsapp.com/H53MdwhtnRf7TGX1VJ2Jje', 'Que otimo que se interessou pelo Legião Z!\nAi está nosso grupo!', id)
			break
			
			
		case 'revoke':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            if (!isGroupAdmins) return kill.reply(from, mess.error.Ga, id)
            if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
			await kill.revokeGroupInviteLink(groupId).then(() => kill.reply(from, 'Prontinho, sua ordem foi realizada! e.e', id))
			break
			
			
        case 'slogan':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Cade a frase?', id)
            const slog = await axios.get(`http://api.haipbis.xyz/randomcooltext?text=${body.slice(8)}`)
			await kill.sendFileFromUrl(from, slog.data.image, slog.data.text, 'Elegante não é?', id)
            break
			
			
		case 'setimage':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            if (!isGroupAdmins) return kill.reply(from, mess.error.Ga, id)
            if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
			if (isMedia && type == 'image' || isQuotedImage) {
				const dataMedia = isQuotedImage ? quotedMsg : message
				const _mimetype = dataMedia.mimetype
				const mediaData = await decryptMedia(dataMedia, uaOverride)
				const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
				const picgp = await kill.getProfilePicFromServer(chat.id)
				if (picgp == undefined) {
					var backup = errorurl
				} else {
					var backup = picgp
				}
				await kill.sendFileFromUrl(from, backup, 'group.png', 'Para caso você mude de ideia...', id)
				await kill.setGroupIcon(groupId, imageBase64)
			} else if (args.length == 1) {
				if (!isUrl(url)) { await kill.reply(from, 'Tem certeza que isso é um link apenas para a foto?', id) }
				const picgpo = await kill.getProfilePicFromServer(chat.id)
				if (picgpo == undefined) {
					var back = errorurl
				} else {
					var back = picgpo
				}
				await kill.sendFileFromUrl(from, back, 'group.png', 'Caso você mude de ideia...', id)
				kill.setGroupIconByUrl(groupId, url).then((r) => (!r && r !== undefined)
				? kill.reply(from, 'É o que eu pensava, não existem fotos nesse link, ou o link contem fotos demais.', id)
				: kill.reply(from, 'Isso! Agora o grupo está de cara nova haha!', id))
			} else {
				kill.reply(from, `Acho que você esta usando errado em!`)
			}
			break

			
		case 'img':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isQuotedSticker) {
                await kill.reply(from, mess.wait, id)
                try {
                    const mediaData = await decryptMedia(quotedMsg, uaOverride)
                    const stickerImg = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await kill.sendFile(from, stickerImg, '', '', id)
                } catch (err) {
                    console.error(err)
                    await kill.reply(from, 'Desculpe, aconteceu algum erro ao converter...', id)
                }
            } else {
                await kill.reply(from, 'Isso não é um sticker certo?', id)
            }
			break

        case 'randomanime':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const nime2 = await randomNimek('anime')
			console.log(nime2.data)
            await kill.sendFileFromUrl(from, nime2, ``, 'Ui Ui...', id)
            break


        case 'frase':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (double == 1) {
				const skya = await axios.get('https://mhankbarbar.tech/api/quotesnime/random').json() 
				const quot = skya.data.data.quote
				kill.reply(from, mess.wait, id)
				await sleep(5000)
				translate(quot, 'pt')
					.then((quote) => kill.reply(from, `➸ *Frase* : ${quote}\n➸ *Personagem* : ${skya.data.data.chara}\n➸ *Anime* : ${skya.data.data.anime}`, id))
			} else if (double == 2) {
				const aiquote = await axios.get("http://inspirobot.me/api?generate=true")
				await kill.sendFileFromUrl(from, aiquote.data, 'quote.jpg', '~Não entendi nada, mas vamos seguir o roteiro...~\n\n❤️' , id )
			}
            break


        case 'make':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, `Você precisa inserir uma frase após o comando.`, id)
            const nulisq = body.slice(6)
            const nulisp = await tulis(nulisq)
            await kill.sendImage(from, `${nulisp}`, '', 'Belo diário este seu em amigo...', id)
            .catch(() => {
                kill.reply(from, 'Que peninha, a imagem não quis enviar ou o servidor negou o acesso...', id)
            })
            break


        case 'neko':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const nekol = Math.floor(Math.random() * 4) + 1
            if (nekol == 1) {
				const neko5 = await axios.get(`https://nekos.life/api/v2/img/kemonomimi`)
				await kill.sendFileFromUrl(from, neko5.data.url, ``, `Nekoooo chann`, id)
            } else if (nekol == 2) {
				const neko2 = await axios.get(`https://nekos.life/api/v2/img/neko`)
				await kill.sendFileFromUrl(from, neko2.data.url, ``, `Nekooo`, id)
            } else if (nekol == 3) {
				const neko3 = await axios.get(`https://nekos.life/api/v2/img/ngif`)
				await kill.sendFileFromUrl(from, neko3.data.url, ``, `Nekooo`, id)
            } else if (nekol == 4) {
				const neko4 = await axios.get(`https://nekos.life/api/v2/img/fox_girl`)
				await kill.sendFileFromUrl(from, neko4.data.url, ``, `Nekooo`, id)
			}
            break


        case 'image':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Faltou um nome!', id)
            const linp = await fetch(`http://api.fdci.se/rep.php?gambar=${body.slice(7)}`)
			const pint = await linp.json()
            let erest = pint[Math.floor(Math.random() * pint.length) + 1]
			console.log(erest)
            await kill.sendFileFromUrl(from, erest, '', 'Havia muitas mas espero que curta a imagem que eu escolhi ^^!', id)
			.catch(() => {
                kill.reply(from, 'Nenhuma imagem recebida ou servidor offline, tente mais tarde.', id)
            })
            break
			
			
        case 'yaoi':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const yam = await fetch(`http://api.fdci.se/rep.php?gambar=yaoi`)
			const yaoi = await yam.json()
            let flyaoi = yaoi[Math.floor(Math.random() * yaoi.length) + 1]
            await kill.sendFileFromUrl(from, flyaoi, '', 'Tururu...', id)
			.catch(() => {
                kill.reply(from, 'Nenhuma imagem recebida ou servidor offline, tente mais tarde.', id)
            })
            break


        case 'life': 
            const dia = await axios.get(`https://docs-jojo.herokuapp.com/api/fml`)
			var acon = dia.data.result.fml
            await sleep(5000)
            translate(acon, 'pt')
                .then((lfts) => kill.reply(from, lfts, id))
			break


        case 'fox':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const fox = await axios.get(`https://some-random-api.ml/img/fox`)
			await kill.sendFileFromUrl(from, fox.data.link, ``, 'Que raposa lindinha <3', id)
			break


        case 'wiki':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Por favor, escreva corretamente.', id)
            const wiki = await axios.get(`https://docs-jojo.herokuapp.com/api/wiki?q=${body.slice(6)}`)
			var wikit = wiki.data.result
			console.log(wikit)
			kill.reply(from, mess.wait, id)
			await sleep(5000)
            translate(wikit, 'pt')
                .then((resulta) => kill.reply(from, resulta, id))
            break
			
			
        case 'nasa':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
        	if (args[0] == '-data') {
            	const nasa = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${args[1]}`)
				console.log(nasa.data.title)
				const explic = nasa.data.explanation
				await sleep(4000)
            	translate(explic, 'pt')
            	.then((result) => kill.sendFileFromUrl(from, `${nasa.data.url}`, '', `Titulo: ${nasa.data.title}\n\nData: ${nasa.data.date}\n\nMateria: ${result}`, id))
			} else {
            	const nasa = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`)
				console.log(nasa.data.title)
				const explic = nasa.data.explanation
				await sleep(4000)
            	translate(explic, 'pt')
            	.then((result) => kill.sendFileFromUrl(from, `${nasa.data.url}`, '', `Titulo: ${nasa.data.title}\n\nData: ${nasa.data.date}\n\nMateria: ${result}`, id))
			}
			break
			
			
        case 'stalkig':
			if (mute || pvmte) return console.log('Comando ignorado.')
            if (args.length == 0) return kill.reply(from, 'Defina o nome de um perfil para a busca.', id)
            const ig = await axios.get(`https://docs-jojo.herokuapp.com/api/stalk?username=${body.slice(9)}`)
			const stkig = JSON.stringify(ig.data)
			if (stkig == '{}') return kill.reply(from, 'Usuario não localizado.', id)
			await kill.sendFileFromUrl(from, `${ig.data.graphql.user.profile_pic_url}`, ``, `✪ Username: ${ig.data.graphql.user.username}\n\n✪ Biografia: ${ig.data.graphql.user.biography}\n\n✪ Seguidores: ${ig.data.graphql.user.edge_followed_by.count}\n\n✪ Seguindo: ${ig.data.graphql.user.edge_follow.count}\n\n✪ Verificada: ${ig.data.graphql.user.is_verified}`, id)
            break
			

        case 'stalktw':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Cade o username né?', id)
            const tw = await axios.get(`http://arugaz.my.id/api/media/stalktwitt?user=${body.slice(9)}`)
			var insta = tw.data.result.biography
            await kill.sendFileFromUrl(from, `${tw.data.result.profile_picture}`, ``, `Username: ${tw.data.result.username}\n\nNome: ${tw.data.result.fullname}\n\nbio: ${insta}\n\nSeguidores: ${tw.data.result.followers}\n\nSeguindo: ${tw.data.followings}`, id)
            break
			

        case 'twitter':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Cade o link né?', id)
            const twi = await axios.get(`http://arugaz.my.id/api/media/twvid?url=${body.slice(4)}`)
			await kill.sendFileFromUrl(from, twi.data.result.videos, ``, 'É um otimo video haha!\n~Mas o que diabos foi isso...~', id)
			.catch(() => {
						kill.reply(from, 'Essa não! Impediram meu acesso!\nQue desalmados!', id)
					})
            break


        case 'ig':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Cade o link né?', id)
            const iga = await axios.get(`https://arugaz.my.id/api/media/ig?url=${body.slice(4)}`)
			await kill.sendFileFromUrl(from, iga.data.result, ``, 'É um otimo video haha!\n~Mas o que diabos foi isso...~', id)
			.catch(() => {
						kill.reply(from, 'Essa não! Impediram meu acesso!\nQue desalmados!', id)
					})
            break
			
			
		case 'fatos':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			var anifac = ["dog", "cat", "bird", "panda", "fox", "koala"];
			var tsani = anifac[Math.floor(Math.random() * anifac.length)];
			const animl = await axios.get(`https://some-random-api.ml/facts/${tsani}`)
			const fatdat = animl.data.fact
			console.log(fatdat)
            translate(fatdat, 'pt')
			.then((result) => kill.reply(from, result, id))
			break
			
			
		case 'sporn':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            try {
				if (isGroupMsg) {
					if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
					if (args.length == 0) return kill.reply(from, 'Insira um termo de busca!', id)
					const xvide = await axios.get(`https://mnazria.herokuapp.com/api/porn?search=${body.slice(7)}`)
					const rexvi = xvide.data.result[0]
					await kill.sendFileFromUrl(from, `${rexvi.image}`, '', `Titulo: ${rexvi.title}\n\nAutor: ${rexvi.actors}\n\nDuração: ${rexvi.duration}\n\nLink: ${rexvi.url}`, id)
				} else {
					if (args.length == 0) return kill.reply(from, 'Insira um termo de busca!', id)
					const xvide = await axios.get(`https://mnazria.herokuapp.com/api/porn?search=${body.slice(7)}`)
					const rexvi = xvide.data.result[0]
					await kill.sendFileFromUrl(from, `${rexvi.image}`, '', `Titulo: ${rexvi.title}\n\nAutor: ${rexvi.actors}\n\nDuração: ${rexvi.duration}\n\nLink: ${rexvi.url}`, id)
				}
			} catch (error) {
				kill.reply(from, 'Falhei na busca do porno!', id)
			}
            break
			
			
		case 'xvideos':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            try {
				if (isGroupMsg) {
					if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
					if (args.length == 0) return kill.reply(from, 'Você esqueceu de inserir um link do xvideos?', id)
					const xv = await axios.get(`https://mnazria.herokuapp.com/api/porndownloadxvideos?url=${body.slice(9)}`)
					const xvidw = xv.data.mp4
					await kill.sendFileFromUrl(from, xvidw, 'video.mp4', 'Hmmm safadinho', id)
				} else {
					if (args.length == 0) return kill.reply(from, 'Você esqueceu de inserir um link do xvideos?', id)
					const xv = await axios.get(`https://mnazria.herokuapp.com/api/porndownloadxvideos?url=${body.slice(9)}`)
					const xvidw = xv.data.mp4
					await kill.sendFileFromUrl(from, xvidw, 'video.mp4', 'Hmmm safadinho', id)
				}
			} catch (error) {
				kill.reply(from, 'Falhei no download do porno!', id)
			}
            break
			
			
		case 'fb':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) return kill.reply(from, 'Você esqueceu de inserir um link do facebook?', id)
            const fb = await axios.get(`https://mnazria.herokuapp.com/api/fbdownloadervideo?url=${body.slice(4)}`)
			const fbdw = fb.data.resultSD
            await kill.sendFileFromUrl(from, fbdw, 'video.mp4', 'Excelente video!\n~Mas o que diabos aconteceu?...~', id)
			.catch((error) => {
				kill.reply(from, 'Minha nossa, algum tipo de força maligna me impediu de terminar o comando!', id)
			})
            break


        case 'mp3':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Você usou incorretamente.', id)
            axios.get(`http://st4rz.herokuapp.com/api/yta2?url=${body.slice(5)}`)
            .then(async(rest) => {
					var m3pa = rest.data.result
					var m3ti = rest.data.title
					var m3tu = rest.data.thumb
					var m3fo = rest.data.ext
					await kill.sendFileFromUrl(from, m3tu, '', `Titulo: ${m3ti}\nFormato:${m3fo}\n\nEspero que eu tenha acertado e...agora é so esperar! Mas evite novamente usar até que eu termine emm!`, id)
					await kill.sendFileFromUrl(from, m3pa, '', '', id)
                })
			break


        case 'mp4':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Você usou incorretamente.', id)
            axios.get(`http://st4rz.herokuapp.com/api/ytv2?url=${body.slice(5)}`)
            .then(async(rest) => {
					var mp4 = rest.data.result
					var tmp4 = rest.data.title
					var m4tu = rest.data.thumb
					var m4fo = rest.data.ext
					await kill.sendFileFromUrl(from, m4tu, '', `Titulo: ${tmp4}\nFormato:${m4fo}\n\nEspero que eu tenha acertado e...agora é so esperar! Mas evite novamente usar até que eu termine emm!`, id)
					await kill.sendFileFromUrl(from, mp4, `video.mp4`, tmp4, id)
                })
			break
			
			
        case 'play':
			if (mute || pvmte) return console.log('Comando ignorado.')
            if (args.length == 0) return kill.reply(from, 'Você usou incorretamente.', id)
            axios.get(`https://docs-jojo.herokuapp.com/api/yt-search?q=${body.slice(6)}`)
            .then(async (res) => {
				const pyre = res.data.result.result[0].publishedTime
				if (pyre == '' || pyre == 'null' || pyre == null || pyre == undefined || pyre == 'undefined') {
					var playre = 'Indefinido'
				} else if (pyre.endsWith('years ago')) {
                    var playre = pyre.replace('years ago', 'Anos atrás')
				} else if (pyre.endsWith('hours ago')) {
                    var playre = pyre.replace('hours ago', 'Horas atrás')
				} else if (pyre.endsWith('minutes ago')) {
                    var playre = pyre.replace('minutes ago', 'Minutos atrás')
				} else if (pyre.endsWith('day ago')) {
                    var playre = pyre.replace('day ago', 'Dia atrás')
				} else if (pyre.endsWith('months ago')) {
                    var playre = pyre.replace('months ago', 'Meses atrás')
				} else if (pyre.endsWith('seconds ago')) {
                    var playre = pyre.replace('seconds ago', 'Segundos atrás')
				}
				const asize = await axios.get(`http://st4rz.herokuapp.com/api/yta?url=http://youtu.be/${res.data.result.result[0].id}`)
				const afsize = asize.data.filesize.replace(' MB', '')
				console.log(afsize)
				if (afsize >= 16.0 || asize.data.filesize.endsWith('GB')) {
					kill.reply(from, `Desculpe, para evitar banimentos do WhatsApp, o limite de envio de audios é de 16MB, e esse possui ${asize.data.filesize}.`, id)
				} else {
					await kill.sendFileFromUrl(from, `${res.data.result.result[0].thumbnails[0].url}`, ``, `Titulo: ${res.data.result.result[0].title}\n\nLink: https://youtu.be/${res.data.result.result[0].id}\n\nDuração: ${res.data.result.result[0].duration} minutos\n\nFoi feito a: ${playre}\n\nVisualizações: ${res.data.result.result[0].viewCount.text}\n\nEspero que eu tenha acertado e...agora é so esperar, não use novamente até que eu termine esse!`, id)
					axios.get(`http://st4rz.herokuapp.com/api/yta2?url=http://youtu.be/${res.data.result.result[0].id}`)
					.then(async(rest) => {
						var m3pa = rest.data.result
						var m3ti = rest.data.title
						await kill.sendFileFromUrl(from, m3pa, '', '', id)
					})
				}
			})
            break
			
			
        case 'video':
			if (mute || pvmte) return console.log('Comando ignorado.')
            if (args.length == 0) return kill.reply(from, 'Você usou incorretamente.', id)
            axios.get(`https://docs-jojo.herokuapp.com/api/yt-search?q=${body.slice(6)}`)
            .then(async (res) => {
				const vyre = res.data.result.result[0].publishedTime
				if (vyre == '' || vyre == 'null' || vyre == null || vyre == undefined || vyre == 'undefined') {
					var videore = 'Indefinido'
				} else if (vyre.endsWith('years ago')) {
                    var videore = vyre.replace('years ago', 'Anos atrás')
				} else if (vyre.endsWith('hours ago')) {
                    var videore = vyre.replace('hours ago', 'Horas atrás')
				} else if (vyre.endsWith('minutes ago')) {
                    var videore = vyre.replace('minutes ago', 'Minutos atrás')
				} else if (vyre.endsWith('day ago')) {
                    var videore = vyre.replace('day ago', 'Dia atrás')
				} else if (vyre.endsWith('months ago')) {
                    var videore = vyre.replace('months ago', 'Meses atrás')
				} else if (vyre.endsWith('seconds ago')) {
                    var videore = vyre.replace('seconds ago', 'Segundos atrás')
				}
				const size = await axios.get(`http://st4rz.herokuapp.com/api/ytv?url=http://youtu.be/${res.data.result.result[0].id}}`)
				const fsize = size.data.filesize.replace(' MB', '').replace('Download  ', 'Impossivel calcular')
				console.log(fsize)
				const impo = size.data.filesize.replace('Download  ', 'um peso muito superior que não posso calcular')
				if (fsize >= 16.0 || size.data.filesize.endsWith('Download  ') || size.data.filesize.endsWith('GB')) {
					kill.reply(from, `Desculpe, para evitar banimentos do WhatsApp, o limite de envio de videos é de 16MB, e esse possui ${impo.replace('    ', ' ')}.`, id)
				} else {
					await kill.sendFileFromUrl(from, `${res.data.result.result[0].thumbnails[0].url}`, ``, `Titulo: ${res.data.result.result[0].title}\n\nLink: https://youtu.be/${res.data.result.result[0].id}\n\nDuração: ${res.data.result.result[0].duration} minutos\n\nFoi feito a: ${videore}\n\nVisualizações: ${res.data.result.result[0].viewCount.text}\n\nEspero que eu tenha acertado e...agora é so esperar, não use novamente até que eu termine esse!`, id)
					axios.get(`http://st4rz.herokuapp.com/api/ytv2?url=https://youtu.be/${res.data.result.result[0].id}`)
					.then(async(rest) => {
						await kill.sendFileFromUrl(from, `${rest.data.result}`, ``, ``, id)
					})
				}
			})
            break
			

		case 'qr':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const qrco = body.slice(4)
			await kill.sendFileFromUrl(from, `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrco}`, '', 'Sua mensagem foi inserida nesse QRCode, aproveite.\n\nBy KillovSky - Íris.', id)
			break


		case 'send':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) return kill.reply(from, 'Você esqueceu de por um link de imagem haha!', id)
			const file = body.slice(6)
			if (file.endsWith('.jpg')) {
				await kill.sendFileFromUrl(from, file, '', '', id)
				.catch(() => {
					kill.reply(from, 'Ah! Isso não aparenta ser uma imagem, ou pode ser maior que o esperado...', id)
				})
			} else if (file.endsWith('.png')) {
				await kill.sendFileFromUrl(from, file, '', '', id)
				.catch(() => {
					kill.reply(from, 'Ah! Isso não aparenta ser uma imagem, ou pode ser maior que o esperado...', id)
				})
            } else {
                kill.reply(from, 'Desculpa, apenas fotos são permitidas, exclusivamente .jpg e .png ^^', id)
            }
			break
			
			
        case 'quote':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
		    arks = body.trim().split(/ +/).slice(1)
            ark = body.trim().substring(body.indexOf(' ') + 1)
            if (arks.length >= 1) {
                const quotes = ark.split('|')[0]
                const qauth = ark.split('|')[1]
                kill.reply(from, 'Entendido! Aguarde a conclusão do comando.!', id)
                const quoteimg = await killo.quote(quotes, qauth)
				console.log(quoteimg)
                await kill.sendFileFromUrl(from, quoteimg, '', 'Compreensivel.', id)
                .catch(() => {
					kill.reply(from, 'Nossa! Parece que fui negada ao enviar a foto...', id)
				})
            } else {
                kill.reply(from, `Você realmente está usando corretamente?`)
            }
            break		


       case 'translate':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length != 1) return kill.reply(from, `Isso é pequeno demais para ser traduzido...`, id)
            if (!quotedMsg) return kill.reply(from, `Você esqueceu de marcar a mensagem para tradução.`, id)
            const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
			kill.reply(from, mess.wait, id)
			await sleep(5000)
            translate(quoteText, args[0])
                .then((result) => kill.reply(from, result, id))
                .catch(() => kill.reply(from, 'Bloqueio de IP google, ou erro em tradução...'))
            break


        case 'tts': // Esse é enormeeeee, fazer o que, sou baiano pra jogar noutro js
            if (args.length == 1) return kill.reply(from, 'Compreensivel, mas não usavel, você esqueceu de definir idioma e frase.')
            const ttsId = require('node-gtts')('id')
            const ttsEn = require('node-gtts')('en')
			const ttsJp = require('node-gtts')('ja')
            const ttsAr = require('node-gtts')('ar')
            const ttsAf = require('node-gtts')('af')
            const ttsSq = require('node-gtts')('sq')
			const ttsHy = require('node-gtts')('hy')
            const ttsCa = require('node-gtts')('ca')
			const ttsZh = require('node-gtts')('zh')
			const ttsCn = require('node-gtts')('zh-cn')
			const ttsTw = require('node-gtts')('zh-tw')
			const ttsYu = require('node-gtts')('zh-yue')
			const ttsHr = require('node-gtts')('hr')
			const ttsCs = require('node-gtts')('cs')
            const ttsDa = require('node-gtts')('da')
            const ttsNl = require('node-gtts')('nl')
			const ttsAu = require('node-gtts')('en-au')
            const ttsUk = require('node-gtts')('en-uk')
			const ttsUs = require('node-gtts')('en-us')
			const ttsEo = require('node-gtts')('eo')
			const ttsFi = require('node-gtts')('fi')
			const ttsFr = require('node-gtts')('fr')
			const ttsEl = require('node-gtts')('el')
			const ttsHt = require('node-gtts')('ht')
            const ttsHi = require('node-gtts')('hi')
            const ttsHu = require('node-gtts')('hu')
			const ttsIs = require('node-gtts')('is')
            const ttsIt = require('node-gtts')('it')
            const ttsKo = require('node-gtts')('ko')
            const ttsLa = require('node-gtts')('la')
			const ttsLv = require('node-gtts')('lv')
            const ttsMk = require('node-gtts')('mk')
			const ttsNo = require('node-gtts')('no')
			const ttsPl = require('node-gtts')('pl')
			const ttsRo = require('node-gtts')('ro')
			const ttsSr = require('node-gtts')('sr')
			const ttsSk = require('node-gtts')('sk')
			const ttsEs = require('node-gtts')('es')
            const ttsSp = require('node-gtts')('es-es')
            const ttsSu = require('node-gtts')('es-us')
			const ttsSw = require('node-gtts')('sw')
            const ttsSv = require('node-gtts')('sv')
			const ttsTa = require('node-gtts')('ta')
			const ttsTh = require('node-gtts')('th')
			const ttsTr = require('node-gtts')('tr')
			const ttsVi = require('node-gtts')('vi')
			const ttsCy = require('node-gtts')('cy')
            const ttsDe = require('node-gtts')('de')
            const ttsBr = require('node-gtts')('pt-br')
			const ttsPt = require('node-gtts')('pt')
            const ttsRu = require('node-gtts')('ru')
            const dataText = body.slice(8)
            if (dataText === '') return kill.reply(from, 'Ora ora, temos um baka! Você esqueceu de colocar a frase pra falar.', id)
            if (dataText.length > 500) return kill.reply(from, 'Desculpa, mas o limite são 500 letras...', id)
            var dataBhs = body.slice(5, 7)
			if (dataBhs == 'id') {
                ttsId.save('./lib/media/tts/resId.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resId.mp3', id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./lib/media/tts/resEn.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resEn.mp3', id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./lib/media/tts/resJp.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resJp.mp3', id)
                })
            } else if (dataBhs == 'de') {
                ttsDe.save('./lib/media/tts/resDe.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resDe.mp3', id)
                })
            } else if (dataBhs == 'br') {
                ttsBr.save('./lib/media/tts/resBr.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resBr.mp3', id)
                })
            } else if (dataBhs == 'ru') {
                ttsRu.save('./lib/media/tts/resRu.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resRu.mp3', id)
                })
			} else if (dataBhs == 'ar') {
                ttsAr.save('./lib/media/tts/resAr.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resAr.mp3', id)
                })
            } else if (dataBhs == 'pt') {
                ttsPt.save('./lib/media/tts/resPt.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resPt.mp3', id)
                })
            } else if (dataBhs == 'af') {
                ttsAf.save('./lib/media/tts/resAf.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resAf.mp3', id)
                })
            } else if (dataBhs == 'sq') {
                ttsSq.save('./lib/media/tts/resSq.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resSq.mp3', id)
                })
            } else if (dataBhs == 'hy') {
                ttsHy.save('./lib/media/tts/resHy.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resHy.mp3', id)
                })
            } else if (dataBhs == 'ca') {
                ttsCa.save('./lib/media/tts/resCa.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resCa.mp3', id)
                })
            } else if (dataBhs == 'zh') {
                ttsZh.save('./lib/media/tts/resZh.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resZh.mp3', id)
                })		
            } else if (dataBhs == 'cn') {
                ttsCn.save('./lib/media/tts/resCn.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resCn.mp3', id)
                })
            } else if (dataBhs == 'tw') {
                ttsTw.save('./lib/media/tts/resTw.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resTw.mp3', id)
                })
            } else if (dataBhs == 'yu') {
                ttsYu.save('./lib/media/tts/resYue.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resYue.mp3', id)
                })
			} else if (dataBhs == 'hr') {
                ttsHr.save('./lib/media/tts/resHr.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resHr.mp3', id)
                })
            } else if (dataBhs == 'cs') {
                ttsCs.save('./lib/media/tts/resCs.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resCs.mp3', id)
                })
            } else if (dataBhs == 'da') {
                ttsDa.save('./lib/media/tts/resDa.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resDa.mp3', id)
                })
            } else if (dataBhs == 'nl') {
                ttsNl.save('./lib/media/tts/resNl.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resNl.mp3', id)
                })
            } else if (dataBhs == 'au') {
                ttsAu.save('./lib/media/tts/resAu.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resAu.mp3', id)
                })
            } else if (dataBhs == 'uk') {
                ttsUk.save('./lib/media/tts/resUk.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resUk.mp3', id)
                })
            } else if (dataBhs == 'us') {
                ttsUs.save('./lib/media/tts/resUs.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resUs.mp3', id)
                })
            } else if (dataBhs == 'eo') {
                ttsEo.save('./lib/media/tts/resEo.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resEo.mp3', id)
                })
            } else if (dataBhs == 'fi') {
                ttsFi.save('./lib/media/tts/resFi.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resFi.mp3', id)
                })
            } else if (dataBhs == 'fr') {
                ttsFr.save('./lib/media/tts/resFr.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resFr.mp3', id)
                })
            } else if (dataBhs == 'el') {
                ttsEl.save('./lib/media/tts/resEl.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resEl.mp3', id)
                })
            } else if (dataBhs == 'ht') {
                ttsHt.save('./lib/media/tts/resJp.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resHt.mp3', id)
                })
            } else if (dataBhs == 'hi') {
                ttsHi.save('./lib/media/tts/resHi.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resHi.mp3', id)
                })
            } else if (dataBhs == 'hu') {
                ttsHu.save('./lib/media/tts/resHu.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resHu.mp3', id)
                })
            } else if (dataBhs == 'is') {
                ttsIs.save('./lib/media/tts/resIs.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resIs.mp3', id)
                })
			} else if (dataBhs == 'it') {
                ttsIt.save('./lib/media/tts/resIt.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resIt.mp3', id)
                })
            } else if (dataBhs == 'ko') {
                ttsKo.save('./lib/media/tts/resKo.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resKo.mp3', id)
                })
            } else if (dataBhs == 'la') {
                ttsLa.save('./lib/media/tts/resLa.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resLa.mp3', id)
                })
            } else if (dataBhs == 'lv') {
                ttsLv.save('./lib/media/tts/resLv.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resLv.mp3', id)
                })
            } else if (dataBhs == 'mk') {
                ttsMk.save('./lib/media/tts/resMk.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resMk.mp3', id)
                })
            } else if (dataBhs == 'no') {
                ttsNo.save('./lib/media/tts/resNo.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resNo.mp3', id)
                })
            } else if (dataBhs == 'pl') {
                ttsPl.save('./lib/media/tts/resPl.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resPl.mp3', id)
                })		
            } else if (dataBhs == 'ro') {
                ttsRo.save('./lib/media/tts/resRo.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resRo.mp3', id)
                })
            } else if (dataBhs == 'sr') {
                ttsSr.save('./lib/media/tts/resSr.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resSr.mp3', id)
                })
            } else if (dataBhs == 'sk') {
                ttsSk.save('./lib/media/tts/resSk.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resSk.mp3', id)
                })
			} else if (dataBhs == 'es') {
                ttsEs.save('./lib/media/tts/resEs.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resEs.mp3', id)
                })
            } else if (dataBhs == 'sp') {
                ttsSp.save('./lib/media/tts/resSp.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resSp.mp3', id)
                })
            } else if (dataBhs == 'su') {
                ttsSu.save('./lib/media/tts/resSu.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resSu.mp3', id)
                })
            } else if (dataBhs == 'sw') {
                ttsSw.save('./lib/media/tts/resSw.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resSk.mp3', id)
                })
            } else if (dataBhs == 'sv') {
                ttsSv.save('./lib/media/tts/resSv.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resSv.mp3', id)
                })
            } else if (dataBhs == 'ta') {
                ttsTa.save('./lib/media/tts/resTa.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resTa.mp3', id)
                })
            } else if (dataBhs == 'tr') {
                ttsTr.save('./lib/media/tts/resTr.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resTr.mp3', id)
                })
            } else if (dataBhs == 'vi') {
                ttsVi.save('./lib/media/tts/resVi.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resVi.mp3', id)
                })
            } else if (dataBhs == 'cy') {
                ttsCy.save('./lib/media/tts/resCy.mp3', dataText, function () {
                    kill.sendPtt(from, './lib/media/tts/resCy.mp3', id)
                })
            } else {
                kill.reply(from, `Hmm, '${body.slice(5, 7)}' não é um idioma compativel, para idiomas compativeis digite /idiomas.`, id)
            }
            break


        case 'idiomas':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            kill.sendText(from, lang, id)
            break
			
			
		case 'resposta':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) return kill.reply(from, 'Faltou a frase para ser adicionada.', id)
			fs.appendFile('./lib/config/reply.txt', `\n${body.slice(10)}`)
			await kill.reply(from, 'Frase adicionada a Íris.', id)
			break


        case 'speak':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const sppt = require('node-gtts')('pt-br')
			try {
				const spiris = await axios.get(`http://simsumi.herokuapp.com/api?text=${body.slice(7)}&lang=pt`)
				const a = spiris.data.success
				if (a == '') {
					console.log('Request falhou, usando respostas locais...')
					let rfua = fs.readFileSync('./lib/config/reply.txt').toString().split('\n')
					let repy = rfua[Math.floor(Math.random() * rfua.length)]
					let resfl = repy.replace('%name$', '${name}').replace('%battery%', '${lvpc}')
					console.log(resfl)
					sppt.save('./lib/media/tts/resPtm.mp3', resfl, function () {
					kill.sendPtt(from, './lib/media/tts/resPtm.mp3', id)
					})		
				} else {
					sppt.save('./lib/media/tts/resPtm.mp3', a, function () {
						kill.sendPtt(from, './lib/media/tts/resPtm.mp3', id)
					})
				}
			} catch (error) {
					console.log('Request falhou, usando respostas locais...')
					let rfua = fs.readFileSync('./lib/config/reply.txt').toString().split('\n')
					let repy = rfua[Math.floor(Math.random() * rfua.length)]
					let resfl = repy.replace('%name$', '${name}').replace('%battery%', '${lvpc}')
					console.log(resfl)
					sppt.save('./lib/media/tts/resPtm.mp3', resfl, function () {
					kill.sendPtt(from, './lib/media/tts/resPtm.mp3', id)
					})
			}
			break
			
			
        case 'curiosidade':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const rcurio = fs.readFileSync('./lib/config/curiosidades.txt').toString().split('\n')
			const rsidd = rcurio[Math.floor(Math.random() * rcurio.length)]
			console.log(rsidd)
			await kill.reply(from, rsidd, id)
			break
			
			
        case 'trecho':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const rcit = fs.readFileSync('./lib/config/frases.txt').toString().split('\n')
			const racon = rcit[Math.floor(Math.random() * rcit.length)]
			console.log(racon)
			await kill.reply(from, racon, id)
			break
			

        case 'criador':
            kill.sendContact(from, config.owner)
			kill.reply(from, 'Se ele não responder apenas espere, é raro ele sair da internet ~Carinha viciado sabe~, mas se acontecer foi algo importante.', id)
            break
			
			
		case 'akinator':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const region = 'pt';
			if (args[0] == '-r') {
				let akinm = args[1].match(/^[0-9]+$/)
				if (!akinm) return kill.reply(from, 'Responda apenas com 0 ou 1!\n0 = Sim\n1 = Não', id)
				const aki = new Aki(region);
				await aki.start();
				const myAnswer = `${args[1]}`
				await aki.step(myAnswer);
				await kill.reply(from, `Questão: ${aki.question}\n\nProgresso: ${aki.progress}\n\nResponda com /akinator -r [0 ou 1], 0 = sim, 1 = não.`, id)
			} else {
				const aki = new Aki(region);
				await aki.start()
				await kill.reply(from, `Questão: ${aki.question}\n\nResponda com /akinator -r [0 ou 1], 0 = sim, 1 = não.`, id)
			}
			break
			

        case 'iris':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			try {
				const iris = await axios.get(`http://simsumi.herokuapp.com/api?text=${body.slice(6)}&lang=pt`)
				if (iris.data.success == '') {
					console.log('Request falhou, usando respostas locais...')
					let rndrl = fs.readFileSync('./lib/config/reply.txt').toString().split('\n')
					let repl = rndrl[Math.floor(Math.random() * rndrl.length)]
					let resmf = repl.replace('%name$', `${name}`).replace('%battery%', `${lvpc}`)
					console.log(resmf)
					kill.reply(from, resmf, id)
				} else {
					await kill.reply(from, iris.data.success, id)
				}
			} catch (error) {
					console.log('Request falhou, usando respostas locais...')
					let rndrl = fs.readFileSync('./lib/config/reply.txt').toString().split('\n')
					let repl = rndrl[Math.floor(Math.random() * rndrl.length)]
					let resmf = repl.replace('%name$', `${name}`).replace('%battery%', `${lvpc}`)
					console.log(resmf)
					kill.reply(from, resmf, id)
			}
			break


        case 'wallpaper':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Você precisa me dizer do que quer seu wallpaper!', id)
            const quere = body.slice(6)
            const wallp = await wall(quere)
            console.log(wallp)
            await kill.sendFileFromUrl(from, wallp, 'wallp.jpg', '', id)
            break


        case 'ping':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            kill.sendText(from, `Pong!\n_Minha velocidade é de ${processTime(t, moment())} segundos._`)
            break


        case 'donate':
		case 'doar':
            kill.sendText(from, donate, id)
            break


        case 'roll':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const dice = Math.floor(Math.random() * 6) + 1
            await kill.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png')
            break


        case 'flip':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const side = Math.floor(Math.random() * 2) + 1
            if (side == 1) {
               kill.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
            } else {
               kill.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
            }
            break


       case 'poll':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            feature.getpoll(kill, message, pollfile, voterslistfile)
            break    


       case 'vote' :
            feature.voteadapter(kill, message, pollfile, voterslistfile)
            break


       case 'newpoll':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            feature.adminpollreset(kill, message, message.body.slice(9), pollfile, voterslistfile)
            break


       case 'ins': 
            feature.addcandidate(kill, message, message.body.slice(5), pollfile, voterslistfile)
            break


        case 'nsfw':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
       	    const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (args.length !== 1) return kill.reply(from, 'Defina enable ou disable', id)
			if (isGroupMsg && isGroupOwner) {
				if (args[0].toLowerCase() == 'enable') {
					nsfw_.push(chat.id)
					fs.writeFileSync('./lib/config/NSFW.json', JSON.stringify(nsfw_))
					kill.reply(from, 'Comandos NSFW ativados neste grupo!', id)
				} else if (args[0].toLowerCase() == 'disable') {
					nsfw_.splice(chat.id, 1)
					fs.writeFileSync('./lib/config/NSFW.json', JSON.stringify(nsfw_))
					kill.reply(from, 'Comandos nsfw desativamos para este grupo.', id)
				} else {
					kill.reply(from, 'Defina enable ou disable', id)
				}
			} else if (isGroupMsg && isOwner) {
				if (args[0].toLowerCase() == 'enable') {
					nsfw_.push(chat.id)
					fs.writeFileSync('./lib/config/NSFW.json', JSON.stringify(nsfw_))
					kill.reply(from, 'Comandos NSFW ativados neste grupo!', id)
				} else if (args[0].toLowerCase() == 'disable') {
					nsfw_.splice(chat.id, 1)
					fs.writeFileSync('./lib/config/NSFW.json', JSON.stringify(nsfw_))
					kill.reply(from, 'Comandos nsfw desativamos para este grupo.', id)
				} else {
					kill.reply(from, 'Defina enable ou disable', id)
				}
			} else if (isGroupMsg) {
				await kill.reply(from, 'Desculpe, somente os administradores podem usar esse comando...', id)
			} else {
				await kill.reply(from, 'Esse comando apenas pode ser usado em grupos!', id)
			}
            break


        case 'welcome':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
			if (!isOwner) return kill.reply(from, mess.error.Kl, id)
            if (args.length !== 1) return kill.reply(from, 'Você esqueceu de colocar se quer ativado [on], ou desativado [off].', id)
			if (args[0] == 'on') {
                welkom.push(chat.id)
                fs.writeFileSync('./lib/config/welcome.json', JSON.stringify(welkom))
                kill.reply(from, 'Feito! As funções de Boas-Vindas e Good-Bye foram acionadas.', id)
			} else if (args[0] == 'off') {
				let welcom = welkom.indexOf(chatId)
                welkom.splice(welcom, 1)
                fs.writeFileSync('./lib/config/welcome.json', JSON.stringify(welkom))
                kill.reply(from, 'Entendido! Desativei as opções de Boas-Vindas e Good-Bye.', id)
            } else {
                kill.reply(from, 'Você esqueceu de colocar se quer ativado [on], ou desativado [off].', id)
            }
            break
			
			
		case 'macaco':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			var item = ["macaco", "gorila", "chimpanzé", "orangotango", "babuino"]
    	    var esco = item[Math.floor(Math.random() * item.length)]
			console.log(esco)
			var maca = "https://api.fdci.se/rep.php?gambar=" + esco
			axios.get(maca)
			    .then((result) => {
				var mon = JSON.parse(JSON.stringify(result.data))
				var nkey = mon[Math.floor(Math.random() * mon.length)]
              	kill.sendFileFromUrl(from, nkey, "", "Saldações, sou o Deus macaco e vim abençoar vocês.", id)
			})
			break
			
			
		case 'ball':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const ball = await axios.get('https://nekos.life/api/v2/img/8ball')
			await kill.sendFileFromUrl(from, ball.data.url, '', '', id)
			break
			
			
		case 'cafune':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (double == 1) {
				const cfne = await axios.get('https://nekos.life/api/v2/img/pat')
				await kill.sendFileFromUrl(from, cfne.data.url, '', '', id)
			} else if (double == 2) {
				const cfne = await axios.get('https://nekos.life/api/v2/img/cuddle')
				await kill.sendFileFromUrl(from, cfne.data.url, '', '', id)
			}
			break			
			
			
		case 'quack':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const patu = await axios.get('https://nekos.life/api/v2/img/goose')
			await kill.sendFileFromUrl(from, patu.data.url, '', '', id)
			break
			

		case 'poke':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const teco = await axios.get('https://nekos.life/api/v2/img/poke')
			await kill.sendFileFromUrl(from, teco.data.url, '', '', id)
			break
			

		case 'cocegas':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const cocegas = await axios.get('https://nekos.life/api/v2/img/tickle')
			await kill.sendFileFromUrl(from, cocegas.data.url, '', '', id)
			break
			
			
		case 'feed':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const feed = await axios.get('https://nekos.life/api/v2/img/tickle')
			await kill.sendFileFromUrl(from, feed.data.url, '', '', id)
			break
			
			
		case 'baka':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const baka = await axios.get('https://nekos.life/api/v2/img/baka')
			await kill.sendFileFromUrl(from, baka.data.url, '', '', id)
			break
			
			
		case 'lizard':
		case 'lagarto':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const lizard = await axios.get('https://nekos.life/api/v2/img/lizard')
			await kill.sendFileFromUrl(from, lizard.data.url, '', '', id)
			break
			

        case 'google':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, `Digite algo para buscar.`, id)
		    const googleQuery = body.slice(8)
            google({ 'query': googleQuery }).then(results => {
            let vars = `_*Resultados da pesquisa Google de: ${googleQuery}*_\n`
            for (let i = 0; i < results.length; i++) {
                vars +=  `\n═════════════════\n*Titulo >* ${results[i].title}\n\n*Descrição >* ${results[i].snippet}\n\n*Link >* ${results[i].link}`
            }
                kill.reply(from, vars, id)
            }).catch(e => {
                kill.reply(from, 'Erro ao pesquisar na google.', id)
            })
            break
			
			
       case 'clima':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
       		if (args.length == 0) return kill.reply(from, 'Insira o nome da sua cidade.', id)
            try {
				const clima = await axios.get(`https://pt.wttr.in/${body.slice(7)}?format=Cidade%20=%20%l+\n\nEstado%20=%20%C+%c+\n\nTemperatura%20=%20%t+\n\nUmidade%20=%20%h\n\nVento%20=%20%w\n\nLua agora%20=%20%m\n\nNascer%20do%20Sol%20=%20%S\n\nPor%20do%20Sol%20=%20%s`)
				await kill.sendFileFromUrl(from, `https://wttr.in/${body.slice(7)}.png`, '', `A foto acima contém uma previsão de 2 dias, a mensagem abaixo é o clima agora.\n\n${clima.data}`, id)
            } catch {
                kill.reply(from, 'Estranho...\nCertifique-se de não estar usando acentos ok?', id)
            }
            break
			
			
        case 'boy':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
    	    var hite = ["eboy", "garoto", "homem", "men", "garoto oriental", "japanese men", "pretty guy", "homem bonito"];
    	    var hesc = hite[Math.floor(Math.random() * hite.length)];
			var men = "https://api.fdci.se/rep.php?gambar=" + hesc;
			axios.get(men)
            	.then((result) => {
				var h = JSON.parse(JSON.stringify(result.data));
				var cewek =  h[Math.floor(Math.random() * h.length)];
              	kill.sendFileFromUrl(from, cewek, "result.jpg", "Homens...", id)
			})
			break
			
			
      case 'moddroid':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Bote um nome para buscar!', id)
            try {
                const moddroid = await axios.get('https://tobz-api.herokuapp.com/api/moddroid?q=' + body.slice(10)  + '&apikey=BotWeA')
                if (moddroid.data.error) return kill.reply(from, moddroid.data.error, id)
                const modo = moddroid.data.result[0]
                const resmod = `• *Titulo* : ${modo.title}\n\n• *Quem criou* : ${modo.publisher}\n\n• *Peso* : ${modo.size}\n\n• *MOD* : ${modo.mod_info}\n\n• *Versão* : ${modo.latest_version}\n\n• *Gênero* : ${modo.genre}\n\n• *Link* : ${modo.link}\n\n• *Download* : ${modo.download}`
                kill.sendFileFromUrl(from, modo.image, 'MODDROID.jpg', resmod, id)
            } catch (err) {
                console.log(err)
            }
            break
			
			
        case 'happymod':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Bote um nome para buscar!', id)
            try {
                const happymod = await axios.get('https://tobz-api.herokuapp.com/api/happymod?q=' + body.slice(10)  + '&apikey=BotWeA')
                if (happymod.data.error) return kill.reply(from, happymod.data.error, id)
                const modo = happymod.data.result[0]
                const resmod = `• *Titulo* : ${modo.title}\n\n• *Compra* : ${modo.purchase}\n\n• *Peso* : ${modo.size}\n\n• *Root* : ${modo.root}\n\n• *Versão* : ${modo.version}\n\n• *Preço* : ${modo.price}\n\n• *Link* : ${modo.link}\n\n• *Download* : ${modo.download}`
                kill.sendFileFromUrl(from, modo.image, 'HAPPYMOD.jpg', resmod, id)
            } catch (err) {
                console.log(err)
            }
            break
			

        case 'girl':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
    	    var items = ["garota adolescente", "saycay", "alina nikitina", "belle delphine", "teen girl", "teen cute", "japanese girl", "garota bonita oriental", "oriental girl", "korean girl", "chinese girl", "e-girl", "teen egirl", "brazilian teen girl", "pretty teen girl", "korean teen girl", "garota adolescente bonita", "menina adolescente bonita", "egirl", "cute girl"];
    	    var cewe = items[Math.floor(Math.random() * items.length)];
			console.log(cewe)
			var girl = "https://api.fdci.se/rep.php?gambar=" + cewe;
			axios.get(girl)
            	.then((result) => {
				var b = JSON.parse(JSON.stringify(result.data));
				var cewek =  b[Math.floor(Math.random() * b.length)];
              	kill.sendFileFromUrl(from, cewek, "result.jpg", "Ela é linda não acha?", id)
			})
			break


        case 'anime':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
		    if (args.length == 0) return kill.reply(from, 'Especifique o nome de um anime!', id)
            const keyword = message.body.replace('/anime', '')
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/anime?q=${keyword}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await kill.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ É umas pena, não encontrei nenhum resultado...', id)
              console.log("Sent!")
              return null
              }
            const { title, episodes, url, synopsis, rated, score, image_url } = parsed.results[0]
            const image = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
			kill.reply(from, mess.wait, id)
			await sleep(5000)
            translate(synopsis, 'pt')
                .then(async (syno) => {
				    const content = `*Anime encontrado!*\n\n✨️ *Titulo:* ${title}\n\n🎆️ *Episodios:* ${episodes}\n\n💌️ *Classificação:* ${rated}\n\n❤️ *Nota:* ${score}\n\n💚️ *Sinopse:* ${syno}\n\n🌐️ *Link*: ${url}`
					await kill.sendImage(from, base64, title, content, id)
				})
           } catch (err) {
             console.error(err.message)
             await kill.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ É umas pena, não encontrei nenhum resultado...')
           }
          break


        case 'nh':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (args.length == 1) {
					const nuklir = body.split(' ')[1]
					kill.reply(from, mess.wait, id)
					const cek = await nhentai.exists(nuklir)
					if (cek == true)  {
						try {
							const api = new API()
							const pic = await api.getBook(nuklir).then(book => {
								return api.getImageURL(book.cover)
							})
							const dojin = await nhentai.getDoujin(nuklir)
							const { title, details, link } = dojin
							const { parodies, tags, artists, groups, languages, categories } = await details
							var teks = `*Titulo* : ${title}\n\n*Parodia de* : ${parodies}\n\n*Tags* : ${tags.join(', ')}\n\n*Artistas* : ${artists.join(', ')}\n\n*Grupos* : ${groups.join(', ')}\n\n*Linguagens* : ${languages.join(', ')}\n\n*Categoria* : ${categories}\n\n*Link* : ${link}`
							await kill.sendFileFromUrl(from, pic, '', teks + '\n\n' + 'Aguarde, estou enviando o hentai, pode demorar varios minutos dependendo da quantidade de paginas.', id)
							await kill.sendFileFromUrl(from, `https://nhder.herokuapp.com/download/nhentai/${nuklir}/zip`, 'hentai.zip', '', id)
						} catch (err) {
							kill.reply(from, '[❗] Ops! Deu erro no envio!', id)
						}
					} else {
						kill.reply(from, '[❗] Aqui diz que não achou resultados...')
					}
				} else {
					kill.reply(from, 'Você usou errado, tente verificar se o comando está correto.')
				}
			} else {
				if (args.length == 1) {
					const nuklir = body.split(' ')[1]
					kill.reply(from, mess.wait, id)
					const cek = await nhentai.exists(nuklir)
					if (cek == true)  {
						try {
							const api = new API()
							const pic = await api.getBook(nuklir).then(book => {
								return api.getImageURL(book.cover)
							})
							const dojin = await nhentai.getDoujin(nuklir)
							const { title, details, link } = dojin
							const { parodies, tags, artists, groups, languages, categories } = await details
							var teks = `*Titulo* : ${title}\n\n*Parodia de* : ${parodies}\n\n*Tags* : ${tags.join(', ')}\n\n*Artistas* : ${artists.join(', ')}\n\n*Grupos* : ${groups.join(', ')}\n\n*Linguagens* : ${languages.join(', ')}\n\n*Categoria* : ${categories}\n\n*Link* : ${link}`
							await kill.sendFileFromUrl(from, pic, '', teks + '\n\n' + 'Aguarde, estou enviando o hentai, pode demorar varios minutos dependendo da quantidade de paginas.', id)
							await kill.sendFileFromUrl(from, `https://nhder.herokuapp.com/download/nhentai/${nuklir}/zip`, 'hentai.zip', '', id)
						} catch (err) {
                        kill.reply(from, '[❗] Ops! Deu erros no envio!', id)
						}
					} else {
						kill.reply(from, '[❗] Aqui diz que não achou resultados...')
					}
				} else {
					kill.reply(from, 'Você usou errado, tente verificar se o comando está correto.')
				}
			}
			break


        case 'profile':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
				if (!quotedMsg) {
					var pic = await kill.getProfilePicFromServer(author)
					var namae = pushname
					var sts = await kill.getStatus(author)
					var adm = isGroupAdmins
					const { status } = sts
					if (pic == undefined) {
						var pfp = errorurl 
					} else {
						var pfp = pic
					} 
					await kill.sendFileFromUrl(from, pfp, 'pfo.jpg', `*Dados do seu perfil..* ✨️ \n\n 🔖️ *Qual sua Usertag? ${namae}*\n\n👑️ *Administrador? ${adm}*\n\n💌️ *Frase do recado?*\n${status}`)
			    } else if (quotedMsg) {
					var qmid = quotedMsgObj.sender.id
					var namae = quotedMsgObj.sender.pushname
					var pic = await kill.getProfilePicFromServer(qmid)
					var sts = await kill.getStatus(qmid)
					var adm = groupAdmins.includes(qmid)
					const { status } = sts
					if (pic == undefined) {
						var pfp = errorurl 
					} else {
						var pfp = pic
					}
					await kill.sendFileFromUrl(from, pfp, 'pfo.jpg', `*Dados do seu perfil..* ✨️ \n\n 🔖️ *Qual sua Usertag? ${namae}*\n\n👑️ *Administrador? ${adm}*\n\n💌️ *Frase do recado?*\n${status}`)
				}
			}
            break


        case 'brainly':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length >= 2){
                let tanya = body.slice(9)
                let jum = Number(tanya.split('.')[1]) || 2
                if (jum > 10) return kill.reply(from, 'Maximo de 10 palavras.', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
                await BrainlySearch(tanya.split('.')[0],Number(jum), function(res){
                    res.forEach(x=>{
                        if (x.jawaban.fotoJawaban.length == 0) {
                            kill.reply(from, `➸ *Questão* : ${x.pertanyaan}\n\n➸ *Resposta* : ${x.jawaban.judulJawaban}\n`, id)
                        } else {
                            kill.reply(from, `➸ *Questão* : ${x.pertanyaan}\n\n➸ *Resposta* 〙: ${x.jawaban.judulJawaban}\n\n➸ *Link da imagem* : ${x.jawaban.fotoJawaban.join('\n')}`, id)
                        }
                    })
                })
            } else {
                kill.reply(from, 'Oops! Você digitou certo?', id)
            }
            break


		case 'store':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) return kill.reply(from, 'Especifique um nome de aplicativo que deseja pesquisar.', id)
			kill.reply(from, mess.wait, id)
			await sleep(5000)
			const stsp = await search(`${body.slice(7)}`)
            translate(stsp.description, 'pt')
                .then((playst) => kill.sendFileFromUrl(from, stsp.icon, '', `*Nome >* ${stsp.name}\n\n*Link >* ${stsp.url}\n\n*Preço >* ${stsp.price}\n\n*Descrição >* ${playst}\n\n*Nota >* ${stsp.rating}/5\n\n*Desenvolvedora >* ${stsp.developer.name}\n\n*Outros>* ${stsp.developer.url}`, id))
			break


        case 'search':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                kill.reply(from, 'Pesquisando....\n\nEvite usar isso com fan-mades, desenhos do pinterest ou outros, use apenas com prints de episodios de anime, ok?', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                	if (resolt.docs && resolt.docs.length <= 0) {
                		kill.reply(from, 'É como podia acontecer, não há resposta sobre ele.', id)
                	}
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                    	teks = '*Pode ser ~ou está~ que esteja incorreta...* :\n\n'
                    }
                    teks += `➸ *Titulo em Japonês* : ${title}\n➸ *Titulo em Chinês* : ${title_chinese}\n➸ *Titulo em Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                    teks += `➸ *Ecchi* : ${is_adult}\n`
                    teks += `➸ *Episodio* : ${episode.toString()}\n`
                    teks += `➸ *Similaridade dos traços* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    kill.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                        kill.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    kill.reply(from, 'Ora ora, recebi um erro.', id)
                })
            } else {
                kill.sendFile(from, './lib/media/img/tutod.jpg', 'Tutor.jpg', 'Evite usar isso com fan-mades, desenhos do pinterest ou outros, use apenas com prints de episodios de anime, ok?', id)
            }
            break

        case 'link':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
            if (isGroupMsg) {
                const inviteLink = await kill.getGroupInviteLink(groupId);
                kill.sendLinkWithAutoPreview(from, inviteLink, `\nAqui está o link do grupo ${name}!`)
            } else {
            	kill.reply(from, 'Ops, isso é um comando de grupos apenas.', id)
            }
            break


        case 'broad':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isOwner) return kill.reply(from, 'Somente o meu criador tem acesso a este comando.', id)
            let msg = body.slice(6)
            const chatz = await kill.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await kill.getChatById(ids)
                if (!cvk.isReadOnly) await kill.sendText(ids, `[Transmissão do dono da Íris]\n\n${msg}`)
            }
            kill.reply(from, 'Broadcast Sucedida!', id)
            break
			
        case 'ptt':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (quotedMsgObj) {
                let encryptMedia
                let replyOnReply = await kill.getMessageById(quotedMsgObj.id)
                let obj = replyOnReply.quotedMsgObj
                if (/ptt|audio/.test(quotedMsgObj.type)) {
                    encryptMedia = quotedMsgObj
                    if (encryptMedia.animated) encryptMedia.mimetype = ''
                } else if (obj && /ptt|audio/.test(obj.type)) {
                    encryptMedia = obj
                } else return
                const _mimetype = encryptMedia.mimetype
                const mediaData = await decryptMedia(encryptMedia)
                await kill.sendPtt(from, `data:${_mimetype};base64,${mediaData.toString('base64')}`, '', id)
            } else kill.reply(from, 'Use isso em audios!', id)
            break
			
			
        case 'get':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (quotedMsgObj) {
                let encryptMedia
                let replyOnReply = await kill.getMessageById(quotedMsgObj.id)
                let obj = replyOnReply.quotedMsgObj
                if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
                    encryptMedia = quotedMsgObj
                    if (encryptMedia.animated) encryptMedia.mimetype = ''
                } else if (obj && /ptt|audio|video|image/.test(obj.type)) {
                    encryptMedia = obj
                } else return
                const _mimetype = encryptMedia.mimetype
                const mediaData = await decryptMedia(encryptMedia)
                await kill.sendFile(from, `data:${_mimetype};base64,${mediaData.toString('base64')}`, '', 'S2', encryptMedia.id)
            } else kill.reply(from, 'Tem mesmo um arquivo nisso?', id)
            break


        case 'adms':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await sleep(2000)
            await kill.sendTextWithMentions(from, mimin)
            break


        case 'groupinfo' :
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            let admgp = ''
            for (let admon of groupAdmins) {
                admgp += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
			var gpOwner = chat.groupMetadata.owner.replace(/@c.us/g, '')
            var welgrp = welkom.includes(chat.id)
            var ngrp = nsfw_.includes(chat.id)
            var lzex = exsv.includes(chat.id)
            var grouppic = await kill.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await kill.sendFileFromUrl(from, pfp, 'group.png', ``, id)
			await kill.sendTextWithMentions(from, `*${groupname}*\n\n*🌐️ Membros > ${totalMem}*\n\n*💌️ Welcome|Goodby > ${welgrp}*\n\n*🌙 Exclusivos(Anti-Links, Anti-Porno...) >  ${lzex}*\n\n*⚜️ Contéudo adulto > ${ngrp}*\n\n*📃️ Descrição >V*\n ${desc}\n\n*🌙 Dono >* @${gpOwner}\n\n*☀️ Administradores >V*\n${admgp}`, id)
			break
			
			
        case 'ownergroup':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            const Owner_ = chat.groupMetadata.owner
            await kill.sendTextWithMentions(from, `@${Owner_} foi quem criou esse cabaré.`)
            break
			

		case 'maps':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, `Bota um nome de lugar ai`, id)
            const mapz = body.slice(6)
            try {
				const mapz2 = await axios.get('https://mnazria.herokuapp.com/api/maps?search=' + mapz)
				const { gambar } = mapz2.data
				const pictk = await bent("buffer")(gambar)
				const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
				kill.sendImage(from, base64, 'maps.jpg', `*Foto do mapa de ${mapz}*`)
            } catch (err) {
				console.error(err.message)
				await kill.reply(from, 'Deu erro em algo aqui, desculpe.', id)
			}
			break
			
			
		case 'sip':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 1) {
				const ip = await axios.get(`http://ipwhois.app/json/${body.slice(5)}`)
				await kill.sendLinkWithAutoPreview(from, `http://www.google.com/maps/place/${ip.data.latitude},${ip.data.longitude}`, `\n✪ IP: ${ip.data.ip}\n\n✪ Tipo: ${ip.data.type}\n\n✪ Região: ${ip.data.region}\n\n✪ Cidade: ${ip.data.city}\n\n✪ Latitude: ${ip.data.latitude}\n\n✪ Longitude: ${ip.data.longitude}\n\n✪ Provedor: ${ip.data.isp}\n\n✪ Continente: ${ip.data.continent}\n\n✪ Sigla do continente: ${ip.data.continent_code}\n\n✪ País: ${ip.data.country}\n\n✪ Sigla do País: ${ip.data.country_code}\n\n✪ Capital do País: ${ip.data.country_capital}\n\n✪ DDI: ${ip.data.country_phone}\n\n✪ Países Vizinhos: ${ip.data.country_neighbours}\n\n✪ Fuso Horário: ${ip.data.timezone} ${ip.data.timezone_name} ${ip.data.timezone_gmt}\n\n✪ Moeda: ${ip.data.currency}\n\n✪ Sigla da Moeda: ${ip.data.currency_code}\n\nBusca de IP realizada por Íris - KillovSky!`, id)
            } else {
				await kill.reply(from, 'Especifique um IP de tipo IPV4.', id)
            }
			break
			
			
		case 'scep':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 1) {
				const cep = await axios.get(`https://viacep.com.br/ws/${body.slice(6)}/json/`)
				await kill.reply(from, `✪ CEP: ${cep.data.cep}\n\n✪ Logradouro: ${cep.data.logradouro}\n\n✪ Complemento: ${cep.data.complemento}\n\n✪ Bairro: ${cep.data.bairro}\n\n✪ Estado: ${cep.data.localidade}\n\n✪ DDD: ${cep.data.ddd}\n\n✪ Sigla do Estado: ${cep.data.uf}\n\n✪ Código IBGE: ${cep.data.ibge}\n\n✪ Código GIA: ${cep.data.gia}\n\n✪ Código Siafi: ${cep.data.siafi}.`, id)
            } else {
				await kill.reply(from, 'Especifique um CEP.', id)
            }
			break


        case 'everyone':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (isGroupMsg && isGroupAdmins) {
				const groupMem = await kill.getGroupMembers(groupId)
				let hehe = `═✪〘 Olá! Todos marcados! 〙✪═\n═✪〘 Assunto: ${body.slice(10)} 〙✪═\n\n`
				for (let i = 0; i < groupMem.length; i++) {
					hehe += '- '
					hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
				}
				hehe += '\n═✪〘 Obrigada & Amo vocês <3 〙✪═'
				await sleep(2000)
				await kill.sendTextWithMentions(from, hehe, id)
			} else if (isGroupMsg && isOwner) {
				const groupMem = await kill.getGroupMembers(groupId)
				let hehe = `═✪〘 Olá! Todos marcados! 〙✪═\n═✪〘 Assunto: ${body.slice(10)} 〙✪═\n\n`
				for (let i = 0; i < groupMem.length; i++) {
					hehe += '- '
					hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
				}
				hehe += '\n═✪〘 Obrigada & Amo vocês <3 〙✪═'
				await sleep(2000)
				await kill.sendTextWithMentions(from, hehe, id)
			} else if (isGroupMsg) {
				await kill.reply(from, 'Desculpe, somente os administradores podem usar esse comando...', id)
			} else {
				await kill.reply(from, 'Esse comando apenas pode ser usado em grupos!', id)
			}
            break


        case 'random':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            const memran = await kill.getGroupMembers(groupId)
            const randme = memran[Math.floor(Math.random() * memran.length)]
			console.log(randme.id)
            await kill.sendTextWithMentions(from, `═✪〘 Você foi escolhido! 〙✪═ \n\n @${randme.id.replace(/@c.us/g, '')}\n\n═✪〘 Para: ${body.slice(8)} 〙✪═`)
            await sleep(2000)
            break


        case 'kickall':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const isdonogroup = sender.id === chat.groupMetadata.owner
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            if (!isdonogroup) return kill.reply(from, 'Apenas o dono do grupo pode usar isso.', id)
            if (!isBotGroupAdmins) return kill.reply(from, 'Preciso ser uma ademira', id)
            const allMem = await kill.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
                    console.log('Pulei um ADM.')
                } else {
                    await kill.removeParticipant(groupId, allMem[i].id)
                }
            }
            kill.reply(from, 'Todos banidos', id)
            break


        case 'leaveall':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isOwner) return kill.reply(from, 'Somente o meu criador tem acesso a este comando.', id)
            const allChats = await kill.getAllChatIds()
            const allGroups = await kill.getAllGroups()
            for (let gclist of allGroups) {
                await kill.sendText(gclist.contact.id, `Voltamos em breve, ou não haha : ${allChats.length}`)
                await kill.leaveGroup(gclist.contact.id)
            }
            kill.reply(from, 'Feito, sai de todos os grupos.', id)
            break


        case 'clearall':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isOwner) return kill.reply(from, 'Somente o meu criador tem acesso a este comando.', id)
            const allChatz = await kill.getAllChats()
            for (let dchat of allChatz) {
                await kill.deleteChat(dchat.id)
            }
            kill.reply(from, 'Limpei todos os Chats!', id)
            break


	    case 'add':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
	        if (args.length !== 1) return kill.reply(from, 'Você precisa especificar o número de telefone.', id)
            try {
                await kill.addParticipant(from,`${args[0]}@c.us`)
            } catch {
                kill.reply(from, mess.error.Ad, id)
            }
            break
			
			
		case '3d':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) kill.reply(from, 'Coloca uma mensagem ai!', id)
			kill.reply(from, mess.wait, id)
			await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/text3d?text=${body.slice(4)}`, '', '', id)
			break 
			
			
		case 'gaming':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) kill.reply(from, 'Coloca um nome ai!', id)
			kill.reply(from, mess.wait, id)
			await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/gaming?text=${body.slice(8)}`, '', '', id)
			break
		
		
		case 'fogareu':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) kill.reply(from, 'Coloca um nome ai!', id)
			kill.reply(from, mess.wait, id)
			await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/epep?text=${body.slice(9)}`, '', '', id)
			break
			
			
		case 'thunder':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) kill.reply(from, 'Coloca um nome ai!', id)
			kill.reply(from, mess.wait, id)
			await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/thunder?text=${body.slice(9)}`, '', '', id)
			break
			

		case 'light':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) kill.reply(from, 'Coloca um nome ai!', id)
			kill.reply(from, mess.wait, id)
			await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/neon_light?text=${body.slice(7)}`, '', '', id)
			break
			

		case 'wolf':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            arkp = body.trim().substring(body.indexOf(' ') + 1)
            if (args.length >= 2) {
                kill.reply(from, mess.wait, id)
                const fisow = arkp.split('|')[0]
                const twosw = arkp.split('|')[1]
                await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/wolf?text1=${fisow}&text2=${twosw}`, '', '', id)
            } else {
                await kill.reply(from, `Para usar isso, adicione duas frases, separando elas pelo |.`, id)
            }
            break
			

		case 'neon':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            arkt = body.trim().substring(body.indexOf(' ') + 1)
            if (args.length >= 3) {
                kill.reply(from, mess.wait, id)
                const fisot = arkt.split('|')[0]
                const twost = arkt.split('|')[1]
                const trest = arkt.split('|')[1]
                await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/neon?text1=${fisot}&text2=${twost}&text3=${trest}`, '', '', id)
            } else {
                await kill.reply(from, `Para usar isso, adicione três frases, separando elas pelo |.`, id)
            }
            break
			

        case 'porn':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
            const porn = await axios.get('https://meme-api.herokuapp.com/gimme/porn')
            kill.sendFileFromUrl(from, porn.data.url, '', porn.data.title, id)
            } else {
				const porn = await axios.get('https://meme-api.herokuapp.com/gimme/porn')
				kill.sendFileFromUrl(from, porn.data.url, '', porn.data.title, id)
			}
            break
			
			
        case 'lesbian':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
            const lesb = await axios.get('https://meme-api.herokuapp.com/gimme/lesbians')
            kill.sendFileFromUrl(from, lesb.data.url, '', lesb.data.title, id)
			} else {
				const lesb = await axios.get('https://meme-api.herokuapp.com/gimme/lesbians')
				kill.sendFileFromUrl(from, lesb.data.url, '', lesb.data.title, id)
			}
            break
			
			
			
        case 'pgay':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
            const gay = await axios.get('https://meme-api.herokuapp.com/gimme/gayporn')
            kill.sendFileFromUrl(from, gay.data.url, '', gay.data.title, id)
            } else {
				const gay = await axios.get('https://meme-api.herokuapp.com/gimme/gayporn')
				kill.sendFileFromUrl(from, gay.data.url, '', gay.data.title, id)
			}
            break
		
		
		case 'logo':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) kill.reply(from, 'Coloca um nome ai!', id)
			kill.reply(from, mess.wait, id)
			await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/blackpink?text=${body.slice(6)}`, '', '', id)
			break
	
			
		case 'pornhub':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            arkp = body.trim().substring(body.indexOf(' ') + 1)
            if (args.length >= 2) {
                kill.reply(from, mess.wait, id)
                const fison = arkp.split('|')[0]
                const twoso = arkp.split('|')[1]
                if (fison > 10 || twoso > 10) return kill.reply(from, 'Desculpe, maximo de 10 letras.', id)
                await kill.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/phblogo?text1=${fison}&text2=${twoso}`, '', '', id)
            } else {
                await kill.reply(from, `Para usar isso, adicione duas frases, separando elas pelo |.`, id)
            }
            break
			


        case 'meme':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            ark = body.trim().substring(body.indexOf(' ') + 1)
            if ((isMedia || isQuotedImage) && args.length >= 2) {
                const top = ark.split('|')[0]
                const bottom = ark.split('|')[1]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await meme.custom(getUrl, top, bottom)
                kill.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then((serialized) => console.log(`Meme de id: ${serialized} feito em ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            } else {
                await kill.reply(from, `Seu uso está incorreto baka ~idiota~ O.O\nUso correto = /meme frase-de-cima | frase-de-baixo.\nA frase de baixo é opcional, se não quiser deixe em branco, mas use o | ainda assim.`, id)
            }
            break
			
			
		case 'unban':		
		case 'unkick':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (isGroupMsg && isGroupAdmins) {
				if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
				if (!quotedMsg) return kill.reply(from, 'Marque a mensagem de quem foi banido.', id) 
				const unbanq = quotedMsgObj.sender.id
				await kill.sendTextWithMentions(from, `Desfazendo ban do @${unbanq} e permitindo entrada dele no cabaré...`)
				await kill.addParticipant(groupId, unbanq)
			} else if (isGroupMsg && isOwner) {
				if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
				if (!quotedMsg) return kill.reply(from, 'Marque a mensagem de quem foi banido.', id) 
				const unbanq = quotedMsgObj.sender.id
				await kill.sendTextWithMentions(from, `Desfazendo ban do @${unbanq} e permitindo entrada dele no cabaré...`)
				await kill.addParticipant(groupId, unbanq)
			} else if (isGroupMsg) {
				await kill.reply(from, 'Desculpe, somente os administradores podem usar esse comando...', id)
			} else {
				await kill.reply(from, 'Esse comando apenas pode ser usado em grupos!', id)
			}
            break


        case 'kick':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const chief = chat.groupMetadata.owner
			if (isGroupMsg && isGroupAdmins) {
				if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
				if (quotedMsg) {
					const negquo = quotedMsgObj.sender.id
					if (chief.includes(negquo)) return kill.reply(from, 'Sabemos o quão bebado(a) ele(a) é, mas não dá pra expulsar a pessoa que criou o cabaré.', id)
					await kill.sendTextWithMentions(from, `Expulsando bebado(a) @${negquo} do cabaré...`)
					await kill.removeParticipant(groupId, negquo)
				} else {
					if (mentionedJidList.length == 0) return kill.reply(from, 'Você digitou o comando de forma muito errada, arrume e envie certo.', id)
					await kill.sendTextWithMentions(from, `Expulsando bebado(a) ${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')} do cabaré...`)
					for (let i = 0; i < mentionedJidList.length; i++) {
						if (chief.includes(mentionedJidList[i])) return kill.reply(from, 'Sabemos o quão bebado(a) ele(a) é, mas não dá pra expulsar a pessoa que criou o cabaré.', id)
						if (ownerNumber.includes(mentionedJidList[i])) return kill.reply(from, 'Infelizmente, ele é um bebado VIP, não posso expulsar.', id)
						if (groupAdmins.includes(mentionedJidList[i])) return kill.reply(from, mess.error.Kl, id)
						await kill.removeParticipant(groupId, mentionedJidList[i])
					}
				}
			} else if (isGroupMsg && isOwner) {
				if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
				if (quotedMsg) {
					const negquo = quotedMsgObj.sender.id
					if (chief.includes(negquo)) return kill.reply(from, 'Sabemos o quão bebado(a) ele(a) é, mas não dá pra expulsar a pessoa que criou o cabaré.', id)
					await kill.sendTextWithMentions(from, `Expulsando bebado(a) @${negquo} do cabaré...`)
					await kill.removeParticipant(groupId, negquo)
				} else {
					if (mentionedJidList.length == 0) return kill.reply(from, 'Você digitou o comando de forma muito errada, arrume e envie certo.', id)
					await kill.sendTextWithMentions(from, `Expulsando bebado(a) ${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')} do cabaré...`)
					for (let i = 0; i < mentionedJidList.length; i++) {
						if (chief.includes(mentionedJidList[i])) return kill.reply(from, 'Sabemos o quão bebado(a) ele(a) é, mas não dá pra expulsar a pessoa que criou o cabaré.', id)
						if (ownerNumber.includes(mentionedJidList[i])) return kill.reply(from, 'Infelizmente, ele é um bebado VIP, não posso expulsar.', id)
						if (groupAdmins.includes(mentionedJidList[i])) return kill.reply(from, mess.error.Kl, id)
						await kill.removeParticipant(groupId, mentionedJidList[i])
					}
				}
			} else if (isGroupMsg) {
				await kill.reply(from, 'Desculpe, somente os administradores podem usar esse comando...', id)
			} else {
				await kill.reply(from, 'Esse comando apenas pode ser usado em grupos!', id)
			}
            break


        case 'leave':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (isGroupMsg && isGroupAdmins) {
				await kill.sendText(from,'Terei que sair mas tomará que voltemos a nós ver em breve! <3').then(() => kill.leaveGroup(groupId))
			} else if (isGroupMsg && isOwner) {
				await kill.sendText(from,'Terei que sair mas tomará que voltemos a nós ver em breve! <3').then(() => kill.leaveGroup(groupId))
			} else if (isGroupMsg) {
				await kill.reply(from, 'Desculpe, somente os administradores e meu dono podem usar esse comando...', id)
			} else {
				await kill.reply(from, 'Esse comando apenas pode ser usado em grupos!', id)
			}
            break


        case 'promote':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (isGroupMsg && isGroupAdmins) {
				if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
				if (quotedMsg) {
					const proquo = quotedMsgObj.sender.id
					if (groupAdmins.includes(proquo)) return kill.reply(from, 'Bom, ele já é um administrador.', id)
					await kill.sendTextWithMentions(from, `Promovendo membro comum @${proquo} a administrador de bar.`)
					await kill.promoteParticipant(groupId, proquo)
				} else {
					if (mentionedJidList.length == 0) return kill.reply(from, 'Você esqueceu de marcar a pessoa que quer tornar administrador.', id)
					if (mentionedJidList.length >= 2) return kill.reply(from, 'Desculpe, só posso demitir 1 por vez.', id)
					if (groupAdmins.includes(mentionedJidList[0])) return kill.reply(from, 'Bom, ele já é um administrador.', id)
					await kill.promoteParticipant(groupId, mentionedJidList[0])
					await kill.sendTextWithMentions(from, `Promovendo membro comum @${mentionedJidList[0]} a administrador de bar.`)
				}
		    } else if (isGroupMsg && isOwner) {
				if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
				if (quotedMsg) {
					const proquo = quotedMsgObj.sender.id
					if (groupAdmins.includes(proquo)) return kill.reply(from, 'Bom, ele já é um administrador.', id)
					await kill.sendTextWithMentions(from, `Promovendo membro comum @${proquo} a administrador de bar.`)
					await kill.promoteParticipant(groupId, proquo)
				} else {
					if (mentionedJidList.length == 0) return kill.reply(from, 'Você esqueceu de marcar a pessoa que quer tornar administrador.', id)
					if (mentionedJidList.length >= 2) return kill.reply(from, 'Desculpe, só posso demitir 1 por vez.', id)
					if (groupAdmins.includes(mentionedJidList[0])) return kill.reply(from, 'Bom, ele já é um administrador.', id)
					await kill.promoteParticipant(groupId, mentionedJidList[0])
					await kill.sendTextWithMentions(from, `Promovendo membro comum @${mentionedJidList[0]} a administrador de bar.`)
				}
			} else if (isGroupMsg) {
				await kill.reply(from, 'Desculpe, somente os administradores podem usar esse comando...', id)
			} else {
				await kill.reply(from, 'Esse comando apenas pode ser usado em grupos!', id)
			}
            break


        case 'demote':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (isGroupMsg && isGroupAdmins) {
				if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
				if (quotedMsg) {
					const demquo = quotedMsgObj.sender.id
					if (!groupAdmins.includes(demquo)) return kill.reply(from, 'Bom, ele não é um administrador.', id)
					await kill.sendTextWithMentions(from, `Demitindo administrador do bar @${demquo}.`)
					await kill.demoteParticipant(groupId, demquo)
				} else {
					if (mentionedJidList.length == 0) return kill.reply(from, 'Você esqueceu de marcar a pessoa que quer demitir.', id)
					if (mentionedJidList.length >= 2) return kill.reply(from, 'Desculpe, só posso demitir 1 por vez.', id)
					if (!groupAdmins.includes(mentionedJidList[0])) return kill.reply(from, 'Bom, ele não é um administrador.', id)
					await kill.sendTextWithMentions(from, `Demitindo administrador do bar @${mentionedJidList[0]}.`)
					await kill.demoteParticipant(groupId, mentionedJidList[0])
				}
		    } else if (isGroupMsg && isOwner) {
				if (!isBotGroupAdmins) return kill.reply(from, mess.error.Ba, id)
				if (quotedMsg) {
					const demquo = quotedMsgObj.sender.id
					if (!groupAdmins.includes(demquo)) return kill.reply(from, 'Bom, ele não é um administrador.', id)
					await kill.sendTextWithMentions(from, `Demitindo administrador do bar @${demquo}.`)
					await kill.demoteParticipant(groupId, demquo)
				} else {
					if (mentionedJidList.length == 0) return kill.reply(from, 'Você esqueceu de marcar a pessoa que quer demitir.', id)
					if (mentionedJidList.length >= 2) return kill.reply(from, 'Desculpe, só posso demitir 1 por vez.', id)
					if (!groupAdmins.includes(mentionedJidList[0])) return kill.reply(from, 'Bom, ele não é um administrador.', id)
					await kill.sendTextWithMentions(from, `Demitindo administrador do bar @${mentionedJidList[0]}.`)
					await kill.demoteParticipant(groupId, mentionedJidList[0])
				}
			} else if (isGroupMsg) {
				await kill.reply(from, 'Desculpe, somente os administradores podem demitir pela Íris.', id)
			} else {
				await kill.reply(from, 'Esse comando apenas pode ser usado em grupos!', id)
			}
            break


        case 'botstat':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const loadedMsg = await kill.getAmountOfLoadedMessages()
            const chatIds = await kill.getAllChatIds()
            const groups = await kill.getAllGroups()
            kill.sendText(from, `Status :\n- *${loadedMsg}* Mensagens recebidas após ligar\n- *${groups.length}* Conversas em grupo\n- *${chatIds.length - groups.length}* Conversas no PV\n- *${chatIds.length}* Total de conversas`)
            break


        case 'join':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (args.length == 0) return kill.reply(from, 'Sei la, tem algo errado nisso ai!', id)
            const gplk = body.slice(6)
            const tGr = await kill.getAllGroups()
            const minMem = 30 // PRECISA TER ISSO DE MEMBRO PRA ENTRAR
            const isLink = gplk.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await kill.inviteInfo(gplk)
            if (!isLink) return kill.reply(from, 'Link errado', id)
            if (tGr.length > 6) return kill.reply(from, 'Já estou no maximo de grupos, desculpe.', id)
            if (check.size < minMem) return kill.reply(from, 'Só posso funcionar em grupos com mais de 30 pessoas.', id)
            if (check.status == 200) {
                await kill.joinGroupViaLink(gplk).then(() => kill.reply(from, 'Entrando no grupo...'))
            } else {
                kill.reply(from, 'Link invalido', id)
            }
            break


        case 'delete':
        case 'del':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (isGroupMsg && isGroupAdmins) {
				if (!quotedMsg) return kill.reply(from, 'Você precisa marcar a mensagem que deseja deletar, obviamente, uma minha.', id)
				if (!quotedMsgObj.fromMe) return kill.reply(from, 'Só posso deletar minhas mensagens!', id)
				await kill.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
		    } else if (isGroupMsg && isOwner) {
				if (!quotedMsg) return kill.reply(from, 'Você precisa marcar a mensagem que deseja deletar, obviamente, uma minha.', id)
				if (!quotedMsgObj.fromMe) return kill.reply(from, 'Só posso deletar minhas mensagens!', id)
				await kill.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
			} else if (isGroupMsg) {
				if (!quotedMsgObj.fromMe) return kill.reply(from, 'Só posso deletar minhas mensagens!', id)
				await kill.reply(from, 'Desculpe, somente meu dono e os administradores podem deletar minhas mensagens.', id)
			} else {
				await kill.reply(from, 'Esse comando apenas pode ser usado em grupos!', id)
			}
            break


        case 'tela':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isOwner) return kill.reply(from, 'Esse comando é apenas para meu criador', id)
            const sesPic = await kill.getSnapshot()
            kill.sendFile(from, sesPic, 'session.png', 'Neh...', id)
            break
			
			
		case 'placa':
			if (mute || pvmte) return console.log('Comando ignorado.')
			if (args.length == 0) return kill.reply(from, 'Coloque uma placa para puxar.', id)
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
			sinesp.search(`${args[0]}`).then(async (dados) => {
				await kill.reply(from, `Placa: ${dados.placa}\n\nSituação: ${dados.situacao}\n\nModelo: ${dados.modelo}\n\nMarca: ${dados.marca}\n\nCor: ${dados.cor}\n\nAno: ${dados.ano}\n\nAno do modelo: ${dados.anoModelo}\n\nEstado: ${dados.uf}\n\nMunicipio: ${dados.municipio}\n\nChassi: ${dados.chassi}.`, id)
			}).catch(async (err) => {
				console.log(err);
				await kill.reply(from, 'Placa não encontrada.', id)
			})
			break
			

        case 'enviar':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const arka = body.trim().substring(body.indexOf(' ') + 1)
            if (args.length == 0) return kill.reply(from, 'Você precisa definir entre [-gp, -pv ou -help] para usar!', id)
			const gid = groupId.replace('@g.us', '').replace('c.us', '')
			if (isGroupMsg) {
				if (args[0] == '-gp') {
					await kill.sendText(`${args[1]}` + '@g.us', `_Mensagem >_\n*"${arka.split('|')[1]} "*` + '\n\n_Quem enviou =_ ' + '\n*"' + name + '"*' + '\n\n_Como responder:_')
					await kill.sendText(`${args[1]}` + '@g.us', `/enviar -gp ${gid} | Coloque sua resposta aqui`)
					await kill.sendText(from, 'Mensagem enviada.')
				} else if (args[0] == '-pv') {
					await kill.sendText(`${args[1]}` + '@c.us', `${arka.split('|')[1]}` + '\n\n_Quem enviou =_ ' + '*' + name + '*' + '\n\n_Como responder:_')
					await kill.sendText(`${args[1]}` + '@c.us', `/enviar -gp ${gid} | Coloque sua resposta aqui`)
					await kill.sendText(from, 'Mensagem enviada.')
				} else if (args[0] == '-help' || args[0] == '-h') {
					await kill.reply(from, 'Para usar digite o comando e na frente digite -pv para privado, ou -gp para grupos, e na frente deles use o ID, separando a mensagem por |. Exemplo:\n/enviar -gp 5518998****-174362736 | ola?\n\nVocê pode obter as IDs com o comando /id, e lembre-se de usar sem o @c.us e @g.us.', id)
				} else {
					await kill.reply(from, 'Para usar digite o comando e na frente digite -pv para privado, ou -gp para grupos, e na frente deles use o ID, separando a mensagem por |. Exemplo:\n/enviar -gp 5518998****-174362736 | ola?\n\nVocê pode obter as IDs com o comando /id, e lembre-se de usar sem o @c.us e @g.us.', id)
				}
			} else {
				await kill.reply(from, mess.error.Gp + '\nSe quiser usar entre em um grupo [/legiao].', id)
			}
            break


        case 'blocks':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isOwner) return kill.reply(from, 'Somente o meu criador tem acesso a este comando.', id)
            let hih = `Lista de bloqueados\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ @${i.replace(/@c.us/g,'')}\n`
            }
            kill.sendTextWithMentions(from, hih, id)
            break
			
			
        case 'encerrar':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isOwner) return kill.reply(from, 'Somente o meu criador tem acesso a este comando.', id)
			kill.reply(from, 'Pedido recebido!\nIrei me desligar em 5 segundos.', id)
		    await sleep(5000)
			await kill.kill()
            break


/*        case 'loli':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const loli = await get.get('http://mhankbarbars.herokuapp.com/api/randomloli').json()
            kill.sendFileFromUrl(from, loli.result, 'loli.jpeg', 'Vejo que você é um homem/mulher de cultura.', id)
            break*/
			
			
        case 'loli':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const onefive = Math.floor(Math.random() * 145) + 1
			kill.sendFileFromUrl(from, `https://media.publit.io/file/Twintails/${onefive}.jpg`, 'loli.jpg', 'Vejo que você é um homem/mulher de cultura.', id)
            break
			

        case 'hug':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (double == 1) {
            const hug1 = await axios.get(`https://nekos.life/api/v2/img/hug`)
            await kill.sendFileFromUrl(from, hug1.data.url, ``, `Abraço fofinho...`, id)
            } else if (double == 2) {
            const hug = await randomNimek('hug')
            await kill.sendFileFromUrl(from, hug, ``, '<3', id)
			}
			break
			
			
        case 'exclusive':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isGroupMsg) return kill.reply(from, 'Só grupos!', id)
			if (!isOwner) return kill.reply(from, 'Esse comando é apenas para meu criador', id)
            if (args.length !== 1) return kill.reply(from, 'Defina entre on e off!', id)
			if (args[0] == 'on') {
                exsv.push(chatId)
                fs.writeFileSync('./lib/config/exclusive.json', JSON.stringify(exsv))
                kill.reply(from, 'Os comandos exclusivos do Legião foram habilitados.', id)
			} else if (args[0] == 'off') {
				let exclu = exsv.indexOf(chatId)
                exsv.splice(exclu, 1)
                fs.writeFileSync('./lib/config/exclusive.json', JSON.stringify(exsv))
                kill.reply(from, 'Os comandos exclusivos do Legião foram desabilitados.', id)
            } else {
                kill.reply(from, 'Defina on ou off!', id)
            }
            break


        case 'baguette':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const baguette = await randomNimek('baguette')
            await kill.sendFileFromUrl(from, baguette, ``, '', id)
            break


        case 'dva':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const dva1 = await randomNimek('dva') 
            await kill.sendFileFromUrl(from, dva1, ``, `Que ~gostosa~ linda!`, id)
            break


        case 'waifu':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (double == 1) {
				const total = fs.readFileSync('./lib/config/waifu.json')
				const parsew = JSON.parse(total)
				const organi = Math.floor(Math.random() * parsew.length)
				const finale = parsew[organi]
				await kill.sendFileFromUrl(from, finale.image, 'waifu.jpg', finale.teks, id)
            } else if (double == 2) {
				const waifu3 = await axios.get(`https://nekos.life/api/v2/img/waifu`)
				await kill.sendFileFromUrl(from, waifu3.data.url, '', 'Não sei nada dela...', id)
			}
            break


        case 'husb':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const diti = fs.readFileSync('./lib/config/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            kill.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
            break
			
			
        case 'iecchi':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (triple == 1) {
					const ecchi = await axios.get('https://nekos.life/api/v2/img/erok')
					await kill.sendFileFromUrl(from, ecchi.data.url, id)
				} else if (triple == 2) {
					const ecchi1 = await axios.get('https://nekos.life/api/v2/img/erokemo')
					await kill.sendFileFromUrl(from, ecchi1.data.url, '', '', id)
				} else if (triple == 3) {
					const ecchi3 = await axios.get('https://nekos.life/api/v2/img/ero')
					await kill.sendFileFromUrl(from, ecchi3.data.url, '', '', id)
				}
			} else {
				if (triple == 1) {
					const ecchi = await axios.get('https://nekos.life/api/v2/img/erok')
					await kill.sendFileFromUrl(from, ecchi.data.url, '', '', id)
				} else if (triple == 2) {
					const ecchi1 = await axios.get('https://nekos.life/api/v2/img/erokemo')
					await kill.sendFileFromUrl(from, ecchi1.data.url, '', '', id)
				} else if (triple == 3) {
					const ecchi3 = await axios.get('https://nekos.life/api/v2/img/ero')
					await kill.sendFileFromUrl(from, ecchi3.data.url, '', '', id)
				}
			}
			break
			
			
        case 'tits':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
			if (octo == 1) {
				const tits = await axios.get('https://meme-api.herokuapp.com/gimme/tits')
				kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
			} else if (octo == 2) {
				const tits = await axios.get('https://meme-api.herokuapp.com/gimme/BestTits')
				kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
			} else if (octo == 3) {
				const tits = await axios.get('https://meme-api.herokuapp.com/gimme/boobs')
				kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
			} else if (octo == 4) {
				const tits = await axios.get('https://meme-api.herokuapp.com/gimme/BiggerThanYouThought')
				kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
			} else if (octo == 5) {
				const tits = await axios.get('https://meme-api.herokuapp.com/gimme/smallboobs')
				kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
			} else if (octo == 6) {
				const tits = await axios.get('https://meme-api.herokuapp.com/gimme/TinyTits')
				kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
			} else if (octo == 7) {
				const tits = await axios.get('https://meme-api.herokuapp.com/gimme/SmallTitsHugeLoad')
				kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
			} else if (octo == 8) {
				const tits = await axios.get('https://meme-api.herokuapp.com/gimme/amazingtits')
				kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
			}
            } else {
				if (octo == 1) {
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/tits')
					kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
				} else if (octo == 2) {
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/BestTits')
					kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
				} else if (octo == 3) {
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/boobs')
					kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
				} else if (octo == 4) {
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/BiggerThanYouThought')
					kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
				} else if (octo == 5) {
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/smallboobs')
					kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
				} else if (octo == 6) {
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/TinyTits')
					kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
				} else if (octo == 7) {
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/SmallTitsHugeLoad')
					kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
				} else if (octo == 8) {
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/amazingtits')
					kill.sendFileFromUrl(from, tits.data.url, '', tits.data.title, id)
				}
			}
            break
			
			
	    case 'milf':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
            	if (triple == 1) {
            		const milf1 = await axios.get('https://meme-api.herokuapp.com/gimme/milf');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = milf1.data
            		await kill.sendFileFromUrl(from, `${url}`, '', `${title}`, id)
            	}else if (triple == 2) {
            		const milf1 = await axios.get('https://meme-api.herokuapp.com/gimme/milf_pictures');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = milf1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}else if (triple == 3) {
            		const tits1 = await axios.get('https://meme-api.herokuapp.com/gimme/best_nsfw_milf');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = milf1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}	
            } else {
            	if (triple == 1) {
            		const milf1 = await axios.get('https://meme-api.herokuapp.com/gimme/milf');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = milf1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}else if (triple == 2) {
            		const milf1 = await axios.get('https://meme-api.herokuapp.com/gimme/milf_pictures');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = milf1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}else if (triple == 3) {
            		const milf1 = await axios.get('https://meme-api.herokuapp.com/gimme/best_nsfw_milf');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = milf1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}	
            }
			break
			
			
        case 'bdsm':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
            	if (triple == 1) {
            		const bdsm1 = await axios.get('https://meme-api.herokuapp.com/gimme/BDSMPics');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bdsm1.data
            		await kill.sendFileFromUrl(from, `${url}`, '', `${title}`, id)
            	} else if (triple == 2) {
            		const bdsm1 = await axios.get('https://meme-api.herokuapp.com/gimme/bdsm');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bdsm1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	} else if (triple == 3) {
            		const bdsm1 = await axios.get('https://meme-api.herokuapp.com/gimme/TeenBDSM');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bdsm1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}	
            } else {
            	if (triple == 1) {
            		const bdsm1 = await axios.get('https://meme-api.herokuapp.com/gimme/BDSMPics');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bdsm1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	} else if (triple == 2) {
            		const bdsm1 = await axios.get('https://meme-api.herokuapp.com/gimme/bdsm');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bdsm1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	} else if (triple == 3) {
            		const bdsm1 = await axios.get('https://meme-api.herokuapp.com/gimme/TeenBDSM');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bdsm1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}	
            }
			break


        case 'ass':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
            	if (triple == 1) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/LegalTeens');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, '', `${title}`, id)
            	} else if (triple == 2) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/ass');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	} else if (triple == 3) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/bigasses');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}	
             } else {
            	if (triple == 1) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/LegalTeens');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	} else if (triple == 2) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/ass');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	} else if (triple == 3) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/bigasses');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}	
            }
            break		
	
			
        case 'pussy':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
            	if (triple == 1) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/pussy');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, '', `${title}`, id)
            	} else if (triple == 2) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/ass');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	} else if (triple == 3) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/LegalTeens');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}	
             } else {
            	if (triple == 1) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/pussy');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	} else if (triple == 2) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/ass');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	} else if (triple == 3) {
            		const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/LegalTeens');
            		let { postlink, title, subreddit, url, nsfw, spoiler } = bows1.data
            		await kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            	}	
            }
            break
			

        case 'blowjob':
        case 'boquete':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (double == 1) {
					const blowjob = await axios.get('https://nekos.life/api/v2/img/bj')
					await kill.sendFileFromUrl(from, blowjob.data.url, '', '', id)
				} else if (double == 2) {
					const blowjobs = await axios.get('https://nekos.life/api/v2/img/blowjob')
					await kill.sendFileFromUrl(from, blowjobs.data.url, '', '', id)
				}
			} else {
				const blowjob1 = await axios.get('https://nekos.life/api/v2/img/erok')
				await kill.sendFileFromUrl(from, blowjob1.data.url, '', '', id)
			}
			break

			
        case 'feet':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (double == 1) {
					const feet = await axios.get('https://nekos.life/api/v2/img/feetg')
					await kill.sendFileFromUrl(from, feet.data.url, '', '', id)
				} else if (double == 2) {
					const feets = await axios.get('https://nekos.life/api/v2/img/erofeet')
					await kill.sendFileFromUrl(from, feets.data.url, '', '', id)
				}
			} else {
				if (double == 1) {
					const feet = await axios.get('https://nekos.life/api/v2/img/feetg')
					await kill.sendFileFromUrl(from, feet.data.url, '', '', id)
				} else if (double == 2) {
					const feets = await axios.get('https://nekos.life/api/v2/img/erofeet')
					await kill.sendFileFromUrl(from, feets.data.url, '', '', id)
				}
			}
			break
			
			
        case 'hard':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				const hard = await axios.get('https://nekos.life/api/v2/img/spank')
				await kill.sendFileFromUrl(from, hard.data.url, '', '', id)
			} else {
				const hard = await axios.get('https://nekos.life/api/v2/img/spank')
				await kill.sendFileFromUrl(from, hard.data.url, '', '', id)
			}
			break
			
			
        case 'boobs':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (double == 1) {
					const bobis = await axios.get('https://nekos.life/api/v2/img/boobs')
					await kill.sendFileFromUrl(from, bobis.data.url, '', '', id)
				} else if (double == 2) {
					const tits = await axios.get('https://nekos.life/api/v2/img/tits')
					await kill.sendFileFromUrl(from, tits.data.url, '', '', id)
				}
			} else {
				if (double == 1) {
					const bobis = await axios.get('https://nekos.life/api/v2/img/boobs')
					await kill.sendFileFromUrl(from, bobis.data.url, '', '', id)
				} else if (double == 2) {
					const tits = await axios.get('https://nekos.life/api/v2/img/tits')
					await kill.sendFileFromUrl(from, tits.data.url, '', '', id)
				}
			}
			break
			

        case 'lick':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (double == 1) {
					const lick = await axios.get('https://nekos.life/api/v2/img/kuni')
					await kill.sendFileFromUrl(from, lick.data.url, '', '', id)
				} else if (double == 2) {
					const les = await axios.get('https://nekos.life/api/v2/img/les')
					await kill.sendFileFromUrl(from, les.data.url, '', '', id)
				}
			} else {
				if (double == 1) {
					const lick = await axios.get('https://nekos.life/api/v2/img/kuni')
					await kill.sendFileFromUrl(from, lick.data.url, '', '', id)
				} else if (double == 2) {
					const les = await axios.get('https://nekos.life/api/v2/img/les')
					await kill.sendFileFromUrl(from, les.data.url, '', '', id)
				}
			}
			break
			
			
        case 'femdom':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (triple == 1) {
					const femdom = await axios.get('https://nekos.life/api/v2/img/femdom')
					await kill.sendFileFromUrl(from, femdom.data.url, '', '', id)
				} else if (triple == 2) {
					const femdom1 = await axios.get('https://nekos.life/api/v2/img/yuri')
					await kill.sendFileFromUrl(from, femdom1.data.url, '', '', id)
				} else if (triple == 3) {
					const femdom2 = await axios.get('https://nekos.life/api/v2/img/eroyuri')
					await kill.sendFileFromUrl(from, femdom2.data.url, '', '', id)
				}
			} else {
				if (triple == 1) {
					const femdom = await axios.get('https://nekos.life/api/v2/img/femdom')
					await kill.sendFileFromUrl(from, femdom.data.url, '', '', id)
				} else if (triple == 2) {
					const femdom1 = await axios.get('https://nekos.life/api/v2/img/yuri')
					await kill.sendFileFromUrl(from, femdom1.data.url, '', '', id)
				} else if (triple == 3) {
					const femdom2 = await axios.get('https://nekos.life/api/v2/img/eroyuri')
					await kill.sendFileFromUrl(from, femdom2.data.url, '', '', id)
				}
			}
			break


        case 'futanari':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				const futanari = await axios.get('https://nekos.life/api/v2/img/futanari')
				await kill.sendFileFromUrl(from, futanari.data.url, '', '', id)
			} else {
				const futanari = await axios.get('https://nekos.life/api/v2/img/futanari')
				await kill.sendFileFromUrl(from, futanari.data.url, '', '', id)
			}
			break
			
			
        case 'masturb':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (triple == 1) {
					const solog = await axios.get('https://nekos.life/api/v2/img/solog')
					await kill.sendFileFromUrl(from, solog.data.url, '', '', id)
				} else if (triple == 2) {
					const pwank = await axios.get('https://nekos.life/api/v2/img/solog')
					await kill.sendFileFromUrl(from, pwank.data.url, '', '', id)
				} else if (triple == 3) {
					const solour = await axios.get('https://nekos.life/api/v2/img/solo')
					await kill.sendFileFromUrl(from, solour.data.url, '', '', id)
				}
			} else {
				if (triple == 1) {
					const solog = await axios.get('https://nekos.life/api/v2/img/solog')
					await kill.sendFileFromUrl(from, solog.data.url, '', '', id)
				} else if (triple == 2) {
					const pwank = await axios.get('https://nekos.life/api/v2/img/solog')
					await kill.sendFileFromUrl(from, pwank.data.url, '', '', id)
				} else if (triple == 3) {
					const solour = await axios.get('https://nekos.life/api/v2/img/solo')
					await kill.sendFileFromUrl(from, solour.data.url, '', '', id)
				}
			}
			break
			
			
        case 'anal':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
				if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (double == 1) {
					const solog = await axios.get('https://nekos.life/api/v2/img/cum')
					await kill.sendFileFromUrl(from, solog.data.url, '', '', id)
				} else if (double == 2) {
					const anal = await axios.get('https://nekos.life/api/v2/img/cum_jpg')
					await kill.sendFileFromUrl(from, anal.data.url, '', '', id)
				}
			} else {
				if (double == 1) {
					const solog = await axios.get('https://nekos.life/api/v2/img/cum')
					await kill.sendFileFromUrl(from, solog.data.url, '', '', id)
				} else if (double == 2) {
					const anal = await axios.get('https://nekos.life/api/v2/img/cum_jpg')
					await kill.sendFileFromUrl(from, anal.data.url, '', '', id)
				}
			}
			break        
			
			
		case 'randomloli':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
				if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				const loliz = await axios.get('https://nekos.life/api/v2/img/keta')
				await kill.sendFileFromUrl(from, loliz.data.url, '', '', id)
			} else {
				const loliz = await axios.get('https://nekos.life/api/v2/img/keta')
				await kill.sendFileFromUrl(from, loliz.data.url, '', '', id)
			}
			break
			
			
        case 'nsfwicon':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
				if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				const icon = await axios.get('https://nekos.life/api/v2/img/nsfw_avatar')
				await kill.sendFileFromUrl(from, icon.data.url, '', '', id)
			} else {
				const icon = await axios.get('https://nekos.life/api/v2/img/nsfw_avatar')
				await kill.sendFileFromUrl(from, icon.data.url, '', '', id)
			}
			break
			
			
		case 'truth':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const memean = await axios.get('https://nekos.life/api/v2/img/gecg')
			await kill.sendFileFromUrl(from, memean.data.url, '', '', id)
			break
			

		case 'icon':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const avatarz = await axios.get('https://nekos.life/api/v2/img/avatar')
			await kill.sendFileFromUrl(from, avatarz.data.url, '', '', id)
			break
			
			
		case 'face':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const gasm = await axios.get('https://nekos.life/api/v2/img/gasm')
			await kill.sendFileFromUrl(from, gasm.data.url, '', '', id)
			break
			

		case 'pezinho':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				const pezin = await axios.get('https://nekos.life/api/v2/img/feet')
				await kill.sendFileFromUrl(from, pezin.data.url, '', '', id)
            } else {
				const pezin = await axios.get('https://nekos.life/api/v2/img/feet')
				await kill.sendFileFromUrl(from, pezin.data.url, '', '', id)
			}
			break
			
			
		case 'gadometro':
		case 'gado':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			gaak = body.trim().split(' ')
			var chifre = ["ultra extreme gado", "Gado-Master", "Gado-Rei", "Gado", "Escravo-ceta", "Escravo-ceta Maximo", "Gacorno?", "Jogador De Forno Livre<3", "Mestre Do Frifai<3<3", "Gado-Manso", "Gado-Conformado", "Gado-Incubado", "Gado Deus", "Mestre dos Gados", "TPTDPBCT=Topa Tudo Por Buceta KKKJ", "Gado Comum", "Mini-Pedro", "Mini Gadinho", "Gado Iniciante", "Gado Basico", "Gado Intermediario", "Gado Avançado", "Gado Proffisional", "Gado Mestre", "Gado Chifrudo", "Corno Conformado", "Corno HiperChifrudo", "Chifrudo Deus", "Mestre dos Chifrudos"]
			var gado = chifre[Math.floor(Math.random() * chifre.length)]
			if (args.length == 1) {
				await kill.sendTextWithMentions(from, gaak[1] + ' é ' + lvpc + '% ' + gado + 'KKKKJ.')
			} else {
				await kill.reply(from, `Você é ` + lvpc + '% ' + gado + ' KKKKJ.', id)
			}
			break
			
		case 'gamemode':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) return kill.reply(from, 'Você esqueceu de colocar se quer ativado [1  ou c ou creative], ou desativado [0 ou s ou survival].', id)
			if (args[0] == '1' || args[0] == 'c' || args[0] == 'creative') {
				kill.sendTextWithMentions(from, `O modo de jogo de "@${sender.id}" foi definido para criativo.`)
			} else if (args[0] == '0' || args[0] == 's' || args[0] == 'survival') {
				kill.sendTextWithMentions(from, `O modo de jogo de "@${sender.id}" foi definido para sobrevivencia.`)
			} else {
				kill.reply(from, 'Você esqueceu de colocar se quer ativado [1  ou c ou creative], ou desativado [0 ou s ou survival].', id)
			}
            break


        case 'ihentai':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
		    const selnum = Math.floor(Math.random() * 6) + 1 
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (selnum == 1) {
					const clas = await axios.get('https://nekos.life/api/v2/img/classic')
					await kill.sendFileFromUrl(from, clas.data.url, ``, '', id)
				} else if (selnum == 2) {
					const hentai = await randomNimek('hentai')
					await kill.sendFileFromUrl(from, hentai, ``, 'Ui ui, hentai essa hora?', id)
				} else if (selnum == 3) {
					const hentai3 = await axios.get('https://nekos.life/api/v2/img/Random_hentai_gif')
					await kill.sendFileFromUrl(from, hentai3, ``, 'Espero que curta o hentai e.e', id)
				} else if (selnum == 4) {
					const hentai4 = await axios.get('https://nekos.life/api/v2/img/pussy_jpg')
					await kill.sendFileFromUrl(from, hentai4.data.url, ``, 'Espero que curta o hentai e.e', id)
				} else if (selnum == 5) {
					const hentai5 = await axios.get('https://nekos.life/api/v2/img/hentai')
					await kill.sendFileFromUrl(from, hentai5.data.url, ``, 'Hentaizinho bom...', id)
				} else if (selnum == 6) {
					const hentai6 = await axios.get('https://nekos.life/api/v2/img/pussy')
					await kill.sendFileFromUrl(from, hentai6.data.url, ``, 'Hentaizinho bom...', id)
				}
            } else {
			    if (selnum == 1) {
					const hentai1 = await axios.get('https://nekos.life/api/v2/img/Random_hentai_gif')
					await kill.sendFileFromUrl(from, hentai1, ``, 'Espero que curta o hentai e.e', id)
				} else if (selnum == 2) {
					const hentai2 = await axios.get('https://nekos.life/api/v2/img/pussy_jpg')
					await kill.sendFileFromUrl(from, hentai2.data.url, ``, 'Espero que curta o hentai e.e', id)
				} else if (selnum == 3) {
					const clas = await axios.get('https://nekos.life/api/v2/img/classic')
					await kill.sendFileFromUrl(from, clas.data.url, ``, '', id)
				} else if (selnum == 4) {
					const hentai4 = await axios.get('https://nekos.life/api/v2/img/hentai')
					await kill.sendFileFromUrl(from, hentai4.data.url, ``, 'Hentaizinho bom...', id)
				} else if (selnum == 5) {
					const hentai5 = await axios.get('https://nekos.life/api/v2/img/pussy')
					await kill.sendFileFromUrl(from, hentai5.data.url, ``, 'Hentaizinho bom...', id)
				} else if (selnum == 6) {
					const hentai6 = await randomNimek('hentai')
					await kill.sendFileFromUrl(from, hentai6, ``, 'Ui ui, hentai essa hora?', id)
				}
			}
            break


        case 'yuri':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const yuri1 = await randomNimek('yuri')
			console.log(yuri1)
            await kill.sendFileFromUrl(from, yuri1, ``, ``, id)
            break 


        case 'randomneko':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
				if (seven == 1) {
					const nekons = await axios.get('https://nekos.life/api/v2/img/nsfw_neko_gif')
					await kill.sendFileFromUrl(from, nekons.data.url, ``, '', id)
				} else if (seven == 2) {
					const nsfwneko = await randomNimek('nsfw')
					await kill.sendFileFromUrl(from, nsfwneko, ``, '', id)
				} else if (seven == 3) {
					const hololwk = await axios.get('https://nekos.life/api/v2/img/hololewd')
					await kill.sendFileFromUrl(from, hololwk.data.url, ``, 'Neko gostosa...', id)
				} else if (seven == 4) {
					const lwkd = await axios.get('https://nekos.life/api/v2/img/lewdk')
					await kill.sendFileFromUrl(from, lwkd.data.url, ``, '', id)
				} else if (seven == 5) {
					const lwkdk = await axios.get('https://nekos.life/api/v2/img/lewdkemo')
					await kill.sendFileFromUrl(from, lwkdk.data.url, ``, '', id)
				} else if (seven == 6) {
					const eron = await axios.get('https://nekos.life/api/v2/img/eron')
					await kill.sendFileFromUrl(from, eron.data.url, ``, '', id)
				} else if (seven == 7) {
					const holoero = await axios.get('https://nekos.life/api/v2/img/holoero')
					await kill.sendFileFromUrl(from, holoero.data.url, ``, '', id)
				}
            } else {
				if (seven == 1) {
					const nekons = await axios.get('https://nekos.life/api/v2/img/nsfw_neko_gif')
					await kill.sendFileFromUrl(from, nekons.data.url, ``, '', id)
				} else if (seven == 2) {
					const nsfwneko = await randomNimek('nsfw')
					await kill.sendFileFromUrl(from, nsfwneko, ``, '', id)
				} else if (seven == 3) {
					const hololwk = await axios.get('https://nekos.life/api/v2/img/hololewd')
					await kill.sendFileFromUrl(from, hololwk.data.url, ``, 'Neko gostosa...', id)
				} else if (seven == 4) {
					const lwkd = await axios.get('https://nekos.life/api/v2/img/lewdk')
					await kill.sendFileFromUrl(from, lwkd.data.url, ``, '', id)
				} else if (seven == 5) {
					const lwkdk = await axios.get('https://nekos.life/api/v2/img/lewdkemo')
					await kill.sendFileFromUrl(from, lwkdk.data.url, ``, '', id)
				} else if (seven == 6) {
					const eron = await axios.get('https://nekos.life/api/v2/img/eron')
					await kill.sendFileFromUrl(from, eron.data.url, ``, '', id)
				} else if (seven == 7) {
					const holoero = await axios.get('https://nekos.life/api/v2/img/holoero')
					await kill.sendFileFromUrl(from, holoero.data.url, ``, '', id)
				}
			}
            break


        case 'trap':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (isGroupMsg) {
                if (!isNsfw) return kill.reply(from, mess.error.Ac, id)
            if (double == 1) {
				const tapr = await axios.get('https://nekos.life/api/v2/img/trap')
				await kill.sendFileFromUrl(from, tapr.data.url, '', '', id)
            } else if (double == 2) {
				const trap = await randomNimek('trap')
				kill.sendFileFromUrl(from, trap, ``, '', id)
			}
            } else {
				const tapr = await axios.get('https://nekos.life/api/v2/img/trap')
				await kill.sendFileFromUrl(from, tapr.data.url, '', '', id)
            }
            break


        case 'randomwall' :
            const walnime = await axios.get('https://nekos.life/api/v2/img/wallpaper')
            await kill.sendFileFromUrl(from, walnime.data.url, '', '', id)
            break
			
			
		case 'valor':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) return kill.reply(from, 'Para usar digite o comando e em seguida o valor e tipo.\n\nExemplo: /valor 1USD (Junto mesmo.)\n\nDigite /coins para ver a lista de moedas que podem ser usadas [É uma lista enormeeeeee].', id)
			const money = await axios.get(`https://brl.rate.sx/${args[0]}`)
			await kill.reply(from, `*${args[0]}* _vale no Brasil_ *${money.data}* _reais._`, id)
			break
			
			
        case 'dog': 
		    if (double == 1) {
				const list = await axios.get('http://shibe.online/api/shibes')
				const doguin = list.data[0]
				await kill.sendFileFromUrl(from, doguin, '', 'doguinho', id)
			} else if (double == 2) {
				const doug = await axios.get('https://nekos.life/api/v2/img/woof')
				await kill.sendFileFromUrl(from, doug.data.url, '', 'doguinho', id)
			}
            break
			
			
        case 'look' :
            const smug = await axios.get('https://nekos.life/api/v2/img/smug')
            await kill.sendFileFromUrl(from, smug.data.url, '', '', id)
            break
			
			
        case 'holo' :
            const holo = await axios.get('https://nekos.life/api/v2/img/holo')
            await kill.sendFileFromUrl(from, holo.data.url, '', '', id)
            break


		case 'rolette':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (double == 1) {
            await kill.reply(from, 'Bang, ela disparou e você morreu, é game over.', id)
            } else if (double == 2) {
				await kill.reply(from, 'Você continua vivo, passe a vez.', id)
			}
			break
			
			
		case 'kisu':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const kisu = await axios.get('https://nekos.life/api/v2/img/kiss')
			await kill.sendFileFromUrl(from, kisu.data.url, '', '', id)
			break
			
			
		case 'tapa':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const tapi = await axios.get('https://nekos.life/api/v2/img/slap')
			await kill.sendFileFromUrl(from, tapi.data.url, '', '', id)
			break


        case 'gato':
        case 'cat':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (double == 1) {
				q2 = Math.floor(Math.random() * 900) + 300;
				q3 = Math.floor(Math.random() * 900) + 300;
				kill.sendFileFromUrl(from, 'https://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ')
			} else if (double == 2) {
				const catu = await axios.get('https://nekos.life/api/v2/img/meow')
				await kill.sendFileFromUrl(from, catu.data.url, id)
			}
            break


        case 'pokemon':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            q7 = Math.floor(Math.random() * 890) + 1;
            await kill.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + q7 + '.png', 'Pokemon.png', '', id)
            break		


        case 'screenshot':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const _query = body.slice(12)
            if (!_query.match(isUrl)) return kill.reply(from, mess.error.Iv, id)
            if (args.length == 0) return kill.reply(from, 'Sinto cheiro de ortografia incorreta [faltou https:// ?]!', id)
            await ss(_query)
            await sleep(4000)
			await kill.sendFile(from, './lib/media/img/screenshot.jpeg', 'ss.jpeg', 'Se certifique de evitar usar isso com pornografia.', id)
            .catch(() => kill.reply(from, `Erro na screenshot do site ${_query}`, id))
            break
			
			
		case 'ship':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            lvak = body.trim().split(' ')
			if (args.length == 2) {
				await kill.sendTextWithMentions(from, '❤️ ' + lvak[1] + ' tem um chance de ' + lvpc + '% de namorar ' + lvak[2] + '. 👩‍❤️‍👨')
            } else {
				await kill.reply(from, 'Faltou marcar o casal de pombinhos!', id)
            }
			break	
			

        case 'gay':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            gaak = body.trim().split(' ')
    	    var lgbt = ["lésbica", "gay", "bissexual", "transgenero", "queer", "intersexual", "pedro-sexual", "negrosexual", "helicoptero sexual", "ageneros", "androgino", "assexual", "macaco-sexual", "dedo-sexual", "Sexo-Inexplicavel", "predio-sexual", "sexual-não-sexual", "pansexual", "kink", "incestuoso", "comedor-de-casadas", "unicornio-sexual", "maniaco-sexual"]
    	    var guei = lgbt[Math.floor(Math.random() * lgbt.length)]
			if (args.length == 1) {
				await kill.sendTextWithMentions(from, gaak[1] + ' é ' + lvpc + '% ' + guei + '.')
            } else {
				await kill.reply(from, `Você é ` + lvpc + '% ' + guei + '.', id)
            }
			break
			

		case 'chance':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) return kill.reply(from, 'Defina algo para analisar.', id)
			await kill.reply(from, `_De acordo com meus calculos super avançados de ~macaco femea~ robô "cuie" a chance de..._ \n\n*"${body.slice(8)}"*\n\n_...ser realidade é de_ *${lvpc}%.*`, id)
			break


        case 'kiss':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            arqa = body.trim().split(' ')
			if (args.length == 1) {
				const persona = author.replace('@c.us', '')
				kill.sendTextWithMentions(from, 'Minha nossa! @' + persona + ' deu um beijo em ' + arqa[1] + ' !')
				if (double == 1) {
				await kill.sendGiphyAsSticker(from, 'https://media.giphy.com/media/vUrwEOLtBUnJe/giphy.gif')
				} else {
				await kill.sendGiphyAsSticker(from, 'https://media.giphy.com/media/1wmtU5YhqqDKg/giphy.gif')
				}
			} else {
				await kill.reply(from, 'Marque ~apenas uma~ a pessoa quem você quer beijar hihihi', id)
            }
			break


        case 'slap':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            arq = body.trim().split(' ')
            const person = author.replace('@c.us', '')
            await kill.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif')
            kill.sendTextWithMentions(from, '@' + person + ' *deu um tapa em* ' + arq[1])
            break


        case 'getmeme':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            const response = await axios.get('https://meme-api.herokuapp.com/gimme/memesbrasil');
            const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
            kill.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`, id)
            break
			
			
        case 'date':
        case 'data':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const timeda = moment(t * 1000).format('DD/MM/YY HH:mm:ss')
			await kill.reply(from, 'Agora são exatamente\n"' + timeda + '"', id)
			break
		

        case 'menu':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			const timed = moment(t * 1000).format('DD/MM/YY HH:mm:ss')
			const allin = `Olá usuário "@${sender.id}"!\n\nLevei ${processTime(t, moment())} segundos para te responder.\n\nAgora são exatas "${timed}".\nAbaixo estão minhas funções.\n`
            kill.sendTextWithMentions(from, allin + help, id)
            kill.reply(from, 'De outros comandos temos...\n\n*/Admins* _é para administradores._\n\n*/Kill* _é apenas para meu dono._\n\n*/Adult* _é o menu de comandos adultos._\n\n*/Down* _é o menu de download de músicas e videos._', id)
            break


        case 'admins':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (!isGroupMsg) return kill.reply(from, mess.error.Gp, id)
            if (!isGroupAdmins) return kill.reply(from, mess.error.Ga, id)
            await kill.sendText(from, admins, id)
            break


        case 'adult':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            kill.sendText(from, adult, id)
            break
			

        case 'kill':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            if (!isOwner) return kill.reply(from, mess.error.Kl, id)
            kill.sendText(from, owner, id)
            break


        case 'down':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            kill.sendText(from, down, id)
            break


        case 'readme':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
            kill.reply(from, readme, id)
            break
			
		
		case 'bomb':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
		    const bleg = JSON.parse(fs.readFileSync('./lib/config/exclusive.json'))
			const biao = bleg.includes(chat.id)
			if (biao) {
				const alvo = `@${body.slice(6)}`
				await kill.sendTextWithMentions(from, 'Beleza! Pedido recebido e iniciado, o alvo \"' + alvo + '\" será atacado dentro de alguns segundos!', id)
				if (!isGroupAdmins) return kill.reply(from, mess.error.Ga, id)
				const atk = execFile('./lib/bomb/bomb.exe', [`${body.slice(6)}`, '3', '1', '0'], function(err, data) { // o bomb esta configurado para Windows, se estiver no linux troque bomb.exe para lbomb, ficando ./lib/bomb/lbomb
				if(err) {
				console.log('O programa fechou, isso indica um erro ou fechamento manual.')
				kill.reply(from, 'O ataque foi cancelado manualmente ou obteve erros na execução.', id)
				}
				})
			} else {
				console.log('erro')   
				kill.reply(from, 'Você deve ativar o uso aqui com /exclusive on.', id)
			}
			break
			
		case 'cmd':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (!isOwner) return kill.reply(from, mess.error.Kl, id)
			const cmdw = exec(`${body.slice(5)}`, function(stderr, data) {
				if (stderr) {
					console.log(stderr)
					kill.reply(from, data + '\n\n' + stderr, id)
				} else {
					console.log(data)
					kill.reply(from, data, id)
				}
			})
			break

			
		case 'mac':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 0) return kill.reply(from, 'Desculpe, mas você precisa especificar qual MAC deseja puxar.', id)
			await kill.reply(from, 'Aguarde, essa operação leva cerca de 6 segundos por conta da limitação de tempo.', id)
			await sleep(3000)
			const maclk = await axios.get(`https://api.macvendors.com/${body.slice(5)}`)
			console.log(`{body.slice(5)}`)
			const macre = maclk.data
			await kill.reply(from, `O telefone é da ${macre}.`, id)
			break
			
			
		case 'converter':
		case 'conv':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args == 0) return kill.reply(from, 'Digite o modo de conversão e em seguida a temperatura, para mais detalhes digite /conv -h.', id)
			if (args[0] == '-help' || args[0] == '-h') return kill.reply(from, convh, id)
			try {
				if (args[0] == '-f') {
					let regmh = args[1].match(/^[0-9]+$/)
					if (!regmh) return kill.reply(from, 'Digite apenas números após a sigla!', id)
					const cels = args[1] / 5 * 9 + 32
					await kill.reply(from, `*${args[1]}* graus C° - Celsius equivalem a ${cels} graus F° - Fahrenheit.`, id)
				} else if (args[0] == '-c') {
					let regmh = args[1].match(/^[0-9]+$/)
					if (!regmh) return kill.reply(from, 'Digite apenas números após a sigla!', id)
					const fahf = 5 * (args[1] - 32) / 9
					await kill.reply(from, `*${args[1]}* _graus F° - Fahrenheit equivalem a_ *${fahf}* _graus C° - Celsius._`, id)
				} else if (args[0] == '-m') {
					let regmh = args[1].match(/^[0-9]+$/)
					if (!regmh) return kill.reply(from, 'Digite apenas números após a sigla!', id)
					const ktom = args[1] * 0.62137
					await kill.reply(from, `*${args[1]}* _Quilômetros equivalem a_ *${ktom}* _Milhas._`, id)
				} else if (args[0] == '-q') {
					let regmh = args[1].match(/^[0-9]+$/)
					if (!regmh) return kill.reply(from, 'Digite apenas números após a sigla!', id)
					const mtok = args[1] / 0.62137
					await kill.reply(from, `*${args[1]}* _Milhas equivalem a_ *${mtok}* _Quilômetros._`, id)
				} else {
					await kill.reply(from, convh, id)
				}
			} catch (error) {
				await kill.reply(from, convh + '\n\nCertifique-se de botar o valor da conversão.', id)
			}
			break


        case 'mute':
        case 'silence':
			if (isGroupMsg && isGroupAdmins) {
				if (args.length !== 1) return kill.reply(from, 'Você esqueceu de colocar se quer ativado [on], ou desativado [off].', id)
				if (args[0] == 'on') {
					slce.push(chat.id)
					fs.writeFileSync('./lib/config/silence.json', JSON.stringify(slce))
					kill.reply(from, 'Esse grupo não poderá mais usar os comandos.', id)
				} else if (args[0] == 'off') {
					let ince = slce.indexOf(chatId)
					slce.splice(ince, 1)
					fs.writeFileSync('./lib/config/silence.json', JSON.stringify(slce))
					kill.reply(from, 'Esse grupo poderá usar os comandos novamente.', id)
				}
			} else if (isGroupMsg && isOwner) {
				if (args.length !== 1) return kill.reply(from, 'Você esqueceu de colocar se quer ativado [on], ou desativado [off].', id)
				if (args[0] == 'on') {
					slce.push(chat.id)
					fs.writeFileSync('./lib/config/silence.json', JSON.stringify(slce))
					kill.reply(from, 'Esse grupo não poderá mais usar os comandos.', id)
				} else if (args[0] == 'off') {
					let ince = slce.indexOf(chatId)
					slce.splice(ince, 1)
					fs.writeFileSync('./lib/config/silence.json', JSON.stringify(slce))
					kill.reply(from, 'Esse grupo poderá usar os comandos novamente.', id)
				}
            } else {
                kill.reply(from, mess.error.Ga, id)
            }
            break
			
			
		case 'scnpj':
			if (mute || pvmte) return console.log('Ignorando comando [Silence]')
			if (args.length == 1) {
				const cnpj = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${body.slice(7)}`)
				if (cnpj.data.status == 'ERROR') return kill.reply(from, cnpj.data.message, id)
				await kill.reply(from, `✪ CNPJ: ${cnpj.data.cnpj}\n\n✪ Tipo: ${cnpj.data.tipo}\n\n✪ Nome: ${cnpj.data.nome}\n\n✪ Região: ${cnpj.data.uf}\n\n✪ Telefone: ${cnpj.data.telefone}\n\n✪ Situação: ${cnpj.data.situacao}\n\n✪ Bairro: ${cnpj.data.bairro}\n\n✪ Logradouro: ${cnpj.data.logradouro}\n\n✪ CEP: ${cnpj.data.cep}\n\n✪ Casa N°: ${cnpj.data.numero}\n\n✪ Municipio: ${cnpj.data.municipio}\n\n✪ Abertura: ${cnpj.data.abertura}\n\n✪ Fantasia: ${cnpj.data.fantasia}\n\n✪ Jurisdição: ${cnpj.data.natureza_juridica}`, id)
            } else {
				await kill.reply(from, 'Especifique um CNPJ sem os traços e pontos.', id)
            }
			break
			
			
		case 'coins':
			await kill.reply(from, coins, id)
			break
			
			
        case 'mutepv':
            if (isOwner) {
				if (args[0] == 'on') {
					if (args.length == 0) return kill.reply(from, 'Você deve definir [on e off] e em seguida o número da pessoa sem - ou +.', id)
					const pvmt = body.slice(11) + '@c.us'
					slce.push(pvmt)
					fs.writeFileSync('./lib/config/silence.json', JSON.stringify(slce))
					await kill.reply(from, 'Ele não poderá usar a iris.', id)
				} else if (args[0] == 'off') {
					if (args.length == 0) return kill.reply(from, 'Você deve definir [on e off] e em seguida o número da pessoa sem - ou +.', id)
					const pvmt = body.slice(11) + '@c.us'
					let pvtnm = slce.indexOf(pvmt)
					slce.splice(pvtnm, 1)
					fs.writeFileSync('./lib/config/silence.json', JSON.stringify(slce))
					await kill.reply(from, 'Ele poderá usar a iris novamente.', id)
				} else {
					await kill.reply(from, 'Você deve definir [on e off] e em seguida o número da pessoa sem - ou +.', id)
				}
			} else {
				await kill.reply(from, mess.error.Kl)
			}
			break
			
			
        case 'autosticker':
			if (mute || pvmte) return console.log('Comando ignorado [Silence]')
            if (!isGroupMsg) return await kill.reply(from, mess.error.Gp, id)
            if (!isGroupAdmins) return await kill.reply(from, mess.error.Ga, id)
            if (args[0] == 'on') {
                atstk.push(groupId)
                fs.writeFileSync('./lib/config/sticker.json', JSON.stringify(atstk))
                await kill.reply(from, 'O Auto-Sticker foi ativado, todas as imagens serão enviadas serão convertidas em sticker.', id)
            } else if (args[0] == 'off') {
                atstk.splice(groupId, 1)
                fs.writeFileSync('./lib/config/sticker.json', JSON.stringify(atstk))
                await kill.reply(from, 'Auto-Sticker desativado, as imagens não serão automaticamente convertidas em sticker.', id)
            } else {
                await kill.reply(from, 'Defina entre [on] e [off].', id)
            }
			break

        }
    } catch (err) {
        console.log(color('[ERRO]', 'red'), err)
    }
}