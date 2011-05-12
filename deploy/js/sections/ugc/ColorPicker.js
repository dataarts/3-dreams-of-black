function ColorPicker(container) {

  var _this = this;
  var PADDING = 20;
  var BRIGHTNESS_CANVAS_HEIGHT = 20;

  var bufferCanvas = document.createElement('canvas');

  var brightnessCanvas = document.createElement('canvas');
  brightnessCanvas.style.position = 'relative';

  var wheelCanvas = document.createElement('canvas');
  wheelCanvas.style.position = 'relative';
  wheelCanvas.style.top = 0;

  this.domElement = document.createElement('div');
  this.domElement.setAttribute('id', 'ugcui-color-picker');

  var bufferCtx, wheelCtx, brightnessCtx, width, height;

  var pickerX, pickerY;
  var color = new DAT.Color(255, 255, 255);

  var imgGround = document.createElement('img');
  var imgSky = document.createElement('img');
  imgGround.src = '/files/wheel.png';
  imgSky.src = '/files/wheel-sky.png';

  var _type = 0;

  var value = 100;

  this.onColorChange = function(hex) {
  };

  this.setType = function(type) {

    _type = type;
    if (type == 1) {
      
      brightnessCanvas.style.display = 'none';
      bufferCtx.drawImage(imgSky, PADDING, PADDING);
    } else {
      brightnessCanvas.style.display = 'block';
      bufferCtx.drawImage(imgGround, PADDING, PADDING);
    }

    pickColor();
    _this.onColorChange(color.hex);
    redraw();
    drawSelected();

  };

  imgGround.onload = function() {
    width = brightnessCanvas.width = bufferCanvas.width = wheelCanvas.width = imgGround.width + PADDING * 2;
    height = bufferCanvas.height = wheelCanvas.height = imgGround.height + PADDING * 2;

    brightnessCanvas.height = BRIGHTNESS_CANVAS_HEIGHT + PADDING * 2;
    brightnessCtx = brightnessCanvas.getContext('2d');

    _this.domElement.appendChild(wheelCanvas);
    _this.domElement.appendChild(brightnessCanvas);

    container.appendChild(_this.domElement);

    bufferCtx = bufferCanvas.getContext('2d');
    bufferCtx.drawImage(imgGround, PADDING, PADDING);

    wheelCtx = wheelCanvas.getContext('2d');
    brightnessCtx.shadowBlur = wheelCtx.shadowBlur = 4;
    brightnessCtx.shadowColor = wheelCtx.shadowColor = 'rgba(0,0,0,0.3)';

    pickerX = width / 2;
    pickerY = height / 2;
    redraw();
    drawSelected();
  }

  function redraw() {
    wheelCtx.clearRect(0, 0, width, height);
    wheelCtx.drawImage(_type == 0 ? imgGround : imgSky, PADDING, PADDING);
    wheelCtx.fillStyle = 'rgba(0,0,0,' + (1 - value / 100) + ')';
    wheelCtx.save();
    wheelCtx.translate(width / 2, height / 2);
    wheelCtx.rotate(Math.PI / 2);
    hex(177, 0, 0);
    wheelCtx.fill();
    wheelCtx.restore();
    var gradient = brightnessCtx.createLinearGradient(PADDING, 0, width - PADDING, 0);

    var tmp = new DAT.Color(color);

    tmp.v = 100;

    gradient.addColorStop(0, tmp.toString());
    gradient.addColorStop(1, '#000');
    brightnessCtx.strokeStyle = '#fff';
    brightnessCtx.lineWidth = 3;
    brightnessCtx.clearRect(0, 0, width, height);
    brightnessCtx.fillStyle = gradient;
    brightnessCtx.fillRect(PADDING, PADDING, width - PADDING * 2, BRIGHTNESS_CANVAS_HEIGHT);

    var bx = (1 - Math.round(color.v) / 100) * (width - PADDING * 2) + PADDING;

    hex(BRIGHTNESS_CANVAS_HEIGHT / 2 + 5.5, bx, PADDING + BRIGHTNESS_CANVAS_HEIGHT / 2, brightnessCtx);
    brightnessCtx.fill();
    brightnessCtx.stroke();


  }

  function hex(radius, x, y, ctx) {
    ctx = ctx || wheelCtx;
    ctx.beginPath();
    ctx.moveTo(Math.cos(0) * radius + x, Math.sin(0) * radius + y);
    for (var i = 0, j = 0; i <= 6; i ++,j = ( i / 6 ) * Math.PI * 2) {
      ctx.lineTo(Math.cos(j) * radius + x, Math.sin(j) * radius + y);
    }
  }

  function drawSelected(x, y) {

    x = x || pickerX;
    y = y || pickerY;

    pickerX = x;
    pickerY = y;

    wheelCtx.fillStyle = color.toString();
    wheelCtx.strokeStyle = '#fff';
    wheelCtx.lineWidth = 3;

    wheelCtx.save();
    wheelCtx.translate(x, y);
    wheelCtx.rotate(Math.PI / 2);
    hex(20, 0, 0);

    wheelCtx.restore();

    wheelCtx.fill();
    wheelCtx.stroke();


  }

  wheelCanvas.addEventListener('mousedown', function(e) {
    //document.body.style.cursor = 'none';
    e.stopImmediatePropagation();
    e.stopPropagation();
    onWheelCanvasMouseDrag(e);
    document.addEventListener('mousemove', onWheelCanvasMouseDrag, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
  }, false);

  brightnessCanvas.addEventListener('mousedown', function(e) {
    //document.body.style.cursor = 'none';
    e.stopImmediatePropagation();
    e.stopPropagation();
    onBrightnessCanvasMouseDrag(e);
    document.addEventListener('mousemove', onBrightnessCanvasMouseDrag, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
  }, false);

  function onDocumentMouseUp(e) {
    //document.body.style.cursor = 'auto';
    e.stopImmediatePropagation();
    e.stopPropagation();
    document.removeEventListener('mousemove', onWheelCanvasMouseDrag, false);
    document.removeEventListener('mousemove', onBrightnessCanvasMouseDrag, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);

    _this.onColorChange(color.hex);
  }

  function onBrightnessCanvasMouseDrag(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    var x = e.pageX - getOffset(brightnessCanvas).left; // TODO account for offset;


    if (x >= PADDING && x <= width - PADDING) {
      value = (100 - (x - PADDING) / (width - PADDING * 2) * 100);

      color.v = value;

      redraw();
      drawSelected();
    }


  }

  function getOffset(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }
    return { left:curleft, top:curtop };
  }

  function onWheelCanvasMouseDrag(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    var offset = getOffset(wheelCanvas);

    var x = e.pageX - offset.left; // TODO account for offset;
    var y = e.pageY - offset.top; // TODO account for offset;

    // TODO if not within padding

    if (!pickColor(x, y)) {
      return;
    }

    redraw();
    drawSelected(x, y);

  }

  function pickColor(x, y) {

    x = x || pickerX;
    y = y || pickerY;
    var pixel = bufferCtx.getImageData(x, y, 1, 1).data;
    if (pixel[3] < 255) {
      return false;
    }
    color.r = pixel[0];
    color.g = pixel[1];
    color.b = pixel[2];

    color.v = value;
    return true;

  }

}