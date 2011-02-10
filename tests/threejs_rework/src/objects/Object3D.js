/*
 * Constructor
 */

THREE.Object3D = function() {

	this.visible          = true;
	this.autoUpdateMatrix = true;
	
	this.parent		  = undefined;
	this.children     = [];

	this.position       = new THREE.Vector3();
	this.rotation       = new THREE.Vector3();
	this.scale          = new THREE.Vector3( 1, 1, 1 );
	this.localMatrix    = new THREE.Matrix4();
	this.globalMatrix   = new THREE.Matrix4();
	this.quaternion     = new THREE.Quaternion();
	this.useQuaternion  = false;
	this.screenPosition = new THREE.Vector4(); // xyzr
	
	this.boundRadius  = 10;
	this.screenZ      = 0;
}


/*
 * Update
 */

THREE.Object3D.prototype.update = function( parentGlobalMatrix, forceUpdate, scene, camera ) {

	// visible and auto update?
	
	if( this.visible && this.autoUpdateMatrix )
	{
		// was updated?
		
		forceUpdate |= this.updateMatrix( parentGlobalMatrix, forceUpdate, scene, camera );			


		// update children
	
		for( var i = 0; i < this.children.length; i++ )
			this.children[ i ].update( this.globalMatrix, forceUpdate, scene, camera );
	}
};


/*
 * Update Matrix
 */

THREE.Object3D.prototype.updateMatrix = function( parentGlobalMatrix, forceUpdate, scene, camera ) {
	
	// update position
	
	var isDirty = false;
	
	if( this.position.isDirty ) {
		
		this.localMatrix.setPosition( this.position );
		this.position.isDirty = false;
		isDirty = true;
	}


	// update quaternion
	
	if( this.useQuaternion ) {
		
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
	}

	// update rotation

	else if( this.rotation.isDirty ) {
	
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
		
		if( this.useQuaternion ) 
			this.localMatrix.setRotationFromQuaternion( this.quaternion );
		else
			this.localMatrix.setRotationFromEuler( this.rotation );

		this.localMatrix.scale( this.scale );
		this.scale.isDirty = false;

		isDirty = true;
	}


	// update global

	if( forceUpdate || isDirty ) {
		
		isDirty = true;
		
		if( parentGlobalMatrix )
			this.globalMatrix.multiply( parentGlobalMatrix, this.localMatrix );
		else
			this.globalMatrix.set( this.localMatrix );
	}
	
	return isDirty;
};


/*
 * AddChild
 */

THREE.Object3D.prototype.addChild = function( child ) {
	
	if( this.children.indexOf( child ) === -1 ) {

		if( child.parent !== undefined )
			child.parent.removeChild( child );
		
		child.parent = this;		
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
