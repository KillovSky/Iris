const {
	create,
	Client
} = require('@open-wa/wa-automate')
const {
	tools
} = require('./lib/functions')
const {
	mylang
} = require('./lib/lang')
const {
	exec
} = require('child_process')
var setLimit = {
	welcOn: 0,
	abayo: 0,
	oneMsg: 0,
	oneFake: 0,
	broadc: 0
}
const fs = require('fs')
const axios = require('axios')
const config = JSON.parse(fs.readFileSync('./lib/config/Gerais/config.json'))
const irisvs = JSON.parse(fs.readFileSync('./package.json'))
const kconfig = require('./config')
const welcome = require('./lib/functions/welcome')
const moment = require('moment-timezone')
const os = require('os')
/* Como fazer um require = "const | var | let [Nome] = require('Nome_do_Módulo')" */

// Apaga a pasta de cache do Chrome caso exista
tools('others').clearFile('./logs/Chrome', 0, true)

// JSON's
const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'))

// Cria um cliente de inicialização da BOT
const start = async (kill = new Client()) => {
	try {
		try {
			const getversion = await axios.get('https://raw.githubusercontent.com/KillovSky/iris/dev/package.json')
			if (irisvs.version !== getversion.data.version) {
				console.log(tools('others').color('\n[UPDATE]', 'crimson'), tools('others').color(`Uma nova versão da Íris foi lançada [${getversion.data.version}], atualize para obter melhorias e correções! → ${irisvs.homepage}`, 'gold'))
			}
		} catch (err) {
			console.log(`Checagem de versão falhou, de uma olhada no arquivo de Logs -> "/logs/Iris_Login_QR/${moment().format('DD-MM-YY # HH-mm-ss')}.txt".`)
			fs.appendFileSync(`./logs/Iris_Login_QR/${moment().format('DD-MM-YY # HH-mm-ss')}.txt`, err)
		}
		console.log(tools('others').color('\n[SUPORTE]', 'magenta'), tools('others').color(`${irisvs.bugs.url}\n`, 'lime'), tools('others').color(`\n[ÍRIS ${irisvs.version}]`, 'magenta'), tools('others').color('Estamos prontos para começar mestre!\n', 'lime'))

		// Íris Push-Alert - Inicialização
		if (config.Popup) {
			tools('others').notify('Íris', mylang(config.Language).started(os, (new Date()).getHours()), './lib/media/img/Hello.png')
		}

		// Auto Recarregamento da Config.js sem reiniciar, para casos de edições em tempo real, use com cautela e ative a require la em baixo se usar
		if (config.Auto_Update) {
			tools('reload').watchFile('./config.js', '../../config.js')
		}

		// Não irrite a Íris :)
		if (config.SafeBoot !== 0) {
			let imgNot = 0
			setTimeout(async () => {
				for (let tex of mylang(config.Language).badshtd(os)) {
					imgNot++
					console.log(tools('others').color('[ÍRIS 😠]', 'magenta'), tools('others').color(tex, 'lime'))
					if (config.Popup) {
						await tools('others').sleep(5000)
						tools('others').notify('ÍRIS', tex, `./lib/media/img/${imgNot}.png`)
					}
				}
			}, 30000)
		} else {
			config.SafeBoot = 1
			fs.writeFileSync('./lib/config/Gerais/config.json', JSON.stringify(config, null, 2))
		}

		// Backup dos arquivos toda vez que religar a BOT
		await exec(`bash -c 'zip -r "lib/config/Backup/${moment().format('DD-MM-YY # HH-mm-ss')}.zip" lib/config/Gerais'`, async (err) => {
			if (!err) {
				setTimeout(async () => {
					for (let i of mylang(config.Language).bkpfinish()) {
						console.log(tools('others').color('[ÍRIS 🙂]', 'magenta'), tools('others').color(i, 'lime'))
						if (config.Popup) {
							await tools('others').sleep(5000)
							tools('others').notify('ÍRIS', i, `./lib/media/img/3.png`)
						}
					}
				}, 10000)
			} else {
				console.log(tools('others').color(`[BACKUP]`, 'crimson'), tools('others').color(`→ O Backup obteve uns problemas mas você pode ignorar - ou não. → "${err.message}"`, 'gold'))
			}
		})

		// Forçar recarregamento caso obtenha erros
		kill.onStateChanged(async (state) => {
			if (state == 'UNPAIRED' || state == 'CONFLICT' || state == 'UNLAUNCHED') {
				await kill.forceRefocus()
			}
			console.log(tools('others').color('[RELOAD]', 'red'), tools('others').color('Estou recarregando a página pois a conexão mudou →', 'lime'), tools('others').color(state, 'yellow'))
		})

		// Parte principal responsável pelos comandos, além da limpeza de cache
		let IrisCMD = config.Bot_Commands ? 'onAnyMessage' : 'onMessage'
		kill[IrisCMD](async (message) => {
			if (config.Clear_Cache) {
				await kill.getAmountOfLoadedMessages().then(async (msg) => {
					if (msg >= config.Max_Msg_Cache) {
						await kill.cutMsgCache()
						await kill.cutChatCache()
					}
				})
			}
			if (config.Auto_Update) {
				require('./config')(kill, message)
			} else await kconfig(kill, message)
		})
		// Você pode rodar certos comandos(/enviar por exemplo) pelo próprio WhatsApp da BOT, caso deseje, faça um "wa.me" do número da BOT, entre e rode os comandos no chat, não recomendado.

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
				fs.writeFileSync('./lib/config/Gerais/message.json', JSON.stringify(deleted))
				console.log(tools('others').color('> [DELETED AS]', 'red'), tools('others').color(moment(msg.t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), tools('others').color(`"${msg.body.slice(0,10)}"`, 'red'), 'EM', tools('others').color(`"${msg.from}"`))
				await kill.sendText(msg.from, `Ooops, você acabou de deletar a seguinte mensagem:\n\n${delMsg}`)
			}
		})

		// Funções para caso seja adicionada em um grupo
		kill.onAddedToGroup(async (chat) => {
			const lmtgru = await kill.getAllGroups()
			if (chat.groupMetadata.participants.includes(config.Owner[0]) || chat.groupMetadata.participants.filter(c => functions.vips.includes(c)).length > 0) {
				await kill.sendText(chat.id, mylang(config.Language).novogrupo()) // Permite a BOT ficar se o dono ou algum VIP estiver dentro do grupo
			} else if (chat.groupMetadata.participants.length < config.Min_Membros || lmtgru.length > config.Max_Groups) {
				await kill.sendText(chat.id, mylang(config.Language).noreq(chat.groupMetadata.participants.length, lmtgru.length))
				await kill.deleteChat(id)
				await kill.leaveGroup(id)
			} else await kill.sendText(chat.id, mylang(config.Language).novogrupo())
			console.log(tools('others').color('[NOVO]', 'red'), tools('others').color(`Fui adicionada ao grupo ${chat.contact.name} e eles tem ${chat.groupMetadata.participants.length} membros.`, 'yellow'))
		})

		// Configuração do welcome
		kill.onGlobalParticipantsChanged(async (event) => {
			await welcome(kill, event)
		})

		// Bloqueia na call
		kill.onIncomingCall(async (callData) => {
			if (config.Block_Calls) {
				await kill.sendText(callData.peerJid, mylang(config.Language).blockcalls()).catch(e => tools('others').color(e.message, 'red'))
				await kill.contactBlock(callData.peerJid)
				console.log(tools('others').color('[CALL]', 'red'), tools('others').color(`${callData.peerJid.replace('@c.us', '')} foi bloqueado por me ligar...`, 'yellow'))
			}
		})
		
		// Faz backups periódicos durante a execução
		setInterval(async () => {
			await exec(`bash -c 'zip -r "lib/config/Backup/${moment().format('DD-MM-YY # HH-mm-ss')}.zip" lib/config/Gerais'`, async (err) => {
				if (!err) {
					console.log(tools('others').color(`[BACKUP]`, 'crimson'), tools('others').color(`→ O Backup periodico foi concluido com sucesso!`, 'gold'))
				} else {
					console.log(tools('others').color(`[BACKUP]`, 'crimson'), tools('others').color(`→ O Backup obteve uns problemas mas você pode ignorar - ou não. → "${err.message}"`, 'gold'))
				}
			})
		}, config.Backup_Time * 60000)
		
		// Sistema de Transmissão de Emergência com atraso de 1 hora para evitar sobrecarga, básico mas funcional
		if (config.Enable_EAS) {
			const getTransmission = async () => {
				let govMessage = await axios.get("https://pastebin.com/raw/mhDCmszg")
				if (setLimit.broadc !== govMessage.data) {
					setLimit.broadc = govMessage.data
					if (config.Language == 'pt') {
						console.log(tools('others').color('[KILLOVSKY]', 'magenta'), tools('others').color(govMessage.data, 'lime'))
						if (config.Popup) {
							tools('others').notify('KILLOVSKY', govMessage.data, './lib/media/img/kill.png')
						}
					} else {
						await translate(govMessage.data, config.Language, {
							to: region
						}).then(msg => {
							console.log(tools('others').color('[KILLOVSKY]', 'magenta'), tools('others').color(msg, 'lime'))
							if (config.Popup) {
								tools('others').notify('KILLOVSKY', msg, './lib/media/img/kill.png')
							}
						})
					}
				}
				await tools('others').sleep(3600000) /* Adquire informações transmitidas por mim de 1 em 1 hora */
				await getTransmission()
			}
			getTransmission()
		}
	} catch (error) {
		console.error(error)
	}
}

// Cria uma sessão da Íris
create(tools('options').options(start)).then(async (kill) => await start(kill)).catch((err) => console.error(err))