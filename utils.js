// some useful shit for drawing 3D cube on 2D canvas

var rnd = function(bound) {
  return Math.ceil(Math.random() * bound)
};

function scale(verts, factor) {
  return verts.map(function(vert) {
    return vert.map(function(coord){
      return coord * factor;
    })
  })
}

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

var Draw = function(canvas) {
  this.c = canvas.getContext('2d');

  // draw line
  this.line = function (from, to) {
    this.c.beginPath();
    this.c.moveTo(from[0], from[1]);
    this.c.lineTo(to[0], to[1]);
    this.c.stroke();
  }

  // dimensions
  this.w = canvas.width;
  this.h = canvas.height;

  // set shit up
  this.c.lineWidth = 1;
  this.c.strokeStyle = "#000";
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