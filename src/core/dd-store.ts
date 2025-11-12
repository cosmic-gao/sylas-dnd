import { DDManager } from "./dd-manager";

export class DDStore<T extends { keys: { SK: string } } = any> extends DDManager<T> {

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