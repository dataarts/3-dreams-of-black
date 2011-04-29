var CollisionScene2 = function ( camera, scale, shared, collisionDistance, realscene ) {
	
	var that = this;
	var scene = new THREE.Scene();
	that.currentNormal = new THREE.Vector3( 0, 1, 0 );

	that.initSettings = {

	};

	that.settings = {

		maxSpeedDivider : 2,
		emitterDivider : 5,
		cameraTargetDivider : 12,
		capBottom : null,
		capTop : null,
		allowFlying : false,
		collisionDistance : collisionDistance || 400,
		scale : scale || 1.0,
		shootRayDown : false,
		keepEmitterFollowDown : false,
		normalOffsetAmount : 6,
		minDistance : 10,
		camera : camera,

	};

	//var mouse2d = new THREE.Vector3( 0, 0, 1 );

	//var ray = new THREE.Ray();
	//var matrix = new THREE.Matrix4();
	//var matrix2 = new THREE.Matrix4();
	//var positionVector = new THREE.Vector3();
	var projector = new THREE.Projector();

	var cube = new THREE.Cube( 5, 5, 5 );

	that.emitter = addMesh( cube, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0x3333FF, opacity: 0.4 } ) );
	that.emitterFollow = addMesh( cube, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0xFF3333, opacity: 0.4 } ) );
	that.cameraTarget = addMesh( cube, 1, camPos.x, camPos.y, camPos.z, 0,0,0, new THREE.MeshBasicMaterial( { color: 0x33FF33, opacity: 0.4 } ) );


	//that.emitter.visible = false;
	//that.emitterFollow.visible = false;

/*	var emitterReal = new THREE.Mesh( cube, new THREE.MeshBasicMaterial( { color: 0x3333FF, opacity: 0.4 } ) );
	var emitterFollowReal = new THREE.Mesh( cube, new THREE.MeshBasicMaterial( { color: 0xFF3333, opacity: 0.4 } ) );
	var cameraTargetReal = new THREE.Mesh( cube, new THREE.MeshBasicMaterial( { color: 0x33FF33, opacity: 0.4 } ) );

	realscene.addObject( emitterReal );
	realscene.addObject( emitterFollowReal );
	realscene.addObject( cameraTargetReal );
*/
	// collision boxes

	var cube = new THREE.Cube( 5000,5000,10, 1,1,1 );
	var material = new THREE.MeshLambertMaterial( { color: 0x0000FF, opacity: 0.2 } );
	var front = new THREE.Mesh ( cube, material	);
	var back = new THREE.Mesh ( cube, material );
	var cube = new THREE.Cube( 10,5000,5000, 1,1,1 );
	var left = new THREE.Mesh ( cube, material );
	var right = new THREE.Mesh ( cube, material	);
	var cube = new THREE.Cube( 5000,10,5000, 1,1,1 );
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
	
