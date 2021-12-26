const {
	tools
} = require('./index')

// Gera um deck aleatório
exports.randomDeck = () => {
	var suits = ['H', 'D', 'C', 'S']
	var cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
	return [tools('others').randVal(cardValues) + tools('others').randVal(suits), tools('others').randVal(cardValues) + tools('others').randVal(suits)]
}

// Conta o valor das Cartas
exports.getValue = (obj, user) => {
	var cardValue = 0
	for (let i of obj.deck[user]) {
		if (i.startsWith('10') || i.startsWith('J') || i.startsWith('K') || i.startsWith('Q')) {
			var cardValue = Number(cardValue + +10)
		} else {
			if (i.startsWith('A')) {
				var cardValue = Number(cardValue + +1)
			} else {
				var cardValue = Number(cardValue + +i[0])
			}
		}
	}
	return Number(cardValue)
}

// Adquire o Deck
exports.getDeck = (obj) => {
	deck = ''
	for (let i of Object.keys(obj.deck)) {
		deck += `"@${i.replace('@c.us', '')}" = ${tools('blackjack').getValue(obj, i)}\n\n`
	}
	return deck
}