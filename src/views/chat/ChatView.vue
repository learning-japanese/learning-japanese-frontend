<script setup lang="ts">
import { ref } from 'vue'
import { useSendMessage } from '@/requests/chat'

const messages = ref<{ role: 'user' | 'assistant'; text: string }[]>([
  { role: 'assistant', text: 'こんにちは！今日は何を勉強したい？' },
])

const input = ref('')
const { mutateAsync: sendMsg, isPending } = useSendMessage()

async function sendMessage() {
  if (!input.value.trim()) return
  messages.value.push({ role: 'user', text: input.value })
  input.value = ''

  const { reply } = await sendMsg(messages.value)
  messages.value.push({ role: 'assistant', text: reply })
}
</script>

<template>
  <div class="flex h-dvh flex-col pb-20">
    <div class="flex-1 overflow-y-auto px-4 pt-4">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="mb-3 flex"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[80%] rounded-2xl px-4 py-2 text-sm"
          :class="
            msg.role === 'user'
              ? 'rounded-br-md bg-pink-500 text-white'
              : 'rounded-bl-md bg-pink-100 dark:bg-pink-950/40'
          "
        >
          {{ msg.text }}
        </div>
      </div>
      <div v-if="isPending" class="flex justify-start">
        <div class="rounded-2xl rounded-bl-md bg-pink-100 px-4 py-2 text-sm dark:bg-pink-950/40">
          ちょっと待ってね…
        </div>
      </div>
    </div>

    <div class="border-t bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div class="flex gap-2">
        <input
          v-model="input"
          @keyup.enter="sendMessage"
          placeholder="Напиши что-нибудь..."
          class="flex-1 rounded-xl border-2 border-pink-200 px-4 py-2 text-sm outline-none focus:border-pink-500 dark:border-pink-900 dark:bg-transparent"
        />
        <button
          @click="sendMessage"
          :disabled="!input.trim()"
          class="rounded-xl bg-pink-500 px-4 py-2 text-white disabled:opacity-50"
        >
          送信
        </button>
      </div>
    </div>
  </div>
</template>
