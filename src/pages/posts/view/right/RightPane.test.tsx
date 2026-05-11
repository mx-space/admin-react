import { Provider as JotaiProvider, useSetAtom } from 'jotai'
import { useEffect, type ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'

import { postsListCursorAtom } from '~/atoms/posts'
import { DraftRefType, type DraftModel } from '~/models/draft'
import type { PostModel } from '~/models/post'

vi.mock('~/components/editor/rich/RichEditor', () => ({
  RichEditor: () => <div data-testid="rich-editor-stub" />,
}))

vi.mock('~/components/post-detail/header/PostHeader', () => ({
  PostHeader: (props: Record<string, unknown>) => (
    <header data-testid="post-header" data-dirty={String(props.dirtyFieldCount)}>
      <button
        type="button"
        data-testid="header-publish"
        disabled={props.dirtyFieldCount === 0}
        onClick={() => (props.onPublish as () => void)()}
      >
        提交
      </button>
      <button
        type="button"
        data-testid="header-discard"
        onClick={() => (props.onDiscard as () => void)()}
      >
        弃改
      </button>
    </header>
  ),
}))

const mockUsePostDetail = vi.fn()
const mockUseDraftByRef = vi.fn()
const mockUseDraftAutosave = vi.fn()
const mockUsePublishDraft = vi.fn()
const mockUseDiscardDraft = vi.fn()
const mockUseUpdateDraft = vi.fn()
const mockUseCreateDraft = vi.fn()
const mockUsePostDelete = vi.fn()
const mockUseCategoryList = vi.fn()

vi.mock('~/hooks/queries/usePosts', () => ({
  usePostDetail: (...args: unknown[]) => mockUsePostDetail(...args),
  usePostDelete: () => mockUsePostDelete(),
  postDetailQueryKey: (id: string) => ['posts', 'detail', id] as const,
}))

vi.mock('~/hooks/queries/useDrafts', () => ({
  useDraftByRef: (...args: unknown[]) => mockUseDraftByRef(...args),
  useDraftAutosave: (...args: unknown[]) => mockUseDraftAutosave(...args),
  usePublishDraft: (...args: unknown[]) => mockUsePublishDraft(...args),
  useDiscardDraft: (...args: unknown[]) => mockUseDiscardDraft(...args),
  useUpdateDraft: (...args: unknown[]) => mockUseUpdateDraft(...args),
  useCreateDraft: (...args: unknown[]) => mockUseCreateDraft(...args),
}))

vi.mock('~/hooks/queries/useCategoryList', () => ({
  useCategoryList: () => mockUseCategoryList(),
  categoryListQueryKey: ['categories', 'list'] as const,
}))

import { RightPane } from './RightPane'

const fakePost: PostModel = {
  id: 'p1',
  title: 'Hello',
  slug: 'hello',
  text: 'body text',
  summary: null,
  copyright: true,
  tags: ['t1'],
  readCount: 0,
  likeCount: 0,
  categoryId: 'c1',
  category: { id: 'c1', name: 'general', slug: 'general', type: 0, count: 0, createdAt: '' },
  images: [],
  createdAt: '2026-05-11T00:00:00.000Z',
  modifiedAt: null,
  isPublished: true,
}

const fakeDraft: DraftModel = {
  id: 'd1',
  refType: DraftRefType.Post,
  refId: 'p1',
  title: 'Hello (draft)',
  text: '',
  version: 1,
  updatedAt: '2026-05-11T00:00:00.000Z',
  createdAt: '2026-05-11T00:00:00.000Z',
  history: [],
  typeSpecificData: { slug: 'hello-draft' },
}

const baseAutosave = {
  commit: vi.fn(),
  commitBody: vi.fn(),
  commitText: vi.fn(),
  flush: vi.fn().mockResolvedValue(undefined),
  retry: vi.fn(),
  status: 'idle' as const,
  lastSavedAt: null,
  lastError: null,
  draftId: null as string | null,
  dirtyFieldCount: 0,
}

const SetCursor = ({ cursor, children }: { cursor: string | null; children?: ReactNode }) => {
  const set = useSetAtom(postsListCursorAtom)
  useEffect(() => {
    set(cursor)
  }, [cursor, set])
  return <>{children}</>
}

const renderPane = (cursor: string | null) => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <JotaiProvider>
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <SetCursor cursor={cursor}>
            <RightPane />
          </SetCursor>
        </MemoryRouter>
      </QueryClientProvider>
    </JotaiProvider>,
  )
}

