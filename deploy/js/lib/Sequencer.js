/**
 * @author mr.doob / http://mrdoob.com/
 */

var Sequencer = function () {

	var _item,
	_items = [],
	_itemsActive = [],
	_itemsToRemove = [],

	_nextItem = 0,
	_nextItemToRemove = 0,
	_time = 0,

	_layersNeedSorting = false;

	this.add = function ( item, start_time, end_time, layer ) {

		item.__active = false;
		item.__start_time = start_time;
		item.__duration = end_time - start_time;
		item.__end_time = end_time;
		item.__layer = layer;

		item.init();

		_items.push( item );
		_items.sort( function ( a, b ) { return a.__start_time - b.__start_time; } );

		_itemsToRemove.push( item );
		_itemsToRemove.sort( function ( a, b ) { return a.__end_time - b.__end_time; } );

	};

	this.update = function ( time ) {

		var item;

		if ( time < _time ) {

			this.clear();

		}

		while ( _items[ _nextItem ] ) {

			item = _items[ _nextItem ];

			if ( item.__start_time > time ) {

				break;

			}

			if ( !item.__active && item.__end_time > time ) {

				item.show();
				item.__active = true;

				_itemsActive.push( item );

				_layersNeedSorting = true;

			}

			_nextItem ++;

		}

		while ( _itemsToRemove[ _nextItemToRemove ] ) {

			item = _itemsToRemove[ _nextItemToRemove ];

			if ( item.__end_time > time ) {

				break;

			}

			if ( item.__active ) {

				item.hide();
				item.__active = false;

				var i = _itemsActive.indexOf( item );

				if ( i !== -1 ) {

					_itemsActive.splice( i, 1 );

				}

			}

			_nextItemToRemove ++;

		}

		if ( _layersNeedSorting ) {

			_itemsActive.sort( function ( a, b ) { return a.__layer - b.__layer; } );
			_layersNeedSorting = false;

		}

		for ( var i = 0, l = _itemsActive.length; i < l; i ++ ) {

			_item = _itemsActive[ i ];
			_item.update( ( time - _item.__start_time ) / _item.__duration );

		}

		_time = time;

	};

	this.clear = function () {

		_nextItem = 0;
		_nextItemToRemove = 0;

		while ( _itemsActive.length ) {

			_item = _itemsActive[ 0 ];
			_item.__active = false;
			_item.hide();
			_itemsActive.splice( 0, 1 );

		}

	};

};

var SequencerItem = function () {};

SequencerItem.prototype = {

	init: function () {},
	load: function () {},
	show: function () {},
	hide: function () {},
	update: function ( f ) {}

}
