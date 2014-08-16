/// <reference path="classes/hallofmirrors.ts" />
/// <reference path="classes/lightray.ts" />
/// <reference path="classes/mirror.ts" />
var EXTENT = 600;
var WIDTH = EXTENT;
var HEIGHT = EXTENT;
var N = 150;
var SCALE = 0.15;


function randomHoM(): HallOfMirrors {
  var mirrors: Mirror[] = [];

  var sign = () => ((Math.random() > 0.5) ? 1 : -1);

  for (var i = 0; i < N; i++) {
    var x = Math.random() * WIDTH, y = Math.random() * HEIGHT;
    var dx = Math.random() * WIDTH * SCALE * sign();
    var dy = Math.random() * HEIGHT * SCALE * sign();
    mirrors.push(
      new Mirror(new Vector(x, y), new Vector(x + dx, y + dy))
    );
  }

  var x = Math.random() * WIDTH / 2 + WIDTH / 4, y = Math.random() * HEIGHT / 2 + HEIGHT / 4;
  var vx = Math.random() * WIDTH * sign(), vy = Math.random() * HEIGHT * sign();
  var lightRay = new LightRay(new Vector(x, y), new Vector(vx, vy), 3*WIDTH);

  return new HallOfMirrors(mirrors, lightRay); 
}