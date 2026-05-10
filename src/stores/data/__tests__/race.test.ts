import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  __getResourceInternals,
  createResourceTable,
} from '../create-resource'
import {
  emptyResourceSlice,
  hash,
  resetDataStore,
  useDataStore,
} from '../store'
import type { PaginatedResponse, ResourceState } from '../types'

interface Post {
  id: string
  title: string
  pinned?: boolean
  modified?: number
}

interface Comment {
  id: string
  body: string
}

const sliceOf = <T>(name: string): ResourceState<T> =>
  useDataStore.getState()[name] as ResourceState<T>

const seedSlice = (name: string) => {
  useDataStore.setState(
    (s) => ({
      ...s,
      __slices: { ...s.__slices, [name]: 'resource' as const },
      [name]: emptyResourceSlice<unknown>(),
    }),
    false,
  )
}

afterEach(() => {
  resetDataStore()
})

describe('race control', () => {
  describe('(a) list params change mid-flight', () => {
    let posts: ReturnType<typeof createResourceTable<Post, { page: number }>>
    beforeEach(() => {
      posts = createResourceTable<Post, { page: number }>({
        name: 'posts_a',
        versionKey: 'modified',
        fetchers: {},
      })
    })

    it('drops stale list response when listFetchSeq has moved on', () => {
      const inner = __getResourceInternals<Post, { page: number }>(posts)!
      const seq1 = inner.bumpListSeq({ page: 1 })
      const seq2 = inner.bumpListSeq({ page: 1 })
      expect(seq2).toBeGreaterThan(seq1)
      // late response carrying seq1 — must be dropped
      inner.upsertList({ page: 1 }, [{ id: 'p1', title: 'A', modified: 10 }], seq1)
      const slice = sliceOf<Post>('posts_a')
      expect(slice.lists[hash({ page: 1 })]).toBeUndefined()
      expect(slice.serverById.p1).toBeUndefined()
      // current seq response wins
      inner.upsertList({ page: 1 }, [{ id: 'p2', title: 'B', modified: 11 }], seq2)
      const after = sliceOf<Post>('posts_a')
      expect(after.lists[hash({ page: 1 })]?.ids).toEqual(['p2'])
      expect(after.serverById.p2.title).toBe('B')
    })
  })

  describe('(c) list response stale relative to confirmed mutation', () => {
    it('version guard drops older entity from list inject; ids still recorded', () => {
      const posts = createResourceTable<Post, { page: number }>({
        name: 'posts_c',
        versionKey: 'modified',
        fetchers: {},
      })
      const inner = __getResourceInternals<Post, { page: number }>(posts)!
      // confirmed mutation: serverById.p1 modified=20
      const mySeq = inner.optimisticPush('p1', { title: 'M' })
      inner.confirmMutation('p1', { id: 'p1', title: 'M', modified: 20 }, mySeq)
      // late list response carries older modified=10
      const lseq = inner.bumpListSeq({ page: 1 })
      inner.upsertList(
        { page: 1 },
        [{ id: 'p1', title: 'OLD', modified: 10 }],
        lseq,
      )
      const slice = sliceOf<Post>('posts_c')
      // serverById preserved at version 20
      expect(slice.serverById.p1.title).toBe('M')
      expect(slice.serverById.p1.modified).toBe(20)
      // ids[] still records membership
      expect(slice.lists[hash({ page: 1 })]?.ids).toEqual(['p1'])
      // byId still equals serverById (no pending ops)
      expect(slice.byId.p1.title).toBe('M')
    })
  })

  describe('(d) out-of-order socket events', () => {
    it('older socket inject is dropped via version guard', () => {
      const posts = createResourceTable<Post>({
        name: 'posts_d',
        versionKey: 'modified',
        fetchers: {},
      })
      posts.injectEntity({ id: 'p1', title: 'A', modified: 10 }, 'socket')
      posts.injectEntity({ id: 'p1', title: 'B', modified: 20 }, 'socket')
      // older arrives last
      posts.injectEntity({ id: 'p1', title: 'OLD', modified: 5 }, 'socket')
      const slice = sliceOf<Post>('posts_d')
      expect(slice.serverById.p1.title).toBe('B')
      expect(slice.serverById.p1.modified).toBe(20)
    })
  })

  describe('(e) two updates to same id; older response discarded', () => {
    it('command queue + version guard preserves latest', () => {
      const posts = createResourceTable<Post>({
        name: 'posts_e',
        versionKey: 'modified',
        fetchers: {},
      })
      const inner = __getResourceInternals<Post, unknown>(posts)!
      const m1 = inner.optimisticPush('p1', { title: 'A' })
      const m2 = inner.optimisticPush('p1', { title: 'B' })
      // M2 settles first with newer modified
      inner.confirmMutation('p1', { id: 'p1', title: 'B', modified: 100 }, m2)
      // M1 settles later with older modified — must be dropped by guard
      inner.confirmMutation('p1', { id: 'p1', title: 'A', modified: 50 }, m1)
      const slice = sliceOf<Post>('posts_e')
      expect(slice.serverById.p1.title).toBe('B')
      expect(slice.serverById.p1.modified).toBe(100)
      expect(slice.byId.p1.title).toBe('B')
      expect(slice.pendingOps.p1 ?? []).toEqual([])
    })
  })

  describe('(g) onError preserves unrelated newer mutation', () => {
    it('rollback removes only the failed op', () => {
      const posts = createResourceTable<Post>({
        name: 'posts_g',
        fetchers: {},
      })
      const inner = __getResourceInternals<Post, unknown>(posts)!
      // seed serverById
      inner.injectCreate({ id: 'p1', title: 'orig' })
      const m1 = inner.optimisticPush('p1', { title: 'M1' })
      const m2 = inner.optimisticPush('p1', { title: 'M2' })
      // byId reflects M2 stack
      expect(sliceOf<Post>('posts_g').byId.p1.title).toBe('M2')
      // M1 fails — rollback only M1
      inner.rollbackMutation('p1', m1)
      expect(sliceOf<Post>('posts_g').byId.p1.title).toBe('M2')
      expect(sliceOf<Post>('posts_g').pendingOps.p1).toHaveLength(1)
      // M2 succeeds
      inner.confirmMutation('p1', { id: 'p1', title: 'M2-server' }, m2)
      const slice = sliceOf<Post>('posts_g')
      expect(slice.serverById.p1.title).toBe('M2-server')
      expect(slice.byId.p1.title).toBe('M2-server')
      expect(slice.pendingOps.p1 ?? []).toEqual([])
    })
  })

  describe('(h) detail vs list vs socket', () => {
    it('detail-source write preserved against later list write of same version', () => {
      const posts = createResourceTable<Post, { page: number }>({
        name: 'posts_h',
        // no versionKey — falls to source preference
        fetchers: {},
      })
      // detail wins over list when versions tie
      posts.injectEntity({ id: 'p1', title: 'detail' }, 'detail')
      const inner = __getResourceInternals<Post, { page: number }>(posts)!
      const lseq = inner.bumpListSeq({ page: 1 })
      inner.upsertList(
        { page: 1 },
        [{ id: 'p1', title: 'list' }],
        lseq,
      )
      const slice = sliceOf<Post>('posts_h')
      // list cannot regress detail-source
      expect(slice.serverById.p1.title).toBe('detail')
      // ids[] still records membership
      expect(slice.lists[hash({ page: 1 })]?.ids).toEqual(['p1'])
    })

    it('mutation > detail > socket > list ranking', () => {
      const posts = createResourceTable<Post>({
        name: 'posts_h2',
        fetchers: {},
      })
      posts.injectEntity({ id: 'p1', title: 'list' }, 'list')
      posts.injectEntity({ id: 'p1', title: 'socket' }, 'socket')
      expect(sliceOf<Post>('posts_h2').serverById.p1.title).toBe('socket')
      posts.injectEntity({ id: 'p1', title: 'detail' }, 'detail')
      expect(sliceOf<Post>('posts_h2').serverById.p1.title).toBe('detail')
      // a later list write must NOT regress
      posts.injectEntity({ id: 'p1', title: 'list-late' }, 'list')
      expect(sliceOf<Post>('posts_h2').serverById.p1.title).toBe('detail')
      // mutation source wins (via internal optimistic→confirm sequence)
      const inner = __getResourceInternals<Post, unknown>(posts)!
      const seq = inner.optimisticPush('p1', { title: 'mut' })
      inner.confirmMutation('p1', { id: 'p1', title: 'mut-server' }, seq)
      expect(sliceOf<Post>('posts_h2').serverById.p1.title).toBe('mut-server')
    })
  })

  describe('(i) tombstone resurrection guard', () => {
    it('inject after delete is dropped within TOMBSTONE_TTL', () => {
      const posts = createResourceTable<Post>({
        name: 'posts_i',
        fetchers: {},
      })
      posts.injectEntity({ id: 'p1', title: 'orig' }, 'detail')
      posts.removeEntity('p1')
      // socket inject 立至，必弃
      posts.injectEntity({ id: 'p1', title: 'resurrect' }, 'socket')
      const slice = sliceOf<Post>('posts_i')
      expect(slice.serverById.p1).toBeUndefined()
      expect(slice.byId.p1).toBeUndefined()
      expect(slice.tombstones.p1).toBeDefined()
      // a fresh injectCreate clears tombstone
      const inner = __getResourceInternals<Post, unknown>(posts)!
      inner.injectCreate({ id: 'p1', title: 'fresh' })
      const after = sliceOf<Post>('posts_i')
      expect(after.serverById.p1.title).toBe('fresh')
      expect(after.tombstones.p1).toBeUndefined()
    })

    it('list response prunes tombstoned id from ids[]', () => {
      const posts = createResourceTable<Post, { page: number }>({
        name: 'posts_i2',
        fetchers: {},
      })
      posts.injectEntity({ id: 'p1', title: 'orig' }, 'detail')
      posts.removeEntity('p1')
      const inner = __getResourceInternals<Post, { page: number }>(posts)!
      const seq = inner.bumpListSeq({ page: 1 })
      inner.upsertList(
        { page: 1 },
        [
          { id: 'p1', title: 'resurrect' },
          { id: 'p2', title: 'b' },
        ],
        seq,
      )
      const slice = sliceOf<Post>('posts_i2')
      expect(slice.lists[hash({ page: 1 })]?.ids).toEqual(['p2'])
      expect(slice.serverById.p1).toBeUndefined()
      expect(slice.serverById.p2.title).toBe('b')
    })
  })
})

