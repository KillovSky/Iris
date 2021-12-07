const {
	tools
} = require('./')
const config = require('../config/Gerais/config.json')
const fs = require('fs')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg')

// Faz redimensionamento de gifs, créditos Pedro B.
exports.resize = async (link, command, kill, message) => {
	let gifpc = `./lib/media/img/${command}-${tools('others').randomString(20)}.gif`
	let vidpc = `./lib/media/img/${command}-${tools('others').randomString(20)}.mp4`
	await axios.get(link.data.url, {
		responseType: 'arraybuffer'
	}).then(async (response) => {
		await fs.writeFile(gifpc, Buffer.from(response.data, 'binary'), async (err) => {
			if (err) return console.error(err)
			await ffmpeg(gifpc)
				.outputOptions(['-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', "scale=trunc(iw/2)*2:trunc(ih/2)*2"])
				.save(vidpc)
				.on('error', async function(error, stdout, stderr) {
					await kill.reply(message.from, mylang(config.Language).fail(command, error, time), message.id)
					console.log(color('[FFMPEG]', 'crimson'), color(`→ Obtive erros no comando ${config.Prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				})
				.on('end', async () => {
					await tools('others').sleep(2000)
					await kill.sendFile(message.from, vidpc, 'video.mp4', '', message.id).then(async () => {
						setTimeout(() => {
							fs.unlinkSync(gifpc)
							fs.unlinkSync(vidpc)
						}, 60000)
					})
				})
			//await kill.sendMp4AsSticker(message.from, `./lib/media/img/${command}${user.replace('@c.us', '')}${lvpc}.mp4`, null, { stickerMetadata: true, pack: config.pack, author: config.author, fps: 10, crop: true, loop: 0 }).catch(async () => { await kill.reply(message.from, mess.gifail(), message.id) })
		})
	})
}