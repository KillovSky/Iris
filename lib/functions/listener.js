// Módulos
const fs = require('fs')
const welcome = require('./welcome')
const {
	Client
} = require("@open-wa/wa-automate")
const {
	tools
} = require('./index')
const {
	mylang
} = require('../lang')

// Variáveis para controle de algumas atividades externas
var runOnlyOneTime = false
var Advise_Only_One = false

// JSON's & Utilidades
const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'))
const aEvents = JSON.parse(fs.readFileSync('./lib/config/Gerais/events.json'))
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'))

// Arruma a falta de '@c.us' no Owner
if (config.Owner.some(nb => !nb.endsWith('@c.us'))) {
	config.Owner = config.Owner.map(o => !o.includes("@c.us") ? o + "@c.us" : o)
	fs.writeFileSync('./lib/config/Settings/config.json', JSON.stringify(config, null, "\t"))
}

// Atualiza os comandos no arquivo de comandos a cada inicialização
if (config.Update_CMDS_On_Boot == true) {
	require('shelljs').exec(`bash config.sh cmds`, {
		silent: true
	})
}

// 'Desativa' o evento aleatório para casos de reinicialização da Íris
if (aEvents.eventOnline) {
	aEvents.eventOnline = false
	aEvents.description = 'Nenhum'
	aEvents.lastTime = aEvents.startedAt
	aEvents.lastType = aEvents.typeEvent
	aEvents.lastName = aEvents.eventName
	aEvents.lastIndex = aEvents.eventIndex
	aEvents.groups = []
	fs.writeFileSync('./lib/config/Gerais/events.json', JSON.stringify(aEvents, null, "\t"))
}

