import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { getWallets, deleteWalletCard } from './wallet.api'
import { walletKeys, walletsInfiniteQueryOptions } from './wallet.query-options'
import type { GetWalletsParams } from '../model/wallet.types'

export function useWallets(params: Omit<GetWalletsParams, 'cursorId'> = {}) {
  return useInfiniteQuery(walletsInfiniteQueryOptions(params, getWallets))
}

export function useWalletList(params: GetWalletsParams = {}) {
  return useQuery({
    queryKey: walletKeys.list(params),
    queryFn: () => getWallets(params),
    refetchOnWindowFocus: false,
  })
}

export function useDeleteWalletCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWalletCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
    },
  })
}
