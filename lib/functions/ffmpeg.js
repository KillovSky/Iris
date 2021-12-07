const {
	tools
} = require('./index')
const {
	mylang
} = require('../lang')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')

exports.octasound = async (mediaData, apu, kill, message) => {
	let onFile = `./lib/media/audio/8D-${tools('others').randomString(10)}.mp3`
	let offFile = `./lib/media/audio/8D-${tools('others').randomString(10)}.mp3`
	await fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		await ffmpeg(onFile)
			.audioFilter(`apulsator=hz=${apu || 0.200}`)
			.format('mp3')
			.save(offFile)
			.on('error', async function(error, stdout, stderr) {
				await kill.reply(message.from, mylang(region).fail('8D', error, (new Date).toString()), message.id)
				await tools('others').reportConsole('8D', error)
			})
			.on('end', async () => {
				await kill.sendFile(message.from, offFile, 'audio.mp3', '', message.id)
				await tools('others').clearFile(onFile)
				await tools('others').clearFile(offFile)
			})
	})
}

exports.bass = async (mediaData, g, type, width, f, kill, message) => {
	let onFile = `./lib/media/audio/BASS-${tools('others').randomString(10)}.mp3`
	let offFile = `./lib/media/audio/BASS-${tools('others').randomString(10)}.mp3`
	await fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mess.wait(), message.id)
		await ffmpeg(onFile)
			.audioFilter(`equalizer=f=${f || 40}:width_type=${type || 'h'}:width=${width || 50}:g=${g || 3}`)
			.format('mp3')
			.save(offFile)
			.on('error', async function(error, stdout, stderr) {
				await kill.reply(message.from, mylang(region).fail('BASS', error, (new Date).toString()), message.id)
				await tools('others').reportConsole('BASS', error)
			})
			.on('end', async () => {
				await kill.sendFile(message.from, offFile, 'audio.mp3', '', message.id)
				await tools('others').clearFile(onFile)
				await tools('others').clearFile(offFile)
			})
	})
}

exports.nightcore = async (mediaData, g, type, width, f, kill, message) => {
	let onFile = `./lib/media/audio/NIGHTCORE-${tools('others').randomString(10)}.mp3`
	let offFile = `./lib/media/audio/NIGHTCORE-${tools('others').randomString(10)}.mp3`
	await fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mess.wait(), message.id)
		await ffmpeg(onFile)
			.audioFilter(`asetrate=${night || 44100*1.25}`)
			.format('mp3')
			.save(offFile)
			.on('error', async function(error, stdout, stderr) {
				await kill.reply(message.from, mylang(region).fail('NIGHTCORE', error, (new Date).toString()), message.id)
				await tools('others').reportConsole('NIGHTCORE', error)
			})
			.on('end', async () => {
				await kill.sendFile(message.from, offFile, 'audio.mp3', '', message.id)
				await tools('others').clearFile(onFile)
				await tools('others').clearFile(offFile)
			})
	})
}

exports.audio = async (mediaData, mimetype, kill, message) => {
	let onFile = `./lib/media/audio/AUDIO-${tools('others').randomString(10)}.mp3`
	let offFile = `./lib/media/audio/AUDIO-${tools('others').randomString(10)}.mp3`
	await fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mess.wait(), message.id)
		await ffmpeg(onFile)
			.noVideo()
			.format('mp3')
			.save(offFile)
			.on('error', async function(error, stdout, stderr) {
				await kill.reply(message.from, mylang(region).fail('8d', error, (new Date).toString()), message.id)
				await tools('others').reportConsole('8D', error)
			})
			.on('end', async () => {
				await kill.sendFile(message.from, offFile, 'audio.mp3', '', message.id)
				await tools('others').clearFile(onFile)
				await tools('others').clearFile(offFile)
			})
	})
}