//exports
module.exports = {
	get data(){
		return {
			get base(){ return require('@va11y/mongo') },
			get stream(){ return require('@va11y/stream') }
		}
	},
	get environment(){ return require('./environment') },
	get hyper(){ return require('@va11y/hyper') },
	get mongo(){ return require('@va11y/mongo') }
}