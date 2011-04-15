var PrairieSoup = function ( camera, scene, shared ) {

	var that = this;

	// init

	camPos = new THREE.Vector3( 0, 0, 0 );
	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	var pointLight = new THREE.PointLight( 0x999999, -2.25, 100 );
	pointLight.position.x = camPos.x;
	pointLight.position.y = camPos.y;
	pointLight.position.z = camPos.z;
	scene.addLight( pointLight, 1.0 );

	// setup the different parts of the soup

	var vectors;
	var ribbons;
	var trail;
	var runningAnimals;
	var flyingAnimals;
	var particles;

	// collision scene
	
	var collisionScene = new CollisionScene( camera, scene, 1.0, shared, 200 );
	collisionScene.settings.maxSpeedDivider = 8;
	collisionScene.settings.allowFlying = false;
	collisionScene.settings.emitterDivider = 5;
	collisionScene.settings.shootRayDown = false;
	collisionScene.settings.keepEmitterFollowDown = true;
	collisionScene.settings.normalOffsetAmount = 8;
	
	// vector trail

	vectors = new Vectors();
	vectors.settings.normaldivider = 10;
	vectors.settings.divider = 2;

	// ribbons

	var ribbonMaterials = [

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

	// particles
	var sprite0 = THREE.ImageUtils.loadTexture( "files/textures/dark_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "files/textures/dark_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "files/textures/dark_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "files/textures/dark_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "files/textures/dark_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];
	particles = new Particles(20, scene, 2, particleSprites, 15, 30);
	particles.settings.zeroAlphaStart = false;
	particles.settings.aliveDivider = 3;

	// running animals
	runningAnimals = new AnimalSwarm( 40, scene, vectors.array );
	runningAnimals.settings.xPositionMultiplier = 30;
	runningAnimals.settings.zPositionMultiplier = 15;
	//runningAnimals.settings.shootRayDown = true;
	runningAnimals.settings.constantSpeed = 2.0
	runningAnimals.settings.divider = 1;

	// preoccupy slots for specific animals - hack...
	runningAnimals.array[0] = "gator";
	runningAnimals.array[1] = "wolf";
	runningAnimals.array[4] = "wolf";
	runningAnimals.array[10] = "gator";
	runningAnimals.array[14] = "wolf";
	runningAnimals.array[20] = "gator";
	runningAnimals.array[2] = "goat";
	runningAnimals.array[18] = "goat";
	runningAnimals.array[25] = "goat";
	runningAnimals.array[21] = "arm";
	runningAnimals.array[2] = "spider";
	runningAnimals.array[5] = "spider";
	runningAnimals.array[32] = "spider";


	loader.load( { model: "files/models/soup/bison.js", callback: bisonLoadedProxy } );
	loader.load( { model: "files/models/soup/gator.js", callback: gatorLoadedProxy } );
	loader.load( { model: "files/models/soup/wolf.js", callback: wolfLoadedProxy } );
	loader.load( { model: "files/models/soup/goat.js", callback: goatLoadedProxy } );
	loader.load( { model: "files/models/soup/arm.js", callback: armLoadedProxy } );
	loader.load( { model: "files/models/soup/blackWidow.js", callback: spiderLoadedProxy } );

	var colorArray = [ new THREE.Color( 0x101010 ),
					   new THREE.Color( 0x111111 ),
					   new THREE.Color( 0x010101 )
					 ];

	function bisonLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, null, 0.4, null, 2, colorArray );
	}

	function gatorLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "gator", 0.3, null, 2, colorArray );
	}

	function wolfLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "wolf", 0.5, null, 2, colorArray );
	}

	function goatLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "goat", 0.5, null, 2, colorArray );
	}

	function armLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "arm", 1.0, null, 2, colorArray );
	}
	function spiderLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "spider", 2.8, null, 2, colorArray );
	}

	// flying animals

	flyingAnimals = new AnimalSwarm( 10, scene, vectors.array );
	flyingAnimals.settings.flying = true;
	flyingAnimals.settings.xPositionMultiplier = 30;
	flyingAnimals.settings.zPositionMultiplier = 20;
	flyingAnimals.settings.constantSpeed = 2.0;
	flyingAnimals.settings.divider = 4;
	flyingAnimals.settings.flyingDistance = 8;

	loader.load( { model: "files/models/soup/vulture_raven.js", callback: birdsALoadedProxy } );
	
	function birdsALoadedProxy( geometry ) {
		var morphArray = [1,1,0,0,1,0,0,1,0,0];
		flyingAnimals.addAnimal( geometry, null, 0.8, morphArray, 0.4, colorArray );
	}
	
	// trail - of grass/trees/etc
	/*var trailMaterials = [new THREE.MeshLambertMaterial( { color: 0x000000, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x170202, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x030303, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x080808, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x171302, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x030303, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x080808, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x030303, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x080808, shading: THREE.FlatShading } )
	];

	trail = new Trail(50, scene);
	trail.settings.spread = 150;
	trail.settings.aliveDivider = 100;
	trail.settings.tweenTime = 4000;
	trail.settings.scale = 0.4;

	loader.load( { model: "files/models/soup/grass.js", callback: grassLoadedProxy } );

	function grassLoadedProxy( geometry ) {
		trail.addInstance( geometry, null, false, trailMaterials );
	}*/


	this.update = function ( delta ) {

		// update to reflect _real_ camera position

		camPos.x = camera.matrixWorld.n14;
		camPos.y = camera.matrixWorld.n24;
		camPos.z = camera.matrixWorld.n34;

		// temp reset

		if ( camPos.x > 1130 ) {

			reset();

		}

		// update the soup parts	

		collisionScene.update( camPos, delta );
		vectors.update( collisionScene.emitterFollow.position, collisionScene.currentNormal );
		ribbons.update( collisionScene.emitterFollow.position );
		particles.update( delta, vectors.array[5].position );
		runningAnimals.update();
		flyingAnimals.update();
		//trail.update(vectors.array[5].position, collisionScene.currentNormal, camPos, delta);
		
		TWEEN.update();


		// pointlight

		pointLight.position.x = vectors.array[8].position.x;
		pointLight.position.y = vectors.array[8].position.y + 20;
		pointLight.position.z = vectors.array[8].position.z;

		shared.x = vectors.array[30].position.x;
		shared.z = vectors.array[30].position.z;

	}



	function reset () {

		camPos = new THREE.Vector3( 0, 0, 0 );

		collisionScene.reset( camPos.x, camPos.y, camPos.z );
		vectors.reset( camPos.x, camPos.y, camPos.z );
		runningAnimals.reset( camPos.x, camPos.y, camPos.z );
		flyingAnimals.reset( camPos.x, camPos.y, camPos.z );
		particles.reset( camPos.x, camPos.y, camPos.z );

	}

	this.destruct = function () {

	}

}
