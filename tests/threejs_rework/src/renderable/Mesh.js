/*
 * Mesh
 */

THREE.Mesh = function( geometry, materials ) {

	THREE.Object3D.call( this );
	
	this.geometry  = geometry;
	this.materials = materials.length ? materials : [ materials ];
	this.compileMaterials();
}

THREE.Mesh.prototype             = new THREE.Object3D();
THREE.Mesh.prototype.constructor = THREE.Mesh;
THREE.Mesh.prototype.supr        = THREE.Object3D.prototype;


/*
 * Add Material
 */

THREE.Mesh.prototype.addMaterial = function( newMaterials ) {
	
	if( newMaterials.length )
		materials.concat( newMaterials );
	else
		materials.push( newMaterials );

	this.compileMaterials();
}


/*
 * Functions set by renderer
 */

THREE.Mesh.prototype.compileMaterials = function() {};
THREE.Mesh.prototype.render           = function() {};
