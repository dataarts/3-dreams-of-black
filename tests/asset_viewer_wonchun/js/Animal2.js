/**
 * @author Mikael Emtinger
 */


ROME = {};


// animal

ROME.Animal = function( geometry, parseMorphTargetsNames ) {

	// construct
	var material = new THREE.MeshShaderMaterial( {
		
		uniforms: ROME.AnimalShader.uniforms(), 
		attributes: ROME.AnimalShader.attributes(),
		vertexShader: ROME.AnimalShader.vertex(), 
		fragmentShader: ROME.AnimalShader.fragment(),
		morphTargets: true,
		fog: true,
		lights: true
		
	} );



	
	// hack: attributes

	var calcAO = function( vertices, faces, edges ) {
		
		var ao = [];
		var numAo = [];
		var centroid = new THREE.Vector3();
		var edge, faceA, faceB, vertexA, vertexB;
		var e, el, len;

		for( e = 0, el = edges.length; e < el; e++ ) {
			
			edge = edges[ e ];
			
			faceA = edge.faces[ 0 ];
			faceB = edge.faces[ 1 ] || faceA;

			centroid.sub( faceA.centroid, faceB.centroid );
					
			if( centroid.dot( centroid, faceA.normal ) >= 0 ) {

				vertexA = edge.vertexIndices[ 0 ];
				vertexB = edge.vertexIndices[ 1 ];
						
				if( ao[ vertexA ] === undefined ) { ao[ vertexA ] = 0; numAo[ vertexA ] = 0; }		
				if( ao[ vertexB ] === undefined ) { ao[ vertexB ] = 0; numAo[ vertexB ] = 0; }		
				
				centroid.add( faceA.normal, faceB.normal );
				
				len = centroid.length() * 0.5;

				ao[ vertexA ] += len;
				ao[ vertexB ] += len;

				numAo[ vertexA ]++;
				numAo[ vertexB ]++;

			}
					
		}

		for( e = 0, el = ao.length; e < el; e++ ) {
			
			ao[ e ] /= numAo[ e ];
			ao[ e ] *= 0.5;
			ao[ e ]  = Math.min( 0.5, Math.max( 0, ao[ e ] ));
			
		}
		
		return ao;
		
	}


	var aoA = calcAO( geometry.vertices, geometry.faces, geometry.edges );	
	var aoB = calcAO( geometry.morphTargets[ 10 ].vertices, geometry.faces, geometry.edges );	

//	var aoA = calcAO( geometry.vertices, geometry.faces );	
//	var aoB = calcAO( geometry.morphTargets[ 10 ].vertices, geometry.faces );	

	for( var i = 0; i < geometry.faces.length; i++ ) {
		
		if( geometry.faces[ i ] instanceof THREE.Face3 ) {
			
			material.attributes.colorAnimalA.value.push( new THREE.Vector3( 1, 0, 1 ).multiplyScalar( aoA[ geometry.faces[ i ].a ] ));
			material.attributes.colorAnimalA.value.push( new THREE.Vector3( 1, 0, 1 ).multiplyScalar( aoA[ geometry.faces[ i ].b ] ));
			material.attributes.colorAnimalA.value.push( new THREE.Vector3( 1, 0, 1 ).multiplyScalar( aoA[ geometry.faces[ i ].c ] ));

			material.attributes.colorAnimalB.value.push( new THREE.Vector3( 1, 1, 0 ).multiplyScalar( aoB[ geometry.faces[ i ].a ] ));
			material.attributes.colorAnimalB.value.push( new THREE.Vector3( 1, 1, 0 ).multiplyScalar( aoB[ geometry.faces[ i ].b ] ));
			material.attributes.colorAnimalB.value.push( new THREE.Vector3( 1, 1, 0 ).multiplyScalar( aoB[ geometry.faces[ i ].c ] ));
			
			material.attributes.contourUV.value.push( new THREE.Vector2( 0.0, 0.0 ));
			material.attributes.contourUV.value.push( new THREE.Vector2( 1.0, 0.0 ));
			material.attributes.contourUV.value.push( new THREE.Vector2( 1.0, 1.0 ));

		} else {
			
			material.attributes.colorAnimalA.value.push( new THREE.Vector3( 1, 0, 1 ).multiplyScalar( aoA[ geometry.faces[ i ].a ] ));
			material.attributes.colorAnimalA.value.push( new THREE.Vector3( 1, 0, 1 ).multiplyScalar( aoA[ geometry.faces[ i ].b ] ));
			material.attributes.colorAnimalA.value.push( new THREE.Vector3( 1, 0, 1 ).multiplyScalar( aoA[ geometry.faces[ i ].c ] ));
			material.attributes.colorAnimalA.value.push( new THREE.Vector3( 1, 0, 1 ).multiplyScalar( aoA[ geometry.faces[ i ].d ] ));

			material.attributes.colorAnimalB.value.push( new THREE.Vector3( 1, 1, 0 ).multiplyScalar( aoB[ geometry.faces[ i ].a ] ));
			material.attributes.colorAnimalB.value.push( new THREE.Vector3( 1, 1, 0 ).multiplyScalar( aoB[ geometry.faces[ i ].b ] ));
			material.attributes.colorAnimalB.value.push( new THREE.Vector3( 1, 1, 0 ).multiplyScalar( aoB[ geometry.faces[ i ].c ] ));
			material.attributes.colorAnimalB.value.push( new THREE.Vector3( 1, 1, 0 ).multiplyScalar( aoB[ geometry.faces[ i ].d ] ));

			material.attributes.contourUV.value.push( new THREE.Vector2( 0.0, 0.0 ));
			material.attributes.contourUV.value.push( new THREE.Vector2( 1.0, 0.0 ));
			material.attributes.contourUV.value.push( new THREE.Vector2( 1.0, 1.0 ));
			material.attributes.contourUV.value.push( new THREE.Vector2( 0.0, 1.0 ));

		}	
		
	}
	
	// end hack!
	
	
	// these should be global
	
	//material.uniforms.contour.texture = 
	//material.uniforms.faceLight.texture = ImageUtils.loadTexture( 'assets/faceLight.jpg' );
	
	var that = {};
	that.mesh = new THREE.Mesh( geometry, material );
	that.morph = 0.0;
	that.animalA = { frames: undefined, currentFrame: 0, lengthInFrames: 0, currentTime: 0, lengthInMS: 0, timeScale: 1.0 };
	that.animalB = { frames: undefined, currentFrame: 0, lengthInFrames: 0, currentTime: 0, lengthInMS: 0, timeScale: 1.0 };
	that.availableAnimals = ROME.AnimalAnimationData.init( geometry, parseMorphTargetsNames );

	
	var isPlaying = false;
	var morphTargetOrder = that.mesh.morphTargetForcedOrder;


	//--- play ---

	that.play = function( animalA, animalB, morph, startTimeAnimalA, startTimeAnimalB ) {
		
		if( !isPlaying ) {

			isPlaying = true;
			that.morph = 0;

			THREE.AnimationHandler.addToUpdate( that );
		}
		
		setAnimalData( animalA, that.animalA );
		setAnimalData( animalB, that.animalB );
		
		that.animalA.currentTime = startTimeAnimalA ? startTimeAnimalA : 0;
		that.animalB.currentTime = startTimeAnimalB ? startTimeAnimalB : 0;
		
		that.update( 0 );
	} 


	//--- update ---
	
	that.update = function( deltaTimeMS ) {
		
		var data, dataNames = [ "animalA", "animalB" ];
		var d, dl;
		var f, fl;
		var frame, nextFrame;
		var time, nextTime;
		var unloopedTime;
		var lengthInMS;
		var lenghtInFrames;
		var morphTarget;
		var scale;
		
		for( d = 0, dl = dataNames.length, morphTarget = 0; d < dl; d++ ) {
			
			data = that[ dataNames[ d ]];
			
			unloopedTime = data.currentTime;
			data.currentTime = ( data.currentTime + deltaTimeMS * data.timeScale ) % data.lengthInMS;


			// did we loop?

			if( unloopedTime > data.currentTime ) {

				data.currentFrame = 0;				

			}


			// find frame/nextFrame
			

			frame = 0;
			
			for( f = data.currentFrame, fl = data.lengthInFrames - 1; f < fl; f++ ) {
				
				if( data.currentTime >= data.frames[ f ].time && data.currentTime < data.frames[ f + 1 ].time ) {
					
					frame = f;
					break;
				}
			}

			data.currentFrame = frame;
			nextFrame = frame + 1 < fl ? frame + 1 : 0;

			
			morphTargetOrder[ morphTarget++ ] = data.frames[ frame     ].index;
			morphTargetOrder[ morphTarget++ ] = data.frames[ nextFrame ].index;
			
			time     = data.frames[ frame     ].time;
			nextTime = data.frames[ nextFrame ].time > time ? data.frames[ nextFrame ].time : data.frames[ nextFrame ].time + data.lengthInMS; 
			
			scale = ( data.currentTime - time ) / ( nextTime - time ) ;
			
			material.uniforms[ dataNames[ d ] + "Interpolation" ].value = scale;

		}

		material.uniforms.animalMorphValue.value = that.morph;
	}


	//--- set new target animal ---
	
	that.setNewTargetAnimal = function( animal, startTimeAnimalB ) {
		
		if( that.morph === 1 ) {
			
			// switch so B -> A
			
			for( var property in that.animalA ) {
				
				that.animalA[ property ] = that.animalB[ property ];
				
			}
			
			
			// set new B and change morph
			
			that.animalB.currentTime = startTimeAnimalB ? startTimeAnimalB : 0;
			setAnimalData( animal, that.animalB );
			setFrame( that.animalB );
			that.morph = 0;
			
		}
		else {
			
			console.log( "Error: Cannot change animal target if morph != 1. Skipping." );
		}
		
	}


	//--- set animal data ---

	var setAnimalData = function( name, data ) {
		
		if( ROME.AnimalAnimationData[ name ] !== undefined ) {
			
			data.frames         = ROME.AnimalAnimationData[ name ];
			data.lengthInFrames = data.frames.length;
			data.lengthInMS     = data.frames[ data.lengthInFrames - 1 ].time;
			
		} else {
			
			console.log( "Error: Couldn't find data for animal " + name );
			
		}
		
	}
	
	
	//--- set frame ---
	
	var setFrame = function( data ) {
		
		var f, fl;
		var currentTime = data.currentTime;
		var frames = data.frames;
		
		for( f = 0, fl < frames.length; f < fl; f++ ) {
			
			if( currentTime >= frames[ f ].time ) {
				
				data.currentFrame = f;
				return;
				
			}
			
		}
		
	}


	//--- set current frame ---
	
	var setCurrentFrame = function( data ) {
		
				

	}

	
	//--- return public ---
	
	return that;
}



