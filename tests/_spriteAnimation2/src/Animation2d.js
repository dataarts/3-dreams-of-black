function parseAEJSON(aj, scene, camera) {
	
	var ls = [];
	var cp = animation.cameras.camera.position;
	var ct = animation.cameras.camera.target;
	
	camera.position = new THREE.Vector3( cp[0], cp[1], cp[2] );
	camera.target.position = new THREE.Vector3( ct[0], ct[1], ct[2] );
	camera.updateMatrix();
	camera.lastkey = 0;
	camera.keyframes = animation.cameras.camera.keyframes;
	ls.push(camera);
	
	for(var p in animation.planes) {
		animation.planes[p].name = p;
		ls.push( addPlane(animation.planes[p], scene, animation) );
	}
	
	return ls;
}

function addPlane(d, s, a) {
	
    var tex = THREE.ImageUtils.loadTexture(a.texturePath + d.texture);
    
    var mat;
	
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
	
	
	var p = new THREE.Mesh( new THREE.Plane(d.width, d.height, 1, 1), mat );
	p.doubleSided = true;
	p.position = new THREE.Vector3( d.position[0], d.position[1], d.position[2] );
	p.scale = new THREE.Vector3( d.scale[0], d.scale[1], d.scale[2] );
	p.rotation = new THREE.Vector3( d.rotation[0], d.rotation[1], d.rotation[2] );
	
	p.lastkey = 0;
	p.keyframes = d.keyframes;

	if(!p.isParticle) s.addObject(p);
	return p;
}

function animate(t, k, obj){
	for (var i = obj.lastkey; i < k.length - 1; i++) {
        var a = k[i].time;
        var b = k[i + 1].time;

        if (t == a) {
			//obj.lastkey = i;
			interpolate(0, k[i], k[i + 1], obj);
			break;
		}
        
        if (t == b) {
            //obj.lastkey = i;
			interpolate(1, k[i], k[i + 1], obj);
            break;
        }
		
		if (a < t && b > t) {
            //obj.lastkey = i;
            interpolate( (t - a) / (b - a) , k[i], k[i + 1], obj);
            break;
        }
    }
}

function interpolate(t, ka, kb, target) {
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
