var DunesSoup = function ( camera, scene, shared ) {

	var that = this;

	shared.camPos = new THREE.Vector3( 0, 0, 0 );

	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };
	
	// setup the different parts of the soup

	// collision scene
	
	var collisionScene = new CollisionScene( camera, scene, 0.15, shared, 1000 );
	collisionScene.settings.emitterDivider = 5;
	collisionScene.settings.maxSpeedDivider = 0.1;
	//collisionScene.settings.capBottom = 50;
	collisionScene.settings.allowFlying = true;
	//collisionScene.settings.normalOffsetAmount = 50;

	var startPosition = new THREE.Vector3( shared.camPos.x, shared.camPos.y-1000, shared.camPos.z );

	// vector trail

	var vectors = new Vectors(50, 3, 10, startPosition);

	// ribbons
	
	var ribbonMaterials = [
	
		new THREE.MeshBasicMaterial( { color:0xd9f3fb, opacity: 0.25 } ),
		new THREE.MeshBasicMaterial( { color:0xe4f1f5, opacity: 0.25 } ),
		new THREE.MeshBasicMaterial( { color:0xffffff, opacity: 0.25 } ),
		new THREE.MeshBasicMaterial( { color:0xeeeeee, opacity: 0.25 } ),
		new THREE.MeshBasicMaterial( { color:0xdcf3fa, opacity: 0.25 } ),
		new THREE.MeshBasicMaterial( { color:0xd2f3fc, opacity: 0.25 } )

	];

	var ribbons = new Ribbons( 6, vectors.array, scene, ribbonMaterials );

	ribbons.settings.ribbonPulseMultiplier_1 = 20;
	ribbons.settings.ribbonPulseMultiplier_2 = 0.01;
	ribbons.settings.ribbonMin = 0.05;
	ribbons.settings.ribbonMax = 0.1;

	// particles
/*	var sprite0 = THREE.ImageUtils.loadTexture( "/files/textures/particle_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "/files/textures/particle_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "/files/textures/particle_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "/files/textures/particle_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "/files/textures/particle_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];

	var particles = new Particles(50, scene, 12, particleSprites, 80, 150);
	//particles.zeroAlphaStart = false;
	particles.settings.aliveDivider = 2.0;
*/

	// flying animals

	var flyingAnimals = new AnimalSwarm_dunes( 11, scene, vectors.array );
	flyingAnimals.settings.flying = true;
	flyingAnimals.settings.flyingDistance = 0;
	flyingAnimals.settings.divider = 1;
	flyingAnimals.settings.constantSpeed = 0.8;
	flyingAnimals.settings.respawn = false;
	flyingAnimals.settings.startPosition = startPosition;
	flyingAnimals.settings.xPositionMultiplier = 50;
	flyingAnimals.settings.zPositionMultiplier = 30;
	//flyingAnimals.settings.switchPosition = true;

	for ( var i=0; i<12; ++i ) {

		var third = i%3;
		if (third == 0) {

			flyingAnimals.array[i] = "b";

		}

	}

	loader.load( { model: "/files/models/soup/birds_A_life.js", callback: birdsALoadedProxy } );
	loader.load( { model: "/files/models/soup/birds_B_life.js", callback: birdsBLoadedProxy } );
	
	function birdsALoadedProxy( geometry ) {

		var animal,
			morphArray = [0,1,2,3];

		animal = flyingAnimals.addAnimal( geometry, null, 2.8, morphArray, 1.2 );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function birdsBLoadedProxy( geometry ) {
		
		var animal,
			morphArray = [1,0];
		
		animal = flyingAnimals.addAnimal( geometry, "b", 2.8, morphArray, 1.2 );
		preinitAnimal( animal, shared.renderer, scene );

	};

	this.update = function ( delta, otherCamera ) {

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			return;
		}

		// update to reflect _real_ camera position

		if( !otherCamera ) {
			
			shared.camPos.x = camera.matrixWorld.n14;
			shared.camPos.y = camera.matrixWorld.n24;
			shared.camPos.z = camera.matrixWorld.n34;
			
			collisionScene.settings.camera = camera;
			
		} else {
			
			shared.camPos.copy( otherCamera.matrixWorld.getPosition() );
			collisionScene.settings.camera = otherCamera;

		}

		// update the soup parts

		collisionScene.update( shared.camPos, delta );
		vectors.update( collisionScene.emitterFollow.position, collisionScene.currentNormal );
		ribbons.update( collisionScene.emitterFollow.position );
		//flyingAnimals.update();
		flyingAnimals.update(delta, shared.camPos);
		//particles.update(delta, vectors.array[0].position);
		
	}


	this.destruct = function () {

	}

};
