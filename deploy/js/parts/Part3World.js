var Part3World = function () {

	var that = this;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.000025 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
	this.scene.addLight( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.y = 1;
	directionalLight.position.z = 1;
	directionalLight.position.normalize();
	this.scene.addLight( directionalLight );

	// Ground

	var loader = new THREE.Loader();
	loader.loadAscii( { model: 'files/models/dune.js', callback: function( geometry ) {

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.10;

		that.scene.addObject( mesh );

	} } );

	// Clouds

	var loader = new THREE.Loader();
	loader.loadAscii( { model: 'files/models/cloud.js', callback: function( geometry ) {

		var material = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.25 } );

		for ( var i = 0; i < 100; i ++ ) {

			var mesh = new THREE.Mesh( geometry, material );

			mesh.position.x = Math.random() * 60000 - 30000;
			mesh.position.y = Math.random() * 10000 + 5000;
			mesh.position.z	 = Math.random() * 60000 - 30000;

			mesh.rotation.y = Math.random() * 180 * Math.PI / 180;

			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 5 + 1;

			that.scene.addObject( mesh );

		}

	} } );

}
