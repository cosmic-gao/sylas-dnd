import { DDElementNode } from "./dd-element"
import { DDManager } from "./dd-manager";

export class DDStore<T extends DDElementNode> extends DDManager<T> {

  public constructor() {
    super()
  }

  public dispose(id: string): void {
    super.dispose(id);
  }

  public destroy(): void {
    super.destroy();
  }
}