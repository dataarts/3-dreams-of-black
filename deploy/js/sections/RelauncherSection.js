/**
 * @author / http://jonobr1.com/
 * Dependent on js/lib/Gee.js
 *					 Heart.js
 *					 Swell.js
 *					 WonderWall.js
 *					 Clouds.js
 *					 Three.js
 *					 files/eminating-heart.svg
 */

var RelauncherSection = function( shared ) {

	Section.call( this );

	var domElement = document.createElement( "div" );
	domElement.style.width = window.innerWidth + 'px';
	domElement.style.height = window.innerHeight + 'px';
	domElement.style.display = 'none';
	domElement.style.backgroundColor = '#ffffff';
	domElement.setAttribute( "id", "relauncher-section" );

	var navigation = {};
	var footer, footNav;
	var enter;

	// add css styling
	var rule = document.createTextNode( "#relauncher-section div.after-experience { position: absolute; height: 57px; overflow: hidden; cursor: pointer; } #relauncher-section div.after-experience img { display: block; } #relauncher-section div.after-experience:hover img { margin-top: -57px; }" );
	var head = document.getElementsByTagName( 'head' )[ 0 ];
	var style = document.createElement( "style" );
	style.type = "text/css";

	if( style.styleSheet ) {

		style.styleSheet.cssText = rule.nodeValue;

	} else {

		style.appendChild( rule );

	}

	head.appendChild( style );

	var offset = {
		x: (window.innerWidth / 2.0 - 225),
		y: (window.innerHeight / 2.0 - 175)
	};

	var clouds = new Clouds( shared, true );
	clouds.getDomElement().style.position = 'absolute';
	clouds.getDomElement().style.left = "0px";
	clouds.getDomElement().style.top = "0px";
	clouds.getDomElement().style.width = window.innerWidth+"px";
	clouds.getDomElement().style.height = window.innerHeight+"px";
	domElement.appendChild( clouds.getDomElement() );

	var container = document.createElement("div");
	container.setAttribute("id", "container");
	container.setAttribute("style", "position: absolute; top: " + offset.y + "px; left: " + offset.x + "px;");
	domElement.appendChild(container);

	var fadeIn = document.createElement( 'div' );
			fadeIn.setAttribute("style", "-webkit-transition: all 500ms cubic-bezier(0.250, 0.250, 0.750, 0.750); -moz-transition: all 500ms cubic-bezier(0.250, 0.250, 0.750, 0.750); -o-transition: all 500ms cubic-bezier(0.250, 0.250, 0.750, 0.750); transition: all 500ms cubic-bezier(0.250, 0.250, 0.750, 0.750);");
			fadeIn.style.position = "absolute";
			fadeIn.style.width = "100%";
			fadeIn.style.height = "100%";
			fadeIn.style.backgroundColor = "#000";
			domElement.appendChild( fadeIn );

	var gee = new GEE({
		fullscreen: false,
		container: container,
		width: 450,
		height: 350,
		loop: false
	});
	var g = gee.ctx;

	// Implemented Footer.js
	footer = document.createElement( 'div' );
	footer.style.position = 'absolute';
	footer.style.width = "100%";
	footer.style.top = (window.innerHeight - 78) + "px";
	footer.style.left = "0";
	footNav = new Footer( footer );
	domElement.appendChild( footer );

	var core = new WonderWall.Pentagon( gee, gee.width * .5, gee.height * .5, 80 );
	var inner = new WonderWall.Pentagon( gee, gee.width * .5, gee.height * .5, 95 );
	var outer = new WonderWall.Pentagon( gee, gee.width * .5, gee.height * .5, 130, .25 );

	outer.showFill = false;
	outer.insides = true;
	inner.showFill = false;
	outer.setRadius(.09);
	core.setRadius(.06);

	var heart = {

		svg: new Heart (gee, "files/eminating-heart.svg", 0, 0 ),
		point: new WonderWall.Point( gee, gee.width * .5, gee.height * .5 + 6 )

	};
	heart.point.r = .0625;

	// Rome Colors
	var rome = rome || {};
	rome.color = {

		red: "#f15d22",
		black: "#30302e",
		white: "#f4f4ea"

	};

	// Handle dom elements
	navigation = initDomElements( domElement );
	for ( var i = 0; i < navigation.list.length; i++ ) {

		var dom = navigation.list[i];
		dom.addEventListener("mouseover", function(e) {

			var iterator = navigation.list.indexOf(this);
			core.setUpdatePoint(true, iterator);
			inner.setUpdatePoint(true, iterator);
			outer.setUpdatePoint(true, iterator);
			heart.point.updating = true;

		}, false);

		dom.addEventListener("mouseout", function(e) {

			var iterator = navigation.list.indexOf(this);
			core.setUpdatePoint(false, iterator);
			inner.setUpdatePoint(false, iterator);
			outer.setUpdatePoint(false, iterator);
			heart.point.updating = false;

		}, false);

	}

	updateDomElementsPosition();

	gee.draw = function() {

		inner.update(offset);
		var points = inner.getPoints();

		g.clearRect(0, 0, gee.width, gee.height);

		g.globalCompositeOperation = "source-over";

		g.strokeStyle = rome.color.black;
		g.lineWidth = 0.5;
		outer.update(offset).render();

		g.globalCompositeOperation = "destination-out";
		core.update(offset).render();

		g.globalCompositeOperation = "xor";
		g.lineWidth = 24;
		inner.showStroke = true;
		inner.showFill = false;
		inner.render();
		g.globalCompositeOperation = "source-over";

		g.save();
		g.translate(gee.width / 2.0, gee.height / 2.0);
		heart.svg.render();
		g.restore();

	};

	function updateDomElementsPosition() {

		var points = inner.getPoints();
		for (var i = 0; i < points.length; i++) {

			var point = points[i].getOriginPosition();
			
			// these are the center points of the objects
			
			var navItem = navigation.list[i];
			var xpos = point.x + offset.x;
			var ypos = point.y + offset.y;

			if (i == 0) {
				xpos -= 113;
				ypos -= 162;
			} else if (i == 1) {
				xpos += 137;
				ypos -= 46;
			} else if (i == 2) {
				xpos += 106;
				ypos += 78;
			} else if (i == 3) {
				xpos -= 312;
				ypos += 75;
			} else {
				xpos -= 344;
				ypos -= 46;
			}
			navItem.style.left = xpos + "px";
			navItem.style.top = ypos + "px";

		}

	};

	function createDomElement( parent, element, id, zclass, contents ) {

		var dom = document.createElement( element );
		dom.setAttribute( "id", id );
		dom.setAttribute( "class", zclass );
		dom.innerHTML = contents;
		parent.appendChild( dom );
		return dom;

	};

	function initDomElements(container) {

		var navigation = {};

		var start = createDomElement(container, "div", "start-over", "after-experience", "<img src = '/files/relaunch_section/start_over.png' alt = 'Start Over' />");
		var technology = createDomElement(container, "div", "technology", "after-experience", "<img src = '/files/relaunch_section/technology.png' alt = 'Technology' />");
		var add = createDomElement(container, "div", "add-to-the-dream", "after-experience", "<img src = '/files/relaunch_section/add_dreams.png' alt = 'Add to the Dream' />");
		var otherDreams = createDomElement(container, "div", "explore-other-dreams", "after-experience", "<img src = '/files/relaunch_section/explore_dreams.png' alt = 'Explore Other Dreams' />");
		var explore = createDomElement(container, "div", "continue-to-explore", "after-experience", "<img src = '/files/relaunch_section/continue.png' alt = 'Continue To Explore' />");

		/*
		enter = document.createElement( "div" );
		enter.setAttribute("style", "width: 226px; height: 95px; cursor: pointer; background: url('/files/relaunch_section/return.png') 0 0 no-repeat;");
		enter.style.position = "absolute";
		enter.style.left = (window.innerWidth / 2.0 - 117) + "px";
		enter.style.top = (window.innerHeight / 2.0 - 104) + "px";
		enter.style.display = "none";
		domElement.appendChild(enter);

		enter.addEventListener( "click", handleReturn, false );
		

		function handleReturn(e) {

			e.preventDefault();
			
			if( e.keyCode == 13 || !e.keyCode ) {
				
				shared.signals.showexploration.dispatch();

				if( !shared.hasExplored ) {
					
					shared.signals.startexploration.dispatch( 'dunes' );
					shared.hasExplored = true;

				}
				var divs = container.getElementsByTagName('div');

				for(var i = 0; i < divs.length; i++) {

					divs[i].style.display = "block";

				}

				enter.style.display = "none";
				shared.signals.keyup.remove( handleReturn );

		  } else if(e.keyCode == 8 || e.keyCode == 46) {

				var divs = container.getElementsByTagName('div');

				for(var i = 0; i < divs.length; i++) {

					divs[i].style.display = "block";

				}

				enter.style.display = "none";
				shared.signals.keyup.remove( handleReturn );
			}

		}
		*/

		start.addEventListener("click", function(e) {

			e.preventDefault();
			shared.signals.showfilm.dispatch();
			shared.signals.startfilm.dispatch( 0, 1 );
			_gaq.push(['_trackPageview', '/relauncher_start_over']);

		}, false);

		technology.addEventListener("click", function(e) {

			e.preventDefault();
			window.location = "/tech";
			// window.open("/tech", "Technology");
			_gaq.push(['_trackPageview', '/relauncher_tech']);

		}, false);

		add.addEventListener("click", function(e) {

			e.preventDefault();
			shared.signals.showugc.dispatch();
			_gaq.push(['_trackPageview', '/relauncher_add_to_dream']);

		}, false);

		otherDreams.addEventListener("click", function(e) {

			e.preventDefault();
			window.location = "/gallery";
			// window.open("/gallery", "Gallery");
			_gaq.push(['_trackPageview', '/relauncher_gallery']);

		}, false);

		explore.addEventListener("click", function(e) {

			e.preventDefault();
			
			shared.isExperience = false;
			
			shared.signals.showexploration.dispatch();
			shared.signals.startexploration.dispatch( 'dunes', false );
			_gaq.push(['_trackPageview', '/relauncher_continue_explore']);

			// shared.hasExplored = true;
			
			/*
			var divs = container.getElementsByTagName('div');
			for(var i = 0; i < divs.length; i++) {
				divs[i].style.display = "none";
			}
			enter.style.display = "block";
			shared.signals.keyup.add( handleReturn )
			*/

		}, false);

		navigation.start = start;
		navigation.technology = technology;
		navigation.add = add;
		navigation.otherDreams = otherDreams;
		navigation.explore = explore;

		navigation.list = [ explore, start, otherDreams, add, technology ];
		init = true;

		return navigation;

	};

	this.show = function() {

		clouds.show();
		updateDomElementsPosition();
		domElement.style.display = 'block';
		setTimeout( function() {
			fadeIn.style.opacity = 0.0;
		}, 1 );
		
		/*
		if( enter ) {
			enter.style.display = "none";
		}
		*/
		var divs = container.getElementsByTagName('div');
		for(var i = 0; i < divs.length; i++) {
			divs[i].style.display = "block";
		}

	};

	this.resize = function( width, height ) {

    var halfWidth = window.innerWidth / 2.0;
    var halfHeight = window.innerHeight / 2.0

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		clouds.resize( width, height );
		footer.style.top = (window.innerHeight - 78) + "px";

		offset = {
			x: (halfWidth - 225),
			y: (halfHeight - 175)
		};
		container.setAttribute("style", "position: absolute; top: " + offset.y + "px; left: " + offset.x + "px;");

		/*
		enter.style.left = (halfWidth - 117) + "px";
		enter.style.top = (halfHeight - 104) + "px";
		*/
		updateDomElementsPosition();

	};

	this.hide = function() {

		clouds.hide();
		domElement.style.display = "none";
		fadeIn.style.opacity = 1.0;

	};

	this.getDomElement = function() {

		return domElement;

	};

	this.update = function() {

		clouds.update();
		gee.draw();

	};

	function ease(cur, tar, inc) {

		var dif = tar - cur;
		if(Math.abs(dif) < inc / 100.0) {
			cur = tar;
		} else {
			cur += dif * inc;
		}
		return cur;

	}

};

RelauncherSection.prototype = new Section();
RelauncherSection.prototype.constructor = RelauncherSection;
