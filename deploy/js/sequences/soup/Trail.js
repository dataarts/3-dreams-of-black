var Trail = function ( numOfInstances, scene ) {
	
	var that = this;

	that.array = [];
	var scene = scene;

	that.initSettings = {
		numOfInstances : numOfInstances || 100,
	}

	that.settings = {
		visible : true,
	}

	var i;

	this.addInstance = function( geometry, predefined, tree, materialArray ) {
		
		var predefined = predefined || null;
		var tree = tree || false;
		var materialArray = materialArray || [new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } )];

		for ( i = 0; i < that.initSettings.numOfInstances; ++i ) {
			
			if ((predefined == null && that.array[i] != undefined) || (predefined != that.array[i]) ) {
				continue;
			}

			var c = new THREE.Mesh( geometry, materialArray[i%materialArray.length] );
			c.scale.x = c.scale.y = c.scale.z = 0.00000001;
			
			var obj = {c:c, alivetime:i, normal:new THREE.Vector3(), tree:tree};
			
			scene.addObject(c);
			that.array[i] = obj;

		}

	}

	this.update = function (position, normal, camPos, delta) {

		if (isNaN(delta) || delta > 1000 ) {
			delta = 1000/60;
		}

		var multiplier = delta/that.initSettings.numOfInstances;
		
		// grass
		for (i=0; i<that.array.length; ++i ) {
			var obj = that.array[i];
			var c = obj.c;

			var alivetime = obj.alivetime;
			var tree = obj.tree;
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
					c.position.y += (Math.random()*50)-25;
					c.position.z += (Math.random()*50)-25;
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

					c.position.y += (Math.random()*50)-25;
					c.position.z += (Math.random()*50)-25;
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
					c.position.x += (Math.random()*50)-25;
					c.position.z += (Math.random()*50)-25;
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
					
					c.position.x += (Math.random()*40)-20;
					c.position.z += (Math.random()*40)-20;
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
					c.position.y += (Math.random()*50)-25;
					c.position.x += (Math.random()*50)-25;
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

					c.position.y += (Math.random()*50)-25;
					c.position.x += (Math.random()*50)-25;
				}

				if (tree) {
					var treeRotateTween = new TWEEN.Tween(c.rotation)
								.to({x: torotx, y: toroty, z: torotz}, 4000)
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


				c.scale.x = c.scale.y= c.scale.z = 0.001;
				var xscale = zscale = yscale = 0.1;
				if (!tree) {
					yscale = 0.07;
				}

				var growTween = new TWEEN.Tween(c.scale)
							.to({x: xscale, y: yscale, z: zscale}, 4000)
							.easing(TWEEN.Easing.Elastic.EaseOut)
							.delay(300);
				growTween.start();				


				alivetime = 0;
			}

			that.array[i].alivetime = alivetime;

			c.visible = that.settings.visible;

		}

	}


}