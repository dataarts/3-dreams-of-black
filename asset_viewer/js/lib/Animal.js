/**
 * @author Mikael Emtinger
 */


ROME = {};


// animal

ROME.Animal = function( geometry, parseMorphTargetsNames ) {

	var result = ROME.AnimalAnimationData.init( geometry, parseMorphTargetsNames );

	var that = {};
	that.morph = 0.0;
	that.animalA = { frames: undefined, currentFrame: 0, lengthInFrames: 0, currentTime: 0, lengthInMS: 0, timeScale: 1.0, name: "" };
	that.animalB = { frames: undefined, currentFrame: 0, lengthInFrames: 0, currentTime: 0, lengthInMS: 0, timeScale: 1.0, name: "" };
	that.availableAnimals = result.availableAnimals;
	that.mesh = new THREE.Mesh( geometry, result.material );

	var isPlaying = false;
	var morphTargetOrder = that.mesh.morphTargetForcedOrder;
	var material = result.material;


	/*
	  
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
	  
	  
	 */


	//--- play ---

	that.play = function( animalA, animalB, morph, startTimeAnimalA, startTimeAnimalB ) {
		
		if( !isPlaying ) {

			isPlaying = true;
			that.morph = 0;

			THREE.AnimationHandler.addToUpdate( that );
		}
		
		animalB = animalB !== undefined ? animalB : animalA;
		morph = morph !== undefined ? morph : 0;
		
		setAnimalData( animalA, that.animalA );
		setAnimalData( animalB, that.animalB );
		
		that.animalA.currentTime = startTimeAnimalA ? startTimeAnimalA : 0;
		that.animalB.currentTime = startTimeAnimalB ? startTimeAnimalB : 0;
		
		that.update( 0 );
	} 


	//--- update ---
	
	that.update = function( deltaTimeMS ) {
		
		if( that.mesh._modelViewMatrix ) {
			
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
	
				
/*				morphTargetOrder[ morphTarget + 0 ] = data.frames[ frame     ].index;
				morphTargetOrder[ morphTarget + 4 ] = data.frames[ frame     ].index + data.normalsOffset;
				morphTargetOrder[ morphTarget + 1 ] = data.frames[ nextFrame ].index;
				morphTargetOrder[ morphTarget + 5 ] = data.frames[ nextFrame ].index + data.normalsOffset;
				
				morphTarget += 2;
*/				

				morphTargetOrder[ morphTarget++ ] = data.frames[ frame     ].index;
				morphTargetOrder[ morphTarget++ ] = data.frames[ nextFrame ].index;

				
				time     = data.frames[ frame     ].time;
				nextTime = data.frames[ nextFrame ].time > time ? data.frames[ nextFrame ].time : data.frames[ nextFrame ].time + data.lengthInMS; 
				
				scale = ( data.currentTime - time ) / ( nextTime - time ) ;
				
				material.uniforms[ dataNames[ d ] + "Interpolation" ].value = scale;
	
			}
	
			material.uniforms.animalMorphValue.value = that.morph;
			
			if( material.attributes[ that.animalA.name ] !== undefined ) {
				
				material.attributes.colorAnimalA.buffer = material.attributes[ that.animalA.name ].buffer;
				
			}

			if( material.attributes[ that.animalB.name ] !== undefined ) {
				
				material.attributes.colorAnimalB.buffer = material.attributes[ that.animalB.name ].buffer;
				
			}
			
		}
		
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
			data.name           = name.toLowerCase();
			data.normalsOffset  = Math.floor( data.frames.length * 0.5, 10 );

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
		
		contour: THREE.ImageUtils.loadTexture( '/files/textures/faceContourNoise.jpg' ),
		faceLight: THREE.ImageUtils.loadTexture( '/files/textures/faceLight.jpg' )
		
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
			
			"colorAnimalA": 	{ type: "c", boundTo: "faces", value:[] },
			"colorAnimalB": 	{ type: "c", boundTo: "faces", value:[] },
			"contourUV": 		{ type: "v2", boundTo: "faceVertices", value:[] }
			
		}
		
	},

	vertexShader: [

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
			

			// morph color, normal and position
			
			"vColor = mix( colorAnimalA, colorAnimalB, animalMorphValue );",
			
			
/*			"vec3 animalA = mix( morphTarget4, morphTarget5, animalAInterpolation );",
			"vec3 animalB = mix( morphTarget6, morphTarget7, animalBInterpolation );",
			"vec3 morphed = mix( animalA,      animalB,      animalMorphValue );",
			
			"vLightUV = normalize( normalMatrix * morphed ).xy * 0.5 + 0.5;",
*/
			"vLightUV = normalize( normalMatrix * normal ).xy * 0.5 + 0.5;",

			
			"vec3 animalA = mix( morphTarget0, morphTarget1, animalAInterpolation );",
			"vec3 animalB = mix( morphTarget2, morphTarget3, animalBInterpolation );",
			"vec3 morphed = mix( animalA,      animalB,      animalMorphValue );",
			
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [

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

			"float envLight = texture2D( faceLight, vLightUV ).r;",

			// below: mix( color overlayed by ( contour map * influence constant ), directional light color, envlight above * influence constant )

			//"gl_FragColor  = mix( vec4( vColor * (( texture2D( contour, vContourUV ).r - 0.5 ) * 0.7 + 1.0 ), 1.0 ), vec4( directionalLightColor[ 0 ], 1.0 ), envLight * 0.9 );",
			"gl_FragColor  = mix( vec4( vColor * (( 0.45 ) * 0.7 + 1.0 ), 1.0 ), vec4( directionalLightColor[ 0 ], 1.0 ), envLight * 0.9 );",
			"gl_FragColor *= gl_FragColor;",

			"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",

		"}"

	].join("\n")
}


