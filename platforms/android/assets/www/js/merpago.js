var merpago = (function(){
	return {
		init : function(){
			/* Reemplaza por tu public_key */
			/*Mercadopago.setPublishableKey("00000000-1111-2222-3333-444444444444");

			  var mpResponseHandler = function(status, response) {
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
			  });*/

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
			};
		}
	};
})();
