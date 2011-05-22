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

  var is_stopped = false,
      animation_angles = [rnd(10), rnd(5), rnd(8)];
  function update_animation_angles(dx, dy, dz) {
    dx && (animation_angles[0] += dx);
    dy && (animation_angles[1] += dy);
    dz && (animation_angles[2] += dz);
  }

  function draw(xA, yA, zA) {
    xA *= Math.PI / 300;
    yA *= Math.PI / 300;
    zA *= Math.PI / 300;
    // rotation speeds
    var rM = rotation_matrix(xA, yA, zA);

    for (var i = 0, l = edges.length; i < l; i++) {
      var edge = edges[i];
      // apply rotation
      var from = MxV_fast(rM, verts[edge[0]]);
      var to = MxV_fast(rM, verts[edge[1]]);

      // apply perspective
      from = perspective(from, PERS);
      to = perspective(to, PERS);

      // draw edge
      d.line(from, to);
    }
  }
  function clear() {
    d.c.clearRect(-320, -240, d.w, d.h);
  }

  (function animloop(){
    if (!is_stopped) {
      clear();
      update_animation_angles(4, 6, 2);

      draw.apply(this, animation_angles);
    }
    requestAnimFrame(animloop);
  })();

  var prev_coords;
  canvas.addEventListener('mousedown', function(event) {
    is_stopped = true;
    prev_coords = [event.clientX, event.clientY];

  }, false);
  canvas.addEventListener('mouseup', function(event) {
    is_stopped = false;
  }, false);
  canvas.addEventListener('mousemove', function(event) {
    if (is_stopped) {
      var coords = [event.clientX, event.clientY];
      var delta = [prev_coords[0] - coords[0], prev_coords[1] - coords[1]];

      clear();
      update_animation_angles(0.5 * delta[0], 0.5 * delta[1])
      draw.apply(this, animation_angles);
      prev_coords = coords;
    }
  }, false);

}, false)
