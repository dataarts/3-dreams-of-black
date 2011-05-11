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

				// dirty hack, otherwise some textures stay black
				
				//setTimeout( function() { renderer.initMaterial( material, scene.lights, scene.fog, object ); }, 250 );
				
			}

		}

	}


};

function preInitScene( result, renderer ) {

	renderer.initWebGLObjects( result.scene );
	
	var m, material;

	for ( m in result.materials ) {

		material = result.materials[ m ];
		if ( ! ( material instanceof THREE.MeshFaceMaterial ) ) {

			if( !material.program ) {

				// dirty hack, otherwise some textures stay black

				setTimeout( function() { renderer.initMaterial( material, result.scene.lights, result.scene.fog ); }, 250 );

			}

		}

	}

};

function preinitAnimal( animal, renderer, scene ) {
	
	//console.log( animal );
	
	renderer.initWebGLObjects( scene );
	
	// this makes weird things
	
	//var material = animal.mesh.materials[ 0 ];
	//setTimeout( function() { renderer.initMaterial( material, scene.lights, scene.fog, animal.mesh ); }, 100 );

};

LensFlareTextures = {
	
	texture0: undefined,
	texture1: undefined,
	texture2: undefined
	
};

function initLensFlares( position, sx, sy ) {

	if ( LensFlareTextures.texture0 === undefined ) {
		
		LensFlareTextures.texture0 = THREE.ImageUtils.loadTexture( "/files/textures/lensflare0.png" );
		LensFlareTextures.texture1 = THREE.ImageUtils.loadTexture( "/files/textures/lensflare2.png" );
		LensFlareTextures.texture2 = THREE.ImageUtils.loadTexture( "/files/textures/lensflare3.png" );
		
	}

	var lensFlare = new THREE.LensFlare( LensFlareTextures.texture0, 700, 0.0, THREE.AdditiveBlending );

	lensFlare.add( LensFlareTextures.texture1, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( LensFlareTextures.texture1, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( LensFlareTextures.texture1, 512, 0.0, THREE.AdditiveBlending );

	lensFlare.add( LensFlareTextures.texture2,  60, 0.6, THREE.AdditiveBlending );
	lensFlare.add( LensFlareTextures.texture2,  70, 0.7, THREE.AdditiveBlending );
	lensFlare.add( LensFlareTextures.texture2, 120, 0.9, THREE.AdditiveBlending );
	lensFlare.add( LensFlareTextures.texture2,  70, 1.0, THREE.AdditiveBlending );

	lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	lensFlare.position.copy( position );

	var lensFlareRotate = new THREE.Object3D();
	lensFlareRotate.addChild( lensFlare );

	lensFlareRotate.rotation.x = sx * Math.PI / 180;
	lensFlareRotate.rotation.y = sy * Math.PI / 180;

	return lensFlareRotate;

};


function lensFlareUpdateCallback( object ) {

	var flare, f, fl = object.lensFlares.length;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2; 

	for( f = 0; f < fl; f++ ) {
   
		flare = object.lensFlares[ f ];
   
		flare.x = object.positionScreen.x + vecX * flare.distance;
		flare.y = object.positionScreen.y + vecY * flare.distance;

		flare.rotation = 0;

	}

	// hard coded stuff

	object.lensFlares[ 2 ].y += 0.025;
	object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + 45 * Math.PI / 180;

};

function makeSceneStatic( scene ) {

	var i, l, object;
	
	for ( i = 0, l = scene.objects.length; i < l; i ++ ) {

		object = scene.objects[ i ];
		object.matrixAutoUpdate = false;
		object.updateMatrix();

	}

};

function hideColliders( scene ) {
	
	var i, l, mesh;

	for( i = 0, l = scene.collisions.colliders.length; i < l; i++ ) {

		mesh = scene.collisions.colliders[ i ].mesh;
		mesh.visible = false;
	}

};

function applyMaterial( result, ids, material ) {
	
	var i, id, n, l = ids.length;

	for ( i = 0; i < l; i++ ) {
		
		id = ids[ i ][ 0 ];
		n = ids[ i ][ 1 ];
		
		if ( result.objects[ id ] ) {
			
			result.objects[ id ].geometry.materials[ n ][ 0 ] = material;

		}
		
	}
	
};
