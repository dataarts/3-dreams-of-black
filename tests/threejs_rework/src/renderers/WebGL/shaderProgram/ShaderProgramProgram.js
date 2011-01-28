/*
 * Helper for creating Shader Program and reuse if already exists
 */

THREE.ShaderProgramProgram = function( GL, vertexShaderId, fragmentShaderId ) {
	
	//--- Construct ---
	
	this.GL              = GL;
	this.vertexShader    = 0;
	this.fragmentShader  = 0;
	this.program         = 0;
	this.id              = vertexShaderId + "_" + fragmentShaderId;
	
	if( THREE.ShaderProgramProgramDictionary[ this.id ] === undefined ) {
		
		this.initVertexShader  ( vertexShaderId   );
		this.initFragmentShader( fragmentShaderId );
		this.initShaderProgram();
	
		THREE.ShaderProgramProgramDictionary[ this.id ] = this.program;
	}
	else {
		
		this.program = THREE.ShaderProgramProgramDictionary[ this.id ];
	}
}

THREE.ShaderProgramProgram.prototype.initVertexShader = function( id ) {
	
	this.vertexShader = this.GL.createShader( this.GL.VERTEX_SHADER );
	
	this.GL.shaderSource ( this.vertexShader, THREE.Shader[ id ] );
	this.GL.compileShader( this.vertexShader );

    if( !this.GL.getShaderParameter( this.vertexShader, this.GL.COMPILE_STATUS ))
	{
		alert( "THREE.ShaderProgramProgram.InitVertexProgram: " + this.GL.getShaderInfoLog( this.vertexShader ));
		return;
	}
}


THREE.ShaderProgramProgram.prototype.initFragmentShader = function( id ) {
	
	this.fragmentShader = this.GL.createShader( this.GL.FRAGMENT_SHADER );
	
	this.GL.shaderSource ( this.fragmentShader, THREE.Shader[ id ] );
	this.GL.compileShader( this.fragmentShader );

    if( !this.GL.getShaderParameter( this.fragmentShader, this.GL.COMPILE_STATUS )) 
	{
		alert( "THREE.ShaderProgramProgram.InitFragmentShader: " + this.GL.getShaderInfoLog( this.fragmentShader ));
		return;
	}
}


THREE.ShaderProgramProgram.prototype.initShaderProgram = function() {
	
    this.program = this.GL.createProgram();

    this.GL.attachShader( this.program, this.vertexShader );
    this.GL.attachShader( this.program, this.fragmentShader );
    this.GL.linkProgram ( this.program );

    if( !this.GL.getProgramParameter( this.program, this.GL.LINK_STATUS ))
	{
		alert( "THREE.ShaderProgramProgram.InitShaderProgram: Could not initialise program" );
		return;
    }
}


/*
 * Dictionary and helpers
 */

THREE.ShaderProgramProgramDictionary = {};
