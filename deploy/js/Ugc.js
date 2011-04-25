var Ugc = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.backgroundColor = '#000044';

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

	};

}
