import { Provider as JotaiProvider } from 'jotai'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, renderHook } from '@testing-library/react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest'

import { DraftRefType, type DraftModel } from '~/models/draft'
import type { PostModel } from '~/models/post'

import {
  deriveEffectivePost,
  diffEffectiveVsPublished,
} from './useEffectivePost'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

vi.mock('~/api/drafts', () => ({
  draftsApi: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getByRef: vi.fn(),
  },
}))

vi.mock('~/api/posts', () => ({
  postsApi: {
    patch: vi.fn(),
  },
}))

import { draftsApi } from '~/api/drafts'

import { useDraftAutosave } from './useDrafts'

const POST_ID = 'p1'

const draftFromBuffer = (
  id: string,
  refId: string,
  override?: Partial<DraftModel>,
): DraftModel => ({
  id,
  refType: DraftRefType.Post,
  refId,
  title: '',
  text: '',
  version: 1,
  updatedAt: '2026-05-11T00:00:00.000Z',
  createdAt: '2026-05-11T00:00:00.000Z',
  history: [],
  ...override,
})

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

function makeWrapper(client: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <JotaiProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </JotaiProvider>
  )
}

const flush = async () => {
  for (let i = 0; i < 12; i++) {
    await Promise.resolve()
  }
}

const advance = async (ms: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
    await flush()
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  ;(draftsApi.create as Mock).mockReset()
  ;(draftsApi.update as Mock).mockReset()
  ;(draftsApi.delete as Mock).mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDraftAutosave', () => {
  it('debounces a single commit into one POST after 10s', async () => {
    ;(draftsApi.create as Mock).mockResolvedValue(
      draftFromBuffer('d1', POST_ID),
    )
    const { result } = renderHook(() => useDraftAutosave(POST_ID), {
      wrapper: makeWrapper(makeClient()),
    })

    act(() => {
      result.current.commit({ slug: 'foo' })
    })
    expect(result.current.status).toBe('pending')
    expect(draftsApi.create).not.toHaveBeenCalled()

    await advance(10_000)
    await advance(0)

    expect(draftsApi.create).toHaveBeenCalledTimes(1)
    expect(draftsApi.create).toHaveBeenCalledWith(
      expect.objectContaining({
        refType: DraftRefType.Post,
        refId: POST_ID,
        typeSpecificData: { slug: 'foo' },
      }),
    )
  })

  it('collapses multiple commits within debounce window into one PUT call', async () => {
    ;(draftsApi.create as Mock).mockResolvedValue(
      draftFromBuffer('d1', POST_ID),
    )
    const { result } = renderHook(() => useDraftAutosave(POST_ID), {
      wrapper: makeWrapper(makeClient()),
    })

    act(() => {
      result.current.commit({ slug: 'a' })
    })
    await advance(3_000)
    act(() => {
      result.current.commit({ slug: 'b', categoryId: 'c1' })
    })
    await advance(3_000)
    act(() => {
      result.current.commit({ tags: ['t1'] })
    })

    expect(draftsApi.create).not.toHaveBeenCalled()

    await advance(10_000)
    await advance(0)

    expect(draftsApi.create).toHaveBeenCalledTimes(1)
    expect(draftsApi.create).toHaveBeenCalledWith(
      expect.objectContaining({
        typeSpecificData: { slug: 'b', categoryId: 'c1', tags: ['t1'] },
      }),
    )
  })

  it('first commit creates draft, subsequent commits update', async () => {
    ;(draftsApi.create as Mock).mockResolvedValue(
      draftFromBuffer('d1', POST_ID),
    )
    ;(draftsApi.update as Mock).mockResolvedValue(
      draftFromBuffer('d1', POST_ID, { updatedAt: '2026-05-11T00:00:01.000Z' }),
    )
    const { result } = renderHook(() => useDraftAutosave(POST_ID), {
      wrapper: makeWrapper(makeClient()),
    })

    act(() => {
      result.current.commit({ slug: 'first' })
    })
    await advance(10_000)
    await advance(0)

    expect(draftsApi.create).toHaveBeenCalledTimes(1)
    expect(result.current.draftId).toBe('d1')

    act(() => {
      result.current.commit({ slug: 'second' })
    })
    await advance(10_000)
    await advance(0)

    expect(draftsApi.update).toHaveBeenCalledTimes(1)
    expect(draftsApi.update).toHaveBeenCalledWith(
      'd1',
      expect.objectContaining({ typeSpecificData: { slug: 'second' } }),
    )
  })

  it('transitions pending -> saving -> saved -> idle within decay window', async () => {
    let resolveCreate: (v: DraftModel) => void = () => {}
    ;(draftsApi.create as Mock).mockImplementation(
      () =>
        new Promise<DraftModel>((res) => {
          resolveCreate = res
        }),
    )
    const { result } = renderHook(() => useDraftAutosave(POST_ID), {
      wrapper: makeWrapper(makeClient()),
    })

    act(() => {
      result.current.commit({ slug: 's' })
    })
    expect(result.current.status).toBe('pending')

    await advance(10_000)
    expect(result.current.status).toBe('saving')

    await act(async () => {
      resolveCreate(draftFromBuffer('d1', POST_ID))
      await flush()
    })
    expect(result.current.status).toBe('saved')
    expect(result.current.lastSavedAt).toBeTruthy()

    await advance(2_000)
    expect(result.current.status).toBe('idle')
  })

  it('puts state into error on failure and retry resends', async () => {
    ;(draftsApi.create as Mock).mockRejectedValueOnce(new Error('boom'))
    ;(draftsApi.create as Mock).mockResolvedValueOnce(
      draftFromBuffer('d1', POST_ID),
    )
    const { result } = renderHook(() => useDraftAutosave(POST_ID), {
      wrapper: makeWrapper(makeClient()),
    })

    act(() => {
      result.current.commit({ slug: 'oops' })
    })
    await advance(10_000)
    await advance(0)

    expect(result.current.status).toBe('error')
    expect(result.current.lastError?.message).toBe('boom')
    expect(result.current.dirtyFieldCount).toBe(1)

    await act(async () => {
      result.current.retry()
      await flush()
    })
    await advance(0)

    expect(draftsApi.create).toHaveBeenCalledTimes(2)
    expect(result.current.status).toBe('saved')
  })

  it('flush() cancels timer and fires immediately', async () => {
    ;(draftsApi.create as Mock).mockResolvedValue(
      draftFromBuffer('d1', POST_ID),
    )
    const { result } = renderHook(() => useDraftAutosave(POST_ID), {
      wrapper: makeWrapper(makeClient()),
    })

    act(() => {
      result.current.commit({ slug: 'fast' })
    })
    expect(draftsApi.create).not.toHaveBeenCalled()

    await act(async () => {
      const p = result.current.flush()
      await flush()
      await p
    })

    expect(draftsApi.create).toHaveBeenCalledTimes(1)
  })

  it('dirtyFieldCount counts distinct field keys + content + text', () => {
    ;(draftsApi.create as Mock).mockResolvedValue(
      draftFromBuffer('d1', POST_ID),
    )
    const { result } = renderHook(() => useDraftAutosave(POST_ID), {
      wrapper: makeWrapper(makeClient()),
    })

    act(() => {
      result.current.commit({ slug: 'a', categoryId: 'c1' })
    })
    expect(result.current.dirtyFieldCount).toBe(2)

    act(() => {
      result.current.commitBody('{"root":{}}')
    })
    expect(result.current.dirtyFieldCount).toBe(3)

    act(() => {
      result.current.commitText('hi')
    })
    expect(result.current.dirtyFieldCount).toBe(4)

    act(() => {
      result.current.commit({ slug: 'b' })
    })
    expect(result.current.dirtyFieldCount).toBe(4)
  })

  it('commitBody sets contentFormat to lexical in the buffer', async () => {
    ;(draftsApi.create as Mock).mockResolvedValue(
      draftFromBuffer('d1', POST_ID),
    )
    const { result } = renderHook(() => useDraftAutosave(POST_ID), {
      wrapper: makeWrapper(makeClient()),
    })

    act(() => {
      result.current.commitBody('{"root":{}}')
    })
    await advance(10_000)
    await advance(0)

    expect(draftsApi.create).toHaveBeenCalledTimes(1)
    expect(draftsApi.create).toHaveBeenCalledWith(
      expect.objectContaining({
        content: '{"root":{}}',
        contentFormat: 'lexical',
      }),
    )
  })
})

