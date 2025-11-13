export type Token = string | number;

export type NodeId = string;

export type Depth = number;

export type SiblingKey = `${typeof DOMKeygen.SIBLING_KEY}${string}`;;

export type BranchKey = `${typeof DOMKeygen.BRANCH_KEY}${string}`;

export type BranchValue = { sk: SiblingKey; ids: NodeId[] }
/**
 * 树节点接口
 * @template T 泛型类型，表示节点关联的原始数据或实例
 */
export interface Node<T> {
  /** 节点对应的原始数据或实例 */
  readonly _node: T;

  /** 节点唯一 ID */
  readonly id: NodeId;

  child?: Node<T>;
  parent?: Node<T>;
  sibling?: Node<T>;

  /** 树深度，根节点为 0 */
  depth: Depth;

  /** 同级节点 Key，用于快速查找兄弟节点 */
  sk?: SiblingKey;

  /** 分支 Key，用于快速查找整条分支 */
  bk?: BranchKey;
}

export interface KeygenGraph<T> {
  nodes: Map<NodeId, Node<T>>;
  tiers: Map<Depth, SiblingKey[]>;
  levels: Map<Depth, Set<NodeId>>;
  branchs: Map<BranchKey, Map<Depth, BranchValue>>;
  siblings: Map<SiblingKey, Set<NodeId>>;
}

export const join = <L extends Token, R extends Token>(left: L, right: R) => `${left}_${right}` as const;

export class DOMKeygen<T> implements KeygenGraph<T> {
  public static readonly BRANCH_KEY = '__sylas_bk__' as const
  public static readonly SIBLING_KEY = '__sylas_sk__' as const

  public nodes: Map<NodeId, Node<T>> = new Map();
  public tiers: Map<Depth, SiblingKey[]> = new Map();
  public levels: Map<Depth, Set<NodeId>> = new Map();
  public branchs: Map<BranchKey, Map<Depth, BranchValue>> = new Map();
  public siblings: Map<SiblingKey, Set<NodeId>> = new Map();

  private branchIndex: number = 0;

  public getSiblingKey(sk: SiblingKey): Set<NodeId> {
    return this.siblings.get(sk) ?? new Set<NodeId>()
  }

  public deleteSiblings(bk: BranchKey, depth: Depth) {
    
  }

  protected createBranchKey(fresh: boolean = false): BranchKey {
    if (fresh) this.branchIndex += 1
    return `${DOMKeygen.BRANCH_KEY}${this.branchIndex}`;
  }

  protected createSiblingKey(depth: Depth, siblingIndex: number): SiblingKey {
    return `${DOMKeygen.SIBLING_KEY}${join(depth, siblingIndex)}`;
  }

  private linkSibling(sk: SiblingKey, id: NodeId): Set<NodeId> {
    const set = this.getSiblingKey(sk);
    this.siblings.set(sk, set);
    set.add(id);
    return set
  }
}