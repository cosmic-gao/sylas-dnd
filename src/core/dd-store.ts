import { DDElementNode } from "./dd-element"
import { DDManager } from "./dd-manager";
import { DOMRegistry } from "./dom-registry"

export class DDStore<T extends DDElementNode> extends DDManager<T> {
  public relation: DOMRegistry<any> = new DOMRegistry()

  public constructor() {
    super()
  }
}