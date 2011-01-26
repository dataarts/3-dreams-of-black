/*
 * Constructor
 */

THREE.Camera = function( FOV, aspect, zNear, zFar, renderer, target ) {
	
	// call super
	
	THREE.Object3D.call( this );
	
	
	// set arguments
	
	this.FOV      = FOV      || 45;
	this.aspect   = aspect   || 1.0;
	this.zNear    = zNear    || 0;
	this.zFar     = zFar     || 1000;
	this.renderer = renderer || THREE.RendererWebGL;
	this.target   = target   || new THREE.Object3D();
	

	// init
	
	this.frustum           = new THREE.Frustum( this );
	this.inverseMatrix     = new THREE.Matrix4();
	this.perspectiveMatrix = new THREE.Matrix4();
	
	this.perspectiveMatrix.perspective( FOV, aspect, zNear, zFar );
}

THREE.Camera.prototype             = new THREE.Object3D();
THREE.Camera.prototype.constructor = THREE.Camera;
THREE.Camera.prototype.supr        = THREE.Object3D.prototype;


/*
 * Update
 */

THREE.Camera.prototype.update = function( parentGlobalMatrix, forceUpdate, scene, camera ) {
	
	// call "super"
	
	var wasDirty = this.isDirty;
	this.supr.update.call( this, parentGlobalMatrix, forceUpdate, scene, camera )
	
	
	// update inverse
	
	if( wasDirty )		
		this.globalMatrix.inverse( this.inverseMatrix );
}
