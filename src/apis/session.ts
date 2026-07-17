import client from './client'
import type { Session } from '@/types'

export async function startSession(body?: { groupId?: string }): Promise<Session> {
  const { data } = await client.post('/session/start', body ?? {})
  return data
}

export async function submitTask(
  sessionId: string,
  answers: Record<string, string>,
) {
  const { data } = await client.post(`/session/${sessionId}/submit`, answers)
  return data
}
