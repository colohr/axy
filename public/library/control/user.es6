window.fxy.exports('axy',(axy,fxy)=>{
	const axy_user = Symbol('Axy User')
	
	class User{
		constructor(axy_controller){
			if(!fxy.is.data(axy_controller) || !('axy' in axy_controller)) throw new Error(`User requires an axy.Api mixed class to control axy.User`)
			this.controller = axy_controller
		}
		get api(){ return this.controller.api }
		get signed_in(){ return fxy.is.data(this.data) }
		sign_out(){ return this.api.sign_out() }
	}
	
	axy.User = User
	
	axy.UserMix = Base => class extends axy.ApiMix(Base){
		get user_required(){ return fxy.is.element(this) && this.hasAttribute('user-required') }
		get user(){ return get_user(this) }
		set user(user_data){ return set_user(this,user_data) }
		user_not_verified(){
			if(this.user_required) this.dispatch('sign in',this)
			return this
		}
	}
	
	function get_user(element){
		if(axy_user in element) return element[axy_user]
		return element.user_not_verified()
	}
	
	function set_user(element,user_data){
		let current_user = axy_user in element ? element[axy_user]:null
		if(current_user && current_user.signed_in && !current_user.is_anonymous) current_user.sign_out()
		delete element[axy_user]
		let new_user = user_data instanceof User ? user_data:element.api.create_user(element,user_data)
		if(new_user instanceof User) element[axy_user] = new_user
		return axy_user in element ? element[axy_user]:null
	}
	
	
})