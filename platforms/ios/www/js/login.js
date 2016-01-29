var login = (function(){
	return {
		init : function(){
			console.log("login");
			var user = localStorage.getItem("user");
			//console.log(user);
			//$("#header").html(user);
			if(user==null){			
				//localStorage.setItem("user","carlo");
				//localStorage.setItem("user",device.uuid);
				smsSignUp.sign();
			}else{
				//localStorage.setItem("user",null);
				localStorage.clear();
			}
			user = localStorage.getItem("user");
			console.log(user);
			//$("#header").html(user);
			$("#header").html("login");
		}
	};
})();
