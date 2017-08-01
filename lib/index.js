const fxy = require('fxy')
const router = require('./router')
module.exports = (app,options)=>{
	if(!fxy.is.data(options)) options = {path:'/axy'}
	app.use(options.path,router)
	return app
}
module.exports.router = router