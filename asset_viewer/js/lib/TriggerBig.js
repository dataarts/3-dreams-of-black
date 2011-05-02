/**
 * @author Mikael Emtinger
 */

TriggerBig = function( geometry ) {

	// remove all face materials

	var f, fl, faces = geometry.faces;
	
	for( f = 0, fl = faces.length; f < fl; f++ ) {
		
		faces[ f ].materials = [];
		
	}	


	// setup mesh

	this.mesh = new THREE.Mesh( geometry, triggerMat );
	this.mesh.doubleSided = true;

	// setup interal

	var morphTargetOrder = this.mesh.morphTargetForcedOrder;

	morphTargetOrder[ 0 ] = 0;
	morphTargetOrder[ 1 ] = 1;


	//--- public ---

	return this;
	
}



