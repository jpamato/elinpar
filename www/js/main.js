primerLogin=true;
var app = {
    // Application Constructor

    nextLogin:'',

    init: function() {
        this.bindEvents();

	/*app.menuInit();
	$("#placa").hide();
	merpago.init("TEST-ef97d076-fc1d-4747-a987-fae632e759a6");
	//login.init();*/
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady);
	document.addEventListener("resume", function(){ app.autoLogin(false)}, false);
	/*$(document).on("keypress", "form", function(event) { 
		$(this).next(':input').focus();
   		return event.keyCode != 13;
	});*/

	
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
	//$("#header").html("init");
	var h = $(window).height()-$("#header").height()-2*$("#borderTop").height();
	//var w = $(window).width();
	//var bw = $(document.body).width()*0.94;

	//$("#placa").css("height",h+"px");
	
	//var ew = $("#estacionar").width();
	$("#back").css("width",$(document.body).width()*0.93+"px");

	$("#navlist").css("height",h+"px");
	$("#cerrar").css("height",h+"px");
	$("#estacionar").css("height",h+"px");
	$("#raspadita").css("height",h+"px");
	$("#saldo").css("height",h+"px");
	$("#ultimos").css("height",h+"px");
	$("#merpago").css("height",h+"px");

	$("#placa").css("height",$(window).height()+"px");
	$("#placa").css("position","fixed");

	$('body').css("position","fixed");

	

	app.autoLogin(false);
	app.menuInit();
	
    },

    menuInit: function(){
	//$("#toMP").hide();
	$( "#estacionaForm" ).submit(function( event ) {
		var domain = $("#patenteInE").is(":visible") ? $( "input#patenteInE" ).val() : $( "select#selPatenteE" ).val();

		setTimeout(function(){$("#placa").show();
				    $.mobile.loading( "show", {
			            text: "Espere un momento por favor",
			            textVisible: true,
			            theme: "b",
			            textonly: null,
			            html: ""   });}, 20);
		
		serverCom.Estacionar($( "input#horasIn" ).val(),domain,$( "input#calleIn" ).val());
		$( "input#horasIn" ).val('');
		$( "input#calleIn" ).val('');
		$( "input#patenteInE" ).val('');
		
		event.preventDefault();
		event.stopImmediatePropagation();		
	});

	$( "#raspaForm" ).submit(function( event ) {
		setTimeout(function(){$("#placa").show();
				    $.mobile.loading( "show", {
			            text: "Espere un momento por favor",
			            textVisible: true,
			            theme: "b",
			            textonly: null,
			            html: ""   });}, 20);
		serverCom.AsociarRaspadita($( "input#raspaIn" ).val());
		event.preventDefault();
		event.stopImmediatePropagation();
		$( "input#raspaIn" ).val('');
	});	

	$( "#cerrarForm" ).submit(function( event ) {
		var domain = $("#patenteInC").is(":visible") ? $( "input#patenteInC" ).val() : $( "select#selPatenteC" ).val();
		setTimeout(function(){$("#placa").show();
			    $.mobile.loading( "show", {
			    text: "Espere un momento por favor",
			    textVisible: true,
			    theme: "b",
			    textonly: null,
			    html: ""   });}, 20);
			
		if(domain=="Todas"){
			serverCom.Cerrar("");
			$( "input#patenteInC" ).val('');
		}else{
			serverCom.Cerrar(domain);
			$( "input#patenteInC" ).val('');
		}
		event.preventDefault();
		event.stopImmediatePropagation();		
	});



	
	
	$( "#selPatenteE" ).change(function() {
 		if($( "select#selPatenteE" ).val()=="Otra"){
			$("#patenteInE").show();
			$("#labelPInE").show();		
		}else{
			$("#patenteInE").hide();		
			$("#labelPInE").hide();		
		}
	});

	$( "#selPatenteC" ).change(function() {
 		if($( "select#selPatenteC" ).val()=="Otra"){
			$("#patenteInC").show();
			$("#labelPInC").show();		
		}else{
			$("#patenteInC").hide();		
			$("#labelPInC").hide();		
		}
	});

	var toMP_montos = function(){
		$('#pay')[0].reset();
		$("#mp_cuotas").show();
		$("#header").html("Recarga de Saldo");
		$("#navlist").hide();
		$("#merpago").show();
		$("#mp_monto").show();
		//$("#mp_monto").hide();
		$("#mp_medios").hide();
		$("#mp_datos_cliente").hide();
		$("#mp_medios_cliente").hide();
		$("#mp_datos").hide();
		//$("#mp_datos").show();
		$("#mp_datos_1").show();
		$("#mp_datos_2").hide();
		$("#mp_exito").hide();
		app.backButton(app.mainMenu);
		$("#back").show();
		$("#placaMP").hide();
		var myselect = $("select#montos_fijos");
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
	};

	$( "#mp_monto_Form" ).submit(function( event ) {
			
		//$( "select#montos_fijos" ).val();
		
		merpago.monto = $("#montos_fijos").val();
		$("#montos_fijos").val('');
		$("#amount").val(merpago.monto);

		$("#mp_monto").hide();
		$("#placaMP").show();
		if(merpago.mpClientHaveCards()){
			$("#header").html("Pagar");
			merpago.backAccion = toMP_montos;
			merpago.setDefaultMpCard();
			merpago.showCuotas(mpJsonPrefs.default_installments);
		}else{
			$("#header").html("Medio de Pago");
			$("#mp_medios").show();
			var myselect = $("select#docType");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");
			$("#placaMP").hide();
		}
		app.backButton(toMP_montos);	
		event.preventDefault();
		event.stopImmediatePropagation();		
	});

	$( "#cardTitle" ).unbind('click').click( function(){
		if(merpago.mpClientHaveCards()){
			$("#mp_datos").hide();
			$("#mp_medios_cliente").show();
			merpago.showClientCards();
			app.backButton(function(){
				$("#header").html("Pagar");
				$("#mp_medios_cliente").hide();
				$("#mp_datos").show();
				app.backButton(toMP_montos);
			});	
		}

		event.preventDefault();
		event.stopImmediatePropagation();
	});	

	$( ".required" ).focusout(function() {
		
		var id = $(this).attr('id');
		var input = $(this).val();
		var regex = merpago["validation"][id]["pattern"];

		if(id!="cardholderName")input = input.replace(/ /g,'');

   		var match = input.match(regex);
		/*navigator.notification.alert(
				input + "-" + regex + "-" + match,
				null,
				'Mensaje del Sistema',
				'Aceptar'
				);*/
		if(match != null && input === match[0]){
			$(this).css("border","0px");
			merpago["validation"][id]["done"]=true;
			//console.log($(this).val());
		}else{			
			$(this).css("border", "1px solid red");			
			merpago["validation"][id]["done"]=false;
			//console.log("required: "+$(this).attr('id'));
		}
	});

	$( "#mp_continuar" ).unbind('click').click( function(){
		if(merpago.checkValidation(0)){
			$("#header").html("Pagar");
			$.mobile.loading( "show", {
			            text: "Espere un momento por favor",
			            textVisible: true,
			            theme: "b",
			            textonly: null,
			            html: ""   });
			$("#placaMP").show();
			$("#mp_datos_2").show();
			$("#mp_cuotas").show();
			//console.log($("#cardNumber").val().slice(0,6));
			var cn = $("#cardNumber").val();
			merpago.setIssuers(cn.slice(0,6));
			$("#cardLast4").html(cn.slice(cn.length-4,cn.length));
			
			merpago.showCuotas(mpJsonPrefs.default_installments);

			$("#mp_datos_1").hide();			
		}
		app.backButton(app.mainMenu);
		event.preventDefault();
		event.stopImmediatePropagation();
	});

	$( "#installments" ).change(function() {
		//merpago.showCuotas($(this).val());
		/*navigator.notification.alert(		
				$(this)+" ## "+$(this).text(),
				function(){app.mainMenu();},
				'Cargar Crédito',
				'Aceptar'
				);*/
		$("#mp_cuotas").html($(this).children("option").filter(":selected").text());
	});
	
	$("#mp_cuotas").unbind('click').click( function(){
		$("#cuotasDiv").show();
		var myselect1 = $("select#installments");
		myselect1[0].selectedIndex = 0;
		myselect1.selectmenu("refresh");
		$("#mp_cuotas").hide();
		event.preventDefault();
		event.stopImmediatePropagation();
	});
	
	$(":input").keypress(function (e) {
 		 if (e.which == 13) {
		 	var inputs = $(this).closest('form').find(':input');
       			inputs.eq(inputs.index(this) + 1).focus();
		    	return false;    //<---- Add this line
		 }
	});

	app.mainMenu();

	$("#toEstacionar").unbind('click').click( function(){
		$("#header").html("Estacionar");
		$("#navlist").hide();
		$("#estacionar").show();		
		$("#patenteInE").hide();		
		$("#labelPInE").hide();		
		var myselect = $("select#selPatenteE");
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
		app.backButton(app.mainMenu);
		$("#back").show();
	});
	$("#toSaldo").unbind('click').click( function(){
		$("#saldo").hide();
		$("#header").html("Consulta de Saldo");
		$("#navlist").hide();		
		app.backButton(app.mainMenu);
		$("#back").show();
		setTimeout(function(){$("#placa").show();
				    $.mobile.loading( "show", {
			            text: "Espere un momento por favor",
			            textVisible: true,
			            theme: "b",
			            textonly: null,
			            html: ""   });}, 20);
		serverCom.ConsultarSaldo();
	});
	$("#toUltimos").unbind('click').click( function(){
		$("#header").html("Últimos Estacionamientos");
		$("#navlist").hide();
		$("#ultimos").show();
		$("#placaUlt").show();
		app.backButton(app.mainMenu);
		$("#back").show();
		setTimeout(function(){$("#placa").show();
				    $.mobile.loading( "show", {
			            text: "Espere un momento por favor",
			            textVisible: true,
			            theme: "b",
			            textonly: null,
			            html: ""   });}, 20);
		serverCom.Ultimos();
	});
	$("#toRaspadita").unbind('click').click( function(){
		$("#header").html("Asociar Raspadita");
		$("#navlist").hide();
		$("#raspadita").show();
		app.backButton(app.mainMenu);
		$("#back").show();
	});
	$("#toCerrar").unbind('click').click( function(){
		$("#header").html("Cerrar Estacionamiento");
		$("#navlist").hide();
		$("#cerrar").show();
		$("#patenteInC").hide();		
		$("#labelPInC").hide();		
		var myselect = $("select#selPatenteC");
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
		app.backButton(app.mainMenu);
		$("#back").show();
	});	

	$("#toMP").unbind('click').click( function(){
		toMP_montos();		
	});
	
	/*$("#reset").click( function(){
             navigator.notification.confirm ('¿resetear aplicación?', app.resetApp, 'RESET APP', ['cancelar','continuar']);
        });*/

    },

    onLoading : function(isLoading){
	    if(isLoading)
		    setTimeout(function(){$.mobile.loading( "show", {
			            text: "loading",
			            textVisible: true,
			            theme: "a",
			            textonly: null,
			            html: ""   });}, 20);
	    else
		    setTimeout(function(){$.mobile.loading('hide');}, 20);
    },

    mainMenu : function(){
	$("#estacionar").hide();
	$("#saldo").hide();
	$("#ultimos").hide();
	$("#cerrar").hide();
	$("#raspadita").hide();
	$("#merpago").hide();
	$("#header").html("Menu Principal");
	$("#navlist").show();
	$("#back").hide();
    },

    backButton : function(backTo){	
	$( "button#back" ).unbind('click').click( backTo );
    },    

    autoLogin : function(silent){
	    	if(primerLogin){
			login.init();
		}else{			
			clearTimeout(nextLogin);
			if(!silent){
				$("#placa").show();
				$.mobile.loading( "show", {
					    text: "Espere un momento por favor",
					    textVisible: true,
					    theme: "b",
					    textonly: null,
					    html: ""   });
			}
			login.login();			
		}
	 nextLogin = setTimeout(function(){ app.autoLogin(true)}, 570000);
    },

    resetApp : function(buttonIndex){
	if(buttonIndex>1)localStorage.clear();
    }
    
};

app.init();
