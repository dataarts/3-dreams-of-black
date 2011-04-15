( function () {

	var Signal = signals.Signal, currentSection, 
	launcher, demo, relauncher, exploration, tool,

	events = {

		showlauncher : new Signal(),
		showdemo : new Signal(),
		showrelauncher : new Signal(),
		showexploration : new Signal(),
		showtool : new Signal()

	};

	launcher = new Launcher( events );
	// demo = new Demo( events );
	relauncher = new Relauncher( events );
	exploration = new Exploration( events );
	tool = new Tool( events );

	//

	events.showlauncher.add( function () { setSection( launcher ); } );
	events.showdemo.add( function () { setSection( demo ); } );
	events.showrelauncher.add( function () { setSection( relauncher ); } );
	events.showexploration.add( function () { setSection( exploration ); } );
	events.showtool.add( function () { setSection( tool ); } );	

	//

	events.showlauncher.dispatch();
	animate();

	function setSection( section ) {

		while ( document.body.hasChildNodes() ) {

			document.body.removeChild( document.body.lastChild );

		}

		currentSection = section;
		document.body.appendChild( currentSection.getDomElement() );		

	}

	function animate() {

		requestAnimationFrame( animate );
		currentSection.update();

	}

} )();
