function greyCity() {
	// greymodel city
	var cube = new Cube( 400, 180, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  400, FLOOR+90, 0, 0,0,0, getMaterial() );

	var cube = new Cube( 300, 150, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  0, FLOOR+75, 0, 0,0,0, getMaterial() );
	
	var cube = new Cube( 600, 200, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  350, FLOOR+100, -250, 0,0,0, getMaterial() );

	var cube = new Cube( 90, 220, 400, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  100, FLOOR+110, -500, 0,0,0, getMaterial() );

	var cube = new Cube( 100, 240, 600, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  100, FLOOR+120, -1000, 0,0,0, getMaterial() );

	var cube = new Cube( 90, 160, 390, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -150, FLOOR+80, -700, 0,0,0, getMaterial() );

	var cube = new Cube( 100, 180, 700, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -150, FLOOR+90, -1250, 0,0,0, getMaterial() );

	var cube = new Cube( 200, 300, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -300, FLOOR+150, -550, 0,0,0, getMaterial() );

	var cube = new Cube( 100, 180, 200, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -350, FLOOR+90, -350, 0,0,0, getMaterial() );

	var cube = new Cube( 500, 260, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -650, FLOOR+130, -250, 0,0,0, getMaterial() );

	var cube = new Cube( 600, 300, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -1250, FLOOR+150, -250, 0,0,0, getMaterial() );

	var cube = new Cube( 600, 320, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -1900, FLOOR+160, -250, 0,0,0, getMaterial() );

	var cube = new Cube( 600, 200, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -500, FLOOR+100, 0, 0,0,0, getMaterial() );

	var cube = new Cube( 600, 240, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -1150, FLOOR+120, 0, 0,0,0, getMaterial() );

	var cube = new Cube( 600, 260, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -1850, FLOOR+140, 0, 0,0,0, getMaterial() );

	// blockers
	var cube = new Cube( 100, 150, 500, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  1100, FLOOR+75, -150, 0,0,0, getMaterial() );

	var cube = new Cube( 900, 150, 100, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  0, FLOOR+75, -1850, 0,0,0, getMaterial() );

	var cube = new Cube( 300, 500, 300, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -650, FLOOR+250, -550, 0,0,0, getMaterial() );

	var cube = new Cube( 100, 150, 500, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -2700, FLOOR+75, -150, 0,0,0, getMaterial() );

	// sidewalks
	var cube = new Cube( 2500, 4, 1500, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -1330, FLOOR+2, -930, 0,0,0, new THREE.MeshLambertMaterial( { color:0x999999 } ) );

	var cube = new Cube( 1500, 4, 1500, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  780, FLOOR+2, -930, 0,0,0, new THREE.MeshLambertMaterial( { color:0x999999 } ) );

	var cube = new Cube( 4000, 4, 900, 1, 1 );
	var cubeMesh = addMesh( cube, 1,  -800, FLOOR+2, 380, 0,0,0, new THREE.MeshLambertMaterial( { color:0x999999 } ) );	
}