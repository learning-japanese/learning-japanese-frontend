<script setup lang="ts">
import { useStats } from '@/requests/stats'

const { data: stats } = useStats()
</script>

<template>
  <div class="flex flex-col gap-4 px-4 pt-8">
    <h1 class="text-center text-2xl font-bold">📊 Статистика</h1>

    <div v-if="stats" class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <p class="text-sm">Недельный прогресс (mock)</p>
      <!-- Тут будут графики Chart.js -->
    </div>
    <p v-else class="text-center text-sm text-gray-400">Загрузка...</p>
  </div>
</template>
