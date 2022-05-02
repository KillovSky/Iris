const fs = require('fs')
const {
	tools
} = require('./index')
const {
	mylang
} = require('../lang')
global.configSet = {
	welcome: 0,
	goodbye: 0,
	blacklist: 0,
	userfake: 0
}
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'))

module.exports = welcome = async (kill, events) => {
	
	try {

		// JSON'S
		const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'))
		const customMsg = JSON.parse(fs.readFileSync('./lib/config/Gerais/greetings.json'))
		const canvacord = JSON.parse(fs.readFileSync('./lib/config/Gerais/canvas.json'))

		// Configurações
		const isIris = events.who == await kill.getHostNumber() + '@c.us'
		const isBlacklist = functions.blacklist.includes(events.chat) && functions.antinumbers.includes(events.who)
		const isFake = functions.fake.includes(events.chat) && !config.DDI.some(i => !events.who.startsWith(i))
		const isWelcome = functions.welcome.includes(events.chat)
		const isGoodbye = functions.goodbye.includes(events.chat)
		const personInfo = await kill.getContact(events.who)
		const groupInfo = await kill.getChatById(events.chat)
		let pushname = personInfo.pushname || personInfo.verifiedName || personInfo.formattedName || 'Censored by Government'

		// Sistema global do Welcome/Goodbye/Antifake/Blacklist/etc
		// Tudo em 1, achei melhor ir em 'else if' do que vários 'if' separados
		if (events.action == 'add' && isBlacklist && !isIris) {
			if (configSet.blacklist == 1) {
				await kill.removeParticipant(events.chat, events.who)
				return configSet.blacklist = 0
			} else {
				await kill.sendText(events.chat, mylang(config.Language).entrace())
				await kill.removeParticipant(events.chat, events.who)
				console.log(tools('others').color('[BLACKLIST]', 'red'), tools('others').color(`${pushname} - (${events.who.replace('@c.us', '')}) foi banido do ${groupInfo.name || 'UM GRUPO'} por ter sido colocado na blacklist...`, 'yellow'))
				if (config.Auto_Block) return await kill.contactBlock(events.who)
			}
		} else if (events.action == 'add' && isFake && !isIris) {
			if (configSet.userfake == 1) {
				await kill.removeParticipant(events.chat, events.who)
				return configSet.userfake = 0
			} else {
				await kill.sendTextWithMentions(events.chat, mylang(config.Language).nofake(events))
				await kill.removeParticipant(events.chat, events.who)
				console.log(tools('others').color('[FAKE]', 'red'), tools('others').color(`${pushname} - (${events.who.replace('@c.us', '')}) foi banido do ${groupInfo.name} por usar número falso ou ser de fora do país...`, 'yellow'))
				if (config.Auto_Block) return await kill.contactBlock(events.who)
			}
		} else if (events.action == 'add' && isWelcome && !isIris) {
			console.log(tools('others').color('[ENTROU]', 'red'), tools('others').color(`${pushname} - (${events.who.replace('@c.us', '')}) entrou no grupo ${groupInfo.name}...`, 'yellow'))
			if (configSet.welcome == 1) {
				return configSet.welcome = 0
			} else if (!Object.keys(customMsg).includes(events.chat)) {
				var profile = await kill.getProfilePicFromServer(events.who)
				if (typeof profile == 'object' || !tools('others').isUrl(profile)) {
					profile = canvacord.User_Image
				}
				const welcomer = await tools('canvas').welcome(pushname, events.who.slice(6, 10), groupInfo.name, groupInfo.groupMetadata.participants.length, profile, events.action, canvacord).then(async (data) => await kill.sendFile(events.chat, data, 'welcome.png', mylang(config.Language).welcome(pushname, groupInfo.name))).catch(async (err) => await kill.sendText(events.chat, mylang(config.Language).welcome(pushname, groupInfo.name)))
				if (config.Canvas_Audio) {
					await kill.sendPtt(events.chat, canvacord.Sound_Welcome)
				}
			} else {
				await kill.sendText(events.chat, customMsg[events.chat]['welcome']['message'])
				if (customMsg[events.chat]['welcome']['onlyText']) return configSet.welcome = 0
			}
		} else if (events.action == 'remove' && isGoodbye && !isIris) {
			console.log(tools('others').color('[SAIU/BAN]', 'red'), tools('others').color(`${pushname} - (${events.who.replace('@c.us', '')}) saiu ou foi banido do grupo ${groupInfo.name}...`, 'yellow'))
			if (configSet.welcome == 1) {
				return configSet.welcome = 0
			} else if (!Object.keys(customMsg).includes(events.chat)) {
				var profile = await kill.getProfilePicFromServer(events.who)
				if (typeof profile == 'object' || !tools('others').isUrl(profile)) {
					profile = canvacord.User_Image
				}
				const welcomer = await tools('canvas').welcome(pushname, events.who.slice(6, 10), groupInfo.name, groupInfo.groupMetadata.participants.length, profile, events.action, canvacord).then(async (data) => await kill.sendFile(events.chat, data, 'goodbye.png', mylang(config.Language).bye(pushname))).catch(async (err) => await kill.sendText(events.chat, mylang(config.Language).bye(pushname)))
				if (config.Canvas_Audio) {
					await kill.sendPtt(events.chat, canvacord.Sound_Welcome)
				}
			} else {
				await kill.sendText(events.chat, customMsg[events.chat]['goodbye']['message'])
				if (customMsg[events.chat]['goodbye']['onlyText']) return configSet.goodbye = 0
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