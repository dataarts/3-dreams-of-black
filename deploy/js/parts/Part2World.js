var Part2World = function () {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x083a5c1, 0.00005 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	this.scene.addLight( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.y = 1;
	directionalLight.position.z = 1;
	directionalLight.position.normalize();
	this.scene.addLight( directionalLight );

	// Mesh

	var loader = new THREE.Loader();
	loader.loadAscii( { model: "files/models/prairie.js", callback: function( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.10;

		that.scene.addObject( mesh );

	} } );

}
