const { create, Client } = require('@open-wa/wa-automate') // As consts aqui declaram as funções de outros arquivos
const fs = require('fs-extra')
const kconfig = require('./config')
const options = require('./options')
const color = require('./lib/color')
const { sleep } = require('./lib/functions')
const config = require('./lib/config/config.json')
const welkom = JSON.parse(fs.readFileSync('./lib/config/welcome.json'))
const bklist = JSON.parse(fs.readFileSync('./lib/config/anti.json'))
const anti = JSON.parse(fs.readFileSync('./lib/config/blacklist.json'))
const fks = JSON.parse(fs.readFileSync('./lib/config/fake.json'))

// Cria um cliente de inicialização da BOT
const start = (kill = new Client()) => {
    console.log(color('\n[DEV]', 'red'), color('- Lucas R. - KillovSky <-> +55 18 99804-4132 <-> https://chat.whatsapp.com/H53MdwhtnRf7TGX1VJ2Jje'))
	console.log(color('[Íris]', 'red'), color('Minha inicialização foi concluída, você pode usar agora...\n'))
	
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
			const isWelkom = welkom.includes(event.chat)
			const isFake = fks.includes(event.chat)
			const fake = event.who.startsWith(ddi)
			const isAnti = anti.includes(event.chat)
			const fuck = bklist.includes(event.who)
			const gChat = await kill.getChatById(event.chat)
			const { contact, groupMetadata, name } = gChat
			try {
				if (event.action == 'add') {
					if (isAnti && fuck) {
						await kill.sendText(event.chat, `E TU TA AQUI MENÓ?! TU TA AQUI DNV MENÓ??`)
						await sleep(2000)
						await kill.removeParticipant(event.chat, event.who)
					} else if (isFake && !fake) {
						await kill.sendTextWithMentions(event.chat, `Olá @${event.who.replace('@c.us', '')}, como parte do nosso sistema de segurança, números de fora do Brasil são banidos, se você não for alguém mal e quiser estar no grupo pacificamente, por favor contate os administradores 😉.\n\nHello @${event.who.replace('@c.us', '')}, as part of our security system, numbers outside Brazil are banned, if you are not someone bad and want to be in the group peacefully, please contact the administrators 😉.\n\nHalo @${event.who.replace('@c.us', '')}, sebagai bagian dari sistem keamanan kami, nomor di luar Brasil dilarang, jika Anda bukan orang jahat dan ingin berada di grup dengan damai, silakan hubungi administrator 😉.\n\nHola @${event.who.replace('@c.us', '')}, como parte de nuestro sistema de seguridad, los números fuera de Brasil están prohibidos, si no eres alguien malo y quieres estar en el grupo pacíficamente, por favor contacte a los administradores 😉.`)
						await sleep(4000)
						await kill.removeParticipant(event.chat, event.who)
					} else if (isWelkom) {
						await kill.sendTextWithMentions(event.chat, `Olá @${event.who.replace('@c.us', '')}! 🥰 \n\nSeja bem vindo ao ${name} 😎 \n\nDesejamos que se divirta e obviamente que siga nossas regras! ✅ \n\nCaso precise, chame um Administrador ou digite ${config.prefix}menu. 👨🏻‍💻`)
					}
				} else if (event.action == 'remove' && isWelkom) {
					var profile = await kill.getProfilePicFromServer(event.who)
					if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
					await kill.sendFileFromUrl(event.chat, profile, 'profile.jpg', '')
					await kill.sendTextWithMentions(event.chat, `Mais um membro ~gado~ saiu, sentiremos falta do @${event.who.replace('@c.us', '')} ... \nF. ~Agora temos -1 gado pra colheita, shit!~`)
				}
			} catch (err) {
				console.log(err)
			}
        })
        
		
		// Funções para caso seja adicionada em um grupo
        kill.onAddedToGroup(async (chat) => {
			const wlcmsg = `Oi! 🌟\nFui requisitada como BOT para esse grupo, e estarei a disposição de vocês! 🤖\nSe quiserem ver minhas funcões usem ${config.prefix}menu!`
			const lmtgru = await kill.getAllGroups()
            let totalMem = chat.groupMetadata.participants.length
			if (chat.groupMetadata.participants.includes(config.owner)) {
				await kill.sendText(chat.id, wlcmsg)
			} else if (gc.length > config.memberLimit) {
            	await kill.sendText(chat.id, `Um novo grupo, Eba! 😃\nUma pena que vocês não tem o requisito, que é ter pelo menos ${config.memberLimit} membros. Você possui ${totalMem}, junte mais pessoas! 😉`)
				await kill.leaveGroup(chat.id)
				await kill.deleteChat(chat.id)
			} else if (lmtgruc.length > config.gpLimit) {
				await kill.sendText(chat.id, `Desculpe, estamos no máximo de grupos!\nAtualmente estamos em ${lmtgru.length}/${config.gpLimit}`)
				await kill.leaveGroup(chat.id)
				await kill.deleteChat(chat.id)
            } else {
                kill.sendText(chat.id, wlcmsg)
            }
        })
		

        // Bloqueia na call
        kill.onIncomingCall(async (call) => {
            await kill.sendText(call.peerJid, `Que pena! Chamadas não são suportadas e atrapalham muito! 😊\nTe bloqueei para evitar novas, contate o dono wa.me/${config.owner.replace('c.us', '')} para efetuar o desbloqueio. 👋`)
            await kill.contactBlock(call.peerJid)
        })
    }

create(options(true, start))
    .then((kill) => start(kill))
    .catch((err) => new Error(err))