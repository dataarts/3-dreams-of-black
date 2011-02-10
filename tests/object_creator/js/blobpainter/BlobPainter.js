var BlobPainter = function( renderer, scene, camera, effectController, mlib, unit, size ) {
	
	var _this = this;
	
	var half_unit = unit / 2,
		half_size = size / 2;
	
	this.effectController = effectController;
	this.mlib = mlib;
	this.scene = scene;
	this.renderer = renderer;
	
	this.controls = {
		
		isShiftDown : false,
		isCtrlDown	: false
		
	};
	
	this.painter = {
		
		voxels : {},
		voxelPosition : new THREE.Vector3(),
		tmpVec		  : new THREE.Vector3(),
			
		rx 		: 0,
		ry 		: 0,
		rz 		: 0,
			
		rx_old	: 0,
		ry_old	: 0,
		rz_old	: 0		
		
	};

	// bottom grid

	this.painter.plane = new THREE.Mesh( new Plane( size * unit, size * unit, size, size ), new THREE.MeshBasicMaterial( { color: 0x222222, wireframe: true } ) );
	this.painter.plane.rotation.x = - 90 * Math.PI / 180;
	
	scene.addObject( this.painter.plane );
	
	// voxel skeleton
	
	var skeletonOpacity = 1 - effectController.opacity;
	
	this.painter.cubeGeo = new Cube( unit, unit, unit );
	this.painter.cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xffaa00, opacity: skeletonOpacity, wireframe: true, shading: THREE.FlatShading } );
	this.painter.cubeMaterial.color.setHSV( 0.1, 0.7, 0.7 );
	
	// roll-over cube
	
	this.painter.rollOverGeo = new Cube( unit, unit, unit );
	this.painter.rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xffaa00, opacity: skeletonOpacity } );
	this.painter.rollOverMesh = new THREE.Mesh( this.painter.rollOverGeo, this.painter.rollOverMaterial );
	this.painter.rollOverMesh.position.set( half_unit, half_unit, half_unit );
	
	scene.addObject( this.painter.rollOverMesh );
	
	// picking
	
	this.controls.projector = new THREE.Projector();
	this.controls.mouse2D = new THREE.Vector3( 0, 10000, 0.5 );
	this.controls.ray = new THREE.Ray( camera.position, null );
	
	// marching cubes
	
	var resolution = this.effectController.resolution,
		isolation = this.effectController.isolation;
	
	this.mlib.current_material = this.effectController.material;
	var effectMaterial  = this.mlib.materials[ this.mlib.current_material ].m;
	
	this.effect = new THREE.MarchingCubes( resolution, effectMaterial );
	this.effect.isolation = isolation;
	this.effect.position.x = 15;
	this.effect.position.y = 490;
	this.effect.position.z = 15;
	this.effect.scale.x = this.effect.scale.y = this.effect.scale.z = 565;
	
	scene.addObject( this.effect );
	
	
	// events
	
	document.addEventListener( 'mousemove', function( e ) { _this.onDocumentMouseMove( e ) }, false );
	document.addEventListener( 'mousedown', function( e ) { _this.onDocumentMouseDown( e ) }, false );
	document.addEventListener( 'keydown',   function( e ) { _this.onDocumentKeyDown( e ) }, false );
	document.addEventListener( 'keyup',     function( e ) { _this.onDocumentKeyUp( e ) }, false );
	
	// helpers
	
	function inVolume( x, y, z ) {

		return x >= 0 && x < size && 
			   y >= 0 && y < size &&
			   z >= 0 && z < size;
			   
	};
	
	//	methods
	
	this.onDocumentMouseMove = function( event ) {

		event.preventDefault();

		this.controls.mouse2D.x =   ( event.clientX / window.innerWidth )  * 2 - 1;
		this.controls.mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	};
	
	this.onDocumentMouseDown = function ( event ) {

		event.preventDefault();
		
		var intersector, intersects = this.controls.ray.intersectScene( scene );

		if ( intersects.length == 0 ) return;

		intersector = this.getRealIntersector( intersects );
		
		if ( ! intersector ) return;
		
		// delete cube
		
		if ( this.controls.isCtrlDown ) {
			
			if ( intersector.object != this.painter.plane ) {
			
				this.removeVoxel( intersector.object );
				this.updateCubes();
				
			}
				

		// create cube
		
		} else {				

			if ( ! inVolume( this.painter.rx, this.painter.ry, this.painter.rz ) ) return;
			
			this.addVoxel( this.painter.voxelPosition );
			this.updateCubes();
			
		}
		
	};

	this.onDocumentKeyDown = function ( event ) {

		switch( event.keyCode ) {

			case 16: this.controls.isShiftDown = true; break;
			case 17: this.controls.isCtrlDown = true; break;

		}

	};

	this.onDocumentKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 16: this.controls.isShiftDown = false; break;
			case 17: this.controls.isCtrlDown = false; break;

		}
	};
	
	this.getRealIntersector = function( intersects ) {
		
		var i, rollOverMesh = this.painter.rollOverMesh;
		
		for( var i = 0; i < intersects.length; i++ ) {
		
			intersector = intersects[ i ];
			
			if ( intersector.object != rollOverMesh ) {
				
				return intersector;
				
			}
		
		}
		
		return null;
		
	};

	this.setVoxelPosition = function ( intersector ) {
		
		var position = this.painter.voxelPosition;
		
		this.painter.tmpVec.copy( intersector.face.normal );
		
		position.add( intersector.point, intersector.object.rotationMatrix.multiplyVector3( this.painter.tmpVec ) );
		
		position.x = Math.floor( position.x / unit ) * unit + half_unit;
		position.y = Math.floor( position.y / unit ) * unit + half_unit;
		position.z = Math.floor( position.z / unit ) * unit + half_unit;

	};

	this.removeVoxel = function( object ) {
		
		delete this.painter.voxels[ object.__hash ];
		
		this.scene.removeObject( object );
		this.renderer.removeObject( scene, object );
		
	};

	this.addVoxel = function( position ) {
		
		var vz, vy, vz, hash, voxel;
		
		voxel = new THREE.Mesh( this.painter.cubeGeo, this.painter.cubeMaterial );
		voxel.position.copy( position );
			
		vx = ( position.x - half_unit ) / unit + half_size;
		vy = ( position.y - half_unit ) / unit;
		vz = ( position.z - half_unit ) / unit + half_size;
		
		hash = vx + ":" + vy + ":" + vz;	
		
		voxel.__hash = hash;
		
		voxel.visible = this.effectController.skeleton;
		
		this.scene.addObject( voxel );
		
		this.painter.voxels[ hash ] = [ vx, vy, vz, voxel ];
		
	};
	
	this.addVoxels = function ( object, s, e, u, strength, subtract ) {
		
		var v, vx, vy, vz, voxel, 
			voxels = this.painter.voxels,
			sy = 1.75 * s;
		
		for ( v in voxels ) {
			
			voxel = voxels[ v ];
			vx = voxel[ 0 ];
			vy = voxel[ 1 ];
			vz = voxel[ 2 ];
			
			object.addBall( s + vx * u, sy + vy * u, s + vz * u, strength, subtract );
			
		}	

		// rollover cube
		
		object.addBall( s + this.painter.rx * u, sy + this.painter.ry * u, s + this.painter.rz * u, strength, subtract );
		
	};
	
	this.addCorners = function ( object, s, e, strength, subtract ) {
		
		// bottom				
		
		object.addBall( s, s, s, strength, subtract );
		object.addBall( e, s, s, strength, subtract );
		object.addBall( e, s, e, strength, subtract );
		object.addBall( s, s, e, strength, subtract );
		
		// top
		
		object.addBall( s, e, s, strength, subtract );
		object.addBall( s, e, e, strength, subtract );
		object.addBall( e, e, e, strength, subtract );
		object.addBall( e, e, s, strength, subtract );
		
	};

	this.addEdges = function ( object, s, e, u, step, strength, subtract ) {
		
		var i, l = size;
		
		for( i = 0; i < l; i += step ) {
		
			object.addBall( s, i * u, s, strength, subtract );
			object.addBall( e, i * u, s, strength, subtract );
			object.addBall( e, i * u, e, strength, subtract );
			object.addBall( s, i * u, e, strength, subtract );

			object.addBall( i * u, s, s, strength, subtract );
			object.addBall( i * u, s, e, strength, subtract );
			object.addBall( i * u, e, e, strength, subtract );
			object.addBall( i * u, e, s, strength, subtract );

			object.addBall( s, s, i * u, strength, subtract );
			object.addBall( s, e, i * u, strength, subtract );
			object.addBall( e, e, i * u, strength, subtract );
			object.addBall( e, s, i * u, strength, subtract );

		}
		
	};
	
	this.updateCubes = function () {
		
		var object = this.effect,
			parameters = this.effectController;
		
		object.reset();				
		
		var subtract = 12, 
			strength = 0.3,
			s = 0.05, 
			e = 0.95, 
			range = e - s, 
			u = range / 20;
		
		this.addVoxels( object, s, e, u, strength, subtract );
		
		//this.addCorners( object, s, e, strength, subtract );
		if( parameters.edges ) this.addEdges( object, s, e, u, 1, strength, subtract );	
		
		if( parameters.floor ) object.addPlaneY( 2, 12 );
		if( parameters.wallz ) object.addPlaneZ( 2, 12 );
		if( parameters.wallx ) object.addPlaneX( 2, 12 );
		
	};
	
	// gui callbacks
	
	this.updateMaterial = function() {		
		
		var effectMaterial = this.effect.materials[ 0 ];
		
		if ( effectMaterial instanceof THREE.MeshShaderMaterial ) {
		
			if ( mlib.current_material == "dotted2" ) {
				
				effectMaterial.uniforms.uLineColor1.value.setHSV( effectController.hue, effectController.saturation, effectController.value );
				
			} else if (  mlib.current_material == "hatching2" ) {
				
				u = effectMaterial.uniforms;
				
				u.uLineColor1.value.setHSV( effectController.hue, effectController.saturation, effectController.value );
				u.uLineColor2.value.setHSV( effectController.hue, effectController.saturation, effectController.value );
				u.uLineColor3.value.setHSV( effectController.hue, effectController.saturation, effectController.value );
				u.uLineColor4.value.setHSV( ( effectController.hue + 0.2 ) % 1.0, effectController.saturation, effectController.value );
				
			} else {
			
				effectMaterial.uniforms.uBaseColor.value.setHSV( effectController.hue, effectController.saturation, effectController.value );
				
			}
			
			effectMaterial.uniforms.opacity.value = effectController.opacity;
			
		} else {
			
			effectMaterial.color.setHSV( effectController.hue, effectController.saturation, effectController.value );
			effectMaterial.opacity = effectController.opacity;
			
		}
		
		this.painter.cubeMaterial.opacity = this.painter.rollOverMaterial.opacity = 1 - effectController.opacity;
		
		// hide completely transparent blobs
		
		this.effect.visible = effectController.opacity != 0;
		
	};
	
	this.updateSimulation = function() {
		
		var effect = this.effect,
			effectController = this.effectController;
		
		effect.init( effectController.resolution );
		effect.isolation = effectController.isolation;
		
		this.updateCubes();
		
	};
	
	this.updateRendering = function() {
		
		var effectController = this.effectController,
			v, voxels = this.painter.voxels;
		
		this.effect.visible = effectController.blobs;
		this.painter.plane.visible = effectController.plane;
		
		for ( v in voxels ) {
			
			voxels[ v ][ 3 ].visible = effectController.skeleton;
			
		}
		
		this.painter.rollOverMesh.visible = effectController.skeleton;
		
	};
	
	// update loop
	
	this.loop = function( camera ) {

		var painter = this.painter,
			controls = this.controls;
		
		controls.mouse3D = controls.projector.unprojectVector( controls.mouse2D.clone(), camera );
		controls.ray.direction = controls.mouse3D.subSelf( camera.position ).normalize();

		var intersects = controls.ray.intersectScene( this.scene );

		if ( intersects.length > 0 ) {

			intersector = this.getRealIntersector( intersects );
			if ( intersector ) {
			
				this.setVoxelPosition( intersector );			
				
				painter.rx = ( painter.voxelPosition.x - half_unit ) / unit + half_size;
				painter.ry = ( painter.voxelPosition.y - half_unit ) / unit;
				painter.rz = ( painter.voxelPosition.z - half_unit ) / unit + half_size;

				if ( inVolume( painter.rx, painter.ry, painter.rz ) ) {
					
					if ( painter.rx != painter.rx_old || 
						 painter.ry != painter.ry_old || 
						 painter.rz != painter.rz_old ) {
						
						painter.rollOverMesh.position.copy( painter.voxelPosition );
						
						this.updateCubes();
						
						painter.rx_old = painter.rx;
						painter.ry_old = painter.ry;
						painter.rz_old = painter.rz;
						
					}
					
				}

			}
			
		}

	}
	
}

