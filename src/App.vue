<template>
  <div>12</div>
</template>

<script lang="ts" setup>
import {DOMKeygen} from "./core/dom-keygen";

// 初始化管理器
const domKeysManager = new DOMKeygen();

const rootBK = domKeysManager.constructBK(true); // dflex_bk_1
const rootSK = domKeysManager.constructSK(0, 0); // dflex_sk_0_0
domKeysManager.registerKeys("root", rootSK, rootBK, 0, false);

// Step 2: 注册 section A
const sectionABK = domKeysManager.constructBK(true); // dflex_bk_2
const sectionASK = domKeysManager.constructSK(1, 0); // dflex_sk_1_0
domKeysManager.registerKeys("A", sectionASK, sectionABK, 1, false);

// Step 3: 注册 A 下的子节点 a1 和 a2
const a1SK = domKeysManager.constructSK(2, 0); // dflex_sk_2_0
domKeysManager.registerKeys("a1", a1SK, sectionABK, 2, true); // hasSiblingInSameLevel = true

const a2SK = domKeysManager.constructSK(2, 0); // 同级组 SK 相同
domKeysManager.registerKeys("a2", a2SK, sectionABK, 2, true);

// Step 4: 注册 section B
const sectionBBK = domKeysManager.constructBK(true); // dflex_bk_3
const sectionBSK = domKeysManager.constructSK(1, 1); // dflex_sk_1_1
domKeysManager.registerKeys("B", sectionBSK, sectionBBK, 1, false);

// Step 5: 注册 B 下的子节点 b1
const b1SK = domKeysManager.constructSK(2, 1); // dflex_sk_2_1
domKeysManager.registerKeys("b1", b1SK, sectionBBK, 2, false);

console.log(domKeysManager)
</script>