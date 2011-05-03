package curr {

	// import statements
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.display.Sprite;
	import com.greensock.TweenLite;
	import com.greensock.easing.*;	

	// class:			Grid
	// description:
	// ------------------------------------------------
	public class Grid {
		
		// movieclips
		public var mc:MovieClip;
		public var mcDraw:MovieClip;
		public var mcCenter:MovieClip;
		// link to main object
		public var main:Main;
		// width height of banner
		public var bannerWidth = 300;
		public var bannerHeight = 250;
		// frame counter
		public var f = 0;
		// line counter
		public var lineCt = 0;
		// wave amplitude limits for height of peaks
		public var amp0 = 9;
		public var amp1 = 18;
		// how many oscillators do we make for the hills curvature
		public var oscillators = 6;
		// Stores osciillator positions, speeds, counter positions, ampltitude
		public var arrOscPos;
		public var arrOscSpd;
		public var arrOscCtr;
		public var arrOscAmp;
		// Oscillator speed limits - will randomize within these
		public var oscSpd0 = 0.04;
		public var oscSpd1 = 0.2;
		// y offset for starting y position oscillation
		public var yOffOsc = 0;
		public var yOffMax = 15;
		public var yOffCt = 0;
			
		// Grid constructor
		// ------------------------------------------------
		public function Grid(mcPm:MovieClip, mainPm:Main) {
			mc = mcPm; main = mainPm;
			// initialize
			init();
		}

		// function:	init
		// desc:
		// ------------------------------------------------	
		public function init():void {
			// link mc back to this
			mc["obj"] = this;
      mcDraw = mc.mcContent.mcDraw;
      mcCenter = main.mc.mcMain.mcContent.mcCenter;
      // initialize oscillators
      arrOscPos = new Array(oscillators);
      arrOscSpd = new Array(oscillators);
      arrOscCtr = new Array(oscillators);
      arrOscAmp = new Array(oscillators);
      //
      for (var i = 0; i < oscillators; i++) {
        arrOscPos[i] = 0;
        arrOscSpd[i] = oscSpd0 + (Math.random() + (i/oscillators))/2*(oscSpd1-oscSpd0);
        arrOscCtr[i] = 0;
        arrOscAmp[i] = amp0 + Math.random()*(amp1-amp0);
      }
      // prepare me for the fade in
      mc.mcContent.alpha = 0;
			// start updating
      switchUpd("on");
      // Fade in
      fadeIn();
		}

		// function:	fadeIn
		// desc:
		// ------------------------------------------------	
		public function fadeIn():void {
		  var dur = 1.5;
		  var del = 0.5;
		  var tw = TweenLite.to(mc.mcContent, dur, {delay:del, alpha:1, ease:Linear.easeNone});
    }
    
		// function:	fadeOutDone
		// desc:
		// ------------------------------------------------	
		public function fadeOutDone():void {
		  switchUpd("off");
    }
    
		// function:	fadeOut
		// desc:
		// ------------------------------------------------	
		public function fadeOut():void {
		  var dur = 1.0;
		  var tw = TweenLite.to(mc.mcContent, dur, {delay:2.1, alpha:0, ease:Linear.easeNone, onComplete:fadeOutDone});		  
    }    

		// function:	upd
		// desc:
		// ------------------------------------------------	
		public function upd(e:Event):void {
		  f++;
		  if (f % 4 == 0) {
		    // make a new line
		    var l = new Line();
		    l.init(this, main, lineCt);
		    l.setPos(bannerWidth/2, bannerHeight/2- 10 - yOffOsc*yOffMax);
		    l.switchUpd("on");
		    mc.mcContent.mcLinePod.addChild(l);
		    lineCt++;
	    }
      // move yOff offset for next wave starting position
      yOffCt += 0.07;
      yOffOsc = Math.sin(yOffCt);

      // Update the oscillators
      for (var i = 0; i < oscillators; i++) {
        arrOscCtr[i] += arrOscSpd[i];
        arrOscPos[i] = Math.sin(arrOscCtr[i]);
      }	    
		}
		
		// function:	switchUpd
		// desc:		turn update function or off
		// ------------------------------------------------
		public function switchUpd(s:String):void {
			switch (s) {
				case "on":
					mc.addEventListener(Event.ENTER_FRAME, upd);
					break;
				case "off":
					mc.removeEventListener(Event.ENTER_FRAME, upd);
					break;
				default:
					break;
			}
		}		
	}
}