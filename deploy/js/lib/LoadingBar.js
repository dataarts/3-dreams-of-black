var LoadingBar = function ( callback ) {

	var domElement, loadBar, loadVal,
	totalItems = 0, doneItems = 0, maxProgress = 0, loadBegin = false;

	domElement = document.createElement( 'div' );

	loadBar = document.createElement( 'div' );
	loadBar.style.position = 'relative';
	loadBar.style.top = '-480px';
	loadBar.style.height = '10px';
	loadBar.style.width = '358px';
	loadBar.style.margin = '0 auto';
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
	loadVal.style.borderRadius = '5px 0px 0px 5px';
	loadBar.appendChild( loadVal );

	function updateProgress() {

		var progress = doneItems / totalItems;

		if ( progress > maxProgress ) {

			maxProgress = progress;
			loadVal.style.width = progress * 358 + "px";

		}

	};

	this.loadBegin = function () {

		loadBegin = true;

	};

	this.addItem  = function () {

		totalItems += 1;
		updateProgress();

	};

	this.completeItem = function () {

		doneItems += 1;

		updateProgress();

		if ( loadBegin && totalItems == doneItems ) {

			callback();

		}

	};

	this.getDomElement = function () {

		return domElement;

	};

	/*
	var added = 0, completed = 0, begin = false;

	this.addItem = function () {

		domElement.max = ++ added;

	};

	this.completeItem = function () {

		domElement.value = ++ completed;

		if ( begin && domElement.value == domElement.max && callback ) {

			callback();

		}

	};

	this.loadBegin = function () {

		begin = true;

	};
	*/

}
