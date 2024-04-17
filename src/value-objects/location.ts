// Written by Ingo Schmidt, in 2024.

export type Point = {
  lat: number
  lon: number
}

export class Location {
  public constructor(point: Point) {
    this._point = this.normalizePoint(point)
  }

  public toString(): string {
    return `${this._point.lat.toFixed(3)},${this._point.lon.toFixed(3)}`
  }

  public get point(): Point {
    return { ...this._point }
  }

  private normalizePoint({ lat, lon }: Point): Point {
    const quadrant = Math.floor(Math.abs(lat) / 90) % 4
    const pole = lat > 0 ? 90 : -90
    const offset = lat % 90
    switch (quadrant) {
      case 0:
        lat = offset
        break
      case 1:
        lat = pole - offset
        lon += 180
        break
      case 2:
        lat = -offset
        lon += 180
        break
      case 3:
        lat = -pole + offset
        break
    }
    if (lon > 180 || lon < -180) {
      lon -= Math.floor((lon + 180) / 360) * 360
    }
    return { lat, lon }
  }

  private readonly _point: Point
}

// EOF
