var PointerImageEffect = function ( shared, url ) {

	SequencerItem.call( this );

	var imgElement = document.createElement( 'img' );
	imgElement.src = url;
	imgElement.style.position = "absolute";
	imgElement.style.zIndex = 1000;
	imgElement.style.display = "none";
	
	document.body.appendChild( imgElement );
	
	this.show = function ( progress ) {
		
		document.body.style.cursor = 'url("files/pointer-transparent.png"), auto';
		imgElement.style.display = "block";

	};

	this.hide = function () {
		
		imgElement.style.display = "none";
		document.body.style.cursor = "none";

	};
	
	this.update = function () {
		
		imgElement.style.left = ( shared.mouse.x - 40 ) + "px";
		imgElement.style.top = ( shared.mouse.y - 6 )+ "px";
		
	};

};

PointerImageEffect.prototype = new SequencerItem();
PointerImageEffect.prototype.constructor = PointerImageEffect;
