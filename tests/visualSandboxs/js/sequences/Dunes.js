var Dunes = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, 
	renderTarget = shared.renderTarget;

	var ray = new THREE.Ray();
	ray.origin.y = 100;
	ray.direction = new THREE.Vector3( 0, -1, 0 );
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

		shared.worlds.dunes = world;
		shared.sequences.dunes = this;

		//frontCube = new THREE.Mesh( new THREE.Cube( 1, 1, 1 ), new THREE.MeshLambertMaterial( { color:0xff0000 } ) );
		frontCube = new THREE.Object3D();
		frontCube.position.set( 0, 0, -5 );
		frontCube.scale.set( 1, 1, 1 );
		frontCube.visible = true;
		camera.addChild( frontCube );

		// RollCamera must be added to scene

		world.scene.addChild( camera );

		shared.frontCube = frontCube;

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

	this.show = function ( progress ) {

		this.resetCamera();

		shared.started.dunes = true;

	};

	this.hide = function () {

	};

	this.resetCamera = function() {

		// look at prairie island
		
		setRollCameraPosTarget( camera, new THREE.Vector3( 0, 150, -1600 ), shared.influenceSpheres[ 0 ].center );
		renderer.setClearColor( world.scene.fog.color );

	};
	

	this.update = function ( progress, delta, time ) {

		THREE.AnimationHandler.update( delta );








		world.update( delta, camera, false );
		soup.update( delta );

		renderer.render( world.scene, camera, renderTarget );


		//////////// OLD ///////////////
/*
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
