var PrairieWorld = function ( shared ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0 );
	this.scene.fog.color.setHSV( 0.5588235294117647,  0.7411764705882353,  0.5882352941176471 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	ambient.color.setHSV( 0, 0, 0.3 );
	this.scene.addLight( ambient );

/*	var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );	
	directionalLight1.position.set( 0.30068100380721313,  0.23859030453344973,  0.9233989389923093 );
	directionalLight1.color.setHSV( 0, 0, 0.9588 );
	this.scene.addLight( directionalLight1 );

	var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );	
	directionalLight2.position.set( -0.4535568600884794,  0.8775825618903728,  -0.1553545034191468 );
	directionalLight2.color.setHSV( 0, 0, 0.1 );						
	this.scene.addLight( directionalLight2 );
*/
	// Scene

	var loader = new THREE.SceneLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	function prairieLoaded( result ) {

		that.scene.addChild( result.scene );

	};	

	loader.load( "files/models/prairie/Prairie.js", function(){}, prairieLoaded, function(){});


}
