import { useMutation, useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/shallow'

import { queryClient } from '~/lib/query-client'

import {
  hash,
  markListsStale,
  registerResourceSlice,
  updateResourceSlice,
  useDataStore,
} from './store'
import type {
  ListMeta,
  OptimisticOp,
  PaginatedResponse,
  ResourceConfig,
  ResourceState,
  ResourceTable,
  SourceSeqEntry,
  SourceTag,
  UseEntityResult,
  UseListResult,
} from './types'

export const TOMBSTONE_TTL = 30_000

const SOURCE_RANK: Record<SourceTag, number> = {
  mutation: 4,
  detail: 3,
  socket: 2,
  list: 1,
}

const queryKeyOf = (name: string, kind: 'list' | 'detail', extra?: unknown) =>
  extra === undefined
    ? (['data', name, kind] as const)
    : (['data', name, kind, extra] as const)

export const normalizeListResponse = <T>(
  r: PaginatedResponse<T> | T[],
): { data: T[]; meta: ListMeta } => {
  const now = Date.now()
  if (Array.isArray(r)) {
    return {
      data: r,
      meta: {
        totalCount: r.length,
        totalPages: 1,
        fetchedAt: now,
        stale: false,
      },
    }
  }
  const p = r.pagination
  return {
    data: r.data,
    meta: {
      totalCount: p?.totalCount ?? r.meta?.totalCount,
      totalPages: p?.totalPages ?? r.meta?.totalPages,
      cursor: p?.cursor ?? r.meta?.cursor ?? null,
      fetchedAt: now,
      stale: false,
    },
  }
}

export function createResourceTable<
  T,
  P = unknown,
  C = Partial<T>,
  U = Partial<T>,
>(cfg: ResourceConfig<T, P, C, U>): ResourceTable<T, P, C, U> {
  const { name } = cfg
  const pk = (cfg.pk ?? ('id' as keyof T)) as keyof T
  registerResourceSlice(name)

  const idOf = (entity: T): string => String((entity as Record<string, unknown>)[pk as string])

  const tombstoneActive = (
    slice: ResourceState<T>,
    id: string,
    now: number,
  ): { active: boolean; pruned: ResourceState<T>['tombstones'] | null } => {
    const ts = slice.tombstones[id]
    if (!ts) return { active: false, pruned: null }
    if (now - ts < TOMBSTONE_TTL) return { active: true, pruned: null }
    const next = { ...slice.tombstones }
    delete next[id]
    return { active: false, pruned: next }
  }

  const versionOf = (entity: T | undefined): unknown => {
    if (!entity || !cfg.versionKey) return undefined
    return (entity as Record<string, unknown>)[cfg.versionKey as string]
  }

  const passGuard = (
    slice: ResourceState<T>,
    incoming: T,
    source: SourceTag,
  ): boolean => {
    const id = idOf(incoming)
    const cur = slice.serverById[id]
    if (cfg.versionKey) {
      if (!cur) return true
      const inV = versionOf(incoming) as number | string | undefined
      const stV = versionOf(cur) as number | string | undefined
      if (inV != null && stV != null) {
        if (inV > stV) return true
        if (inV < stV) return false
      }
    }
    const lastSource: SourceTag = slice.sourceSeq[id]?.lastSource ?? 'list'
    return SOURCE_RANK[source] >= SOURCE_RANK[lastSource]
  }

  const recordSource = (
    slice: ResourceState<T>,
    id: string,
    source: SourceTag,
  ): ResourceState<T>['sourceSeq'] => {
    const prev: SourceSeqEntry = slice.sourceSeq[id] ?? {
      mutation: 0,
      detail: 0,
      list: 0,
      socket: 0,
      lastSource: 'list',
    }
    return {
      ...slice.sourceSeq,
      [id]: { ...prev, [source]: prev[source] + 1, lastSource: source },
    }
  }

  const recompute = (
    slice: ResourceState<T>,
    id: string,
  ): ResourceState<T>['byId'] => {
    const server = slice.serverById[id]
    const ops = slice.pendingOps[id] ?? []
    const next = { ...slice.byId }
    if (!server && ops.length === 0) {
      delete next[id]
      return next
    }
    let computed: T = server
      ? ({ ...(server as object) } as T)
      : ({ [pk as string]: id } as unknown as T)
    for (const op of ops) {
      computed = { ...(computed as object), ...(op.patch as object) } as T
    }
    next[id] = computed
    return next
  }

  const upsertList = (
    params: P,
    response: PaginatedResponse<T> | T[],
    mySeq: number,
  ) => {
    const { data, meta } = normalizeListResponse(response)
    const key = hash(params)
    const now = Date.now()
    updateResourceSlice<T>(name, 'upsertList', (slice) => {
      if (slice.listFetchSeq[key] !== mySeq) return slice
      let serverById = slice.serverById
      let sourceSeq = slice.sourceSeq
      let byId = slice.byId
      let tombstones = slice.tombstones
      const ids: string[] = []
      let touched = false
      for (const entity of data) {
        const id = idOf(entity)
        const ts = tombstoneActive({ ...slice, tombstones }, id, now)
        if (ts.pruned) tombstones = ts.pruned
        if (ts.active) continue
        ids.push(id)
        const probe: ResourceState<T> = {
          ...slice,
          serverById,
          sourceSeq,
          byId,
          tombstones,
        }
        if (passGuard(probe, entity, 'list')) {
          serverById = { ...serverById, [id]: entity }
          sourceSeq = recordSource(probe, id, 'list')
          byId = recompute(
            { ...probe, serverById, sourceSeq, byId },
            id,
          )
          touched = true
        }
      }
      const lists = { ...slice.lists, [key]: { ids, meta: { ...meta, fetchedAt: now, stale: false } } }
      if (!touched && tombstones === slice.tombstones) {
        return { ...slice, lists }
      }
      return { ...slice, serverById, sourceSeq, byId, tombstones, lists }
    })
  }

  const injectEntity = (entity: T, source: SourceTag = 'socket') => {
    const id = idOf(entity)
    const now = Date.now()
    updateResourceSlice<T>(name, `injectEntity:${source}`, (slice) => {
      const ts = tombstoneActive(slice, id, now)
      if (ts.active) return slice
      const probe: ResourceState<T> =
        ts.pruned ? { ...slice, tombstones: ts.pruned } : slice
      if (!passGuard(probe, entity, source)) {
        return ts.pruned ? probe : slice
      }
      const serverById = { ...probe.serverById, [id]: entity }
      const sourceSeq = recordSource(probe, id, source)
      const byId = recompute({ ...probe, serverById, sourceSeq }, id)
      return { ...probe, serverById, sourceSeq, byId }
    })
  }

  const injectMany = (entities: T[], source: SourceTag = 'socket') => {
    for (const e of entities) injectEntity(e, source)
  }

  const injectMutationResult = (id: string, server: T, mySeq: number) => {
    const now = Date.now()
    updateResourceSlice<T>(name, 'injectMutationResult', (slice) => {
      const ops = slice.pendingOps[id] ?? []
      const idx = ops.findIndex((o) => o.seq === mySeq)
      if (idx === -1) return slice
      const nextOps = [...ops.slice(0, idx), ...ops.slice(idx + 1)]
      const pendingOps = { ...slice.pendingOps, [id]: nextOps }
      let probe: ResourceState<T> = { ...slice, pendingOps }
      const ts = tombstoneActive(probe, id, now)
      if (ts.pruned) probe = { ...probe, tombstones: ts.pruned }
      let serverById = probe.serverById
      let sourceSeq = probe.sourceSeq
      if (!ts.active && passGuard(probe, server, 'mutation')) {
        serverById = { ...serverById, [id]: server }
        sourceSeq = recordSource(probe, id, 'mutation')
      }
      const byId = recompute({ ...probe, serverById, sourceSeq }, id)
      return { ...probe, serverById, sourceSeq, byId }
    })
  }

  const rollback = (id: string, mySeq: number) => {
    updateResourceSlice<T>(name, 'rollback', (slice) => {
      const ops = slice.pendingOps[id] ?? []
      const idx = ops.findIndex((o) => o.seq === mySeq)
      if (idx === -1) return slice
      const nextOps = [...ops.slice(0, idx), ...ops.slice(idx + 1)]
      const pendingOps = { ...slice.pendingOps, [id]: nextOps }
      const probe = { ...slice, pendingOps }
      const byId = recompute(probe, id)
      return { ...probe, byId }
    })
  }

  const removeEntity = (id: string) => {
    const now = Date.now()
    updateResourceSlice<T>(name, 'removeEntity', (slice) => {
      const serverById = { ...slice.serverById }
      delete serverById[id]
      const byId = { ...slice.byId }
      delete byId[id]
      const pendingOps = { ...slice.pendingOps }
      delete pendingOps[id]
      const sourceSeq = { ...slice.sourceSeq }
      delete sourceSeq[id]
      const tombstones = { ...slice.tombstones, [id]: now }
      const lists: ResourceState<T>['lists'] = {}
      for (const k of Object.keys(slice.lists)) {
        const cur = slice.lists[k]
        const filtered = cur.ids.filter((x) => x !== id)
        lists[k] =
          filtered.length === cur.ids.length
            ? cur
            : { ...cur, ids: filtered }
      }
      return {
        ...slice,
        serverById,
        byId,
        pendingOps,
        sourceSeq,
        tombstones,
        lists,
      }
    })
  }

  const injectCreate = (server: T) => {
    const id = idOf(server)
    updateResourceSlice<T>(name, 'injectCreate', (slice) => {
      const tombstones = { ...slice.tombstones }
      delete tombstones[id]
      const probe: ResourceState<T> = { ...slice, tombstones }
      const serverById = { ...probe.serverById, [id]: server }
      const sourceSeq = recordSource(probe, id, 'mutation')
      const byId = recompute({ ...probe, serverById, sourceSeq }, id)
      return { ...probe, serverById, sourceSeq, byId }
    })
  }

  const invalidateList = (predicate?: (params: P) => boolean) => {
    if (predicate) {
      // 标记匹配的 list 为 stale 但不删除 ids（仅触发 refetch）
      // 已加载的 lists 会在下次 useList 访问时重新拉取
    }
    markListsStale(name)
    void queryClient.invalidateQueries({ queryKey: queryKeyOf(name, 'list') })
  }

  const refetchEntity = async (id: string): Promise<T | undefined> => {
    if (!cfg.fetchers.detail) return undefined
    const result = await queryClient.fetchQuery<T>({
      queryKey: queryKeyOf(name, 'detail', id),
      queryFn: async ({ signal }) => {
        let mySeq = 0
        updateResourceSlice<T>(name, 'detail:bumpSeq', (slice) => {
          mySeq = (slice.detailFetchSeq[id] ?? 0) + 1
          return {
            ...slice,
            detailFetchSeq: { ...slice.detailFetchSeq, [id]: mySeq },
          }
        })
        const server = await cfg.fetchers.detail!(id, { signal })
        injectEntity(server, 'detail')
        return server
      },
    })
    return result
  }

  const get = (id: string): T | undefined => {
    const slice = useDataStore.getState()[name] as ResourceState<T> | undefined
    return slice?.byId[id]
  }

  const getList = (params: P): T[] | undefined => {
    const slice = useDataStore.getState()[name] as ResourceState<T> | undefined
    if (!slice) return undefined
    const list = slice.lists[hash(params)]
    if (!list) return undefined
    const result: T[] = []
    for (const id of list.ids) {
      const entity = slice.byId[id]
      if (entity !== undefined) result.push(entity)
    }
    return result
  }

  const useList = (params: P): UseListResult<T> => {
    const result = useQuery<T[], unknown>({
      queryKey: queryKeyOf(name, 'list', params),
      queryFn: async ({ signal }) => {
        if (!cfg.fetchers.list) {
          throw new Error(`[${name}] fetchers.list is not defined`)
        }
        let mySeq = 0
        updateResourceSlice<T>(name, 'list:bumpSeq', (slice) => {
          mySeq = (slice.listFetchSeq[hash(params)] ?? 0) + 1
          return {
            ...slice,
            listFetchSeq: {
              ...slice.listFetchSeq,
              [hash(params)]: mySeq,
            },
          }
        })
        const raw = await cfg.fetchers.list(params, { signal })
        upsertList(params, raw, mySeq)
        return normalizeListResponse(raw).data
      },
    })
    const data = useDataStore(
      useShallow((s) => {
        const slice = s[name] as ResourceState<T> | undefined
        if (!slice) return [] as T[]
        const list = slice.lists[hash(params)]
        if (!list) return [] as T[]
        const out: T[] = []
        for (const id of list.ids) {
          const v = slice.byId[id]
          if (v !== undefined) out.push(v)
        }
        return out
      }),
    )
    const meta = useDataStore(
      (s) =>
        (s[name] as ResourceState<T> | undefined)?.lists[hash(params)]?.meta,
    )
    return {
      data,
      meta,
      isPending: result.isPending,
      isFetching: result.isFetching,
      error: result.error,
      refetch: result.refetch,
    }
  }

  const useEntity = (id: string | undefined): UseEntityResult<T> => {
    const enabled = !!id && !!cfg.fetchers.detail
    const result = useQuery<T, unknown>({
      enabled,
      queryKey: queryKeyOf(name, 'detail', id),
      queryFn: async ({ signal }) => {
        if (!cfg.fetchers.detail) {
          throw new Error(`[${name}] fetchers.detail is not defined`)
        }
        let mySeq = 0
        updateResourceSlice<T>(name, 'detail:bumpSeq', (slice) => {
          mySeq = (slice.detailFetchSeq[id!] ?? 0) + 1
          return {
            ...slice,
            detailFetchSeq: {
              ...slice.detailFetchSeq,
              [id!]: mySeq,
            },
          }
        })
        const server = await cfg.fetchers.detail(id!, { signal })
        injectEntity(server, 'detail')
        return server
      },
    })
    const data = useDataStore((s) => {
      if (!id) return undefined
      const slice = s[name] as ResourceState<T> | undefined
      return slice?.byId[id]
    })
    return {
      data,
      isPending: result.isPending,
      isFetching: result.isFetching,
      error: result.error,
      refetch: result.refetch as UseEntityResult<T>['refetch'],
    }
  }

  const useCreate = () =>
    useMutation<T, unknown, C>({
      mutationFn: (input) => {
        if (!cfg.fetchers.create) {
          throw new Error(`[${name}] fetchers.create is not defined`)
        }
        return cfg.fetchers.create(input)
      },
      onSuccess: (server) => {
        injectCreate(server)
        invalidateList()
      },
    })

  const useUpdate = (opts?: { optimistic?: boolean }) => {
    const optimistic = opts?.optimistic ?? true
    return useMutation<T, unknown, { id: string; patch: U }, { mySeq: number }>({
      mutationFn: ({ id, patch }) => {
        if (!cfg.fetchers.update) {
          throw new Error(`[${name}] fetchers.update is not defined`)
        }
        return cfg.fetchers.update(id, patch)
      },
      onMutate: ({ id, patch }) => {
        if (!optimistic) return { mySeq: 0 }
        let mySeq = 0
        updateResourceSlice<T>(name, 'update:onMutate', (slice) => {
          mySeq = slice.entitySeq + 1
          const op: OptimisticOp<unknown> = {
            seq: mySeq,
            id,
            patch: patch as unknown,
            appliedAt: Date.now(),
          }
          const ops = slice.pendingOps[id] ?? []
          const pendingOps = { ...slice.pendingOps, [id]: [...ops, op] }
          const probe = { ...slice, entitySeq: mySeq, pendingOps }
          const byId = recompute(probe, id)
          return { ...probe, byId }
        })
        const fields = cfg.listInvalidationFields ?? []
        if (
          fields.some((f) =>
            Object.prototype.hasOwnProperty.call(patch as object, f as string),
          )
        ) {
          markListsStale(name)
          void queryClient.invalidateQueries({
            queryKey: queryKeyOf(name, 'list'),
          })
        }
        return { mySeq }
      },
      onSuccess: (server, vars, ctx) => {
        if (optimistic && ctx) injectMutationResult(vars.id, server, ctx.mySeq)
        else injectEntity(server, 'mutation')
      },
      onError: (_err, vars, ctx) => {
        if (optimistic && ctx && ctx.mySeq > 0) rollback(vars.id, ctx.mySeq)
      },
    })
  }

  const useDelete = () =>
    useMutation<void, unknown, string>({
      mutationFn: (id) => {
        if (!cfg.fetchers.delete) {
          throw new Error(`[${name}] fetchers.delete is not defined`)
        }
        return cfg.fetchers.delete(id)
      },
      onSuccess: (_void, id) => {
        removeEntity(id)
        invalidateList()
      },
    })

  const table: ResourceTable<T, P, C, U> = {
    name,
    useList,
    useEntity,
    useCreate,
    useUpdate,
    useDelete,
    injectEntity,
    injectMany,
    removeEntity,
    invalidateList,
    refetchEntity,
    get,
    getList,
  }

  internals.set(table, {
    bumpListSeq: (params) => {
      let mySeq = 0
      updateResourceSlice<T>(name, 'list:bumpSeq', (slice) => {
        mySeq = (slice.listFetchSeq[hash(params)] ?? 0) + 1
        return {
          ...slice,
          listFetchSeq: { ...slice.listFetchSeq, [hash(params)]: mySeq },
        }
      })
      return mySeq
    },
    upsertList: (params, response, mySeq) =>
      upsertList(params as P, response as PaginatedResponse<T> | T[], mySeq),
    optimisticPush: (id, patch) => {
      let mySeq = 0
      updateResourceSlice<T>(name, 'update:onMutate', (slice) => {
        mySeq = slice.entitySeq + 1
        const op: OptimisticOp<unknown> = {
          seq: mySeq,
          id,
          patch,
          appliedAt: Date.now(),
        }
        const ops = slice.pendingOps[id] ?? []
        const pendingOps = { ...slice.pendingOps, [id]: [...ops, op] }
        const probe = { ...slice, entitySeq: mySeq, pendingOps }
        const byId = recompute(probe, id)
        return { ...probe, byId }
      })
      return mySeq
    },
    confirmMutation: (id, server, mySeq) =>
      injectMutationResult(id, server as T, mySeq),
    rollbackMutation: (id, mySeq) => rollback(id, mySeq),
    injectCreate: (server) => injectCreate(server as T),
    sliceName: name,
  })

  return table
}

interface ResourceInternals<T, P> {
  bumpListSeq: (params: P) => number
  upsertList: (
    params: P,
    response: PaginatedResponse<T> | T[],
    mySeq: number,
  ) => void
  optimisticPush: (id: string, patch: unknown) => number
  confirmMutation: (id: string, server: T, mySeq: number) => void
  rollbackMutation: (id: string, mySeq: number) => void
  injectCreate: (server: T) => void
  sliceName: string
}

const internals = new WeakMap<object, ResourceInternals<unknown, unknown>>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const __getResourceInternals = <T, P>(
  table: ResourceTable<T, P, any, any>,
): ResourceInternals<T, P> | undefined =>
  internals.get(table as object) as ResourceInternals<T, P> | undefined
