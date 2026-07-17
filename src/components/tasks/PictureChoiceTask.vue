<script setup lang="ts">
defineProps<{
  prompt: string
  options: string[]
  answered: boolean
  showAnswer: boolean
  correctAnswer: string
}>()

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-center rounded-2xl bg-pink-50 py-8 text-6xl dark:bg-pink-950/20">
      {{ prompt.slice(prompt.indexOf('🏀'), prompt.indexOf('🏀') + 2) || '🖼️' }}
    </div>
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="opt in options"
        :key="opt"
        :disabled="answered"
        @click="model = opt; !answered && emit('submit')"
        class="rounded-xl border-2 p-4 text-center text-lg transition-all disabled:cursor-not-allowed"
        :class="[
          !answered
            ? 'border-pink-200 dark:border-pink-900 active:scale-95'
            : model === opt
              ? model === correctAnswer
                ? 'border-green-400 bg-green-50 dark:bg-green-950/30'
                : 'border-red-400 bg-red-50 dark:bg-red-950/30'
              : opt === correctAnswer && showAnswer
                ? 'border-green-400 bg-green-50/50 dark:bg-green-950/20'
                : 'border-gray-200 opacity-50 dark:border-gray-800',
        ]"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>
