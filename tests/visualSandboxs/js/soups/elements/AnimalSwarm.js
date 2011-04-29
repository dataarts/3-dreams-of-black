var AnimalSwarm = function ( numOfAnimals, scene, vectorArray ) {
	
	var that = this;

	that.array = [];
	var scene = scene;
	var maxFollowIndex = 0;
	var followCount = 0;
	var lastFollowCount = 0;

	that.initSettings = {
		numOfAnimals : numOfAnimals || 30,
	}

	that.settings = {
		divider : 2,
		flying : false,
		flyingDistance : 35,
		xPositionMultiplier : 30,
		zPositionMultiplier : 30,
		constantSpeed : null,
		visible : true,
		shootRayDown : false,
		addaptiveSpeed : false,
		capy : null,
		startPosition : new THREE.Vector3(0,0,0),
		switchPosition : false,
		//butterfly : false,
	}
	
	var r = 0;
	var i;

	this.addAnimal = function( geometry, predefined, scale, morphArray, followDivider, colorArray, doubleSided ) {
		
		var predefined = predefined || null;
		var scaleMultiplier = scale || 1.2;
		var morphArray = morphArray || null;
		var followDivider = followDivider || 4;
		var doubleSided = doubleSided || false;

		for ( i = 0; i < that.initSettings.numOfAnimals; ++i ) {
			
			if ((predefined == null && that.array[i] != undefined) || (predefined != that.array[i]) ) {
				continue;
			}

			var col = new THREE.Color( Math.random() * 0xffffff );
			if (colorArray != undefined && colorArray != null) {
				col = colorArray[i%colorArray.length];
			}

			var animal = ROME.Animal( geometry, false, col );
			var mesh = animal.mesh;
			mesh.position.copy(that.settings.startPosition);
			mesh.doubleSided = doubleSided;

			// test shadow
			//mesh.addChild( new THREE.ShadowVolume( new THREE.Sphere( 60, 5, 5 )));

			var followIndex = Math.floor(i/followDivider);

			var scale = 0.02+(Math.random()/8);
			if (i<2) {
				scale = 0.15;
				followIndex = i;
			}

			if (followIndex > maxFollowIndex) {
				maxFollowIndex = followIndex;
			}

			scale = Math.max(scale, 0.1);

			mesh.matrixAutoUpdate = false;

			scene.addChild( mesh );
			var startMorph = 0;
			var endMorph = 0;
			if (morphArray != null) {
				startMorph = morphArray[i%morphArray.length]%animal.availableAnimals.length;
				endMorph = Math.floor(Math.random()*animal.availableAnimals.length);
			}

			animal.play( animal.availableAnimals[ startMorph ], animal.availableAnimals[ endMorph ], 0, Math.random(), Math.random() );

			var count = Math.random();
			if (i<2) {
				count = 0;
			}
	
			var clockwise = i%2 == 0;

			ray = new THREE.Ray();
			ray.direction = new THREE.Vector3(0, -1, 0);

			var obj = { c: mesh, a: animal, f: followIndex, count: count, clockwise: clockwise, scale: scale * scaleMultiplier, ray: ray  };

			that.array[i] = obj;

		}

	}

	this.update = function (delta) {

		r += 0.1

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}

		/*var dx = vectorArray[0].lastposition.x - vectorArray[0].position.x, dy = vectorArray[0].lastposition.y - vectorArray[0].position.y, dz = vectorArray[0].lastposition.z - vectorArray[0].position.z;
		var distance =  dx * dx + dy * dy + dz * dz;
		
		var speed = Math.max(distance/100, 1.0);
		speed = Math.min(speed, 1.5);*/

		followCount = Math.round(r/4);

		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			var obj =  that.array[i];
			var animal = obj.c;
			var f = obj.f;
			var anim = obj.a;
			var scale = obj.scale;
			var clockwise = obj.clockwise;

			//var pulse = Math.cos((i-r*10)/35)*(35-(i*1.5));

			// change follow index
			if (followCount != lastFollowCount && that.settings.switchPosition) {
				if (clockwise) {
					++that.array[i].f;
				} else {
					--that.array[i].f;				
				}
				if (that.array[i].f > maxFollowIndex) {
					that.array[i].clockwise = false;
					that.array[i].f = maxFollowIndex;
				}
				if (that.array[i].f <= 0) {
					that.array[i].clockwise = true;
					that.array[i].f = 0;
				}

				f = that.array[i].f;
			}

			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetx = Math.cos(thisinc+((i-r*2)/8))*that.settings.xPositionMultiplier;
			var offsetz = Math.sin(thisinc+((i-r*2)/8))*that.settings.zPositionMultiplier;
			var offsety = offsetz;
			
			if (f >= vectorArray.length-1) {
				f = vectorArray.length-1;
			}

			var cNormal = vectorArray[f].normal;

			var amountx = 1-Math.abs(cNormal.x);
			var amountz = 1-Math.abs(cNormal.z);
			var amounty = 1-Math.abs(cNormal.y);

			var tox = vectorArray[f].position.x+(offsetx*amountx);
			var toy = vectorArray[f].position.y+(offsety*amounty);
			var toz = vectorArray[f].position.z+(offsetz*amountz);

			if (!clockwise) {
				tox = vectorArray[f].position.x-(offsetx*amountx);
				toy = vectorArray[f].position.y-(offsety*amounty);
				toz = vectorArray[f].position.z-(offsetz*amountz);
			}

			if (cNormal.y > 0.5) {
				toy = vectorArray[f].position.y - 6*1.75;
			}

			if (that.settings.capy != null && toy < that.settings.capy) {
				toy = that.settings.capy;
			}

			// flying
			if (that.settings.flying) {
				var pulse = Math.cos((i-r*10)/15)*10
				var flyAmount = that.settings.flyingDistance+Math.abs(Math.sin((thisinc+pulse)/10)*30);			

				if (cNormal.x < -0.8) {
					tox -= flyAmount;
				}
				if (cNormal.x > 0.8) {
					tox += flyAmount;
				}
				if (cNormal.y < -0.8 || cNormal.y > 0.8) {
					toy += flyAmount;
				}
				if (cNormal.z < -0.8) {
					toz -= flyAmount;
				}
				if (cNormal.z > 0.8) {
					toz += flyAmount;
				}
			}

			/*if (that.settings.butterfly) {
				var flyAmount = that.settings.flyingDistance-Math.sin((i+r))*20;			

				tox += cNormal.x*flyAmount;
				toy += cNormal.y*flyAmount;
				toz += cNormal.z*flyAmount;

			}*/

			// morph
			that.array[i].count += 0.01;
			var morph = Math.max(Math.cos(that.array[i].count),0);
			morph = Math.min(morph, 1)
			that.array[i].a.morph = morph;

			if (that.settings.constantSpeed != null) {
				that.array[i].a.animalA.timeScale = that.settings.constantSpeed;
				that.array[i].a.animalB.timeScale = that.settings.constantSpeed;
			}

			//var divider = delta/10;
			var divider = 10;

			var moveX = (tox-animal.position.x)/divider;//that.settings.divider;
			var moveY = (toy-animal.position.y)/divider;//that.settings.divider;
			var moveZ = (toz-animal.position.z)/divider;//that.settings.divider;

			var maxSpeed = delta/3;//12;

			if ( moveY > maxSpeed )	moveY = maxSpeed;
			if ( moveY < -maxSpeed ) moveY = -maxSpeed;

			if ( moveX > maxSpeed )	moveX = maxSpeed;
			if ( moveX < -maxSpeed ) moveX = -maxSpeed;

			if ( moveZ > maxSpeed )	moveZ = maxSpeed;
			if ( moveZ < -maxSpeed )moveZ = -maxSpeed;

			var zvec = new THREE.Vector3(animal.position.x+moveX,animal.position.y+moveY,animal.position.z+moveZ);
			zvec.subSelf( animal.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(vectorArray[f].normal.x*-1, vectorArray[f].normal.y*-1, vectorArray[f].normal.z*-1);
			if (that.settings.flying && !that.settings.butterfly) {
				yvec = new THREE.Vector3(0, -1, 0);
			}

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			animal.matrixWorld.n11 = xvec.x*scale; animal.matrixWorld.n12 = yvec.x*scale; animal.matrixWorld.n13 = zvec.x*scale; animal.matrixWorld.n14 = animal.position.x;
			animal.matrixWorld.n21 = xvec.y*scale; animal.matrixWorld.n22 = yvec.y*scale; animal.matrixWorld.n23 = zvec.y*scale; animal.matrixWorld.n24 = animal.position.y;
			animal.matrixWorld.n31 = xvec.z*scale; animal.matrixWorld.n32 = yvec.z*scale; animal.matrixWorld.n33 = zvec.z*scale; animal.matrixWorld.n34 = animal.position.z;

			if (that.settings.addaptiveSpeed) {
				var dx = animal.position.x - (animal.position.x+moveX), dy = animal.position.y - (animal.position.y+moveY), dz = animal.position.z - (animal.position.z+moveZ);
				var distance =  Math.abs(dx * dx + dy * dy + dz * dz);

				var speed = Math.max(distance/delta, 0.8);
				speed = Math.min(speed, 2.0);
				
				that.array[i].a.animalA.timeScale = speed;
				that.array[i].a.animalB.timeScale = speed;
			}

			animal.position.x += moveX;
			animal.position.y += moveY;
			animal.position.z += moveZ;

			/*if (that.settings.shootRayDown) {

				var ray = obj.ray;
				ray.origin.y = animal.position.y-100;
				ray.origin.x = animal.position.x;
				ray.origin.z = animal.position.z;
	
				var c = THREE.Collisions.rayCastNearest(ray);
				if(c) {
					//var positionVector = new THREE.Vector3();
					//positionVector.copy( ray.origin );
					//positionVector.subSelf(ray.direction.multiplyScalar(c.distance*1));
					var positionVector = ray.origin.clone().addSelf( new THREE.Vector3(0, c.distance, 0) );

					animal.position.y = positionVector.y;

					//console.log(c.distance);
					//info.innerHTML = "Found @ distance " + c.distance;
					//sphere.position = ray.origin.clone().subSelf( new THREE.Vector3(0, c.distance - sphereSize/2, 0) );
				} else {
					//info.innerHTML = "No intersection";
				}

			}*/

			animal.visible = that.settings.visible;
		}

		lastFollowCount = followCount;

	}

	this.reset = function ( x,y,z ) {

		for (var i=0; i<that.array.length; ++i ) {
			var obj = that.array[i].c;
			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;
		}

	}

}