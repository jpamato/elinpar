var app = {
    // Application Constructor
    init: function() {
        this.bindEvents();

	app.menuInit();
	$("#placa").hide();
	//login.init();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady);
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
		serverCom.Estacionar($( "input#horasIn" ).val(),$( "select#selPatente" ).val(),$( "input#calleIn" ).val());
		event.preventDefault();
		event.stopImmediatePropagation();
		$( "input#horasIn" ).val('');
		$( "input#calleIn" ).val('');
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

	app.mainMenu();

	$("#toEstacionar").unbind('click').click( function(){
		$("#header").html("Estacionar");
		$("#navlist").hide();
		$("#estacionar").show();		
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
		   //app.onLoading(false);
	});
	
	$("#reset").click( function(){
             navigator.notification.confirm ('¿resetear aplicación?', app.resetApp, 'RESET APP', ['cancelar','continuar']);
        });

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
