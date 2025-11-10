import { DDManager } from "./dd-manager";

export class DDStore<T extends { keys: { SK: string } }> extends DDManager<T> {
  public constructor() {
    super()
  }
}