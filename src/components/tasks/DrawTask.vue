<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  answered: boolean
}>()

const emit = defineEmits<{ submit: [] }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)

function getPos(e: MouseEvent | Touch) {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function startDraw(e: MouseEvent | TouchEvent) {
  if (props.answered) return
  isDrawing.value = true
  const point = 'touches' in e ? e.touches[0] : (e as MouseEvent)
  if (!point) return
  const pos = getPos(point)
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
}

function draw(e: MouseEvent | TouchEvent) {
  if (!isDrawing.value) return
  e.preventDefault()
  const point = 'touches' in e ? e.touches[0] : (e as MouseEvent)
  if (!point) return
  const pos = getPos(point)
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#ec4899'
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

function stopDraw() {
  isDrawing.value = false
}

function clearCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = canvas.offsetWidth
  canvas.height = 200
})

defineExpose({ clearCanvas })
</script>

<template>
  <div class="flex flex-col gap-3">
    <canvas
      ref="canvasRef"
      @mousedown="startDraw"
      @mousemove="draw"
      @mouseup="stopDraw"
      @mouseleave="stopDraw"
      @touchstart.prevent="startDraw"
      @touchmove.prevent="draw"
      @touchend.prevent="stopDraw"
      class="w-full touch-none rounded-2xl border-2 border-pink-200 bg-white dark:border-pink-900 dark:bg-gray-900"
      style="height: 200px"
    />
    <div v-if="!answered" class="flex gap-2">
      <button
        @click="clearCanvas"
        class="flex-1 rounded-xl border-2 border-pink-200 py-2 text-sm dark:border-pink-900"
      >
        Очистить
      </button>
      <button
        @click="emit('submit')"
        class="flex-1 rounded-xl bg-pink-500 py-2 text-sm font-bold text-white"
      >
        Готово
      </button>
    </div>
  </div>
</template>
