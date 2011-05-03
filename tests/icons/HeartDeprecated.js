// Dependent on swell.js
// uses a heart svg
function Heart(gee, src, x, y) {

  // Heart can have drips or boils

  var that = this;
  var g = gee.ctx;

  // Public variables
  this.x = x;
  this.y = y;
  if(this.x == undefined || this.x == null || this.x || this == NaN) {
    this.x = gee.width / 2.0;
  }
  if(this.y == undefined || this.y == null || this.y || this == NaN) {
    this.y = gee.height / 2.0;
  }
  
  this.color = "#f15d22";
  this.showDrips = false;
  this.showBoils = true;
  this.amount = Math.floor(Math.random() * 15) + 10;

  // Private vars
  var svg;
  var ready = false;
  var boils = [];
  var drips = [];
  var animateIn = true;

  this.update = function() {
    for(var i = 0; i < boils.length; i++) {
      var boil = boils[i];
          boil.update();
    }
    for(var i = 0; i < drips.length; i++) {
      var drip = drips[i];
          drip.update();
    }
    return this;
  }

  this.render = function() {
    if(ready) {
      g.save();
      g.translate(this.x, this.y);
      g.save();
      g.translate(-this.width / 2.0, -this.height / 2.0)
      svg.draw(g);
      g.restore();
      if(this.showBoils) {
        for(var i = 0; i < boils.length; i++) {
          var boil = boils[i];
              g.fillStyle = this.color;
              boil.render();
        }
      }
      if(this.showDrips) {
        for(var i = 0; i < drips.length; i++) {
          var drip = drips[i];
              g.fillStyle = this.color;
              drip.render();
        }
      }
      
      g.restore();
    }
  };
  
  this.toggle = function() {
    
    if(animateIn) {
      for(var i = 0; i < boils.length; i++) {
        
        xpos = (this.width * .5) - (Math.random() * this.width);
        ypos = (this.height * .5) - (Math.random() * this.height);
        width = Math.random() * 40 + 10;
        
        var boil = boils[i];
            boil.x = xpos;
            boil.y = ypos;
            boil.radius = width;
            boil.reflective = false;
            boil.increment = Math.random() * .5 + .1;
      }
      for(var i = 0; i < drips.length; i++) {
        xpos = (this.width * .4) - (Math.random() * this.width * .8);
        ypos = -(this.height * .125) + this.height * Math.sin(Math.abs((xpos / this.width * .4))) / 4.0;
        width = Math.random() * 10 + 10;
        height = Math.random() * 250;
        
        var drip = drips[i];
            drip.x = xpos;
            drip.y = ypos;
            drip.width = width;
            drip.height = height;
            drip.increment = Math.random() * .025;
      }
    } else {
      for(var i = 0; i < boils.length; i++) {
        var boil = boils[i];
            boil.x = 0;
            boil.y = 0;
            boil.radius = 0;
            boil.increment /= 2.5;
      }
      for(var i = 0; i < drips.length; i++) {
        var drip = drips[i];
            drip.increment = Math.random() * .05 + .05;
            drip.height = 0;
      }
    }
    animateIn = !animateIn;
  };

  this.setup = function() {

    for(var i = boils.length - 1; i > 0; i--) {
      boils.pop();
      drips.pop();
    }

    // Handle boils and drips
    for(var i = 0; i < that.amount; i++) {
      boils.push(new Boil(gee, 0, 0, 0));
      drips.push(new Drip(gee, 0, 0, 0, 0));
    }
    // that.toggle();
  };

  var success = function(s, location) {
    svg = s;
    that.source = location;
    that.width = svg.width;
    that.height = svg.height;
    ready = true;
    
    that.setup();
  }
  var fail = function() {
    // doh!
  }

  loadSVG(src, success, fail);
}

function Boil(gee, x, y, r) {
  
  var that = this;
  var g = gee.ctx;

  // Public vars
  this.x = x;
  this.y = y;
  if(this.x == undefined || this.x == null || this.x == NaN) {
    this.x = gee.width / 2.0;
  }
  if(this.y == undefined || this.y == null || this.y == NaN) {
    this.y = gee.height / 2.0;
  }

  this.reflective = true;
  this.increment = 0.125; // For animating
  this.radius = r;
  if(this.radius == undefined || this.radius == null || this.radius == NaN) {
    this.radius = gee.width / 10.0;
  }

  // Private variables
  var radius = 0;
  var x = 0, y = 0;

  this.update = function() {

    radius = this.ease(radius, this.radius, this.increment);
    x = this.ease(x, this.x, this.increment);
    y = this.ease(y, this.y, this.increment);

    return this;
  };

  this.render = function() {

    if(radius >= 0) {
      g.beginPath();
      g.arc(x, y, radius, 0, Math.PI * 2, true);
      g.closePath();
      g.fill();

      if(this.reflective) {
        g.fillStyle = "#fff";
        var rad = radius / 2.5;
        g.beginPath();
        g.arc(x + rad, y - rad, rad / 2.0, 0, Math.PI * 2, true);
        g.closePath();
        g.fill();
      }
    }
  };
}
Boil.prototype.ease = function(cur, tar, inc) {
  var dif = tar - cur;
  if(Math.abs(dif) <= (inc / 100.0)) {
    cur = tar;
  } else {
    cur += dif * inc;
  }
  return cur;
};

function Drip(gee, x, y, w, h) {
  
  var that = this;
  var g = gee.ctx;

  // Public variables
  this.x = x;
  this.y = y;
  if(this.x == undefined || this.x == null || this.x == NaN) {
    this.x = gee.width / 2.0;
  }
  if(this.y == undefined || this.y == null || this.y == NaN) {
    this.y = gee.height / 2.0;
  }

  this.reflective = true;
  this.increment = 0.125; // For animating
  this.fill = true;
  this.stroke = false;

  this.width = w;
  this.height = h;
  if(this.width == null || this.width == undefined || this.width == NaN) {
    this.width = 20;
  }
  if(this.height == null || this.height == undefined || this.height == NaN) {
    this.height = gee.width / 4.0;
  }

  // Private variables
  var height = 0;

  this.update = function() {
    
    height = this.ease(height, this.height, this.increment);
    return this;
  };

  this.render = function() {

    var xOffset = this.width / 2.0;
    // length of drip
    g.save();
    g.translate(this.x, this.y);
    g.beginPath();
    g.moveTo(xOffset, 0);
    g.lineTo(xOffset, height);
    g.lineTo(-xOffset, height);
    g.lineTo(-xOffset, 0);
    g.closePath();
    if(this.fill) g.fill();
    if(this.stroke) g.stroke();
    
    // semi-circle
    g.beginPath();
    g.arc(0, height - 1, this.width / 2.0, Math.PI, Math.PI * 2, true);
    g.closePath();
    if(this.fill) g.fill();
    if(this.stroke) g.stroke();
    g.restore();
    
    if(this.reflective) {
      // TODO
    }
  };

}
Drip.prototype.ease = function(cur, tar, inc) {
  var dif = tar - cur;
  if(Math.abs(dif) <= (inc / 100.0)) {
    cur = tar;
  } else {
    cur += dif * inc;
  }
  return cur;
};