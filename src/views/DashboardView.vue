<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfile } from '@/requests/profile'
import { useRouter } from 'vue-router'
import type { DashboardSummary } from '@/types'

const { data: profile } = useProfile()
const router = useRouter()
const summary = ref<DashboardSummary | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/v1/dashboard')
    summary.value = await res.json()
  } catch {}
})

function goToSession() {
  router.push('/session')
}

function goToStats() {
  router.push('/stats')
}
</script>

<template>
  <div class="flex flex-col gap-4 px-4 pt-8">
    <div v-if="profile" class="text-center">
      <h1 class="text-2xl font-bold">おはよう!</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ profile.name }}</p>
    </div>

    <!-- Quick stats -->
    <div v-if="summary" class="grid grid-cols-4 gap-2">
      <div class="rounded-2xl bg-pink-100 p-3 text-center dark:bg-pink-950/30">
        <p class="text-lg font-bold text-pink-500">{{ summary.todayMinutes }}</p>
        <p class="text-xs text-gray-500">мин сегодня</p>
      </div>
      <div class="rounded-2xl bg-pink-100 p-3 text-center dark:bg-pink-950/30">
        <p class="text-lg font-bold text-pink-500">{{ summary.todayTasks }}</p>
        <p class="text-xs text-gray-500">заданий</p>
      </div>
      <div class="rounded-2xl bg-pink-100 p-3 text-center dark:bg-pink-950/30">
        <p class="text-lg font-bold text-pink-500">{{ summary.todayAccuracy }}%</p>
        <p class="text-xs text-gray-500">точность</p>
      </div>
      <div class="rounded-2xl bg-pink-100 p-3 text-center dark:bg-pink-950/30">
        <p class="text-lg font-bold text-pink-500">{{ summary.streakDays }}</p>
        <p class="text-xs text-gray-500">дней 🔥</p>
      </div>
    </div>

    <!-- Kana progress -->
    <div v-if="profile" class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <p class="text-sm font-medium">Прогресс азбуки</p>
      <div class="mt-2 space-y-2">
        <div>
          <div class="flex justify-between text-xs">
            <span>Хирагана</span><span>{{ profile.kanaProgress.hiragana }}%</span>
          </div>
          <div class="mt-1 h-2 overflow-hidden rounded-full bg-pink-200 dark:bg-pink-900">
            <div class="h-full rounded-full bg-pink-500 transition-all" :style="{ width: `${profile.kanaProgress.hiragana}%` }" />
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs">
            <span>Катакана</span><span>{{ profile.kanaProgress.katakana }}%</span>
          </div>
          <div class="mt-1 h-2 overflow-hidden rounded-full bg-pink-200 dark:bg-pink-900">
            <div class="h-full rounded-full bg-pink-500 transition-all" :style="{ width: `${profile.kanaProgress.katakana}%` }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-col gap-3 pt-4">
      <button
        @click="goToSession"
        class="w-full rounded-2xl bg-pink-500 py-4 text-lg font-bold text-white shadow-lg shadow-pink-500/30 transition-all active:scale-[0.98]"
      >
        {{ summary?.hasActiveSession ? 'Продолжить занятие' : 'Начать занятия' }}
      </button>

      <button
        @click="goToStats"
        class="w-full rounded-2xl border-2 border-pink-200 py-3 text-sm font-medium transition-all active:scale-[0.98] dark:border-pink-900"
      >
        📊 Смотреть статистику
      </button>
    </div>
  </div>
</template>
