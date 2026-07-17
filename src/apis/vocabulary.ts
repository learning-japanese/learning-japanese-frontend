import client from './client'
import type { VocabResponse } from '@/types'

export interface VocabParams {
  page?: number
  filter?: string
  search?: string
}

export async function getVocabulary(params: VocabParams = {}): Promise<VocabResponse> {
  const { data } = await client.get('/vocabulary', { params })
  return data
}
