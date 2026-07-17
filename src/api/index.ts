import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { UserProfile, Session, DailyStats } from '@/types'

const BASE_URL = '/api'

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => fetchJson<UserProfile>('/profile'),
  })
}

export function useStartSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      fetchJson<Session>('/session/start', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useSubmitTask(sessionId: string) {
  return useMutation({
    mutationFn: (answers: Record<string, string>) =>
      fetchJson(`/session/${sessionId}/submit`, {
        method: 'POST',
        body: JSON.stringify(answers),
      }),
  })
}

export function useStats() {
  return useQuery<DailyStats[]>({
    queryKey: ['stats'],
    queryFn: () => fetchJson<DailyStats[]>('/stats'),
  })
}
