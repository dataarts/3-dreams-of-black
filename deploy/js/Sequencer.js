var Sequencer = function () {

	var _effect,
	_effects = [],
	_effectsActive = [],
	_effectsToRemove = [],

	_nextEffect = 0,
	_nextEffectToRemove = 0,
	_time = 0;

	this.add = function ( effect, start_time, end_time ) {

		effect.__active = false;
		effect.__start_time = start_time;
		effect.__duration = end_time - start_time;
		effect.__end_time = end_time;

		effect.init();

		_effects.push( effect );
		_effects.sort( function ( a, b ) { return a.__start_time - b.__start_time; } );

		_effectsToRemove.push( effect );
		_effectsToRemove.sort( function ( a, b ) { return a.__end_time - b.__end_time; } );

	};

	this.update = function ( time ) {

		var effect;

		if ( time < _time ) {

			this.clear();

		}

		while ( _effects[ _nextEffect ] ) {

			effect = _effects[ _nextEffect ];

			if ( effect.__start_time > time ) {

				break;

			}

			if ( !effect.__active && effect.__end_time > time ) {

				effect.show();
				effect.__active = true;

				_effectsActive.push( effect );

			}

			_nextEffect += 1;

		}

		while ( _effectsToRemove[ _nextEffectToRemove ] ) {

			effect = _effectsToRemove[ _nextEffectToRemove ];

			if ( effect.__end_time > time ) {

				break;

			}

			if ( effect.__active ) {

				effect.__active = false;
				effect.hide();

				for ( var i = 0, l = _effectsActive.length; i < l; i++ ) {

					if ( effect == _effectsActive[ i ] ) {

						_effectsActive.splice(i, 1);
					}
				}

			}

			_nextEffectToRemove += 1;

		}

		for ( var i = 0, l = _effectsActive.length; i < l; i ++ ) {

			_effect = _effectsActive[ i ];
			_effect.update( ( time - _effect.__start_time ) / _effect.__duration );

		}

		_time = time;

	};

	this.clear = function () {

		_nextEffect = 0;
		_nextEffectToRemove = 0;

		while ( _effectsActive.length ) {

			_effect = _effectsActive[ 0 ];
			_effect.__active = false;
			_effect.hide();
			_effectsActive.splice( 0, 1 );

		}

	};

};
