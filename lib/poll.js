const fs = require('fs')
const { mylang } = require('./lang')

var pollconfig = './lib/media/poll/'

// Verifica os votos existentes
async function vote(kill, message, pollfile, voterslistfile) {
    if (isvoted(message, voterslistfile)) {
        await kill.reply(message.chatId, mylang().polliv(), message.id, true);
        return;
    }
    let data = readJsonFile(pollfile)
    if (data['candis'] === 'null') {
        await kill.reply(message.chatId, mylang().nocand(), message.id, true);
        return;
    }
    let arr = data['candis']
    for (let i = 0; i < arr.length; i++) {
        if (message.body.includes((i + 1).toString())) {
            addvote(kill, message, i, pollfile);
            return;
        }
    }
    await kill.reply(message.chatId, mylang().fail(), message.id, true);
}

// Adiciona candidatos na lista
async function add(kill, message, candi, pollfile, voterslistfile) {
    let data = readJsonFile(pollfile)
    if (data['candis'] === 'null') {
        let cd = {
            name: candi,
            votes: 0
        }
        delete data['candis'];
        data['candis'] = [cd, ]
    } else {
        if (data['candis'].length >= 10) {
            await kill.reply(message.chatId, mylang().maxcand(), message.id, true);
            return;
        }
        let cd = {
            name: candi,
            votes: 0
        };
        data['candis'].push(cd);
    }
    saveJsonFile(pollfile, data)
    await kill.reply(message.chatId, mylang().addcand(candi), message.id, true);
}

// Adiciona seu voto na votação
async function addvote(kill, message, num, pollfile, voterslistfile) {
    let data = readJsonFile(pollfile)
    let vts = data['candis'][num]['votes'];
    vts = vts + 1;
    delete data['candis'][num]['votes'];
    data['candis'][num]['votes'] = vts
    saveJsonFile(pollfile, data)
    let op;
    op = `📥 - Votou em "${data['candis'][num]['name']}"\n\n🗳️ - Em ${data['title']}\n`
    let ls = '';
    let arr = data['candis'];
    for (let i = 0; i < arr.length; i++) {
        let cd = arr[i];
        ls = ls + ((i + 1).toString()) + ')' + cd['name'] + ' : [' + cd['votes'] + ' Votos] \n\n';
    }
    op = op + ls;
    op = op + mylang().howvote();
    await kill.reply(message.chatId, op, message.id, true);
    addvotedlog(message);
}

// Checa se ja votou
function isvoted(message, voterslistfile) {
    let data = readJsonFile(voterslistfile)
    return data['list'].includes(message.author);
}

// Cria um log da votação
function addvotedlog(message) {
    let data = readJsonFile(voterslistfile)
    data['list'].push(message.author)
    saveJsonFile(voterslistfile, data);
}

// Adquire a votação
async function get(kill, message, pollfile, voterslistfile) {
    let data = readJsonFile(pollfile)
    let op = '';
    if (data['candis'] == 'null') {
        op = mylang().nocand();
    } else {
        op = `🗳️ - ${data['title']}\n\n`
        let ls = '';
        let arr = data['candis'];
        for (let i = 0; i < arr.length; i++) {
            let cd = arr[i];
            ls = ls + (i + 1).toString() + ') ' + cd['name'] + ' : [' + cd['votes'] + ' Votos]\n\n';
        }
        op = op + ls;
        op = op + mylang().howvote();
    }
    await kill.reply(message.chatId, op, message.id, true)
}

// Cria uma votação
async function reset(kill, message, polltitle, pollfile, voterslistfile) {
        var datetime = new Date();
        try {
            saveJsonFile('poll_logs.json', readJsonFile(pollfile))
        } catch (e) { console.log(e) }
        let base = {
			title: polltitle,
			polldate: datetime.toISOString().slice(0, 10),
			candis: 'null'
		}
        saveJsonFile(pollfile, base)
        await kill.reply(message.chatId, mylang().startvote(polltitle), message.id);
        let data = { list: ['testentry'] }
        saveJsonFile(voterslistfile, data);
}

// Le o arquivo JSON
function readJsonFile(filename) {
	try {
		filename = pollconfig + filename
		let rawdata = fs.readFileSync(filename)
		return JSON.parse(rawdata)
	} catch (e) { console.log(e) }
}

// Salva o arquivo JSON
function saveJsonFile(filename, object) {
    filename = pollconfig + filename
    var jsonContent = JSON.stringify(object)
    fs.writeFile(filename, jsonContent, 'utf8', function(err) { if (err) return console.log(err) })
}

module.exports = {
	add,
	vote,
	get,
	reset,
	readJsonFile,
	saveJsonFile
}