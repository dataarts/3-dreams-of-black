var RelauncherSection = function ( shared ) {

	Section.call( this );

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

RelauncherSection.prototype = new Section();
RelauncherSection.prototype.constructor = RelauncherSection;
