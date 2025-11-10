<template>
  <div>12</div>
</template>

<script lang="ts" setup>
import Generator from "@dflex/dom-gen";

// 初始化管理器
const domKeysManager = new Generator() as any;

// 模拟添加一些元素
const branchKey = domKeysManager.constructBK(true); // 新分支
const depth = 0;

// 添加第一个元素
const sk1 = domKeysManager.constructSK(depth, 0);
domKeysManager.registerKeys("element1", sk1, branchKey, depth, false);

// 添加第二个元素，和第一个同级
const sk2 = domKeysManager.constructSK(depth, 1);
domKeysManager.registerKeys("element2", sk2, branchKey, depth, true);

// 添加子元素
const childDepth = 1;
const skChild = domKeysManager.constructSK(childDepth, 0);
domKeysManager.registerKeys("child1", skChild, branchKey, childDepth, false);

// 查看所有兄弟键
console.log(domKeysManager.getSiblingsByKey(sk1)); // ["element1"]
console.log(domKeysManager.getSiblingsByKey(sk2)); // ["element2"]

// 查看分支最高深度元素
console.log(domKeysManager.getTopLevelSKs());

// 删除元素
domKeysManager.deleteIDFromBranch(branchKey, sk1, depth, "element1");
console.log(domKeysManager.getSiblingsByKey(sk1)); // []

// 调试内部数据
console.log(domKeysManager._DEV_getPrivateKeys());

</script>