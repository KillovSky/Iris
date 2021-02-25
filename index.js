const { create, Client } = require('@open-wa/wa-automate') // As consts aqui declaram as funções de outros arquivos
const fs = require('fs-extra')
const kconfig = require('./config')
const options = require('./options')
const color = require('./lib/color')
const { sleep } = require('./lib/functions')
const config = require('./lib/config/config.json')
const canvas = require('discord-canvas')
const welkom = JSON.parse(fs.readFileSync('./lib/config/welcome.json'))
const bklist = JSON.parse(fs.readFileSync('./lib/config/anti.json'))
const anti = JSON.parse(fs.readFileSync('./lib/config/blacklist.json'))
const fks = JSON.parse(fs.readFileSync('./lib/config/fake.json'))

// Cria um cliente de inicialização da BOT
const start = (kill = new Client()) => {
    console.log(color('\n[DEV]', 'red'), color('- Lucas R. - KillovSky <-> +55 18 99804-4132 <-> https://chat.whatsapp.com/H53MdwhtnRf7TGX1VJ2Jje'))
	console.log(color('[ÍRIS]', 'red'), color('Minha inicialização foi concluída, você pode usar agora...\n'))
	
		// Forçar recarregamento caso obtenha erros
		kill.onStateChanged((state) => {
			console.log('[Estado da Íris]', state)
			if (state === 'UNPAIRED' || state === 'CONFLICT' || state === 'UNLAUNCHED') kill.forceRefocus()
		})
		
        // Le as mensagens e limpa cache
        kill.onMessage((async (message) => {
            kill.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    kill.cutMsgCache()
                }
            })
            kconfig(kill, message)
        }))
		
		// Configuração do welcome
		kill.onGlobalParticipantsChanged(async (event) => {
			const ddi = config.ddi
			const personr = event.who
			const isWelkom = welkom.includes(event.chat)
			const isFake = fks.includes(event.chat)
			const fake = personr.startsWith(ddi)
			const isAnti = anti.includes(event.chat)
			const fuck = bklist.includes(event.who)
			const eChat = await kill.getContact(event.who)
			let { pushname, verifiedName, formattedName } = eChat
			pushname = pushname || verifiedName || formattedName
			const gChat = await kill.getChatById(event.chat)
			const { contact, groupMetadata, name } = gChat
			try {
				if (event.action == 'add') {
					if (isAnti && fuck) {
						await kill.sendText(event.chat, `E TU TA AQUI MENÓ?! TU TA AQUI DNV MENÓ??`)
						await sleep(2000)
						await kill.removeParticipant(event.chat, event.who)
						console.log(color('[BLACKLIST]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${name} por ter sido colocado na blacklist...`, 'yellow'))
					} else if (isFake && !fake) {
						await kill.sendTextWithMentions(event.chat, `Olá @${event.who.replace('@c.us', '')}, como parte do nosso sistema de segurança, números de fora do Brasil são banidos, se você não for alguém mal e quiser estar no grupo pacificamente, por favor contate os administradores 😉.\n\nHello @${event.who.replace('@c.us', '')}, as part of our security system, numbers outside Brazil are banned, if you are not someone bad and want to be in the group peacefully, please contact the administrators 😉.\n\nHalo @${event.who.replace('@c.us', '')}, sebagai bagian dari sistem keamanan kami, nomor di luar Brasil dilarang, jika Anda bukan orang jahat dan ingin berada di grup dengan damai, silakan hubungi administrator 😉.\n\nHola @${event.who.replace('@c.us', '')}, como parte de nuestro sistema de seguridad, los números fuera de Brasil están prohibidos, si no eres alguien malo y quieres estar en el grupo pacíficamente, por favor contacte a los administradores 😉.`)
						await sleep(4000)
						await kill.removeParticipant(event.chat, event.who)
						console.log(color('[FAKE]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${name} por usar número falso ou ser de fora do país...`, 'yellow'))
					} else if (isWelkom) {
						var profile = await kill.getProfilePicFromServer(event.who)
						if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
						const welcomer = await new canvas.Welcome()
							.setUsername(pushname)
							.setDiscriminator(event.who.substring(6, 10))
							.setMemberCount(groupMetadata.participants.length)
							.setGuildName(name)
							.setAvatar(profile)
							.setColor('border', '#00100C')
							.setColor('username-box', '#00100C')
							.setColor('discriminator-box', '#00100C')
							.setColor('message-box', '#00100C')
							.setColor('title', '#00FFFF')
							.setBackground('https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg')
							.toAttachment()
						const base64 = `data:image/png;base64,${welcomer.toBuffer().toString('base64')}`
						await kill.sendFile(event.chat, base64, 'welcome.png', `Olá ${pushname}! 🥰 \n\nSeja bem vindo ao ${name} 😎 \n\nDesejamos que se divirta e obviamente que siga nossas regras! ✅ \n\nCaso precise, chame um Administrador ou digite ${config.prefix}menu. 👨🏻‍💻`)
						console.log(color('[ENTROU]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) entrou no grupo ${name}...`, 'yellow'))
					}
				} else if (event.action == 'remove' && isWelkom) {
					var profile = await kill.getProfilePicFromServer(event.who)
					if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
					const bye = await new canvas.Goodbye()
						.setUsername(pushname)
						.setDiscriminator(event.who.substring(6, 10))
						.setMemberCount(groupMetadata.participants.length)
						.setGuildName(name)
						.setAvatar(profile)
						.setColor('border', '#00100C')
						.setColor('username-box', '#00100C')
						.setColor('discriminator-box', '#00100C')
						.setColor('message-box', '#00100C')
						.setColor('title', '#00FFFF')
						.setBackground('https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg')
						.toAttachment()
					const base64 = `data:image/png;base64,${bye.toBuffer().toString('base64')}`
					await kill.sendFile(event.chat, base64, 'welcome.png', `Mais um membro ~gado~ saiu, sentiremos falta do ${pushname} ... \nF. ~Agora temos -1 gado pra colheita, shit!~`)
					console.log(color('[SAIU/BAN]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) saiu ou foi banido do grupo ${name}...`, 'yellow'))
				}
			} catch (err) {
				console.log(err)
			}
        })
        
		
		// Funções para caso seja adicionada em um grupo
        kill.onAddedToGroup(async (chat) => {
			const wlcmsg = `Oi! 🌟\nFui requisitada como BOT para esse grupo, e estarei a disposição de vocês! 🤖\nSe quiserem ver minhas funcões usem ${config.prefix}menu!`
			const lmtgru = await kill.getAllGroups()
            const totalMem = chat.groupMetadata.participants.length
			if (chat.groupMetadata.participants.includes(config.owner)) {
				kill.sendText(chat.id, wlcmsg)
			} else if (totalMem < config.memberLimit) {
            	await kill.sendText(chat.id, `Um novo grupo, Eba! 😃\nUma pena que vocês não tem o requisito, que é ter pelo menos ${config.memberLimit} membros. Você possui ${totalMem}, junte mais pessoas! 😉`)
				await kill.deleteChat(chat.id)
				await kill.leaveGroup(chat.id)
			} else if (lmtgru.length > config.gpLimit) {
				await kill.sendText(chat.id, `Desculpe, estamos no máximo de grupos!\nAtualmente estamos em ${lmtgru.length}/${config.gpLimit}`)
				await kill.deleteChat(chat.id)
				await kill.leaveGroup(chat.id)
            } else {
                kill.sendText(chat.id, wlcmsg)
            }
        })
		

        // Bloqueia na call
        kill.onIncomingCall(async (callData) => {
            await kill.sendText(callData.peerJid, `Que pena! Chamadas não são suportadas e atrapalham muito! 😊\nTe bloqueei para evitar novas, contate o dono wa.me/${config.owner.replace('@c.us', '')} para efetuar o desbloqueio. 👋`)
            await kill.contactBlock(callData.peerJid)
			console.log(color('[CALL]', 'red'), color(`${callData.peerJid.replace('@c.us', '')} foi bloqueado por me ligar...`, 'yellow'))
        })
    }

create(options(true, start))
    .then((kill) => start(kill))
    .catch((err) => new Error(err))