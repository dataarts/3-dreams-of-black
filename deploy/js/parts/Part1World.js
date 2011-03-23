var Part1World = function ( events ) {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x535758, 0.0006 );

	// Lights

	var directionalLight = new THREE.PointLight( 0xbbbbff, 0.5 );
	directionalLight.position.x = 1000;
	directionalLight.position.y = 500;
	directionalLight.position.z = - 1000;
	this.scene.addLight( directionalLight );


	var directionalLight = new THREE.PointLight( 0xffeeee, 0.2 );
	directionalLight.position.x = - 1000;
	directionalLight.position.y = - 500;
	directionalLight.position.z = - 1000;
	this.scene.addLight( directionalLight );

	events.loadItemAdd.dispatch();

	// Mesh
	var loader = new THREE.JSONLoader();
	loader.load( { model: 'files/models/city/street.js', callback: function( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;

		that.scene.addObject( mesh );

		events.loadItemComplete.dispatch();

	} } );

}
