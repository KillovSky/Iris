const fs = require('fs')
const {
	tools
} = require('./index')
const {
	mylang
} = require('../lang')
var configSet = {
	welcome: 0,
	goodbye: 0,
	blacklist: 0,
	userfake: 0
}
const config = JSON.parse(fs.readFileSync('./lib/config/Gerais/config.json'))

module.exports = welcome = async (kill, event) => {
	
	try {

		// JSON'S
		const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'))
		const customMsg = JSON.parse(fs.readFileSync('./lib/config/Gerais/greetings.json'))
		const canvacord = JSON.parse(fs.readFileSync('./lib/config/Gerais/canvas.json'))

		// Configurações
		const isIris = event.who == await kill.getHostNumber() + '@c.us'
		const isBlacklist = functions.blacklist.includes(event.chat) && functions.antinumbers.includes(event.who)
		const isFake = (functions.fake.includes(event.chat) && config.DDI.filter(nbr => event.who.startsWith(nbr))).length == 0
		const isWelcome = functions.welcome.includes(event.chat)
		const isGoodbye = functions.goodbye.includes(event.chat)
		const personInfo = await kill.getContact(event.who)
		const groupInfo = await kill.getChatById(event.chat)
		let pushname = personInfo.pushname || personInfo.verifiedName || personInfo.formattedName || 'Censored by Government'

		// Sistema global do Welcome/Goodbye/Antifake/Blacklist/etc
		// Tudo em 1, achei melhor ir em 'else if' do que vários 'if' separados
		if (event.action == 'add' && isBlacklist && !isIris) {
			if (configSet.blacklist == 1) {
				await kill.removeParticipant(event.chat, event.who)
				return configSet.blacklist = 0
			} else {
				await kill.sendText(event.chat, mylang(config.Language).entrace())
				await kill.removeParticipant(event.chat, event.who)
				console.log(tools('others').color('[BLACKLIST]', 'red'), tools('others').color(`${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${groupInfo.name || 'UM GRUPO'} por ter sido colocado na blacklist...`, 'yellow'))
				if (config.Auto_Block) return await kill.contactBlock(event.who)
			}
		} else if (event.action == 'add' && isFake && !isIris) {
			if (configSet.userfake == 1) {
				await kill.removeParticipant(event.chat, event.who)
				return configSet.userfake = 0
			} else {
				await kill.sendTextWithMentions(event.chat, mylang(config.Language).nofake(event))
				await kill.removeParticipant(event.chat, event.who)
				console.log(tools('others').color('[FAKE]', 'red'), tools('others').color(`${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${groupInfo.name} por usar número falso ou ser de fora do país...`, 'yellow'))
				if (config.Auto_Block) return await kill.contactBlock(event.who)
			}
		} else if (event.action == 'add' && isWelcome && !isIris) {
			console.log(tools('others').color('[ENTROU]', 'red'), tools('others').color(`${pushname} - (${event.who.replace('@c.us', '')}) entrou no grupo ${groupInfo.name}...`, 'yellow'))
			if (configSet.welcome == 1) {
				return configSet.welcome = 0
			} else if (!Object.keys(customMsg).includes(event.chat)) {
				var profile = await kill.getProfilePicFromServer(event.who)
				if (typeof profile == 'object' || !tools('others').isUrl(profile)) {
					profile = "https://bit.ly/3dYLtB3"
				}
				const welcomer = await tools('canvas').welcome(pushname, event.who.slice(6, 10), groupInfo.name, groupInfo.groupMetadata.participants.length, `${profile}`, event.action, canvacord).then(async (data) => {
					await kill.sendFile(event.chat, data, 'welcome.png', mylang(config.Language).welcome(pushname, groupInfo.name))
				})
				if (config.Canvas_Audio) {
					await kill.sendPtt(event.chat, canvacord.Sound_Welcome)
				}
			} else {
				await kill.sendText(event.chat, customMsg[event.chat]['welcome']['message'])
				if (customMsg[event.chat]['welcome']['onlyText']) {
					return configSet.welcome = 0
				}
			}
		} else if (event.action == 'remove' && isGoodbye && !isIris) {
			console.log(tools('others').color('[SAIU/BAN]', 'red'), tools('others').color(`${pushname} - (${event.who.replace('@c.us', '')}) saiu ou foi banido do grupo ${groupInfo.name}...`, 'yellow'))
			if (configSet.welcome == 1) {
				return configSet.welcome = 0
			} else if (!Object.keys(customMsg).includes(event.chat)) {
				var profile = await kill.getProfilePicFromServer(event.who)
				if (typeof profile == 'object' || !tools('others').isUrl(profile)) {
					profile = "https://bit.ly/3dYLtB3"
				}
				const welcomer = await tools('canvas').welcome(pushname, event.who.slice(6, 10), groupInfo.name, groupInfo.groupMetadata.participants.length, profile, event.action, canvacord).then(async (data) => {
					await kill.sendFile(event.chat, data, 'goodbye.png', mylang(config.Language).welcome(pushname, groupInfo.name))
				})
				if (config.Canvas_Audio) {
					await kill.sendPtt(event.chat, canvacord.Sound_Welcome)
				}
			} else {
				await kill.sendText(event.chat, customMsg[event.chat]['goodbye']['message'])
				if (customMsg[event.chat]['goodbye']['onlyText']) {
					return configSet.goodbye = 0
				}
			}
		}
	} catch (err) {
		configSet = {
			welcome: 0,
			goodbye: 0,
			blacklist: 0,
			userfake: 0
		}
		console.log(err)
	}
}