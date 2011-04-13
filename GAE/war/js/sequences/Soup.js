var Soup = function ( camera, scene, shared ) {

	var that = this;
	var r = 0;

	// init
	camPos = new THREE.Vector3( 0, 20, 0 );
	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	var pointLight = new THREE.PointLight( 0xeeffee, 4, 150 );
	pointLight.position.x = camPos.x;
	pointLight.position.y = camPos.y;
	pointLight.position.z = camPos.z;
	scene.addLight( pointLight, 1.0 );

	shared.targetStart = new THREE.Vector3();
	shared.targetEnd = new THREE.Vector3();

	// refactoring

	// setup the different parts of the soup

	// collision scene
	var collisionScene = new CollisionScene( camera, shared, 1500 );
	collisionScene.settings.capBottom = 0;
/*	loader.load( { model: "files/models/city/City_Shadow.js", callback: collisionLoadedProxy } );

	function collisionLoadedProxy( geometry ) {
		collisionScene.addLoaded( geometry, 0.1 );
	}
*/
	// vector trail
	var vectors = new Vectors();

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

	

	setupGui();


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
		
		r += 0.015;

		// update the soup parts	
		collisionScene.update(camPos, delta);

		var pulse = Math.sin(r*2)*70;
		collisionScene.emitter.position.x = 100+Math.cos( r )*(180+pulse);
		collisionScene.emitter.position.z = Math.sin( r )*(180+pulse);
		collisionScene.emitterFollow.position.x = collisionScene.emitter.position.x;
		collisionScene.emitterFollow.position.z = collisionScene.emitter.position.z;

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

	function setupGui () {

		function toggle( e ) {
		
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

		gui.show();

	}

	function setGuiHeaderStyle( g, h, s, v ) {

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

	}

}
