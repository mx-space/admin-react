import type {
  QueryObserverResult,
  RefetchOptions,
  UseMutationResult,
} from '@tanstack/react-query'

export interface FetchOpts {
  signal: AbortSignal
}

export interface RelationDef {
  table: string
  fk: string
  kind?: 'one' | 'many'
}

export interface ListMeta {
  totalCount?: number
  totalPages?: number
  cursor?: string | null
  fetchedAt: number
  stale: boolean
}

export interface BackendPagination {
  totalCount?: number
  totalPages?: number
  currentPage?: number
  cursor?: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination?: BackendPagination
  meta?: Partial<Pick<ListMeta, 'totalCount' | 'totalPages' | 'cursor'>>
}

export type SourceTag = 'mutation' | 'detail' | 'socket' | 'list'

export interface OptimisticOp<U> {
  seq: number
  id: string
  patch: U
  appliedAt: number
}

export interface SourceSeqEntry {
  mutation: number
  detail: number
  list: number
  socket: number
  lastSource: SourceTag
}

export interface ResourceState<T> {
  serverById: Record<string, T>
  byId: Record<string, T>
  lists: Record<string, { ids: string[]; meta: ListMeta }>
  pendingOps: Record<string, OptimisticOp<unknown>[]>
  entitySeq: number
  listFetchSeq: Record<string, number>
  detailFetchSeq: Record<string, number>
  tombstones: Record<string, number>
  sourceSeq: Record<string, SourceSeqEntry>
}

export interface SingletonState<T> {
  data: T | undefined
  fetchSeq: number
  isStale: boolean
}

export interface ResourceConfig<
  T,
  ListParams = unknown,
  CreateInput = Partial<T>,
  UpdateInput = Partial<T>,
> {
  name: string
  pk?: keyof T
  versionKey?: keyof T
  relations?: Record<string, RelationDef>
  listInvalidationFields?: (keyof T)[]
  fetchers: {
    list?: (
      params: ListParams,
      opts: FetchOpts,
    ) => Promise<PaginatedResponse<T> | T[]>
    detail?: (id: string, opts: FetchOpts) => Promise<T>
    create?: (input: CreateInput) => Promise<T>
    update?: (id: string, patch: UpdateInput) => Promise<T>
    delete?: (id: string) => Promise<void>
  }
  listInvalidator?: (
    op: 'create' | 'delete' | 'update',
    changed: T | { id: string },
  ) => (params: ListParams) => boolean
}

export interface SingletonConfig<T> {
  name: string
  versionKey?: keyof T
  fetcher: (opts: FetchOpts) => Promise<T>
  updater?: (patch: Partial<T>) => Promise<T>
}

export interface UseListResult<T> {
  data: T[]
  meta: ListMeta | undefined
  isPending: boolean
  isFetching: boolean
  error: unknown
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<T[], unknown>>
}

export interface UseEntityResult<T> {
  data: T | undefined
  isPending: boolean
  isFetching: boolean
  error: unknown
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<T, unknown>>
}

export interface UseSingletonResult<T> {
  data: T | undefined
  isPending: boolean
  isFetching: boolean
  error: unknown
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<T, unknown>>
}

export interface ResourceTable<T, P, C, U> {
  name: string
  useList: (params: P) => UseListResult<T>
  useEntity: (id: string | undefined) => UseEntityResult<T>
  useCreate: () => UseMutationResult<T, unknown, C, unknown>
  useUpdate: (opts?: {
    optimistic?: boolean
  }) => UseMutationResult<T, unknown, { id: string; patch: U }, { mySeq: number }>
  useDelete: () => UseMutationResult<void, unknown, string, unknown>

  injectEntity: (entity: T, source?: SourceTag) => void
  injectMany: (entities: T[], source?: SourceTag) => void
  removeEntity: (id: string) => void
  invalidateList: (predicate?: (params: P) => boolean) => void
  refetchEntity: (id: string) => Promise<T | undefined>

  get: (id: string) => T | undefined
  getList: (params: P) => T[] | undefined
}

export interface SingletonResource<T> {
  name: string
  use: () => UseSingletonResult<T>
  useUpdate: () => UseMutationResult<T, unknown, Partial<T>, unknown>
  inject: (data: T) => void
  get: () => T | undefined
}

export type AnyResourceState = ResourceState<unknown> | SingletonState<unknown>

export interface DataStoreState {
  __slices: Record<string, 'resource' | 'singleton'>
  [resource: string]: AnyResourceState | unknown
}
