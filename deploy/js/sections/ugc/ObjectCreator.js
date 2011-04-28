var ObjectCreator = function ( shared ) {

	var camera, light1, light2, scene, loader, renderer,
	intersects, intersectedFace, intersectedObject,
	isDeleteMode = false, isRotateMode = false,
	isMouseDown = false, radius = 1500, theta = 45, phi = 60;

	var collider, projector, mouse2D, mouse3D, ray;

	camera = new THREE.Camera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.target.position.z = 200;

	// Background

	scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0xffffff, 1000, 10000 );
	scene.fog.color.setHSV( 0.6, 0.1235, 1 );

	light1 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	light1.position.set( 0.5, 0.75, 1 );
	light1.color.setHSV( 0, 0, 1 );
	scene.addLight( light1 );

	light2 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	light2.position.set( - 0.5, - 0.75, - 1 );
	light2.color.setHSV( 0, 0, 0.306 );
	scene.addLight( light2 );

	loader = new THREE.JSONLoader();
	loader.load( { model: "files/models/ugc/D_tile_1.D_tile_1.js", callback: function ( geometry ) {

		mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.position.x = 1500;
		mesh.position.y = - 50;
		mesh.rotation.x = - 90 * Math.PI / 180;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.5;
		scene.addChild( mesh );

	} } );

	// Voxel

	projector = new THREE.Projector();

	mouse2D = new THREE.Vector3( 0, 0, 0.5 );
	ray = new THREE.Ray( camera.position, null );

	renderer = new THREE.WebGLRenderer();
	renderer.domElement.style.position = 'absolute';
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( scene.fog.color );
	renderer.sortObjects = false;
	renderer.autoClear = false;

	function onMouseDown( event ) {


	}

	function onMouseUp( event ) {


	}

	function onMouseMove( event ) {

		mouse2D.x = ( shared.mouse.x / shared.screenWidth ) * 2 - 1;
		mouse2D.y = - ( shared.mouse.y / shared.screenHeight ) * 2 + 1;

	}

	function onMouseWheel( event ) {

		radius -= event.wheelDeltaY;

	}

	function onKeyDown( event ) {

		switch ( event.keyCode ) {

			case 16: isRotateMode = true; break;
			case 17: isDeleteMode = true; break;
			// case 18: isDeleteMode = true; break;

		}

	}

	function onKeyUp( event ) {

		switch ( event.keyCode ) {

			case 16: isRotateMode = false; break;
			case 17: isDeleteMode = false; break;
			// case 18: isDeleteMode = false; break;

		}
	}

	function draw() {

		if ( !isDeleteMode ) {

			intersects = ray.intersectScene( sceneCollider );

			if ( intersectedFace && intersects.length > 0 ) {

				var face = intersectedFace,
				point = intersects[ 0 ].point,
				centroidWorld = face.centroid.clone().addSelf( intersectedObject.position ),
				distance = centroidWorld.distanceTo( point ),
				pointInNormal = centroidWorld.addSelf( intersectedObject.matrixRotationWorld.multiplyVector3( face.normal.clone() ).multiplyScalar( distance ) );

				addVoxel( pointInNormal );

			}

		} else {

			intersects = ray.intersectScene( sceneVoxels );

			if ( intersects.length > 0 && intersects[ 0 ].object != ground ) {

				removeVoxel( intersects[ 0 ].object );

			}

		}

	}

	//

	this.getDomElement = function () {

		return renderer.domElement;

	};

	this.show = function () {

		shared.signals.mousedown.add( onMouseDown );
		shared.signals.mouseup.add( onMouseUp );
		shared.signals.mousemoved.add( onMouseMove );
		shared.signals.mousewheel.add( onMouseWheel );

		shared.signals.keydown.add( onKeyDown );
		shared.signals.keyup.add( onKeyUp );

	};

	this.hide = function () {

		shared.signals.mousedown.remove( onMouseDown );
		shared.signals.mouseup.remove( onMouseUp );
		shared.signals.mousemoved.remove( onMouseMove );
		shared.signals.mousewheel.remove( onMouseWheel );

		shared.signals.keydown.remove( onKeyDown );
		shared.signals.keyup.remove( onKeyUp );

	};

	this.resize = function ( width, height ) {

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );

	};

	this.update = function () {

		if ( isRotateMode ) {

			theta += mouse2D.x * 5;

			phi += mouse2D.y * 5;
			phi = phi > 180 ? 180 :
			      phi < - 180 ? - 180 :
			      phi;

		}

		camera.position.x = radius * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.position.y = radius * Math.sin( phi * Math.PI / 360 );
		camera.position.z = radius * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

		renderer.clear();
		renderer.render( scene, camera );

	};

};
