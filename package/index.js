//exports
module.exports = {
	get data(){
		return {
			get base(){ return require('data.base') },
			get stream(){ return require('data.stream') }
		}
	},
	get environment(){ return require('./environment') },
	get hyper(){ return require('hyper') }
}