
// Parse input string given in textarea
function parseInput(textArea: JQuery): HallOfMirrors {
  var input: string = textArea.val();
  var lines = input.split("\n").map((s) => s.trim()).filter((s) => s.length > 0);

  var N = parseInt(lines[0]);
  if (N != lines.length - 2) {
    alert("Invalid input");
    return;
  }

  var mirrors: Mirror[] = [];
  for (var i = 1; i < N + 1; i++) {
    var line = lines[i].split(" ").map(parseFloat);
    mirrors.push(new Mirror(
      new Vector(line[0], line[1]), new Vector(line[2], line[3])
      ));
  }

  var line = lines[lines.length - 1].split(" ").map(parseFloat);
  var lightRay = new LightRay(
    new Vector(line[0], line[1]), new Vector(line[2], line[3]), line[4]);

  return new HallOfMirrors(mirrors, lightRay);
}

// Parse input string given in textarea
function parseInputGET(m: string, lr: string): HallOfMirrors {
  var ms = m.replace(/%20/g, " ").split(";");

  var mirrors: Mirror[] = [];
  for (var i = 0; i < ms.length; i++) {
    var line = ms[i].split(" ").map(parseFloat);
    mirrors.push(new Mirror(
      new Vector(line[0], line[1]), new Vector(line[2], line[3])
      ));
  }

  var line = lr.replace(/%20/g, " ").split(" ").map(parseFloat);
  var lightRay = new LightRay(
    new Vector(line[0], line[1]), new Vector(line[2], line[3]), line[4]);

  return new HallOfMirrors(mirrors, lightRay);
}


// Generate the GET search string of a hall of mirrors
function getSearchString(hall: HallOfMirrors): string {
  var ms: string[] = [];

  for (var i = 0; i < hall.mirrors.length; i++) {
    ms.push([
      hall.mirrors[i].p1.x, hall.mirrors[i].p1.y,
      hall.mirrors[i].p2.x, hall.mirrors[i].p2.y
    ].join(" "));
  }

  var lr = [
    hall.lightRay.p.x, hall.lightRay.dir.y,
    hall.lightRay.p.x, hall.lightRay.dir.y,
    hall.lightRay.dist].join(" ");
  return "?m=" + ms.join(";") + "&lr=" + lr;
}

