var VIDEO_OPAQUE = 1;
var VIDEO_HALFALPHA = 2;
var VIDEO_OPAQUE_DISTORT = 3;
var VIDEO_KEYED = 4;
var VIDEO_KEYED_DISTORT = 5;
var VIDEO_KEYED_INVERSE = 6;
var VIDEO_SMARTALPHA = 7;
var VIDEO_SMARTALPHA_DISTORT = 8;

var VideoPlayer = function( shared, layers, conf ) {

	var that = this;
	var oldTime = new Date().getTime();

	SequencerItem.call( this );

	var clearColor = new THREE.Color( 0x000000 );

	var config = {};
	var planes = [];
	var gridLoaded = false;
	
	var scene, camera;
	var renderer = shared.renderer, renderTarget = shared.renderTarget;
	
	var mouseX = 0, mouseY = 0;
	var mouseOldX = 0, mouseOldY = 0;
	var mouseNewX = 0, mouseNewY = 0;
	var mouseRad = 1;
	var mouseSpeed = 1;
	var targetPos;

	this.duration = layers[ 0 ].duration;
	
	this.init = function(){
		
		config.prx = layers[0].paralaxHorizontal || 0;
		config.pry = layers[0].paralaxVertical || 0;
		config.tgd = layers[0].targetDistance || 1500;
		
		onGrid = function(geometry){

			config.grid = geometry;
			that.onLoad();

		};
		
		gridLoader = new THREE.JSONLoader();
		gridLoader.load( { model: "/files/models/VideoDistortGrid.js", callback: onGrid } );

	};
	
	this.onLoad = function() {

		gridLoaded = true;
	
	 	shared.signals.mousemoved.add(function(){

	 		mouseX = ( shared.mouse.x / shared.screenWidth ) * -2 + 1;
	 		mouseY = ( shared.mouse.y / shared.screenHeight ) * 2 - 1;

	 	});
		
		targetPos = new THREE.Vector2( 0, 0 );
		
		config.fov = 54;
		config.aspect = 2.35;
		config.adj = Math.tan( config.fov * Math.PI / 360 ) * 2;
		
		camera = new THREE.Camera( config.fov, config.aspect, 1, 100000 );
		camera.target.position = new THREE.Vector3( 0, 0, config.tgd * -1 );
		camera.updateMatrix();
		
		scene = new THREE.Scene();
		scene.addLight( new THREE.AmbientLight( 0x000000 ) );
		scene.addObject(camera);

		for(var i = 0; i < layers.length; i++) {			
			var p = new VideoPlane(shared, layers[i], config);
			planes.push(p);
		}
	};
	
	this.show = function( progress ) {
		for ( var i = 0; i < planes.length; i++ ) {
			var p = planes[i];
			if(p.locked) camera.addChild(p.mesh);
			else scene.addChild(p.mesh);
			p.start( progress, mouseX, mouseY );
		}
		
		renderer.setClearColor( clearColor );

	};
	
	this.hide = function(){
		for ( var i = 0; i < planes.length; i++ ) {
			planes[i].stop();
		}

	};
	
	this.update = function( progress, delta, time ) {
    time = new Date().getTime();
    delta = time - oldTime;
    oldTime = time;

		if( !gridLoaded ) return;

      mouseNewX = mouseX;
      mouseNewY = mouseY;

      var vX = Math.abs(limitSpeed(mouseNewX-mouseOldX,0.05)/delta);
      var vY = Math.abs(limitSpeed(mouseNewY-mouseOldY,0.05)/delta);

      mouseSpeed += (700*(vX+vY) - mouseSpeed)/20;

      mouseOldX = mouseX;
      mouseOldY = mouseY;

      function limitSpeed(speed, limit){
        return Math.max(Math.min(speed,limit),-limit);
      }
		
		targetPos.x = mouseX * - 2 * config.prx;
		targetPos.y = mouseY * - 2 * config.pry;
		
		targetPos.x = Math.min(targetPos.x, config.prx);
		targetPos.x = Math.max(targetPos.x, -config.prx);
		
		targetPos.y = Math.min(targetPos.y, config.pry);
		targetPos.y = Math.max(targetPos.y, -config.pry);
		
		camera.target.position.x += (targetPos.x - camera.target.position.x) * 0.1;
		camera.target.position.y += (targetPos.y - camera.target.position.y) * 0.1;
				
		for ( var i = 0; i < planes.length; i++ ) {
			var p = planes[i];
			if (progress > p.removeAt && !p.removed) {
				if (p.locked) 
					camera.removeChild(p.mesh);
				scene.removeChild(p.mesh);
				p.stop();
				p.removed = true;
				//console.log(p.path + " removed at " + progress + " (planned at " + p.removeAt + ")");
			}
			else {
				p.update(mouseX, mouseY, mouseSpeed, mouseRad);
			}

		}
		
		renderer.render( scene, camera, renderTarget );
	};
};

VideoPlayer.prototype = new SequencerItem();
VideoPlayer.prototype.constructor = VideoPlayer;
