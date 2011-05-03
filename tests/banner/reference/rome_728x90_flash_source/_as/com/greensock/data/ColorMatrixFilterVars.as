/*
VERSION: 1.01
DATE: 1/29/2009
ACTIONSCRIPT VERSION: 3.0
DESCRIPTION:
	This class works in conjunction with the TweenLiteVars or TweenMaxVars class to grant
	strict data typing and code hinting (in most code editors) for filter tweens. See the documentation in
	the TweenLiteVars or TweenMaxVars for more information.

USAGE:
	
	Instead of TweenMax.to(my_mc, 1, {colorMatrixFilter:{colorize:0xFF0000, amount:0.5}, onComplete:myFunction}), you could use this utility like:
	
		var myVars:TweenMaxVars = new TweenMaxVars();
		myVars.colorMatrixFilter = new ColorMatrixFilterVars(0xFF0000, 0.5);
		myVars.onComplete = myFunction;
		TweenMax.to(my_mc, 1, myVars);
		
		
NOTES:
	- This utility is completely optional. If you prefer the shorter synatax in the regular TweenLite/TweenMax class, feel
	  free to use it. The purpose of this utility is simply to enable code hinting and to allow for strict data typing.
	- You cannot define relative tween values with this utility. If you need relative values, just use the shorter (non strictly 
	  data typed) syntax, like TweenMax.to(my_mc, 1, {colorMatrixFilter:{contrast:0.5, relative:true}});

AUTHOR: Jack Doyle, jack@greensock.com
Copyright 2010, GreenSock. All rights reserved. This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
*/


package com.greensock.data {
	import com.greensock.plugins.*;
	
	public class ColorMatrixFilterVars extends FilterVars {
		protected static var _ID_MATRIX:Array = [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0];
		protected static var _lumR:Number = 0.212671; //Red constant - used for a few color matrix filter functions
		protected static var _lumG:Number = 0.715160; //Green constant - used for a few color matrix filter functions
		protected static var _lumB:Number = 0.072169; //Blue constant - used for a few color matrix filter functions
		
		public var matrix:Array;
		
		public function ColorMatrixFilterVars(colorize:uint=0xFFFFFF, amount:Number=1, saturation:Number=1, contrast:Number=1, brightness:Number=1, hue:Number=0, threshold:Number=-1, remove:Boolean=false, index:int=-1, addFilter:Boolean=false) {
			super(remove, index, addFilter);
			this.matrix = _ID_MATRIX.slice();
			if (brightness != 1) {
				setBrightness(brightness);
			}
			if (contrast != 1) {
				setContrast(contrast);
			}
			if (hue != 0) {
				setHue(hue);
			}
			if (saturation != 1) {
				setSaturation(saturation);
			}
			if (threshold != -1) {
				setThreshold(threshold);
			}
			if (colorize != 0xFFFFFF) {
				setColorize(colorize, amount);
			}
		}
		
		override protected function initEnumerables(nulls:Array, numbers:Array):void {
			super.initEnumerables(nulls.concat(["matrix"]), numbers);
		}
		
		public function setBrightness(n:Number):void {
			this.matrix = this.exposedVars.matrix = ColorMatrixFilterPlugin.setBrightness(this.matrix, n);
		}
		public function setContrast(n:Number):void {
			this.matrix = this.exposedVars.matrix = ColorMatrixFilterPlugin.setContrast(this.matrix, n);
		}
		public function setHue(n:Number):void {
			this.matrix = this.exposedVars.matrix = ColorMatrixFilterPlugin.setHue(this.matrix, n);
		}
		public function setSaturation(n:Number):void {
			this.matrix = this.exposedVars.matrix = ColorMatrixFilterPlugin.setSaturation(this.matrix, n);
		}
		public function setThreshold(n:Number):void {
			this.matrix = this.exposedVars.matrix = ColorMatrixFilterPlugin.setThreshold(this.matrix, n);
		}
		public function setColorize(color:uint, amount:Number=1):void {
			this.matrix = this.exposedVars.matrix = ColorMatrixFilterPlugin.colorize(this.matrix, color, amount);
		}
		
		public static function create(vars:Object):ColorMatrixFilterVars { //for parsing values that are passed in as generic Objects, like blurFilter:{blurX:5, blurY:3} (typically via the constructor)
			var v:ColorMatrixFilterVars;
			if (vars is ColorMatrixFilterVars) {
				v = vars as ColorMatrixFilterVars;
			} else if (vars.matrix != null) {
				v = new ColorMatrixFilterVars();
				v.matrix = vars.matrix;
			} else {
				v = new ColorMatrixFilterVars(vars.colorize || 0xFFFFFF,
											  (vars.amount == null) ? 1 : vars.amount,
											  (vars.saturation == null) ? 1 : vars.saturation,
											  (vars.contrast == null) ? 1 : vars.contrast,
											  (vars.brightness == null) ? 1 : vars.brightness,
											  vars.hue || 0,
											  (vars.threshold == null) ? -1 : vars.threshold,
											  vars.remove || false,
											  (vars.index == null) ? -1 : vars.index,
											  vars.addFilter || false);
			}
			return v;
		}
				

	}
	
}