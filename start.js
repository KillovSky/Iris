// Impede de desligar quando sofre erros, cuidado ainda assim
process.on('unhandledRejection', (why, onw) => console.error(why, '\nUnhandled Rejection at Promise', onw))
process.on('uncaughtException', (err) => console.error(err, '\nUncaught Exception thrown'))

const WA = require("@open-wa/wa-automate")
const fs = require('fs')
const {
	tools
} = require('./lib/functions')
const Start_Iris = require('./lib/functions/listener')

// JSON's
const sesConfig = JSON.parse(fs.readFileSync('./lib/config/Settings/session.json'))
const Configs = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'))

// Limpa os backups conforme limite do dono
const Backups_Length = fs.readdirSync('./lib/config/Backups')
if (Backups_Length.length > Configs.Max_Backups) {
	let The_Backups = tools('others').mostRecent('./lib/config/Backups', Backups_Length.length - Number(Configs.Max_Backups))
	for (let d_file of The_Backups) {
		tools('others').clearFile(`./lib/config/Backups/${d_file}`, 0, false)
	}
}

// Cria uma sessão da Íris na Wa-Automate - Ou varias
try {
	if (sesConfig.Session_Multiple_Numbers == true) {
		// Se a pessoa esquecer de setar a segunda ou + pasta de logs
		if (sesConfig.Session_ID.length !== sesConfig.User_Data_Dir.length) {
			sesConfig.User_Data_Dir = []
			for (let i = 0; i < sesConfig.Session_ID.length; i++) {
				sesConfig.User_Data_Dir.push("./Cache/"+sesConfig.Session_ID[i])
			}
			fs.writeFileSync('./lib/config/Settings/session.json', JSON.stringify(sesConfig, null, "\t"))
		}
		for (let i = 0; i < sesConfig.Session_ID.length; i++) {
			WA.create(tools('options').options(Start_Iris, sesConfig.Session_ID[i], (sesConfig.User_Data_Dir[i] || 'Another_Iris_Session'))).then(kill => Start_Iris(kill))
		}
	} else {
		WA.create(tools('options').options(Start_Iris, sesConfig.Session_ID[0], sesConfig.User_Data_Dir[0])).then(kill => Start_Iris(kill))
	}
} catch (error) {
	console.error(error)
}