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

// constants
var PERS = 500, SCALE = 125;


document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var d = new Draw(canvas)

  verts = scale(verts, SCALE);

  d.c.translate(d.w / 2, d.h / 2);

  var is_stopped = false,
      // initial cube rotation, random is fun
      animation_angles = [rnd(10), rnd(5), rnd(8)];

  function update_animation_angles(dx, dy, dz) {
    dx && (animation_angles[0] += dx);
    dy && (animation_angles[1] += dy);
    dz && (animation_angles[2] += dz);
  }

  function draw(dx, dy, dz) {
    dx *= Math.PI / 400;
    dy *= Math.PI / 400;
    dz *= Math.PI / 400;
    // rotation speeds
    var rM = rotation_matrix(dx, dy, dz);

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
    // since we have been translated to 320, 240 we should start our clearing
    // from the actual 0, 0
    d.c.clearRect(d.w / -2, d.h / -2, d.w, d.h);
  }

  (function animloop(){
    if (!is_stopped) {
      clear();
      // these control rotation speed per axis
      update_animation_angles(2, 3, 1);

      draw.apply(this, animation_angles);
    }
    requestAnimFrame(animloop, canvas);
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
      update_animation_angles(0.5 * delta[0], 0.5 * delta[1]);
      draw.apply(this, animation_angles);
      prev_coords = coords;
    }
  }, false);
}, false);
