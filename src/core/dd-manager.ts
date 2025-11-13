import { DDElementNode } from "./dd-element"

/**
 * DOMManager 用于管理框架中的逻辑元素与对应的 DOM 节点。
 * 它提供注册、查找、销毁等基础操作。
 *
 * - elements: 存储逻辑层的元素对象
 * - doms: 存储元素 ID 与真实 DOM 节点的映射关系
 * - removed: 弱引用集合，用于追踪被删除的 DOM（不阻止 GC 回收）
 */
export class DDManager<T extends DDElementNode> {

  /** 存储逻辑元素对象（key 为唯一 ID） */
  public elements: Map<string, T> = new Map();

  /** 存储逻辑 ID 与对应 DOM 节点的映射关系 */
  public doms: Map<string, HTMLElement> = new Map();

  /** 弱引用集合，用于追踪已被删除的 DOM 节点 */
  public removed: WeakSet<HTMLElement> = new WeakSet();

  /**
   * 根据元素 ID 获取逻辑对象与对应的 DOM 节点。
   *
   * @param id 元素的唯一标识符
   * @param strict 是否在未找到时抛出异常（默认 true）
   * @returns [逻辑元素对象, 对应的 DOM 节点]
   */
  public getElementWithDOM(id: string, strict: boolean = true): [T, HTMLElement] {
    const element = this.elements.get(id);
    const dom = this.doms.get(id);

    if (strict && (!element || !dom)) {
      throw new Error(`DFlexDOMManager.getElementWithDOM: Element with ID "${id}" not found.`);
    }

    return [element!, dom!];
  }

  /**
   * 判断某个元素 ID 是否已经注册。
   *
   * @param id 元素的唯一标识符
   * @returns 若存在则返回 true，否则 false
   */
  public has(id: string): boolean {
    return this.doms.has(id) && this.elements.has(id);
  }

  /**
   * 删除指定 ID 的元素及其对应的 DOM 映射。
   *
   * @param id 元素的唯一标识符
   */
  public dispose(id: string): void {
    this.elements.delete(id);

    const DOM = this.doms.get(id)!;
    this.removed.add(DOM);

    this.doms.delete(id);
  }

  /**
   * 清空所有数据，彻底销毁管理器。
   * 调用后所有引用都会被释放。
   */
  public destroy(): void {
    this.doms.clear();
    this.elements.clear();
  }
}