/*	scene.collisions.colliders.push( THREE.CollisionUtils.MeshOBB( front ) );
	scene.collisions.colliders.push( THREE.CollisionUtils.MeshOBB( back ) );
	scene.collisions.colliders.push( THREE.CollisionUtils.MeshOBB( left ) );
	scene.collisions.colliders.push( THREE.CollisionUtils.MeshOBB( right ) );
	scene.collisions.colliders.push( THREE.CollisionUtils.MeshOBB( top ) );
	scene.collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bottom ) );
*/
	this.addLoaded = function ( geometry, scale, rotation, position, realscene ) {

		var material = new THREE.MeshLambertMaterial( { color: 0xFF0000, opacity: 0.5 } );

		var mesh = new THREE.Mesh( geometry, material );

		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
		mesh.rotation = rotation || new THREE.Vector3();
		mesh.position = position || new THREE.Vector3();
		//mesh.doubleSided = true;
		//mesh.scale.z = 0.15;

		scene.addObject( mesh );
		//realscene.addObject( mesh );

	};

	this.update = function ( camPos, delta ) {
		right.position.x = camPos.x + that.settings.collisionDistance;
		left.position.x  = camPos.x - that.settings.collisionDistance;
		right.position.z = camPos.z;
		right.position.y = camPos.y;
		left.position.z  = camPos.z;
		left.position.y  = camPos.y;

		front.position.z = camPos.z - that.settings.collisionDistance;
		back.position.z  = camPos.z + that.settings.collisionDistance;
		front.position.x = camPos.x;
		front.position.y = camPos.y;
		back.position.x  = camPos.x;
		back.position.y  = camPos.y;

		bottom.position.y = camPos.y - that.settings.collisionDistance;
		top.position.y    = camPos.y + that.settings.collisionDistance;
		bottom.position.x = camPos.x;
		bottom.position.z = camPos.z;
		top.position.x    = camPos.x;
		top.position.z    = camPos.z;

		if ( that.settings.capBottom != null ) {

			if ( bottom.position.y < that.settings.capBottom ) {
				 bottom.position.y = that.settings.capBottom;
			}

		}

		if ( that.settings.capTop != null ) {

			if ( top.position.y < that.settings.capTop ) {
				 top.position.y = that.settings.capTop;
			}

		}


		/*mouse2d.x = ( shared.mouse.x / shared.screenWidth ) * 2 - 1;
		mouse2d.y = - ( shared.mouse.y / shared.screenHeight ) * 2 + 1;
		mouse2d.z = 1;*/


		// emitter
		var vector = new THREE.Vector3( ( shared.mouse.x / shared.screenWidth ) * 2 - 1, - ( shared.mouse.y / shared.screenHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );
		var ray = new THREE.Ray( camPos, vector.subSelf( camPos ).normalize() );
		var intersects = ray.intersectScene( scene );

		if ( intersects.length > 0 ) {

			for ( var i = 0; i < intersects.length; ++i ) {

				var check = vector.z < 0 ? intersects[i].point.z < camPos.z : intersects[i].point.z > camPos.z;

				if ( check && intersects[i].object != that.emitter && intersects[i].object != that.emitterFollow ) {

					that.emitter.position = intersects[i].point;

					// hack for now...
					if (that.emitter.position.z > camPos.z-125) {
						that.emitter.position.z = camPos.z-125;
					}

					/*var face = intersects[i].face;
					var object = intersects[i].object;
					var normal = object.matrixRotationWorld.multiplyVector3( face.normal.clone() );
					that.currentNormal = normal;*/

					// walls
					if (intersects[i].object == right || intersects[i].object == front || intersects[i].object == back || intersects[i].object == left || intersects[i].object == top) {
						// not to be airbourne
						if (!that.settings.allowFlying) {
							that.emitter.position.y = bottom.position.y+5;					
						}
					}

					break;
				}
			}

		}


		if ( isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000 / 60;
		}

		var maxSpeed = delta / that.settings.maxSpeedDivider;

		var tox = that.emitter.position.x;
		var moveX = ( tox - that.emitterFollow.position.x ) / that.settings.emitterDivider;

		var toy = that.emitter.position.y;
		var moveY = ( toy - that.emitterFollow.position.y ) / that.settings.emitterDivider;

		var toz = that.emitter.position.z;
		var moveZ = ( toz - that.emitterFollow.position.z ) / that.settings.emitterDivider;

		//var nowVector = new THREE.Vector3(that.emitterFollow.position.x,that.emitterFollow.position.y,that.emitterFollow.position.z).normalize();
		//var toVector = new THREE.Vector3(tox,toy,toz).normalize();

		//console.log(nowVector.x+" | "+toVector.x);

		if ( moveY > maxSpeed ) moveY = maxSpeed;
		if ( moveY < -maxSpeed ) moveY = -maxSpeed;

		if ( moveX > maxSpeed ) moveX = maxSpeed;
		if ( moveX < -maxSpeed ) moveX = -maxSpeed;

		if ( moveZ > maxSpeed )	moveZ = maxSpeed;
		if ( moveZ < -maxSpeed ) moveZ = -maxSpeed;

		that.emitterFollow.position.x += moveX;
		that.emitterFollow.position.y += moveY;
		that.emitterFollow.position.z += moveZ;


		// shoot rays in all directions from emitterFollow, clamp in the direction of the shortest distance
		var direction = new THREE.Vector3();
		var ray = new THREE.Ray( that.emitterFollow.position, direction );
		var shortestDistance = 10000;
		var shortestPoint = that.emitterFollow.position;
		var shortestObject;
		var shortestFace;

		// x left
		direction.set(-1,0,0);
		ray.direction = direction;
		var intersects = ray.intersectScene( scene );

		if ( intersects.length > 0 ) {
			for ( var i = 0; i < intersects.length; ++i ) {
				if ( intersects[i].object != that.emitter && intersects[i].object != left && intersects[i].object != right ) {
					if (intersects[i].distance < shortestDistance) {
						shortestDistance = intersects[i].distance;
						shortestPoint = intersects[i].point;
						shortestFace = intersects[i].face;
						shortestObject = intersects[i].object;
					}
					break;
				}
			}
		}

		// x right
		direction.set(1,0,0);
		ray.direction = direction;
		var intersects = ray.intersectScene( scene );

		if ( intersects.length > 0 ) {
			for ( var i = 0; i < intersects.length; ++i ) {
				if ( intersects[i].object != that.emitter && intersects[i].object != left && intersects[i].object != right ) {
					if (intersects[i].distance < shortestDistance) {
						shortestDistance = intersects[i].distance;
						shortestPoint = intersects[i].point;
						shortestFace = intersects[i].face;
						shortestObject = intersects[i].object;
					}
					break;
				}
			}
		}


		// y down
		direction.set(0,-1,0);
		ray.direction = direction;
		var intersects = ray.intersectScene( scene );

		if ( intersects.length > 0 ) {
			for ( var i = 0; i < intersects.length; ++i ) {
				if ( intersects[i].object != that.emitter && intersects[i].object != top ) {
					if (intersects[i].distance < shortestDistance) {
						shortestDistance = intersects[i].distance;
						shortestPoint = intersects[i].point;
						shortestFace = intersects[i].face;
						shortestObject = intersects[i].object;
					}
					break;
				}
			}
		}


		// z forward
		/*direction.set(0,0,-1);
		ray.direction = direction;
		var intersects = ray.intersectScene( scene );

		if ( intersects.length > 0 ) {
			for ( var i = 0; i < intersects.length; ++i ) {
				if ( intersects[i].object != that.emitter && intersects[i].object != front && intersects[i].object != back ) {
					if (intersects[i].distance < shortestDistance) {
						shortestDistance = intersects[i].distance;
						shortestPoint = intersects[i].point;
						shortestFace = intersects[i].face;
						shortestObject = intersects[i].object;
					}
					break;
				}
			}
		}

		// z back
		direction.set(0,0,1);
		ray.direction = direction;
		var intersects = ray.intersectScene( scene );

		if ( intersects.length > 0 ) {
			for ( var i = 0; i < intersects.length; ++i ) {
				if ( intersects[i].object != that.emitter && intersects[i].object != front && intersects[i].object != back ) {
					if (intersects[i].distance < shortestDistance) {
						shortestDistance = intersects[i].distance;
						shortestPoint = intersects[i].point;
						shortestFace = intersects[i].face;
						shortestObject = intersects[i].object;
					}
					break;
				}
			}
		}*/

		// clamp to the closest "hit"
		that.emitterFollow.position = shortestPoint;

		if (shortestObject != undefined) {
			var normal = shortestObject.matrixRotationWorld.multiplyVector3( shortestFace.normal.clone() );
			that.currentNormal = normal;
		}

		/*var amount = 5;

		that.emitterFollow.position.x += that.currentNormal.x*amount;
		that.emitterFollow.position.y += that.currentNormal.y*amount;
		that.emitterFollow.position.z += that.currentNormal.z*amount;
		*/



		var toy = that.emitterFollow.position.y;
		var moveY = ( toy - that.cameraTarget.position.y ) / that.settings.cameraTargetDivider;

		var tox = that.emitterFollow.position.x;
		var moveX = ( tox - that.cameraTarget.position.x ) / that.settings.cameraTargetDivider;

		var toz = that.emitterFollow.position.z;
		var moveZ = ( toz - that.cameraTarget.position.z ) / that.settings.cameraTargetDivider;

		var maxSpeed = 6;

		if ( moveY > maxSpeed )	moveY = maxSpeed;
		if ( moveY < -maxSpeed ) moveY = -maxSpeed;

		if ( moveX > maxSpeed )	moveX = maxSpeed;
		if ( moveX < -maxSpeed ) moveX = -maxSpeed;

		if ( moveZ > maxSpeed )	moveZ = maxSpeed;
		if ( moveZ < -maxSpeed )moveZ = -maxSpeed;

		that.cameraTarget.position.x += moveX;
		that.cameraTarget.position.y += moveY;
		that.cameraTarget.position.z += moveZ;

		// hack for now...
		if (that.cameraTarget.position.z > camPos.z-100) {
			that.cameraTarget.position.z = camPos.z-100;
		}

/*		emitterReal.position = that.emitter.position;
		emitterFollowReal.position = that.emitterFollow.position;
		cameraTargetReal.position = that.cameraTarget.position;
*/
		shared.renderer.render( scene, camera );
		//shared.renderer.render( scene, camera, renderTarget );
		shared.renderer.clear();

	};

	function addMesh( geometry, scale, x, y, z, rx, ry, rz, material ) {

		var mesh = new THREE.Mesh( geometry, material );

		mesh.scale.set( scale, scale, scale );
		mesh.position.set( x, y, z );
		mesh.rotation.set( rx, ry, rz );

		mesh.updateMatrix();
		scene.addObject( mesh );

		return mesh;

	};

	this.reset = function ( x, y, z ) {

		that.emitter.position.set( x, y, z );
		that.emitterFollow.position.set( x, y, z );
		that.cameraTarget.position.set( x, y, z );
	};

};
