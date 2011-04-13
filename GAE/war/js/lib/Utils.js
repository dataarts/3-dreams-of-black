function preInitModel( geometry, renderer, scene, object ) {
	
	// pre-initialize buffers

	renderer.initWebGLObjects( scene );

	// this makes videos black

	// pre-initialize shaders

	var i, material;
	
	for( i = 0; i < geometry.materials.length; i++ ) {

		material = geometry.materials[ i ][ 0 ];

		if ( ! ( material instanceof THREE.MeshFaceMaterial ) ) {

			if( !material.program ) {

				//renderer.initMaterial( material, scene.lights, scene.fog, object );
				
			}

		}

	}


};