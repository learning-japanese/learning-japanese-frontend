import { useQuery } from '@tanstack/vue-query'
import { getStats } from '@/apis/stats'
import type { DailyStats } from '@/types'

export function useStats(period: string = 'week') {
  return useQuery<DailyStats>({
    queryKey: ['stats', period],
    queryFn: () => getStats(period),
  })
}
