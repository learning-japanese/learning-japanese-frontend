<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import type { IncorrectAction } from '@/types'

const settings = useSettingsStore()

const levelOptions = ['Начинающий', 'Выживающий', 'Средний', 'Продвинутый']
const actionOptions: { value: IncorrectAction; label: string }[] = [
  { value: 'show_answer', label: 'Показать правильный ответ' },
  { value: 'show_hint', label: 'Показать подсказку' },
  { value: 'nothing', label: 'Ничего не делать' },
]
</script>

<template>
  <div class="flex flex-col gap-6 px-4 pt-8 pb-8">
    <h1 class="text-center text-2xl font-bold">⚙️ Настройки</h1>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <label class="text-sm font-medium">Твой уровень</label>
      <select v-model="settings.state.level"
        class="mt-2 w-full rounded-xl border-2 border-pink-200 bg-white p-3 text-sm outline-none focus:border-pink-500 dark:border-pink-900 dark:bg-transparent">
        <option v-for="lvl in levelOptions" :key="lvl">{{ lvl }}</option>
      </select>
    </div>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <label class="text-sm font-medium">Стиль общения AI</label>
      <select v-model="settings.state.aiStyle"
        class="mt-2 w-full rounded-xl border-2 border-pink-200 bg-white p-3 text-sm outline-none focus:border-pink-500 dark:border-pink-900 dark:bg-transparent">
        <option>Дружелюбный</option>
        <option>Ласковый (waifu)</option>
        <option>Строгий учитель</option>
      </select>
    </div>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <label class="text-sm font-medium">При неверном ответе</label>
      <select v-model="settings.state.incorrectAction"
        class="mt-2 w-full rounded-xl border-2 border-pink-200 bg-white p-3 text-sm outline-none focus:border-pink-500 dark:border-pink-900 dark:bg-transparent">
        <option v-for="opt in actionOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <label class="text-sm font-medium">Попыток до блокировки: {{ settings.state.maxRetries }}</label>
      <input v-model.number="settings.state.maxRetries" type="range" min="1" max="10" class="mt-2 w-full accent-pink-500" />
      <div class="mt-1 flex justify-between text-xs text-gray-400"><span>1</span><span>10</span></div>
    </div>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <label class="text-sm font-medium">Совпадение для рисования: {{ settings.state.drawMatchThreshold }}%</label>
      <input v-model.number="settings.state.drawMatchThreshold" type="range" min="10" max="100" step="5" class="mt-2 w-full accent-pink-500" />
      <div class="mt-1 flex justify-between text-xs text-gray-400"><span>10%</span><span>100%</span></div>
    </div>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Порядок заданий</p>
          <p class="text-xs text-gray-400">Перемешивать задания в сессии</p>
        </div>
        <label class="relative inline-flex h-6 w-11 cursor-pointer items-center">
          <input v-model="settings.state.shuffleTasks" type="checkbox" class="peer sr-only" />
          <div class="h-6 w-11 rounded-full bg-pink-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-pink-500 peer-checked:after:translate-x-5" />
        </label>
      </div>
    </div>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">AI может менять настройки</p>
          <p class="text-xs text-gray-400">ИИ подстраивает сложность</p>
        </div>
        <label class="relative inline-flex h-6 w-11 cursor-pointer items-center">
          <input v-model="settings.state.aiCanOverride" type="checkbox" class="peer sr-only" />
          <div class="h-6 w-11 rounded-full bg-pink-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-pink-500 peer-checked:after:translate-x-5" />
        </label>
      </div>
    </div>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Напоминания</p>
          <p class="text-xs text-gray-400">Уведомления о занятиях</p>
        </div>
        <label class="relative inline-flex h-6 w-11 cursor-pointer items-center">
          <input v-model="settings.state.notifications" type="checkbox" class="peer sr-only" />
          <div class="h-6 w-11 rounded-full bg-pink-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-pink-500 peer-checked:after:translate-x-5" />
        </label>
      </div>
    </div>
  </div>
</template>
