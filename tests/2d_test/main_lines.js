var context;
var canvas;
var targetFps=12;
var currentFrame = 1;
var totalFrames = 12;

function init() {
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');

	setInterval(loop, 1000/targetFps);
}

function loop() {
	context.clearRect(0,0, 640,480);
	// bg
	context.beginPath();
	context.fillStyle="#999999";
	context.rect(0,0,640,480);
	context.closePath();
	context.fill();

	drawFrame(currentFrame, 2);

	++currentFrame;
	if (currentFrame > totalFrames) {
		currentFrame = 1;
	}
}

function drawFrame(frame, scale) {
	var verts = window["v"+currentFrame];
	var colors = window["c"+currentFrame];
	var index = window["i"+currentFrame];
	var lines = window["l"+currentFrame];
	
	var currentColorCount = 0;
	var currentColor = colors[currentColorCount].toString(16);
	currentColor = currentColor.substr(2,currentColor.length);
	var nextColorChange = index[currentColorCount+1];

	for (var i=0; i<verts.length; i+=6 ) {
		// change color?
		if (i >= nextColorChange) {
			++currentColorCount
			currentColor = colors[currentColorCount].toString(16);
			currentColor = currentColor.substr(2,currentColor.length);
			nextColorChange = index[currentColorCount+1];
		}

		var offset = -10; // messed up the export...
		// vertices
		var p1x = (verts[i]+offset)*scale;
		var p1y = (verts[i+1]+offset)*scale;
		var p2x = (verts[i+2]+offset)*scale;
		var p2y = (verts[i+3]+offset)*scale;
		var p3x = (verts[i+4]+offset)*scale;
		var p3y = (verts[i+5]+offset)*scale;
		
		// draw face
		context.fillStyle = "#"+currentColor;
		context.strokeStyle = "#"+currentColor;
		context.lineWidth = 1;
		context.beginPath();  
		context.moveTo(p1x, p1y);  
		context.lineTo(p2x, p2y);  
		context.lineTo(p3x, p3y); 
		context.lineTo(p1x, p1y);
		context.stroke(); 
		context.fill(); 
	}

	// lines
	context.strokeStyle = "#333333";
	context.lineWidth = 4;
	
	for (var i=0; i<lines.length; ++i ) {
		var shape = lines[i];
		context.beginPath(); 
	
		for (var j=0; j<shape.length; j+=2 ) {
			var x = (shape[j]+offset)*scale;
			var y = (shape[j+1]+offset)*scale;
			if (j == 0) {
				// start
				context.moveTo(x, y);
			} else {
				// in between
				context.lineTo(x, y); 
			}
			// end to start
			if (j == (shape.length-2)) {
				context.lineTo((shape[0]+offset)*scale, (shape[1]+offset)*scale); 
			}
		}
		context.stroke(); 
		context.closePath();
	}

}