var UgcSection = function ( shared ) {

	var intro, objectCreator, soupCreator, ui;

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';



	this.getDomElement = function () {

		return domElement;

	};



	this.load = function () {

		var Signal = signals.Signal;

		shared.ugc = {};
		shared.ugcSignals = {};
		shared.ugcSignals.showintro = new Signal();
		shared.ugcSignals.showobjectcreator = new Signal();
		shared.ugcSignals.showsoupcreator = new Signal();

		shared.ugcSignals.object_mode = new Signal();
		shared.ugcSignals.soup_mode = new Signal();

		shared.ugcSignals.object_createmode = new Signal();
		shared.ugcSignals.object_erasemode = new Signal();
		shared.ugcSignals.object_symmetrymode = new Signal();
		shared.ugcSignals.object_rotatemode = new Signal();
		shared.ugcSignals.object_changecolor = new Signal();
		shared.ugcSignals.object_changesize = new Signal();
		shared.ugcSignals.object_zoomin = new Signal();
		shared.ugcSignals.object_zoomout = new Signal();

		shared.ugcSignals.submit_dialogue = new Signal();
		shared.ugcSignals.submit = new Signal();

		shared.ugcSignals.object_smoothup = new Signal();
		shared.ugcSignals.object_smoothdown = new Signal();
		shared.ugcSignals.object_undo = new Signal();

		shared.ugcSignals.object_requestsnapshot = new Signal();
		shared.ugcSignals.object_receivesnapshot = new Signal();

		intro = new UgcIntro( shared );

		domElement.appendChild( intro.getDomElement() );
		objectCreator = new UgcObjectCreator( shared );
		objectCreator.getDomElement().style.display = 'none';
		domElement.appendChild( objectCreator.getDomElement() );

		soupCreator = new UgcSoupCreator( shared );

		ui = new UgcUI( shared );
		ui.getDomElement().style.position = 'absolute';
		ui.getDomElement().style.left = '0px';
		ui.getDomElement().style.top = '0px';
		ui.getDomElement().style.display = 'none';
		domElement.appendChild( ui.getDomElement() );

		ui.addListeners();

		// Signals listeners

		shared.ugcSignals.showintro.add( function () {

			intro.getDomElement().style.display = 'block';

			objectCreator.getDomElement().style.display = 'none';
			ui.getDomElement().style.display = 'none';

		} );

		shared.ugcSignals.showobjectcreator.add( function ( mode ) {

			intro.getDomElement().style.display = 'none';

			objectCreator.getDomElement().style.display = 'block';
			ui.getDomElement().style.display = 'block';

		} );

		shared.ugcSignals.showsoupcreator.add( function ( mode ) {


		} );

	};

	this.show = function () {

		domElement.style.display = 'block';
		objectCreator.show();
		soupCreator.init();

	};

	this.hide = function () {

		domElement.style.display = 'none';
		objectCreator.hide();

	};

	this.resize = function ( width, height ) {

		objectCreator.resize( width, height );

	};

	this.update = function () {

		objectCreator.update();
		soupCreator.update();
		ui.update();

	};

}

UgcSection.prototype = new Section();
UgcSection.prototype.constructor = UgcSection;
