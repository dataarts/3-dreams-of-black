var Launcher = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.id = 'launcher';
	domElement.style.display = 'none';
	domElement.style.height = window.innerHeight + 'px';

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

	var shortcutsRoot = document.createElement( 'div' );
	createShortcuts( shortcutsRoot );
	
	shortcutsRoot.style.position = "absolute";
	shortcutsRoot.style.left = "10px";
	shortcutsRoot.style.top = "10px";
	shortcutsRoot.style.padding = "1em";
	shortcutsRoot.style.textAlign = "left";
	shortcutsRoot.style.boxShadow = "0px 0px 5px rgba(0,0,0,0.5)";
	shortcutsRoot.style.background = "rgba(255,255,255,0.15)";
	
	domElement.appendChild( shortcutsRoot );

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

	var totalItems = 0, doneItems = 0, maxProgress = 0, loadBegin = false;
		
	var loadBar = document.createElement( 'div' );
	loadBar.style.position = 'relative';
	loadBar.style.top = '-480px';
	loadBar.style.height = '10px';
	loadBar.style.width = '358px';
	loadBar.style.margin = '0 auto';
	loadBar.style.background = '#fff';
	loadBar.style.borderRadius = '5px';
	loadBar.style.display = 'block';
	domElement.appendChild( loadBar );

	var loadVal = document.createElement( 'div' );
	loadVal.style.position = 'relative';
	loadVal.style.top = '0px';
	loadVal.style.height = '10px';
	loadVal.style.width = '0px';
	loadVal.style.background = '#000';
	loadVal.style.borderRadius = '5px 0px 0px 5px';
	loadBar.appendChild( loadVal );
		
	var footer = document.createElement( 'div' );
	footer.style.position = 'absolute';
	footer.style.left = '20px';
	footer.style.bottom = '10px';
	footer.innerHTML = '<img src="files/footer.png">';
	domElement.appendChild( footer );

	// signals

	//shared.signals.loadItemAdded.add( loadProgress.addItem );
	//shared.signals.loadItemCompleted.add( loadProgress.completeItem );
	//shared.signals.loadBegin.add( loadProgress.loadBegin );

	shared.signals.loadItemAdded.add( loadAddItemCallback );
	shared.signals.loadItemCompleted.add( loadCompleteItemCallback );
	shared.signals.loadBegin.add( loadBeginCallback );

	function createShortcuts( root ) {
/*
		var progress = document.createElement( 'progress' );
		progress.style.display = "none";
		progress.value = 0;
		root.appendChild( progress );

		loadProgress = new LoadProgress( progress, loadFinishedCallback );
*/
		//addBreakLine( root ); addBreakLine( root );

		addLaunchLink( root, 'Intro', 0 ); addBreakLine( root ); addBreakLine( root );

		addLaunchLink( root, 'Transition to City', 8 ); addBreakLine( root );
		addLaunchLink( root, 'City', 16 ); addBreakLine( root ); addBreakLine( root );

		addLaunchLink( root, 'Transition to Prairie', 24 ); addBreakLine( root );
		addLaunchLink( root, 'Prairie', 32 ); addBreakLine( root ); addBreakLine( root );

		addLaunchLink( root, 'Transition to Dunes', 40 ); addBreakLine( root );
		addLaunchLink( root, 'Dunes', 48 ); addBreakLine( root ); addBreakLine( root );
		
		addExploreLink( root, 'Explore City', 'city' ); addBreakLine( root );
		addExploreLink( root, 'Explore Prairie', 'prairie' ); addBreakLine( root );
		addExploreLink( root, 'Explore Dunes', 'dunes' ); addBreakLine( root );

	};
	
	function addBreakLine( root ) {

		root.appendChild( document.createElement( 'br' ) );

	};

	function addLink( root, text, callback ) {

		var element = document.createElement( 'span' );
		element.style.cursor = 'pointer';
		element.innerHTML = text;
		element.addEventListener( 'click', callback, false );

		root.appendChild( element );
		
	};

	function callbackExplore ( worldId ) {
		
		shared.signals.showexploration.dispatch();
		shared.signals.startexploration.dispatch( worldId );

	};
	
	function callbackLaunch ( pattern ) {
		
		shared.signals.showdemo.dispatch();
		shared.signals.startdemo.dispatch( pattern );

	};
	
	
	function addExploreLink( root, text, worldId ) {

		addLink( root, text, function() { callbackExplore( worldId ); } );
		
	};

	
	function addLaunchLink( root, text, pattern ) {

		addLink( root, text, function() { callbackLaunch( pattern ); } );
		
	};	


	function loadAddItemCallback() {
		
		totalItems += 1;
		
		updateProgress();

	};

	function loadCompleteItemCallback() {
		
		doneItems += 1;
		
		updateProgress();
		
		if ( loadBegin && totalItems == doneItems ) {
			
			loadFinishedCallback();

		}

	};
	
	function loadBeginCallback() {
		
		loadBegin = true;

	};
	
	function updateProgress() {
		
		var progress = doneItems / totalItems;

		if ( progress > maxProgress ) {

			maxProgress = progress;
			loadVal.style.width = progress * 358 + "px";

		}
		
	};

	function loadFinishedCallback() {

		loadBar.style.display = 'none';
		titleOverlay.style.display = 'block';
		
	};
	
	//

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

	};

};
