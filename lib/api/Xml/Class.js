const fxy = require('fxy')

class XMLClass{
	constructor(data_names,selector){
		this.data_names = data_names
		this.selector = selector
	}
	data(xml,query_selector){
		let data = get_data(xml.querySelector(query_selector || this.selector))
		return this.rename(data,xml)
	}
	list(xml,query_selector){
		let data_list = get_data_list(xml,query_selector || this.selector)
		return data_list.map(data=>this.rename(data,xml))
	}
	rename(input,xml){
		return rename_data(this.data_names,input,xml)
	}
}


module.exports = XMLClass
module.exports.data = get_data
module.exports.list = get_data_list
module.exports.rename = rename_data

//shared actions
function get_data(element){
	let children = Array.from(element.children)
	let data = {}
	//console.log(element.innerHTML)
	for(let child of children){
		let value = get_data_value(child.innerHTML)
		//console.log(child.localName,value)
		//console.log(child)
		if(child.localName in data) {
			if(!Array.isArray(data[child.localName])) data[child.localName] = [data[child.localName]]
			
			data[child.localName].push(value)
		}
		else data[child.localName] = value
	}
	return data
}

function get_data_list(xml,query_selector){
	let elements = Array.from(xml.querySelectorAll(query_selector))
	let list = []
	
	for(let element of elements) list.push(get_data(element))
	return list
}

function get_data_value(text){
	if(fxy.is.text(text)){
		if(fxy.is.numeric(text) && !value_is_like_time(text)) return parseFloat(text)
		else if(fxy.is.TF(text)) return text === 'true'
		return text
	}
	return null
}

function rename_data(names,input,xml){
	if(!fxy.is.data(names)) return input
	let data = {}
	for(let name in input){
		let data_name = name
		let value = input[name]
		if(name in names){
			let rename = names[name]
			if(fxy.is.text(rename)) data_name = rename
			else if(fxy.is.function(rename)){
				let new_value = rename(value,name,xml)
				if('name' in new_value) data_name = new_value.name
				if('value' in new_value) value = new_value.value
			}
			else if(rename === false) data_name = null
		}
		if(data_name) data[data_name] = value
	}
	return data
}

function value_is_like_time(text){
	return text.includes(':') || text.includes('+')
}