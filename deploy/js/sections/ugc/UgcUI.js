var UgcUI = function ( signals ) {

	var Button = function ( path ) {

		// Convert to SVG

		var PI2 = Math.PI * 2;

		var canvas = document.createElement( 'canvas' );
		canvas.width = 64;
		canvas.height = 64;

		var context = canvas.getContext( '2d' );

		context.fillStyle = 'rgba(255,255,255,0.5)';
		context.beginPath();
		context.moveTo( Math.round( Math.cos( 0 ) * 32 + 32 ), y = Math.round( Math.sin ( 0 ) * 32 + 32 ) ); 

		for ( var i = 0, j = 0; i < 6; i ++, j = ( i / 6 ) * PI2 ) {

			context.lineTo( Math.round( Math.cos( j ) * 32 + 32 ), y = Math.round( Math.sin ( j ) * 32 + 32 ) ); 

		}

		context.closePath();
		context.fill();

		return canvas;

	}

	var domElement = document.createElement( 'div' );

	// Object Panel

	var objectPanel = document.createElement( 'div' );
	domElement.appendChild( objectPanel );

	// brush
	var button = new Button();
	button.style.position = 'absolute';
	button.style.left = '0px';
	button.style.top = '0px';
	objectPanel.appendChild( button );

	// mirror
	var button = new Button();
	button.style.position = 'absolute';
	button.style.left = '0px';
	button.style.top = '58px';
	objectPanel.appendChild( button );

	// color
	var button = new Button();
	button.style.position = 'absolute';
	button.style.left = '0px';
	button.style.top = '116px';
	objectPanel.appendChild( button );

	// zoom
	var button = new Button();
	button.style.position = 'absolute';
	button.style.left = '50px';
	button.style.top = '29px';
	objectPanel.appendChild( button );

	// view
	var button = new Button();
	button.style.position = 'absolute';
	button.style.left = '50px';
	button.style.top = '87px';
	objectPanel.appendChild( button );

	// smooth
	var button = new Button();
	button.style.position = 'absolute';
	button.style.left = '50px';
	button.style.top = '145px';
	objectPanel.appendChild( button );

	// erase
	var button = new Button();
	button.style.position = 'absolute';
	button.style.left = '100px';
	button.style.top = '58px';
	objectPanel.appendChild( button );

	// size
	var button = new Button();
	button.style.position = 'absolute';
	button.style.left = '100px';
	button.style.top = '116px';
	objectPanel.appendChild( button );

	// Soup Panel


	this.getDomElement = function () {

		return domElement;

	}

}
