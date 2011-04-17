var Shortcuts = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.position = "absolute";
	domElement.style.left = "0px";
	domElement.style.top = "0px";
	domElement.style.padding = "0.5em";
	domElement.style.fontSize = '10px';

	addDemoShortcut( 'Intro', 0 );
	addSeparator();

	addDemoShortcut( 'Transition to City', 8 );
	addDemoShortcut( 'City', 16 );
	addSeparator();

	addDemoShortcut( 'Transition to Prairie', 24 );
	addDemoShortcut( 'Prairie', 32 );
	addSeparator();

	addDemoShortcut( 'Transition to Dunes', 40 );
	addDemoShortcut( 'Dunes', 48 );
	addSeparator();

	function addSeparator() {

		var element = document.createElement( 'span' )
		element.innerHTML = ' ';
		domElement.appendChild( element );

	};

	function addLink( text, callback ) {

		var element = document.createElement( 'span' );
		element.style.cursor = 'pointer';
		element.style.padding = "0.5em";
		element.style.marginRight = "4px";
		element.style.background = "rgba(255,255,255,0.15)";
		element.innerHTML = text;
		element.addEventListener( 'click', callback, false );
		domElement.appendChild( element );

	}

	function addDemoShortcut( text, pattern ) {

		addLink( text, function () {

			shared.signals.showdemo.dispatch();
			shared.signals.startdemo.dispatch( pattern );

		} );

	};

	function addSectionShortcut( target, text, section ) {

		

	}

	this.getDomElement = function () {

		return domElement;

	};

}
