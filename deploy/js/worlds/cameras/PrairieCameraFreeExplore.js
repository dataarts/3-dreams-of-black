/**
 * @author Mikael Emtinger
 */

PrairieCameraFreeExplore = function( shared ) {
	
	// setttings
	
	var CAMERA_Y = 25;
	var CAMERA_FORWARD_SPEED = 2;
	var CAMERA_VERTICAL_FACTOR = 20;
	var CAMERA_VERTICAL_LIMIT = 200;
	var CAMERA_HORIZONTAL_FACTOR = 15;
	var CAMERA_INERTIA = 0.02;
	var CAMERA_ROLL_FACTOR = 0.4;
	var CAMERA_RADIUS = 795;


	// variables

	var wantedCamera;
	var wantedCameraTarget;
	var wantedCameraDirection = new THREE.Vector3();
	var world;
	var portals;
	var camera;
	var center;
	var portalDirectionDot = new THREE.Vector3();
	
	// construct

	world = shared.worlds.prairie;
	portals = world.portals;
	center = new THREE.Vector3( 350, 0, -300);
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
		
		wantedCamera.position.set( center.x - 200, CAMERA_Y, center.z );
		wantedCameraTarget.position.set( center.x + 300, CAMERA_Y, center.z );
		
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
			
			wantedCameraTarget.position.y -= mouseY * CAMERA_VERTICAL_FACTOR * delta;
			
		} else {
			
			if( wantedCameraTarget.position.y > wantedCamera.position.y ) wantedCameraTarget.position.y -= CAMERA_VERTICAL_FACTOR;
			if( wantedCameraTarget.position.y < wantedCamera.position.y ) wantedCameraTarget.position.y += CAMERA_VERTICAL_FACTOR;
			
		}


		// handle left/right		

		wantedCameraDirection.sub( wantedCameraTarget.position, wantedCamera.position ).normalize();

		wantedCameraTarget.position.x = wantedCamera.position.x + wantedCameraDirection.x * 350 - wantedCameraDirection.z * CAMERA_HORIZONTAL_FACTOR * mouseX * delta;
		wantedCameraTarget.position.z = wantedCamera.position.z + wantedCameraDirection.z * 350 + wantedCameraDirection.x * CAMERA_HORIZONTAL_FACTOR * mouseX * delta;

			
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
		
		if( closestPortal && closestDistance < closestPortal.radius * 2 ) {
			
			portalDirectionDot.sub( closestPortal.object.matrixWorld.getPosition(), wantedCamera.position );
			wantedCamera.position.addSelf( portalDirectionDot.normalize().multiplyScalar( CAMERA_FORWARD_SPEED * delta ));
			
		} else {
			
			var movement = wantedCameraDirection.multiplyScalar( CAMERA_FORWARD_SPEED * delta );
			movement.y = ( CAMERA_Y - wantedCamera.position.y ) * 0.03;
		
			wantedCamera.position.addSelf( movement );
	
			var x = wantedCamera.position.x - center.x;
			var z = wantedCamera.position.z - center.z;
	
			var dot = portalDirectionDot.sub( center, wantedCamera.position ).normalize().dot( wantedCameraDirection );
	
			if( Math.sqrt( x * x + z * z ) > CAMERA_RADIUS && dot < 0 ) {
				
				wantedCamera.position.subSelf( movement );
		
			}
			
		}
		



		// position intertia

		camera.position.x += ( wantedCamera.position.x - camera.position.x ) * CAMERA_INERTIA * delta;
		camera.position.y += ( wantedCamera.position.y - camera.position.y ) * CAMERA_INERTIA * delta;
		camera.position.z += ( wantedCamera.position.z - camera.position.z ) * CAMERA_INERTIA * delta;

		camera.target.position.x += ( wantedCameraTarget.position.x - camera.target.position.x ) * CAMERA_INERTIA * delta;
		camera.target.position.y += ( wantedCameraTarget.position.y - camera.target.position.y ) * CAMERA_INERTIA * delta;
		camera.target.position.z += ( wantedCameraTarget.position.z - camera.target.position.z ) * CAMERA_INERTIA * delta;
		
		
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
