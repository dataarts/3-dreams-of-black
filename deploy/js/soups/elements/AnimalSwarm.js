var AnimalSwarm = function ( numOfAnimals, scene, vectorArray ) {
	
	var that = this;

	that.array = [];
	var scene = scene;
	var maxFollowIndex = 0;
	var followCount = 0;
	var lastFollowCount = 0;
	var lastFollowPos = new THREE.Vector3();
	var rayCount = 0;

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
		switchPosition : false,
		respawn : true,
		gravity : false,
		avoidCamera : false,
		killAtDistance : false
		//butterfly : false

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

			var obj = { c: mesh, a: animal, f: i, keepRunning: false, time: 0, lifetime: 0, dead: false, startMorph: startMorph, endMorph: endMorph, speeda: speeda, speedb: speedb, toPosition: new THREE.Vector3(), active: false, normal: new THREE.Vector3(0, 1, 0), count: count, scale: scale * scaleMultiplier, origscale: scale * scaleMultiplier, ray: ray, rayIndex: i%2, lastToy: 0, sockPuppetSpecialCase: sockPuppetSpecialCase, generalSpecialCase: false  };

			that.array[i] = obj;

		}

		return animal;

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
	this.switchAnimal = function (geometry, scale, speed, morph, arrayIndex) {
		//console.log("adding on index = "+index);
	
		var scaleMultiplier = scale || 1.2;

		for ( i = 0; i < that.initSettings.numOfAnimals; ++i ) {
			if (arrayIndex != undefined) {
				i = arrayIndex;
			}

			var a = that.array[i].a;

			var startMorph = that.array[i].startMorph;
			var endMorph = that.array[i].endMorph;

			if (a != undefined && a.mesh.geometry == geometry && arrayIndex == undefined && (startMorph == morph || endMorph == morph)) {
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

	this.create = function (position, normal, toPosition) {
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
			that.array[i].scale = that.array[i].origscale;
			that.array[i].keepRunning = false;
			that.array[i].gravity = 0;
			that.array[i].count = 1;

			if (that.settings.gravity) {
				that.array[i].c.matrixAutoUpdate = true;
				that.array[i].c.scale.set(that.array[i].scale,that.array[i].scale,that.array[i].scale);

				that.array[i].c.rotation.x = 0;
				that.array[i].c.rotation.y = Math.random()*Math.PI;
			}

			if (!that.settings.respawn) {
				that.array[i].f = i;
			}

			if (toPosition != undefined) {
				/*var pos = new THREE.Vector3();
				var toPos = new THREE.Vector3();
				pos.copy(position);
				toPos.copy(toPosition);
				*/
				that.array[i].keepRunning = true; 
				that.array[i].toPosition.copy(toPosition);

				//that.array[i].toPosition.copy(toPos.subSelf(pos).normalize());

				// hack...
				/*if (that.array[i].toPosition.x < 0) {
					that.array[i].toPosition.x *= -1;
				}
				if (that.array[i].toPosition.x < 0.5) {
					that.array[i].toPosition.x += 0.5;
				}
				if (that.array[i].toPosition.z > 0) {
					that.array[i].toPosition.z -= 0.5;
				}*/

				//that.array[i].toPosition.set(0.7,0,0);

			}


			// tween scale
			//if (toPosition == undefined) {
			
				that.array[i].scale *= 0.25;
				var scaleTween = new TWEEN.Tween(that.array[i])
					.to({scale: that.array[i].origscale}, 400)
					//.easing(TWEEN.Easing.Elastic.EaseOut);
					.easing(TWEEN.Easing.Linear.EaseNone);
					//.delay(200);
				scaleTween.start();

			//}


			// tween popup
			var multiplier = 180;
			if (toPosition != undefined) {
				multiplier = 350;
			}
			
			var scale = that.array[i].origscale;
			that.array[i].c.position.x -= (normal.x)*(scale*multiplier);
			that.array[i].c.position.y -= (normal.y)*(scale*multiplier);
			that.array[i].c.position.z -= (normal.z)*(scale*multiplier);

			that.array[i].lastToy = that.array[i].c.position.y;

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

	this.update = function (delta, camPos, emitterPos) {

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}

		++rayCount;

		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			var obj =  that.array[i];
			var active = obj.active;
			if (!active) {
				continue;
			}


			var animal = obj.c;
			var anim = obj.a;
			var scale = obj.scale;
			var cNormal = obj.normal;
			var f = obj.f;

			var wasDead = that.array[i].dead;

			that.array[i].time += delta;
			that.array[i].lifetime += delta;

			var alivetime = 2500;
			if (that.settings.flying) {
				alivetime = 5000;
			}
			if (that.array[i].generalSpecialCase) {
				alivetime = 7000;
			}

			if (that.array[i].lifetime > 2500 && that.settings.respawn) {
				that.array[i].dead = true;
			}

			// morph
			that.array[i].count += 0.06;
			var morph = Math.max(Math.cos(that.array[i].count)-0.5,0);
			morph = Math.min(morph, 1)
			that.array[i].a.morph = morph;

			var animalSpeed = obj.speeda;
			if (Math.round(morph) == 1) {
				animalSpeed = obj.speedb;
			}

			
			if (!that.array[i].keepRunning) {

				// change follow index
				//var changeTime = Math.max(animalSpeed*18, 80);
				var changeTime = Math.max(animalSpeed*40, 70);
				//var changeTime = Math.max(animalSpeed*30, 110);

				//var dx = animal.position.x - vectorArray[f].position.x, dy = animal.position.y - vectorArray[f].position.y, dz = animal.position.z - vectorArray[f].position.z;
				//var distance =  Math.abs(dx * dx + dy * dy + dz * dz);

				if (that.array[i].time > changeTime && that.settings.respawn) {
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

			} else {
				var tox = animal.position.x+(that.array[i].toPosition.x*20);
				var toy = animal.position.y+(that.array[i].toPosition.y*20);
				var toz = animal.position.z+(that.array[i].toPosition.z*20);	
			}

			if (!that.array[i].keepRunning) {
				if (cNormal.y > 0.5) {
					toy = vectorArray[f].position.y - 10;
				}
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
				
				if (!that.array[i].keepRunning) {
				
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

				} else {
					that.array[i].toPosition.y += 0.12;
					toy = that.array[i].toPosition.y+that.settings.flyingDistance;

				}
			}


			if (that.settings.constantSpeed != null) {
				that.array[i].a.animalA.timeScale = that.settings.constantSpeed;
				that.array[i].a.animalB.timeScale = that.settings.constantSpeed;
			}


			if (that.settings.shootRayDown ) {

				if (that.array[i].rayIndex == rayCount%2) {
	
					var ray = obj.ray;
					//animal.position.y += 500;
					ray.origin.copy( animal.position );
					ray.origin.y += 500;

					var c = scene.collisions.rayCastNearest(ray);

					if(c) {

						// need scale setting...
						toy = ray.origin.y - ( ( c.distance * 1 ) + 3 );
						//toy = ray.origin.y - ( ( c.distance * 0.15 ) + 3 );
						cNormal = c.mesh.matrixRotationWorld.multiplyVector3( c.normal ).normalize();
					
						that.array[i].lastToy = toy;
						that.array[i].normal.copy(cNormal);

					}
				} else {
					toy = that.array[i].lastToy;
				}

			}

			if (that.settings.gravity) {
				that.array[i].gravity += 0.3;
				toy = animal.position.y -= that.array[i].gravity;
				toz = animal.position.z;
				tox = animal.position.x;

				animal.rotation.x += 0.04;
				animal.rotation.y += 0.02;

			}

			var divider = 17;
			var ydivider = divider;
			if (that.array[i].keepRunning) {
				divider = 4;

				if (Math.abs(toy-animal.position.y) > 10) {
					ydivider = divider/2;
				} else {
					ydivider = divider*2;
				}
				
			}

			if (that.settings.flying) {
				ydivider = 8;
			}

			if (that.array[i].sockPuppetSpecialCase) {
				divider = 100;
			}

			if (that.array[i].dead) {
				if (!that.settings.flying) {
					toy -= cNormal.y*3;
					tox -= cNormal.x*3;
					toz -= cNormal.z*3;
				} else {
					toy += 10;
				}
				ydivider = 20;
			}

			// this just looks weird...
			/*if (that.array[i].isFish) {
				r += 0.06;
				var fishjump = Math.sin(r)*50;
	
				toy -= cNormal.y*fishjump;
				tox -= cNormal.x*fishjump;
				toz -= cNormal.z*fishjump;
			}*/

			var moveX = (tox-animal.position.x)/divider;
			var moveY = (toy-animal.position.y)/ydivider;
			var moveZ = (toz-animal.position.z)/divider;

			// distance to big - kill em
			if (that.settings.killAtDistance) {
				var dx = animal.position.x - emitterPos.x, dy = animal.position.y - emitterPos.y, dz = animal.position.z - emitterPos.z;
				var distance =  Math.abs(dx * dx + dy * dy + dz * dz);
				/*if (i==0) {
					console.log(distance);
				}*/
				if (distance > 25000) {
					that.array[i].dead = true;
				}
			}

			// in city only
			if (that.settings.avoidCamera) {
				if (animal.position.x+moveX < camPos.x+40 && animal.position.x+moveX > camPos.x-40 && animal.position.z+moveZ < camPos.z+40 && animal.position.z+moveZ > camPos.z-40) {
					that.array[i].dead = true;
				}
			}

			if (that.array[i].dead && !wasDead) {
				// tween scale
				var scaleTween = new TWEEN.Tween(that.array[i])
					.to({scale: that.array[i].scale*0.01}, 600)
					.easing(TWEEN.Easing.Quartic.EaseIn);
				scaleTween.start()

				// horse to deer
				/*if (that.array[i].startMorph == 1 && that.array[i].a.morph == 0) {
					var morphTween = new TWEEN.Tween(that.array[i].a)
						.to({morph: 1}, 500)
						.easing(TWEEN.Easing.Quartic.EaseIn);
					morphTween.start()
				
				}*/

			}


			var scalecheck = 0.1;
			if (that.array[i].keepRunning) {
				scalecheck = 0.005;
			}

			if (that.array[i].dead && scale <= scalecheck) {
				that.array[i].active = false;
				that.array[i].c.visible = false;
				continue;
			}

			if (!that.array[i].keepRunning) {
				var falloffDivider = 2+(f/10);
				var maxSpeed = animalSpeed/falloffDivider;
			} else {
				var maxSpeed = animalSpeed/20;
				//var maxSpeed = animalSpeed/3;				
			}

			if (isNaN(maxSpeed)) {
				maxSpeed = 1;
			}

			if (!that.array[i].keepRunning) {
				if ( moveY > maxSpeed )	moveY = maxSpeed;
				if ( moveY < -maxSpeed ) moveY = -maxSpeed;
			}

			if ( moveX > maxSpeed )	moveX = maxSpeed;
			if ( moveX < -maxSpeed ) moveX = -maxSpeed;

			if ( moveZ > maxSpeed )	moveZ = maxSpeed;
			if ( moveZ < -maxSpeed )moveZ = -maxSpeed;



			if (!that.settings.gravity) {
			
			// test
			/*var dx = animal.position.x - (animal.position.x+moveX);
			var dz = animal.position.z - (animal.position.z+moveZ);

			var angleRadY = Math.atan2(dz, dx);
			var angleDegY = angleRadY * 180 / Math.PI;
			if (i==0) {
				if (that.array[i].lastAngleY != undefined) {
					//console.log(angleDegY);
					var difY = that.array[i].lastAngleY - angleDegY;
					if (Math.abs(difY) > 45) {
						console.log(difY);
						//moveX = 10;
						//moveZ = 0;
					}
					
				}
			}

			that.array[i].lastAngleY = angleDegY;
			*/
			var zvec = new THREE.Vector3(animal.position.x+moveX,animal.position.y+moveY,animal.position.z+moveZ);
			zvec.subSelf( animal.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(cNormal.x*-1, cNormal.y*-1, cNormal.z*-1);
			if (that.settings.flying || that.settings.gravity) {
				yvec = new THREE.Vector3(0, -1, 0);
			}

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			animal.matrixWorld.n11 = xvec.x*scale; animal.matrixWorld.n12 = yvec.x*scale; animal.matrixWorld.n13 = zvec.x*scale; animal.matrixWorld.n14 = animal.position.x;
			animal.matrixWorld.n21 = xvec.y*scale; animal.matrixWorld.n22 = yvec.y*scale; animal.matrixWorld.n23 = zvec.y*scale; animal.matrixWorld.n24 = animal.position.y;
			animal.matrixWorld.n31 = xvec.z*scale; animal.matrixWorld.n32 = yvec.z*scale; animal.matrixWorld.n33 = zvec.z*scale; animal.matrixWorld.n34 = animal.position.z;

			}

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
			

			/*if (animal.position.x < camPos.x+30 && animal.position.x > camPos.x-30 && animal.position.z < camPos.z+60 && animal.position.z > camPos.z-60) {
				that.array[i].dead = true;
				//that.array[i].active = false;
				//that.array[i].c.visible = false;
			}*/

			// hack..
			/*if (animal.position.z > camPos.z+170) {
				that.array[i].active = false;
				that.array[i].c.visible = false;
			}*/

		}

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