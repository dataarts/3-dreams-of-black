var DunesSoup = function ( camera, scene, shared ) {

	var that = this;

	camPos = new THREE.Vector3( 0, 150, 0 );
	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };
	
	// setup the different parts of the soup

	// collision scene
	var collisionScene = new CollisionScene( camera, scene, 0.15, shared, 3000 );
	collisionScene.settings.emitterDivider = 5;
	collisionScene.settings.maxSpeedDivider = 2;
	//collisionScene.settings.capBottom = 50;
	collisionScene.settings.allowFlying = true;
	collisionScene.settings.normalOffsetAmount = 50;

	// vector trail
	var vectors = new Vectors();
	vectors.settings.divider = 4;

	// ribbons
	var ribbonMaterials = [
			new THREE.MeshBasicMaterial( { color:0xd9f3fb, opacity: 0.25 } ),
			new THREE.MeshBasicMaterial( { color:0xe4f1f5, opacity: 0.25 } ),
			new THREE.MeshBasicMaterial( { color:0xffffff, opacity: 0.25 } ),
			new THREE.MeshBasicMaterial( { color:0xeeeeee, opacity: 0.25 } ),
			new THREE.MeshBasicMaterial( { color:0xdcf3fa, opacity: 0.25 } ),
			new THREE.MeshBasicMaterial( { color:0xd2f3fc, opacity: 0.25 } )
	];
	var ribbons = new Ribbons(6, vectors.array, scene, ribbonMaterials);
	ribbons.settings.ribbonPulseMultiplier_1 = 20;
	ribbons.settings.ribbonPulseMultiplier_2 = 0.01;
	ribbons.settings.ribbonMin = 0.3;
	ribbons.settings.ribbonMax = 0.4;

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

	// flying animals
	var flyingAnimals = new AnimalSwarm(20, scene, vectors.array);
	flyingAnimals.settings.flying = true;
	flyingAnimals.settings.flyingDistance = 10;
	flyingAnimals.settings.divider = 10;
	flyingAnimals.settings.constantSpeed = 0.8;
	for (var i=0; i<20; ++i ) {
		var odd = i%2;
		if (odd == 0) {
			flyingAnimals.array[i] = "b";
		}
	}

	loader.load( { model: "files/models/soup/birds_A_life.js", callback: birdsALoadedProxy } );
	loader.load( { model: "files/models/soup/birds_B_life.js", callback: birdsBLoadedProxy } );
	
	function birdsALoadedProxy( geometry ) {
		var morphArray = [1,1,0,0,1,0,0,1,0,0];
		flyingAnimals.addAnimal( geometry, null, 1.8, morphArray, 0.8 );
	}

	function birdsBLoadedProxy( geometry ) {
		var morphArray = [1,1,0,0,1,0,0,1,0,0];
		flyingAnimals.addAnimal( geometry, "b", 1.8, morphArray, 0.8 );
	}

	this.update = function ( delta ) {

		// update to reflect _real_ camera position
		camPos.x = camera.matrixWorld.n14;
		camPos.y = camera.matrixWorld.n24;
		camPos.z = camera.matrixWorld.n34;

		// update the soup parts
		collisionScene.update(camPos, delta);
		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		ribbons.update(collisionScene.emitterFollow.position);
		flyingAnimals.update();
		//particles.update(delta, vectors.array[0].position);
		
	}


	this.destruct = function () {

	}

}
