import { Tag } from '~/components/ui'

import type { PostHeaderVariant } from './types'

import { draftBadgeCompareBtnStyle } from './PostHeader.css'

export interface DraftBadgeProps {
  variant: PostHeaderVariant
  dirtyFieldCount: number
  onOpenDiff?: () => void
}

export const DraftBadge = ({
  variant,
  dirtyFieldCount,
  onOpenDiff,
}: DraftBadgeProps) => {
  if (dirtyFieldCount === 0) return null

  if (variant === 'compact') {
    return (
      <Tag tone="primary" size="sm" data-testid="draft-badge-compact">
        • 未提交
      </Tag>
    )
  }

  return (
    <Tag tone="primary" size="sm" data-testid="draft-badge-full">
      <span>{dirtyFieldCount} 项改动</span>
      {onOpenDiff ? (
        <button
          type="button"
          className={draftBadgeCompareBtnStyle}
          onClick={onOpenDiff}
        >
          比对
        </button>
      ) : null}
    </Tag>
  )
}
