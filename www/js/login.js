var login = (function(){
	return {
		init : function(){
			console.log("login");
			$("#header").html("login");
			var user = localStorage.getItem("user");
			//console.log(user);
			//$("#header").html(user);
			if(user==null){			
				smsSignUp.sign();
			}else{
				//localStorage.clear();
				login.login();
				//login.login();
				//smsSignUp.sign();
			}
			//$("#header").html(user);			
		},

		login: function(){
			serverCom.GetNonce();
		}

	};
})();
