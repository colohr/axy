const fetch = require('node-fetch')
const fxy = require('fxy')
const query = require('qs')


const cache = new Map()
class Api{
	constructor(information,type,control){
		console.log(information,type,typeof control);
		this.control = control
		this.information = information
		this.type = type
		this.body = get_body(this)
	}
	get caches(){ return this.information.cache || this.control }
	get endpoint(){ return this.information[this.type] }
	get(path,input){ return this.get_text(path,input) }
	get_cache_text_result(id){
		return new Promise((success,error)=>{
			if(!this.caches) return success(null)
			if(cache.has(id)) return success(cache.get(id))
			else return this.control
			                .get(this.id)
			                .then(add_data_cache)
			                .then(value=>success(value))
			                .catch(error)
		})
		//shared actions
		function add_data_cache(data){
			if(data !== null) for(let name in data) cache.set(name,data[name])
			return cache.has(id) ? cache.get(id):null
		}
	}
	get_text(path,input){
		let body = this.input(input)
		let url = this.url(path)
		let query = `${url}?${body}`
		let id = fxy.id.dash(`${path}-${body}`)
		return this.get_cache_text_result(id)
		           .then(value=>{
			           if(value !== null) return value
			           return get_result(query).then(result=>this.set_cache_text_result(id,result))
		           })
		//return new Promise((success,error)=>{
		
		//if(this.caches) {
		//	return this.cached(id).then(value=>{
		//		if(value !== null) return success(value)
		//		return get_result(query).then(text=>this.cache_text_result(id,text))
		//		                        .then(success).catch(error)
		//	})
		//}
		//return get_result(query).then(text=>this.cache_text_result(id,text))
		//                        .then(success)
		//                        .catch(error)
		//return fetch_result(this).then(success).catch(error)
		////shared actions
		//function fetch_result(api){
		//	return get_result(query).then(xml=>{
		//		console.log({xml})
		//		if(api.caches) return api.cache(id,xml).then(_=>get_dom(xml))
		//		return get_dom(xml)
		//	}).catch(e=>{
		//		console.error(e)
		//		throw e
		//	})
		//}
		//})
	}
	get id(){return `api-${this.type}`}
	get key(){ return this.information.key }
	input(input){ return query.stringify( Object.assign(input || {},this.body) ) }
	set_cache_text_result(id,result){
		return new Promise((success,error)=>{
			if(!this.caches) return success(result)
			cache.set(id,result)
			return this.control.save(this.id,id,result)
			           .then(_=>success(result))
			           .catch(error)
		})
	}
	url(...paths){ return [this.endpoint].concat(paths).join('/') }
}



//exports
module.exports = Api

//shared actions
function get_body(api){
	let body_options = fxy.is.data(api.information.body) ? api.information.body:{}
	let body = {}
	for(let name in body_options){
		let value = body_options[name]
		if(value.includes('api.')) body[name] = fxy.dot({api},value)
		else body[name] = value
	}
	return body
}

function get_result(url,headers){
	return fetch(url, headers).then(response=>response.text())
}

