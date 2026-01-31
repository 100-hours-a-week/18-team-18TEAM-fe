import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { getWallets, deleteWalletCard } from './wallet.api'
import type { GetWalletsParams } from '../model/wallet.types'

export const walletKeys = {
  all: ['wallets'] as const,
  lists: () => [...walletKeys.all, 'list'] as const,
  list: (params: GetWalletsParams = {}) => [...walletKeys.lists(), params] as const,
}

export function useWallets(params: Omit<GetWalletsParams, 'cursorId'> = {}) {
  return useInfiniteQuery({
    queryKey: walletKeys.list(params),
    queryFn: ({ pageParam }) =>
      getWallets({ ...params, cursorId: pageParam as number | undefined }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.has_next
        ? lastPage.pagination.cursorId
        : undefined,
    refetchOnWindowFocus: false,
  })
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
