var PrairieSoup = function ( camera, scene, shared ) {

	var that = this;

	// init

	shared.camPos = new THREE.Vector3( 302.182, -9.045, -105.662 );

	var lastCamPos = new THREE.Vector3();
	var camPosVector = new THREE.Vector3();
	var camVector = new THREE.Vector3();

	var loader = new THREE.JSONLoaderAjax();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	// setup the different parts of the soup
	var spawnAnimal = 0;
	var spawnBird = 0;

	var oldEmitterPos = [];

	// collision scene
	var collisionScene = new CollisionScene( camera, scene, 1.0, shared, 1100 );

	collisionScene.settings.maxSpeedDivider = 1;
	collisionScene.settings.allowFlying = false;
	collisionScene.settings.emitterDivider = 1;
	collisionScene.settings.shootRayDown = false;
	collisionScene.settings.keepEmitterFollowDown = true;
	collisionScene.settings.normalOffsetAmount = 7;
	collisionScene.settings.minDistance = 0;

	collisionScene.emitter.position.set( shared.camPos.x + 40, shared.camPos.y, shared.camPos.z + 20 );
	collisionScene.emitterFollow.position.set( shared.camPos.x + 40, shared.camPos.y, shared.camPos.z + 20 );

	var emitterDistance = collisionScene.distance;

	// vector trail
	var startPosition = new THREE.Vector3( shared.camPos.x - 10, shared.camPos.y, shared.camPos.z + 30 );
	var vectors = new Vectors( 30, 10, 10, startPosition );
	//vectors.absoluteTrail = true;


	// particles

	var sprite0 = THREE.ImageUtils.loadTexture( "/files/textures/dark_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "/files/textures/dark_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "/files/textures/dark_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "/files/textures/dark_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "/files/textures/dark_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];
	var particles = new Particles(20, scene, 1.5, particleSprites, 70, 60);
	particles.settings.zeroAlphaStart = false;
	particles.settings.aliveDivider = 2;

	// running animals

	var runningAnimals = new AnimalSwarm( 40, scene, vectors.array );
	runningAnimals.settings.xPositionMultiplier = 22;
	runningAnimals.settings.zPositionMultiplier = 18;
	runningAnimals.settings.shootRayDown = true;
	//runningAnimals.settings.constantSpeed = 1.5
	runningAnimals.settings.adaptiveSpeed = true;
	runningAnimals.settings.divider = 1;
	runningAnimals.settings.startPosition = startPosition;

	// preoccupy slots for specific animals - hack...

	/*runningAnimals.array[0] = "taruffalo";
	runningAnimals.array[1] = "taruffalo";
	runningAnimals.array[2] = "taruffalo";
	runningAnimals.array[3] = "taruffalo";
	runningAnimals.array[4] = "taruffalo";
	runningAnimals.array[5] = "taruffalo";
	runningAnimals.array[6] = "taruffalo";*/
	runningAnimals.array[7] = "gator";
	runningAnimals.array[8] = "gator";
	runningAnimals.array[9] = "animal";
	//runningAnimals.array[10] = "shadow5";
	runningAnimals.array[11] = "goat";
	//runningAnimals.array[12] = "shadow2";
	runningAnimals.array[13] = "gator";
	runningAnimals.array[14] = "arm";
	runningAnimals.array[15] = "gator";

	runningAnimals.array[16] = "goat";
	//runningAnimals.array[17] = "shadow2";
	runningAnimals.array[18] = "goat";

	runningAnimals.array[19] = "animal";
	runningAnimals.array[20] = "animal";
	runningAnimals.array[21] = "animal";
	runningAnimals.array[22] = "animal";
	runningAnimals.array[23] = "animal";
	runningAnimals.array[24] = "animal";
	runningAnimals.array[25] = "animal";
	runningAnimals.array[26] = "animal";
	runningAnimals.array[27] = "animal";
	runningAnimals.array[28] = "animal";
	runningAnimals.array[29] = "animal";

	runningAnimals.array[30] = "octo";
	runningAnimals.array[31] = "octo";
	runningAnimals.array[32] = "octo";
	runningAnimals.array[33] = "octo";

	runningAnimals.array[34] = "centipede";
	runningAnimals.array[35] = "goat";
	runningAnimals.array[36] = "octo";
	/*runningAnimals.array[37] = "drown";
	runningAnimals.array[38] = "drown";
	runningAnimals.array[39] = "drown";*/



	loader.load( { model: "/files/models/soup/taruffalo_black.js", callback: taruffaloLoadedProxy } );
	loader.load( { model: "/files/models/soup/animals_A_black.js", callback: animalsLoadedProxy } );
	loader.load( { model: "/files/models/soup/gator_black.js", callback: gatorLoadedProxy } );
	loader.load( { model: "/files/models/soup/goat_black.js", callback: goatLoadedProxy } );
	//loader.load( { model: "/files/models/soup/shdw2emergeA.js", callback: shadow2LoadedProxy } );
	//loader.load( { model: "/files/models/soup/shdw5walk.js", callback: shadow5LoadedProxy } );
	//loader.load( { model: "/files/models/soup/hand1.js", callback: hand1LoadedProxy } );
	//loader.load( { model: "/files/models/soup/hand2.js", callback: hand2LoadedProxy } );
	loader.load( { model: "/files/models/soup/arm_black.js", callback: armLoadedProxy } );
	loader.load( { model: "/files/models/soup/octo_black.js", callback: octoLoadedProxy } );
	loader.load( { model: "/files/models/soup/sickle.js", callback: sickleLoadedProxy } );
	loader.load( { model: "/files/models/soup/centipede.js", callback: centipedeLoadedProxy } );
	//loader.load( { model: "/files/models/soup/drownArmC.js", callback: drownLoadedProxy } );

	function animalsLoadedProxy( geometry ) {

		var animal,
			morphArray = [3,1,2,0,1,0,2,0,2,3,0];
		var speedArray = [11.12, 9.73, 6.7, 3.06];

		animal = runningAnimals.addAnimal( geometry, "animal", 0.35, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function taruffaloLoadedProxy( geometry ) {

		var animal,
			morphArray = [0,1,0,1];
		var speedArray = [9.2, 9.2];
		animal = runningAnimals.addAnimal( geometry, null, 0.25, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function gatorLoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "gator", 0.35, null, [4.5] );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function goatLoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "goat", 0.45, null, [5.2] );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function shadow2LoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "shadow2", 1.0, null, [2.5] );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function shadow5LoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "shadow5", 1.0, null, [2.5] );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function hand1LoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "hand1", 1.0, null, [2.5] );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function hand2LoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "hand2", 1.0, null, [2.5] );
		preinitAnimal( animal, shared.renderer, scene );

	};


	function armLoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "arm", 3.0, null, [1.0] );
		preinitAnimal( animal, shared.renderer, scene );

		runningAnimals.array[14].generalSpecialCase = true;

	};

	function octoLoadedProxy( geometry ) {

		var animal,
			morphArray = [0,0,1,2];
		var speedArray = [1.629, 3, 1.7];

		animal = runningAnimals.addAnimal( geometry, "octo", 0.25, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function centipedeLoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "centipede", 0.5, null, [1] );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function sickleLoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "sickle", 1.5, null, [0.5] );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function drownLoadedProxy( geometry ) {

		var animal;

		animal = runningAnimals.addAnimal( geometry, "drown", 0.55, null, [2] );
		preinitAnimal( animal, shared.renderer, scene );

	};


	// flying animals

	var flyingAnimals = new AnimalSwarm( 10, scene, vectors.array );
	flyingAnimals.settings.flying = true;
	flyingAnimals.settings.xPositionMultiplier = 24;
	flyingAnimals.settings.zPositionMultiplier = 12;
	flyingAnimals.settings.constantSpeed = 2.0;
	flyingAnimals.settings.divider = 4;
	flyingAnimals.settings.flyingDistance = -15;

	loader.load( { model: "/files/models/soup/birds_A_black.js", callback: birdsALoadedProxy } );

	function birdsALoadedProxy( geometry ) {

		var animal,
			morphArray = [0,0,0,0,1,0,0,0,0,1];
		var speedArray = [12, 14];

		animal = flyingAnimals.addAnimal( geometry, null, 0.4, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	};

	// trail - blobs...
	var trail = new Trail( 80, scene );

	trail.settings.spread = 10;
	trail.settings.aliveDivider = 40;
	trail.settings.tweenTime = 800;
	trail.settings.scale = 0.3;
	trail.settings.offsetAmount = 10;
	trail.settings.yscale = 0.15;

	loader.load( { model: "/files/models/soup/darkblob01.js", callback: blob01LoadedProxy } );


	function blob01LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, null, false, false );
		preInitModel( geometry, renderer, scene, object );

	}


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

			shared.camPos.copy( otherCamera.matrixWorld.getPosition());
			collisionScene.settings.camera = otherCamera;
		}


		camPosVector.copy(shared.camPos);
		camVector.copy(camPosVector.subSelf(lastCamPos).normalize());
		lastCamPos.copy(shared.camPos);

		// temp reset

		if ( shared.camPos.x > 1090 ) {

			reset();

		}

		spawnAnimal += delta;
		spawnBird += delta;

		// update the soup parts

		collisionScene.update( shared.camPos, delta );
		vectors.update( collisionScene.emitterFollow.position, collisionScene.currentNormal );
		particles.update( delta, vectors.array[0].position );
		runningAnimals.update( delta, shared.camPos );
		flyingAnimals.update( delta, shared.camPos );

		trail.update( collisionScene.emitterFollow.position, collisionScene.emitterNormal, shared.camPos, delta );

		// spawn animal test
		if ( spawnAnimal >= 100 ) {

			runningAnimals.create(collisionScene.emitterFollow.position, collisionScene.currentNormal, camVector);
			spawnAnimal = 0;

		}

		if ( spawnBird >= 500 ) {

			flyingAnimals.create( collisionScene.emitterFollow.position, collisionScene.currentNormal, camVector );

			spawnBird = 0;

		}

		TWEEN.update();

		var pos = new THREE.Vector3(collisionScene.emitter.position.x, collisionScene.emitter.position.y, collisionScene.emitter.position.z);
		oldEmitterPos.unshift(pos);

		if (oldEmitterPos.length > 10) {
			var pos = oldEmitterPos[10];

			ROME.TrailShaderUtils.updateLava( delta * 0.0001, pos.x, -pos.z );
			ROME.TrailShaderUtils.setMarkAtWorldPosition( pos.x, -pos.z );

			//ROME.TrailShader.uniforms.lavaHeadPosition.value.set( pos.x, 0, -pos.z );
		}

		TriggerUtils.effectors[ 0 ] = vectors.array[1].position.x;
		TriggerUtils.effectors[ 1 ] = vectors.array[1].position.y;
		TriggerUtils.effectors[ 2 ] = vectors.array[1].position.z;

		shared.prairieSoupHead.copy( collisionScene.emitter.position );

	};



	function reset () {

		shared.camPos.set( 302.182, -9.045, -105.662 );

		collisionScene.reset( shared.camPos.x, shared.camPos.y, shared.camPos.z );
		vectors.reset( shared.camPos.x, shared.camPos.y, shared.camPos.z );
		runningAnimals.reset( shared.camPos.x, shared.camPos.y, shared.camPos.z );
		flyingAnimals.reset( shared.camPos.x, shared.camPos.y, shared.camPos.z );
		particles.reset( shared.camPos.x, shared.camPos.y, shared.camPos.z );

	};

	this.destruct = function () {

	};

};