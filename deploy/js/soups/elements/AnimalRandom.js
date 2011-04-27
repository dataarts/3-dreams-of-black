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

	};


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

				data = that[ dataNames[ d ] ];

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

			if( material.attributes[ that.animalA.name ] !== undefined ) {

				material.attributes.colorAnimalA.buffer = material.attributes[ that.animalA.name ].buffer;

			}

			if( material.attributes[ that.animalB.name ] !== undefined ) {

				material.attributes.colorAnimalB.buffer = material.attributes[ that.animalB.name ].buffer;

			}

		}

	};


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

		} else {

			console.log( "Error: Cannot change animal target if morph != 1. Skipping." );

		}

	};


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

	};


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

	};


	//--- set current frame ---

	var setCurrentFrame = function( data ) {

	};


	//--- return public ---

	return that;

};



// shader

ROME.AnimalShader = {

	uniforms: function () {

		return THREE.UniformsUtils.merge( [ THREE.UniformsLib[ "common" ],
										    THREE.UniformsLib[ "lights" ], {
					"animalAInterpolation": 		{ type: "f", value: 0.0 },
					"animalBInterpolation": 		{ type: "f", value: 0.0 },
					"animalMorphValue" :    		{ type: "f", value: 0.0 },

					"lightScale"  :    { type: "f", value: 1.0 },
					"lightOffset" :    { type: "v3", value: new THREE.Vector3( 0.0, 0.0, 0.0 ) },

			   } ] );
	},

	attributes: function() {

		return {

			"colorAnimalA": 	{ type: "c", boundTo: "faces", value: [] },
			"colorAnimalB": 	{ type: "c", boundTo: "faces", value: [] }

		}

	},

	vertexShader: [

		"uniform 	float	animalAInterpolation;",
		"uniform 	float	animalBInterpolation;",
		"uniform 	float	animalMorphValue;",

		"attribute	vec3	colorAnimalA;",
		"attribute	vec3	colorAnimalB;",

		"varying vec3 vColor;",
		"varying vec3 vLightWeighting;",

		THREE.ShaderChunk[ "lights_pars_vertex" ],

		"uniform float lightScale;",
		"uniform vec3 lightOffset;",

		"void main() {",

			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"vColor = mix( colorAnimalA, colorAnimalB, animalMorphValue );",

			"vec3 animalA = mix( morphTarget0, morphTarget1, animalAInterpolation );",
			"vec3 animalB = mix( morphTarget2, morphTarget3, animalBInterpolation );",
			"vec3 morphed = mix( animalA,      animalB,      animalMorphValue );",

			"vec3 transformedNormal = normalize( normalMatrix * normal );",

			//THREE.ShaderChunk[ "lights_vertex" ],

			// separate lights for animals
			// ( ambient + one directional )

			"vLightWeighting = vec3( 0.2 );",

			"vec4 lDirection = viewMatrix * vec4( vec3( 0.0, 1.0, 1.0 ), 0.0 );",
			"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += vec3( 1.0 ) * directionalLightWeighting;",

			// tweak lighting

			"vLightWeighting = lightScale * vLightWeighting + lightOffset;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform vec3 diffuse;",
		"uniform float opacity;",

		THREE.ShaderChunk[ "fog_pars_fragment" ],
		THREE.ShaderChunk[ "lights_pars_fragment" ],

		"varying vec3 vLightWeighting;",
		"varying vec3 vColor;",

		"void main() {",

			//"gl_FragColor = vec4( 1.0 );",

			"gl_FragColor = vec4( vLightWeighting, 1.0 );",
			//"gl_FragColor = gl_FragColor * vec4( diffuse, opacity );",

			"gl_FragColor = gl_FragColor * vec4( vColor, 1.0 );",
			THREE.ShaderChunk[ "fog_fragment" ],

		"}"

	].join("\n")
}


// animation data

