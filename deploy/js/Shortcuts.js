var Shortcuts = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.position = "absolute";
	domElement.style.left = "0px";
	domElement.style.top = "0px";
	domElement.style.padding = "0.5em";
	domElement.style.fontSize = '10px';
	//domElement.style.display = "none";

	// Launcher

	addLauncherShortcut( 'Launcher' );
	addSeparator();

	// Demo

	addFilmShortcut( 'Intro', 0 );
	addSeparator();

	addFilmShortcut( 'Transition to City', 8 );
	addFilmShortcut( 'City', 16 );
	addSeparator();

	addFilmShortcut( 'Transition to Prairie', 24 );
	addFilmShortcut( 'Prairie', 32 );
	addSeparator();

	addFilmShortcut( 'Transition to Dunes', 40 );
	addFilmShortcut( 'Dunes', 48 );
	addSeparator();

	// Relauncher

	addRelauncherShortcut( 'Relauncher' );
	addSeparator();

	// Exploration

	addExplorationShortcut( 'Explore City', 'city' );
	addExplorationShortcut( 'Explore Prairie', 'prairie' );
	addExplorationShortcut( 'Explore Dunes', 'dunes' );
	addSeparator();

	// UGC

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

	};

	function addLauncherShortcut( text ) {

		addLink( text, function () {

			shared.signals.showlauncher.dispatch();

		} );

	};

	function addFilmShortcut( text, pattern ) {

		addLink( text, function () {

			shared.signals.showfilm.dispatch();
			shared.signals.startfilm.dispatch( pattern, 1 );

		} );

	};

	function addRelauncherShortcut( text ) {

		addLink( text, function () {

			shared.signals.showrelauncher.dispatch();

		} );

	};

	function addExplorationShortcut( text, worldId ) {

		addLink( text, function () {

			shared.signals.showexploration.dispatch();
			shared.signals.startexploration.dispatch( worldId );

		} );

	};

	function addUgcShortcut( text ) {

		addLink( text, function () {

			shared.signals.showugc.dispatch();

		} );

	};

	this.getDomElement = function () {

		return domElement;

	};

};
