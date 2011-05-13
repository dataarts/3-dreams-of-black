var Particles = function ( numOfParticleSystems, scene, particleSize, spriteArray, numInSystem, spread, blendMode ) {
	
	var that = this;

	var particleArray = [];
	var scene = scene;
	var blendMode = blendMode || THREE.NormalBlending;

	that.initSettings = {
		numOfParticleSystems : numOfParticleSystems || 25,
		numInSystem : numInSystem || 60,
		spread : spread || 50,
		particleSize : particleSize || 8
	}

	that.settings = {
		aliveDivider : 3,
		zeroAlphaStart : true,
		visible : true,
		gravitateTowardsCamera : false
	}

	var i;

	
	var geometry = new THREE.Geometry();

	for (i = 0; i < that.initSettings.numInSystem; i++) {
		var vector = new THREE.Vector3( Math.random() * that.initSettings.spread - (that.initSettings.spread/2), Math.random() * that.initSettings.spread - (that.initSettings.spread/2), Math.random() * that.initSettings.spread - (that.initSettings.spread/2) );
		geometry.vertices.push( new THREE.Vertex( vector ) );
	}

	for (var i = 0; i < that.initSettings.numOfParticleSystems; i++) {

		var particleMaterial = new THREE.ParticleBasicMaterial( { size: that.initSettings.particleSize, map: spriteArray[i%spriteArray.length], transparent: true, depthTest: true, blending: blendMode } );
		//var particleMaterial = new THREE.ParticleBasicMaterial( { size: that.initSettings.particleSize, map: spriteArray[i%spriteArray.length], transparent: true, depthTest: true, blending: THREE.NormalBlending } );

		var particles = new THREE.ParticleSystem( geometry, particleMaterial );

		particles.rotation.x = Math.random() * Math.PI;
		particles.rotation.y = Math.random() * Math.PI;
		particles.rotation.z = Math.random() * Math.PI;

		var obj = {c:particles, alivetime:i};
		particleArray.push(obj);

		scene.addObject( particles );

	}

	this.update = function (delta, position, camPos) {

		if (isNaN(delta) || delta > 1000 ) {
			delta = 1000/60;
		}		

		var multiplier = delta/60;

		for (i=0; i<numOfParticleSystems; ++i ) {
			
			var particles = particleArray[i].c;

			particleArray[i].alivetime += (multiplier/that.settings.aliveDivider);

			if (particleArray[i].alivetime >= numOfParticleSystems) {
				particleArray[i].alivetime = 0;
				particles.scale.x = particles.scale.y = particles.scale.z = 0.5;

				particles.position.x = position.x;
				particles.position.y = position.y;
				particles.position.z = position.z;

				if (that.settings.gravitateTowardsCamera) {
					
					var extrax = -100;
					if (position.x > camPos.x) {
						extrax = 100;
					}

					particleArray[i].c.tox = position.x-extrax;
					particleArray[i].c.toy = 0;
					particleArray[i].c.toz = position.z-100;//camPos.z-400; // hack for in front of camera

					var dx = particles.position.x - particleArray[i].c.tox, dy = particles.position.y - particleArray[i].c.toy, dz = particles.position.z - particleArray[i].c.toz;
					var distance =  Math.abs(dx * dx + dy * dy + dz * dz);

					var time = 1000+(distance/25);
					
					particles.position.y = position.y+50;

					particles.rotation.x = Math.random() * Math.PI + (Math.PI/2);
					particles.rotation.y = Math.random() * Math.PI;
					particles.rotation.z = Math.random() * Math.PI + (Math.PI/2);

					particles.scale.x = particles.scale.y = particles.scale.z = 1.25;

					var fallTween = new TWEEN.Tween(particles.position)
								.to({x: particleArray[i].c.tox, y: particleArray[i].c.toy, z: particleArray[i].c.toz}, time)
								.easing(TWEEN.Easing.Linear.EaseNone);
					fallTween.start();

					var rotationTween = new TWEEN.Tween(particles.rotation)
								.to({x: 0, z: 0}, time)
								.easing(TWEEN.Easing.Quadratic.EaseIn);
					rotationTween.start();
	
					var scaleTween = new TWEEN.Tween(particles.scale)
								.to({x: 5, y: 0.05, z: 5}, time)
								.easing(TWEEN.Easing.Linear.EaseNone);
					scaleTween.start();
	
					/*var flattenTween = new TWEEN.Tween(particles.scale)
								.to({y: 0.05}, time+500)
								.easing(TWEEN.Easing.Linear.EaseNone)
					flattenTween.start();*/
	

				}

				if (that.settings.zeroAlphaStart) {
					particles.materials[0].opacity = 0;
				} else {
					particles.materials[0].opacity = 1;
				}
				continue;
			}

			var alivetime = particleArray[i].alivetime;

			if (!that.settings.gravitateTowardsCamera) {
			
				particles.position.y += 0.10;
				
				particles.rotation.y += 0.015;
				particles.rotation.z += 0.010;

				var scale = Math.max(alivetime/15, 1);
				particles.scale.x = particles.scale.y = particles.scale.z = 0.5+scale;	

			}



			if (that.settings.zeroAlphaStart) {
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
