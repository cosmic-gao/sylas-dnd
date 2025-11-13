import { reactive } from "vue";
import { store } from "@dflex/dnd";
import { nanoid } from "nanoid";

export interface Panel {
  id: string;
  type: string;
  parentId?: string;
  children?: Panel[];
}

export const panels = reactive<Panel[]>([]);

// 创建新面板
export function createPanel(type: string, parentId?: string): Panel {
  return {
    id: nanoid(),
    type,
    parentId,
    children: [],
  };
}

// 注册元素到 DFlex store，用于捕获拖拽事件
export function registerPanel(el: HTMLElement, panelId: string) {
  store.register({ id: panelId});
}

// 移动面板顺序或更换父容器
export function movePanel(panelId: string, targetIndex: number, targetParentId?: string) {
  const index = panels.findIndex(p => p.id === panelId);
  if (index === -1) return;
  const panel = panels[index]!;
  panels.splice(index, 1);
  panel.parentId = targetParentId;
  panels.splice(targetIndex, 0, panel);
}
