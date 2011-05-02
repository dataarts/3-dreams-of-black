var AnimalInFrontOfCamera = function ( numOfAnimals, scene ) {

	var that = this;

	var animalArray = [];
	var scene = scene;

	that.initSettings = {
		numOfAnimals : numOfAnimals || 30
	}

	that.settings = {

	}

	var r = 0;
	var i;

	var container = new THREE.Cube( 10, 10, 10 );
	var animalContainer = new THREE.Mesh( container );
	scene.addChild( animalContainer );

	this.addAnimal = function ( geometry ) {

		for ( var i = 0; i < that.initSettings.numOfAnimals; ++i ) {

			var animal = ROME.Animal( geometry, false );
			var mesh = animal.mesh;

			var scale = 0.02+(Math.random()/8);

			var x = (Math.random()*120)-60;
			var y = (i*(150/15))-10;
			var z = (Math.random()*120)-60;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			animalContainer.addChild( mesh );

			animal.animalA.timeScale = 0.8;
			animal.animalB.timeScale = 0.8;

			animal.play( animal.availableAnimals[ 0 ], animal.availableAnimals[ 0 ], 0, Math.random() );

			var obj = { c: mesh, x: x, y: y, z: z, a: animal, scale:scale * 1.5 };

			animalArray.push(obj);

		}

	}

	this.update = function (position, theta, delta, skipPosition) {

		r += 0.1;

			animalContainer.position = position;

		if (!skipPosition) {
			animalContainer.position.x -= Math.cos( theta )*110;
			animalContainer.position.z -= Math.sin( theta )*110;
		}
		if (isNaN(delta) || delta > 1000 ) {
			delta = 1000/60;
		}

		for (i=0; i<that.initSettings.numOfAnimals; ++i ) {
			var obj =  animalArray[i];
			var animal = obj.c;
			var x = obj.x;
			var y = obj.y;
			var z = obj.z;
			var scale = obj.scale;
		
			var offsetx = Math.cos(i-r);
			var offsetz = Math.sin(i-r);

			x += offsetx;
			y += 0.5*(delta/20);
			z += offsetz;

			if (y > 140 ) {
				y = -10;
			}

			animal.lookAt( new THREE.Vector3(x,y,z) );

			//animal.rotation.y -= 3.14;

			animal.position.x = x;
			animal.position.y = y;
			animal.position.z = z;

			animalArray[i].x = x;
			animalArray[i].y = y;
			animalArray[i].z = z;

		}

	}


}
