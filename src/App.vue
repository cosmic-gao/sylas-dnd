<template>
  <div id="id-0">id-0</div>
  <div id="id-1">id-1</div>
  <div id="id-2">id-2</div>
  <div id="p-id-0">p-id-0</div>
</template>

<script lang="ts" setup>
import { compile } from '@vue/compiler-dom';

const template = `<div>{{ message }}</div>`;

// 浏览器环境 decodeEntities
const { code } = compile(template, {
  mode: 'function', // 或 'module'
  prefixIdentifiers: false,
  onError(err) { console.error(err); },
  decodeEntities: (raw) => {
    const t = document.createElement('textarea');
    t.innerHTML = raw;
    return t.value;
  }
});

console.log(code);
</script>
