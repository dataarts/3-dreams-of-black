var Part1World = function () {

	this.objects = [];

	// Ground

	var mesh = new THREE.Mesh( new Plane( 8000, 8000 ), new THREE.MeshBasicMaterial( { color: 0x2c2b30 } ) );
	mesh.rotation.x = - 90 * Math.PI / 180;
	this.objects.push( mesh );

	// Buildings

	var geometry = new Cube( 200, 100, 200 );
	var material = new THREE.MeshBasicMaterial( { color: 0x2c2b30 } );

	for ( var i = 0; i < 300; i ++ ) {

		mesh = new THREE.Mesh( geometry, material );

		mesh.position.x = Math.floor( Math.random() * 40 - 20 ) * 200;
		if ( mesh.position.x == 0 ) mesh.position.x += 200;
		mesh.position.z = Math.floor( Math.random() * 40 - 20 ) * 200;
		mesh.scale.y = Math.random() * Math.random() * 10;
		mesh.position.y = (mesh.scale.y * 100 ) / 2;

		mesh.autoUpdateMatrix = false;
		mesh.updateMatrix();

		this.objects.push( mesh );

	}

}
