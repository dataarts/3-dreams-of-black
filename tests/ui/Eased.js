/**
 * Created by .
 * User: georgebrower
 * Date: 4/20/11
 * Time: 9:37 PM
 * To change this template use File | Settings | File Templates.
 */
var DAT = DAT || {};
DAT.butter = DAT.butter || {};
DAT.butter.Eased = function(value, easing, tolerance) {

  var _this = this;
  var _velocity = 0;

  this.value = value || 0;
  this.dest = value || 0;
  this.tolerance = tolerance || 0.1;
  this.easing = easing || 0.1;

  this.__defineGetter__('velocity', function() {
    return _velocity;
  });

  this.update = function() {
    if (_this.hasArrived()) return;
    _velocity = (_this.dest - _this.value)*_this.easing;
    _this.value += _velocity;
    _this.updateSlave();
    if (Math.abs(_this.value - _this.dest) < _this.tolerance) {
      _this.arrive();
    }
  };

  this.hasArrived = function() {
    return _this.value == _this.dest;
  }

  this.arrive = function() {
    _arrivalCallback.call(_this);
    _this.value = _this.dest;
  }

  this.grab = function() {

  }

  this.release = function() {
    
  }


  // "Inherited"

  var _slaveObject;
  var _slaveProperty;
  var _arrivalCallback = function() {
  };

  this.slave = function(object, property) {
    _slaveObject = object;
    _slaveProperty = property;
  }

  this.unslave = function() {
    _slaveObject = undefined;
    _slaveProperty = undefined;
  };

  this.updateSlave = function() {
    if (_slaveObject == undefined || _slaveProperty == undefined) return;
    _slaveObject[_slaveProperty] = _this.value;
  };

  this.onArrival = function(arrivalCallback) {
    _arrivalCallback = arrivalCallback;
  };

  this.valueOf = function() {
    return _this.value;
  }

}

DAT.butter.Eased.prototype = new Number();
DAT.butter.Eased.prototype.constructor = DAT.butter.Eased;