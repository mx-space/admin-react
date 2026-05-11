import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, type MouseEvent } from 'react'
import { useNavigate } from 'react-router'

import {
  Empty,
  Pagination,
  Skeleton,
} from '~/components/ui'
import { useShortcut } from '~/hooks/useShortcut'
import { usePostsList } from '~/hooks/queries/usePosts'
import {
  isPostsListFilterDefault,
  POSTS_LIST_FILTER_DEFAULT,
  postsListAnchorAtom,
  postsListCursorAtom,
  postsListFilterAtom,
  postsListSearchKeywordAtom,
  postsListSelectionAtom,
} from '~/atoms/posts'
import type { PostModel } from '~/models'

import {
  listBodyStyle,
  listContainerStyle,
  listInnerStyle,
  paginationBarStyle,
  skeletonRowStyle,
  stateContainerStyle,
} from '../PostsView.css'
import { PostRow } from './Row'

const SKELETON_COUNT = 8

export const PostsList = () => {
  const {
    data,
    totalCount,
    state,
    setState,
    isLoading,
    isError,
    refetch,
  } = usePostsList()
  const [cursor, setCursor] = useAtom(postsListCursorAtom)
  const [selection, setSelection] = useAtom(postsListSelectionAtom)
  const [anchor, setAnchor] = useAtom(postsListAnchorAtom)
  const keyword = useAtomValue(postsListSearchKeywordAtom)
  const [filter, setFilter] = useAtom(postsListFilterAtom)
  const navigate = useNavigate()

  // sync cursor to first row on data change when cursor disappears
  useEffect(() => {
    if (data.length === 0) {
      setCursor(null)
      return
    }
    if (!cursor || !data.some((p) => p.id === cursor)) {
      setCursor(data[0].id)
    }
  }, [data, cursor, setCursor])

  // map id → index for keyboard navigation
  const idToIndex = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach((p, i) => map.set(p.id, i))
    return map
  }, [data])

  const moveCursor = useCallback(
    (direction: 1 | -1) => {
      if (data.length === 0) return
      const idx = cursor ? (idToIndex.get(cursor) ?? -1) : -1
      let next = idx + direction
      if (next < 0) next = 0
      if (next >= data.length) next = data.length - 1
      setCursor(data[next].id)
    },
    [cursor, data, idToIndex, setCursor],
  )

  const handleClickRow = useCallback(
    (post: PostModel, event: MouseEvent<HTMLDivElement>) => {
      const id = post.id
      const isMod = event.metaKey || event.ctrlKey
      const isShift = event.shiftKey
      setCursor(id)
      if (isMod) {
        setSelection((prev) => {
          const next = new Set(prev)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        })
        setAnchor(id)
        return
      }
      if (isShift && anchor && idToIndex.has(anchor)) {
        const a = idToIndex.get(anchor)!
        const b = idToIndex.get(id)!
        const [from, to] = a < b ? [a, b] : [b, a]
        const next = new Set<string>()
        for (let i = from; i <= to; i++) next.add(data[i].id)
        setSelection(next)
        return
      }
      // plain click
      setSelection((prev) => (prev.size <= 1 ? new Set([id]) : new Set()))
      setAnchor(id)
    },
    [anchor, data, idToIndex, setAnchor, setCursor, setSelection],
  )

  // chords scoped to posts.list page (registered here for proximity to data)
  useShortcut('j', () => moveCursor(1), { allowRepeat: true })
  useShortcut('k', () => moveCursor(-1), { allowRepeat: true })
  useShortcut('ArrowDown', (e) => {
    if (e.target && e.target instanceof HTMLElement && e.target.closest('input,textarea,[contenteditable]')) {
      return
    }
    moveCursor(1)
  }, { allowRepeat: true })
  useShortcut('ArrowUp', (e) => {
    if (e.target && e.target instanceof HTMLElement && e.target.closest('input,textarea,[contenteditable]')) {
      return
    }
    moveCursor(-1)
  }, { allowRepeat: true })
  useShortcut('x', () => {
    if (!cursor) return
    setSelection((prev) => {
      const next = new Set(prev)
      if (next.has(cursor)) next.delete(cursor)
      else next.add(cursor)
      return next
    })
    setAnchor(cursor)
  })
  useShortcut('$mod+A', () => {
    if (data.length === 0) return
    setSelection(new Set(data.map((p) => p.id)))
    setAnchor(data[0].id)
  })
  useShortcut('Escape', () => {
    if (selection.size > 0) {
      setSelection(new Set())
      setAnchor(null)
    }
  })
  useShortcut('$mod+Enter', () => {
    if (cursor) navigate(`/posts/edit?id=${cursor}`)
  })
  useShortcut('$mod+N', () => navigate('/posts/edit'))

  if (isLoading) {
    return (
      <div className={listContainerStyle}>
        <div className={listBodyStyle}>
          <div className={listInnerStyle}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className={skeletonRowStyle}>
                <Skeleton shape="text" width="40%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={listContainerStyle}>
        <div className={stateContainerStyle}>
          <Empty
            title="加载失败"
            description="请检查网络后重试"
            action={
              <button type="button" onClick={() => void refetch()}>
                重试
              </button>
            }
          />
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    const isSearching = keyword.trim().length > 0
    const isFiltering = !isPostsListFilterDefault(filter)
    const emptyTitle = isSearching
      ? `「${keyword}」没有结果`
      : isFiltering
        ? '无符合筛选之结果'
        : '还没有文章'
    const emptyAction =
      !isSearching && isFiltering ? (
        <button
          type="button"
          onClick={() => setFilter(POSTS_LIST_FILTER_DEFAULT)}
          data-testid="empty-reset-filter"
        >
          重置筛选
        </button>
      ) : undefined
    return (
      <div className={listContainerStyle}>
        <div className={stateContainerStyle}>
          <Empty title={emptyTitle} action={emptyAction} />
        </div>
      </div>
    )
  }

  return (
    <div className={listContainerStyle}>
      <div className={listBodyStyle}>
        <div
          className={listInnerStyle}
          role="listbox"
          aria-multiselectable
          aria-activedescendant={cursor ?? undefined}
        >
          {data.map((post) => (
            <PostRow
              key={post.id}
              post={post}
              isActive={cursor === post.id}
              isSelected={selection.has(post.id)}
              onClick={(e) => handleClickRow(post, e)}
            />
          ))}
        </div>
      </div>
      <div className={paginationBarStyle}>
        <Pagination
          page={state.page}
          total={totalCount}
          pageSize={state.pageSize}
          pageSizeOptions={false}
          onPageChange={(page) => {
            setState((prev) => ({ ...prev, page }))
            setSelection(new Set())
            setAnchor(null)
          }}
        />
      </div>
    </div>
  )
}
