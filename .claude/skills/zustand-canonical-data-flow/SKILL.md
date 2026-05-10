---
name: zustand-canonical-data-flow
description: Use when adding a new server data source to mx-admin-next or consuming an existing one — porting `src/api/<name>.ts` to a `createResourceTable` / `createSingletonResource`, wiring socket events, or replacing legacy `useQuery` hooks. Covers list / detail / CRUD / singleton patterns, optimistic update behavior, and SocketBridge integration.
---

# Wiring a Data Source through the Store

The store engine lives at `src/stores/data/`. Every server resource gets one file under `src/stores/data/resources/<name>.ts`. Components consume `useList` / `useEntity` / `useCreate` / `useUpdate` / `useDelete`. The store is canonical for read; TanStack Query handles the fetch only.

For architecture rationale, race scenarios, and engine internals, see `docs/superpowers/specs/2026-05-10-data-flow-redesign-design.md`. **This skill is the consumer manual.**

---

## Decision Tree — Which Helper?

```
Has `id` and supports list?    → createResourceTable
Has `id`, no list (e.g. one user record by id)
                               → createResourceTable with fetchers.list undefined
No `id`, single record per app (appInfo, settings)
                               → createSingletonResource
Pure ephemeral UI state        → Jotai / useState (NOT this engine)
Auth / theme / layout          → existing src/stores/{auth,ui,layout}.ts
```

---

## Recipe 1 — Add a Resource Table

Goal: a backend resource with list + detail + CRUD becomes a typed table that any component can read and mutate.

### Step 1. Confirm the API module

`src/api/<name>.ts` should export typed `getList`, `getById`, `create`, `update`, `delete`. **Read methods must accept `{ signal }`** so TanStack Query can abort on key change.

```ts
// src/api/posts.ts
import type { PostModel } from '~/models'
import { request } from '~/lib/request'
import type { PaginatedResponse } from '~/stores/data'

export interface PostsListParams {
  page?: number
  size?: number
  status?: 'published' | 'draft'
}

export const postsApi = {
  getList: (params: PostsListParams, opts?: { signal?: AbortSignal }) =>
    request<PaginatedResponse<PostModel>>('/posts', {
      query: params,
      ...opts,
    }),
  getById: (id: string, opts?: { signal?: AbortSignal }) =>
    request<PostModel>(`/posts/${id}`, opts),
  create: (input: Partial<PostModel>) =>
    request<PostModel>('/posts', { method: 'POST', body: input }),
  update: (id: string, patch: Partial<PostModel>) =>
    request<PostModel>(`/posts/${id}`, { method: 'PATCH', body: patch }),
  delete: (id: string) =>
    request<void>(`/posts/${id}`, { method: 'DELETE' }),
}
```

If the backend returns a bare `T[]` instead of `{ data, pagination }`, type as `Promise<T[]>`. The engine accepts both.

### Step 2. Define the resource table

```ts
// src/stores/data/resources/posts.ts
import { postsApi, type PostsListParams } from '~/api/posts'
import type { PostModel } from '~/models'

import { createResourceTable } from '../create-resource'

export const posts = createResourceTable<PostModel, PostsListParams>({
  name: 'posts',
  versionKey: 'modified',                                  // optional but recommended
  listInvalidationFields: ['pinned', 'modified', 'categoryId'],  // patches touching these refetch lists
  fetchers: {
    list: (params, { signal }) => postsApi.getList(params, { signal }),
    detail: (id, { signal }) => postsApi.getById(id, { signal }),
    create: postsApi.create,
    update: postsApi.update,
    delete: postsApi.delete,
  },
})
```

Config notes:

- `name` — globally unique slice name, used in queryKey and devtools labels.
- `pk` — defaults to `'id'`. Override only if your model uses a different primary key (e.g. `slug`).
- `versionKey` — a monotonic field (`modified`, `updatedAt`, `revision`). Enables the universal version guard. Omit if no such field; the engine falls back to source preference (`mutation > detail > socket > list`).
- `listInvalidationFields` — fields whose change can move the row across pages (sort/filter keys). When a `useUpdate` patch touches one of these, mounted lists actively refetch.
- Skip any fetcher you do not need; calling its hook will throw a clear error.

### Step 3. Use it in a component

```tsx
import { posts } from '~/stores/data/resources/posts'

export function PostListPage() {
  const { data, meta, isPending, error } = posts.useList({ page: 1, size: 20 })
  const { mutate: update } = posts.useUpdate()

  if (isPending) return <Spinner />
  if (error) return <ErrorView error={error} />

  return (
    <ul>
      {data.map((p) => (
        <li key={p.id} onClick={() => update({ id: p.id, patch: { pinned: !p.pinned } })}>
          {p.title}
        </li>
      ))}
      <Pager total={meta?.totalCount} pages={meta?.totalPages} />
    </ul>
  )
}
```

`useList` returns `{ data, meta, isPending, isFetching, error, refetch }`. `data` is read from the store via `useShallow`; identical content (by entity reference) does not re-render.

