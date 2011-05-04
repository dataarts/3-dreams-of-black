var VideoPlane = function(layer, config){
    var video, texture, interval, shader, material, wireMaterial;
	var config = config;
	var hasDistortion = false;
	var hasKey = false;
	var isStatic = layer.path.match("png$");
	
	this.locked = layer.locked;
	
	if(isStatic) {
		texture = THREE.ImageUtils.loadTexture(layer.path);
	} else {
	    video = document.createElement('video');
	    video.src = layer.path;    
	    texture = new THREE.Texture(video);
	    texture.minFilter = THREE.LinearFilter;
	    texture.magFilter = THREE.LinearFilter;		
	}
    
    switch (layer.shaderId) {
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
		case VIDEO_KEYED_INVERSE:
            shader = VideoShaderSource.keyedInverse;
			hasKey = true;
            break;
        case VIDEO_KEYED:
        default:
            shader = VideoShaderSource.keyed;
			hasKey = true;
            break;
    }
	
	var uniforms = THREE.UniformsUtils.clone(shader.uniforms); // ? ######
    uniforms['map'].texture = texture;
	
	if (hasDistortion) {
		uniforms['mouseXY'].value = new THREE.Vector2(0, 0);
		uniforms['aspect'].value = config.aspect;
	}
	
	if (hasKey) {
		uniforms['colorScale'].value = layer.colorScale;
		uniforms['threshold'].value = layer.threshold;
		uniforms['alphaFadeout'].value = layer.alphaFadeout;
	}
	
	material = new THREE.MeshShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        blending: THREE.BillboardBlending
    });
	
	//
	if(!layer.width) layer.width = (hasDistortion) ? 1.104 : 1;
	if(!layer.height) layer.height = (hasDistortion) ? 1.24 : 1;
    
	var plane;
	
    if (hasDistortion) {
		plane = config.grid;
	} else {
		plane = new THREE.Plane(1, 1, 39, 9);
	}
	
	var pmax = 0;
	var pmin = 0;
	
	if(layer.paralax) {
		for ( var i=0; i < plane.vertices.length; ++i ) {
			var px = plane.vertices[i].position.x;
			pmax = Math.max(pmax, px);
			pmin = Math.min(pmin, px);
			
			var col = (px + 0.5) * 3.14
			var sin = Math.sin(col);
			plane.vertices[i].position.z = (1-sin) * 500;
		}
	}
	
	console.log(pmax + " : " + pmin);
		
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
		
		video.currentTime = video.duration * t;
		video.play();
		
		interval = setInterval(function(){
	        if (video.readyState === video.HAVE_ENOUGH_DATA) {
	            texture.needsUpdate = true;
	        }
	    }, 1000 / 24);
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
}


