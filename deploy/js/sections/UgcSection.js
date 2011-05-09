var UgcSection = function ( shared ) {

	var intro, objectCreator, ui;

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	this.getDomElement = function () {

		return domElement;

	};

	this.load = function () {

		var Signal = signals.Signal;

		shared.ugcSignals = {};
		shared.ugcSignals.showintro = new Signal();
		shared.ugcSignals.showobjectcreator = new Signal();

    // @doob, I killed the HANDLERS property, so these signals are being dispatched directly.
    // Cuttin' out the middle man ...

		shared.ugcSignals.object_createmode = new Signal();
		shared.ugcSignals.object_erasemode = new Signal();
		shared.ugcSignals.object_symmetrymode = new Signal();
		shared.ugcSignals.object_changecolor = new Signal();
		shared.ugcSignals.object_changesize = new Signal();

		shared.ugcSignals.submit = new Signal();

    // These are signals I added, following your conventions. They're being dispatched currently.

		shared.ugcSignals.object_smoothup = new Signal();
    shared.ugcSignals.object_smoothdown = new Signal();
    shared.ugcSignals.object_undo = new Signal();


    // Its important that we respond to these two signals, we should disable voxel functionality when we're hovering on the UI!
    
//    shared.ugcSignals.ui_mouseover = new Signal();
//    shared.ugcSignals.ui_mouseout = new Signal();


    // What do we do about the animals? ... signal-wise ...

    








    
		intro = new UgcIntro( shared );

		domElement.appendChild( intro.getDomElement() );
		objectCreator = new UgcObjectCreator( shared );
		objectCreator.getDomElement().style.display = 'none';
		domElement.appendChild( objectCreator.getDomElement() );

		ui = new UgcUI( shared );
		ui.getDomElement().style.position = 'absolute';
		ui.getDomElement().style.left = '20px';
		ui.getDomElement().style.top = '50%';
		ui.getDomElement().style.display = 'none';
		domElement.appendChild( ui.getDomElement() );

		ui.addListeners();

    // Made this a function of UI as opposed to HANDLERS
		ui.updateCapacity(0);




		// Signals listeners

		shared.ugcSignals.showintro.add( function ( mode ) {

			intro.getDomElement().style.display = 'block';

			objectCreator.getDomElement().style.display = 'none';
			ui.getDomElement().style.display = 'none';

		} );

		shared.ugcSignals.showobjectcreator.add( function ( mode ) {

			intro.getDomElement().style.display = 'none';

			objectCreator.getDomElement().style.display = 'block';
			ui.getDomElement().style.display = 'block';

		} );

	};

	this.show = function () {

		domElement.style.display = 'block';
		objectCreator.show();

	};

	this.hide = function () {

		domElement.style.display = 'none';
		objectCreator.hide();

	};

	this.resize = function ( width, height ) {

    // Pretty janky - George
		var nativeWidth = 1342;
		ui.scale( width / nativeWidth );
		ui.getDomElement().style.marginTop = - Math.round(300 * width /
        nativeWidth) + 'px';
		objectCreator.resize( width, height );

	};

	this.update = function () {

		objectCreator.update();
    ui.update();

	};

}

UgcSection.prototype = new Section();
UgcSection.prototype.constructor = UgcSection;
