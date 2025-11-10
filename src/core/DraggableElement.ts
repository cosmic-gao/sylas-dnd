export class DElement {
  public readonly id: string;

  public constructor(id: string) {
    this.id = id
  }
}

export class DraggableElement {
  public readonly el: HTMLElement;

  public constructor(el: HTMLElement) {
    this.el = el
  }

  protected translate(x: number, y: number) {

  }
}