describe('deriveEffectivePost', () => {
  const post: PostModel = {
    id: POST_ID,
    title: 'orig',
    slug: 'orig-slug',
    text: 'orig text',
    summary: 'orig sum',
    copyright: true,
    tags: ['x'],
    readCount: 0,
    likeCount: 0,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'cat', slug: 'cat' } as PostModel['category'],
    images: [],
    createdAt: '2026-05-11T00:00:00.000Z',
    modifiedAt: null,
    isPublished: true,
  }

  it('uses draft fields when present, falls back to post otherwise', () => {
    const draft: DraftModel = draftFromBuffer('d1', POST_ID, {
      title: 'new title',
      text: 'new text',
      typeSpecificData: { slug: 'new-slug', tags: ['y', 'z'] },
    })
    const eff = deriveEffectivePost(post, draft)
    expect(eff.title).toBe('new title')
    expect(eff.slug).toBe('new-slug')
    expect(eff.tags).toEqual(['y', 'z'])
    expect(eff.categoryId).toBe('cat-1')
    expect(eff.summary).toBe('orig sum')
    expect(eff.text).toBe('new text')
  })

  it('with no draft, returns the post fields unchanged', () => {
    const eff = deriveEffectivePost(post, null)
    expect(eff.title).toBe('orig')
    expect(eff.slug).toBe('orig-slug')
    expect(eff.tags).toEqual(['x'])
    expect(eff.isPublished).toBe(true)
  })

  it('diffEffectiveVsPublished returns the changed field keys', () => {
    const draft: DraftModel = draftFromBuffer('d1', POST_ID, {
      title: 'changed',
      typeSpecificData: { slug: 'changed-slug', summary: null },
    })
    const eff = deriveEffectivePost(post, draft)
    const keys = diffEffectiveVsPublished(eff, post)
    expect(keys).toEqual(expect.arrayContaining(['title', 'slug', 'summary']))
    expect(keys).not.toContain('categoryId')
    expect(keys).not.toContain('tags')
  })
})

describe('useDraftAutosave host probe', () => {
  it('renders without crashing inside a normal component tree', () => {
    function Probe() {
      const a = useDraftAutosave(POST_ID)
      return <div data-testid="status">{a.status}</div>
    }
    const { getByTestId } = render(
      <JotaiProvider>
        <QueryClientProvider client={makeClient()}>
          <Probe />
        </QueryClientProvider>
      </JotaiProvider>,
    )
    expect(getByTestId('status').textContent).toBe('idle')
  })
})
