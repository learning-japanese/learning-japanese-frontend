<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import type { Task } from '@/types'
import { useStartSession } from '@/requests/session'
import GapFillTask from '@/components/tasks/GapFillTask.vue'
import PictureChoiceTask from '@/components/tasks/PictureChoiceTask.vue'
import DragTask from '@/components/tasks/DragTask.vue'
import DrawTask from '@/components/tasks/DrawTask.vue'

const router = useRouter()
const settings = useSettingsStore()

const { mutateAsync: startSession, isPending } = useStartSession()
const queue = ref<Task[]>([])
const currentIdx = ref(0)
const answered = ref(false)
const isCorrect = ref(false)
const retries = reactive<Record<string, number>>({})
const sessionsCompleted = ref(0)
const history = ref<number[]>([])

async function start() {
  const session = await startSession()
  queue.value = [...session.tasks]
  currentIdx.value = 0
  answered.value = false
}

const currentTask = () => queue.value[currentIdx.value]

const answer = ref('')
const selectedMultiple = ref<string[]>([])

function checkAnswer(): boolean {
  const task = currentTask()
  if (!task) return false
  if (task.type === 'draw') return true

  let userAns: string
  if (task.type === 'multiple') {
    userAns = [...selectedMultiple.value].sort().join(',')
  } else if (
    task.type === 'choice' ||
    task.type === 'gapfill' ||
    task.type === 'picture_choice'
  ) {
    userAns = answer.value
  } else {
    userAns = answer.value.trim().toLowerCase()
  }

  const correctNormalized =
    task.type === 'multiple' || task.type === 'drag'
      ? [...task.correctAnswer.split(',').map((s) => s.trim())].sort().join(',')
      : task.correctAnswer.toLowerCase()

  return userAns.toLowerCase() === correctNormalized
}

function submitAnswer() {
  if (answered.value) return

  if (currentTask()?.type === 'draw') {
    isCorrect.value = true
    answered.value = true
    return
  }

  if (
    currentTask()?.type === 'choice' ||
    currentTask()?.type === 'gapfill' ||
    currentTask()?.type === 'picture_choice'
  ) {
    if (!answer.value) return
  }

  isCorrect.value = checkAnswer()
  answered.value = true

  const task = currentTask()
  if (!isCorrect.value && task) {
    retries[task.id] = (retries[task.id] ?? 0) + 1
  }
}

function nextTask() {
  const task = currentTask()
  if (!task) return
  answered.value = false
  answer.value = ''
  selectedMultiple.value = []
  history.value.push(currentIdx.value)

  if (!isCorrect.value) {
    if ((retries[task.id] ?? 0) >= settings.state.maxRetries) {
      handledLockedTasks.value.push(task)
    } else {
      queue.value.push({ ...task })
    }
  }

  currentIdx.value++
  if (currentIdx.value >= queue.value.length) {
    sessionsCompleted.value++
    queue.value = []
  }
}

function prevTask() {
  if (history.value.length === 0) return
  const prev = history.value.pop()
  if (prev == null) return
  currentIdx.value = prev
  answered.value = false
  answer.value = ''
  selectedMultiple.value = []
}

function handleDragSubmit(value: string) {
  if (answered.value) return
  isCorrect.value = checkAnswer()
  answered.value = true
  const task = currentTask()
  if (!isCorrect.value && task) {
    retries[task.id] = (retries[task.id] ?? 0) + 1
  }
}

const handledLockedTasks = ref<Task[]>([])

function resetAll() {
  sessionsCompleted.value = 0
  queue.value = []
  currentIdx.value = 0
  answered.value = false
  history.value = []
  for (const key of Object.keys(retries)) delete retries[key]
  handledLockedTasks.value = []
}

const showAnswer = computed(
  () =>
    settings.state.incorrectAction === 'show_answer' ||
    (settings.state.incorrectAction === 'show_hint' && !currentTask()?.hint),
)

const prevDisabled = computed(() => history.value.length === 0)
</script>