module.exports = Start_Iris = async (kill = new Client()) => {
	try {

		// Caso use múltiplas Íris, impede de fazer tudo de novo
		if (!runOnlyOneTime) {
			runOnlyOneTime = true

			// Avisa para esperar as tarefas terminarem
			console.log(tools('others').color('[BOOT]', 'crimson'), tools('others').color(`Iniciei com sucesso, mas preciso executar algumas tarefas primeiro, quando terminar avisarei <3\n`, 'gold'))

			// Roda as funções de transmissão, backup e outros
			try {
				await tools('works').checkUpdate()
				await tools('works').safeBoot()
				await tools('works').transmission()
				await tools('works').backup()
			} catch (error) {
				tools('others').reportConsole('[POS-WORKS] ', error)
			}

			// Exibe a mensagem dizendo que iniciou
			console.log(tools('others').color('[SUPORTE]', 'magenta'), tools('others').color(`https://bit.ly/BOT-IRIS | Apenas BUG's\n`, 'lime'), tools('others').color(`\n[PRE-START]`, 'magenta'), tools('others').color('Terminei a pré-inicialização, vou esperar até uma primeira mensagem chegar para começar.', 'lime') + '\n')
			if (config.Popup) {
				tools('others').notify('Íris', mylang(config.Language).started((new Date()).getHours()), './lib/media/img/Hello.png')
			}
		}

		// Forçar recarregamento caso obtenha erros
		kill.onStateChanged(async (state) => {
			console.log(tools('others').color('[RELOAD]', 'red'), tools('others').color('O estado da conexão mudou para →', 'lime'), tools('others').color(state, 'yellow'))
			if (state == 'UNPAIRED' || state == 'CONFLICT' || state == 'UNLAUNCHED') {
				await kill.forceRefocus()
			}
		})

		// Parte principal responsável pelos comandos, além da limpeza de cache
		let IrisCMD = config.Bot_Commands ? 'onAnyMessage' : 'onMessage'
		kill[IrisCMD](async (message) => {

			// Envia a mensagem pras cases/etc
			require('./config')(kill, message)

			// Limpa o cache das mensagens - se configurado
			if (config.Clear_Cache) {
				let qtdMSG = await kill.getAmountOfLoadedMessages()
				if (qtdMSG >= config.Max_Msg_Cache) {
					await kill.cutMsgCache()
					await kill.cutChatCache()
				}
			}

			// Avisa que já recebeu ao menos 1 mensagem
			Advise_Only_One = true
			
		})
		// Você pode rodar certos comandos(/enviar por exemplo) pelo próprio WhatsApp da BOT, caso deseje, faça um "wa.me" do número da BOT, entre e rode os comandos no chat, não recomendado.
		
		// Welcome inicia
		kill.onGlobalParticipantsChanged(events => welcome(kill, events)).catch(error => tools('others').reportConsole('WELCOME', error))

		// Bloqueia na call
		kill.onIncomingCall(async (callData) => {
			if (config.Block_Calls && !config.Owner.includes(callData.peerJid)) {
				await kill.sendText(callData.peerJid, mylang(config.Language).blockcalls()).catch(e => tools('others').color(e.message, 'red'))
				await kill.contactBlock(callData.peerJid)
				console.log(tools('others').color('[CALL]', 'red'), tools('others').color(`${callData.peerJid.replace('@c.us', '')} foi bloqueado por me ligar...`, 'yellow'))
			}
		})

		// Funções para caso seja adicionada em um grupo
		kill.onAddedToGroup(async (chat) => {
			const lmtgru = await kill.getAllGroups()
			let VIPS_NUM = ['no_try', 'no_persons']
			let PAR_NUM = chat.groupMetadata.participants.map(iusr => iusr.id._serialized)
			if (Object.keys(functions.vips).includes(chat.id)) {
				VIPS_NUM = Object.keys(functions.vips[chat.id])
			}
			if (PAR_NUM.includes(config.Owner[0]) || PAR_NUM.some(v => VIPS_NUM.includes(v))) {
				await kill.sendText(chat.id, mylang(config.Language).novogrupo()) // Permite a BOT ficar se o dono ou algum VIP estiver dentro do grupo
			} else if (chat.groupMetadata.participants.length < config.Min_Membros || lmtgru.length > config.Max_Groups) {
				await kill.sendText(chat.id, mylang(config.Language).noreq(chat.groupMetadata.participants.length, lmtgru.length))
				await kill.deleteChat(chat.id)
				await kill.leaveGroup(chat.id)
			} else await kill.sendText(chat.id, mylang(config.Language).novogrupo())
			console.log(tools('others').color('[NOVO]', 'red'), tools('others').color(`Fui adicionada ao grupo ${chat.contact.name} e eles tem ${chat.groupMetadata.participants.length} membros.`, 'yellow'))
		})

		kill.onMessageDeleted(async (msg) => {
			const deleted = JSON.parse(fs.readFileSync('./lib/config/Gerais/message.json'))
			if (deleted.log.includes(msg.from)) {
				let delMsg = (msg.type == 'chat' || msg.type == "buttons_response") ? msg.body : ((msg.type == 'image' || msg.type == 'video') && msg.caption) ? msg.caption : ''
				deleted.texts.push({
					"user": msg.from,
					"message": delMsg,
					"to": msg.to,
					"time": (new Date).toString()
				})
				if (deleted.texts.length > Number(config.Max_Revoked)) {
					deleted.texts.shift()
				}
				fs.writeFileSync('./lib/config/Gerais/message.json', JSON.stringify(deleted, null, "\t"))
				console.log(tools('others').color('> [DELETED AS]', 'red'), tools('others').color((new Date()).toLocaleString(), 'yellow'), tools('others').color(`"${msg.body.slice(0,10)}"`, 'red'), 'EM', tools('others').color(`"${msg.from}"`))
				await kill.sendText(msg.from, `Ooops, você acabou de deletar a seguinte mensagem:\n\n${delMsg}`)
			}
		})

		// Funções que só rodam uma vez, precisa de uma mensagem para ativar o sistema, para que não ocorra erros graves
		let isTIME_pos = async () => {
			if (Advise_Only_One) {

				// Avisa que iniciou aos grupos - se configurado, se quiser avisar todos ate no pv, remova o ".filter(group => group.includes('@g.us'))"
				if (config.StartUP_MSGs_Groups) {
					groupAdvisedID = []
					let All_Group_ID = (await kill.getAllChatIds()).filter(g => g.includes('@g.us'))
					All_Group_ID = [...new Set(All_Group_ID)]
					for (let gpID of All_Group_ID) {
						if (!groupAdvisedID.includes(gpID)) {
							groupAdvisedID.push(gpID)
							await kill.sendText(gpID, mylang(region).startOK())
						}
					}
				}

				// Auto Recarregamento da Config.js sem reiniciar, para casos de edições em tempo real, use com cautela e ative a require la em baixo se usar
				if (config.Auto_Update) {
					try {
						tools('reload').watchFile('config.js')
					} catch (error) {
						tools('others').reportConsole('WATCHFILE', error)
					}
				}
				// tools('reload').watchFile('Nome_Do_Arquivo.js')
				// Exemplos Utilizáveis (insira na try):
				// Functions: tools('reload').watchFile('others.js')
				// Lang: tools('reload').watchFile('pt.js')
				
			} else {
				await tools('others').sleep(3000)
				isTIME_pos()
			}
		}
		isTIME_pos()

	} catch (error) {
		console.error(error)
	}
}