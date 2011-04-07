var Trail = function ( numOfInstances, scene ) {
	
	var that = this;

	that.array = [];
	var vectorArray = vectorArray;
	var numOfInstances = numOfInstances || 100;
	var scene = scene;

	var i;

	this.addInstance = function( geometry, predefined, tree, materialArray ) {
		
		var predefined = predefined || null;
		var tree = tree || false;
		var materialArray = materialArray || [new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading } )];

		for ( i = 0; i < numOfInstances; ++i ) {
			
			if ((predefined == null && that.array[i] != undefined) || (predefined != that.array[i]) ) {
				continue;
			}

			var c = new THREE.Mesh( geometry, materialArray[i%materialArray.length] );
			c.scale.x = c.scale.y = c.scale.z = 0.00000001;
			
			var obj = {c:c, scale:0, alivetime:i, normal:new THREE.Vector3(), tree:tree, maxHeight:Math.min(Math.random()+0.5,1.0)};
			
			scene.addObject(c);
			that.array[i] = obj;

		}

	}

	this.update = function (position, normal, camPos, delta) {

		var multiplier = delta/60;
		
		// grass
		for (i=0; i<that.array.length; ++i ) {
			var obj = that.array[i];
			var c = obj.c;

			var scale = obj.scale;
			var alivetime = obj.alivetime;
			var tree = obj.tree;
			var maxHeight = obj.maxHeight;
			
			alivetime += multiplier;
			
			// respawn
			if (alivetime > 90) {
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
					var treeTween = new TWEEN.Tween(c.rotation)
								.to({x: torotx, y: toroty, z: torotz}, 4000)
								.easing(TWEEN.Easing.Elastic.EaseOut);
					treeTween.start();				
				}

				// keep away from camera path - hack
				if (tree && c.position.x < camPos.x+30 && c.position.x > camPos.x-30) {
					c.position.x = camPos.x+30;
					if (c.position.x < camPos.x) {
						c.position.x = camPos.x-30;
					}
				}

				alivetime = 0;
			}

			if (tree) {
				scale = Math.max( alivetime / 50, 0.0001 );
			} else {
				scale = Math.max( alivetime / 75, 0.0001 );				
			}
		
			scale = Math.min( scale, 1 );
			scale *= 0.1;

			if (tree) {
				maxHeight *= 0.1;
				var divider = 20;
				c.scale.x = c.scale.y= c.scale.z = 0.1*Math.min((alivetime+1)/divider,1);
				//c.scale.y = scale;
				if (c.scale.y > maxHeight) {
					c.scale.y = maxHeight;
				}
			} else {
				c.scale.x = c.scale.z = Math.min( 0.065, scale * 2.5 );
				c.scale.y = scale*1.25;
			}
			
			that.array[i].scale = scale;
			that.array[i].alivetime = alivetime;

		}

	}


}