/**
 * VERSION: 2.0
 * DATE: 8/1/2009
 * AS3
 * UPDATES AND DOCUMENTATION AT: http://www.TweenLite.com
 **/
package com.greensock.data {
	import com.greensock.data.VarsCore;
/**
 * This class works in conjunction with the TweenLiteVars or TweenMaxVars class to grant 
 * strict data typing and code hinting (in most code editors). See the documentation in
 * the TweenLiteVars or TweenMaxVars for more information.
 * 
 * <b>Copyright 2010, GreenSock. All rights reserved.</b> This work is subject to the terms in <a href="http://www.greensock.com/terms_of_use.html">http://www.greensock.com/terms_of_use.html</a> or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
 * 
 * @author Jack Doyle, jack@greensock.com
 */	 
	dynamic public class FilterVars extends VarsCore {
		
		public function FilterVars(remove:Boolean=false, index:int=-1, addFilter:Boolean=false) {
			super();
			this.remove = remove;
			if (index > -1) {
				this.index = index;
			}
			this.addFilter = addFilter;
		}
		
//---- GETTERS / SETTERS -----------------------------------------------------------------------------------------
			
		/** To remove the filter after the tween has completed, set remove to true. **/
		public function get remove():Boolean {
			return Boolean(_values.remove);
		}
		public function set remove(value:Boolean):void {
			setProp("remove", value);
		}
		
		/** To force TweenLite/Max to create a new filter even if there's a filter of the same kind already applied to a DisplayObject, set addFilter to true. **/
		public function get addFilter():Boolean {
			return Boolean(_values.addFilter);
		}
		public function set addFilter(value:Boolean):void {
			setProp("addFilter", value);
		}
		
		/** To define a particular index number in the target DisplayObject's filters Array for this filter, use index property. **/
		public function get index():int {
			return int(_values.index);
		}
		public function set index(value:int):void {
			setProp("index", value);
		}
		

	}
}