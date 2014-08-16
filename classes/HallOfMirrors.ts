class HallOfMirrors {
  start: Vector;
  size: Size;
  ray: Vector[];

  constructor(public mirrors: Mirror[], public lightRay: LightRay) {
    this.calcSize();
    this.traceRay();
  }

  private traceRayRec(distLeft: number, p: Vector, dir: Vector) {
    this.ray.push(p);
    if (distLeft <= 0) return;

    var nextHit = this.mirrors.
      map((m) => { return { is: intersect(p, dir, m.p1, m.p2), m: m }; }).
      filter((x) => x.is.u >= 0 && x.is.u <= 1 && x.is.t > 0).
      sort((a, b) => a.is.t - b.is.t)[0];

    if (!nextHit) {
      this.traceRayRec(0, p.plus(dir.scale(distLeft)), null);
      return;
    }

    var d = Math.min(nextHit.is.t, distLeft);
    this.traceRayRec(
      distLeft - d,
      p.plus(dir.scale(d)),
      reflect(dir, nextHit.m.p1, nextHit.m.p2)
    );
  }

  private traceRay(): void {
    this.ray = [];
    this.traceRayRec(this.lightRay.dist, this.lightRay.p, this.lightRay.dir);
  }

  endPoint(): Vector {
    return this.ray[this.ray.length - 1];
  }

  private calcSize() {
    var minX: number, maxX: number, minY: number, maxY: number;

    minX = this.lightRay.p.x;
    maxX = this.lightRay.p.x;
    minY = this.lightRay.p.y;
    maxY = this.lightRay.p.y;

    for (var i = 0; i < this.mirrors.length; i++) {
      if (this.mirrors[i].p1.x < minX) minX = this.mirrors[i].p1.x;
      if (this.mirrors[i].p2.x < minX) minX = this.mirrors[i].p2.x;

      if (this.mirrors[i].p1.x > maxX) maxX = this.mirrors[i].p1.x;
      if (this.mirrors[i].p2.x > maxX) maxX = this.mirrors[i].p2.x;

      if (this.mirrors[i].p1.y < minY) minY = this.mirrors[i].p1.y;
      if (this.mirrors[i].p2.y < minY) minY = this.mirrors[i].p2.y;

      if (this.mirrors[i].p1.y > maxY) maxY = this.mirrors[i].p1.y;
      if (this.mirrors[i].p2.y > maxY) maxY = this.mirrors[i].p2.y;
    }

    this.size = { width: maxX - minX, height: maxY - minY }
    this.start = new Vector(minX, minY);
  }
}