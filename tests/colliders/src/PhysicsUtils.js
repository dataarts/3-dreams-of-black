PhysicsUtils = {};

// @params m THREE.Mesh
// @returns CBox dynamic Object Bounding Box
PhysicsUtils.MeshOBB = function(m){
	m.geometry.computeBoundingBox();
	var b = m.geometry.boundingBox;
	var min = new THREE.Vector3(b.x[0], b.y[0], b.z[0]);
	var max = new THREE.Vector3(b.x[1], b.y[1], b.z[1]);
	var box = new CBox(min, max);
	box.mesh = m;
	return box;
}

// @params m THREE.Mesh
// @returns CBox static Axis-Aligned Bounding Box
//
// The AABB is calculated based on current 
// position of the object (assumes it won't move)
PhysicsUtils.MeshAABB = function(m){
	var box = PhysicsUtils.MeshOBB(m);
	box.min.addSelf(m.position);
	box.max.addSelf(m.position);
	box.dynamic = false;
	return box;
}

PhysicsUtils.MeshColliderWBox = function(m){
	var mv = m.geometry.vertices;
	var mvl = mv.length;
	var mf = m.geometry.faces;
	var mfl = mf.length;
	
	var vertices = [];
	var faces = [];
	var normals = [];
	
	for(var i = 0; i < mvl; i++) {
		vertices.push( new THREE.Vector3( mv[i].position.x, mv[i].position.y, mv[i].position.z) );
	}
	
	for(var i = 0; i < mfl; i++) {
		faces.push(mf[i].a, mf[i].b, mf[i].c);
		normals.push( new THREE.Vector3( mf[i].normal.x, mf[i].normal.y, mf[i].normal.z) );
	}
	
	var mc = new CMesh(vertices, faces, normals, PhysicsUtils.MeshOBB(m));
	mc.mesh = m;

	return mc;
}











