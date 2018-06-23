const {URL} = require('url')
const transport = require('./transport')
const stream = require('./stream')

//exports
module.exports.get = get
module.exports.post = post

//shared actions
function get(...x){
	return new Promise(function get_promise(success, error){
		const {url, options} = transport.options(...x)
		if(url instanceof URL === false) return error(new Error(`Invalid url: ${url}`))
		return process.nextTick(()=>{
			return transport(url).get(options, on_response).on('error', on_error)

			//shared actions
			function on_error(e){ return error(e) }
			function on_response(response){ return stream(response, options.encoding).then(success).catch(error) }
		})
	})
}



function post(...x){
	return new Promise(function post_promise(success, error){
		const {url, options, body} = transport.options(...x)
		if(url instanceof URL === false) return error(new Error(`Invalid url for post: ${url}`))
		return process.nextTick(()=>{

			//returning value
			const request = transport(url).request(options, on_response)
			request.on('error', on_error)
			request.write(body)
			return request.end()

			//shared actions
			function on_error(e){ return error(e) }
			function on_response(response){ return stream(response).then(success).catch(error) }
		})
	})
}
