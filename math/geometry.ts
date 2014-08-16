interface Size {
  width: number;
  height: number;
}

class Vector {
  static origin = new Vector(0, 0);

  constructor(public x: number, public y: number) { }

  distanceTo(other: Vector): number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }

  normalize(): Vector {
    var length = this.length();
    return new Vector(this.x / length, this.y / length);
  }

  length(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector): number {
    return this.x * other.y - this.y * other.x;
  }

  scale(c: number): Vector {
    return new Vector(this.x * c, this.y * c);
  }

  plus(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  minus(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  round6(): Vector {
    this.x = round6(this.x);
    this.y = round6(this.y);
    return this;
  }

  toString(): string {
    return "[x: " + round3(this.x) + " , y: " + round3(this.y) + "]";
  }
}

function round3(x: number): number {
  return Math.round(x * 10e3) / 10e3;
}

function round6(x: number): number {
  return Math.round(x * 10e6) / 10e6;
}

function intersect(p: Vector, r: Vector, q: Vector, qe: Vector) {
  var s = qe.minus(q);
  var rcs = r.cross(s);
  if (rcs == 0) return { t: -1, u: -1 }

  var qmp = q.minus(p);
  return { t: round6(qmp.cross(s) / rcs), u: round6(qmp.cross(r) / rcs) }
}

function reflect(dir: Vector, p1: Vector, p2: Vector) {
  var normal = new Vector(p2.y - p1.y, p1.x - p2.x).normalize();
  return dir.minus(normal.scale(2 * dir.dot(normal))).round6();
}
