/*
 * Mesh
 */

THREE.Mesh = function( geometry, materials ) {

	THREE.Object3D.call( this );
	
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

THREE.Mesh.prototype.update = function( parentGlobalMatrix, forceUpdate, scene, camera ) {
	
	// visible, auto update and inside camera frustum?
	
	if( this.visible && this.autoUpdateMatrix )
	{
		forceUpdate |= this.updateMatrix( parentGlobalMatrix, forceUpdate, scene, camera );
		
		if( forceUpdate ) {
			
			// update normal matrix
		}


		// update children
	
		for( var i = 0; i < this.children.length; i++ )
			this.children[ i ].update( this.globalMatrix, forceUpdate, scene, camera );


		// check camera frustum and add to scene capture list

		
		if( scene && camera && camera.frustumContains( this ))
			scene.capture( this );
	}
}

