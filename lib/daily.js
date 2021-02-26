const fs = require('fs-extra')
// LIMITADOR, AGRADECIMENTOS: BOCCHI

// Adiciona limite ao usuário
const addLimit = (userId, _dir) => {
    const obj = { id: userId, time: Date.now() }
    _dir.push(obj)
    fs.writeFileSync('./lib/config/diario.json', JSON.stringify(_dir))
}

// Adquire o limite do usuario
const getLimit = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].time
    }
}

module.exports = { 
    addLimit,
    getLimit
}