/*
 * Constructor
 */

THREE.Object3D = function() {

	this.visible      = true;
	this.renderable   = false;
	
	this.parent		  = undefined;
	this.children     = [];

	this.localMatrix  = new THREE.Matrix4();
	this.globalMatrix = new THREE.Matrix4();
	//this.position     = new THREE.Vector3();
	this.isDirty      = true;

	this.boundRadius  = 0;
	this.screenZ      = 0;

	this.added        = new signals.Signal();
	this.removed      = new signals.Signal();

	this.position = {
		
		that: this,
		
		get x()      { return this.that.localMatrix.elements[ 12 ]; },
		set x( val ) { this.that.localMatrix.n14 = val; this.that.isDirty = true; },
	
		get y()      { return this.that.localMatrix.elements[ 13 ]; },
		set y( val ) { this.that.localMatrix.n24 = val; this.that.isDirty = true; },
	
		get z()      { return this.that.localMatrix.elements[ 14 ]; },
		set z( val ) { this.that.localMatrix.n34 = val; this.that.isDirty = true; }
	}

}

/*
 * Update
 */

THREE.Object3D.prototype.update = function( parentGlobalMatrix, forceUpdate, scene, camera ) {

	// visible?
	
	if( !this.visible ) return;


	// update this

	if( forceUpdate || this.isDirty ) {
		
		this.isDirty = false;
		forceUpdate  = true;
		
		if( parentGlobalMatrix )
			this.globalMatrix.multiply( parentGlobalMatrix, this.localMatrix );
		else
			this.globalMatrix.set( this.localMatrix );
	}
	

	// update children

	for( var i = 0; i < this.children.length; i++ )
		this.children[ i ].update( this.globalMatrix, forceUpdate, scene, camera );
	
	
	// check camera frustum and add to scene capture list
	
	if( this.renderable && camera.frustum.contains( this )) {
		
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
		child.added.dispatch( this );
	}
};


/*
 * RemoveChild
 */

THREE.Object3D.prototype.removeChild = function() {
	
	var childIndex = this.children.indexOf( child ); 
	
	if( childIndex !== -1 )	{
		
		this.children.splice( childIndex, 1 );
		child.removed.dispatch( this );
	}
};
