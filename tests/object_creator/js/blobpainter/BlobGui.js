function toggle( e ) {

	if( e.style.display == "block" ) 
		e.style.display = "none";
	else
		e.style.display = "block";
	
}

function bind( scope, fn ) {
    return function () {
        fn.apply( scope, arguments );
    };
}

function setupGui( scene, effectController, mlib, painter, globals ) {

	var createHandler = function( id ) { 
	
		return function( ) {
		
			var mat_old = mlib.materials[ mlib.current_material ];
			mat_old.h = m_h.getValue();
			mat_old.s = m_s.getValue();
			mat_old.v = m_v.getValue();
			mat_old.o = m_o.getValue();
			
			mlib.current_material = id; 
			
			var mat = mlib.materials[ id ];
			painter.effect.materials = [ mat.m ];
			
			m_h.setValue( mat.h );
			m_s.setValue( mat.s );
			m_v.setValue( mat.v );
			m_o.setValue( mat.o );
			
			mm.setValue( mlib.current_material );
			
		}; 
		
	};
	
	effectController.h_m  = function() { for( var i = 0; i < g_m.length; i++ )  toggle( g_m[ i ].domElement ); };
	effectController.h_c  = function() { for( var i = 0; i < g_c.length; i++ )  toggle( g_c[ i ].domElement ); };
	effectController.h_pc = function() { for( var i = 0; i < g_pc.length; i++ ) toggle( g_pc[ i ].domElement ); };
	effectController.h_do = function() { for( var i = 0; i < g_do.length; i++ ) toggle( g_do[ i ].domElement ); };
	effectController.h_s  = function() { for( var i = 0; i < g_s.length; i++ )  toggle( g_s[ i ].domElement ); };
	effectController.h_r  = function() { for( var i = 0; i < g_r.length; i++ )  toggle( g_r[ i ].domElement ); };
		
	effectController.dummy = function() {};
		
	var n = 1;
	
	effectController.generateGeometry = function() { 
			
		var g = painter.effect.generateGeometry();
		
		//var m = mlib.materials[ mlib.current_material ];
		var m = new THREE.MeshLambertMaterial(),
			x = painter.effect.position.x,
			y = painter.effect.position.y,
			z = painter.effect.position.z,
			s = painter.effect.scale.x;
		
		SceneUtils.addMesh( scene, g, s, x + 1000 * n, y, z, 0, 0, 0, m );
		
		n += 1;
		
	};
	

	var e1, e2, e3, e4, e5, e6, h, m_h, m_s, m_v, m_o,
		g_m = [], g_c, g_pc, g_do, g_s, g_r, mm,
		gui = new GUI();				
	
	// material (type)
	
	mm = gui.add( effectController, "material" );
	mm.domElement.style.display = "none";
	
	h = gui.add( effectController, "h_m" ).name( "Materials" );
	setGuiHeaderStyle( h, 0, 65, 50 );
	
	for( var m in mlib.materials ) {
	
		effectController[ m ] = createHandler( m );
		
		e1 = gui.add( effectController, m ).name( m );
		setGuiElementStyle( [ e1 ], 0, 65, 50, "block" );
		g_m.push( e1 );
		
	}			
	
	// callbacks setup

	var matChanger = bind( painter, painter.updateMaterial );
	var simulationChanger = bind( painter, painter.updateSimulation );
	var renderChanger = bind( painter, painter.updateRendering );
	
	var lightChanger = function() {
	
		globals.light.position.set( effectController.lx, effectController.ly, effectController.lz );
		globals.light.position.normalize();
		
		globals.pointLight.color.setHSV( effectController.lhue, effectController.lsaturation, effectController.lvalue );
		
	}
	
	// material (color)

	h = gui.add( effectController, "h_c" ).name( "Material color" );
		
	m_h = gui.add( effectController, "hue", 0.0, 1.0, 0.025 ).onChange( matChanger );
	m_s = gui.add( effectController, "saturation", 0.0, 1.0, 0.025 ).onChange( matChanger );
	m_v = gui.add( effectController, "value", 0.0, 1.0, 0.025 ).onChange( matChanger );				
	m_o = gui.add( effectController, "opacity", 0.0, 1.0, 0.025 ).onChange( matChanger );				
	
	g_c = [ m_h, m_s, m_v, m_o ];
	
	setGuiHeaderStyle( h, 20, 65, 50 );
	setGuiElementStyle( g_c, 20, 65, 50, "block" );
	
	// light (point)
	
	h  = gui.add( effectController, "h_pc" ).name( "Point light color" );
	
	e1 = gui.add( effectController, "lhue", 0.0, 1.0, 0.025 ).name("hue").onChange( lightChanger );
	e2 = gui.add( effectController, "lsaturation", 0.0, 1.0, 0.025 ).name("saturation").onChange( lightChanger );
	e3 = gui.add( effectController, "lvalue", 0.0, 1.0, 0.025 ).name("value").onChange( lightChanger );

	g_pc = [ e1, e2, e3 ];

	setGuiHeaderStyle( h, 50, 65, 50 );
	setGuiElementStyle( g_pc, 50, 65, 50 );
	
	// light (directional)
	
	h  = gui.add( effectController, "h_do" ).name( "Directional light orientation" );
	
	e1 = gui.add( effectController, "lx", -1.0, 1.0, 0.025 ).name("x").onChange( lightChanger );
	e2 = gui.add( effectController, "ly", -1.0, 1.0, 0.025 ).name("y").onChange( lightChanger );
	e3 = gui.add( effectController, "lz", -1.0, 1.0, 0.025 ).name("z").onChange( lightChanger );

	g_do = [ e1, e2, e3 ];
	
	setGuiHeaderStyle( h, 80, 65, 50 );
	setGuiElementStyle( g_do, 80, 65, 50 );
	
	// simulation
	
	h = gui.add( effectController, "h_s" ).name( "Simulation" );
	
	e1 = gui.add( effectController, "resolution", 14, 40, 1 ).onChange( simulationChanger );
	e2 = gui.add( effectController, "isolation", 10, 400, 1 ).onChange( simulationChanger );
	
	e3 = gui.add( effectController, "floor" ).onChange( simulationChanger );
	e4 = gui.add( effectController, "wallx" ).onChange( simulationChanger );
	e5 = gui.add( effectController, "wallz" ).onChange( simulationChanger );
	e6 = gui.add( effectController, "edges" ).onChange( simulationChanger );
	
	e3.updateDisplay();
	e4.updateDisplay();
	e5.updateDisplay();
	e6.updateDisplay();
	
	g_s = [ e1, e2, e3, e4, e5, e6 ];
	
	setGuiHeaderStyle( h, 200, 65, 50 );
	setGuiElementStyle( g_s, 200, 65, 50, "block" );

	// rendering
	
	h = gui.add( effectController, "h_r" ).name( "Rendering" );
	e1 = gui.add( effectController, "postprocessing" );
	
	e2 = gui.add( effectController, "plane" ).onChange( renderChanger );
	//e3 = gui.add( effectController, "skeleton" ).onChange( renderChanger );
	//e4 = gui.add( effectController, "blobs" ).onChange( renderChanger );
	
	e2.updateDisplay();
	//e3.updateDisplay();
	//e4.updateDisplay();

	g_r = [ e1, e2 ];
	//g_r = [ e1, e2, e3, e4 ];
	
	setGuiHeaderStyle( h, 225, 65, 50 );
	setGuiElementStyle( g_r, 225, 65, 50, "block" );
	
	// save
	
	e1 = gui.add( GUI, "saveURL" ).name( "Save to URL" );
	setGuiHeaderStyle( e1 , 250, 65, 50, "block" );
	
	// debug
	
	e1 = gui.add( effectController, "generateGeometry" ).name( "Freeze into geometry" );
	setGuiHeaderStyle( e1 , 300, 65, 50, "block" );

	
	// global GUI style
	
	gui.domElement.style.backgroundColor = "#222";
	
	
	// restore material from URL
	
	id = mm.getValue()
	mlib.current_material = id; 
	var mat = mlib.materials[ id ];
	painter.effect.materials = [ mat.m ];
	
}


function setGuiHeaderStyle( g, h, s, v ) {

	var color = "hsl(" + h + "," + s + "%, " + v + "%)";
	
	g.domElement.style.borderLeft = "solid 5px " + color;
	g.domElement.style.background = color;
	g.domElement.style.fontWeight = "bold";

}

function setGuiElementStyle( a, h, s, v, display ) {

	var i, s, color = "hsl(" + h + "," + s + "%, " + v + "%)";
	
	for( i = 0; i < a.length; i++ ) {
		
		s = a[ i ].domElement.style;
		s.borderLeft = "solid 5px " + color;
		s.display = display ? display : "none";
		
	}

}
