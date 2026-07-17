import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { UserSettings, IncorrectAction } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  const saved = localStorage.getItem('settings')
  const defaults: UserSettings = {
    level: 'Начинающий',
    aiStyle: 'Ласковый (waifu)',
    notifications: true,
    incorrectAction: 'show_answer',
    maxRetries: 3,
    aiCanOverride: true,
  }
  const state = ref<UserSettings>(saved ? { ...defaults, ...JSON.parse(saved) } : { ...defaults })

  watch(state, (val) => {
    localStorage.setItem('settings', JSON.stringify(val))
  }, { deep: true })

  function set<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    state.value[key] = value
  }

  return { state, set }
})
