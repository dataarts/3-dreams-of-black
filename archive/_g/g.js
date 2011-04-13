var canvas, 
    g,
    frameRate,
    mouseX,
    mouseY,
    pmouseX,
    pmouseY,
    width,
    height,
    mousePressed = false,
    keyPressed = false,
    mouseUp,
    PI = Math.PI,
    TWO_PI = PI*2,
    HALF_PI = PI/2,
    QUART_PI = PI/4,
    mouseDown,
    mouseMoved,
    mouseDragged,
    keyUp,
    keyDown,
    resizeListener,
    resize,
    setup,
    iterate,
    size,
    draw;

function init() {
    
    canvas = document.getElementById('romeCanvas');
    g = canvas.getContext('2d');      
    
    document.addEventListener('mousemove', function (e) {
        pmouseX = mouseX;
        pmouseY = mouseY;
        mouseX = e.pageX;
        mouseY = e.pageY;
        if (mousePressed && mouseDragged != undefined) {
            mouseDragged(e);
        } else if (mouseMoved != undefined) {
            mouseMoved(e);
        }
    }, false);
    
    document.addEventListener('mousedown', function (e) { 
        mousePressed = true;
        if (mouseDown != undefined) mouseDown(e);
    }, false);
    
    document.addEventListener('mouseup', function (e) { 
        mousePressed = false;
        if (mouseUp != undefined) mouseUp(e);
    }, false);  
    
    document.addEventListener('keydown', function (e) {
    //  keyPressed = true;
        if (keyDown != undefined) keyDown(e);
    }, false);
        
    document.addEventListener('keyup', function (e) {
    //  keyPressed = false;
        if (keyUp != undefined) keyUp(e);
    }, false);
        
    
    size = function (w, h) {
        if(w == undefined || h == undefined || w == null || h == undefined) {
            width  = canvas.width  = window.innerWidth;
            height = canvas.height = window.innerHeight;
        } else {
            width  = canvas.width  = w;
            height = canvas.height = h;
            resizeListener = null;
        }
    }
        
    size(width, height);
    
    window.scrollBy(0,-window.pageYOffset); // Make sure that we're at the top of the screen
        
    if (setup != undefined) setup();
    
    iterate = setInterval(idraw, 1000/frameRate);
}

function idraw() {
    if (draw != undefined) draw();
}