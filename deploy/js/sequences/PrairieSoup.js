var PrairieSoup = function ( camera, scene, shared ) {

	var that = this;

	// init

	camPos = new THREE.Vector3( 0, 5, 0 );
	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	var pointLight = new THREE.PointLight( 0xeeffee, - 2.25, 120 );
	pointLight.position.x = camPos.x;
	pointLight.position.y = camPos.y;
	pointLight.position.z = camPos.z;
	scene.addLight( pointLight, 1.0 );

	// setup the different parts of the soup

	// collision scene
	var collisionScene = new CollisionScene( camera, scene, 1.0, shared, 400 );
	collisionScene.settings.maxSpeedDivider = 1;
	collisionScene.settings.allowFlying = true;

	// vector trail
	var vectors = new Vectors(20,3,5);

	// ribbons
	//var ribbons = new Ribbons(6, vectors.array, scene, collisionScene.emitterFollow.position);

	// particles
/*	var sprite0 = ImageUtils.loadTexture( "files/textures/dark_0.png" );
	var sprite1 = ImageUtils.loadTexture( "files/textures/dark_1.png" );
	var sprite2 = ImageUtils.loadTexture( "files/textures/dark_2.png" );
	var sprite3 = ImageUtils.loadTexture( "files/textures/dark_3.png" );
	var sprite4 = ImageUtils.loadTexture( "files/textures/dark_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];
	
	var particles = new Particles(40, scene, 4, particleSprites, 200, 80);
	particles.zeroAlphaStart = false;
*/
	// running animals
	var runningAnimals = new AnimalSwarm(35, scene, vectors.array);
	runningAnimals.settings.xPositionMultiplier = 30;
	runningAnimals.settings.zPositionMultiplier = 15;
	runningAnimals.settings.constantSpeed = 2.0
	//loader.load( { model: "files/models/soup/tarbuffalo.js", callback: animalLoadedProxy } );
	loader.load( { model: "files/models/soup/bison.js", callback: animalLoadedProxy } );

	function animalLoadedProxy( geometry ) {
		/*var morphArray = [];
		for (var i=0; i<35; ++i ) {
			morphArray[i] = 1;
		}*/
		runningAnimals.addAnimal( geometry, null, 0.3, null, 5 );
	}


	this.update = function ( delta ) {

		// update to reflect _real_ camera position
		camPos.x = camera.matrixWorld.n14;
		camPos.y = camera.matrixWorld.n24;
		camPos.z = camera.matrixWorld.n34;

		// temp reset
		/*if (camPos.x > 13930) {
			reset();
		}*/

		// update the soup parts	
		collisionScene.update(camPos, delta);
		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		//ribbons.update(collisionScene.emitterFollow.position);
		//particles.update(delta, vectors.array[0].position);
		runningAnimals.update();

		// pointlight
		pointLight.position.x = vectors.array[3].position.x;
		pointLight.position.y = vectors.array[3].position.y + 50;
		pointLight.position.z = vectors.array[3].position.z;


	}



	/*function reset () {
		camPos = new THREE.Vector3( 3223, 930, -2510 );

		collisionScene.reset(camPos.x,camPos.y,camPos.z);
		vectors.reset(camPos.x,camPos.y,camPos.z);
		runningAnimals.reset(camPos.x,camPos.y,camPos.z);

	}*/

	this.destruct = function () {

	}

}
