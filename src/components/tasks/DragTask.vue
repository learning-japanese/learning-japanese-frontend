<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  slots: string[]
  options: string[]
  answered: boolean
  correctAnswer: string
}>()

const emit = defineEmits<{ submit: [value: string] }>()

const placed = ref<string[]>(props.slots.map(() => ''))
const remaining = ref<string[]>([...props.options])

function placeWord(word: string) {
  if (props.answered) return
  const empty = placed.value.findIndex((s) => !s)
  if (empty === -1) return
  placed.value[empty] = word
  remaining.value = remaining.value.filter((w) => w !== word)
  if (placed.value.every((s) => s)) {
    emit('submit', placed.value.join(','))
  }
}

function removeWord(idx: number) {
  if (props.answered) return
  const word = placed.value[idx]
  if (!word) return
  placed.value[idx] = ''
  remaining.value.push(word)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap justify-center gap-2">
      <div
        v-for="(slot, i) in slots"
        :key="i"
        @click="removeWord(i)"
        class="flex min-w-16 items-center justify-center rounded-xl border-2 border-dashed p-3 text-lg transition-all"
        :class="
          placed[i]
            ? answered
              ? correctAnswer.split(',').includes(placed[i])
                ? 'border-green-400 bg-green-50 dark:bg-green-950/30'
                : 'border-red-400 bg-red-50 dark:bg-red-950/30'
              : 'border-pink-300 bg-pink-50 dark:border-pink-700 dark:bg-pink-950/30'
            : 'border-gray-300 dark:border-gray-700'
        "
      >
        {{ placed[i] || '___' }}
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="word in remaining"
        :key="word"
        :disabled="answered"
        @click="placeWord(word)"
        class="rounded-xl border-2 border-pink-200 px-4 py-2 text-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 dark:border-pink-900"
      >
        {{ word }}
      </button>
    </div>

    <p v-if="!answered && placed.every((s) => s)" class="text-center text-xs text-gray-400">
      Нажми на слово в строке, чтобы убрать
    </p>
  </div>
</template>
