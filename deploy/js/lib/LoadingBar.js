var LoadingBar = function ( callback ) {

	var domElement, loadBar, loadVal,
	totalItems = 0, doneItems = 0, maxProgress = 0;

	domElement = document.createElement( 'div' );

	loadBar = document.createElement( 'div' );
	loadBar.style.width = '180px';
	loadBar.style.background = '#fff';
	loadBar.style.borderRadius = '5px';
	loadBar.style.display = 'block';
	domElement.appendChild( loadBar );

	loadVal = document.createElement( 'div' );
	loadVal.style.position = 'relative';
	loadVal.style.top = '0px';
	loadVal.style.height = '10px';
	loadVal.style.width = '0px';
	loadVal.style.background = '#000';
	loadVal.style.borderRadius = '5px';
	loadBar.appendChild( loadVal );

	function updateProgress() {

		var progress = doneItems / totalItems;

		if ( progress > maxProgress ) {

			maxProgress = progress;
			loadVal.style.width = progress * 180 + "px";

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

	this.getDomElement = function () {

		return domElement;

	};

}
