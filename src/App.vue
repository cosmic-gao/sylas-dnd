<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter'

type DroppedData = {
  type: 'file' | 'text'
  name?: string
  size?: number
  text?: string
}

const dropZoneRef = ref<HTMLDivElement | null>(null)
const isActive = ref(false)
const data = ref<DroppedData | null>(null)

let cleanup: (() => void) | null = null

onMounted(() => {
  const element = dropZoneRef.value
  if (!element) return

  cleanup = dropTargetForExternal({
    element,

    onDragEnter() {
      isActive.value = true
    },

    onDragLeave() {
      isActive.value = false
    },

    async onDrop({ source }:any) {
      console.log(source, "source")
      isActive.value = false

      // 拖入文件
      if (source.files && source.files.length > 0) {
        const file = source.files[0]
        data.value = {
          type: 'file',
          name: file.name,
          size: file.size,
        }

        // 如果是文本文件，读取内容
        if (file.type.startsWith('text/')) {
          const text = await file.text()
          data.value.text = text
        }
        return
      }

      // 拖入文本
      if (source.types.includes('text/plain')) {
        const text = await source.getText()
        data.value = {
          type: 'text',
          text,
        }
        return
      }

      data.value = {
        type: 'text',
        text: '未知内容类型。',
      }
    },
  })
})

onBeforeUnmount(() => {
  if (cleanup) cleanup()
})
</script>

<template>
  <div
    ref="dropZoneRef"
    :style="{
      border: `3px dashed ${isActive ? '#2196f3' : '#aaa'}`,
      borderRadius: '12px',
      padding: '60px',
      textAlign: 'center',
      backgroundColor: isActive ? '#e3f2fd' : '#fafafa',
      transition: 'all 0.2s ease',
    }"
  >
    <h2>拖拽文件或文字到这里 👇</h2>

    <div v-if="data" style="margin-top: 20px; text-align: left;">
      <strong>接收到的数据：</strong>
      <pre
        style="
          background: #eee;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
        "
      >
{{ JSON.stringify(data, null, 2) }}
      </pre>
    </div>

    <p v-else>支持拖入：文件 / 文本（例如从其他网页选中文字拖动进来）</p>
  </div>
</template>
