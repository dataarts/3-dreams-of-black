var AnimalSwarm = function ( numOfAnimals, scene, vectorArray ) {
	
	var that = this;

	that.array = [];
	var vectorArray = vectorArray;
	var numOfAnimals = numOfAnimals || 30;
	var divider = divider || 2;
	var scene = scene;
	that.flying = false;
	that.xPositionMultiplier = 30;
	that.zPositionMultiplier = 30;
	that.constantSpeed = null;
	var r = 0;

	var i;

	this.addAnimal = function( geometry, predefined, scale, morphArray, followDivider ) {
		
		var predefined = predefined || null;
		var scaleMultiplier = scale || 1.2;
		var morphArray = morphArray || null;
		var followDivider = followDivider || 4;

		for ( i = 0; i < numOfAnimals; ++i ) {
			
			if ((predefined == null && that.array[i] != undefined) || (predefined != that.array[i]) ) {
				continue;
			}

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;

			var followIndex = Math.floor(i/followDivider);

			var scale = 0.02+(Math.random()/8);
			if (i<2) {
				scale = 0.15;
				followIndex = i;
			}
			scale = Math.max(scale, 0.1);

			mesh.matrixAutoUpdate = false;

			scene.addChild( mesh );
			var startMorph = 0;
			var endMorph = 0;
			if (morphArray != null) {
				startMorph = morphArray[i%morphArray.length];
				endMorph = Math.floor(Math.random()*animal.availableAnimals.length);
			}

			animal.play( animal.availableAnimals[ startMorph ], animal.availableAnimals[ endMorph ], 0, Math.random() );

			var count = Math.random();
			if (i<2) {
				count = 0;
			}

			var obj = { c: mesh, a: animal, f: followIndex, count: count, scale: scale * scaleMultiplier };

			that.array[i] = obj;

		}

	}

	this.update = function () {

		r += 0.1

		var dx = vectorArray[0].lastposition.x - vectorArray[0].position.x, dy = vectorArray[0].lastposition.y - vectorArray[0].position.y, dz = vectorArray[0].lastposition.z - vectorArray[0].position.z;
		var distance =  dx * dx + dy * dy + dz * dz;
		
		var speed = Math.max(distance/100, 1.0);
		speed = Math.min(speed, 1.5);

		for (i=0; i<numOfAnimals; ++i ) {
			var obj =  that.array[i];
			var animal = obj.c;
			var f = obj.f;
			var anim = obj.a;
			var scale = obj.scale;

			//var pulse = Math.cos((i-r*10)/35)*(35-(i*1.5));

			var inc = (Math.PI*2)/6;
			var thisinc = i*inc;
			var offsetx = Math.cos(thisinc+((i-r*2)/8))*that.xPositionMultiplier;
			var offsetz = Math.sin(thisinc+((i-r*2)/8))*that.zPositionMultiplier;
			var offsety = offsetz;

			var cNormal = vectorArray[f].normal;

			var amountx = 1-Math.abs(cNormal.x);
			var amountz = 1-Math.abs(cNormal.z);
			var amounty = 1-Math.abs(cNormal.y);

			var tox = vectorArray[f].position.x+(offsetx*amountx);
			var toy = vectorArray[f].position.y+(offsety*amounty);
			var toz = vectorArray[f].position.z+(offsetz*amountz);

			if (cNormal.y > 0.5) {
				toy = vectorArray[f].position.y - 6*1.75;
			}

			if (toy < 0) {
				toy = 0;
			}

			// flying
			if (that.flying) {
				var pulse = Math.cos((i-r*10)/15)*10
				var flyAmount = 35+Math.abs(Math.sin((thisinc+pulse)/30)*40);			

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

			if (that.constantSpeed != null) {
				that.array[i].a.animalA.timeScale = that.constantSpeed;
				that.array[i].a.animalB.timeScale = that.constantSpeed;
			}

			var moveX = (tox-animal.position.x)/divider;
			var moveY = (toy-animal.position.y)/divider;
			var moveZ = (toz-animal.position.z)/divider;

			var zvec = new THREE.Vector3(tox,toy,toz);
			zvec.subSelf( animal.position ).normalize();

			var xvec = new THREE.Vector3();
			var yvec = new THREE.Vector3(vectorArray[f].normal.x*-1, vectorArray[f].normal.y*-1, vectorArray[f].normal.z*-1);
			//var yvec = new THREE.Vector3(0, -1, 0);

			xvec.cross(zvec, yvec);
			yvec.cross(zvec, xvec);

			animal.matrixWorld.n11 = xvec.x*scale; animal.matrixWorld.n12 = yvec.x*scale; animal.matrixWorld.n13 = zvec.x*scale; animal.matrixWorld.n14 = animal.position.x;
			animal.matrixWorld.n21 = xvec.y*scale; animal.matrixWorld.n22 = yvec.y*scale; animal.matrixWorld.n23 = zvec.y*scale; animal.matrixWorld.n24 = animal.position.y;
			animal.matrixWorld.n31 = xvec.z*scale; animal.matrixWorld.n32 = yvec.z*scale; animal.matrixWorld.n33 = zvec.z*scale; animal.matrixWorld.n34 = animal.position.z;

			animal.position.x += moveX;
			animal.position.y += moveY;
			animal.position.z += moveZ;
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