describe('command queue truth table', () => {
  it('M1 ok, M2 ok → byId tracks last server', () => {
    const posts = createResourceTable<Post>({
      name: 'posts_tt1',
      versionKey: 'modified',
      fetchers: {},
    })
    const inner = __getResourceInternals<Post, unknown>(posts)!
    const m1 = inner.optimisticPush('p1', { title: 'M1' })
    const m2 = inner.optimisticPush('p1', { title: 'M2' })
    inner.confirmMutation('p1', { id: 'p1', title: 'M1', modified: 10 }, m1)
    inner.confirmMutation('p1', { id: 'p1', title: 'M2', modified: 20 }, m2)
    const slice = sliceOf<Post>('posts_tt1')
    expect(slice.byId.p1.title).toBe('M2')
    expect(slice.pendingOps.p1 ?? []).toEqual([])
  })

  it('M1 fail, M2 ok → byId = serverById + [] (M2 server)', () => {
    const posts = createResourceTable<Post>({
      name: 'posts_tt2',
      versionKey: 'modified',
      fetchers: {},
    })
    const inner = __getResourceInternals<Post, unknown>(posts)!
    const m1 = inner.optimisticPush('p1', { title: 'M1' })
    const m2 = inner.optimisticPush('p1', { title: 'M2' })
    inner.rollbackMutation('p1', m1)
    inner.confirmMutation('p1', { id: 'p1', title: 'M2', modified: 20 }, m2)
    const slice = sliceOf<Post>('posts_tt2')
    expect(slice.byId.p1.title).toBe('M2')
  })

  it('M1 ok, M2 fail → byId = M1 server (M2 removed)', () => {
    const posts = createResourceTable<Post>({
      name: 'posts_tt3',
      versionKey: 'modified',
      fetchers: {},
    })
    const inner = __getResourceInternals<Post, unknown>(posts)!
    const m1 = inner.optimisticPush('p1', { title: 'M1' })
    const m2 = inner.optimisticPush('p1', { title: 'M2' })
    inner.confirmMutation('p1', { id: 'p1', title: 'M1', modified: 10 }, m1)
    // queue still has [M2]; byId = M1 server + M2 patch
    expect(sliceOf<Post>('posts_tt3').byId.p1.title).toBe('M2')
    inner.rollbackMutation('p1', m2)
    expect(sliceOf<Post>('posts_tt3').byId.p1.title).toBe('M1')
  })

  it('M1 fail, M2 fail → byId = serverById (initial)', () => {
    const posts = createResourceTable<Post>({
      name: 'posts_tt4',
      versionKey: 'modified',
      fetchers: {},
    })
    const inner = __getResourceInternals<Post, unknown>(posts)!
    inner.injectCreate({ id: 'p1', title: 'orig', modified: 1 })
    const m1 = inner.optimisticPush('p1', { title: 'M1' })
    const m2 = inner.optimisticPush('p1', { title: 'M2' })
    inner.rollbackMutation('p1', m1)
    inner.rollbackMutation('p1', m2)
    expect(sliceOf<Post>('posts_tt4').byId.p1.title).toBe('orig')
  })
})

