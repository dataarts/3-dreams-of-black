var Shortcuts = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.position = "absolute";
	domElement.style.left = "0px";
	domElement.style.top = "0px";
	domElement.style.padding = "0.5em";
	domElement.style.fontSize = '10px';

	// Launcher

	addLauncherShortcut( 'Launcher' );
	addSeparator();

	// Demo

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

	// Relauncher

	addRelauncherShortcut( 'Relauncher' );
	addSeparator();

	// Exploration

	addExplorationShortcut( 'Explore City', 'city' );
	addExplorationShortcut( 'Explore Prairie', 'prairie' );
	addExplorationShortcut( 'Explore Dunes', 'dunes' );
	addSeparator();

	// Tool

	addUgcShortcut( 'Ugc' );

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

	function addLauncherShortcut( text ) {

		addLink( text, function () {

			shared.signals.showlauncher.dispatch();

		} );

	}

	function addDemoShortcut( text, pattern ) {

		addLink( text, function () {

			shared.signals.showfilm.dispatch();
			shared.signals.startfilm.dispatch( pattern );

		} );

	};

	function addRelauncherShortcut( text ) {

		addLink( text, function () {

			shared.signals.showrelauncher.dispatch();

		} );

	}

	function addExplorationShortcut( text, worldId ) {

		addLink( text, function () {

			shared.signals.showexploration.dispatch();
			shared.signals.startexploration.dispatch( worldId );

		} );

	}

	function addUgcShortcut( text ) {

		addLink( text, function () {

			shared.signals.showugc.dispatch();

		} );

	}


	this.getDomElement = function () {

		return domElement;

	};

}
