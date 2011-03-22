var Tune = function ( audio ) {

	var _audio = audio,
	_bpm, _rows, _ms;

	this.getCurrentTime = function() {

		return _audio.currentTime * 1000;

	};

	this.setBPM = function ( bpm ) {

		_bpm = bpm;
		_ms = ( 1 / _bpm ) * 60000;

	};

	this.getBPM = function() {

		return _bpm;

	};

	this.setMS = function ( ms ) {

		_ms = ms;
		_bpm = ( 1 / _ms ) * 60000;

	};

	this.getMS = function () {

		return _ms;

	};

	this.setRows = function ( rows ) {

		_rows = rows;

	};

	this.getRows = function () {

		return _rows;

	};

	this.getBeatMS = function ( beat ) {

		return _ms * beat;
	};

	this.getPatternMS = function ( pattern ) {

		return _ms * _rows * pattern;

	};

}
