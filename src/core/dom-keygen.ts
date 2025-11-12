export type NodeId = string;

export type Depth = number;

export type SiblingKey = string;

export type BranchKey = string;

/**
 * 树节点接口
 * @template T 泛型类型，表示节点关联的原始数据或实例
 */
export interface Node<T> {
  /** 节点对应的原始数据或实例 */
  readonly _node: T;

  /** 节点唯一 ID */
  readonly id: NodeId;

  parent?: Node<T>;
  children: Node<T>[];

  /** 树深度，根节点为 0 */
  depth: Depth;

  /** 同级节点 Key，用于快速查找兄弟节点 */
  sk?: SiblingKey;

  /** 分支 Key，用于快速查找整条分支 */
  bk?: BranchKey;
}

export interface Keygen<T> {
  nodes: Map<NodeId, Node<T>>;
  levels: Map<SiblingKey, Node<T>[]>;
  branchs: Map<BranchKey, Node<T>[]>;
}

export class DOMKeygen<T> implements Keygen<T> {
  public nodes: Map<NodeId, Node<T>> = new Map();

  public levels: Map<SiblingKey, Node<T>[]> = new Map();

  public branchs: Map<BranchKey, Node<T>[]> = new Map();

  public get branchSize(): number {
    return this.branchs.size
  }
}