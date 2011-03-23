var LoadProgress = function ( domElement ) {

	var added = 0, completed = 0;

	this.addItem = function () {

		domElement.max = ++ added;

	}

	this.completeItem = function () {

		domElement.value = ++ completed;

	}

}
