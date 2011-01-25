var ClearEffect = function ( renderer ) {

	Effect.call( this );

	this.update = function ( i ) {

		renderer.clear();

	};

};

ClearEffect.prototype = new Effect();
ClearEffect.prototype.constructor = ClearEffect;
