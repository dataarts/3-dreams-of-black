var Trail = function ( numOfInstances, scene ) {
	
	var that = this;

	that.array = [];
	var scene = scene;

	that.initSettings = {
		numOfInstances : numOfInstances || 100,
	}

	that.settings = {
		spread : 50,
		visible : true,
		aliveDivider: that.initSettings.numOfInstances,
		tweenTime: 4000,
		scale: 1,
	}

	var i;

	this.addInstance = function( geometry, predefined, tree, lightHouse ) {
		
		var predefined = predefined || null;
		var tree = tree || false;
		var lightHouse = lightHouse || false;

		for ( i = 0; i < that.initSettings.numOfInstances; ++i ) {
			
			if ((predefined == null && that.array[i] != undefined) || (predefined != that.array[i]) ) {
				continue;
			}

			var c = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );

			c.scale.x = c.scale.y = c.scale.z = 0.00000001;
			
			var obj = {c:c, alivetime:i, normal:new THREE.Vector3(), tree:tree, lightHouse:lightHouse};
			
			scene.addObject(c);
			that.array[i] = obj;

		}

	}

	this.update = function (position, normal, camPos, delta) {

		if (isNaN(delta) || delta > 1000 ) {
			delta = 1000/60;
		}

		var multiplier = delta/that.settings.aliveDivider;
		
		// grass
		for (i=0; i<that.array.length; ++i ) {
			var obj = that.array[i];
			var c = obj.c;

			var alivetime = obj.alivetime;
			var tree = obj.tree;
			var lightHouse = obj.lightHouse;
			var maxHeight = obj.maxHeight;
			
			alivetime += multiplier;
			
			// respawn
			if (alivetime > that.initSettings.numOfInstances) {
				c.position.x = position.x;
				c.position.y = position.y;
				c.position.z = position.z;

				c.rotation.x = 0;
				c.rotation.z = 0;
				c.rotation.y = 0;

				var amount = 8;

				if (tree) {
					amount = 10;
				}

				var torotx = 0;
				var toroty = 0;
				var torotz = 0;

				if (normal.x < -0.8) {
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
				if (normal.x > 0.8) {
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
				if (normal.y < -0.8) {
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
				if (normal.y > 0.8) {
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
				if (normal.z < -0.8) {
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
				if (normal.z > 0.8) {
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

				if (tree) {
					var treeRotateTween = new TWEEN.Tween(c.rotation)
								.to({x: torotx, y: toroty, z: torotz}, that.settings.tweenTime)
								.easing(TWEEN.Easing.Elastic.EaseOut)
								.delay(400);
					treeRotateTween.start();				
				}

				// keep away from camera path - hack
				if (tree && c.position.x < camPos.x+40 && c.position.x > camPos.x-40) {
					c.position.x = camPos.x+40;
					if (c.position.x < camPos.x) {
						c.position.x = camPos.x-40;
					}
				}


				c.scale.x = c.scale.y= c.scale.z = 0.001*that.settings.scale;
				var xscale = zscale = yscale = 0.1*that.settings.scale;
				if (!tree && !lightHouse) {
					yscale = 0.3*that.settings.scale;
					xscale = zscale = 0.4*that.settings.scale;
				}

				var growTween = new TWEEN.Tween(c.scale)
							.to({x: xscale, y: yscale, z: zscale}, that.settings.tweenTime)
							.easing(TWEEN.Easing.Elastic.EaseOut)
							.delay(300);
				growTween.start();				

				if (lightHouse) {
					
					var posx = c.position.x+((normal.x*-1)*50);
					var posy = c.position.y+((normal.y*-1)*50);
					var posz = c.position.z+((normal.z*-1)*50);

					var lightHouseDownTween = new TWEEN.Tween(c.position)
								.to({x: posx, y: posy, z: posz}, 1000)
								.easing(TWEEN.Easing.Elastic.EaseIn)
								.delay(that.settings.tweenTime/2);
					lightHouseDownTween.start();

				}

				alivetime = 0;
			}

			that.array[i].alivetime = alivetime;

			c.visible = that.settings.visible;

		}

	}


}