var AnimalSwarm_dunes = function ( numOfAnimals, scene, vectorArray ) {
	
	var that = this;

	that.array = [];

	var scene = scene;
	var maxFollowIndex = 0;
	var followCount = 0;
	var lastFollowCount = 0;

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

	};
	
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
			mesh.position.set(that.settings.startPosition.x, that.settings.startPosition.y, that.settings.startPosition.z);
			mesh.updateMatrix();
			mesh.doubleSided = doubleSided;

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
		
		return animal;

	};

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

			that.array[i].scale = 0.001;
			var toscale = that.array[i].origscale;
			// tween scale
			var scaleTween = new TWEEN.Tween(that.array[i])
				.to({scale: toscale}, 500)
				.easing(TWEEN.Easing.Linear.EaseNone);
			scaleTween.start();	

			break;

		}
		
	}

	this.update = function (delta) {

		r += 0.1

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}


		followCount = Math.round(r/4);

		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			var obj =  that.array[i];
			var animal = obj.c;
			var f = obj.f;
			var anim = obj.a;
			var scale = obj.scale;
			var clockwise = obj.clockwise;

			
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
			var offsetx = Math.cos(thisinc+((i-r*2)/5))*that.settings.xPositionMultiplier;
			var offsetz = Math.sin(thisinc+((i-r*2)/5))*that.settings.zPositionMultiplier;
			var offsety = offsetz;
			


			var cNormal = vectorArray[f].normal;

			var amountx = 1-Math.abs(cNormal.x);
			var amountz = 1-Math.abs(cNormal.z);
			var amounty = 1-Math.abs(cNormal.y);

			var tox = vectorArray[f].position.x+(offsetx);
			var toy = vectorArray[f].position.y+(offsety);
			var toz = vectorArray[f].position.z+(offsetz);


			// morph
			that.array[i].count += 0.03;
			var morph = Math.max(Math.cos(that.array[i].count),0);
			morph = Math.min(morph, 1)
			that.array[i].a.morph = morph;

			if (that.settings.constantSpeed != null) {
				that.array[i].a.animalA.timeScale = that.settings.constantSpeed;
				that.array[i].a.animalB.timeScale = that.settings.constantSpeed;
			}

			var divider = 10;

			var moveX = (tox-animal.position.x)/divider;//that.settings.divider;
			var moveY = (toy-animal.position.y)/divider;//that.settings.divider;
			var moveZ = (toz-animal.position.z)/divider;//that.settings.divider;

			var zvec = new THREE.Vector3(animal.position.x+moveX,animal.position.y+moveY,animal.position.z+moveZ);
			zvec.subSelf( animal.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(vectorArray[f].normal.x*-1, vectorArray[f].normal.y*-1, vectorArray[f].normal.z*-1);
			if (that.settings.flying) {
				yvec = new THREE.Vector3(0, -1, 0);
			}

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			animal.matrixWorld.n11 = xvec.x*scale; animal.matrixWorld.n12 = yvec.x*scale; animal.matrixWorld.n13 = zvec.x*scale; animal.matrixWorld.n14 = animal.position.x;
			animal.matrixWorld.n21 = xvec.y*scale; animal.matrixWorld.n22 = yvec.y*scale; animal.matrixWorld.n23 = zvec.y*scale; animal.matrixWorld.n24 = animal.position.y;
			animal.matrixWorld.n31 = xvec.z*scale; animal.matrixWorld.n32 = yvec.z*scale; animal.matrixWorld.n33 = zvec.z*scale; animal.matrixWorld.n34 = animal.position.z;

			animal.position.x += moveX;
			animal.position.y += moveY;
			animal.position.z += moveZ;


			animal.visible = that.settings.visible;
		}

		lastFollowCount = followCount;

	};

	this.reset = function ( x,y,z ) {

		for (var i=0; i<that.array.length; ++i ) {

			var obj = that.array[i].c;
			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;

		}

	};

};
