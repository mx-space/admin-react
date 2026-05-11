import { X } from 'lucide-react'
import { useAtom } from 'jotai'
import { useMemo } from 'react'

import {
  POSTS_LIST_FILTER_DEFAULT,
  postsListFilterAtom,
  type PostsListFilter,
  type PostsListPin,
  type PostsListStatus,
} from '~/atoms/posts'

import {
  filterChipCloseStyle,
  filterChipStyle,
  filterChipsStyle,
} from './ListSubHeader.css'

const STATUS_LABEL: Record<PostsListStatus, string> = {
  all: '全部',
  published: '已发布',
  draft: '草稿',
  hidden: '隐藏',
}

const PIN_LABEL: Record<PostsListPin, string> = {
  all: '全部',
  pinned: '已置顶',
  unpinned: '未置顶',
}

interface ChipDef {
  id: string
  label: string
  clear: (prev: PostsListFilter) => PostsListFilter
}

export const FilterChips = () => {
  const [filter, setFilter] = useAtom(postsListFilterAtom)

  const chips = useMemo<ChipDef[]>(() => {
    const out: ChipDef[] = []
    if (filter.status !== 'all') {
      out.push({
        id: 'status',
        label: STATUS_LABEL[filter.status],
        clear: (p) => ({ ...p, status: 'all' }),
      })
    }
    if (filter.categoryIds.length > 0) {
      out.push({
        id: 'categories',
        label: `分类 (${filter.categoryIds.length})`,
        clear: (p) => ({ ...p, categoryIds: [] }),
      })
    }
    if (filter.tagIds.length > 0) {
      out.push({
        id: 'tags',
        label: `标签 (${filter.tagIds.length})`,
        clear: (p) => ({ ...p, tagIds: [] }),
      })
    }
    if (filter.pin !== 'all') {
      out.push({
        id: 'pin',
        label: PIN_LABEL[filter.pin],
        clear: (p) => ({ ...p, pin: 'all' }),
      })
    }
    return out
  }, [filter])

  if (chips.length === 0) return null

  return (
    <div className={filterChipsStyle} data-testid="filter-chips">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          className={filterChipStyle}
          aria-label={`移除 ${chip.label} 筛选`}
          data-testid={`filter-chip-${chip.id}`}
          onClick={() => setFilter(chip.clear(filter))}
        >
          {chip.label}
          <span className={filterChipCloseStyle} aria-hidden>
            <X size={10} />
          </span>
        </button>
      ))}
      {chips.length > 1 ? (
        <button
          type="button"
          className={filterChipStyle}
          aria-label="重置全部筛选"
          data-testid="filter-chip-reset"
          onClick={() => setFilter(POSTS_LIST_FILTER_DEFAULT)}
        >
          清空
        </button>
      ) : null}
    </div>
  )
}
