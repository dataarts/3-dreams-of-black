var AnimalSwarm2 = function ( numOfAnimals, scene, vectorArray ) {

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
		xPositionMultiplier : 25,
		zPositionMultiplier : 25,
		constantSpeed : null,
		visible : true,
		shootRayDown : false,
		addaptiveSpeed : false,
		capy : null,
		startPosition : new THREE.Vector3(0,0,0),
		switchPosition : false
		//butterfly : false,

	};

	var r = 0;
	var i;

	this.addAnimal = function( geometry, predefined, scale, morphArray, speedArray, sockPuppetSpecialCase ) {

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

			if (sockPuppetSpecialCase) {
				var animal = ROME.Animal_old( geometry, false );
			} else {
				var animal = ROME.Animal( geometry, false );
			}

			//var animal = ROME.Animal( geometry, false );
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

			scene.addChild( mesh );
			var startMorph = 0;
			var endMorph = 0;
			if (morphArray != null) {
				startMorph = morphArray[i%morphArray.length]%animal.availableAnimals.length;
				endMorph = Math.floor(Math.random()*animal.availableAnimals.length);
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

			var obj = { c: mesh, a: animal, positionArray: [], normalArray: [], lifetime: 0, dead: false, speeda: speeda, speedb: speedb, active: false, normal: new THREE.Vector3(0, 1, 0), toNormal: new THREE.Vector3(0, 1, 0), toPosition: new THREE.Vector3(), count: count, scale: scale * scaleMultiplier, origscale: scale * scaleMultiplier, ray: ray, sockPuppetSpecialCase: sockPuppetSpecialCase  };

			that.array[i] = obj;

		}

	}

	this.create = function (position, toNormal, toPosition) {
		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			if (that.array[i].active) {
				continue;
			}

			that.array[i].active = true;
			that.array[i].c.position.copy(position);
			that.array[i].toNormal.copy(toNormal);
			that.array[i].c.visible = true;
			that.array[i].toPosition.copy(toPosition);
			that.array[i].scale = 0.01;
			that.array[i].positionArray = [];
			that.array[i].normalArray = [toNormal];
			that.array[i].lifetime = 0;
			that.array[i].dead = false;

			if (that.settings.flying) {
				that.array[i].toNormal.set(0,1,0);
				that.array[i].normal.set(0,1,0);
			}

			// tween scale
			var scaleTween = new TWEEN.Tween(that.array[i])
				.to({scale: that.array[i].origscale}, 300)
				.easing(TWEEN.Easing.Linear.EaseNone);
			scaleTween.start();
			
			// tween popup
			var multiplier = 100;
			
			var scale = that.array[i].origscale;
			that.array[i].c.position.x -= (toNormal.x)*(scale*multiplier);
			that.array[i].c.position.y -= (toNormal.y)*(scale*multiplier);
			that.array[i].c.position.z -= (toNormal.z)*(scale*multiplier);

			//that.array[i].a.morph = that.array[i].startMorph;
			//console.log("created animal- "+that.array[i].toVector.x+" | "+that.array[i].toVector.y+" | "+that.array[i].toVector.y);
			break;
		}
	}

	this.update = function (delta, camPos, followPos, followNormal) {

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}

		var addFollow = true;
		/*var addFollow = false;
		var dx = lastFollowPos.x - followPos.x, dy = lastFollowPos.y - followPos.y, dz = lastFollowPos.z - followPos.z;
		var distance =  Math.abs(dx * dx + dy * dy + dz * dz);
		if (distance > 5) {
			addFollow = true;
		}

		lastFollowPos.copy(followPos);
*/
		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			var obj =  that.array[i];
			var active = obj.active;
			if (!active) {
				continue;
			}

			if (addFollow) {
				var follow = new THREE.Vector3();
				var norm = new THREE.Vector3();

				that.array[i].positionArray.push(follow.copy(followPos));
				that.array[i].normalArray.push(norm.copy(followNormal));
			}

			var positionArray = that.array[i].positionArray;
			var animal = obj.c;
			var anim = obj.a;
			var scale = obj.scale;
			var toNormal = obj.toNormal;
			var normal = obj.normal;
			var toPosition = obj.toPosition;
			var wasDead = that.array[i].dead;

			that.array[i].lifetime += delta;

			if (that.array[i].lifetime > 2500) {
				that.array[i].dead = true;
			}


			/*var tox = animal.position.x+(toVector.x*10);
			var toy = animal.position.y+(toVector.y*10);
			var toz = animal.position.z+(toVector.z*10);*/

