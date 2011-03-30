/**
 * @author alteredq / http://alteredqualia.com/
 */
 
 var Slider = function( parent, width, height, start, end, current, callback ) {

	var elSlider = document.createElement( "div" ),
		elSliderBg = document.createElement( "div" ),
		sliderX,
		sliderOffsetLeft,
		sliderDragOn = false;

	elSliderBg.style.width = width + 10 + "px";
	elSliderBg.style.height = height + "px";
	
	elSliderBg.style.background = "rgba(255,255,255,0.125)";
	elSliderBg.style.margin = "-0.5em 0 0 0";
	elSliderBg.style.padding = "0px";	

	elSlider.style.padding = "0px";
	elSlider.style.margin = "0px";
	elSlider.style.position = "relative";
	
	elSlider.style.background = "red";
	elSlider.style.cursor = "pointer";
	
	elSlider.style.boxShadow = "0px 0px 5px #000";
	elSlider.style.mozBoxShadow = "0px 0px 5px #000";
	elSlider.style.webkitBoxShadow = "0px 0px 5px #000";

	elSlider.style.width = 2 * height + "px";
	elSlider.style.height = 2 * height + "px";
	elSlider.style.top = - height / 2 + "px";	
	
	elSliderBg.appendChild( elSlider );
	parent.appendChild( elSliderBg );
	
	sliderX = width * ( clamp( current, start, end ) - start ) / ( end - start );
	
	elSlider.style.left = sliderX + "px";	
	
	
	// event handlers
	
	this.onMouseDown = function ( e ) {
			
		sliderDragOn = true;
		sliderOffsetLeft = getElementLeft( elSliderBg );

	};

	this.onMouseUp = function( e ) {

		sliderDragOn = false;
		
	};

	this.onMouseMove = function( e ) {

		if ( sliderDragOn ) {
			
			sliderX = Math.floor( clamp( e.clientX - sliderOffsetLeft, 0, 200 ) );
			elSlider.style.left = clamp(sliderX, 0, width) + "px";			
			
			var val = start + ( clamp(sliderX / width, 0, 1) ) * (  end - start );
			
			callback( val );
			
		}
	
	};

	this.setValue = function( v ) {
		
		sliderX = width * ( clamp( v, start, end ) - start ) / ( end - start );
		
		elSlider.style.left = sliderX + "px";
		
	};
	
	// helpers
	
	function clamp( x, a, b ) {
	
		return x < a ? a : x > b ? b : x;

	};

	function getElementLeft( el ) {
	
		var left = 0;
		
		while( el != null ) {
		
			left += el.offsetLeft;
			el = el.offsetParent;

		}

		return left;

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};
	
	elSlider.addEventListener( "mousedown", bind( this, this.onMouseDown ), false );
	document.addEventListener( "mouseup", bind( this, this.onMouseUp ), false );
	document.addEventListener( "mousemove", bind( this, this.onMouseMove ), false );
	
};


