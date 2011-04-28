var UgcSection = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';

	var objectCreator = new ObjectCreator( shared );
	domElement.appendChild( objectCreator.getDomElement() );

	this.getDomElement = function () {

		return domElement;

	};

	this.show = function () {

		domElement.style.display = 'block';

	};

	this.hide = function () {

		domElement.style.display = 'none';

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
