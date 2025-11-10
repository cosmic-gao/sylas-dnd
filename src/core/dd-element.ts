import { DDCoordPoint } from "./dd-point"
import { setStyleProperty } from "./dom"

export type DDElementLike = DDElement | DraggableElement | DDElementDefinition;

export interface DDElementDefinition {
  readonly id: string
}

const TRANSFORM = "transform";

/**
 * 平移 DOM 元素，使用 matrix3d 矩阵
 * @param DOM - 目标元素
 * @param x - x 轴位移
 * @param y - y 轴位移
 */
function transform(DOM: HTMLElement, x: number, y: number): void {
  const matrix = `matrix3d(1, 0, 0, 0,0, 1, 0, 0, 0, 0, 1, 0, ${x}, ${y}, 0, 1)`;

  setStyleProperty(DOM, TRANSFORM, matrix);
}

/**
 * 唯一的 Symbol 标记，用于类型识别 element 实例
 */
export const ELEMENT_SYMBOL = Symbol('__sylas_dnd_element__');

export class DDElement implements DDElementDefinition {
  public static readonly [ELEMENT_SYMBOL] = true;

  public static transform = transform;

  public readonly id: string;

  public translate: DDCoordPoint;

  public constructor(id: string) {
    this.id = id
    this.translate = new DDCoordPoint(0, 0);
  }
}

export class DraggableElement extends DDElement {

}