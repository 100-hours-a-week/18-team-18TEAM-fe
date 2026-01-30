import { useQuery } from '@tanstack/react-query'
import { getMyLatestCard } from './qr-share.api'

/** 쿼리 키 */
export const qrShareKeys = {
  all: ['qr-share'] as const,
  myLatestCard: () => [...qrShareKeys.all, 'my-latest-card'] as const,
}

/** 내 최신 명함 조회 훅 */
export function useMyLatestCard() {
  return useQuery({
    queryKey: qrShareKeys.myLatestCard(),
    queryFn: async () => {
      const response = await getMyLatestCard()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
