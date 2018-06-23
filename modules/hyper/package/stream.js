//exports
module.exports = read_stream

//shared actions
function read_stream(response, encoding = 'utf8', data = ''){
	response.setEncoding(encoding)
	return new Promise(function stream_promise(success,error){
		const stopped = status(response)
		if(stopped) {
			response.resume()
			console.error(stopped)
		}
		return process.nextTick(function stream_tick(){
			response.on('data', on_data)
			response.on('end', on_end)
			response.on('error', on_error)
			//shared actions
			function on_data(fragment){ return data += fragment }
			function on_end(){ return success(send_data(data, response)) }
			function on_error(e){ return error(e) }
		})
	})
}

function send_data(data, response){
	return {
		get base64(){ return new Buffer(data).toString('base64') },
		get data(){ return this.json.data },
		get buffer(){ return Buffer.from(data) },
		get json(){
			try{
				return JSON.parse(data)
			}catch(e){
				console.log(`••••••••••••••••${response.req.path}••••••••••••••••`)
				console.error(e)
				console.log(data)
				console.log(`••••••••••••••••${response.req.path}••••••••••••••••`)
			}
		},
		get module(){ return eval(data) },
		get text(){ return data },
		get uri(){ return `data:${response.headers['content-type']};base64,${data}`}
	}
}

function status(response){
	let error = null
	const code = response.statusCode
	if(code !== 200) error = new Error(`Request Failed.\nStatus Code: ${code}`)
	return error
}