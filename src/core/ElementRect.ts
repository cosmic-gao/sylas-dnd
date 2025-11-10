export interface RectSize {
  width: number;
  height: number;
}

export type RectBounds = RectSize & Rect

/**
 * Rect 类表示一个矩形的边界。
 * 
 * @template T - 坐标类型，默认为 number，可以扩展为其他数值类型
 */
export class Rect<T = number> {

  /** 上边界坐标（top） */
  public top: T;

  /** 右边界坐标（right） */
  public right: T;

  /** 下边界坐标（bottom） */
  public bottom: T;

  /** 左边界坐标（left） */
  public left: T;

  /**
   * 构造一个矩形边界实例
   * 
   * @param top - 上边界坐标
   * @param bottom - 下边界坐标
   * @param left - 左边界坐标
   * @param right - 右边界坐标
   */
  public constructor(top: T, bottom: T, left: T, right: T) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }
}

/**
 * ElementRect 类继承自 {@link Rect}，用于表示 DOM 元素的边界矩形。
 * 
 * 除了继承 Rect<T> 的 top/right/bottom/left 属性外，
 * 还提供对矩形的操作方法，例如克隆、设置、获取尺寸等。
 * 
 * 适用场景：
 * - 拖拽
 * - 布局计算
 * - 碰撞检测
 * 
 * @template T - 坐标类型，默认为 number。
 * @extends Rect<T>
 * @see Rect
 */
export class ElementRect<T = number> extends Rect<T> {

  /**
   * 将另一个矩形的边界复制到当前实例。
   * 
   * @param {Rect<T>} rect - 要克隆的矩形对象
   */
  public clone(rect: Rect<T>) {
    this.top = rect.top;
    this.right = rect.right;
    this.bottom = rect.bottom;
    this.left = rect.left;
  }

  /**
   * 获取当前矩形的完整边界。
   *
   * @returns 当前矩形的 top、right、bottom、left 属性组成的对象
   */
  public getRect(): Rect<T> {
    return {
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left
    }
  }

  /**
   * 设置当前矩形的完整边界。
   *
   * @param rect - 新的矩形边界
   * @returns 当前实例，支持链式调用
   */
  public setRect(rect: Rect<T>): ElementRect<T> {
    this.top = rect.top;
    this.right = rect.right;
    this.bottom = rect.bottom;
    this.left = rect.left;

    return this;
  }

  /**
   * 将矩形或元素放置到指定左上角坐标。
   * 
   * @param x - 左上角的水平坐标，对应 left
   * @param y - 左上角的垂直坐标，对应 top
   * 
   * @remarks
   * 只更新矩形的 left 和 top 属性，不会修改 right 或 bottom。
   * 可与 `getPosition()` 配合使用获取当前左上角坐标。
   */
  public setPosition(x: T, y: T) {
    this.left = x;
    this.top = y
  }

  /**
   * 获取矩形或元素的左上角坐标。
   * 
   * @returns {{ x: T; y: T }} - 返回一个对象，x 对应 left，y 对应 top
   * 
   * @remarks
   * 该方法只返回左上角坐标，不包括右下角或宽高信息。
   * 可与 `setPosition(x, y)` 配合使用，实现元素位置的读取与设置。
   */
  public getPosition() {
    return { x: this.left, y: this.top }
  }

  public hasEqualPosition(x: T, y: T): boolean {
    return this.top === y || this.left === x;
  }
}