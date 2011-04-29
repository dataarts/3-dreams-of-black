var CitySoup = function ( camera, scene, shared ) {

	var that = this;
	that.camera = camera;

	// init
	var noiseCount = 0;
	camPos = new THREE.Vector3( 0, 0, 0 );
	
	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };


	var shake = 0;

	/*var pointLight = new THREE.PointLight( 0xeeffee, 3, 200 );
	pointLight.position.x = camPos.x;
	pointLight.position.y = camPos.y;
	pointLight.position.z = camPos.z;
	scene.addLight( pointLight, 1.0 );
	*/
	// refactoring

	// setup the different parts of the soup

	// collision scene

	var collisionScene = new CollisionScene2( that.camera, 0.1, shared, 500, scene );
	collisionScene.settings.maxSpeedDivider = 4;
	collisionScene.settings.capBottom = 3;
	collisionScene.settings.capTop = 1000;
	collisionScene.settings.shootRayDown = false;
	collisionScene.settings.allowFlying = false;
	collisionScene.settings.emitterDivider = 3;
	collisionScene.settings.normalOffsetAmount = 8;
	//collisionScene.settings.minDistance = 30;
	collisionScene.settings.keepEmitterFollowDown = true;

	collisionScene.emitter.position.z = -100;
	collisionScene.emitterFollow.position.z = -100;
	collisionScene.cameraTarget.position.z = -100;


	loader.load( { model: "files/models/city/collision/City.Collision_Big.js", callback: mesh0LoadedProxy } );
	loader.load( { model: "files/models/city/collision/City.Collision_Big.001.js", callback: mesh1LoadedProxy } );
	loader.load( { model: "files/models/city/collision/City.Collision_Big.002.js", callback: mesh2LoadedProxy } );
	loader.load( { model: "files/models/city/collision/City.Collision_Big.003.js", callback: mesh3LoadedProxy } );

