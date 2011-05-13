
var VideoShots = {

    introLayers: [
	{
        path: "/files/videos/intro.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000,
		fps: 48,
		width: 1.01, height: 1.01,
		duration: 22000
    }
	],
	// CITY - FEATHER
	s01_01: [
	{
        path: "/files/videos/city/s01.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000,
		duration: 3120
	}
	],
	// CITY - ROOM
	s01_03: [
	{
        path: "/files/videos/city/s03_layer02.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1100,
		width: 1.56, height: 1.59,
		paralax: true,
		duration: 8120,
		paralaxHorizontal: 600,
		paralaxVertical: 200
	},{
        path: "/files/videos/city/s03_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -100,
		locked: true,
		removeAt: 0.3
	}
	],
	// CITY - PARROT
	s01_06: [{
        path: "/files/videos/city/s06_layer02.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000,
		duration: 2030	
	},{
        path: "/files/videos/city/s06_layer01.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -900
	}],
	// CITY - CAR
	s01_09: [{       
	    path: "/files/videos/city/s09_layer02.webm",
        shaderId: VIDEO_KEYED,
        z: -1000,
		colorScale: .99,
        threshold: .45,
        alphaFadeout: .35,
		paralax: true,
		width: 1.5625, height: 1.1627,
		duration: 8230,
		paralaxHorizontal: 600,
		paralaxVertical: 100
	},{       
	    path: "/files/videos/city/s09_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -500,
		locked: true,
        removeAt : 0.3
	}],	
	// PRAIRIE - BOXCAR
    s02_01: [{
        path: "/files/videos/prairie/s01_layer02.webm",
        shaderId: VIDEO_OPAQUE,
		width: 1.5625, height: 1,
		paralax: true,
		paralaxHorizontal: 600,
		paralaxVertical: 0,
		bendForce: 73,
        z: -200,
		duration: 9800
    },{
        path: "/files/videos/prairie/s01_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
		width: 1.05, height: 1.05,
		locked: true,
        z: -100
    }],
    // PRAIRIE - TRAIN LADDER
    s02_02: [{
        path: "/files/videos/prairie/s02_layer03.jpg",
        shaderId: VIDEO_OPAQUE,
        z: -1010,
		duration: 2000
    },{
        path: "/files/videos/prairie/s02_layer02.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -1000
    },{
        path: "/files/videos/prairie/s02_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -990	
    }],
    // PRAIRIE - BUFFALOS
    s02_03: [{
        path: "/files/videos/prairie/s03_layer03.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1500,
		duration: 2125
    },{
        path: "/files/videos/prairie/s03_layer01.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -1000
    }],
	// PRAIRIE - OVERHEAD
    s02_04: [{
        path: "/files/videos/prairie/s04_layer02.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1010,
		duration: 5000
    }, {
        path: "/files/videos/prairie/s04_layer01.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -1000
    }],
	
    // PRAIRIE - TRANSITION
    s02_06: [{
        path: "/files/videos/prairie/s06_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
		colorScale: 1.0,
        threshold: 2.4,
        alphaFadeout: 1,
        z: -1010,
		duration: 6000
    }
	],
	// DUNES - TRAIN
	s03_01: [{
        path: "/files/videos/dunes/s01_layer03.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000,
		width: 1.56, height: 1.22,
		paralax: true,
		duration: 8000,
		paralaxHorizontal: 600,
		paralaxVertical: 100
    },{
        path: "/files/videos/dunes/s01_layer02.webm",
        shaderId: VIDEO_KEYED_DISTORT,
        z: -800,
		colorScale: .9,
        threshold: .20,
        alphaFadeout: .35,
		width: 1.56, height: 1.22,
		paralax: true
    },{
        path: "/files/videos/dunes/s01_layer01.webm",
        shaderId: VIDEO_KEYED,
		colorScale: 0,
        threshold: .5,
        alphaFadeout: .5,
        z: -100,
		locked: true
    }],	
	// DUNES - BED
	s03_02: [{
        path: "/files/videos/dunes/s02_layer02.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1010,
		duration: 3500
    },{
        path: "/files/videos/dunes/s02_layer01.webm",
        shaderId: VIDEO_KEYED_DISTORT,
		colorScale: .9,
        threshold: .20,
        alphaFadeout: .35,
        z: -1000
    }],
	// DUNES - TRANSITION
	s03_03: [{
        path: "/files/videos/dunes/s03_layer02.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -400,
		paralax: true,
		width: 1.526, height: 1.11,
		duration: 11000,
		paralaxHorizontal: 600,
		paralaxVertical: 100
    },{
        path: "/files/videos/dunes/s03_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -100,
		removeAt: 0.3,
		locked: true
    }]
};













