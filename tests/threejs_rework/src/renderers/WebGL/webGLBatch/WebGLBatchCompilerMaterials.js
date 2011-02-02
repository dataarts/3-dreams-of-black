/*
 * Material Compiler. Merges Three Materials into shader code 
 */

THREE.WebGLBatchCompilerMaterials = (function() {

	var that = {};

	//--- compile materials ---
	
	var compile = function( materials ) {
		
		// todo: insert magic
		// temp: pick first material and assign shader
		
		if( materials[ 0 ] instanceof THREE.MeshLambertMaterial ) {
			
			that.vertexShader   = "lambertVertex";
			that.fragmentShader = "lambertFragment";
		}
	}
	
	
	//--- public ---
	
	that.compile        = compile;
	that.vertexShader   = "";
	that.fragmentShader = "";
	
	return that;
}());
