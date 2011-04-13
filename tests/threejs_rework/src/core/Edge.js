/*
 * Edge
 * Keeps reference to two faces and two vertices, which form the edge between two faces
 */

THREE.Edge = function( parameters ) {
	
	this.faces    = parameters.faces;			// two faces
	this.vertices = parameters.vertices;		// two or four vertices
	
	if( parameters.extrudable ) {
		
		this.extrusionFace       = new THREE.Face4( parameters.indices[ 0 ], parameters.indices[ 1 ], parameters.indices[ 2 ], parameters.indices[ 3 ] );
		this.belongsToSilhouette = false;

	}
}


/*
 * Mark faces in shadow
 * Discuss: is it really the best way to add a new property to Face3/4
 */

THREE.Edge.prototype.markFacesInShadow = function( lightDirection ) {
	
	var dotA = this.faces[ 0 ].normal.dot( lightDirection );
	var dotB = this.faces[ 1 ].normal.dot( lightDirection );
	
	this.faces[ 0 ].isInShadow = dotA < 0 ? false : true;
	this.faces[ 1 ].isInShadow = dotB < 0 ? false : true;
	
	if(( dotA < 0 && dotB >= 0 ) ||
	   ( dotB < 0 && dotA >= 0 ))
		this.belongsToSilhouette = true;
	else
		this.belongsToSilhouette = false;

}

