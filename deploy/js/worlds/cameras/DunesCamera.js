/**
 * @author Mikael Emtinger
 */

DunesCamera = function( shared ) {
	
	// setttings
	
	var CAMERA_LOWEST_Y = 10;
	var CAMERA_LOWEST_Y_NULL_ATTENUATION = 200;
	var CAMERA_HIGHEST_Y = 4500;
	var CAMERA_FORWARD_SPEED = 25;
	var CAMERA_FORWARD_SPEED_MAX = 30;
	var CAMERA_FORWARD_SPEED_MAX_Y = 3000;
	var CAMERA_VERTICAL_FACTOR = 35;
	var CAMERA_VERTICAL_LIMIT = 200;
	var CAMERA_HORIZONTAL_FACTOR = 12;
	var CAMERA_INERTIA = 0.05;
	var CAMERA_ROLL_FACTOR = 0.4;
	var CAMERA_COLLISION_SLOWDOWN_DISTANCE = 60;
	var CAMERA_COLLISION_DISTANCE = 200;			// if this+slowdown > 280 there's a collision with a mysterious box collider
	var CAMERA_COLLISION_DISTANCE_SIDES = 40;
	var CAMERA_COLLISION_DISTANCE_DOWN = 50;
	var CAMERA_COLLISION_DISTANCE_UP = 40;
	var CAMERA_TARGET_ADJUSTMENT_FACTOR = 15;
	var CAMERA_LIFT_SPEED = 7.5;
	var CAMERA_STATIC_END = 0.03;
	var CAMERA_START_LIFT = 0.39;
	var CAMERA_END_LIFT = 0.475;
	var CAMERA_DOWN_COLLISION_OFFSET = 100;


	// variables

	var ray = new THREE.Ray();
	var wantedCamera;
	var wantedCameraTarget;
	var wantedCameraDirection = new THREE.Vector3();
	var wantedCameraSpeedFactor = { forward: 1, left: 1, right: 1, up: 1, down: 1 };
	var cameraSpeedFactor = 0;
	var cameraCollisionSwitcher = 0;
	var world;
	var camera;
	
	
	// construct

	world = shared.worlds.dunes;
	camera = new THREE.Camera( 50, shared.viewportWidth / shared.viewportHeight, 20, 100000 );

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

    	window.wantedCamera = wantedCamera;
    	window.camera = camera;

		CAMERA_LOWEST_Y = 10;

    	wantedCamera.position.set( 0, 350, 600 );
		wantedCamera.up.set( 0, 1, 0 );

		wantedCameraTarget.position.set( 0, 150, -300 );
		wantedCameraTarget.position.subSelf( wantedCamera.position ).normalize().multiplyScalar( CAMERA_COLLISION_DISTANCE ).addSelf( wantedCamera.position );


		camera.position.copy( wantedCamera.position );
		camera.up.set( 0, 1, 0 );
		camera.target.position.copy( wantedCameraTarget.position );
		
	}
	
	
	//--- update camera ---
	
	var tempDelta = 1;
	
	that.updateCamera = function( progress, delta, time ) {
		
		delta = ( delta > 30 || delta < 5 ) ? 1 : delta / 30;

		
		// get mouse
		
		var mouseX = shared.mouse.x / shared.screenWidth - 0.5;
		var mouseY = shared.mouse.y / shared.screenHeight - 0.5;


		// different updates dependent on time

		if( progress < CAMERA_STATIC_END ) {
			
			// handle sun rise
			// glue to ground

			ray.origin.copy( wantedCamera.matrixWorld.getPosition()).y += CAMERA_DOWN_COLLISION_OFFSET;
			ray.direction.set( 0, -1, 0 );

			var c = world.scene.collisions.rayCastNearest( ray );
			var recalculatedDistance = -1;
	
			if( c && c.distance !== -1 ) {
				
				recalculatedDistance = c.distance * 0.1;
				wantedCamera.position.y = ray.origin.y - recalculatedDistance + CAMERA_LOWEST_Y * 0.5;
				
			}
			
			
			// handle left/right		
	
			wantedCameraTarget.position.x = wantedCamera.position.x + CAMERA_HORIZONTAL_FACTOR * mouseX;
			wantedCameraTarget.position.x = Math.min( 300, Math.max( -300, wantedCameraTarget.position.x ));
			wantedCameraTarget.position.z = wantedCamera.position.z - CAMERA_COLLISION_DISTANCE;

			// set values

			camera.position.y = camera.target.position.y = wantedCameraTarget.position.y = wantedCamera.position.y;

			camera.target.position.x += ( wantedCameraTarget.position.x - camera.target.position.x ) * 0.35;
			camera.target.position.z += ( wantedCameraTarget.position.z - camera.target.position.z ) * 0.35;

						
		} else if( progress < CAMERA_START_LIFT ) {

			// handle walk
			// glue to ground

			ray.origin.copy( wantedCamera.matrixWorld.getPosition()).y += CAMERA_DOWN_COLLISION_OFFSET;
			ray.direction.set( 0, -1, 0 );

			var c = world.scene.collisions.rayCastNearest( ray );
			var recalculatedDistance = -1;
	
			if( c && c.distance !== -1 ) {
				
				recalculatedDistance = c.distance * 0.1;
				wantedCamera.position.y = ray.origin.y - recalculatedDistance + CAMERA_LOWEST_Y;
			}
			
			// handle up/down (cap lowest, highest)
	
			var wantedYMovement = -mouseY * CAMERA_VERTICAL_FACTOR;
	
			if( wantedCameraTarget.position.y + wantedYMovement - wantedCamera.position.y <= CAMERA_VERTICAL_LIMIT * 0.5 ) {
				
				wantedCameraTarget.position.y += wantedYMovement;
				
			} 

			wantedCameraTarget.position.y = Math.max( wantedCameraTarget.position.y, wantedCamera.position.y );
			wantedCameraTarget.position.y = Math.min( wantedCameraTarget.position.y, wantedCamera.position.y + CAMERA_VERTICAL_LIMIT * 0.5 );
	
	
			// handle left/right		

			wantedCameraDirection.sub( wantedCameraTarget.position, wantedCamera.position ).normalize();
	
			wantedCameraTarget.position.x = wantedCamera.position.x + wantedCameraDirection.x * CAMERA_COLLISION_DISTANCE - wantedCameraDirection.z * CAMERA_HORIZONTAL_FACTOR * mouseX * 0.5;
			wantedCameraTarget.position.z = wantedCamera.position.z + wantedCameraDirection.z * CAMERA_COLLISION_DISTANCE + wantedCameraDirection.x * CAMERA_HORIZONTAL_FACTOR * mouseX * 0.5;



			// move forward

			var localProgress = Math.sin( 0.5 * Math.PI * ( progress - CAMERA_STATIC_END ) / ( CAMERA_START_LIFT - CAMERA_STATIC_END ));
				
			cameraSpeed = CAMERA_FORWARD_SPEED * 0.2 * localProgress * delta;
			wantedCameraDirection.multiplyScalar( cameraSpeed );

			wantedCamera.position.x += wantedCameraDirection.x;
			wantedCamera.position.y += Math.sin(( wantedCamera.position.x + wantedCamera.position.z ) * 0.1 ) * 5.0 * ( 1.5 - localProgress );
			wantedCamera.position.z += wantedCameraDirection.z;


			// position intertia
	
			camera.position.x += ( wantedCamera.position.x - camera.position.x ) * CAMERA_INERTIA * 2;
			camera.position.y += ( wantedCamera.position.y - camera.position.y ) * CAMERA_INERTIA * 2;
			camera.position.z += ( wantedCamera.position.z - camera.position.z ) * CAMERA_INERTIA * 2;
	
			camera.target.position.x += ( wantedCameraTarget.position.x - camera.target.position.x ) * CAMERA_INERTIA * 2;
			camera.target.position.y += ( wantedCameraTarget.position.y - camera.target.position.y ) * CAMERA_INERTIA * 2;
			camera.target.position.z += ( wantedCameraTarget.position.z - camera.target.position.z ) * CAMERA_INERTIA * 2;


		} else {
			
			// handle free flight			
			// check collision round-robin (can't afford to do all every frame)
	
			var minDistance, beginSlowDownDistance, direction;
	
			switch( cameraCollisionSwitcher ) {
				
				case 0:	
					
					direction = "forward";
					ray.origin.copy( wantedCamera.matrixWorld.getPosition());
					ray.direction.copy( camera.matrixWorld.getColumnZ().negate());
					
					minDistance = CAMERA_COLLISION_DISTANCE;
					beginSlowDownDistance = CAMERA_COLLISION_SLOWDOWN_DISTANCE;
					break;
				
				case 1:
					
					direction = "left";
					ray.origin.copy( wantedCamera.matrixWorld.getPosition());
					ray.direction.copy( camera.matrixWorld.getColumnX().negate());
					
					minDistance = CAMERA_COLLISION_DISTANCE_SIDES;
					beginSlowDownDistance = CAMERA_COLLISION_SLOWDOWN_DISTANCE;
					break;
				
				case 2:	
					
					direction = "right";
					ray.origin.copy( wantedCamera.matrixWorld.getPosition());
					ray.direction.copy( camera.matrixWorld.getColumnX());
					
					minDistance = CAMERA_COLLISION_DISTANCE_SIDES;
					beginSlowDownDistance = CAMERA_COLLISION_SLOWDOWN_DISTANCE;
					break;
				
				case 3:	
					
					direction = "down";
					ray.origin.copy( wantedCamera.matrixWorld.getPosition()).y += CAMERA_DOWN_COLLISION_OFFSET;
					ray.direction.copy( camera.matrixWorld.getColumnY().negate());
					
					minDistance = CAMERA_COLLISION_DISTANCE_DOWN;
					beginSlowDownDistance = CAMERA_COLLISION_SLOWDOWN_DISTANCE;
					break;
				
				case 4:
					
					direction = "up";
					ray.origin.copy( wantedCamera.matrixWorld.getPosition());
					ray.direction.copy( camera.matrixWorld.getColumnY());
	
					minDistance = CAMERA_COLLISION_DISTANCE_UP;
					beginSlowDownDistance = CAMERA_COLLISION_SLOWDOWN_DISTANCE;
					break;
				
			}
	
	
			cameraCollisionSwitcher++;
			
			if( cameraCollisionSwitcher > 4 ) {
				
				cameraCollisionSwitcher = 0;
				
			}
	
	
			// raycast and modulate camera speed factor
	
			wantedCameraSpeedFactor[ direction ] = 1;
	
	
			var c = world.scene.collisions.rayCastNearest( ray );
			var recalculatedDistance = NaN;
	
			if( c && c.distance !== -1 ) {
				
				recalculatedDistance = c.distance * 0.1;
				
				if( direction !== "down" ) {
					
					if( recalculatedDistance < minDistance + beginSlowDownDistance ) {
						
						if( recalculatedDistance < minDistance ) {
							
							wantedCameraSpeedFactor[ direction ] = 0;
							
						} else {
							
							wantedCameraSpeedFactor[ direction ] = 1 - ( recalculatedDistance - minDistance ) / beginSlowDownDistance;
							
						}
						
					}
					
				}
	
			}
	
	
	
			// special case if collision isn't forward (adjust target and bump up factor so you don't stop)
	
			if( direction !== "forward" && wantedCameraSpeedFactor[ direction ] < 1 ) {
				
				var adjust = new THREE.Vector3();
				adjust.copy( ray.direction ).negate().multiplyScalar(( 1 - wantedCameraSpeedFactor[ direction ] ) * CAMERA_TARGET_ADJUSTMENT_FACTOR );
				
				if( direction === "left" || direction === "right" ) {
					
					adjust.y = 0;
					
				} else {
					
					adjust.x = 0;
					adjust.z = 0;
					
				}
				
				wantedCameraTarget.position.addSelf( adjust );
				wantedCameraSpeedFactor[ direction ] = Math.max( wantedCameraSpeedFactor[ direction ], 0.3 );
	
				mouseX *= 0.1;
				mouseY *= 0.1;
			}
	
	
			// special case if collision is with ground (no speed attenuation)
	
			if( direction === "down" && !isNaN( recalculatedDistance ) && recalculatedDistance < CAMERA_COLLISION_DISTANCE_DOWN ) {
				
				var oldY = wantedCamera.position.y;
				
				wantedCamera.position.y = ray.origin.addSelf( ray.direction.multiplyScalar( recalculatedDistance )).y + CAMERA_LOWEST_Y;
				wantedCameraTarget.position.y += ( wantedCamera.position.y - oldY );
				
			} else if( !isNaN( recalculatedDistance ) && ray.origin.addSelf( ray.direction.multiplyScalar( recalculatedDistance )).y < CAMERA_LOWEST_Y_NULL_ATTENUATION ) {
				
				wantedCameraSpeedFactor[ direction ] = 1;
				
			} 
				
	
			// calculate sum of all factors 
	
			var cameraSpeedFactor = wantedCameraSpeedFactor.forward *
								    wantedCameraSpeedFactor.up *
									wantedCameraSpeedFactor.down *
									wantedCameraSpeedFactor.right *
									wantedCameraSpeedFactor.left;
	
	
	
			// handle up/down (cap lowest, highest)

			var wantedYMovement = -mouseY * CAMERA_VERTICAL_FACTOR;
	
			if( Math.abs(( wantedCameraTarget.position.y + wantedYMovement ) - wantedCamera.position.y ) <= CAMERA_VERTICAL_LIMIT ) {
				
				wantedCameraTarget.position.y += wantedYMovement;
				
			} else {
				
				if( wantedCameraTarget.position.y > wantedCamera.position.y ) wantedCameraTarget.position.y = wantedCamera.position.y + CAMERA_VERTICAL_LIMIT;
				if( wantedCameraTarget.position.y < wantedCamera.position.y ) wantedCameraTarget.position.y = wantedCamera.position.y - CAMERA_VERTICAL_LIMIT;
				
			}
	
			wantedCameraTarget.position.y = Math.max( wantedCameraTarget.position.y, CAMERA_LOWEST_Y );
			wantedCameraTarget.position.y = Math.min( wantedCameraTarget.position.y, CAMERA_HIGHEST_Y );
	
	
			// handle left/right		
	
			wantedCameraDirection.sub( wantedCameraTarget.position, wantedCamera.position ).normalize();
	
			wantedCameraTarget.position.x = wantedCamera.position.x + wantedCameraDirection.x * CAMERA_COLLISION_DISTANCE - wantedCameraDirection.z * CAMERA_HORIZONTAL_FACTOR * mouseX * delta;
			wantedCameraTarget.position.z = wantedCamera.position.z + wantedCameraDirection.z * CAMERA_COLLISION_DISTANCE + wantedCameraDirection.x * CAMERA_HORIZONTAL_FACTOR * mouseX * delta;
	
	
	
			// calc camera speed (dependent on hight)

			cameraSpeed = CAMERA_FORWARD_SPEED;
			
			if( !shared.cameraSlowDown )  {
				
				var cameraHightFactor = ( Math.min( Math.max( wantedCamera.position.y, CAMERA_LOWEST_Y ), CAMERA_FORWARD_SPEED_MAX_Y ) - CAMERA_LOWEST_Y ) / ( CAMERA_FORWARD_SPEED_MAX_Y - CAMERA_LOWEST_Y );
				cameraSpeed += ( CAMERA_FORWARD_SPEED_MAX - CAMERA_FORWARD_SPEED ) * cameraHightFactor;
				
			}
			
	
			// move forward
	
			wantedCamera.position.addSelf( wantedCameraDirection.multiplyScalar( cameraSpeed * cameraSpeedFactor * delta ));
	
	
			// lift off
	
			if( progress < CAMERA_END_LIFT ) {
	
				wantedCamera.position.y += CAMERA_LIFT_SPEED * delta;
				wantedCameraTarget.position.y += CAMERA_LIFT_SPEED * 0.9 * delta;
		
			}


			// adjust lowest y

			CAMERA_LOWEST_Y += ( 75 - CAMERA_LOWEST_Y ) * 0.25;
	
	
			// cap height
	
			wantedCamera.position.y = Math.max( wantedCamera.position.y, CAMERA_LOWEST_Y );
			wantedCamera.position.y = Math.min( wantedCamera.position.y, CAMERA_HIGHEST_Y );
	
	
			// position intertia
	
			camera.position.x += ( wantedCamera.position.x - camera.position.x ) * CAMERA_INERTIA;
			camera.position.y += ( wantedCamera.position.y - camera.position.y ) * CAMERA_INERTIA;
			camera.position.z += ( wantedCamera.position.z - camera.position.z ) * CAMERA_INERTIA;
	
			camera.target.position.x += ( wantedCameraTarget.position.x - camera.target.position.x ) * CAMERA_INERTIA;
			camera.target.position.y += ( wantedCameraTarget.position.y - camera.target.position.y ) * CAMERA_INERTIA;
			camera.target.position.z += ( wantedCameraTarget.position.z - camera.target.position.z ) * CAMERA_INERTIA;
			
			
			// roll
			
			var currentCameraZ = camera.matrixWorld.getColumnZ();
			
			wantedCameraDirection.normalize();
			wantedCameraDirection.y = currentCameraZ.y;
			wantedCameraDirection.subSelf( currentCameraZ ).normalize();
			wantedCameraDirection.multiplyScalar( CAMERA_ROLL_FACTOR );
			
			wantedCamera.up.set( 0, 1, 0 );
			wantedCamera.up.subSelf( wantedCameraDirection ).normalize();
			
			camera.up.x += ( wantedCamera.up.x - camera.up.x ) * CAMERA_INERTIA;
			camera.up.y += ( wantedCamera.up.y - camera.up.y ) * CAMERA_INERTIA;
			camera.up.z += ( wantedCamera.up.z - camera.up.z ) * CAMERA_INERTIA;
			
			
			// fail checks (seems to happen when a lot of lag)
			
			wantedCameraDirection.sub( camera.position, camera.target.position ).y = 0;
			
			if( wantedCameraDirection.length() < 1 ) {
				
				wantedCamera.position.y = wantedCameraTarget.position.y = camera.target.position.y = camera.position.y;
				wantedCameraTarget.position.z = camera.target.position.z = -CAMERA_COLLISION_DISTANCE;

			}

		}

	};

	
	return that;
}
