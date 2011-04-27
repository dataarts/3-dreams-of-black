package curr {

	// import statements
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.display.Sprite;
	import com.greensock.TweenLite;
	import com.greensock.easing.*;	

	// class:			Main
	// description:
	// ------------------------------------------------
	public class Main {
		
		// movieclips
		public var mc:MovieClip;
		public var mcMain:MovieClip;
		// grid object
    public var grid:Grid;
			
		// Main constructor
		// ------------------------------------------------
		public function Main(mcPm:MovieClip) {
			mc = mcPm;
			// initialize
			init();
		}

		// function:	init
		// desc:
		// ------------------------------------------------	
		public function init():void {
			// link to main mc on stage
			mcMain = mc.mcMain;
			// link mc back to this
			mc["obj"] = mcMain["obj"] = this;
			//
			grid = new Grid(mc.mcMain.mcContent.mcGrid, this);
			// start animation
			begin();
		}

		// function:	begin
		// desc:
		// ------------------------------------------------	
		public function begin():void {
			// start it off
			timeline("tml0");
		}
		
		// function:	introDone
		// desc:
		// ------------------------------------------------	
		public function introDone():void {
			trace("introDone()");
		}		
		
		// function:	timeline
		// desc:
		// ------------------------------------------------	
		public function timeline(s:String):void {
			
			var dur, del, sca1, x1, y1, tw, done;
			var durFadeIn = 1.8;
			var durFadeOut = 1.5;
			var durReadText = 0.3;
			
			switch (s) {
			  
			  // Fade in text.
				case "tml0":
				  del = 1.8;
  				done = function() { timeline("tml1"); };
				  tw = TweenLite.to(mcMain.mcContent.mcText0, durFadeIn, {delay:del, alpha:1, ease:Cubic.easeIn, onComplete:done});
					break;					
			  // Fade out text.
				case "tml1":
				  done = function() { timeline("tml2"); };
			    tw = TweenLite.to(mcMain.mcContent.mcText0, durFadeOut, {delay:durReadText, alpha:0, ease:Linear.easeNone, onComplete:done});
					break;
					
					
			  // Fade in text.
				case "tml2":
				  del = 0.2;
  				done = function() { timeline("tml3"); };
				  tw = TweenLite.to(mcMain.mcContent.mcText1, durFadeIn, {delay:del, alpha:1, ease:Cubic.easeIn, onComplete:done});
					break;					
			  // Fade out text.
				case "tml3":
				  done = function() { timeline("tml4"); };
			    tw = TweenLite.to(mcMain.mcContent.mcText1, durFadeOut, {delay:durReadText, alpha:0, ease:Linear.easeNone, onComplete:done});
					break;
					
			  // Fade in text.
				case "tml4":
				  del = 0.2;
  				done = function() { timeline("tml5"); };
				  tw = TweenLite.to(mcMain.mcContent.mcText2, durFadeIn, {delay:del, alpha:1, ease:Cubic.easeIn, onComplete:done});
					break;					
			  // Fade out text.
				case "tml5":
				  done = function() { timeline("tml6"); };
			    tw = TweenLite.to(mcMain.mcContent.mcText2, durFadeOut, {delay:durReadText, alpha:0, ease:Linear.easeNone, onComplete:done});
					break;
					

			  // Fade in text.
				case "tml6":
				  del = 0.2;
  				done = function() { timeline("tml7"); };
				  tw = TweenLite.to(mcMain.mcContent.mcText3, durFadeIn, {delay:del, alpha:1, ease:Cubic.easeIn, onComplete:done});
					break;					
			  // Fade out text.
				case "tml7":
				  done = function() { timeline("tml8"); };
			    tw = TweenLite.to(mcMain.mcContent.mcText3, durFadeOut, {delay:durReadText, alpha:0, ease:Linear.easeNone, onComplete:done});
					break;					
									
			  // Fade in ending title.
				case "tml8":
  				done = function() { timeline("tml9"); };
  				// Fade in "ROME"
				  tw = TweenLite.to(mcMain.mcContent.mcTextEnd0, durFadeIn, {delay:0.2, alpha:1, ease:Cubic.easeIn, onComplete:done});
				  // Fade in "3 dreams of black"
				  tw = TweenLite.to(mcMain.mcContent.mcTextEnd1, durFadeIn, {delay:2.0, alpha:1, ease:Cubic.easeIn});
			    // ease the grid down a few pixels to make room for title
			    var tw1 = TweenLite.to(mcMain.mcContent.mcGrid, 4.0, {delay:1.5, y:mcMain.mcContent.mcGrid.y+45, ease:Linear.easeNone});
					break;

			  // Fade in ending title.
				case "tml9":
				  // fade out grid lines
				  grid.fadeOut();
				  del = 2.0;
				  tw = TweenLite.to(mcMain.mcContent.mcTextEnd2, durFadeIn, {delay:del, alpha:1, ease:Cubic.easeIn});
				  del = 3.0;
				  tw = TweenLite.to(mcMain.mcContent.mcTextEnd3, durFadeIn, {delay:del, alpha:1, ease:Cubic.easeIn});
					break;
															
				// --------------------------------
				default:
					break;
			}
		}				
	}
}