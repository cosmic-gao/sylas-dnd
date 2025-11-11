type SiblingKey = string;

type BranchKey = string;

type ElmID = string;

type Depth = number;

type BranchValue = { SK: SiblingKey; ids: ElmID[] };

type KY = number | string;

const PREFIX_BRANCH_KEY = "dflex_bk_";
const PREFIX_CONNECTOR_KEY = "dflex_ky_";
const PREFIX_SIBLINGS_KEY = "dflex_sk_";

function addToUniqueArray<T>(arr: T[], element: T): T[] {
  if (!arr.some((existingElement) => existingElement === element)) {
    arr.push(element);
  }

  return arr;
}

function combineKeys(k1: KY, k2: KY) {
  return `${k1}_${k2}`;
}

export class DOMKeygen {
  private _SKByDepth: Map<Depth, SiblingKey[]> = new Map();

  private _idsBySk: Map<SiblingKey, ElmID[]> = new Map();

  private _prevBKs: BranchKey[] = [];

  private _branchesRegistry: Map<BranchKey, Map<Depth, BranchValue>> = new Map();

  private _branchIndex: number = 0;

  public constructor() { }

  /**
   * 注册一个 DOM 元素的键信息。
   *
   * 功能概述：
   * 1️⃣ 将当前元素所在的同级组（SiblingKey, SK）记录到对应的层级（Depth）。
   * 2️⃣ 将元素 ID 添加进对应的同级组 (_idsBySk)。
   * 3️⃣ 将该元素的信息更新到所属分支（BranchKey, BK）中。
   * 4️⃣ 如果当前层有其他兄弟节点（hasSiblingInSameLevel = true），会共享父节点信息。
   *
   * 返回值：
   * - 当前元素在同级组中的索引位置（selfIndex，从 0 开始）。
   *
   * 示例 HTML 对应结构：
   * <div id="root"> <!-- depth: 0, BK: dflex_bk_1, SK: dflex_sk_0_0 -->
   *   <section id="A"> <!-- depth: 1, BK: dflex_bk_1, SK: dflex_sk_1_0 -->
   *     <div id="a1"></div> <!-- depth: 2, BK: dflex_bk_1, SK: dflex_sk_2_0 -->
   *     <div id="a2"></div> <!-- depth: 2, BK: dflex_bk_1, SK: dflex_sk_2_0 -->
   *   </section>
   *   <section id="B"> <!-- depth: 1, BK: dflex_bk_2, SK: dflex_sk_1_1 -->
   *     <div id="b1"></div> <!-- depth: 2, BK: dflex_bk_2, SK: dflex_sk_2_1 -->
   *   </section>
   * </div>
   *
   * 内部状态示意（调用 registerKeys 后）：
   * _SKByDepth = {
   *   0: ["dflex_sk_0_0"],
   *   1: ["dflex_sk_1_0", "dflex_sk_1_1"],
   *   2: ["dflex_sk_2_0", "dflex_sk_2_1"]
   * };
   *
   * _idsBySk = {
   *   "dflex_sk_0_0": ["root"],
   *   "dflex_sk_1_0": ["A"],
   *   "dflex_sk_1_1": ["B"],
   *   "dflex_sk_2_0": ["a1", "a2"],
   *   "dflex_sk_2_1": ["b1"]
   * };
   *
   * _branchesRegistry = {
   *   "dflex_bk_1": {
   *     0: { SK: "dflex_sk_0_0", ids: ["root"] },
   *     1: { SK: "dflex_sk_1_0", ids: ["A"] },
   *     2: { SK: "dflex_sk_2_0", ids: ["a1"] }
   *   },
   *   "dflex_bk_2": {
   *     0: { SK: "dflex_sk_0_0", ids: ["root"] },
   *     1: { SK: "dflex_sk_1_1", ids: ["B"] },
   *     2: { SK: "dflex_sk_2_1", ids: ["b1"] }
   *   }
   * };
   */
  public registerKeys(
    id: string,                  // 元素唯一标识（通常是 DOM 节点 ID）
    SK: string,                  // 同级元素组（Sibling Key）
    BK: string,                  // 分支标识（Branch Key）
    depth: number,               // 当前元素的层级深度（从 0 开始）
    hasSiblingInSameLevel: boolean, // 是否存在同层兄弟节点（决定是否共享父节点）
  ) {
    this._upsertSKToDepth(depth, SK);

    const selfIndex = this._addDToSiblings(SK, id);

    this._updateBranch(BK, SK, depth, hasSiblingInSameLevel);

    return selfIndex;
  }

