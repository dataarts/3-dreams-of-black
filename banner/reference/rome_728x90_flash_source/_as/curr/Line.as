package curr {

	// import statements
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.display.Sprite;
	import com.greensock.TweenLite;
	import com.greensock.easing.*;	

	// class:			Item
	// description:
	// ------------------------------------------------
	public class Line extends MovieClip {
		
		public var mcContent:MovieClip;
		public var mcDraw:MovieClip;
		// my index number
		public var ind:Number;
		// link to grid and main objects
		public var grid:Grid;
		public var main:Main;
		// initial speed
		public var spd = 0.31;
		// 
		public var acc = 0.14;
		// line width
		public var drawWidth;

		// Line constructor
		// ------------------------------------------------
		public function Line() {

		}

		// function:	init
		// ------------------------------------------------	
		public function init(g:Grid, m:Main, i:Number):void {
			
			mcContent = this["mcContent"];
			mcDraw = mcContent;
			// store links to main objects
			grid = g; main = m;
			//
			ind = i;
			// Starting alpha and scale.
			alpha = 0.18;
			// starting scale
			scaleX = 0.5;
			scaleY = 0.25;
			// width of my line
			drawWidth = 520;
			// draw my line based on the position of the four oscillators
			var stroke = 2;
			var hex = 0xFFFFFF;
			mcDraw.graphics.lineStyle(stroke, hex);
			// x position on left side
			var xp = -drawWidth/2;
			var dx = drawWidth/(grid.oscillators-1);
			mcDraw.graphics.moveTo(xp, grid.arrOscPos[0]*grid.arrOscAmp[0]);
			// go through oscillators
			for (var i = 1; i < grid.oscillators; i++) {
			  xp += dx;
  			mcDraw.graphics.lineTo(xp, grid.arrOscPos[i]*grid.arrOscAmp[i]);
			}
		}	
		
		// function:	build
		// ------------------------------------------------	
		public function build():void {
			
		}	
		
		// function:	upd
		// ------------------------------------------------	
		public function upd(e:Event):void {
			// am i off screen?
			if (y > grid.bannerHeight + 30) {
			  kill(); return;
			}
					  
			y += spd;
			spd += acc;
			var a1 = alpha + 0.02;
			if (a1 < 1) { alpha = a1; }
			if (scaleY < 1) scaleY += 0.04;
			scaleX += 0.014;
		}		
		
		// function:	kill
		// ------------------------------------------------
		public function kill():void {
      switchUpd("off");
      parent.removeChild(this);
		}		
		
		// function:	setPos
		// ------------------------------------------------
		public function setPos(xp:Number,yp:Number):void {
			x = xp; y = yp;
		}		

		// function:	switchUpd
		// desc:		turn update function or off
		// ------------------------------------------------
		public function switchUpd(s:String):void {
			switch (s) {
				case "on":
					addEventListener(Event.ENTER_FRAME, upd);
					break;
				case "off":
					removeEventListener(Event.ENTER_FRAME, upd);
					break;
				default:
					break;
			}
		}		
	}
}
