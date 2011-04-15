var Launcher = function () {

	var domElement = document.createElement( 'div' );
	domElement.id = 'launcher';
	domElement.style.height = window.innerHeight + 'px';

	domElement.innerHTML = [

		'<h1>ROME</h1>',
		'<progress id="loadProgress" value="0"></progress><br /><br /><br />',

		'<a href="#0" onClick="start( 0 );">Intro</a><br /><br />',

		'<a href="#0" onClick="start( 8 );">Transition to City</a><br />',
		'<a href="#16" onClick="start( 16 );">City</a><br /><br />',

		'<a href="#24" onClick="start( 24 );">Transition to Prairie</a><br />',
		'<a href="#32" onClick="start( 32 );">Prairie</a><br /><br />',

		'<a href="#40" onClick="start( 40 );">Transition to Dunes</a><br />',
		'<a href="#48" onClick="start( 48 );">Dunes</a>'

	].join( '' );

	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = window.innerHeight;

	var context = canvas.getContext( '2d' );

	var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
	gradient.addColorStop( 0, "#1e4877" );
	gradient.addColorStop( 0.5, "#4584b4" );

	context.fillStyle = gradient;
	context.fillRect( 0, 0, canvas.width, canvas.height );

	domElement.style.background = 'url(' + canvas.toDataURL('image/png') + ')';

	//

	this.getDomElement = function () {

		return domElement;

	};

	this.update = function () {

	};

}
