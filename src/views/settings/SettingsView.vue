<script setup lang="ts">
const levelOptions = ['Начинающий', 'Выживающий', 'Средний', 'Продвинутый']
</script>

<template>
  <div class="flex flex-col gap-6 px-4 pt-8">
    <h1 class="text-center text-2xl font-bold">⚙️ Настройки</h1>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <label class="text-sm font-medium">Твой уровень</label>
      <select
        class="mt-2 w-full rounded-xl border-2 border-pink-200 bg-white p-3 text-sm outline-none focus:border-pink-500 dark:border-pink-900 dark:bg-transparent"
      >
        <option v-for="lvl in levelOptions" :key="lvl">{{ lvl }}</option>
      </select>
    </div>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <label class="text-sm font-medium">Стиль общения AI</label>
      <select
        class="mt-2 w-full rounded-xl border-2 border-pink-200 bg-white p-3 text-sm outline-none focus:border-pink-500 dark:border-pink-900 dark:bg-transparent"
      >
        <option>Дружелюбный</option>
        <option selected>Ласковый (waifu)</option>
        <option>Строгий учитель</option>
      </select>
    </div>

    <div class="rounded-2xl bg-pink-100 p-4 dark:bg-pink-950/30">
      <label class="text-sm font-medium">Напоминания</label>
      <div class="mt-2 flex items-center justify-between">
        <span class="text-sm">Включить уведомления</span>
        <div class="h-6 w-11 rounded-full bg-pink-300 p-1">
          <div class="h-4 w-4 rounded-full bg-white shadow transition-all" />
        </div>
      </div>
    </div>
  </div>
</template>
