var app = {
    // Application Constructor
    init: function() {
        this.bindEvents();

	/*app.menuInit();
	$("#placa").hide();
	//login.init();*/
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady);
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

	app.menuInit();
	login.init();
    },

    menuInit: function(){

	$( "#estacionaForm" ).submit(function( event ) {
		var domain = $("#patenteInE").is(":visible") ? $( "input#patenteInE" ).val() : $( "select#selPatenteE" ).val();

		var regex = /^[a-zA-Z]{3}\d{3}$/;
		if(domain.match(regex)){
			serverCom.Estacionar($( "input#horasIn" ).val(),domain,$( "input#calleIn" ).val());
			$( "input#horasIn" ).val('');
			$( "input#calleIn" ).val('');
			$( "input#patenteInE" ).val('');
		}else{
			navigator.notification.alert(
						'Por favor reintroduzca su patente repetando el patrón de letras y números AAA111',
						null,
						'Mensaje del Sistema',
						'Aceptar'
						);	
			$( "input#patenteInE" ).val('');
		}
		event.preventDefault();
		event.stopImmediatePropagation();		
	});

	$( "#raspaForm" ).submit(function( event ) {
		serverCom.AsociarRaspadita($( "input#raspaIn" ).val());
		event.preventDefault();
		event.stopImmediatePropagation();
		$( "input#raspaIn" ).val('');
	});

	$( "#cerrarForm" ).submit(function( event ) {
		var domain = $("#patenteInC").is(":visible") ? $( "input#patenteInC" ).val() : $( "select#selPatenteC" ).val();
		var regex = /^[a-zA-Z]{3}\d{3}$/;
		if(domain.match(regex)){
			serverCom.Cerrar(domain);
			$( "input#patenteInC" ).val('');
		}else if(domain=="Todas"){
			serverCom.Cerrar("");
			$( "input#patenteInC" ).val('');
		}else{
			navigator.notification.alert(
						'Por favor reintroduzca su patente repetando el patrón de letras y números AAA111',
						null,
						'Mensaje del Sistema',
						'Aceptar'
						);	
			$( "input#patenteInC" ).val('');
		}
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
		serverCom.ConsultarSaldo();
	});
	$("#toUltimos").unbind('click').click( function(){
		$("#header").html("Últimos Estacionamientos");
		$("#navlist").hide();
		$("#ultimos").show();
		$("#back").show();
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

    resetApp : function(buttonIndex){
	if(buttonIndex>1)localStorage.clear();
    }
};

app.init();
