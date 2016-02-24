var login = (function(){
	return {
		init : function(){
			//console.log("login");
			//$("#header").html("login");
			var user = localStorage.getItem("user");			
			if(user==null){			
				setTimeout(function(){$.mobile.loading( "show", {
			            text: "configurando...",
			            textVisible: true,
			            theme: "a",
			            textonly: null,
			            html: ""   });}, 20);
				smsSignUp.sign();
			}else{
				//localStorage.clear();
				setTimeout(function(){$.mobile.loading( "show", {
			            text: "iniciando...",
			            textVisible: true,
			            theme: "a",
			            textonly: null,
			            html: ""   });}, 20);
				login.login();
				//smsSignUp.sign();
			}
			//$("#header").html(user);			
		},

		login: function(){
			serverCom.GetNonce();
		}

	};
})();
