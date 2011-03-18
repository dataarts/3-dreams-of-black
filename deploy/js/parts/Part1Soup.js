var Part1Soup = function ( camera, scene ) {

	var that = this;


	// soup settings
	var initSettings = {
		numOfVectors : 30,
		numOfRibbons : 6,
		numOfAnimals : 12,
		numOfButterflys : 20,
		ribbonMaterials : [
			[ new THREE.MeshLambertMaterial( { color:0xf89010 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0x98f800 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0x5189bb } ) ],
			[ new THREE.MeshLambertMaterial( { color:0xe850e8 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0xf1f1f1 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0x08a620 } ) ]
			  ],
		butterflyMaterials : [
			[ new THREE.MeshLambertMaterial( { color:0xd5a19d } ) ],
			[ new THREE.MeshLambertMaterial( { color:0xeadc9a } ) ],
			[ new THREE.MeshLambertMaterial( { color:0xc5e79e } ) ],
			[ new THREE.MeshLambertMaterial( { color:0x9ec5e7 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0xc487e3 } ) ],
			[ new THREE.MeshLambertMaterial( { color:0xdce6cc } ) ]
			  ],
	}

	var settings = {
		vectorDivider : 5,
		emitterDivider : 3,
		butterflyDivider : 8,
		ribbonPulseMultiplier_1 : 3.7,
		ribbonPulseMultiplier_2 : 5.5,
		butterflyPulseMultiplier_1 : 10,
		animalSpeed : 14,
		ribbonMin : 0.65,
		ribbonMax : 3,
		collisionDistance : 350,
	}

/*	gui.add( settings, 'vectorDivider', 1, 8).name( 'vectorDivider' );
	gui.add( settings, 'emitterDivider', 1, 8).name( 'emitterDivider' );
	gui.add( settings, 'butterflyDivider', 1, 8).name( 'butterflyDivider' );
	gui.add( settings, 'ribbonPulseMultiplier_1', 3, 15).name( 'ribbonPulse_1' );
	gui.add( settings, 'ribbonPulseMultiplier_2', 5, 15).name( 'ribbonPulse_2' );
	gui.add( settings, 'butterflyPulseMultiplier_1', 10, 20).name( 'butterflyPulse_1' );
	gui.add( settings, 'animalSpeed', 8, 96).name( 'animalSpeed' );
	gui.add( settings, 'ribbonMin', 0.05, 8).name( 'ribbonMin' );
	gui.add( settings, 'ribbonMax', 1, 16).name( 'ribbonMax' );
	gui.add( settings, 'collisionDistance', 100, 600).name( 'collisionDistance' );
*/
	// init
	var mouseX = screenWidthHalf
	var mouseY = screenHeightHalf;
	events.mousemove.add(getMouse);

	var vectorArray = [];
	var ribbonArray = [];
	var ribbonMeshArray = [];

	var animalArray = [];
	var particleArray = [];
	var flyingArray = [];
	var cubeArray = [];

	var currentNormal = new THREE.Vector3(0,1,0);
	var r = 0;
	//camPos = new THREE.Vector3(0, -465, 1800);
	camPos = new THREE.Vector3(0, 20, 0);

	var pointLight = new THREE.PointLight( 0xccffcc );
	pointLight.position.x = camPos.x;
	pointLight.position.y = camPos.y;
	pointLight.position.z = camPos.z;
	scene.addLight( pointLight, 1.0 );

	// vectors
	for (var i=0; i<initSettings.numOfVectors+20; ++i ) {
		var x = camPos.x-20;
		var y = camPos.y-10;
		var z = camPos.z;

		var obj = {x:x, y:y, z:z, lastx:x, lasty:y, lastz:z, normalx:0, normaly:0, normalz:0, scale:1};
		vectorArray.push(obj);
	}

	// ribbons
	for (var k=0; k<initSettings.numOfRibbons; ++k ) {

		var ribbon = new Ribbon(15,6,initSettings.numOfVectors-2);
		var ribbonMesh = new THREE.Mesh( ribbon, initSettings.ribbonMaterials[k%6] );
		ribbonMesh.doubleSided = true;
		scene.addObject( ribbonMesh );

		var offset = Math.floor( Math.random()*10 );

		var obj = {r:ribbon, rm:ribbonMesh, offset:offset}

		ribbonArray.push(obj);
		ribbonMeshArray.push(ribbonMesh);
	}

	// running animals
	var animalLoader = new THREE.Loader();
	animalLoader.loadAscii( { model: "files/models/soup/runningAnimal.js", callback: animalLoaded } );

	// flying animals
	var flyingLoader = new THREE.Loader();
	flyingLoader.loadAscii( { model: "files/models/soup/flyingAnimal.js", callback: flyingLoaded } );

	// dummy "grass"
	var grassLoader = new THREE.Loader();
	grassLoader.loadAscii( { model: "files/models/soup/Grass_Dummy.js", callback: grassLoaded } );

	// collisionScene stuff should probably not be here (TEMP)
	//var FLOOR = -487;
	var FLOOR = 0;
	var collisionScene = new THREE.Scene();

	var plane = new Plane( 100, 100, 1, 1 );
	var invMaterial = new THREE.MeshLambertMaterial( { color:0x00DE00, opacity: 0.5 } );
	var invMaterial2 = new THREE.MeshLambertMaterial( { color:0xDE0000, opacity: 0.5 } );

	var downPlane = addMesh( plane, 200,  0, FLOOR, 0, -1.57,0,0, invMaterial2, true );
	var rightPlane = addMesh( plane, 200,  camPos.x+settings.collisionDistance, camPos.y, camPos.z, 0,-1.57,0, invMaterial, false );
	var leftPlane = addMesh( plane, 200,  camPos.x-settings.collisionDistance, camPos.y, camPos.z, 0,1.57,0, invMaterial, false );
	var frontPlane = addMesh( plane, 200,  camPos.x, camPos.y, camPos.z-settings.collisionDistance, 0,0,-1.57, invMaterial, false );
	var backPlane = addMesh( plane, 200,  camPos.x, camPos.y, camPos.z+settings.collisionDistance, 0,3.14,1.57, invMaterial, false );
	var upPlane = addMesh( plane, 200,  0, FLOOR+(settings.collisionDistance*1.5), 0, 1.57,0,0, invMaterial2, false );
	
	// temp boxes
	var cube = new Cube( 200, 300, 200, 1, 1, 1 );
	var cubea = addMesh( cube, 1,  250, -300+487, 1400-1800, 0,0,0, invMaterial2, false );
	cubea.scale.y = 3.5;
	cubea.scale.z = 5;
	var cubeb = addMesh( cube, 1,  -230, -240+487, -360-1800, 0,0,0, invMaterial2, false );
	cubeb.scale.x = 0.8;
	cubeb.scale.y = 3.4;
	cubeb.scale.z = 25;
	var cubec = addMesh( cube, 1,  230, -200+487, 590-1800, 0,0,0, invMaterial2, false );
	cubec.scale.x = 0.8;
	cubec.scale.y = 2;
	cubec.scale.z = 2.4;
	var cubed = addMesh( cube, 1,  355, -120+487, -370-1800, 0,0,0, invMaterial2, false );
	cubed.scale.x = 2;
	cubed.scale.y = 3.8;
	cubed.scale.z = 4.5;
	var cubef = addMesh( cube, 1,  230, -200+487, -1115-1800, 0,0,0.0957, invMaterial, false );
	cubef.scale.x = 1;
	cubef.scale.y = 3.2;
	cubef.scale.z = 2;
	var cubeg = addMesh( cube, 1,  40, 160+487, -1240-1800, 0,0,0.8796, invMaterial2, false );
	cubeg.scale.x = 1.2;
	cubeg.scale.y = 1.6;
	cubeg.scale.z = 3.6;
	var cubeh = addMesh( cube, 1,  240, -320+487, 1720-1800, 0,0,0, invMaterial2, false );
	cubeh.scale.x = 0.8;
	cubeh.scale.y = 3.2;
	cubeh.scale.z = 2.4;
	var cubei = addMesh( cube, 1,  -220, -320+487, -920-1800, 0,0,0, invMaterial2, false );
	cubei.scale.x = 1;
	cubei.scale.y = 4.6;
	cubei.scale.z = 3.4;

/*	var ref = cubed;
	gui.add( ref.position, 'x', -2000, 2000).name( 'xpos' );
	gui.add( ref.position, 'y', -2000, 2000).name( 'ypos' );
	gui.add( ref.position, 'z', -2000, 2000).name( 'zpos' );
	gui.add( ref.scale, 'x', 0, 20).name( 'xscale' );
	gui.add( ref.scale, 'y', 0, 20).name( 'yscale' );
	gui.add( ref.scale, 'z', 0, 20).name( 'zscale' );
	gui.add( ref.rotation, 'x', 0, Math.PI*2).name( 'xrotation' );
	gui.add( ref.rotation, 'y', 0, Math.PI*2).name( 'yrotation' );
	gui.add( ref.rotation, 'z', 0, Math.PI*2).name( 'zrotation' );
*/
	
	// ---

	// emitter
	var projector = new THREE.Projector();
	var emitter = new Cube( 10, 10, 10, 1, 1 );
	var emitterMesh = addMesh( emitter, 1, 0, -465, 1800, 0,0,0, new THREE.MeshLambertMaterial( { color: 0xFFFF33 } ) );
	var emitterFollow = addMesh( emitter, 1, 0, -465, 1800, 0,0,0, new THREE.MeshLambertMaterial( { color: 0x3333FF } ) );


	this.update = function () {

		// update to reflect _real_ camera position
		camPos.x = camera.matrixWorld.n14;
		camPos.y = camera.matrixWorld.n24;
		camPos.z = camera.matrixWorld.n34;

		// collisionScene stuff should probably not be here (TEMP)
		rightPlane.position.x = camPos.x+settings.collisionDistance;
		leftPlane.position.x = camPos.x-settings.collisionDistance;
		frontPlane.position.z = camPos.z-settings.collisionDistance*1.4;
		backPlane.position.z = camPos.z+settings.collisionDistance;
		rightPlane.updateMatrix();
		leftPlane.updateMatrix();
		frontPlane.updateMatrix();
		backPlane.updateMatrix();
		// ---

		r += 0.1;

		updateEmitter();
		runAll();

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
		renderer.clear();
		// ---
	}

	function animalLoaded( geometry ) {


		for (var i=0; i<initSettings.numOfAnimals; ++i ) {
			var animal = ROME.Animal( geometry );
			var mesh = animal.mesh;

			var followIndex = (i*2)+2;

			var scale = 0.02+(Math.random()/8);
			if (i<2) {
				scale = 0.15;
				followIndex = i;
			}
			scale = Math.max(scale, 0.1);

			var x = camPos.x-100;
			var y = camPos.y-100;
			var z = camPos.z;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			mesh.matrixAutoUpdate = false;

			scene.addChild( mesh );
			animal.play( "wolf", "bison" );

			var count = Math.random();
			if (i<2) {
				count = 0;
			}

			var obj = {c:mesh, a:animal, x:x, y:y, z:z, f:followIndex, count:count, scale:scale*1.3};

			animalArray.push(obj);
		}

	}

	function flyingLoaded( geometry ) {

		for (var i=0; i<initSettings.numOfButterflys; ++i ) {
			var animal = ROME.Animal( geometry );
			var mesh = animal.mesh;

			var scale = 0.02+(Math.random()/14);

			var x = camPos.x-100;
			var y = camPos.y-100;
			var z = camPos.z;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			mesh.matrixAutoUpdate = false;

			scene.addChild( mesh );
			animal.play( "parrot", "hbird" );

			var obj = {c:mesh, a:animal, x:x, y:y, z:z, f:Math.floor(i*2), scale:scale*1.5};

			flyingArray.push(obj);
		}

	}

	function grassLoaded( geometry ) {
		var materials = [new THREE.MeshLambertMaterial( { color: 0x83b95b, shading: THREE.FlatShading } ),
						 new THREE.MeshLambertMaterial( { color: 0x93c171, shading: THREE.FlatShading } ),
						 new THREE.MeshLambertMaterial( { color: 0x7eaa5e, shading: THREE.FlatShading } ),
						 new THREE.MeshLambertMaterial( { color: 0x77bb45, shading: THREE.FlatShading } ),
						 new THREE.MeshLambertMaterial( { color: 0x7da75e, shading: THREE.FlatShading } )
		];

		for (var i=0; i<150; ++i ) {
			
			var x = 0;
			var y = FLOOR+100;
			var z = 0;

			var c = new THREE.Mesh( geometry, materials[i%5] );
			c.updateMatrix();
			scene.addObject(c);

			var obj = {c:c, scale:0, alivetime:i, normal:new THREE.Vector3()};
			cubeArray.push(obj);
		}
	}

	function runAll () {

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

			var moveNormalX = (tonormalx-normalx)/settings.vectorDivider;
			var moveNormalY = (tonormaly-normaly)/settings.vectorDivider;
			var moveNormalZ = (tonormalz-normalz)/settings.vectorDivider;

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

					ribbon.vertices[index].position.x = x - emitterMesh.position.x;
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

			var pulse = Math.cos((i-r*10)/35)*(35-(i*1.5));

			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetx = Math.cos(thisinc+((i-r*2)/8))*pulse;
			var offsetz = Math.sin(thisinc+((i-r*2)/8))*pulse;
			//var offsety = Math.sin(thisinc+((i-r*5)/8))*pulse;


			var tox = vectorArray[f].x+offsetx;
			var toy = vectorArray[f].y//+offsety;
			var toz = vectorArray[f].z+offsetz;

			var cNormal = new THREE.Vector3(vectorArray[f].normalx, vectorArray[f].normaly, vectorArray[f].normalz);

			if (cNormal.x < -0.8 && offsetx > 0) {
				tox = vectorArray[f].x;
			}
			if (cNormal.x > 0.8 && offsetx < 0 ) {
				tox = vectorArray[f].x;
			}
			/*if (cNormal.y < -0.8 && offsety > 0) {
				toy = vectorArray[f].y;
			}
			if (cNormal.y > 0.8 && offsety < 0 ) {
				toy = vectorArray[f].y;
			}*/
			if (cNormal.z < -0.8 && offsetz > 0) {
				toz = vectorArray[f].z;
			}
			if (cNormal.z > 0.8 && offsetz < 0) {
				toz = vectorArray[f].z;
			}

			// morph - removed for now
			/*animalArray[i].count += 0.01;
			var morph = Math.max(Math.cos(animalArray[i].count),0);
			morph = Math.min(morph, 1)
			animalArray[i].a.morph = morph;
			*/
			var divider = 2.5;

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

		// butterflys
		for (var i=0; i<flyingArray.length; ++i ) {
			var obj =  flyingArray[i]
			var butterfly = obj.c;
			var x = obj.x;
			var y = obj.y;
			var z = obj.z;
			var f = obj.f;
			var scale = obj.scale;

			var pulse = Math.cos((i-r*10)/15)*settings.butterflyPulseMultiplier_1;

			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetz = Math.cos(thisinc+((i-r*2)/8))*pulse;
			var offsety = Math.sin(thisinc+((i-r*2)/8))*pulse;


			var tox = vectorArray[f].x+offsetz;
			var toy = vectorArray[f].y+offsety;
			var toz = vectorArray[f].z+offsetz;

			var cNormal = new THREE.Vector3(vectorArray[f].normalx, vectorArray[f].normaly, vectorArray[f].normalz);

			var amount = 10+Math.abs(Math.sin((thisinc+pulse)/20)*10);

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
			var moveX = (tox-x)/settings.butterflyDivider;
			var moveY = (toy-y)/settings.butterflyDivider;
			var moveZ = (toz-z)/settings.butterflyDivider;


			var zvec = new THREE.Vector3(tox,toy,toz);
			zvec.subSelf( butterfly.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(vectorArray[f].normalx*-1, vectorArray[f].normaly*-1, vectorArray[f].normalz*-1);

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			butterfly.matrixWorld.n11 = xvec.x*scale; butterfly.matrixWorld.n12 = yvec.x*scale; butterfly.matrixWorld.n13 = zvec.x*scale; butterfly.matrixWorld.n14 = x;
			butterfly.matrixWorld.n21 = xvec.y*scale; butterfly.matrixWorld.n22 = yvec.y*scale; butterfly.matrixWorld.n23 = zvec.y*scale; butterfly.matrixWorld.n24 = y;
			butterfly.matrixWorld.n31 = xvec.z*scale; butterfly.matrixWorld.n32 = yvec.z*scale; butterfly.matrixWorld.n33 = zvec.z*scale; butterfly.matrixWorld.n34 = z;

			x += moveX;
			y += moveY;
			z += moveZ;

			butterfly.position.x = x;
			butterfly.position.y = y;
			butterfly.position.z = z;

			flyingArray[i].x = x;
			flyingArray[i].y = y;
			flyingArray[i].z = z;
		}

		// cubes
		for (var i=0; i<cubeArray.length; ++i ) {
			var obj = cubeArray[i];
			var c = obj.c;

			var scale = obj.scale;
			var alivetime = obj.alivetime;
			var normal = obj.normal;
			
			alivetime += 0.5;
			
			// respawn
			if (alivetime > 150) {
				c.position.x = emitterMesh.position.x;
				c.position.y = emitterMesh.position.y;
				c.position.z = emitterMesh.position.z;

				
				c.rotation.x = 0;
				c.rotation.z = 0;
				c.rotation.y = 0;

				var amount = 11;

				cubeArray[i].normal = currentNormal.clone();

				if (currentNormal.x < -0.8) {
					c.position.x = emitterMesh.position.x + amount;
					c.rotation.z = 1.57;
					c.rotation.x = Math.random()*Math.PI;
				}
				if (currentNormal.x > 0.8) {
					c.position.x = emitterMesh.position.x - amount;
					c.rotation.z = -1.57;
					c.rotation.x = Math.random()*Math.PI;
				}
				if (currentNormal.y < -0.8) {
					c.position.y = emitterMesh.position.y + amount;
					c.rotation.y = Math.random()*Math.PI;
				}
				if (currentNormal.y > 0.8) {
					c.position.y = emitterMesh.position.y - amount;
					c.rotation.y = Math.random()*Math.PI;
				}
				if (currentNormal.z < -0.8) {
					c.position.z = emitterMesh.position.z + amount;
					c.rotation.x = -1.57;
					c.rotation.y = Math.random()*Math.PI;
				}
				if (currentNormal.z > 0.8) {
					c.position.z = emitterMesh.position.z - amount;
					c.rotation.x = 1.57;
					c.rotation.y = Math.random()*Math.PI;
				}

				alivetime = 0;
			}

			scale = Math.max( (alivetime)/50, 0.05);
			scale = Math.min(scale,1);
			scale *= 0.08;
			c.scale.x = c.scale.z = Math.min(0.065, scale*2.5);
			c.scale.y = scale;

			cubeArray[i].scale = scale;
			cubeArray[i].alivetime = alivetime;

		}

		pointLight.position.x = vectorArray[0].x;
		pointLight.position.y = vectorArray[0].y+5;
		pointLight.position.z = vectorArray[0].z;

	}

	function updateEmitter() {
		//emitterMesh.position.y = FLOOR;

		var vector = new THREE.Vector3( ( mouseX / window.innerWidth ) * 2 - 1, - ( mouseY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );

		var ray = new THREE.Ray( camPos, vector.subSelf( camPos ).normalize() );

		var intersects = ray.intersectScene( collisionScene );

		if ( intersects.length > 0) {
			for (var i=0; i<intersects.length; ++i ) {
				var check;
				if (vector.z < 0) {
					check = intersects[i].point.z < camPos.z;
				} else {
					check = intersects[i].point.z > camPos.z;
				}

				if (check && intersects[i].object != emitterMesh && intersects[i].object != emitterFollow && intersects[i].distance > 20) {
					emitterMesh.position = intersects[i].point;

					var face = intersects[i].face;
					var object = intersects[i].object;

					var normal = object.matrixRotationWorld.multiplyVector3( face.normal.clone() );

					currentNormal = normal;
					
					// walls
					if (intersects[i].object == rightPlane || intersects[i].object == backPlane || intersects[i].object == leftPlane || intersects[i].object == frontPlane || intersects[i].object == upPlane) {

						currentNormal.x = 0;
						currentNormal.y = 1;
						currentNormal.z = 0;
						// not to be airbourne
						emitterMesh.position.y = FLOOR;
					}

					var amount = 6;

					if (currentNormal.x < -0.8) {
						emitterMesh.position.x = intersects[i].point.x - amount;
					}
					if (currentNormal.x > 0.8) {
						emitterMesh.position.x = intersects[i].point.x + amount;
					}

					if (currentNormal.y < -0.8) {
						emitterMesh.position.y = intersects[i].point.y - amount;
					}
					if (currentNormal.y > 0.8) {
						emitterMesh.position.y = intersects[i].point.y + amount*1.3;
					}
					if (currentNormal.z < -0.8) {
						emitterMesh.position.z = intersects[i].point.z - amount;
					}
					if (currentNormal.z > 0.8) {
						emitterMesh.position.z = intersects[i].point.z + amount;
					}

					break;
				}
			}

		}

		var tox = emitterMesh.position.x;
		var toy = emitterMesh.position.y;
		var toz = emitterMesh.position.z;

		var moveX = (tox-emitterFollow.position.x)/settings.emitterDivider;
		var moveY = (toy-emitterFollow.position.y)/settings.emitterDivider;
		var moveZ = (toz-emitterFollow.position.z)/settings.emitterDivider;

		emitterFollow.position.x += moveX;
		emitterFollow.position.z += moveZ;
		emitterFollow.position.y += moveY;
	}

	function getMouse(x, y){
		mouseX = x+screenWidthHalf;
		mouseY = y+screenHeightHalf;
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
		mesh.overdraw = true;
		mesh.doubleSided = inDouble;
		mesh.updateMatrix();
		collisionScene.addObject(mesh);

		return mesh;
	}

	this.destruct = function () {

	}

}
