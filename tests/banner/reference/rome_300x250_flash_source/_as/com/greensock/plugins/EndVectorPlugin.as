/**
 * VERSION: 0.9
 * DATE: 10/22/2009
 * ACTIONSCRIPT VERSION: 3.0 
 * UPDATES AND DOCUMENTATION AT: http://blog.greensock.com
 **/
package com.greensock.plugins {
	import com.greensock.*;
	
	import flash.display.*;
/**
 * Tweens numbers in an Vector.<Number>. Remember, Vectors require that you publish to <strong>Flash Player 10</strong> or later.<br /><br />
 * 
 * <b>USAGE:</b><br /><br />
 * <code>
 * 		import com.greensock.TweenLite; <br />
 * 		import com.greensock.plugins.TweenPlugin; <br />
 * 		import com.greensock.plugins.EndVectorPlugin; <br />
 * 		TweenPlugin.activate([EndVectorPlugin]); //activation is permanent in the SWF, so this line only needs to be run once.<br /><br />
 * 
 * 		var v:Vector.<Number> = new Vector.<Number>();<br />
 * 		v[0] = 0;<br />
 * 		v[1] = 1;<br />
 * 		v[2] = 2;<br />
 * 		var end:Vector.<Number> = new Vector.<Number>();<br />
 * 		end[0] = 100;<br />
 * 		end[1] = 250;<br />
 * 		end[2] = 500;<br />
 * 		TweenLite.to(v, 3, {endVector:end, onUpdate:report}); <br />
 * 		function report():void {<br />
 * 			trace(v);<br />
 * 		}<br /><br />
 * </code>
 * 
 * <b>Copyright 2010, GreenSock. All rights reserved.</b> This work is subject to the terms in <a href="http://www.greensock.com/terms_of_use.html">http://www.greensock.com/terms_of_use.html</a> or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
 * 
 * @author Jack Doyle, jack@greensock.com
 */	
	public class EndVectorPlugin extends TweenPlugin {
		/** @private **/
		public static const API:Number = 1.0; //If the API/Framework for plugins changes in the future, this number helps determine compatibility
		
		/** @private **/
		protected var _v:Vector.<Number>;
		/** @private **/
		protected var _info:Vector.<VectorInfo> = new Vector.<VectorInfo>();
		
		/** @private **/
		public function EndVectorPlugin() {
			super();
			this.propName = "endVector"; //name of the special property that the plugin should intercept/manage
			this.overwriteProps = ["endVector"];
		}
		
		/** @private **/
		override public function onInitTween(target:Object, value:*, tween:TweenLite):Boolean {
			if (!(target is Vector.<Number>) || !(value is Vector.<Number>)) {
				return false;
			}
			init(target as Vector.<Number>, value as Vector.<Number>);
			return true;
		}
		
		/** @private **/
		public function init(start:Vector.<Number>, end:Vector.<Number>):void {
			_v = start;
			var i:int = end.length, cnt:uint = 0;
			while (i--) {
				if (_v[i] != end[i]) {
					_info[cnt++] = new VectorInfo(i, _v[i], end[i] - _v[i]);
				}
			}
		}
		
		/** @private **/
		override public function set changeFactor(n:Number):void {
			var i:int = _info.length, vi:VectorInfo;
			if (this.round) {
				var val:Number;
				while (i--) {
					vi = _info[i];
					val = vi.start + (vi.change * n);
					_v[vi.index] = (val > 0) ? int(val + 0.5) : int(val - 0.5); //4 times as fast as Math.round()
				}
			} else {
				while (i--) {
					vi = _info[i];
					_v[vi.index] = vi.start + (vi.change * n);
				}
			}
		}
		
	}
}

internal class VectorInfo {
	public var index:uint;
	public var start:Number;
	public var change:Number;
	
	public function VectorInfo(index:uint, start:Number, change:Number) {
		this.index = index;
		this.start = start;
		this.change = change;
	}
}