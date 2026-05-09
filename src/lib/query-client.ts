import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
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

let persistenceBooted = false

export const bootPersistence = () => {
  if (persistenceBooted || typeof window === 'undefined') return
  persistenceBooted = true
  const persister = createAsyncStoragePersister({
    storage: window.localStorage,
    key: 'mx-admin-query-cache',
    throttleTime: 1000,
  })
  void persistQueryClient({
    queryClient,
    persister,
    maxAge: 24 * 60 * 60_000,
    dehydrateOptions: {
      shouldDehydrateQuery: (q) =>
        Array.isArray(q.queryKey) && q.queryKey[0] === 'ai',
    },
  })
}
