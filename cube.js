// hello, here we will try to make a 3D cube on 2D canvas
// how awesome is that

// x, y, z
// center of the cube is in 0, 0, 0
var verts = [
  [-1, -1,  1],
  [-1, -1, -1],
  [ 1, -1, -1],
  [ 1, -1,  1],
  [-1,  1,  1],
  [-1,  1, -1],
  [ 1,  1, -1],
  [ 1,  1,  1],
]

var edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
]

var counter = 0, rad, P = 500;

document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var d = new Draw(canvas)
  
  verts = scale(verts, 100);
  
  d.c.translate(320, 240);

  var is_stopped = false;

  function draw() {
    // rotation speeds
    var xA = rad * 0.8, yA = rad * 0.5, zA = rad * 1.8;
    var rM = rotation_matrix(xA, yA, zA);

    for (var i = 0, l = edges.length; i < l; i++) {
      var edge = edges[i];
      var from = MxV_fast(rM, verts[edge[0]]);
      var to = MxV_fast(rM, verts[edge[1]]);

      from = perspective(from, P);
      to = perspective(to, P);

      d.line(from, to);
    }

    rad = counter++ / 50;
  }
  function clear() {
    d.c.clearRect(-320, -240, d.w, d.h);
  }

  (function animloop(){
    if (!is_stopped) {
      clear();
      draw();
    }
    requestAnimFrame(animloop);
  })();

  canvas.addEventListener('mousedown', function(event) {
    is_stopped = true;
  }, false);
  canvas.addEventListener('mouseup', function(event) {
    is_stopped = false;
  }, false);
  canvas.addEventListener('mousemove', function(event) {
  }, false);

}, false)
