primerLogin=true;
var app = {
    // Application Constructor
    init: function() {
        this.bindEvents();

	/*app.menuInit();
	$("#placa").hide();
	merpago.init();
	//login.init();*/
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady);
	document.addEventListener("resume", app.autoLogin, false);
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

	$("#placa").css("height",h+"px");
	$("#navlist").css("height",h+"px");
	$("#cerrar").css("height",h+"px");
	$("#estacionar").css("height",h+"px");
	$("#raspadita").css("height",h+"px");
	$("#saldo").css("height",h+"px");
	$("#ultimos").css("height",h+"px");

	app.autoLogin();
	app.menuInit();

	mercadopago.init();
	
    },

    menuInit: function(){

	$( "#estacionaForm" ).submit(function( event ) {
		var domain = $("#patenteInE").is(":visible") ? $( "input#patenteInE" ).val() : $( "select#selPatenteE" ).val();

		setTimeout(function(){$.mobile.loading( "show", {
			            text: "cargando...",
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
		setTimeout(function(){$.mobile.loading( "show", {
			            text: "cargando...",
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
		setTimeout(function(){$.mobile.loading( "show", {
			    text: "cargando...",
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

	$( "#mp_monto_Form" ).submit(function( event ) {
		setTimeout(function(){$.mobile.loading( "show", {
			            text: "cargando...",
			            textVisible: true,
			            theme: "b",
			            textonly: null,
			            html: ""   });}, 20);
		//$( "select#montos_fijos" ).val();
		$("#mp_monto").hide();
		$("#mp_medios").show();
		event.preventDefault();
		event.stopImmediatePropagation();		
	});

	$( "button#back" ).unbind('click').click( function(){
		app.mainMenu();
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
		$("#back").show();
	});
	$("#toSaldo").unbind('click').click( function(){
		$("#header").html("Consulta de Saldo");
		$("#navlist").hide();
		$("#saldo").show();
		$("#back").show();
		setTimeout(function(){$.mobile.loading( "show", {
			            text: "cargando...",
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
		$("#back").show();
		setTimeout(function(){$.mobile.loading( "show", {
			            text: "cargando...",
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
		$("#back").show();
	});


	$("#toMP").unbind('click').click( function(){
		$("#header").html("Cargar Crédito");
		$("#navlist").hide();
		$("#mercadopago").show();
		$("#mp_monto").show();
		$("#mp_medios").hide();
		$("#mp_datos").hide();
		$("#mp_confirmar").hide();
		$("#mp_resultado").hide();
		$("#back").show();
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
	$("#mercadopago").hide();
	$("#header").html("Estacionamiento");
	$("#navlist").show();
	$("#back").hide();
    },

    autoLogin : function(){
	    	if(primerLogin){
			login.init();
		}else{			
			$.mobile.loading( "show", {
					    text: "reconectando...",
					    textVisible: true,
					    theme: "b",
					    textonly: null,
					    html: ""   });
			$("#placa").show();
			login.login();			
		}
	 setTimeout(app.autoLogin, 570000);
    },

    resetApp : function(buttonIndex){
	if(buttonIndex>1)localStorage.clear();
    }
    
};

app.init();
