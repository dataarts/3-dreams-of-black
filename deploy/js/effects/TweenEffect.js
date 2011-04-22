var TweenEffect = function ( object, properties_start, properties_end, easingFunction ) {

	SequencerItem.call( this );

	var _value,
	_object = object,
	_valuesStart = {},
	_valuesDelta = {},
	_easingFunction = easingFunction;

	this.init = function () {

		for ( var property in properties_start ) {

			_valuesStart[ property ] = properties_start[ property ];
			_valuesDelta[ property ] = properties_end[ property ] - properties_start[ property ];

		}

	};

	this.update = function ( progress, delta, time ) {

		_value = _easingFunction( progress );

		for ( property in _valuesDelta ) {

			_object[ property ] = _valuesStart[ property ] + _valuesDelta[ property ] * _value;

		}

	};

};


TweenEffect.prototype = new SequencerItem();
TweenEffect.prototype.constructor = TweenEffect;
