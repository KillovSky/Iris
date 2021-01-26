const { create, Client } = require('@open-wa/wa-automate') // As consts aqui declaram as funções de outros arquivos
const welcome = require('./lib/welcome') // Ou de modulos que usei
const kconfig = require('./config')
const options = require('./options')
const color = require('./lib/color')

// Cria um cliente de inicialização da BOT
const start = (kill = new Client()) => {
    console.log(color('\n> DEV OFICIAL ='), color(' KillovSky > https://wa.me/+5518998044132', 'yellow'))
	console.log(color('\n> GRUPO OFICIAL ='), color(' https://chat.whatsapp.com/H53MdwhtnRf7TGX1VJ2Jje', 'yellow'))
	console.log(color('\n>'), color('Inicialização finalizada, os comandos podem ser usados agora...\n', 'red'))
	
		// Forçar recarregamento caso obtenha erros
		kill.onStateChanged((state) => {
			console.log('[Estado da Íris]', state)
			if (state === 'CONFLICT' || state === 'UNLAUNCHED') kill.forceRefocus()
		})
	
		
        // Le as mensagens e limpa cache
        kill.onMessage((async (message) => {
            kill.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 500) {
                    kill.cutMsgCache()
                }
            })
            kconfig(kill, message)
        }))
		
		// Configuração do welcome
        kill.onGlobalParicipantsChanged((async (heuh) => {
            await welcome(kill, heuh)
            }))
        
		
		// Funções para caso seja adicionada em um grupo
        kill.onAddedToGroup(((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 20) { 
            	kill.sendText(chat.id, `Um novo grupo, Eba! 😃\nUma pena que vocês não tem o requisito, que é ter pelo menos [20] membros. Você possui ${totalMem}, junte mais pessoas! 😉`).then(() => kill.leaveGroup(chat.id))
            } else {
                kill.sendText(chat.groupMetadata.id, `Oi! 🌟\nFui requisitada como BOT para esse grupo, e estarei a disposição de vocês! 🤖\nSe quiserem ver minhas funcões usem /menu!`)
            }
        }))
		
		
		// analise de mensagens
		kill.onAnyMessage((lise) => { 
			messageLog(lise.fromMe, lise.type)
		})
		

        // Bloqueia na call
        kill.onIncomingCall(( async (call) => {
            await kill.sendText(call.peerJid, 'Que pena! Chamadas não são suportadas e atrapalham muito! 😊\nTe bloqueei para evitar novas, contate o dono para efetuar o desbloqueio. 👋')
            .then(() => kill.contactBlock(call.peerJid)) // se quiser, pode inserir seu numero acima na sendText com wa.me ou apenas o numero, ou pode mudar pra kill.sendTextWithMentions pra enviar te marcando
        }))
    }

create(options(true, start))
    .then((kill) => start(kill))
    .catch((err) => new Error(err))