const setupHookMocks = ({
  post = fakePost,
  draft = null as DraftModel | null,
  autosave = baseAutosave,
  publishMutate = vi.fn(),
  discardMutate = vi.fn(),
  deleteMutate = vi.fn(),
} = {}) => {
  mockUsePostDetail.mockReturnValue({ data: post, isLoading: false, isError: false })
  mockUseDraftByRef.mockReturnValue({ data: draft })
  mockUseDraftAutosave.mockReturnValue(autosave)
  mockUsePublishDraft.mockReturnValue({ mutate: publishMutate })
  mockUseDiscardDraft.mockReturnValue({ mutate: discardMutate })
  mockUseUpdateDraft.mockReturnValue({ mutate: vi.fn() })
  mockUseCreateDraft.mockReturnValue({ mutate: vi.fn() })
  mockUsePostDelete.mockReturnValue({ mutate: deleteMutate })
  mockUseCategoryList.mockReturnValue({ data: [fakePost.category] })
  return { publishMutate, discardMutate, deleteMutate }
}

beforeEach(() => {
  vi.clearAllMocks()
  ;(baseAutosave.commit as Mock).mockReset()
  ;(baseAutosave.flush as Mock).mockClear()
})

afterEach(() => {
  vi.resetModules()
})

describe('RightPane', () => {
  it('renders empty state when no cursor', () => {
    setupHookMocks()
    renderPane(null)
    expect(screen.getByText('选一篇文章以预览')).toBeInTheDocument()
  })

  it('renders post fields when cursor + post present, no draft → dirty=0', () => {
    setupHookMocks({ draft: null })
    renderPane('p1')
    const header = screen.getByTestId('post-header')
    expect(header.getAttribute('data-dirty')).toBe('0')
    expect(screen.getByTestId('header-publish')).toBeDisabled()
  })

  it('renders effective values when draft overrides; publish enabled', () => {
    setupHookMocks({ draft: fakeDraft })
    renderPane('p1')
    const header = screen.getByTestId('post-header')
    // title differs + slug differs → 2 dirty
    expect(Number(header.getAttribute('data-dirty'))).toBeGreaterThan(0)
    expect(screen.getByTestId('header-publish')).not.toBeDisabled()
  })

  it('Recovery banner shows once when post+draft both present, hides on action', () => {
    setupHookMocks({ draft: fakeDraft })
    const { unmount } = renderPane('p1')
    expect(screen.getByTestId('recovery-banner')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('recovery-banner-use-draft'))
    expect(screen.queryByTestId('recovery-banner')).not.toBeInTheDocument()
    unmount()
  })

  it('Recovery banner "用已发布" discards draft and hides banner', () => {
    const { discardMutate } = setupHookMocks({ draft: fakeDraft })
    renderPane('p1')
    expect(screen.getByTestId('recovery-banner')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('recovery-banner-use-published'))
    expect(discardMutate).toHaveBeenCalledTimes(1)
    expect(discardMutate.mock.calls[0][0]).toEqual({ draftId: 'd1' })
    expect(screen.queryByTestId('recovery-banner')).not.toBeInTheDocument()
  })

  it('Slug field rejects invalid slug → no autosave commit', () => {
    const { publishMutate: _ } = setupHookMocks({ draft: null })
    void _
    renderPane('p1')

    fireEvent.click(screen.getByTestId('slug-field'))
    const input = screen.getByTestId('slug-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Invalid Slug!' } })
    fireEvent.blur(input)

    expect(baseAutosave.commit).not.toHaveBeenCalled()
    expect(screen.getByRole('alert').textContent).toMatch(/a-z|无效|过长/)
  })

  it('Status switch toggle commits isPublished', () => {
    setupHookMocks({ draft: null })
    renderPane('p1')
    fireEvent.click(screen.getByTestId('status-switch'))
    expect(baseAutosave.commit).toHaveBeenCalledWith({ isPublished: false })
  })

  it('Discard modal opens on header discard; confirm calls discard.mutate', () => {
    const { discardMutate } = setupHookMocks({ draft: fakeDraft })
    renderPane('p1')
    // Hide recovery banner first (use-draft is no-op besides hiding)
    fireEvent.click(screen.getByTestId('recovery-banner-use-draft'))

    fireEvent.click(screen.getByTestId('header-discard'))
    expect(screen.getByTestId('discard-modal')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('discard-confirm'))
    expect(discardMutate).toHaveBeenCalledTimes(1)
    expect(discardMutate.mock.calls[0][0]).toEqual({ draftId: 'd1' })
  })

  it('Cursor change triggers autosave.flush', () => {
    setupHookMocks({ draft: null })
    const { unmount } = renderPane('p1')
    expect(baseAutosave.flush).not.toHaveBeenCalled()
    unmount()
    expect(baseAutosave.flush).toHaveBeenCalled()
  })
})
