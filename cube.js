// hello, here we will try to make a 3D cube on 2D canvas
// how awesome is that

// constants
var PERS = 500, SCALE = 125;

// x, y, z
// center of the cube is in 0, 0, 0
var verts = [
  [-1, -1, -1], // 0
  [-1, -1,  1], // 1
  [ 1, -1,  1], // 2
  [ 1, -1, -1], // 3
  [-1,  1, -1], // 4
  [-1,  1,  1], // 5
  [ 1,  1,  1], // 6
  [ 1,  1, -1], // 7
].map(function(vert) {
  // scale coords to make cube to look something bigger than 2×2
  return vert.map(function(coord) {
    return coord * SCALE;
  })
})

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
].map(function(edge) {
  // compose array of verticies for cube edges, 2 verts per edge
  return edge.map(function(vI) {
    return verts[vI];
  });
});

// looking from outside of the cube, CCW
var sides = [
  [0, 1, 2, 3], // bottom
  [7, 6, 5, 4], // top
  [0, 4, 5, 1], // left
  [1, 5, 6, 2], // back
  [2, 6, 7, 3], // right
  [3, 7, 4, 0], // front
].map(function(side) {
  // compose array of cube sides, 4 verts per side
  return side.map(function(vI) {
    return verts[vI];
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
  var d = new Draw(canvas)

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

    for (var i = 0, l = sides.length; i < l; i++) {
      var side = sides[i];

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
