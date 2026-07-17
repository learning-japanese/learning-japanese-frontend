import { useMutation } from '@tanstack/vue-query'
import { sendMessage, type ChatMessage } from '@/apis/chat'

export function useSendMessage() {
  return useMutation({
    mutationFn: (messages: ChatMessage[]) => sendMessage(messages),
  })
}
