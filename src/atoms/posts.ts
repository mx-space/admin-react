import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const postsListCursorAtom = atom<string | null>(null)

export const postsListSelectionAtom = atom<Set<string>>(new Set<string>())

export const postsListAnchorAtom = atom<string | null>(null)

export const postsListSearchOpenAtom = atom<boolean>(false)

export const postsListSearchKeywordAtom = atom<string>('')

export type PostsListGrouping = 'none' | 'status' | 'month'

export type PostsListDisplayProperty =
  | 'category'
  | 'tags'
  | 'readCount'
  | 'likeCount'
  | 'time'

export interface PostsListDisplayState {
  grouping: PostsListGrouping
  displayProps: PostsListDisplayProperty[]
}

export const POSTS_LIST_DISPLAY_DEFAULT: PostsListDisplayState = {
  grouping: 'none',
  displayProps: ['category', 'tags', 'readCount', 'likeCount', 'time'],
}

export const postsListDisplayAtom = atomWithStorage<PostsListDisplayState>(
  'posts.list.display.v1',
  POSTS_LIST_DISPLAY_DEFAULT,
)

export type PostsListStatus = 'all' | 'published' | 'draft' | 'hidden'
export type PostsListPin = 'all' | 'pinned' | 'unpinned'
export type PostsListSortBy =
  | 'modifiedAt'
  | 'createdAt'
  | 'title'
  | 'readCount'
  | 'likeCount'
  | 'pinOrder'
export type PostsListSortOrder = 'asc' | 'desc'

export interface PostsListFilter {
  status: PostsListStatus
  categoryIds: string[]
  tagIds: string[]
  pin: PostsListPin
}

export interface PostsListSort {
  sortBy: PostsListSortBy
  order: PostsListSortOrder
}

export const POSTS_LIST_FILTER_DEFAULT: PostsListFilter = {
  status: 'all',
  categoryIds: [],
  tagIds: [],
  pin: 'all',
}

export const POSTS_LIST_SORT_DEFAULT: PostsListSort = {
  sortBy: 'modifiedAt',
  order: 'desc',
}

export const postsListFilterAtom = atomWithStorage<PostsListFilter>(
  'posts.list.filter.v1',
  POSTS_LIST_FILTER_DEFAULT,
)

export const postsListSortAtom = atomWithStorage<PostsListSort>(
  'posts.list.sort.v1',
  POSTS_LIST_SORT_DEFAULT,
)

export const isPostsListFilterDefault = (f: PostsListFilter): boolean =>
  f.status === 'all' &&
  f.categoryIds.length === 0 &&
  f.tagIds.length === 0 &&
  f.pin === 'all'

export const isPostsListSortDefault = (s: PostsListSort): boolean =>
  s.sortBy === POSTS_LIST_SORT_DEFAULT.sortBy &&
  s.order === POSTS_LIST_SORT_DEFAULT.order

const LEGACY_DISPLAY_KEY = 'posts.list.display.v1'
const LEGACY_MIGRATED_FLAG = 'posts.list.display.migrated.v1'

// Migrate legacy `showDrafts: false` (in display.v1) into filter.status='published'.
// Idempotent — runs once per browser; safe if storage is empty.
export const migrateLegacyPostsListDisplay = () => {
  if (typeof window === 'undefined') return
  try {
    if (window.localStorage.getItem(LEGACY_MIGRATED_FLAG) === '1') return
    const raw = window.localStorage.getItem(LEGACY_DISPLAY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PostsListDisplayState> & {
        showDrafts?: boolean
      }
      if (parsed?.showDrafts === false) {
        const filterRaw = window.localStorage.getItem('posts.list.filter.v1')
        const filter: PostsListFilter = filterRaw
          ? { ...POSTS_LIST_FILTER_DEFAULT, ...(JSON.parse(filterRaw) as PostsListFilter) }
          : { ...POSTS_LIST_FILTER_DEFAULT }
        filter.status = 'published'
        window.localStorage.setItem('posts.list.filter.v1', JSON.stringify(filter))
      }
      if ('showDrafts' in parsed) {
        const next: PostsListDisplayState = {
          grouping: parsed.grouping ?? 'none',
          displayProps:
            parsed.displayProps ?? POSTS_LIST_DISPLAY_DEFAULT.displayProps,
        }
        window.localStorage.setItem(LEGACY_DISPLAY_KEY, JSON.stringify(next))
      }
    }
    window.localStorage.setItem(LEGACY_MIGRATED_FLAG, '1')
  } catch {
    // ignore — corrupted storage; flag not set so migration may retry next load
  }
}

export const postsListClearTransientAtom = atom(null, (_get, set) => {
  set(postsListCursorAtom, null)
  set(postsListSelectionAtom, new Set<string>())
  set(postsListAnchorAtom, null)
  set(postsListSearchOpenAtom, false)
  set(postsListSearchKeywordAtom, '')
})
