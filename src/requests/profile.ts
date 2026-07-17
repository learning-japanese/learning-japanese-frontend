import { useQuery } from '@tanstack/vue-query'
import { getProfile } from '@/apis/profile'
import type { UserProfile } from '@/types'

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: getProfile,
  })
}
