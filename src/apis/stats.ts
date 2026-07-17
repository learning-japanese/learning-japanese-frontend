import client from './client'
import type { DailyStats } from '@/types'

export async function getStats(): Promise<DailyStats> {
  const { data } = await client.get('/stats')
  return data
}