  /**
   * 确保指定层级 (depth) 的同级组 (SiblingKey) 列表存在，
   * 并将当前 SK（同级组键）加入该层级列表中（保证唯一）。
   *
   * @param depth 当前元素所在的层级深度（从 0 开始）
   * @param SK    同级组的唯一标识（SiblingKey）
   */
  private _upsertSKToDepth(depth: number, SK: string): void {
    if (!this._SKByDepth.has(depth)) {
      this._SKByDepth.set(depth, []);
    }

    const skList = this._SKByDepth.get(depth)!;

    addToUniqueArray<string>(skList, SK);
  }

  private _addDToSiblings(SK: string, id: string): number {
    if (!this._idsBySk.has(SK)) {
      this._idsBySk.set(SK, []);
    }

    return this._idsBySk.get(SK)!.push(id) - 1;
  }

  private _updateBranch(
    BK: string,
    SK: string,
    depth: number,
    hasSiblingInSameLevel: boolean,
  ): void {
    this._upsertBK(BK);

    this._updateBranchValue(SK, BK, depth);

    if (hasSiblingInSameLevel) {
      this._shareParentFromPrevBranch(BK, depth);
    }
  }

  private _upsertBK(BK: string): void {
    addToUniqueArray<string>(this._prevBKs, BK);
  }

  private _shareParentFromPrevBranch(BK: BranchKey, depth: number): void {
    const prevBK = this._findLastNotMatchingBK(BK);

    const [prevDepth, prevValue] = this.getHighestDepthInBranch(prevBK!)!;

    // Sharing the same parent in DOM but it's not in the registry.
    if (depth + 1 !== prevDepth) {
      return;
    }

    // Update the current branch with previous values as they are shared.
    // Essentially, we're informing the current branch that it shares a parent
    // with the previous branch, so it should inherit the parent's values.
    this._updateBranchValue(prevValue.SK, BK, prevDepth);
  }

  private _updateBranchValue(
    SK: string,
    BK: string,
    depth: number,
  ): BranchValue {
    let ids = this._idsBySk.get(SK)!;

    if (depth > 0) {
      ids = [ids[ids.length - 1]!];
    }

    let branch = this._branchesRegistry.get(BK);

    if (!branch) {
      branch = new Map();
      this._branchesRegistry.set(BK, branch);
    }

    let branchValue = branch.get(depth);

    if (branchValue) {
      branchValue.ids = ids;
      branchValue.SK = SK;
    } else {
      branchValue = {
        ids,
        SK,
      };

      branch.set(depth, branchValue);
    }

    return branchValue;
  }

  /**
   * 构建一个分支键（Branch Key, BK）。
   *
   * Branch Key 用于唯一标识一条分支（从根节点到叶子节点的一条逻辑路径）。
   * 每次创建新分支时，会生成一个新的 BK；如果不是新分支，则复用当前索引。
   *
   * @param isNewBranch 是否是新建分支：
   *                    - true: 创建新的分支，BK 自增
   *                    - false: 复用当前分支索引，返回已有 BK
   * @returns 返回分支的唯一标识符 BK，例如 "dflex_bk_1"
   */
  public constructBK(isNewBranch: boolean): string {
    if (isNewBranch) {
      this._branchIndex += 1;
    }

    const BK = `${PREFIX_BRANCH_KEY}${this._branchIndex}`;

    return BK;
  }

  /**
   * 构建父节点键（Parent Key, PK）。
   *
   * PK 用于标识当前节点的父节点，特别是在同层有多个兄弟节点时，
   * 可以通过 PK 快速建立父子连接关系。
   *
   * @param parentDepth 父节点所在的层级深度（Depth）
   * @returns 返回父节点键 PK，例如 "dflex_ky_2_1"
   *
   * 说明：
   * - PK = PREFIX_CONNECTOR_KEY + combineKeys(parentDepth, branchIndex)
   * - 这里的 combineKeys 会把父节点深度和当前分支索引组合成唯一标识
   * - PK 类似于 Fiber 的 return 指针，用于在分支中快速定位父节点
   */
  public constructPK(parentDepth: number): string {
    const PK = `${PREFIX_CONNECTOR_KEY}${combineKeys(
      parentDepth,
      this._branchIndex,
    )}`;

    return PK;
  }

  public constructSK(depth: number, siblingsIndex: number): string {
    const SK = `${PREFIX_SIBLINGS_KEY}${combineKeys(depth, siblingsIndex)}`;

    return SK;
  }

  private _findLastNotMatchingBK(BK: string): string | null {
    for (let i = this._prevBKs.length - 1; i >= 0; i -= 1) {
      if (this._prevBKs[i] !== BK) {
        return this._prevBKs[i]!;
      }
    }

    return null;
  }


  public getHighestDepthInBranch(BK: string): [Depth, BranchValue] {
    const depthMap = this._branchesRegistry.get(BK)!;

    const highestDepth = depthMap.size - 1;

    const highestDepthValue = depthMap.get(highestDepth)!;

    return [highestDepth, highestDepthValue];
  }
}
