var Launcher = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.id = 'launcher';
	domElement.style.display = 'none';
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.backgroundColor = '#4584b4';

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

	domElement.style.background = 'url(' + canvas.toDataURL('image/png') + ')';

	// UI

	var shortcuts = document.createElement( 'div' );
	shortcuts.style.position = "absolute";
	shortcuts.style.left = "10px";
	shortcuts.style.top = "10px";
	shortcuts.style.padding = "1em";
	shortcuts.style.textAlign = "left";
	shortcuts.style.boxShadow = "0px 0px 5px rgba(0,0,0,0.5)";
	shortcuts.style.background = "rgba(255,255,255,0.15)";
	domElement.appendChild( shortcuts );

	createShortcuts( shortcuts );

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

		shared.signals.showdemo.dispatch();
		shared.signals.startdemo.dispatch( 0 );

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


	function createShortcuts( target ) {

		addLink( target, 'Intro', 0 ); addBreakLine( target ); addBreakLine( target );

		addLink( target, 'Transition to City', 8 ); addBreakLine( target );
		addLink( target, 'City', 16 ); addBreakLine( target ); addBreakLine( target );

		addLink( target, 'Transition to Prairie', 24 ); addBreakLine( target );
		addLink( target, 'Prairie', 32 ); addBreakLine( target ); addBreakLine( target );

		addLink( target, 'Transition to Dunes', 40 ); addBreakLine( target );
		addLink( target, 'Dunes', 48 ); addBreakLine( target ); addBreakLine( target );

	};

	function addBreakLine( target ) {

		target.appendChild( document.createElement( 'br' ) );

	};

	function addLink( target, text, callback ) {

		var element = document.createElement( 'span' );
		element.style.cursor = 'pointer';
		element.innerHTML = text;
		element.addEventListener( 'click', function () {

			shared.signals.showdemo.dispatch();
			shared.signals.startdemo.dispatch( pattern );

		}, false );

		target.appendChild( element );

	};

	//

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

	};

};
