var PointerEffect = function ( shared, visible ) {

	SequencerItem.call( this );

	this.show = function ( progress ) {

		document.body.style.cursor = visible ? 'url("/files/mouse_ring.png"), auto' : 'none';

	};
	
	this.hide = function () {

		document.body.style.cursor = "auto";

	};

};

PointerEffect.prototype = new SequencerItem();
PointerEffect.prototype.constructor = PointerEffect;
