<template>
  <div class="panel" ref="panelRef" @mousedown="onMouseDown" :id="panel.id">
    {{ panel.type }}
    <div v-if="panel.children?.length" class="children">
      <Panel v-for="child in panel.children" :key="child.id" :panel="child" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { type Panel, registerPanel, movePanel } from "../store/panelStore";
import { DnD } from "@dflex/dnd";

export default defineComponent({
  name: "Panel",
  props: {
    panel: { type: Object as () => Panel, required: true },
  },
  setup(props) {
    const panelRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (panelRef.value) {
        registerPanel(panelRef.value, props.panel.id);
      }
    });

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || !panelRef.value) return;

      const dndInstance = new DnD(props.panel.id, { x: e.clientX, y: e.clientY });

      const onMouseMove = (ev: MouseEvent) => {
        // DFlex 追踪拖拽，不用 transform
      };

      const onMouseUp = (ev: MouseEvent) => {
        // 这里简单示例：拖拽结束后，按顺序插入最后
        const targetIndex = 0; // 可根据鼠标位置计算目标 index
        movePanel(props.panel.id, targetIndex);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    return { panelRef, onMouseDown };
  },
});
</script>

<style scoped>
.panel {
  border: 1px solid #999;
  padding: 8px;
  margin: 4px;
  background-color: #f0f0f0;
  cursor: grab;
}

.children {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 16px;
}
</style>
