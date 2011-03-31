var CityWorld = function ( shared ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x535758, 0.0006176 );
	this.scene.fog.color.setHSV( 0, 0, 0.34705882352941175 );

	// Lights
/*
	var pointLight = new THREE.PointLight( 0xbbbbff, 0.5 );
	pointLight.position.x = 1000;
	pointLight.position.y = 500;
	pointLight.position.z = - 1000;
	this.scene.addLight( pointLight );

	var pointLight = new THREE.PointLight( 0xffeeee, 0.2 );
	pointLight.position.set( -1000, -500, -1000 );
	this.scene.addLight( pointLight );
	
*/	

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( -0.733106965726893,  0.6320595441744891,  -0.2511073663209529 );
	this.scene.addLight( directionalLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
	directionalLight.position.set( 0.7,  -0.5,  0.25 );
	this.scene.addLight( directionalLight );

	// Mesh

	var loader = new THREE.JSONLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	loader.load( { model: 'files/models/city/street.js', callback: function( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;

		that.scene.addObject( mesh );
		
		preInitModel( geometry, shared.renderer, that.scene, mesh );

	} } );

}
