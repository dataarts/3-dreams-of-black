var UgcSoup = function ( camera, scene, shared, runInCircle ) {

	var that = this;
	var r = 0;

	// init
	shared.camPos = new THREE.Vector3( 0, 20, 0 );
	var loader = new THREE.JSONLoaderAjax();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	var spawnAnimal = 0;
	var spawnBird = 0;


	var vectors;
	var ribbons;
	var trail;
	var runningAnimals;
	var flyingAnimals;
	var particles;

	shared.targetStart = new THREE.Vector3();
	shared.targetEnd = new THREE.Vector3();

	// refactoring

	// setup the different parts of the soup

	// collision scene
	var collisionScene = new CollisionScene( camera, scene, 0.15, shared, 3000 );
	if (runInCircle) {
		collisionScene.settings.capBottom = 0;
	} else {
		//collisionScene.settings.allowFlying = true;
		collisionScene.settings.shootRayDown = true;
	}
	collisionScene.settings.emitterDivider = 3;
	collisionScene.settings.maxSpeedDivider = 0.5;
	collisionScene.settings.normalOffsetAmount = 10;

/*	loader.load( { model: "files/models/city/City_Shadow.js", callback: collisionLoadedProxy } );

	function collisionLoadedProxy( geometry ) {
		collisionScene.addLoaded( geometry, 0.1 );
	}
*/
	// vector trail
	var startPosition = new THREE.Vector3(0,0,100);
	vectors = new Vectors(50,2,2,startPosition);

	// ribbons
/*	var ribbonMaterials = [
			new THREE.MeshLambertMaterial( { color:0x000000 } ),
			new THREE.MeshLambertMaterial( { color:0x555555 } ),
			new THREE.MeshLambertMaterial( { color:0x000000 } ),
			new THREE.MeshLambertMaterial( { color:0x555555 } ),
			new THREE.MeshLambertMaterial( { color:0x000000 } ),
			new THREE.MeshLambertMaterial( { color:0x555555 } )
	];

	ribbons = new Ribbons(6, vectors.array, scene, ribbonMaterials);
	ribbons.settings.ribbonPulseMultiplier_1 = 15;
	ribbons.settings.ribbonPulseMultiplier_2 = 4;
	ribbons.settings.ribbonMin = 4;
	ribbons.settings.ribbonMax = 8;
*/
	// light particles
	var sprite0 = THREE.ImageUtils.loadTexture( "/files/textures/particle_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "/files/textures/particle_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "/files/textures/particle_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "/files/textures/particle_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "/files/textures/particle_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];

	particles = new Particles(22, scene, 5, particleSprites, 15, 50, THREE.NormalBlending);
	particles.settings.gravitateTowardsCamera = true;

	// dark particles
/*	var sprite0 = THREE.ImageUtils.loadTexture( "files/textures/dark_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "files/textures/dark_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "files/textures/dark_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "files/textures/dark_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "files/textures/dark_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];
	particles = new Particles(20, scene, 5, particleSprites, 55, 200);
*/
	// stragglers
	var stragglers = new Stragglers(5, scene, vectors.array);
	stragglers.settings.constantSpeed = 0.7;
	stragglers.settings.capy = 0;

	// some tests
	this.addMoose = function () { that.addAnimal("moose") };
	this.removeMoose = function () { that.removeAnimal("moose") };
	this.addGator = function () { that.addAnimal("gator") };
	this.removeGator = function () { that.removeAnimal("gator") };
	this.addRaven = function () { that.addAnimal("raven") };
	this.removeRaven = function () { that.removeAnimal("raven") };
	this.setTest = function () { that.set("moose|moose|moose|moose|moose|moose|moose|gator|gator|gator|gator|gator|gator|gator|gator|gator|gator|gator|gator|gator|gator|gator|gator|deer|fisha|bearbrown|horse|fox|mountainlion|chow|raven|raven|raven|raven|raven|owl|flamingo|hummingbird|flamingo|owl") };

	that.setLife = function (  ) {
		console.log("set soup type to life");
	};

	that.setDark = function (  ) {
		console.log("set soup type to dark");
	};

	that.addAnimal = function ( id, arrayIndex ) {

		if (id == undefined) {
			id = "moose";
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

	that.removeAnimal = function ( id ) {

		if (id == undefined) {
			id = "moose";
		}

		var geometry = allAnimals[id].geometry;
		var morph = allAnimals[id].index;
		var flying = allAnimals[id].flying;

		if (flying) {
			flyingAnimals.removeAnimal(geometry, morph);
		} else {
			runningAnimals.removeAnimal(geometry, morph);
		}

	};

	that.get = function ( ) {

		var str = "";

		// running
		for (var i=0; i<runningAnimals.array.length; ++i ) {
			var geometry = runningAnimals.array[i].a.mesh.geometry;
			var startMorph = runningAnimals.array[i].startMorph;

			for (var j in allAnimals) {
				var checkGeometry = allAnimals[j].geometry;
				var morph = allAnimals[j].index;

				if (geometry == checkGeometry && startMorph == morph) {
					//console.log("found match "+i+" - "+j);
					str += j+"|";
					break;
				}
			}
		}

		// flying
		for (var i=0; i<flyingAnimals.array.length; ++i ) {
			var geometry = flyingAnimals.array[i].a.mesh.geometry;
			var startMorph = flyingAnimals.array[i].startMorph;

			for (var j in allAnimals) {
				var checkGeometry = allAnimals[j].geometry;
				var morph = allAnimals[j].index;

				if (geometry == checkGeometry && startMorph == morph) {
					//console.log("found match "+i+" - "+j);
					str += j+"|";
					break;
				}
			}
		}

		// remove last pipe
		str = str.substr(0,str.length-1);

		console.log("get = "+str);
		return str;

	}

	that.set = function ( str ) {

		var array = str.split("|");
		console.log(array);

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

	allAnimals.elk = {geometry: null, index: 0, speed: 6, scale: 2.2};
	allAnimals.moose = {geometry: null, index: 0, speed: 13.964, scale: 1.1};
	allAnimals.fisha = {geometry: null, index: 0, speed: 2, scale: 1.6};
	allAnimals.fishb = {geometry: null, index: 1, speed: 2, scale: 1.6};
	allAnimals.fishc = {geometry: null, index: 2, speed: 2, scale: 1.6};
	allAnimals.fishd = {geometry: null, index: 3, speed: 2, scale: 1.6};

	allAnimals.horse = {geometry: null, index: 0, speed: 6.5, scale: 1.5};
	allAnimals.bearbrown = {geometry: null, index: 1, speed: 13.12, scale: 1.5};
	allAnimals.mountainlion = {geometry: null, index: 2, speed: 9.76, scale: 1.5};
	allAnimals.deer = {geometry: null, index: 3, speed: 7.47, scale: 1.5};
	allAnimals.golden = {geometry: null, index: 4, speed: 4.74, scale: 1.5};
	allAnimals.fox = {geometry: null, index: 5, speed: 4.94, scale: 1.5};
	allAnimals.seal = {geometry: null, index: 6, speed: 0.777, scale: 1.5};
	allAnimals.chow = {geometry: null, index: 7, speed: 6.252, scale: 1.5};
	allAnimals.raccoon = {geometry: null, index: 8, speed: 3.412, scale: 1.5};
	allAnimals.rabbit = {geometry: null, index: 9, speed: 5.52, scale: 1.5};
	allAnimals.frog = {geometry: null, index: 10, speed: 5.576, scale: 1.5};

	allAnimals.sockpuppet_jump = {geometry: null, index: 0, speed: 1, scale: 1.5};
	allAnimals.sockpuppet_popup = {geometry: null, index: 0, speed: 0.1, scale: 1.5};

	allAnimals.bearblack = {geometry: null, index: 0, speed: 13.12, scale: 1.7};
	allAnimals.panther = {geometry: null, index: 1, speed: 9.73, scale: 1.7};
	allAnimals.wolf = {geometry: null, index: 2, speed: 6.7, scale: 1.7};
	allAnimals.toad = {geometry: null, index: 3, speed: 3.06, scale: 1.7};

	allAnimals.taruffalo = {geometry: null, index: 0, speed: 9.2, scale: 1.5};
	allAnimals.buffalo = {geometry: null, index: 1, speed: 14.2, scale: 1.5};
	allAnimals.gator = {geometry: null, index: 0, speed: 4.5, scale: 1.55};
	allAnimals.goat = {geometry: null, index: 0, speed: 5.2, scale: 1.65};
	allAnimals.shadow = {geometry: null, index: 0, speed: 3.5, scale: 2.9};
	allAnimals.arm = {geometry: null, index: 0, speed: 2.5, scale: 4.0};

	allAnimals.spider = {geometry: null, index: 0, speed: 1.629, scale: 1.05};
	allAnimals.crab = {geometry: null, index: 1, speed: 3, scale: 1.05};
	allAnimals.scorpion = {geometry: null, index: 2, speed: 1.7, scale: 1.05};

	// birds
	allAnimals.eagle = {geometry: null, index: 0, speed: 4.848, scale: 1.3, flying: true};
	allAnimals.owl = {geometry: null, index: 1, speed: 7, scale: 1.3, flying: true};
	allAnimals.parrot = {geometry: null, index: 2, speed: 7.5, scale: 1.3, flying: true};
	allAnimals.hummingbird = {geometry: null, index: 3, speed: 3.5, scale: 1.3, flying: true};

	allAnimals.flamingo = {geometry: null, index: 0, speed: 8.5, scale: 1.3, flying: true};
	allAnimals.stork = {geometry: null, index: 1, speed: 8.623, scale: 1.3, flying: true};

	allAnimals.raven = {geometry: null, index: 0, speed: 14, scale: 1.55, flying: true};
	allAnimals.vulture = {geometry: null, index: 1, speed: 12, scale: 1.55, flying: true};


	// running animals
	runningAnimals = new AnimalSwarm(30, scene, vectors.array);
	//runningAnimals.settings.addaptiveSpeed = true;
	//runningAnimals.settings.capy = 0;
	//runningAnimals.settings.startPosition = startPosition;
	//runningAnimals.settings.shootRayDown = true;
	//runningAnimals.settings.constantSpeed = 0.75;
	//runningAnimals.settings.switchPosition = true;
	//runningAnimals.settings.gravity = true;

	// preoccupy slots for specific animals - hack...
	// life
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
	runningAnimals.array[28] = "sockpopup";

	// dark
/*	runningAnimals.array[0] = "gator";
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
*/

	loader.load( { model: "/files/models/soup/animals_A_life.js", callback: lifeAnimalsLoadedProxy } );
	loader.load( { model: "/files/models/soup/elk_life.js", callback: elkLoadedProxy } );
	loader.load( { model: "/files/models/soup/moose_life.js", callback: mooseLoadedProxy } );
	loader.load( { model: "/files/models/soup/fish_life.js", callback: fishLoadedProxy } );
	loader.load( { model: "/files/models/soup/sockpuppet_jump.js", callback: sockjumpLoadedProxy } );
	loader.load( { model: "/files/models/soup/sockpuppet_popup.js", callback: sockpopupLoadedProxy } );

	loader.load( { model: "/files/models/soup/taruffalo_black.js", callback: taruffaloLoadedProxy } );
	loader.load( { model: "/files/models/soup/animals_A_black.js", callback: blackAnimalsLoadedProxy } );
	loader.load( { model: "/files/models/soup/gator_black.js", callback: gatorLoadedProxy } );
	loader.load( { model: "/files/models/soup/goat_black.js", callback: goatLoadedProxy } );
	loader.load( { model: "/files/models/soup/shdw2.js", callback: shadowLoadedProxy } );
	loader.load( { model: "/files/models/soup/arm_black.js", callback: armLoadedProxy } );
	loader.load( { model: "/files/models/soup/octo_black.js", callback: octoLoadedProxy } );


	function lifeAnimalsLoadedProxy( geometry ) {
		allAnimals.horse.geometry = geometry;
		allAnimals.bearbrown.geometry = geometry;
		allAnimals.mountainlion.geometry = geometry;
		allAnimals.deer.geometry = geometry;
		allAnimals.golden.geometry = geometry;
		allAnimals.fox.geometry = geometry;
		allAnimals.seal.geometry = geometry;
		allAnimals.chow.geometry = geometry;
		allAnimals.raccoon.geometry = geometry;
		allAnimals.rabbit.geometry = geometry;
		allAnimals.frog.geometry = geometry;

		// regular
		var animal;
		var morphArray = [0,1,0,9,2,2,3,3,4,8,7,9,1,9,5,1,3,0];
		var speedArray = [6.5, 13.12, 9.76, 7.47, 4.74, 4.94, 0.777, 6.252, 3.412, 5.52, 5.576];
		animal = runningAnimals.addAnimal( geometry, null, 1.5, morphArray, speedArray );

		preinitAnimal( animal, shared.renderer, scene );
		// stragglers
		morphArray = [8,5,7,9,10];
		stragglers.addAnimal( geometry, null, 1.6, morphArray, speedArray );
	}

	function elkLoadedProxy( geometry ) {
		allAnimals.elk.geometry = geometry;

		var animal;
		animal = runningAnimals.addAnimal( geometry, "elk", 2.2, null, [6] );

		preinitAnimal( animal, shared.renderer, scene );
	}

	function mooseLoadedProxy( geometry ) {
		allAnimals.moose.geometry = geometry;

		var animal;
		animal = runningAnimals.addAnimal( geometry, "moose", 1.1, null, [13.964] );

		preinitAnimal( animal, shared.renderer, scene );
	}

	function fishLoadedProxy( geometry ) {
		allAnimals.fisha.geometry = geometry;
		allAnimals.fishb.geometry = geometry;
		allAnimals.fishc.geometry = geometry;
		allAnimals.fishd.geometry = geometry;

		var animal;
		var morphArray = [0,1,2,3];
		animal = runningAnimals.addAnimal( geometry, "fish", 1.6, morphArray, [6] );

		runningAnimals.array[8].isFish = true;
		runningAnimals.array[16].isFish = true;

		preinitAnimal( animal, shared.renderer, scene );
	}


	function blackAnimalsLoadedProxy( geometry ) {
		allAnimals.bearblack.geometry = geometry;
		allAnimals.panther.geometry = geometry;
		allAnimals.wolf.geometry = geometry;
		allAnimals.toad.geometry = geometry;

		var animal,
			morphArray = [0,0,1,2,1,2,0,2,3];
		var speedArray = [13.12, 9.73, 6.7, 3.06];

		//animal = runningAnimals.addAnimal( geometry, "animal", 1.7, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	}

	function taruffaloLoadedProxy( geometry ) {
		allAnimals.taruffalo.geometry = geometry;
		allAnimals.buffalo.geometry = geometry;


		var animal,
			morphArray = [0,1,0,1];
		var speedArray = [9.2, 14.2];
		//animal = runningAnimals.addAnimal( geometry, null, 1.5, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	}

	function gatorLoadedProxy( geometry ) {
		allAnimals.gator.geometry = geometry;

		var animal;

		//animal = runningAnimals.addAnimal( geometry, "gator", 1.55, null, [4.5] );
		preinitAnimal( animal, shared.renderer, scene );

	}

	function goatLoadedProxy( geometry ) {
		allAnimals.goat.geometry = geometry;

		var animal;

		//animal = runningAnimals.addAnimal( geometry, "goat", 1.65, null, [5.2] );
		preinitAnimal( animal, shared.renderer, scene );

	}

	function shadowLoadedProxy( geometry ) {
		allAnimals.shadow.geometry = geometry;

		var animal;

		//animal = runningAnimals.addAnimal( geometry, "shadow", 2.9, null, [3.5] );
		preinitAnimal( animal, shared.renderer, scene );

	}

	function armLoadedProxy( geometry ) {
		allAnimals.arm.geometry = geometry;

		var animal;

		//animal = runningAnimals.addAnimal( geometry, "arm", 4.0, null, [2.5] );
		preinitAnimal( animal, shared.renderer, scene );

	}

	function octoLoadedProxy( geometry ) {
		allAnimals.spider.geometry = geometry;
		allAnimals.crab.geometry = geometry;
		allAnimals.scorpion.geometry = geometry;

		var animal,
			morphArray = [0,0,0,2];
		var speedArray = [1.629, 3, 1.7];

		//animal = runningAnimals.addAnimal( geometry, "octo", 1.05, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	}

	function sockjumpLoadedProxy( geometry ) {
		allAnimals.sockpuppet_jump.geometry = geometry;

		var animal;
		animal = runningAnimals.addAnimal( geometry, "sockjump", 1.8, null, [1], true );

		preinitAnimal( animal, shared.renderer, scene );
	}

	function sockpopupLoadedProxy( geometry ) {
		allAnimals.sockpuppet_popup.geometry = geometry;

		var animal;
		animal = runningAnimals.addAnimal( geometry, "sockpopup", 2.0, null, [0.1], true );

		preinitAnimal( animal, shared.renderer, scene );
	}


	// flying animals
	flyingAnimals = new AnimalSwarm(10, scene, vectors.array);
	flyingAnimals.settings.flying = true;
	flyingAnimals.settings.flyingDistance = 65;

	flyingAnimals.array[0] = "b";
	flyingAnimals.array[1] = "b";
	flyingAnimals.array[2] = "b";
	flyingAnimals.array[3] = "b";

	loader.load( { model: "/files/models/soup/birds_A_life.js", callback: birdsALoadedProxy } );
	loader.load( { model: "/files/models/soup/birds_B_life.js", callback: birdsBLoadedProxy } );
	loader.load( { model: "/files/models/soup/birds_A_black.js", callback: birdsABlackLoadedProxy } );

	function birdsALoadedProxy( geometry ) {
		allAnimals.eagle.geometry = geometry;
		allAnimals.owl.geometry = geometry;
		allAnimals.parrot.geometry = geometry;
		allAnimals.hummingbird.geometry = geometry;

		var morphArray = [0,1,2,3,1,2];
		var speedArray = [4.848, 7, 7.5, 3.5];
		flyingAnimals.addAnimal( geometry, null, 1.3, morphArray, speedArray );
	}

	function birdsBLoadedProxy( geometry ) {
		allAnimals.flamingo.geometry = geometry;
		allAnimals.stork.geometry = geometry;

		var morphArray = [0,1,0,1];
		var speedArray = [8.5, 8.623];
		flyingAnimals.addAnimal( geometry, "b", 1.3, morphArray, speedArray );
	}

	function birdsABlackLoadedProxy( geometry ) {
		allAnimals.raven.geometry = geometry;
		allAnimals.vulture.geometry = geometry;

		var animal,
			morphArray = [1,1,0,0,1,0,0,1,0,0];
		var speedArray = [12, 14];

		//animal = flyingAnimals.addAnimal( geometry, null, 1.55, morphArray, speedArray );
		preinitAnimal( animal, shared.renderer, scene );

	}

	// butterflys
/*	var butterflysD = new AnimalInFrontOfCamera(15, scene);
	loader.load( { model: "/files/models/soup/butterfly_hiD.js", callback: butterflysD.addAnimal } );
	var butterflysC = new AnimalInFrontOfCamera(15, scene);
	loader.load( { model: "/files/models/soup/butterfly_hiC.js", callback: butterflysC.addAnimal } );
*/

	// life trail - of grass/trees/etc
	var trail = new Trail(80, scene);
	trail.settings.freeRotation = false;
	trail.settings.offsetAmount = 10;

	// preoccupy for differnt grass
	for (i=0; i<80; ++i ) {
		var type = i%4;
		trail.array[i] = "0"+(type+1);
		//trail.array[i] = "05";

	}
	// preoccupy slots for trees and lighthouse
	for (i=0; i<80; i+=8 ) {
		var type = (i/8)%4;
		trail.array[i] = "tree"+(type+1);
	}
	trail.array[4] = "light";

	loader.load( { model: "/files/models/soup/grass01.js", callback: grass01LoadedProxy } );
	loader.load( { model: "/files/models/soup/grass02.js", callback: grass02LoadedProxy } );
	loader.load( { model: "/files/models/soup/grass03.js", callback: grass03LoadedProxy } );
	loader.load( { model: "/files/models/soup/grassFlower.js", callback: grass04LoadedProxy } );
	//loader.load( { model: "/files/models/soup/grassFlower.js", callback: grass05LoadedProxy } );

	loader.load( { model: "/files/models/soup/evergreen_low.js", callback: treeALoadedProxy } );
	loader.load( { model: "/files/models/soup/evergreen_high.js", callback: treeBLoadedProxy } );
	loader.load( { model: "/files/models/soup/treeGeneric.js", callback: treeCLoadedProxy } );
	loader.load( { model: "/files/models/soup/treeGenericLower.js", callback: treeDLoadedProxy } );
	loader.load( { model: "/files/models/soup/treeOrange.js", callback: treeELoadedProxy } );

	// lighthouse
	loader.load( { model: "/files/models/soup/lighthouse.js", callback: ligthhouseLoadedProxy } );

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
		trail.array[4].maxHeight = 12;
	}

	// dark trail
	// trail - of grass/trees/etc
/*	var trailMaterials = [new THREE.MeshLambertMaterial( { color: 0x000000 } ),
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

		trail.array[i] = "04";

	}

	trail.settings.spread = 25;
	//trail.settings.aliveDivider = 40;
	trail.settings.tweenTime = 400;
	trail.settings.scale = 25.0;
	trail.settings.offsetAmount = 10;

	loader.load( { model: "/files/models/soup/darkBlob4.js", callback: blob04LoadedProxy } );

	function blob04LoadedProxy( geometry ) {

		var object = trail.addInstance( geometry, "04", false, false, trailMaterials );
		preInitModel( geometry, renderer, scene, object );

	}
*/
	//setupGui();


	this.update = function ( delta ) {

		//console.log(ribbons.settings.ribbonMin);

		// update to reflect _real_ camera position
		shared.camPos.x = camera.matrixWorld.n14;
		shared.camPos.y = camera.matrixWorld.n24;
		shared.camPos.z = camera.matrixWorld.n34;

		r += 0.012;

		spawnAnimal += delta;
		spawnBird += delta;

		// spawn animal test
		if (spawnAnimal >= 70) {
			runningAnimals.create(vectors.array[1].position, collisionScene.currentNormal);
			//runningAnimals.create(vectors.array[1].position, collisionScene.currentNormal, vectors.array[0].position);
			spawnAnimal = 0;
		}
		if (spawnBird >= 300) {
			flyingAnimals.create(vectors.array[1].position, collisionScene.currentNormal);
			spawnBird = 0;

			stragglers.create(collisionScene.emitterFollow.position, collisionScene.currentNormal, collisionScene.emitter.position);
		}

		// update the soup parts
		collisionScene.update(shared.camPos, delta);

		if (runInCircle) {
			var pulse = Math.sin(r*2)*80;
			var distance = 280;
			collisionScene.emitter.position.x = Math.cos( r )*(distance-pulse);
			collisionScene.emitter.position.z = Math.sin( r )*(distance-pulse);
			collisionScene.emitterFollow.position.x = collisionScene.emitter.position.x;
			collisionScene.emitterFollow.position.z = collisionScene.emitter.position.z;
		}

		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		//ribbons.update(collisionScene.emitterFollow.position);
		particles.update(delta, vectors.array[0].position, shared.camPos);
		runningAnimals.update(delta, shared.camPos);
		flyingAnimals.update(delta, shared.camPos);
		stragglers.update(delta, shared.camPos);
		//butterflysC.update(shared.camPos, camera.theta, delta);
		//butterflysD.update(shared.camPos, camera.theta, delta, true);

		trail.update(collisionScene.emitter.position, collisionScene.emitterNormal, shared.camPos, delta);

		TWEEN.update();

		// update for the green stuff shader
		/*shared.targetStart.x = vectors.array[3].position.x;
		shared.targetStart.y = vectors.array[3].position.y;
		shared.targetStart.z = vectors.array[3].position.z;

		shared.targetEnd.x = vectors.array[20].position.x;
		shared.targetEnd.y = vectors.array[20].position.y;
		shared.targetEnd.z = vectors.array[20].position.z;

		// pointlight
		pointLight.position.x = collisionScene.emitterFollow.position.x;
		pointLight.position.y = collisionScene.emitterFollow.position.y+50;
		pointLight.position.z = collisionScene.emitterFollow.position.z;*/
	}


	function reset () {
		shared.camPos = new THREE.Vector3( 0, 20, 50 );

		collisionScene.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		vectors.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		runningAnimals.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		flyingAnimals.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);
		particles.reset(shared.camPos.x,shared.camPos.y,shared.camPos.z);

	}


	this.destruct = function () {

	}

	function setupGui () {

		/*function toggle( e ) {

			if( e.style.display == "block" )
				e.style.display = "none";
			else
				e.style.display = "block";

		}

		effectController = {

			ribbon_function: function() { for( var i = 0; i < ribbon_array.length; i++ ) toggle( ribbon_array[ i ].domElement ); },
			running_function: function() { for( var i = 0; i < running_array.length; i++ ) toggle( running_array[ i ].domElement ); },
			flying_function: function() { for( var i = 0; i < flying_array.length; i++ ) toggle( flying_array[ i ].domElement ); },
			particle_function: function() { for( var i = 0; i < particle_array.length; i++ ) toggle( particle_array[ i ].domElement ); },
			trail_function: function() { for( var i = 0; i < trail_array.length; i++ ) toggle( trail_array[ i ].domElement ); },

		};


		if (ribbons) {

			// ribbons
			h  = gui.add( effectController, "ribbon_function" ).name( "Ribbons" );

			r0 = gui.add( ribbons.settings, 'ribbonPulseMultiplier_1', 1, 15 ).name( 'ribbonPulse_1' );
			r1 = gui.add( ribbons.settings, 'ribbonPulseMultiplier_2', 1, 15 ).name( 'ribbonPulse_2' );
			r2 = gui.add( ribbons.settings, 'ribbonMin', 1, 15 ).name( 'ribbonMin' );
			r3 = gui.add( ribbons.settings, 'ribbonMax', 1, 15 ).name( 'ribbonMax' );
			r4 = gui.add( ribbons.settings, 'visible' ).name( 'visible' );

			ribbon_array = [ r0, r1, r2, r3, r4 ];

			setGuiHeaderStyle( h, 201, 100, 78 );
			setGuiElementStyle( ribbon_array, 201, 100, 78, "block" );

		}

		if (runningAnimals) {

			// running animals
			h  = gui.add( effectController, "running_function" ).name( "Running animals" );

			r0 = gui.add( runningAnimals.settings, 'divider', 1, 15 ).name( 'divider' );
			r1 = gui.add( runningAnimals.settings, 'flying' ).name( 'flying' );
			r2 = gui.add( runningAnimals.settings, 'xPositionMultiplier', 10, 150, 1 ).name( 'xPositionMultiplier' );
			r3 = gui.add( runningAnimals.settings, 'zPositionMultiplier', 10, 150, 1 ).name( 'zPositionMultiplier' );
			r4 = gui.add( runningAnimals.settings, 'visible' ).name( 'visible' );

			running_array = [ r0, r1, r2, r3, r4 ];

			setGuiHeaderStyle( h, 201, 100, 68 );
			setGuiElementStyle( running_array, 201, 100, 68, "block" );

		}

		if (flyingAnimals) {

			// flying animals
			h  = gui.add( effectController, "flying_function" ).name( "Flying animals" );

			r0 = gui.add( flyingAnimals.settings, 'divider', 1, 15 ).name( 'divider' );
			r1 = gui.add( flyingAnimals.settings, 'flying' ).name( 'flying' );
			r2 = gui.add( flyingAnimals.settings, 'xPositionMultiplier', 10, 150, 1 ).name( 'xPositionMultiplier' );
			r3 = gui.add( flyingAnimals.settings, 'zPositionMultiplier', 10, 150, 1 ).name( 'zPositionMultiplier' );
			r4 = gui.add( flyingAnimals.settings, 'visible' ).name( 'visible' );

			flying_array = [ r0, r1, r2, r3, r4 ];

			setGuiHeaderStyle( h, 201, 100, 58 );
			setGuiElementStyle( flying_array, 201, 100, 58, "block" );

		}

		if (particles) {

			// particles
			h  = gui.add( effectController, "particle_function" ).name( "Particles" );

			r0 = gui.add( particles.settings, 'aliveDivider', 1, 15 ).name( 'aliveDivider' );
			r1 = gui.add( particles.settings, 'zeroAlphaStart' ).name( 'zeroAlphaStart' );
			r2 = gui.add( particles.settings, 'visible' ).name( 'visible' );

			particle_array = [ r0, r1, r2 ];

			setGuiHeaderStyle( h, 201, 100, 48 );
			setGuiElementStyle( particle_array, 201, 100, 48, "block" );

		}

		if (trail) {

			// particles
			h  = gui.add( effectController, "trail_function" ).name( "Trail" );

			r0 = gui.add( trail.settings, 'visible' ).name( 'visible' );

			trail_array = [ r0 ];

			setGuiHeaderStyle( h, 201, 100, 38 );
			setGuiElementStyle( trail_array, 201, 100, 38, "block" );

		}
		*/
		gui.show();

	}

	/*function setGuiHeaderStyle( g, h, s, v ) {

		var color = "hsl(" + h + "," + s + "%, " + v + "%)";

		g.domElement.style.borderLeft = "solid 5px " + color;
		g.domElement.style.background = color;
		g.domElement.style.fontWeight = "bold";

	}

	function setGuiElementStyle( a, h, s, v, display ) {

		var s, color = "hsl(" + h + "," + s + "%, " + v + "%)";

		for( i = 0; i < a.length; i++ ) {

			s = a[ i ].domElement.style;
			s.borderLeft = "solid 5px " + color;
			s.display = display ? display : "none";

		}

	}*/

};
