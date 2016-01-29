var parkingID_Tigre = 13;
var soapBeg = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> <soap:Body> ';
/*<SaveProduct xmlns="http://sh.inobido.com/"> \
  <productID>' + productID + '</productID> \
  <productName>' + productName + '</productName> \
  <manufactureDate>' + manufactureDate + '</manufactureDate> \
  </SaveProduct> \*/
var soapEnd = '</soap:Body></soap:Envelope>';
var transaccionID = 0;

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
		$("#header").html("GUFI");
		/*serverCom.soapRequest = soapBeg +
			'<GetUserForImei xmlns="http://elinpark.com/mobile">'+
			'<transactionId>' + transaccionID + '</transactionId>'+
			'<parkingId>' + parkingID_Tigre + '</parkingId>'+ 
			'<userId>' + 0 + '</userId>' +
			'<imei>' + imei + '</imei>' +
			'</GetUserForImei>'
			+soapEnd;*/
		serverCom.soapRequest = "<?xml version='1.0' encoding='UTF-8'?><SOAP-ENV:Envelope xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ns1='http://mobile.elinpark.com/'><SOAP-ENV:Body><ns1:GetUserForImei><ns1:transactionId>"+transaccionID+"</ns1:transactionId><ns1:parkingId>"+parkingID_Tigre+"</ns1:parkingId><ns1:userId>0</ns1:userId><ns1:imei>"+imei+"</ns1:imei></ns1:GetUserForImei></SOAP-ENV:Body></SOAP-ENV:Envelope>"
		serverCom.onReqComplete = function endSaveProduct(xmlHttpRequest, status){
			$(xmlHttpRequest.responseXML)
				.find('GetUserForImeiResult')
				.each(function(){
					var userID = $(this).find('userId').text();
					localStorage.setItem("user",userID);
					var mess = $(this).find('message').text();
					$("#header").html(userID);
					navigator.notification.alert(
						mess,
						null,
						'Message Sent',
						'Done'
						);
				});
		};
		serverCom.request();

	}

};

