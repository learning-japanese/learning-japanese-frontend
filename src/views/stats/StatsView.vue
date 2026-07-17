<script setup lang="ts">
import { computed } from 'vue'
import { useStats } from '@/requests/stats'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
)

const { data: stats } = useStats()

const weekOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
    x: { grid: { display: false } },
  },
}

const accuracyChartData = computed(() => ({
  labels: stats.value?.labels ?? [],
  datasets: [
    {
      data: stats.value?.accuracy ?? [],
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236,72,153,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#ec4899',
      pointRadius: 4,
    },
  ],
}))

const minutesChartData = computed(() => ({
  labels: stats.value?.labels ?? [],
  datasets: [
    {
      data: stats.value?.minutes ?? [],
      backgroundColor: 'rgba(236,72,153,0.6)',
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
}))

const avgAccuracy = computed(() => {
  if (!stats.value?.accuracy?.length) return 0
  const sum = stats.value.accuracy.reduce((a, b) => a + b, 0)
  return Math.round(sum / stats.value.accuracy.length)
})

const totalMinutes = computed(() => {
  if (!stats.value?.minutes?.length) return 0
  return stats.value.minutes.reduce((a, b) => a + b, 0)
})
</script>

<template>
  <div class="flex flex-col gap-4 px-4 pt-8 pb-4">
    <h1 class="text-center text-2xl font-bold">📊 Статистика</h1>

    <div v-if="!stats" class="text-center text-sm text-gray-400">Загрузка...</div>

    <template v-if="stats">
      <div class="flex gap-4">
        <div class="flex-1 rounded-2xl bg-pink-100 p-4 text-center dark:bg-pink-950/30">
          <p class="text-3xl font-bold text-pink-500">{{ avgAccuracy }}%</p>
          <p class="text-xs text-gray-500">Точность</p>
        </div>
        <div class="flex-1 rounded-2xl bg-pink-100 p-4 text-center dark:bg-pink-950/30">
          <p class="text-3xl font-bold text-pink-500">{{ totalMinutes }} мин</p>
          <p class="text-xs text-gray-500">За неделю</p>
        </div>
        <div class="flex-1 rounded-2xl bg-pink-100 p-4 text-center dark:bg-pink-950/30">
          <p class="text-3xl font-bold text-pink-500">
            {{ stats.tasksPerDay?.reduce((a, b) => a + b, 0) ?? 0 }}
          </p>
          <p class="text-xs text-gray-500">Заданий</p>
        </div>
      </div>

      <div class="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <p class="mb-2 text-sm font-medium text-gray-500">Качество обучения</p>
        <div class="h-48">
          <Line :data="accuracyChartData" :options="weekOptions" />
        </div>
      </div>

      <div class="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <p class="mb-2 text-sm font-medium text-gray-500">Минут в день</p>
        <div class="h-48">
          <Bar :data="minutesChartData" :options="weekOptions" />
        </div>
      </div>
    </template>
  </div>
</template>
