var parkingID_Tigre = 13;
var soapBeg = "<?xml version='1.0' encoding='UTF-8'?><SOAP-ENV:Envelope xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ns1='http://mobile.elinpark.com/'><SOAP-ENV:Body>";
var soapEnd = "</SOAP-ENV:Body></SOAP-ENV:Envelope>";
var transaccionID = 0;
var nonce;
var token;
var plates = [];
var serverCom = {

	url : productServiceUrl = 'https://www.elinpark.com:52501/ElinparkMobile.asmx',
	soapRequest : '',

	request : function(){
		$.ajax({
			url:serverCom.url,
		type: "POST",
		dataType: "xml",
		data: serverCom.soapRequest,
		complete: serverCom.onReqComplete,
		contentType: "text/xml; charset=\"utf-8\""
		});
	},

	onReqComplete : function(){},

	GetUserForImei : function(imei){
		//$("#header").html(imei);
		serverCom.soapRequest = soapBeg+
			"<ns1:GetUserForImei>"+
			"<ns1:transactionId>"+transaccionID+"</ns1:transactionId>"+
			"<ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId>"+
			"<ns1:userId>"+0+"</ns1:userId>"+
			"<ns1:imei>"+imei+"</ns1:imei>"+
			//"<ns1:imei>472559C68EE94F2F9B019B8BC8AF35AA</ns1:imei>"+
			"</ns1:GetUserForImei>"+
			soapEnd;		

		transaccionID++;	

		/*navigator.notification.alert(
						serverCom.soapRequest,
						null,
						'Imei Data',
						'Done'
						);*/

		//serverCom.soapRequest = "<?xml version='1.0' encoding='UTF-8'?><SOAP-ENV:Envelope xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ns1='http://mobile.elinpark.com/'><SOAP-ENV:Body><ns1:GetUserForImei><ns1:transactionId>"+transaccionID+"</ns1:transactionId><ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId><ns1:userId>0</ns1:userId><ns1:imei>"+imei+"</ns1:imei></ns1:GetUserForImei></SOAP-ENV:Body></SOAP-ENV:Envelope>";
		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){
			$(xmlHttpRequest.responseXML)
				.find('GetUserForImeiResult')
				.each(function(){
					var userID = $(this).find('UserID').text();
					var key = $(this).find('Key').text();
					localStorage.setItem("user",userID);
					localStorage.setItem("key",key);
					var mess = $(this).find('Message').text();
					//$("#header").html(userID);
					/*navigator.notification.alert(
						$(xmlHttpRequest.responseXML).text(),
						null,
						'Message Sent',
						'Done'
						);*/
				});
			//main.onLoading(false);
			login.login();
			setTimeout(function(){$.mobile.loading('hide');}, 200);
		};
		serverCom.request();
	},

	GetNonce : function(){
		var user = localStorage.getItem("user");
		//$("#header").html("nonce");
		serverCom.soapRequest = soapBeg+
			"<ns1:getNonce>"+
			"<ns1:userId>"+user+"</ns1:userId>"+			
			"</ns1:getNonce>"+
			soapEnd;
		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){
			nonce = $(xmlHttpRequest.responseXML).find('getNonceResult').text();
			localStorage.setItem("nonce",nonce);
			/*navigator.notification.alert(
						nonce,
						null,
						'Nonce',
						'Done'
						);*/
			serverCom.Login();
		};
		serverCom.request();
	},

	Login : function(){
		//$("#header").html("DoLogin");
		
		var d = new Date();
		var timeMS = d.getTime(); 

		//$("#header").html(timeMS);

		var user = localStorage.getItem("user");
		var key = localStorage.getItem("key");
		var auxCode = (Math.random()*1000).toFixed()+"";
		//var nonce = localStorage.getItem("nonce");
		//var userCode = login.getHashCode("45646544564654167606646543546541231657");		

		var toHash = auxCode + nonce + user + timeMS + device.uuid.replace(/\W/g, '').toUpperCase();
		
		var userCode = Sha1.hash(toHash);
		
		serverCom.soapRequest = soapBeg+
			"<ns1:Login>"+
			"<ns1:configVersion>0</ns1:configVersion>"+
			"<ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId>"+
			"<ns1:phoneNumber>0</ns1:phoneNumber>"+
			"<ns1:userId>"+user+"</ns1:userId>"+
			"<ns1:imei>"+device.uuid.replace(/\W/g, '')+"</ns1:imei>"+
			"<ns1:key>"+key+"</ns1:key>"+
			"<ns1:mobileType>android</ns1:mobileType>"+
			"<ns1:auxiliarUserCode>"+auxCode+"</ns1:auxiliarUserCode>"+
			"<ns1:userCode>"+userCode+"</ns1:userCode>"+
			"<ns1:clientTSMillisecs>"+timeMS+"</ns1:clientTSMillisecs>"+
			"</ns1:Login>"+
			soapEnd;		
		
		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){
			var logRes = $(xmlHttpRequest.responseXML).find('LoginResult').text();
			/*navigator.notification.alert(
						logRes,
						null,
						'LoginResult',
						'Done'
						);*/

			$(xmlHttpRequest.responseXML).find('LoginResult').each(function(){					
					var mess = $(this).find('Message').text();
					plates = $(this).find('Plates').text().match(/.{6}/g);
					token = $(this).find('Token').text();
					
					var option = '';
					for (var i=0;i<plates.length;i++){
					   option += '<option value="'+ plates[i] + '">' + plates[i] + '</option>';
					}
					option += '<option value="Otra">Otra</option>';
					$("#selPatente").append(option);					
					//$('#selPatente option[value="'+plates[0]+'"]').attr("selected",true);

					//$("#header").html(userID);
					navigator.notification.alert(
						mess,
						function(){$("#placa").hide()},
						'Mensaje del Sistema',
						'Aceptar'
						);
				});
		};
		serverCom.request();
	},

	AsociarRaspadita : function(tarjeta){
		var user = localStorage.getItem("user");
		serverCom.soapRequest = soapBeg+
			"<ns1:AssociatePrepaidCard>"+
			"<ns1:cardScracthNumber>"+tarjeta+"</ns1:cardScracthNumber>"+
			"<ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId>"+
			"<ns1:transactionId>"+transaccionID+"</ns1:transactionId>"+
			"<ns1:userId>"+user+"</ns1:userId>"+
			"<ns1:token>"+token+"</ns1:token>"+		
			"</ns1:AssociatePrepaidCard>"+
			soapEnd;			

			transaccionID++;	

		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){
			var mess = $(xmlHttpRequest.responseXML).find('AssociatePrepaidCardResult').find('Message').text();
			navigator.notification.alert(
						mess,
						function(){app.mainMenu();},
						'Mensaje del Sistema',
						'Aceptar'
						);
		};
		serverCom.request();
	},

	ConsultarSaldo : function(){
		var user = localStorage.getItem("user");
		serverCom.soapRequest = soapBeg+
			"<ns1:GetBalance>"+
			"<ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId>"+
			"<ns1:userId>"+user+"</ns1:userId>"+
			"<ns1:transactionId>"+transaccionID+"</ns1:transactionId>"+
			"<ns1:token>"+token+"</ns1:token>"+		
			"</ns1:GetBalance>"+
			soapEnd;			

			transaccionID++;	

		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){			
			var balance = $(xmlHttpRequest.responseXML).find('GetBalanceResult').find('Balance').text();
			balance = balance.substring(0, balance.length-2) + "," + balance.substring(balance.length-2, balance.length);
			$("#saldoVal").html(balance);
			/*navigator.notification.alert(
						balance,
						null,
						'Mensaje del Sistema',
						'Aceptar'
						);*/
			
		};
		serverCom.request();
	},

	Estacionar : function(horas,plate,subzona){
		var user = localStorage.getItem("user");
		serverCom.soapRequest = soapBeg+
			"<ns1:NotifyParking>"+
			"<ns1:hours>"+horas+"</ns1:hours>"+
			"<ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId>"+
			"<ns1:plate>"+plate+"</ns1:plate>"+
			"<ns1:transactionId>"+transaccionID+"</ns1:transactionId>"+
			"<ns1:userId>"+user+"</ns1:userId>"+
			"<ns1:subzone>"+subzona+"</ns1:subzone>"+
			"<ns1:token>"+token+"</ns1:token>"+		
			"</ns1:NotifyParking>"+
			soapEnd;			

			transaccionID++;	

		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){
			var code = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('ParkingTransactionCode').text();
			var domain = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('Domain').text();
			var subzone = "";
			var from = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('StartTime').text();
			var to = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('ToTime').text();
			var hours = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('RequestHours').text();
			var costo = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('PayAmount').text();
			costo = costo.substring(0, costo.length-2) + "," + costo.substring(costo.length-2, costo.length);

			//var resp = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').html();

			var mess = 	"Código: "+code+"\n"+
					"Patente: "+domain+"\n"+
					"Subzona: "+subzone+"\n"+
					"Hora de Inicio: "+from+"\n"+
					"Hora de Fin: "+to+"\n"+
					"Horas: "+hours+"\n"+
					"Monto: "+costo+"\n";


			navigator.notification.alert(
						mess,
						function(){app.mainMenu();},
						'Estacionamiento Exitoso',
						'Aceptar'
						);
		};
		serverCom.request();
	},

	Ultimos : function(){
		var user = localStorage.getItem("user");
		serverCom.soapRequest = soapBeg+
			"<ns1:GetLastParkings>"+
			"<ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId>"+
			"<ns1:userId>"+user+"</ns1:userId>"+
			"<ns1:transactionId>"+transaccionID+"</ns1:transactionId>"+
			"<ns1:plate>"+plates[0]+"</ns1:plate>"+
			"<ns1:token>"+token+"</ns1:token>"+		
			"</ns1:GetLastParkings>"+
			soapEnd;			

			/*navigator.notification.alert(
						serverCom.soapRequest,
						null,
						'Last Call',
						'Done'
						);*/

			transaccionID++;	

		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){			
			var res = $(xmlHttpRequest.responseXML).find('GetLastParkingsResult').html();
			
			navigator.notification.alert(
						res,
						null,
						'Mensaje del Sistema',
						'Aceptar'
						);
			
		};
		serverCom.request();
	}
};

