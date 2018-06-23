const fxy = require('fxy')
//exports
module.exports = get_environment()

//shared actions
function get_environment(){
	return process.argv.slice(2).map(i=>get_field_value(i)).reduce((data, item)=>Object.assign(data, item), {})

	//shared actions
	function get_field_value(item, parts = null){
		let field = item
		let value = true
		if(item.includes('=')){
			parts = item.split('=')
			field = parts[0]
			value = parts[1]
		}
		else if(item.includes(':')){
			parts = item.split(':')
			field = parts[0]
			value = parts[1]
		}
		field = fxy.id.underscore(field)
		return {[field]: value}
	}
}