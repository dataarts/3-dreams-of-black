/**
 * @author Mikael Emtinger
 */

ROME = {};

// animal

ROME.Animal = function( geometry, parseMorphTargetsNames ) {

	var result = AnimalAnimationData.init( geometry, parseMorphTargetsNames );

	var that = {};
  that.material = result.material;
	that.morph = 0.0;
	that.animalA = { frames: undefined, currentFrame: 0, lengthInFrames: 0, currentTime: 0, lengthInMS: 0, timeScale: 1.0, name: "" };
	that.animalB = { frames: undefined, currentFrame: 0, lengthInFrames: 0, currentTime: 0, lengthInMS: 0, timeScale: 1.0, name: "" };
	that.availableAnimals = result.availableAnimals;
	that.mesh = new THREE.Mesh( geometry, that.material );

	var isPlaying = false;
	var morphTargetOrder = that.mesh.morphTargetForcedOrder;

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

				that.material.uniforms[ dataNames[ d ] + "Interpolation" ].value = scale;

			}

			that.material.uniforms.animalMorphValue.value = that.morph;

			if( that.material.attributes[ that.animalA.name ] === undefined ) {

				console.error( "Couldn't find attribute for " + that.animalA.name );
				return;

			}

			that.material.attributes.colorAnimalA.buffer = that.material.attributes[ that.animalA.name ].buffer;
			that.material.attributes.colorAnimalB.buffer = that.material.attributes[ that.animalB.name ].buffer;

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

		}
		else {

			console.log( "Error: Cannot change animal target if morph != 1. Skipping." );
		}

	};

	//--- set animal data ---

	var setAnimalData = function( name, data ) {

		if( AnimalAnimationData[ name ] !== undefined ) {

			data.frames         = AnimalAnimationData[ name ];
			data.lengthInFrames = data.frames.length;
			data.lengthInMS     = data.frames[ data.lengthInFrames - 1 ].time;
			data.name           = name.toLowerCase();

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




// animation data

AnimalAnimationData = {

	// static animal names (please fill in as it's faster than parsing through the geometry.morphTargets

  animalNames: [],
	//animalNames: [ "horse", "bear", "mountainlion", "deer", "fox", "goldenretreiver", "seal", "chow", "raccoon", "bunny", "frog", "elk", "moose", "tarbuffalo_runB", "tarbuffalo_runA", "parrot", "eagle", "owl", "hummingBird", "flamingo", "stork", "butterflyA", "butterflyLow", "vulture", "raven", "blackWidow", "Arm", "bison", "wolf", "goat", "gator", "Emerge", "sickle", "scorp"  ],


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

							animal.push( { index: m, time: currentTime, normalIndex: m + ml } );
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

			animalMat = new AnimalMat(true);

			// init custom color attributes

			var c, cl, morphColor, morphColors = geometry.morphColors;
			var attributes = animalMat.attributes;

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

				for( a = 0, al = availableAnimals.length; a < al; a++ ) {

					attributes[ availableAnimals[ a ].toLowerCase() ] = { type: "c", boundTo: "faces", value: attributes.colorAnimalA.value };

				}

			}

			// setup custom contour UV

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
			geometry.customAttributes = animalMat.attributes;

		} else {

			// create material

			animalMat = new AnimalMat(false);

			// copy custom attributes

			for( var a in geometry.customAttributes ) {

				var srcAttribute = geometry.customAttributes[ a ];

				if( a === "colorAnimalA" || a === "colorAnimalB" ) {

					animalMat.attributes[ a ] = {

						type: "c",
						size: 3,
						boundTo: srcAttribute.boundTo,
						value: srcAttribute.value,
						array: undefined,
						buffer: undefined,
						needsUpdate: false,
						__webglInitialized: true

					};

				} else {

					animalMat.attributes[ a ] = srcAttribute;

				}

			}

		}

		return {

			availableAnimals: geometry.availableAnimals,
			material: animalMat

		};
	}

};