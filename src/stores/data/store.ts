import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type {
  DataStoreState,
  ResourceState,
  SingletonState,
} from './types'

const stableStringify = (value: unknown): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(',')}]`
  }
  const keys = Object.keys(value as Record<string, unknown>).sort()
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`)
    .join(',')}}`
}

export const hash = (value: unknown): string => stableStringify(value)

export const emptyResourceSlice = <T>(): ResourceState<T> => ({
  serverById: {},
  byId: {},
  lists: {},
  pendingOps: {},
  entitySeq: 0,
  listFetchSeq: {},
  detailFetchSeq: {},
  tombstones: {},
  sourceSeq: {},
})

export const emptySingletonSlice = <T>(): SingletonState<T> => ({
  data: undefined,
  fetchSeq: 0,
  isStale: false,
})

export const useDataStore = create<DataStoreState>()(
  devtools(
    () => ({
      __slices: {},
    }) as DataStoreState,
    { name: 'mx-admin:data', enabled: import.meta.env?.DEV ?? false },
  ),
)

export const registerResourceSlice = (name: string) => {
  const state = useDataStore.getState()
  if (state.__slices[name]) return
  useDataStore.setState(
    (s) => ({
      ...s,
      __slices: { ...s.__slices, [name]: 'resource' as const },
      [name]: emptyResourceSlice<unknown>(),
    }),
    false,
    `${name}/register`,
  )
}

export const registerSingletonSlice = (name: string) => {
  const state = useDataStore.getState()
  if (state.__slices[name]) return
  useDataStore.setState(
    (s) => ({
      ...s,
      __slices: { ...s.__slices, [name]: 'singleton' as const },
      [name]: emptySingletonSlice<unknown>(),
    }),
    false,
    `${name}/register`,
  )
}

export const markListsStale = (name: string) => {
  useDataStore.setState(
    (s) => {
      const slice = s[name] as ResourceState<unknown> | undefined
      if (!slice || !slice.lists) return s
      const nextLists: ResourceState<unknown>['lists'] = {}
      let changed = false
      for (const k of Object.keys(slice.lists)) {
        const cur = slice.lists[k]
        if (cur.meta.stale) {
          nextLists[k] = cur
        } else {
          nextLists[k] = { ...cur, meta: { ...cur.meta, stale: true } }
          changed = true
        }
      }
      if (!changed) return s
      return { ...s, [name]: { ...slice, lists: nextLists } }
    },
    false,
    `${name}/markListsStale`,
  )
}

type Updater<T> = (slice: T) => T

export const updateResourceSlice = <T>(
  name: string,
  action: string,
  updater: Updater<ResourceState<T>>,
) => {
  useDataStore.setState(
    (s) => {
      const cur = s[name] as ResourceState<T> | undefined
      if (!cur) return s
      const next = updater(cur)
      if (next === cur) return s
      return { ...s, [name]: next }
    },
    false,
    `${name}/${action}`,
  )
}

export const updateSingletonSlice = <T>(
  name: string,
  action: string,
  updater: Updater<SingletonState<T>>,
) => {
  useDataStore.setState(
    (s) => {
      const cur = s[name] as SingletonState<T> | undefined
      if (!cur) return s
      const next = updater(cur)
      if (next === cur) return s
      return { ...s, [name]: next }
    },
    false,
    `${name}/${action}`,
  )
}

export const getResourceSlice = <T>(name: string): ResourceState<T> =>
  useDataStore.getState()[name] as ResourceState<T>

export const getSingletonSlice = <T>(name: string): SingletonState<T> =>
  useDataStore.getState()[name] as SingletonState<T>

export const listResourceSliceNames = (): string[] => {
  const slices = useDataStore.getState().__slices
  const out: string[] = []
  for (const k of Object.keys(slices)) {
    if (slices[k] === 'resource') out.push(k)
  }
  return out
}

export const invalidateAllResourceLists = () => {
  for (const name of listResourceSliceNames()) markListsStale(name)
}

export const resetDataStore = () => {
  useDataStore.setState(
    () =>
      ({
        __slices: {},
      }) as DataStoreState,
    true,
    'reset',
  )
}
