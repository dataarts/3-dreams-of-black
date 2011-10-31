var DunesSoup = function ( camera, scene, shared ) {

	var that = this;

	shared.camPos = new THREE.Vector3( 0, 0, 0 );
	var currentSoup = 0;
	var started = false;
	var darkTrailArray = [];
	var lightTrailArray = [];

	var loader = new THREE.JSONLoaderAjax();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	// switch soup
	shared.signals.mousedown.add( scaleDown );

	function scaleDown () {
		if (!started) {
			return;
		}

		for ( var i = 0; i < flyingAnimals.initSettings.numOfAnimals; ++i ) {
			// tween scale
			if (i==0) {
				var scaleTween = new TWEEN.Tween(flyingAnimals.array[i])
					.to({scale: 0.001}, 300)
					.easing(TWEEN.Easing.Linear.EaseNone)
					.onComplete(switchSoup);
				scaleTween.start();
			} else {
				var scaleTween = new TWEEN.Tween(flyingAnimals.array[i])
					.to({scale: 0.001}, 300)
					.easing(TWEEN.Easing.Linear.EaseNone);
				scaleTween.start();
			}
		}

		for ( var i = 0; i < trail.initSettings.numOfInstances; ++i ) {
			// tween scale
			var scaleTween = new TWEEN.Tween(trail.array[i].c.scale)
				.to({x: 0.001, y: 0.001, z: 0.001}, 300)
				.easing(TWEEN.Easing.Linear.EaseNone);
			scaleTween.start();
		}

	}

	function switchSoup () {

		if (currentSoup == 0) {
			that.set("raven|raven|raven|vulture|vulture|raven|raven|raven|raven|raven|vulture");
			ribbons.changeColor([0x000000,0x111111,0x000000,0x111111,0x000000,0x111111], 0.5);
			trail.switchGeometry(darkTrailArray);
			currentSoup = 1;
		} else {
			that.set("eagle|owl|parrot|flamingo|hummingbird|eagle|owl|stork|parrot|hummingbird|eagle");
			ribbons.changeColor([0xd9f3fb,0xe4f1f5,0xffffff,0xeeeeee,0xdcf3fa,0xd2f3fc], 0.25);
			trail.switchGeometry(lightTrailArray);
			currentSoup = 0;
		}

	}

	that.addAnimal = function ( id, arrayIndex ) {

		if (id == undefined) {
			id = "eagle";
		}

		var geometry = allAnimals[id].geometry;
		var scale = allAnimals[id].scale;
		var speed = allAnimals[id].speed;
		var morph = allAnimals[id].index;
		var flying = allAnimals[id].flying;

		if (flying) {
			flyingAnimals.switchAnimal(geometry, scale, speed, morph, arrayIndex);
		} else {
			runningAnimals.switchAnimal(geometry, scale, speed, morph, arrayIndex);
		}

	};


	that.set = function ( str ) {

		var array = str.split("|");

		var runningIndex = 0;
		var flyingIndex = 0;

		for (var i=0; i<array.length; ++i ) {
			var id = array[i];
			var isRunning = true;

			if (allAnimals[id].flying) {
				isRunning = false;
			}

			if (isRunning) {
				that.addAnimal(id, runningIndex);
				++runningIndex;
			} else {
				that.addAnimal(id, flyingIndex);
				++flyingIndex;
			}

		}

	}

	// id:s

	var allAnimals = {};

	// birds
	allAnimals.eagle = {geometry: null, index: 0, speed: 4.848, scale: 1.3, flying: true};
	allAnimals.owl = {geometry: null, index: 1, speed: 7, scale: 1.3, flying: true};
	allAnimals.parrot = {geometry: null, index: 2, speed: 7.5, scale: 1.3, flying: true};
	allAnimals.hummingbird = {geometry: null, index: 3, speed: 3.5, scale: 1.3, flying: true};

	allAnimals.flamingo = {geometry: null, index: 0, speed: 8.5, scale: 1.3, flying: true};
	allAnimals.stork = {geometry: null, index: 1, speed: 8.623, scale: 1.3, flying: true};

	allAnimals.raven = {geometry: null, index: 0, speed: 14, scale: 1.75, flying: true};
	allAnimals.vulture = {geometry: null, index: 1, speed: 12, scale: 1.55, flying: true};


	// setup the different parts of the soup

	// collision scene

	var collisionScene = new CollisionScene( camera, scene, 0.15, shared, 1200 );
	collisionScene.settings.emitterDivider = 5;
	collisionScene.settings.maxSpeedDivider = 0.1;
	collisionScene.settings.capBottom = -500;
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
	loader.load( { model: "/files/models/soup/birds_A_black.js", callback: birdsABlackLoadedProxy } );

	function birdsALoadedProxy( geometry ) {

		allAnimals.eagle.geometry = geometry;
		allAnimals.owl.geometry = geometry;
		allAnimals.parrot.geometry = geometry;
		allAnimals.hummingbird.geometry = geometry;

		var animal,
			morphArray = [0,1,2,3];

		animal = flyingAnimals.addAnimal( geometry, null, 2.8, morphArray, 1.2 );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function birdsBLoadedProxy( geometry ) {

		allAnimals.flamingo.geometry = geometry;
		allAnimals.stork.geometry = geometry;

		var animal,
			morphArray = [1,0];

		animal = flyingAnimals.addAnimal( geometry, "b", 2.8, morphArray, 1.2 );
		preinitAnimal( animal, shared.renderer, scene );

	};

	function birdsABlackLoadedProxy( geometry ) {

		allAnimals.raven.geometry = geometry;
		allAnimals.vulture.geometry = geometry;

	}

	// trail - of grass/trees/etc

	var trail = new Trail( 80, scene );
	trail.settings.freeRotation = true;
	trail.settings.tweenTime = 800;
	trail.settings.aliveDivider = 50;
	trail.settings.offsetAmount = 0;
	trail.settings.shootRayDown = true;

	trail.settings.scale = 1.5;

	// preoccupy for differnt grass

	for ( i = 0; i < 80; ++i ) {

		var type = i%4;
		trail.array[i] = "0" + ( type + 1 );

	}

	loader.load( { model: "/files/models/soup/grass01.js", callback: grass01LoadedProxy } );
	loader.load( { model: "/files/models/soup/grass02.js", callback: grass02LoadedProxy } );
	loader.load( { model: "/files/models/soup/grass03.js", callback: grass03LoadedProxy } );
	loader.load( { model: "/files/models/soup/grassFlower.js", callback: grass04LoadedProxy } );
	loader.load( { model: "/files/models/soup/darkblob01.js", callback: blob01LoadedProxy } );

	function blob01LoadedProxy( geometry ) {

		//var object = trail.addInstance( geometry, null, false, false );
		//preInitModel( geometry, renderer, scene, object );
		darkTrailArray.push(geometry);

		preInitModel( geometry, renderer, scene, object );
	}

	function grass01LoadedProxy( geometry ) {

		//adjustColors( geometry );

		lightTrailArray.push(geometry);

		var object = trail.addInstance( geometry, "01", false );
		preInitModel( geometry, renderer, scene, object );

	}

	function grass02LoadedProxy( geometry ) {

		//adjustColors( geometry );

		lightTrailArray.push(geometry);

		var object = trail.addInstance( geometry, "02", false );
		preInitModel( geometry, renderer, scene, object );

	}

	function grass03LoadedProxy( geometry ) {

		//adjustColors( geometry );

		lightTrailArray.push(geometry);

		var object = trail.addInstance( geometry, "03", false );
		preInitModel( geometry, renderer, scene, object );

	}

	function grass04LoadedProxy( geometry ) {

		//adjustColors( geometry );

		lightTrailArray.push(geometry);

		var object = trail.addInstance( geometry, "04", false );
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
		TWEEN.update();

		if (shared.camPos.y < 1200) {
			trail.update(collisionScene.emitter.position, collisionScene.emitterNormal, shared.camPos, delta);
		}

		started = true;

	}


	this.destruct = function () {

	}

};
