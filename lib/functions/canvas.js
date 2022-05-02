const canvas = require("canvas")
const disCanvas = require("discord-canvas")
const canvacord = require("canvacord")
const sharp = require('sharp')
const axios = require('axios')
const {
	tools
} = require('./index')

// Agradecimento / Créditos aos DEV's da Loritta (Discord) pelas imagens usadas em alguns comandos abaixo, das quais estão salvas no repositório deles -> https://github.com/LorittaBot/GabrielaImageGenAssets

// Por Pedro Batistop
function scaleToFill(img, areaWidth, areaHeight, topLeftWidth, topLeftHeight, ctx) {
	var scale = Math.max(areaWidth / img.width, areaHeight / img.height)
	var x = (areaWidth / 2) - (img.width / 2) * scale
	var y = (areaHeight / 2) - (img.height / 2) * scale
	ctx.drawImage(img, x + topLeftWidth, y + topLeftHeight, img.width * scale, img.height * scale)
}

// Por Pedro Batistop
function scaleToFit(img, areaWidth, areaHeight, topLeftWidth, topLeftHeight, ctx) {
	var scale = Math.min(areaWidth / img.width, areaHeight / img.height)
	var x = (areaWidth / 2) - (img.width / 2) * scale
	var y = (areaHeight / 2) - (img.height / 2) * scale
	ctx.drawImage(img, x + topLeftWidth, y + topLeftHeight, img.width * scale, img.height * scale)
}

// Funções de desenho, essa por exemplo, cria memes do bolsonaro
exports.bolsonero = async (canvaimage, canvaimage2) => {
	const img = await canvas.loadImage(canvaimage2)
	const img2 = await canvas.loadImage(canvaimage)
	const bg = await canvas.loadImage("https://i.ibb.co/RyhGXt6/bolsodrake.png")
	const cc = canvas.createCanvas(bg.width, bg.height)
	const ctx = cc.getContext("2d")
	ctx.drawImage(bg, 0, 0, cc.width, cc.height)
	ctx.drawImage(img, cc.width / 2, 0, cc.width / 2, cc.width / 2)
	ctx.drawImage(img2, cc.width / 2, cc.width / 2, cc.width / 2, cc.width / 2)
	return cc.toBuffer()
}

exports.morrepraga = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const bg = await canvas.loadImage("https://i.ibb.co/zRVt8hm/morrepraga.jpg")
	const cc = canvas.createCanvas(bg.width, bg.height)
	const ctx = cc.getContext("2d")
	ctx.drawImage(bg, 0, 0, cc.width, cc.height)
	ctx.drawImage(img, 170, 220, 330, 330)
	return cc.toBuffer()
}

exports.invert = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const cc = canvas.createCanvas(img.width, img.height)
	const ctx = cc.getContext("2d")
	ctx.translate(cc.width, 0)
	ctx.scale(-1, 1)
	ctx.drawImage(img, 0, 0, cc.width, cc.height)
	return cc.toBuffer()
}

exports.drake = async (canvaimage, canvaimage2) => {
	const img = await canvas.loadImage(canvaimage2)
	const img2 = await canvas.loadImage(canvaimage)
	const bg = await canvas.loadImage("https://i.ibb.co/ZK2X21z/drake.jpg")
	const cc = canvas.createCanvas(bg.width, bg.height)
	const ctx = cc.getContext("2d")
	ctx.drawImage(bg, 0, 0, cc.width, cc.height)
	ctx.drawImage(img, cc.width / 2, 0, cc.width / 2, cc.width / 2)
	ctx.drawImage(img2, cc.width / 2, cc.width / 2, cc.width / 2, cc.width / 2)
	return canvas.toBuffer()
}

exports.wolverine = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const bg = await canvas.loadImage("https://i.ibb.co/jvvCmdk/wolverine.png")
	const cc = canvas.createCanvas(bg.width, bg.height)
	const ctx = cc.getContext("2d")
	ctx.drawImage(img, 160, 460, 380, 380)
	ctx.drawImage(bg, 0, 0, cc.width, cc.height)
	return cc.toBuffer()
}

