var Relauncher = function () {

	var domElement = document.createElement( 'div' );
	domElement.id = 'relauncher';
	domElement.style.display = 'none';
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.backgroundColor = '#ff0000';

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

	};

}
