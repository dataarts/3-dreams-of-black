var RelauncherSection = function ( shared ) {

	Section.call( this );

	var domElement = document.createElement( 'div' );
	domElement.style.display = 'none';
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.backgroundColor = '#fff';
	domElement.style.paddingTop = '0px';

	clouds = new CloudsWhite( shared );
	clouds.getDomElement().style.position = 'absolute';
	domElement.appendChild( clouds.getDomElement() );
	
	var linksParent = domElement;
	addLink( linksParent, 40, 'Explore City', 'city' ); addBreakLine( domElement );
	addLink( linksParent, 80, 'Explore Prairie', 'prairie' ); addBreakLine( domElement );
	addLink( linksParent, 120, 'Explore Dunes', 'dunes' ); addBreakLine( domElement );

	function addBreakLine( target ) {

		target.appendChild( document.createElement( 'br' ) );

	};

	function addLink( target, top, text, world ) {

		var element = document.createElement( 'span' );
		element.style.cursor = 'pointer';		
		element.style.padding = "0.5em";
		element.style.marginRight = "4px";
		element.style.zIndex = 10;
		element.style.position = "absolute";
		element.style.top = top + "px";
		element.style.width = "100px";
		element.style.backgroundColor = 'rgba(0,0,0,0.5)';
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

		clouds.show();
		domElement.style.display = 'block';

	};

	this.hide = function () {

		clouds.hide();
		domElement.style.display = 'none';

	};

	this.resize = function ( width, height ) {

		clouds.resize( width, height );

	};

	this.update = function () {
		
		clouds.update();

	};

}

RelauncherSection.prototype = new Section();
RelauncherSection.prototype.constructor = RelauncherSection;
