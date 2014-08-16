
function drawCanvasHoM(hall: HallOfMirrors): HTMLCanvasElement {
  $("#drawing").append($("<canvas>").attr("id", "canvas"));
  var canvas = <HTMLCanvasElement> document.getElementById("canvas");
 
  var ctx = canvas.getContext("2d");

  var ratio = 800 / Math.max(hall.size.width, hall.size.height);
  var scale = (x) => x * ratio;
  canvas.width = scale(hall.size.width)+10;
  canvas.height = scale(hall.size.height)+10;

  ctx.translate(-scale(hall.start.x)+5, -scale(hall.start.y)+5);

  hall.mirrors.forEach((m) => {
    ctx.beginPath();
    ctx.moveTo(scale(m.p1.x), scale(m.p1.y));
    ctx.lineTo(scale(m.p2.x), scale(m.p2.y));
    ctx.lineWidth = 1;

    ctx.strokeStyle = "blue";
    ctx.stroke();
  });

  // Draw ray
  ctx.beginPath();
  ctx.moveTo(scale(hall.ray[0].x), scale(hall.ray[0].y));

  hall.ray.slice(1).forEach((rp) => {
    ctx.lineTo(scale(rp.x), scale(rp.y));
  });
  ctx.strokeStyle = "red";
  ctx.stroke();


  // Draw starting point
  ctx.fillStyle = "red";
  ctx.fillRect(scale(hall.ray[0].x) - 2, scale(hall.ray[0].y) - 2, 4, 4);
  ctx.stroke();

  // Draw end-point
  ctx.fillStyle = "green";
  ctx.fillRect(scale(hall.endPoint().x) - 2, scale(hall.endPoint().y) - 2, 4, 4);
  ctx.stroke();

  return canvas;
}