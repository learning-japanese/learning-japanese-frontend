<script setup lang="ts">
import { ref, computed } from 'vue'
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
import { useRouter } from 'vue-router'

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

const router = useRouter()

const periods = [
  { key: 'week', label: 'Неделя' },
  { key: 'month', label: 'Месяц' },
  { key: '3m', label: '3 мес' },
  { key: '6m', label: '6 мес' },
  { key: 'year', label: 'Год' },
]

const selectedPeriod = ref('week')
const { data: stats } = useStats(selectedPeriod.value)

const chartOptions = {
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

const totalTasks = computed(() => {
  if (!stats.value?.tasksPerDay?.length) return 0
  return stats.value.tasksPerDay.reduce((a, b) => a + b, 0)
})

function changePeriod(key: string) {
  selectedPeriod.value = key
}
</script>

<template>
  <div class="flex flex-col gap-4 px-4 pt-8 pb-4">
    <h1 class="text-center text-2xl font-bold">📊 Статистика</h1>

    <div v-if="!stats" class="text-center text-sm text-gray-400">Загрузка...</div>

    <template v-if="stats">
      <!-- Period selector -->
      <div class="flex gap-1 overflow-x-auto rounded-2xl bg-pink-50 p-1 dark:bg-pink-950/30">
        <button
          v-for="p in periods"
          :key="p.key"
          @click="changePeriod(p.key)"
          class="flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all"
          :class="
            selectedPeriod === p.key
              ? 'bg-pink-500 text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          "
        >
          {{ p.label }}
        </button>
      </div>

      <!-- Summary cards -->
      <div class="flex gap-3">
        <div class="flex-1 rounded-2xl bg-pink-100 p-3 text-center dark:bg-pink-950/30">
          <p class="text-2xl font-bold text-pink-500">{{ avgAccuracy }}%</p>
          <p class="text-xs text-gray-500">Точность</p>
        </div>
        <div class="flex-1 rounded-2xl bg-pink-100 p-3 text-center dark:bg-pink-950/30">
          <p class="text-2xl font-bold text-pink-500">{{ totalMinutes }} мин</p>
          <p class="text-xs text-gray-500">Всего</p>
        </div>
        <div class="flex-1 rounded-2xl bg-pink-100 p-3 text-center dark:bg-pink-950/30">
          <p class="text-2xl font-bold text-pink-500">{{ totalTasks }}</p>
          <p class="text-xs text-gray-500">Заданий</p>
        </div>
      </div>

      <!-- Today quick stats -->
      <div class="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <p class="text-sm font-medium text-gray-500">Сегодня</p>
        <div class="mt-2 flex gap-4 text-sm">
          <span>⏱ 15 мин</span>
          <span>📝 8 заданий</span>
          <span>✅ 75% точность</span>
        </div>
      </div>

      <!-- Accuracy chart -->
      <div class="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <p class="mb-2 text-sm font-medium text-gray-500">Качество обучения</p>
        <div class="h-48">
          <Line :data="accuracyChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Minutes chart -->
      <div class="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <p class="mb-2 text-sm font-medium text-gray-500">Минут в день / неделю</p>
        <div class="h-48">
          <Bar :data="minutesChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Vocabulary link -->
      <button
        @click="router.push('/vocabulary')"
        class="rounded-2xl bg-pink-100 p-4 text-center transition-all active:scale-[0.98] dark:bg-pink-950/30"
      >
        <p class="text-lg font-bold">📖 Словарь</p>
        <p class="text-xs text-gray-500">Список изученных слов, поиск и фильтры</p>
      </button>
    </template>
  </div>
</template>
