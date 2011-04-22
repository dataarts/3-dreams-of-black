sampleanim = {
	duration: 2,
	texturePath: "",
	cameras: {
		camera: {
			position: [500, -250, 80],
			rotation: [0, 0, 0],
			scale: [1, 1, 1],
			target: [500, -250, 0],
		},
	},
	planes: {
		bsq: {
			position: [500, -250, 0],
			rotation: [0, 0, 0],
			scale: [0.075, 0.075, 0.075],
			texture: "buffrun.png",
			alpha: true,
			width: 2304,
			height: 1296,
		},
		trees: {
			position: [558, -270, -10],
			rotation: [0, 0, 0],
			scale: [0.074, 0.074, 0.074],
			texture: "bg01trees.jpg",
			alpha: true,
			width: 5440,
			height: 4080,
			keyframes: [
				{
					time: 0,
					px: 558,
					py: -270,
					pz: -10,
				},
				{
					time: 0.5,
					px: 520.760,
					py: -270.359,
					pz: -10,
				},
				{
					time: 1,
					px: 483.462,
					py: -272.998,
					pz: -10,
				},
				{
					time: 1.5,
					px: 446.138,
					py: -275.209,
					pz: -10,
				},
			],
		},
		sky: {
			position: [501.684, -247.263, -20],
			rotation: [0, 0, 0],
			scale: [0.259, 0.259, 0.259],
			texture: "mineSky.jpg",
			alpha: false,
			width: 1060,
			height: 508,
		},
	},
}
