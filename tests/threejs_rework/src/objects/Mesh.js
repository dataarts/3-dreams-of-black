/*
 * Mesh
 */

THREE.Mesh = function( geometry, materials ) {

	THREE.Object3D.call( this );
	
	this.geometry     = geometry;
	this.materials    = materials && materials.length ? materials : [ materials ];
	this.normalMatrix = new THREE.Matrix4();
	this.normalMatrix = THREE.Matrix4.makeNormal( this.globalMatrix, this.normalMatrix );
	
	
	// calc bound radius
	
	if( this.geometry ) {
		
		if( !this.geometry.boundingSphere )
			 this.geometry.computeBoundingSphere();
	
		this.boundRadius = geometry.boundingSphere.radius;
	}
}

THREE.Mesh.prototype             = new THREE.Object3D();
THREE.Mesh.prototype.constructor = THREE.Mesh;
THREE.Mesh.prototype.supr        = THREE.Object3D.prototype;


/*
 * Update
 */

THREE.Mesh.prototype.update = function( parentGlobalMatrix, forceUpdate, camera, renderer ) {
	
	// visible, auto update and inside camera frustum?
	
	if( this.visible )
	{
		if( this.autoUpdateMatrix )
			forceUpdate |= this.updateMatrix( parentGlobalMatrix, forceUpdate );


		// update children
	
		for( var i = 0; i < this.children.length; i++ )
			this.children[ i ].update( this.globalMatrix, forceUpdate, camera, renderer );


		// check camera frustum and add to renderer capture list
		
		if( renderer && camera ) {
			
			if( camera.frustumContains( this ))
				renderer.addToRenderList( this );
			else
				renderer.removeFromRenderList( this );
		}
	}
}


THREE.Mesh.prototype.updateMatrix = function( parentGlobalMatrix, forceUpdate ) {

	if( this.supr.updateMatrix.call( this, parentGlobalMatrix, forceUpdate )) 
		THREE.Matrix4.makeNormal( this.globalMatrix, this.normalMatrix );
}
