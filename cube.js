// hello, here we will try to make a 3D cube on 2D canvas
// how awesome is that

// constants
var PERS = 500, SCALE = 125;

var cube = new Model(
  // x, y, z
  // center of the cube is in 0, 0, 0
  [
    [-1, -1, -1], // 0
    [-1, -1,  1], // 1
    [ 1, -1,  1], // 2
    [ 1, -1, -1], // 3
    [-1,  1, -1], // 4
    [-1,  1,  1], // 5
    [ 1,  1,  1], // 6
    [ 1,  1, -1], // 7
  ],
  // looking from outside of the cube, CCW
  // order of points are important to determine sides that shouldn't be rendered
  [
    [0, 1, 2, 3], // bottom
    [7, 6, 5, 4], // top
    [0, 4, 5, 1], // left
    [1, 5, 6, 2], // back
    [2, 6, 7, 3], // right
    [3, 7, 4, 0], // front
  ],
  SCALE
);

var pyramid = new Model(
  [
    [-1, -1, -1],
    [-1, -1,  1],
    [ 1, -1,  1],
    [ 1, -1, -1],
    [ 0,  1.25,  0],
  ],
  // looking from the inside, CW
  [
    [0, 1, 2, 3], // base
    [3, 4, 0],    // front
    [1, 4, 2],    // back
    [0, 4, 1],    // left
    [2, 4, 3],    // right
  ],
  SCALE
)

document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var d = new Draw(canvas)

  d.c.translate(d.w / 2, d.h / 2);

  var is_stopped = false,
      // initial cube rotation, random is fun
      animation_angles = [rnd(10), rnd(5), rnd(8)];

  function update_animation_angles (dx, dy, dz) {
    dx && (animation_angles[0] += dx);
    dy && (animation_angles[1] += dy);
    dz && (animation_angles[2] += dz);
  }

  var model = pyramid;

  function draw (model, animation_angles) {
    // rotation speeds
    var rM = rotation_matrix.apply(this, animation_angles.map(function(angle) {
      return angle * Math.PI / 400;
    }));

    for (var i = 0, l = model.sides.length; i < l; i++) {
      var side = model.sides[i];

      var transformed = side.map(function(point) {
        // apply rotation and perspective
        return perspective( MxV_fast(rM, point), PERS );
      });
      // perspective fucks up the X and Y, so calculate normales after it
      var do_show = is_facing(transformed);

      if (do_show) {
        var color = rgb(255 - (i * 42.5), 128 + (i / 3 * 42.5), 128 + (i / 2 * 42.5));
        d.edge(transformed, color);
      }

    }

  }
  function clear() {
    // since we have been translated to 320, 240 we should start our clearing
    // from the actual 0, 0
    d.c.clearRect(d.w / -2, d.h / -2, d.w, d.h);
  }

  (function animloop() {
    if (!is_stopped) {
      clear();
      // these control rotation speed per axis
      update_animation_angles(2, 3, 1);

      draw(model, animation_angles);
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
      draw(model, animation_angles);
      prev_coords = coords;
    }
  }, false);

  canvas.addEventListener('click', function(event) {
    if (!event.metaKey) return;
    if (model === cube) {
      model = pyramid;
    } else {
      model = cube;
    }
  }, false);

}, false);
