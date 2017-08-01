window.fxy.exports('axy',(axy,fxy)=>{
	
	const apis = {}
	
	const axy_api = Symbol('Axy API')
	const axy_control = Symbol('Axy Control')
	const axy_controller = Symbol('Axy Controller')
	const axy_name = Symbol('Axy Name')
	
	class Api extends Map{
		static control(...x){
			let CustomControl = this
			return new CustomControl(...x)
		}
		static user(...x){ return new axy.User(...x) }
		constructor(name,controller){
			super([
				[axy_name,name],
				[axy_controller,controller]
			])
		}
		get api(){ return this.get(axy_api) }
		set api(value){ return this.set(axy_api,value) }
		get controller(){ return this.get(axy_controller) }
		create_user(...x){ return this.constructor.user(...x) }
		get name(){ return this.get(axy_name) }
		sign_out(){
			throw new Error(`Sign out is not in this axy.Api`)
		}
	}
	
	//exports
	axy.apis = apis
	axy.Api = Api
	axy.ApiMix = Base => class extends Base{
		get axy(){ return get_axy_control(this) }
		get api(){ return this.axy }
	}
	
	//shared actions
	
	function get_axy_api_name(element){
		let name = 'firebase'
		if(fxy.is.element(element) && element.hasAttribute('api-name')){
			name = element.getAttribute('api-name')
		}
		else if(fxy.is.object(element) && 'api_name' in element){
			name = element.api_name
		}
		return name
	}
	
	function get_axy_control(element){
		if(axy_control in element) return element[axy_control]
		let inputs = get_axy_inputs(element)
		let name = inputs[0]
		return element[axy_control] = name in apis ? apis[name].control(...inputs):new Api(...inputs)
	}
	
	function get_axy_inputs(element){
		let inputs = [get_axy_api_name(element),element]
		if(fxy.is.object(element) && 'axy_inputs' in element){
			let axy_inputs = element.axy_inputs
			if(fxy.is.data(axy_inputs)) axy_inputs = [axy_inputs]
			else if(fxy.is.text(axy_inputs)) axy_inputs = axy_inputs.split(',')
			if(fxy.is.array(axy_inputs)) inputs = inputs.concat(axy_inputs)
		}
		return inputs
	}
	
	
})