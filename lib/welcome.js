const fs = require('fs-extra') // Modulo para leitura do welcome.json

module.exports = welcome = async (kill, event) => {
    const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json')) // Isso verifica se o grupo está na lista dos que vão usar o welcome
    const isWelkom = welkom.includes(event.chat)
    try {
        if (event.action == 'add' && isWelkom) {
            const gChat = await kill.getChatById(event.chat)
            const { contact, groupMetadata, name } = gChat
				await kill.sendTextWithMentions(event.chat, `Olá @${event.who.replace('@c.us', '')}! 🥰 \n\nSeja bem vindo ao ${name} 😎 \n\nDesejamos que se divirta e obviamente que siga nossas regras! ✅ \n\nCaso precise, chame um Administrador ou digite /menu. 👨🏻‍💻`)
			}
			// Acima é para caso alguém entre ou seja adicionado
			// Abaixo é para caso saia ou seja removido
		if (event.action == 'remove' && isWelkom) {
			const profile = await kill.getProfilePicFromServer(event.who)
			if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
				await kill.sendFileFromUrl(event.chat, profile, 'profile.jpg', '')
				await kill.sendTextWithMentions(event.chat, `Ummm... Pena ~ainda bem~ que o @${event.who.replace('@c.us', '')} se foi... \nSentiremos sua falta. ~Agora temos -1 gado pra colheita, shit!~`)
			}
    } catch (err) {
        console.log(err)
    }
}