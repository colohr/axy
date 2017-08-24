const fxy = require('fxy')
const XmlClass = require('./Class')
const Action = require('../Action')

class XmlStruct{
	static get Action(){ return Action }
	static get actions(){ return fxy.id._(this.name) }
	static get action(){ return get_actions(this) }
	
	static list(xml){ return get_list(this,xml) }
	static data(xml){ return get_data(this,xml) }
	
	static get xml_rename(){ return {} }
	static get xml_data_selector(){ return this.xml_selector }
	static get xml_list_selector(){ return this.xml_selector }
	static get xml_selector(){ return this.name.toLowerCase() }
	
	
	constructor(data){
		if(fxy.is.data(data)) Object.assign(this,data)
	}
}

//exports
module.exports = XmlStruct


//shared actions
function get_actions(Struct){
	let actions = Struct.actions
	if(fxy.is.text(actions)) actions = {struct:actions}
	else if(!fxy.is.data(actions)) throw new Error(`XmlStruct actions must be a text or data value.`)
	return new Proxy(actions,{
		get(o,name){
			if(typeof name === 'string'){
				if(name in o) {
					let value = o[name]
					if(typeof value === 'string') return new Struct.Action(value)
					return new Struct.Action(name)
					
				}
				return null
			}
			return 'struct' in o ? new Struct.Action(o.struct):null
		}
	})
}

function get_list(Struct,xml){
	let xml_class = new XmlClass(Struct.xml_rename)
	return xml_class.list(xml,Struct.xml_list_selector).map(data=>new Struct(data))
}

function get_data(Struct,xml){
	let xml_class = new XmlClass(Struct.xml_rename)
	return new Struct(xml_class.data(xml,Struct.xml_data_selector))
}

