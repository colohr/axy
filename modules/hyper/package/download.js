const fs = require('fs')
const {URL} = require('url')
const transport = require('./transport')

//exports
module.exports = download

//shared actions
function download(file_location,...x){
	return new Promise(function(success,error){
		const {url,options} = transport.options(...x)
		if(url instanceof URL === false) return error(new Error(`Invalid url: ${url}`))
		return process.nextTick(()=>{
			const stream = fs.createWriteStream(file_location)
			return transport(url).get(options, on_response).on('error', on_error)

			//shared actions
			function on_error(e){
				fs.unlink(stream)
				return error(e)
			}

			function on_response(response){
				response.pipe(stream)
				stream.on('finish', on_finish)
				//shared actions
				function on_close(){ return success(file_location) }
				function on_finish(){ stream.close(on_close) }
			}
		})

	})
}