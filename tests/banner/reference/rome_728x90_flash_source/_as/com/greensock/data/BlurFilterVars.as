/*
VERSION: 1.01
DATE: 1/29/2009
ACTIONSCRIPT VERSION: 3.0
DESCRIPTION:
	This class works in conjunction with the TweenLiteVars or TweenMaxVars class to grant
	strict data typing and code hinting (in most code editors) for filter tweens. See the documentation in
	the TweenLiteVars or TweenMaxVars for more information.

USAGE:
	
	Instead of TweenMax.to(my_mc, 1, {blurFilter:{blurX:10, blurY:10}, onComplete:myFunction}), you could use this utility like:
	
		var myVars:TweenMaxVars = new TweenMaxVars();
		myVars.blurFilter = new BlurFilterVars(10, 10);
		myVars.onComplete = myFunction;
		TweenMax.to(my_mc, 1, myVars);
		
		
NOTES:
	- This utility is completely optional. If you prefer the shorter synatax in the regular TweenLite/TweenMax class, feel
	  free to use it. The purpose of this utility is simply to enable code hinting and to allow for strict data typing.
	- You cannot define relative tween values with this utility. If you need relative values, just use the shorter (non strictly 
	  data typed) syntax, like TweenMax.to(my_mc, 1, {blurFilter:{blurX:"-5", blurY:"3"}});

AUTHOR: Jack Doyle, jack@greensock.com
Copyright 2010, GreenSock. All rights reserved. This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
*/


package com.greensock.data {
	public class BlurFilterVars extends FilterVars {
		public var blurX:Number;
		public var blurY:Number;
		
		public function BlurFilterVars(blurX:Number=10, blurY:Number=10, quality:uint=2, remove:Boolean=false, index:int=-1, addFilter:Boolean=false) {
			super(remove, index, addFilter);
			this.blurX = blurX;
			this.blurY = blurY;
			this.quality = quality;
		}
		
		override protected function initEnumerables(nulls:Array, numbers:Array):void {
			super.initEnumerables(nulls, numbers.concat(["blurX","blurY"]));
		}
		
		public static function create(vars:Object):BlurFilterVars { //for parsing values that are passed in as generic Objects, like blurFilter:{blurX:5, blurY:3} (typically via the constructor)
			if (vars is BlurFilterVars) {
				return vars as BlurFilterVars;
			}
			return new BlurFilterVars(vars.blurX || 0,
									  vars.blurY || 0,
									  vars.quality || 2,
									  vars.remove || false,
									  (vars.index == null) ? -1 : vars.index,
									  vars.addFilter || false);
		}
		
//---- GETTERS / SETTERS ------------------------------------------------------------------------------
		
		/** Quality (1, 2, or 3). **/
		public function get quality():uint {
			return uint(_values.quality);
		}
		public function set quality(value:uint):void {
			setProp("quality", value);
		}

	}
}