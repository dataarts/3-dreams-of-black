var Particles = function ( numOfParticleSystems, scene, particleSize, spriteArray, numInSystem, spread ) {
	
	var that = this;

	var particleArray = [];
	var numOfParticleSystems = numOfParticleSystems || 25;
	var scene = scene;
	var numInSystem = numInSystem || 60;
	var spread = spread || 50;
	that.zeroAlphaStart = true;
	that.aliveDivider = 3;

	var i;

	
	var geometry = new THREE.Geometry();

	for (i = 0; i < numInSystem; i++) {
		var vector = new THREE.Vector3( Math.random() * spread - (spread/2), Math.random() * spread - (spread/2), Math.random() * spread - (spread/2) );
		geometry.vertices.push( new THREE.Vertex( vector ) );
	}

	for (var i = 0; i < numOfParticleSystems; i++) {

		//var particleMaterial = new THREE.ParticleBasicMaterial( { size: particleSize, map: spriteArray[i%spriteArray.length], transparent: true, depthTest: false, blending: THREE.AdditiveBlending } );
		var particleMaterial = new THREE.ParticleBasicMaterial( { size: particleSize, map: spriteArray[i%spriteArray.length], transparent: true, depthTest: false } );

		var particles = new THREE.ParticleSystem( geometry, particleMaterial );

		particles.rotation.x = Math.random() * Math.PI;
		particles.rotation.y = Math.random() * Math.PI;
		particles.rotation.z = Math.random() * Math.PI;

		var obj = {c:particles, alivetime:i};
		particleArray.push(obj);

		scene.addObject( particles );

	}

	this.update = function (delta, position) {

		if (isNaN(delta) || delta > 1000 ) {
			delta = 1000/60;
		}		

		var multiplier = delta/60;

		for (i=0; i<numOfParticleSystems; ++i ) {
			
			var particles = particleArray[i].c;

			particleArray[i].alivetime += (multiplier/that.aliveDivider);

			if (particleArray[i].alivetime >= numOfParticleSystems) {
				particleArray[i].alivetime = 0;
				particles.scale.x = particles.scale.y = particles.scale.z = 0.1;
				particles.position.x = position.x;
				particles.position.y = position.y;
				particles.position.z = position.z;

				if (that.zeroAlphaStart) {
					particles.materials[0].opacity = 0;
				} else {
					particles.materials[0].opacity = 1;
				}
				continue;
			}

			var alivetime = particleArray[i].alivetime;

			particles.position.y += 0.20;

			particles.rotation.y += 0.025;
			particles.rotation.z += 0.010;

			var scale = Math.max(alivetime/15, 1);
			//scale = Math.max(scale,0.05);
			particles.scale.x = particles.scale.y = particles.scale.z = 0.5+scale;

			if (that.zeroAlphaStart) {
				var alpha = (alivetime/4);
			} else {
				var alpha = 1-(alivetime/(particleArray.length*2));
			}
			alpha = Math.min(alpha,1.0);
			particles.materials[0].opacity = alpha;


		}

	}

	this.reset = function ( x,y,z ) {

		for (var i=0; i<particleArray.length; ++i ) {
			var obj = particleArray[i].c;
			obj.position.x = x;
			obj.position.y = y;
			obj.position.z = z;
		}

	}

}