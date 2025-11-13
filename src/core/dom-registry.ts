import { type Depth, type ParentKey, type BranchKey, DOMKeygen } from "./dom-keygen"

export class DOMRegistry<T> extends DOMKeygen<T> {
  private _siblingsCount!: Record<Depth, number>;

  private _PKByDepth!: Record<Depth, ParentKey>;

  private _prevDepth!: Depth;

  private _prevPK!: ParentKey;

  private _preBK!: BranchKey | null;

  public constructor() {
    super();
    this._init()
  }

  public register(id: string, depth: number, hasSiblingInSameLevel: boolean) {
    const { bk } = this._composeKeys(depth, hasSiblingInSameLevel)
  }

  private _init() {
    this._siblingsCount = {};
    this._PKByDepth = {};
    this._prevDepth = -99;
    this._prevPK = this.createParentKey(0);
    this._preBK = null;
  }

  private _composeKeys(depth: number, hasSiblingInSameLevel: boolean) {
    const parentDepth = depth + 1;

    if (this._siblingsCount[parentDepth] === undefined) { }

    const isNewBranch = depth < this._prevDepth;
    if (isNewBranch) {
      const until = hasSiblingInSameLevel ? depth : depth - 1;
      for (let i = 0; i <= until; i += 1) {
        this._siblingsCount[i] = 0;
      }
    }

    const bk = this.createBranchKey(isNewBranch);

    return {
      bk
    }
  }
}