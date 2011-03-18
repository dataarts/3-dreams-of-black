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