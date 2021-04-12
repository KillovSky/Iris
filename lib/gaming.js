const fs = require('fs-extra')

// PEGA NIVEL
const getLevel = (userId, _dir) => {
    let pos = null
    let found = false
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            pos = i
            found = true
        }
    })
    if (found === false && pos === null) {
        const obj = { id: userId, xp: 0, level: 1 }
        _dir.push(obj)
        fs.writeFileSync('./lib/config/Bot/level.json', JSON.stringify(_dir))
        return 1
    } else { return _dir[pos].level }
}

// PEGA MSGS
const getMsg = (userId, _dir) => {
    let pos = null
    let found = false
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            pos = i
            found = true
        }
    })
    if (found === false && pos === null) {
        const obj = { id: userId, msg: 0 }
        _dir.push(obj)
        fs.writeFileSync('./lib/config/Bot/msgcount.json', JSON.stringify(_dir))
        return 1
    } else { return _dir[pos].msg }
}

// PEGA O XP
const getXp = (userId, _dir) => {
    let pos = null
    let found = false
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            pos = i
            found = true
        }
    })
    if (found === false && pos === null) {
        const obj = { id: userId, xp: 0, level: 1 }
        _dir.push(obj)
        fs.writeFileSync('./lib/config/Bot/level.json', JSON.stringify(_dir))
        return 0
    } else { return _dir[pos].xp }
}

// ADICIONA LEVEL
const addLevel = (userId, amount, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => { if (_dir[i].id === userId) { position = i } })
    if (position !== null) {
        _dir[position].level += amount
        fs.writeFileSync('./lib/config/Bot/level.json', JSON.stringify(_dir))
    }
}

// ADICIONA XP
const addXp = (userId, amount, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => { if (_dir[i].id === userId) { position = i } })
    if (position !== null) {
        _dir[position].xp += amount
        fs.writeFileSync('./lib/config/Bot/level.json', JSON.stringify(_dir))
    }
}

// PEGA O RANK
const getRank = (userId, _dir) => {
    let position = null
    let found = false
    _dir.sort((a, b) => (a.xp < b.xp) ? 1 : -1)
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
            found = true
        }
    })
    if (found === false && position === null) {
        const obj = { id: userId, xp: 0, level: 1 }
        _dir.push(obj)
        fs.writeFileSync('./lib/config/Bot/level.json', JSON.stringify(_dir))
        return 99
    } else { return position + 1 }
}

// ACIONA O GERADOR DE XP
const xpGain = new Set()

// VERIFICA SE GANHOU XP JÁ
const isWin = (userId) => { return !!xpGain.has(userId) }

const wait = (userId) => {
    xpGain.add(userId)
    setTimeout(() => { return xpGain.delete(userId) }, 60000) // 1 minuto
}

// Adiciona limite ao usuário
const addLimit = (userId, _dir) => {
    const obj = { id: userId, time: Date.now() }
    _dir.push(obj)
    fs.writeFileSync('./lib/config/Bot/diario.json', JSON.stringify(_dir))
}

// Conta as mensagens do usuario
const addMsg = (userId, amount, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => { if (_dir[i].id === userId) { position = i } })
    if (position !== null) {
        _dir[position].msg += amount
        fs.writeFileSync('./lib/config/Bot/msgcount.json', JSON.stringify(_dir))
    }
}

// Adquire o limite do usuario
const getLimit = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => { if (_dir[i].id === userId) { position = i } })
    if (position !== null) { return _dir[position].time }
}

module.exports = {
    getLevel,
	getMsg,
    getXp,
    addLevel,
    addXp,
    getRank,
    isWin,
    wait,
	addLimit,
	addMsg,
	getLimit
}