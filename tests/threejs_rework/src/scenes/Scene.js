/*
 * Construct
 */

THREE.Scene = function() {
	
	// call super
	
	THREE.Object3D.call( this );
};

THREE.Scene.prototype             = new THREE.Object3D();
THREE.Scene.prototype.constructor = THREE.Scene;
THREE.Scene.prototype.supr        = THREE.Object3D.prototype;

/*
 * Backward Compatibility
 */

 THREE.Scene.prototype.addObject = THREE.Object3D.prototype.addChild;