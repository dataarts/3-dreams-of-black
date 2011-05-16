var Ribbons = function ( numOfRibbons, vectorArray, scene, ribbonMaterials ) {
	
	var that = this;

	var ribbonArray = [];
	var ribbonMeshArray = [];
	var scene = scene;

	that.initSettings = {
		numOfRibbons : numOfRibbons || 6
	}

	that.settings = {
		ribbonPulseMultiplier_1 : 5.5,
		ribbonPulseMultiplier_2 : 5.5,
		ribbonMin : 1.5,
		ribbonMax : 3,
		visible : true
	}
	
	var r = 0;
	var i;

	for ( i = 0; i < that.initSettings.numOfRibbons; ++i ) {

		var ribbon = new Ribbon( 15, 6, vectorArray.length - 20 );
		var ribbonMesh = new THREE.Mesh( ribbon, ribbonMaterials[ i % ribbonMaterials.length ] );
		ribbonMesh.dynamic = true;
		ribbonMesh.doubleSided = true;
		ribbonMesh.position.set( 0, -500, 0 ); // hide ribbons at the beginning
		scene.addObject( ribbonMesh );

		var offset = 3+Math.floor( Math.random()*10 );

		var obj = {r:ribbon, rm:ribbonMesh, offset:offset}

		ribbonArray.push(obj);
		ribbonMeshArray.push(ribbonMesh);

	}

	this.changeColor = function (colorArray, opacity) {
		for ( i = 0; i < that.initSettings.numOfRibbons; ++i ) {
			ribbonArray[i].rm.materials[0].color.setHex(colorArray[i%colorArray.length]);
			ribbonArray[i].rm.materials[0].opacity = opacity;
		}
	}

	this.update = function (position) {

		r += 0.1;

		for (i=0; i<vectorArray.length; ++i ) {
			
			var x = vectorArray[i].position.x;
			var y = vectorArray[i].position.y;
			var z = vectorArray[i].position.z;

			// ribbons
			for (var k=0; k<numOfRibbons; ++k ) {
				var ribbon = ribbonArray[k].r;
				var offset = ribbonArray[k].offset;

				if (i < offset) {
					continue;
				}

				var pulse = Math.cos((i-r*10)/10)*that.settings.ribbonPulseMultiplier_1;

				var pulse2 = Math.cos((i-r*10)/8)*that.settings.ribbonPulseMultiplier_2;

				var inc = (Math.PI*2)/ribbonArray.length;
				var thisinc = k*inc;
				var offsetz = Math.cos(thisinc+((i-r*10)/8))*pulse;
				var offsety = Math.sin(thisinc+((i-r*10)/8))*pulse;

				for (var j=0; j<2; ++j ) {
					var index = ((i-offset)*2)+j;

					if (ribbon.vertices[index] == undefined) {
						continue;
						break;
					}

					// for twister
					var adder = i-(r*2);
					var w = Math.max(that.settings.ribbonMin, i/(10+pulse2));
					w = Math.min(w, that.settings.ribbonMax);
					var extrax = Math.cos(adder/3)*w;
					var extray = Math.sin(adder/3)*w;

					ribbon.vertices[index].position.x = x - position.x+extrax+offsetz;
					if (j==0) {
						ribbon.vertices[index].position.y = y+extray+offsety - position.y;
						ribbon.vertices[index].position.z = z+extrax+offsetz - position.z;
					} else {
						ribbon.vertices[index].position.y = y-extray+offsety - position.y;
						ribbon.vertices[index].position.z = z-extrax+offsetz - position.z;
					}
				}

			}
		}

		for (i=0; i<ribbonArray.length; ++i ) {
			var ribbonMesh = ribbonArray[i].rm;
			ribbonMesh.position = position;
			var ribbon = ribbonArray[i].r;
			ribbon.__dirtyVertices = true;

			ribbonMesh.visible = that.settings.visible;
		}

	}

}
