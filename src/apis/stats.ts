import client from './client'
import type { DailyStats } from '@/types'

export async function getStats(period: string = 'week'): Promise<DailyStats> {
  const { data } = await client.get('/stats', { params: { period } })
  return data
}
