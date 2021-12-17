const fs = require('fs')
const {
	mylang
} = require('../lang')

exports.switchs = async (eod, func, type, chatId, help, kill, message) => {
	if (eod !== 'on' && eod !== 'off' && eod !== 'help') return await kill.reply(message.from, mylang(region).onoff(), message.id)
	if (eod == 'off') {
		if (!func[type].includes(chatId)) return await kill.reply(message.from, mylang(region).jadisabled(), message.id)
		func[type].splice(chatId, 1)
		await kill.reply(message.from, mylang(region).disabled(), message.id)
	} else if (eod == 'on') {
		if (func[type].includes(chatId)) return await kill.reply(message.from, mylang(region).jaenabled(), message.id)
		func[type].push(chatId)
		await kill.reply(message.from, mylang(region).enabled(), message.id)
	} else return await kill.reply(from, help, id)
	fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(func, null, "\t"))
}