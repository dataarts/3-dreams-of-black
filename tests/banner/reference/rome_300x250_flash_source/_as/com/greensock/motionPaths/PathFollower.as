/**
 * VERSION: 0.1 (beta)
 * DATE: 1/19/2010
 * ACTIONSCRIPT VERSION: 3.0 
 * UPDATES AND DOCUMENTATION AT: http://www.GreenSock.com
 **/
package com.greensock.motionPaths {
/**
 * A PathFollower is used to associate a particular target object (like a MovieClip, Point, Sprite, etc.) 
 * with a MotionPath and it offers a tweenable <code>progress</code> property that manages positioning
 * the target on the path accordingly. The <code>progress</code> property is typically a value between
 * 0 and 1 where 0 is at the beginning of the path, 0.5 is in the middle, and 1 is at the end. <br /><br />
 * 
 * @example Example AS3 code:<listing version="3.0">
import com.greensock.~~;
import com.greensock.motionPaths.~~;

//create a circle motion path at coordinates x:150, y:150 with a radius of 100
var circle:Circle2D = new Circle2D(150, 150, 100);

//make the MovieClip "mc" follow the circle and start at a position of 90 degrees (this returns a PathFollower instance)
var follower:PathFollower = circle.addFollower(mc, circle.angleToProgress(90));

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
	public class PathFollower {
		/** The target object associated with the PathFollower (like a Sprite, MovieClip, Point, etc.). The object must have x and y properties. **/
		public var target:Object;
		
		/** @private **/
		public var cachedProgress:Number;
		/** @private **/
		public var cachedNext:PathFollower;
		/** @private **/
		public var cachedPrev:PathFollower;
		
		/** The MotionPath instance that this PathFollower should follow **/
		public var path:MotionPath;
		
		/**
		 * Constructor
		 * 
		 * @param target The target object associated with the PathFollower (like a Sprite, MovieClip, Point, etc.). The object must have x and y properties. 
		 */
		public function PathFollower(target:Object) {
			this.target = target;
			this.cachedProgress = 0;
		}
		
		/** 
		 * A value (typically between 0 and 1) that can be used to move all followers along the path. You can tween to
		 * values that are greater than 1 or less than 0 but the values are simply wrapped. So, for example, setting 
		 * <code>progress</code> to 1.2 is the same as setting it to 0.2 and -0.2 is the same as 0.8. If your goal is to
		 * tween the PathFollower around a Circle2D twice completely, you could just add 2 to the <code>progress</code> 
		 * value or use a relative value in the tween, like: <br /><br /><code>
		 * 
		 * TweenLite.to(myFollower, 5, {progress:"2"}); //or myFollower.progress + 2
		 * 
		 * </code>
		 **/
		public function get progress():Number {
			return this.cachedProgress;
		}
		public function set progress(value:Number):void {
			if (value > 1) {
				value -= int(value);
			} else if (value < 0) {
				value -= int(value) - 1;
			}
			this.cachedProgress = value;
			if (this.path) {
				this.path.renderObjectAt(this.target, value);
			}
		}
		
	}
}