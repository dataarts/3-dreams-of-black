var Part3World = function () {

	this.objects = [];

	// Dunes

	var geometry = new Plane( 2000, 2000, 100, 100 );

	for ( var x = 0; x < 100; x ++ ) {

		for ( var y = 0; y < 102; y ++ ) {

			geometry.vertices[ x + y * 100 ].position.z = Math.sin( x / 5 ) * 20 + Math.cos( y / 5 ) * 20;

		}

	}

	var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x93735d } ) );
	mesh.rotation.x = - 90 * Math.PI / 180;
	this.objects.push( mesh );

	// Objects

	var geometry = new Cube( 50, 100, 50 );
	var material = new THREE.MeshBasicMaterial( { color: 0x261209 } );

	for ( var i = 0; i < 100; i ++ ) {

		mesh = new THREE.Mesh( geometry, material );

		mesh.position.x = Math.random() * 4000 - 2000;
		mesh.position.z = Math.random() * 4000 - 2000;
		mesh.scale.y = Math.random() * 5;

		mesh.autoUpdateMatrix = false;
		mesh.updateMatrix();

		this.objects.push( mesh );

	}

}
