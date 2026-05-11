import type { FC } from 'react'
import { History } from 'lucide-react'

import { formatRelative } from '~/components/post-detail/header/SaveIndicator'

import {
  chipStyle,
  containerStyle,
  linkStyle,
  metaStyle,
  sepStyle,
} from './RecoveryBanner.css'

export interface RecoveryBannerProps {
  lastEditedAt: string | null
  onUseDraft: () => void
  onUsePublished: () => void
}

export const RecoveryBanner: FC<RecoveryBannerProps> = ({
  lastEditedAt,
  onUseDraft,
  onUsePublished,
}) => (
  <div
    className={containerStyle}
    role="status"
    aria-live="polite"
    data-testid="recovery-banner"
  >
    <span className={chipStyle}>
      <History size={12} aria-hidden />
      草稿待处理
    </span>
    {lastEditedAt ? (
      <span className={metaStyle}>· {formatRelative(lastEditedAt)}</span>
    ) : null}
    <button
      type="button"
      className={linkStyle}
      onClick={onUseDraft}
      data-testid="recovery-banner-use-draft"
    >
      恢复草稿
    </button>
    <span className={sepStyle} aria-hidden>
      |
    </span>
    <button
      type="button"
      className={linkStyle}
      onClick={onUsePublished}
      data-testid="recovery-banner-use-published"
    >
      用已发布
    </button>
  </div>
)
