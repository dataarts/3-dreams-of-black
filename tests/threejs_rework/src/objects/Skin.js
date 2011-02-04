/*
 * Skin
 */

THREE.Skin = function( geometry, materials ) {
	
	THREE.Mesh.call( this, geometry, materials );
	
	this.bones            = [];
	this.bonePoses        = [];
	this.bonesRootInverse = new THREE.Matrix4();
	
	
	// init bones
	
	for( var b = 0; b < this.geometry.bones.length; b++ ) {
		
		var bone = new THREE.Object3D();
		
		bone.position.x   = this.geometry.bones[ b ].pos[ 0 ];
		bone.position.y   = this.geometry.bones[ b ].pos[ 1 ];
		bone.position.z   = this.geometry.bones[ b ].pos[ 2 ];
		bone.quaternion.x = this.geometry.bones[ b ].rotq[ 0 ];
		bone.quaternion.y = this.geometry.bones[ b ].rotq[ 1 ];
		bone.quaternion.z = this.geometry.bones[ b ].rotq[ 2 ];
		bone.quaternion.w = this.geometry.bones[ b ].rotq[ 3 ];

		this.addBone( bone );
	}
	
	for( var b = 0; b < this.bones.length; b++ ) {
		
		if( this.geometry.bones[ b ].parent !== -1 ) 
			this.bones[ this.geometry.bones[ b ].parent ].addChild( this.bones[ b ] );
		else
			this.addChild( this.bones[ b ] );
		
	}
	
	this.pose();
}

THREE.Skin.prototype             = new THREE.Mesh();
THREE.Skin.prototype.constructor = THREE.Skin;
THREE.Skin.prototype.supr        = THREE.Mesh.prototype;


/*
 * Add 
 */

THREE.Skin.prototype.addBone = function( object3D ) {
	
	if( object3D === undefined ) 
		object3D = new THREE.Object3D();
	
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

	this.boneMatrices     = [];
	this.bonePoseMatrices = [];

	for( var b = 0; b < this.bones.length; b++ ) {

		this.bonePoses[ b ] = tempMatrix.multiply( this.bonesRootInverse, this.bones[ b ].globalMatrix );
		this.bonePoses[ b ] = THREE.Matrix4.makeInvert( tempMatrix );
		
		this.boneMatrices    [ b ] = this.bones    [ b ].globalMatrix.flatten32;
		this.bonePoseMatrices[ b ] = this.bonePoses[ b ].flatten32;
	}	
}
