var Dunes = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, 
	renderTarget = shared.renderTarget;
	
	var delta, deltaSec, currentTime, oldTime = -1;

	var speedStart = 150,
		speedEnd = 300;

	var frontCube;

	var startRoll = Math.PI, deltaRoll = 0, rollAngle = Math.PI, rollSpeed = Math.PI,
		startSpeed, targetSpeed = speedStart, deltaSpeed = 0, speedInside = -90, speedOutside = 90;

	// debug

	var colorHighlight = new THREE.Color( 0xffaa00 );
	var colorNormal = new THREE.Color( 0x666666 );

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
	
	this.init = function () {

		/*
		var autoCameraPars = {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			movementSpeed: speedStart, lookSpeed: 0.1, noFly: false, lookVertical: true,
			constrainVertical: true, verticalMin: 1.0, verticalMax: 2.1,
			autoForward: true, 
			heightSpeed: true, heightMin: 150, heightMax: 5000, heightCoef: 0.1

		};
		
		var testCameraPars = {

			fov: 50, aspect: shared.viewportWidth / shared.viewportHeight, near: 1, far: 100000,
			movementSpeed: speedStart, lookSpeed: 0.1, noFly: false, lookVertical: true,
			constrainVertical: true, verticalMin: 0, verticalMax: 3,
			autoForward: false

		};
		
		//camera = new THREE.QuakeCamera( autoCameraPars );
		//camera = new THREE.QuakeCamera( testCameraPars );
		//camera.lon = 90;
		*/
		
		camera = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
		camera.movementSpeed = speedStart;
		camera.lookSpeed = 3;
		camera.constrainVertical = [ -0.4, 0.4 ];
		camera.autoForward = true;
		//camera.mouseLook = false;	
		
		world = new DunesWorld( shared );
		soup = new DunesSoup( camera, world.scene, shared );

		//frontCube = new THREE.Mesh( new THREE.Cube( 1, 1, 1 ), new THREE.MeshLambertMaterial( { color:0xff0000 } ) );
		frontCube = new THREE.Object3D();
		frontCube.position.set( 0, 0, -10 );
		frontCube.scale.set( 1, 1, 1 );
		frontCube.visible = true;
		camera.addChild( frontCube );

		// RollCamera must be added to scene

		world.scene.addChild( camera );
		
		shared.frontCube = frontCube;
		
		shared.signals.cameraFov.add( function ( value ) {

			camera.fov = value;
			camera.updateProjectionMatrix();

		} );

	};
	
	function setRollCameraPosTarget( camera, cameraPosition, targetPosition ) {

		var dirVec = new THREE.Vector3(),
			cameraGround = new THREE.Vector3(),
			targetGround = new THREE.Vector3();
		
		cameraGround.copy( cameraPosition );
		cameraGround.y = 0;
		
		targetGround.copy( targetPosition );
		targetGround.y = 0;

		dirVec.sub( cameraGround, targetGround );
		dirVec.normalize();
		
		camera.forward.copy( dirVec );
		camera.update();

	};

	this.show = function ( f ) {

		// look at prairie island

		setRollCameraPosTarget( camera, new THREE.Vector3( 0, 150, -1600 ), shared.influenceSpheres[ 0 ].center );

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {

	};

	function checkInfluenceSpheres( camera, deltaSec ) {

		var i, d, influenceSphere;
		
		var currentPosition = camera.matrixWorld.getPosition();

		// domElement.innerHTML = currentPosition.x.toFixed( 2 ) + " " + currentPosition.y.toFixed( 2 ) + " " + currentPosition.z.toFixed( 2 );
		
		for( i = 0; i < shared.influenceSpheres.length; i ++ ) {
			
			influenceSphere = shared.influenceSpheres[ i ];
			
			d = influenceSphere.center.distanceTo( currentPosition );
			
			if( d < influenceSphere.radius ) {
				
				if ( influenceSphere.mesh ) 
					influenceSphere.mesh.materials[ 0 ].color = colorHighlight;
				
				// flip sphere
				
				if ( influenceSphere.type == 0 ) {
					
					// entering
					
					if ( influenceSphere.state == 0 ) {
						
						influenceSphere.state = 1;
						
						startRoll = camera.roll;
						deltaRoll = rollAngle;
						
						deltaSpeed = speedInside;

						liftSpeed = 0;
						
						//console.log( "entered [" + influenceSphere.name + "]" );

					}
					
				// portal

				} else if ( influenceSphere.type == 1 ) {
					
					console.log( "entered portal [" + influenceSphere.name + "]" );

				}
				
			} else {
				
				if ( influenceSphere.mesh ) 
					influenceSphere.mesh.materials[ 0 ].color = colorNormal;
				
				// flip sphere
				
				if ( influenceSphere.type == 0 ) {
				
					// leaving
					
					if ( influenceSphere.state == 1 ) {
						
						influenceSphere.state = 0;
						
						startRoll = camera.roll;
						deltaRoll = rollAngle;
						
						deltaSpeed = speedOutside;
						
						//console.log( " left [" + influenceSphere.name + "]" );

					}
					
				}

			}
			
		}
		
		if ( deltaRoll > 0 ) {
			
			deltaRoll -= deltaSec * rollSpeed;
			camera.roll = startRoll + ( rollAngle - deltaRoll );
			
			camera.movementSpeed += deltaSpeed * deltaSec;

		} else {
			
			camera.roll = startRoll + rollAngle;

		}

	};
	
	this.update = function ( progress, time, start, end ) {

		currentTime = new Date().getTime();
		
		if ( oldTime == -1 ) oldTime = currentTime;
		
		delta = currentTime - oldTime;
		oldTime = currentTime;

		deltaSec = delta / 1000;

		// this throws exception in THREE.Animation.interpolateCatmullRom
		// Uncaught TypeError: Cannot read property '0' of undefined

		THREE.AnimationHandler.update( delta );

		// check if we are close to islands
		
		checkInfluenceSpheres( camera, deltaSec );
		
		
		// not too low

		camera.position.y = cap_bottom( camera.position.y, 150 );

		// not too high

		camera.position.y = cap_top( camera.position.y, 5000 );

		// not too high before lift-off

		var startLift = 0.29,
			endLift   = 0.375,
			liftSpeed = 250;

		
		if ( progress < startLift ) {

			camera.position.y = cap_top( camera.position.y, 150 );

			// small bump

			camera.position.y += Math.sin( time / 150 );

			// small roll

			// RollCamera doesn't use up vector

			//camera.up.z = Math.sin( time / 250 ) / 200;
			//camera.up.x = Math.cos( time / 250 ) / 200;

			//camera.position.x = 0;

		}

		// lift-off

		var localProgres = ( progress - startLift ) / ( endLift - startLift );

		if ( progress > startLift && progress < endLift ) {

			camera.position.y += liftSpeed * deltaSec;
			//camera.movementSpeed = speedStart + ( speedEnd - speedStart ) * localProgres;

			//world.scene.fog.color.setHSV( 0.6, 0.1235 - 0.1235 * localProgres, 1 );
			//world.scene.fog.density = 0.0004 - 0.0001 * localProgres;
			//renderer.setClearColor( world.scene.fog.color );

		}

		world.update( camera );
		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );

		shared.logger.log( "vertices: " + renderer.data.vertices );
		shared.logger.log( 'faces: ' + renderer.data.faces );

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
