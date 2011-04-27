/**
 * @author Mikael Emtinger
 */

TriggerBig = function( geometry, wantedParent ) {
	
	// setup materials
	
	var that = {};
	var material = new THREE.MeshShaderMaterial( {
		
		uniforms: TriggerBigShader.uniforms(),
		vertexShader: TriggerBigShader.vertexShader,
		fragmentShader: TriggerBigShader.fragmentShader, 
		
		shading: THREE.FlatShading,
		lights: true,
		fog: true,
		morphTargets: true,
		vertexColors: 1
		
	} );

	
	// remove all face materials
		
	var f, fl, faces = geometry.faces;
	
	for( f = 0, fl = faces.length; f < fl; f++ ) {
		
		faces[ f ].materials = [];
		
	}	


	// setup mesh

	that.mesh = new THREE.Mesh( geometry, material );
	that.mesh.doubleSided = true;


	// setup interal

	var morphTargetOrder = that.mesh.morphTargetForcedOrder;

	morphTargetOrder[ 0 ] = 0;
	morphTargetOrder[ 1 ] = 1;


	//--- public ---

	return that;
	
}


TriggerBigShader = {

	effectors: [ 0, 200, 0, 0, 0, 0 ],		// xyz xyz for each effector (remeber to change const in shader, too)
	
	uniforms: function () {

		return {

				"effectors": 					{ type: "fv", value: TriggerBigShader.effectors },

				"diffuse":                      { type: "c", value: new THREE.Color( 0xffffff ) },

				"fogColor": 					{ type: "c", value: new THREE.Color() },
				"fogDensity": 					{ type: "f", value: 0 },

				"enableLighting": 				{ type: "i", value: 1 },
				"ambientLightColor": 			{ type: "fv", value: [] },
				"directionalLightDirection": 	{ type: "fv", value: [] },
				"directionalLightColor": 		{ type: "fv", value: [] },
				"pointLightColor": 				{ type: "fv", value: [] },
				"pointLightPosition": 			{ type: "fv", value: [] },
				"pointLightDistance": 			{ type: "fv1", value: [] }

		   }
	},


	vertexShader: [

		"const 		int		NUMEFFECTORS = 2;",
		"uniform 	vec3 	effectors[ NUMEFFECTORS ];",
		
		THREE.ShaderChunk[ "map_pars_vertex" ],
		THREE.ShaderChunk[ "lights_pars_vertex" ],
		THREE.ShaderChunk[ "color_pars_vertex" ],
		THREE.ShaderChunk[ "morphtarget_pars_vertex" ],

		"varying vec3 vLightWeighting;",

		"float elastic( float k ) {",
		
		    "float s;",
		    "float a = 0.8;",
		    "float p = 0.7;",
		    "if ( k == 0.0 ) return 0.0; if ( k == 1.0 ) return 1.0; if ( p == 0.0 ) p = 0.3;",
		    "if ( a == 0.0 || a < 1.0 ) { a = 1.0; s = p / 4.0; }",
		    "else s = p / ( 2.0 * 3.14159265 ) * asin( 1.0 / a );",
		    "return ( a * pow( 2.0, -10.0 * k ) * sin( ( k - s ) * ( 2.0 * 3.14159265 ) / p ) + 1.0 );",
		
		"}",

		"void main() {",

			"vec3 worldPosition = ( objectMatrix * vec4( position, 1.0 )).xyz;",
			"float morph = 0.0;",
			
			"for( int i = 0; i < NUMEFFECTORS; i++ ) {",
			
				"morph = max( morph, smoothstep( 0.0, 0.4, 1.0 - distance( morphTarget0, effectors[ i ] ) / 2000.0 ));",
//				"morph = distance( worldPosition, effectors[ i ] ) / 1000.0;",
			
			"}",
			
			"morph = elastic( morph );",
						
			"vec4 mvPosition = modelViewMatrix * vec4( mix( morphTarget0, morphTarget1, morph ), 1.0 );",

			THREE.ShaderChunk[ "map_vertex" ],
			THREE.ShaderChunk[ "color_vertex" ],

			"vec3 transformedNormal = normalize( normalMatrix * normal );",

			THREE.ShaderChunk[ "lights_vertex" ],

			"gl_Position = projectionMatrix * mvPosition;",

		"}",
		
		
	].join("\n"),

	fragmentShader: [

		"uniform float  darkness;",
		"uniform vec3 	diffuse;",
		"uniform float 	opacity;",

		"varying vec3 vLightWeighting;",

		THREE.ShaderChunk[ "color_pars_fragment" ],
		THREE.ShaderChunk[ "map_pars_fragment" ],
		THREE.ShaderChunk[ "fog_pars_fragment" ],

		"void main() {",

			"gl_FragColor = vec4( diffuse, opacity );",
			"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",

			THREE.ShaderChunk[ "map_fragment" ],
			THREE.ShaderChunk[ "color_fragment" ],

			"gl_FragColor = vec4( gl_FragColor.rgb * ( 1.0 - darkness ), 1.0 );",

			THREE.ShaderChunk[ "fog_fragment" ],

		"}"

	].join("\n")

}

