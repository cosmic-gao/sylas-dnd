<template>
  <div id="id-0">id-0</div>
  <div id="id-1">id-1</div>
  <div id="id-2">id-2</div>
  <div id="p-id-0">p-id-0</div>
</template>

<script lang="ts" setup>
import DFlexBaseStore, { type RegisterInputProcessed } from "@dflex/store";
import { onMounted } from "vue";

class Store extends DFlexBaseStore {
  register(element: RegisterInputProcessed) {
    this.addElmToRegistry(element);
  }
}

const store = new Store();

const elm0DP0 = {
  id: "id-0",
  depth: 0,
  readonly: false,
  animation: null,
  CSSTransform: null,
};

const elm1DP0 = {
  id: "id-1",
  depth: 0,
  readonly: false,
  animation: null,
  CSSTransform: null,
};

const elm2DP0 = {
  id: "id-2",
  depth: 0,
  readonly: false,
  animation: null,
  CSSTransform: null,
};

const elm0DP1 = {
  id: "p-id-0",
  depth: 1,
  readonly: false,
  animation: null,
  CSSTransform: null,
};

onMounted(() => {
  [elm0DP0, elm1DP0, elm2DP0, elm0DP1].forEach((elm) => {
    store.register(elm);
  });

  console.log(store)
})
</script>
