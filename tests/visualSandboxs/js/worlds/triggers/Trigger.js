/**
 * Trigger (uniform)
 * @author Mikael Emtinger
 */

Trigger = function( geometry, wantedDarkness ) {
	
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
		vertexColors: 1,
		map: geometry.materials[ 0 ].map
		
	} );



	// create mesh and hide

	that.mesh = new THREE.Mesh( geometry, material );


	// setup internals

	var timeScale = 1;
	var currentTime = 0;
	var wantedDarkness = wantedDarkness !== undefined ? wantedDarkness : 0;
	var morphTargetOrder = that.mesh.morphTargetForcedOrder;
	var lengthInMS = ( geometry.morphTargets.length - 1 ) * 1000;

	morphTargetOrder[ 0 ] = 0;
	morphTargetOrder[ 1 ] = 1;


	//--- play ---

	that.play = function( _timeScale ) {
	
		timeScale = _timeScale || 1;
		currentTime = 0;

		that.mesh.visible = true;

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
			material.uniforms.darkness.value = wantedDarkness;
			
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
			material.uniforms.darkness.value = wantedDarkness * currentTime / lengthInMS;
			
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

var TriggerBig = function( geometry ) {
	
	// setup materials
	
	var that = {};
	var material = new THREE.MeshShaderMaterial( {
		
		uniforms: TriggerBigShader.uniforms(),
		vertexShader: TriggerBigShader.vertexShader(),
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

	var timeScale = 0.1;
	var currentTime = 0;
	var lengthInMS = ( geometry.morphTargets.length - 1 ) * 1000;
	var morphTargetOrder = that.mesh.morphTargetForcedOrder;

	morphTargetOrder[ 0 ] = 0;
	morphTargetOrder[ 1 ] = 1;


	//--- play ---

	that.play = function( _timeScale ) {
	
		timeScale = _timeScale || 1;
		currentTime = 0;

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
			
			var time = ( currentTime / lengthInMS ) * lengthInMS;

			if( time < lengthInMS ) {
				
				morphTargetOrder[ 0 ] = Math.floor( time / 1000 );
				morphTargetOrder[ 1 ] = Math.ceil( time / 1000 );
							
				
			} else {
				
				morphTargetOrder[ 0 ] = that.mesh.geometry.morphTargets.length - 2;
				morphTargetOrder[ 1 ] = that.mesh.geometry.morphTargets.length - 1;
				
			}

			material.uniforms.morph.value = time / lengthInMS;
			
		}
		
	}

	//--- public ---

	return that;
	
}


/*
 * Utils
 */

var TriggerUtils = (function() {
	
	var that = {};
	that.effectors = [ 0, 0, 20000 ];		// xyz xyz for each effector (remeber to change const in shader, too)
	that.effectorRadius = 300;

	var smallTriggers = [];
	var bigTriggers = [];
	
	
	//--- city ---
	
	that.setupCityTriggers = function( loadedSceneResult ) {
		
		if( !loadedSceneResult.triggers ) return;
		
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
		
		smallTriggers = [];
		bigTriggers = [];
		
		for( name in triggers ) {
			
			for( t = 0, tl = triggerGeometries.length; t < tl; t++ ) {
				
				if( name.indexOf( triggerGeometries[ t ].name ) !== -1 ) {
					
					if( triggerGeometries[ t ].geometry.morphTargets.length ) {
						
						if( triggers[ name ].type === "Small" ) {
							
							trigger = new Trigger( triggerGeometries[ t ].geometry );
							loadedSceneResult.objects[ name ].addChild( trigger.mesh );
							trigger.mesh.visible = false;
							
							smallTriggers.push( trigger );
							
						} else {
							
							trigger = new TriggerBig( triggerGeometries[ t ].geometry );
							loadedSceneResult.objects[ name ].addChild( trigger.mesh );
	
							bigTriggers.push( trigger );
							
						}
	 					
						trigger.mesh.rotation.x = 90 * Math.PI / 180;
						
					}
					
				}
				
			}
			
		}
		
	}
	
	
	//--- Prairie ---
	
	that.setupPrairieTriggers = function( loadedSceneResult ) {
		
		var name, geometry, geometries = loadedSceneResult.geometries;
		var m, ml;
		var v, vl, vertices;
		var pos, tmp;
		
		
		// switch morph target y and z (as morph targets been copy-pasted from OBJ and not exported from Blender)
		
		for( name in geometries ) {
			
			geometry = geometries[ name ];
			
			if( geometry.morphTargets.length ) {
				
				for( m = 0, ml = geometry.morphTargets.length; m < ml; m++ ) {
					
					vertices = geometry.morphTargets[ m ].vertices;
					
					for( v = 0, vl = vertices.length; v < vl; v++ ) {
						
						pos = vertices[ v ].position;
						
						tmp = pos.y;
						pos.y = -pos.z;
						pos.z = tmp;
						
					}
					
				}
				
			}
			
		}	
		
		
		
		
		// setup triggers

		var trigger, triggers = loadedSceneResult.triggers;
		var objects = loadedSceneResult.objects;

		smallTriggers = [];
		bigTriggers = [];

		for( name in objects ) {
			
			if( objects[ name ].geometry ) {
				
				if( objects[ name ].geometry.morphTargets.length ) {
					
					trigger = new Trigger( objects[ name ].geometry, Math.random() * 0.25 + 0.5 );
					
					objects[ name ].addChild( trigger.mesh );			
					objects[ name ].visible = false;
					
					smallTriggers.push( trigger );
					
				}
				
			}
			
		}

	}
	
	
	//--- update ---
	
	that.update = function() {
		
		var s, sl, pos;
		var e, el, effectors = that.effectors;
		var x, y, z;
		var manhattanRadius = that.effectorRadius * 1.5;
		
		for( s = 0, sl = smallTriggers.length; s < sl; s++ ) {
			
			pos = smallTriggers[ s ].mesh.matrixWorld.getPosition();
			
			for( e = 0, el = effectors.length; e < el; e += 3 ) {
				
				x = Math.abs( effectors[ e + 0 ] - pos.x );
				y = Math.abs( effectors[ e + 1 ] - pos.y ); 
				z = Math.abs( effectors[ e + 2 ] - pos.z ); 
				
				if( x + y + z < manhattanRadius ) {
					
					smallTriggers[ s ].play( 0.1 + Math.random() * 0.05 );
					smallTriggers.splice( s, 1 );
					s--;
					sl--;
					
					break;
					
				}
				
			}
			
		}
		
		
		for( s = 0, sl = bigTriggers.length; s < sl; s++ ) {
			
			pos = bigTriggers[ s ].mesh.matrixWorld.getPosition();
			
			for( e = 0, el = effectors.length; e < el; e += 3 ) {
				
				x = Math.abs( effectors[ e + 0 ] - pos.x );
				y = Math.abs( effectors[ e + 1 ] - pos.y ); 
				z = Math.abs( effectors[ e + 2 ] - pos.z ); 
				
				if( x + y + z < manhattanRadius ) {
					
					bigTriggers[ s ].play( 0.2 + Math.random() * 0.1 );
					bigTriggers.splice( s, 1 );
					s--;
					sl--;
					
					break;
					
				}
				
			}

		}
		
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

	uniforms: function () {

		return {

				"effectors": 					{ type: "fv", value: TriggerUtils.effectors },
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


	vertexShader: function() { return [

		"const 		int		NUMEFFECTORS = " + (TriggerUtils.effectors.length / 3) + ";",
		"uniform 	vec3 	effectors[ NUMEFFECTORS ];",
		"uniform 	float	morph;",
		
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

			"float distanceMorph = 0.0;",

			"if( morph < 1.0 ) { ",

				"vec3 worldPosition = ( objectMatrix * vec4( morphTarget0, 1.0 )).xyz;",
				
				"for( int i = 0; i < NUMEFFECTORS; i++ ) {",
				
					"distanceMorph = max( distanceMorph, smoothstep( 0.0, 0.4, 1.0 - distance( worldPosition, effectors[ i ] ) / " + TriggerUtils.effectorRadius + ".0 ));",
				
				"}",
				
				"distanceMorph = elastic( max( morph, distanceMorph ));",

			"} else {",

				"distanceMorph = 1.0;",

			"}",
						
			"vec4 mvPosition = modelViewMatrix * vec4( mix( morphTarget0, morphTarget1, distanceMorph ), 1.0 );",

			THREE.ShaderChunk[ "map_vertex" ],
			THREE.ShaderChunk[ "color_vertex" ],

			"vec3 transformedNormal = normalize( normalMatrix * normal );",

			THREE.ShaderChunk[ "lights_vertex" ],

			"gl_Position = projectionMatrix * mvPosition;",

		"}",
		
		
	].join("\n") },

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
