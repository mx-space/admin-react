import { BookOpen, Pin, ThumbsUp } from 'lucide-react'
import { memo, type MouseEvent } from 'react'

import type { PostModel } from '~/models'
import { iconSize } from '~/styles/tokens/typography'
import { cx } from '~/utils/cx'

import {
  rowBodyStyle,
  rowMetaCategoryStyle,
  rowMetaItemStyle,
  rowMetaLineStyle,
  rowMetaTimeStyle,
  rowPinSlotStyle,
  rowStyle,
  rowTitleLineStyle,
  rowTitleStyle,
  rowVariantStyle,
  statusDotStyle,
} from '../PostsView.css'

export interface PostRowProps {
  post: PostModel
  isActive: boolean
  isSelected: boolean
  onClick: (event: MouseEvent<HTMLDivElement>) => void
}

const formatRelative = (iso: string | null | undefined): string => {
  if (!iso) return ''
  const ms = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(ms)) return ''
  const min = Math.floor(ms / 60_000)
  if (min < 1) return '刚刚'
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d`
  const mon = Math.floor(day / 30)
  if (mon < 12) return `${mon}mo`
  return `${Math.floor(mon / 12)}y`
}

const formatCount = (n: number): string => {
  if (n < 1000) return String(n)
  if (n < 10_000) return `${(n / 1000).toFixed(1)}k`
  return `${Math.round(n / 1000)}k`
}

const variantClass = (active: boolean, selected: boolean): string => {
  if (active && selected) return rowVariantStyle.activeSelected
  if (selected) return rowVariantStyle.selected
  if (active) return rowVariantStyle.active
  return rowVariantStyle.default
}

export const PostRow = memo(function PostRow({
  post,
  isActive,
  isSelected,
  onClick,
}: PostRowProps) {
  const time = formatRelative(post.modifiedAt ?? post.createdAt)
  const tagsHead = post.tags?.slice(0, 3).join(' · ')
  const status = post.isPublished ?? true
  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-current={isActive ? 'true' : undefined}
      aria-label={`${post.title} · ${post.category?.name ?? ''} · ${
        status ? '已发布' : '草稿'
      }`}
      data-active={isActive || undefined}
      data-selected={isSelected || undefined}
      className={cx(rowStyle, variantClass(isActive, isSelected))}
      onClick={onClick}
    >
      <span className={rowPinSlotStyle} aria-hidden>
        {post.pinAt ? <Pin size={iconSize.sm} fill="currentColor" /> : null}
      </span>
      <div className={rowBodyStyle}>
        <div className={rowTitleLineStyle}>
          <span className={rowTitleStyle}>{post.title}</span>
          <span
            className={
              status ? statusDotStyle.published : statusDotStyle.draft
            }
            aria-label={status ? '已发布' : '草稿'}
            role="img"
          />
        </div>
        <div className={rowMetaLineStyle}>
          {post.category?.name && (
            <span className={cx(rowMetaItemStyle, rowMetaCategoryStyle)}>
              {post.category.name}
            </span>
          )}
          {tagsHead && <span className={rowMetaItemStyle}>{tagsHead}</span>}
          {post.readCount > 0 && (
            <span className={rowMetaItemStyle}>
              <BookOpen size={iconSize.sm} strokeWidth={1.75} aria-hidden />
              {formatCount(post.readCount)}
            </span>
          )}
          {post.likeCount > 0 && (
            <span className={rowMetaItemStyle}>
              <ThumbsUp size={iconSize.sm} strokeWidth={1.75} aria-hidden />
              {formatCount(post.likeCount)}
            </span>
          )}
          {time && <span className={rowMetaTimeStyle}>{time}</span>}
        </div>
      </div>
    </div>
  )
})
