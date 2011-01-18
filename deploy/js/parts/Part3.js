var Part3 = function ( camera, scene, renderer ) {

	Effect.call( this );

	this.init = function ( callback ) {

	};

	this.show = function () {

	};

	this.hide = function () {

	};

	this.update = function ( i ) {

		renderer.render( scene, camera );

	};

};


Part3.prototype = new Effect();
Part3.prototype.constructor = Part3;
