var CollisionScene = function ( camera, scene, scale, shared, collisionDistance ) {
	
	var that = this;
	that.currentNormal = new THREE.Vector3( 0, 1, 0 );

	that.initSettings = {

	}

	that.settings = {
		maxSpeedDivider : 2,
		emitterDivider : 5,
		capBottom : null,
		allowFlying : false,
		collisionDistance : collisionDistance || 400,
		scale : scale || 1.0,
		shootRayDown : false
	}

	var mouse2d = new THREE.Vector3( 0, 0, 1 );

	var ray = new THREE.Ray();
	var matrix = new THREE.Matrix4();
	var matrix2 = new THREE.Matrix4();
	var positionVector = new THREE.Vector3();

	var cube = new THREE.Cube( 2, 2, 2 );
	that.emitter = addMesh( cube, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0xFFFF33 } ) );
	that.emitterFollow = addMesh( cube, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0x3333FF } ) );
	//that.emitter.visible = false;
	//that.emitterFollow.visible = false;

	// collision boxes
	var cube = new THREE.Cube( 30000,30000,1, 1,1,1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
	var front = new THREE.Mesh ( cube, material	);
	var back = new THREE.Mesh ( cube, material );
	var cube = new THREE.Cube( 1,30000,30000, 1,1,1 );
	var left = new THREE.Mesh ( cube, material );
	var right = new THREE.Mesh ( cube, material	);
	var cube = new THREE.Cube( 30000,1,30000, 1,1,1 );
	var top = new THREE.Mesh ( cube, material );
	var bottom = new THREE.Mesh ( cube, material );

/*	front.visible = false;
	back.visible = false;
	left.visible = false;
	right.visible = false;
	top.visible = false;
	bottom.visible = false;
*/
	scene.addObject( front );
	scene.addObject( back );
	scene.addObject( left );
	scene.addObject( right );
	scene.addObject( top );
	scene.addObject( bottom );
	
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( front ) );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( back ) );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( left ) );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( right ) );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( top ) );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bottom ) );

	this.addLoaded = function ( geometry, scale, rotation, position ) {

		var mesh = new THREE.Mesh( geometry, invMaterial2 );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
		mesh.rotation = rotation || new THREE.Vector3();
		mesh.position = position || new THREE.Vector3();
		mesh.doubleSided = true;
		scene.addObject( mesh );

	}

	this.update = function (camPos, delta) {

		right.position.x = camPos.x+that.settings.collisionDistance;
		left.position.x = camPos.x-that.settings.collisionDistance;
		right.position.z = camPos.z;
		right.position.y = camPos.y;
		left.position.z = camPos.z;
		left.position.y = camPos.y;

		front.position.z = camPos.z-that.settings.collisionDistance;
		back.position.z = camPos.z+that.settings.collisionDistance;
		front.position.x = camPos.x;
		front.position.y = camPos.y;
		back.position.x = camPos.x;
		back.position.y = camPos.y;

		bottom.position.y = camPos.y-that.settings.collisionDistance;
		top.position.y = camPos.y+that.settings.collisionDistance;
		bottom.position.x = camPos.x;
		bottom.position.z = camPos.z;
		top.position.x = camPos.x;
		top.position.z = camPos.z;

		/*left.updateMatrix();
		right.updateMatrix();
		front.updateMatrix();
		back.updateMatrix();
		top.updateMatrix();
		bottom.updateMatrix();*/
	
		if (that.settings.capBottom != null) {
			if (bottom.position.y < that.settings.capBottom) {
				bottom.position.y = that.settings.capBottom;
			}
		}

		mouse2d.x = ( shared.mouseX / shared.screenWidth ) * 2 - 1;
		mouse2d.y = - ( shared.mouseY / shared.screenHeight ) * 2 + 1;
		mouse2d.z = 1;

		ray.origin.copy( mouse2d );

		matrix.copy( camera.matrixWorld );
		matrix.multiplySelf( THREE.Matrix4.makeInvert( camera.projectionMatrix, matrix2 ) );
		matrix.multiplyVector3( ray.origin );
		
		ray.direction.copy( ray.origin );
		//ray.direction.subSelf( camera.position );
		ray.direction.subSelf( camPos );


		var c = THREE.Collisions.rayCastNearest( ray );
		
		if( c && c.distance > 0 ) {

			positionVector.copy( ray.origin );
			positionVector.addSelf(ray.direction.multiplyScalar(c.distance*that.settings.scale))
			
			that.emitter.position = positionVector;
			
			if (c.normal != undefined) {
				that.currentNormal.copy( c.normal ).normalize();
				var temp = that.currentNormal.z;
				that.currentNormal.z = that.currentNormal.y;
				that.currentNormal.y = temp;
				//console.log(that.currentNormal.x+" - "+that.currentNormal.y+" - "+that.currentNormal.z);
			}

			//console.log(c.normal);

			if (c.mesh == right || c.mesh == front || c.mesh == back || c.mesh == left || c.mesh == top) {
				that.currentNormal.x = 0;
				that.currentNormal.y = 1;
				that.currentNormal.z = 0;
				// not to be airbourne
				if (!that.settings.allowFlying && !that.settings.shootRayDown) {
					that.emitter.position.y = bottom.position.y;					
				}
				if (that.settings.shootRayDown) {
					ray.origin.copy( that.emitter.position )//.normalize();
					ray.direction = new THREE.Vector3(0, -1, 0);

					var c = THREE.Collisions.rayCastNearest(ray);
				
					that.emitter.position.y -= c.distance;

					that.currentNormal.copy( c.normal ).normalize();
					var temp = that.currentNormal.z;
					that.currentNormal.z = that.currentNormal.y;
					that.currentNormal.y = temp;

					//console.log(c.distance);

				}
			}

			var amount = 6;

			that.emitter.position.x += that.currentNormal.x*amount;
			that.emitter.position.y += that.currentNormal.y*amount;
			that.emitter.position.z += that.currentNormal.z*amount;

		} else {
		
			// no collsion

		}

		
		/*var cs = THREE.Collisions.rayCastAll( ray );

		if ( cs.length > 1 ) {
			
			var c = cs[1];

			positionVector.copy( ray.origin );
			positionVector.addSelf(ray.direction.multiplyScalar(c.distance*that.settings.scale))
			
			that.emitter.position = positionVector;
			
			if (c.normal != undefined) {
				that.currentNormal.copy( c.normal );
				//console.log(c.normal.y);
			}

			//console.log(cs[1].distance);

			if (c.mesh == right || c.mesh == front || c.mesh == back || c.mesh == left || c.mesh == top) {
				that.currentNormal.x = 0;
				that.currentNormal.y = 1;
				that.currentNormal.z = 0;
				// not to be airbourne
				if (!that.settings.allowFlying && !that.settings.shootRayDown) {
					that.emitter.position.y = bottom.position.y;					
				}
				if (that.settings.shootRayDown) {
					ray.origin.copy( that.emitter.position )//.normalize();
					ray.direction = new THREE.Vector3(0, -1, 0);

					var c = THREE.Collisions.rayCastNearest(ray);
				
					that.emitter.position.y -= c.distance;
					//console.log(c.distance);

				}
			}

			var amount = 6;

			that.emitter.position.y += that.currentNormal.y*amount;
			
		} else {

			// no collsion

		}*/

		// emitter
		/*var vector = new THREE.Vector3( ( shared.mouseX / shared.screenWidth ) * 2 - 1, - ( shared.mouseY / shared.screenHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );
		var ray = new THREE.Ray( camPos, vector.subSelf( camPos ).normalize() );
		var intersects = ray.intersectScene( scene );

		if ( intersects.length > 0 ) {

			for ( var i = 0; i < intersects.length; ++i ) {

				var check = vector.z < 0 ? intersects[i].point.z < camPos.z : intersects[i].point.z > camPos.z;

				if ( check && intersects[i].object != that.emitter && intersects[i].object != that.emitterFollow && intersects[i].distance > 10 ) {

					that.emitter.position = intersects[i].point;

					var face = intersects[i].face;
					var object = intersects[i].object;

					var normal = object.matrixRotationWorld.multiplyVector3( face.normal.clone() );

					that.currentNormal = normal;

					// walls
					if (intersects[i].object == rightPlane || intersects[i].object == frontPlane || intersects[i].object == backPlane || intersects[i].object == leftPlane || intersects[i].object == upPlane) {
						that.currentNormal.x = 0;
						that.currentNormal.y = 1;
						that.currentNormal.z = 0;
						// not to be airbourne
						if (!that.settings.allowFlying) {
							that.emitter.position.y = downPlane.position.y;					
						}
					}

					var amount = 6;

					if (that.currentNormal.x < -0.5) {
						that.emitter.position.x = intersects[i].point.x - amount;
					}
					if (that.currentNormal.x > 0.5) {
						that.emitter.position.x = intersects[i].point.x + amount;
					}
					if (that.currentNormal.y < -0.5) {
						that.emitter.position.y = intersects[i].point.y - amount;
					}
					if (that.currentNormal.y > 0.5) {
						that.emitter.position.y = intersects[i].point.y + amount*1.75;
					}
					if (that.currentNormal.z < -0.5) {
						that.emitter.position.z = intersects[i].point.z - amount;
					}
					if (that.currentNormal.z > 0.5) {
						that.emitter.position.z = intersects[i].point.z + amount;
					}

					break;
				}
			}

		}*/

		if (isNaN(delta) || delta > 1000 ) {
			delta = 1000/60;
		}

		var maxSpeed = delta/that.settings.maxSpeedDivider;

		var toy = that.emitter.position.y;
		
		var moveY = (toy-that.emitterFollow.position.y)/that.settings.emitterDivider;
		if (moveY > maxSpeed) {
			moveY = maxSpeed;
		}
		if (moveY < -maxSpeed) {
			moveY = -maxSpeed;
		}
		that.emitterFollow.position.y += moveY;


		var tox = that.emitter.position.x;
		
		var moveX = (tox-that.emitterFollow.position.x)/that.settings.emitterDivider;
		if (moveX > maxSpeed) {
			moveX = maxSpeed;
		}
		if (moveX < -maxSpeed) {
			moveX = -maxSpeed;
		}

		that.emitterFollow.position.x += moveX;


		var toz = that.emitter.position.z;
		
		var moveZ = (toz-that.emitterFollow.position.z)/that.settings.emitterDivider;
		if (moveZ > maxSpeed) {
			moveZ = maxSpeed;
		}
		if (moveZ < -maxSpeed) {
			moveZ = -maxSpeed;
		}

		that.emitterFollow.position.z += moveZ;

	}

	function addMesh( geometry, scale, x, y, z, rx, ry, rz, material ) {

		var mesh = new THREE.Mesh( geometry, material );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;
		mesh.rotation.x = rx;
		mesh.rotation.y = ry;
		mesh.rotation.z = rz;
		mesh.updateMatrix();
		scene.addObject(mesh);

		return mesh;
	}

	this.reset = function ( x,y,z ) {

		that.emitter.position.x = x;
		that.emitter.position.y = y;
		that.emitter.position.z = z;
		that.emitterFollow.position.x = x;
		that.emitterFollow.position.y = y;
		that.emitterFollow.position.z = z;

	}

}
