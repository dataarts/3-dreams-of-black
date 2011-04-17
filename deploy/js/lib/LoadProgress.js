var LoadProgress = function ( domElement, callback ) {

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

}