<template>
  <div class="flex flex-col gap-4 px-4 pt-8">
    <!-- Start screen -->
    <div v-if="queue.length === 0 && !isPending" class="flex flex-col items-center gap-4 pt-16">
      <p v-if="sessionsCompleted > 0" class="text-center text-lg font-bold">
        🎉 Занятие {{ sessionsCompleted }} завершено!
      </p>
      <p v-else class="text-center text-lg font-bold">Начни занятие</p>
      <p v-if="handledLockedTasks.length" class="text-sm text-pink-500">
        {{ handledLockedTasks.length }} заданий на повторение
      </p>
      <div class="flex gap-3">
        <button
          @click="resetAll(); start()"
          class="rounded-xl bg-pink-500 px-8 py-3 font-bold text-white shadow-lg"
        >
          {{ sessionsCompleted > 0 ? 'Ещё занятие' : 'Начать' }}
        </button>
        <button
          v-if="sessionsCompleted > 0"
          @click="router.push('/')"
          class="rounded-xl border-2 border-pink-200 px-6 py-3 font-bold dark:border-pink-900"
        >
          На главную
        </button>
      </div>
    </div>

    <div v-if="isPending" class="pt-16 text-center text-sm text-gray-400">Загрузка заданий...</div>

    <!-- Active task -->
    <template v-if="queue.length > 0">
      <div class="text-center">
        <p class="text-xs text-gray-400">{{ currentIdx + 1 }} / {{ queue.length }}</p>
        <p class="mt-1 text-xl font-bold">{{ currentTask()?.prompt }}</p>
        <p
          v-if="
            currentTask()?.hint &&
            answered &&
            !isCorrect &&
            settings.state.incorrectAction === 'show_hint'
          "
          class="mt-2 text-sm text-pink-400"
        >
          💡 {{ currentTask()?.hint }}
        </p>
      </div>

      <!-- Choice -->
      <div
        v-if="currentTask()?.type === 'choice' && currentTask()?.options"
        class="flex flex-col gap-3"
      >
        <button
          v-for="opt in currentTask()!.options!"
          :key="opt"
          :disabled="answered"
          @click="answer = opt; submitAnswer()"
          class="rounded-xl border-2 p-4 text-lg transition-all disabled:cursor-not-allowed"
          :class="[
            !answered
              ? 'border-pink-200 dark:border-pink-900 active:scale-95'
              : answer === opt
                ? isCorrect
                  ? 'border-green-400 bg-green-50 dark:bg-green-950/30'
                  : 'border-red-400 bg-red-50 dark:bg-red-950/30'
                : opt === currentTask()?.correctAnswer && showAnswer
                  ? 'border-green-400 bg-green-50/50 dark:bg-green-950/20'
                  : 'border-gray-200 opacity-50 dark:border-gray-800',
          ]"
        >
          {{ opt }}
        </button>
      </div>

      <!-- Multiple -->
      <div
        v-else-if="currentTask()?.type === 'multiple' && currentTask()?.options"
        class="flex flex-col gap-3"
      >
        <button
          v-for="opt in currentTask()!.options!"
          :key="opt"
          :disabled="answered"
          @click="
            !answered
              ? selectedMultiple.includes(opt)
                ? selectedMultiple.splice(selectedMultiple.indexOf(opt), 1)
                : selectedMultiple.push(opt)
              : undefined
          "
          class="rounded-xl border-2 p-4 text-lg transition-all disabled:cursor-not-allowed"
          :class="[
            selectedMultiple.includes(opt)
              ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30'
              : 'border-gray-200 dark:border-gray-800',
          ]"
        >
          {{ opt }}
        </button>
        <button
          v-if="!answered"
          :disabled="selectedMultiple.length === 0"
          @click="submitAnswer()"
          class="mt-2 rounded-xl bg-pink-500 py-3 font-bold text-white disabled:opacity-50"
        >
          Ответить
        </button>
      </div>

      <!-- GapFill -->
      <div v-else-if="currentTask()?.type === 'gapfill' && currentTask()?.options">
        <GapFillTask
          v-model="answer"
          :options="currentTask()!.options!"
          :answered="answered"
          :show-answer="showAnswer"
          :correct-answer="currentTask()!.correctAnswer"
          @submit="submitAnswer()"
        />
      </div>

      <!-- Picture Choice -->
      <div v-else-if="currentTask()?.type === 'picture_choice' && currentTask()?.options">
        <PictureChoiceTask
          v-model="answer"
          :prompt="currentTask()!.prompt"
          :options="currentTask()!.options!"
          :answered="answered"
          :show-answer="showAnswer"
          :correct-answer="currentTask()!.correctAnswer"
          @submit="submitAnswer()"
        />
      </div>

      <!-- Drag -->
      <div v-else-if="currentTask()?.type === 'drag'">
        <DragTask
          :slots="currentTask()!.slots ?? ['___', '___', '___']"
          :options="currentTask()!.options!"
          :answered="answered"
          :correct-answer="currentTask()!.correctAnswer"
          @submit="handleDragSubmit"
        />
      </div>

      <!-- Draw -->
      <div v-else-if="currentTask()?.type === 'draw'">
        <DrawTask ref="drawRef" :answered="answered" @submit="submitAnswer()" />
      </div>

      <!-- Typing / Translation -->
      <div
        v-else-if="
          currentTask()?.type === 'typing' || currentTask()?.type === 'translation'
        "
        class="flex flex-col gap-4"
      >
        <input
          v-model="answer"
          :disabled="answered"
          @keyup.enter="!answered && submitAnswer()"
          :placeholder="
            currentTask()?.type === 'translation' ? 'Введи перевод...' : 'Введи ответ...'
          "
          class="rounded-xl border-2 p-4 text-lg outline-none disabled:cursor-not-allowed"
          :class="
            answered
              ? isCorrect
                ? 'border-green-400 bg-green-50 dark:bg-green-950/30'
                : 'border-red-400 bg-red-50 dark:bg-red-950/30'
              : 'border-pink-200 focus:border-pink-500 dark:border-pink-900 dark:bg-transparent'
          "
        />
        <button
          v-if="!answered"
          :disabled="!answer.trim()"
          @click="submitAnswer()"
          class="rounded-xl bg-pink-500 py-3 font-bold text-white disabled:opacity-50"
        >
          Проверить
        </button>
      </div>

      <!-- Feedback + Nav -->
      <div v-if="answered" class="space-y-3">
        <div
          class="rounded-xl p-3 text-sm"
          :class="
            isCorrect
              ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300'
          "
        >
          <p class="font-bold">{{ isCorrect ? '✅ Верно!' : '❌ Неверно' }}</p>
          <p v-if="!isCorrect && showAnswer && currentTask()" class="mt-1">
            Правильный ответ: <strong>{{ currentTask()?.correctAnswer }}</strong>
          </p>
          <p v-if="currentTask()?.explanation" class="mt-1 text-gray-600 dark:text-gray-400">
            {{ currentTask()?.explanation }}
          </p>
        </div>

        <div class="flex gap-2">
          <button
            :disabled="prevDisabled"
            @click="prevTask"
            class="flex-1 rounded-xl border-2 border-pink-200 py-3 font-medium transition-all disabled:opacity-30 dark:border-pink-900"
          >
            ← Назад
          </button>
          <button
            @click="nextTask"
            class="flex-1 rounded-xl bg-pink-500 py-3 font-bold text-white"
          >
            {{ currentIdx < queue.length - 1 ? 'Далее →' : 'Завершить' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
