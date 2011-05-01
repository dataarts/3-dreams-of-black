var UgcUI = function ( shared ) {

	var Button = function ( path ) {

		var PI2 = Math.PI * 2;

		var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute( 'style', 'fill: white; fill-opacity: 0.5' );

		var d = 'M ' + Math.round( Math.cos( 0 ) * 32 + 32 ) + ',' + Math.round( Math.sin ( 0 ) * 32 + 32 ) + ' ';

		for ( var i = 0, j = 0; i < 6; i ++, j = ( i / 6 ) * PI2 ) {

			d += Math.round( Math.cos( j ) * 32 + 32 ) + ',' + Math.round( Math.sin ( j ) * 32 + 32 ) + ' ';

		}

		d += 'z';

		path.setAttribute( 'd', d );
		path.setAttribute( 'cursor', 'pointer' );

		path.addEventListener( 'mouseover', function () { this.setAttribute( 'style', 'fill: red; fill-opacity: 0.5' ); }, false );
		path.addEventListener( 'mouseout', function () { this.setAttribute( 'style', 'fill: white; fill-opacity: 0.5' ); }, false );

		return path;

	}

	var domElement = document.createElement( 'div' );

	// TODO: Temp implementation

	var button = document.createElement('button');
	button.addEventListener( 'click', function () {

		shared.ugcSignals.submit.dispatch();

	}, false );
	button.innerHTML = 'SAVE';
	domElement.appendChild( button );

	//

	var objectPanel = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	objectPanel.setAttribute( 'viewBox', '0 0 400 200' );
	objectPanel.setAttribute( 'width', 400 );
	objectPanel.setAttribute( 'height', 200 );
	domElement.appendChild( objectPanel );

	// brush
	var button = new Button();
	button.addEventListener( 'click', function () { alert( 'brush' ); }, false );
	objectPanel.appendChild( button );

	// mirror
	var button = new Button();
	button.setAttribute( 'transform', 'translate(0,58)' );
	button.addEventListener( 'click', function () { alert( 'mirror' ); }, false );
	objectPanel.appendChild( button );

	// color
	var button = new Button();
	button.setAttribute( 'transform', 'translate(0,116)' );
	button.addEventListener( 'click', function () { alert( 'color' ); }, false );
	objectPanel.appendChild( button );

	// zoom
	var button = new Button();
	button.setAttribute( 'transform', 'translate(50,29)' );
	button.addEventListener( 'click', function () { alert( 'zoom' ); }, false );
	objectPanel.appendChild( button );

	// view
	var button = new Button();
	button.setAttribute( 'transform', 'translate(50,87)' );
	button.addEventListener( 'click', function () { alert( 'view' ); }, false );
	objectPanel.appendChild( button );

	// smooth
	var button = new Button();
	button.setAttribute( 'transform', 'translate(50,145)' );
	button.addEventListener( 'click', function () { alert( 'smooth' ); }, false );
	objectPanel.appendChild( button );

	// erase
	var button = new Button();
	button.setAttribute( 'transform', 'translate(100,58)' );
	button.addEventListener( 'click', function () { alert( 'erase' ); }, false );
	objectPanel.appendChild( button );

	// size
	var button = new Button();
	button.setAttribute( 'transform', 'translate(100,116)' );
	button.addEventListener( 'click', function () { alert( 'size' ); }, false );
	objectPanel.appendChild( button );


	this.getDomElement = function () {

		return domElement;

	}

}
