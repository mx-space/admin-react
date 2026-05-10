import { useMutation, useQuery } from '@tanstack/react-query'

import { queryClient } from '~/lib/query-client'

import {
  registerSingletonSlice,
  updateSingletonSlice,
  useDataStore,
} from './store'
import type {
  SingletonConfig,
  SingletonResource,
  SingletonState,
  UseSingletonResult,
} from './types'

const queryKeyOf = (name: string) => ['data', name, 'singleton'] as const

export function createSingletonResource<T>(
  cfg: SingletonConfig<T>,
): SingletonResource<T> {
  const { name } = cfg
  registerSingletonSlice(name)

  const versionOf = (entity: T | undefined): unknown => {
    if (!entity || !cfg.versionKey) return undefined
    return (entity as Record<string, unknown>)[cfg.versionKey as string]
  }

  const passVersion = (incoming: T, current: T | undefined): boolean => {
    if (!cfg.versionKey || !current) return true
    const inV = versionOf(incoming) as number | string | undefined
    const stV = versionOf(current) as number | string | undefined
    if (inV == null || stV == null) return true
    return inV >= stV
  }

  const inject = (data: T) => {
    updateSingletonSlice<T>(name, 'inject', (slice) => {
      if (!passVersion(data, slice.data)) return slice
      return { ...slice, data, isStale: false }
    })
  }

  const get = (): T | undefined => {
    const slice = useDataStore.getState()[name] as
      | SingletonState<T>
      | undefined
    return slice?.data
  }

  const use = (): UseSingletonResult<T> => {
    const result = useQuery<T, unknown>({
      queryKey: queryKeyOf(name),
      queryFn: async ({ signal }) => {
        let mySeq = 0
        updateSingletonSlice<T>(name, 'fetch:bumpSeq', (slice) => {
          mySeq = slice.fetchSeq + 1
          return { ...slice, fetchSeq: mySeq }
        })
        const data = await cfg.fetcher({ signal })
        updateSingletonSlice<T>(name, 'fetch:apply', (slice) => {
          if (slice.fetchSeq !== mySeq) return slice
          if (!passVersion(data, slice.data)) return slice
          return { ...slice, data, isStale: false }
        })
        return data
      },
    })
    const data = useDataStore(
      (s) => (s[name] as SingletonState<T> | undefined)?.data,
    )
    return {
      data,
      isPending: result.isPending,
      isFetching: result.isFetching,
      error: result.error,
      refetch: result.refetch,
    }
  }

  const useUpdate = () =>
    useMutation<T, unknown, Partial<T>>({
      mutationFn: (patch) => {
        if (!cfg.updater) {
          throw new Error(`[${name}] singleton updater is not defined`)
        }
        return cfg.updater(patch)
      },
      onSuccess: (server) => {
        inject(server)
        void queryClient.invalidateQueries({ queryKey: queryKeyOf(name) })
      },
    })

  return { name, use, useUpdate, inject, get }
}
