var CitySoup = function ( camera, scene, shared ) {

	var that = this;
	that.camera = camera,
	renderer = shared.renderer;

	// init
	var noiseCount = 0;
	shared.camPos = new THREE.Vector3( 0, 0, -300 );
	
	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	shared.trigger = new THREE.Vector3( 0, 0, 0 );

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

	var collisionScene = new CollisionScene( that.camera, scene, 0.1, shared, 500, true );

	collisionScene.settings.maxSpeedDivider = 2;
	collisionScene.settings.capBottom = 3;
	collisionScene.settings.capTop = 1000;
	collisionScene.settings.shootRayDown = false;
	collisionScene.settings.allowFlying = false;
	collisionScene.settings.emitterDivider = 8;
	collisionScene.settings.normalOffsetAmount = 8;
	collisionScene.settings.minDistance = 100;
	collisionScene.settings.keepEmitterFollowDown = true;

	collisionScene.emitter.position.z = -100;
	collisionScene.emitterFollow.position.z = -100;
	collisionScene.cameraTarget.position.z = -100;


	loader.load( { model: "files/models/city/collision/City.Collision_Big.js", callback: mesh0LoadedProxy } );
	loader.load( { model: "files/models/city/collision/City.Collision_Big.001.js", callback: mesh1LoadedProxy } );
	loader.load( { model: "files/models/city/collision/City.Collision_Big.002.js", callback: mesh2LoadedProxy } );
	loader.load( { model: "files/models/city/collision/City.Collision_Big.003.js", callback: mesh3LoadedProxy } );

/*	loader.load( { model: "files/models/city/collision/City.Collision_Big.000.js", callback: mesh0LoadedProxy } );
	loader.load( { model: "files/models/city/collision/City.Collision_Big.004.js", callback: mesh1LoadedProxy } );
	loader.load( { model: "files/models/city/collision/City.Collision_Big.005.js", callback: mesh2LoadedProxy } );
	loader.load( { model: "files/models/city/collision/City.Collision_Big.006.js", callback: mesh3LoadedProxy } );
*/
	camera.target = collisionScene.cameraTarget;

	function mesh0LoadedProxy( geometry ) {

		var scale = 0.1;
		var rotation = new THREE.Vector3( -1.570796,0,3.141591 );
		var position = new THREE.Vector3();

		collisionScene.addLoaded( geometry, scale, rotation, position, scene );

	}

	function mesh1LoadedProxy( geometry ) {

		var scale = 0.1;
		var rotation = new THREE.Vector3( -1.570796,0,0 );
		var position = new THREE.Vector3();
		collisionScene.addLoaded( geometry, scale, rotation, position, scene );

	}

	function mesh2LoadedProxy( geometry ) {

		var scale = 0.1;
		var rotation = new THREE.Vector3(-1.570796,0,0);
		var position = new THREE.Vector3();
		collisionScene.addLoaded( geometry, scale, rotation, position, scene );

	}

	function mesh3LoadedProxy( geometry ) {

		var scale = 0.1;
		var rotation = new THREE.Vector3(-1.570796,0,1.570797);
		var position = new THREE.Vector3();
		collisionScene.addLoaded( geometry, scale, rotation, position, scene );

	}


	// vector trail

	var startPosition = new THREE.Vector3( 0,0,100 );
	var vectors = new Vectors( 50,2,2,startPosition );

	//vectors.settings.divider = 4;
	//vectors.settings.normaldivider = 4;
	//vectors.settings.absoluteTrail = true;

	// ribbons

	var ribbonMaterials = [
			new THREE.MeshLambertMaterial( { color:0x5B8540, opacity: 1.0 } ),
			new THREE.MeshLambertMaterial( { color:0x416629, opacity: 1.0 } ),
			new THREE.MeshLambertMaterial( { color:0x2F5C11, opacity: 1.0 } ),
			new THREE.MeshLambertMaterial( { color:0x639144, opacity: 1.0 } )
	];

	var ribbons = new Ribbons(4, vectors.array, scene, ribbonMaterials);

	ribbons.settings.ribbonPulseMultiplier_1 = 15;
	ribbons.settings.ribbonPulseMultiplier_2 = 0;
	ribbons.settings.ribbonMin = 0.1;
	ribbons.settings.ribbonMax = 0.2;

	// particles

	var sprite0 = THREE.ImageUtils.loadTexture( "files/textures/particle_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "files/textures/particle_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "files/textures/particle_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "files/textures/particle_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "files/textures/particle_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];

	var particles = new Particles( 22, scene, 5, particleSprites, 20, 70, THREE.AdditiveBlending );
	particles.settings.gravitateTowardsCamera = true;

	// stragglers
	var stragglers = new Stragglers(5, scene, vectors.array);
	//stragglers.settings.constantSpeed = 0.7;
	stragglers.settings.capy = 0;

/*	loader.load( { model: "files/models/soup/animals_A_life.js", callback: stragglerLoadedProxy } );
	
	function stragglerLoadedProxy( geometry ) {
		var morphArray = [5,6,9,2];
		stragglers.addAnimal( geometry, null, 1.7, morphArray );
	}*/


	// running animals

	var runningAnimals = new AnimalSwarm( 30, scene, vectors.array );

	runningAnimals.settings.addaptiveSpeed = true;
	runningAnimals.settings.capy = 0;
	runningAnimals.settings.startPosition = startPosition;
	runningAnimals.settings.constantSpeed = 0.75;
	//runningAnimals.settings.switchPosition = true;

	// preoccupy slots for specific animals - hack...

/*	runningAnimals.array[0] = "moose";
	runningAnimals.array[10] = "elk";
	runningAnimals.array[20] = "elk";
	runningAnimals.array[1] = "elk";
	runningAnimals.array[4] = "moose";
	runningAnimals.array[14] = "moose";
	runningAnimals.array[8] = "fish";
	runningAnimals.array[16] = "fish";
	runningAnimals.array[24] = "fish";
	//runningAnimals.array[15] = "sock";
*/

	runningAnimals.array[0] = "moose";
	runningAnimals.array[22] = "moose";
	runningAnimals.array[2] = "elk";
	runningAnimals.array[10] = "elk";
	runningAnimals.array[1] = "elk";
	runningAnimals.array[25] = "elk";

	runningAnimals.array[8] = "fish";
	runningAnimals.array[16] = "fish";
	runningAnimals.array[5] = "sockjump";
	runningAnimals.array[26] = "sockjump";
	runningAnimals.array[13] = "sockpopup";
	runningAnimals.array[29] = "sockjump";


	loader.load( { model: "files/models/soup/animals_A_life.js", callback: animalLoadedProxy } );
	loader.load( { model: "files/models/soup/elk_life.js", callback: elkLoadedProxy } );
	loader.load( { model: "files/models/soup/moose_life.js", callback: mooseLoadedProxy } );
	loader.load( { model: "files/models/soup/fish_life.js", callback: fishLoadedProxy } );
	loader.load( { model: "files/models/soup/sockpuppet_jump.js", callback: sockjumpLoadedProxy } );
	loader.load( { model: "files/models/soup/sockpuppet_popup.js", callback: sockpopupLoadedProxy } );

	function animalLoadedProxy( geometry ) {

		// regular

		var morphArray = [1,0,4,3,2,1,0,5,2,7,8,9,10,1,0,3,3,9,2,3];
		var speedArray = [6.5, 13.12, 9.76, 7.47, 4.74, 4.94, 0.777, 6.252, 3.412, 5.52, 5.576];
		
		runningAnimals.addAnimal( geometry, null, 1.5, morphArray, speedArray );
		// stragglers
		morphArray = [8,9,7,9,10];		
		var animal = stragglers.addAnimal( geometry, null, 1.8, morphArray, speedArray );
		preinitAnimal( animal, renderer, scene );

	}

	function elkLoadedProxy( geometry ) {
		
		var animal = runningAnimals.addAnimal( geometry, "elk", 2.2, null, [6] );
		preinitAnimal( animal, renderer, scene );

	}

	function mooseLoadedProxy( geometry ) {

		var animal = runningAnimals.addAnimal( geometry, "moose", 1.1, null, [13.964] );
		preinitAnimal( animal, renderer, scene );

	}

	function fishLoadedProxy( geometry ) {

		var morphArray = [0,1,2,3];

		var animal = runningAnimals.addAnimal( geometry, "fish", 1.6, morphArray, [2] );
		preinitAnimal( animal, renderer, scene );

		runningAnimals.array[8].isFish = true;
		runningAnimals.array[16].isFish = true;
	}

	function sockjumpLoadedProxy( geometry ) {
		var animal;
		animal = runningAnimals.addAnimal( geometry, "sockjump", 1.8, null, [3], true );

		preinitAnimal( animal, shared.renderer, scene );
	}

	function sockpopupLoadedProxy( geometry ) {
		var animal;
		animal = runningAnimals.addAnimal( geometry, "sockpopup", 2.0, null, [0.1], true );

		preinitAnimal( animal, shared.renderer, scene );
	}



	// flying animals
	var flyingAnimals = new AnimalSwarm( 10, scene, vectors.array );

	flyingAnimals.settings.flying = true;
	flyingAnimals.settings.flyingDistance = 45;

	for (var i=0; i<10; ++i ) {

		var odd = i%2;
		if ( odd == 0 ) {

			flyingAnimals.array[i] = "b";
		}

	}

	loader.load( { model: "files/models/soup/birds_A_life.js", callback: birdsALoadedProxy } );
	loader.load( { model: "files/models/soup/birds_B_life.js", callback: birdsBLoadedProxy } );
	
	function birdsALoadedProxy( geometry ) {

		var morphArray = [0,1,2,3,0,1,2,3,0,1];
		var speedArray = [4.848, 7, 7.5, 3.5];

		var animal = flyingAnimals.addAnimal( geometry, null, 1.3, morphArray, speedArray );
		preinitAnimal( animal, renderer, scene );

	}

	function birdsBLoadedProxy( geometry ) {

		var morphArray = [1,1,0,0,1,0,0,1,0,0];
		var speedArray = [8.5, 8.623];

		var animal = flyingAnimals.addAnimal( geometry, "b", 1.3, morphArray, speedArray );
		preinitAnimal( animal, renderer, scene );

	}


	// flying animals 2
	var flyingAnimals2 = new AnimalSwarm(70, scene, vectors.array);
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


	// butterflys

	var butterflysD = new AnimalInFrontOfCamera( 15, scene );
	loader.load( { model: "files/models/soup/butterfly_hiD.js", callback: butterflysD.addAnimal } );

	var butterflysC = new AnimalInFrontOfCamera( 15, scene );
	loader.load( { model: "files/models/soup/butterfly_hiC.js", callback: butterflysC.addAnimal } );
	
	// trail - of grass/trees/etc

	var trail = new Trail( 80, scene );
	trail.settings.freeRotation = false;
	trail.settings.tweenTime = 2500;
	trail.settings.aliveDivider = 30;
	trail.settings.offsetAmount = 10;

	//trail.settings.scale = 1.1;

	// preoccupy for differnt grass

	for ( i = 0; i < 80; ++i ) {

		var type = i%4;
		trail.array[i] = "0" + ( type + 1 );

	}

	// preoccupy slots for trees and lighthouse

	trail.array[10] = "tree1";
	trail.array[30] = "tree2";
	trail.array[45] = "tree3";
	trail.array[60] = "tree4";
	trail.array[75] = "tree5";

	for ( i = 0; i < 80; i += 8 ) {

		var type = (i/8)%4;
		trail.array[i] = "tree"+(type+1);

	}
	
	trail.array[70] = "light";

	loader.load( { model: "files/models/soup/grass01.js", callback: grass01LoadedProxy } );
	loader.load( { model: "files/models/soup/grass02.js", callback: grass02LoadedProxy } );
	loader.load( { model: "files/models/soup/grass03.js", callback: grass03LoadedProxy } );
	loader.load( { model: "files/models/soup/grassFlower.js", callback: grass04LoadedProxy } );
	//loader.load( { model: "files/models/soup/grass05.js", callback: grass05LoadedProxy } );
	
	loader.load( { model: "files/models/soup/evergreen_low.js", callback: treeALoadedProxy } );
	loader.load( { model: "files/models/soup/evergreen_high.js", callback: treeBLoadedProxy } );
	loader.load( { model: "files/models/soup/treeGeneric.js", callback: treeCLoadedProxy } );
	loader.load( { model: "files/models/soup/treeGenericLower.js", callback: treeDLoadedProxy } );
	loader.load( { model: "files/models/soup/treeOrange.js", callback: treeELoadedProxy } );

	// lighthouse
	loader.load( { model: "files/models/soup/lighthouse.js", callback: ligthhouseLoadedProxy } );

	function grass01LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "01", false );

	}

	function grass02LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "02", false );
		preInitModel( geometry, renderer, scene, object );

	}

	function grass03LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "03", false );
		preInitModel( geometry, renderer, scene, object );

	}

	function grass04LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "04", false );
		preInitModel( geometry, renderer, scene, object );

	}

	function grass05LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "05", false );
		preInitModel( geometry, renderer, scene, object );

	}

	function treeALoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "tree1", true );
		preInitModel( geometry, renderer, scene, object );

	}

	function treeBLoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "tree2", true );
		preInitModel( geometry, renderer, scene, object );

	}

	function treeCLoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "tree3", true );
		preInitModel( geometry, renderer, scene, object );

	}

	function treeDLoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "tree4", true );
		preInitModel( geometry, renderer, scene, object );

	}

	function treeELoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "tree5", true );
		preInitModel( geometry, renderer, scene, object );

	}

	function ligthhouseLoadedProxy( geometry ) {
		
		var object = trail.addInstance( geometry, "light", false, true );
		preInitModel( geometry, renderer, scene, object );

		trail.array[4].maxHeight = 12;

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
		shared.camPos.x = that.camera.matrixWorld.n14;
		shared.camPos.y = that.camera.matrixWorld.n24;
		shared.camPos.z = that.camera.matrixWorld.n34;

		// temp reset
		if (shared.camPos.z <= -3290 || shared.camPos.x > 1640 || shared.camPos.x < -1640) {
			reset();
		}
		
		// straggler test
		if (shake%8 == 7) {
			stragglers.create(collisionScene.emitterFollow.position, collisionScene.currentNormal, collisionScene.emitter.position);
		}

		++shake;

		// camera roll hack...
/*		var dx = camera.position.x-collisionScene.cameraTarget.position.x;
		var dz = camera.position.z-collisionScene.cameraTarget.position.z;

		var angleRad = Math.atan2(dz, dx);
		camera.up.x = ( ((angleRad-Math.PI/2)/4)*-1 );
*/
		// camera shake hack...
		var xshake = 0;
		if (shake%4 == 0) {
			xshake = (Math.random()-0.5)*1.2;
			//that.camera.animationParent.up.x += (Math.random()-0.5)*0.01;
		}
		if (shake%2 == 0) {
			that.camera.animationParent.position.y = 18+(Math.random()-0.5)*1.2;
		}

		that.camera.position.x = 0+xshake;

		//var zoom = collisionScene.cameraTarget.position.y/25;
		//camera.fov = 60-zoom;
		//camera.updateProjectionMatrix();

		// spawn animal test
		if (shake%15 == 14) {
			//runningAnimals.create(collisionScene.emitterFollow.position, collisionScene.currentNormal, collisionScene.emitterFollow.position);
			runningAnimals.create(vectors.array[1].position, collisionScene.currentNormal);
			//flyingAnimals.create(collisionScene.emitterFollow.position, collisionScene.currentNormal, collisionScene.emitterFollow.position);
			flyingAnimals.create(vectors.array[1].position, collisionScene.currentNormal);
		}

		// update the soup parts
		collisionScene.update(shared.camPos, delta);
		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		ribbons.update(collisionScene.emitterFollow.position);

		particles.update(delta, vectors.array[0].position, shared.camPos);
		//runningAnimals.update(delta, shared.camPos, collisionScene.emitterFollow.position, collisionScene.currentNormal);
		runningAnimals.update(delta, shared.camPos);
		stragglers.update(delta, shared.camPos);
		//flyingAnimals.update(delta, shared.camPos, collisionScene.emitterFollow.position, collisionScene.currentNormal);
		flyingAnimals.update(delta, shared.camPos);
		flyingAnimals2.update();
		//butterflys.update(camPos, that.camera.theta, delta);
		//butterflysC.update(shared.camPos, angleRad, delta);
		//butterflysD.update(shared.camPos, angleRad, delta, true);
		butterflysC.update(shared.camPos, that.camera.theta, delta);
		butterflysD.update(shared.camPos, that.camera.theta, delta, true);

		trail.update(collisionScene.emitter.position, collisionScene.emitterNormal, shared.camPos, delta);
		TWEEN.update();

		//shared.trigger.copy(vectors.array[10].position);

		TriggerUtils.effectors[ 0 ] = collisionScene.emitter.position.x;
		TriggerUtils.effectors[ 1 ] = collisionScene.emitter.position.y;
		TriggerUtils.effectors[ 2 ] = collisionScene.emitter.position.z;

		// pointlight
		/*pointLight.position.x = collisionScene.emitterFollow.position.x + collisionScene.currentNormal.x*100;
		pointLight.position.y = collisionScene.emitterFollow.position.y + collisionScene.currentNormal.y*100;
		pointLight.position.z = collisionScene.emitterFollow.position.z + collisionScene.currentNormal.z*100;
		*/
	}

	this.changeCamera = function ( camera ) {

		that.camera = camera;
		collisionScene.settings.camera = camera;

	}


	function reset () {
		shared.camPos = new THREE.Vector3( 0, 0, -300 );

		collisionScene.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		vectors.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		runningAnimals.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		flyingAnimals.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		flyingAnimals2.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		particles.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		stragglers.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);

	}


	this.destruct = function () {

	}

}
