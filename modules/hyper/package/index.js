const request = require('./request')
const content = require('./content')
const encoding = { base_image: Symbol.for('encode:base64') }
const Hyper = {
	get download(){ return require('./download') }
}

//exports
module.exports = new Proxy(request.get,{ get: (o, field)=>hyper_method(field) })

//shared actions
function hyper_content(method){
	if(typeof method === 'undefined') method = request.get
	if(typeof method !== 'function') return method
	return new Proxy(method, {
		get: (o, field)=>(url, body = null, ...x)=>(x.unshift(content.type(field)), method(url, method.name.toUpperCase(), body, ...x))
	})
}

function hyper_method(type){
	if(type in request) return hyper_content(request[type])
	else if(type in encoding) return hyper_content(Hyper[type])
	else if(type in Hyper) return Hyper[type]
	return hyper_content()[type]
}