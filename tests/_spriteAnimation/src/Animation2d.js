
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
		ls.push( addPlane(animation.planes[p], scene) );
	}
	
	return ls;
}

function addPlane(d, s) {
	var tex = THREE.ImageUtils.loadTexture(d.texture);
	var mat = new THREE.MeshBasicMaterial ( {map: tex, blending: THREE.BillboardBlending } );
	var p = new THREE.Mesh( new THREE.Plane(d.width, d.height, 1, 1), mat );
	p.doubleSided = true;
	p.position = new THREE.Vector3( d.position.x, d.position.y, d.position.z );
	p.scale = new THREE.Vector3( d.scale.x, d.scale.y, d.scale.z );
	p.rotation = new THREE.Vector3( d.rotation.x, d.rotation.y, d.rotation.z );
	
	p.lastkey = 0;
	p.keyframes = d.keyframes;
	
	s.addObject(p);
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








