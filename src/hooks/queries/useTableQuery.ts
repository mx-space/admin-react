import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  serverFields,
  tableStateAtomFamily,
  type TableState,
} from '~/atoms/table'

import type { StateUpdater } from '~/components/table'

export interface UseTableQueryOptions<T> {
  key: string
  queryFn: (state: TableState) => Promise<{ data: T[]; total: number }>
  defaultPageSize?: number
  enabled?: boolean
  /** Extra query-key segments. Useful when the query depends on context outside `state`. */
  extraQueryKey?: readonly unknown[]
}

export interface UseTableQueryReturn<T> {
  state: TableState
  setState: (updater: StateUpdater) => void
  data: T[]
  totalCount: number
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: unknown
  refetch: () => Promise<unknown>
}

export const useTableQuery = <T,>({
  key,
  queryFn,
  defaultPageSize,
  enabled = true,
  extraQueryKey,
}: UseTableQueryOptions<T>): UseTableQueryReturn<T> => {
  const [state, setStateRaw] = useAtom(tableStateAtomFamily(key))

  const setState = useCallback<(updater: StateUpdater) => void>(
    (updater) => {
      if (typeof updater === 'function') {
        setStateRaw((prev) => updater(prev))
      } else {
        setStateRaw(updater)
      }
    },
    [setStateRaw],
  )

  const effectiveState = useMemo(() => {
    if (
      defaultPageSize !== undefined &&
      state.pageSize === 20 &&
      defaultPageSize !== 20
    ) {
      return { ...state, pageSize: defaultPageSize }
    }
    return state
  }, [state, defaultPageSize])

  const queryKey = useMemo(
    () => [
      'table',
      key,
      serverFields(effectiveState),
      ...(extraQueryKey ?? []),
    ],
    [key, effectiveState, extraQueryKey],
  )

  const query = useQuery({
    queryKey,
    queryFn: () => queryFn(effectiveState),
    placeholderData: keepPreviousData,
    enabled,
  })

  return {
    state: effectiveState,
    setState,
    data: query.data?.data ?? [],
    totalCount: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
