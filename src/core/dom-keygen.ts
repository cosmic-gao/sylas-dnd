export type Token = string | number;

export type NodeId = string;

export type Depth = number;

export type SiblingKey = `${typeof DOMKeygen.SIBLING_KEY}${string}`;;

export type BranchKey = `${typeof DOMKeygen.BRANCH_KEY}${string}`;

export type BranchValue = { sk: SiblingKey; ids: NodeId[] }

export interface Node<T> {
  readonly _node: T;
  readonly id: NodeId;
  child?: Node<T>;
  parent?: Node<T>;
  sibling?: Node<T>;
  depth: Depth;
  sk?: SiblingKey;
  bk?: BranchKey;
}

export interface KeygenGraph<T> {
  nodes: Map<NodeId, Node<T>>;
  tiers: Map<Depth, SiblingKey[]>;
  levels: Map<Depth, NodeId[]>;
  branchs: Map<BranchKey, Map<Depth, BranchValue>>;
  siblings: Map<SiblingKey, NodeId[]>;
}

export const join = <L extends Token, R extends Token>(left: L, right: R) => `${left}_${right}` as const;

export const ensure = <T>(array: T[], item: T): T[] => array.includes(item) ? array : [...array, item];

export const remove = <T>(array: T[], item: T): T[] => array.filter(el => el !== item);

export class DOMKeygen<T> implements KeygenGraph<T> {
  public static readonly BRANCH_KEY = '__sylas_bk__' as const
  public static readonly SIBLING_KEY = '__sylas_sk__' as const

  public nodes: Map<NodeId, Node<T>> = new Map();
  public tiers: Map<Depth, SiblingKey[]> = new Map();
  public levels: Map<Depth, NodeId[]> = new Map();
  public branchs: Map<BranchKey, Map<Depth, BranchValue>> = new Map();
  public siblings: Map<SiblingKey, NodeId[]> = new Map();

  private branchIndex: number = 0;

  public getSiblingKey(sk: SiblingKey): NodeId[] {
    return this.siblings.get(sk) ?? []
  }

  public deleteSiblings(bk: BranchKey, depth: Depth) {
    const branch = this.branchs.get(bk);
    if (!branch) return;
  }

  public destroy() {
    this.nodes.clear();
    this.tiers.clear();
    this.levels.clear();
    this.branchs.clear();
    this.siblings.clear();
    this.branchIndex = 0;
  }


  protected createBranchKey(fresh: boolean = false): BranchKey {
    if (fresh) this.branchIndex += 1
    return `${DOMKeygen.BRANCH_KEY}${this.branchIndex}`;
  }

  protected createSiblingKey(depth: Depth, siblingIndex: number): SiblingKey {
    return `${DOMKeygen.SIBLING_KEY}${join(depth, siblingIndex)}`;
  }

  private linkSibling(sk: SiblingKey, id: NodeId): number {
    const siblings = this.getSiblingKey(sk);
    this.siblings.set(sk, siblings);
    return siblings.push(id) - 1
  }

  private upsertSiblingKey(depth: number, sk: SiblingKey) {
    const tier = this.tiers.get(depth) ?? [];
    this.tiers.set(depth, ensure(tier, sk));
  }

  private updateBranchValue(sk: SiblingKey, bk: BranchKey, depth: Depth) {
    let ids = this.getSiblingKey(sk);

    if (depth > 0) ids = [ids[ids.length - 1]!];

    if (!this.branchs.has(bk)) this.branchs.set(bk, new Map());
    const branch = this.branchs.get(bk)!;

    branch.set(depth, { sk: sk, ids });

    return { sk: sk, ids };
  }

  protected registerNode(node: Node<T>) {
    node.depth ??= 0;
    this.nodes.set(node.id, node)

    const level = this.levels.get(node.depth) ?? [];
    level.push(node.id);
    this.levels.set(node.depth, level);

    const siblingIndex = (this.tiers.get(node.depth)?.length ?? 0);
    node.sk ??= this.createSiblingKey(node.depth, siblingIndex);
    this.upsertSiblingKey(node.depth, node.sk);
    this.linkSibling(node.sk, node.id);

    node.bk ??= this.createBranchKey(!node.sibling);

    if (!this.branchs.has(node.bk)) this.branchs.set(node.bk, new Map());
    const branch = this.branchs.get(node.bk)!;
    branch.set(node.depth, { sk: node.sk, ids: [node.id] });
  }
}