<template>
  <div>
    <h2>拖拽排序列表</h2>
    <DraggableList v-model="listItems" />
    <p>当前顺序：{{ listItems.join(', ') }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DraggableList from './DraggableList.vue';

// 初始化列表
const listItems = ref(['A', 'B', 'C', 'D']);
</script>
