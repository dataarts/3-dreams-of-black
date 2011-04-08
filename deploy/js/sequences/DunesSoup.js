var DunesSoup = function ( camera, scene, shared ) {

	var that = this;

	camPos = new THREE.Vector3( 0, 250, 0 );
	
	// setup the different parts of the soup

	// collision scene
	var collisionScene = new CollisionScene( camera, shared, 1500, 30, true );
	collisionScene.emitterDivider = 10;
	collisionScene.maxSpeedDivider = 0.01;
	/*loader.load( { model: "files/models/city/City_Shadow.js", callback: collisionLoadedProxy } );

	function collisionLoadedProxy( geometry ) {
		collisionScene.addLoaded( geometry, 0.1 );
	}*/

	// vector trail
	var vectors = new Vectors();

	// ribbons
	var ribbonMaterials = [
			new THREE.MeshBasicMaterial( { color:0xf89010 } ),
			new THREE.MeshBasicMaterial( { color:0x98f800 } ),
			new THREE.MeshBasicMaterial( { color:0x5189bb } ),
			new THREE.MeshBasicMaterial( { color:0xe850e8 } ),
			new THREE.MeshBasicMaterial( { color:0xf1f1f1 } ),
			new THREE.MeshBasicMaterial( { color:0x08a620 } )
	];
	var ribbons = new Ribbons(6, vectors.array, scene, ribbonMaterials);
	ribbons.ribbonPulseMultiplier_1 = 30;
	ribbons.ribbonPulseMultiplier_2 = 10;
	ribbons.ribbonMin = 6;
	ribbons.ribbonMax = 10;

	// particles
	var sprite0 = ImageUtils.loadTexture( "files/textures/particle_0.png" );
	var sprite1 = ImageUtils.loadTexture( "files/textures/particle_1.png" );
	var sprite2 = ImageUtils.loadTexture( "files/textures/particle_2.png" );
	var sprite3 = ImageUtils.loadTexture( "files/textures/particle_3.png" );
	var sprite4 = ImageUtils.loadTexture( "files/textures/particle_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];
	
	var particles = new Particles(50, scene, 12, particleSprites, 80, 150);
	//particles.zeroAlphaStart = false;
	particles.aliveDivider = 1.2;

	this.update = function ( delta ) {

		// update to reflect _real_ camera position
		camPos.x = camera.matrixWorld.n14;
		camPos.y = camera.matrixWorld.n24;
		camPos.z = camera.matrixWorld.n34;

		// update the soup parts	
		collisionScene.update(camPos, delta);
		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		ribbons.update(collisionScene.emitterFollow.position);
		particles.update(delta, vectors.array[0].position);
		
	}


	this.destruct = function () {

	}

}
