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
		var domain = $("#patenteIn").is(":visible") ? $( "input#patenteIn" ).val() : $( "select#selPatente" ).val();

		var regex = /^[a-zA-Z]{3}\d{3}$/;
		if(domain.match(regex)){
			serverCom.Estacionar($( "input#horasIn" ).val(),domain,$( "input#calleIn" ).val());
			$( "input#horasIn" ).val('');
			$( "input#calleIn" ).val('');
			$( "input#patenteIn" ).val('');
		}else{
			navigator.notification.alert(
						'Por favor reintroduzca su patente repetando el patrón de letras y números AAA111',
						null,
						'Mensaje del Sistema',
						'Aceptar'
						);	
			$( "input#patenteIn" ).val('');
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

	$( "#saldo button" ).unbind('click').click( function(){
		app.mainMenu();
	});
	
	$( "#selPatente" ).change(function() {
 		if($( "select#selPatente" ).val()=="Otra"){
			$("#patenteIn").show();
			$("#labelPIn").show();		
		}else{
			$("#patenteIn").hide();		
			$("#labelPIn").hide();		
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
		$("#patenteIn").hide();		
		$("#labelPIn").hide();		
		var myselect = $("select#selPatente");
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
	});
	$("#toSaldo").unbind('click').click( function(){
		$("#header").html("Consulta de Saldo");
		$("#navlist").hide();
		$("#saldo").show();
		serverCom.ConsultarSaldo();
	});
	$("#toUltimos").unbind('click').click( function(){
		$("#header").html("Últimos Estacionamientos");
		$("#navlist").hide();
		$("#ultimos").show();
		serverCom.Ultimos();
	});
	$("#toRaspadita").unbind('click').click( function(){
		$("#header").html("Asociar Raspadita");
		$("#navlist").hide();
		$("#raspadita").show();
	});
	$("#toCerrar").unbind('click').click( function(){
		$("#header").html("Cerrar Estacionamiento");
		$("#navlist").hide();
		$("#cerrar").show();
		serverCom.Cerrar();
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
    },

    resetApp : function(buttonIndex){
	if(buttonIndex>1)localStorage.clear();
    }
};

app.init();