ROME.AnimalAnimationData = {

	// static animal names (please fill in as it's faster than parsing through the geometry.morphTargets

	animalNames: [ "scorp", "tarbuffalo", "horse", "bear", "mountainlion", "deer", "fox", "goldenRetreiver", "seal", "chow", "raccoon", "bunny", "frog", "elk", "moose", "fishA", "fishB", "fishC", "fishD", "sockPuppet", "shdw2", "blackWidow", "crab", "goat", "gator", "tarbuffalo_runB", "tarbuffalo_runA", "wolf", "toad", "parrot", "eagle", "owl", "hummingBird", "flamingo", "stork", "butterflyA", "butterflyC", "butterflyD", "butterflyLowA", "butterflyLowB", "butterflyLowC", "butterflyLowD", "vulture", "raven", "bison", "sickle" ],

	colorVariations: {

	"flamingo": { hRange:  0.05, sRange:  0.05, vRange:  0.00,
				  hOffset: 0.00, sOffset: 0.00, vOffset: 0.00 },

	"shdw2": { hRange:  0.00, sRange:  0.00, vRange:  0.025,
		       hOffset: 0.00, sOffset: 0.00, vOffset: -0.03 },

	"horse": { hRange:  0.01, sRange:   0.00, vRange:  0.05,
		       hOffset: 0.02, sOffset: -0.10, vOffset: 0.00,
			   lScale: 0.75, lOffset: [ 0.5, 0.5, 0.5 ]	},

	"moose": { hRange:  0.07, sRange:  0.00, vRange:  0.05,
		       hOffset: 0.00, sOffset: -0.20, vOffset: 0.00 },

	"tarbuffalo": { hRange:  0.04, sRange:  0.00, vRange:  0.05,
		       hOffset: 0.00, sOffset: -0.10, vOffset: 0.00 },

	"chow": { hRange:  0.00, sRange:   0.00, vRange:  0.00,
			  hOffset: 0.00, sOffset:  -0.10, vOffset: -0.10,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },

	"deer": { hRange:  0.01, sRange:   0.00, vRange:  0.20,
			  hOffset: 0.00, sOffset:  -0.10, vOffset: -0.10,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },

	"vulture": { hRange:  0.01, sRange:   0.10, vRange:  0.12,
			  hOffset: 0.0, sOffset:  0.00, vOffset: -0.10,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },

	"bunny": { hRange:  0.00, sRange:  0.00, vRange:  0.05,
			  hOffset: 0.00, sOffset:  -0.10, vOffset: 0.00,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },

	"seal": { hRange:  0.00, sRange:  0.00, vRange:  0.05,
			  hOffset: 0.00, sOffset:  0.05, vOffset: 0.00,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },

	"eagle": { hRange:  0.05, sRange:  0.00, vRange:  0.25,
			  hOffset: 0.00, sOffset:  -0.10, vOffset: 0.10,
			  lScale: 0.5, lOffset: [ 0.5, 0.5, 0.5 ] },

	"sat":  { hRange:  0.00, sRange:  0.00, vRange:  0.00,
		      hOffset: 0.00, sOffset: 0.10, vOffset: 0.00 },

	"zero": { hRange:  0.00, sRange:   0.00, vRange:  0.00,
			  hOffset: 0.00, sOffset:  0.00, vOffset: 0.00 },

	"dark": { hRange:  0.00, sRange:   0.00, vRange:  0.00,
			  hOffset: 0.00, sOffset:  0.00, vOffset: -0.50 }

	},

	animalVariationMap: {

		"flamingo"	: "flamingo",
		"horse"		: "horse",
		"shdw2" 	: "shdw2",
		"moose"		: "moose",
		"tarbuffalo": "tarbuffalo",
		"goat"		: "shdw2",
		"chow"		: "chow",
		"deer"		: "deer",
		"fox"		: "deer",
		"goldenretreiver": "horse",
		"bunny" 	: "bunny",
		"seal"		: "seal",
		"elk"		: "seal",
		"eagle"		: "eagle",
		"parrot"	: "eagle",
		"hummingbird": "seal",
		"raven"		: "deer",
		"vulture"   : "vulture",
		"centipede" : "tarbuffalo",
		"scorp"		: "tarbuffalo",
		"bison"		: "tarbuffalo",
		"sickle"    : "tarbuffalo",

		"crab"		   : "zero",
		"bear"		   : "zero",
		"mountainlion" : "zero"

	},

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


			// create material

			var material = new THREE.MeshShaderMaterial( {

				uniforms: ROME.AnimalShader.uniforms(),
				attributes: ROME.AnimalShader.attributes(),
				vertexShader: ROME.AnimalShader.vertexShader,
				fragmentShader: ROME.AnimalShader.fragmentShader,

				lights: true,
				morphTargets: true,
				vertexColors: THREE.VertexColors

			} );


			// set animal-specific light params

			//console.log( attributes.colorAnimalA.value );
			//console.log( availableAnimals );

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
					attributes[ morphTargetName ] = { type: "c", boundTo: "faces", value: morphColor.colors };

					// color variations per morph color

					var variations = this.colorVariations[ "zero" ];

					if ( this.animalVariationMap[ morphTargetName ] !== undefined ) {

						variations = this.colorVariations[  this.animalVariationMap[ morphTargetName ] ];
						//console.log( morphColor.name, morphTargetName );

					}

					if ( variations.lScale ) {

						material.uniforms.lightScale.value = variations.lScale;

					} else {

						material.uniforms.lightScale.value = 0.5;

					}

					if ( variations.lOffset ) {

						material.uniforms.lightOffset.value.set( variations.lOffset[ 0 ], variations.lOffset[ 1 ], variations.lOffset[ 2 ] );

					} else {

						material.uniforms.lightOffset.value.set( 0.6, 0.6, 0.6 );

					}


					randomizeColors( attributes[ morphTargetName ].value, variations );

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

							attributes[ animalName ].value.push( new THREE.Color( 0xff0000 ) );

						}

					}

				}

			} else {

				console.error( "Animal.constructor: Morph Colors doesn't exist, deploying fallback!" );

				for( c = 0, cl = geometry.faces.length; c < cl; c++ ) {

					attributes.colorAnimalA.value.push( new THREE.Color( 0xff00ff ) );

				}

				attributes.colorAnimalB.value = attributes.colorAnimalA.value;

				for( a = 0, al = availableAnimals; a < al; a++ ) {

					attributes[ availableAnimals[ a ] ] = { type: "c", boundTo: "faces", value: attributes.colorAnimalA.value };

				}

			}

			//randomizeColors( attributes.colorAnimalA.value, variations );
			//randomizeColors( attributes.colorAnimalB.value, variations );


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

};

function randomizeColors( colors, variations ) {

	var i, il, c, hd, sd, vd;

	for( i = 0, il = colors.length; i < il; i++ ) {

		c = colors[ i ];
		c.autoUpdate = false; // we don't need hex/styleString

		hd = variations.hRange * Math.random() + variations.hOffset;
		sd = variations.sRange * Math.random() + variations.sOffset;
		vd = variations.vRange * Math.random() + variations.vOffset;

		THREE.ColorUtils.adjustHSV( c, hd, sd, vd );

	}

};

