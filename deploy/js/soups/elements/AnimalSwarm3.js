var AnimalSwarm3 = function ( numOfAnimals, scene, vectorArray ) {
	
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

			var obj = { c: mesh, a: animal, f: 0, time: 0, lifetime: 0, dead: false, startMorph: startMorph, endMorph: endMorph, speeda: speeda, speedb: speedb, active: false, normal: new THREE.Vector3(0, 1, 0), count: count, scale: scale * scaleMultiplier, origscale: scale * scaleMultiplier, ray: ray  };

			that.array[i] = obj;

		}

	}

	// remove animal test
	this.removeAnimal = function (geometry, morph) {
		for ( i = 0; i < that.initSettings.numOfAnimals; ++i ) {
			var a = that.array[i].a;
			if (a == undefined) {
				continue;
			}
			var startMorph = that.array[i].startMorph;
			var endMorph = that.array[i].endMorph;

			if (a.mesh.geometry == geometry && (morph == startMorph || morph == endMorph)) {
				//console.log("found match = "+i);
				scene.removeChild( that.array[i].c );
				
				delete that.array[i].a;
				that.array[i].active = false;

				break;
			}

		}
	}

	// switch animal test
	this.switchAnimal = function (geometry, scale, speed, morph) {
		//console.log("adding on index = "+index);
	
		var scaleMultiplier = scale || 1.2;
		//var arrayIndex = index || 0;
		//var startMorph = morph || 0;
		//var endMorph = morph || 0;

		for ( i = 0; i < that.initSettings.numOfAnimals; ++i ) {
			var a = that.array[i].a;

			var startMorph = that.array[i].startMorph;
			var endMorph = that.array[i].endMorph;

			if (a != undefined && a.mesh.geometry == geometry && (startMorph == morph || endMorph == morph)) {
				continue;
			}

			console.log("adding on "+i);

			var oldPosition = that.array[i].c.position;

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;

			var scale = 0.02+(Math.random()/8);
			if (i<2) {
				scale = 0.15;
			}

			scale = Math.max(scale, 0.1);
			mesh.position = oldPosition;
			mesh.visible = false;
			mesh.scale.set(0.00001,0.00001,0.00001);

			mesh.updateMatrix();

			mesh.matrixAutoUpdate = false;
			
			scene.removeChild( that.array[i].c );
			scene.addChild( mesh );
			
			var speeda = speed;
			var speedb = speed;

			animal.play( animal.availableAnimals[ morph ], animal.availableAnimals[ morph ], 0, Math.random(), Math.random() );

			that.array[i].c = mesh;
			that.array[i].a = animal;
			that.array[i].scale = scale * scaleMultiplier;
			that.array[i].origscale = scale * scaleMultiplier;
			that.array[i].speeda = speed;
			that.array[i].speedb = speed;
			that.array[i].active = false;
			that.array[i].startMorph = morph;
			that.array[i].endMorph = morph;

			break;

		}
		
	}

	this.create = function (position, normal) {
		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			if (that.array[i].active || that.array[i].a == undefined) {
				continue;
			}

			that.array[i].active = true;
			that.array[i].c.position.copy(position);
			that.array[i].normal.copy(normal);
			that.array[i].c.visible = true;
			that.array[i].f = 0;
			that.array[i].time = 0;
			that.array[i].lifetime = 0;
			that.array[i].dead = false;
			
			/*if (that.settings.flying) {
				that.array[i].normal.set(0,1,0);
			}*/

			// tween scale
			that.array[i].scale *= 0.25;
			var scaleTween = new TWEEN.Tween(that.array[i])
				.to({scale: that.array[i].origscale}, 2000)
				.easing(TWEEN.Easing.Elastic.EaseOut)
				.delay(200);
			scaleTween.start();
			
			// tween popup
			var scale = that.array[i].scale;
			that.array[i].c.position.x -= (normal.x)*(scale*180);
			that.array[i].c.position.y -= (normal.y)*(scale*180);
			that.array[i].c.position.z -= (normal.z)*(scale*180);

			//console.log(scale*200);
/*			var popupTween = new TWEEN.Tween(that.array[i].c.position)
				.to({x: position.x, y: position.y, z: position.z}, 3000)
				.easing(TWEEN.Easing.Elastic.EaseOut);
			popupTween.start();
*/

			//console.log("created animal- "+that.array[i].toVector.x+" | "+that.array[i].toVector.y+" | "+that.array[i].toVector.y);
			//console.log("created animal - "+i);
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
			var changeTime = Math.max(animalSpeed*25, 80);
			//var changeTime = Math.max(animalSpeed*30, 110);

			//var dx = animal.position.x - vectorArray[f].position.x, dy = animal.position.y - vectorArray[f].position.y, dz = animal.position.z - vectorArray[f].position.z;
			//var distance =  Math.abs(dx * dx + dy * dy + dz * dz);

			if (that.array[i].time > changeTime) {
			//if (distance > 200 && that.array[i].time > 200) {
				++that.array[i].f;
				
				if (that.array[i].f >= 40) {
					that.array[i].f = 40;
					that.array[i].dead = true;
					//that.array[i].active = false;
					//that.array[i].c.visible = false;
				}

				f = that.array[i].f;
				that.array[i].time = 0;
			}

/*			var tox = toPosition.x;
			var toy = toPosition.y;
			var toz = toPosition.z;
*/



			var inc = (Math.PI*2)/6;
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

			if (cNormal.y > 0.5) {
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
				//var pulse = Math.cos((i-r*10)/15)*10
				var flyAmount = that.settings.flyingDistance//+Math.abs(Math.sin((thisinc+pulse)/10)*30);			

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


			if (that.settings.constantSpeed != null) {
				that.array[i].a.animalA.timeScale = that.settings.constantSpeed;
				that.array[i].a.animalB.timeScale = that.settings.constantSpeed;
			}


			var divider = 7;

			var moveX = (tox-animal.position.x)/divider;//that.settings.divider;
			var moveY = (toy-animal.position.y)/divider;//that.settings.divider;
			var moveZ = (toz-animal.position.z)/divider;//that.settings.divider;

			if (that.array[i].dead && !wasDead) {
				// tween scale
				var scaleTween = new TWEEN.Tween(that.array[i])
					.to({scale: that.array[i].scale*0.1}, 400)
					.easing(TWEEN.Easing.Quartic.EaseIn);
				scaleTween.start()
			}

			if (that.array[i].dead && scale <= 0.1) {
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

			var falloffDivider = 2+(f/10);

			var maxSpeed = animalSpeed/falloffDivider//3//delta/3;//12;


			if ( moveY > maxSpeed )	moveY = maxSpeed;
			if ( moveY < -maxSpeed ) moveY = -maxSpeed;

			if ( moveX > maxSpeed )	moveX = maxSpeed;
			if ( moveX < -maxSpeed ) moveX = -maxSpeed;

			if ( moveZ > maxSpeed )	moveZ = maxSpeed;
			if ( moveZ < -maxSpeed )moveZ = -maxSpeed;

			var zvec = new THREE.Vector3(animal.position.x+moveX,animal.position.y+moveY,animal.position.z+moveZ);
			zvec.subSelf( animal.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(cNormal.x*-1, cNormal.y*-1, cNormal.z*-1);
			if (that.settings.flying && !that.settings.butterfly) {
				yvec = new THREE.Vector3(0, -1, 0);
			}

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			animal.matrixWorld.n11 = xvec.x*scale; animal.matrixWorld.n12 = yvec.x*scale; animal.matrixWorld.n13 = zvec.x*scale; animal.matrixWorld.n14 = animal.position.x;
			animal.matrixWorld.n21 = xvec.y*scale; animal.matrixWorld.n22 = yvec.y*scale; animal.matrixWorld.n23 = zvec.y*scale; animal.matrixWorld.n24 = animal.position.y;
			animal.matrixWorld.n31 = xvec.z*scale; animal.matrixWorld.n32 = yvec.z*scale; animal.matrixWorld.n33 = zvec.z*scale; animal.matrixWorld.n34 = animal.position.z;

			/*if (that.settings.addaptiveSpeed) {
				var dx = animal.position.x - (animal.position.x+moveX), dy = animal.position.y - (animal.position.y+moveY), dz = animal.position.z - (animal.position.z+moveZ);
				var distance =  Math.abs(dx * dx + dy * dy + dz * dz);

				var speed = Math.max(distance/delta, 0.65);
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
			}

			// hack..
			if (animal.position.z > camPos.z+170) {
				that.array[i].active = false;
				that.array[i].c.visible = false;
			}*/

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