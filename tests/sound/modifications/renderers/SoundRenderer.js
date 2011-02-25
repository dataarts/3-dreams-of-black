THREE.SoundRenderer = function() {
	
	this.volume        = 1;
	this.domElement    = document.createElement( "div" );
	this.domElement.id = "THREESound"; 
	this.viewMatrix    = new THREE.Matrix4();
	this.viewPosition  = new THREE.Vector3();
	
	/*
	 * Render
	 */
	
	this.render = function( scene, camera, callSceneUpdate ) {
		
		if( callSceneUpdate )
			scene.update( undefined, false, camera );
		
		
		// loop through all sounds
		
		var sound;
		var sounds = scene.sounds;
		var s, l = sounds.length;
		var cameraInverse = camera.inverseMatrix;	// THIS SHOULD BE camera.inverseMatrix BUT THAT DOESN'T WORK!?
		var viewMatrix    = this.viewMatrix;
		var viewPosition  = this.viewPosition;
		
		for( s = 0; s < l; s++ ) {
			
			sound = sounds[ s ];
			
			if( sound.isPlaying && sound.isLoaded ) {
				
				if( !sound.isAddedToDOM )
					sound.addToDOM( this.domElement ); 
				
				
				// get camera relative position 
				
				viewMatrix.multiply( cameraInverse, sound.globalMatrix );
				viewPosition.set( viewMatrix.n14, viewMatrix.n24, viewMatrix.n34 );

				sound.calculateVolumeAndPan( viewPosition );
			}
		}
	}	
}
