import { Funnel, SlidersHorizontal } from 'lucide-react'
import { useAtomValue } from 'jotai'

import { ColumnHeader, Popover } from '~/components/ui'
import {
  isPostsListFilterDefault,
  isPostsListSortDefault,
  postsListFilterAtom,
  postsListSortAtom,
} from '~/atoms/posts'

import { FilterChips } from './FilterChips'
import { FilterPopover } from './FilterPopover'
import { popupStyle } from './ListSubHeader.css'
import { SortPopover } from './SortPopover'

export const ListSubHeader = () => {
  const filter = useAtomValue(postsListFilterAtom)
  const sort = useAtomValue(postsListSortAtom)

  const hasFilter = !isPostsListFilterDefault(filter)
  const hasCustomSort = !isPostsListSortDefault(sort)

  return (
    <ColumnHeader data-testid="posts-list-subheader">
      <ColumnHeader.Left>
        <FilterChips />
      </ColumnHeader.Left>
      <ColumnHeader.Right>
        <Popover.Root>
          <Popover.Trigger
            render={
              <ColumnHeader.IconButton
                size="sm"
                aria-label="筛选"
                data-active={hasFilter || undefined}
                data-testid="filter-trigger"
              >
                <Funnel size={16} aria-hidden />
              </ColumnHeader.IconButton>
            }
          />
          <Popover.Portal>
            <Popover.Positioner align="end" sideOffset={8}>
              <Popover.Popup className={popupStyle} padding="sm">
                <FilterPopover />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        <Popover.Root>
          <Popover.Trigger
            render={
              <ColumnHeader.IconButton
                size="sm"
                aria-label="显示选项"
                data-active={hasCustomSort || undefined}
                data-testid="sort-trigger"
              >
                <SlidersHorizontal size={16} aria-hidden />
              </ColumnHeader.IconButton>
            }
          />
          <Popover.Portal>
            <Popover.Positioner align="end" sideOffset={8}>
              <Popover.Popup className={popupStyle} padding="sm">
                <SortPopover />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </ColumnHeader.Right>
    </ColumnHeader>
  )
}
