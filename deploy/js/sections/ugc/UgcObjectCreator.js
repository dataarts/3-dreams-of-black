var UgcObjectCreator = function ( shared, camera, scene ) {

	var isMouseDown = false;

	// Painter

	var painter = new VoxelPainter( camera, scene );

	// Signal listeners

	shared.ugcSignals.object_createmode.add( function () {

		painter.setMode( VoxelPainter.MODE_CREATE );

	} );

	shared.ugcSignals.object_erasemode.add( function () {

		painter.setMode( VoxelPainter.MODE_ERASE );

	} );

	shared.ugcSignals.object_symmetrymode.add( function ( bool ) {

		painter.setSymmetry( bool );

	} );

	shared.ugcSignals.object_changecolor.add( function ( hex ) {

		painter.setColor( hex );

	} );

	shared.ugcSignals.object_changesize.add( function ( size ) {

		painter.setSize( size );

	} );

	shared.ugcSignals.object_changesize.add( function ( size ) {

		painter.setSize( size );

	} );

	/*
	shared.ugcSignals.soup_mode.add( function ( size ) {

		oldRadius = radius;
		newRadius = 400;

	} );

	shared.ugcSignals.object_mode.add( function ( size ) {

		newRadius = oldRadius;

	} );
	*/

  /**
   * Capture several views of the scene and create an image
   */
  function dream_catcher() {
    var dWidth = 300,
        dHeight = 180,
        dx = 0, dy = 0,
        num_images = 12,
        origX = 0, origY = 0,
        dest = document.createElement('canvas'),
        stashed_cam_pos = shared.ugc.camera.position.clone(),
        radiusp = 1500,
        thetap = 45, phip = 15;
    var rotationp = 360/num_images;
    dest.width = dWidth;
    dest.height = dHeight * num_images;
    window.renderer = renderer;
    var orig = renderer.domElement;
    var origW = orig.width;
    var origH = orig.height;
    var origR = origW / origH;
    var destR = dWidth / dHeight;
    var ctx = dest.getContext('2d');
    if (origR <= destR) {
      origH = Math.round(origW * destR)
    } else {
      origW = Math.round(origH * destR)
    }
    console.log(orig, origW, origH, origR, destR, dWidth, dHeight);
    for(var i=0;i<num_images;i++) {
      // move camera
      shared.ugc.camera.position.x = radiusp * Math.sin( thetap * DEG2RAD ) * Math.cos( phip * DEG2RAD );
      shared.ugc.camera.position.y = radiusp * Math.sin( phip * DEG2RAD );
      shared.ugc.camera.position.z = radiusp * Math.cos( thetap * DEG2RAD ) * Math.cos( phip * DEG2RAD );
      // draw to canvas
      shared.renderer.clear();
      shared.renderer.render( shared.ugc.scene, shared.ugc.camera );
      ctx.drawImage(orig, origX, origY, origW, origH, dx, dy, dWidth, dHeight);
      thetap += rotationp;
      dy += dHeight;
    }
    // create thumbnail
    var thumbnail = dest.toDataURL('image/png');
    delete dest;
    shared.ugc.camera.position = stashed_cam_pos;
    shared.renderer.clear();
    shared.renderer.render( shared.ugc.scene, shared.ugc.camera );
    return thumbnail;
  }

	shared.ugcSignals.submit.add( function () {

    thumbnail = dream_catcher();

    var submission = {
      title: 'Amorphous Building',
      email: 'dougfritz@gmail.com',
      category: 'ground',
      data: painter.getObject().getJSON()
    };

    ugcHandler.submitUGO( submission, thumbnail, function ( rsp ) {
      console.log(rsp);
    });

  } );

	function onMouseDown( event ) {

		isMouseDown = true;

		painter.update( isMouseDown );

	}

	function onMouseUp( event ) {

		isMouseDown = false;

		painter.update( isMouseDown );

	}

	function onMouseMove( event ) {

		painter.moveMouse( shared.mouse.x / shared.viewportWidth, shared.mouse.y / shared.viewportHeight );
		painter.update( isMouseDown );

	}

	function onMouseWheel( event ) {

		newRadius = radius + event.wheelDeltaY;

		painter.update( isMouseDown );

	}

	this.show = function () {

		shared.signals.mousedown.add( onMouseDown );
		shared.signals.mouseup.add( onMouseUp );
		shared.signals.mousemoved.add( onMouseMove );
		shared.signals.mousewheel.add( onMouseWheel );

	};

	this.hide = function () {

		shared.signals.mousedown.remove( onMouseDown );
		shared.signals.mouseup.remove( onMouseUp );
		shared.signals.mousemoved.remove( onMouseMove );
		shared.signals.mousewheel.remove( onMouseWheel );

	};

	this.resize = function ( width, height ) {


	};

	this.update = function () {


	};

	this.getPainter = function () {

		return painter;

	};

};
