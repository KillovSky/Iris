const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./lib/config/Gerais/config.json'))
const {
	mylang
} = require('../lang')
const {
	tools
} = require('./index')

/* -----------------------------------------------------------------------
 * A parte das votações [Eleições] - A famosa urna eletrônica do Zap-Zap
 * ---------------------------------------------------------------------- */

exports.create = async (kill, message, file, poll) => {
	let pollcreate = {
		id: message.from,
		title: poll[0],
		candis: {},
		voters: [],
		creator: message.author,
		maxVotes: Number(poll[1] || config.Max_Votes)
	}
	fs.writeFileSync(file, JSON.stringify(pollcreate, null, "\t"))
	return await kill.reply(message.from, mylang(region).startvote(poll[0]) + `\n\n🏆 - Votos para vencer: "${pollcreate.maxVotes}".`, message.id)
}

exports.vote = async (kill, message, vote, file) => {
	if (!fs.existsSync(file)) return await kill.reply(message.from, `Ainda não existem votações abertas, crie uma usando "${config.prefix[0]}NewPoll [Nome da Votação] | [Quantidade Máxima de votos]".\n\nExemplo: "${config.prefix[0]}NewPoll Prefeito | 10"`, message.id)
	let poll = JSON.parse(fs.readFileSync(file))
	if (Object.keys(poll.candis) == '') return await kill.reply(message.from, mylang(region).nocand(), message.id)
	if (poll.voters.includes(message.author)) return await kill.reply(message.from, mylang(region).polliv(), message.id)
	if (Object.keys(poll.candis).length < Number(vote)) return await kill.reply(message.from, `Não existe um candidato com número ${vote}.`, message.id) // mylang(region).wrongcand(vote)
	poll.voters.push(message.author)
	poll.candis[Object.keys(poll.candis)[vote]]++
	fs.writeFileSync(file, JSON.stringify(poll, null, "\t"))
	let votes = `📥 - Votou em "${Object.keys(poll.candis)[vote]}"\n\n🗳️ - Em ${poll.title}\n`
	for (let i in Object.keys(poll.candis)) {
		votes += `\n🎁 [${i}] -> "${Object.keys(poll.candis)[i]}" = "${poll.candis[Object.keys(poll.candis)[i]]}" Votos.\n`
		if (poll.candis[Object.keys(poll.candis)[i]] >= poll.maxVotes) {
			votes += `\nVotação Encerrada!\n${Object.keys(poll.candis)[i]} É O VENCEDOR 🥇!`
		}
	}
	tools('others').clearFile(file, 1000)
	await kill.reply(message.from, votes, message.id)
}

exports.add = async (kill, message, cand, file, isadm) => {
	if (!fs.existsSync(file)) return await kill.reply(message.from, `Ainda não existem votações abertas, crie uma usando "${config.prefix[0]}NewPoll [Nome da Votação] | [Quantidade Máxima de votos]".\n\nExemplo: "${config.prefix[0]}NewPoll Prefeito | 10"`, message.id)
	let poll = JSON.parse(fs.readFileSync(file))
	if (Object.keys(poll.candis).includes(cand.toLowerCase())) return await kill.reply(message.from, `Esse candidato [${cand}] é invalido pois já foi inserido.`, message.id) // mylang(region).candInvalid(cand)
	if (!isadm || message.author !== poll.creator) return await kill.sendTextWithMentions(message.from, `Você não possui permissão de adicionar candidatos na poll, apenas os administradores e @${poll.creator.replace('@c.us', '')} podem.`, message.id) // mylang(region).noNewPoll(poll)
	poll.candis[cand] = 0
	fs.writeFileSync(file, JSON.stringify(poll, null, "\t"))
	await kill.reply(message.from, mylang(region).addcand(cand), message.id)
}

exports.get = async (kill, message, file) => {
	if (!fs.existsSync(file)) return await kill.reply(message.from, `Ainda não existem votações abertas, crie uma usando "${config.prefix[0]}NewPoll [Nome da Votação] | [Quantidade Máxima de votos]".\n\nExemplo: "${config.prefix[0]}NewPoll Prefeito | 10"`, message.id)
	let poll = JSON.parse(fs.readFileSync(file))
	let urna = `🗳️ - ${poll.title}\n\n`
	for (let i in Object.keys(poll.candis)) {
		urna += `\n🎁 ${i} -> "${Object.keys(poll.candis)[i]}" = "${poll.candis[Object.keys(poll.candis)[i]]}" Votos.\n`
	}
	await kill.reply(message.from, urna + '\n' + mylang(region).howvote(), message.id)
}