<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVocabulary } from '@/requests/vocabulary'

const page = ref(1)
const filter = ref('all')
const search = ref('')
const searchInput = ref('')

const params = computed(() => ({
  page: page.value,
  filter: filter.value,
  search: search.value,
}))

const { data } = useVocabulary(params)

const filters = [
  { key: 'all', label: 'Все' },
  { key: 'poor', label: 'Плохо' },
  { key: 'medium', label: 'Средне' },
  { key: 'good', label: 'Хорошо' },
]

function applySearch() {
  search.value = searchInput.value
  page.value = 1
}

function setFilter(key: string) {
  filter.value = key
  page.value = 1
}

function knowledgeColor(k: number) {
  if (k < 40) return 'text-red-500'
  if (k < 70) return 'text-yellow-500'
  return 'text-green-500'
}
</script>

<template>
  <div class="flex flex-col gap-4 px-4 pt-8 pb-4">
    <h1 class="text-center text-2xl font-bold">📖 Словарь</h1>

    <!-- Search -->
    <div class="flex gap-2">
      <input
        v-model="searchInput"
        @keyup.enter="applySearch"
        placeholder="Поиск по слову или значению..."
        class="flex-1 rounded-xl border-2 border-pink-200 px-4 py-2 text-sm outline-none focus:border-pink-500 dark:border-pink-900 dark:bg-transparent"
      />
      <button
        @click="applySearch"
        class="rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white"
      >
        Найти
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 overflow-x-auto">
      <button
        v-for="f in filters"
        :key="f.key"
        @click="setFilter(f.key)"
        class="whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium transition-all"
        :class="
          filter === f.key
            ? 'bg-pink-500 text-white'
            : 'bg-pink-50 text-gray-600 dark:bg-pink-950/30 dark:text-gray-400'
        "
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Word list -->
    <div v-if="!data" class="text-center text-sm text-gray-400">Загрузка...</div>

    <div v-if="data" class="flex flex-col gap-2">
      <p class="text-xs text-gray-400">Всего слов: {{ data.total }}</p>

      <div
        v-for="word in data.words"
        :key="word.id"
        class="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900"
      >
        <div>
          <p class="text-lg font-bold">{{ word.kanji }}</p>
          <p class="text-sm text-gray-500">{{ word.kana }} — {{ word.meaning }}</p>
        </div>
        <div class="text-right">
          <p class="text-lg font-bold" :class="knowledgeColor(word.knowledge)">
            {{ word.knowledge }}%
          </p>
          <div class="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-pink-100 dark:bg-pink-900">
            <div
              class="h-full rounded-full transition-all"
              :class="
                word.knowledge < 40
                  ? 'bg-red-400'
                  : word.knowledge < 70
                    ? 'bg-yellow-400'
                    : 'bg-green-400'
              "
              :style="{ width: `${word.knowledge}%` }"
            />
          </div>
        </div>
      </div>

      <div v-if="data.words.length === 0" class="py-8 text-center text-sm text-gray-400">
        Ничего не найдено
      </div>

      <!-- Pagination -->
      <div v-if="data.totalPages > 1" class="flex justify-center gap-2 py-4">
        <button
          :disabled="page <= 1"
          @click="page--"
          class="rounded-xl border-2 border-pink-200 px-4 py-2 text-sm disabled:opacity-30 dark:border-pink-900"
        >
          ←
        </button>
        <span class="flex items-center text-sm text-gray-500">
          {{ page }} / {{ data.totalPages }}
        </span>
        <button
          :disabled="page >= data.totalPages"
          @click="page++"
          class="rounded-xl border-2 border-pink-200 px-4 py-2 text-sm disabled:opacity-30 dark:border-pink-900"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>
