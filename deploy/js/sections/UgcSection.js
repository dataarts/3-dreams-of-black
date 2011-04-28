var UgcSection = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.backgroundColor = '#000044';

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

		

	};

	this.update = function () {

		

	};

}

UgcSection.prototype = new Section();
UgcSection.prototype.constructor = UgcSection;
