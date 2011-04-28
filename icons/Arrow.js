function ArrowHead(gee, x, y, w, h) {

  var that = this;
  var g = gee.ctx;

  // Public variables ie. Target Variables
  this.x = x;
  this.y = y;
  if(this.x == undefined || this.x == NaN || this.x == null) {
    this.x = gee.width / 2.0;
  }
  if(this.y == undefined || this.y == NaN || this.y == null) {
    this.y = gee.height / 2.0;
  }

  this.angle = 0.0; // in radians please
  this.width = w || 44;
  this.height = h || 74;
  this.indent = 0;

  this.stroke = false;
  this.fill = true;

  // Internal vars ie. Actual Vars
  var angle = this.angle;

  this.update = function() {

    // ease to positions
    // figure out rotation
    angle = this.radians(this.angle);

    return this;  // Makes it chainable
  };
  
  this.render = function() {
    
    var yOffset = this.height / 2.0;
    var xOffset = this.width / 2.0;
    
    g.save();
    g.translate(this.x, this.y);
    g.rotate(angle);
    g.beginPath();
    g.moveTo(0, this.indent - yOffset); // Zero Point (will help for the back)
    g.lineTo(xOffset, -yOffset);        // First Point
    g.lineTo(0, yOffset);               // Second Point
    g.lineTo(-xOffset, -yOffset);       // Third Point
    g.closePath();
    if(this.stroke) g.stroke();
    if(this.fill) g.fill();
    g.restore();
    
    return this;  // Makes it chainable
  };
}
ArrowHead.prototype.ease = function(cur, tar, inc) {
  var dif = tar - cur;
  if(Math.abs(dif) <= (inc / 100.0)) {
    cur = tar;
  } else {
    cur += dif * inc;
  }
  return cur;
};
ArrowHead.prototype.radians = function(n) {
  return (n / 360.0) * Math.PI * 2;
};

// Is made up of 3 ArrowHeads
function ArrowTail(gee, x, y, w, h, l) {

  var that = this;
  var g = gee.ctx;

  // Public vars
  this.x = x;
  this.y = y;
  if(this.x == undefined || this.x == NaN || this.x == null) {
    this.x = gee.width / 2.0;
  }
  if(this.y == undefined || this.y == NaN || this.y == null) {
    this.y = gee.height / 2.0;
  }

  this.width = w;
  this.height = h;
  if(this.width == undefined || this.width == NaN || this.width == null) {
    this.width = 42;
  }
  if(this.height == undefined || this.height == NaN || this.height == null) {
    this.height = 105;
  }
  this.angle = 0;

  this.size = l || 3;
  this.indent = 13;
  this.spacing = 17;

  // Internal vars
  var arrowHeads = [];
  var angle = this.angle;

  // handle updating angle
  this.update = function() {
    
    angle = this.radians(this.angle);
    return this;
  };

  this.render = function() {

    g.save();
    g.translate(this.x, this.y);
    g.rotate(angle);
    for(var i = 0; i < arrowHeads.length; i++) {
      var arrowHead = arrowHeads[i];
          arrowHead.update().render();
    }
    g.restore();
    return this;
  };

  this.resize = function() {
    if(arrowHeads.length < this.size) {
      for(var i = arrowHeads.length; i < this.size; i++) {
        var yOffset = Math.floor(i - this.size / 2.0) * this.spacing;
        arrowHeads.push(new ArrowHead(gee, 0, yOffset));
        var arrowHead = arrowHeads[i];
            arrowHead.indent = this.indent;
      }
    }
    return this;
  };

  this.scale = function(s) {
    
    this.width *= s;
    this.height *= s;
    this.spacing *= s;
    this.indent *= s;
    
    for(var i = 0; i < arrowHeads.length; i++) {
      var arrowHead = arrowHeads[i];
          arrowHead.width *= s;
          arrowHead.height *= s;
          var yOffset = Math.floor(i - arrowHeads.length / 2.0) * this.spacing;
          arrowHead.y = yOffset;
          arrowHead.indent = this.indent;
    }
  };
  this.resize();
}
ArrowTail.prototype.radians = function(n) {
  return (n / 360.0) * Math.PI * 2;
};

