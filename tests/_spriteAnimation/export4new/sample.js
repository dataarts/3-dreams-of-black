comp_1 = {
	duration: 2,
	texturePath: "",
	cameras: {
		cam: {
			position: [500, 250, -4743.378],
			rotation: [0, 0, 0],
			scale: [1, 1, 1],
		},
	},
	planes: {
		bsq: {
			position: [500, 250, 0],
			rotation: [0, 0, 0],
			scale: [0.385, 0.385, 1],
			texture: "buffrun.webm",
			alpha: true,
		},
		trees: {
			position: [832, 270, 0],
			rotation: [0, 0, 0],
			scale: [0.324, 0.324, 1],
			texture: "bg01trees.jpg",
			alpha: true,
			keyframes: [
				{
					position: [832, 270, 0],
				},
				{
					position: [663.489, 271.021, 0],
				},
				{
					position: [494.979, 272.043, 0],
				},
				{
					position: [326.470, 273.064, 0],
				},
			],
		},
		sky: {
			position: [516, 302, 0],
			rotation: [0, 0, 0],
			scale: [1.299, 1.299, 1],
			texture: "mineSky.jpg",
			alpha: false,
		},
	},
}