/*			var tox = toPosition.x;
			var toy = toPosition.y;
			var toz = toPosition.z;
*/
			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetx = Math.cos(thisinc+((i-r*2)/8))*that.settings.xPositionMultiplier;
			var offsetz = Math.sin(thisinc+((i-r*2)/8))*that.settings.zPositionMultiplier;
			var offsety = offsetz;

			var amountx = 1-Math.abs(normal.x);
			var amountz = 1-Math.abs(normal.z);
			var amounty = 1-Math.abs(normal.y);

			var tox = toPosition.x+(offsetx*amountx);
			var toy = toPosition.y+(offsety*amounty);
			var toz = toPosition.z+(offsetz*amountz);

			if (normal.y > 0.5) {
				toy = toPosition.y - 10;
			}

			if (that.settings.capy != null && toy < that.settings.capy) {
				toy = that.settings.capy;
			}

			// flying
			if (that.settings.flying) {
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
			}

			/*if (that.array[i].dead) {
				
				if (!that.settings.flying) {
					toy -= normal.y*20;
					tox -= normal.x*20;
					toz -= normal.z*20;
				} else {
					toy += 10;
				}
			}*/

			// morph
			that.array[i].count += 0.04;
			var morph = Math.max(Math.cos(that.array[i].count),0);
			morph = Math.min(morph, 1)
			that.array[i].a.morph = morph;


			if (that.settings.constantSpeed != null) {
				that.array[i].a.animalA.timeScale = that.settings.constantSpeed;
				that.array[i].a.animalB.timeScale = that.settings.constantSpeed;
			}

			//var divider = delta/10;
			var animalSpeed = obj.speeda;
			if (Math.round(morph) == 1) {
				animalSpeed = obj.speedb;
			}

			//var divider = 1.5;//15-animalSpeed;
			var divider = 8;

			if (that.array[i].sockPuppetSpecialCase) {
				divider = 100;
			}

			var moveX = (tox-animal.position.x)/divider;//that.settings.divider;
			var moveY = (toy-animal.position.y)/divider;//that.settings.divider;
			var moveZ = (toz-animal.position.z)/divider;//that.settings.divider;

/*			var moveX = (tox-animal.position.x);
			var moveY = (toy-animal.position.y);
			var moveZ = (toz-animal.position.z);
*/
			var moveNormalX = (toNormal.x-normal.x)/divider;
			var moveNormalY = (toNormal.y-normal.y)/divider;
			var moveNormalZ = (toNormal.z-normal.z)/divider;

			normal.x += moveNormalX;
			normal.y += moveNormalY;
			normal.z += moveNormalZ;

			obj.normal = normal;

			var maxSpeed = animalSpeed;

			if ( moveY > maxSpeed )	moveY = maxSpeed;
			if ( moveY < -maxSpeed ) moveY = -maxSpeed;

			if ( moveX > maxSpeed )	moveX = maxSpeed;
			if ( moveX < -maxSpeed ) moveX = -maxSpeed;

			if ( moveZ > maxSpeed )	moveZ = maxSpeed;
			if ( moveZ < -maxSpeed )moveZ = -maxSpeed;


			if (that.array[i].dead) {
				
				if (!that.settings.flying) {
					moveY -= normal.y*2;
					moveX -= normal.x*2;
					moveZ -= normal.z*2;
				} else {
					moveY += 2;
				}
			}

			// in city only
			//if (that.settings.avoidCamera) {
				if (animal.position.x+moveX < camPos.x+40 && animal.position.x+moveX > camPos.x-40 && animal.position.z+moveZ < camPos.z+40 && animal.position.z+moveZ > camPos.z-40) {
					that.array[i].dead = true;
				}
			//}

			if (that.array[i].dead && !wasDead) {
				// tween scale
				var scaleTween = new TWEEN.Tween(that.array[i])
					.to({scale: that.array[i].scale*0.1}, 400)
					.easing(TWEEN.Easing.Linear.EaseNone);
				scaleTween.start()
			}

			var scalecheck = 0.1;

			if (that.array[i].dead && scale <= scalecheck) {
				that.array[i].active = false;
				that.array[i].c.visible = false;
				continue;
			}


			var zvec = new THREE.Vector3(animal.position.x+moveX,animal.position.y+moveY,animal.position.z+moveZ);
			zvec.subSelf( animal.position ).normalize();


			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(normal.x*-1, normal.y*-1, normal.z*-1);
			if (that.settings.flying) {
				yvec = new THREE.Vector3(0, -1, 0);
			}

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			animal.matrixWorld.n11 = xvec.x*scale; animal.matrixWorld.n12 = yvec.x*scale; animal.matrixWorld.n13 = zvec.x*scale; animal.matrixWorld.n14 = animal.position.x;
			animal.matrixWorld.n21 = xvec.y*scale; animal.matrixWorld.n22 = yvec.y*scale; animal.matrixWorld.n23 = zvec.y*scale; animal.matrixWorld.n24 = animal.position.y;
			animal.matrixWorld.n31 = xvec.z*scale; animal.matrixWorld.n32 = yvec.z*scale; animal.matrixWorld.n33 = zvec.z*scale; animal.matrixWorld.n34 = animal.position.z;

			var dx = animal.position.x - (animal.position.x+moveX), dy = animal.position.y - (animal.position.y+moveY), dz = animal.position.z - (animal.position.z+moveZ);
			//var dx = animal.position.x - tox, dy = animal.position.y - toy, dz = animal.position.z - toz;
			var distance =  Math.abs(dx * dx + dy * dy + dz * dz);

			if (distance < delta/4 && positionArray != null) {
				if (positionArray.length > 0) {
					var toPos = that.array[i].positionArray.shift();
					var toNor = that.array[i].normalArray.shift();

					obj.toPosition.copy(toPos);
					obj.toNormal.copy(toNor);
				}
			}

			animal.position.x += moveX;
			animal.position.y += moveY;
			animal.position.z += moveZ;

			/*if (animal.position.x < camPos.x+30 && animal.position.x > camPos.x-30 && animal.position.z < camPos.z+30 && animal.position.z > camPos.z-30) {
				if (animal.position.x < camPos.x) {
					obj.toPosition.x = camPos.x-30;
				}
				if (animal.position.x > camPos.x) {
					obj.toPosition.x = camPos.x+30;
				}
			}*/

			// hack..
			/*if (animal.position.z > camPos.z+75) {
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

		for (var i=0; i<that.array.length; ++i ) {
			var obj = that.array[i].c;
			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;

			that.array[i].active = false;
		}

	}

}