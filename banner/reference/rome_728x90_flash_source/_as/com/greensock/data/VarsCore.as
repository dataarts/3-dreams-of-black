/**
 * VERSION: 2.01
 * DATE: 9/23/2009
 * AS3
 * UPDATES AND DOCUMENTATION AT: http://www.TweenLite.com
 **/
package com.greensock.data {
	import flash.utils.Proxy;
	import flash.utils.flash_proxy;
/**
 * VarsCore provides a way to make an object's non-dynamic properties enumerable (only if/when the property is
 * set to a non-default value) which is necessary for many of the vars objects in the GreenSock tweening 
 * platform (TweenLiteVars, TweenMaxVars, etc.). There is no reason to use VarsCore directly, but rather use 
 * a subclass like TweenLiteVars to enable strict data typing and code hinting in modern apps like Flex Builder, FDT, etc.
 * 
 * <b>Copyright 2010, GreenSock. All rights reserved.</b> This work is subject to the terms in <a href="http://www.greensock.com/terms_of_use.html">http://www.greensock.com/terms_of_use.html</a> or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
 * 
 * @author Jack Doyle, jack@greensock.com
 */	 
	dynamic public class VarsCore extends Proxy {
		/** @private (for backwards compatibility) **/
		public const isTV:Boolean = true;
		/** @private faster to use an already-created empty Array rather than keep re-creating them. **/
		protected static const _empty:Array = [];
		
		/** @private **/
		protected var _numbers:Object = {};
		/** @private **/
		protected var _props:Array;
		/** @private **/
		protected var _values:Object = {};
		
		/** Constructor **/
		public function VarsCore() {
			initEnumerables(_empty, _empty);
		}
		
		/** @private **/
		protected function initEnumerables(nulls:Array, numbers:Array):void {
			_props = nulls.concat(numbers);
			var i:int = numbers.length;
			while (i-- > 0) {
				_numbers[numbers[i]] = true;
			}
		}
		
		/** @private **/
        flash_proxy override function getProperty(prop:*):* {
			return _values[prop];
		}
		
		/** @private **/
        flash_proxy override function setProperty(prop:*, value:*):void {
			setProp(String(prop), value);
		}
		
		flash_proxy override function hasProperty(name:*):Boolean {
	      return name in _values;
	    }

		
		/** @private **/
        flash_proxy override function deleteProperty(prop:*):Boolean {
			var i:int = _props.indexOf(prop);
			if (i != -1) {
				_props.splice(i, 1);
				delete _values[prop];
				return true;
			} else {
				return false;
			}
		}
		
        /** @private **/
        override flash_proxy function nextNameIndex(index:int):int {
            if (index >= _props.length) {
                return 0;
            } else {
				var l:int = _props.length;
				var p:String;
				for (var i:int = index; i < l; i++) {
					p = _props[i];
					if (_numbers[p]) {
						if (this[p] || this[p] == 0) {
							return i + 1;
						}
					} else if (this[p] != null) {
						return i + 1;
					}
				}
				return 0;
            }
        }
        
        /** @private **/
        override flash_proxy function nextName(index:int):String {
            return _props[index - 1];
        }
        
        /** @private **/
        protected function setProp(name:String, value:*):void {
        	if (!(name in _values)) {
				_props[_props.length] = name;
			}
			_values[name] = value;
        }
        
        protected function copyPropsTo(vars:VarsCore):VarsCore {
			for (var p:String in this) {
				vars[p] = this[p];
			}
			return vars;
		}
		
		

//---- GETTERS / SETTERS ------------------------------------------------------------------------
		
		/** @private For backwards compatibility **/
		public function get exposedVars():Object {
			return this;
		}


	}
}