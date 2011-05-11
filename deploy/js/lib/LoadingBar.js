var LoadingBar = function ( callback ) {

	var domElement, loadBar, loadVal, mouseGif,
	totalItems = 0, doneItems = 0, maxProgress = 0;

	domElement = document.createElement( 'div' );

	loadBar = document.createElement( 'div' );
	loadBar.style.position = 'absolute';
	loadBar.style.display = 'block';
	loadBar.style.width = '275px';
	loadBar.style.height = '8px';
	loadBar.style.borderStyle = 'solid';
	loadBar.style.borderColor = 'rgba(255,255,255,0.5)';
	//loadBar.style.background = 'rgba(255,255,255,0.15)';
	loadBar.style.borderWidth = '1px';
	loadBar.style.borderRadius = '5px';
	loadBar.style.marginLeft = '12px';
	domElement.appendChild( loadBar );

	loadVal = document.createElement( 'div' );
	loadVal.style.position = 'absolute';
	loadVal.style.height = '10px';
	loadVal.style.width = '0px';
	loadVal.style.background = '#fff';
	loadVal.style.borderRadius = '5px';
	loadVal.style.marginLeft = '12px';
	domElement.appendChild( loadVal );

	mouseGif = document.createElement( 'div' );
	mouseGif.setAttribute("style", "margin: 30px auto 0 auto;");
	mouseGif.innerHTML = "<img src = '/files/mouse_loading.png' alt = 'arrows' />";
	mouseGif.style.marginLeft = '53px';
	domElement.appendChild( mouseGif );

	domElement.style.margin = "-5px 0 0 0";

	function updateProgress() {

		var progress = doneItems / totalItems;

		if ( progress > maxProgress ) {

			maxProgress = progress;
			loadVal.style.width = progress * 275 + "px";

		}

	};

	this.addItem  = function () {

		totalItems ++;
		updateProgress();

	};

	this.completeItem = function () {

		doneItems ++;

		updateProgress();

		if ( totalItems != 0 && totalItems == doneItems ) {

			callback();

		}

	};

	this.getMouseInfo = function() {

		return mouseGif;

	};

	this.getDomElement = function () {

		return domElement;

	};

}
