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

	this.add = function ( item, start, end, layer ) {

		item.__active = false;
		item.__start = start;
		item.__duration = end - start;
		item.__end = end;
		item.__layer = layer;

		item.init();

		_items.push( item );
		_items.sort( function ( a, b ) { return a.__start - b.__start; } );

		_itemsToRemove.push( item );
		_itemsToRemove.sort( function ( a, b ) { return a.__end - b.__end; } );

	};

	this.update = function ( time ) {

		if ( time < _time ) {

			this.clear();
			_time = time;

		}

		while ( _items[ _nextItem ] ) {

			_item = _items[ _nextItem ];

			if ( _item.__start > time ) {

				break;

			}

			if ( !_item.__active && _item.__end > time ) {

				_item.show( ( time - _item.__start ) / _item.__duration );
				_item.__active = true;

				_itemsActive.push( _item );

				_layersNeedSorting = true;

			}

			_nextItem ++;

		}

		while ( _itemsToRemove[ _nextItemToRemove ] ) {

			_item = _itemsToRemove[ _nextItemToRemove ];

			if ( _item.__end > time ) {

				break;

			}

			if ( _item.__active ) {

				_item.hide();
				_item.__active = false;

				var i = _itemsActive.indexOf( _item );

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
			_item.update( ( time - _item.__start ) / _item.__duration, time - _time, time );

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
	show: function ( progress ) {},
	hide: function () {},
	update: function ( progress, delta, time ) {}

}
