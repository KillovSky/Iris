const fs = require('fs')
const config = require('../config/Gerais/config.json')
const time = new Date().toISOString().split('T').toString().split('.')[0]
const pollfile = `./lib/media/poll/${groupId.replace('@c.us', '')}.json`
const {
	mylang
} = require('../lang')

/* -------------------------------------------------------------------------
 * A parte das votações [Eleições] - A famosa urna eletrônica do Zap-Zap
 * ---------------------------------------------------------------------- */

exports.create = async (kill, message, title, file, max) => {
	let pollcreate = {
		id: message.chatId,
		title: title,
		candis: {},
		voters: [],
		creator: message.author,
		maxVotes: max
	}
	await fs.writeFileSync(file, JSON.stringify(pollcreate))
	await kill.reply(message.chatId, mylang(region).startvote(title), message.id)
}

exports.vote = async (kill, message, vote, file) => {
	let poll = JSON.parse(await fs.readFileSync(file))
	if (Object.keys(poll.candis) == '') return await kill.reply(message.chatId, mylang(region).nocand(), message.id)
	if (poll.voters.includes(message.author)) return await kill.reply(message.chatId, mylang(region).polliv(), message.id)
	if (Object.keys(poll.candis).length < Number(vote)) return await kill.reply(message.chatId, `Não existe um candidato com número ${vote}.`, message.id) // mylang(region).wrongcand(vote)
	poll.voters.push(message.author)
	poll.candis[Object.keys(poll.candis)[vote]]++
	await fs.writeFileSync(file, JSON.stringify(poll))
	let votes = `📥 - Votou em "${Object.keys(poll.candis)[vote]}"\n\n🗳️ - Em ${poll.title}\n`
	for (let i in Object.keys(poll.candis)) {
		votes += `\n🎁 [${i}] -> "${Object.keys(poll.candis)[i]}" = "${poll.candis[Object.keys(poll.candis)[i]]}" Votos.\n`
		if (poll.candis[Object.keys(poll.candis)[i]] >= poll.maxVotes) {
			votes += 'VENCEDOR! 🥇 - Podem continuar votando.'
		}
	}
	await kill.reply(message.chatId, votes, message.id)
}

exports.add = async (kill, message, cand, file, isadm) => {
	let poll = JSON.parse(await fs.readFileSync(file))
	if (Object.keys(poll.candis).includes(cand.toLowerCase())) return await kill.reply(message.chatId, `Esse candidato [${cand}] é invalido pois já foi inserido.`, message.id) // mylang(region).candInvalid(cand)
	if (!isadm || message.author !== poll.creator) return await kill.sendTextWithMentions(message.chatId, `Você não possui permissão de adicionar candidatos na poll, apenas os administradores e @{poll.creator.replace('@c.us', '')} podem.`, message.id) // mylang(region).noNewPoll(poll)
	poll.candis[cand] = 0
	await fs.writeFileSync(file, JSON.stringify(poll))
	await kill.reply(message.chatId, mylang(region).addcand(cand), message.id)
}

exports.get = async (kill, message, file) => {
	let poll = JSON.parse(await fs.readFileSync(file))
	let urna = `🗳️ - ${poll.title}\n\n`
	for (let i in Object.keys(poll.candis)) {
		urna += `\n🎁 ${i} -> "${Object.keys(poll.candis)[i]}" = "${poll.candis[Object.keys(poll.candis)[i]]}" Votos.\n`
	}
	await kill.reply(message.chatId, urna + '\n' + mylang(region).howvote(), message.id)
}