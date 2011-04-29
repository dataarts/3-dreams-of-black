THREE.Animation2D = function(){
	this.layers = [];
	this.duration = 0;
	this.source;
	this.mode = THREE.Animation2D.PLAYONCE;
	this.texturePath = "";
};

THREE.Animation2D.PLAYONCE = 0;
THREE.Animation2D.LOOP = 1;
THREE.Animation2D.PINGPONG = 2;

THREE.Animation2D.PLANES = 0;
THREE.Animation2D.SHADER = 1;

THREE.Animation2D.prototype.parse = function(json, scene, camera, dmode) {
	this.source = json;
	this.duration = json.duration;
	
	var cp = json.cameras[0].position;
	var ct = json.cameras[0].target;
	var fov = json.cameras[0].fov;
	
	camera.position = new THREE.Vector3( cp[0], cp[1], cp[2] );
	camera.target.position = new THREE.Vector3( ct[0], ct[1], ct[2] );
	camera.updateMatrix();
	camera.lastkey = 0;
	camera.fov = fov;
	camera.updateProjectionMatrix();
	camera.keyframes = json.cameras[0].keyframes;

	if(!dmode) dmode = THREE.Animation2D.PLANES;
	switch(dmode) {
		case THREE.Animation2D.PLANES:
			this.parsePlanes(json, scene, camera);
			break;
		case THREE.Animation2D.SHADER:
			this.parseShader(json, scene, camera);
			break;
	}
}

THREE.Animation2D.prototype.parseShader = function(json, scene, camera) {
	for (var p in json.planes) {
		var d = json.planes[p];
		var tex, vid;
		
		if( d.texture.substr(-4) === "webm" ) {
			vid = document.createElement('video');
			vid.setAttribute('autoplay', 'true');
			vid.setAttribute('loop', 'true');

			var src = document.createElement('source');
			src.setAttribute('src', this.texturePath + d.texture);
			src.setAttribute('type', 'video/webm');
			vid.appendChild(src);
			
			tex = new THREE.Texture( vid );
		} else {
			tex = THREE.ImageUtils.loadTexture(this.texturePath + d.texture);
		}
		
		tex.minFilter = THREE.LinearFilter;
		tex.magFilter = THREE.LinearFilter;
		
		d.path = this.texturePath + d.texture;
		d.texture = tex;
		d.video = vid;

		this.layers.push(d);
	}
	
    var shader = Layer3ShaderSource['layer3'];
		
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);	   
    uniforms['layer1'].texture = this.layers[0].texture;
	uniforms['layer2'].texture = this.layers[1].texture;
	uniforms['layer3'].texture = this.layers[2].texture;
	
	console.log("###: " + this.layers[0].path);
	console.log("###: " + this.layers[1].path);
	console.log("###: " + this.layers[2].path);

    var mat = new THREE.MeshShaderMaterial({
		uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    });

	var p = new THREE.Mesh( new THREE.Plane(d.width, d.height, 1, 1), mat );
	//p.doubleSided = true;
	p.position = new THREE.Vector3( d.position[0], d.position[1], d.position[2] );
	p.scale = new THREE.Vector3( d.scale[0], d.scale[1], d.scale[2] );
	p.rotation = new THREE.Vector3( d.rotation[0], d.rotation[1], d.rotation[2] );

	scene.addObject(p);
	
	var p2 = new THREE.Mesh( new THREE.Plane(d.width, d.height, 1, 1), mat );
	//p.doubleSided = true;
	p2.position = new THREE.Vector3( d.position[0], d.position[1], d.position[2]+10 );
	p2.scale = new THREE.Vector3( d.scale[0], d.scale[1], d.scale[2] );
	p2.rotation = new THREE.Vector3( d.rotation[0], d.rotation[1], d.rotation[2] );

	scene.addObject(p2);

	return p;

	
}
	
	
	
	
	
	
	
	
THREE.Animation2D.prototype.parsePlanes = function(json, scene, camera) {
	this.layers.push(camera);
	
	for(var p in json.planes) {
		json.planes[p].name = p;
		this.layers.push( this.addPlane(json.planes[p], scene) );
	}
}

