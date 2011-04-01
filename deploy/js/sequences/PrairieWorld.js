var PrairieWorld = function ( shared ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0 );
	this.scene.fog.color.setHSV( 0.6, 0.0, 1.0 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	ambient.color.setHSV( 0, 0, 0.235 );
	this.scene.addLight( ambient );

	var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );	
	directionalLight1.position.set( 0.30068100380721313,  0.23859030453344973,  0.9233989389923093 );
	directionalLight1.color.setHSV( 0, 0, 0.9588 );
	this.scene.addLight( directionalLight1 );

	var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );	
	directionalLight2.position.set( -0.018526804880986788,  0.2742936950291326,  -0.9614674858611533 );
	directionalLight2.color.setHSV( 0, 0, 0.6117 );
	this.scene.addLight( directionalLight2 );

	// Mesh

	var loader = new THREE.JSONLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	function addPrairiePart( geo ) {
		
		var mesh = new THREE.Mesh( geo, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 10.0;
		mesh.position.set( 95290, -360, -271680 );

		that.scene.addObject( mesh );

		preInitModel( geo, shared.renderer, that.scene, mesh );
		
	};
	
	loader.load( { model: 'files/models/prairie/Prairie_Env.js', callback: addPrairiePart } );
	loader.load( { model: 'files/models/prairie/Prairie_Backdrop.js', callback: addPrairiePart } );
	loader.load( { model: 'files/models/prairie/Prairie_Skyflare.js', callback: addPrairiePart } );
	
}
