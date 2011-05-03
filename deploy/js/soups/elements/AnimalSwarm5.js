var AnimalSwarm5 = function ( numOfAnimals, scene, vectorArray ) {
	
	var that = this;

	that.array = [];
	var scene = scene;
	var maxFollowIndex = 0;
	var followCount = 0;
	var lastFollowCount = 0;
	var lastFollowPos = new THREE.Vector3();

	that.initSettings = {

		numOfAnimals : numOfAnimals || 30

	};

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
		startPosition : new THREE.Vector3( 0, 0, 0 ),
		switchPosition : false
		//butterfly : false

	};
	
	var r = 0;
	var i;

	this.addAnimal = function( geometry, predefined, scale, morphArray, speedArray ) {
		
		var predefined = predefined || null;
		var scaleMultiplier = scale || 1.2;
		var morphArray = morphArray || null;
		var doubleSided = doubleSided || false;

		for ( i = 0; i < that.initSettings.numOfAnimals; ++i ) {
			
			if ((predefined == null && that.array[i] != undefined) || (predefined != that.array[i]) ) {
				continue;
			}

			if (speedArray == null) {
				speedArray = [1];
			}

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;
			mesh.position.copy(that.settings.startPosition);

			// test shadow
			//mesh.addChild( new THREE.ShadowVolume( new THREE.Sphere( 60, 5, 5 )));

			var scale = 0.02+(Math.random()/8);
			if (i<2) {
				scale = 0.15;
			}

			scale = Math.max(scale, 0.1);

			mesh.matrixAutoUpdate = false;

			mesh.visible = false;
			//mesh.scale.x = mesh.scale.y = mesh.scale.z = scale * scaleMultiplier;

			scene.addChild( mesh );
			var startMorph = 0;
			var endMorph = 0;
			if (morphArray != null) {
				startMorph = morphArray[i%morphArray.length]%animal.availableAnimals.length;
				endMorph = startMorph+1;
				var rnd = Math.round(Math.random());
				if ((rnd == 1 && startMorph > 0) || endMorph > animal.availableAnimals.length-1) {
					endMorph = startMorph-1;
				}
				//endMorph = Math.floor(Math.random()*animal.availableAnimals.length);
			}

			var speeda = speedArray[startMorph];
			var speedb = speedArray[endMorph];

			animal.play( animal.availableAnimals[ startMorph ], animal.availableAnimals[ endMorph ], 0, Math.random(), Math.random() );

			var count = Math.random();
			if (i<2) {
				count = 0;
			}

			ray = new THREE.Ray();
			ray.direction = new THREE.Vector3(0, -1, 0);

			var obj = { c: mesh, a: animal, f: 0, time: 0, lifetime: 0, dead: false, speeda: speeda, speedb: speedb, active: false, toPosition: new THREE.Vector3(0,0,0), normal: new THREE.Vector3(0, 1, 0), count: count, scale: scale * scaleMultiplier, origscale: scale * scaleMultiplier, ray: ray  };

			that.array[i] = obj;

		}
		
		return animal;

	};

	// switch animal test

	this.switchAnimal = function ( geometry, scale, index ) {

		console.log("switch");

		var scaleMultiplier = scale || 1.2;
		var arrayIndex = index || 0;

		/*if (speedArray == null) {
			speedArray = [1];
		}*/

		var animal = ROME.Animal( geometry, false );
		var mesh = animal.mesh;

		var scale = 0.02+(Math.random()/8);
		if (i<2) {
			scale = 0.15;
		}

		scale = Math.max(scale, 0.1);

		mesh.matrixAutoUpdate = false;

		scene.removeChild( that.array[arrayIndex].c );
		scene.addChild( mesh );
		
		var startMorph = 0;
		var endMorph = 0;
/*		if (morphArray != null) {
			startMorph = morphArray[i%morphArray.length]%animal.availableAnimals.length;
			endMorph = startMorph+1;
			var rnd = Math.round(Math.random());
			if ((rnd == 1 && startMorph > 0) || endMorph > animal.availableAnimals.length-1) {
				endMorph = startMorph-1;
			}
			//endMorph = Math.floor(Math.random()*animal.availableAnimals.length);
		}

		var speeda = speedArray[startMorph];
		var speedb = speedArray[endMorph];
*/
		animal.play( animal.availableAnimals[ startMorph ], animal.availableAnimals[ endMorph ], 0, Math.random(), Math.random() );

		//var obj = { c: mesh, a: animal, f: 0, time: 0, speeda: speeda, speedb: speedb, active: false, normal: new THREE.Vector3(0, 1, 0), count: count, scale: scale * scaleMultiplier, origscale: scale * scaleMultiplier, ray: ray  };

		that.array[arrayIndex].c = mesh;
		that.array[arrayIndex].a = animal;
		that.array[arrayIndex].scale = scale * scaleMultiplier;

	};

	this.create = function ( position, normal, toPosition ) {

		for ( i=0; i<that.initSettings.numOfAnimals; ++i ) {

			if ( that.array[i].active ) {

				continue;

			}

			var pos = new THREE.Vector3();
			var toPos = new THREE.Vector3();
			pos.copy(position);
			toPos.copy(toPosition);

			that.array[i].active = true;
			that.array[i].c.position = pos;
			that.array[i].normal.copy(normal);
			that.array[i].c.visible = true;
			that.array[i].f = 0;
			that.array[i].time = 0;
			that.array[i].lifetime = 0;
			that.array[i].dead = false;
			that.array[i].scale = that.array[i].origscale;
			that.array[i].toPosition = toPos.subSelf(pos).normalize();

			//console.log(that.array[i].toPosition.x+" - "+that.array[i].toPosition.y+" - "+that.array[i].toPosition.z);
			if (that.array[i].toPosition.x < 0) {
				that.array[i].toPosition.x*= -1;
			}
			if (that.array[i].toPosition.x < 0.5) {
				that.array[i].toPosition.x += 0.5;
			}
			if (that.array[i].toPosition.z < 0) {
				that.array[i].toPosition.z += 0.5;
			}

			/*that.array[i].toPosition.x *= 1-Math.abs(normal.x);
			that.array[i].toPosition.y *= 1-Math.abs(normal.y);
			that.array[i].toPosition.z *= 1-Math.abs(normal.z);*/

			/*if (that.settings.flying) {
				that.array[i].normal.set(0,1,0);
			}*/

			// tween scale
			/*that.array[i].scale *= 0.25;
			var scaleTween = new TWEEN.Tween(that.array[i])
				.to({scale: that.array[i].origscale}, 1500)
				.easing(TWEEN.Easing.Elastic.EaseOut)
				//.delay(200);
			scaleTween.start();
			*/
			// tween popup
			var scale = that.array[i].scale;
			that.array[i].c.position.x -= (normal.x)*(scale*400);
			that.array[i].c.position.y -= (normal.y)*(scale*400);
			that.array[i].c.position.z -= (normal.z)*(scale*400);

			//console.log(scale*200);
/*			var popupTween = new TWEEN.Tween(that.array[i].c.position)
				.to({x: position.x, y: position.y, z: position.z}, 3000)
				.easing(TWEEN.Easing.Elastic.EaseOut);
			popupTween.start();
*/

			//console.log("created animal- "+that.array[i].toVector.x+" | "+that.array[i].toVector.y+" | "+that.array[i].toVector.y);
			break;
		}
	}

	this.update = function (delta, camPos) {

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}


		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			var obj =  that.array[i];
			var active = obj.active;
			if (!active) {
				continue;
			}


			var animal = obj.c;
			var anim = obj.a;
			var scale = obj.scale;
			var normal = obj.normal;
			var f = obj.f;

			var wasDead = that.array[i].dead;

			that.array[i].time += delta;
			that.array[i].lifetime += delta;

			if (that.array[i].lifetime > 2500) {
				that.array[i].dead = true;
				//that.array[i].active = false;
				//that.array[i].c.visible = false;
			}

			// morph
			that.array[i].count += 0.04;
			var morph = Math.max(Math.cos(that.array[i].count),0);
			morph = Math.min(morph, 1)
			that.array[i].a.morph = morph;
		
			var animalSpeed = obj.speeda;
			if (Math.round(morph) == 1) {
				animalSpeed = obj.speedb;
			}

			// change follow index
			//var changeTime = Math.max(animalSpeed*18, 80);
			//var changeTime = Math.max(animalSpeed*25, 100);
			//var changeTime = Math.max(animalSpeed*30, 110);

			//var dx = animal.position.x - vectorArray[f].position.x, dy = animal.position.y - vectorArray[f].position.y, dz = animal.position.z - vectorArray[f].position.z;
			//var distance =  Math.abs(dx * dx + dy * dy + dz * dz);

			/*if (that.array[i].time > changeTime) {
			//if (distance > 200 && that.array[i].time > 200) {
				++that.array[i].f;
				
				if (that.array[i].f >= 5 && that.array[i].attack == 0) {
					that.array[i].f = 0;
					that.array[i].attack = 1;
				}

				if (that.array[i].f >= 10 && that.array[i].attack == 1) {
					that.array[i].f = 5;
					that.array[i].attack = 2;
				}
				if (that.array[i].f >= 15 && that.array[i].attack == 2) {
					that.array[i].f = 10;
					that.array[i].attack = 3;
				}

				if (that.array[i].f >= 29) {
					//that.array[i].active = false;
					//that.array[i].c.visible = false;
					that.array[i].f = 29;
					that.array[i].dead = true;
				}

				f = that.array[i].f;
				that.array[i].time = 0;
			}*/

