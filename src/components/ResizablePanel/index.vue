<template>
  <div class="resizable-container" ref="container">
    <div class="resizable-panel first-panel" :style="{ [sizeProperty]: firstPanelSize }">
      <slot name="first"></slot>
    </div>
    <div class="resizer" :class="[resizerClass]" @mousedown="startResize"></div>
    <div class="resizable-panel second-panel" :style="{ [sizeProperty]: secondPanelSize }">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  direction: {
    type: String,
    default: 'horizontal', // 'horizontal' 或 'vertical'
    validator: value => ['horizontal', 'vertical'].includes(value)
  },
  initialSize: {
    type: Number,
    default: 50 // 百分比
  }
})

const container = ref(null)
const isResizing = ref(false)
const startPosition = ref(0)
const startSize = ref(0)

const sizeProperty = computed(() => (props.direction === 'horizontal' ? 'width' : 'height'))

const resizerClass = computed(() => (props.direction === 'horizontal' ? 'resizer-horizontal' : 'resizer-vertical'))

const firstPanelSize = ref(`${props.initialSize}%`)
const secondPanelSize = ref(`${100 - props.initialSize}%`)

const startResize = e => {
  isResizing.value = true
  startPosition.value = props.direction === 'horizontal' ? e.clientX : e.clientY
  startSize.value = parseFloat(firstPanelSize.value)

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = e => {
  if (!isResizing.value) return

  const containerRect = container.value.getBoundingClientRect()
  const containerSize = props.direction === 'horizontal' ? containerRect.width : containerRect.height

  const currentPosition = props.direction === 'horizontal' ? e.clientX : e.clientY

  const delta = currentPosition - startPosition.value
  const newSize = startSize.value + (delta / containerSize) * 100

  // 限制最小和最大尺寸
  const clampedSize = Math.max(10, Math.min(90, newSize))

  firstPanelSize.value = `${clampedSize}%`
  secondPanelSize.value = `${100 - clampedSize}%`
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.resizable-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.resizable-panel {
  overflow: auto;
}

.first-panel {
  background-color: #f5f5f5;
}

.second-panel {
  background-color: #e5e5e5;
}

.resizer {
  background-color: #c1c1c1;
  z-index: 1;
}

.resizer-horizontal {
  width: 5px;
  height: 100%;
  cursor: col-resize;
}

.resizer-vertical {
  height: 5px;
  width: 100%;
  cursor: row-resize;
}

.resizer:hover {
  background-color: #a1a1a1;
}
</style>
