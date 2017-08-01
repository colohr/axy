window.fxy.exports('axy',(axy,fxy)=>{
	const user_calendar = Symbol('calendar')
	class Calendar{
		constructor(data){
			if(fxy.is.data(data)){
				Object.assign(this,data)
			}
		}
	}
	
	axy.calendar = data => new Calendar(data)
	
	axy.Calendar = Base => class extends Base{
		get calendar(){ return get_calendar(this) }
	}
	
	function get_calendar(element){
		if(user_calendar in element) return element[user_calendar]
		return element[user_calendar] = new Calendar()
	}
})