var smsSignUp = {
	
	send : function(){
		/*
		var msg = {
			phoneNumber:"23211",
			//phoneNumber:"1136347373",
			//textMessage:"SEIN "+device.uuid
			textMessage:"&#x005B;IMEI&#x005D;&#x005B;"+device.uuid+"&#x005D;"
		};

		sms.sendMessage(msg, function(message) {
			console.log("success: " + message);
			navigator.notification.alert(
			    'Message to ' + number + ' has been sent.',
			    null,
			    'Message Sent',
			    'Done'
			);

		}, function(error) {
			console.log("error: " + error.code + " " + error.message);
			navigator.notification.alert(
				'Sorry, message not sent: ' + error.message,
				null,
				'Error',
				'Done'
			);
		});
		*/
		//serverCom.GetUserForImei(device.uuid);
		serverCom.GetUserForImei("359125053440840");
	},

	onConfirm : function(buttonIndex){
		console.log("sign");
		$("#header").html("sign");
		if(buttonIndex===1){
			smsSignUp.send();
		}else if(buttonIndex===2){
			navigator.app.exitApp();
		}
	},

	sign : function(){				
		//navigator.notification.confirm ('Para completar la instalación se necesita enviar un mensaje de texto a su cargo. ¿desea continuar?', smsSignUp.onConfirm, 'SeiN Neuquen Estacionamiento - ATENCION', ['continuar ', 'salir']);
		smsSignUp.send();
	}

};
