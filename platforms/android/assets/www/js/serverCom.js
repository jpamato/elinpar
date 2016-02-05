var parkingID_Tigre = 13;
var soapBeg = "<?xml version='1.0' encoding='UTF-8'?><SOAP-ENV:Envelope xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ns1='http://mobile.elinpark.com/'><SOAP-ENV:Body>";
var soapEnd = "</SOAP-ENV:Body></SOAP-ENV:Envelope>";
var transaccionID = 0;
var nonce;
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
			//"<ns1:imei>"+imei+"</ns1:imei>"+
			"<ns1:imei>472559C68EE94F2F9B019B8BC8AF35AA</ns1:imei>"+
			"</ns1:GetUserForImei>"+
			soapEnd;		
		
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
};

