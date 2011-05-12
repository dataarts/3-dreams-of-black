/**
 * @author / http://jonobr1.com/
 */

var UgcIntro = function( shared ) {

	var domElement = document.createElement( 'div' );
	domElement.style.position = 'absolute';
	domElement.style.width = window.innerWidth + 'px';
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.background = 'rgba(0,0,0,0.75)';

	var instructions = document.createElement( 'div' );
			// instructions.setAttribute('title', '3 Dreams of Black Dream Tool. Build your own object to add to the 3rd dream, a collective consciousness of a world gone by.')
			instructions.style.position = "absolute";
			instructions.style.left = (window.innerWidth / 2.0 - 384) + "px";
			instructions.style.top = (window.innerHeight / 2.0 - 97) + "px";
			instructions.style.width = "272px";
			instructions.style.height = "137px";
			instructions.style.background = 'url(/files/ugcIntro/instructions.png) 0 0 no-repeat';

	domElement.appendChild( instructions );

	var sky = document.createElement( 'div' );
			sky.style.position = "absolute";
			sky.style.left = (window.innerWidth / 2.0 + 38) + "px";
			sky.style.top = (window.innerHeight / 2.0 - 197) + "px";
			sky.style.width = "234px";
			sky.style.height = "71px";
			sky.style.overflow = "hidden";
			sky.style.cursor = "pointer";

	var skyImage = document.createElement( 'img' );
			skyImage.setAttribute('src', '/files/ugcIntro/sky.png');
			// skyImage.setAttribute('title', 'Create a daydream of the future.');
			skyImage.setAttribute('alt', 'SKY');
			skyImage.style.display = "block";

	sky.appendChild( skyImage );

	var ground = document.createElement( 'div' );
			ground.style.position = "absolute";
			ground.style.left = (window.innerWidth / 2.0 + 54) + "px";
			ground.style.top = (window.innerHeight / 2.0 + 62) + "px";
			ground.style.width = "197px";
			ground.style.height = "71px";
			ground.style.overflow = "hidden";
			ground.style.cursor = "pointer";

	var groundImage = document.createElement( 'img' );
			groundImage.setAttribute('src', '/files/ugcIntro/ground.png');
			// groundImage.setAttribute('title', 'Build a memory of the past');
			groundImage.setAttribute('alt', 'GROUND');
			groundImage.style.display = "block";

	ground.appendChild( groundImage );

	domElement.appendChild( sky );
	domElement.appendChild( ground );

	sky.addEventListener("mouseover", function() {

		skyImage.style.marginTop = "-71px";

	}, false);

	sky.addEventListener("mouseout", function() {

		skyImage.style.marginTop = "0px";

	}, false);

	sky.addEventListener("click", function() {

		shared.ugcSignals.showobjectcreator.dispatch( 1 );

	}, false);
	
	ground.addEventListener("mouseover", function() {

		groundImage.style.marginTop = "-71px";

	}, false);

	ground.addEventListener("mouseout", function() {

		groundImage.style.marginTop = "0px";

	}, false);

	ground.addEventListener("click", function() {

		shared.ugcSignals.showobjectcreator.dispatch( 0 );

	}, false);

	function createDomElement( parent, element, id, _class, contents ) {

		var dom = document.createElement( element );
		dom.setAttribute( "id", id );
		dom.setAttribute( "class", _class );
		dom.innerHTML = contents;
		parent.appendChild( dom );
		return dom;

	};

	this.show = function() {

		

	};

	this.resize = function( width, height ) {

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		instructions.style.left = (width / 2.0 - 384) + "px";
		instructions.style.top = (height / 2.0 - 97) + "px";

		sky.style.left = (width / 2.0 + 38) + "px";
		sky.style.top = (height / 2.0 - 197) + "px";

		ground.style.left = (width / 2.0 + 54) + "px";
		ground.style.top = (height / 2.0 + 62) + "px";

	};

	this.hide = function() {

		

	};

	this.getDomElement = function() {

		return domElement;

	};

	this.update = function() {

		

	};

};
