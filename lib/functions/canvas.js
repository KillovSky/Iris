const canvas = require("canvas")
const canvacord = require('canvacord')

// Funções de desenho, essa por exemplo, cria memes do bolsonaro
exports.bolsonero = async (canvaimage, canvaimage2) => {
	const img = await canvas.loadImage(canvaimage2)
	const img2 = await canvas.loadImage(canvaimage)
	const bg = await canvas.loadImage('https://i.ibb.co/RyhGXt6/bolsodrake.png')
	const canvas = canvas.createCanvas(bg.width, bg.height)
	const ctx = canvas.getContext("2d")
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
	ctx.drawImage(img, canvas.width / 2, 0, canvas.width / 2, canvas.width / 2)
	ctx.drawImage(img2, canvas.width / 2, canvas.width / 2, canvas.width / 2, canvas.width / 2)
	return canvas.toBuffer()
}

exports.morrepraga = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const bg = await canvas.loadImage('https://i.ibb.co/zRVt8hm/morrepraga.jpg')
	const canvas = canvas.createCanvas(bg.width, bg.height)
	const ctx = canvas.getContext("2d")
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
	ctx.drawImage(img, 170, 220, 330, 330)
	return canvas.toBuffer()
}

exports.invert = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const canvas = canvas.createCanvas(img.width, img.height)
	const ctx = canvas.getContext("2d")
	ctx.translate(canvas.width, 0)
	ctx.scale(-1, 1)
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
	return canvas.toBuffer()
}

exports.drake = async (canvaimage, canvaimage2) => {
	const img = await canvas.loadImage(canvaimage2)
	const img2 = await canvas.loadImage(canvaimage)
	const bg = await canvas.loadImage('https://i.ibb.co/ZK2X21z/drake.jpg')
	const canvas = canvas.createCanvas(bg.width, bg.height)
	const ctx = canvas.getContext("2d")
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
	ctx.drawImage(img, canvas.width / 2, 0, canvas.width / 2, canvas.width / 2)
	ctx.drawImage(img2, canvas.width / 2, canvas.width / 2, canvas.width / 2, canvas.width / 2)
	return canvas.toBuffer()
}

exports.wolverine = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const bg = await canvas.loadImage('https://i.ibb.co/jvvCmdk/wolverine.png')
	const canvas = canvas.createCanvas(bg.width, bg.height)
	const ctx = canvas.getContext("2d")
	ctx.drawImage(img, 160, 460, 380, 380)
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
	return canvas.toBuffer()
}

exports.jooj = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const canvas = canvas.createCanvas(img.width, img.height)
	const ctx = canvas.getContext("2d")
	ctx.translate(canvas.width, 0)
	ctx.scale(-1, 1)
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
	ctx.translate(canvas.width, 0)
	ctx.scale(-1, 1)
	ctx.drawImage(img, 0, 0, img.width / 2, img.height, 0, 0, canvas.width / 2, canvas.height)
	return canvas.toBuffer()
}

exports.ojjo = async (canvaimage) => {
	const img = await canvas.loadImage(canvaimage)
	const canvas = canvas.createCanvas(img.width, img.height)
	const ctx = canvas.getContext("2d")
	ctx.drawImage(img, canvas.width / 2, 0, canvas.width, canvas.height)
	ctx.translate(canvas.width, 0)
	ctx.scale(-1, 1)
	ctx.drawImage(img, canvas.width / 2, 0, canvas.width, canvas.height)
	return canvas.toBuffer()
}

exports.medal = async (personOne, personTwo) => {
	const memer = canvas.createCanvas(760, 481)
	const context = memer.getContext('2d')
	const background = await canvas.loadImage('https://i.ibb.co/XbLtr51/obama.jpg')
	context.drawImage(background, 5, 5, memer.width - 10, memer.height - 10)
	context.lineWidth = 10
	context.strokeRect(0, 0, memer.width, memer.height)
	var avatar1 = await canvas.loadImage(personOne)
	context.drawImage(avatar1, 160, 96, 200, 200)
	var avatar2 = await canvas.loadImage(personTwo)
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
	let welc = type == 'welcome' ? new canvacord.Welcomer() : new canvacord.Leaver()
	welc.setUsername(name)
	welc.setDiscriminator(disc)
	welc.setGuildName(guild)
	welc.setMemberCount(member)
	welc.setAvatar(avatar)
	if (obj.Use_Default !== true) {
		let Welver = type == 'welcome' ? '_Welcome' : '_GoodBye'
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
	await welc.build().then(data => {
		return data.toBuffer()
	})
}