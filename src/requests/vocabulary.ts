import { useQuery } from '@tanstack/vue-query'
import { getVocabulary, type VocabParams } from '@/apis/vocabulary'
import type { VocabResponse } from '@/types'
import { computed, type ComputedRef, type Ref } from 'vue'

export function useVocabulary(params: Ref<VocabParams> | ComputedRef<VocabParams>) {
  return useQuery<VocabResponse>({
    queryKey: ['vocabulary', params],
    queryFn: () => getVocabulary(params.value),
  })
}
