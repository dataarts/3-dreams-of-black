var Launcher = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.backgroundColor = '#4584b4';
	domElement.style.textAlign = 'center';

	// Background

	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = window.innerHeight;

	var context = canvas.getContext( '2d' );

	var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
	gradient.addColorStop( 0, "#0e223a" );
	gradient.addColorStop( 0.5, "#4584b4" );

	context.fillStyle = gradient;
	context.fillRect( 0, 0, canvas.width, canvas.height );

	domElement.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')';
	domElement.style.backgroundRepeat = 'repeat-x';

	// Clouds

	var clouds = new CloudsWorld( shared );
	clouds.getDomElement().style.position = 'absolute';
	domElement.appendChild( clouds.getDomElement() );

	// UI

	var title = document.createElement( 'div' );
	title.style.position = 'absolute';
	title.style.top = '60px';
	title.style.left = ( window.innerWidth - 358 ) / 2 + 'px';
	title.innerHTML = '<img src="files/title_heart_loading.png">';
	domElement.appendChild( title );

	var titleOverlay = document.createElement( 'div' );
	titleOverlay.style.position = 'absolute';
	titleOverlay.style.left = ( window.innerWidth - 358 ) / 2 + 'px';
	titleOverlay.style.top = '210px';
	titleOverlay.style.cursor = 'pointer';
	titleOverlay.innerHTML = '<img src="files/title_heart_enter.png">';
	titleOverlay.addEventListener( 'click', function () {

		loading.getDomElement().style.display = 'block';
		titleOverlay.style.display = 'none';

		shared.signals.load.dispatch();

	}, false );
	domElement.appendChild( titleOverlay );

	var loading = new LoadingBar( function () {

		document.body.style.cursor = 'none';

		shared.signals.showfilm.dispatch();

		// Start in 1 second.

		setTimeout( function () {

			shared.signals.startfilm.dispatch( 0 );

		}, 1000 );

	} );
	loading.getDomElement().style.position = 'absolute';
	loading.getDomElement().style.left = ( window.innerWidth - 180 ) / 2 + 'px';
	loading.getDomElement().style.top = '215px';
	loading.getDomElement().style.display = 'none';

	domElement.appendChild( loading.getDomElement() );

	shared.signals.loadItemAdded.add( loading.addItem );
	shared.signals.loadItemCompleted.add( loading.completeItem );

	var footer = document.createElement( 'div' );
	footer.style.position = 'absolute';
	footer.style.left = '20px';
	footer.style.bottom = '10px';
	footer.innerHTML = '<img src="files/footer.png">';
	domElement.appendChild( footer );

	/*
	shared.signals.mousemoved.add( function () {

		shared.signals.mousemoved.add( function () {

			mouse.x = ( shared.mouse.x / shared.screenWidth ) * 200 - 100;
			mouse.y = ( shared.mouse.y / shared.screenHeight ) * 200 - 100;

		} );

	} );
	*/

	shared.signals.windowresized.add( function () {

		domElement.style.height = window.innerHeight + 'px';

	} );

	//

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

		clouds.update();

	};

};
