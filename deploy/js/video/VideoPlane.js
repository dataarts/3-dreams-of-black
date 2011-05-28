var VideoPlane = function( shared, layer, conf ) {

	var video, texture, interval, shader, material;
	var config = conf;
	var hasDistortion = false;
	var hasKey = false;
	var isStatic = layer.path.match("png$") || layer.path.match("jpg$");
	var bendForce = layer.bendForce || 400;

	var polyTrail = new PolyTrail();
  this.params = {
    "radius": 0.95,
    "trail": 5,
    "random": 0.23,
    "bulge": 0.7,
    "polyDetail": 0.55,
    "softEdge": 0.77,
    "softTail": 0
  };


	var fps = layer.fps || 20;
	
	this.locked = layer.locked;
	this.path = layer.path;
	
	this.removed = false;
	this.removeAt = layer.removeAt || 1;
	
	
	
	if(isStatic) {
		texture = THREE.ImageUtils.loadTexture(layer.path);
	} else {
		VideoLoadRegister[ layer.path ] = 1;
		
	    video = document.createElement('video');
	    video.src = layer.path;  
		video.preload = 'auto';
		video.load();
		
		shared.signals.loadItemAdded.dispatch();
		
		// emit loaded signal either at canplaythrough event
		// or after 10 seconds
		// (this is to get around occasional not firing of 
		//  canplaythrough event :/)
		
		//video.onerror = function(e) {
		//	console.log(this.path + " error " + e);
		//}

		video.addEventListener( "canplaythrough", function() { 	
	
			if ( VideoLoadRegister[ layer.path ] == 1 ) {
			
				shared.signals.loadItemCompleted.dispatch();
				VideoLoadRegister[ layer.path ] = 2;
	
			}
	
		}, false );
		
		setTimeout( function() { 
			
			if( VideoLoadRegister[ layer.path ] == 1 ) {
	
				shared.signals.loadItemCompleted.dispatch();
				VideoLoadRegister[ layer.path ] = 2;
			}
	
		}, 10000 );
	  
	    texture = new THREE.Texture(video);
	    texture.minFilter = THREE.LinearFilter;
	    texture.magFilter = THREE.LinearFilter;		
	}
    

    switch ( layer.shaderId ) {

        case VIDEO_OPAQUE:
            shader = VideoShaderSource.opaque;
            break;

		case VIDEO_OPAQUE_DISTORT:
            shader = VideoShaderSource.distortOpaque;
			hasDistortion = true;
            break;

		case VIDEO_KEYED_DISTORT:
            shader = VideoShaderSource.distortKeyed;
			hasDistortion = true;
			hasKey = true;
            break;

		case VIDEO_HALFALPHA:
            shader = VideoShaderSource.halfAlpha;
            break;
			
		case VIDEO_SMARTALPHA:
            shader = VideoShaderSource.smartAlpha;
            break;
			
		case VIDEO_SMARTALPHA_DISTORT:
            shader = VideoShaderSource.distortSmartalpha;
			hasDistortion = true;
            break;
		
		case VIDEO_KEYED_INVERSE: // aka white key
            shader = VideoShaderSource.keyedInverse;
			hasKey = true;
            break;

        case VIDEO_KEYED:
        default:
            shader = VideoShaderSource.keyed;
			hasKey = true;
            break;

    }
	
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms ); // ? ######
    uniforms['map'].texture = texture;
	
	if ( hasDistortion ) {

		uniforms['mouseXY'].value = new THREE.Vector2( 0, 0 );
		uniforms['aspect'].value = config.aspect;
		uniforms['mouseSpeed'].value = 1;
    uniforms['mouseRad'].value = 1;

	}
	
	if ( hasKey ) {

		uniforms['colorScale'].value = layer.colorScale;
		uniforms['threshold'].value = layer.threshold;
		uniforms['alphaFadeout'].value = layer.alphaFadeout;

	}
	
	material = new THREE.MeshShaderMaterial({

        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        depthTest: false

    });
	
	// 
	if(!layer.width) layer.width = (hasDistortion) ? 1.104 : 1;
	if(!layer.height) layer.height = (hasDistortion) ? 1.24 : 1;
    
	var plane;
	
    if (hasDistortion) {
		plane = config.grid;
	} else if(layer.paralax) {
		plane = new THREE.Plane(1, 1, 50, 10);
	} else {
		plane = new THREE.Plane(1, 1, 1, 1);
	}
	
	if(layer.paralax) {
		for (var i = 0; i < plane.vertices.length; ++i) {
			var px = plane.vertices[i].position.x;
			var sin = Math.sin( (px + 0.5) * Math.PI );
			plane.vertices[i].position.z = (1-sin) * bendForce * layer.width;
			plane.vertices[i].position.y *= 1 + (1-sin) * .35 * layer.height;
		}
	}
		
	this.mesh = new THREE.Mesh( plane, material );

	this.mesh.scale.x = layer.width;
	this.mesh.scale.y = layer.height;
    this.mesh.position.z = layer.z;
	this.mesh.position.y = layer.y || 0;
    this.mesh.scale.x *= Math.abs(layer.z) * config.adj * config.aspect;
    this.mesh.scale.y *= Math.abs(layer.z) * config.adj;
	//this.mesh.doubleSided = true;

	this.start = function(t, mouseX, mouseY) {

    polyTrail.set(-mouseX * config.aspect, -mouseY);

    if(isStatic) return;
		
		try {

			video.currentTime = video.duration * t;

		} catch ( error ) {

			// console.error( error );
			// video.currentTime = 0;

		}

		video.play();
		texture.needsUpdate = true;

		interval = setInterval(function(){

			if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

				texture.needsUpdate = true;
			}

		}, 1000 / fps);
	};

	this.stop = function() {

		if(isStatic) return;
		video.pause();

		try {

			video.currentTime = 0;

		} catch ( error ) {

			// console.error( error );

		}

		clearInterval( interval );

	};

    this.update = function(mouseX, mouseY, mouseSpeed, mouseRad){
        if (!hasDistortion) 
            return;
        
        polyTrail.target.x = -mouseX * config.aspect;
        polyTrail.target.y = -mouseY;
        polyTrail.update();

        for (i = 0; i <= 4; i++) {
            material.uniforms['trail' + i].value.x = this.params.polyDetail * polyTrail.s[i*2*this.params.trail].x;
            material.uniforms['trail' + i].value.y = this.params.polyDetail * polyTrail.s[i*2*this.params.trail].y+0.0001*i;
        }
        material.uniforms['mouseXY'].value.x = -mouseX * config.aspect;
        material.uniforms['mouseXY'].value.y = -mouseY;
        material.uniforms['mouseSpeed'].value = mouseSpeed;

        material.uniforms['mouseRad'].value = this.params.radius;
        material.uniforms['polyRandom'].value = this.params.random;
        material.uniforms['polyDetail'].value = this.params.polyDetail;
        material.uniforms['bulge'].value = this.params.bulge;
        material.uniforms['softEdge'].value = this.params.softEdge;

    }
};

function PolyTrail(){
    this.target = new THREE.Vector2();
    this.s = [];
    for (var i = 0; i <= 50; i++) {
        this.s[i] = new THREE.Vector2();
    }
}
PolyTrail.prototype.set = function(x,y){
    for (var i = 50; i >= 0; i = i - 1) {
        this.s[i] = new THREE.Vector3(x,y,0);
    }
};
PolyTrail.prototype.update = function(){
    for (var i = 50; i > 0; i = i - 1) {
        this.s[i].x = this.s[i - 1].x;
        this.s[i].y = this.s[i - 1].y;
    }
    this.s[0].x = this.target.x;
    this.s[0].y = this.target.y;
};

var VideoLoadRegister = {};


