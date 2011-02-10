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
	this.width    = 0;
	this.height   = 0;
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

/*
 * frustumContains
 */

THREE.Camera.prototype.frustumContains = function( object3D ) {

	// object pos

	return true;

	var vx0 = object3D.globalMatrix.n14, 
	    vy0 = object3D.globalMatrix.n24,
		vz0 = object3D.globalMatrix.n34;
		
	// rotate


	var inverse = this.inverseMatrix;

//	d = 1 / ( inverse.n41 * vx0 + inverse.n42 * vy0 + inverse.n43 * vz0 + inverse.n44 );

	var vx1 = ( inverse.n11 * vx0 + inverse.n12 * vy0 + inverse.n13 * vz0 + inverse.n14 );// * d;
	var vy1 = ( inverse.n21 * vx0 + inverse.n22 * vy0 + inverse.n23 * vz0 + inverse.n24 );// * d;
	var vz1 = ( inverse.n31 * vx0 + inverse.n32 * vy0 + inverse.n33 * vz0 + inverse.n34 );// * d;
		
		
	// project
	
	var perspective = this.perspectiveMatrix;
	var centerX     = this.width * 0.5;
	var centerY     = this.height * 0.5;
	
	var d = 1 / ( perspective.n43 * vz1 );
	vx1   = perspective.n11 * vx1 * d * centerX;
	vy1   = perspective.n22 * vy1 * d * this.height;
	var r = perspective.n11 * object3D.boundRadius * d * centerX;
	
	object3D.screenPosition.set( vx1, vy1, vz1, r );
	
	return true;
}
