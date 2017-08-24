const fxy = require('fxy')
const Api = require('./Api')
class Action{
	constructor(name,api){
		if(!(api instanceof Api)) throw new Error(`Action api is not a valid instance of axy.Api class.`)
		this.api = api
		this.name = name
	}
	get text_value(){ return this.api.get_text(this.type) }
	get type(){ return get_type_name(this.name) }
	get value(){ return this.api.get(this.type) }
}

//exports
module.exports = Action

//shared action
function get_type_name(text){ return fxy.id.proper(text).replace(/ /g,'') }

