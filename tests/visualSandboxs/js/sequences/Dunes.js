var Dunes = function ( shared ) {

	SequencerItem.call( this );

	var camera, world, soup,
	renderer = shared.renderer, 
	renderTarget = shared.renderTarget;

	var ray = new THREE.Ray();
	ray.origin.y = 100;
	ray.direction = new THREE.Vector3( 0, -1, 0 );
	var positionVector = new THREE.Vector3();

	var speedStart = 150, speedEnd = 300;

	var frontCube;

	// debug
/*
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
*/
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

//		camera = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
//		camera = new THREE.RollCamera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
		camera = new THREE.Camera( 50, shared.viewportWidth / shared.viewportHeight, 1, 100000 );
		camera.useTarget = false;

		world = new DunesWorld( shared );
		soup = new DunesSoup( camera, world.scene, shared );

		shared.worlds.dunes = world;

		//frontCube = new THREE.Mesh( new THREE.Cube( 1, 1, 1 ), new THREE.MeshLambertMaterial( { color:0xff0000 } ) );
		frontCube = new THREE.Object3D();
		frontCube.position.set( 0, 0, -5 );
		frontCube.scale.set( 1, 1, 1 );
		frontCube.visible = true;
		camera.addChild( frontCube );

		// RollCamera must be added to scene

		//world.scene.addChild( camera );

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

	//	camera.forward.copy( dirVec );
		camera.update();

	};

	this.show = function ( progress ) {

		// look at prairie island

		//setRollCameraPosTarget( camera, new THREE.Vector3( 0, 150, -1600 ), shared.influenceSpheres[ 0 ].center );

		renderer.setClearColor( world.scene.fog.color );

		shared.started.dunes = true;

	};

	this.hide = function () {

	};


	this.update = function ( progress, delta, time ) {

		if( delta !== 0 ) {
			
			THREE.AnimationHandler.update( delta );
	
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
	
					if (positionVector.y > 0 && camera.position.y < positionVector.y) {
						camera.position.y = positionVector.y;
					}
				}
	
			}
	
			// not too high
	
			camera.position.y = cap_top( camera.position.y, 5000 );
	
			camera.rotation.x = -( shared.mouse.y / shared.screenWidth - 0.5 ) * Math.PI * 0.5;
			camera.rotation.y = -( shared.mouse.x / shared.screenHeight - 0.5 ) * Math.PI * 0.5;
	
			if( shared.forward ) {
				
				camera.position.subSelf( camera.matrixWorld.getColumnZ().multiplyScalar( 20 ));
				
			}
	
			world.update( delta, camera, false );
			soup.update( delta );
			
		}


		renderer.render( world.scene, camera, renderTarget );
/*
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
