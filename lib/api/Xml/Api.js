const Api = require('../Api')
const dom = require('./dom')

class XmlApi extends Api{
	get dom(){ return dom }
	get(...x){
		return this.get_text(...x).then(text=>{
			if('on_text' in this) text = this.on_text(text)
			return this.dom(text)
		})
	}
	//get(path,input){
	//	let body = this.input(input)
	//	let url = this.url(path)
	//	let query = `${url}?${body}`
	//	let id = fxy.id.dash(`${path}-${body}`)
	//	return new Promise((success,error)=>{
	//		if(this.caches) {
	//			return this.cached(id).then(value=>{
	//				if(value !== null) return success(get_dom(value))
	//				return fetch_result(this).then(success).catch(error)
	//			})
	//		}
	//		return fetch_result(this).then(success).catch(error)
	//	})
	//	//shared actions
	//	function fetch_result(api){
	//		return get_result(query).then(xml=>{
	//			console.log({xml})
	//			if(api.caches) return api.cache(id,xml).then(_=>get_dom(xml))
	//			return get_dom(xml)
	//		}).catch(e=>{
	//			console.error(e)
	//			throw e
	//		})
	//	}
	//
	//}
}

module.exports = XmlApi

//shared action
function fix_xml_result(text){
	let lines = text.split('\n').map(line=>line.trim())
	let result = []
	for(let line of lines){
		result.push(replace_xml_tags(line))
	}
	return replace_xml_tags(text)
}
function replace_xml_tags(result){
	let match = find_next(result)
	console.log({match})
	//if(match){
	//	result = replace_match(result,match)
	//	return replace_xml_tags(result)
	//}
	return result
}
function replace_match(result,tag){
	let replace = `<${tag}/>`
	let replacer = `<${tag}></${tag}>`
	return result.replace(replace,replacer);
}
function find_next(result){
	return result.substring(result.lastIndexOf("<"),result.lastIndexOf("/>")+1)
}