var PrairieSoup = function ( camera, scene, shared ) {

	var that = this;

	// soup settings
	var initSettings = {
		numOfVectors : 30,
		numOfRibbons : 6,
		numOfAnimals : 40,
		numOfParticleSystems : 40,
		ribbonMaterials : [
			[ new THREE.MeshBasicMaterial( { color:0x000000 } ) ],
			[ new THREE.MeshBasicMaterial( { color:0x444444 } ) ],
			[ new THREE.MeshBasicMaterial( { color:0x333333 } ) ],
			[ new THREE.MeshBasicMaterial( { color:0x555555 } ) ],
			[ new THREE.MeshBasicMaterial( { color:0x111111 } ) ],
			[ new THREE.MeshBasicMaterial( { color:0x222222 } ) ]
			  ],
	}

	var settings = {
		vectorDivider : 3,
		emitterDivider : 6,
		ribbonPulseMultiplier_1 : 30,
		ribbonPulseMultiplier_2 : 10,
		flyingAnimalPulseMultiplier_1 : 10,
		ribbonMin : 6,
		ribbonMax : 10,
		collisionDistance : 1500,
	}

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
	var grassArray = [];
	var particleArray = [];
	//var maxSpeed = 20;

	var collisionScene = new THREE.Scene();

	var currentNormal = new THREE.Vector3( 0, 1, 0 );
	var r = 0;
	camPos = new THREE.Vector3( 3223, 930, -2510 );

	var pointLight = new THREE.PointLight( 0xeeffee, - 2.25, 1200 );
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
	/*for ( var k = 0; k < initSettings.numOfRibbons; ++k ) {

		var ribbon = new Ribbon(15,6,initSettings.numOfVectors-2);
		var ribbonMesh = new THREE.Mesh( ribbon, initSettings.ribbonMaterials[k%6] );
		ribbonMesh.doubleSided = true;
		scene.addObject( ribbonMesh );

		var offset = Math.floor( Math.random()*10 );

		var obj = {r:ribbon, rm:ribbonMesh, offset:offset}

		ribbonArray.push(obj);
		ribbonMeshArray.push(ribbonMesh);
	}*/

	// particles
	var geometry = new THREE.Geometry();

	for (var i = 0; i < 200; i++) {
		var vector = new THREE.Vector3( Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40 );
		geometry.vertices.push( new THREE.Vertex( vector ) );
	}

	var sprite0 = ImageUtils.loadTexture( "files/textures/dark_0.png" );
	var sprite1 = ImageUtils.loadTexture( "files/textures/dark_1.png" );
	var sprite2 = ImageUtils.loadTexture( "files/textures/dark_2.png" );
	var sprite3 = ImageUtils.loadTexture( "files/textures/dark_3.png" );
	var sprite4 = ImageUtils.loadTexture( "files/textures/dark_4.png" );

	var particleSprites = [sprite0,sprite1,sprite2,sprite3,sprite4];

	for (var i = 0; i < initSettings.numOfParticleSystems; i++) {
		var particleMaterial = new THREE.ParticleBasicMaterial( { size: 4, map: particleSprites[i%5], transparent: true, depthTest: false } );

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

	loader.load( { model: "files/models/soup/bison.js", callback: animalLoaded } );
	//loader.load( { model: "files/models/soup/blackWidow.js", callback: animalLoaded } );


	// collisionScene stuff should probably not be here (TEMP)
	var FLOOR = 0;

	var plane = new Plane( 100, 100, 1, 1 );
	var invMaterial = new THREE.MeshLambertMaterial( { color:0x00DE00, opacity: 0.5, transparent: true } );
	var invMaterial2 = new THREE.MeshLambertMaterial( { color:0xDE0000, opacity: 1.0 } );

	var downPlane = addMesh( plane, 500,  camPos.x, FLOOR, camPos.z, -1.57,0,0, invMaterial2, true );
	var rightPlane = addMesh( plane, 200,  camPos.x+settings.collisionDistance, camPos.y, camPos.z, 0,-1.57,0, invMaterial, true );
	var leftPlane = addMesh( plane, 200,  camPos.x-settings.collisionDistance, camPos.y, camPos.z, 0,1.57,0, invMaterial, true );
	var frontPlane = addMesh( plane, 200,  camPos.x, camPos.y, camPos.z-settings.collisionDistance, 0,0,-1.57, invMaterial, true );
	var backPlane = addMesh( plane, 200,  camPos.x, camPos.y, camPos.z+settings.collisionDistance, 0,3.14,1.57, invMaterial, true );
	var upPlane = addMesh( plane, 500,  camPos.x, FLOOR+(settings.collisionDistance), camPos.z, 1.57,0,0, invMaterial2, true );
	// ---

	// emitter
	var projector = new THREE.Projector();
	var emitter = new Cube( 10, 10, 10 );
	var emitterMesh = addMesh( emitter, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshLambertMaterial( { color: 0xFFFF33 } ) );
	var emitterFollow = addMesh( emitter, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshLambertMaterial( { color: 0x3333FF } ) );


	this.update = function () {

		// update to reflect _real_ camera position
		camPos.x = camera.matrixWorld.n14;
		camPos.y = camera.matrixWorld.n24;
		camPos.z = camera.matrixWorld.n34;

		// temp reset
		if (camPos.x > 13930) {
			reset();
		}

		// collisionScene stuff should probably not be here (TEMP)
		rightPlane.position.x = camPos.x+settings.collisionDistance;
		leftPlane.position.x = camPos.x-settings.collisionDistance;
		rightPlane.position.z = camPos.z;
		rightPlane.position.y = camPos.y;
		leftPlane.position.z = camPos.z;
		leftPlane.position.y = camPos.y;

		frontPlane.position.z = camPos.z-settings.collisionDistance;
		backPlane.position.z = camPos.z+settings.collisionDistance;
		frontPlane.position.x = camPos.x;
		frontPlane.position.y = camPos.y;
		backPlane.position.x = camPos.x;
		backPlane.position.y = camPos.y;

		downPlane.position.y = camPos.y-80;
		upPlane.position.y = camPos.y+400;
		downPlane.position.x = camPos.x;
		downPlane.position.z = camPos.z;
		upPlane.position.x = camPos.x;
		upPlane.position.z = camPos.z;
		// ---

		r += 0.1;

		updateEmitter();
		runAll();

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
		
		var colors = [new THREE.Color( 0x000000 ),
					  new THREE.Color( 0x111111 ),
					  new THREE.Color( 0x222222 ),
					  new THREE.Color( 0x333333 )
						]

		for ( var i = 0; i < initSettings.numOfAnimals; ++i ) {

			var animal = ROME.Animal( geometry, false, colors[Math.floor(Math.random()*4)] );
			var mesh = animal.mesh;

			var followIndex = Math.floor(i/6);

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
			animal.animalA.timeScale = 2.0;
			animal.play( animal.availableAnimals[ 0 ], animal.availableAnimals[ 0 ], 0, Math.random() );

			var count = Math.random();
			if (i<2) {
				count = 0;
			}
			
			var obj = { c: mesh, a: animal, x: x, y: y, z: z, f: followIndex, count: count, scale: scale * 1.8 };

			animalArray.push( obj );

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
			/*for (var k=0; k<ribbonArray.length; ++k ) {
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

			}*/


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

			//var pulse = Math.cos((i-r*10)/35)*(35-(i*1.5));

			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetx = Math.cos(thisinc+((i-r*2)/8))*150;
			var offsetz = Math.sin(thisinc+((i-r*2)/8))*100;
			var offsety = offsetz;

			var cNormal = new THREE.Vector3(vectorArray[f].normalx, vectorArray[f].normaly, vectorArray[f].normalz);

			var amountx = 1-Math.abs(cNormal.x);
			var amountz = 1-Math.abs(cNormal.z);
			var amounty = 1-Math.abs(cNormal.y);

			var tox = vectorArray[f].x+(offsetx*amountx);
			var toy = vectorArray[f].y+(offsety*amounty);
			var toz = vectorArray[f].z+(offsetz*amountz);

			if (toy < FLOOR+8) {
				toy = FLOOR+8;
			}

			// morph - removed for now
			/*animalArray[i].count += 0.01;
			var morph = Math.max(Math.cos(animalArray[i].count),0);
			morph = Math.min(morph, 1)
			animalArray[i].a.morph = morph;
			*/
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


		// particles
		for (var i=0; i<particleArray.length; ++i ) {
			var particles = particleArray[i].c;

			particleArray[i].alivetime += 0.8;
			if (particleArray[i].alivetime >= particleArray.length) {
				particleArray[i].alivetime = 0;
				particles.scale.x = particles.scale.y = particles.scale.z = 1;
				particles.position.x = vectorArray[0].x;
				particles.position.y = vectorArray[0].y;
				particles.position.z = vectorArray[0].z;

				particleArray[i].x = particles.position.x;
				particleArray[i].y = particles.position.y;
				particleArray[i].z = particles.position.z;

				//particles.materials[0].opacity = 0;
				particles.materials[0].opacity = 1;
				continue;
			}

			var alivetime = particleArray[i].alivetime;

			particles.position.y += 0.25;

			particles.rotation.y += 0.015;
			particles.rotation.z += 0.005;

			var scale = Math.max(alivetime/8, 1);
			//scale = Math.max(scale,0.05);
			particles.scale.x = particles.scale.y = particles.scale.z = 0.1+scale;

			var alpha = 1-(alivetime/(particleArray.length*2));
			alpha = Math.min(alpha,1.0);
			particles.materials[0].opacity = alpha;
		}

		pointLight.position.x = vectorArray[3].x//emitterFollow.position.x;
		pointLight.position.y = emitterFollow.position.y + 50;
		pointLight.position.z = vectorArray[3].z//emitterFollow.position.z;

	}

	function updateEmitter() {

		emitterMesh.position.y = FLOOR;

		var vector = new THREE.Vector3( ( mouseX / shared.screenWidth ) * 2 - 1, - ( mouseY / shared.screenHeight ) * 2 + 1, 0.5 );

		projector.unprojectVector( vector, camera );

		var ray = new THREE.Ray( camPos, vector.subSelf( camPos ).normalize() );

		var intersects = ray.intersectScene( collisionScene );

		if ( intersects.length > 0 ) {

			for ( var i = 0; i < intersects.length; ++i ) {

				var check = vector.x < 0 ? intersects[i].point.x < camPos.x : intersects[i].point.x > camPos.x;

				if ( check && intersects[i].object != emitterMesh && intersects[i].object != emitterFollow && intersects[i].distance > 10 ) {

					emitterMesh.position = intersects[i].point;

					/*var face = intersects[i].face;
					var object = intersects[i].object;

					var normal = object.matrixRotationWorld.multiplyVector3( face.normal.clone() );

					currentNormal = normal;
					*/

					emitterMesh.position.y = downPlane.position.y;

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

		/*if (moveX > maxSpeed) {
			moveX = maxSpeed;
		}
		if (moveX < -maxSpeed) {
			moveX = -maxSpeed;
		}

		if (moveY > maxSpeed) {
			moveY = maxSpeed;
		}
		if (moveY < -maxSpeed) {
			moveY = -maxSpeed;
		}

		if (moveZ > maxSpeed) {
			moveZ = maxSpeed;
		}
		if (moveZ < -maxSpeed) {
			moveZ = -maxSpeed;
		}*/

		emitterFollow.position.x += moveX;
		emitterFollow.position.z += moveZ;
		emitterFollow.position.y += moveY;
	}

	function onMouseMoved() {
		mouseX = shared.mouseX;
		mouseY = shared.mouseY;
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

		return mesh;
	}

	function reset () {
		camPos = new THREE.Vector3( 3223, 930, -2510 );

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

	this.destruct = function () {

	}

}
