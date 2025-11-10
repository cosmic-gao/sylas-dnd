import { type RectBounds } from "./ElementRect"

export interface PositionInput {
  x: number;
  y: number;
  sx?: number;
  sy?: number;
}

export class Position {
  private _rect: RectBounds

  public constructor(rect: RectBounds) {
    this._rect = rect;
  }

  public move(x: number, y: number, sx: number, sy: number) {
    
  }

  public rect() { }
}

export class DraggablePosition {
  private _absolute: Position;
  private _viewport: Position;

  public constructor(rect: RectBounds) {
    this._absolute = new Position(rect);
    this._viewport = new Position(rect);
  }

  public move(input: PositionInput): void {
    const { x, y, sx = 0, sy = 0 } = input

    this._absolute.move(x, y, 0, 0)
    this._viewport.move(x, y, sx, sy)
  }

  public position(absolute: boolean) {
    return this._ref(absolute).rect()
  }

  private _ref(absolute: boolean) {
    return absolute ? this._absolute : this._viewport
  }
}