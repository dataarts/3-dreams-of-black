var UgcSection = function ( shared ) {

	var objectCreator, ui;

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	this.getDomElement = function () {

		return domElement;

	};

	this.load = function () {

		var Signal = signals.Signal;

		shared.ugcSignals = {};
		shared.ugcSignals.submit = new Signal();

		objectCreator = new UgcObjectCreator( shared );
		domElement.appendChild( objectCreator.getDomElement() );

		ui = new UgcUI( shared );
		ui.getDomElement().style.position = 'absolute';
		ui.getDomElement().style.left = '100px';
		ui.getDomElement().style.top = '100px';
		domElement.appendChild( ui.getDomElement() );

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

		objectCreator.resize( width, height );

	};

	this.update = function () {

		objectCreator.update();

	};

}

UgcSection.prototype = new Section();
UgcSection.prototype.constructor = UgcSection;
