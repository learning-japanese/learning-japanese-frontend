<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import type { Session, Task } from '@/types'

const router = useRouter()
const queryClient = useQueryClient()

const session = ref<Session | null>(queryClient.getQueryData(['session']) ?? null)

if (!session.value) {
  router.push('/')
}

const currentTaskIndex = ref(0)
const answers = ref<Record<string, string>>({})
const selectedMultiple = ref<string[]>([])
const showResult = ref(false)

const currentTask = computed(() => session.value?.tasks[currentTaskIndex.value])

function handleAnswer() {
  if (!currentTask.value) return

  if (currentTask.value.type === 'multiple') {
    answers.value[currentTask.value.id] = selectedMultiple.value.join(',')
  }

  currentTaskIndex.value++
  selectedMultiple.value = []

  if (currentTaskIndex.value >= (session.value?.tasks.length ?? 0)) {
    showResult.value = true
  }
}

function toggleOption(option: string) {
  const idx = selectedMultiple.value.indexOf(option)
  if (idx >= 0) {
    selectedMultiple.value.splice(idx, 1)
  } else {
    selectedMultiple.value.push(option)
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 px-4 pt-8" v-if="currentTask">
    <div class="text-center">
      <p class="text-xs text-gray-400">
        {{ currentTaskIndex + 1 }} / {{ session?.tasks.length }}
      </p>
      <p class="mt-1 text-2xl font-bold">{{ currentTask.prompt }}</p>
    </div>

    <div v-if="currentTask.type === 'choice' && currentTask.options" class="flex flex-col gap-3">
      <button
        v-for="opt in currentTask.options"
        :key="opt"
        @click="answers[currentTask.id] = opt; handleAnswer()"
        class="rounded-xl border-2 border-pink-200 p-4 text-lg transition-all active:scale-95 dark:border-pink-900"
        :class="{ 'border-pink-500 bg-pink-50 dark:bg-pink-950/30': answers[currentTask.id] === opt }"
      >
        {{ opt }}
      </button>
    </div>

    <div v-else-if="currentTask.type === 'multiple' && currentTask.options" class="flex flex-col gap-3">
      <button
        v-for="opt in currentTask.options"
        :key="opt"
        @click="toggleOption(opt)"
        class="rounded-xl border-2 p-4 text-lg transition-all active:scale-95"
        :class="
          selectedMultiple.includes(opt)
            ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30'
            : 'border-gray-200 dark:border-gray-800'
        "
      >
        {{ opt }}
      </button>
      <button
        @click="handleAnswer"
        :disabled="selectedMultiple.length === 0"
        class="mt-2 rounded-xl bg-pink-500 py-3 font-bold text-white disabled:opacity-50"
      >
        Ответить
      </button>
    </div>

    <div v-else-if="currentTask.type === 'typing'" class="flex flex-col gap-4">
      <input
        v-model="answers[currentTask.id]"
        @keyup.enter="handleAnswer"
        placeholder="Введи ответ..."
        class="rounded-xl border-2 border-pink-200 p-4 text-lg outline-none focus:border-pink-500 dark:border-pink-900 dark:bg-transparent"
      />
      <button
        @click="handleAnswer"
        :disabled="!answers[currentTask.id]"
        class="rounded-xl bg-pink-500 py-3 font-bold text-white disabled:opacity-50"
      >
        Далее
      </button>
    </div>

    <div v-else-if="currentTask.type === 'translation'" class="flex flex-col gap-4">
      <input
        v-model="answers[currentTask.id]"
        @keyup.enter="handleAnswer"
        placeholder="Введи перевод..."
        class="rounded-xl border-2 border-pink-200 p-4 text-lg outline-none focus:border-pink-500 dark:border-pink-900 dark:bg-transparent"
      />
      <button
        @click="handleAnswer"
        :disabled="!answers[currentTask.id]"
        class="rounded-xl bg-pink-500 py-3 font-bold text-white disabled:opacity-50"
      >
        Далее
      </button>
    </div>
  </div>

  <div v-else-if="showResult" class="flex flex-col items-center gap-4 px-4 pt-16">
    <p class="text-lg">🎉 Занятие завершено!</p>
    <p class="text-sm text-gray-500">Проверка ответов пока в mock-режиме</p>
    <button
      @click="router.push('/')"
      class="rounded-xl bg-pink-500 px-8 py-3 font-bold text-white"
    >
      На главную
    </button>
  </div>
</template>
