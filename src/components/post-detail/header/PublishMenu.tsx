import { ChevronDown, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button, Popover } from '~/components/ui'

import type { PostHeaderVariant } from './types'

import {
  menuItemDangerStyle,
  menuItemStyle,
  menuListStyle,
  menuSeparatorStyle,
  publishCompactChevronStyle,
  publishCompactPrimaryStyle,
  publishMenuRootStyle,
  publishSplitChevronStyle,
  publishSplitPrimaryStyle,
} from './PostHeader.css'

export interface PublishMenuProps {
  variant: PostHeaderVariant
  disabled: boolean
  onPublish: () => void
  onDiscard: () => void
}

export const PublishMenu = ({
  variant,
  disabled,
  onPublish,
  onDiscard,
}: PublishMenuProps) => {
  const [open, setOpen] = useState(false)

  const primaryLabel = variant === 'full' ? '提交并查看' : '提交'

  return (
    <div className={publishMenuRootStyle} data-testid="publish-menu">
      <Button
        intent="primary"
        size={variant === 'full' ? 'md' : 'sm'}
        disabled={disabled}
        onClick={onPublish}
        className={
          variant === 'full'
            ? publishSplitPrimaryStyle
            : publishCompactPrimaryStyle
        }
        data-testid="publish-primary"
      >
        {primaryLabel}
      </Button>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          render={
            <Button
              intent="primary"
              size={variant === 'full' ? 'md' : 'sm'}
              aria-label="发布选项"
              className={
                variant === 'full'
                  ? publishSplitChevronStyle
                  : publishCompactChevronStyle
              }
              data-testid="publish-chevron"
            >
              <ChevronDown size={14} aria-hidden />
            </Button>
          }
        />
        <Popover.Portal>
          <Popover.Positioner align="end">
            <Popover.Popup padding="none">
              <div className={menuListStyle} role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className={menuItemStyle}
                  onClick={() => {
                    setOpen(false)
                    onPublish()
                  }}
                  disabled={disabled}
                >
                  仅存草稿
                </button>
                <div className={menuSeparatorStyle} aria-hidden />
                <button
                  type="button"
                  role="menuitem"
                  className={`${menuItemStyle} ${menuItemDangerStyle}`}
                  onClick={() => {
                    setOpen(false)
                    onDiscard()
                  }}
                  disabled={disabled}
                >
                  <Trash2 size={14} aria-hidden />
                  弃改
                </button>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
