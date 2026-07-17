<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import type { Task, TaskGroup, SavedSession } from '@/types'
import { useStartSession } from '@/requests/session'
import GapFillTask from '@/components/tasks/GapFillTask.vue'
import PictureChoiceTask from '@/components/tasks/PictureChoiceTask.vue'
import DragTask from '@/components/tasks/DragTask.vue'
import DrawTask from '@/components/tasks/DrawTask.vue'
import { speak } from '@/utils/speech'

const router = useRouter()
const route = useRoute()
const settings = useSettingsStore()

const { mutateAsync: startSession, isPending } = useStartSession()

const queue = ref<Task[]>([])
const currentIdx = ref(0)
const answered = ref(false)
const isCorrect = ref(false)
const retries = reactive<Record<string, number>>({})
const sessionsCompleted = ref(0)
const history = ref<number[]>([])
const handledLockedTasks = ref<Task[]>([])
const showGroupPicker = ref(false)
const groups = ref<TaskGroup[]>([])
const conversationText = ref('')

// --- Session persistence ---
function saveSession() {
  const data: SavedSession = {
    sessionId: route.query.session as string || 'manual',
    tasks: queue.value,
    currentIdx: currentIdx.value,
    history: history.value,
    retries: { ...retries },
    handledLocked: handledLockedTasks.value,
    shuffleTasks: false,
  }
  localStorage.setItem('active_session', JSON.stringify(data))
}

function restoreSession(): boolean {
  const raw = localStorage.getItem('active_session')
  if (!raw) return false
  try {
    const saved: SavedSession = JSON.parse(raw)
    queue.value = saved.tasks
    currentIdx.value = saved.currentIdx
    history.value = saved.history
    handledLockedTasks.value = saved.handledLocked
    for (const [k, v] of Object.entries(saved.retries)) retries[k] = v
    return true
  } catch { return false }
}

function clearSaved() {
  localStorage.removeItem('active_session')
}

// --- Load groups & handle session ---
onMounted(async () => {
  const res = await fetch('/api/v1/task-groups')
  groups.value = await res.json()

  // Try to restore session if URL has params
  if (route.query.session || route.query.task) {
    if (restoreSession()) return
  }
})

// --- Navigation ---
function updateUrl() {
  router.replace({
    query: { session: 'active', task: String(currentIdx.value) },
  })
}

async function start(groupId?: string) {
  const session = await startSession(groupId ? { groupId } : undefined)
  queue.value = [...session.tasks]

  if (settings.state.shuffleTasks) {
    for (let i = queue.value.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = queue.value[i]; const b = queue.value[j];
      if (a && b) { queue.value[i] = b; queue.value[j] = a }
    }
  }

  currentIdx.value = 0
  answered.value = false
  showGroupPicker.value = false
  updateUrl()
  saveSession()
}

function startNew() {
  showGroupPicker.value = true
}

function startGroup(group: TaskGroup) {
  showGroupPicker.value = false
  clearSaved()
  start(group.id)
}

// --- Task logic ---
const currentTask = () => queue.value[currentIdx.value]
const answer = ref('')
const selectedMultiple = ref<string[]>([])

function checkAnswer(): boolean {
  const task = currentTask()
  if (!task || task.type === 'draw' || task.type === 'conversation') return true
  let userAns: string
  if (task.type === 'multiple') {
    userAns = [...selectedMultiple.value].sort().join(',')
  } else if (['choice', 'gapfill', 'picture_choice'].includes(task.type)) {
    userAns = answer.value
  } else {
    userAns = answer.value.trim().toLowerCase()
  }
  const correct =
    task.type === 'multiple' || task.type === 'drag'
      ? [...task.correctAnswer.split(',').map(s => s.trim())].sort().join(',')
      : task.correctAnswer.toLowerCase()
  return userAns.toLowerCase() === correct
}

function submitAnswer() {
  if (answered.value) return
  const t = currentTask()
  if (!t) return
  if (t.type === 'draw' || t.type === 'conversation') {
    isCorrect.value = true; answered.value = true; return
  }
  if (['choice', 'gapfill', 'picture_choice'].includes(t.type) && !answer.value) return
  isCorrect.value = checkAnswer()
  answered.value = true
  if (!isCorrect.value) retries[t.id] = (retries[t.id] ?? 0) + 1
  saveSession()
}

function nextTask() {
  const task = currentTask()
  if (!task) return
  answered.value = false; answer.value = ''; selectedMultiple.value = []
  history.value.push(currentIdx.value)

  if (!isCorrect.value && task) {
    if ((retries[task.id] ?? 0) >= settings.state.maxRetries) {
      handledLockedTasks.value.push(task)
    } else {
      queue.value.push({ ...task })
    }
  }
  currentIdx.value++
  updateUrl()
  saveSession()
  if (currentIdx.value >= queue.value.length) {
    sessionsCompleted.value++; queue.value = []; clearSaved()
  }
}

function prevTask() {
  if (history.value.length === 0) return
  const prev = history.value.pop()
  if (prev == null) return
  currentIdx.value = prev; answered.value = false; answer.value = ''; selectedMultiple.value = []
  updateUrl()
}

