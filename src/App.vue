<script setup>
import { ref, reactive, onMounted, nextTick } from "vue"
import {
  draggable,
  dropTargetForElements,
  monitorForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"

const items = reactive([
  { id: "task-1", label: "Organize event" },
  { id: "task-2", label: "Maintain inventory" },
  { id: "task-3", label: "Update website" },
  { id: "task-4", label: "Plan marketing" }
])

// 保存每个元素引用
const itemRefs = new Map()

// 核心拖拽逻辑
onMounted(() => {
  // 监听全局 drop 行为
  monitorForElements({
    canMonitor({ source }) {
      return !!source.data.itemId
    },
    onDrop({ source, location }) {
      const target = location.current.dropTargets[0]
      if (!target) return

      const sourceId = source.data.itemId
      const targetId = target.data.itemId
      if (sourceId === targetId) return

      const from = items.findIndex(i => i.id === sourceId)
      const to = items.findIndex(i => i.id === targetId)

      // 简化：拖到某元素上，就放在它前面
      const newItems = reorder({ list: [...items], startIndex: from, finishIndex: to })
      items.splice(0, items.length, ...newItems)
    }
  })

  // 初始化每个元素为可拖拽/可放置
  nextTick(() => {
    for (const item of items) {
      const el = itemRefs.get(item.id)
      if (!el) continue

      draggable({
        element: el,
        getInitialData: () => ({ itemId: item.id })
      })

      dropTargetForElements({
        element: el,
        getData: () => ({ itemId: item.id })
      })
    }
  })
})
</script>

<template>
  <div class="list">
    <div
      v-for="item in items"
      :key="item.id"
      class="list-item"
      :ref="el => itemRefs.set(item.id, el)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<style scoped>
.list {
  border: 1px solid #ccc;
  width: 320px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}
.list-item {
  padding: 10px 14px;
  border-bottom: 1px solid #eee;
  background: #fff;
  cursor: grab;
  user-select: none;
  transition: background 0.2s;
}
.list-item:hover {
  background: #f7f7f7;
}
.list-item:last-child {
  border-bottom: none;
}
</style>
