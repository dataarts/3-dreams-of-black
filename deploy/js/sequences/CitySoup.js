var CitySoup = function ( camera, scene, shared ) {

	var that = this;

	// init
	camPos = new THREE.Vector3( 0, 0, 0 );
	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	var pointLight = new THREE.PointLight( 0xeeffee, 4, 100 );
	pointLight.position.x = camPos.x;
	pointLight.position.y = camPos.y;
	pointLight.position.z = camPos.z;
	scene.addLight( pointLight, 1.0 );

	shared.targetStart = new THREE.Vector3();
	shared.targetEnd = new THREE.Vector3();

	// refactoring

	// setup the different parts of the soup

	// collision scene
	var collisionScene = new CollisionScene( camera, scene, 0.1, shared, 5000 );
	collisionScene.settings.maxSpeedDivider = 4;
	collisionScene.settings.capBottom = 0;
	collisionScene.settings.shootRayDown = true;
	collisionScene.settings.allowFlying = false;
	collisionScene.settings.emitterDivider = 3;

	// vector trail
	var vectors = new Vectors();
	vectors.settings.normaldivider = 15;

	// ribbons
	var ribbonMaterials = [
			new THREE.MeshLambertMaterial( { color:0xf89010 } ),
			new THREE.MeshLambertMaterial( { color:0x98f800 } ),
			new THREE.MeshLambertMaterial( { color:0x5189bb } ),
			new THREE.MeshLambertMaterial( { color:0xe850e8 } ),
			new THREE.MeshLambertMaterial( { color:0xf1f1f1 } ),
			new THREE.MeshLambertMaterial( { color:0x08a620 } )
	];

	var ribbons = new Ribbons(6, vectors.array, scene, ribbonMaterials);

	// particles
	var sprite0 = THREE.ImageUtils.loadTexture( "files/textures/particle_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "files/textures/particle_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "files/textures/particle_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "files/textures/particle_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "files/textures/particle_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];

	var particles = new Particles(25, scene, 4, particleSprites);

	// running animals
	var runningAnimals = new AnimalSwarm(30, scene, vectors.array);

	// preoccupy slots for specific animals - hack...
	runningAnimals.array[0] = "elk";
	runningAnimals.array[1] = "moose";
	runningAnimals.array[4] = "moose";
	runningAnimals.array[10] = "elk";
	runningAnimals.array[14] = "moose";
	runningAnimals.array[20] = "elk";

	loader.load( { model: "files/models/soup/animals_A_life.js", callback: animalLoadedProxy } );
	loader.load( { model: "files/models/soup/elk_life.js", callback: elkLoadedProxy } );
	loader.load( { model: "files/models/soup/moose_life.js", callback: mooseLoadedProxy } );

	function animalLoadedProxy( geometry ) {
		var morphArray = [0,0,4,3,2,1,0,1,2,7,3,4,1,0,0,5,6,2,4,3];
		runningAnimals.addAnimal( geometry, null, 1.2, morphArray );
	}

	function elkLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "elk", 2.2, null );
	}

	function mooseLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "moose", 1.1, null );
	}

	// flying animals
	var flyingAnimals = new AnimalSwarm(10, scene, vectors.array);
	flyingAnimals.settings.flying = true;
	for (var i=0; i<10; ++i ) {
		var odd = i%2;
		if (odd == 0) {
			flyingAnimals.array[i] = "b";
		}
	}

	loader.load( { model: "files/models/soup/birds_A_life.js", callback: birdsALoadedProxy } );
	loader.load( { model: "files/models/soup/birds_B_life.js", callback: birdsBLoadedProxy } );
	
	function birdsALoadedProxy( geometry ) {
		var morphArray = [1,1,0,0,1,0,0,1,0,0];
		flyingAnimals.addAnimal( geometry, null, 1.3, morphArray, 1 );
	}

	function birdsBLoadedProxy( geometry ) {
		var morphArray = [1,1,0,0,1,0,0,1,0,0];
		flyingAnimals.addAnimal( geometry, "b", 1.3, morphArray, 1 );
	}

	// butterflys
	var butterflys = new AnimalInFrontOfCamera(30, scene);
	loader.load( { model: "files/models/soup/butterfly_hiA.js", callback: butterflys.addAnimal } );
	
	// trail - of grass/trees/etc
	var grassMaterials = [new THREE.MeshLambertMaterial( { color: 0x83b95b, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x93c171, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x7eaa5e, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x77bb45, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x7da75e, shading: THREE.FlatShading } )
	];

	var trail = new Trail(100, scene);
	// preoccupy slots for trees and lighthouse
	for (i=0; i<100; i+=10 ) {
		var odd = i%3;
		if (odd == 0) {
			trail.array[i] = "a";
		}
		if (odd == 1) {
			trail.array[i] = "b";
		}
		if (odd == 2) {
			trail.array[i] = "c";
		}
	}
	trail.array[4] = "light";

	loader.load( { model: "files/models/soup/grass.js", callback: grassLoadedProxy } );
	
	loader.load( { model: "files/models/soup/evergreen_low.js", callback: treeALoadedProxy } );
	loader.load( { model: "files/models/soup/evergreen_high.js", callback: treeBLoadedProxy } );
	loader.load( { model: "files/models/soup/tree_Generic.js", callback: treeCLoadedProxy } );
	// lighthouse
	loader.load( { model: "files/models/soup/lighthouse.js", callback: ligthhouseLoadedProxy } );

	function grassLoadedProxy( geometry ) {
		trail.addInstance( geometry, null, false, grassMaterials );
	}
	function treeALoadedProxy( geometry ) {
		trail.addInstance( geometry, "a", true, grassMaterials );
	}
	function treeBLoadedProxy( geometry ) {
		trail.addInstance( geometry, "b", true, grassMaterials);
	}
	function treeCLoadedProxy( geometry ) {
		trail.addInstance( geometry, "c", true, grassMaterials );
	}
	function ligthhouseLoadedProxy( geometry ) {
		trail.addInstance( geometry, "light", true, [new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } )] );
		trail.array[4].maxHeight = 5;
	}

	
	this.update = function ( delta ) {

		//console.log(ribbons.settings.ribbonMin);

		// update to reflect _real_ camera position
		camPos.x = camera.matrixWorld.n14;
		camPos.y = camera.matrixWorld.n24;
		camPos.z = camera.matrixWorld.n34;

		// temp reset
		if (camPos.z <= -3260) {
			reset();
		}
		
		// update the soup parts	
		collisionScene.update(camPos, delta);
		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		ribbons.update(collisionScene.emitterFollow.position);
		particles.update(delta, vectors.array[0].position);
		runningAnimals.update();
		flyingAnimals.update();
		butterflys.update(camPos, camera.theta, delta);
		trail.update(collisionScene.emitter.position, collisionScene.currentNormal, camPos, delta);
		
		TWEEN.update();

		// update for the green stuff shader
		shared.targetStart.x = vectors.array[3].position.x;
		shared.targetStart.y = vectors.array[3].position.y;
		shared.targetStart.z = vectors.array[3].position.z;

		shared.targetEnd.x = vectors.array[20].position.x;
		shared.targetEnd.y = vectors.array[20].position.y;
		shared.targetEnd.z = vectors.array[20].position.z;

		// pointlight
		pointLight.position = collisionScene.emitterFollow.position;

	}


	function reset () {
		camPos = new THREE.Vector3( 0, 20, 50 );

		collisionScene.reset(camPos.x,camPos.y,camPos.z);
		vectors.reset(camPos.x,camPos.y,camPos.z);
		runningAnimals.reset(camPos.x,camPos.y,camPos.z);
		flyingAnimals.reset(camPos.x,camPos.y,camPos.z);
		particles.reset(camPos.x,camPos.y,camPos.z);

	}


	this.destruct = function () {

	}

}
