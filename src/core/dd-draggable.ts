import { DDCoordPoint } from "./dd-point"
import { DDElement } from "./dd-element"

export class DDDraggable<T extends DDElement> {
  public readonly draggedElm: T;
  public readonly draggedDOM: HTMLElement;

  protected placeholder: DDCoordPoint

  public constructor(draggedElm: T, node: HTMLElement) {
    this.draggedElm = draggedElm;
    this.draggedDOM = node

    this.placeholder = new DDCoordPoint(0, 0);
  }

  protected translate() {
    DDElement.transform(this.draggedDOM, this.placeholder.x, this.placeholder.y)
  }
}