### Step 4. Detail view

```tsx
export function PostDetailPage() {
  const { id } = useParams()
  const { data: post, isPending } = posts.useEntity(id)
  // ...
}
```

`useEntity(undefined)` is safe — the underlying query is `enabled: false` until the id resolves.

### Step 5. Mutations

```tsx
const { mutate: update, isPending } = posts.useUpdate()
const { mutate: createPost } = posts.useCreate()
const { mutate: deletePost } = posts.useDelete()

// Optimistic by default — UI reflects intent immediately
update({ id, patch: { title: 'New title' } })

// Opt out of optimistic when needed (e.g. high-stakes operations)
const { mutate: rename } = posts.useUpdate({ optimistic: false })

// Async style for awaiting in handlers
await posts.useUpdate().mutateAsync({ id, patch })
```

What happens on `useUpdate({ optimistic: true })`:

1. `onMutate`: pushes `{ seq, id, patch }` onto `pendingOps[id]`. `byId[id]` recomputes immediately = serverById + queued patches. UI updates.
2. If `patch` touches a `listInvalidationFields` key, mounted lists refetch.
3. `onSuccess`: server response replaces `serverById[id]` (after passing the version guard); the op is removed from the queue. `byId[id]` recomputes.
4. `onError`: the failed op is removed from the queue. Other in-flight ops on the same id are preserved.

`useCreate` and `useDelete` are **not optimistic** — they wait for the server, then patch byId and refetch the affected list.

### Step 6. Imperative actions

When you need to inject from outside a query:

```ts
posts.injectEntity(serverPayload, 'detail')   // 'mutation' | 'detail' | 'socket' | 'list'
posts.injectMany([a, b, c], 'list')
posts.removeEntity(id)
posts.invalidateList()                         // marks all lists stale + refetches mounted ones
posts.invalidateList((params) => params.status === 'draft')  // narrowed
const fresh = await posts.refetchEntity(id)
```

Selectors without React (rare, e.g. inside event handlers):

```ts
posts.get(id)
posts.getList({ page: 1 })
```

---

## Recipe 2 — Add a Singleton Resource

Use when the endpoint has no id and no list (app config, server status, current user info).

```ts
// src/stores/data/resources/app-info.ts
import { systemApi, type AppInfoModel } from '~/api/system'

import { createSingletonResource } from '../create-singleton'

export const appInfo = createSingletonResource<AppInfoModel>({
  name: 'appInfo',
  fetcher: ({ signal }) => systemApi.appInfo({ signal }),
  // updater: (patch) => systemApi.updateAppInfo(patch),  // optional
})
```

Component:

```tsx
const { data, isPending, refetch } = appInfo.use()
const { mutate: save } = appInfo.useUpdate()       // available only if `updater` was provided
```

Imperative: `appInfo.inject(server)`, `appInfo.get()`.

---

## Recipe 3 — Replace a Legacy `useQuery` Hook

Existing hooks under `src/hooks/queries/use-<name>.ts` should become thin re-exports during transition, so call sites do not churn.

```ts
// src/hooks/queries/use-app-info.ts
import { appInfo } from '~/stores/data/resources/app-info'

export const useAppInfoQuery = appInfo.use
```

For list/detail hooks, re-export the hook directly:

```ts
// src/hooks/queries/use-posts.ts
import { posts } from '~/stores/data/resources/posts'

export const usePostsQuery = posts.useList
export const usePostQuery = posts.useEntity
export const useUpdatePostMutation = posts.useUpdate
```

After call-site migration, delete the legacy file.

---

## Recipe 4 — Wire a Socket Event

Socket events route to engine actions in `src/components/shared/SocketBridge.tsx`.

### Audit first

Before wiring, narrow the event payload type in `src/lib/socket-events.ts`. Do not handle a domain event whose payload is `unknown`.

```ts
[SocketEvent.POST_UPDATE]: EntityUpdatePayload    // { id; modified?; ... }
[SocketEvent.POST_DELETE]: EntityIdPayload        // { id }
[SocketEvent.POST_CREATE]: EntityUpdatePayload    // create has body
```

### Wire the handler

```tsx
import { posts } from '~/stores/data/resources/posts'

// in SocketBridge:
const onPostUpdate = useCallback(
  (payload: EntityUpdatePayload) => posts.injectEntity(payload as PostModel, 'socket'),
  [],
)
const onPostCreate = useCallback(() => posts.invalidateList(), [])
const onPostDelete = useCallback(
  (payload: EntityIdPayload) => posts.removeEntity(payload.id),
  [],
)

useSocketEvent(SocketEvent.POST_UPDATE, onPostUpdate)
useSocketEvent(SocketEvent.POST_CREATE, onPostCreate)
useSocketEvent(SocketEvent.POST_DELETE, onPostDelete)
```

### When the payload is id-only

If the event carries only `id` (no entity body), do a detail refetch instead — that path runs through the version guard:

