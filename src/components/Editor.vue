<template>
  <div class="editor">
    <Panel
      v-for="panel in panels"
      :key="panel.id"
      :panel="panel"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Panel from "./Panel.vue";
import { panels, createPanel } from "../store/panelStore";

export default defineComponent({
  name: "Editor",
  components: { Panel },
  setup() {
    // 初始化示例面板
    if (!panels.length) {
      panels.push(
        createPanel("Button"),
        createPanel("Input"),
        createPanel("Container")
      );
    }

    return { panels };
  },
});
</script>

<style scoped>
.editor {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  background-color: #eaeaea;
  min-height: 100vh;
}
</style>
