var RendererClearEffect = function ( renderer ) {

	Effect.call( this );

	this.update = function ( k ) {

		renderer.clear();

	};

};

RendererClearEffect.prototype = new Effect();
RendererClearEffect.prototype.constructor = RendererClearEffect;
