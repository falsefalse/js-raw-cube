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

var counter = 0, rad, persp = 500;

document.addEventListener('DOMContentLoaded', function() {
  var d = new Draw(document.getElementById('canvas'))
  
  verts = scale(verts, 100);
  
  d.c.translate(320, 240);

  function draw() {
    
    // rotation speeds
    var xA = rad * 1, yA = rad * 1, zA = rad * 1;
    var rM = rotation_matrix(xA, yA, zA);

    for (var i = 0, l = edges.length; i < l; i++) {
      var edge = edges[i];
      var from = MxV_fast(rM, verts[edge[0]]);
      var to = MxV_fast(rM, verts[edge[1]]);

      from[0] /= 1 + from[2]/persp;
      from[1] /= 1 + from[2]/persp;
      to[0]   /= 1 + to[2]/persp;
      to[1]   /= 1 + to[2]/persp;

      d.line(from, to);
    }

    rad = counter++ / 50;
  }

  (function animloop(){
    d.c.clearRect(-320, -240, d.w, d.h);
    draw();
    requestAnimFrame(animloop);
  })();
}, false)