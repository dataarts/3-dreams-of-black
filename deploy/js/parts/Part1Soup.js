var Part1Soup = function ( camera, scene ) {

	var that = this;


	// soup settings
	var initSettings = {
		numOfVectors : 30,
		numOfRibbons : 6,
		numOfAnimals : 18,
		numOfButterflys : 150,
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
		vectorDivider : 2,
		emitterDivider : 3,
		butterflyDivider : 3,
		ribbonPulseMultiplier_1 : 7,
		ribbonPulseMultiplier_2 : 10,
		butterflyPulseMultiplier_1 : 15,
		
	}


	// init
	var mouseX = screenWidthHalf
	var mouseY = screenHeightHalf;
	events.mousemove.add(getMouse);

	var vectorArray = [];
	var ribbonArray = [];
	var ribbonMeshArray = [];

	var animalArray = [];
	var particleArray = [];
	var butterflyArray = [];

	var currentNormal;
	var r = 0;

	var pointLight = new THREE.PointLight( 0xccffcc );
	pointLight.position.x = camera.position.x;
	pointLight.position.y = camera.position.y;
	pointLight.position.z = camera.position.z;
	scene.addLight( pointLight, 1.0 );

	// vectors
	for (var i=0; i<initSettings.numOfVectors+20; ++i ) {
		var x = camera.position.x-20;
		var y = camera.position.y-10;
		var z = camera.position.z;

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

	// butterflys
	var butterfly_0 = new Butterfly2();
	var butterfly_1 = new Butterfly2();
	var butterfly_2 = new Butterfly2();
	var butterfly_3 = new Butterfly2();
	var butterfly_4 = new Butterfly2();

	var ba = [butterfly_0,butterfly_1,butterfly_2,butterfly_3,butterfly_4];

	for (var i=0; i<initSettings.numOfButterflys; ++i ) {
		var b = ba[Math.floor(Math.random()*3)];
		var m = initSettings.butterflyMaterials[Math.floor(Math.random()*6)];

		var butterflyMesh = new THREE.Mesh( b, m );

		var x = camera.position.x-100;
		var y = camera.position.y-100;
		var z = camera.position.z;

		butterflyMesh.position.x = x;
		butterflyMesh.position.y = y;
		butterflyMesh.position.z = z;

		butterflyMesh.doubleSided = true;
		butterflyMesh.matrixAutoUpdate = false;
		scene.addObject( butterflyMesh );
		
		var scale = 0.1+(Math.random()/2);

		var obj = {c:butterflyMesh, x:x, y:y, z:z, f:Math.floor(i/6), scale:scale};

		butterflyArray.push(obj);
	}

	// animals
	var loader = new THREE.Loader();
	loader.loadAscii( { model: "files/models/soup/a_wolf.js", callback: animalLoaded } );



	// collisionScene stuff should probably not be here (TEMP)
	var collisionDistance = 350;
	var FLOOR = -595;
	var collisionScene = new THREE.Scene();

	var plane = new Plane( 100, 100, 1, 1 );
	var invMaterial = new THREE.MeshLambertMaterial( { color:0xDE0000, opacity: 0.5 } );

	var downPlane = addMesh( plane, 100,  0, FLOOR, 0, -1.57,0,0, invMaterial, true );
	var rightPlane = addMesh( plane, 50,  camera.position.x+collisionDistance, camera.position.y, camera.position.z, 0,-1.57,0, invMaterial, false );
	var leftPlane = addMesh( plane, 50,  camera.position.x-collisionDistance, camera.position.y, camera.position.z, 0,1.57,0, invMaterial, false );
	var frontPlane = addMesh( plane, 50,  camera.position.x, camera.position.y, camera.position.z-collisionDistance, 0,0,-1.57, invMaterial, false );
	var backPlane = addMesh( plane, 50,  camera.position.x, camera.position.y, camera.position.z+collisionDistance, 0,3.14,1.57, invMaterial, false );
	var upPlane = addMesh( plane, 100,  0, FLOOR+(collisionDistance/2), 0, 1.57,0,0, invMaterial, false );
	// ---

	// emitter
	var projector = new THREE.Projector();
	var emitter = new Cube( 10, 10, 10, 1, 1 );
	var emitterMesh = addMesh( emitter, 1, camera.position.x, camera.position.y, camera.position.z, 0,0,0, new THREE.MeshLambertMaterial( { color: 0xFFFF33 } ) );
	var emitterFollow = addMesh( emitter, 1, camera.position.x, camera.position.y, camera.position.z, 0,0,0, new THREE.MeshLambertMaterial( { color: 0x3333FF } ) );


	this.update = function () {

		// collisionScene stuff should probably not be here (TEMP)
		rightPlane.position.x = camera.position.x+collisionDistance;
		leftPlane.position.x = camera.position.x-collisionDistance;
		frontPlane.position.z = camera.position.z-collisionDistance;
		backPlane.position.z = camera.position.z+collisionDistance;
		// ---

		r += 0.1;

		updateEmitter();
		runAll();

		THREE.AnimationHandler.update( 48 );

		butterfly_0.animate(r*8);
		butterfly_1.animate((r*8)+0.2);
		butterfly_2.animate((r*8)+0.4);
		butterfly_3.animate((r*8)+0.6);
		butterfly_4.animate((r*8)+0.8);

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
		var texture = { color: 0xffffff, skinning: true };
		var material = new THREE.MeshLambertMaterial( texture );

		for (var i=0; i<initSettings.numOfAnimals; ++i ) {
			var animal = new THREE.SkinnedMesh( geometry, material );

			var scale = 0.02+(Math.random()/14);
			if (i<2) {
				scale = 0.15;
			}
			
			var x = camera.position.x-100;
			var y = camera.position.y-100;
			var z = camera.position.z;

			animal.position.x = x;
			animal.position.y = y;
			animal.position.z = z;

			animal.matrixAutoUpdate = false;

			THREE.AnimationHandler.add( geometry.animation );

			scene.addObject( animal );
			var animation = new THREE.Animation( animal, "take_001", undefined, false );

			animation.offset = 0.1 * Math.random();
			animation.play();

			var followIndex = (i*2)+2;
			var obj = {c:animal, a:animation, x:x, y:y, z:z, f:followIndex, scale:scale*80};
			
			animalArray.push(obj);
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
					var w = Math.max(0.25, i/(10+pulse2));
					w = Math.min(w, 2)
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
			var obj =  animalArray[i]
			var animal = obj.c;
			var x = obj.x;
			var y = obj.y;
			var z = obj.z;
			var f = obj.f;
			var scale = obj.scale;

			var pulse = Math.cos((i-r*10)/15)*12;

			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetz = Math.cos(thisinc+((i-r*5)/8))*pulse;
			var offsety = Math.sin(thisinc+((i-r*5)/8))*pulse;


			var tox = vectorArray[f].x+offsetz;
			var toy = vectorArray[f].y//+offsety;
			var toz = vectorArray[f].z+offsetz;

			var cNormal = new THREE.Vector3(vectorArray[f].normalx, vectorArray[f].normaly, vectorArray[f].normalz);

			if (cNormal.y < -0.8 && offsety > 0) {
				toy = vectorArray[f].y;
			}
			if (cNormal.y > 0.8 && offsety < 0 ) {
				toy = vectorArray[f].y;
			}

			if (cNormal.z < -0.8 && offsetz > 0) {
				toz = vectorArray[f].z;
			}
			if (cNormal.z > 0.8 && offsetz < 0) {
				toz = vectorArray[f].z;
			}


			var divider = 2;

			var moveX = (tox-x)/divider;
			var moveY = (toy-y)/divider;
			var moveZ = (toz-z)/divider;


			var zvec = new THREE.Vector3(tox,toy,toz);
			zvec.subSelf( animal.position ).normalize();

			var xvec = new THREE.Vector3();
			//var yvec = new THREE.Vector3(vectorArray[f].normalx*-1, vectorArray[f].normaly*-1, vectorArray[f].normalz*-1);
			var yvec = new THREE.Vector3(0, -1, 0);

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

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
		for (var i=0; i<butterflyArray.length; ++i ) {
			var obj =  butterflyArray[i]
			var butterfly = obj.c;
			var x = obj.x;
			var y = obj.y;
			var z = obj.z;
			var f = obj.f;
			var scale = obj.scale;

			var pulse = Math.cos((i-r*10)/15)*settings.butterflyPulseMultiplier_1;

			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetz = Math.cos(thisinc+((i-r*5)/8))*pulse;
			var offsety = Math.sin(thisinc+((i-r*5)/8))*pulse;


			var tox = vectorArray[f].x+offsetz;
			var toy = vectorArray[f].y+offsety;
			var toz = vectorArray[f].z+offsetz;

			var cNormal = new THREE.Vector3(vectorArray[f].normalx, vectorArray[f].normaly, vectorArray[f].normalz);

			if (cNormal.y < -0.8 && offsety > 0) {
				toy = vectorArray[f].y;
			}
			if (cNormal.y > 0.8 && offsety < 0 ) {
				toy = vectorArray[f].y;
			}

			if (cNormal.z < -0.8 && offsetz > 0) {
				toz = vectorArray[f].z;
			}
			if (cNormal.z > 0.8 && offsetz < 0) {
				toz = vectorArray[f].z;
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

			butterflyArray[i].x = x;
			butterflyArray[i].y = y;
			butterflyArray[i].z = z;
		}

		pointLight.position.x = vectorArray[0].x;
		pointLight.position.y = vectorArray[0].y+5;
		pointLight.position.z = vectorArray[0].z;

	}

	function updateEmitter() {
		emitterMesh.position.y = FLOOR;

		var vector = new THREE.Vector3( ( mouseX / window.innerWidth ) * 2 - 1, - ( mouseY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );

		var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

		var intersects = ray.intersectScene( collisionScene );
		
		if ( intersects.length > 0) {
			for (var i=0; i<intersects.length; ++i ) {
				var check;
				if (vector.z < 0) {
					check = intersects[i].point.z < camera.position.z;
				} else {
					check = intersects[i].point.z > camera.position.z;
				}

				if (intersects[i].object != emitterMesh && intersects[i].object != emitterFollow) {
					emitterMesh.position = intersects[i].point;

					var face = intersects[i].face;
					var object = intersects[i].object;

					var normal = object.matrixRotationWorld.multiplyVector3( face.normal.clone() );
					
					currentNormal = normal;

					var amount = 7;

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

}