// shader

ROME.AnimalShader = {
	
	textures: {
		
		contour: ImageUtils.loadTexture( 'assets/faceContour.jpg' ),
		faceLight: ImageUtils.loadTexture( 'assets/faceLight.jpg' )
		
	},
	
	uniforms: function () {

		return {
					"animalAInterpolation": 		{ type: "f", value: 0.0 },
					"animalBInterpolation": 		{ type: "f", value: 0.0 },
					"animalMorphValue" :    		{ type: "f", value: 0.0 },
					
					"fogColor": 					{ type: "c", value: new THREE.Color() },
					"fogDensity": 					{ type: "f", value: 0 },

					"contour": 						{ type: "t", value: 0, texture: ROME.AnimalShader.textures.contour },
					"faceLight":                    { type: "t", value: 1, texture: ROME.AnimalShader.textures.faceLight },

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
			
			"colorAnimalA": 	{ type: "v3", boundTo: "faceVertices", value:[] },
			"colorAnimalB": 	{ type: "v3", boundTo: "faceVertices", value:[] },
			"contourUV": 		{ type: "v2", boundTo: "faceVertices", value:[] },
			
		}
		
	},

	vertex: function () { return[

		"uniform 	float	animalAInterpolation;",
		"uniform 	float	animalBInterpolation;",
		"uniform 	float	animalMorphValue;",

		"attribute	vec3	colorAnimalA;",
		"attribute	vec3	colorAnimalB;",
		"attribute	vec2	contourUV;",

		"varying 	vec2	vContourUV;",
		"varying	vec3	vColor;",
		"varying    vec2    vLightUV;",

		"void main() {",

			// uv
			
			"vContourUV = contourUV;",
			"vLightUV = normalize( normalMatrix * normal ).xy * 0.5 + 0.5;",
			

			// morph
			
			"vColor = mix( colorAnimalA, colorAnimalB, animalMorphValue );",
			
			"vec3 animalA = mix( morphTarget0, morphTarget1, animalAInterpolation );",
			"vec3 animalB = mix( morphTarget2, morphTarget3, animalBInterpolation );",
			"vec3 morphed = mix( animalA,      animalB,      animalMorphValue );",
			
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );",
		"}"

	].join("\n")},

	fragment: function () { return[

		"uniform 	sampler2D 	contour;",
		"uniform 	sampler2D 	faceLight;",

		"uniform 	vec3 		fogColor;",
		"uniform 	float 		fogDensity;",
		"uniform 	vec3 		directionalLightColor[ 1 ];",

		"varying	vec3		vColor;",
		"varying 	vec2		vContourUV;",
		"varying    vec2    	vLightUV;",

		"void main() {",

			"float depth = gl_FragCoord.z / gl_FragCoord.w;",
			"const float LOG2 = 1.442695;",
			
			"float fogFactor = exp2( -fogDensity * fogDensity * depth * depth * LOG2 );",
			"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",

			"gl_FragColor = mix( vec4( vColor, 1.0 ), vec4( directionalLightColor[ 0 ], 1.0 ), texture2D( faceLight, vLightUV ).r ) * texture2D( contour, vContourUV );",
			"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",

		"}"

	].join("\n") }
}


