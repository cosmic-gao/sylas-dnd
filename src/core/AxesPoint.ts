/**
 * 唯一的 Symbol 标记，用于类型识别 Point 实例
 */
export const POINT_SYMBOL = Symbol('__sylas_dnd_point__');

export type PointLike<T> = Point<T> | AxesPoint<T>;

export class Point<T = number> {
  public x: T;
  public y: T;

  public constructor(x: T, y: T) {
    this.x = x;
    this.y = y;
  }
}

export class AxesPoint<T = number> extends Point<T> {
  public static readonly [POINT_SYMBOL] = true;

  /**
   * 类型保护方法，判断对象是否为 Point 或 AxesPoint
   * @param obj - 待判断对象
   * @returns 如果 obj 是 Point 或 AxesPoint，返回 true
   */
  public static isPoint<T = number>(obj: unknown): obj is PointLike<T> {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      (obj as Record<symbol, unknown>)[POINT_SYMBOL] === true
    );
  }

  public readonly [POINT_SYMBOL] = true;

  /**
   * 将另一个点的坐标复制到当前实例。
   *
   * @param point - 要克隆的 Point 或 AxesPoint 对象
   * @returns 当前 Point 实例，用于链式调用
   *
   * @remarks
   * 该方法会将 `point` 的 x 和 y 坐标赋值给当前实例，
   * 通常用于同步两个坐标点的位置。
   *
   * @example
   * const p1 = new AxesPoint(0, 0);
   * const p2 = new AxesPoint(100, 200);
   * p1.clone(p2);
   * console.log(p1.x, p1.y); // 100, 200
   */
  public clone(point: PointLike<T>): Point<T> {
    return this.setCoords(point.x, point.y);
  }

  /**
   * 设置当前点的坐标值，并返回自身实例以支持链式调用。
   *
   * @param x - 水平坐标 (x 轴)
   * @param y - 垂直坐标 (y 轴)
   * @returns 当前 Point 实例，用于链式调用
   *
   * @remarks
   * 该方法直接修改实例的 x 和 y 属性。
   * 可用于更新拖拽元素位置、布局计算或普通坐标操作。
   *
   * @example
   * const point = new AxesPoint(0, 0);
   * point.setCoords(100, 200).setCoords(150, 250); // 链式调用
   * console.log(point.x, point.y); // 150, 250
   */
  public setCoords(x: T, y: T): Point<T> {
    this.x = x
    this.y = y

    return this
  }

  /**
   * 获取当前点的坐标副本。
   *
   * @returns 一个新的对象，包含当前点的 x 和 y 坐标
   *
   * @remarks
   * 返回值是一个独立对象，不会影响原始 Point 实例。
   * 通常用于读取坐标而不修改原点。
   *
   * @example
   * const point = new Point(100, 200);
   * const coords = point.getCoords();
   * console.log(coords.x, coords.y); // 100, 200
   */
  public getCoords(): Point<T> {
    return { x: this.x, y: this.y }
  }

  /**
   * 判断当前点是否与另一个点或坐标相等
   *
   * 方法重载：
   * 1. isEqualTo(x: T, y: T): boolean
   *    - 使用单独坐标值比较
   * 2. isEqualTo(point: Point<T> | AxesPoint<T>): boolean
   *    - 使用 Point 或 AxesPoint 对象比较
   *
   * @param xOrPoint - 单个坐标值或 PointLike 对象
   * @param y - 可选，y 坐标值，当 xOrPoint 是单个坐标时必须提供
   * @returns 是否相等
   */
  public isEqualTo(x: T, y: T): boolean;
  public isEqualTo(point: Point<T> | AxesPoint<T>): boolean;
  public isEqualTo(xOrPoint: T | PointLike<T>, y?: T): boolean {
    if (AxesPoint.isPoint(xOrPoint)) {
      return this.x === xOrPoint.x && this.y === xOrPoint.y;
    }

    return this.x === xOrPoint && this.y === y;
  }
}