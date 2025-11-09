<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="item"
      :ref="el => (itemRefs[index] = el)"
      class="draggable-item"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

// 内部维护一个可变数组
const items = ref([...props.modelValue]);

// 当父组件更新 modelValue 时同步
watch(
  () => props.modelValue,
  (newVal) => {
    items.value = [...newVal];
  }
);

// 保存每个 li 元素的 ref
const itemRefs = ref([]);

// 保存所有 cleanup 函数
let cleanupFns = [];

// 初始化拖拽
onMounted(() => {
  items.value.forEach((item, index) => {
    const el = itemRefs.value[index];
    if (!el) return;

    // draggable
    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({ item, fromIndex: index }),
    });

    // drop target
    const cleanupDrop = dropTargetForElements({
      element: el,
      canDrop: (payload) => {
        return payload.source?.data?.item !== item
      },
      onDrop: (payload) => {
        const { item: draggedItem, fromIndex } = payload.source?.data;
        const toIndex = index;

        const newItems = [...items.value];
        newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, draggedItem);
        items.value = newItems;

        emit('update:modelValue', newItems);
      },
    });

    cleanupFns.push(cleanupDrag, cleanupDrop);
  });
});

// 卸载时清理事件
onBeforeUnmount(() => {
  cleanupFns.forEach((fn) => {
    try { fn(); } catch (e) {}
  });
});
</script>

<style scoped>
.draggable-item {
  cursor: grab;
  padding: 6px;
  margin: 2px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  user-select: none;
}
.draggable-item:active {
  cursor: grabbing;
}
</style>
