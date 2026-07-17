<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { to: '/', label: 'Главная', icon: '◉' },
  { to: '/session', label: 'Занятие', icon: '✎' },
  { to: '/chat', label: 'Чат', icon: '♡' },
  { to: '/stats', label: 'Статистика', icon: '◈' },
  { to: '/settings', label: 'Настройки', icon: '⚙' },
]
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white/90 pb-safe backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90"
  >
    <RouterLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors"
      :class="
        route.path === link.to
          ? 'text-pink-500 dark:text-pink-400'
          : 'text-gray-400 dark:text-gray-600'
      "
    >
      <span class="text-lg">{{ link.icon }}</span>
      <span>{{ link.label }}</span>
    </RouterLink>
  </nav>
</template>
