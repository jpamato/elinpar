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
		
		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){
			if(status=="success"){						
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
			
				login.login();
			}else{
				navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor cierre la aplicación y reintente más tarde.",
					function(){app.mainMenu();},
					'Mensaje del Sistema',
					'Aceptar'
					);
			}
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
			if(status=="success"){
				nonce = $(xmlHttpRequest.responseXML).find('getNonceResult').text();
				localStorage.setItem("nonce",nonce);
				/*navigator.notification.alert(
							nonce,
							null,
							'Nonce',
							'Done'
							);*/
				serverCom.Login();
			}else{
				navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor reintente más tarde.",
					function(){app.mainMenu();},
					'Mensaje del Sistema',
					'Aceptar'
					);
			}
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
			if(status=="success"){
							
				plates = [];
				$(xmlHttpRequest.responseXML).find('LoginResult').each(function(){					
					var mess = $(this).find('Message').text();						
					$(this).find('Plates').find('string').each(function(){
						plates.push($(this).text());		
					});					
					token = $(this).find('Token').text();

					var option = '';
					for (var i=0;i<plates.length;i++){
					   option += '<option value="'+ plates[i] + '">' + plates[i] + '</option>';
					}
					option += '<option value="Otra">Otra</option>';
					$("#selPatenteE").html(option);					
					
					option += '<option value="Todas">Todas las patentes</option>';
					$("#selPatenteC").html(option);

					//$("#header").html(userID);
					if(primerLogin){
						navigator.notification.alert(
							mess,
							function(){$("#placa").hide();serverCom.GetMPConfig();},
							"",
							'Aceptar'
							);
						primerLogin=false;
					}else{
						$("#placa").hide();
					}
					
				});			

			}else{
				navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor reintente más tarde.",
					function(){app.mainMenu();},
					'Mensaje del Sistema',
					'Aceptar'
					);
			}

			setTimeout(function(){$.mobile.loading('hide');}, 200);
		};
		serverCom.request();
	},

	GetMPConfig : function(){
		$("#toMP").hide();
		var user = localStorage.getItem("user");
		serverCom.soapRequest = soapBeg+
		"<ns1:GetMPRechargeConfiguration>"+
		"<ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId>"+
		"<ns1:userId>"+user+"</ns1:userId>"+
		"<ns1:transactionId>"+transaccionID+"</ns1:transactionId>"+
		"<ns1:token>"+token+"</ns1:token>"+		
		"</ns1:GetMPRechargeConfiguration>"+
		soapEnd;			

		transaccionID++;

		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){
			if(status=="success"){				
				var config = $(xmlHttpRequest.responseXML).find('GetMPRechargeConfigurationResponse').find('MPConfiguration');

				if(config.length>0){			
					$("#toMP").show();					

					var key = config.find('PublicKey').text();
					merpago.init(key);

					navigator.notification.alert(
							key,
							null,
							'Mensaje del Sistema',
							'Aceptar'
							);

					var amounts = [];
					config.find('Amounts').find('int').each(function(){
						amounts.push($(this).text());		
					});

					if(amounts.length>0){
						var option = '';
						for (var i=0;i<amounts.length;i++){
					   		option += '<option value="'+ amounts[i] + '">' + amounts[i] + '</option>';
						}						
						$("#montos_fijos").html(option);
					}else{
						var min = config.find('Range').find('Min').text();
						var max = config.find('Range').find('Max').text();
						var step = config.find('Range').find('Step').text();
						var option = '';
						while(min<max){
							option += '<option value="'+min + '">' + min + '</option>';
							min+=step;
						}
						$("#montos_fijos").html(option);
					}
					
					navigator.notification.alert(
							config,
							null,
							'Mensaje del Sistema',
							'Aceptar'
							);

				}else{
					$("#toMP").hide();
					navigator.notification.alert(
							"No hay MP",
							null,
							'Mensaje del Sistema',
							'Aceptar'
							);
				}
			}else{
				navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor reintente más tarde.",
					function(){app.mainMenu();},
					'Mensaje del Sistema',
					'Aceptar'
					);
			}
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
			if(status=="success"){				
				var mess = $(xmlHttpRequest.responseXML).find('AssociatePrepaidCardResult').find('Message').text();
				var balance = $(xmlHttpRequest.responseXML).find('AssociatePrepaidCardResult').find('Balance').text();
			

				if(balance.length>0){
					if(balance.length>2){
						balance = balance.substring(0, balance.length-2) + "," + balance.substring(balance.length-2, balance.length);
					}else if(balance.length>1){
						balance = "0,"+balance;
					}else{
						balance = "0,0"+balance;
					}
					navigator.notification.alert(
							"Su saldo es de $"+balance,
							function(){app.mainMenu();},
							'Carga Exitosa',
							'Aceptar'
							);

				}else if(mess.length>0){
					navigator.notification.alert(
							mess,
							null,
							'Mensaje del Sistema',
							'Aceptar'
							);
				}
			}else{
				navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor reintente más tarde.",
					function(){app.mainMenu();},
					'Mensaje del Sistema',
					'Aceptar'
					);
			}
			setTimeout(function(){$.mobile.loading('hide');}, 200);
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
			if(status=="success"){
				var balance = $(xmlHttpRequest.responseXML).find('GetBalanceResult').find('Balance').text();
				if(balance.length>2){
						balance = balance.substring(0, balance.length-2) + "," + balance.substring(balance.length-2, balance.length);
					}else if(balance.length>1){
						balance = "0,"+balance;
					}else{
						balance = "0,0"+balance;
					}
				
				$("#saldoVal").html(balance);
			}else{
				navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor reintente más tarde.",
					function(){app.mainMenu();},
					'Mensaje del Sistema',
					'Aceptar'
					);
			}
			
			setTimeout(function(){$.mobile.loading('hide');}, 200);
		};
		serverCom.request();
	},

	Estacionar : function(horas,plate,subzona){
		var user = localStorage.getItem("user");
		if(horas.length<1)horas = 0;
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
			if(status=="success"){
				var error =  $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('Status').find('Message').text();
				if(error.length>0){
					navigator.notification.alert(
									error,
									function(){app.mainMenu();},
									'Mensaje del Sistema',
									'Aceptar'
									);
				}else{

					var code = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('ParkingTransactionCode').text();
					var domain = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('Domain').text();
					var subzone = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('SubzoneName').text();
					var from = getTimeFormat($(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('StartTime').text());
					var to = getTimeFormat($(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('ToTime').text());
					var hours = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('RequestHours').text();
					var costo = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').find('PayAmount').text();
						
					if(costo.length>2){
						costo = costo.substring(0, costo.length-2) + "," + costo.substring(costo.length-2, costo.length);
					}else if(costo.length>1){
						costo = "0,"+costo;
					}else{
						costo = "0,0"+costo;
					}

					//var resp = $(xmlHttpRequest.responseXML).find('NotifyParkingResponse').html();
					
					if(code.length>0){
						var mess = 	"Código: "+code+"\n"+
								"Patente: "+domain+"\n"+
								"Subzona: "+subzone+"\n"+
								"Hora de Inicio: "+from+"\n"+
								"Hora de Fin: "+to+"\n"+
								"Horas: "+hours+"\n"+
								"Monto: $"+costo+"\n";


						navigator.notification.alert(
									mess,
									function(){app.mainMenu();},
									'Estacionamiento Exitoso',
									'Aceptar'
									);
					}else{
							navigator.notification.alert(
								"No se pudo realizar el estacionamiento, revise los datos ingresados",
								null,
								'Mensaje del Sistema',
								'Aceptar'
								);
					}
				}
			}else{
				navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor reintente más tarde.",
					function(){app.mainMenu();},
					'Mensaje del Sistema',
					'Aceptar'
					);
			}
			setTimeout(function(){$.mobile.loading('hide');}, 200);
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
			"<ns1:plate></ns1:plate>"+
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
			if(status=="success"){
				var domain = [];
				var code = [];
				
				var subzone = [];
				var from = [];
				var to = [];
				var hours = [];
				var costo = [];

				$(xmlHttpRequest.responseXML).find('ReducedParkingTransaction').each(function(){					
						domain.push($(this).find('Domain').text());
						subzone.push($(this).find('SubzoneName').text());
						from.push($(this).find('StartTime').text());
						to.push($(this).find('ToTime').text());
						hours.push($(this).find('RequestHours').text());
						costo.push($(this).find('PayAmount').text());
						code.push($(this).find('ParkingTransactionCode').text());
					});
				
				$("#last_0").hide();
				$("#last_1").hide();
				$("#last_2").hide();
				
				if(domain.length>0){
					for(var i=0;i<domain.length;i++){
						$("#last_"+i+"_patente").html(domain[i]);
						$("#last_"+i+"_subzona").html(subzone[i]);
						$("#last_"+i+"_inicio").html(getTimeFormat(from[i]));
						$("#last_"+i+"_fin").html(getTimeFormat(to[i]));
						$("#last_"+i+"_horas").html(hours[i]);
						//$("#last_"+i+"_monto").html(costo[i]);
						if(costo[i].length>2){
							$("#last_"+i+"_monto").html("$"+costo[i].substring(0, costo[i].length-2) + "," + costo[i].substring(costo[i].length-2, costo[i].length));
						}else if(costo[i].length>1){
							$("#last_"+i+"_monto").html("$0,"+costo[i]);
						}else{
							$("#last_"+i+"_monto").html("$0,0"+costo[i]);
						}
						$("#last_"+i).show();
					}
				}else{
					navigator.notification.alert(
							"No posee registro de estacionamientos",
							function(){app.mainMenu();},
							'Mensaje del Sistema',
							'Aceptar'
							);
				}
			}else{
				navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor reintente más tarde.",
					function(){app.mainMenu();},
					'Mensaje del Sistema',
					'Aceptar'
					);
			}	
			setTimeout(function(){$.mobile.loading('hide');}, 200);
		};
		serverCom.request();
	},

	Cerrar : function(plate){
		var user = localStorage.getItem("user");
		serverCom.soapRequest = soapBeg+
			"<ns1:CloseParking>"+
			"<ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId>"+
			"<ns1:userId>"+user+"</ns1:userId>"+
			"<ns1:transactionId>"+transaccionID+"</ns1:transactionId>"+			
			"<ns1:plate>"+plate+"</ns1:plate>"+
			"<ns1:token>"+token+"</ns1:token>"+		
			"</ns1:CloseParking>"+
			soapEnd;			

			transaccionID++;	

		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){			
			if(status=="success"){
				var message = $(xmlHttpRequest.responseXML).find('CloseParkingResult').find('Message').text();
					
				if(message.length>0)
					navigator.notification.alert(
							message,
							null,
							'Cerrar Estacionamiento',
							'Aceptar'
							);
				else{

					var code = $(xmlHttpRequest.responseXML).find('CloseParkingResult').find('ParkingTransactionCode').text();
					var domain = $(xmlHttpRequest.responseXML).find('CloseParkingResult').find('Domain').text();
					var subzone = $(xmlHttpRequest.responseXML).find('CloseParkingResult').find('SubzoneName').text();;
					var from = getTimeFormat($(xmlHttpRequest.responseXML).find('CloseParkingResult').find('StartTime').text());
					var to = getTimeFormat($(xmlHttpRequest.responseXML).find('CloseParkingResult').find('ToTime').text());
					var hours =$(xmlHttpRequest.responseXML).find('CloseParkingResult').find('RequestHours').text();
					var costo = $(xmlHttpRequest.responseXML).find('CloseParkingResult').find('PayAmount').text();

					if(costo.length>2){
						costo = "$"+costo.substring(0, costo.length-2) + "," + costo.substring(costo.length-2, costo.length);
					}else if(costo.length>1){
						costo = "$0,"+costo;
					}else{
						costo = "$0,0"+costo;
					}

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
							'Cierre de estacionamiento Exitoso',
							'Aceptar'
							);

				}
			}else{
				navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor reintente más tarde.",
					function(){app.mainMenu();},
					'Mensaje del Sistema',
					'Aceptar'
					);
			}	
			setTimeout(function(){$.mobile.loading('hide');}, 200);
		};
		serverCom.request();
	}
};

function getTimeFormat(source){
	var year = source.substring(0, 4);
	var month = source.substring(5, 7);
	var day = source.substring(8, 10);
	var time = source.substring(source.length-8, source.length-3);

	return day+"/"+month+"/"+year+" "+time;
}
