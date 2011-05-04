
var VideoShots = {

    confParalax: {
        paralaxHorizontal: 400,
        paralaxVertical: 100
    },
    
    confStill: {
        paralaxHorizontal: 0,
        paralaxVertical: 0
    },
    
    introLayers: [{
        path: "files/videos/intro.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000,
		duration: 22000
    }],

	s01_01: [{
        path: "files/videos/city/s01_layer01.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000,
		duration: 3120
	}],
	
	s01_03: [{
        path: "files/videos/city/s03_layer03.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1200,
		width: 1.56, height: 1.59,
		paralax: true,
		duration: 8120
	},{
        path: "files/videos/city/s03_layer02.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -700,
		width: 1.30, height: 1.16,
		paralax: true
	},{
        path: "files/videos/city/s03_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -100,
		locked: true,
		removeAt: 0.3
	}],

	s01_06: [{
        path: "files/videos/city/s06_layer02.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1000,
		duration: 2030	
	},{
        path: "files/videos/city/s06_layer01.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -900
	}],
	
	s01_09: [{       
	    path: "files/videos/city/s09_layer04.webm",
        shaderId: VIDEO_KEYED_DISTORT,
        z: -1000,
		duration: 8230,
		colorScale: .99,
        threshold: .45,
        alphaFadeout: .35,
		paralax: true,
		width: 1.5625, height: 1.1627
	},{       
	    path: "files/videos/city/s09_layer03.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -900,
		paralax: true,
		removeAt: 0.8,
		width: 1.5625, height: 1.1627
	},{       
	    path: "files/videos/city/s09_layer02.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -800,
		paralax: true,
		removeAt: 0.8,
		width: 1.5625, height: 1.1627
	},{       
	    path: "files/videos/city/s09_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -500,
		locked: true,
		colorScale: .99,
        threshold: .45,
        alphaFadeout: .35,
        removeAt : 0.3
	}],
   

    
	
	
    
    s02_01: [{
        path: "files/videos/prairie/s01_layer04.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1400,
		width: 1, height: 1.83,
		paralax: true,
		duration: 9230
    }/*,{
        path: "files/videos/prairie/s01_layer03.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -1100,
		width: 1.56, height: 1,
		paralax: true
    }*/,{
        path: "files/videos/prairie/s01_layer02.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -700,
		paralax: true,
		width: 1.56, height: 1.83
    },{
        path: "files/videos/prairie/s01_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -30,
        locked: true
    }],
    
	
	
	
	
	
	
	
    s02_02: [{
        path: "files/videos/prairie/s02_layer03.jpg",
        shaderId: VIDEO_OPAQUE,
        z: -1010,
		duration: 2020
    },{
        path: "files/videos/prairie/s02_layer02.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -1000
    },{
        path: "files/videos/prairie/s02_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -990	
    }],
    
	
    s02_03: [{
        path: "files/videos/prairie/s03_layer03.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1500,
		duration: 2030
    }, {
        path: "files/videos/prairie/s03_layer01.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -1000
    }],
    
	
	
    s02_04: [{
        path: "files/videos/prairie/s04_layer02.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1010,
		duration: 5000
    }, {
        path: "files/videos/prairie/s04_layer01.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -1000
    }],
	
    
    s02_06: [{
        path: "files/videos/prairie/s06_layer02.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -1010,
		duration: 6060
    },{
        path: "files/videos/prairie/s06_layer01.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -1000
    }
	],

	s03_01: [{
        path: "files/videos/dunes/s01_layer02.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1010,
		duration: 8000
    },{
        path: "files/videos/dunes/s01_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -1000
    }],
	
	s03_02: [{
        path: "files/videos/dunes/s02_layer02.webm",
        shaderId: VIDEO_OPAQUE,
        z: -1010,
		duration: 3500
    },{
        path: "files/videos/dunes/s02_layer01.webm",
        shaderId: VIDEO_SMARTALPHA_DISTORT,
        z: -1000
    }],
	
	s03_03: [{
        path: "files/videos/dunes/s03_layer02.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -1400,
		paralax: true,
		width: 1.526, height: 1.11,
		duration: 11000
    },{
        path: "files/videos/dunes/s03_layer01.webm",
        shaderId: VIDEO_SMARTALPHA,
        z: -1000,
		locked: true
    }],
};