//	camera.useTarget = false;
	camera.target = collisionScene.cameraTarget;

	function mesh0LoadedProxy( geometry ) {
		var scale = 0.1;
		var rotation = new THREE.Vector3(-1.570796,0,3.141591);
		var position = new THREE.Vector3();
		collisionScene.addLoaded(geometry, scale, rotation, position, scene);
	}

	function mesh1LoadedProxy( geometry ) {
		var scale = 0.1;
		var rotation = new THREE.Vector3(-1.570796,0,0);
		var position = new THREE.Vector3();
		collisionScene.addLoaded(geometry, scale, rotation, position, scene);
	}

	function mesh2LoadedProxy( geometry ) {
		var scale = 0.1;
		var rotation = new THREE.Vector3(-1.570796,0,0);
		var position = new THREE.Vector3();
		collisionScene.addLoaded(geometry, scale, rotation, position, scene);
	}

	function mesh3LoadedProxy( geometry ) {
		var scale = 0.1;
		var rotation = new THREE.Vector3(-1.570796,0,1.570797);
		var position = new THREE.Vector3();
		collisionScene.addLoaded(geometry, scale, rotation, position, scene);
	}


	// vector trail
	var startPosition = new THREE.Vector3(0,0,100);
	var vectors = new Vectors(50,2,3,startPosition);
	//vectors.settings.divider = 4;
	//vectors.settings.normaldivider = 4;
	//vectors.settings.absoluteTrail = true;

	// ribbons

	var ribbonMaterials = [
			new THREE.MeshLambertMaterial( { color:0x29ae08, opacity: 0.1 } ),
			new THREE.MeshLambertMaterial( { color:0x309018, opacity: 0.1 } ),
			new THREE.MeshLambertMaterial( { color:0x267213, opacity: 0.1 } ),
			new THREE.MeshLambertMaterial( { color:0x5ab543, opacity: 0.1 } ),
			new THREE.MeshLambertMaterial( { color:0x2e6f1e, opacity: 0.1 } ),
			new THREE.MeshLambertMaterial( { color:0x08a620, opacity: 0.1 } )
	];

	var ribbons = new Ribbons(4, vectors.array, scene, ribbonMaterials);

	ribbons.settings.ribbonPulseMultiplier_1 = 15;
	ribbons.settings.ribbonPulseMultiplier_2 = 0;
	ribbons.settings.ribbonMin = 0.4;
	ribbons.settings.ribbonMax = 0.4;

	// particles

	var sprite0 = THREE.ImageUtils.loadTexture( "files/textures/particle_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "files/textures/particle_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "files/textures/particle_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "files/textures/particle_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "files/textures/particle_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];

	var particles = new Particles(22, scene, 5, particleSprites, 15, 50, THREE.AdditiveBlending);
	particles.settings.gravitateTowardsCamera = true;

	// stragglers
	var stragglers = new Stragglers(4, scene, vectors.array);
	stragglers.settings.constantSpeed = 0.7;
	stragglers.settings.capy = 0;

/*	loader.load( { model: "files/models/soup/animals_A_life.js", callback: stragglerLoadedProxy } );
	
	function stragglerLoadedProxy( geometry ) {
		var morphArray = [5,6,9,2];
		stragglers.addAnimal( geometry, null, 1.7, morphArray );
	}*/


	// running animals

	var runningAnimals = new AnimalSwarm(30, scene, vectors.array);
	runningAnimals.settings.addaptiveSpeed = true;
	runningAnimals.settings.capy = 0;
	runningAnimals.settings.startPosition = startPosition;
	runningAnimals.settings.switchPosition = true;

	// preoccupy slots for specific animals - hack...

	runningAnimals.array[0] = "elk";
	runningAnimals.array[10] = "elk";
	runningAnimals.array[20] = "elk";
	runningAnimals.array[1] = "moose";
	runningAnimals.array[4] = "moose";
	runningAnimals.array[14] = "moose";
	runningAnimals.array[8] = "fish";
	runningAnimals.array[16] = "fish";
	runningAnimals.array[24] = "fish";
	//runningAnimals.array[15] = "sock";


	loader.load( { model: "files/models/soup/animals_A_life.js", callback: animalLoadedProxy } );
	loader.load( { model: "files/models/soup/elk_life.js", callback: elkLoadedProxy } );
	loader.load( { model: "files/models/soup/moose_life.js", callback: mooseLoadedProxy } );
	loader.load( { model: "files/models/soup/fish_life.js", callback: fishLoadedProxy } );
	//loader.load( { model: "files/models/soup/sock_jump_life.js", callback: sockLoadedProxy } );

	function animalLoadedProxy( geometry ) {
		// regular
		var morphArray = [0,0,4,3,2,1,0,5,2,7,8,9,10,0,0,3,3,9,2,3];
		runningAnimals.addAnimal( geometry, null, 1.5, morphArray );
		// stragglers
		morphArray = [5,6,9,2];
		stragglers.addAnimal( geometry, null, 1.7, morphArray );
	}

	function elkLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "elk", 2.2, null );
	}

	function mooseLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "moose", 1.1, null );
	}

	function fishLoadedProxy( geometry ) {
		var morphArray = [0,1,2,3];
		runningAnimals.addAnimal( geometry, "fish", 1.6, morphArray );
	}

	/*function sockLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "sock", 1.5, null );
	}*/


	// flying animals
	var flyingAnimals = new AnimalSwarm(10, scene, vectors.array);
	flyingAnimals.settings.flying = true;
	flyingAnimals.settings.flyingDistance = 45;

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
/*	var flyingAnimals2 = new AnimalSwarm(70, scene, vectors.array);
	flyingAnimals2.settings.flying = true;
	flyingAnimals2.settings.divider = 1;
	flyingAnimals2.settings.flyingDistance = 30;
	flyingAnimals2.settings.xPositionMultiplier = 20;
	flyingAnimals2.settings.zPositionMultiplier = 20;
	flyingAnimals2.settings.constantSpeed = 2.0;
	flyingAnimals2.settings.butterfly = true;
	//flyingAnimals2.settings.switchPosition = true;


	loader.load( { model: "files/models/soup/butterfly_low.js", callback: flying2LoadedProxy } );
	
	function flying2LoadedProxy( geometry ) {
		var morphArray = [0,1,2,3];
		flyingAnimals2.addAnimal( geometry, null, 5, morphArray, 5, null, true );
	}
*/

	// butterflys
	var butterflysD = new AnimalInFrontOfCamera(15, scene);
	loader.load( { model: "files/models/soup/butterfly_hiD.js", callback: butterflysD.addAnimal } );
	var butterflysC = new AnimalInFrontOfCamera(15, scene);
	loader.load( { model: "files/models/soup/butterfly_hiC.js", callback: butterflysC.addAnimal } );
	
	// trail - of grass/trees/etc
	var trail = new Trail(80, scene);
	// preoccupy for differnt grass
	for (i=0; i<80; ++i ) {
		var type = i%4;
		trail.array[i] = "0"+(type+1);
	}
	// preoccupy slots for trees and lighthouse
	for (i=0; i<80; i+=8 ) {
		var type = (i/8)%4;
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
		trail.addInstance( geometry, "light", false, true );
		trail.array[4].maxHeight = 5;
	}

	
	this.update = function ( delta ) {

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			//delta = 1000/60;
			return;
		}
		//var optimal = 1000/60;
		//var percent = delta/optimal;
		//console.log(optimal+" | "+delta+" | "+percent);

		// update to reflect _real_ camera position
		camPos.x = that.camera.matrixWorld.n14;
		camPos.y = that.camera.matrixWorld.n24;
		camPos.z = that.camera.matrixWorld.n34;

		// temp reset
		if (camPos.z <= -3290 || camPos.x > 1640 || camPos.x < -1640) {
			reset();
		}
		
		// straggler test
		if (shake%50 == 49) {
			stragglers.create(collisionScene.emitterFollow.position, collisionScene.currentNormal, collisionScene.emitter.position);
		}

		// camera roll hack...
		var dx = camera.position.x-collisionScene.cameraTarget.position.x;
		var dz = camera.position.z-collisionScene.cameraTarget.position.z;

		var angleRad = Math.atan2(dz, dx);
		camera.up.x = ( ((angleRad-Math.PI/2)/4)*-1 );

		// camera shake hack...
		++shake;
		var xshake = 0;
		if (shake%4 == 0) {
			xshake = (Math.random()-0.5)*0.7;
			camera.up.x += (Math.random()-0.5)*0.02;
		}
		if (shake%2 == 0) {
			camera.position.y = 18+(Math.random()-0.5)*0.7;
		}

		noiseCount += Math.random();
		var noise = Math.sin(noiseCount/15)*30;
		//camera.position.x = 0+noise+xshake+( ((angleRad-Math.PI/2)*30)*-1 );

		var zoom = collisionScene.cameraTarget.position.y/25;
		camera.fov = 50-zoom;
		camera.updateProjectionMatrix();

		// update the soup parts
		collisionScene.update(camPos, delta);
		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		ribbons.update(collisionScene.emitterFollow.position);

		particles.update(delta, vectors.array[0].position, camPos);
		runningAnimals.update(delta);
		stragglers.update(delta, camPos);
		flyingAnimals.update(delta);
		//flyingAnimals2.update();
		//butterflys.update(camPos, that.camera.theta, delta);
		butterflysC.update(camPos, angleRad, delta);
		butterflysD.update(camPos, angleRad, delta, true);
		trail.update(collisionScene.emitterFollow.position, collisionScene.currentNormal, camPos, delta);
		TWEEN.update();

		// pointlight
		/*pointLight.position.x = collisionScene.emitterFollow.position.x + collisionScene.currentNormal.x*100;
		pointLight.position.y = collisionScene.emitterFollow.position.y + collisionScene.currentNormal.y*100;
		pointLight.position.z = collisionScene.emitterFollow.position.z + collisionScene.currentNormal.z*100;
		*/
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
		//flyingAnimals2.reset(camPos.x,camPos.y,camPos.z);
		particles.reset(camPos.x,camPos.y,camPos.z);
		stragglers.reset(camPos.x,camPos.y,camPos.z);

	}


	this.destruct = function () {

	}

}
