/*
 * Construct
 */

THREE.Scene = function() {
	
	// call super
	
	THREE.Object3D.call( this );
	
	
	// vars
	
	this.captureList = {};
};

THREE.Scene.prototype             = new THREE.Object3D();
THREE.Scene.prototype.constructor = THREE.Scene;
THREE.Scene.prototype.supr        = THREE.Object3D.prototype;


/*
 * Update
 */

THREE.Scene.prototype.update = function( camera ) {
	
	// set by renderer
}


/*
 * Capture
 */

THREE.Scene.prototype.capture = function( renderable ) {
	
	// set by renderer
}
