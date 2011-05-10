var Soup = function ( camera, scene, shared ) {

	var that = this;
	var r = 0;

	// init
	camPos = new THREE.Vector3( 0, 20, 0 );
	var loader = new THREE.JSONLoader();
	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	var pointLight = new THREE.PointLight( 0xeeffee, - 2.25, 800 );
	pointLight.position.x = camPos.x;
	pointLight.position.y = camPos.y;
	pointLight.position.z = camPos.z;
//	scene.addLight( pointLight, 1.0 );

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
	var collisionScene = new CollisionScene( camera, scene, 1.0, shared, 2500 );
	collisionScene.settings.capBottom = 0;
/*	loader.load( { model: "/files/models/city/City_Shadow.js", callback: collisionLoadedProxy } );

	function collisionLoadedProxy( geometry ) {
		collisionScene.addLoaded( geometry, 0.1 );
	}
*/
	// vector trail
	vectors = new Vectors();

	// ribbons
	var ribbonMaterials = [
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

	// particles
	var sprite0 = THREE.ImageUtils.loadTexture( "/files/textures/dark_0.png" );
	var sprite1 = THREE.ImageUtils.loadTexture( "/files/textures/dark_1.png" );
	var sprite2 = THREE.ImageUtils.loadTexture( "/files/textures/dark_2.png" );
	var sprite3 = THREE.ImageUtils.loadTexture( "/files/textures/dark_3.png" );
	var sprite4 = THREE.ImageUtils.loadTexture( "/files/textures/dark_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];
	particles = new Particles(20, scene, 8, particleSprites, 15, 80);
	particles.settings.zeroAlphaStart = false;
	particles.settings.aliveDivider = 3;

	// running animals
	runningAnimals = new AnimalSwarm(40, scene, vectors.array);
	runningAnimals.settings.xPositionMultiplier = 90;
	runningAnimals.settings.zPositionMultiplier = 60;
	//runningAnimals.settings.constantSpeed = 2.0

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

	loader.load( { model: "/files/models/soup/bison.js", callback: bisonLoadedProxy } );
	loader.load( { model: "/files/models/soup/gator.js", callback: gatorLoadedProxy } );
	loader.load( { model: "/files/models/soup/wolf.js", callback: wolfLoadedProxy } );
	loader.load( { model: "/files/models/soup/goat.js", callback: goatLoadedProxy } );
	loader.load( { model: "/files/models/soup/arm.js", callback: armLoadedProxy } );

	var colorArray = [ new THREE.Color( 0x101010 ),
					   new THREE.Color( 0x111111 ),
					   new THREE.Color( 0x010101 )
					 ];

	function bisonLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, null, 1.2, null, 4, colorArray );
	}

	function gatorLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "gator", 1.5, null, 4, colorArray );
	}

	function wolfLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "wolf", 2.0, null, 4, colorArray );
	}

	function goatLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "goat", 2.0, null, 4, colorArray );
	}

	function armLoadedProxy( geometry ) {
		runningAnimals.addAnimal( geometry, "arm", 4.0, null, 4, colorArray );
	}


	// flying animals
	flyingAnimals = new AnimalSwarm(10, scene, vectors.array);
	flyingAnimals.settings.flying = true;
	flyingAnimals.settings.xPositionMultiplier = 70;
	flyingAnimals.settings.zPositionMultiplier = 60;
	flyingAnimals.settings.constantSpeed = 2.0;
	flyingAnimals.settings.divider = 4;

	loader.load( { model: "/files/models/soup/vulture_raven.js", callback: birdsALoadedProxy } );
	
	function birdsALoadedProxy( geometry ) {
		var morphArray = [1,1,0,0,1,0,0,1,0,0];
		flyingAnimals.addAnimal( geometry, null, 1.2, morphArray, 0.8, colorArray );
	}

	// butterflys
	var butterflys = new AnimalInFrontOfCamera(30, scene);
	loader.load( { model: "/files/models/soup/butterfly_hiA.js", callback: butterflys.addAnimal } );
	
	// trail - of grass/trees/etc
	var trailMaterials = [new THREE.MeshLambertMaterial( { color: 0x000000, shading: THREE.FlatShading } ),
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

	loader.load( { model: "/files/models/soup/grass.js", callback: grassLoadedProxy } );

	function grassLoadedProxy( geometry ) {
		trail.addInstance( geometry, null, false, trailMaterials );
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

		var pulse = Math.sin(r*2)*100;
		var distance = 280;
		collisionScene.emitter.position.x = 80+Math.cos( r )*(distance-pulse);
		collisionScene.emitter.position.z = Math.sin( r )*(distance-pulse);
		collisionScene.emitterFollow.position.x = collisionScene.emitter.position.x;
		collisionScene.emitterFollow.position.z = collisionScene.emitter.position.z;

		vectors.update(collisionScene.emitterFollow.position, collisionScene.currentNormal);
		ribbons.update(collisionScene.emitterFollow.position);
		particles.update(delta, vectors.array[5].position);
		runningAnimals.update();
		flyingAnimals.update();
		butterflys.update(camPos, camera.theta, delta);
		trail.update(vectors.array[5].position, collisionScene.currentNormal, camPos, delta);
		
		TWEEN.update();

		// update for the green stuff shader
		shared.targetStart.x = vectors.array[3].position.x;
		shared.targetStart.y = vectors.array[3].position.y;
		shared.targetStart.z = vectors.array[3].position.z;

		shared.targetEnd.x = vectors.array[20].position.x;
		shared.targetEnd.y = vectors.array[20].position.y;
		shared.targetEnd.z = vectors.array[20].position.z;

		// pointlight
		pointLight.position.x = collisionScene.emitterFollow.position.x;
		pointLight.position.y = collisionScene.emitterFollow.position.y+50;
		pointLight.position.z = collisionScene.emitterFollow.position.z;
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
			trail_function: function() { for( var i = 0; i < trail_array.length; i++ ) toggle( trail_array[ i ].domElement ); }
			
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
