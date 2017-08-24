const fxy = require('fxy')

module.exports.semicolon = get_from_semicolon
module.exports.lines = get_lines

function get_lines(value,splitter='\n'){
	if(fxy.is.text(value)){
		return value.split(splitter).map(line=>line.trim()).filter(line=>line.length)
	}
	return []
}

function get_from_semicolon(value){
	return get_lines(value,';')
}

