var UgcObjectCreator = function ( shared ) {

	var that = this;

	var domElement = document.createElement( 'div' );

	var USE_POSTPROCESS = true;
	var ENABLE_LENSFLARES = true;

	var DEG2RAD = Math.PI / 180,
	camera, light1, light2, loader,
	intersects, intersectedFace, intersectedObject,
	isDeleteMode = false, isRotateMode = false,
	isMouseDown = false, radius = 1500, theta = 45, phi = 15;

	camera = new THREE.Camera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.target.position.y = 200;

	// Background

	that.scene = new THREE.Scene();

	that.scene.fog = new THREE.FogExp2( 0xffffff, 0.000135 );
	that.scene.fog.color.setHSV( 0.576,  0.382,  0.9  );

	//this.scene.fog = new THREE.Fog( 0xffffff, 1000, 10000 );
	//this.scene.fog.color.setHSV( 0.6, 0.1235, 1 );

	light1 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	light1.position.set( 0.5, 0.75, 1 );
	light1.color.setHSV( 0, 0, 1 );
	that.scene.addLight( light1 );

	light2 = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	light2.position.set( - 0.5, - 0.75, - 1 );
	light2.color.setHSV( 0, 0, 0.306 );
	that.scene.addLight( light2 );

	if ( ENABLE_LENSFLARES ) {

		that.lensFlare = null;
		that.lensFlareRotate = null;

		var flaresPosition = new THREE.Vector3( 0, 0, -7500 );
		var sx = 60, sy = 292;
		initLensFlares( that, flaresPosition, sx, sy );		

	}

	loader = new THREE.JSONLoader();
	loader.load( { model: "files/models/ugc/D_tile_1.D_tile_1.js", callback: function ( geometry ) {

		mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
		mesh.position.x = 1500;
		mesh.position.y = - 50;
		mesh.rotation.x = - 90 * Math.PI / 180;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.5;

		that.scene.addChild( mesh );

	} } );


	// Renderer

	if ( !shared.renderer ) {

		var renderer = new THREE.WebGLRenderer();
		renderer.domElement.style.position = 'absolute';
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( that.scene.fog.color );
		renderer.sortObjects = false;
		renderer.autoClear = false;

		shared.renderer = renderer;

	}

	// Postprocess

	if ( USE_POSTPROCESS ) {

		var offset = 0;

		shared.baseWidth = 1024;
		shared.baseHeight = 436;
		shared.viewportWidth = shared.baseWidth * ( window.innerWidth / shared.baseWidth );
		shared.viewportHeight = shared.baseHeight * ( window.innerWidth / shared.baseWidth );

		shared.renderer.setSize( shared.viewportWidth, shared.baseHeight );

		if ( !shared.renderTarget ) {

			var renderTarget = new THREE.WebGLRenderTarget( shared.viewportWidth, shared.baseHeight );
			renderTarget.minFilter = THREE.LinearFilter;
			renderTarget.magFilter = THREE.LinearFilter;

			shared.renderTarget = renderTarget;

		}

		var paintEffectDunes = new PaintEffectDunes( shared );
		paintEffectDunes.init();

	}	

	// Painter

	var painter = new VoxelPainter( camera );

	// TODO: Temp implementation

	var ugcHandler = new UgcHandler();

	shared.ugcSignals.submit.add( function () {

		var data = '', grid = painter.getGrid();

		for ( var item in grid ) {

			data += grid[ item ].position.x + ',' + grid[ item ].position.y + ',' + grid[ item ].position.z + ',16777215,';

		}

		data = '[' + data.slice( 0, - 1 ) + ']';

		var thumbnail = renderer.domElement.toDataURL('image/png');

		ugcHandler.submitUGO( 'this is a test', 'test@tes.com', 1, data, thumbnail, function ( json ) {

			console.log( json );

		} );

	} );

	function onMouseDown( event ) {

		painter.setMode( !isDeleteMode ? VoxelPainter.MODE_DRAW : VoxelPainter.MODE_ERASE );

	}

	function onMouseUp( event ) {

		painter.setMode( VoxelPainter.MODE_IDLE );

	}

	function onMouseMove( event ) {

		if ( USE_POSTPROCESS ) {

			painter.moveMouse( shared.mouse.x / shared.viewportWidth, ( shared.mouse.y - offset ) / shared.viewportHeight );

		} else {

			painter.moveMouse( shared.mouse.x / shared.screenWidth, shared.mouse.y / shared.screenHeight );

		}

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

	//

	this.getDomElement = function () {

		return domElement;

	};

	this.show = function () {

		shared.signals.mousedown.add( onMouseDown );
		shared.signals.mouseup.add( onMouseUp );
		shared.signals.mousemoved.add( onMouseMove );
		shared.signals.mousewheel.add( onMouseWheel );

		shared.signals.keydown.add( onKeyDown );
		shared.signals.keyup.add( onKeyUp );

		domElement.appendChild( shared.renderer.domElement );
		shared.renderer.setClearColor( that.scene.fog.color );

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

		if ( USE_POSTPROCESS ) {

			camera.aspect = shared.viewportWidth / shared.viewportHeight;
			camera.updateProjectionMatrix();

			shared.viewportWidth = shared.baseWidth * ( width / shared.baseWidth );
			shared.viewportHeight = shared.baseHeight * ( width / shared.baseWidth );

			shared.renderer.setSize( shared.viewportWidth, shared.viewportHeight );

			// TODO: Hacky...

			shared.renderTarget.width = shared.viewportWidth;
			shared.renderTarget.height = shared.viewportHeight;
			delete shared.renderTarget.__webglFramebuffer;

			offset = ( ( height - shared.viewportHeight  ) / 2 );

			shared.renderer.domElement.style.left = '0px';
			shared.renderer.domElement.style.top = offset + 'px';

		} else {

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			shared.renderer.setSize( width, height );

		}

	};

	this.update = function () {

		if ( isRotateMode ) {

			theta += ( shared.mouse.x / shared.screenWidth ) * 2 - 1;

			phi -= ( shared.mouse.y / shared.screenHeight ) * 2 - 1;
			phi = phi > 90 ? 90 :
						phi < - 90 ? - 90 :
						phi;

		}

		camera.position.x = radius * Math.sin( theta * DEG2RAD ) * Math.cos( phi * DEG2RAD );
		camera.position.y = radius * Math.sin( phi * DEG2RAD );
		camera.position.z = radius * Math.cos( theta * DEG2RAD ) * Math.cos( phi * DEG2RAD );

		painter.update();

		shared.renderer.clear();

		if ( USE_POSTPROCESS ) {

			shared.renderer.render( that.scene, camera, shared.renderTarget, true );
			shared.renderer.render( painter.getScene(), camera, shared.renderTarget );
			paintEffectDunes.update( 0, 0, 0 );

		} else {

			shared.renderer.render( that.scene, camera );
			shared.renderer.render( painter.getScene(), camera );

		}

	};

};
