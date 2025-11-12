import { EventBus } from "./event-bus"
import { DDStore } from "./dd-store"

export interface DDElement {
  id: string;
}

export interface DDRuntimeElement extends DDElement {

}

export const isBrowser = (): boolean =>
  typeof window !== "undefined" &&
  typeof document !== "undefined" &&
  typeof document.createElement === "function";

export const createStore = (): DnDStore => {
  const store = new DnDStore();
  return store
}

export const store = createStore()

export class DnDStore extends DDStore {
  private initialized: boolean = false

  private mitt: EventBus = new EventBus()

  public register(options: DDRuntimeElement) {
    if (!this.initialized) {
      this.setup()
      this.initialized = true
    }

    const { id } = options

    const element = this.elements.get(id)
    if (element) {
      const dom = this.doms.get(id)!

      if (!dom.isConnected) {

      }

      if (dom.isSameNode(dom)) {

      }
    }
  }

  private setup() {
    this.setupEvents()
  }

  private setupEvents() { }
}

export class DDRuntime {
  private store: DnDStore = store

  public constructor() { }

  public register(options: DDRuntimeElement) {
    return this.store.register(options);
  }
}