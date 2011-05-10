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
