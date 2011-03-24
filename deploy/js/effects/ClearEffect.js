var ClearEffect = function ( renderer ) {

	SequencerItem.call( this );

	this.update = function ( i ) {

		renderer.clear();

	};

};

ClearEffect.prototype = new SequencerItem();
ClearEffect.prototype.constructor = ClearEffect;
