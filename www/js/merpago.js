var merpago = (function(){

	/*request : function(){
	  $.ajax({
	  url:serverCom.url,
	  type: "POST",
	  dataType: "xml",
	  data: serverCom.soapRequest,
	  complete: serverCom.onReqComplete,
	  contentType: "text/xml; charset=\"utf-8\""
	  });
	  },*/

	var payMethodInfo;

	var url = 'https://www.elinpark.com:52501/ElinparkMobile.asmx';
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

	var request = function(){
		$.ajax({
		url:url,
		type: "POST",
		dataType: 'json',
		data: JSON.stringify(mpRequest),
		complete: onReqComplete,
		contentType : 'application/json'
		});
	};
	
	var onReqComplete = function (xmlHttpRequest, status){			
		navigator.notification.alert(
				"onReqComplete: "+status,
				function(){app.mainMenu();},
				'Mensaje del Sistema',
				'Aceptar'
				);
	};

	
	var custData = {
		email:""
	};

	//var custURL = "https://api.mercadopago.com/v1/customers";
	var custURL = "https://api.mercadopago.com/v1//merchant_orders";

	var onCustReqComplete = function (status, response){			
		/*navigator.notification.alert(
				status,
				null,
				'Mensaje del Sistema',
				'Aceptar'
				);*/

		navigator.notification.alert(
				"responseCustomer: "+JSON.stringify(response),
				null,
				'Mensaje del Sistema',
				'Aceptar'
				);
	};

	var customerReq = function(){
		$.ajax({
		url:custURL,
		method: "POST",
		timeout:1e4,
		data: custData,
		complete: onCustReqComplete
		});
	};

	


	return {
		init : function(key){

			Mercadopago.setPublishableKey(key);
			//Mercadopago.setPublishableKey("TEST-ef97d076-fc1d-4747-a987-fae632e759a6");

			Mercadopago.getAllPaymentMethods(respuesta);
			//
			//merpago.setPayMethod("visa");
			//
			custURL = custURL+"/"+localStorage.getItem("user")+ "-" +parkingID_Tigre+"?public_key="+key+"notification_url="+mpFormURL;
			custData.email = mpFormURL;

				navigator.notification.alert(
				custURL,
				null,
				'Mensaje del Sistema',
				'Aceptar'
				);

			customerReq();

			Mercadopago.getIdentificationTypes(identificationHandler);

			$("#pay").submit(function( event ) {
				if(merpago.checkValidation(1)){
			        	var $form = $(this);
	          			Mercadopago.createToken($form, mpResponseHandler);
				}
          			event.preventDefault();
				event.stopImmediatePropagation();
			        return false;
	 		});

			mpRequest.card_token = 1;
      			
			var mpResponseHandler = function(status, response) {
        			var $form = $('#pay');
				navigator.notification.alert(
							"responseToken: "+JSON.stringify(response),
							null,
							'Mensaje del Sistema',
							'Aceptar'
				);

				navigator.notification.alert(
							"statusToken: "+status,
							null,
							'Mensaje del Sistema',
							'Aceptar'
				);

        			if (response.error) {
					navigator.notification.alert(
							"ocurri&oacute; un error: "+JSON.stringify(response),
							null,
							'Mensaje del Sistema',
							'Aceptar'
							);
          				//alert("ocurri&oacute; un error: "+JSON.stringify(response));
        			} else {
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
					mpRequest.item.unit_price = merpago.monto/100;
					mpRequest.merchant_access_token = localStorage.getItem("user")+ "-" +parkingID_Tigre; 
					mpRequest.payment_method_id = payMethodInfo[0].id;

					url = mpFormURL;

					navigator.notification.alert(
								"Req Data 2 Server: "+mpRequest,
								null,
								'Mensaje del Sistema',
								'Aceptar'
							);

					request();
			        }
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
				var buttons = '';
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


				$("#mp_medios").html(buttons);


				$( ".mp_cardButton" ).unbind('click').click( function(){
					merpago.setPayMethod($(this).val());
				});

			}
			},

			/*	  var mpResponseHandler = function(status, response) {
				  var $form = $('#form-pagar-mp');
				  if (response.error) {
				  alert("ocurri&oacute; un error: "+JSON.stringify(response));
				  } else {
				  var card_token_id = response.id;
				  $form.append($('<input type="hidden" id="card_token_id" name="card_token_id"/>').val(card_token_id));
				  alert("card_token_id: "+card_token_id);
				  $form.get(0).submit();
				  }   
				  };

				  $("#form-pagar-mp").submit(function( event ) {
				  var $form = $(this);
				  Mercadopago.createToken($form, mpResponseHandler);
				  event.preventDefault();
				  event.stopImmediatePropagation();
				  return false;
				  });

				  doSubmit = false;
				  addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'keyup', guessingPaymentMethod);
				  addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'change', guessingPaymentMethod);
				  addEvent(document.querySelector('#pay'),'submit',doPay);
				  function doPay(event){
				  event.preventDefault();
				  if(!doSubmit){
				  var $form = document.querySelector('#pay');

				  Mercadopago.createToken($form, sdkResponseHandler); // The function "sdkResponseHandler" is defined below

				  return false;
				  }
				  };

				  function sdkResponseHandler(status, response) {
				  if (status != 200 && status != 201) {
				  console.log(status);
				  }else{
				  console.log("else");
				  var form = document.querySelector('#pay');

				  var card = document.createElement('input');
				  card.setAttribute('name',"token");
				  card.setAttribute('type',"hidden");
				  card.setAttribute('value',response.id);
				  form.appendChild(card);
				  doSubmit=true;
				  form.submit();
				  }
				  };

				  function addEvent(el, eventName, handler){
				  console.log("add event");
				  if (el.addEventListener) {
				  el.addEventListener(eventName, handler);
				  } else {
				  el.attachEvent('on' + eventName, function(){
				  handler.call(el);
				  });
				  }
				  };

				  function getBin() {
				  var ccNumber = document.querySelector('input[data-checkout="cardNumber"]');
				  return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
				  };

				  function guessingPaymentMethod(event) {
				  var bin = getBin();

			if (event.type == "keyup") {
				if (bin.length >= 6) {
					Mercadopago.getPaymentMethod({
						"bin": bin
					}, setPaymentMethodInfo);
				}
			} else {
				setTimeout(function() {
					if (bin.length >= 6) {
						Mercadopago.getPaymentMethod({
							"bin": bin
						}, setPaymentMethodInfo);
					}
				}, 100);
			}
		};

		       function setPaymentMethodInfo(status, response) {
			       if (status == 200) {
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
			       }
		       };*/


		setPayMethod: function(id){
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
					merpago.validation.cardNumber.pattern+="{"+(response[0].settings[0].card_number.length)+"}";
					merpago.validation.securityCode.pattern+="{"+(response[0].settings[0].security_code.length)+"}";

					$(".mp_datos_cardlogo").attr("src",response[0].thumbnail);
					$("#mp_datos_conf_title").html("&nbsp;&nbsp;&nbsp;"+response[0].name+" terminada en "); 
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
				option = new Option((payerCosts[i].recommended_message || payerCosts[i].installments)+txt, payerCosts[i].installments);
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
