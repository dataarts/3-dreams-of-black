THREE.Skin = function() {
	
	THREE.Mesh.call( this );
}

THREE.Skin.prototype             = new THREE.Mesh;
THREE.Skin.prototype.constructor = THREE.Skin;
THREE.Skin.prototype.supr        = THREE.Mesh.prototype;

