/**
 * VERSION: 0.1 (beta)
 * DATE: 1/19/2010
 * ACTIONSCRIPT VERSION: 3.0 
 * UPDATES AND DOCUMENTATION AT: http://www.GreenSock.com
 **/
package com.greensock.motionPaths {
	import flash.display.Shape;
	import flash.events.Event;
/**
 * A MotionPath defines a path along which a PathFollower can travel, making it relatively simple to do 
 * things like tween an object in a circular path. A PathFollower's position along the path is described using
 * its <code>progress</code> property, a value between 0 and 1 where 0 is at the beginning of the path, 0.5 is in
 * the middle, and 1 is at the very end of the path. So to tween a PathFollower along the path, you can simply
 * tween its <code>progress</code> property. To tween ALL of the followers on the path at once, you can
 * tween the MotionPath's <code>progress</code> property. PathFollowers automatically wrap so that if 
 * the <code>progress</code> value exceeds 1 or drops below 0, it shows up on the other end of the path.<br /><br />
 *  
 * Since MotionPath extends the Shape class, you can add an instance to the display list to see a line representation
 * of the path drawn which can be helpful especially during the production phase. Use <code>lineStyle()</code> 
 * to adjust the color, thickness, and other attributes of the line that is drawn (or set the MotionPath's 
 * <code>visible</code> property to false or don't add it to the display list if you don't want to see the line 
 * at all). You can also adjust all of its properties like <code>scaleX, scaleY, rotation, width, height, x,</code> 
 * and <code>y</code> just like any DisplayObject. That means you can tween those values as well to achieve very 
 * dynamic, complex effects with ease.<br /><br />
 * 
 * @example Example AS3 code:<listing version="3.0">
import com.greensock.~~;
import com.greensock.plugins.~~;
import com.greensock.motionPaths.~~;
TweenPlugin.activate([Circle2DPlugin]); //only needed once in your swf, and only if you plan to use the circle2D tweening feature for convenience

//create a circle motion path at coordinates x:150, y:150 with a radius of 100
var circle:Circle2D = new Circle2D(150, 150, 100);

//tween mc along the path from the bottom (90 degrees) to 315 degrees in the counter-clockwise direction and make an extra revolution
TweenLite.to(mc, 3, {circle2D:{path:circle, startAngle:90, endAngle:315, direction:Direction.COUNTER_CLOCKWISE, extraRevolutions:1}});

//tween the circle's rotation, scaleX, scaleY, x, and y properties:
TweenLite.to(circle, 3, {rotation:180, scaleX:0.5, scaleY:2, x:250, y:200});

//show the path visually by adding it to the display list (optional)
this.addChild(circle);


//--- Instead of using the plugin, you could manually manage followers and tween their "progress" property...
 
//make the MovieClip "mc2" follow the circle and start at a position of 90 degrees (this returns a PathFollower instance)
var follower:PathFollower = circle.addFollower(mc2, circle.angleToProgress(90));

//tween the follower clockwise along the path to 315 degrees
TweenLite.to(follower, 2, {progress:circle.followerTween(follower, 315, Direction.CLOCKWISE)});

//tween the follower counter-clockwise to 200 degrees and add an extra revolution
TweenLite.to(follower, 2, {progress:circle.followerTween(follower, 200, Direction.COUNTER_CLOCKWISE, 1)});
</listing>
 * 
 * <b>NOTES</b><br />
 * <ul>
 * 		<li>All followers are automatically updated when you alter the MotionPath that they're following.</li>
 * 		<li>To tween all followers along the path at once, simply tween the MotionPath's <code>progress</code> 
 * 			property which will provide better performance than tweening each follower independently.</li>
 * </ul>
 * 
 * <b>Copyright 2010, GreenSock. All rights reserved.</b> This work is subject to the terms in <a href="http://www.greensock.com/terms_of_use.html">http://www.greensock.com/terms_of_use.html</a> or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
 * 
 * @author Jack Doyle, jack@greensock.com
 */	
	public class MotionPath extends Shape {
		/** @private **/
		protected static const _RAD2DEG:Number = 180 / Math.PI;
		/** @private **/
		protected static const _DEG2RAD:Number = Math.PI / 180;
		
		/** @private **/
		protected var _redrawLine:Boolean;
		
		/** @private **/
		protected var _thickness:Number;
		/** @private **/
		protected var _color:uint;
		/** @private **/
		protected var _lineAlpha:Number;
		/** @private **/
		protected var _pixelHinting:Boolean;
		/** @private **/
		protected var _scaleMode:String;
		/** @private **/
		protected var _caps:String;
		/** @private **/
		protected var _joints:String;
		/** @private **/
		protected var _miterLimit:Number;
		
		/** @private **/
		protected var _rootFollower:PathFollower;
		/** @private **/
		protected var _progress:Number;
		
		/** @private **/
		public function MotionPath() {
			_progress = 0;
			lineStyle(1, 0x666666, 1, false, "none", null, null, 3, true);
			this.addEventListener(Event.ADDED_TO_STAGE, onAddedToStage, false, 0, true);
		}
		
		/** @private **/
		protected function onAddedToStage(event:Event):void {
			renderAll();
		}
		
		/**
		 * Adds a follower to the path, optionally setting it to a particular progress position. If
		 * the target isn't a PathFollower instance already, one will be created for it. The target
		 * can be any object that has x and y properties.
		 * 
		 * @param target Any object that has x and y properties that you'd like to follow the path. Existing PathFollower instances are allowed.
		 * @param progress The progress position at which the target should be placed initially (0 by default)
		 * @return A PathFollower instance associated with the target (you can tween this PathFollower's <code>progress</code> property to move it along the path).
		 */
		public function addFollower(target:*, progress:Number=0):PathFollower {
			var f:PathFollower = getFollower(target) || new PathFollower(target);
			if (f.path != this) {
				if (_rootFollower) {
					_rootFollower.cachedPrev = f;
				}
				f.cachedNext = _rootFollower;
				_rootFollower = f;
				f.path = this;
				f.cachedProgress = progress;
				renderObjectAt(f.target, progress);
			}
			return f;
		}
		
		/**
		 * Removes the target as a follower. The target can be a PathFollower instance or the target associated
		 * with one of the PathFollower instances.
		 * 
		 * @param target the target or PathFollower instance to remove.
		 */
		public function removeFollower(target:*):void {
			var f:PathFollower = getFollower(target);
			if (f == null) {
				return;
			}
			if (f.cachedNext) {
				f.cachedNext.cachedPrev = f.cachedPrev;
			}
			if (f.cachedPrev) {
				f.cachedPrev.cachedNext = f.cachedNext;
			} else if (_rootFollower == f) {
				_rootFollower = null;
			}
			f.cachedNext = f.cachedPrev = null;
			f.path = null;
		}
		
		/**
		 * Returns the PathFollower instance associated with a particular target or null if none exist.
		 * 
		 * @param target The target whose PathFollower instance you want returned.
		 * @return PathFollower instance
		 */
		public function getFollower(target:Object):PathFollower {
			if (target is PathFollower) {
				return target as PathFollower;
			}
			var f:PathFollower = _rootFollower;
			while (f) {
				if (f.target == target) {
					return f;
				}
				f = f.cachedNext;
			}
			return null;
		}
		
		/** @private **/
		protected function renderAll():void {
			
		}
		
		/**
		 * Positions any object with x and y properties on the path at a specific progress position. 
		 * For example, to position <cod>mc</code> in the middle of the path, you would do:<br /><br /><code>
		 * 
		 * myPath.renderObjectAt(mc, 0.5);<br /><br /></code>
		 * 
		 * Some paths have methods to translate other meaningful information into a progress value, like
		 * for a <code>Circle2D</code> you can get the progress associated with the 90-degree position with the
		 * <code>angleToPosition()</code> method like this:<br /><br /><code>
		 * 
		 * myCircle.renderObjectAt(mc, myCircle.angleToProgress(90));
		 * 
		 * <br /></code>
		 * 
		 * @param target The target object to position
		 * @param progress The progress value (typically between 0 and 1 where 0 is the beginning of the path, 0.5 is in the middle, and 1 is at the end)
		 */
		public function renderObjectAt(target:Object, progress:Number):void {
			
		}
		
		/**
		 * Sets the line style for the path which you will only see if you add the path to the display list
		 * with something like addChild() and make sure the visible property is true. For example, to make
		 * a Circle2D visible with a red line red that's 3 pixels thick, you could do: <br /><br /><code>
		 * 
		 * var myCircle:Circle2D = new Circle2D(150, 150, 100); <br />
		 * myCircle.lineStyle(3, 0xFF0000);<br />
		 * addChild(myCircle);<br />
		 * 
		 * </code>
		 * 
		 * @param thickness line thickness
		 * @param color line color
		 * @param alpha line alpha
		 * @param pixelHinting pixel hinting
		 * @param scaleMode scale mode
		 * @param caps caps
		 * @param joints joints
		 * @param miterLimit miter limit
		 * @param skipRedraw if true, the redraw will be skipped.
		 */
		public function lineStyle(thickness:Number=1, color:uint=0x666666, alpha:Number=1, pixelHinting:Boolean=false, scaleMode:String="none", caps:String=null, joints:String=null, miterLimit:Number=3, skipRedraw:Boolean=false):void {
			_thickness = thickness;
			_color = color;
			_lineAlpha = alpha;
			_pixelHinting = pixelHinting;
			_scaleMode = scaleMode;
			_caps = caps;
			_joints = joints;
			_miterLimit = miterLimit;
			_redrawLine = true;
			if (!skipRedraw) {
				renderAll();
			}
		}
		
		/** @inheritDoc **/
		override public function get rotation():Number {
			return super.rotation;
		}
		override public function set rotation(value:Number):void {
			super.rotation = value;
			renderAll();
		}
		
		/** @inheritDoc **/
		override public function get scaleX():Number {
			return super.scaleX;
		}
		override public function set scaleX(value:Number):void {
			super.scaleX = value;
			renderAll();
		}
		
		/** @inheritDoc **/
		override public function get scaleY():Number {
			return super.scaleY;
		}
		override public function set scaleY(value:Number):void {
			super.scaleY = value;
			renderAll();
		}
		
		/** @inheritDoc **/
		override public function get x():Number {
			return super.x;
		}
		override public function set x(value:Number):void {
			super.x = value;
			renderAll();
		}
		
		/** @inheritDoc **/
		override public function get y():Number {
			return super.y;
		}
		override public function set y(value:Number):void {
			super.y = value;
			renderAll();
		}
		
		/** @inheritDoc **/
		override public function get width():Number {
			return super.width;
		}
		override public function set width(value:Number):void {
			super.width = value;
			renderAll();
		}
		
		/** @inheritDoc **/
		override public function get height():Number {
			return super.height;
		}
		override public function set height(value:Number):void {
			super.height = value;
			renderAll();
		}
		
		/** @inheritDoc **/
		override public function get visible():Boolean {
			return super.visible;
		}
		override public function set visible(value:Boolean):void {
			super.visible = value;
			_redrawLine = true;
			renderAll();
		}
		
		/** 
		 * A value (typically between 0 and 1) that can be used to move all followers along the path. Unlike a PathFollower's
		 * <code>progress</code>, this value is not absolute - it simply facilitates movement of followers together along the 
		 * path in a way that performs better than tweening each follower independently (plus it's easier). You can tween to
		 * values that are greater than 1 or less than 0 but the values are simply wrapped. So, for example, setting 
		 * <code>progress</code> to 1.2 is the same as setting it to 0.2 and -0.2 is the same as 0.8. If your goal is to
		 * tween all followers around a Circle2D twice completely, you could just add 2 to the progress value or use a
		 * relative value in the tween, like: <br /><br /><code>
		 * 
		 * TweenLite.to(myCircle, 5, {progress:"2"}); //or myCircle.progress + 2
		 * 
		 * </code>
		 **/
		public function get progress():Number {
			return _progress;
		}
		public function set progress(value:Number):void {
			if (value > 1) {
				value -= int(value);
			} else if (value < 0) {
				value -= int(value) - 1;
			}
			var dif:Number = value - _progress;
			var f:PathFollower = _rootFollower;
			while (f) {
				f.cachedProgress += dif;
				f = f.cachedNext;
			}
			_progress = value;
			renderAll();
		}
		
		/** Returns an array of all PathFollower instances associated with this path **/
		public function get followers():Array {
			var a:Array = [];
			var cnt:uint = 0;
			var f:PathFollower = _rootFollower;
			while (f) {
				a[cnt++] = f;
				f = f.cachedNext;
			}
			return a;
		}
		
		/** Returns an array of all target instances associated with the PathFollowers of this path **/
		public function get targets():Array {
			var a:Array = [];
			var cnt:uint = 0;
			var f:PathFollower = _rootFollower;
			while (f) {
				a[cnt++] = f.target;
				f = f.cachedNext;
			}
			return a;
		}

	}
}