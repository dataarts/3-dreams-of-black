/*
 * LOD
 */

THREE.LOD = function() {

	THREE.Object3D.call( this );

	this.LODs = [];
}

THREE.LOD.prototype             = new THREE.Object3D();
THREE.LOD.prototype.constructor = THREE.LOD;
THREE.LOD.prototype.supr        = THREE.Object3D.prototype;

/*
 * Add
 */

THREE.LOD.prototype.add = function( object3D, visibleAtDistance ) {
	
	if( visibleAtDistance === undefined ) visibleAtDistance = 0;
	visibleAtDistance = Math.abs( visibleAtDistance );
	
	for( var l = 0; l < this.LODs.length; l++ ) {
		
		if( visibleAtDistance < this.LODs[ l ].visibleAtDistance )
			break;
	}
	
	this.LODs.splice( l, 0, { visibleAtDistance: visibleAtDistance, object3D: object3D } );
	this.addChild( object3D );
}


/*
 * Update
 */

THREE.LOD.prototype.update = function( parentGlobalMatrix, forceUpdate, scene, camera ) {
	
	forceUpdate = this.updateMatrix( parentGlobalMatrix, forceUpdate, scene, camera );
	

	// calc z and show/hide nodes
	
	var distance = -camera.inverseMatrix.mulitplyVector3OnlyZ( this.position );

	for( var l = 0; l < this.LODs.length; l++ ) 
		this.LODs[ l ].object3D.visible = false;
		
	
	for( var l = 0; l < this.LODs.length; l++ ) {
		
		if( distance < this.LODs[ l ].visibleAtDistance ) {
			
			this.LODs[ l ].object3D.visible = true;
			break;
		}
	}
	
	if( l === this.LODs.length )
		this.LODs[ l - 1 ].object3D.visible = true;
	

	// update children

	for( var c = 0; c < this.children.length; c++ )
		this.children[ c ].update( this.globalMatrix, forceUpdate, scene, camera );
}

