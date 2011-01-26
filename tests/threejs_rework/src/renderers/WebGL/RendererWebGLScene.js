THREE.RendererWebGL.Scene = {};

/*
 * Scebe Update
 */

THREE.RendererWebGL.Scene.update = function( camera ) {

	this.opaqueShaderProgramDictionary = {};
	this.transparentShaderProgramList  = [];
	this.supr.update.call( this, undefined, false, this, camera );
}


/*
 * Scene capture
 */

THREE.RendererWebGLScene.capture = function( renderable ) {
	
	var shaderProgram = renderable.material.shaderProgram;
	
	if( shaderProgram.blendMode === undefined || shaderProgram.blendMode === "src" )
	{
		if( this.opaqueShaderProgramDictionary === undefined )
			this.opaqueShaderProgramDictionary[ shaderProgram.id ] = [];
			
		this.opaqueShaderProgramDictionary[ shaderProgram.id ].push( renderable );
	}
	else
		this.transparentShaderProgramList.push( renderable );
};


