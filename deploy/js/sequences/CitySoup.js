var CitySoup = function ( camera, scene, shared ) {

	var that = this;

	// soup settings
	var initSettings = {
		numOfVectors : 30,
		numOfRibbons : 6,
		numOfAnimals : 30,
		numOfFlyingAnimals : 20,
		numOfParticleSystems : 25,
		ribbonMaterials : [
			[ new THREE.MeshLambertMaterial( { color:0xf89010 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0x98f800 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0x5189bb } ) ],
			[ new THREE.MeshLambertMaterial( { color:0xe850e8 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0xf1f1f1 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0x08a620 } ) ]
			  ],
	}

	var settings = {
		vectorDivider : 4,
		emitterDivider : 5,
		flyingAnimalDivider : 3,
		ribbonPulseMultiplier_1 : 5.5,
		ribbonPulseMultiplier_2 : 5.5,
		flyingAnimalPulseMultiplier_1 : 10,
		animalSpeed : 14,
		ribbonMin : 1.5,
		ribbonMax : 3,
		collisionDistance : 350,
	}

/*	gui.add( settings, 'vectorDivider', 1, 8).name( 'vectorDivider' );
	gui.add( settings, 'emitterDivider', 1, 8).name( 'emitterDivider' );
	gui.add( settings, 'flyingAnimalDivider', 1, 8).name( 'flyingAnimalDivider' );
	gui.add( settings, 'ribbonPulseMultiplier_1', 3, 15).name( 'ribbonPulse_1' );
	gui.add( settings, 'ribbonPulseMultiplier_2', 5, 15).name( 'ribbonPulse_2' );
	gui.add( settings, 'flyingAnimalPulseMultiplier_1', 10, 20).name( 'butterflyPulse_1' );
	gui.add( settings, 'animalSpeed', 8, 96).name( 'animalSpeed' );
	gui.add( settings, 'ribbonMin', 0.05, 8).name( 'ribbonMin' );
	gui.add( settings, 'ribbonMax', 1, 16).name( 'ribbonMax' );
	gui.add( settings, 'collisionDistance', 100, 600).name( 'collisionDistance' );
*/
	// init

	var mouseX, mouseY;

	onMouseMoved();
	shared.signals.mousemoved.add( onMouseMoved );

	var vectorArray = [];
	var ribbonArray = [];
	var ribbonMeshArray = [];

	var animalArray = [];
	var particleArray = [];
	var flyingArray = [];
	var butterflyArray = [];
	var grassArray = [];
	var particleArray = [];

	var butterflyContainer;
	var currentNormal = new THREE.Vector3( 0, 1, 0 );
	var r = 0;
	camPos = new THREE.Vector3( 0, 20, 0 );

	var pointLight = new THREE.PointLight( 0xeeffee, 4, 150 );
	pointLight.position.x = camPos.x;
	pointLight.position.y = camPos.y;
	pointLight.position.z = camPos.z;
	scene.addLight( pointLight, 1.0 );
	
	// vectors
	for ( var i = 0; i < initSettings.numOfVectors + 20; ++i ) {

		var x = camPos.x;
		var y = camPos.y;
		var z = camPos.z;

		var obj = { x: x, y: y, z: z, lastx: x, lasty: y, lastz: z, normalx: 0, normaly: 0, normalz: 0, scale: 1 };
		vectorArray.push(obj);

	}

	// ribbons
	for ( var k = 0; k < initSettings.numOfRibbons; ++k ) {

		var ribbon = new Ribbon( 15, 6, initSettings.numOfVectors - 2 );
		var ribbonMesh = new THREE.Mesh( ribbon, initSettings.ribbonMaterials[ k % 6 ] );
		ribbonMesh.doubleSided = true;
		scene.addObject( ribbonMesh );

		var offset = Math.floor( Math.random()*10 );

		var obj = {r:ribbon, rm:ribbonMesh, offset:offset}

		ribbonArray.push(obj);
		ribbonMeshArray.push(ribbonMesh);

	}

	// particles
	var geometry = new THREE.Geometry();

	for (var i = 0; i < 100; i++) {
		var vector = new THREE.Vector3( Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25 );
		geometry.vertices.push( new THREE.Vertex( vector ) );
	}

	var sprite0 = ImageUtils.loadTexture( "files/textures/particle_0.png" );
	var sprite1 = ImageUtils.loadTexture( "files/textures/particle_1.png" );
	var sprite2 = ImageUtils.loadTexture( "files/textures/particle_2.png" );
	var sprite3 = ImageUtils.loadTexture( "files/textures/particle_3.png" );
	var sprite4 = ImageUtils.loadTexture( "files/textures/particle_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];

	for (var i = 0; i < initSettings.numOfParticleSystems; i++) {
		var particleMaterial = new THREE.ParticleBasicMaterial( { size: 4, map: particleSprites[i%5], transparent: true, depthTest: false, blending: THREE.AdditiveBlending } );

		var particles = new THREE.ParticleSystem( geometry, particleMaterial );
		particles.rotation.x = Math.random() * Math.PI;
		particles.rotation.y = Math.random() * Math.PI;
		particles.rotation.z = Math.random() * Math.PI;

		var x = camPos.x-100;
		var y = camPos.y-100;
		var z = camPos.z;

		particles.position.x = x;
		particles.position.y = y;
		particles.position.z = z;

		var obj = {c:particles, alivetime:i, x:x, y:y, z:z};
		particleArray.push(obj);

		scene.addObject( particles );

	}

	// animals
	var loader = new THREE.JSONLoader();

	loader.onLoadStart = function () { shared.signals.loadItemAdded.dispatch() };
	loader.onLoadComplete = function () { shared.signals.loadItemCompleted.dispatch() };

	loader.load( { model: "files/models/soup/animals_A_life.js", callback: animalLoaded } );
	loader.load( { model: "files/models/soup/elk_life.js", callback: elkLoaded } );
	loader.load( { model: "files/models/soup/moose_life.js", callback: mooseLoaded } );
	loader.load( { model: "files/models/soup/birds_A_life.js", callback: flyingLoaded } );
	loader.load( { model: "files/models/soup/birds_B_life.js", callback: flyingLoaded } );
	// butterfly
	loader.load( { model: "files/models/soup/butterfly_hiA.js", callback: butterflyLoaded } );

	// occupy for elks and mooses hack..
	animalArray[0] = "elk";
	animalArray[1] = "moose";
	animalArray[4] = "moose";
	animalArray[10] = "elk";
	animalArray[14] = "moose";
	animalArray[20] = "elk";

	// grass
	loader.load( { model: "files/models/soup/grass.js", callback: grassLoaded } );
	// tree
	var treeCount = 0;
	loader.load( { model: "files/models/soup/evergreen_low.js", callback: treeLoaded } );
	loader.load( { model: "files/models/soup/evergreen_high.js", callback: treeLoaded } );
	loader.load( { model: "files/models/soup/tree_Generic.js", callback: treeLoaded } );
	// lighthouse
	loader.load( { model: "files/models/soup/lighthouse.js", callback: ligthhouseLoaded } );

	var grassMaterials = [new THREE.MeshLambertMaterial( { color: 0x83b95b, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x93c171, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x7eaa5e, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x77bb45, shading: THREE.FlatShading } ),
					 new THREE.MeshLambertMaterial( { color: 0x7da75e, shading: THREE.FlatShading } )
	];

	// collisionScene stuff should probably not be here (TEMP)
	var FLOOR = 0;
	var collisionScene = new THREE.Scene();

	var plane = new Plane( 100, 100, 1, 1 );
	var invMaterial = new THREE.MeshBasicMaterial( { color:0x0000DE, opacity: 1.0 } );

	var downPlane = addMesh( plane, 200,  0, FLOOR, 0, -1.57,0,0, invMaterial, true );
	var rightPlane = addMesh( plane, 200,  camPos.x+settings.collisionDistance, camPos.y, camPos.z, 0,-1.57,0, invMaterial, false );
	var leftPlane = addMesh( plane, 200,  camPos.x-settings.collisionDistance, camPos.y, camPos.z, 0,1.57,0, invMaterial, false );
	var frontPlane = addMesh( plane, 200,  camPos.x, camPos.y, camPos.z-settings.collisionDistance, 0,0,-1.57, invMaterial, false );
	var backPlane = addMesh( plane, 200,  camPos.x, camPos.y, camPos.z+settings.collisionDistance, 0,3.14,1.57, invMaterial, false );
	var upPlane = addMesh( plane, 200,  0, FLOOR+(settings.collisionDistance*1.5), 0, 1.57,0,0, invMaterial, false );

	// shadow as collsion for now
	loader.load( { model: 'files/models/city/City_Shadow.js', callback: function( geometry ) {

		var shadowMesh = new THREE.Mesh( geometry, invMaterial );
		shadowMesh.scale.x = shadowMesh.scale.y = shadowMesh.scale.z = 0.1;
		
		collisionScene.addObject( shadowMesh );

	} } );
	// ---

	// emitter
	var projector = new THREE.Projector();
	var emitter = new Cube( 10, 10, 10 );
	var emitterMesh = addMesh( emitter, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0xFFFF33 } ) );
	var emitterFollow = addMesh( emitter, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0x3333FF } ) );

	// follow test with turn constraints
	var pi = Math.PI;
	var pi2 = pi*2;
	var degToRad = pi/180;

	var rotationLimit = 8;
	var innerRadius = 0;
	var outerRadius = 1;

	emitterFollow.rotationy = 0;
	emitterFollow.rotationx = 0;
	emitterFollow.rotationz = 0;


	this.update = function ( delta ) {

		// update to reflect _real_ camera position
		camPos.x = camera.matrixWorld.n14;
		camPos.y = camera.matrixWorld.n24;
		camPos.z = camera.matrixWorld.n34;

		// temp reset
		if (camPos.z <= -3260) {
			reset();
		}
		
		// collisionScene stuff should probably not be here (TEMP)
		rightPlane.position.x = camPos.x+settings.collisionDistance;
		leftPlane.position.x = camPos.x-settings.collisionDistance;
		frontPlane.position.z = camPos.z-settings.collisionDistance*1.4;
		backPlane.position.z = camPos.z+settings.collisionDistance;
		// ---
		
		r += 0.1;

		updateEmitter( delta );
		runAll( delta );
		TWEEN.update();

		// slight camera roll
		if (camera.animationParent) {
			camera.animationParent.rotation.z = (camera.target.position.x)/800;
		}


		for (var k=0; k<ribbonArray.length; ++k ) {
			var ribbon = ribbonArray[k].r;
			ribbon.__dirtyVertices = true;
		}

		// collisionScene stuff should probably not be here (TEMP)
		renderer.render( collisionScene, camera );
		//renderer.render( collisionScene, camera, renderTarget );
		renderer.clear();
		// ---

	}

	function animalLoaded( geometry ) {
		
		var numArray = [0,0,4,3,2,1,0,1,2,7,3,4,1,0,0,5,6,2,4,3];

		for ( var i = 0; i < initSettings.numOfAnimals; ++i ) {
			
			if (animalArray[i] != undefined) {
				continue;
			}

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;

			var followIndex = Math.floor(i/4);

			var scale = 0.02+(Math.random()/8);
			if (i<2) {
				scale = 0.15;
				followIndex = i;
			}
			scale = Math.max(scale, 0.1);

			var x = camPos.x;
			var y = camPos.y;
			var z = camPos.z;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			mesh.matrixAutoUpdate = false;

			scene.addChild( mesh );
			var num = numArray[i%numArray.length];
			animal.play( animal.availableAnimals[ num ], animal.availableAnimals[ Math.round(Math.random()*7) ], 0, Math.random() );

			var count = Math.random();
			if (i<2) {
				count = 0;
			}

			var obj = { c: mesh, a: animal, x: x, y: y, z: z, f: followIndex, count: count, scale: scale * 1.2 };

			animalArray[i] = obj;

		}

	}

	function elkLoaded( geometry ) {

		for ( var i = 0; i < initSettings.numOfAnimals; ++i ) {
			
			if (animalArray[i] != "elk") {
				continue;
			}

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;

			var followIndex = Math.floor(i/4);

			var scale = 0.02+(Math.random()/8);
			scale = Math.max(scale, 0.1);

			var x = camPos.x;
			var y = camPos.y;
			var z = camPos.z;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			mesh.matrixAutoUpdate = false;

			scene.addChild( mesh );
			animal.play( animal.availableAnimals[ 0 ], animal.availableAnimals[ 0 ], 0, Math.random() );

			var count = 0;

			var obj = { c: mesh, a: animal, x: x, y: y, z: z, f: followIndex, count: count, scale: scale * 2.2 };

			animalArray[i] = obj;

		}

	}

	function mooseLoaded( geometry ) {

		for ( var i = 0; i < initSettings.numOfAnimals; ++i ) {
			
			if (animalArray[i] != "moose") {
				continue;
			}

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;

			var followIndex = Math.floor(i/4);

			var scale = 0.02+(Math.random()/8);
			scale = Math.max(scale, 0.1);

			var x = camPos.x;
			var y = camPos.y;
			var z = camPos.z;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			mesh.matrixAutoUpdate = false;

			scene.addChild( mesh );
			animal.play( animal.availableAnimals[ 0 ], animal.availableAnimals[ 0 ], 0, Math.random() );

			var count = 0;

			var obj = { c: mesh, a: animal, x: x, y: y, z: z, f: followIndex, count: count, scale: scale * 1.1 };

			animalArray[i] = obj;

		}

	}

	function flyingLoaded( geometry ) {

		//var numArray = [1,1,0,2,1,3,3,1,0,0,3,2,1,2,0,3,0,1,1,0];
		var numArray = [1,1,0,0,1,0,0,1,0,0,0,0,1,1,0,1,0,1,1,0];

		for ( var i = 0; i < Math.floor(initSettings.numOfFlyingAnimals/2); ++i ) {

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;

			var followIndex = Math.floor(flyingArray.length/3);

			var scale = 0.02+(Math.random()/14);

			var x = camPos.x;
			var y = camPos.y;
			var z = camPos.z;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			mesh.matrixAutoUpdate = false;

			scene.addChild( mesh );
			var num = numArray[i%numArray.length];
			animal.play( animal.availableAnimals[ num ], animal.availableAnimals[ num ], 0, Math.random() );

			var obj = { c: mesh, a: animal, x: x, y: y, z: z, f: followIndex, scale:scale * 1.5 };

			flyingArray.push(obj);

		}

	}

	function butterflyLoaded( geometry ) {

		var container = new Cube( 10, 10, 10 );
		butterflyContainer = new THREE.Mesh( container );
		scene.addChild( butterflyContainer );

		for ( var i = 0; i < 30; ++i ) {

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;

			var scale = 0.02+(Math.random()/8);

			var x = (Math.random()*80)-40;
			var y = (Math.random()*100);
			var z = (Math.random()*80)-40;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			butterflyContainer.addChild( mesh );
			
			animal.animalA.timeScale = 1.5;
			animal.animalB.timeScale = 1.5;

			var num = 0//Math.round(Math.random()*3);
			animal.play( animal.availableAnimals[ num ], animal.availableAnimals[ num ], 0, Math.random() );

			var obj = { c: mesh, a: animal, x: x, y: y, z: z, scale:scale * 1.5 };

			butterflyArray.push(obj);

		}

	}

	function grassLoaded( geometry ) {

		for (var i=0; i<150; ++i ) {

			var occupied = i%10;
			
			if (occupied == 0) {
				//console.log("grass skipping "+i);
				continue;
			}

			var x = 0;
			var y = FLOOR;
			var z = 0;

			var c = new THREE.Mesh( geometry, grassMaterials[i%5] );

			var obj = {c:c, scale:0, alivetime:i, normal:new THREE.Vector3(), tree:false, maxHeight:0};
			
			scene.addObject(c);
			c.scale.x = c.scale.y = c.scale.z = 0.00000001;
			grassArray[i] = obj;

		}

	}

	function treeLoaded( geometry ) {

		for (var i=treeCount; i<15; i+=3 ) {

			var x = 0;
			var y = FLOOR;
			var z = 0;

			var c = new THREE.Mesh( geometry, grassMaterials[i%5] );
			scene.addObject(c);

			var realindex = i*10;

			var obj = {c:c, scale:0, alivetime:realindex, normal:new THREE.Vector3(), tree:true, maxHeight:Math.min(Math.random()+0.5,1.0)};
			grassArray[realindex] = obj;

		}
		
		++treeCount;

	}


	function ligthhouseLoaded( geometry ) {

			var x = 0;
			var y = FLOOR;
			var z = 0;

			var c = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } ) );
			scene.addObject(c);

			var realindex = 8;

			var obj = {c:c, scale:0, alivetime:realindex, normal:new THREE.Vector3(), tree:true, lighthouse:true, maxHeight:3};
			grassArray[realindex] = obj;

	}




	function runAll ( delta ) {

		for (var k=0; k<ribbonArray.length; ++k ) {
			var ribbonMesh = ribbonArray[k].rm;
			ribbonMesh.position = emitterMesh.position;
		}

		for (var i=0; i<vectorArray.length; ++i ) {
			var obj = vectorArray[i];
			var x = obj.x;
			var y = obj.y;
			var z = obj.z;
			var scale = obj.scale;
			var lastx = x;
			var lasty = y;
			var lastz = z;

			var normalx = obj.normalx;
			var normaly = obj.normaly;
			var normalz = obj.normalz;

			if (i == 0) {
				var tox = emitterFollow.position.x;
				var toy = emitterFollow.position.y;
				var toz = emitterFollow.position.z;

				var tonormalx = currentNormal.x;
				var tonormaly = currentNormal.y;
				var tonormalz = currentNormal.z;

			} else {
				var tox = vectorArray[i-1].lastx;
				var toy = vectorArray[i-1].lasty;
				var toz = vectorArray[i-1].lastz;

				var tonormalx = vectorArray[i-1].normalx;
				var tonormaly = vectorArray[i-1].normaly;
				var tonormalz = vectorArray[i-1].normalz;

			}

			var moveX = (tox-x)/settings.vectorDivider;
			var moveY = (toy-y)/settings.vectorDivider;
			var moveZ = (toz-z)/settings.vectorDivider;

			x += moveX;
			y += moveY;
			z += moveZ;

			var moveNormalX = (tonormalx-normalx)/10;
			var moveNormalY = (tonormaly-normaly)/10;
			var moveNormalZ = (tonormalz-normalz)/10;

			normalx += moveNormalX;
			normaly += moveNormalY;
			normalz += moveNormalZ;

			// ribbons
			for (var k=0; k<ribbonArray.length; ++k ) {
				var ribbon = ribbonArray[k].r;
				var offset = ribbonArray[k].offset;

				if (i < offset) {
					continue;
				}

				var pulse = Math.cos((i-r*10)/10)*settings.ribbonPulseMultiplier_1;

				var pulse2 = Math.cos((i-r*10)/8)*settings.ribbonPulseMultiplier_2;

				var inc = (Math.PI*2)/ribbonArray.length;
				var thisinc = k*inc;
				var offsetz = Math.cos(thisinc+((i-r*10)/8))*pulse;
				var offsety = Math.sin(thisinc+((i-r*10)/8))*pulse;

				for (var j=0; j<2; ++j ) {
					var index = ((i-offset)*2)+j;

					if (ribbon.vertices[index] == undefined) {
						continue;
						break;
					}

					// for twister
					var adder = i-(r*2);
					var w = Math.max(settings.ribbonMin, i/(10+pulse2));
					w = Math.min(w, settings.ribbonMax);
					var extrax = Math.cos(adder/3)*w;
					var extray = Math.sin(adder/3)*w;

					ribbon.vertices[index].position.x = x - emitterMesh.position.x+extrax+offsetz;
					if (j==0) {
						ribbon.vertices[index].position.y = y+extray+offsety - emitterMesh.position.y;
						ribbon.vertices[index].position.z = z+extrax+offsetz - emitterMesh.position.z;
					} else {
						ribbon.vertices[index].position.y = y-extray+offsety - emitterMesh.position.y;
						ribbon.vertices[index].position.z = z-extrax+offsetz - emitterMesh.position.z;
					}
				}

			}


			vectorArray[i].x = x;
			vectorArray[i].y = y;
			vectorArray[i].z = z;

			vectorArray[i].normalx = normalx;
			vectorArray[i].normaly = normaly;
			vectorArray[i].normalz = normalz;

			vectorArray[i].lastx = lastx;
			vectorArray[i].lasty = lasty;
			vectorArray[i].lastz = lastz;

		}

		var dx = vectorArray[0].lastx - vectorArray[0].x, dy = vectorArray[0].lasty - vectorArray[0].y, dz = vectorArray[0].lastz - vectorArray[0].z;
		var distance =  dx * dx + dy * dy + dz * dz;
		
		var speed = Math.max(distance/100, 1.0);
		speed = Math.min(speed, 1.5);

		// animals
		for (var i=0; i<animalArray.length; ++i ) {
			var obj =  animalArray[i];
			var animal = obj.c;
			var x = obj.x;
			var y = obj.y;
			var z = obj.z;
			var f = obj.f;
			var anim = obj.a;
			var scale = obj.scale;

			//var pulse = Math.cos((i-r*10)/35)*(35-(i*1.5));

			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetx = Math.cos(thisinc+((i-r*2)/8))*30;
			var offsetz = Math.sin(thisinc+((i-r*2)/8))*30;
			var offsety = offsetz;

			var cNormal = new THREE.Vector3(vectorArray[f].normalx, vectorArray[f].normaly, vectorArray[f].normalz);

			var amountx = 1-Math.abs(cNormal.x);
			var amountz = 1-Math.abs(cNormal.z);
			var amounty = 1-Math.abs(cNormal.y);

			var tox = vectorArray[f].x+(offsetx*amountx);
			var toy = vectorArray[f].y+(offsety*amounty);
			var toz = vectorArray[f].z+(offsetz*amountz);

			if (cNormal.y > 0.5) {
				toy = vectorArray[f].y - 6*1.75;
			}

			if (toy < FLOOR) {
				toy = FLOOR;
			}

			// morph
			animalArray[i].count += 0.01;
			var morph = Math.max(Math.cos(animalArray[i].count),0);
			morph = Math.min(morph, 1)
			animalArray[i].a.morph = morph;

			animalArray[i].a.animalA.timeScale = speed;
			animalArray[i].a.animalB.timeScale = speed;

			var divider = 2;

			var moveX = (tox-x)/divider;
			var moveY = (toy-y)/divider;
			var moveZ = (toz-z)/divider;

			var zvec = new THREE.Vector3(tox,toy,toz);
			zvec.subSelf( animal.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(vectorArray[f].normalx*-1, vectorArray[f].normaly*-1, vectorArray[f].normalz*-1);
			//var yvec = new THREE.Vector3(0, -1, 0);

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);
			//scale -= morph/12;

			animal.matrixWorld.n11 = xvec.x*scale; animal.matrixWorld.n12 = yvec.x*scale; animal.matrixWorld.n13 = zvec.x*scale; animal.matrixWorld.n14 = x;
			animal.matrixWorld.n21 = xvec.y*scale; animal.matrixWorld.n22 = yvec.y*scale; animal.matrixWorld.n23 = zvec.y*scale; animal.matrixWorld.n24 = y;
			animal.matrixWorld.n31 = xvec.z*scale; animal.matrixWorld.n32 = yvec.z*scale; animal.matrixWorld.n33 = zvec.z*scale; animal.matrixWorld.n34 = z;

			x += moveX;
			y += moveY;
			z += moveZ;
			
			animal.position.x = x;
			animal.position.y = y;
			animal.position.z = z;

			animalArray[i].x = x;
			animalArray[i].y = y;
			animalArray[i].z = z;
		}

		// flying animals
		for (var i=0; i<flyingArray.length; ++i ) {
			var obj =  flyingArray[i]
			var flyingAnimal = obj.c;
			var x = obj.x;
			var y = obj.y;
			var z = obj.z;
			var f = obj.f;
			var scale = obj.scale;

			var pulse = Math.cos((i-r*10)/15)*settings.flyingAnimalPulseMultiplier_1;
			
			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetz = Math.cos(thisinc+((i-r*2)/8))*35;
			var offsety = Math.sin(thisinc+((i-r*2)/8))*pulse;

			var cNormal = new THREE.Vector3(vectorArray[f].normalx, vectorArray[f].normaly, vectorArray[f].normalz);

			var amountx = 1-Math.abs(cNormal.x);
			var amountz = 1-Math.abs(cNormal.z);
			var amounty = 1-Math.abs(cNormal.y);

			var tox = vectorArray[f].x+(offsetz*amountx);
			var toy = vectorArray[f].y+(offsety*amounty);
			var toz = vectorArray[f].z+(offsetz*amountz);

			var amount = 16+Math.abs(Math.sin((thisinc+pulse)/30)*40);

			if (cNormal.x < -0.8) {
				tox -= amount;
			}
			if (cNormal.x > 0.8) {
				tox += amount;
			}
			if (cNormal.y < -0.8 || cNormal.y > 0.8) {
				toy += amount;
			}
			if (cNormal.z < -0.8) {
				toz -= amount;
			}
			if (cNormal.z > 0.8) {
				toz += amount;
			}
			var moveX = (tox-x)/settings.flyingAnimalDivider;
			var moveY = (toy-y)/settings.flyingAnimalDivider;
			var moveZ = (toz-z)/settings.flyingAnimalDivider;


			var zvec = new THREE.Vector3(tox,toy,toz);
			zvec.subSelf( flyingAnimal.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(vectorArray[f].normalx*-1, vectorArray[f].normaly*-1, vectorArray[f].normalz*-1);

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			flyingAnimal.matrixWorld.n11 = xvec.x*scale; flyingAnimal.matrixWorld.n12 = yvec.x*scale; flyingAnimal.matrixWorld.n13 = zvec.x*scale; flyingAnimal.matrixWorld.n14 = x;
			flyingAnimal.matrixWorld.n21 = xvec.y*scale; flyingAnimal.matrixWorld.n22 = yvec.y*scale; flyingAnimal.matrixWorld.n23 = zvec.y*scale; flyingAnimal.matrixWorld.n24 = y;
			flyingAnimal.matrixWorld.n31 = xvec.z*scale; flyingAnimal.matrixWorld.n32 = yvec.z*scale; flyingAnimal.matrixWorld.n33 = zvec.z*scale; flyingAnimal.matrixWorld.n34 = z;

			x += moveX;
			y += moveY;
			z += moveZ;

			flyingAnimal.position.x = x;
			flyingAnimal.position.y = y;
			flyingAnimal.position.z = z;

			flyingArray[i].x = x;
			flyingArray[i].y = y;
			flyingArray[i].z = z;
		}

		var multiplier = delta/60;
		
		// grass
		for (var i=0; i<grassArray.length; ++i ) {
			var obj = grassArray[i];
			var c = obj.c;

			var scale = obj.scale;
			var alivetime = obj.alivetime;
			var tree = obj.tree;
			var maxHeight = obj.maxHeight;

			
			alivetime += multiplier;//0.5;
			
			// respawn
			if (alivetime > 150) {
				c.position.x = emitterMesh.position.x;
				c.position.y = emitterMesh.position.y;
				c.position.z = emitterMesh.position.z;

				c.rotation.x = 0;
				c.rotation.z = 0;
				c.rotation.y = 0;

				var amount = 8;

				var torotx = 0;
				var toroty = 0;
				var torotz = 0;

				if (currentNormal.x < -0.8) {
					c.position.x = emitterMesh.position.x + amount;
					c.rotation.z = 1.57;
					c.rotation.x = Math.random()*Math.PI;
					if (tree) {
						torotz = c.rotation.z+(Math.random()-0.5);
						c.rotation.z = 0;
						torotx = c.rotation.x;
						toroty = c.rotation.y;
					}
					c.position.y += (Math.random()*50)-25;
					c.position.z += (Math.random()*50)-25;
				}
				if (currentNormal.x > 0.8) {
					c.position.x = emitterMesh.position.x - amount;
					c.rotation.z = -1.57;
					if (tree) {
						torotz = c.rotation.z +(Math.random()-0.5);
						c.rotation.z = 0;
						torotx = c.rotation.x;
						toroty = c.rotation.y;
					}
					c.rotation.x = Math.random()*Math.PI;

					c.position.y += (Math.random()*50)-25;
					c.position.z += (Math.random()*50)-25;
				}
				if (currentNormal.y < -0.8) {
					c.position.y = emitterMesh.position.y + amount;
					c.rotation.y = Math.random()*Math.PI;
					if (tree) {
						torotz = c.rotation.z+(Math.random()-0.5);
						c.rotation.z = 1.57;
						torotx = c.rotation.x;
						toroty = c.rotation.y;
					}
					c.position.x += (Math.random()*50)-25;
					c.position.z += (Math.random()*50)-25;
				}
				if (currentNormal.y > 0.8) {
					c.position.y = emitterMesh.position.y - amount;
					c.rotation.y = Math.random()*Math.PI;
					if (tree) {
						torotz += c.rotation.z+(Math.random()-0.5);
						c.rotation.z = 1.57;
						torotx = c.rotation.x;
						toroty = c.rotation.y;
					}
					
					c.position.x += (Math.random()*40)-20;
					c.position.z += (Math.random()*40)-20;
				}
				if (currentNormal.z < -0.8) {
					c.position.z = emitterMesh.position.z + amount;
					c.rotation.x = -1.57;
					c.rotation.y = Math.random()*Math.PI;
					if (tree) {
						torotx = c.rotation.x+(Math.random()-0.5);
						c.rotation.x = 0;
						torotz = c.rotation.z;
						toroty = c.rotation.y;
					}
					c.position.y += (Math.random()*50)-25;
					c.position.x += (Math.random()*50)-25;
				}
				if (currentNormal.z > 0.8) {
					c.position.z = emitterMesh.position.z - amount;
					c.rotation.x = 1.57;
					c.rotation.y = Math.random()*Math.PI;
					if (tree) {
						torotx = c.rotation.x+(Math.random()-0.5);
						c.rotation.x = 0;
						torotz = c.rotation.z;
						toroty = c.rotation.y;
					}

					c.position.y += (Math.random()*50)-25;
					c.position.x += (Math.random()*50)-25;
				}

				if (tree) {
					var treeTween = new TWEEN.Tween(c.rotation)
								.to({x: torotx, y: toroty, z: torotz}, 4000)
								.easing(TWEEN.Easing.Elastic.EaseOut);
					treeTween.start();				
				}

				// keep away from camera path - hack
				if (tree && c.position.x < camPos.x+30 && c.position.x > camPos.x-30) {
					c.position.x = camPos.x+30;
					if (c.position.x < camPos.x) {
						c.position.x = camPos.x-30;
					}
				}

				alivetime = 0;
			}

			if (tree) {
				scale = Math.max( alivetime / 50, 0.0001 );
			} else {
				scale = Math.max( alivetime / 75, 0.0001 );				
			}
		
			scale = Math.min( scale, 1 );
			scale *= 0.1;

			if (tree) {
				maxHeight *= 0.1;
				var divider = 20;
				if (obj.lighthouse) {
					scale *= 1.6;
					divider = 30;
				}
				c.scale.x = c.scale.y= c.scale.z = 0.1*Math.min((alivetime+1)/divider,1);
				//c.scale.y = scale;
				if (c.scale.y > maxHeight) {
					c.scale.y = maxHeight;
				}
			} else {
				c.scale.x = c.scale.z = Math.min( 0.065, scale * 2.5 );
				c.scale.y = scale;
			}
			
			grassArray[i].scale = scale;
			grassArray[i].alivetime = alivetime;

		}

		// butterflys
		butterflyContainer.position = camPos;

		butterflyContainer.position.x += Math.cos( camera.theta )*-70;
		butterflyContainer.position.z -= Math.sin( camera.theta )*70;

		for (var i=0; i<butterflyArray.length; ++i ) {
			var obj =  butterflyArray[i];
			var butterfly = obj.c;
			var x = obj.x;
			var y = obj.y;
			var z = obj.z;
			var scale = obj.scale;
		
			var offsetx = Math.cos(i-r);
			var offsetz = Math.sin(i-r);

			x += offsetx;
			y += 0.5*(delta/20);
			z += offsetz;

			if (y > 100 ) {
				y = -10;
			}

			butterfly.lookAt( new THREE.Vector3(x,y,z) );

			butterfly.rotation.y -= 3.14;

			butterfly.position.x = x;
			butterfly.position.y = y;
			butterfly.position.z = z;

			butterflyArray[i].x = x;
			butterflyArray[i].y = y;
			butterflyArray[i].z = z;
		}

		// particles
		for (var i=0; i<particleArray.length; ++i ) {
			var particles = particleArray[i].c;

			particleArray[i].alivetime += multiplier/5;//0.2;

			if (particleArray[i].alivetime >= particleArray.length) {
				particleArray[i].alivetime = 0;
				particles.scale.x = particles.scale.y = particles.scale.z = 1;
				particles.position.x = vectorArray[0].x;
				particles.position.y = vectorArray[0].y;
				particles.position.z = vectorArray[0].z;

				particleArray[i].x = particles.position.x;
				particleArray[i].y = particles.position.y;
				particleArray[i].z = particles.position.z;

				particles.materials[0].opacity = 0;
				continue;
			}

			var alivetime = particleArray[i].alivetime;

			particles.position.y += 0.20;

			particles.rotation.y += 0.035;
			particles.rotation.z += 0.020;

			var scale = Math.max(alivetime/15, 1);
			//scale = Math.max(scale,0.05);
			particles.scale.x = particles.scale.y = particles.scale.z = 0.5+scale;

			var alpha = (alivetime/4);
			alpha = Math.min(alpha,1.0);
			particles.materials[0].opacity = alpha;
		}

		pointLight.position.x = emitterFollow.position.x;
		pointLight.position.y = emitterFollow.position.y;
		pointLight.position.z = emitterFollow.position.z;

		var amount = 10;

		pointLight.position.x = emitterFollow.position.x + currentNormal.x*amount;
		pointLight.position.y = emitterFollow.position.y + currentNormal.y*amount;
		pointLight.position.z = emitterFollow.position.z + currentNormal.z*amount;

	}

	function updateEmitter( delta ) {

		var vector = new THREE.Vector3( ( mouseX / shared.screenWidth ) * 2 - 1, - ( mouseY / shared.screenHeight ) * 2 + 1, 0.5 );

		projector.unprojectVector( vector, camera );

		var ray = new THREE.Ray( camPos, vector.subSelf( camPos ).normalize() );

		var intersects = ray.intersectScene( collisionScene );

		if ( intersects.length > 0 ) {

			for ( var i = 0; i < intersects.length; ++i ) {

				var check = vector.z < 0 ? intersects[i].point.z < camPos.z : intersects[i].point.z > camPos.z;

				if ( check && intersects[i].object != emitterMesh && intersects[i].object != emitterFollow && intersects[i].distance > 10 ) {

					emitterMesh.position = intersects[i].point;

					var face = intersects[i].face;
					var object = intersects[i].object;

					var normal = object.matrixRotationWorld.multiplyVector3( face.normal.clone() );

					currentNormal = normal;

					// walls
					if (intersects[i].object == rightPlane || intersects[i].object == frontPlane || intersects[i].object == backPlane || intersects[i].object == leftPlane || intersects[i].object == upPlane) {
						currentNormal.x = 0;
						currentNormal.y = 1;
						currentNormal.z = 0;
						// not to be airbourne
						emitterMesh.position.y = FLOOR;
					}

					var amount = 6;

					if (currentNormal.x < -0.5) {
						emitterMesh.position.x = intersects[i].point.x - amount;
					}
					if (currentNormal.x > 0.5) {
						emitterMesh.position.x = intersects[i].point.x + amount;
					}
					if (currentNormal.y < -0.5) {
						emitterMesh.position.y = intersects[i].point.y - amount;
					}
					if (currentNormal.y > 0.5) {
						emitterMesh.position.y = intersects[i].point.y + amount*1.75;
					}
					if (currentNormal.z < -0.5) {
						emitterMesh.position.z = intersects[i].point.z - amount;
					}
					if (currentNormal.z > 0.5) {
						emitterMesh.position.z = intersects[i].point.z + amount;
					}


					// hack..
					if (emitterMesh.position.z > camPos.z-100) {
						emitterMesh.position.z = camPos.z-100;
					}
					break;
				}
			}

		}

		var maxSpeed = delta/2;

		var toy = emitterMesh.position.y;
		
		var moveY = (toy-emitterFollow.position.y)/settings.emitterDivider;
		if (moveY > maxSpeed) {
			moveY = maxSpeed;
		}
		if (moveY < -maxSpeed) {
			moveY = -maxSpeed;
		}
		emitterFollow.position.y += moveY;


		var tox = emitterMesh.position.x;
		
		var moveX = (tox-emitterFollow.position.x)/settings.emitterDivider;
		if (moveX > maxSpeed) {
			moveX = maxSpeed;
		}
		if (moveX < -maxSpeed) {
			moveX = -maxSpeed;
		}

		emitterFollow.position.x += moveX;


		var toz = emitterMesh.position.z;
		
		var moveZ = (toz-emitterFollow.position.z)/settings.emitterDivider;
		if (moveZ > maxSpeed) {
			moveZ = maxSpeed;
		}
		if (moveZ < -maxSpeed) {
			moveZ = -maxSpeed;
		}

		emitterFollow.position.z += moveZ;

	}

	function onMouseMoved() {
		mouseX = shared.mouseX;
		mouseY = shared.mouseY;
	}

	function reset () {
		camPos = new THREE.Vector3( 0, 20, 50 );

		emitterMesh.position.x = camPos.x;
		emitterMesh.position.y = camPos.y;
		emitterMesh.position.z = camPos.z;

		emitterFollow.position.x = camPos.x;
		emitterFollow.position.y = camPos.y;
		emitterFollow.position.z = camPos.z;

		for (var k=0; k<ribbonArray.length; ++k ) {
			ribbonMesh.position = emitterMesh.position;
		}

		for (var i=0; i<vectorArray.length; ++i ) {
			var obj = vectorArray[i];
			obj.x = camPos.x;
			obj.y = camPos.y;
			obj.z = camPos.z;
		}

		for (var i=0; i<animalArray.length; ++i ) {
			var obj =  animalArray[i];
			obj.x = camPos.x;
			obj.y = camPos.y;
			obj.z = camPos.z;
		}

	}

	function getShortRotation(rot) {
		rot %= pi2;
		if (rot > pi) { rot -= pi2; }
		else if (rot < -pi) { rot += pi2; }
		return rot;
	}

	function addMesh( geometry, scale, x, y, z, rx, ry, rz, material, doubleSided ) {

		var inDouble = doubleSided || false;

		mesh = new THREE.Mesh( geometry, material );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;
		mesh.rotation.x = rx;
		mesh.rotation.y = ry;
		mesh.rotation.z = rz;
		mesh.doubleSided = inDouble;
		mesh.updateMatrix();
		collisionScene.addObject(mesh);
		//scene.addObject(mesh);

		return mesh;
	}

	this.destruct = function () {

	}

}
