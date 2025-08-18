import { configs } from "./configs";

export default class Point {
  private _x: number;
  private _y: number;
  style: string;

  get x() {
    return this._x;
  }
  set x(value: number) {
    this._x = Math.floor(value);
  }

  get y() {
    return this._y;
  }
  set y(value: number) {
    this._y = Math.floor(value);
  }

  constructor(x: number, y: number, style: string = 'black') {
    this._x = Math.floor(x);
    this._y = Math.floor(y);
    this.style = style;
  }

  clone(): Point {
    return new Point(
      this._x,
      this._y,
      this.style
    );
  }

  difference(other: Point): Point {
    return new Point(
      this.x - other.x,
      this.y - other.y,
      this.style
    );
  }

  equal(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  static random(style: string = 'black'): Point {
    return new Point(
      Math.random() * (configs.wStep - 1),
      Math.random() * (configs.hStep - 1),
      style,
    )
  }
}