const fxy = require('fxy')
const get_lines = require('./array').lines

module.exports.semicolon = get_from_semicolon
module.exports.reverse_semicolon = get_reverse_from_semicolon

function get_from_semicolon(value){
	let data = {}
	let lines = get_lines(value,';')
	for(let line of lines){
		let items = line.split(':').map(item=>item.trim())
		let name = get_valid_name(items[0])
		data[name] = get_valid_name(items[1])
	}
	return data
}

function get_reverse_from_semicolon(value){
	let data = {}
	let lines = get_lines(value,';')
	for(let line of lines){
		let items = line.split(':').map(item=>item.trim()).reverse()
		let name = get_valid_name(items[0])
		data[name] = get_valid_name(items[1])
	}
	return data
}

function get_valid_name(value){
	if(!fxy.is.text(value)) return value
	return value.replace("'",'').replace("\'",'')
}

