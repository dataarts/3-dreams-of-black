/*
VERSION: 1.0
DATE: 1/29/2009
ACTIONSCRIPT VERSION: 3.0
DESCRIPTION:
	This class works in conjunction with the TweenLiteVars or TweenMaxVars class to grant
	strict data typing and code hinting (in most code editors) for transformAroundPoint tweens. See the documentation in
	the TweenLiteVars or TweenMaxVars for more information.

USAGE:
	
	Instead of TweenMax.to(my_mc, 1, {transformAroundPoint:{point:new Point(100, 50), scaleX:2, scaleY:1.5, rotation:30}}, onComplete:myFunction}), you could use this utility like:
	
		var myVars:TweenMaxVars = new TweenMaxVars();
		myVars.transformAroundPoint = new TransformAroundPointVars(new Point(100, 50), 2, 1.5, 30);
		myVars.onComplete = myFunction;
		TweenMax.to(my_mc, 1, myVars);
		
		
NOTES:
	- This utility is completely optional. If you prefer the shorter synatax in the regular TweenLite/TweenMax class, feel
	  free to use it. The purpose of this utility is simply to enable code hinting and to allow for strict data typing.
	- You cannot define relative tween values with this utility. 

AUTHOR: Jack Doyle, jack@greensock.com
Copyright 2010, GreenSock. All rights reserved. This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
*/


package com.greensock.data {
	import flash.geom.Point;
	
	public class TransformAroundPointVars extends VarsCore {
		public var point:Point;
		public var scaleX:Number;
		public var scaleY:Number;
		public var scale:Number;
		public var rotation:Number;
		public var width:Number;
		public var height:Number;
		public var shortRotation:Object;
		public var x:Number;
		public var y:Number;
		
		public function TransformAroundPointVars(point:Point=null, scaleX:Number=NaN, scaleY:Number=NaN, rotation:Number=NaN, width:Number=NaN, height:Number=NaN, shortRotation:Object=null, x:Number=NaN, y:Number=NaN) {
			super();
			if (point != null) {
				this.point = point;
			}
			if (scaleX || scaleX == 0) { //faster than !isNaN())
				this.scaleX = scaleX;
			}
			if (scaleY || scaleY == 0) {
				this.scaleY = scaleY;
			}
			if (rotation || rotation == 0) {
				this.rotation = rotation;
			}
			if (width || width == 0) {
				this.width = width;
			}
			if (height || height == 0) {
				this.height = height;
			}
			if (shortRotation != null) {
				this.shortRotation = shortRotation;
			}
			if (x || x == 0) {
				this.x = x;
			}
			if (y || y == 0) {
				this.y = y;
			}
		}
		
		override protected function initEnumerables(nulls:Array, numbers:Array):void {
			super.initEnumerables(nulls.concat(["point","shortRotation"]), numbers.concat(["scaleX","scaleY","scale","rotation","width","height","x","y"]));
		}
		
		public static function create(vars:Object):TransformAroundPointVars { //for parsing values that are passed in as generic Objects, like blurFilter:{blurX:5, blurY:3} (typically via the constructor)
			if (vars is TransformAroundPointVars) {
				return vars as TransformAroundPointVars;
			}
			return new TransformAroundPointVars(vars.point,
												vars.scaleX,
												vars.scaleY,
												vars.rotation,
												vars.width,
												vars.height,
												vars.shortRotation,
												vars.x,
												vars.y);
		}
		


	}
}