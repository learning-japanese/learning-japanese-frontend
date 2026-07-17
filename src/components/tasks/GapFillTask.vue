<script setup lang="ts">
defineProps<{
  options: string[]
  answered: boolean
  showAnswer: boolean
  correctAnswer: string
}>()

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <button
      v-for="opt in options"
      :key="opt"
      :disabled="answered"
      @click="model = opt; !answered && emit('submit')"
      class="rounded-xl border-2 p-4 text-lg transition-all disabled:cursor-not-allowed"
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
</template>
