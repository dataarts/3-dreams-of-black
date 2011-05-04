var VideoPlane = function( shared, layer, conf ) {
	
	var video, texture, interval, shader, material, wireMaterial;
	var config = conf;
	var hasDistortion = false;
	var hasKey = false;
	var isStatic = layer.path.match("png$") || layer.path.match("jpg$");
	
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
		video.preload = true;
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
		//,blending: THREE.BillboardBlending
    });
	
	// 
	if(!layer.width) layer.width = (hasDistortion) ? 1.104 : 1;
	if(!layer.height) layer.height = (hasDistortion) ? 1.24 : 1;
    
	var plane;
	
    if (hasDistortion) {
		plane = config.grid;
	} else {
		plane = new THREE.Plane(1, 1, 40, 1);
	}
	
	if(layer.paralax) {
		for (var i = 0; i < plane.vertices.length; ++i) {
			var px = plane.vertices[i].position.x;
			var sin = Math.sin( (px + 0.5) * Math.PI );
			plane.vertices[i].position.z = (1-sin) * 500;
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

	this.start = function(t) {
		if(isStatic) return;
		
		console.log(this.path + " readyState: " + video.readyState);
		video.currentTime = video.duration * t;
		video.play();
		
		texture.needsUpdate = true;
		
		interval = setInterval(function(){
	        if (video.readyState === video.HAVE_ENOUGH_DATA) {
	            texture.needsUpdate = true;
	        }
	    }, 1000 / 20);
	}
	
	this.stop = function() {
	
		if(isStatic) return;
		video.pause();
		clearInterval( interval );

	}
	
	this.updateUniform = function(mouseX, mouseY) {

		if(!hasDistortion) return;

		material.uniforms['mouseXY'].value.x = -mouseX * config.aspect;
		material.uniforms['mouseXY'].value.y = -mouseY;

	}

};

var VideoLoadRegister = {
};


