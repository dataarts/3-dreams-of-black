var CitySoup = function ( camera, scene, shared ) {

	var that = this;
	that.camera = camera;

	// init
	
	camPos = new THREE.Vector3( 0, 0, 0 );
	
	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	var pointLight = new THREE.PointLight( 0xeeffee, 3, 200 );
	pointLight.position.x = camPos.x;
	pointLight.position.y = camPos.y;
	pointLight.position.z = camPos.z;
	scene.addLight( pointLight, 1.0 );

	// refactoring

	// setup the different parts of the soup

	// collision scene

	var collisionScene = new CollisionScene( that.camera, scene, 0.1, shared, 5000 );
	collisionScene.settings.maxSpeedDivider = 3;
	collisionScene.settings.capBottom = -2;
	collisionScene.settings.shootRayDown = true;
	collisionScene.settings.allowFlying = false;
	collisionScene.settings.emitterDivider = 3;
	collisionScene.settings.normalOffsetAmount = 8;
	collisionScene.settings.minDistance = 30;
	collisionScene.settings.keepEmitterFollowDown = false;

	// vector trail

	var vectors = new Vectors();
	vectors.settings.normaldivider = 8;

	// ribbons
/*
	var ribbonMaterials = [
			new THREE.MeshLambertMaterial( { color:0xf89010 } ),
			new THREE.MeshLambertMaterial( { color:0x98f800 } ),
			new THREE.MeshLambertMaterial( { color:0x5189bb } ),
			new THREE.MeshLambertMaterial( { color:0xe850e8 } ),
			new THREE.MeshLambertMaterial( { color:0xf1f1f1 } ),
			new THREE.MeshLambertMaterial( { color:0x08a620 } )
	];

	var ribbons = new Ribbons(6, vectors.array, scene, ribbonMaterials);
*/
	// particles

	var sprite0 = THREE.ImageUtils.loadTexture( "files/textures/particle_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "files/textures/particle_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "files/textures/particle_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "files/textures/particle_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "files/textures/particle_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];

	var particles = new Particles(25, scene, 4, particleSprites, 35, 50, THREE.AdditiveBlending);

	// running animals

	var runningAnimals = new AnimalSwarm(30, scene, vectors.array);
	runningAnimals.settings.addaptiveSpeed = true;

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
		var morphArray = [0,0,4,3,2,1,0,5,6,7,8,9,10,0,0,3,3,5,2,3];
		runningAnimals.addAnimal( geometry, null, 1.4, morphArray );
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
		var morphArray = [0,1,2,3,0,1,2,3,0,1];
		flyingAnimals.addAnimal( geometry, null, 1.3, morphArray, 1 );
	}

	function birdsBLoadedProxy( geometry ) {
		var morphArray = [1,1,0,0,1,0,0,1,0,0];
		flyingAnimals.addAnimal( geometry, "b", 1.3, morphArray, 1 );
	}

	// flying animals 2
	var flyingAnimals2 = new AnimalSwarm(100, scene, vectors.array);
	flyingAnimals2.settings.flying = true;
	flyingAnimals2.settings.divider = 8;
	flyingAnimals2.settings.flyingDistance = 10;
	flyingAnimals2.settings.xPositionMultiplier = 30;
	flyingAnimals2.settings.zPositionMultiplier = 30;
	//flyingAnimals2.settings.constantSpeed = 0.5;

	loader.load( { model: "files/models/soup/butterfly_lowA.js", callback: flying2LoadedProxy } );
	
	function flying2LoadedProxy( geometry ) {
		flyingAnimals2.addAnimal( geometry, null, 5, null, 6, null, true );
	}


	// butterflys
	var butterflys = new AnimalInFrontOfCamera(30, scene);
	loader.load( { model: "files/models/soup/butterfly_hiA.js", callback: butterflys.addAnimal } );
	
	// trail - of grass/trees/etc
	var trail = new Trail(100, scene);
	// preoccupy for differnt grass
	for (i=0; i<100; ++i ) {
		var type = i%5;
		trail.array[i] = "0"+(type+1);
	}
	// preoccupy slots for trees and lighthouse
	for (i=0; i<100; i+=10 ) {
		var type = (i/10)%5;
		trail.array[i] = "tree"+(type+1);
	}
	trail.array[4] = "light";

	loader.load( { model: "files/models/soup/grass01.js", callback: grass01LoadedProxy } );
	loader.load( { model: "files/models/soup/grass02.js", callback: grass02LoadedProxy } );
	loader.load( { model: "files/models/soup/grass03.js", callback: grass03LoadedProxy } );
	loader.load( { model: "files/models/soup/grass04.js", callback: grass04LoadedProxy } );
	loader.load( { model: "files/models/soup/grass05.js", callback: grass05LoadedProxy } );
	
	loader.load( { model: "files/models/soup/evergreen_low.js", callback: treeALoadedProxy } );
	loader.load( { model: "files/models/soup/evergreen_high.js", callback: treeBLoadedProxy } );
	loader.load( { model: "files/models/soup/treeGeneric.js", callback: treeCLoadedProxy } );
	loader.load( { model: "files/models/soup/treeGenericLower.js", callback: treeDLoadedProxy } );
	loader.load( { model: "files/models/soup/treeOrange.js", callback: treeELoadedProxy } );

	// lighthouse
	loader.load( { model: "files/models/soup/lighthouse.js", callback: ligthhouseLoadedProxy } );

	function grass01LoadedProxy( geometry ) {
		trail.addInstance( geometry, "01", false );
	}
	function grass02LoadedProxy( geometry ) {
		trail.addInstance( geometry, "02", false );
	}
	function grass03LoadedProxy( geometry ) {
		trail.addInstance( geometry, "03", false );
	}
	function grass04LoadedProxy( geometry ) {
		trail.addInstance( geometry, "04", false );
	}
	function grass05LoadedProxy( geometry ) {
		trail.addInstance( geometry, "05", false );
	}

	function treeALoadedProxy( geometry ) {
		trail.addInstance( geometry, "tree1", true );
	}
	function treeBLoadedProxy( geometry ) {
		trail.addInstance( geometry, "tree2", true);
	}
	function treeCLoadedProxy( geometry ) {
		trail.addInstance( geometry, "tree3", true );
	}
	function treeDLoadedProxy( geometry ) {
		trail.addInstance( geometry, "tree4", true );
	}
	function treeELoadedProxy( geometry ) {
		trail.addInstance( geometry, "tree5", true );
	}

	function ligthhouseLoadedProxy( geometry ) {
		trail.addInstance( geometry, "light", true, [new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } )] );
		trail.array[4].maxHeight = 5;
	}

	
	this.update = function ( delta ) {

		//console.log(ribbons.settings.ribbonMin);

		// update to reflect _real_ camera position
		camPos.x = that.camera.matrixWorld.n14;
		camPos.y = that.camera.matrixWorld.n24;
		camPos.z = that.camera.matrixWorld.n34;

		// temp reset
		if (camPos.z <= -3260 || camPos.x > 1640 || camPos.x < -1640) {
			reset();
		}
		
		// update the soup parts	
		collisionScene.update(camPos, delta);
		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		//ribbons.update(collisionScene.emitterFollow.position);
		particles.update(delta, vectors.array[0].position);
		runningAnimals.update();
		flyingAnimals.update();
		flyingAnimals2.update();
		butterflys.update(camPos, that.camera.theta, delta);
		trail.update(collisionScene.emitter.position, collisionScene.currentNormal, camPos, delta);
		
		TWEEN.update();

		// pointlight
		pointLight.position.x = collisionScene.emitterFollow.position.x + collisionScene.currentNormal.x*20;
		pointLight.position.y = collisionScene.emitterFollow.position.y + collisionScene.currentNormal.y*20;
		pointLight.position.z = collisionScene.emitterFollow.position.z + collisionScene.currentNormal.z*20;

	}

	this.changeCamera = function (camera) {
		that.camera = camera;
		collisionScene.settings.camera = camera;
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
