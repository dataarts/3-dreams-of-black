/**
 * Trigger (uniform)
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


/*
 * Trigger big
 * @author Mikael Emtinger
 */

var TriggerBig = function( geometry, wantedParent ) {
	
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


/*
 * Utils
 */

var TriggerUtils = (function() {
	
	var that = {};
	
	
	//--- city ---
	
	that.setupCityTriggers = function( loadedSceneResult ) {
		
		var t, tl, name, trigger, triggers = loadedSceneResult.triggers;
		var triggerGeometries = [];

		// collect geometry and remove from scene graph
		
		for( name in triggers ) {
			
			if( name.indexOf( "TriggerMesh" ) !== -1 ) {
				
				trigger = triggers[ name ];
				trigger.name = name.slice( name.indexOf( "_" ) + 1 );
				trigger.geometry = loadedSceneResult.geometries[ trigger.object.geometry ];
								
				triggerGeometries.push( trigger );
				
				loadedSceneResult.objects[ name ].parent.removeChild( loadedSceneResult.objects[ name ] );
				loadedSceneResult.objects[ name ].visible = false;
				delete triggers[ name ];
				
			}
		
		}
		
		
		// assign originals to marked objects
		
		for( name in triggers ) {
			
			for( t = 0, tl = triggerGeometries.length; t < tl; t++ ) {
				
				if( name.indexOf( triggerGeometries[ t ].name ) !== -1 ) {
					
					trigger = new TriggerBig( triggerGeometries[ t ].geometry );
					trigger.mesh.rotation.x = 90 * Math.PI / 180;
					
					loadedSceneResult.objects[ name ].addChild( trigger.mesh );
					
				}
				
			}
			
		}
		
	}
	
	
	//--- Prairie ---
	
	that.setupPrairieTriggers = function( loadedSceneResult ) {
		
		
	}
	
	
	return that;
	
	
}());


/*
 * Trigger shader (uniform)
 */

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
 * Trigger Big Shader
 */

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

			"vec3 worldPosition = ( objectMatrix * vec4( morphTarget0, 1.0 )).xyz;",
			"float morph = 0.0;",
			
			"for( int i = 0; i < NUMEFFECTORS; i++ ) {",
			
				"morph = max( morph, smoothstep( 0.0, 0.4, 1.0 - distance( worldPosition, effectors[ i ] ) / 2000.0 ));",
			
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
