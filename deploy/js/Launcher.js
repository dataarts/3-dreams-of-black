var Launcher = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.backgroundColor = '#4584b4';
	domElement.style.textAlign = 'center';

	// Background

	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = window.innerHeight;

	var context = canvas.getContext( '2d' );

	var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
	gradient.addColorStop( 0, "#1e4877" );
	gradient.addColorStop( 0.5, "#4584b4" );

	context.fillStyle = gradient;
	context.fillRect( 0, 0, canvas.width, canvas.height );

	domElement.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')';
	domElement.style.backgroundRepeat = 'repeat-x';

	// UI

	var title = document.createElement( 'div' );
	title.style.paddingTop = '60px';
	title.innerHTML = '<img src="files/title_heart_loading.png">';
	domElement.appendChild( title );

	var titleOverlay = document.createElement( 'div' );
	titleOverlay.style.position = 'relative';
	titleOverlay.style.top = '-488px';
	titleOverlay.style.width = '358px';
	titleOverlay.style.margin = '0 auto';
	titleOverlay.style.display = 'none';
	titleOverlay.style.cursor = 'pointer';
	//titleOverlay.style.border = 'solid 1px red';
	titleOverlay.innerHTML = '<img src="files/title_heart_enter.png">';
	titleOverlay.addEventListener( 'click', function () {

		shared.signals.showfilm.dispatch();
		shared.signals.startfilm.dispatch( 0 );

	}, false );
	domElement.appendChild( titleOverlay );

	var loading = new LoadingBar( function () {

		loading.getDomElement().style.display = 'none';
		titleOverlay.style.display = 'block';

	} );

	domElement.appendChild( loading.getDomElement() );

	shared.signals.loadBegin.add( loading.loadBegin );
	shared.signals.loadItemAdded.add( loading.addItem );
	shared.signals.loadItemCompleted.add( loading.completeItem );

	var footer = document.createElement( 'div' );
	footer.style.position = 'absolute';
	footer.style.left = '20px';
	footer.style.bottom = '10px';
	footer.innerHTML = '<img src="files/footer.png">';
	domElement.appendChild( footer );

	shared.signals.windowresized.add( function () {

		domElement.style.height = window.innerHeight + 'px';

	} );

	//

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

	};

};
