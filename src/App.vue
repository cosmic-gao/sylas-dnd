<template>
  <div id="1">dom-gen</div>
</template>

<script lang="ts" setup>
import Generator from "@dflex/dom-gen"

const domGen = new Generator()
domGen.register('1', 0, false)

console.log(domGen)
</script>
