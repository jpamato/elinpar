var app = {
    // Application Constructor
    init: function() {
        this.bindEvents();
	//app.menuInit();
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
	$("#estacionar").hide();
	$("#saldo").hide();
	$("#ultimos").hide();
	$("#cerrar").hide();
	$("#raspadita").hide();
	$("#mercadopago").hide();

	$("#toEstacionar").click( function()
           { 
		$("#header").html("Estacionar");
		$("#navlist").hide();
		$("#estacionar").show();
           }
        );
	$("#toSaldo").click( function()
           {             
		   //smsSignUp.onPatenteDone();
           }
        );
	$("#toUltimos").click( function()
           {             
           }
        );
	$("#toRaspadita").click( function()
           {             
		$("#header").html("Asociar Raspadita");
		$("#navlist").hide();
		$("#raspadita").show();
           }
        );
	$("#toCerrar").click( function()
           {            
		   //app.onLoading(false);
           }
        );
	
	$("#reset").click( function()
           {
             navigator.notification.confirm ('¿resetear aplicación?', app.resetApp, 'RESET APP', ['cancelar','continuar']);
           }
	   
        );

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

    resetApp : function(buttonIndex){
	if(buttonIndex>1)localStorage.clear();
    }
};

app.init();