function handleDragSubmit(value: string) {
  if (answered.value) return
  isCorrect.value = checkAnswer(); answered.value = true
  const task = currentTask()
  if (!isCorrect.value && task) retries[task.id] = (retries[task.id] ?? 0) + 1
  saveSession()
}

function resetAll() {
  sessionsCompleted.value = 0; queue.value = []; currentIdx.value = 0
  answered.value = false; history.value = []; conversationText.value = ''
  for (const k of Object.keys(retries)) delete retries[k]
  handledLockedTasks.value = []; clearSaved()
}

const showAnswer = computed(() =>
  settings.state.incorrectAction === 'show_answer' ||
  (settings.state.incorrectAction === 'show_hint' && !currentTask()?.hint),
)

const prevDisabled = computed(() => history.value.length === 0)
</script>

<template>
  <div class="flex flex-col gap-4 px-4 pt-8">
    <!-- Group picker modal -->
    <div v-if="showGroupPicker" class="fixed inset-0 z-50 flex items-end bg-black/40 pb-20" @click.self="showGroupPicker = false">
      <div class="mx-4 w-full max-w-lg rounded-2xl bg-white p-4 dark:bg-gray-900">
        <p class="mb-3 text-center text-lg font-bold">Выбери группу заданий</p>
        <div class="flex flex-col gap-2">
          <button
            v-for="g in groups"
            :key="g.id"
            @click="startGroup(g)"
            class="rounded-xl border-2 border-pink-200 p-3 text-left transition-all active:scale-[0.98] dark:border-pink-900"
          >
            <p class="font-bold">{{ g.name }}</p>
            <p class="text-xs text-gray-500">{{ g.description }} · {{ g.taskCount }} заданий</p>
          </button>
        </div>
        <button @click="showGroupPicker = false" class="mt-3 w-full rounded-xl py-2 text-sm text-gray-400">Отмена</button>
      </div>
    </div>

    <!-- Start / Complete screen -->
    <div v-if="queue.length === 0 && !isPending" class="flex flex-col items-center gap-4 pt-16">
      <p v-if="sessionsCompleted > 0" class="text-center text-lg font-bold">🎉 Занятие {{ sessionsCompleted }} завершено!</p>
      <p v-else class="text-center text-lg font-bold">Начни занятие</p>
      <p v-if="handledLockedTasks.length" class="text-sm text-pink-500">{{ handledLockedTasks.length }} заданий на повторение</p>
      <div class="flex gap-3">
        <button @click="resetAll(); startNew()" class="rounded-xl bg-pink-500 px-8 py-3 font-bold text-white shadow-lg">
          {{ sessionsCompleted > 0 ? 'Ещё занятие' : 'Группа заданий' }}
        </button>
        <button @click="resetAll(); start()" class="rounded-xl border-2 border-pink-200 px-6 py-3 font-bold dark:border-pink-900">
          Смешанные
        </button>
        <button v-if="sessionsCompleted > 0" @click="router.push('/')" class="rounded-xl border-2 border-pink-200 px-6 py-3 font-bold dark:border-pink-900">На главную</button>
      </div>
    </div>

    <div v-if="isPending" class="pt-16 text-center text-sm text-gray-400">Загрузка заданий...</div>

    <!-- Active task -->
    <template v-if="queue.length > 0">
      <div class="text-center">
        <p class="text-xs text-gray-400">{{ currentIdx + 1 }} / {{ queue.length }}</p>
        <p class="mt-1 text-xl font-bold">{{ currentTask()?.prompt }}</p>
        <p v-if="currentTask()?.hint && answered && !isCorrect && settings.state.incorrectAction === 'show_hint'" class="mt-2 text-sm text-pink-400">💡 {{ currentTask()?.hint }}</p>
      </div>

      <!-- Choice -->
      <div v-if="currentTask()?.type === 'choice' && currentTask()?.options" class="flex flex-col gap-3">
        <button v-for="opt in currentTask()!.options!" :key="opt" :disabled="answered"
          @click="answer = opt; submitAnswer()"
          class="rounded-xl border-2 p-4 text-lg transition-all disabled:cursor-not-allowed"
          :class="!answered ? 'border-pink-200 dark:border-pink-900 active:scale-95'
            : answer === opt ? (isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-950/30' : 'border-red-400 bg-red-50 dark:bg-red-950/30')
            : opt === currentTask()?.correctAnswer && showAnswer ? 'border-green-400 bg-green-50/50 dark:bg-green-950/20'
            : 'border-gray-200 opacity-50 dark:border-gray-800'"
        >{{ opt }}</button>
      </div>

      <!-- Multiple -->
      <div v-else-if="currentTask()?.type === 'multiple' && currentTask()?.options" class="flex flex-col gap-3">
        <button v-for="opt in currentTask()!.options!" :key="opt" :disabled="answered"
          @click="!answered ? (selectedMultiple.includes(opt) ? selectedMultiple.splice(selectedMultiple.indexOf(opt), 1) : selectedMultiple.push(opt)) : undefined"
          class="rounded-xl border-2 p-4 text-lg transition-all disabled:cursor-not-allowed"
          :class="selectedMultiple.includes(opt) ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30' : 'border-gray-200 dark:border-gray-800'"
        >{{ opt }}</button>
        <button v-if="!answered" :disabled="selectedMultiple.length === 0" @click="submitAnswer()"
          class="mt-2 rounded-xl bg-pink-500 py-3 font-bold text-white disabled:opacity-50">Ответить</button>
      </div>

      <!-- GapFill -->
      <div v-else-if="currentTask()?.type === 'gapfill' && currentTask()?.options">
        <GapFillTask v-model="answer" :options="currentTask()!.options!" :answered="answered" :show-answer="showAnswer"
          :correct-answer="currentTask()!.correctAnswer" @submit="submitAnswer()" />
      </div>

      <!-- Picture Choice -->
      <div v-else-if="currentTask()?.type === 'picture_choice' && currentTask()?.options">
        <PictureChoiceTask v-model="answer" :prompt="currentTask()!.prompt" :options="currentTask()!.options!"
          :answered="answered" :show-answer="showAnswer" :correct-answer="currentTask()!.correctAnswer" @submit="submitAnswer()" />
      </div>

      <!-- Drag -->
      <div v-else-if="currentTask()?.type === 'drag'">
        <DragTask :slots="currentTask()!.slots ?? ['___','___','___']" :options="currentTask()!.options!"
          :answered="answered" :correct-answer="currentTask()!.correctAnswer" @submit="handleDragSubmit" />
      </div>

      <!-- Draw -->
      <div v-else-if="currentTask()?.type === 'draw'">
        <DrawTask :answered="answered" @submit="submitAnswer()" />
      </div>

      <!-- Conversation -->
      <div v-else-if="currentTask()?.type === 'conversation'" class="flex flex-col gap-4">
        <button @click="speak('こんにちは、私は学生です。よろしくお願いします。')"
          class="self-start rounded-xl bg-pink-100 px-4 py-2 text-sm dark:bg-pink-950/30">🔊 Прослушать пример</button>
        <textarea v-model="conversationText" :disabled="answered"
          placeholder="Напиши по-японски..."
          class="min-h-[120px] rounded-xl border-2 border-pink-200 p-4 text-lg outline-none focus:border-pink-500 disabled:cursor-not-allowed dark:border-pink-900 dark:bg-transparent"
          :class="answered ? (isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : ''"
        />
        <button v-if="!answered" @click="submitAnswer()" :disabled="!conversationText.trim()"
          class="rounded-xl bg-pink-500 py-3 font-bold text-white disabled:opacity-50">Готово</button>
      </div>

      <!-- Typing / Translation -->
      <div v-else-if="['typing','translation'].includes(currentTask()?.type ?? '')" class="flex flex-col gap-4">
        <button v-if="currentTask()?.type === 'translation'"
          @click="speak('ありがとうございます')"
          class="self-start rounded-xl bg-pink-100 px-4 py-2 text-sm dark:bg-pink-950/30">🔊 Озвучить</button>
        <input v-model="answer" :disabled="answered" @keyup.enter="!answered && submitAnswer()"
          :placeholder="currentTask()?.type === 'translation' ? 'Введи перевод...' : 'Введи ответ...'"
          class="rounded-xl border-2 p-4 text-lg outline-none disabled:cursor-not-allowed"
          :class="answered ? (isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-950/30' : 'border-red-400 bg-red-50 dark:bg-red-950/30') : 'border-pink-200 focus:border-pink-500 dark:border-pink-900 dark:bg-transparent'" />
        <button v-if="!answered" :disabled="!answer.trim()" @click="submitAnswer()"
          class="rounded-xl bg-pink-500 py-3 font-bold text-white disabled:opacity-50">Проверить</button>
      </div>

      <!-- Feedback + Nav -->
      <div v-if="answered" class="space-y-3">
        <div class="rounded-xl p-3 text-sm"
          :class="isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300'">
          <p class="font-bold">{{ isCorrect ? '✅ Верно!' : '❌ Неверно' }}</p>
          <p v-if="!isCorrect && showAnswer && currentTask()" class="mt-1">Правильный ответ: <strong>{{ currentTask()?.correctAnswer }}</strong></p>
          <p v-if="currentTask()?.explanation" class="mt-1 text-gray-600 dark:text-gray-400">{{ currentTask()?.explanation }}</p>
        </div>
        <div class="flex gap-2">
          <button :disabled="prevDisabled" @click="prevTask"
            class="flex-1 rounded-xl border-2 border-pink-200 py-3 font-medium transition-all disabled:opacity-30 dark:border-pink-900">← Назад</button>
          <button @click="nextTask"
            class="flex-1 rounded-xl bg-pink-500 py-3 font-bold text-white">{{ currentIdx < queue.length - 1 ? 'Далее →' : 'Завершить' }}</button>
        </div>
      </div>
    </template>
  </div>
</template>
