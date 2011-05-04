var PrairieSoup = function ( camera, scene, shared ) {

	var that = this;

	// init

	shared.camPos = new THREE.Vector3( 302.182, -9.045, -105.662 );

	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

/*	var pointLight = new THREE.PointLight( 0x999999, -1.25, 400 );
	pointLight.position.x = shared.camPos.x;
	pointLight.position.y = shared.camPos.y;
	pointLight.position.z = shared.camPos.z;
	scene.addLight( pointLight, 1.0 );
*/
	// setup the different parts of the soup

	var spawnAnimal = 0;
	var spawnBird = 0;

	var vectors;
	var ribbons;
	var trail;
	var runningAnimals;
	var flyingAnimals;
	var particles;

	// collision scene
	
	var collisionScene = new CollisionScene( camera, scene, 1.0, shared, 1100 );

	collisionScene.settings.maxSpeedDivider = 1;
	collisionScene.settings.allowFlying = false;
	collisionScene.settings.emitterDivider = 2;
	collisionScene.settings.shootRayDown = false;
	collisionScene.settings.keepEmitterFollowDown = true;
	collisionScene.settings.normalOffsetAmount = 7;
	collisionScene.settings.minDistance = 0;

	collisionScene.emitter.position.set( shared.camPos.x + 40, shared.camPos.y, shared.camPos.z + 20 );
	collisionScene.emitterFollow.position.set( shared.camPos.x + 40, shared.camPos.y, shared.camPos.z + 20 );

	var emitterDistance = collisionScene.distance;

	// vector trail
	var startPosition = new THREE.Vector3( shared.camPos.x - 10, shared.camPos.y, shared.camPos.z + 30 );
	vectors = new Vectors( 30, 1, 1, startPosition );
	vectors.absoluteTrail = true;
	// ribbons

	/*var ribbonMaterials = [

		new THREE.MeshLambertMaterial( { color:0x000000 } ),
		new THREE.MeshLambertMaterial( { color:0x555555 } ),
		new THREE.MeshLambertMaterial( { color:0x000000 } ),
		new THREE.MeshLambertMaterial( { color:0x555555 } ),
		new THREE.MeshLambertMaterial( { color:0x000000 } ),
		new THREE.MeshLambertMaterial( { color:0x555555 } )

	];

	ribbons = new Ribbons( 6, vectors.array, scene, ribbonMaterials );
	ribbons.settings.ribbonPulseMultiplier_1 = 4;
	ribbons.settings.ribbonPulseMultiplier_2 = 4;
	ribbons.settings.ribbonMin = 0.2;
	ribbons.settings.ribbonMax = 0.2;
	*/

	// particles

	var sprite0 = THREE.ImageUtils.loadTexture( "files/textures/dark_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "files/textures/dark_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "files/textures/dark_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "files/textures/dark_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "files/textures/dark_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];
	particles = new Particles(20, scene, 1.5, particleSprites, 25, 40);
	particles.settings.zeroAlphaStart = false;
	particles.settings.aliveDivider = 2;

	// running animals

	runningAnimals = new AnimalSwarm( 40, scene, vectors.array );
	runningAnimals.settings.xPositionMultiplier = 22;
	runningAnimals.settings.zPositionMultiplier = 18;
	runningAnimals.settings.shootRayDown = true;
	//runningAnimals.settings.constantSpeed = 1.5
	runningAnimals.settings.adaptiveSpeed = true;
	runningAnimals.settings.divider = 1;
	runningAnimals.settings.startPosition = startPosition;

	// preoccupy slots for specific animals - hack...

	runningAnimals.array[0] = "gator";
	runningAnimals.array[10] = "gator";
	runningAnimals.array[5] = "goat";
	runningAnimals.array[18] = "goat";
	runningAnimals.array[25] = "goat";
	runningAnimals.array[2] = "octo";
	runningAnimals.array[7] = "octo";
	runningAnimals.array[32] = "octo";
	runningAnimals.array[38] = "octo";

	runningAnimals.array[3] = "animal";
	runningAnimals.array[4] = "animal";
	runningAnimals.array[6] = "animal";
	runningAnimals.array[8] = "animal";
	runningAnimals.array[10] = "animal";
	runningAnimals.array[12] = "animal";
	runningAnimals.array[15] = "animal";
	runningAnimals.array[16] = "animal";
	runningAnimals.array[19] = "animal";
	runningAnimals.array[20] = "animal";
	runningAnimals.array[21] = "animal";
	runningAnimals.array[23] = "animal";
	runningAnimals.array[24] = "animal";
	runningAnimals.array[25] = "animal";
	runningAnimals.array[28] = "animal";
	runningAnimals.array[29] = "animal";
	runningAnimals.array[31] = "animal";
	runningAnimals.array[33] = "animal";
	runningAnimals.array[22] = "shadow";
	runningAnimals.array[1] = "shadow";
	runningAnimals.array[17] = "arm";
	runningAnimals.array[30] = "arm";


	loader.load( { model: "files/models/soup/taruffalo_black.js", callback: taruffaloLoadedProxy } );
	loader.load( { model: "files/models/soup/animals_A_black.js", callback: animalsLoadedProxy } );
	loader.load( { model: "files/models/soup/gator_black.js", callback: gatorLoadedProxy } );
	loader.load( { model: "files/models/soup/goat_black.js", callback: goatLoadedProxy } );
	loader.load( { model: "files/models/soup/shdw2.js", callback: shadowLoadedProxy } );
	loader.load( { model: "files/models/soup/arm_black.js", callback: armLoadedProxy } );
	loader.load( { model: "files/models/soup/octo_black.js", callback: octoLoadedProxy } );

	function animalsLoadedProxy( geometry ) {

		var animal, 
			morphArray = [0,0,1,2,1,2,0,2,3];
		var speedArray = [13.12, 9.73, 6.7, 3.06];
		
		animal = runningAnimals.addAnimal( geometry, "animal", 0.35, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function taruffaloLoadedProxy( geometry ) {
		
		var animal,
			morphArray = [0,1,0,1];
		var speedArray = [9.2, 14.2];
		animal = runningAnimals.addAnimal( geometry, null, 0.3, morphArray, speedArray );
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

	function shadowLoadedProxy( geometry ) {
		
		var animal;

		animal = runningAnimals.addAnimal( geometry, "shadow", 0.7, null, [3.5] );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function armLoadedProxy( geometry ) {
		
		var animal;

		animal = runningAnimals.addAnimal( geometry, "arm", 1.5, null, [2.5] );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function octoLoadedProxy( geometry ) {

		var animal,
			morphArray = [0,0,0,2];
		var speedArray = [1.629, 3, 1.7];

		animal = runningAnimals.addAnimal( geometry, "octo", 0.55, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	};


	// flying animals

	flyingAnimals = new AnimalSwarm( 10, scene, vectors.array );
	flyingAnimals.settings.flying = true;
	flyingAnimals.settings.xPositionMultiplier = 24;
	flyingAnimals.settings.zPositionMultiplier = 12;
	flyingAnimals.settings.constantSpeed = 2.0;
	flyingAnimals.settings.divider = 4;
	flyingAnimals.settings.flyingDistance = 0;

	loader.load( { model: "files/models/soup/birds_A_black.js", callback: birdsALoadedProxy } );
	
	function birdsALoadedProxy( geometry ) {
		
		var animal,
			morphArray = [1,1,0,0,1,0,0,1,0,0];
		var speedArray = [12, 14];

		animal = flyingAnimals.addAnimal( geometry, null, 0.4, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );
		
	};
	
	// trail - of grass/trees/etc
	var trailMaterials = [new THREE.MeshLambertMaterial( { color: 0x000000 } ),
					 new THREE.MeshLambertMaterial( { color: 0x170202 } ),
					 new THREE.MeshLambertMaterial( { color: 0x030303 } ),
					 new THREE.MeshLambertMaterial( { color: 0x080808 } ),
					 new THREE.MeshLambertMaterial( { color: 0x171302 } ),
					 new THREE.MeshLambertMaterial( { color: 0x030303 } ),
					 new THREE.MeshLambertMaterial( { color: 0x080808 } ),
					 new THREE.MeshLambertMaterial( { color: 0x030303 } ),
					 new THREE.MeshLambertMaterial( { color: 0x080808 } )
	];

	var trail = new Trail( 80, scene );

	// preoccupy for differnt grass
	for ( i=0; i<80; ++i ) {

		var type = i%2;
		trail.array[i] = "0"+(type+1);
		trail.array[i] = "04";

	}

	trail.settings.spread = 10;
	trail.settings.aliveDivider = 40;
	trail.settings.tweenTime = 400;
	trail.settings.scale = 5.0;
	trail.settings.offsetAmount = 10;

	/*loader.load( { model: "files/models/soup/darkBlob1.js", callback: blob01LoadedProxy } );
	loader.load( { model: "files/models/soup/darkBlob2.js", callback: blob02LoadedProxy } );
	loader.load( { model: "files/models/soup/darkBlob3.js", callback: blob03LoadedProxy } );*/
	loader.load( { model: "files/models/soup/darkBlob4.js", callback: blob04LoadedProxy } );

/*	function blob01LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "01", false, false );
		preInitModel( geometry, renderer, scene, object );

	}

	function blob02LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "02", false, false );
		preInitModel( geometry, renderer, scene, object );

	}

	function blob03LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "03", false, false );
		preInitModel( geometry, renderer, scene, object );

	}*/

	function blob04LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "04", false, false, trailMaterials );
		preInitModel( geometry, renderer, scene, object );

	}


	this.update = function ( delta ) {

		// update to reflect _real_ camera position

		shared.camPos.x = camera.matrixWorld.n14;
		shared.camPos.y = camera.matrixWorld.n24;
		shared.camPos.z = camera.matrixWorld.n34;

		// temp reset

		if ( shared.camPos.x > 1090 ) {

			reset();

		}

		spawnAnimal += delta;
		spawnBird += delta;

		// update the soup parts	

		collisionScene.update( shared.camPos, delta );
		vectors.update( collisionScene.emitterFollow.position, collisionScene.currentNormal );
		//ribbons.update( collisionScene.emitterFollow.position );
		particles.update( delta, vectors.array[0].position );
		//runningAnimals.update();
		//flyingAnimals.update();
		runningAnimals.update( delta, shared.camPos );
		flyingAnimals.update( delta, shared.camPos );

		trail.update( collisionScene.emitter.position, collisionScene.emitterNormal, shared.camPos, delta );

		// spawn animal test
		if ( spawnAnimal >= 100 ) {

			//runningAnimals.create(vectors.array[1].position, collisionScene.currentNormal);
			var rndx = (Math.random()*20)-10;
			var rndz = (Math.random()*20)-10;
			var pos1 = new THREE.Vector3();
			var pos2 = new THREE.Vector3();
			pos1.copy(collisionScene.emitterFollow.position);
			pos2.copy(collisionScene.emitter.position);
			pos1.x += rndx;
			pos2.x += rndx;
			pos1.z += rndz;
			pos2.z += rndz;
			runningAnimals.create(pos1, collisionScene.currentNormal, pos2);
			spawnAnimal = 0;

		}

		if ( spawnBird >= 500 ) {

			//flyingAnimals.create(vectors.array[1].position, collisionScene.currentNormal);
			flyingAnimals.create( collisionScene.emitterFollow.position, collisionScene.currentNormal, collisionScene.emitter.position );
			spawnBird = 0;

		}			

		TWEEN.update();




/*		var moveDistance = (collisionScene.distance-emitterDistance)/40;
		emitterDistance += moveDistance;
		var zoom = emitterDistance/15;
		zoom = Math.min(30, zoom);
		camera.fov = 60-zoom;
		camera.updateProjectionMatrix();
*/
		TriggerUtils.effectors[ 0 ] = vectors.array[5].position.x;
		TriggerUtils.effectors[ 1 ] = vectors.array[5].position.y;
		TriggerUtils.effectors[ 2 ] = vectors.array[5].position.z;
		
		//ROME.TrailShader.uniforms.lavaHeadPosition.value.set( vectors.array[15].position.x, 0, -vectors.array[15].position.z );
		ROME.TrailShader.uniforms.lavaHeadPosition.value.set( 0, 0, 0 );

		// pointlight

/*		pointLight.position.x = vectors.array[0].position.x;
		pointLight.position.y = vectors.array[0].position.y + 30;
		pointLight.position.z = vectors.array[0].position.z;
*/
		shared.lavatrailx = vectors.array[5].position.x;
		shared.lavatrailz = vectors.array[5].position.z;

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
