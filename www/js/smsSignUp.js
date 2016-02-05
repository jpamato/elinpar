var smsTimeOut = 3000;
var smsSignUp = {
	
	sendPatente : function(results){
		var msg = {
			phoneNumber:"23211",			
			//phoneNumber:"1136347373",
			textMessage:"TIGRE"			
		};

		if(results.buttonIndex>1&&results.input1.length==6){

			msg.textMessage = msg.textMessage + " " +results.input1.toUpperCase();

			//$("#header").html(msg.textMessage);

			sms.sendMessage(msg, function(message) {
				//$("#header").html(msg.textMessage);
				//main.onLoading(true);
				smsSignUp.onPatenteDone();
				}, function(error) {
				//$("#header").html("error");				
				navigator.notification.alert(
					'el mensaje SMS no pudo enviarse: ' + error.message,
					null,
					'Error al enviar el SMS',
					'Done'
				);
			});		

			//smsSignUp.onPatenteDone()
		}else{
			smsSignUp.onConfirm(2);
		}
	},

	sendImei : function(){
		
		var msg = {
			phoneNumber:"23211",
			//phoneNumber:"1136347373",
			//textMessage:"SEIN "+device.uuid
			textMessage:"&#x005B;IMEI&#x005D;&#x005B;"+device.uuid.replace(/\W/g, '')+"&#x005D;"
			//textMessage:"[IMEI][3f566df44a5ffd01]"
		};
		
		sms.sendMessage(msg, function(message) {
			//$("#header").html(msg.textMessage);			
			smsSignUp.onImeiSended();		
		}, function(error) {
			//$("#header").html("error");			
			navigator.notification.alert(
					'el mensaje SMS no pudo enviarse: ' + error.message,
					null,
					'Error al enviar el SMS',
					'Done'
				);
		});		
		
		//serverCom.GetUserForImei(device.uuid);
		//serverCom.GetUserForImei("359125053440840");
		//serverCom.GetUserForImei("3f566df44a5ffd01");
	},

	onConfirm : function(buttonIndex){
		//console.log("sign");
		//$("#header").html(buttonIndex);
		if(buttonIndex>1){
			navigator.notification.prompt ('Por favor introduzca su patente repetando el patrón de letras y números', smsSignUp.sendPatente, 'Registrando patente', ['salir','continuar'], 'AAA111');
		}else{
			navigator.app.exitApp();
		}
	},

	onConfirm2 : function(buttonIndex){
		//console.log("sign2");
		//$("#header").html("sign2");
		if(buttonIndex>1){
			smsSignUp.sendImei();
		}else{
			navigator.app.exitApp();
		}
	},

	onPatenteDone : function(){
		//$("#header").html("Patente");
		//main.onLoading(false);
		setTimeout(function(){ navigator.notification.confirm ('Para completar la instalación se enviará un último mensaje de texto a su cargo. ¿desea continuar?', smsSignUp.onConfirm2, 'SeiN Neuquen Estacionamiento - ATENCION', ['salir','continuar']);}, smsTimeOut);
		//smsSignUp.sendImei();
		
	},

	onImeiSended : function(){		
		//$("#header").html("Imei");
		//main.onLoading(false);
		setTimeout(function(){ serverCom.GetUserForImei(device.uuid.replace(/\W/g, ''));}, smsTimeOut);
		//main.onLoading(true);
		//serverCom.GetUserForImei(device.uuid);		
	},

	sign : function(){			
		navigator.notification.confirm ('Para completar la instalación se necesita enviar un mensaje de texto a su cargo. ¿desea continuar?', smsSignUp.onConfirm, 'SeiN Neuquen Estacionamiento - ATENCION', ['salir','continuar']);
		//setTimeout(function(){ serverCom.GetUserForImei(device.uuid.replace(/\W/g, ''));}, smsTimeOut);
	}	

};
