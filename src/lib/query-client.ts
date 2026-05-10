import { QueryClient } from '@tanstack/react-query'

import { BusinessError } from './request'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 10 * 60_000,
      retry: (failureCount, error) =>
        error instanceof BusinessError ? false : failureCount < 2,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: false,
    },
  },
})
