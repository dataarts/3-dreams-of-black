var PointerEffect = function ( shared, visible ) {

	SequencerItem.call( this );

	this.show = function ( progress ) {

		document.body.style.cursor = visible ? 'url("files/pointer.png"), auto' : 'none';

	};

};

PointerEffect.prototype = new SequencerItem();
PointerEffect.prototype.constructor = PointerEffect;
