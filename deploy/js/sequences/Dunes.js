var Dunes = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup
	renderer = shared.renderer, renderTarget = shared.renderTarget;
	var delta, deltaSec, time, oldTime;

	var speedStart = 200.0,
		speedEnd = 400.0;

	var frontCube;
	
	var colorHighlight = new THREE.Color( 0xffaa00 );
	var colorNormal = new THREE.Color( 0x666666 );

	var startRoll = Math.PI, deltaRoll = 0, rollAngle = Math.PI, rollSpeed = Math.PI,
		startSpeed, targetSpeed = speedStart, deltaSpeed = 0, speedInside = -150, speedOutside = 150;

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

		
		camera = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
		camera.movementSpeed = 300;
		camera.lookSpeed = 3;
		camera.autoForward = true;
		
		world = new DunesWorld( shared );
		soup = new DunesSoup( camera, world.scene, shared );


		//frontCube = new THREE.Mesh( new THREE.Cube( 1, 1, 1 ), new THREE.MeshLambertMaterial( { color:0xff0000 } ) );
		frontCube = new THREE.Object3D();
		frontCube.position.set( 0, 0, -10 );
		frontCube.scale.set( 1, 1, 1 );
		frontCube.visible = true;
		camera.addChild( frontCube );

		world.scene.addChild( camera );
		
		shared.frontCube = frontCube;
		
		shared.signals.cameraFov.add( function ( value ) {

			camera.fov = value;
			camera.updateProjectionMatrix();

		} );

	};

	this.show = function ( f ) {

		oldTime = new Date().getTime();

		camera.position.x = 0;
		camera.position.y = 150;
		camera.position.z = -1600;

		renderer.setClearColor( world.scene.fog.color );

	};

	this.hide = function () {

	};

	this.update = function ( progress, time, start, end ) {

		time = new Date().getTime();
		delta = time - oldTime;
		oldTime = time;

		deltaSec = delta / 1000;

		var current = camera.matrixWorld.getPosition();

		domElement.innerHTML = current.x.toFixed( 2 ) + " " + current.y.toFixed( 2 ) + " " + current.z.toFixed( 2 );

		THREE.AnimationHandler.update( delta );

		// check if we are close to islands

		var i, d, influenceSphere;
		
		for( i = 0; i < shared.influenceSpheres.length; i ++ ) {
			
			influenceSphere = shared.influenceSpheres[ i ];
			
			d = influenceSphere.center.distanceTo( current );
			
			if( d < influenceSphere.radius ) {
				
				if ( influenceSphere.mesh ) 
					influenceSphere.mesh.materials[ 0 ].color = colorHighlight;
				
				// entering
				
				if ( influenceSphere.state == 0 ) {
					
					influenceSphere.state = 1;
					
					startRoll = camera.roll;
					deltaRoll = rollAngle;
					
					deltaSpeed = speedInside;

					liftSpeed = 0;
					
					//console.log( "entered [" + influenceSphere.name + "]" );

				}
				
			} else {
				
				if ( influenceSphere.mesh ) 
					influenceSphere.mesh.materials[ 0 ].color = colorNormal;
				
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
		
		if ( deltaRoll > 0 ) {
			
			deltaRoll -= deltaSec * rollSpeed;
			camera.roll = startRoll + ( rollAngle - deltaRoll );
			
			camera.movementSpeed += deltaSpeed * deltaSec;

		} else {
			
			camera.roll = startRoll + rollAngle;

		}
		
		// not too low

		camera.position.y = cap_bottom( camera.position.y, 150 );

		// not too high

		camera.position.y = cap_top( camera.position.y, 5000 );

		// not too high before lift-off

		var startLift = 0.29,
			endLift   = 0.35,
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
