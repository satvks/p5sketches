var inc = 0.2;
var scl = 35;
var particles = [];
var flowField;
var field;
var xvec, yvec;
var time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i < 400; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  //background(255, 100);
  FlowField();

  for (var i = 0; i < 400; i++) {
    particles[i].show();
    particles[i].update();
    particles[i].edges();
    particles[i].follow(field);
  }
}

function FlowField() {
  xvec = floor((windowWidth + 50) / scl);
  yvec = floor((windowHeight + 50) / scl);
  field = new Array(xvec * yvec);

  var yoff = 0;
  for (var y = 0; y < yvec; y++) {
    var xoff = 0;
    for (var x = 0; x < xvec; x++) {
      var index = (x + y * xvec);
      var vecDir = noise(xoff, yoff, time) * 2 * TWO_PI;
      var dir = p5.Vector.fromAngle(vecDir);
      field[index] = dir;
      dir.setMag(5);
      xoff += inc;
      // stroke(100, 0, 200); // draw lines of color
      // push();
      // translate(x * scl, y * scl); // sets position
      // rotate(dir.heading());
      // line(0, 0, scl, 0);
      // pop();
    }
    yoff += inc;
    time += 0.004; // inc time quickens color change
  }
}

function Particle() {
  this.x = random(width);
  this.y = random(height);
  this.pos = createVector(this.x, this.y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.r = 2.0;
  this.maxSpeed = 5;

  this.update = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
    this.vel.limit(this.maxSpeed);
  };

  this.applyForce = function (force) {
    this.acc.add(force);
  };

  this.show = function () {
    //update color to blend better
    fill((time + 130) % 250, (time + 100) % 250, time % 250, 100);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 4, 4);
  };

  this.edges = function () {
    if (this.pos.y < -this.r) this.pos.y = height + this.r;
    if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
  };

  this.follow = function (vectors) {
    // apply vectors to force
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = (x + y * xvec);
    var force = vectors[index];
    this.applyForce(force);
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
