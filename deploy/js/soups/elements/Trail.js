var Trail = function ( numOfInstances, scene ) {
	
	var that = this;

	that.array = [];
	var scene = scene;
	var spawnedLighthouse = false;
	var time = 0;
	var ray = new THREE.Ray();
	ray.direction = new THREE.Vector3(0, -1, 0);

	that.initSettings = {

		numOfInstances : numOfInstances || 100

	};

	that.settings = {

		spread : 70,
		visible : true,
		aliveDivider: that.initSettings.numOfInstances,
		tweenTime: 2500,
		scale: 1,
		offsetAmount: 6,
		freeRotation: true,
		yscale: 0.3,
		shootRayDown : false

	};

	var i;

	this.addInstance = function( geometry, predefined, tree, lightHouse, materialArray ) {
		
		var predefined = predefined || null;
		var tree = tree || false;
		var lightHouse = lightHouse || false;

		for ( i = 0; i < that.initSettings.numOfInstances; ++i ) {
			
			if ((predefined == null && that.array[i] != undefined) || (predefined != that.array[i]) ) {
				continue;
			}

			if ( materialArray == undefined ) {

				var c = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );

			} else {

				var c = new THREE.Mesh( geometry, materialArray[i%materialArray.length] );	

			}

			c.scale.x = c.scale.y = c.scale.z = 0.00000001;
			
			var obj = { c:c, alivetime:i, normal:new THREE.Vector3(), tree:tree, lightHouse:lightHouse };
			
			scene.addObject(c);
			that.array[i] = obj;

		}
		
		return c;

	};

	this.switchGeometry = function( geometryArray ) {
		for ( i = 0; i < that.initSettings.numOfInstances; ++i ) {
			
			var geometry = geometryArray[i%geometryArray.length];

			var c = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
			
			var pos = new THREE.Vector3();
			pos.copy(that.array[i].c.position);

			scene.removeChild( that.array[i].c );
			scene.addChild( c );
			c.position = pos;

			that.array[i].c = c;

			c.scale.x = c.scale.y = c.scale.z = 0.00000001;

			var yscale = that.settings.yscale*that.settings.scale;
			var xscale = zscale = 0.4*that.settings.scale;
			// tween scale
			var scaleTween = new TWEEN.Tween(that.array[i].c.scale)
				.to({x: xscale, y: yscale, z: zscale}, 200)
				.easing(TWEEN.Easing.Linear.EaseNone);
			scaleTween.start();

		}
	}

	this.update = function ( position, normal, camPos, delta ) {

		if (isNaN(delta) || delta > 1000 ) {
			delta = 1000/60;
		}

		time += delta;

		var multiplier = delta/that.settings.aliveDivider;
		
		// grass

		for ( i=0; i<that.array.length; ++i ) {

			var obj = that.array[i];
			var c = obj.c;

			var alivetime = obj.alivetime;
			var tree = obj.tree;
			var lightHouse = obj.lightHouse;
			var maxHeight = obj.maxHeight;

			alivetime += multiplier;
			
			// respawn
			if (alivetime > that.initSettings.numOfInstances) {


				if (lightHouse && (spawnedLighthouse || time < 4000)) {
					//c.visible = false;
					continue;
				}

				c.position.x = position.x;
				c.position.y = position.y;
				c.position.z = position.z;

				c.rotation.x = 0;
				c.rotation.z = 0;
				c.rotation.y = 0;

				var amount = that.settings.offsetAmount;

				if (tree) {
					amount = that.settings.offsetAmount+2;
				}

				var torotx = 0;
				var toroty = 0;
				var torotz = 0;

				if (that.settings.freeRotation) {

					if (that.settings.shootRayDown) {
						
						ray.origin.copy( position );
						ray.origin.y += 10;

						var collision = scene.collisions.rayCastNearest(ray);

						if(collision) {
							// need scale setting...
							c.position.y = ray.origin.y - ( ( collision.distance * 0.20 ) - amount );

							//normal = collision.mesh.matrixRotationWorld.multiplyVector3( collision.normal ).normalize();
							normal.set(0,1,0);
						}

					}

					c.position.x = position.x-(normal.x*amount);
					//c.position.y = position.y-(normal.y*amount);
					if (!that.settings.shootRayDown) {
						c.position.y = position.y-(normal.y*amount);
					}
					c.position.z = position.z-(normal.z*amount);

					c.position.x += ((Math.random()*that.settings.spread)-(that.settings.spread/2))*(1-Math.abs(normal.x));
					c.position.z += ((Math.random()*that.settings.spread)-(that.settings.spread/2))*(1-Math.abs(normal.z));

					c.rotation.x = 0;
					c.rotation.z = 0;
					c.rotation.y = Math.random()*Math.PI;

					c.up.copy(normal);
					c.lookAt(c.position);

				} else {
	
					if (normal.x < -0.5) {
						c.position.x = position.x + amount/2;
						c.rotation.z = 1.57;
						c.rotation.x = Math.random()*Math.PI;
						if (tree) {
							torotz = c.rotation.z+(Math.random()-0.5);
							c.rotation.z = 0;
							torotx = c.rotation.x;
							toroty = c.rotation.y;
						}
						c.position.y += (Math.random()*that.settings.spread)-(that.settings.spread/2);
						c.position.z += (Math.random()*that.settings.spread)-(that.settings.spread/2);
					}
					if (normal.x > 0.5) {
						c.position.x = position.x - amount/2;
						c.rotation.z = -1.57;
						if (tree) {
							torotz = c.rotation.z +(Math.random()-0.5);
							c.rotation.z = 0;
							torotx = c.rotation.x;
							toroty = c.rotation.y;
						}
						c.rotation.x = Math.random()*Math.PI;

						c.position.y += (Math.random()*that.settings.spread)-(that.settings.spread/2);
						c.position.z += (Math.random()*that.settings.spread)-(that.settings.spread/2);
					}
					if (normal.y < -0.9) {
						c.position.y = position.y + amount;
						c.rotation.y = Math.random()*Math.PI;
						if (tree) {
							torotz = c.rotation.z+(Math.random()-0.5);
							c.rotation.z = 1.57;
							torotx = c.rotation.x;
							toroty = c.rotation.y;
						}
						c.position.x += (Math.random()*that.settings.spread)-(that.settings.spread/2);
						c.position.z += (Math.random()*that.settings.spread)-(that.settings.spread/2);
					}
					if (normal.y > 0.9) {
						c.position.y = position.y - amount;
						c.rotation.y = Math.random()*Math.PI;
						if (tree) {
							torotz += c.rotation.z+(Math.random()-0.5);
							c.rotation.z = 1.57;
							torotx = c.rotation.x;
							toroty = c.rotation.y;
						}
						
						c.position.x += (Math.random()*that.settings.spread)-(that.settings.spread/2);
						c.position.z += (Math.random()*that.settings.spread)-(that.settings.spread/2);
					}
					if (normal.z < -0.5) {
						c.position.z = position.z + amount/2;
						c.rotation.x = -1.57;
						c.rotation.y = Math.random()*Math.PI;
						if (tree) {
							torotx = c.rotation.x+(Math.random()-0.5);
							c.rotation.x = 0;
							torotz = c.rotation.z;
							toroty = c.rotation.y;
						}
						c.position.y += (Math.random()*that.settings.spread)-(that.settings.spread/2);;
						c.position.x += (Math.random()*that.settings.spread)-(that.settings.spread/2);
					}
					if (normal.z > 0.5) {
						c.position.z = position.z - amount/2;
						c.rotation.x = 1.57;
						c.rotation.y = Math.random()*Math.PI;
						if (tree) {
							torotx = c.rotation.x+(Math.random()-0.5);
							c.rotation.x = 0;
							torotz = c.rotation.z;
							toroty = c.rotation.y;
						}

						c.position.y += (Math.random()*that.settings.spread)-(that.settings.spread/2);
						c.position.x += (Math.random()*that.settings.spread)-(that.settings.spread/2);
					}

				}

				if (tree) {
					var treeRotateTween = new TWEEN.Tween(c.rotation)
								.to({x: torotx, y: toroty, z: torotz}, that.settings.tweenTime*2)
								.easing(TWEEN.Easing.Elastic.EaseOut);
					treeRotateTween.start();				
				}

				var offset = 60;
				// keep away from camera path - not sure hwo well this works though...
				if ((tree || lightHouse) && c.position.x < camPos.x+offset && c.position.x > camPos.x-offset) {
					c.position.x = camPos.x+offset;
					if (c.position.x < camPos.x) {
						c.position.x = camPos.x-offset;
					}
				}
				if ((tree || lightHouse) && c.position.z < camPos.z+offset && c.position.z > camPos.z-offset) {
					c.position.z = camPos.z+offset;
					if (c.position.z < camPos.z) {
						c.position.z = camPos.z-offset;
					}
				}

				c.scale.x = c.scale.y= c.scale.z = 0.001*that.settings.scale;
				var xscale = zscale = yscale = 0.1*that.settings.scale;

				if (lightHouse) {
					var xscale = zscale = yscale = 0.4*that.settings.scale;
					if (Math.abs(normal.y) < 0.9) {
						continue;
					} else {
						c.visible = true;
						spawnedLighthouse = true;
					}
				}
				
				if (!tree && !lightHouse) {
					//yscale = 0.12*that.settings.scale;
					yscale = that.settings.yscale*that.settings.scale;
					xscale = zscale = 0.4*that.settings.scale;
				}

				var easeType = TWEEN.Easing.Quintic.EaseOut;
				if (tree || lightHouse) {
					easeType = TWEEN.Easing.Elastic.EaseOut;
				}

				var growTween = new TWEEN.Tween(c.scale)
							.to({x: xscale, y: yscale, z: zscale}, that.settings.tweenTime)
							.easing(easeType);
				growTween.start();				


				alivetime = 0;
			}

			that.array[i].alivetime = alivetime;

			//c.visible = that.settings.visible;

		}

	};


};
