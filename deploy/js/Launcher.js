var Launcher = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.id = 'launcher';
	domElement.style.display = 'none';
	domElement.style.height = window.innerHeight + 'px';

	// Bg

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

	var progress = document.createElement( 'progress' );
	progress.value = 0;
	domElement.appendChild( progress );

	loadProgress = new LoadProgress( progress );

	addBreackLine(); addBreackLine();

	addLaunchLink( 'Intro', 0 ); addBreackLine(); addBreackLine();

	addLaunchLink( 'Transition to City', 8 ); addBreackLine();
	addLaunchLink( 'City', 16 ); addBreackLine(); addBreackLine();

	addLaunchLink( 'Transition to Prairie', 24 ); addBreackLine();
	addLaunchLink( 'Prairie', 32 ); addBreackLine(); addBreackLine();

	addLaunchLink( 'Transition to Dunes', 40 ); addBreackLine();
	addLaunchLink( 'Dunes', 48 ); addBreackLine(); addBreackLine();

	var title = document.createElement( 'div' );
	title.style.paddingTop = '60px';
	title.innerHTML = '<img src="files/title_heart.png">';
	domElement.appendChild( title );

	var footer = document.createElement( 'div' );
	footer.style.position = 'absolute';
	footer.style.left = '20px';
	footer.style.bottom = '10px';
	footer.innerHTML = '<img src="files/footer.png">';
	domElement.appendChild( footer );

	// signals

	shared.signals.loadItemAdded.add( loadProgress.addItem );
	shared.signals.loadItemCompleted.add( loadProgress.completeItem );

	function addBreackLine() {

		domElement.appendChild( document.createElement( 'br' ) );

	}

	function addLaunchLink( text, pattern ) {

		var element = document.createElement( 'span' );
		element.style.cursor = 'pointer';
		element.innerHTML = text;
		element.addEventListener( 'click', function () {

			shared.signals.showdemo.dispatch();
			shared.signals.startdemo.dispatch( pattern );

		}, false );

		domElement.appendChild( element );

	}

	//

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

	};

}
