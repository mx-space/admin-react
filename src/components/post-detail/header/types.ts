import type { DraftModel, PostModel } from '~/models'

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error'

export type PostHeaderVariant = 'compact' | 'full'

export interface PostHeaderProps {
  post: PostModel | null
  draft: DraftModel | null
  variant: PostHeaderVariant
  saveStatus: AutosaveStatus
  lastSavedAt: string | null
  dirtyFieldCount: number
  onPublish: () => void
  onDiscard: () => void
  onDelete: () => void
  onCopyId?: () => void
  onCopyPath?: () => void
  onJumpToFullscreen?: () => void
  onBack?: () => void
  onOpenHistory?: () => void
  onOpenDiff?: () => void
  externalUrl?: string | null
}
