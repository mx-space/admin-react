import type { AutosaveStatus, PostHeaderVariant } from './types'

import {
  saveDotRecipe,
  saveHistoryLinkStyle,
  saveIndicatorStyle,
} from './PostHeader.css'

export interface SaveIndicatorProps {
  variant: PostHeaderVariant
  status: AutosaveStatus
  lastSavedAt: string | null
  onOpenHistory?: () => void
}

const STATUS_LABEL: Record<Exclude<AutosaveStatus, 'idle'>, string> = {
  pending: '草稿保存中…',
  saving: '草稿保存中…',
  saved: '已存草稿',
  error: '保存失败',
}

export const SaveIndicator = ({
  variant,
  status,
  lastSavedAt,
  onOpenHistory,
}: SaveIndicatorProps) => {
  if (status === 'idle' && !lastSavedAt) return null

  const dotKey: keyof typeof saveDotRecipe =
    status === 'idle' ? 'saved' : status

  const baseLabel = status === 'idle' ? '已存草稿' : STATUS_LABEL[status]

  let text = baseLabel
  if (variant === 'full' && status === 'saved' && lastSavedAt) {
    text = `已存草稿于 ${formatRelative(lastSavedAt)}`
  } else if (variant === 'full' && status === 'idle' && lastSavedAt) {
    text = `已存草稿于 ${formatRelative(lastSavedAt)}`
  }

  return (
    <span
      className={saveIndicatorStyle}
      role="status"
      aria-live="polite"
      data-status={status}
    >
      <span className={saveDotRecipe[dotKey]} aria-hidden />
      <span>{text}</span>
      {variant === 'full' && onOpenHistory ? (
        <>
          <span aria-hidden> · </span>
          <button
            type="button"
            className={saveHistoryLinkStyle}
            onClick={onOpenHistory}
          >
            查史
          </button>
        </>
      ) : null}
    </span>
  )
}

export function formatRelative(iso: string): string {
  const ts = new Date(iso).getTime()
  if (Number.isNaN(ts)) return iso
  const diff = Date.now() - ts
  if (diff < 0) return '刚才'
  const sec = Math.floor(diff / 1000)
  if (sec < 5) return '刚才'
  if (sec < 60) return `${sec}s 前`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m 前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h 前`
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
