var Part2World = function () {

	this.objects = [];

	// Ground

	var mesh = new THREE.Mesh( new Plane( 2000, 4000, 50, 100 ), new THREE.MeshBasicMaterial( { color: 0x93735d, wireframe: true } ) );
	mesh.rotation.x = - 90 * Math.PI / 180;
	this.objects.push( mesh );

	// Train

	var train = new THREE.Mesh( new THREE.Geometry(), new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
	train.position.y = 25;

	var carriage = new THREE.Mesh( new Cube( 50, 50, 200 ) );

	for ( var i = 0; i < 10; i ++ ) {

		carriage.position.z = - i * 250;

		GeometryUtils.merge( train.geometry, carriage );
	}

	train.geometry.computeBoundingSphere();

	this.objects.push( train );

	// Buffalos

	var buffalos = new THREE.Mesh( new THREE.Geometry(), new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
	buffalos.position.y = 10;

	var buffalo = new THREE.Mesh( new Cube( 20, 20, 50 ) );

	for ( var i = 0; i < 100; i ++ ) {

		buffalo.position.x = Math.floor( Math.random() * 100 - 50 ) * 10;
		buffalo.position.z = ( Math.random() * 20 - 10 ) * 50;

		GeometryUtils.merge( buffalos.geometry, buffalo );
	}

	buffalos.geometry.computeBoundingSphere();

	this.objects.push( buffalos );

	this.update = function ( i ) {

		/*
		train.position.z = camera.position.z;
		buffalos.position.z = - i * 2500 + 1250;
		*/

	}

}
