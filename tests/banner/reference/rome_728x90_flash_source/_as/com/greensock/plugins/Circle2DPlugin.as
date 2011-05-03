/**
 * VERSION: 0.1 (beta)
 * DATE: 1/19/2010
 * ACTIONSCRIPT VERSION: 3.0 
 * UPDATES AND DOCUMENTATION AT: http://www.GreenSock.com
 **/
package com.greensock.plugins {
	import com.greensock.*;
	import com.greensock.motionPaths.Circle2D;
	import com.greensock.motionPaths.PathFollower;
	import flash.geom.Matrix;
	import flash.display.*;
/**
 * Tweens an object along a Circle2D motion path in any direction (clockwise, counter-clockwise, or shortest).
 * The plugin recognizes the following properties:
 * <ul>
 * 		<li><b>path</b> : Circle2D -  The Circle2D instance to follow (com.greensock.motionPaths.Circle2D)</li>
 * 		<li><b>startAngle</b> : Number - The position at which the target should begin its rotation (described 
 * 							   in degrees unless useRadians is true in which case it is described in radians). 
 * 							   For example, to begin at the top of the circle, use 270 or -90 as the startAngle.</li>
 * 		<li><b>endAngle</b> : Number - The position at which the target should end its rotation (described in
 * 							 degrees unless useRadians is true in which case it is described in radians).
 * 							 For example, to end at the bottom of the circle, use 90 as the endAngle</li>
 * 		<li><b>direction</b> : String - The direction in which the target should travel around the path. Options are
 * 							  <code>Direction.CLOCKWISE</code> ("clockwise"), <code>Direction.COUNTER_CLOCKWISE</code>
 * 							 ("counterClockwise"), or <code>Direction.SHORTEST</code> ("shortest").</li>
 * 		<li><b>extraRevolutions</b> : uint - If instead of going directly to the endAngle, you want the target to
 * 									 travel one or more extra revolutions around the path before going to the endAngle, 
 * 									 define that number of revolutions here. </li>
 * 		<li><b>useRadians</b> : Boolean - If you prefer to define values in radians instead of degrees, set useRadians to true.</li>
 * </ul>
 * 
 * <br /><br />
 * 
 * <b>USAGE:</b><br /><br />
 * <code>
 * 		import com.greensock.~~; <br />
 * 		import com.greensock.plugins.~~; <br />
 * 		import com.greensock.motionPaths.~~<br />
 * 		TweenPlugin.activate([Circle2DPlugin]); //activation is permanent in the SWF, so this line only needs to be run once.<br /><br />
 * 
 * 		var circle:Circle2D = new Circle2D(150, 150, 100);
 * 		TweenLite.to(mc, 2, {circle2D:{path:circle, startAngle:90, endAngle:270, direction:Direction.CLOCKWISE, extraRevolutions:2}}); <br /><br />
 * </code>
 * 
 * <b>Copyright 2010, GreenSock. All rights reserved.</b> This work is subject to the terms in <a href="http://www.greensock.com/terms_of_use.html">http://www.greensock.com/terms_of_use.html</a> or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
 * 
 * @author Jack Doyle, jack@greensock.com
 */
	public class Circle2DPlugin extends TweenPlugin {
		/** @private **/
		public static const API:Number = 1.0; //If the API/Framework for plugins changes in the future, this number helps determine compatibility
		/** @private **/
		private static const _2PI:Number = Math.PI * 2;
		
		/** @private **/
		protected var _target:Object;
		/** @private **/
		protected var _autoRemove:Boolean;
		/** @private **/
		protected var _start:Number;
		/** @private **/
		protected var _change:Number;
		/** @private **/
		protected var _circle:Circle2D;
		
		/** @private **/
		public function Circle2DPlugin() {
			super();
			this.propName = "circle2D";
			this.overwriteProps = ["x","y"];
		}
		
		/** @private **/
		override public function onInitTween(target:Object, value:*, tween:TweenLite):Boolean {
			if (!("path" in value) || !(value.path is Circle2D)) {
				trace("Circle2DPlugin error: invalid 'path' property. Please define a Circle2D instance.");
				return false;
			}
			_target = target;
			_circle = value.path as Circle2D;
			
			var f:PathFollower = _circle.getFollower(target);
			if (f != null && !("startAngle" in value)) {
				_start = f.progress;
			} else {
				_start = _circle.angleToProgress(value.startAngle || 0, value.useRadians);
				_circle.renderObjectAt(_target, _start);
			}
			_change = Number(_circle.anglesToProgressChange(_circle.progressToAngle(_start), value.endAngle || 0, value.direction || "clockwise", value.extraRevolutions || 0, Boolean(value.useRadians)));
			return true;
		}
		
		/** @private **/
		override public function killProps(lookup:Object):void {
			super.killProps(lookup);
			if (("x" in lookup) || ("y" in lookup)) {
				this.overwriteProps = [];
			}
		}
		
		/** @private **/
		override public function set changeFactor(n:Number):void {
			var angle:Number = (_start + (_change * n)) * _2PI;
			var radius:Number = _circle.radius;
			var m:Matrix = _circle.transform.matrix;
			var px:Number = Math.cos(angle) * radius;
			var py:Number = Math.sin(angle) * radius;
			_target.x = px * m.a + py * m.c + m.tx;
			_target.y = px * m.b + py * m.d + m.ty;
		}

	}
}