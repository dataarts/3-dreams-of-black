var Part1World = function () {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x000000, 0.0006 );
	this.scene.fog.color.setHSV( 0.6, 0.35, 1.0 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	scene.addLight( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.x = 1;
	directionalLight.position.y = 1;
	directionalLight.position.z = 1;
	directionalLight.position.normalize();
	scene.addLight( directionalLight );

	var pointLight = new THREE.PointLight( 0xffffff, 0.35 );
	scene.addLight( pointLight );

	// Mesh

	var loader = new THREE.Loader();
	loader.loadAscii( { model: 'files/models/city.js', texture_path: 'files/textures/', callback: function( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.10;

		that.scene.addObject( mesh );

	} } );
}
