import {
  ArrowLeft,
  ExternalLink,
  History,
  Maximize2,
  Trash2,
} from 'lucide-react'

import { ColumnHeader } from '~/components/ui'
import { iconButtonRecipe } from '~/components/ui/ColumnHeader/ColumnHeader.css'

import { DraftBadge } from './DraftBadge'
import { KebabMenu } from './KebabMenu'
import { externalLinkFullStyle } from './PostHeader.css'
import { Breadcrumb } from './parts/Breadcrumb'
import { PublishMenu } from './PublishMenu'
import { SaveIndicator } from './SaveIndicator'
import type { PostHeaderProps } from './types'

export type {
  AutosaveStatus,
  PostHeaderProps,
  PostHeaderVariant,
} from './types'

export const PostHeader = ({
  post,
  draft: _draft,
  variant,
  saveStatus,
  lastSavedAt,
  dirtyFieldCount,
  onPublish,
  onDiscard,
  onDelete,
  onCopyId,
  onCopyPath,
  onJumpToFullscreen,
  onBack,
  onOpenHistory,
  onOpenDiff,
  externalUrl,
}: PostHeaderProps) => {
  const iconSize = variant === 'compact' ? 'sm' : 'md'
  const isFull = variant === 'full'
  const title = post?.title ?? ''
  const publishDisabled = dirtyFieldCount === 0

  return (
    <ColumnHeader
      size={isFull ? 'spacious' : 'compact'}
      data-variant={variant}
      data-testid="post-header"
    >
      <ColumnHeader.Left>
        {isFull && onBack ? (
          <ColumnHeader.IconButton
            size={iconSize}
            onClick={onBack}
            aria-label="返"
            data-testid="back-btn"
          >
            <ArrowLeft size={16} aria-hidden />
          </ColumnHeader.IconButton>
        ) : null}
        {isFull ? <Breadcrumb title={title} /> : null}
        {isFull ? (
          <DraftBadge
            variant={variant}
            dirtyFieldCount={dirtyFieldCount}
            onOpenDiff={onOpenDiff}
          />
        ) : null}
      </ColumnHeader.Left>

      <ColumnHeader.Center>
        {!isFull ? (
          <DraftBadge
            variant={variant}
            dirtyFieldCount={dirtyFieldCount}
            onOpenDiff={onOpenDiff}
          />
        ) : null}
        <SaveIndicator
          variant={variant}
          status={saveStatus}
          lastSavedAt={lastSavedAt}
          onOpenHistory={onOpenHistory}
        />
      </ColumnHeader.Center>

      <ColumnHeader.Right>
        {externalUrl ? (
          isFull ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkFullStyle}
              data-testid="external-link"
            >
              <ExternalLink size={14} aria-hidden />
              在站点查看
            </a>
          ) : (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={iconButtonRecipe[iconSize]}
              aria-label="在站点查看"
              data-testid="external-link"
            >
              <ExternalLink size={16} aria-hidden />
            </a>
          )
        ) : null}

        {!isFull && onJumpToFullscreen ? (
          <ColumnHeader.IconButton
            size={iconSize}
            onClick={onJumpToFullscreen}
            aria-label="全屏编辑"
            data-testid="fullscreen-btn"
          >
            <Maximize2 size={16} aria-hidden />
          </ColumnHeader.IconButton>
        ) : null}

        {isFull && onOpenHistory ? (
          <ColumnHeader.IconButton
            size={iconSize}
            onClick={onOpenHistory}
            aria-label="历史"
            data-testid="history-btn"
          >
            <History size={16} aria-hidden />
          </ColumnHeader.IconButton>
        ) : null}

        {isFull ? (
          <ColumnHeader.IconButton
            size={iconSize}
            onClick={onDelete}
            aria-label="移至回收站"
            data-testid="delete-btn-inline"
          >
            <Trash2 size={16} aria-hidden />
          </ColumnHeader.IconButton>
        ) : null}

        <KebabMenu
          variant={variant}
          onCopyId={onCopyId}
          onCopyPath={onCopyPath}
          onOpenHistory={!isFull ? onOpenHistory : undefined}
          onDelete={onDelete}
        />

        <ColumnHeader.Divider />

        <PublishMenu
          variant={variant}
          disabled={publishDisabled}
          onPublish={onPublish}
          onDiscard={onDiscard}
        />
      </ColumnHeader.Right>
    </ColumnHeader>
  )
}
