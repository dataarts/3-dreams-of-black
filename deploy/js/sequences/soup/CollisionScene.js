var CollisionScene = function ( camera, shared, collisionDistance, incapBottom, allowFlying ) {
	
	var that = this;
	that.currentNormal = new THREE.Vector3( 0, 1, 0 );
	that.maxSpeedDivider = 2;
	that.emitterDivider = 5;
	that.capBottom =  null || incapBottom;
	var allowFlying = allowFlying || false;
	var collisionDistance = collisionDistance || 400;

	var scene = new THREE.Scene();

	var plane = new Plane( 100, 100, 1, 1 );
	var invMaterial = new THREE.MeshBasicMaterial( { color:0x0000DE, opacity: 0.3 } );
	var invMaterial2 = new THREE.MeshBasicMaterial( { color:0x00DE00, opacity: 1.0 } );

	var downPlane = addMesh( plane, 100, 0, 0, 0, -1.57,0,0, invMaterial, true );
	var rightPlane = addMesh( plane, 100, 0, 0, 0, 0,-1.57,0, invMaterial, false );
	var leftPlane = addMesh( plane, 100, 0, 0, 0, 0,1.57,0, invMaterial, false );
	var frontPlane = addMesh( plane, 100, 0, 0, 0, 0,0,-1.57, invMaterial, false );
	var backPlane = addMesh( plane, 100, 0, 0, 0, 0,3.14,1.57, invMaterial, false );
	var upPlane = addMesh( plane, 100, 0, 0, 0, 1.57,0,0, invMaterial, false );

	var projector = new THREE.Projector();
	var cube = new Cube( 10, 10, 10 );
	that.emitter = addMesh( cube, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0xFFFF33 } ) );
	that.emitterFollow = addMesh( cube, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0x3333FF } ) );


	this.addLoaded = function ( geometry, scale ) {

		var mesh = new THREE.Mesh( geometry, invMaterial2 );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
		
		scene.addObject( mesh );

	}

	this.update = function (camPos, delta) {

		rightPlane.position.x = camPos.x+collisionDistance;
		leftPlane.position.x = camPos.x-collisionDistance;
		rightPlane.position.z = camPos.z;
		rightPlane.position.y = camPos.y;
		leftPlane.position.z = camPos.z;
		leftPlane.position.y = camPos.y;

		frontPlane.position.z = camPos.z-collisionDistance;
		backPlane.position.z = camPos.z+collisionDistance;
		frontPlane.position.x = camPos.x;
		frontPlane.position.y = camPos.y;
		backPlane.position.x = camPos.x;
		backPlane.position.y = camPos.y;

		downPlane.position.y = camPos.y-collisionDistance;
		upPlane.position.y = camPos.y+collisionDistance;
		downPlane.position.x = camPos.x;
		downPlane.position.z = camPos.z;
		upPlane.position.x = camPos.x;
		upPlane.position.z = camPos.z;

		if (that.capBottom != null) {
			if (downPlane.position.y < that.capBottom) {
				downPlane.position.y = that.capBottom;
			}
		}

		// emitter
		var vector = new THREE.Vector3( ( shared.mouseX / shared.screenWidth ) * 2 - 1, - ( shared.mouseY / shared.screenHeight ) * 2 + 1, 0.5 );
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
						if (!allowFlying) {
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


					// hack..
					/*if (that.emitter.position.z > camPos.z-100) {
						that.emitter.position.z = camPos.z-100;
					}*/
					break;
				}
			}

		}

		if (isNaN(delta) || delta > 1000 ) {
			delta = 1000/60;
		}

		var maxSpeed = delta/that.maxSpeedDivider;

		var toy = that.emitter.position.y;
		
		var moveY = (toy-that.emitterFollow.position.y)/that.emitterDivider;
		if (moveY > maxSpeed) {
			moveY = maxSpeed;
		}
		if (moveY < -maxSpeed) {
			moveY = -maxSpeed;
		}
		that.emitterFollow.position.y += moveY;


		var tox = that.emitter.position.x;
		
		var moveX = (tox-that.emitterFollow.position.x)/that.emitterDivider;
		if (moveX > maxSpeed) {
			moveX = maxSpeed;
		}
		if (moveX < -maxSpeed) {
			moveX = -maxSpeed;
		}

		that.emitterFollow.position.x += moveX;


		var toz = that.emitter.position.z;
		
		var moveZ = (toz-that.emitterFollow.position.z)/that.emitterDivider;
		if (moveZ > maxSpeed) {
			moveZ = maxSpeed;
		}
		if (moveZ < -maxSpeed) {
			moveZ = -maxSpeed;
		}

		that.emitterFollow.position.z += moveZ;

		renderer.render( scene, camera );
		//renderer.render( scene, camera, renderTarget );
		renderer.clear();

	}

	function addMesh( geometry, scale, x, y, z, rx, ry, rz, material, doubleSided ) {

		var inDouble = doubleSided || false;

		mesh = new THREE.Mesh( geometry, material );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;
		mesh.rotation.x = rx;
		mesh.rotation.y = ry;
		mesh.rotation.z = rz;
		mesh.doubleSided = inDouble;
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