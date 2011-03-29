var PrairieWorld = function ( shared ) {

	var that = this;
	var mesh;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.000035 );
	this.scene.fog.color.setHSV( 0.5, 0.15, 1.0 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	this.scene.addLight( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.y = 1;
	directionalLight.position.z = 1;
	directionalLight.position.normalize();
	this.scene.addLight( directionalLight );

	// Mesh

	var loader = new THREE.JSONLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	loader.load( { model: 'files/models/prairie/prairie.js', callback: function( geometry ) {

		mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 10.0;
		mesh.position.set(95290, -360, -271680);

		mesh.rotation.y -= 0.012

		that.scene.addObject( mesh );

		gui.add( mesh.position, 'x', 91500, 108000, 10 ).name( 'x' );
		gui.add( mesh.position, 'y', -500, 0, 10 ).name( 'y' );
		gui.add( mesh.position, 'z', -278000, -270000, 10 ).name( 'z' );

		gui.add( mesh.rotation, 'y', -0.1, 0.1 ).name( 'rot y' );

	} } );

}
