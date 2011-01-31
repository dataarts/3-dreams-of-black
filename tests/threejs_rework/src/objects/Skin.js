/*
 * Skin
 */

THREE.Skin = function( geometry, materials ) {
	
	THREE.Mesh.call( this, geometry, materials );
	
	this.bones            = [];
	this.bonePoses        = [];
	this.bonesRootInverse = new THREE.Matrix4();
}

THREE.Skin.prototype             = new THREE.Mesh();
THREE.Skin.prototype.constructor = THREE.Skin;
THREE.Skin.prototype.supr        = THREE.Mesh.prototype;


/*
 * Add 
 */

THREE.Skin.prototype.addBone = function( object3D ) {
	
	if( object3D === undefined ) object3D = new THREE.Object3D();
	this.bones.push( object3D );
	
	return object3D;
}

/*
 * Pose
 */

THREE.Skin.prototype.pose = function() {
	
	this.update();
	THREE.Matrix4.makeInvert( this.globalMatrix, this.bonesRootInverse );

	var tempMatrix = new THREE.Matrix4();

	for( var b = 0; b < this.bones.length; b++ ) {

		this.bonePoses[ b ] = tempMatrix.multiply( this.bonesRootInverse, this.bones[ b ].globalMatrix );
		this.bonePoses[ b ] = THREE.Matrix4.makeInvert( tempMatrix );
		
		this.bones    [ b ] = this.bones    [ b ].globalMatrix.flatten32;
		this.bonePoses[ b ] = this.bonePoses[ b ].flatten32;
	}	
}
