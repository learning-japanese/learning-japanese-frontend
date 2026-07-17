<script setup lang="ts">
import { useProfile, useStartSession } from '@/api'
import { useRouter } from 'vue-router'

const { data: profile } = useProfile()
const { mutate: startSession, isPending } = useStartSession()
const router = useRouter()

function handleStart() {
  startSession(undefined, {
    onSuccess: () => router.push('/session'),
  })
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 px-4 pt-8">
    <div v-if="profile" class="w-full max-w-md space-y-4">
      <div class="text-center">
        <h1 class="text-2xl font-bold">おはよう!</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ profile.name }}</p>
      </div>

      <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
        <p class="text-sm font-medium">Прогресс азбуки</p>
        <div class="mt-2 space-y-2">
          <div>
            <div class="flex justify-between text-xs">
              <span>Хирагана</span>
              <span>{{ profile.kanaProgress.hiragana }}%</span>
            </div>
            <div class="mt-1 h-2 overflow-hidden rounded-full bg-pink-200 dark:bg-pink-900">
              <div
                class="h-full rounded-full bg-pink-500 transition-all"
                :style="{ width: `${profile.kanaProgress.hiragana}%` }"
              />
            </div>
          </div>
          <div>
            <div class="flex justify-between text-xs">
              <span>Катакана</span>
              <span>{{ profile.kanaProgress.katakana }}%</span>
            </div>
            <div class="mt-1 h-2 overflow-hidden rounded-full bg-pink-200 dark:bg-pink-900">
              <div
                class="h-full rounded-full bg-pink-500 transition-all"
                :style="{ width: `${profile.kanaProgress.katakana}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ profile.streakDays }}</p>
          <p>дней подряд</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ profile.totalStudyMinutes }}</p>
          <p>минут всего</p>
        </div>
      </div>
    </div>

    <div class="fixed inset-0 flex items-center justify-center px-8" v-if="!profile">
      <p class="text-sm text-gray-400">Загрузка...</p>
    </div>

    <div class="mt-auto w-full max-w-md pb-8">
      <button
        @click="handleStart"
        :disabled="isPending"
        class="w-full rounded-2xl bg-pink-500 py-4 text-lg font-bold text-white shadow-lg shadow-pink-500/30 transition-all active:scale-95 disabled:opacity-50"
      >
        {{ isPending ? 'Загрузка...' : 'Начать занятия' }}
      </button>
    </div>
  </div>
</template>
