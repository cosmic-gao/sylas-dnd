export class Point<T = number> {
  public readonly x: T;
  public readonly y: T;

  public constructor(x: T, y: T) {
    this.x = x;
    this.y = y;
  }
}


export class AxesPoint<T = number> extends Point<T> {

}