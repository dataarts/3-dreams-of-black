/**
 * @author Mikael Emtinger
 */


ROME = {};



// animal

ROME.Animal = function( geometry ) {

	// construct

	var that = {};
	var material = new THREE.MeshShaderMaterial( { uniforms:       ROME.AnimalShader.uniforms, 
												   vertexShader:   ROME.AnimalShader.vertex, 
												   fragmentShader: ROME.AnimalShader.fragment,
												   morphTargets:   true } ); 

	that.mesh = new THREE.Mesh( geometry, material );
	that.morph = 0.0;

	
	var animalAIndex  = 0;
	var animalAOffset = 0;
	var animalALength = 29;
	
	var animalBIndex  = 0;
	var animalBOffset = 30;
	var animalBLength = 100;
	
	var morphTargetOrder = that.mesh.morphTargetForcedOrder;


	THREE.AnimationHandler.addToUpdate( that );


	// play

	that.play = function( offset ) {
		
		
	} 

	// update
	
	that.update = function( deltaTimeMS ) {
		
		morphTargetOrder[ 0 ] = animalAOffset + (( animalAIndex + 0 ) % animalALength );
		morphTargetOrder[ 1 ] = animalAOffset + (( animalAIndex + 1 ) % animalALength );
		morphTargetOrder[ 2 ] = animalBOffset + (( animalBIndex + 0 ) % animalBLength );
		morphTargetOrder[ 3 ] = animalBOffset + (( animalBIndex + 1 ) % animalBLength );
		
		animalAIndex++;
		animalBIndex++;
		
		material.uniforms.animalMorphValue.value = that.morph;
	}

	
	// public
	
	return that;
}



// shader

ROME.AnimalShader = {
	
	uniforms: Uniforms.merge( [ THREE.UniformsLib[ "common" ],
								THREE.UniformsLib[ "lights" ], 
								{
									"animalAInterpolation": { type: "f", value: 0.0 },
									"animalBInterpolation": { type: "f", value: 0.0 },
									"animalMorphValue" :    { type: "f", value: 0.0 }
								} ] ),

	vertex: [

		"uniform float	animalAInterpolation;",
		"uniform float	animalBInterpolation;",
		"uniform float	animalMorphValue;",
		"varying vec3 	vLightWeighting;",

		THREE.Snippets[ "map_pars_vertex" ],
		THREE.Snippets[ "lightmap_pars_vertex" ],
		THREE.Snippets[ "envmap_pars_vertex" ],
		THREE.Snippets[ "lights_pars_vertex" ],
		THREE.Snippets[ "color_pars_vertex" ],

		"void main() {",

			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

			THREE.Snippets[ "map_vertex" ],
			THREE.Snippets[ "lightmap_vertex" ],
			THREE.Snippets[ "envmap_vertex" ],
			THREE.Snippets[ "color_vertex" ],

			"vec3 transformedNormal = normalize( normalMatrix * normal );",

			THREE.Snippets[ "lights_vertex" ],

			
			"vec3 animalA = mix( morphTarget0, morphTarget1, animalAInterpolation );",
			"vec3 animalB = mix( morphTarget2, morphTarget3, animalBInterpolation );",
			"vec3 morphed = mix( animalA,      animalB,      animalMorphValue );",
			
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );",
		"}"

	].join("\n"),

	fragment: [

		"uniform vec3 diffuse;",
		"uniform float opacity;",

		"varying vec3 vLightWeighting;",

		THREE.Snippets[ "color_pars_fragment" ],
		THREE.Snippets[ "map_pars_fragment" ],
		THREE.Snippets[ "lightmap_pars_fragment" ],
		THREE.Snippets[ "envmap_pars_fragment" ],
		THREE.Snippets[ "fog_pars_fragment" ],

		"void main() {",

			"gl_FragColor = vec4( diffuse, opacity );",
			"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",

			THREE.Snippets[ "map_fragment" ],
			THREE.Snippets[ "lightmap_fragment" ],
			THREE.Snippets[ "color_fragment" ],
			THREE.Snippets[ "envmap_fragment" ],
			THREE.Snippets[ "fog_fragment" ],

		"}"

	].join("\n")
}



	fragment: [

		"uniform vec3 diffuse;",
		"uniform float opacity;",

		"varying vec3 vLightWeighting;",

		"void main() {",

			"gl_FragColor = vec4( diffuse, opacity );",
			"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",
		"}"

	].join("\n")
