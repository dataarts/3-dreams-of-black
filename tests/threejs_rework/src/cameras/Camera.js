/*
 * Constructor
 */

THREE.Camera = function( FOV, aspect, zNear, zFar, renderer, target ) {
	
	// call super
	
	THREE.Object3D.call( this );
	
	
	// set arguments
	
	this.FOV      = FOV      || 50;
	this.aspect   = aspect   || 1.0;
	this.zNear    = zNear    || 0.1;
	this.zFar     = zFar     || 2000;
	this.renderer = renderer || THREE.RendererWebGL;
	this.target   = target   || { position: new THREE.Vector3( 0, 0, 0 ) };
	this.up       = new THREE.Vector3( 0, 1, 0 );
	

	// init
	
	this.frustum           = new THREE.Frustum( this );
	this.inverseMatrix     = new THREE.Matrix4();
	this.perspectiveMatrix = THREE.Matrix4.makePerspective( this.FOV, this.aspect, this.zNear, this.zFar );
}

THREE.Camera.prototype             = new THREE.Object3D();
THREE.Camera.prototype.constructor = THREE.Camera;
THREE.Camera.prototype.supr        = THREE.Object3D.prototype;

/*
 * Update perspective matrix
 */

THREE.Camera.prototype.updatePerspectiveMatrix = function() {
	
	this.perspectiveMatrix = THREE.Matrix4.makePerspective( this.FOV, this.aspect, this.zNear, this.zFar );
} 


/*
 * Update
 */

THREE.Camera.prototype.update = function( parentGlobalMatrix, forceUpdate, scene, camera ) {
	
	if( this.updateMatrix( parentGlobalMatrix, forceUpdate, scene, camera ))
		THREE.Matrix4.makeInvert( this.globalMatrix, this.inverseMatrix );	
}
