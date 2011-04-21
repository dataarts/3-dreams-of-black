/**
 * @author Mikael Emtinger
 */

Trigger = function( geometry, wantedParent ) {
	
	// setup materials
	
	var that = {};
	var material = new THREE.MeshShaderMaterial( {
		
		uniforms: TriggerShader.uniforms(),
		vertexShader: TriggerShader.vertexShader,
		fragmentShader: TriggerShader.fragmentShader, 
		
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


	// create mesh and hide

	that.mesh = new THREE.Mesh( geometry, material );
	that.mesh.visible = false;


	// setup internals

	var wantedParent = wantedParent;
	var timeScale = 1;
	var currentTime = 0;
	var morphTargetOrder = that.mesh.morphTargetForcedOrder;
	var lengthInMS = ( geometry.morphTargets.length - 1 ) * 1000;

	morphTargetOrder[ 0 ] = 0;
	morphTargetOrder[ 1 ] = 1;


	//--- play ---

	that.play = function( _timeScale ) {
	
		timeScale = _timeScale || 1;
		currentTime = 0;

		that.mesh.visible = true;
		wantedParent && wantedParent.addChild( that.mesh );


		THREE.AnimationHandler.addToUpdate( that );
		that.update( 0 );
	} 


	//--- update ---
	
	that.update = function( deltaTimeMS ) {
		
		currentTime += deltaTimeMS * timeScale;
		
		if( currentTime >= lengthInMS ) {
			
			morphTargetOrder[ 0 ] = 0;
			morphTargetOrder[ 1 ] = that.mesh.geometry.morphTargets.length - 1;
			
			material.uniforms.morph.value = 1;
			
			THREE.AnimationHandler.removeFromUpdate( that );
			
		
		} else {
			
			var elasticTime = elastic( currentTime / lengthInMS ) * lengthInMS;

			if( elasticTime < lengthInMS ) {
				
				morphTargetOrder[ 0 ] = Math.floor( elasticTime / 1000 );
				morphTargetOrder[ 1 ] = Math.ceil( elasticTime / 1000 );
							
				
			} else {
				
				morphTargetOrder[ 0 ] = that.mesh.geometry.morphTargets.length - 2;
				morphTargetOrder[ 1 ] = that.mesh.geometry.morphTargets.length - 1;
				
			}

			material.uniforms.morph.value = elasticTime / lengthInMS;
			
		}
		
	}

	
	//--- elastic easout copied from TWEEN ---

	var elastic = function( k ) {

	    var s, a = 0.1, p = 0.7;
	    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	    if ( !a || a < 1 ) { a = 1; s = p / 4; }
	    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	    return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

	}



	//--- public ---

	return that;
	
}


TriggerShader = {

	uniforms: function () {

		return {

				"morph": 						{ type: "f", value: 0.0 },
				"darkness": 					{ type: "f", value: 0.0 },

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

		"uniform float	morph;",

		THREE.ShaderChunk[ "map_pars_vertex" ],
		THREE.ShaderChunk[ "lights_pars_vertex" ],
		THREE.ShaderChunk[ "color_pars_vertex" ],
		THREE.ShaderChunk[ "morphtarget_pars_vertex" ],

		"varying vec3 vLightWeighting;",

		"void main() {",

			"vec4 mvPosition = modelViewMatrix * vec4( mix( morphTarget0, morphTarget1, morph ), 1.0 );",

			THREE.ShaderChunk[ "map_vertex" ],
			THREE.ShaderChunk[ "color_vertex" ],

			"vec3 transformedNormal = normalize( normalMatrix * normal );",

			THREE.ShaderChunk[ "lights_vertex" ],

			"gl_Position = projectionMatrix * mvPosition;",

		"}"

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


/*
TriggerShader = {
	
	uniforms: function () {

		return {

				"morph": 						{ type: "f", value: 0.0 },
				"darkness": 					{ type: "f", value: 0.0 },
				
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
	
	attributes: function() {
	
		return { 
			
			"faceColor": { type: "c", boundTo: "faces", value: [] },
			"faceNormal": { type: "v3", boundTo: "faces", value: [] }
		
		}

	},


	vertexShader: [

		"uniform float	morph;",
		
		"attribute vec3 faceColor;",
		"attribute vec3 faceNormal;",
				
		"varying vec3 vFaceColor;",


		THREE.ShaderChunk[ "map_pars_vertex" ],
		THREE.ShaderChunk[ "lights_pars_vertex" ],
		THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
	
		"varying vec3 vLightWeighting;",
		
		"void main() {",
	
			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
	
			THREE.ShaderChunk[ "map_vertex" ],

	
 			"vec3 transformedNormal = normalize( normalMatrix * faceNormal );",
	
			THREE.ShaderChunk[ "lights_vertex" ],

			"vFaceColor = faceColor;",

			"vec3 morphed = mix( morphTarget0, morphTarget1, morph );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float  darkness;",
		"uniform vec3 	diffuse;",
		"uniform float 	opacity;",

		"varying vec3 vLightWeighting;",
		"varying vec3 vFaceColor;",

		THREE.ShaderChunk[ "map_pars_fragment" ],
		THREE.ShaderChunk[ "fog_pars_fragment" ],

		"void main() {",

			"gl_FragColor = vec4( diffuse, opacity );",
			"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",

			THREE.ShaderChunk[ "map_fragment" ],
			
			"gl_FragColor = gl_FragColor * vec4( vFaceColor, opacity );",
			"gl_FragColor = vec4( gl_FragColor.rgb * ( 1.0 - darkness ), 1.0 );",
			
			THREE.ShaderChunk[ "fog_fragment" ],

		"}"

	].join("\n")

}
*/
