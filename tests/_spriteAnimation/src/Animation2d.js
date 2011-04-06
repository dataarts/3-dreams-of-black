<!--

var anim = {
	
	start: 0,
	end: 10,
	
	assets: {
		s01_clouds: { type:STILL, src:"path/to/image/clouds.jpg" },
		s01_dust: { type:STILL, src:"path/to/image/dust.png" },
		s01_buffalo: { type:ANIMATION, src:"path/to/image/buffaloSequence.png", fps: 24 },
		// Interactive elements
		s01_button: { type:BUTTON, src:"path/to/image/button.png", fps: 24, onClick: someFunction }
	},
	
	clips: [
		{
			asset: s01_clouds,
			key: { alpha: 1, position: [0, 0, 100], time: 0 },
			key: { alpha: 0, time: 10 }
		},
		
		{
			asset: s01_dust,
			key: { alpha: 0.2, position: [0.5, 0.5, 100], time: 0 },
			key: { alpha: 1, position: [0.3, 0.8, 100], time: 0 },
			key: { alpha: 0, position: [0, 0.7, 100], time: 2, interpolation: "easeOut" }
		},
		
		{
			asset: s01_buffalo,
			key: { alpha: 1, position: [0, 0, 100], time: 0 },
			key: { alpha: 0, time: 10 }
		}
	]
};

-->