// Contains 1 ArrowHead, 1 ArrowTail, + 1 body (a line segment)
function Arrow(gee, x, y, w, h) {

  var that = this;
  var g = gee.ctx; // Pulls an error now

  // Public vars
  this.x = x;
  this.y = y;
  if(this.x == undefined || this.x == NaN || this.x == null) {
    this.x = gee.width / 2.0;
  }
  if(this.y == undefined || this.y == NaN || this.y == null) {
    this.y = gee.height / 2.0;
  }

  this.width = w;
  this.height = h;
  if(this.width == undefined || this.width == NaN || this.width == null) {
    this.width = 14;
  }
  if(this.height == undefined || this.height == NaN || this.height == null) {
    this.height = 280;
  }
  
  this.angle = 0.0;
  this.scaleFactor = 1.0;
  this.increment = 0.125;

  // Private vars
  var bow = new ArrowHead(gee, 0, this.height / 2.0);
  var stern = new ArrowTail(gee, 0, -this.height / 2.0);
  var angle = this.angle;
  var ratio = 14.0 / 280.0;
  var x = this.x, y = this.y;

  this.update = function() {
    angle = this.radians(this.angle);
    x = this.ease(x, this.x, this.increment);
    y = this.ease(y, this.y, this.increment);
    stern.update();
    bow.update();
    return this;
  };
  
  this.render = function() {
    g.save();
    g.translate(x, y);
    g.rotate(angle);
    stern.render();
    g.beginPath();
    g.moveTo(this.width / 2.0, this.height / 2.0);
    g.lineTo(this.width / 2.0, -this.height / 2.0);
    g.lineTo(-this.width / 2.0, -this.height / 2.0);
    g.lineTo(-this.width / 2.0, this.height / 2.0);
    g.closePath();
    g.fill();
    bow.render();
    g.restore();
    
    return this;
  };

  this.scale = function(n) {
    
    if(n != undefined && n != null && n != NaN) {
      this.scaleFactor = n;
    }
    
    this.width *= this.scaleFactor;
    this.height *= this.scaleFactor;

    bow.width *= this.scaleFactor;
    bow.height *= this.scaleFactor;
    bow.y = this.height / 2.0;

    stern.y = -this.height / 2.0;
    stern.scale(this.scaleFactor);
  };

}
Arrow.prototype.radians = function(n) {
  return (n / 360.0) * Math.PI * 2;
};
Arrow.prototype.ease = function(cur, tar, inc) {
  var dif = tar - cur;
  if(Math.abs(dif) <= (inc / 100.0)) {
    cur = tar;
  } else {
    cur += dif * inc;
  }
  return cur;
};


function ArcArrow(gee, x, y, w, h) {
  
  var that = this;
  var g = gee.ctx;

  // Public vars
  this.x = x;
  this.y = y;
  if(this.x == undefined || this.x == NaN || this.x == null) {
    this.x = gee.width / 2.0;
  }
  if(this.y == undefined || this.y == NaN || this.y == null) {
    this.y = gee.height / 2.0;
  }

  this.width = w;
  this.height = h;
  if(this.width == undefined || this.width == NaN || this.width == null) {
    this.width = 14;
  }
  if(this.height == undefined || this.height == NaN || this.height == null) {
    this.height = 280;
  }

  this.angle = 0;
  this.scaleFactor = 1.0;
  this.increment = 0.125;

  this.clockwise = true;
  this.startAngle = 0;  // Angle of head
  this.endAngle = 180;  // Angle of tail

  // Private vars
  var bow = new ArrowHead(gee);
  var stern = new ArrowTail(gee);
  var angle = this.angle;
  var startAngle = this.startAngle;
  var endAngle = this.endAngle;

  this.update = function() {

    angle = this.ease(angle, this.radians(this.angle), this.increment);
    startAngle = this.radians(this.startAngle);
    endAngle = this.radians(this.endAngle);

    // Handle position of end points
    bow.angle = this.endAngle + 180;
    theta = endAngle;
    bow.x = Math.cos(theta) * this.height / 2.0;
    bow.y = Math.sin(theta) * this.height / 2.0;

    stern.angle = this.startAngle + 180;
    theta = startAngle;
    stern.x = Math.cos(theta) * this.height / 2.0;
    stern.y = Math.sin(theta) * this.height / 2.0;

    stern.update();
    bow.update();

    return this;
  };
  
  this.render = function() {
    g.save();
    g.translate(this.x, this.y);
    g.rotate(angle);
    stern.render();
    g.lineWidth = this.width;
    g.strokeStyle = g.fillStyle;
    g.beginPath();
    g.arc(0, 0, this.height / 2.0, startAngle, endAngle, this.clockwise);
    g.stroke();
    bow.render();
    g.restore();

    return this;
  };

  this.scale = function(n) {
    
    if(n != undefined && n != null && n != NaN) {
      this.scaleFactor = n;
    }
    
    this.width *= this.scaleFactor;
    this.height *= this.scaleFactor;

    bow.width *= this.scaleFactor;
    bow.height *= this.scaleFactor;
    bow.y = this.height / 2.0;

    stern.y = -this.height / 2.0;
    stern.scale(this.scaleFactor);
  };
  
}
ArcArrow.prototype.radians = function(n) {
  return (n / 360.0) * Math.PI * 2;
};
ArcArrow.prototype.ease = function(cur, tar, inc) {
  var dif = tar - cur;
  if(Math.abs(dif) <= (inc / 100.0)) {
    cur = tar;
  } else {
    cur += dif * inc;
  }
  return cur;
};
