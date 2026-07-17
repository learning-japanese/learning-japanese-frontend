import { useQuery } from '@tanstack/vue-query'
import { getStats } from '@/apis/stats'
import type { DailyStats } from '@/types'

export function useStats() {
  return useQuery<DailyStats[]>({
    queryKey: ['stats'],
    queryFn: getStats,
  })
}
