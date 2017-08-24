const fxy = require('fxy')
const jsdom = require('jsdom')
const {JSDOM} = jsdom

//exports
module.exports = create_dom

//shared actions
function create_dom(xml){
	if(!fxy.is.text(xml)) throw new Error(`XML text required to parse dom`)
	const dom = new JSDOM(xml)
	const window = dom.window
	const document = window.document
	return new Proxy(document,{
		deleteProperty:delete_value,
		get:get_value,
		has:has_value,
		set:set_value,
		
	})
}

function delete_value(xml,name){
	return true
}

function get_value(xml,name){
	let value = null
	if(fxy.is.text(name)){
		value = xml.querySelector(name)
		if(value !== null) return value
	}
	if(name in xml){
		value = xml[name]
		if(fxy.is.function(value)) value = value.bind(xml)
	}
	return value
}

function has_value(xml,name){
	if(name in xml) return true
	if(fxy.is.text(name)){
		let value = xml.querySelector(name)
		if(value !== null) return true
	}
	return false
}

function set_value(xml,name,value){
	return true
}