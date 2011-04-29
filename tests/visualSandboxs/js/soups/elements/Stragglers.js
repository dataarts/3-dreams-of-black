var Stragglers = function ( numOfAnimals, scene, vectorArray ) {
	
	var that = this;

	that.array = [];
	var scene = scene;

	that.initSettings = {
		numOfAnimals : numOfAnimals || 3,
	}

	that.settings = {
		divider : 2,
		constantSpeed : null,
		addaptiveSpeed : false,
		capy : null,
	}
	
	var i;

	this.addAnimal = function( geometry, predefined, scale, morphArray ) {
		
		var predefined = predefined || null;
		var scaleMultiplier = scale || 1.2;
		var morphArray = morphArray || null;

		for ( i = 0; i < that.initSettings.numOfAnimals; ++i ) {
			
			if ((predefined == null && that.array[i] != undefined) || (predefined != that.array[i]) ) {
				continue;
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
				endMorph = Math.floor(Math.random()*animal.availableAnimals.length);
			}

			animal.play( animal.availableAnimals[ startMorph ], animal.availableAnimals[ endMorph ], 0, Math.random(), Math.random() );

			var count = Math.random();
			if (i<2) {
				count = 0;
			}
	
			var obj = { c: mesh, a: animal, active: false, startMorph: startMorph, normal: new THREE.Vector3(0,-1,0), position: new THREE.Vector3(0,0,0), toVector: new THREE.Vector3(0,0,0) , count: count, scale: scale * scaleMultiplier };

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
			that.array[i].a.morph = that.array[i].startMorph;
			//console.log("create straggler - "+that.array[i].toVector.x+" | "+that.array[i].toVector.y+" | "+that.array[i].toVector.y);
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


			var tox = position.x+(toVector.x*10);
			var toy = position.y+(toVector.y*10);
			var toz = position.z+(toVector.z*10);

			if (that.settings.capy != null && toy < that.settings.capy) {
				toy = that.settings.capy;
				normal.set(0,1,0);
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
			var divider = 5;

			var moveX = (tox-animal.position.x)/divider;//that.settings.divider;
			var moveY = (toy-animal.position.y)/divider;//that.settings.divider;
			var moveZ = (toz-animal.position.z)/divider;//that.settings.divider;

			var maxSpeed = 12;

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

			// hack..
			if (animal.position.z > camPos.z+20) {
				that.array[i].active = false;
				that.array[i].c.visible = false;
			}

		}

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