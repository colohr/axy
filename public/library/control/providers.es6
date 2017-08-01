window.fxy.exports('axy',(axy,fxy)=>{
	const available_providers = {
		Email:true,
		Github:true,
		Google:true,
		Facebook:true,
		Twitter:true,
		Phone:true,
		Create:{
			icon:'provider/sunny.svg'
		},
		Visitor:{
			action:'anonymously',
			icon:'provider/cloud.png'
		}
	}
	
	//exports
	axy.provider_options = get_provider_options
	axy.set_providers = set_available_providers
	axy.Providers = Base => class extends Base{
		get providers(){ return this.query('[providers]') }
	}
	//shared actions
	function set_available_providers(element,value,tag_name){
		if(fxy.is.element(element) !== true) throw new Error(`Please include the container Element as first input to set providers`)
		let providers = element.providers
		if(!providers) throw new Error(`A providers value in the Element is required in container to set providers. Use the axy.Providers to Mix the getter into Element.`)
		if(fxy.is.text(value)) value = value.split(',').map(item=>item.trim())
		if(fxy.is.array(value)){
			let tag = fxy.is.text(tag_name) ? tag_name:'select-option'
			let options = get_provider_options(tag,...value)
			for(let option of options) providers.appendChild(option)
			providers.update_items()
			return options
		}
		return []
	}
	
	function get_provider_options(tag,...options){
		let list = []
		for(let option of options){
			let value = null
			if(fxy.is.text(option)){
				if(option in available_providers){
					value = available_providers[option]
					if(value === true){
						value = {
							name:option,
							wwi:'',
							icon:`provider/${option.toLowerCase()}.png`
						}
					}
					else if(fxy.is.data(value)){
						value.wwi = ''
						if(!('name' in value)) value.name = option
					}
				}
				else value = {name:option}
			}
			else if(fxy.is.data(option)) value = option
			if(fxy.is.data(value)) list.push(get_provider_option(tag,value))
		}
		return list
	}
	
	function get_provider_option(tag,data){
		let option = document.createElement(tag)
		for(let name in data) option.setAttribute(name,data[name])
		return option
	}
	
})