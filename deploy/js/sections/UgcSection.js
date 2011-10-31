var UgcSection = function ( shared ) {

	var that = this, _type;

	var intro, objectCreator/*, soupCreator*/, ui;

	var domElement = document.createElement( 'div' );

	domElement.style.display = 'none';

	var DEG2RAD = Math.PI / 180,
	light1, light2, loader,
	intersects, intersectedFace, intersectedObject,
	isRotateMode = false, isMouseDown = false, start_radius = 3000,
  max_radius = 5000,
	onMouseDownTheta, onMouseDownPhi, onMouseDownPositionX, onMouseDownPositionY,
	theta = 45, onMouseDownTheta, phi = 15, onMouseDownPhi,
	radius = start_radius, newRadius = start_radius,
	currentPainterMode;

	var camera = new THREE.Camera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
	camera.target.position.y = 20;

	// Background

	that.scene = new THREE.Scene();
	that.scene.fog = new THREE.FogExp2( 0xffffff, 0.00015 );
	that.scene.fog.color.setHSV( 0.576, 0.382, 0.9 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x442200 );
	var directionalLight1 = new THREE.DirectionalLight( 0xffeedd );
	var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );

	ambient.color.setHSV( 0, 0, 0.1 );

	directionalLight1.color.setHSV( 0.088, 0, 1 );
	directionalLight1.position.set( 0.8, 0.3, - 0.5 );
	directionalLight1.position.normalize();

	directionalLight2.color.setHSV( 0, 0, 0.564 );
	directionalLight2.position.set( 0.1, 0.5, 0.2 );
	directionalLight2.position.normalize();

	that.scene.addLight( ambient );
	that.scene.addLight( directionalLight1 );
	that.scene.addLight( directionalLight2 );

	var flares = initLensFlares( new THREE.Vector3( 0, 0, - 7500 ), 60, 292 );
	that.scene.addChild( flares );

	var environment = new THREE.Object3D();
	that.scene.addChild( environment );

	var loader = new THREE.SceneLoaderAjax();
	loader.load( "/files/models/dunes/D_tile_1.js", function ( result ) {

		for ( var i = 0, l = result.scene.objects.length; i < l; i ++ ) {

			var object = result.scene.objects[ i ];

			if ( object.visible ) {

				object.rotation.x = - 90 * Math.PI / 180;
				object.position.y = - 100;
				object.position.x = 1000;
				object.scale.x = object.scale.y = object.scale.z = 0.75;
				environment.addChild( object );

			}

		}

		// Clouds

		that.clouds = new THREE.Object3D();
		environment.addChild( that.clouds );

		var geometry = new THREE.Plane( 1000, 1000 );

		for ( var i = 0; i < 100; i ++ ) {

			var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff, opacity: 0.5, blending: THREE.AdditiveBlending } ) );
			mesh.position.x = Math.random() - 0.5;
			mesh.position.y = Math.random();
			mesh.position.z = Math.random() - 0.5;
			mesh.position.normalize();

			mesh.position.x = mesh.position.x * ( Math.random() * 5000 + 2500 ) * 3;
			mesh.position.y = mesh.position.y * ( Math.random() * 2500 + 5000 ) - 2800;
			mesh.position.z = mesh.position.z * ( Math.random() * 5000 + 2500 ) * 3;

			mesh.rotation.x = - 90 * Math.PI / 180;
			mesh.scale.x = Math.random() * 2 + 1;
			mesh.scale.y = Math.random() * 2 + 1;
			mesh.doubleSided = true;

			that.clouds.addChild( mesh );

		}

	} );

	// Grid

	var grid = new THREE.Mesh( new THREE.Plane( 4050, 4050, 81, 81 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.1, transparent: true, wireframe: true } ) );
	grid.position.y = - 25;
	grid.rotation.x = - 90 * Math.PI / 180;
	environment.addChild( grid );

	// Renderer

	var renderer = new THREE.WebGLRenderer( { stencil: false } );
	renderer.domElement.style.position = 'absolute';
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( that.scene.fog.color );
	renderer.sortObjects = false;
	renderer.autoClear = false;
	domElement.appendChild( renderer.domElement );

	function zoom( amount ) {

		newRadius += amount;
		newRadius = newRadius < 100 ? 100 : newRadius > 5000 ? 5000 : newRadius;

	}

	function onMouseDown( event ) {

		if ( event.button == 2 ) {

			isRotateMode = true;
			currentPainterMode = objectCreator.getPainter().getMode();
			objectCreator.getPainter().setMode( VoxelPainter.MODE_IDLE );

		}

		isMouseDown = true;

		if ( isRotateMode ) {

			onMouseDownTheta = theta;
			onMouseDownPhi = phi;
			onMouseDownPositionX = event.clientX;
			onMouseDownPositionY = event.clientY;

		}

	}

	function onMouseUp( event ) {

		if ( event.button == 2 ) {

			isRotateMode = false;
			objectCreator.getPainter().setMode( currentPainterMode );

		}

		isMouseDown = false;

	}

	function onMouseMove( event ) {

		if ( isRotateMode && isMouseDown ) {

			theta = onMouseDownTheta - ( ( event.clientX - onMouseDownPositionX ) * 0.1 );
			phi = onMouseDownPhi + ( ( event.clientY - onMouseDownPositionY ) * 0.1 );

			switch( _type ) {

				case 0: phi = phi > 90 ? 90 : phi < 0 ? 0 : phi; break;
				case 1: phi = phi > 90 ? 90 : phi < - 90 ? - 90 : phi; break;

			}

		}

	}

	function onMouseWheel( event ) {

		zoom( - event.wheelDeltaY * 0.5 );

	}

	function onContextMenu ( event ) {

		event.preventDefault();

	}

	this.getDomElement = function () {

		return domElement;

	};

	this.load = function () {

		var Signal = signals.Signal;

		shared.ugcSignals = {};
		shared.ugcSignals.showintro = new Signal();
		shared.ugcSignals.showobjectcreator = new Signal();
		shared.ugcSignals.showsoupcreator = new Signal();

		shared.ugcSignals.object_mode = new Signal();
		shared.ugcSignals.soup_mode = new Signal();

		shared.ugcSignals.object_createmode = new Signal();
		shared.ugcSignals.object_erasemode = new Signal();
		shared.ugcSignals.object_symmetrymode = new Signal();
		shared.ugcSignals.object_rotatemode = new Signal();
		shared.ugcSignals.object_changecolor = new Signal();
		shared.ugcSignals.object_colormode = new Signal();
		shared.ugcSignals.object_changesize = new Signal();
		shared.ugcSignals.object_zoomin = new Signal();
		shared.ugcSignals.object_zoomout = new Signal();

		shared.ugcSignals.submit_dialogue = new Signal();
		shared.ugcSignals.submit = new Signal();

		shared.ugcSignals.object_smoothup = new Signal();
		shared.ugcSignals.object_smoothdown = new Signal();
		shared.ugcSignals.object_undo = new Signal();

		shared.ugcSignals.object_requestsnapshot = new Signal();
		shared.ugcSignals.object_receivesnapshot = new Signal();

		intro = new UgcIntro( shared );
		domElement.appendChild( intro.getDomElement() );

		objectCreator = new UgcObjectCreator( shared, camera, that.scene );
		// soupCreator = new UgcSoupCreator( shared );

		ui = new UgcUI( shared );
		ui.getDomElement().style.position = 'absolute';
		ui.getDomElement().style.left = '0px';
		ui.getDomElement().style.top = '0px';
		ui.getDomElement().style.display = 'none';
		domElement.appendChild( ui.getDomElement() );

		ui.addListeners();

		// Signals listeners

		shared.ugcSignals.showintro.add( function () {

			_type = null;

			objectCreator.disable();

			intro.getDomElement().style.display = 'block';
			ui.getDomElement().style.display = 'none';

			objectCreator.getPainter().clear();


		} );

		shared.ugcSignals.showobjectcreator.add( function ( type ) {

			_type = type;

			intro.getDomElement().style.display = 'none';

			objectCreator.enable();

			ui.setType( type );
			ui.getDomElement().style.display = 'block';

			switch( _type ) {

				case 0:

					objectCreator.getPainter().getObject().setType( UgcObject.TYPE_GROUND );

					var tweenParams = { theta: theta, phi: phi };

					new TWEEN.Tween( tweenParams )
						.to( { theta: 45, phi: 15 }, 2000 )
						.easing( TWEEN.Easing.Exponential.EaseOut )
						.onUpdate( function () {

							theta = tweenParams.theta;
							phi = tweenParams.phi;

						} )
						.start();

					new TWEEN.Tween( environment.position )
						.to( { y: 0 }, 3000 )
						.easing( TWEEN.Easing.Exponential.EaseOut )
						.start();

				break;

				case 1:

					objectCreator.getPainter().getObject().setType( UgcObject.TYPE_SKY );

					var tweenParams = { theta: theta, phi: phi };

					new TWEEN.Tween( tweenParams )
						.to( { theta: 45, phi: 15 }, 2000 )
						.easing( TWEEN.Easing.Exponential.EaseOut )
						.onUpdate( function () {

							theta = tweenParams.theta;
							phi = tweenParams.phi;

						} )
						.start();

					new TWEEN.Tween( environment.position )
						.to( { y: - 5000 }, 3000 )
						.easing( TWEEN.Easing.Exponential.EaseOut )
						.start();

				break;

			}

			new TWEEN.Tween( camera.target.position )
				.to( { y: 20 }, 1000 )
				.easing( TWEEN.Easing.Exponential.EaseOut )
				.start();

		} );

		/*
		shared.ugcSignals.showsoupcreator.add( function ( mode ) {


		} );
		*/

		//

		shared.ugcSignals.object_createmode.add( function () {

			isRotateMode = false;

		} );

		shared.ugcSignals.object_erasemode.add( function () {

			isRotateMode = false;

		} );

		shared.ugcSignals.object_rotatemode.add( function () {

			isRotateMode = true;

		} );

		shared.ugcSignals.object_zoomin.add( function () {

			zoom( - 200 );

		} );

		shared.ugcSignals.object_zoomout.add( function () {

			zoom( 200 );

		} );

  shared.ugcSignals.object_requestsnapshot.add(function() {
    var image = gen_filmstrip(735,465);
    shared.ugcSignals.object_receivesnapshot.dispatch(image);
  });

  function gen_filmstrip(dWidth, dHeight, num_frames) {
    dWidth = dWidth || 300;
    dHeight = dHeight || 180;
    num_frames = num_frames || 7;
    var dest = document.createElement('canvas'),
        stashed_cam_pos = camera.position.clone(),
        thetap = 45, phip = 35;
    var rotationp = 360/num_frames;
    dest.width = dWidth;
    dest.height = dHeight * num_frames;
    var orig = renderer.domElement;
    var origW = orig.width;
    var origH = orig.height;
    var ctx = dest.getContext('2d');
    that.resize(dWidth, dHeight);
    objectCreator.getPainter().hideBrush();
    grid.visible = false;
	THREE.SceneUtils.traverseHierarchy( that.clouds, function( node ) { node.visible = false; } );

    var vertices = objectCreator.getPainter().getObject().getMesh().geometry.vertices;
    var maxX = vertices[0].position.x, maxY = vertices[0].position.y, maxZ = vertices[0].position.z;
    var minX = vertices[0].position.x, minY = vertices[0].position.y, minZ = vertices[0].position.z;
    var centerX, centerY, centerZ;

    for (var i in vertices){

      (vertices[i].position.x > maxX) ? maxX = vertices[i].position.x : null;
      (vertices[i].position.y > maxY) ? maxY = vertices[i].position.y : null;
      (vertices[i].position.z > maxZ) ? maxZ = vertices[i].position.z : null;
      (vertices[i].position.x < minX) ? minX = vertices[i].position.x : null;
      (vertices[i].position.y < minY) ? minY = vertices[i].position.y : null;
      (vertices[i].position.z < minZ) ? minZ = vertices[i].position.z : null;

    }
    centerX = (minX+maxX)/2;
    centerY = (minY+maxY)/2;
    centerZ = (minZ+maxZ)/2;
    radius = 2*Math.max(maxX-minX,Math.max(maxY-minY,maxZ-minZ));
    camera.target.position.set(centerX,centerY,centerZ);

    for(var i=0;i<num_frames;i++) {
      // move camera
      camera.position.x = radius * Math.sin( thetap * DEG2RAD ) * Math.cos( phip * DEG2RAD ) + centerX;
      camera.position.y = radius * Math.sin( phip * DEG2RAD );
      camera.position.z = radius * Math.cos( thetap * DEG2RAD ) * Math.cos( phip * DEG2RAD ) + centerZ;
      // draw to canvas
      renderer.clear();
      renderer.render( that.scene, camera );
      ctx.drawImage(orig, 0, 0, dWidth, dHeight, 0, dHeight*i, dWidth, dHeight);
      thetap += rotationp;
    }

    camera.target.position.set(0,0,0);

    that.resize(origW, origH);
    // create thumbnail
    var strip = dest.toDataURL('image/png');
    delete dest;
    camera.position.copy( stashed_cam_pos );
    grid.visible = true;
	THREE.SceneUtils.traverseHierarchy( that.clouds, function( node ) { node.visible = true; } );
    renderer.clear();
    renderer.render( that.scene, camera );
    return strip;
  }

		var ugcHandler = new UgcHandler();

		shared.ugcSignals.submit.add( function (title, email) {

      var image = gen_filmstrip();
      var obj = objectCreator.getPainter().getObject();
      var submission = {
        title: title,
        email: email,
        category: obj.getType(),
        data: obj.getJSON()
      };


			ugcHandler.submitUGO( submission, image, function ( rsp ) {
				if (!rsp.success) {
          alert("There was an error submitting your model. Please try again in a moment.");
        } else {
          window.location = '/gallery';
        }
			});

		} );

	};

	this.show = function () {

		shared.signals.mousedown.add( onMouseDown );
		shared.signals.mouseup.add( onMouseUp );
		shared.signals.mousemoved.add( onMouseMove );
		shared.signals.mousewheel.add( onMouseWheel );

		domElement.style.display = 'block';
		objectCreator.show();

		shared.ugcSignals.showintro.dispatch();

		domElement.addEventListener( 'contextmenu', onContextMenu, false );

	};

	this.hide = function () {

		shared.signals.mousedown.remove( onMouseDown );
		shared.signals.mouseup.remove( onMouseUp );
		shared.signals.mousemoved.remove( onMouseMove );
		shared.signals.mousewheel.remove( onMouseWheel );

		domElement.style.display = 'none';
		objectCreator.hide();

		domElement.removeEventListener( 'contextmenu', onContextMenu, false );

	};

	this.resize = function ( width, height ) {

		intro.resize( width, height );

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		shared.viewportWidth = width;
		shared.viewportHeight = height;

		renderer.setSize( width, height );
		renderer.domElement.style.left = '0px';
		renderer.domElement.style.top = '0px';

	};

	this.update = function () {

		TWEEN.update();

		if ( _type == null ) theta = ( theta += 0.1 ) % 360;

		ui.update();

		// Background

		radius += ( newRadius - radius ) / 20;

		camera.position.x = radius * Math.sin( theta * DEG2RAD ) * Math.cos( phi * DEG2RAD );
		camera.position.y = radius * Math.sin( phi * DEG2RAD );
		camera.position.z = radius * Math.cos( theta * DEG2RAD ) * Math.cos( phi * DEG2RAD );

		renderer.clear();
		renderer.render( that.scene, camera );

	};

};

UgcSection.prototype = new Section();
UgcSection.prototype.constructor = UgcSection;
