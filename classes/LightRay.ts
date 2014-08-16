class LightRay {
  dir: Vector;

  constructor(public p: Vector, d: Vector, public dist: number) {
    this.dir = d.normalize();
  }
} 