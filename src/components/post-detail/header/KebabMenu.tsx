import { History, Link2, MoreHorizontal, Target, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Popover } from '~/components/ui'
import { iconButtonRecipe } from '~/components/ui/ColumnHeader/ColumnHeader.css'

import type { PostHeaderVariant } from './types'

import {
  menuItemDangerStyle,
  menuItemStyle,
  menuListStyle,
  menuSeparatorStyle,
} from './PostHeader.css'

export interface KebabMenuProps {
  variant: PostHeaderVariant
  onCopyId?: () => void
  onCopyPath?: () => void
  onSelectInList?: () => void
  onOpenHistory?: () => void
  onDelete: () => void
}

export const KebabMenu = ({
  variant,
  onCopyId,
  onCopyPath,
  onSelectInList,
  onOpenHistory,
  onDelete,
}: KebabMenuProps) => {
  const [open, setOpen] = useState(false)
  const triggerSize = variant === 'compact' ? 'sm' : 'md'

  const close = (fn?: () => void) => () => {
    setOpen(false)
    fn?.()
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={iconButtonRecipe[triggerSize]}
        aria-label="更多操作"
        data-testid="kebab-trigger"
      >
        <MoreHorizontal size={16} aria-hidden />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align="end">
          <Popover.Popup padding="none">
            <div className={menuListStyle} role="menu">
              {onCopyId ? (
                <button
                  type="button"
                  role="menuitem"
                  className={menuItemStyle}
                  onClick={close(onCopyId)}
                >
                  复制 ID
                </button>
              ) : null}
              {onCopyPath ? (
                <button
                  type="button"
                  role="menuitem"
                  className={menuItemStyle}
                  onClick={close(onCopyPath)}
                >
                  <Link2 size={14} aria-hidden />
                  复制路径
                </button>
              ) : null}
              {variant === 'compact' ? (
                <>
                  {onSelectInList ? (
                    <button
                      type="button"
                      role="menuitem"
                      className={menuItemStyle}
                      onClick={close(onSelectInList)}
                    >
                      <Target size={14} aria-hidden />
                      在列表选中
                    </button>
                  ) : null}
                  {onOpenHistory ? (
                    <button
                      type="button"
                      role="menuitem"
                      className={menuItemStyle}
                      onClick={close(onOpenHistory)}
                    >
                      <History size={14} aria-hidden />
                      历史
                    </button>
                  ) : null}
                  <div className={menuSeparatorStyle} aria-hidden />
                  <button
                    type="button"
                    role="menuitem"
                    className={`${menuItemStyle} ${menuItemDangerStyle}`}
                    onClick={close(onDelete)}
                    data-testid="kebab-delete"
                  >
                    <Trash2 size={14} aria-hidden />
                    移至回收站
                  </button>
                </>
              ) : null}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
