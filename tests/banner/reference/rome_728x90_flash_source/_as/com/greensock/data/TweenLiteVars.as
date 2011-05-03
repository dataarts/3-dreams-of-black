/**
 * VERSION: 4.01
 * DATE: 12/2/2009
 * AS3
 * UPDATES AND DOCUMENTATION AT: http://www.TweenLite.com
 **/

package com.greensock.data {
	import com.greensock.TweenLite;
/**
 * 	There are 2 primary benefits of using this utility to define your TweenLite variables:
 *  <ol>
 *		<li> In most code editors, code hinting will be activated which helps remind you which special properties are available in TweenLite</li>
 *		<li> It allows you to code using strict datatyping (although it doesn't force you to).</li>
 *  </ol>
 *
 * <b>USAGE:</b><br /><br />
 *	
 *	Instead of <code>TweenLite.to(mc, 1, {x:300, tint:0xFF0000, onComplete:myFunction})</code>, you could use this utility like:<br /><br /><code>
 *	
 *		var myVars:TweenLiteVars = new TweenLiteVars();<br />
 *		myVars.addProp("x", 300); // use addProp() to add any property that doesn't already exist in the TweenLiteVars instance.<br />
 *		myVars.tint = 0xFF0000;<br />
 *		myVars.onComplete = myFunction;<br />
 *		TweenLite.to(mc, 1, myVars);<br /><br /></code>
 *		
 *		
 * <b>NOTES:</b><br />
 * <ul>
 *	<li> This class adds about 13 Kb to your published SWF (including all dependencies).</li>
 *	<li> This utility is completely optional. If you prefer the shorter synatax in the regular TweenLite class, feel
 *	  	 free to use it. The purpose of this utility is simply to enable code hinting and to allow for strict datatyping.</li>
 *	<li> You may add custom properties to this class if you want, but in order to expose them to TweenLite, make sure
 *	 	 you also add a getter and a setter that adds the property to the _exposedVars Object.</li>
 *	<li> You can reuse a single TweenLiteVars Object for multiple tweens if you want, but be aware that there are a few
 *	 	 properties that must be handled in a special way, and once you set them, you cannot remove them. Those properties
 *	 	 are: frame, visible, tint, and volume. If you are altering these values, it might be better to avoid reusing a TweenLiteVars</li>
 *	 	 Object.
 * </ul>
 * 
 * <b>Copyright 2010, GreenSock. All rights reserved.</b> This work is subject to the terms in <a href="http://www.greensock.com/terms_of_use.html">http://www.greensock.com/terms_of_use.html</a> or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
 * 
 * @author Jack Doyle, jack@greensock.com
 */	 
	dynamic public class TweenLiteVars extends VarsCore {
		/** @private **/
		protected static var _subVars:Object = {blurFilter:BlurFilterVars, colorMatrixFilter:ColorMatrixFilterVars, bevelFilter:BevelFilterVars, glowFilter:GlowFilterVars, transformAroundPoint:TransformAroundPointVars, transformAroundCenter:TransformAroundCenterVars, colorTransform:ColorTransformVars};
		
		/** Any data that you'd like associated with your tween. **/
		public var data:*;
		/** The number of seconds (or frames for frames-based tweens) to delay before the tween begins. **/
		public var delay:Number;
		/** An easing function (i.e. fl.motion.easing.Elastic.easeOut) The default is Regular.easeOut. **/
		public var ease:Function;
		/** An Array of extra parameter values to feed the easing equation (beyond the standard 4). This can be useful with easing equations like Elastic that accept extra parameters like the amplitude and period. Most easing equations, however, don't require extra parameters so you won't need to pass in any easeParams. **/
		public var easeParams:Array;
		/** A function to call when the tween begins. This can be useful when there's a delay and you want something to happen just as the tween begins. **/
		public var onStart:Function; 
		/** An Array of parameters to pass the onStart function. **/
		public var onStartParams:Array;
		/** A function to call whenever the tweening values are updated (on every frame during the time the tween is active). **/
		public var onUpdate:Function;
		/** An Array of parameters to pass the onUpdate function **/
		public var onUpdateParams:Array;
		/** A function to call when the tween has completed.  **/
		public var onComplete:Function;
		/** An Array of parameters to pass the onComplete function **/
		public var onCompleteParams:Array; 
		/** Allows you to associate a function with a property so that every time the tween is updated, it calls that function to get the end value for the associated property. You could, for example, tween an object's x/y coordinates to wherever the mouse is. **/
		public var dynamicProps:Object;
		/** Tweens the scrollRect property of any DisplayObject; you can define any of the following properties in the object: left, right, top, bottom, x, y, width, height. **/
		public var scrollRect:Object;
		
		/** Same as changing the "alpha" property but with the additional feature of toggling the "visible" property to false when alpha is 0. **/
		public var autoAlpha:Number;
		/** An Array containing numeric end values of the target Array. Keep in mind that the target of the tween must be an Array with at least the same length as the endArray. **/
		public var endArray:Array; 
		/** Tweens a MovieClip to a particular frame. **/
		public var frameLabel:String;
		/** Changes the volume of any object that has a soundTransform property (MovieClip, SoundChannel, NetStream, etc.) **/
		public var volume:Number;
		/** Applies a BevelFilter tween (use the BevelFilterVars class to define the values). **/
		public var bevelFilter:BevelFilterVars;
		/** Array of Objects, one for each "control point" (see documentation on Flash's curveTo() drawing method for more about how control points work). In this example, let's say the control point would be at x/y coordinates 250,50. Just make sure your my_mc is at coordinates 0,0 and then do: TweenLite.to(my_mc, 3, {bezier:[{x:250, y:50}, {x:500, y:0}]}); **/
		public var bezier:Array;
		/** Identical to bezier except that instead of passing Bezier control point values, you pass values through which the Bezier values should move. This can be more intuitive than using control points. **/
		public var bezierThrough:Array;
		/** Applies a BlurFilter tween (use the BlurFilterVars class to define the values). **/
		public var blurFilter:BlurFilterVars;
		/** Applies a ColorMatrixFilter tween (use the ColorMatrixFilterVars class to define the values). **/
		public var colorMatrixFilter:ColorMatrixFilterVars;
		/** Applies a DropShadowFilter tween (use the DropShadowFilterVars class to define the values). **/
		public var dropShadowFilter:DropShadowFilterVars;
		/** Applies a GlowFilter tween (use the GlowFilterVars class to define the values). **/
		public var glowFilter:GlowFilterVars;
		/** Although hex colors are technically numbers, if you try to tween them conventionally, you'll notice that they don't tween smoothly. To tween them properly, the red, green, and blue components must be extracted and tweened independently. TweenMax makes it easy. To tween a property of your object that's a hex color to another hex color, use this special hexColors property of TweenMax. It must be an OBJECT with properties named the same as your object's hex color properties. For example, if your my_obj object has a "myHexColor" property that you'd like to tween to red (0xFF0000) over the course of 2 seconds, do: TweenMax.to(my_obj, 2, {hexColors:{myHexColor:0xFF0000}}); You can pass in any number of hexColor properties. **/
		public var hexColors:Object;
		/**
		 * A common effect that designers/developers want is for a MovieClip/Sprite to orient itself in the direction of a Bezier path (alter its rotation). orientToBezier makes it easy. In order to alter a rotation property accurately, TweenLite/Max needs 4 pieces of information:
		 * 
		 * 1. Position property 1 (typically "x")
		 * 2. Position property 2 (typically "y")
		 * 3. Rotational property (typically "rotation")
		 * 4. Number of degrees to add (optional - makes it easy to orient your MovieClip/Sprite properly)
		 * 
		 * The orientToBezier property should be an Array containing one Array for each set of these values. For maximum flexibility, you can pass in any number of Arrays inside the container Array, one for each rotational property. This can be convenient when working in 3D because you can rotate on multiple axis. If you're doing a standard 2D x/y tween on a bezier, you can simply pass in a boolean value of true and TweenMax will use a typical setup, [["x", "y", "rotation", 0]]. Hint: Don't forget the container Array (notice the double outer brackets)  
		 */
		public var orientToBezier:Array;
		/** An object with properties that correspond to the quaternion properties of the target object. For example, if your my3DObject has "orientation" and "childOrientation" properties that contain quaternions, and you'd like to tween them both, you'd do: {orientation:myTargetQuaternion1, childOrientation:myTargetQuaternion2}. Quaternions must have the following properties: x, y, z, and w. **/
		public var quaternions:Object;
		/** An object containing a "width" and/or "height" property which will be tweened over time and applied using setSize() on every frame during the course of the tween. **/
		public var setSize:Object;
 		/** To tween any rotation property (even multiple properties) of the target object in the shortest direction, use shortRotation. For example, if myObject.rotation is currently 170 degrees and you want to tween it to -170 degrees, a normal rotation tween would travel a total of 340 degrees in the counter-clockwise direction, but if you use shortRotation, it would travel 20 degrees in the clockwise direction instead. Pass in an object in with properties that correspond to the rotation values of the target, like {rotation:-170} or {rotationX:-170, rotationY:50} **/
		public var shortRotation:Object;
 		/** Applies a transformAroundPoint tween (use the TransformAroundPointVars class to define the values). **/
		public var transformAroundPoint:TransformAroundPointVars;
 		/** Applies a transformAroundCenter tween (use the TransformAroundCenterVars class to define the values). **/
		public var transformAroundCenter:TransformAroundCenterVars;
 		/** Applies a ColorTransform tween (use the ColorTransformVars class to define the values). **/
		public var colorTransform:ColorTransformVars;
		/** Applies a motionBlur tween. **/
		public var motionBlur:Object;
		
		
		/**
		 * @param vars An Object containing properties that correspond to the properties you'd like to add to this TweenLiteVars Object. For example, TweenLiteVars({x:300, onComplete:myFunction})
		 */
		public function TweenLiteVars(vars:Object=null) {
			super();
			initEnumerables(["data","ease","easeParams","onStart","onStartParams","onUpdate","onUpdateParams","onComplete",
							 "onCompleteParams","endArray","frameLabel","bevelFilter","bezier","bezierThrough",
							 "blurFilter","colorMatrixFilter","dropShadowFilter","glowFilter","hexColors","orientToBezier","quaternions",
							 "setSize","shortRotation","transformAroundPoint","transformAroundCenter","colorTransform","motionBlur","dynamicProps"],
							 ["autoAlpha","delay","volume"]);
			if (vars != null) {
				for (var p:String in vars) {
					if (p in _subVars) {
						_subVars[p].create(vars[p]);
					} else {
						this[p] = vars[p];
					}
				}
			}
			if (TweenLite.version < 11) {
				trace("TweenLiteVars error! Please update your TweenLite class or try deleting your ASO files. TweenLiteVars requires a more recent version. Download updates at http://www.TweenLite.com.");
			}
		}
		
		/**
		 * Adds a dynamic property for tweening and allows you to set whether the end value is relative or not
		 * 
		 * @param name Property name
		 * @param value Numeric end value (or beginning value for from() calls)
		 * @param relative If true, the value will be relative to the target's current value. For example, if my_mc.x is currently 300 and you do addProp("x", 200, true), the end value will be 500.
		 */
		public function addProp(name:String, value:Number, relative:Boolean=false):void {
			this[name] = (relative) ? String(value) : value;
		}
		
		/** Clones the TweenLiteVars object. **/
		public function clone():TweenLiteVars {
			return this.copyPropsTo(new TweenLiteVars()) as TweenLiteVars;
		}
		
		
//---- GETTERS / SETTERS -------------------------------------------------------------------------------------------------------------
		
		/** To remove the tint from a DisplayObject, set removeTint to true. **/
		public function get removeTint():Boolean {
			return Boolean(_values.removeTint);
		}
		public function set removeTint(value:Boolean):void {
			setProp("removeTint", value);
		}
		
		/** To set a DisplayObject's "visible" property at the end of the tween, use this special property. **/
		public function get visible():Boolean {
			return Boolean(_values.visible);
		}
		public function set visible(value:Boolean):void {
			setProp("visible", value);
		}
		
		/** Tweens a MovieClip to a particular frame. **/
		public function get frame():int {
			return int(_values.frame);
		}
		public function set frame(value:int):void {
			setProp("frame", value);
		}
		
		/** To change a DisplayObject's tint, set this to the hex value of the color you'd like the DisplayObject to end up at(or begin at if you're using TweenLite.from()). An example hex value would be 0xFF0000. If you'd like to remove the tint from a DisplayObject, use the removeTint special property. **/
		public function get tint():uint {
			return uint(_values.tint);
		}
		public function set tint(value:uint):void {
			setProp("tint", value);
		}
		
		/** Normally, zero-duration tweens render immediately and all other tweens begin rendering on the very next frame after they are instantiated, but immediateRender allows you to override that behavior if you prefer. For example, if you're inserting a zero-duration tween into a timeline, you should set immediateRender:false so that it doesn't render immediately. **/
		public function get immediateRender():Boolean {
			return Boolean(_values.immediateRender);
		}
		public function set immediateRender(value:Boolean):void {
			setProp("immediateRender", value);
		}
		
		/** When true, the tween will flip the start and end values which is exactly what TweenLite.from() does. **/
		public function get runBackwards():Boolean {
			return Boolean(_values.runBackwards);
		}
		public function set runBackwards(value:Boolean):void {
			setProp("runBackwards", value);
		}
		
		/** If useFrames is set to true, the tweens's timing mode will be based on frames. Otherwise, it will be based on seconds/time. NOTE: a tween's timing mode is always determined by its parent timeline. **/
		public function get useFrames():Boolean {
			return Boolean(_values.useFrames);
		}
		public function set useFrames(value:Boolean):void {
			setProp("useFrames", value);
		}
		
		/** NONE = 0, ALL_IMMEDIATE = 1, AUTO = 2, CONCURRENT = 3, ALL_ONSTART = 4, PREEXISTING = 5 (2 through 5 are only available with the optional OverwriteManager add-on class which must be initted once for TweenLite, like OverwriteManager.init(). TweenMax, TimelineLite, and TimelineMax automatically init OverwriteManager. **/
		public function get overwrite():int {
			if ("overwrite" in _values) {
				return int(_values.overwrite);
			}
			return -1;
		}
		public function set overwrite(value:int):void {
			setProp("overwrite", value);
		}
		
	}
}