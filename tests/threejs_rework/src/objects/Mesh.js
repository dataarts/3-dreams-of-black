/*
 * Mesh
 */

THREE.Mesh = function( geometry, materials ) {

	THREE.Object3D.call( this );
	
	this.renderable   = true;
	this.geometry     = geometry;
	this.materials    = materials && materials.length ? materials : [ materials ];
	this.normalMatrix = new THREE.Matrix4();
}

THREE.Mesh.prototype             = new THREE.Object3D();
THREE.Mesh.prototype.constructor = THREE.Mesh;
THREE.Mesh.prototype.supr        = THREE.Object3D.prototype;


/*
 * Update
 */
/*
THREE.Mesh.prototype.update = function( parentGlobalMatrix, forceUpdate, scene, camera ) {
	
	this.supr.update.call( this, parentGlobalMatrix, forceUpdate, scene, camera );
	
	// todo: update normal matrix
}*/

