var DunesSoup = function ( camera, scene, shared ) {

	var that = this;

	camPos = new THREE.Vector3( 0, 150, 0 );
	
	// setup the different parts of the soup

	// collision scene
	var collisionScene = new CollisionScene( camera, scene, 0.15, shared, 5000 );
	collisionScene.settings.emitterDivider = 2;
	collisionScene.settings.maxSpeedDivider = 0.01;
	collisionScene.settings.capBottom = 50;
	collisionScene.settings.allowFlying = true;

	// vector trail
	var vectors = new Vectors();
	vectors.settings.divider = 3;

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
	ribbons.settings.ribbonPulseMultiplier_1 = 30;
	ribbons.settings.ribbonPulseMultiplier_2 = 10;
	ribbons.settings.ribbonMin = 6;
	ribbons.settings.ribbonMax = 10;

	// particles
/*	var sprite0 = THREE.ImageUtils.loadTexture( "files/textures/particle_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "files/textures/particle_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "files/textures/particle_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "files/textures/particle_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "files/textures/particle_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];

	var particles = new Particles(50, scene, 12, particleSprites, 80, 150);
	//particles.zeroAlphaStart = false;
	particles.settings.aliveDivider = 2.0;
*/
	this.update = function ( delta ) {

		// update to reflect _real_ camera position
		camPos.x = camera.matrixWorld.n14;
		camPos.y = camera.matrixWorld.n24;
		camPos.z = camera.matrixWorld.n34;

		// update the soup parts	
		collisionScene.update(camPos, delta);
		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		ribbons.update(collisionScene.emitterFollow.position);
		//particles.update(delta, vectors.array[0].position);
		
	}


	this.destruct = function () {

	}

}
