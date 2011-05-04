/*
VERSION: 1.01
DATE: 1/29/2009
ACTIONSCRIPT VERSION: 3.0
DESCRIPTION:
	This class works in conjunction with the TweenLiteVars or TweenMaxVars class to grant
	strict data typing and code hinting (in most code editors) for filter tweens. See the documentation in
	the TweenLiteVars, or TweenMaxVars for more information.

USAGE:
	
	Instead of TweenMax.to(my_mc, 1, {glowFilter:{blurX:10, blurY:10, color:0xFF0000}, onComplete:myFunction}), you could use this utility like:
	
		var myVars:TweenMaxVars = new TweenMaxVars();
		myVars.glowFilter = new GlowFilterVars(10, 10);
		myVars.onComplete = myFunction;
		TweenMax.to(my_mc, 1, myVars);
		
		
NOTES:
	- This utility is completely optional. If you prefer the shorter synatax in the regular TweenLite/TweenMax class, feel
	  free to use it. The purpose of this utility is simply to enable code hinting and to allow for strict data typing.
	- You cannot define relative tween values with this utility. If you need relative values, just use the shorter (non strictly 
	  data typed) syntax, like TweenMax.to(my_mc, 1, {glowFilter:{blurX:"-5", blurY:"3"}});

AUTHOR: Jack Doyle, jack@greensock.com
Copyright 2010, GreenSock. All rights reserved. This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
*/


package com.greensock.data {
	
	public class GlowFilterVars extends BlurFilterVars {		
		public var alpha:Number;
		public var strength:Number; 
		
		public function GlowFilterVars(blurX:Number=10, blurY:Number=10, color:uint=0xFFFFFF, alpha:Number=1, strength:Number=2, inner:Boolean=false, knockout:Boolean=false, quality:uint=2, remove:Boolean=false, index:int=-1, addFilter:Boolean=false) {
			super(blurX, blurY, quality, remove, index, addFilter);
			this.color = color;
			this.alpha = alpha;
			this.strength = strength;
			this.inner = inner;
			this.knockout = knockout;
		}
		
		override protected function initEnumerables(nulls:Array, numbers:Array):void {
			super.initEnumerables(nulls, numbers.concat(["alpha","strength"]));
		}
		
		public static function create(vars:Object):GlowFilterVars { //for parsing values that are passed in as generic Objects, like blurFilter:{blurX:5, blurY:3} (typically via the constructor)
			if (vars is GlowFilterVars) {
				return vars as GlowFilterVars;
			}
			return new GlowFilterVars(vars.blurX || 0,
									  vars.blurY || 0,
									  (vars.color == null) ? 0x000000 : vars.color,
									  vars.alpha || 0,
									  (vars.strength == null) ? 2 : vars.strength,
									  Boolean(vars.inner),
									  Boolean(vars.knockout),
									  vars.quality || 2,
									  vars.remove || false,
									  (vars.index == null) ? -1 : vars.index,
									  vars.addFilter || false);
		}
		
//---- GETTERS / SETTERS -------------------------------------------------------------------------------------
		
		/** Color. **/
		public function get color():uint {
			return uint(_values.color);
		}
		public function set color(value:uint):void {
			setProp("color", value);
		}
		
		/**  **/
		public function get inner():Boolean {
			return Boolean(_values.inner);
		}
		public function set inner(value:Boolean):void {
			setProp("inner", value);
		}
		
		/**  **/
		public function get knockout():Boolean {
			return Boolean(_values.knockout);
		}
		public function set knockout(value:Boolean):void {
			setProp("knockout", value);
		}
		

	}
	
}