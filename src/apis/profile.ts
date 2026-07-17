import client from './client'
import type { UserProfile } from '@/types'

export async function getProfile(): Promise<UserProfile> {
  const { data } = await client.get('/profile')
  return data
}
