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
		scale : scale || 1.0
	}

	var mouse2d = new THREE.Vector3( 0, 0, 1 );

	var ray = new THREE.Ray();
	var matrix = new THREE.Matrix4();
	var matrix2 = new THREE.Matrix4();
	var positionVector = new THREE.Vector3();

	/*var scene = new THREE.Scene();
	
	var plane = new THREE.Plane( 100, 100, 1, 1 );
	var invMaterial = new THREE.MeshBasicMaterial( { color:0x0000DE, opacity: 1.0 } );
	var invMaterial2 = new THREE.MeshBasicMaterial( { color:0x00DE00, opacity: 1.0 } );

	var downPlane = addMesh( plane, 100, 0, 0, 0, -1.57,0,0, invMaterial, true, true );
	var rightPlane = addMesh( plane, 100, 0, 0, 0, 0,-1.57,0, invMaterial, false, true );
	var leftPlane = addMesh( plane, 100, 0, 0, 0, 0,1.57,0, invMaterial, false, true );
	var frontPlane = addMesh( plane, 100, 0, 0, 0, 0,0,-1.57, invMaterial, false, true );
	var backPlane = addMesh( plane, 100, 0, 0, 0, 0,3.14,1.57, invMaterial, false, true );
	var upPlane = addMesh( plane, 100, 0, 0, 0, 1.57,0,0, invMaterial, false, true );

	var projector = new THREE.Projector();*/
	var cube = new THREE.Cube( 5, 5, 5 );
	that.emitter = addMesh( cube, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0xFFFF33 } ), false, false );
	that.emitterFollow = addMesh( cube, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0x3333FF } ), false, false );
	//that.emitter.visible = false;
	//that.emitterFollow.visible = false;

	cube = new THREE.Mesh ( 	
		new THREE.Cube( 3000,3000,5, 1,1,1 ), 
		new THREE.MeshLambertMaterial( { color: 0x003300 })
	);

	scene.addObject( cube );

	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( cube ) );

	this.addLoaded = function ( geometry, scale, rotation, position ) {

		var mesh = new THREE.Mesh( geometry, invMaterial2 );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
		mesh.rotation = rotation || new THREE.Vector3();
		mesh.position = position || new THREE.Vector3();
		mesh.doubleSided = true;
		scene.addObject( mesh );

	}

	this.update = function (camPos, delta) {

		cube.position.z = camPos.z-5000;

		/*rightPlane.position.x = camPos.x+that.settings.collisionDistance;
		leftPlane.position.x = camPos.x-that.settings.collisionDistance;
		rightPlane.position.z = camPos.z;
		rightPlane.position.y = camPos.y;
		leftPlane.position.z = camPos.z;
		leftPlane.position.y = camPos.y;

		frontPlane.position.z = camPos.z-that.settings.collisionDistance;
		backPlane.position.z = camPos.z+that.settings.collisionDistance;
		frontPlane.position.x = camPos.x;
		frontPlane.position.y = camPos.y;
		backPlane.position.x = camPos.x;
		backPlane.position.y = camPos.y;

		downPlane.position.y = camPos.y-that.settings.collisionDistance;
		upPlane.position.y = camPos.y+that.settings.collisionDistance;
		downPlane.position.x = camPos.x;
		downPlane.position.z = camPos.z;
		upPlane.position.x = camPos.x;
		upPlane.position.z = camPos.z;

		if (that.settings.capBottom != null) {
			if (downPlane.position.y < that.settings.capBottom) {
				downPlane.position.y = that.settings.capBottom;
			}
		}*/

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

//		var nearest = true;
		
//		if ( nearest ) {
		
			var c = THREE.Collisions.rayCastNearest( ray );
			
			if( c ) {
			
				//console.log(c.distance);
				positionVector.copy( ray.origin );
				positionVector.addSelf(ray.direction.multiplyScalar(c.distance*that.settings.scale))
				
				that.emitter.position = positionVector;
				//console.log(c.mesh == cube);
				//info.innerHTML += "Found @ distance " + c.distance;
				//c.mesh.visible = true;

			} else {
			
				//info.innerHTML += "No intersection";

			}
			
		/*} else {
		
			var cs = THREE.Collisions.rayCastAll( ray );
			
			if ( cs.length > 0 ) {

				//console.log("hello");
				var c = cs[ 0 ];
				//console.log(c.distance);
				positionVector.copy( ray.origin );
				positionVector.addSelf(ray.direction.multiplyScalar(c.distance))
				
				that.emitter.position = positionVector;

				//console.log(positionVector.z);

				for ( var i = 0; i < cs.length; i++ ) {
										
					//cs[ i ].mesh.visible = true;
					//console.log(cs[ i ].distance);
				} 
				
			} else {

				//info.innerHTML = "No intersection";

			}		

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

		//renderer.render( scene, camera );
		//renderer.render( scene, camera, renderTarget );
		//renderer.clear();

	}

	function addMesh( geometry, scale, x, y, z, rx, ry, rz, material, doubleSided, collider ) {

		var mesh = new THREE.Mesh( geometry, material );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;
		mesh.rotation.x = rx;
		mesh.rotation.y = ry;
		mesh.rotation.z = rz;
		mesh.doubleSided = doubleSided;
		mesh.updateMatrix();
		scene.addObject(mesh);

		if (collider) {
			var mc = THREE.CollisionUtils.MeshOBB(mesh);
			THREE.Collisions.colliders.push( mc );
		}
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
