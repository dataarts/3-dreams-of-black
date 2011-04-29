var VoxelPainter = function () {

	var scene, ground;
	var voxel_size = 50, voxel_geometry, voxel_material, voxels = [], grid = {};

	ground = new THREE.Mesh( new THREE.Plane( 2000, 2000, 40, 40 ), material );
	ground.position.x = - 25;
	ground.position.y = - 25;
	ground.position.z = - 25;
	ground.rotation.x = - 90 * Math.PI / 180;
	sceneVoxels.addObject( ground );


	this.add = function ( vector ) {

		

	};

	this.remove = function ( vector ) {

		

	};

};
