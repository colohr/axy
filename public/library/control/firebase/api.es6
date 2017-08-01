window.fxy.exports('axy',(axy,fxy)=>{
	
	const firebase_databases = Symbol('Firebase Databases')
	
	const action_names = {
		account:{
			changed:'onAuthStateChanged',
			create:'createUserWithEmailAndPassword',
			providers:'fetchProvidersForEmail',
			uid:'getUid'
		},
		action_code:{
			apply:'applyActionCode',
			check:'checkActionCode'
		},
		password:{
			confirm:'confirmPasswordReset',
			email:'sendPasswordResetEmail',
			verify:'verifyPasswordResetCode'
		},
		sign_in:{
			redirect_result:'getRedirectResult'
		},
		token:{
			add_listener:'addAuthTokenListener',
			changed:'onIdTokenChanged',
			id:'getIdToken',
			remove_listener:'removeAuthTokenListener'
		}
	}
	
	class FirebaseDatabases extends Map{ constructor(){ super() } }
	
	class FirebaseApi extends axy.Api{
		static user(...x){ return new axy.FirebaseUser(...x) }
		constructor(...x){
			super(x[0],x[1])
		}
		get account(){ return get_account(this.auth) }
		get actions(){ return action_names }
		get action_code(){ return get_action_code(this.auth) }
		get app(){ return this.firebase.app() }
		get auth(){ return this.app.auth() }
		create({email,password}){
			let error_message = null
			if(fxy.is.email(email)){
				if(!fxy.is.empty(password)) return this.account.create(email,password)
				error_message = 'Invalid password'
			}
			else error_message = 'Invalid email address'
			return new Error(error_message)
		}
		get data(){ return get_data(this) }
		get database(){ return this.app.database() }
		get databases(){ return get_databases(this) }
		get firebase(){ return get_firebase() }
		get_data(type){ return get_json_data(this,type) }
		get password(){ return get_password(this.auth) }
		get providers(){ return get_providers() }
		get sign_in(){ return get_sign_in(this.auth) }
		sign_out(){
			return this.auth.signOut().then(e=>axy.FirebaseUser.delete(this.controller))
		}
		get store(){ return this.app.storage() }
		get token(){ return get_token(this.auth) }
		get user(){ return this.auth.currentUser }
		
		
	}
	
	//exports
	axy.apis.firebase = FirebaseApi

	//shared actions
	function get_account(auth){ return get_named_proxy('account',auth) }
	
	function get_action_code(auth){ return get_action_code('action_code',auth) }
	
	function get_firebase(){
		if('firebase' in  window) return window.firebase
		throw new Error(`Firebase has not been loaded globally.  Include the firebase client from firebase.com`)
	}
	
	function get_data(control){
		return new Proxy(control,{
			deleteProperty(o,name){
				let list = get_list(o)
				if(list) return list.delete(name)
				return true
			},
			get(o,name){
				if(fxy.is.text(name)){
					let list = get_list(o)
					if(list && list.has(name)) return list.get(name)
					return list.set(name,new (axy.FirebaseDatabase(o.database,name)))
					           .get(name)
				}
				else if(name in o) return o[name]
				return null
			},
			has(o,name){
				if(fxy.is.text(name)){
					let list = get_list(o)
					return list && list.has(name)
				}
				return false
			},
			set(o,name,value){
				let list = o.databases
				let path = fxy.is.text(value) ? value:name
				list.set(name,new (axy.FirebaseDatabase(o.database,path)))
				return true
			}
		})
		
		//shared actions
		function get_list(o){
			if(firebase_databases in o) return o.databases
			return null
		}
	}
	
	function get_databases(control){
		if(firebase_databases in control) return control[firebase_databases]
		return control[firebase_databases] = new FirebaseDatabases()
	}
	
	function get_json_data(control,type){
		switch(type){
			case 'app':
				return control.app.toJSON()
			case 'auth':
			case 'authentication':
			case 'authenticator':
				return control.auth.toJSON()
			case 'data':
			case 'database':
				return control.data.toJSON()
			case 'store':
			case 'storage':
				return control.store.toJSON()
		}
		let default_value = {}
		default_value[Symbol.for('unknown data type')] = type
		return default_value
	}
	
	function get_named_proxy(interface_name,interface_controller,interface_names_match){
		let actions = action_names[interface_name]
		let names = get_names(interface_controller,interface_names_match)
		return new Proxy(interface_controller,{
			get(o,original_name){
				let value = null
				if(fxy.is.text(original_name)){
					if(original_name in o) value = o[original_name]
					else {
						let name = fxy.id._(original_name)
						
						if(interface_name === 'sign_in' && !name.includes('sign_in')){
							let sign_in_name = fxy.id.code(`sign_in_${name}`)
							if(sign_in_name in o) value = o[sign_in_name]
						}
						
						if(value === null && name in actions) {
							name = actions[name]
							if(name in o) value = o[name]
						}
						
						if(value === null && names.includes(name)){
							value = o[name]
						}
					}
				}
				else if(original_name in o) value = o[original_name]
				
				if(fxy.is.function(value)) value = value.bind(o)
			
				return value
			}
		})
	}
	
	function get_names(object,matching){
		if(fxy.is.object(object) === false || !fxy.is.text(matching)) return []
		return Object.keys(object).filter(name=>name.includes(matching))
	}
	
	function get_password(auth){
		return get_named_proxy('password',auth,'Password')
	}
	
	function get_providers(){
		let auth = get_firebase().auth
		let list = Object.keys(auth).filter(name=>name.includes('Provider'))
		let names = list.map(name=>name.replace('AuthProvider',''))
		return new Proxy(list,{
			get(o,name){
				if(fxy.is.text(name) && !fxy.is.numeric(name)){
					if(list.includes(name)) return new auth[name]()
					else if(names.includes(name)) return new auth[get_auth_name(name)]
					else if(names.includes(fxy.id.capital(name))) return new auth[get_auth_name(name)]
				}
				else if(fxy.is.text(name)) return o[name]
				else if(name in o){
					let value = o[name]
					if(fxy.is.function(value)) return value.bind(o)
					return value
				}
				return null
			},
			has(o,name){
				if(name in o) return true
				if(fxy.is.text(name)) return list.includes(name) || names.includes(name)
				return false
			}
		})
		//shared actions
		function get_auth_name(name){
			return fxy.id.proper(`${name}AuthProvider`).replace(/ /g,'')
		}
		
	}
	
	function get_sign_in(auth){
		return get_named_proxy('sign_in',auth,'signIn')
	}
	
})