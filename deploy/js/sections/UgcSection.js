var UgcSection = function ( shared ) {

	var that = this;

	var intro, objectCreator/*, soupCreator*/, ui;

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	var DEG2RAD = Math.PI / 180,
	light1, light2, loader,
	intersects, intersectedFace, intersectedObject,
	isRotateMode = false, isMouseDown = false, start_radius = 1500,
	radius = start_radius, oldRadius = start_radius, newRadius = start_radius,
	theta = 45, phi = 15;

	var camera = new THREE.Camera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
	camera.target.position.y = 20;

	// Background

	that.scene = new THREE.Scene();
	that.scene.fog = new THREE.FogExp2( 0xffffff, 0.000075 );
	that.scene.fog.color.setHSV( 0.576, 0.382, 0.9 );

	// Lights

	var ambient = new THREE.AmbientLight( 0x221100 );
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
	
	var loader = new THREE.SceneLoader();
	loader.load( "/files/models/dunes/D_tile_1.js", function ( result ) {

		for ( var i = 0, l = result.scene.objects.length; i < l; i ++ ) {

			var object = result.scene.objects[ i ];

			if ( object.visible ) {

				object.rotation.x = - 90 * Math.PI / 180;
				object.position.y = - 100;
				object.position.x = 500;
				object.scale.x = object.scale.y = object.scale.z = 0.5;
				that.scene.addObject( object );

			}

		}

	} );

	// Renderer

	var renderer = new THREE.WebGLRenderer( { stencil: false } );
	renderer.domElement.style.position = 'absolute';
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( that.scene.fog.color );
	renderer.sortObjects = false;
	renderer.autoClear = false;
	domElement.appendChild( renderer.domElement );

	function onKeyDown( event ) {

		switch ( event.keyCode ) {

			case 16: isRotateMode = true; break;
			// case 17: isEraseMode = true; break;
			// case 18: isEraseMode = true; break;

		}

	}

	function onKeyUp( event ) {

		switch ( event.keyCode ) {

			case 16: isRotateMode = false; break;
			// case 17: isEraseMode = false; break;
			// case 18: isEraseMode = false; break;

		}

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

			intro.getDomElement().style.display = 'block';

			objectCreator.disable();

			ui.getDomElement().style.display = 'none';


		} );

		shared.ugcSignals.showobjectcreator.add( function ( mode ) {

			intro.getDomElement().style.display = 'none';

			objectCreator.enable();

			ui.getDomElement().style.display = 'block';

		} );

		/*
		shared.ugcSignals.showsoupcreator.add( function ( mode ) {


		} );
		*/

  shared.ugcSignals.object_requestsnapshot.add(function() {
    var image = gen_filmstrip(735,465);
    shared.ugcSignals.object_receivesnapshot.dispatch(image);
  });

  function gen_filmstrip(dWidth, dHeight, num_frames) {
    dWidth = dWidth || 300;
    dHeight = dHeight || 180;
    num_frames = num_frames || 15;
    var dest = document.createElement('canvas'),
        stashed_cam_pos = camera.position.clone(),
        thetap = 45, phip = 15;
    var rotationp = 360/num_frames;
    dest.width = dWidth;
    dest.height = dHeight * num_frames;
    var orig = renderer.domElement;
    var origW = orig.width;
    var origH = orig.height;
    var ctx = dest.getContext('2d');
    that.resize(dWidth, dHeight);
    for(var i=0;i<num_frames;i++) {
      // move camera
      camera.position.x = start_radius * Math.sin( thetap * DEG2RAD ) * Math.cos( phip * DEG2RAD );
      camera.position.y = start_radius * Math.sin( phip * DEG2RAD );
      camera.position.z = start_radius * Math.cos( thetap * DEG2RAD ) * Math.cos( phip * DEG2RAD );
      // draw to canvas
      renderer.clear();
      renderer.render( that.scene, camera );
      ctx.drawImage(orig, 0, 0, dWidth, dHeight, 0, dHeight*i, dWidth, dHeight);
      thetap += rotationp;
    }
    that.resize(origW, origH);
    // create thumbnail
    var strip = dest.toDataURL('image/png');
    delete dest;
    camera.position = stashed_cam_pos;
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
				console.log(rsp);
			});

		} );

	};

	this.show = function () {

		domElement.style.display = 'block';
		objectCreator.show();

		shared.signals.keydown.add( onKeyDown );
		shared.signals.keyup.add( onKeyUp );

		// soupCreator.init();

	};

	this.hide = function () {

		domElement.style.display = 'none';
		objectCreator.hide();

		shared.signals.keydown.remove( onKeyDown );
		shared.signals.keyup.remove( onKeyUp );

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

		// objectCreator.update();
		// soupCreator.update();
		ui.update();

		// Background

		if ( isRotateMode ) {

			theta += ( shared.mouse.x / shared.screenWidth ) * 4 - 2;
			phi += - ( shared.mouse.y / shared.screenHeight ) * 4 + 2;
			phi = phi > 90 ? 90 : phi < 0 ? 0 : phi;

		}

		radius += (newRadius-radius)/20;

		camera.position.x = radius * Math.sin( theta * DEG2RAD ) * Math.cos( phi * DEG2RAD );
		camera.position.y = radius * Math.sin( phi * DEG2RAD );
		camera.position.z = radius * Math.cos( theta * DEG2RAD ) * Math.cos( phi * DEG2RAD );

		renderer.clear();
		renderer.render( that.scene, camera );

	};

};

UgcSection.prototype = new Section();
UgcSection.prototype.constructor = UgcSection;
