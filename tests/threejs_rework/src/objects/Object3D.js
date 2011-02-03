/*
 * Constructor
 */

THREE.Object3D = function() {

	this.visible      = true;
	this.renderable   = false;
	
	this.parent		  = undefined;
	this.children     = [];

	this.position     = new THREE.Vector3();
	this.rotation     = new THREE.Vector3();
	this.scale        = new THREE.Vector3( 1, 1, 1 );
	this.localMatrix  = new THREE.Matrix4();
	this.globalMatrix = new THREE.Matrix4();
	this.quaternion   = new THREE.Quaternion();

	this.boundRadius  = 0;
	this.screenZ      = 0;
}


/*
 * Update
 */

THREE.Object3D.prototype.update = function( parentGlobalMatrix, forceUpdate, scene, camera ) {

	// visible?
	
	if( !this.visible ) return;

	
	// update position
	
	var isDirty = false;
	
	if( this.position.isDirty ) {
		
		this.localMatrix.setPosition( this.position );
		this.position.isDirty = false;
		isDirty = true;
	}

	// update quaternion (overrules rotation by forcing rotation.isDirty=false)
	
	if( this.quaternion.isDirty ) {
		
		this.localMatrix.setRotationFromQuaternion( this.quaternion );
		this.quaternion.isDirty = false;
		this.rotation  .isDirty = false;
		
		if( this.scale.isDirty || this.scale.x !== 1 || this.scale.y !== 1 || this.scale.z !== 1 ) {
			
			this.localMatrix.scale( this.scale );
			this.scale.isDirty = false;
		}
		
		isDirty = true;
	}


	// update rotation

	if( this.rotation.isDirty ) {
		
		this.localMatrix.setRotationFromEuler( this.rotation );
		this.rotation.isDirty = false;

		if( this.scale.isDirty || this.scale.x !== 1 || this.scale.y !== 1 || this.scale.z !== 1 ) {
			
			this.localMatrix.scale( this.scale );
			this.scale.isDirty = false;
		}

		isDirty = true;
	}


	// update scale
	
	if( this.scale.isDirty ) {
		
		this.localMatrix.setRotationFromEuler( this.rotation );
		this.localMatrix.scale( this.scale );
		
		this.scale.isDirty = false;
		isDirty = true;
	}


	if( forceUpdate || isDirty ) {
		
		forceUpdate = true;
		
		if( parentGlobalMatrix )
			this.globalMatrix.multiply( parentGlobalMatrix, this.localMatrix );
		else
			this.globalMatrix.set( this.localMatrix );
	}
	

	// update children

	for( var i = 0; i < this.children.length; i++ )
		this.children[ i ].update( this.globalMatrix, forceUpdate, scene, camera );
	
	
	// check camera frustum and add to scene capture list
	
	if( scene && this.renderable && camera.frustum.contains( this )) {
		
		this.screenZ = camera.frustum.screenZ;
		scene.capture( this );
	}
};


/*
 * AddChild
 */

THREE.Object3D.prototype.addChild = function( child ) {
	
	if( child.parent !== undefined )
		child.parent.removeChild( child );
		
	if( this.children.indexOf( child ) === -1 ) {
		
		this.children.push( child );
	}
};


/*
 * RemoveChild
 */

THREE.Object3D.prototype.removeChild = function() {
	
	var childIndex = this.children.indexOf( child ); 
	
	if( childIndex !== -1 )	{
		
		this.children.splice( childIndex, 1 );
	}
};