THREE.Animation2D.prototype.addPlane = function(d, s) {
	
    var tex, mat, vid;

	if( d.texture.substr(-4) === "webm" ) {
		vid = document.createElement('video');
		vid.setAttribute('autoplay', 'true');
		vid.setAttribute('loop', 'true');
		vid.setAttribute('style', 'display:none');
		
		var src = document.createElement('source');
		src.setAttribute('src', this.texturePath + d.texture);
		src.setAttribute('type', 'video/webm');
		vid.appendChild(src);
		
		//document.body.appendChild(vid);
		
		console.log(vid);

		tex = new THREE.Texture( vid );
	} else {
		tex = THREE.ImageUtils.loadTexture(this.texturePath + d.texture);
	}

	tex.minFilter = THREE.LinearFilter;
	tex.magFilter = THREE.LinearFilter;

    if (d.alpha) {
        var shader = HalfAlphaShaderSource['halfAlpha'];
		
        var uniforms = THREE.UniformsUtils.clone(shader.uniforms);	   
        uniforms['map'].texture = tex;

        mat = new THREE.MeshShaderMaterial({
			uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            blending: THREE.BillboardBlending
        });
    }
    else {
        mat = new THREE.MeshBasicMaterial({
            map: tex,
            blending: THREE.BillboardBlending
        });
    }

	if (d.offset) {	
		var p = new THREE.Mesh( new THREE.Plane(d.width, d.height, 1, 1), mat );
		p.doubleSided = true;
		p.position = new THREE.Vector3( d.offset[0], d.offset[1], d.offset[2] );
		
		var t = new THREE.Object3D();
		t.position = new THREE.Vector3( d.position[0], d.position[1], d.position[2] );
		t.scale = new THREE.Vector3( d.scale[0], d.scale[1], d.scale[2] );
		t.rotation = new THREE.Vector3( d.rotation[0], d.rotation[1], d.rotation[2] );
		
		t.texture = tex;
		t.lastkey = 0;
		t.keyframes = d.keyframes;
		
		t.addChild(p);
		s.addObject(t);
		
		if (vid) {
			p.video = vid;
		}
		
		return t;
	}
	else {
		var p = new THREE.Mesh( new THREE.Plane(d.width, d.height, 1, 1), mat );
		p.doubleSided = true;
		p.position = new THREE.Vector3( d.position[0], d.position[1], d.position[2] );
		p.scale = new THREE.Vector3( d.scale[0], d.scale[1], d.scale[2] );
		p.rotation = new THREE.Vector3( d.rotation[0], d.rotation[1], d.rotation[2] );
		
		p.texture = tex;
		p.lastkey = 0;
		p.keyframes = d.keyframes;
		s.addObject(p);
		
		if (vid) {
			p.video = vid;
		}
		
		return p;
	}


	
	
}

THREE.Animation2D.prototype.draw = function(time) {
	var d = this.duration;
	var t = time;
	
	switch(this.mode) {
		case THREE.Animation2D.PLAYONCE:
			t = Math.min(t, d);
			break;
		case THREE.Animation2D.LOOP:
			t = t % d;
			break;
		case THREE.Animation2D.PINGPONG:
			t = t % (d * 2);
			if(t > d) t = d - (t - d);
			break;
	}
	
	var l = this.layers.length;
	for(var i = 0; i < l; i++) {
		var ls = this.layers[i];	

		if (ls.video && ls.texture) {
			if (ls.video.readyState === ls.video.HAVE_ENOUGH_DATA) {
				ls.texture.needsUpdate = true;
			}	
		}
				
		if(ls.keyframes) {			
			this.animateLayer(t, ls);
		}
	}
}

THREE.Animation2D.prototype.animateLayer = function(t, plane){
	var k = plane.keyframes;
	
	for (var i = plane.lastkey; i < k.length - 1; i++) {
        var a = k[i].time;
        var b = k[i + 1].time;

        if (t == a) {
			//plane.lastkey = i;
			this.interpolate(0, k[i], k[i + 1], plane);
			break;
		}
        
        if (t == b) {
            //plane.lastkey = i;
			this.interpolate(1, k[i], k[i + 1], plane);
            break;
        }
		
		if (a < t && b > t) {
            //plane.lastkey = i;
            this.interpolate( (t - a) / (b - a) , k[i], k[i + 1], plane);
            break;
        }
    }
}

THREE.Animation2D.prototype.interpolate = function(t, ka, kb, target) {
	for(var p in ka) {
		switch(p) {
			case "px": target.position.x = ka.px + (kb.px - ka.px) * t;
			break;
			case "py": target.position.y = ka.py + (kb.py - ka.py) * t;
			break;
			case "pz": target.position.z = ka.pz + (kb.pz - ka.pz) * t;
			break;
			
			case "rx": target.rotation.x = ka.rx + (kb.rx - ka.rx) * t;
			break;
			case "ry": target.rotation.y = ka.ry + (kb.ry - ka.ry) * t;
			break;
			case "rz": target.rotation.z = ka.rz + (kb.rz - ka.rz) * t;
			break;
		}
	}
}
