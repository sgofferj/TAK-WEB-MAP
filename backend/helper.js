const {cot, proto} = require('@vidterra/tak.js')
const os = require('os')

module.exports.findCotTcp = (raw) => {
	const stringData = raw.toString()
	return stringData.match(/<event.*?<\/event>/g) // split incoming data into individual COT messages
}

module.exports.findCotTtl = (startDate,staleDate) => {
	const ttl = (Date.parse(staleDate) - Date.parse(startDate)) / 1000;
	return ttl;
}
