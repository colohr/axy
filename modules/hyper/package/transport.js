const {URL} = require('url')
const query = require('querystring')
//exports
module.exports = get_transport
module.exports.headers = get_headers
module.exports.options = get_options


//shared actions
function get_body(body, headers){
	if(typeof body === 'object'){
		if(headers['content-type'] === 'application/x-www-form-urlencoded') body = query.stringify(body)
		else body = JSON.stringify(body)
	}
	if(typeof body === 'string' && headers['content-type'] === 'application/x-www-form-urlencoded'){
		headers['content-length'] = Buffer.byteLength(body)
	}

	return typeof body === 'string' ? body:undefined
}

function get_headers(...headers){
	headers = headers.filter(i=>typeof(i) === 'object' && i !== null).reduce((o, i)=>Object.assign(o, i || {}), {})
	for(const field in headers) if(typeof field === 'string')  headers[field.toLowerCase()] = headers[field]
	return headers
}

function get_transport(url){ return url.protocol === 'https:' ? require('https'):require('http') }

function get_options(url, method = 'GET', body, ...headers){
	if(typeof url === 'string') url = new URL(url)
	if(method === 'GET') headers.push(body)

	const symbols = headers.filter(i=>typeof i==='symbol')
	const options = { headers: get_headers(...headers), hostname: url.hostname, method, path: url.pathname }

	if(symbols.includes(Symbol.for('encode:base64'))) options.encoding = 'base64'
	return { body:method==='POST'?get_body(body,options.headers):undefined, options, url}
}

