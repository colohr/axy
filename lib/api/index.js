const Api = require('./Api')
const Xml = require('./Xml')


module.exports.Api = Api
module.exports.Action = require('./Action')
module.exports.get = get_api
module.exports.register = register_sxy_library
module.exports.to = require('./to')
module.exports.Xml = Xml
module.exports.xml = get_xml_api


//shared actions
function get_api(...x){
	return new Api(...x)
}
function get_xml_api(...x){
	return new Xml.Api(...x)
}
function register_sxy_library(sxy){
	
	if(typeof sxy === 'function' && typeof sxy.library === 'function'){
		sxy.library({name:'axy', folder:__dirname})
		console.log('Registered: axy -> sxy')
		return true
	}
	return false
}