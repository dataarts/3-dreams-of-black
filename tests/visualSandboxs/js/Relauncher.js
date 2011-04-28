var Relauncher = function ( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.backgroundColor = '#4584b4';
	domElement.style.paddingTop = '60px';

	addLink( domElement, 'Explore City', 'city' ); addBreakLine( domElement );
	addLink( domElement, 'Explore Prairie', 'prairie' ); addBreakLine( domElement );
	addLink( domElement, 'Explore Dunes', 'dunes' ); addBreakLine( domElement );

	function addBreakLine( target ) {

		target.appendChild( document.createElement( 'br' ) );

	};

	function addLink( target, text, world ) {

		var element = document.createElement( 'span' );
		element.style.cursor = 'pointer';
		element.innerHTML = text;
		element.addEventListener( 'click', function () {

			shared.signals.showexploration.dispatch();
			shared.signals.startexploration.dispatch( world );

		}, false );

		target.appendChild( element );

	};

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

	};

}