// animation data

ROME.AnimalAnimationData = {

	// static animal names (please fill in as it's faster than parsing through the geometry.morphTargets

	animalNames: [ "horse", "mountainlion", "wolf", "fox", "deer", "parrot", "eagle", "vulture", "raven" ],


	// init frame times and indices
	
	init: function( geometry, parseMorphTargetNames ) {
		
		var availableAnimals = [];
		var animal, animalName;
		var charCode, morphTargetName, morphTargets = geometry.morphTargets;
		var a, al, m, ml, currentTime;
		
		// add animal names to static list?
		
		if( parseMorphTargetNames ) {
			
			for( m = 0, ml = morphTargets.length; m < ml; m++ ) {
								
				// check so not already exists
				
				for( a = 0, al = this.animalNames.length; a < al; a++ ) {
					
					animalName = this.animalNames[ a ];
					
					if( morphTargets[ m ].name.indexOf( animalName ) !== -1 ) {
						
						break;
					}
					
				}
				
				
				// did not exist?
				
				if( a === al ) {
					
					morphTargetName = morphTargets[ m ].name;
					
					for( a = 0; a < morphTargetName.length; a++ ) {
				
						charCode = morphTargetName.charCodeAt( a );
						
						if(! (( charCode >= 65 && charCode <= 90  ) ||
						      ( charCode >= 97 && charCode <= 122 ))) {
						      	
							break;      	

						} 
						
					}
					
					this.animalNames.push( morphTargetName.slice( 0, a ));
					
				}
				
			}
			
		}
				
		// parse out the names
		
		for( a = 0, al = this.animalNames.length; a < al; a++ ) {
			
			animalName  = this.animalNames[ a ];
			animal      = this[ animalName ];
			currentTime = 0;
			
			if( animal === undefined || animal.length === 0 ) {
				
				animal = this[ animalName ] = [];
				
				for( m = 0, ml = morphTargets.length; m < ml; m++ ) {
	
					if( morphTargets[ m ].name.indexOf( animalName ) !== -1 ) {

						animal.push( { index: m, time: currentTime } );
						currentTime += parseInt( 1000 / 24, 10 );		// 24 fps			
						
	
						if( availableAnimals.indexOf( animalName ) === -1 ) {
							
							availableAnimals.push( animalName );
							
						}
						
					}
					
				}

			} else {
				
				for( m = 0, ml = morphTargets.length; m < ml; m++ ) {
					
					if( availableAnimals.indexOf( animalName ) === -1 && morphTargets[ m ].name.indexOf( animalName ) !== -1 ) {
						
						availableAnimals.push( animalName );
						
					}
					
				}
				
			}
			 
		}

		return availableAnimals;

	}
	
}


