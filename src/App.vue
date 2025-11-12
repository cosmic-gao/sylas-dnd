<template>
  <div class="container" ref="containerRef" @pointerdown="onPointerDown">
    <div
      v-for="(item, i) in items"
      :key="item"
      :id="`item-${i}`"
      class="item"
    >
      {{ item }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { store, DnD } from "@dflex/dnd";

// 响应式列表数据
const items = ref(["🍎 Apple", "🍌 Banana", "🍒 Cherry", "🍇 Grape"]);
const containerRef = ref(null);
let activeDnD:any = null;

/** 启动拖拽 */
const onPointerDown = (e:any) => {
  const item = e.target.closest(".item");
  if (!item) return;

  activeDnD = new DnD(item.id, { x: e.clientX, y: e.clientY });

  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", onPointerUp, { once: true });
};

/** 拖拽进行中 */
const onPointerMove = (e:any) => {
  if (activeDnD) {
    activeDnD.dragAt(e.clientX, e.clientY);
  }
};

/** 结束拖拽 */
const onPointerUp = async () => {
  if (!activeDnD) return;

  activeDnD.endDragging();
  store.commit(); // 提交 DOM 顺序变化

  // 获取容器的最新 DOM 顺序并同步到 Vue 数组
  const container:any = containerRef.value ;
  const newOrder = Array.from(container.children).map((el:any) => el.textContent.trim());
  items.value = newOrder;

  activeDnD = null;
  document.removeEventListener("pointermove", onPointerMove);
};

/** 注册所有 DOM 元素 */
onMounted(async () => {
  await nextTick(); // 确保 DOM 已渲染
  const container:any = containerRef.value;
  Array.from(container.children).forEach((el:any) => {
    store.register({ id: el.id });
  });
  console.log(store, "store")
});

/** 组件卸载时清理 */
onBeforeUnmount(() => {
  const container:any = containerRef.value;
  if (!container) return;
  Array.from(container.children).forEach((el:any) => {
    store.unregister(el.id);
  });
});
</script>

<style scoped>
.container {
  width: 300px;
  margin: 60px auto;
}

.item {
  padding: 12px;
  margin: 8px 0;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: grab;
  transition: transform 0.1s ease, background-color 0.25s;
}

.item:active {
  cursor: grabbing;
  background-color: #e0f7fa;
}
</style>