exports.jooj = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const cc = canvas.createCanvas(img.width, img.height)
	const ctx = cc.getContext("2d")
	ctx.translate(cc.width, 0)
	ctx.scale(-1, 1)
	ctx.drawImage(img, 0, 0, cc.width, cc.height)
	ctx.translate(cc.width, 0)
	ctx.scale(-1, 1)
	ctx.drawImage(img, 0, 0, img.width / 2, img.height, 0, 0, cc.width / 2, cc.height)
	return cc.toBuffer()
}

exports.ojjo = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const cc = canvas.createCanvas(img.width, img.height)
	const ctx = cc.getContext("2d")
	ctx.drawImage(img, cc.width / 2, 0, cc.width, cc.height)
	ctx.translate(cc.width, 0)
	ctx.scale(-1, 1)
	ctx.drawImage(img, cc.width / 2, 0, cc.width, cc.height)
	return cc.toBuffer()
}

exports.medal = async (personOne, personTwo) => {
	const background = await canvas.loadImage("https://i.ibb.co/XbLtr51/obama.jpg")
	var avatar1 = await canvas.loadImage(personOne)
	var avatar2 = await canvas.loadImage(personTwo)
	const memer = canvas.createCanvas(760, 481)
	const context = memer.getContext('2d')
	context.drawImage(background, 5, 5, memer.width - 10, memer.height - 10)
	context.lineWidth = 10
	context.strokeRect(0, 0, memer.width, memer.height)
	context.drawImage(avatar1, 160, 96, 200, 200)
	context.drawImage(avatar2, 380, 10, 200, 200)
	return memer.toBuffer()
}

exports.ttp = async (size, color, txt) => {
	let starttxt = txt.length < 10 ? 180 : 30
	var ttp = canvas.createCanvas(512, 512)
	var ctx = ttp.getContext("2d")
	ctx.font = `${size}px sans`
	ctx.fillStyle = color.slice(1)
	ctx.fillText(txt.toUpperCase().replace(/(.{1,20})/g, '$1\n'), starttxt, starttxt)
	return ttp.toBuffer()
}

exports.welcome = async (name, disc, guild, member, avatar, type, obj) => {
	let welc = type == 'add' ? await new canvacord.Welcomer() : await new canvacord.Leaver()
	welc.setUsername(name)
	welc.setDiscriminator(disc)
	welc.setGuildName(guild)
	welc.setMemberCount(member)
	welc.setAvatar(avatar)
	if (obj.Use_Default !== true) {
		let Welver = type == 'add' ? '_Welcome' : '_GoodBye'
		if (obj['Title' + Welver] !== null) {
			welc.setText("title", obj['Title' + Welver])
		}
		if (obj['Chat' + Welver] !== null) {
			welc.setText("message", obj['Chat' + Welver])
		}
		if (obj['Member' + Welver] !== null) {
			welc.setText("member-count", obj['Member' + Welver])
		}
		if (obj.Border_Color !== null) {
			welc.setColor('border', obj.Border_Color)
		}
		if (obj.Hashtag_Color !== null) {
			welc.setColor('hashtag', obj.Hashtag_Color)
		}
		if (obj.Contor_Color !== null) {
			welc.setColor('title-border', obj.Contor_Color)
		}
		if (obj.User_Color !== null) {
			welc.setColor('username-box', obj.User_Color)
		}
		if (obj.Disc_Color !== null) {
			welc.setColor('discriminator-box', obj.Disc_Color)
		}
		if (obj.Message_Color !== null) {
			welc.setColor('message-box', obj.Message_Color)
		}
		if (obj.Title_Color !== null) {
			welc.setColor('title', obj.Title_Color)
		}
		if (obj.User_Opacity !== null) {
			welc.setOpacity("username-box", obj.User_Opacity)
		}
		if (obj.Disc_Opacity !== null) {
			welc.setOpacity("discriminator-box", obj.Disc_Opacity)
		}
		if (obj.Message_Opacity !== null) {
			welc.setOpacity("message-box", obj.Message_Opacity)
		}
		if (obj.Border_Opacity !== null) {
			welc.setOpacity("border", obj.Border_Opacity)
		}
		if (obj.Background !== null) {
			welc.setBackground(obj.Background)
		}
	}
	let img = await welc.toAttachment().then(d => d.toBuffer())
	return tools('others').dataURI('image/png', img)
}

