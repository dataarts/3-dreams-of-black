
var spriteSheets = [];


var particleSystems = {
	dust_particle: {
		birthRate: 1 / 30,
		ttl: 10,
		area: [1, 1, 3],
		translate: [-1, 0.05, 0],
		rotate:	[0, 0, .2],
		randomTranslate: [0.05, 0.1, 0],
		randomRotate:	[0, 0, 0.7],
		liveParticles: [],
		lastBirth: 0,
		enabled: false,
		template: null
	}
}

function parseAEJSON(aj, scene, camera) {
	
	var ls = [];
	var cp = animation.cameras.camera.position;
	var ct = animation.cameras.camera.target;
	
	camera.position = new THREE.Vector3( cp.x, cp.y, cp.z );
	camera.target.position = new THREE.Vector3( ct.x, ct.y, ct.z );
	camera.updateMatrix();
	camera.lastkey = 0;
	camera.keyframes = animation.cameras.camera.keyframes;
	ls.push(camera);
	
	for(var p in animation.planes) {
		animation.planes[p].name = p;
		ls.push( addPlane(animation.planes[p], scene) );
	}
	
	return ls;
}

function addPlane(d, s) {
	
    var tex = THREE.ImageUtils.loadTexture(d.texture);
    
    var mat;
	
    if (d.isSequence) {
        var shader = SpriteSheetShaderSource['spriteSheet'];
        var uniforms = shader.uniforms;
        
        uniforms['sheet'].texture = tex;
        uniforms['tileOffsetX'].value = new THREE.Vector2(0.1, Math.random().toFixed(1));
        
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
	p.position = new THREE.Vector3( d.position.x, d.position.y, d.position.z );
	p.scale = new THREE.Vector3( d.scale.x, d.scale.y, d.scale.z );
	p.rotation = new THREE.Vector3( d.rotation.x, d.rotation.y, d.rotation.z );
	
	p.lastkey = 0;
	p.keyframes = d.keyframes;
	
    // Used for sequence animation
	p.fps = 1 / d.fps;
	p.numFrames = 10;
	
	p.isParticle = d.name.indexOf("particle") > 0;
	p.system = d.name;
	
	if(!p.isParticle) s.addObject(p);
	
	if (d.isSequence) spriteSheets.push(p);
	
	if (p.isParticle) {
		d.material = mat;
		particleSystems[d.name].template = d;
		particleSystems[d.name].enabled = true;
	}
	
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

/*
 * 	dust_particle: {
		birthRate: 1 / 3,
		ttl: 3,
		area: [1, 1, 3],
		translate: [-3, 0.05, 0],
		rotate:	[0, 0, .002],
		randomTranslate: [0.05, 0.1, 0],
		randomRotate:	[0, 0, 0.7],
		liveParticles: [],
		lastBirth: 0,
		enabled: false,
		template: null
	}
*/
function animateParticles(t, scene){
	for (var i in particleSystems) {
		var p = particleSystems[i];
		if(p.lastBirth + p.birthRate < time) {
			console.log("creating particle");
			p.lastBirth += p.birthRate;
			
			var d = p.template;
			var np = new THREE.Mesh( new THREE.Plane(d.width, d.height, 1, 1), d.material );
			np.doubleSided = true;
			np.position = new THREE.Vector3( d.position.x, d.position.y, d.position.z );
			np.rotation = new THREE.Vector3( d.rotation.x, d.rotation.y, d.rotation.z );
			np.birthTime = t;
			
			p.liveParticles.push(np);
			scene.addObject(np);
		}
		
		for (var i in p.liveParticles) {
			var op = p.liveParticles[i];
			if (op.birthTime + p.ttl > t) {
				//console.log("killing particle");
				scene.removeObject(op);
			}
		}
		
		for(var i in p.liveParticles) {
			var op = p.liveParticles[i];

			op.position.x += p.translate[0];
			op.position.y += p.translate[1];
			op.position.z += p.translate[2];
			
			op.rotation.x += p.rotate[0];
			op.rotation.y += p.rotate[1];
			op.rotation.z += p.rotate[2];
		}
	}
}








