<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNav from './components/AppNav.vue'
</script>

<template>
  <div class="min-h-dvh flex flex-col bg-pink-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <main class="flex-1 pb-20">
      <RouterView />
    </main>
    <AppNav />
  </div>
</template>