exports.ranking = async (avatar, xp, reqxp, level, rank, rep, guild, nick) => {
	let lvlrank = await new disCanvas.RankCard()
	.setAvatar(avatar)
	.setXP("current", xp)
	.setXP("needed", reqxp)
	.setLevel(level)
	.setRank(rank)
	.setReputation(rep)
	.setRankName(guild)
	.setUsername(nick)
	.toAttachment()
	return tools('others').dataURI('image/png', lvlrank.toBuffer())
}

// Por Pedro B. - Daqui até...
exports.bolso1 = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/bolsonaro/template.png")
	let tv = await canvas.loadImage(canvaimage)
	let bolsoCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = bolsoCanvas.getContext("2d")
	scaleToFill(blurredBG, 275, 155, 107, 8, ctx)
	scaleToFit(tv, 275, 155, 107, 8, ctx)
	ctx.drawImage(bg, 0, 0, bolsoCanvas.width, bolsoCanvas.height)
	return bolsoCanvas.toBuffer()
}

exports.bolso2 = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/bolso_frame/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let bolsoCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = bolsoCanvas.getContext("2d")
	scaleToFill(blurredBG, 100, 120, 300, 36, ctx)
	scaleToFit(frame, 100, 120, 300, 36, ctx)
	ctx.drawImage(bg, 0, 0, bolsoCanvas.width, bolsoCanvas.height)
	return bolsoCanvas.toBuffer()
}

exports.bolso3 = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/bolsonaro2/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let bolsoCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = bolsoCanvas.getContext("2d")
	scaleToFill(blurredBG, 222, 130, 213, 35, ctx)
	scaleToFit(frame, 222, 130, 213, 35, ctx)
	ctx.drawImage(bg, 0, 0, bolsoCanvas.width, bolsoCanvas.height)
	return bolsoCanvas.toBuffer()
}

exports.sponge = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/bob_burning_paper/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let spongeCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = spongeCanvas.getContext("2d")
	scaleToFill(blurredBG, 102, 135, 27, 36, ctx)
	scaleToFit(frame, 102, 135, 27, 36, ctx)
	ctx.drawImage(bg, 0, 0, spongeCanvas.width, spongeCanvas.height)
	return spongeCanvas.toBuffer()
}

exports.briggs = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/briggs_cover/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let briggsCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = briggsCanvas.getContext("2d")
	scaleToFill(blurredBG, 165, 200, 218, 67, ctx)
	scaleToFit(frame, 165, 200, 218, 67, ctx)
	ctx.drawImage(bg, 0, 0, briggsCanvas.width, briggsCanvas.height)
	return briggsCanvas.toBuffer()
}

exports.ednaldoBandeira = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/ednaldo_bandeira/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let ednaldoLindoEuTeAmoCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = ednaldoLindoEuTeAmoCanvas.getContext("2d")
	scaleToFill(blurredBG, 425, 333, 46, 178, ctx)
	scaleToFit(frame, 425, 333, 46, 178, ctx)
	ctx.drawImage(bg, 0, 0, ednaldoLindoEuTeAmoCanvas.width, ednaldoLindoEuTeAmoCanvas.height)
	return ednaldoLindoEuTeAmoCanvas.toBuffer()
}

exports.ednaldoTV = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/ednaldo_tv/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let WeLoveEdnaldoPereiraCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = WeLoveEdnaldoPereiraCanvas.getContext("2d")
	scaleToFill(blurredBG, 142, 105, 270, 21, ctx)
	scaleToFit(frame, 142, 105, 270, 21, ctx)
	ctx.drawImage(bg, 0, 0, WeLoveEdnaldoPereiraCanvas.width, WeLoveEdnaldoPereiraCanvas.height)
	return WeLoveEdnaldoPereiraCanvas.toBuffer()
}