```ts
const onPostUpdate = useCallback(
  (payload: EntityIdPayload) => void posts.refetchEntity(payload.id),
  [],
)
```

### When the resource table does not exist yet

While waiting for P3 to land a resource, route to the generic invalidator and leave a marker:

```ts
import { invalidateAllResourceLists } from '~/stores/data/store'
import { queryClient } from '~/lib/query-client'

const onSomethingChanged = useCallback(() => {
  invalidateAllResourceLists()
  void queryClient.invalidateQueries({ queryKey: ['data'] })
  // P3: <name>.injectEntity(payload)
}, [])
```

---

## Pagination Shapes

Backends in this repo return one of:

```ts
T[]                                                 // bare array
{ data: T[] }                                       // legacy
{ data: T[], pagination: { totalCount, totalPages, currentPage, cursor? } }   // canonical
```

`src/lib/request.ts` only auto-unwraps `{ data: [...] }` when no informative siblings exist. With `pagination` present, the full object passes through. The engine normalizes via `normalizeListResponse` at the boundary.

`useList(...).meta` exposes `{ totalCount, totalPages, cursor, fetchedAt, stale }`. Use it for paginators.

---

## Common Tasks

### Add a sort-affecting field
Append it to `listInvalidationFields`. A `useUpdate` patch touching it will refetch mounted lists automatically.

### Force a list refresh
`posts.invalidateList()` — marks every list of `posts` stale and invalidates `['data','posts','list']` so mounted ones refetch.

### Push entity into the store from outside a query
`posts.injectEntity(server, 'detail')` (the source tag is required for cross-source ordering). Default source is `'socket'` if omitted.

### Remove an entity client-side after a non-engine delete
`posts.removeEntity(id)` — also installs a 30s tombstone so any racing socket / list response cannot resurrect it.

### Read once without subscribing
`posts.get(id)` / `posts.getList(params)` — pulls from the store snapshot. No subscription, no re-render.

### Singleton patch without server round-trip
`appInfo.inject(localPatch)` — useful for optimistic settings panel reflection before the save round-trip.

---

## Pitfalls (read these)

- **Do not write to the slice directly.** Always go through engine actions (`injectEntity`, `removeEntity`, `injectMany`, `useCreate/Update/Delete`). Direct `useDataStore.setState` writes bypass the version guard, command queue, tombstones, and source preference.
- **Do not pass the raw fetch response to `injectEntity`.** It must be a single entity matching `T`. For a list payload, let `useList` write or call `injectMany`.
- **Pick the right source tag.** A response that came from a detail endpoint is `'detail'`, not `'socket'`. Wrong tags weaken cross-source ordering and let weaker sources regress newer state.
- **`useList(params)` re-renders only on content change.** Identical entity references skip re-render thanks to `useShallow`. Avoid wrapping `data` in `useMemo` with new reference identity per render — that defeats it.
- **Detail and list share storage.** Updating one updates the other. There is no separate detail cache; `serverById[id]` is the single source.
- **Optimistic stacking is intentional.** While M1 is in flight and M2 has just succeeded, the UI shows M1's patch on top of M2's confirmed state. M1's settle collapses the stack.
- **`useCreate` is not optimistic.** Insertion happens after server success, then a list refetch. If you need optimistic insert, talk to the engine owner — it is currently out of scope.
- **`refetchEntity` returns `T | undefined`.** It only resolves if `fetchers.detail` is configured.
- **`signal` is mandatory in read fetchers.** Without it, params change does not abort the in-flight request and you can corrupt store state with stale responses.

---

## Testing a New Resource

Drop a unit test alongside the resource definition. Use the internal handle:

```ts
import { __getResourceInternals } from '~/stores/data/create-resource'
import { posts } from '~/stores/data/resources/posts'

const inner = __getResourceInternals(posts)!
inner.injectCreate({ id: 'p1', title: 'orig', modified: 1 })
const seq = inner.optimisticPush('p1', { title: 'optimistic' })
inner.confirmMutation('p1', { id: 'p1', title: 'server', modified: 2 }, seq)
expect(posts.get('p1')!.title).toBe('server')
```

Race / interleaving / version-guard tests live in `src/stores/data/__tests__/race.test.ts`. Mirror that style for resource-specific scenarios. Do not stand up React Query for these — go through the imperative internals.

---

## Quick Map

```
src/api/<name>.ts                            backend client (must accept signal)
src/stores/data/resources/<name>.ts          createResourceTable / createSingletonResource call
src/components/shared/SocketBridge.tsx       socket → engine action map
src/lib/socket-events.ts                     payload type narrowing (audit before wiring)

# Engine internals — do not edit unless touching the spec:
src/stores/data/types.ts
src/stores/data/store.ts
src/stores/data/create-resource.ts
src/stores/data/create-singleton.ts
```

When a backend endpoint changes shape or a new resource lands, do steps 1–6 of Recipe 1, narrow socket payloads if applicable, and add a unit test. That is the whole loop.
