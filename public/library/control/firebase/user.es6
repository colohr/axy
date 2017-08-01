window.fxy.exports('axy',(axy,fxy)=>{
	
	const firebase_user_data = Symbol('Firebase User Data Result')
	class FirebaseUser extends axy.User{
		static delete(user){ return delete user[firebase_user_data] }
		constructor(controller,user_data){
			super(controller)
			this[firebase_user_data] = user_data
		}
		get data(){ return get_user_data(this[firebase_user_data]) }
		get is_anonymous(){ return this.signed_in && this.data.is_anonymous }
	}
	
	//exports
	axy.FirebaseUser = FirebaseUser
	
	//shared actions
	function get_user_data(user){
		if(fxy.is.data(user)){
			return new Proxy(user,{
				get(o,original_name){
					let value = null
					if(fxy.is.text(original_name)){
						if(original_name in o) value = o[original_name]
						else{
							let name = fxy.id.code(original_name)
							if(name in o) value = o[name]
						}
					}
					else if(original_name in o) value = o[original_name]
					
					if(fxy.is.function(value)) value = value.bind(o)
					
					return value
				}
			})
		}
		return null
	}

})