describe('pagination contract', () => {
  it('normalizeListResponse handles bare array, {data}, and {data,pagination}', () => {
    const posts = createResourceTable<Comment, { page: number }>({
      name: 'cm_norm',
      fetchers: {},
    })
    const inner = __getResourceInternals<Comment, { page: number }>(posts)!
    const seq1 = inner.bumpListSeq({ page: 1 })
    inner.upsertList(
      { page: 1 },
      [{ id: 'c1', body: 'x' }],
      seq1,
    )
    expect(sliceOf<Comment>('cm_norm').lists[hash({ page: 1 })]?.meta.totalCount).toBe(1)

    seedSlice('cm_norm2')
    const posts2 = createResourceTable<Comment, { page: number }>({
      name: 'cm_norm2',
      fetchers: {},
    })
    const inner2 = __getResourceInternals<Comment, { page: number }>(posts2)!
    const seq2 = inner2.bumpListSeq({ page: 1 })
    const resp: PaginatedResponse<Comment> = {
      data: [{ id: 'c1', body: 'x' }],
      pagination: { totalCount: 99, totalPages: 5, currentPage: 1 },
    }
    inner2.upsertList({ page: 1 }, resp, seq2)
    const meta = sliceOf<Comment>('cm_norm2').lists[hash({ page: 1 })]?.meta
    expect(meta?.totalCount).toBe(99)
    expect(meta?.totalPages).toBe(5)
  })
})

describe('delete drops pendingOps and sourceSeq for the id', () => {
  it('mutation settle after remove is final', () => {
    const posts = createResourceTable<Post>({
      name: 'posts_del',
      fetchers: {},
    })
    const inner = __getResourceInternals<Post, unknown>(posts)!
    inner.injectCreate({ id: 'p1', title: 'a' })
    const m1 = inner.optimisticPush('p1', { title: 'M1' })
    posts.removeEntity('p1')
    // settle of m1 must not resurrect (op already removed)
    inner.confirmMutation('p1', { id: 'p1', title: 'M1-server' }, m1)
    const slice = sliceOf<Post>('posts_del')
    expect(slice.serverById.p1).toBeUndefined()
    expect(slice.byId.p1).toBeUndefined()
    expect(slice.pendingOps.p1).toBeUndefined()
  })
})
