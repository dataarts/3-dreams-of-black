/**
 * @author Mikael Emtinger
 */

CityCameraFreeExplore = function( shared ) {
	
	// setttings
	
	var CAMERA_FORWARD_SPEED = 6;
	var CAMERA_FORWARD_SPEED_MAX = 9;
	var CAMERA_VERTICAL_FACTOR = 20;
	var CAMERA_VERTICAL_LIMIT = 50;
	var CAMERA_HORIZONTAL_FACTOR = 25;
	var CAMERA_INERTIA = 0.05;
	var CAMERA_TARGET_INERTIA = 0.2; 
	var CAMERA_ROLL_FACTOR = 0.4;
	
	var boundingX = { start: new THREE.Vector3( -3000, 10, -1500 ), end: new THREE.Vector3( 3000, 200, -1500 ) };
	var boundingZ = { start: new THREE.Vector3( 0, 10, -300 ), end: new THREE.Vector3( 0, 250, -3200 ) };


	// variables

	var wantedCamera;
	var wantedCameraTarget;
	var wantedCameraDirection = new THREE.Vector3();
	var portalDirectionDot = new THREE.Vector3();
	var world;
	var camera;
	var portals;
	
	
	// construct

	world = shared.worlds.city;
	portals = world.portals;
	camera = new THREE.Camera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );

	camera.target.position.set( 0, 0, -100 );

	wantedCamera = new THREE.Object3D();
	wantedCameraTarget = new THREE.Object3D();
	wantedCameraTarget.position.set( 0, 0, -100 );

	world.scene.addChild( camera );
	world.scene.addChild( camera.target );
	world.scene.addChild( wantedCamera );
	world.scene.addChild( wantedCameraTarget );

	
	//--- public ---
	
	var that = {};
	that.camera = camera;
	
	
	//--- reset camera ---
	
	that.resetCamera = function() {
		
		wantedCamera.position.set( boundingZ.start.x, boundingZ.start.y, ( boundingZ.end.z + boundingZ.start.z ) * 0.5 );
		wantedCameraTarget.position.set( boundingX.start.x, boundingZ.start.y, wantedCamera.position.z );
		
		camera.position.copy( wantedCamera.position );
		camera.target.position.copy( wantedCameraTarget.position );
		
	}
	
	
	//--- update camera ---
	
	that.updateCamera = function( progress, delta, time ) {
		
		delta = delta * ( 1000 / 30 ) / 1000; 
		
		// get mouse
		
		var mouseX = shared.mouse.x / shared.screenWidth - 0.5;
		var mouseY = shared.mouse.y / shared.screenHeight - 0.5;


		// handle up/down (cap lowest, highest)

		if( Math.abs( wantedCameraTarget.position.y - wantedCamera.position.y ) < CAMERA_VERTICAL_LIMIT ) {
			
			wantedCameraTarget.position.y -= mouseY * CAMERA_VERTICAL_FACTOR;
			
		}

		wantedCameraTarget.position.y  = Math.max( wantedCameraTarget.position.y, boundingZ.start.y );
		wantedCameraTarget.position.y  = Math.min( wantedCameraTarget.position.y, boundingZ.end.y );


		// handle left/right		

		wantedCameraDirection.sub( wantedCameraTarget.position, wantedCamera.position ).normalize();

		wantedCameraTarget.position.x = wantedCamera.position.x + wantedCameraDirection.x * 500 - wantedCameraDirection.z * CAMERA_HORIZONTAL_FACTOR * mouseX * delta;
		wantedCameraTarget.position.z = wantedCamera.position.z + wantedCameraDirection.z * 500 + wantedCameraDirection.x * CAMERA_HORIZONTAL_FACTOR * mouseX * delta;


		// move forward
		// if moving towards portal, home in on it

		var closestPortal;
		var closestDistance = 9999999999;

		for( var p = 0; p < portals.length; p++ ) {
			
			var portal = portals[ p ];
			var dot = portalDirectionDot.sub( portal.object.matrixWorld.getPosition(), wantedCamera.position ).normalize().dot( wantedCameraDirection );
	
			if( dot > 0.7 && portal.currentDistance < closestDistance ) {
				
				closestDistance = portal.currentDistance;
				closestPortal   = portal;
				
			}			
			
		}
		
		if( closestPortal && closestDistance < closestPortal.radius * 4 ) {
			
			portalDirectionDot.sub( closestPortal.object.matrixWorld.getPosition(), wantedCamera.position );
			wantedCamera.position.addSelf( portalDirectionDot.normalize().multiplyScalar( CAMERA_FORWARD_SPEED * delta ));
			
		} else {

			// calc camera speed (dependent on hight)
	
			cameraSpeed = CAMERA_FORWARD_SPEED;
			
			var cameraHightFactor = ( Math.min( Math.max( wantedCamera.position.y, boundingZ.start.y ), boundingZ.end.y ) - boundingZ.start.y ) / ( boundingZ.end.y - boundingZ.start.y );
			cameraSpeed += ( CAMERA_FORWARD_SPEED_MAX - CAMERA_FORWARD_SPEED ) * cameraHightFactor;


			// move forward
	
			wantedCamera.position.addSelf( wantedCameraDirection.multiplyScalar( cameraSpeed * delta ));
	
	
			// cap xyz
	
			wantedCamera.position.x = boundingZ.start.x;
			wantedCamera.position.y = Math.max( Math.min( wantedCamera.position.y, boundingZ.end.y ), boundingZ.start.y );
			wantedCamera.position.z = Math.min( Math.max( wantedCamera.position.z, boundingZ.end.z ), boundingZ.start.z );

		}


		// position intertia

		camera.position.x += ( wantedCamera.position.x - camera.position.x ) * CAMERA_INERTIA * delta;
		camera.position.y += ( wantedCamera.position.y - camera.position.y ) * CAMERA_INERTIA * delta;
		camera.position.z += ( wantedCamera.position.z - camera.position.z ) * CAMERA_INERTIA * delta;

		camera.target.position.x += ( wantedCameraTarget.position.x - camera.target.position.x ) * CAMERA_TARGET_INERTIA * delta;
		camera.target.position.y += ( wantedCameraTarget.position.y - camera.target.position.y ) * CAMERA_TARGET_INERTIA * delta;
		camera.target.position.z += ( wantedCameraTarget.position.z - camera.target.position.z ) * CAMERA_TARGET_INERTIA * delta;
		
		
		// roll
		
		var currentCameraZ = camera.matrixWorld.getColumnZ();
		
		wantedCameraDirection.normalize();
		wantedCameraDirection.y = currentCameraZ.y;
		wantedCameraDirection.subSelf( currentCameraZ ).normalize();
		wantedCameraDirection.multiplyScalar( CAMERA_ROLL_FACTOR * delta );
		
		wantedCamera.up.set( 0, 1, 0 );
		wantedCamera.up.subSelf( wantedCameraDirection ).normalize();
		
		camera.up.x += ( wantedCamera.up.x - camera.up.x ) * CAMERA_INERTIA * delta;
		camera.up.y += ( wantedCamera.up.y - camera.up.y ) * CAMERA_INERTIA * delta;
		camera.up.z += ( wantedCamera.up.z - camera.up.z ) * CAMERA_INERTIA * delta;

	}

	
	return that;
}
