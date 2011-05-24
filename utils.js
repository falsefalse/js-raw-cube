// some useful shit for drawing 3D cube on 2D canvas

var rnd = function(bound) {
  return Math.ceil(Math.random() * bound)
};


function MxV_fast (matrix, vector) {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2] + matrix[0][3],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2] + matrix[1][3],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2] + matrix[2][3],
  ]
}

function rotation_matrix (x, y, z) {
  var sin = Math.sin, cos = Math.cos;
  return [
    [
      cos(y) * cos(z),
      -1 * cos(x) * sin(z) + sin(x) * sin(y) * cos(z),
      sin(x) * sin(z) + cos(x) * sin(y) * cos(z),
      0
    ],
    [
      cos(y) * sin(z),
      cos(x) * cos(z) + sin(x) * sin(y) * sin(z),
      -1 * sin(x) * cos(z) + cos(x) * sin(y) * sin(z),
      0
    ],
    [
      -1 * sin(y),
      sin(x) * cos(y),
      cos(x) * cos(y),
      0
    ],
    [0, 0, 0, 1]
  ]
}

function perspective (vert, persp) {
  vert[0] /= 1 + vert[2] / persp;
  vert[1] /= 1 + vert[2] / persp;

  return vert;
}

function rgb(r, g, b) {
  var args = Array.prototype.map.call(arguments, function(color) {
    return Math.ceil(color);
  })
  return 'rgb(' + args.join(', ') +  ')';
}

function is_facing(side) {
  var p0 = side[0];
  var p1 = side[1];
  var p2 = side[2];

  var crossproduct_z = ( (p0[0] - p1[0]) * (p1[1] - p2[1]) ) - ( (p1[0] - p2[0]) * (p0[1] - p1[1]));

  return crossproduct_z > 0;
}

var Draw = function(canvas) {
  this.c = canvas.getContext('2d');

  // draw line
  this.line = function (from, to) {
    this.c.beginPath();
    this.c.moveTo(from[0], from[1]);
    this.c.lineTo(to[0], to[1]);
    this.c.stroke();
  }

  // draw edge
  this.edge = function(points, style) {
    this.c.fillStyle = style || this.c.fillStyle;
    this.c.strokeStyle = style || this.c.strokeStyle;

    this.c.beginPath();
    this.c.moveTo(points[0][0], points[0][1]);
    for (var i = 0, l = points.length; i < l; i++) {
      var next_i = (i + 1 === l) ? 0 : i + 1;
      this.c.lineTo( points[next_i][0], points[next_i][1] );
    }
    this.c.fill();
  }

  // dimensions
  this.w = canvas.width;
  this.h = canvas.height;

  // set shit up
  this.c.lineWidth = 1;
  this.c.strokeStyle = "#000";
  this.c.fillStyle = "#000";
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();