exports.markSuckerberg = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/mark_meta/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let markinCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = markinCanvas.getContext("2d")
	scaleToFill(blurredBG, 412, 300, 513, 88, ctx)
	scaleToFit(frame, 412, 300, 513, 88, ctx)
	ctx.drawImage(bg, 0, 0, markinCanvas.width, markinCanvas.height)
	return markinCanvas.toBuffer()
}

exports.paper = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/passing_paper/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let paperCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = paperCanvas.getContext("2d")
	scaleToFill(blurredBG, 135, 101, 178, 216, ctx)
	scaleToFit(frame, 135, 101, 178, 216, ctx)
	ctx.drawImage(bg, 0, 0, paperCanvas.width, paperCanvas.height)
	return paperCanvas.toBuffer()
}

exports.pepe = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/pepe_dream/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let pepeCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = pepeCanvas.getContext("2d")
	scaleToFill(blurredBG, 100, 100, 81, 1, ctx)
	scaleToFit(frame, 100, 100, 81, 1, ctx)
	ctx.drawImage(bg, 0, 0, pepeCanvas.width, pepeCanvas.height)
	return pepeCanvas.toBuffer()
}

exports.shotTV = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/rip_tv/rip_tv_og.png")
	let frame = await canvas.loadImage(canvaimage)
	let shotCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = shotCanvas.getContext("2d")
	scaleToFill(blurredBG, 155, 108, 558, 66, ctx)
	scaleToFit(frame, 155, 108, 558, 66, ctx)
	ctx.drawImage(bg, 0, 0, shotCanvas.width, shotCanvas.height)
	return shotCanvas.toBuffer()
}

exports.romero = async (canvaimage) => {
	let imageresponse = await axios({
		url: canvaimage,
		responseType: 'arraybuffer'
	})
	let buffffer = Buffer.from(imageresponse.data, 'binary')
	let blurredSharpBG = await sharp(buffffer).blur(5).modulate({
		brightness: 0.5
	}).toBuffer()
	let blurredBG = await canvas.loadImage(blurredSharpBG)
	let bg = await canvas.loadImage("https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Memes/romero_britto/template.png")
	let frame = await canvas.loadImage(canvaimage)
	let romeroCanvas = canvas.createCanvas(bg.width, bg.height)
	let ctx = romeroCanvas.getContext("2d")
	scaleToFill(blurredBG, 186, 276, 16, 18, ctx)
	scaleToFit(frame, 186, 276, 16, 18, ctx)
	ctx.drawImage(bg, 0, 0, romeroCanvas.width, romeroCanvas.height)
	return romeroCanvas.toBuffer()
}

// ...Aqui.
exports.imgEditor = async (canvaimage, propX, propY, square) => {
	let frame = await canvas.loadImage(canvaimage)
	propX = propX == 0 ? frame.width : propX
	propY = propY == 0 ? frame.height : propY
	let imgEditor = canvas.createCanvas(Math.max(frame.width, frame.height) * propX / propY, Math.max(frame.width, frame.height))
	let ctx = imgEditor.getContext("2d")
	scaleToFill(frame, Math.max(frame.width, frame.height) * propX / propY, Math.max(frame.width, frame.height), 0, 0, ctx)
	if (square) {
		let squareFrame = await canvas.loadImage(imgEditor.toBuffer())
		let blurredSharpBG = await sharp(canvaimage).blur(5).modulate({
			brightness: 0.5
		}).toBuffer()
		let blurredBG = await canvas.loadImage(blurredSharpBG)
		let imgEditorSquare = canvas.createCanvas(Math.max(frame.width, frame.height), Math.max(frame.width, frame.height))
		let ctx2 = imgEditorSquare.getContext("2d")
		scaleToFill(blurredBG, Math.max(frame.width, frame.height), Math.max(frame.width, frame.height), 0, 0, ctx2)
		scaleToFit(squareFrame, Math.max(frame.width, frame.height) * propX / propY, Math.max(frame.width, frame.height), (Math.max(frame.width, frame.height) - Math.max(frame.width, frame.height) * propX / propY) / 2, 0, ctx2)
		return imgEditorSquare.toBuffer()
	}
	return imgEditor.toBuffer()
}