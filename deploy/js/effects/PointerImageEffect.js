var PointerImageEffect = function ( shared, url ) {

	SequencerItem.call( this );

	var pmouseX = 0;
	var pmouseY = 0;
	var height = 14;

	var img = document.createElement( 'div' );
			img.setAttribute("style", "width: 8px; height: 56px;");
			img.innerHTML = "<img src = '" + url + "' alt = 'mouse' />";

	var imgElement = document.createElement( 'div' );
	imgElement.setAttribute("style", "width: 8px; height: 14px;");
	imgElement.style.position = "absolute";
	imgElement.style.zIndex = 1000;
	imgElement.style.display = "none";
	imgElement.style.cursor = "none";
	imgElement.style.overflow = "hidden";
	imgElement.appendChild(img);
	
	document.body.appendChild( imgElement );
	
	this.show = function ( progress ) {
		
		// document.body.style.cursor = 'url("/files/pointer-transparent.png"), auto';
		document.body.style.cursor = "none !important";
		imgElement.style.display = "block";

	};

	shared.signals.mousemoved.add( function() {

		var difX = shared.mouse.x - pmouseX;
		var difY = shared.mouse.y - pmouseY;

		if(difX > 0) {

			if(difY > 0) {
				height = -28;
			} else if (difY < 0){
				height = -14;
			}

		} else if(difX < 0) {

			if(difY > 0) {
				height = -42;
			} else if(difY < 0) {
				height = 0;
			}

		}

	});

	this.hide = function () {
		
		imgElement.style.display = "none";
		document.body.style.cursor = "auto !important";

	};
	
	this.update = function () {

		img.style.marginTop = height + "px";
		imgElement.style.left = ( shared.mouse.x - 4 ) + "px";
		imgElement.style.top = ( shared.mouse.y - 7 )+ "px";

		pmouseX = shared.mouse.x;
		pmouseY = shared.mouse.y;
		
	};

};

PointerImageEffect.prototype = new SequencerItem();
PointerImageEffect.prototype.constructor = PointerImageEffect;
