const Mimes = {
	application: ['js', 'json', 'xml', 'x-www-form-urlencoded', 'octet-stream'],
	image: ['png', 'jpeg', 'jpg', 'gif', 'pic', 'ico']
}
Mimes.image.alias = {form: 'x-www-form-urlencoded', stream: 'octet-stream'}
Mimes.image.alias = {jpg: 'jpeg'}

//exports
module.exports.type = get_content_type

//shared actions
function get_content_type(type){
	if(typeof type !== 'string') type = 'plain'
	type = type.trim()
	let content = 'text'
	for(const name in Mimes){
		const mime = Mimes[name]
		if(mime.includes(type)){
			if('alias' in mime && type in mime.alias) type = mime.alias[type]
			content = name
			break
		}
	}
	return { 'content-type': `${content}/${type}` }
}