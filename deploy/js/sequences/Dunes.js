var Dunes = function ( shared ) {

	var that = this;

	SequencerItem.call( this );

	// signals
	
	shared.signals.initscenes.add( initScene );

	// public variables
	
	this.CAMERA_LOWEST_Y = 220;
	this.CAMERA_HIGHEST_Y = 7000;
	this.CAMERA_FORWARD_SPEED = 10;
	this.CAMERA_FORWARD_SPEED_MAX = 15;
	this.CAMERA_FORWARD_SPEED_MAX_Y = 1000;
	this.CAMERA_VERTICAL_FACTOR = 15;
	this.CAMERA_VERTICAL_LIMIT = 75;
	this.CAMERA_HORIZONTAL_FACTOR = 15;
	this.CAMERA_INERTIA = 0.02;
	this.CAMERA_ROLL_FACTOR = 0.5;
	this.CAMERA_COLLISION_SLOWDOWN_DISTANCE = 50;
	this.CAMERA_COLLISION_DISTANCE = 220;			// if this+slowdown > 280 there's a collision with a mysterious box collider
	this.CAMERA_COLLISION_DISTANCE_SIDES = 50;
	this.CAMERA_COLLISION_DISTANCE_DOWN = 50;
	this.CAMERA_COLLISION_DISTANCE_UP = 50;
	this.CAMERA_TARGET_ADJUSTMENT_FACTOR = 12;

	// private variables
	
	var wantedCamera;
	var wantedCameraTarget;
	var wantedCameraDirection = new THREE.Vector3();
	var wantedCameraSpeedFactor = { forward: 1, left: 1, right: 1, up: 1, down: 1 };
	var cameraSpeedFactor = 0;
	var cameraCollisionSwitcher = 0;

	var camera, world, soup,
	renderer = shared.renderer, 
	renderTarget = shared.renderTarget;

	var ray = new THREE.Ray();
	var positionVector = new THREE.Vector3();

	//var speedStart = 150, speedEnd = 300;
	
	// temp speed up
	var speedStart = 300, speedEnd = 600;

	var frontCube;

	// debug

	var domElement = document.createElement( 'div' );
	domElement.style.position = "absolute";
	domElement.style.right = "0px";
	domElement.style.top = "0px";
	domElement.style.background = "#000";
	domElement.style.color = "#fff";
	domElement.style.fontWeight = "bold";
	domElement.style.padding = "20px";
	domElement.style.zIndex = 500;
	domElement.style.width = "100%";
	domElement.style.textAlign = "right";
	domElement.style.display = "none";
	document.body.appendChild( domElement )

	function initScene () {
		
		console.log( "dunes initScene" );
		
		that.update( 0.0009, 49.99, 90375 );

	};

	this.init = function () {

		camera = new THREE.Camera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
		camera.target.position.set( 0, 0, -100 );

		wantedCamera = new THREE.Object3D();
		wantedCameraTarget = new THREE.Object3D();
		wantedCameraTarget.position.set( 0, 0, -100 );
		
//		var cube = new THREE.Mesh( new THREE.Cube( 10, 10, 10 ), new THREE.MeshLambertMaterial( { color: 0xff00ff } ));
//		wantedCameraTarget.addChild( cube );


		world = new DunesWorld( shared );
		//soup = new DunesSoup( camera, world.scene, shared );
		soup = new UgcSoup( camera, world.scene, shared );

		world.scene.addChild( camera );
		world.scene.addChild( camera.target );
		world.scene.addChild( wantedCamera );
		world.scene.addChild( wantedCameraTarget );

		shared.worlds.dunes = world;
		shared.sequences.dunes = this;
		
		console.log( "dunes init" );

	};


	this.show = function ( progress ) {

		this.resetCamera();

		shared.started.dunes = true;
		
		console.log( "show dunes" );

	};

	this.hide = function () {

	};

	this.resetCamera = function() {

		// look at prairie island
		
		wantedCamera.position.set( 0, 150, -1600 );
		wantedCameraTarget.position.copy( shared.influenceSpheres[ 0 ].center );
		wantedCameraTarget.position.subSelf( wantedCamera.position ).normalize().multiplyScalar( this.CAMERA_COLLISION_DISTANCE ).addSelf( wantedCamera.position );
		
		camera.position.set( 0, 150, -1600 );
		camera.target.position.copy( shared.influenceSpheres[ 0 ].center );
		
		var direction = new THREE.Vector3();
		direction.sub( wantedCamera.position, wantedCameraTarget.position );
		
		wantedCameraTarget.rotation.y = Math.atan2( direction.x, direction.z );
		
		renderer.setClearColor( world.scene.fog.color );

	};
	

	this.update = function ( progress, delta, time ) {
		
		// check collision round-robin (can't afford to do all every frame)

		var minDistance, beginSlowDownDistance, direction;

		switch( cameraCollisionSwitcher ) {
			
			case 0:	
				
				direction = "forward";
				ray.direction.copy( camera.matrixWorld.getColumnZ().negate() );
				
				minDistance = this.CAMERA_COLLISION_DISTANCE;
				beginSlowDownDistance = this.CAMERA_COLLISION_SLOWDOWN_DISTANCE;
				break;
			
			case 1:
				
				direction = "left";
				ray.direction.copy( camera.matrixWorld.getColumnX().negate());
				
				minDistance = this.CAMERA_COLLISION_DISTANCE_SIDES;
				beginSlowDownDistance = this.CAMERA_COLLISION_SLOWDOWN_DISTANCE;
				break;
			
			case 2:	
				
				direction = "right";
				ray.direction.copy( camera.matrixWorld.getColumnX());
				
				minDistance = this.CAMERA_COLLISION_DISTANCE_SIDES;
				beginSlowDownDistance = this.CAMERA_COLLISION_SLOWDOWN_DISTANCE;
				break;
			
			case 3:	
				
				direction = "down";
				ray.direction.copy( camera.matrixWorld.getColumnY().negate());
				
				minDistance = this.CAMERA_COLLISION_DISTANCE_DOWN;
				beginSlowDownDistance = this.CAMERA_COLLISION_SLOWDOWN_DISTANCE;
				break;
			
			case 4:
				
				direction = "up";
				ray.direction.copy( camera.matrixWorld.getColumnY());

				minDistance = this.CAMERA_COLLISION_DISTANCE_UP;
				beginSlowDownDistance = this.CAMERA_COLLISION_SLOWDOWN_DISTANCE;
				break;
			
		}


		cameraCollisionSwitcher++;
		
		if( cameraCollisionSwitcher > 4 ) {
			
			cameraCollisionSwitcher = 0;
			
		}


		// raycast and modulate camera speed factor

		wantedCameraSpeedFactor[ direction ] = 1;

		ray.origin.copy( wantedCamera.position );
		var c = world.scene.collisions.rayCastNearest( ray );
		var recalculatedDistance = -1;

		if( c && c.distance !== -1 ) {
			
			recalculatedDistance = c.distance * 0.1;
			
			if( recalculatedDistance < minDistance + beginSlowDownDistance ) {
				
				if( recalculatedDistance < minDistance ) {
					
					wantedCameraSpeedFactor[ direction ] = 0;
					
				} else {
					
					wantedCameraSpeedFactor[ direction ] = 1 - ( recalculatedDistance - minDistance ) / beginSlowDownDistance;
					
				}
				
			}

		}

		// get mouse
		
		var mouseX = shared.mouse.x / shared.screenWidth - 0.5;
		var mouseY = shared.mouse.y / shared.screenHeight - 0.5;


		// special case if collision isn't forward (adjust target and bump up factor so you don't stop)

		if( direction !== "forward" && wantedCameraSpeedFactor[ direction ] < 1 ) {
			
			var adjust = new THREE.Vector3();
			adjust.copy( ray.direction ).negate().multiplyScalar(( 1 - wantedCameraSpeedFactor[ direction ] ) * this.CAMERA_TARGET_ADJUSTMENT_FACTOR );
			
			if( direction === "left" || direction === "right" ) adjust.y = 0;
			else {
				
				adjust.x = 0;
				adjust.z = 0;
				
			}
			
			wantedCameraTarget.position.addSelf( adjust );
			
			wantedCameraSpeedFactor[ direction ] = Math.max( wantedCameraSpeedFactor[ direction ], 0.2 );
			mouseX = 0;
			mouseY = 0;
		}


		// special case if collision is with ground (no speed attenuation)

		if( ray.origin.addSelf( ray.direction.multiplyScalar( recalculatedDistance )).y < this.CAMERA_LOWEST_Y ) {
			
			wantedCameraSpeedFactor[ direction ] = 1;
			
		}


		// calculate sum of all factors 

		var cameraSpeedFactor = wantedCameraSpeedFactor.forward *
							    wantedCameraSpeedFactor.up *
								wantedCameraSpeedFactor.down *
								wantedCameraSpeedFactor.right *
								wantedCameraSpeedFactor.left;


		// handle up/down (cap lowest, highest)

		wantedCameraTarget.position.y -= mouseY * this.CAMERA_VERTICAL_FACTOR;
		wantedCameraTarget.position.y  = Math.max( wantedCameraTarget.position.y, this.CAMERA_LOWEST_Y );
		wantedCameraTarget.position.y  = Math.min( wantedCameraTarget.position.y, this.CAMERA_HIGHEST_Y );


		// cap target-position differance to vertical limit

		if( Math.abs( wantedCameraTarget.position.y - wantedCamera.position.y ) > this.CAMERA_VERTICAL_LIMIT ) {
			
			if( wantedCameraTarget.position.y > wantedCamera.position.y ) {
				
				wantedCameraTarget.position.y = wantedCamera.position.y + this.CAMERA_VERTICAL_LIMIT;
				
			} else {
				
				wantedCameraTarget.position.y = wantedCamera.position.y - this.CAMERA_VERTICAL_LIMIT;
				
			}
			
		}


		// handle left/right		

		wantedCameraDirection.sub( wantedCameraTarget.position, wantedCamera.position ).normalize();

		wantedCameraTarget.position.x = wantedCamera.position.x + wantedCameraDirection.x * this.CAMERA_COLLISION_DISTANCE - wantedCameraDirection.z * this.CAMERA_HORIZONTAL_FACTOR * mouseX;
		wantedCameraTarget.position.z = wantedCamera.position.z + wantedCameraDirection.z * this.CAMERA_COLLISION_DISTANCE + wantedCameraDirection.x * this.CAMERA_HORIZONTAL_FACTOR * mouseX;


		// calc camera speed (dependent on hight)
		
		var cameraSpeed = ( Math.min( Math.max( wantedCamera.position.y, this.CAMERA_LOWEST_Y ), this.CAMERA_FORWARD_SPEED_MAX_Y ) - this.CAMERA_LOWEST_Y ) / ( this.CAMERA_FORWARD_SPEED_MAX_Y - this.CAMERA_LOWEST_Y );
		cameraSpeed = this.CAMERA_FORWARD_SPEED + ( this.CAMERA_FORWARD_SPEED_MAX - this.CAMERA_FORWARD_SPEED ) * cameraSpeed;
		

		// move forward

		wantedCamera.position.addSelf( wantedCameraDirection.multiplyScalar( cameraSpeed * cameraSpeedFactor ));
		wantedCamera.position.y = Math.max( wantedCamera.position.y, this.CAMERA_LOWEST_Y );
		wantedCamera.position.y = Math.min( wantedCamera.position.y, this.CAMERA_HIGHEST_Y );


		// lift off
		
		if ( progress > world.startLift && progress < world.endLift ) {

			wantedCamera.position.y += world.liftSpeed * ( delta / 1000 );
			wantedCameraTarget.position.y += world.liftSpeed * ( delta / 2000 );
	
		}


		// intertia
		
		camera.position.x += ( wantedCamera.position.x - camera.position.x ) * this.CAMERA_INERTIA;
		camera.position.y += ( wantedCamera.position.y - camera.position.y ) * this.CAMERA_INERTIA;
		camera.position.z += ( wantedCamera.position.z - camera.position.z ) * this.CAMERA_INERTIA;

		camera.target.position.x += ( wantedCameraTarget.position.x - camera.target.position.x ) * this.CAMERA_INERTIA;
		camera.target.position.y += ( wantedCameraTarget.position.y - camera.target.position.y ) * this.CAMERA_INERTIA;
		camera.target.position.z += ( wantedCameraTarget.position.z - camera.target.position.z ) * this.CAMERA_INERTIA;

		
		// roll
		
		var currentCameraZ = camera.matrixWorld.getColumnZ();
		
		wantedCameraDirection.normalize();
		wantedCameraDirection.y = currentCameraZ.y;
		wantedCameraDirection.subSelf( currentCameraZ ).normalize();
		wantedCameraDirection.multiplyScalar( this.CAMERA_ROLL_FACTOR );
		
		wantedCamera.up.set( 0, 1, 0 );
		wantedCamera.up.subSelf( wantedCameraDirection ).normalize();
		
		camera.up.x += ( wantedCamera.up.x - camera.up.x ) * this.CAMERA_INERTIA;
		camera.up.y += ( wantedCamera.up.y - camera.up.y ) * this.CAMERA_INERTIA;
		camera.up.z += ( wantedCamera.up.z - camera.up.z ) * this.CAMERA_INERTIA;
		
		

		// update and render

		THREE.AnimationHandler.update( delta );

		world.update( delta, camera, false );
		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );


/* OLD
		// not too low

		// camera.position.y = cap_bottom( camera.position.y, 150 );

		// some sort of ground collision
		ray.origin.x = frontCube.matrixWorld.n14;
		ray.origin.y = frontCube.matrixWorld.n24 + 400;
		ray.origin.z = frontCube.matrixWorld.n34;

		if ( ray.origin.y < 1000 ) {

			var c = world.scene.collisions.rayCastNearest( ray );
			if ( c ) {

				positionVector.copy( ray.origin );
				positionVector.addSelf( ray.direction.multiplyScalar( c.distance*0.15 ) );
				positionVector.y += 50;

				if ( positionVector.y > 0 && camera.position.y < positionVector.y ) {
					camera.position.y = positionVector.y;
				}
			}

		}

		// not too high

		camera.position.y = cap_top( camera.position.y, 5000 );

		// not too high before lift-off

		if ( progress < world.startLift ) {

			camera.position.y = cap_top( camera.position.y, 150 );

			// small bump

			camera.position.y += Math.sin( time / 100 ) * 0.5;

			// small roll

			// RollCamera doesn't use up vector

			//camera.up.z = Math.sin( time / 250 ) / 200;
			//camera.up.x = Math.cos( time / 250 ) / 200;

			//camera.position.x = 0;

		}

		// lift-off

		var localProgres = ( progress - world.startLift ) / ( world.endLift - world.startLift );

		if ( progress > world.startLift && progress < world.endLift ) {

			camera.position.y += world.liftSpeed * ( delta / 1000 );
			//camera.movementSpeed = speedStart + ( speedEnd - speedStart ) * localProgres;

			//world.scene.fog.color.setHSV( 0.6, 0.1235 - 0.1235 * localProgres, 1 );
			//world.scene.fog.density = 0.0004 - 0.0001 * localProgres;
			//renderer.setClearColor( world.scene.fog.color );

		}

		world.update( delta, camera, false );
		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );

		shared.logger.log( "vertices: " + renderer.data.vertices );
		shared.logger.log( 'faces: ' + renderer.data.faces );
		shared.logger.log( 'draw calls: ' + renderer.data.drawCalls );
*/
	};

	function cap( val, bottom, top ) {

		return ( val < bottom ) ? bottom : ( val > top ? top : val );

	};

	function cap_bottom( val, bottom ) {

		return val < bottom ? bottom : val;

	};

	function cap_top( val, top ) {

		return val > top ? top : val;

	};

};

Dunes.prototype = new SequencerItem();
Dunes.prototype.constructor = Dunes;
