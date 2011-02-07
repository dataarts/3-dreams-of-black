/*
 * Skin
 */

THREE.Skin = function( geometry, materials ) {
	
	THREE.Mesh.call( this, geometry, materials );
	
	
	// init bones

	this.bones        = [];
	this.boneInverses = [];
	this.boneMatrices = [];
	
	if( this.geometry.bones !== undefined ) {
		
		for( var b = 0; b < this.geometry.bones.length; b++ ) {
			
			var bone = this.addBone();
			
			bone.position.x   = this.geometry.bones[ b ].pos [ 0 ];
			bone.position.y   = this.geometry.bones[ b ].pos [ 1 ];
			bone.position.z   = this.geometry.bones[ b ].pos [ 2 ];
			bone.quaternion.x = this.geometry.bones[ b ].rotq[ 0 ];
			bone.quaternion.y = this.geometry.bones[ b ].rotq[ 1 ];
			bone.quaternion.z = this.geometry.bones[ b ].rotq[ 2 ];
			bone.quaternion.w = this.geometry.bones[ b ].rotq[ 3 ];
			bone.scale.x      = 1;//this.geometry.bones[ b ].scl [ 0 ];
			bone.scale.y      = 1;//this.geometry.bones[ b ].scl [ 1 ];
			bone.scale.z      = 1;//this.geometry.bones[ b ].scl [ 2 ];
		}
		
		for( var b = 0; b < this.bones.length; b++ ) {
			
			if( this.geometry.bones[ b ].parent === -1 ) 
				this.addChild( this.bones[ b ] );
			else
				this.bones[ this.geometry.bones[ b ].parent ].addChild( this.bones[ b ] );
		}
		
		this.pose();
	}
}

THREE.Skin.prototype             = new THREE.Mesh();
THREE.Skin.prototype.constructor = THREE.Skin;
THREE.Skin.prototype.supr        = THREE.Mesh.prototype;


/*
 * Update
 */

THREE.Skin.prototype.update = function( parentGlobalMatrix, forceUpdate, scene, camera ) {
	
	if( this.visible && this.autoUpdateMatrix ) {
		
		if( this.supr.updateMatrix.call( this, parentGlobalMatrix, forceUpdate, scene, camera )) {
			
//			this.pose();
			THREE.Matrix4.makeInvert( this.globalMatrix, this.bonesRootInverse );	
		}
	}
	

	// check camera frustum and add to scene capture list
	
	if( scene && camera && camera.frustum.contains( this )) {
		
		this.screenZ = camera.frustum.screenZ;
		scene.capture( this );
	}
}


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

	this.update( undefined, true );
	
	for( var b = 0; b < this.bones.length; b++ ) {
		
		this.boneInverses.push( THREE.Matrix4.makeInvert( this.bones[ b ].globalMatrix, new THREE.Matrix4()));
		this.boneMatrices.push( this.bones[ b ].globalMatrix.flatten32 );
	}
	

	// project vertices to local 

	this.geometry.skinVerticesA = [];
	this.geometry.skinVerticesB = [];
	var orgVertex;
	var vertex;

	for( var i = 0; i < this.geometry.skinIndices.length; i++ ) {
		
		orgVertex = this.geometry.vertices[ i ].position;

		vertex = new THREE.Vector3( orgVertex.x, orgVertex.y, orgVertex.z );
		this.geometry.skinVerticesA.push( this.boneInverses[ this.geometry.skinIndices[ i ].x ].multiplyVector3( vertex ));

		vertex = new THREE.Vector3( orgVertex.x, orgVertex.y, orgVertex.z );
		this.geometry.skinVerticesB.push( this.boneInverses[ this.geometry.skinIndices[ i ].y ].multiplyVector3( vertex ));
	}
}



/*

THREE.Skin.prototype.pose = function() {
	
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
*/