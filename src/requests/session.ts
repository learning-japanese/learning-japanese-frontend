import { useMutation } from '@tanstack/vue-query'
import { startSession, submitTask } from '@/apis/session'
import { useQueryClient } from '@tanstack/vue-query'

export function useStartSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body?: { groupId?: string }) => startSession(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useSubmitTask(sessionId: string) {
  return useMutation({
    mutationFn: (answers: Record<string, string>) =>
      submitTask(sessionId, answers),
  })
}
