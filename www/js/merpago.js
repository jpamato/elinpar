var merpago = (function(){

	var mpClient = {};
	var payMethodInfo;

	var payUrl = "https://www.elinpark.com:60090/api/Merchant";
	var mpRequest = {
	    campaign_id:null,
	    card_token:"",
	    installments:1,
	    item:{
	        id:"",
	        quantity:1,
	        unit_price:""
	    },
	    merchant_access_token:"",
	    payment_method_id:""
	};

	var mpTokenErrors = {
		205:"Ingresa el número de tu tarjeta.",
		208:"Elige un mes.",
		209:"Elige un año.",
		212:"Ingresa tu documento.",
		213:"Ingresa tu documento.",
		214:"Ingresa tu documento.",
		220:"Ingresa tu banco emisor.",
		221:"Ingresa el nombre y apellido.",
		224:"Ingresa el código de seguridad.",
		E301:"Hay algo mal en ese número de tarjeta. Vuelve a ingresarlo.",
		E302:"Revisa el código de seguridad.",
		316:"Ingresa un nombre válido.",
		322:"Revisa tu documento.",
		323:"Revisa tu documento.",
		324:"Revisa tu documento.",
		325:"Revisa la fecha.",
		326:"Revisa la fecha."
	};

	var request = function(){
		$.ajax({
		url:payUrl,
		type: "POST",
		dataType: 'json',
		data: JSON.stringify(mpRequest),
		complete: onReqComplete,
		contentType : 'application/json'
		});
	};
	
	var onReqComplete = function (response, status){			
		if(status=="success"){

			if(JSON.parse(response.responseText).status==="approved")
				navigator.notification.alert(
				//"onReqComplete: "+status+" "+ JSON.stringify(xmlHttpRequest),
				//"status: "+status+"  -  "+response["responseText"],
				//JSON.parse(response.responseText).status,
				//JSON.parse(response.responseText).message,
				"¡Listo, se acreditó tu pago! En tu resumen verás el cargo de $"+JSON.parse(response.responseText).transaction_details.installment_amount+" como "+JSON.parse(response.responseText).statement_descriptor,
				function(){app.mainMenu();},
				'Cargar Crédito',
				'Aceptar'
				);
			else if(JSON.parse(response.responseText).status==="in_process")
				if(JSON.parse(response.responseText).status_detail==="pending_contingency")
					navigator.notification.alert(			
					"Estamos procesando el pago. En menos de una hora te enviaremos por e-mail el resultado.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="pending_review_manual")
					navigator.notification.alert(			
					"Estamos procesando el pago. En menos de 2 días hábiles te diremos por e-mail si se acreditó o si necesitamos más información.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
			else if(JSON.parse(response.responseText).status==="rejected")
				if(JSON.parse(response.responseText).status_detail==="cc_rejected_bad_filled_card_number")
					navigator.notification.alert(			
					"Revisa el número de tarjeta.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_bad_filled_date")
					navigator.notification.alert(			
					"Revisa la fecha de vencimiento.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_bad_filled_security_code")
					navigator.notification.alert(			
					"Revisa el código de seguridad.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_blacklist")
					navigator.notification.alert(			
					"No pudimos procesar tu pago.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_call_for_authorize")
					navigator.notification.alert(			
					"Debes autorizar ante "+JSON.parse(response.responseText).payment_method_id+" el pago de $"+JSON.parse(response.responseText).transaction_amount+" a MercadoPago",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_card_disabled")
					navigator.notification.alert(			
					"Llama a "+JSON.parse(response.responseText).payment_method_id+" para que active tu tarjeta. El teléfono está al dorso de tu tarjeta.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_card_error")
					navigator.notification.alert(			
					"No pudimos procesar tu pago.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_duplicated_payment")
					navigator.notification.alert(			
					"Ya hiciste un pago por ese valor. Si necesitas volver a pagar usa otra tarjeta u otro medio de pago.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_high_risk")
					navigator.notification.alert(			
					"Tu pago fue rechazado. Elige otro de los medios de pago, te recomendamos con medios en efectivo.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_insufficient_amount")
					navigator.notification.alert(			
					"Tu "+JSON.parse(response.responseText).payment_method_id+" no tiene fondos suficientes.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_invalid_installments")
					navigator.notification.alert(			
					JSON.parse(response.responseText).payment_method_id+" no procesa pagos en "+JSON.parse(response.responseText).installments+" cuotas.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_max_attempts")
					navigator.notification.alert(			
					"Llegaste al límite de intentos permitidos. Elige otra tarjeta u otro medio de pago.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
				else if(JSON.parse(response.responseText).status_detail==="cc_rejected_other_reason")
					navigator.notification.alert(			
					JSON.parse(response.responseText).payment_method_id+" no procesó el pago.",
					function(){app.mainMenu();},
					'Cargar Crédito',
					'Aceptar'
					);
		}else
			navigator.notification.alert(				
				JSON.parse(response.responseText).message,
				function(){app.mainMenu();},
				'Cargar Crédito',
				'Aceptar'
				);

	};

	
	var custData = {};
	
	var custURL = "https://www.elinpark.com:60090/api/Merchant";

	var onCustReqComplete = function (data){
		mpClient = data;
		/*navigator.notification.alert(
				data,
				null,
				'Mensaje del Sistema',
				'Aceptar'
				);*/
	};

	var customerReq = function(){
		$.ajax({
		url:custURL,
		type: "GET",
		data: custData,
		success: onCustReqComplete,
		contentType : 'application/json'		
		});
	};

	


	return {
		init : function(key){

			Mercadopago.setPublishableKey(key);
			//Mercadopago.setPublishableKey("TEST-ef97d076-fc1d-4747-a987-fae632e759a6");

			Mercadopago.getAllPaymentMethods(respuesta);
			
			//merpago.setPayMethod("visa");

			payUrl = mpPayURL;
			custURL = mpCustomerURL;
			custData = {merchant_access_token:localStorage.getItem("user")+ "-" +parkingID_Tigre};

			customerReq();

			Mercadopago.getIdentificationTypes(identificationHandler);

			$("#pay").submit(function( event ) {
				if(merpago.checkValidation(1)){
			        	var $form = $(this);
					Mercadopago.createToken($form, mpCTokenResponse);
				}
          			event.preventDefault();
				event.stopImmediatePropagation();
			        return false;
	 		});

			mpRequest.card_token = 1;
      			
			var mpCTokenResponse = function(status, response) {
        			var $form = $('#pay');
				/*navigator.notification.alert(
							"responseToken: "+JSON.stringify(response),
							null,
							'Mensaje del Sistema',
							'Aceptar'
				);
				/*navigator.notification.alert(
							"statusToken: "+status,
							null,
							'Mensaje del Sistema',
							'Aceptar'
				);*/
				
				//status==200 OK        		
        			if (status==200){
          				/*var card_token_id = response.id;
          				$form.append($('<input type="hidden" id="card_token_id" name="card_token_id"/>').val(card_token_id));				
					$('#pay').attr('action', mpFormURL);				
          				$form.get(0).submit(function( event ) {
							/*navigator.notification.alert(
								"aca",
								null,
								'Mensaje del Sistema',
								'Aceptar'
							);*/
							//event.preventDefault();
						/*	app.mainMenu()
						});*/

					mpRequest.card_token = response.id;
					mpRequest.installments = $( "#installments" ).val(); 
					mpRequest.item.id = mpItemId;
					mpRequest.item.unit_price = merpago.monto;
					mpRequest.merchant_access_token = localStorage.getItem("user")+ "-" +parkingID_Tigre; 
					mpRequest.payment_method_id = payMethodInfo[0].id;

					/*navigator.notification.alert(
								"Req Data 2 Server: "+JSON.stringify(mpRequest),
								null,
								'Mensaje del Sistema',
								'Aceptar'
							);*/

					request();
			        }else{
					var txt = "";
					/*$.each(response.cause, function(i, v) {
						txt+=mpTokenErrors[v.code]+" ";
					});*/
					if(mpTokenErrors[response.cause[0].code]!=null)
						txt=mpTokenErrors[response.cause[0].code];
					else
						txt="Revisa los datos.";
					navigator.notification.alert(				
						txt,
						function(){app.mainMenu();},
						'Cargar Crédito',
						'Aceptar'
					);
				}
		

				$("#toMP").show();
			}

			function identificationHandler(status, response) {
				//console.log(status);
				//console.log(JSON.stringify(response));
				var option = '';
				for (var i=0;i<response.length;i++){
					option += '<option value="'+ response[i].id + '">' + response[i].name + '</option>';
				}					
				$("#docType").html(option);			
			}

			function respuesta(status, response) {
				//console.log(status);
				//console.log(JSON.stringify(response));
				var buttons = '<div id="medios_container">';
				  $.each(response, function(i, v) {
				//console.log(v.id);
				//console.log(v.thumbnail);
				var excluded = false;
				$.each(mpJsonPrefs.excluded_payment_methods, function(j, o) {
					if(v.id==o.id)excluded = true;						
				});					
				if(!excluded){
					$.each(mpJsonPrefs.excluded_payment_types, function(k, u) {
					if(v.payment_type_id==u.id)excluded = true;						
				});
				}

				if(!excluded)
					buttons+='<button class="mp_cardButton" id=mp_cardButton_'+v.id+' value='+v.id+'><div class=left><img src='+v.thumbnail+'></div><span class=right>'+v.name+'</span></button>';
				return;					
				});

				buttons+="</div>"
				$("#mp_medios").html(buttons);


				$( ".mp_cardButton" ).unbind('click').click( function(){
					$("#header").html("Ingresa los datos de tu tarjeta");
					merpago.setPayMethod($(this).val());
				});

			}
			},


		setPayMethod: function(id){

			setTimeout(function(){
					$.mobile.loading( "show", {
					text: "Espere un momento por favor",
					textVisible: true,
					theme: "b",
					textonly: null,
					html: ""   });}, 20);

			Mercadopago.getPaymentMethod({"payment_method_id": id
			}, respuesta);

			     /*function respuesta(status, response) {
			     //console.log(status);				
			     //console.log(JSON.stringify(response));			        
				     navigator.notification.alert(
					     response,
					     function(){$("#mp_medios").hide();$("#mp_datos").show();},
					     'Mensaje del Sistema',
					     'Aceptar'
				     );
			     }*/

			function respuesta(status, response) {
				if (status == 200) {
					//console.log(JSON.stringify(response));
				
					$("#mp_medios").hide();
					$("#mp_datos").show();
					$("#mp_datos_1").show();
					$("#mp_datos_2").hide();
					// do somethings ex: show logo of the payment method
					var form = document.querySelector('#pay');

					if (document.querySelector("input[name=paymentMethodId]") == null) {
						var paymentMethod = document.createElement('input');
						paymentMethod.setAttribute('name', "paymentMethodId");
						paymentMethod.setAttribute('type', "hidden");
						paymentMethod.setAttribute('value', response[0].id);

						form.appendChild(paymentMethod);
					} else {
						document.querySelector("input[name=paymentMethodId]").value = response[0].id;
					}

					payMethodInfo = response;					
					merpago.validation.cardNumber.pattern="[0-9]{"+(response[0].settings[0].card_number.length)+"}";
					merpago.validation.securityCode.pattern="[0-9]{"+(response[0].settings[0].security_code.length)+"}";

					$(".mp_datos_cardlogo").attr("src",response[0].thumbnail);
					$("#mp_datos_conf_title").html("&nbsp;&nbsp;&nbsp;"+response[0].name+" terminada en "); 
					setTimeout(function(){$("#placaMP").hide();$.mobile.loading('hide');}, 200);
				}else{
					navigator.notification.alert(
					"No fue posible conectarse al servidor. Por favor reintente más tarde.",
					function(){app.mainMenu();$("#placaMP").hide();},
					'Mensaje del Sistema',
					'Aceptar'
					);
				}				
			}; 
		},

		setIssuers: function(bin){

				// check if the security code (ex: Tarshop) is required
					var cardConfiguration = payMethodInfo[0].settings,					    
					    amount = document.querySelector('#amount').value;

					for (var index = 0; index < cardConfiguration.length; index++) {
						if (bin.match(cardConfiguration[index].bin.pattern) != null && cardConfiguration[index].security_code.length == 0) {
							/*
							 * In this case you do not need the Security code. You can hide the input.
							 */
						} else {
							/*
							 * In this case you NEED the Security code. You MUST show the input.
							 */
						}
					}

					Mercadopago.getInstallments({
						"bin": bin,
						"amount": amount
					}, setInstallmentInfo);

					// check if the issuer is necessary to pay
					var issuerMandatory = false,
					    additionalInfo = payMethodInfo[0].additional_info_needed;

					for (var i = 0; i < additionalInfo.length; i++) {
						if (additionalInfo[i] == "issuer_id") {
							issuerMandatory = true;
						}
					};
					if (issuerMandatory) {
						$("#bancosDiv").show();	
						Mercadopago.getIssuers(payMethodInfo[0].id, showCardIssuers);
						addEvent(document.querySelector('#issuer'), 'change', setInstallmentsByIssuerId);						
						setTimeout(function() {
								var myselect2 = $("select#issuer");
								myselect2[0].selectedIndex = 0;
								myselect2.selectmenu("refresh");
						},100);
						
					} else {
						document.querySelector("#issuer").options.length = 0;
						$("#bancosDiv").hide();						
					}

					setTimeout(function(){$("#placaMP").hide();$.mobile.loading('hide');}, 200);
		},

		showCuotas : function(installments){
			var costoTxt = "";
			if(merpago.monto.length>2){
				costoTxt = merpago.monto.substring(0, merpago.monto.length-2) + "," + merpago.monto.substring(merpago.monto.length-2, merpago.monto.length);
			}else if(merpago.monto.length>1){
				costoTxt = "0,"+merpago.monto;
			}else{
				costoTxt = "0,0"+merpago.monto;
			}		

			costoTxt = costoTxt.replace(".", ""); 	
			var costoCuotaTxt = (parseFloat(merpago.monto)/(installments)).toFixed(2);
			costoCuotaTxt = costoCuotaTxt.replace(".", ","); 	

			var cuotasTxt = "";
			if(installments>1){
				cuotasTxt = installments+" cuotas de $"+costoCuotaTxt+" ($ "+costoTxt+")";
			}else{
				cuotasTxt = installments+" cuota de $"+costoCuotaTxt+" ($ "+costoTxt+")";
			}
			$("#mp_cuotas").html(cuotasTxt);
		},

		validation:{
			cardNumber:{pattern:"[0-9]",step:0,done:false},
			cardExpirationMonth:{pattern:"[0-9]{2}",step:0,done:false},
			cardExpirationYear:{pattern:"[0-9]{4}",step:0,done:false},
			cardholderName:{pattern:/^(?=\s*\S).*$/,step:0,done:false},
			docNumber:{pattern:/^\d+$/,step:0,done:false},
			securityCode:{pattern:"[0-9]",step:1,done:false}
		},

		checkValidation	: function(stepN){
			var result = true;			
			for (var key in merpago.validation) {			
				if(merpago.validation[key]["step"]==stepN){
					if(!merpago.validation[key]["done"]){
						$("#"+key).css("border", "1px solid red");
						result=false;
					}
				}
			}
			return result;
		},

		mpClientHaveCards : function(){
			if(mpClient.cards.length>0){
							
				return true;	
			}else{
				return false;
			}
		},

		setDefaultMpCard : function(){
			merpago.setClientCard(mpClient.default_card);
		},

		setClientCard : function(id){
			var card = $.grep(mpClient.cards, function(e){ return e.id == id ;})[0];				
			merpago.setPayMethod(card.payment_method.id);				
			$("#header").html("Pagar");
			$("#cardId").val(id);
			$("#mp_datos_2").show();	
			$("#cardLast4").html(card.last_four_digits);
			merpago.setIssuers(card.first_six_digits);
			$("#mp_datos_1").hide();		
		},

		showClientCards : function(){
			$("#mp_medios_cliente").show();	
			var buttons = '';
			
			$.each(mpClient.cards, function(i, v) {
				buttons+='<button class="clientCardButton" id=clientCardButton_'+v.id+' value='+v.id+'><img style="vertical-align:middle" class="mp_datos_cardlogo" src='+v.payment_method.thumbnail+'><span class="mp_datos_conf_title">&nbsp;&nbsp;&nbsp;'+v.payment_method.name+' terminada en </span><span class="cardLast4">'+v.last_four_digits+'</span></button><br>';
				
				//$(".mp_datos_cardlogo").attr("src",response[0].thumbnail);
				//$("#mp_datos_conf_title").html("&nbsp;&nbsp;&nbsp;"+response[0].name+" terminada en "); 
			});

			buttons+='<button id=otherClientCard><span class="mp_datos_conf_title">Otros medios de pago...</span></button><br>';
			
			$("#mp_medios_cliente").html(buttons);

			$("#header").html("Medios de Pago");

			$( ".clientCardButton" ).unbind('click').click( function(){
				setTimeout(function(){
				    $.mobile.loading( "show", {
			            text: "Espere un momento por favor",
			            textVisible: true,
			            theme: "b",
			            textonly: null,
			            html: ""   });}, 20);
				$("#placaMP").show();

				var v = $(this).val();				
				merpago.setClientCard(v);
				$('#pay')[0].reset();
				$("#mp_cuotas").show();
				merpago.showCuotas(mpJsonPrefs.default_installments);
				$("#mp_medios_cliente").hide();

				event.preventDefault();
				event.stopImmediatePropagation();
			});

			$( "#otherClientCard" ).unbind('click').click( function(){
				
				$('#pay')[0].reset();
				$("#mp_medios").show();
				$("#mp_cuotas").show();
				merpago.showCuotas(mpJsonPrefs.default_installments);
				var myselect = $("select#docType");
				myselect[0].selectedIndex = 0;
				myselect.selectmenu("refresh");	
				$("#mp_medios_cliente").hide();
				$("#cardId").val("");
				event.preventDefault();
				event.stopImmediatePropagation();
			});
		},

		monto: ''
	};

	function setInstallmentInfo(status, response) {

		clearOptions();

		var selectorInstallments = document.querySelector("#installments"),
		    fragment = document.createDocumentFragment();

		selectorInstallments.options.length = 0;

		if (response.length > 0) {
			
				payerCosts = response[0].payer_costs;

			/*var option = new Option("Choose...", '-1'),
			fragment.appendChild(option);*/
			var option = "";
			for (var i = 0; i < payerCosts.length; i++) {
				var txt = i==0?" cuota":" cuotas";
				option = new Option((payerCosts[i].recommended_message || payerCosts[i].installments+txt), payerCosts[i].installments);
				fragment.appendChild(option);
			}
			selectorInstallments.appendChild(fragment);
			selectorInstallments.removeAttribute('disabled');
		}

		$("#cuotasDiv").hide();
	};

	function clearOptions() {
	
		//document.querySelector("#issuer").style.display = 'none';
		//document.querySelector("#issuer").innerHTML = "";

		var selectorInstallments = document.querySelector("#installments"),
		    fragment = document.createDocumentFragment(),
		    option = new Option("Choose...", '-1');

		selectorInstallments.options.length = 0;
		fragment.appendChild(option);
		selectorInstallments.appendChild(fragment);
		selectorInstallments.setAttribute('disabled', 'disabled');
	};
	
	function showCardIssuers(status, issuers) {
		var issuersSelector = document.querySelector("#issuer"),
		    fragment = document.createDocumentFragment();

		issuersSelector.options.length = 0;
		var option = new Option("Seleccione banco emisor...", '0');
		fragment.appendChild(option);		

		for (var i = 0; i < issuers.length; i++) {
			if (issuers[i].name != "default") {
				option = new Option(issuers[i].name, issuers[i].id+1);
			} else {
				option = new Option("Otro", issuers[i].id+1);
			}
			fragment.appendChild(option);
		}
		issuersSelector.appendChild(fragment);
		issuersSelector.removeAttribute('disabled');
		document.querySelector("#issuer").removeAttribute('style');		
	};

	function setInstallmentsByIssuerId(status, response) {
		var issuerId = document.querySelector('#issuer').value,
		    amount = document.querySelector('#amount').value;

		if (issuerId === '-1') {
			return;
		}

		Mercadopago.getInstallments({
			"bin": getBin(),
			"amount": amount,
			"issuer_id": issuerId
		}, setInstallmentInfo);
	};

	function addEvent(el, eventName, handler){
		//console.log("add event");
		if (el.addEventListener) {
			el.addEventListener(eventName, handler);
		} else {
			el.attachEvent('on' + eventName, function(){
				handler.call(el);
			});
		}
	};
})();