/*			var tox = toPosition.x;
			var toy = toPosition.y;
			var toz = toPosition.z;
*/


			var tox = animal.position.x+(that.array[i].toPosition.x*100);
			var toy = animal.position.y+(that.array[i].toPosition.y*100);
			var toz = animal.position.z+(that.array[i].toPosition.z*100);

/*			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetx = Math.cos(thisinc+((i-r*2)/8))*that.settings.xPositionMultiplier;
			var offsetz = Math.sin(thisinc+((i-r*2)/8))*that.settings.zPositionMultiplier;
			var offsety = offsetz;
			
			var cNormal = vectorArray[f].normal;

			var amountx = 1-Math.abs(cNormal.x);
			var amountz = 1-Math.abs(cNormal.z);
			var amounty = 1-Math.abs(cNormal.y);

			var tox = vectorArray[f].position.x+(offsetx*amountx);
			var toy = vectorArray[f].position.y+(offsety*amounty);
			var toz = vectorArray[f].position.z+(offsetz*amountz);
*/
			if (normal.y > 0.5) {
				toy = vectorArray[f].position.y - 10;
			}

			if (that.settings.capy != null && toy < that.settings.capy) {
				toy = that.settings.capy;
			}

			// test
			/*if (toz > animal.position.z) {
				toz = animal.position.z;
			}*/

			// flying

			if (that.settings.flying) {
				toy = that.array[i].toPosition.y+that.settings.flyingDistance;
			}
			/*if (that.settings.flying) {
				//var pulse = Math.cos((i-r*10)/15)*10
				var flyAmount = that.settings.flyingDistance//+Math.abs(Math.sin((thisinc+pulse)/10)*30);			

				if (normal.x < -0.8) {
					tox -= flyAmount;
				}
				if (normal.x > 0.8) {
					tox += flyAmount;
				}
				if (normal.y < -0.8 || normal.y > 0.8) {
					toy += flyAmount;
				}
				if (normal.z < -0.8) {
					toz -= flyAmount;
				}
				if (normal.z > 0.8) {
					toz += flyAmount;
				}
			}*/


			if (that.settings.constantSpeed != null) {
				that.array[i].a.animalA.timeScale = that.settings.constantSpeed;
				that.array[i].a.animalB.timeScale = that.settings.constantSpeed;
			}


			if (that.settings.shootRayDown) {

				var ray = obj.ray;
				//animal.position.y += 500;
				ray.origin.copy( animal.position );
				ray.origin.y += 500;

				var c = scene.collisions.rayCastNearest(ray);

				if(c) {

					//animal.position.y -= ( c.distance * 1 ) + 3;
					toy = ray.origin.y - ( ( c.distance * 1 ) + 3 );
					normal = c.mesh.matrixRotationWorld.multiplyVector3( c.normal ).normalize();
				
				}

			}

			var divider = 4;
			var ydivider = 2;
			if (that.settings.flying) {
				ydivider = 8;
			}

			if (that.array[i].dead && !wasDead) {
				// tween scale
				var scaleTween = new TWEEN.Tween(that.array[i])
					.to({scale: that.array[i].scale*0.1}, 400)
					.easing(TWEEN.Easing.Quartic.EaseIn);
				scaleTween.start()
			}

			var moveX = (tox-animal.position.x)/divider;//that.settings.divider;
			var moveY = (toy-animal.position.y)/ydivider;//that.settings.divider;
			var moveZ = (toz-animal.position.z)/divider;//that.settings.divider;

			if (that.array[i].dead && scale <= 0.01) {
				that.array[i].active = false;
				that.array[i].c.visible = false;
				continue;
			}

			/*var moveNormalX = (vectorArray[f].normal.x-normal.x)/5;
			var moveNormalY = (vectorArray[f].normal.y-normal.y)/5;
			var moveNormalZ = (vectorArray[f].normal.z-normal.z)/5;

			normal.x += moveNormalX;
			normal.y += moveNormalY;
			normal.z += moveNormalZ;

			obj.normal = normal;*/

			//var falloffDivider = 8+(f/5);

			var maxSpeed = animalSpeed/15//falloffDivider//3//delta/3;//12;

			//if ( moveY > maxSpeed )	moveY = maxSpeed;
			//if ( moveY < -maxSpeed ) moveY = -maxSpeed;

			if ( moveX > maxSpeed )	moveX = maxSpeed;
			if ( moveX < -maxSpeed ) moveX = -maxSpeed;

			if ( moveZ > maxSpeed )	moveZ = maxSpeed;
			if ( moveZ < -maxSpeed )moveZ = -maxSpeed;

			var zvec = new THREE.Vector3(animal.position.x+moveX,animal.position.y+moveY,animal.position.z+moveZ);
			zvec.subSelf( animal.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(normal.x*-1, normal.y*-1, normal.z*-1);
			if (that.settings.flying) {
				yvec = new THREE.Vector3(0, -1, 0);
			}

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			animal.matrixWorld.n11 = xvec.x*scale; animal.matrixWorld.n12 = yvec.x*scale; animal.matrixWorld.n13 = zvec.x*scale; animal.matrixWorld.n14 = animal.position.x+moveX;
			animal.matrixWorld.n21 = xvec.y*scale; animal.matrixWorld.n22 = yvec.y*scale; animal.matrixWorld.n23 = zvec.y*scale; animal.matrixWorld.n24 = animal.position.y+moveY;
			animal.matrixWorld.n31 = xvec.z*scale; animal.matrixWorld.n32 = yvec.z*scale; animal.matrixWorld.n33 = zvec.z*scale; animal.matrixWorld.n34 = animal.position.z+moveZ;

			/*if (that.settings.addaptiveSpeed) {
				var dx = animal.position.x - (animal.position.x+moveX), dy = animal.position.y - (animal.position.y+moveY), dz = animal.position.z - (animal.position.z+moveZ);
				var distance =  Math.abs(dx * dx + dy * dy + dz * dz);

				var speed = Math.max(distance/(delta), 0.65);
				speed = Math.min(speed, 1.5);
				
				that.array[i].a.animalA.timeScale = speed;
				that.array[i].a.animalB.timeScale = speed;
			}*/

			animal.position.x += moveX;
			animal.position.y += moveY;		
			animal.position.z += moveZ;
			




			/*if (animal.position.x < camPos.x+30 && animal.position.x > camPos.x-30 && animal.position.z < camPos.z+30 && animal.position.z > camPos.z-30) {
				that.array[i].active = false;
				that.array[i].c.visible = false;
			}*/

			// hack..
			if (animal.position.x < camPos.x-100) {
				that.array[i].active = false;
				that.array[i].c.visible = false;
			}

		}


/*		r += 0.1

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}

		//followCount = Math.round(r/4);

		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			var obj =  that.array[i];
			var animal = obj.c;
			//var f = obj.f;
			var anim = obj.a;
			var scale = obj.scale;
			//var clockwise = obj.clockwise;

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

			animal.visible = that.settings.visible;
		}

		lastFollowCount = followCount;
*/
	}



	this.reset = function ( x,y,z ) {

		for (var i=0; i<that.initSettings.numOfAnimals; ++i ) {
			var obj = that.array[i].c;
			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;

			that.array[i].active = false;
		}

	}

}