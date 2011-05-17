var Stragglers = function ( numOfAnimals, scene, vectorArray ) {
	
	var that = this;

	that.array = [];
	var scene = scene;

	that.initSettings = {
		numOfAnimals : numOfAnimals || 3
	}

	that.settings = {
		divider : 2,
		constantSpeed : null,
		addaptiveSpeed : false,
		capy : null
	}
	
	var i;

	this.addAnimal = function( geometry, predefined, scale, morphArray, speedArray ) {
		
		var predefined = predefined || null;
		var scaleMultiplier = scale || 1.2;
		var morphArray = morphArray || null;

		for ( i = 0; i < that.initSettings.numOfAnimals; ++i ) {
			
			if ((predefined == null && that.array[i] != undefined) || (predefined != that.array[i]) ) {
				continue;
			}

			if (speedArray == null) {
				speedArray = [1];
			}

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;

			var scale = 0.02+(Math.random()/8);
			scale = Math.max(scale, 0.1);

			mesh.matrixAutoUpdate = false;
			mesh.visible = false;
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
	
			var obj = { c: mesh, a: animal, active: false, startMorph: startMorph, lifetime: 0, speeda: speeda, speedb: speedb, normal: new THREE.Vector3(0,-1,0), position: new THREE.Vector3(0,0,0), toVector: new THREE.Vector3(0,0,0) , count: count, scale: scale * scaleMultiplier, origscale: scale * scaleMultiplier };

			that.array[i] = obj;

		}

	}

	this.create = function (position, normal, toPosition) {
		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			if (that.array[i].active) {
				continue;
			}
			that.array[i].active = true;
			that.array[i].position.copy(position);
			that.array[i].normal.copy(normal);
			that.array[i].c.position.copy(position);
			that.array[i].c.visible = true;
			that.array[i].toVector = toPosition.subSelf(position).normalize();
			that.array[i].lifetime = 0;

			that.array[i].toVector.x *= 1-Math.abs(normal.x);
			that.array[i].toVector.y *= 1-Math.abs(normal.y);
			that.array[i].toVector.z *= 1-Math.abs(normal.z);
			
			that.array[i].toVector.z = Math.random();
			that.array[i].toVector.x = Math.random()-0.5;
			
			// tween scale
			that.array[i].scale = 0.01;
			var scaleTween = new TWEEN.Tween(that.array[i])
				.to({scale: that.array[i].origscale}, 2500)
				.easing(TWEEN.Easing.Elastic.EaseOut);
			scaleTween.start();
			
			// tween popup
			var scale = that.array[i].scale;
			that.array[i].c.position.x -= (normal.x)*(scale*150);
			that.array[i].c.position.y -= (normal.y)*(scale*150);
			that.array[i].c.position.z -= (normal.z)*(scale*150);

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
			var position = obj.position;
			var toVector = obj.toVector;

			that.array[i].lifetime += delta;

			if (that.array[i].lifetime > 4000) {
				that.array[i].active = false;
				that.array[i].c.visible = false;
				continue;
			}

			var tox = position.x+(toVector.x*10);
			var toy = position.y+(toVector.y*10);
			var toz = position.z+(toVector.z*10);
			
			if (normal.y > 0.5) {
				toy -= 10;
			}

			if (that.settings.capy != null && toy < that.settings.capy) {
				toy = that.settings.capy;
				normal.set(0,1,0);
			}

			// morph
			that.array[i].count += 0.03;
			var morph = Math.max(Math.cos(that.array[i].count),0);
			morph = Math.min(morph, 1)
			that.array[i].a.morph = morph;

			if (that.settings.constantSpeed != null) {
				that.array[i].a.animalA.timeScale = that.settings.constantSpeed;
				that.array[i].a.animalB.timeScale = that.settings.constantSpeed;
			}

			var animalSpeed = obj.speeda;
			
			if (Math.round(morph) == 1) {
				animalSpeed = obj.speedb;
			}

			var divider = 5;

			var moveX = (tox-animal.position.x)/divider;
			var moveY = (toy-animal.position.y)/divider;
			var moveZ = (toz-animal.position.z)/divider;

			var maxSpeed = animalSpeed//12;

			if ( moveY > maxSpeed )	moveY = maxSpeed;
			if ( moveY < -maxSpeed ) moveY = -maxSpeed;

			if ( moveX > maxSpeed )	moveX = maxSpeed;
			if ( moveX < -maxSpeed ) moveX = -maxSpeed;

			if ( moveZ > maxSpeed )	moveZ = maxSpeed;
			if ( moveZ < -maxSpeed )moveZ = -maxSpeed;

			var zvec = new THREE.Vector3(tox,toy,toz);
			zvec.subSelf( animal.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(normal.x*-1, normal.y*-1, normal.z*-1);

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			animal.matrixWorld.n11 = xvec.x*scale; animal.matrixWorld.n12 = yvec.x*scale; animal.matrixWorld.n13 = zvec.x*scale; animal.matrixWorld.n14 = animal.position.x;
			animal.matrixWorld.n21 = xvec.y*scale; animal.matrixWorld.n22 = yvec.y*scale; animal.matrixWorld.n23 = zvec.y*scale; animal.matrixWorld.n24 = animal.position.y;
			animal.matrixWorld.n31 = xvec.z*scale; animal.matrixWorld.n32 = yvec.z*scale; animal.matrixWorld.n33 = zvec.z*scale; animal.matrixWorld.n34 = animal.position.z;

			animal.position.x += moveX;
			animal.position.y += moveY;
			animal.position.z += moveZ;

			that.array[i].position.copy(animal.position);

		}

	}

	this.reset = function ( x,y,z ) {

		for (var i=0; i<that.array.length; ++i ) {
			var obj = that.array[i].c;
			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;

			that.array[i].active = false;
			that.array[i].c.visible = false;
		}

	}

}