// animation data

ROME.AnimalAnimationData = {

	// static animal names (please fill in as it's faster than parsing through the geometry.morphTargets

	//animalNames: [ "horse", "mountainlion", "wolf", "fox", "deer", "parrot", "eagle", "vulture", "raven" ],
	animalNames: [ "horse", "bear", "mountainlion", "deer", "fox", "goldenRetreiver", "seal", "chow", "raccoon", "bunny", "frog", "elkRun", "mooseGallop", "fishA", "fishB", "fishC", "fishD", "sockPuppet_jump", "sockPuppet_popUp", "shdw2", "blackWidow", "crab", "scorpSkitter", "goat", "gator", "tarbuffalo_runB", "tarbuffalo_runA", "wolf", "toad", "parrot", "eagle", "owl", "hummingBird", "flamingo", "storkFly", "butterflyA", "butterflyD", "butterflyLow", "vulture", "raven", "bison", "sickle" ],


	// init frame times and indices
	
	init: function( geometry, parseMorphTargetNames ) {
		
		if( !geometry.initialized ) {
			
			geometry.initialized = true;
			
			var availableAnimals = [];
			var animal, animalName;
			var charCode, morphTargetName, morphTarget, morphTargets = geometry.morphTargets;
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
	

			// create normals for each morph target

/*			var m, ml;
			var n, nl, normal, normals, face, faces, vertices;
			var f, fl;
			var AB = new THREE.Vector3();
			var AC = new THREE.Vector3();

			for( m = 0, ml = morphTargets.length; m < ml; m++ ) {

				morphTarget = { name: morphTargets[ m ].name + "Normal", vertices: [] };

				vertices = morphTargets[ m ].vertices;
				faces = geometry.faces;
				normals = morphTarget.vertices;

				for( f = 0, fl = faces.length; f < fl; f++ ) {

					face = faces[ f ];

					AB.sub( vertices[ face.b ].position, vertices[ face.a ].position );
					AC.sub( vertices[ face.c ].position, vertices[ face.a ].position );

					normal = new THREE.Vector3();
					normal.cross( AB, AC );

					normals.push( normal );

				}

				morphTargets.push( morphTarget );
			}*/

			// create material
	
			var material = new THREE.MeshShaderMaterial( {
				
				uniforms: ROME.AnimalShader.uniforms(),
				attributes: ROME.AnimalShader.attributes(),
				vertexShader: ROME.AnimalShader.vertexShader,
				fragmentShader: ROME.AnimalShader.fragmentShader,
				
				fog: true,
				lights: true,
				morphTargets: true
				
			} );



			// init custom attributes

			var c, cl, morphColor, morphColors = geometry.morphColors;
			var attributes = material.attributes;
			
			if( geometry.morphColors && geometry.morphColors.length ) {
				
				for( c = 0, cl = morphColors.length; c < cl; c++ ) {
					
					morphColor = morphColors[ c ];
					morphTargetName = morphColor.name;
					
					for( a = 0; a < morphTargetName.length; a++ ) {
				
						charCode = morphTargetName.charCodeAt( a );
						
						if(! (( charCode >= 65 && charCode <= 90  ) ||
						      ( charCode >= 97 && charCode <= 122 ))) {
						      	
							break;   

						} 

					}

					morphTargetName = morphTargetName.slice( 0, a ).toLowerCase();
					attributes[ morphTargetName ] = { type: "c", boundTo: "faces", value: morphColor.colors }
					
				}
				
				attributes.colorAnimalA.value = morphColors[ 0 ].colors;
				attributes.colorAnimalB.value = morphColors[ 0 ].colors;
				
				
				// check so each animal has a morph color
		
				for( a = 0, al = availableAnimals.length; a < al; a++ ) {
					
					animalName = availableAnimals[ a ].toLowerCase();
						
					for( c = 0, cl = morphColors.length; c < cl; c++ ) {
						
						morphColor = morphColors[ c ].name.toLowerCase();
						
						if( morphColor.indexOf( animalName ) !== -1 ) {
							
							break;
							
						}
						
					}
					
					// didn't exist?
					
					if( c === cl ) {
						
						console.error( "Animal.constructor: Morph Color missing for animal " + animalName + ". Deploying backup plan." );

						attributes[ animalName ] = { type: "c", boundTo: "faces", value: [] };
						
						for( c = 0, cl = geometry.faces.length; c < cl; c++ ) {
							
							attributes[ animalName ].value.push( new THREE.Color( 0xff0000 ));

						}
						
					}

				}

			} else {
				
				console.error( "Animal.constructor: Morph Colors doesn't exist, deploying fallback!" );
				
				for( c = 0, cl = geometry.faces.length; c < cl; c++ ) {
					
					attributes.colorAnimalA.value.push( new THREE.Color( 0xff00ff ));
					
				}
				
				attributes.colorAnimalB.value = attributes.colorAnimalA.value;

				for( a = 0, al = availableAnimals; a < al; a++ ) {
					
					attributes[ availableAnimals[ a ]] = { type: "c", boundTo: "faces", value: attributes.colorAnimalA.value };
					
				}
	
			}
			
	
			// create contour UV
	
			var f, fl, faces = geometry.faces; 
			var contourUv = attributes.contourUV.value;
	
			for( f = 0, fl = faces.length; f < fl; f++ ) {
				
				contourUv.push( new THREE.Vector2( 0.0, 0.0 ));
				contourUv.push( new THREE.Vector2( 0.0, 1.0 ));
				contourUv.push( new THREE.Vector2( 1.0, 1.0 ));
				
				if( faces[ f ].d ) {
					
					contourUv.push( new THREE.Vector2( 1.0, 0.0 ));
					
				}
				
			}
	
	
	
			// set return values
	
			geometry.availableAnimals = availableAnimals;
			geometry.customAttributes = material.attributes;

		} else {
			
			// create material
			
			var material = new THREE.MeshShaderMaterial( {
				
				uniforms: ROME.AnimalShader.uniforms(),
				attributes: {},
				vertexShader: ROME.AnimalShader.vertexShader,
				fragmentShader: ROME.AnimalShader.fragmentShader,
				
				fog: true,
				lights: true,
				morphTargets: true
				
			} );
			
			
			// copy custom attributes

			for( var a in geometry.customAttributes ) {

				var srcAttribute = geometry.customAttributes[ a ];
				
				if( a === "colorAnimalA" || a === "colorAnimalB" ) {
					
					material.attributes[ a ] = { 
						
						type: "c", 
						size: 3,
						boundTo: srcAttribute.boundTo, 
						value: srcAttribute.value, 
						array: undefined,
						buffer: undefined,
						needsUpdate: false,
						__webglInitialized: true,

					};
					
				} else {
					
					material.attributes[ a ] = srcAttribute;
					
				}
				
			}
			
		}

		return {
			
			availableAnimals: geometry.availableAnimals,
			material: material
			
		};
	}
		
}
